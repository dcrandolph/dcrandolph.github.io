function externalNewWindow() {
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    if (link.hostname !== location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  }
}

window.addEventListener("load", () => {
  externalNewWindow();
});

