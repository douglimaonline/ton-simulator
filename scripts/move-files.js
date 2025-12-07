const fs = require('fs');
const path = require('path');

const browserPath = path.join(__dirname, '..', 'dist', 'ton-simulator', 'browser');
const docsPath = path.join(__dirname, '..', 'docs');
const distPath = path.join(__dirname, '..', 'dist');

if (fs.existsSync(browserPath)) {
    console.log('Movendo arquivos da pasta browser para docs...');
    
    const files = fs.readdirSync(browserPath);
    files.forEach(file => {
        const src = path.join(browserPath, file);
        const dest = path.join(docsPath, file);
        fs.renameSync(src, dest);
    });
    
    console.log('Deletando pasta dist...');
    fs.rmSync(distPath, { recursive: true, force: true });
    
    console.log('Build finalizado com sucesso!');
} else {
    console.log('Pasta browser não encontrada!');
}