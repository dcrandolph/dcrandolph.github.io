function linkMassage() {
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    const href = link.getAttribute('href');
    // handle Web Share API if supported, mailto, and data-sharing attribute exists
    if (navigator.share && href.startsWith('mailto:') && link.hasAttribute('data-sharing')) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        navigator.share({
          title: document.title,
          url: document.location.href,
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

function setUpSearch() {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const searchSpinner = document.getElementById('search-spinner');
  if (!searchInput || !resultsContainer) return;
  let postsIndex = [];
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      postsIndex = data;
      // Hide spinner and enable typing once data is ready
      if (searchSpinner) searchSpinner.style.display = 'none';
      searchInput.removeAttribute('disabled');
      searchInput.focus();
    })
    .catch(error => {
      console.error('Error loading search index:', error);
      if (searchSpinner) searchSpinner.innerHTML = 'Error loading search.';
    });
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }
    const matches = postsIndex.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const contentMatch = post.content.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
    displayResults(matches);
  });
  function displayResults(matches) {
    if (matches.length === 0) {
      resultsContainer.innerHTML = '<li class="no-results">No matching posts found.</li>';
      return;
    }
    resultsContainer.innerHTML = matches.map(post => `
      <li class="search-result-item">
        <a href="${post.url}" class="search-result-title">${post.title}</a>
        <span class="search-result-date">Published on ${post.date}</span>
      </li>
    `).join('');
  }
}

window.addEventListener("load", () => {
  linkMassage();
  setUpSearch();
});

