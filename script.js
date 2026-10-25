const products = [
  {name:'Proyektor',stock:5,image:'assets/img-034.jpg'},
  {name:'Laptop',stock:10,image:'assets/img-032.jpg'},
  {name:'Speaker',stock:8,image:'assets/img-044.jpg'},
  {name:'Kabel',stock:4,image:'assets/img-016.jpg'},
  {name:'Mikrofon',stock:6,image:'assets/img-030.jpg'}
];
const grid=document.getElementById('productGrid');
const itemSelect=document.getElementById('barangDipinjam');
let lastRequest=null; let requestCounter=1;
function renderProducts(filter=''){
  grid.innerHTML='';
  products.filter(p=>p.name.toLowerCase().includes(filter.toLowerCase())).forEach(p=>{
    const card=document.createElement('article');card.className='product-card';
    card.innerHTML=`<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p>Stok: ${p.stock}</p><button class="btn" type="button" data-product="${p.name}">Pinjam</button>`;
    grid.appendChild(card);
  });
}
products.forEach(p=>itemSelect.add(new Option(p.name,p.name)));
renderProducts();
document.getElementById('search').addEventListener('input',e=>renderProducts(e.target.value));
grid.addEventListener('click',e=>{const btn=e.target.closest('[data-product]');if(!btn)return;itemSelect.value=btn.dataset.product;location.hash='#form';});
const loanForm=document.getElementById('loanForm');
loanForm.addEventListener('submit',e=>{
  e.preventDefault();
  const start=document.getElementById('tanggalPinjam').value,end=document.getElementById('tanggalKembali').value;
  if(end<start){alert('Tanggal pengembalian tidak boleh sebelum tanggal peminjaman.');return;}
  const number=`PB-${new Date().getFullYear()}-${String(requestCounter++).padStart(3,'0')}`;
  lastRequest={number,nama:document.getElementById('nama').value,barang:itemSelect.value,tanggalPinjam:start,tanggalKembali:end,keperluan:document.getElementById('keperluan').value,status:'Menunggu Konfirmasi'};
  document.getElementById('successNumber').textContent=number;
  document.getElementById('success').hidden=false;document.getElementById('success').scrollIntoView({behavior:'smooth'});
  document.getElementById('nomorPermohonan').value=number;
});
document.getElementById('statusForm').addEventListener('submit',e=>{
  e.preventDefault();const val=document.getElementById('nomorPermohonan').value.trim();const result=document.getElementById('statusResult');
  if(!val){result.innerHTML='<p>Masukkan nomor permohonan terlebih dahulu</p>';return;}
  if(lastRequest&&val.toLowerCase()===lastRequest.number.toLowerCase()){
    const r=lastRequest;const dateFmt=s=>s?new Date(s+'T00:00:00').toLocaleDateString('id-ID'): '-';
    result.innerHTML=`<div class="detail-card"><h3>Detail Permohonan</h3><div class="detail-row"><strong>Nama:</strong><span>${escapeHTML(r.nama)}</span></div><div class="detail-row"><strong>Barang:</strong><span>${escapeHTML(r.barang)}</span></div><div class="detail-row"><strong>Tanggal Peminjaman:</strong><span>${dateFmt(r.tanggalPinjam)}</span></div><div class="detail-row"><strong>Tanggal Pengembalian:</strong><span>${dateFmt(r.tanggalKembali)}</span></div><div class="detail-row"><strong>Keperluan:</strong><span>${escapeHTML(r.keperluan)}</span></div><span class="badge">${r.status}</span></div>`;
  }else{result.innerHTML='<p>Nomor permohonan tidak ditemukan.</p><small>Periksa kembali nomor permohonan yang dimasukkan.</small>';}
});
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
