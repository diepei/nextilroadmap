'use strict';
const fmt = n => n === null ? 'No publicado' : new Intl.NumberFormat('es-ES', {maximumFractionDigits: 2}).format(n);
const escapeHTML = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let plan;
const measurement = [
 'Anual · ejercicio 2030','Anual · ejercicio 2030','Tasa anual compuesta · 2026–2030','Tasa anual compuesta · 2026–2030',
 'Acumulado · 2026–2030','Límite · durante todo el plan','Acumulado · 2026–2030',
 'Incremento desde cierre 1S 2026','Recompras · 2028–2030','Por acción · ejercicio 2030'
];
function renderSnapshot(){
 const r=plan.report;
 document.getElementById('results-snapshot').innerHTML=`<div class="results-grid"><article class="result-card"><span>Ventas · 1S 2026</span><strong>${fmt(r.normalized.sales)} <small>M€</small></strong><span>Normalizadas</span><div class="result-compare"><span>Perímetro comparable</span><b>${fmt(r.comparable.sales)} M€</b><span>Meta anual 2026</span><b>${fmt(plan.years[0].sales)} M€</b></div></article><article class="result-card"><span>EBITDA · 1S 2026</span><strong>${fmt(r.normalized.ebitda)} <small>M€</small></strong><span>Normalizado</span><div class="result-compare"><span>Perímetro comparable</span><b>${fmt(r.comparable.ebitda)} M€</b><span>Meta anual 2026</span><b>${fmt(plan.years[0].ebitda)} M€</b></div></article><article class="result-card result-good"><span>Deuda neta / EBITDA</span><strong>${fmt(r.leverage)}<small>x</small></strong><span>Al cierre de junio</span><div class="result-compare"><span>Límite del plan</span><b>&lt;2,5x</b><span>Deuda neta</span><b>${fmt(r.debt)} M€</b></div><span class="result-state">Dentro del límite al cierre</span></article></div>`;
}
function renderYear(year, focus = false) {
 const y = plan.years.find(item => item.year === year);
 document.querySelectorAll('[role="tab"]').forEach(button => {const selected = Number(button.dataset.year) === year;button.setAttribute('aria-selected', String(selected));button.tabIndex = selected ? 0 : -1;if(selected && focus)button.focus();});
 document.getElementById("selected-year").textContent = String(year);
 document.getElementById('year-controls').querySelector('[data-step="-1"]').disabled = year === 2026;
 document.getElementById('year-controls').querySelector('[data-step="1"]').disabled = year === 2030;
 const metrics = [['Ventas del año',y.sales],['EBITDA del año',y.ebitda],['Inversión del año ≈',y.investment]].map(([label,n])=>`<div><small>${label}</small><strong class="${n===null?'unpublished':''}">${fmt(n)}${n===null?'':'<span> M€</span>'}</strong></div>`).join('');
 const updates = plan.updates.filter(update => update.year === year);
 const financialContext = y.sales === null
  ? 'Sin desglose de ventas ni EBITDA por hub publicado para este año. No se han interpolado cifras.'
  : `Ventas previstas: Europa ${fmt(y.euSales)} M€ y América ${fmt(y.usSales)} M€. EBITDA previsto: Europa ${fmt(y.euEbitda)} M€ y América ${fmt(y.usEbitda)} M€.`;
 const debtContext = `DFN / EBITDA previsto: ${y.ratio === null ? 'no publicado' : fmt(y.ratio)+'x'}. Deuda neta prevista: ${y.debt === null ? 'no publicada' : '≈'+fmt(y.debt)+' M€'}. Límite del plan: <2,5x.`;
 const forecastContext = `Previsiones normalizadas.${year === 2030 ? ' Cifras aproximadas para 2030.' : ''} ${year === 2026 ? `1S 2026: ${fmt(plan.report.normalized.sales)} M€ de ventas y ${fmt(plan.report.normalized.ebitda)} M€ de EBITDA normalizados.` : 'Sin resultados de este ejercicio incorporados.'}`;
 const financialDetails = `<article class="event"><h4>Datos financieros</h4><p>${financialContext} ${debtContext} ${forecastContext}</p></article>`;
 const panel = document.getElementById('year-panel');panel.setAttribute('aria-labelledby',`tab-${year}`);
 panel.innerHTML = `<div class="year-panel"><div class="year-financial"><div class="year-top"><div><span class="year-context">OBJETIVOS ${year}</span><h3>${y.title}</h3></div><span class="pill">Metas anuales</span></div><div class="annual-metrics">${metrics}</div></div><div class="year-events"><h3 class="column-heading">Qué sabemos ahora</h3>${financialDetails}<p class="update-date">Contexto del plan</p>${y.items.map(([title,body])=>`<article class="event"><h4>${title}</h4><p>${body}</p></article>`).join('')}${updates.length ? `<div class="reported-updates"><p class="update-date">Informe publicado · 30 sep 2026</p>${updates.map(update=>`<article><h4>${update.title}</h4><p>${update.body}</p></article>`).join('')}</div>` : ''}</div></div>`;
}
function showDetail(index){
 const item=plan.objectives[index], evidence=plan.tracking[index];
 document.getElementById('detail-title').textContent=item[0];
 document.getElementById('detail-value').textContent=item[1];
 document.getElementById('detail-text').textContent=measurement[index]+'. '+item[4];
 document.getElementById('detail-status').textContent=evidence.status;
 document.getElementById('detail-evidence').textContent=evidence.note;
 document.getElementById('detail-dialog').showModal();
}
async function init(){try{const response=await fetch('data.json');if(!response.ok)throw new Error('Datos no disponibles');plan=await response.json();
 document.getElementById('year-tabs').innerHTML=plan.years.map(y=>`<button role="tab" id="tab-${y.year}" aria-controls="year-panel" aria-selected="false" tabindex="-1" data-year="${y.year}"><span class="timeline-context">${y.year===2026?'Último informe: 1S':y.year===2030?'Meta final':'Previsión'}</span><strong>${y.year}</strong><span class="timeline-title">${y.title}</span><span class="timeline-number">${y.sales===null?'Ventas no publicadas':fmt(y.sales)+' M€ ventas'}</span></button>`).join('');
 document.getElementById('year-tabs').addEventListener('click',event=>{const button=event.target.closest('button');if(button)renderYear(Number(button.dataset.year));});
 document.getElementById('year-tabs').addEventListener('keydown',event=>{const keys=['ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(event.key))return;const current=plan.years.findIndex(y=>String(y.year)===event.target.dataset.year);if(current<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?4:(current+(event.key==='ArrowRight'?1:4))%5;renderYear(plan.years[next].year,true);});
 document.getElementById('objectives-body').innerHTML=plan.objectives.map((o,i)=>{const t=plan.tracking[i];return `<tr><td data-label="Objetivo">${o[0]}</td><td data-label="Meta del plan">${escapeHTML(o[1])}</td><td data-label="Cómo se mide">${measurement[i]}</td><td data-label="Último dato · 1S 2026" class="latest-cell">${escapeHTML(t.value)}</td><td data-label="Estado"><span class="status ${t.tone}">${t.status}</span></td><td class="detail-cell"><button data-detail="${i}" aria-label="Ver detalle: ${o[0]}">Ver detalle</button></td></tr>`}).join('');
 document.getElementById('objectives-body').addEventListener('click',event=>{const button=event.target.closest('button[data-detail]');if(button)showDetail(Number(button.dataset.detail));});
 document.getElementById('pillars').innerHTML=plan.pillars.map((p,i)=>`<details class="pillar" ${i===0?'open':''}><summary><span class="place">${p.place}</span><h3>${p.name}</h3><p class="goal">${p.goal}</p><span class="expand-label">Ver iniciativas</span></summary><div class="pillar-content">${p.cagr?`<div class="hub-numbers"><div><strong>${p.cagr}</strong><span>CAGR orgánico</span></div><div><strong>≈${p.sales}</strong><span>Ventas 2030 · M€</span></div><div><strong>≈${p.ebitda}</strong><span>EBITDA 2030 · M€</span></div></div>`:'<p class="pill">Greendyes® · Circularidad · Trazabilidad</p>'}<ul>${p.items.map(item=>`<li>${item}</li>`).join('')}</ul><div class="pillar-update"><span class="eyebrow">AVANCE PUBLICADO</span><p>${p.update.text}</p></div></div></details>`).join('');
 renderSnapshot();
 document.getElementById("year-controls").addEventListener("click",event=>{const b=event.target.closest("button[data-step]");if(!b)return;const current=Number(document.getElementById("selected-year").textContent);renderYear(Math.min(2030,Math.max(2026,current+Number(b.dataset.step))),true);});
 renderYear(2026);
 }catch(error){document.getElementById('year-panel').innerHTML='<p role="alert">No se han podido cargar los datos del plan. Recarga la página o consulta el PDF original.</p>';console.error(error);}}
const dialog=document.getElementById('detail-dialog');dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
init();
