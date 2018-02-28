const {readFileSync, writeFileSync} = require('fs');

const cfg = require('js-yaml').load(readFileSync('./node_modules/svgo/.svgo.yml', 'utf-8'));

const con = `
${cfg.plugins.map(pl => `import ${pl} from 'svgo/plugins/${pl}';\n`).join('')}

const plugins = [
${cfg.plugins.map(pl => `  ['${pl}', ${pl}],\n`).join('')}
];
`;

const updated = readFileSync('index.js', 'utf-8').replace(/(\/\/ svg-plugins \{\{\{\n)[\w\W]*?(\/\/ svg-plugins \}\}\})/, (m, p, s) => `${p}${con}${s}`);

// console.log(updated);
writeFileSync('index.js', updated);

console.log('done');
