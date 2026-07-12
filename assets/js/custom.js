function linkMassage() {
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    const href = link.getAttribute('href');
    // handle Web Share API if supported, mailto, and data-sharing attribute exists
    if (navigator.share && href.startsWith('mailto:') && link.hasAttribute('data-sharing')) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        // grab custom text from the data attributes, or use fallbacks
        const shareTitle = link.getAttribute('data-title') || document.title;
        const shareText = link.getAttribute('data-text') || link.innerText || 'look what I found:';
        const shareUrl = link.getAttribute('data-url') || window.location.href;
        navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        })
        .catch((error) => console.log('Sharing failed or cancelled:', error));
      });
      continue; 
    }
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

