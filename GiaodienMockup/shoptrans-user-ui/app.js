function showToast(text){
  const t=document.createElement('div');
  t.textContent=text;
  t.style.cssText='position:fixed;right:24px;bottom:24px;background:#0f1b3d;color:#fff;padding:14px 18px;border-radius:14px;box-shadow:0 18px 50px rgba(15,27,61,.2);font-weight:800;z-index:99';
  document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-toast]');
  if(btn) showToast(btn.dataset.toast);
});
