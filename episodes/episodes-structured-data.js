/*
  B3U Podcast — Episode structured data helper (not wired yet)
  Purpose: When the /episodes archive is ready to go live, include this file to
  1) Render a simple list of episodes from episodes.json, and
  2) Inject JSON-LD (PodcastEpisode) entries for each episode for SEO.

  How to wire later (when ready):
  - Remove noindex from episodes/index.html <head>.
  - Add <script src="/episodes/episodes-structured-data.js" defer></script> to episodes/index.html.
  - Optionally add a nav link and include /episodes in sitemap.xml.
*/
(function() {
  'use strict';

  // Utilities
  function createJsonLd(episodes) {
    const graph = episodes.map(ep => ({
      "@context": "https://schema.org",
      "@type": "PodcastEpisode",
      "name": ep.name,
      "description": ep.description,
      "url": ep.url,
      "datePublished": ep.datePublished,
      "thumbnailUrl": ep.thumbnailUrl,
      "partOfSeries": {
        "@type": "PodcastSeries",
        "name": "B3U Podcast",
        "url": "https://b3unstoppable.net"
      },
      "subjectOf": {
        "@type": "VideoObject",
        "name": ep.name,
        "embedUrl": ep.embedUrl,
        "thumbnailUrl": ep.thumbnailUrl,
        "uploadDate": ep.datePublished
      }
    }));

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(graph, null, 2);
    return script;
  }

  function renderEpisodes(episodes) {
    const container = document.getElementById('episodes-list');
    if (!container) return;
    container.innerHTML = '';
    episodes.forEach(ep => {
      const card = document.createElement('div');
      card.className = 'episode-card';
      card.innerHTML = `
        <div class="episode-number">Episode</div>
        <h3>${ep.name}</h3>
        <p>${ep.description}</p>
        <div class="episode-meta">
          <span>📅 ${new Date(ep.datePublished).toLocaleDateString()}</span>
          <span>🎬 YouTube</span>
        </div>
        <a href="${ep.url}" target="_blank" rel="noopener noreferrer" class="episode-link">Watch Episode →</a>
      `;
      container.appendChild(card);
    });
  }

  async function init() {
    try {
      const res = await fetch('/episodes/episodes.json', { cache: 'no-store' });
      const episodes = await res.json();
      renderEpisodes(episodes);
      const jsonLd = createJsonLd(episodes);
      document.head.appendChild(jsonLd);
    } catch (e) {
      console.error('Failed to load episodes:', e);
    }
  }

  // Expose init for manual triggering during preview if needed
  window.B3U_EPISODES = { init };
  // Note: We intentionally do NOT auto-run init() to avoid wiring.
})();
