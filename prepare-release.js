const fs = require('fs');
const path = require('path');

console.log('📦 Preparando release para jsDelivr CDN...\n');

// Verificar que existe el directorio dist/browser
const distBrowserPath = path.join(__dirname, 'dist', 'browser');

if (!fs.existsSync(distBrowserPath)) {
    console.error('❌ Error: No se encuentra la carpeta dist/browser');
    console.error('   Ejecuta primero: npm run build:prod');
    process.exit(1);
}

// Leer archivos del dist/browser
const files = fs.readdirSync(distBrowserPath);

if (files.length === 0) {
    console.error('❌ Error: La carpeta dist/browser está vacía');
    process.exit(1);
}

console.log('✅ Archivos generados en dist/browser:');
files.forEach(file => {
    const filePath = path.join(distBrowserPath, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`   📄 ${file} (${size} KB)`);
});

// Leer package.json para obtener la versión
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = packageJson.version;

console.log('\n📋 Información del release:');
console.log(`   Versión: v${version}`);
console.log(`   Archivos: ${files.length}`);

console.log('\n🚀 Pasos siguientes para publicar en jsDelivr:\n');
console.log('1️⃣  Agregar cambios:');
console.log('   git add .');
console.log('');
console.log('2️⃣  Hacer commit:');
console.log(`   git commit -m "Release v${version}"`);
console.log('');
console.log('3️⃣  Crear tag de versión:');
console.log(`   git tag v${version}`);
console.log('');
console.log('4️⃣  Subir a GitHub con tags:');
console.log('   git push origin main --tags');
console.log('');
console.log('5️⃣  Esperar ~5 minutos para que jsDelivr actualice');
console.log('');
console.log('📍 Tu widget estará disponible en:');
console.log(`   https://cdn.jsdelivr.net/gh/TU-USUARIO/lappiz-chat-widget@v${version}/dist/browser/main.js`);
console.log('   https://cdn.jsdelivr.net/gh/TU-USUARIO/lappiz-chat-widget@latest/dist/browser/main.js');
console.log('');
console.log('✅ Release preparado exitosamente!\n');
