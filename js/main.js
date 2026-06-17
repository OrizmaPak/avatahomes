if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => registrations.forEach(registration => registration.unregister()))
      .catch(err => console.error('SW Unregistration Failed', err));
}
  
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn')?.style.setProperty('display', 'block');
});
   
document.getElementById('installBtn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response to install:', outcome);
    deferredPrompt = null;
    document.getElementById('installBtn')?.style.setProperty('display', 'none');
});
  
 
