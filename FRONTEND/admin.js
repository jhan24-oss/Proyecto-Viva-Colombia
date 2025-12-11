const API_BASE = '/api';
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const tableContainer = document.getElementById('table-container');

function setLoading(on){ loadingEl.style.display = on ? 'block' : 'none'; }
function showError(msg){ errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
function clearError(){ errorEl.textContent = ''; errorEl.classList.add('hidden'); }

async function fetchJson(path){
  clearError();
  setLoading(true);
  try{
    const res = await fetch(API_BASE + path);
    if(!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    setLoading(false);
    return data;
  }catch(e){ setLoading(false); showError(e.message); throw e; }
}

function renderTable(columns, rows){
  if(!rows || rows.length === 0){ tableContainer.innerHTML = '<div>No hay registros.</div>'; return; }
  const th = columns.map(c => `<th>${c}</th>`).join('');
  const trs = rows.map(r => `<tr>${columns.map(c => `<td>${escapeHtml((r[c]!==undefined && r[c]!==null)?r[c]:'')}</td>`).join('')}</tr>`).join('');
  tableContainer.innerHTML = `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

function escapeHtml(s){ return String(s)
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;')
  .replace(/'/g,'&#39;'); }

async function loadUsuarios(){
  const data = await fetchJson('/usuarios');
  if(data && data.usuarios) renderTable(['id','nombre','email','estado','fecha_creacion'], data.usuarios);
}
async function loadDestinos(){
  const data = await fetchJson('/reservas/destinos');
  if(data && data.reservas) renderTable(Object.keys(data.reservas[0]||{}), data.reservas);
}
async function loadAlojamientos(){
  const data = await fetchJson('/reservas/alojamientos');
  if(data && data.reservas) renderTable(Object.keys(data.reservas[0]||{}), data.reservas);
}
async function loadContactos(){
  const data = await fetchJson('/contact');
  if(data && data.contactos) renderTable(['id','nombre','email','telefono','asunto','mensaje','created_at'], data.contactos);
}

// tab handling
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(btn => btn.addEventListener('click', async (e)=>{
  tabs.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  tableContainer.innerHTML = '';
  const view = btn.dataset.view;
  try{
    if(view === 'usuarios') await loadUsuarios();
    if(view === 'destinos') await loadDestinos();
    if(view === 'alojamientos') await loadAlojamientos();
    if(view === 'contactos') await loadContactos();
  }catch(e){ console.error(e); }
}));

// initial load
document.addEventListener('DOMContentLoaded', ()=>{
  // trigger initial users load
  document.querySelector('.tabs button[data-view="usuarios"]').click();
});
