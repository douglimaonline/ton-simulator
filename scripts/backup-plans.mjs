/**
 * Atualiza o backup da coleção "Plans" na coleção "Plans Backup" do Firestore.
 *
 * Cópia exata: cada documento da origem é gravado no destino com o mesmo ID e
 * o mesmo conteúdo (sem renumerar ids), e documentos que existem apenas no
 * destino são apagados. Ao final, o destino fica idêntico à origem.
 * A origem só é lida, nunca alterada.
 *
 * Antes de gravar, o conteúdo atual do destino é salvo em
 * backups/<destino>-<timestamp>.json.
 *
 * Uso:
 *   node --env-file=.env scripts/backup-plans.mjs              # atualiza o backup
 *   node --env-file=.env scripts/backup-plans.mjs --dry-run    # só mostra o que faria
 *
 * Origem/destino podem ser trocados (padrão: Plans -> Plans Backup):
 *   node --env-file=.env scripts/backup-plans.mjs --from="Plans test" --to=Plans
 */
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { mkdirSync, writeFileSync } from 'node:fs';

const arg = (name) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const SOURCE = arg('from') ?? 'Plans';
const TARGET = arg('to') ?? 'Plans Backup';
if (SOURCE === TARGET) throw new Error('Origem e destino iguais.');
const DRY_RUN = process.argv.includes('--dry-run');
/** Limite do Firestore é 500 operações por batch. */
const BATCH_LIMIT = 400;

const env = process.env;
const app = initializeApp({
  apiKey: env.NG_APP_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NG_APP_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NG_APP_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NG_APP_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NG_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NG_APP_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const [src, dst] = await Promise.all([
  getDocs(collection(db, SOURCE)),
  getDocs(collection(db, TARGET)),
]);

if (src.empty) {
  console.error(`"${SOURCE}" está vazia — backup não atualizado.`);
  process.exit(1);
}

const srcIds = new Set(src.docs.map((d) => d.id));
const dstById = new Map(dst.docs.map((d) => [d.id, d.data()]));
/** JSON com chaves ordenadas: o Firestore não garante a ordem dos campos. */
const stable = (v) =>
  JSON.stringify(v, (_, x) =>
    x && typeof x === 'object' && !Array.isArray(x)
      ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b)))
      : x
  );
const same = (a, b) => stable(a) === stable(b);
const byId = (a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id);

const ops = [];
let unchanged = 0;
for (const d of [...src.docs].sort(byId)) {
  const old = dstById.get(d.id);
  if (old && same(old, d.data())) {
    unchanged++;
    continue;
  }
  ops.push({ type: old ? 'atualizar' : 'criar', id: d.id, data: d.data() });
}
for (const id of dstById.keys())
  if (!srcIds.has(id)) ops.push({ type: 'apagar', id });

const count = (t) => ops.filter((o) => o.type === t).length;
console.log(
  `"${SOURCE}" (${src.size} docs) -> "${TARGET}" (${dst.size} docs)${DRY_RUN ? ' — dry-run' : ''}`
);
console.log(
  `criar: ${count('criar')} | atualizar: ${count('atualizar')} | apagar: ${count('apagar')} | sem mudança: ${unchanged}`
);
for (const o of ops)
  console.log(`  ${o.type.padEnd(9)} ${o.id}${o.data ? `  ${o.data.title}` : ''}`);

if (DRY_RUN || ops.length === 0) {
  console.log(ops.length === 0 ? 'Backup já está atualizado.' : 'Nada gravado (dry-run).');
  process.exit(0);
}

if (dst.size > 0) {
  mkdirSync('backups', { recursive: true });
  const file = `backups/${TARGET.replace(/\s+/g, '-')}-${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}.json`;
  writeFileSync(file, JSON.stringify(Object.fromEntries(dstById), null, 2));
  console.log(`Conteúdo anterior de "${TARGET}" salvo em ${file}`);
}

for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
  const batch = writeBatch(db);
  for (const o of ops.slice(i, i + BATCH_LIMIT)) {
    const ref = doc(db, TARGET, o.id);
    if (o.type === 'apagar') batch.delete(ref);
    else batch.set(ref, o.data);
  }
  await batch.commit();
}
console.log('Backup atualizado.');
process.exit(0);
