// Plain (non-Babel) script, runs in <head> before first paint. Canon's gs-* rules sit in an inline <style> in
// canon/index.html, so a rig outside canon cannot link them. Fetch canon's own index.html (the URL resolves against
// <base>) and inject every <style> block. Nothing is copied into the rig, so a canon export updates the rig for free.
(function () {
  try {
    var x = new XMLHttpRequest();
    x.open('GET', new URL('index.html', document.baseURI).href, false); // sync on purpose: styles must exist before render
    x.send();
    var doc = new DOMParser().parseFromString(x.responseText, 'text/html');
    doc.querySelectorAll('style').forEach(function (s) {
      var el = document.createElement('style');
      el.setAttribute('data-from', 'canon/index.html');
      el.textContent = s.textContent;
      document.head.appendChild(el);
    });
  } catch (e) { console.error('pg-canon-css: could not load canon styles', e); }
})();
