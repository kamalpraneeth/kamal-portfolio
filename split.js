const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>', styleStart) + 8;
const scriptStart = content.indexOf('<script>', 38000);
const scriptEnd = content.indexOf('</script>', scriptStart) + 9;

const css = content.slice(styleStart + 7, styleEnd - 8);
const js = content.slice(scriptStart + 8, scriptEnd - 9);

if(!fs.existsSync('css')) fs.mkdirSync('css');
if(!fs.existsSync('js')) fs.mkdirSync('js');

fs.writeFileSync('css/style.css', css.trim());
fs.writeFileSync('js/app.js', js.trim());
fs.writeFileSync('js/three-scene.js', '// Three.js Scene Initialization\n');

content = content.slice(0, styleStart) + '<link rel="stylesheet" href="css/style.css">' + content.slice(styleEnd, scriptStart) + '<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>\n<script type="module" src="js/three-scene.js"></script>\n<script type="module" src="js/app.js"></script>' + content.slice(scriptEnd);

fs.writeFileSync('index.html', content);
console.log('Successfully modularized project');
