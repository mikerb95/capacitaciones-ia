import { parse } from 'node-html-parser';

const html = `<!doctype html><html><head><title>Mi Deck</title><style>section{color:red}</style></head>
<body>
<section><h2>Uno</h2><div class="notes">nota uno</div><section><h3>Anidada</h3></section></section>
<section><h2>Dos</h2></section>
</body></html>`;

const root = parse(html, { lowerCaseTagName: false, comment: false, blockTextElements: { script:false, noscript:false, style:true, pre:true } });
const all = root.querySelectorAll('section');
console.log('total sections:', all.length);
const top = all.filter(n => !n.closest('section section'));
console.log('top-level after filter:', top.length);
top.forEach(n => console.log('  ->', n.querySelector('h1, h2, h3')?.innerText));
console.log('title:', root.querySelector('title')?.innerText);
