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
  // Abort script execution early if not on the search page
  if (!searchInput || !resultsContainer) return;
  let postsIndex = [];
  // Fetch the search index (adjust the root path if your site uses a baseurl)
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      postsIndex = data;
    })
    .catch(error => console.error('Error loading search index:', error));
  // Listen for user typing
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
  // Render matches to the DOM
  function displayResults(matches) {
    if (matches.length === 0) {
      resultsContainer.innerHTML = '<li class="search-item no-results"><h3>No matching posts found.</h3></li>';
      return;
    }
    resultsContainer.innerHTML = matches.map(post => `
      <li class="search-item">
        <a href="${ post.url }">${ post.title }</a>
      </li>
    `).join('');
  }
}


window.addEventListener("load", () => {
  linkMassage();
  setUpSearch();
});

