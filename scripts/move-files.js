const fs = require('fs');
const path = require('path');

const browserPath = path.join(__dirname, '..', 'dist', 'ton-simulator', 'browser');
const docsPath = path.join(__dirname, '..', 'docs');
const distPath = path.join(__dirname, '..', 'dist');

if (fs.existsSync(browserPath)) {
    console.log('Moving files from browser folder to docs...');
    
    const files = fs.readdirSync(browserPath);
    files.forEach(file => {
        const src = path.join(browserPath, file);
        const dest = path.join(docsPath, file);
        fs.renameSync(src, dest);
    });
    
    console.log('Deleting dist folder...');
    fs.rmSync(distPath, { recursive: true, force: true });
    
    console.log('Build completed successfully!');
} else {
    console.log('Browser folder not found!');
}