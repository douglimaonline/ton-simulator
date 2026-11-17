/**
 * Updates the backup of the "Plans" collection in the "Plans Backup"
 * Firestore collection.
 *
 * Exact copy: each source document is written to the target with the same ID
 * and the same content (ids are not renumbered), and documents that exist
 * only in the target are deleted. Afterwards the target matches the source.
 * The source is only read, never modified.
 *
 * Before writing, the current target content is saved to
 * backups/<target>-<timestamp>.json.
 *
 * Usage:
 *   node --env-file=.env scripts/backup-plans.mjs              # update the backup
 *   node --env-file=.env scripts/backup-plans.mjs --dry-run    # only show what would change
 *
 * Source/target can be changed (default: Plans -> Plans Backup):
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
if (SOURCE === TARGET) throw new Error('Source and target are the same.');
const DRY_RUN = process.argv.includes('--dry-run');
/** Firestore allows at most 500 operations per batch. */
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
  console.error(`"${SOURCE}" is empty — backup not updated.`);
  process.exit(1);
}

const srcIds = new Set(src.docs.map((d) => d.id));
const dstById = new Map(dst.docs.map((d) => [d.id, d.data()]));
/** JSON with sorted keys: Firestore does not guarantee field order. */
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
  ops.push({ type: old ? 'update' : 'create', id: d.id, data: d.data() });
}
for (const id of dstById.keys())
  if (!srcIds.has(id)) ops.push({ type: 'delete', id });

const count = (t) => ops.filter((o) => o.type === t).length;
console.log(
  `"${SOURCE}" (${src.size} docs) -> "${TARGET}" (${dst.size} docs)${DRY_RUN ? ' — dry-run' : ''}`
);
console.log(
  `create: ${count('create')} | update: ${count('update')} | delete: ${count('delete')} | unchanged: ${unchanged}`
);
for (const o of ops)
  console.log(`  ${o.type.padEnd(9)} ${o.id}${o.data ? `  ${o.data.title}` : ''}`);

if (DRY_RUN || ops.length === 0) {
  console.log(ops.length === 0 ? 'Target is already up to date.' : 'Nothing written (dry-run).');
  process.exit(0);
}

if (dst.size > 0) {
  mkdirSync('backups', { recursive: true });
  const file = `backups/${TARGET.replace(/\s+/g, '-')}-${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}.json`;
  writeFileSync(file, JSON.stringify(Object.fromEntries(dstById), null, 2));
  console.log(`Previous content of "${TARGET}" saved to ${file}`);
}

for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
  const batch = writeBatch(db);
  for (const o of ops.slice(i, i + BATCH_LIMIT)) {
    const ref = doc(db, TARGET, o.id);
    if (o.type === 'delete') batch.delete(ref);
    else batch.set(ref, o.data);
  }
  await batch.commit();
}
console.log(`"${TARGET}" updated.`);
process.exit(0);
