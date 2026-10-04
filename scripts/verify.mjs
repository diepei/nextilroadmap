import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('dist/data.json','utf8'));
assert.equal(data.years.length,5);assert.equal(data.years.reduce((s,y)=>s+y.investment,0),250);
assert.equal(data.years[4].sales,750);assert.equal(data.years[4].ebitda,150);
for(const year of data.years.slice(2,4)){assert.equal(year.sales,null);assert.equal(year.ebitda,null);}
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',dataset:{},setAttribute(k,v){this[k]=v},addEventListener(){},querySelector(){return element(id+'-child')},showModal(){this.open=true},close(){this.open=false},focus(){this.focused=true}});return elements.get(id)}
const tabs=data.years.map(y=>{const e=element('tab-'+y.year);e.dataset.year=String(y.year);return e});
const context=vm.createContext({Intl,console,fetch:async()=>({ok:true,json:async()=>data}),document:{getElementById:element,querySelectorAll:()=>tabs}});
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
await new Promise(resolve=>setTimeout(resolve,20));
assert.match(element('year-panel').innerHTML,/118/);
for(const y of data.years){vm.runInContext(`renderYear(${y.year},true)`,context);assert.equal(tabs.filter(t=>t['aria-selected']==='true').length,1);assert.equal(element('year-panel')['aria-labelledby'],'tab-'+y.year);assert.ok(element('year-panel').innerHTML.includes(y.title));assert.ok(!element('year-panel').innerHTML.includes('NaN'));}
for(let i=0;i<data.objectives.length;i++){vm.runInContext(`showDetail(${i})`,context);assert.equal(element('detail-title').textContent,data.objectives[i][0]);assert.ok(element('detail-dialog').open);}
const html=fs.readFileSync('dist/index.html','utf8');
for(const match of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)){const ref=match[1].split('#')[0];if(!ref.startsWith('data:'))assert.ok(fs.existsSync('dist/'+ref),ref);}
assert.equal((element('objectives-body').innerHTML.match(/<tr>/g)||[]).length,10);
console.log('PASS: 5 años, 10 detalles de objetivos, selección accesible, cifras clave, ausencia de interpolación y archivos enlazados.');
