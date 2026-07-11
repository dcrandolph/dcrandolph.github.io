function linkMassage() {
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    const href = link.getAttribute('href');
    // handle obfuscated email links
    if (href.startsWith('mailto:') && href.includes(' AT ')) {
      link.addEventListener('click', function(event) {
        event.preventDefault(); 
        const obfuscated = href.replace('mailto:', '');
        const realEmail = obfuscated
          .replace(/\sAT\s/gi, '@')
          .replace(/\sDOT\s/gi, '.');
        window.location.href = `mailto:${realEmail}?subject=${document.title}`;
      });
      continue;
    }
    // open external links in a new window
    if (link.hostname !== location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  }
}

window.addEventListener("load", () => {
  linkMassage();
});

