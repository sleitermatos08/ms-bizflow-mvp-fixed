const KEY='msBizFlowDataV1';
let data=JSON.parse(localStorage.getItem(KEY)||'null')||{business:{name:'MS Multi Services LLC',address:'1940 Mineral Spring Ave, North Providence, RI 02904',state:'Rhode Island',taxYear:2026},transactions:[],mileage:[],clients:[],receipts:[]};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n)||0)}
function showTab(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));window.scrollTo(0,0)}
function openModal(id){const d=document.getElementById(id); if(d?.showModal)d.showModal()}
function render(){
 $('#businessName').textContent=data.business.name;
 const income=data.transactions.filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount),0), expense=data.transactions.filter(x=>x.type==='expense').reduce((s,x)=>s+Number(x.amount)*((Number(x.businessUse)||100)/100),0), miles=data.mileage.filter(x=>x.type==='business').reduce((s,x)=>s+Number(x.miles),0), tax=data.transactions.reduce((s,x)=>s+Number(x.salesTax||0),0);
 $('#incomeTotal').textContent=money(income);$('#expenseTotal').textContent=money(expense);$('#profitTotal').textContent=money(income-expense);$('#milesTotal').textContent=miles.toFixed(1);$('#taxIncome').textContent=money(income);$('#taxExpenses').textContent=money(expense);$('#taxProfit').textContent=money(income-expense);$('#salesTaxCollected').textContent=money(tax);
 const tx=[...data.transactions].sort((a,b)=>b.date.localeCompare(a.date));
 const html=tx.map(x=>`<div class="list-item"><div><strong>${x.description}</strong><div class="fineprint">${x.date} · ${x.category||x.client||''}</div></div><strong class="amount ${x.type}">${x.type==='expense'?'-':'+'}${money(x.amount)}</strong></div>`).join('');
 $('#transactionList').innerHTML=html||'No hay transacciones.'; $('#recentList').innerHTML=html?tx.slice(0,5).map(x=>`<div class="list-item"><div><strong>${x.description}</strong><div class="fineprint">${x.date}</div></div><strong class="amount ${x.type}">${x.type==='expense'?'-':'+'}${money(x.amount)}</strong></div>`).join(''):'Aún no hay movimientos registrados.';
 $('#mileageList').innerHTML=data.mileage.map(x=>`<div class="list-item"><div><strong>${x.miles} millas · ${x.purpose}</strong><div class="fineprint">${x.date} · ${x.type==='business'?'Negocio':'Personal'}</div></div></div>`).join('')||'No hay viajes registrados.';
 $('#clientList').innerHTML=data.clients.map(x=>`<div class="list-item"><div><strong>${x.name}</strong><div class="fineprint">${x.phone||''} ${x.email||''}</div></div></div>`).join('')||'Aún no has agregado clientes.';
}
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('quickModal')?.close();showTab(b.dataset.tab)}));
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('quickModal')?.close();openModal(b.dataset.open)}));
$('#navPlus').onclick=()=>openModal('quickModal'); $('#settingsBtn').onclick=()=>showTab('mas'); $('#addTxnBtn').onclick=()=>openModal('quickModal'); $('#addClientBtn').onclick=()=>openModal('clientModal');
$$('.close-dialog').forEach(b=>b.onclick=()=>b.closest('dialog').close());
function txnSubmit(form,type){form.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(form));data.transactions.push({...f,type,amount:Number(f.amount),salesTax:Number(f.salesTax||0),businessUse:Number(f.businessUse||100),id:crypto.randomUUID?.()||Date.now()});save();form.reset();form.closest('dialog').close();showTab('transacciones')})}
txnSubmit($('#expenseForm'),'expense');txnSubmit($('#incomeForm'),'income');
$('#clientForm').addEventListener('submit',e=>{e.preventDefault();data.clients.push(Object.fromEntries(new FormData(e.target)));save();e.target.reset();e.target.closest('dialog').close()});
$('#manualMileageForm').addEventListener('submit',e=>{e.preventDefault();let f=Object.fromEntries(new FormData(e.target));f.miles=Number(f.miles);data.mileage.push(f);save();e.target.reset()});
$('#receiptForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target),file=fd.get('file');data.receipts.push({name:file?.name||'archivo',description:fd.get('description'),date:new Date().toISOString()});save();e.target.reset();e.target.closest('dialog').close();alert('Recibo registrado. En esta versión de prueba no se sube a la nube.')});
$('#businessForm').addEventListener('submit',e=>{e.preventDefault();data.business={...data.business,...Object.fromEntries(new FormData(e.target))};save();alert('Empresa guardada')});
$('#backupBtn').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='ms-bizflow-backup.json';a.click()};
$('#restoreInput').onchange=async e=>{try{data=JSON.parse(await e.target.files[0].text());save();alert('Copia importada')}catch{alert('Archivo inválido')}};
$('#resetBtn').onclick=()=>{if(confirm('¿Borrar todos los datos locales de MS BizFlow?')){localStorage.removeItem(KEY);location.reload()}};
$('#exportBtn').onclick=()=>{const rows=[['tipo','fecha','descripcion','monto'],...data.transactions.map(x=>[x.type,x.date,x.description,x.amount])];const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='ms-bizflow-transacciones.csv';a.click()};
let tripStart=null,timer=null;$('#startTripBtn').onclick=()=>{tripStart=Date.now();$('#startTripBtn').classList.add('hidden');$('#stopTripBtn').classList.remove('hidden');$('#tripStatus').textContent='Viaje activo';timer=setInterval(()=>{let s=Math.floor((Date.now()-tripStart)/1000),h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor(s%3600/60)).padStart(2,'0'),ss=String(s%60).padStart(2,'0');$('#liveTimer').textContent=`${h}:${m}:${ss}`},1000)};
$('#stopTripBtn').onclick=()=>{clearInterval(timer);const miles=prompt('¿Cuántas millas recorriste?');if(miles!==null&&Number(miles)>=0)data.mileage.push({date:new Date().toISOString().slice(0,10),miles:Number(miles),type:'business',purpose:'Viaje registrado',notes:''});tripStart=null;$('#liveTimer').textContent='00:00:00';$('#tripStatus').textContent='No hay viaje activo';$('#startTripBtn').classList.remove('hidden');$('#stopTripBtn').classList.add('hidden');save()};
const today=new Date().toISOString().slice(0,10);$$('input[type=date]').forEach(i=>i.value=today);render();
