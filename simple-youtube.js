// Ultra-simple YouTube integration - no API needed
// This creates functional episode cards that link to YouTube
// Channel ID: UCSrtA1gGlgo4cQUzoSlzZ5w (@B3uCreatingSuccess)

// Safe YouTube channel ID extraction utility
function extractYouTubeChannelId(url) {
    try {
        if (!url || typeof url !== 'string') {
            console.warn('Invalid URL provided for YouTube channel ID extraction');
            return null;
        }
        
        // Pattern for @username format
        const usernameMatch = url.match(/youtube\.com\/@([a-zA-Z0-9_-]+)/);
        if (usernameMatch && usernameMatch[1]) {
            return usernameMatch[1];
        }
        
        // Pattern for channel ID format
        const channelMatch = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
        if (channelMatch && channelMatch[1]) {
            return channelMatch[1];
        }
        
        // Pattern for c/ format
        const cMatch = url.match(/youtube\.com\/c\/([a-zA-Z0-9_-]+)/);
        if (cMatch && cMatch[1]) {
            return cMatch[1];
        }
        
        // Pattern for user/ format
        const userMatch = url.match(/youtube\.com\/user\/([a-zA-Z0-9_-]+)/);
        if (userMatch && userMatch[1]) {
            return userMatch[1];
        }
        
        console.warn('Could not extract YouTube channel ID from URL:', url);
        return null;
    } catch (error) {
        console.error('Error extracting YouTube channel ID:', error);
        return null;
    }
}

// Make it available globally for testing
window.extractYouTubeChannelId = extractYouTubeChannelId;

// B3U Channel Configuration
const B3U_CHANNEL_ID = 'UCSrtA1gGlgo4cQUzoSlzZ5w';
const B3U_CHANNEL_URL = 'https://www.youtube.com/@B3uCreatingSuccess';
const B3U_CHANNEL_URL_BY_ID = `https://www.youtube.com/channel/${B3U_CHANNEL_ID}`;

// Try to fetch real YouTube data (with fallback)
async function fetchLatestVideos() {
    try {
        console.log('Attempting to fetch real YouTube videos...');
        
        // Try RSS feed approach with CORS proxy
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${B3U_CHANNEL_ID}`;
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        
        const response = await fetch(corsProxy + encodeURIComponent(rssUrl));
        if (response.ok) {
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const entries = xmlDoc.querySelectorAll('entry');
            
            if (entries.length > 0) {
                console.log('Successfully fetched real YouTube videos!');
                const videos = Array.from(entries).slice(0, 3).map((entry, index) => {
                    const title = entry.querySelector('title')?.textContent || 'Latest Episode';
                    const link = entry.querySelector('link')?.getAttribute('href') || B3U_CHANNEL_URL;
                    const published = entry.querySelector('published')?.textContent || new Date().toISOString();
                    const description = entry.querySelector('media\\:description, description')?.textContent || 'Watch this latest episode from B3U podcast.';
                    
                    return {
                        title: title.substring(0, 80) + (title.length > 80 ? '...' : ''),
                        link,
                        published,
                        description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
                        isReal: true
                    };
                });
                
                displayVideos(videos);
                return;
            }
        }
    } catch (error) {
        console.log('Could not fetch real videos, using fallback:', error.message);
    }
    
    // Fallback to static content
    displayFallbackVideos();
}

function displayVideos(videos) {
    const episodesGrid = document.querySelector('.episodes-grid');
    if (!episodesGrid) {
        console.error('Episodes grid not found');
        return;
    }

    episodesGrid.innerHTML = '';

    videos.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'episode-card';
        
        const publishedDate = video.published ? new Date(video.published).toLocaleDateString() : 'Recent';
        const episodeLabel = video.isReal ? 'Latest' : 'Episode';
        
        card.innerHTML = `
            <div class="episode-number">${episodeLabel} ${index + 1}</div>
            <h3>${video.title}</h3>
            <p>${video.description}</p>
            <div class="episode-meta">
                <span>📅 ${publishedDate}</span>
                <span>🎥 YouTube</span>
                ${video.isReal ? '<span>🔴 Live</span>' : ''}
            </div>
            <a href="${video.link}" target="_blank" rel="noopener noreferrer" class="episode-link">
                Watch Episode →
            </a>
        `;
        
        episodesGrid.appendChild(card);
    });
    
    console.log(`Displayed ${videos.length} videos`);
}

function displayFallbackVideos() {
    console.log('Using fallback videos for B3U podcast');
    
    const fallbackVideos = [
        {
            title: 'Latest B3U Podcast Episode',
            description: 'Join us for the most recent episode of B3U Creating Success. Inspiring conversations about life, growth, and making a difference.',
            link: B3U_CHANNEL_URL,
            published: new Date().toISOString(),
            isReal: false
        },
        {
            title: 'B3U Success Stories',
            description: 'Listen to amazing stories of transformation and success from our community members and special guests.',
            link: B3U_CHANNEL_URL,
            published: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            isReal: false
        },
        {
            title: 'Motivational Monday',
            description: 'Start your week right with powerful motivation and actionable insights for personal and professional growth.',
            link: B3U_CHANNEL_URL,
            published: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
            isReal: false
        }
    ];
    
    displayVideos(fallbackVideos);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading B3U YouTube integration...');
    console.log('Channel ID:', B3U_CHANNEL_ID);
    
    // Get the episodes grid
    const episodesGrid = document.querySelector('.episodes-grid');
    if (!episodesGrid) {
        console.error('Episodes grid not found');
        return;
    }
    
    // Clear existing content and show loading
    episodesGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #8b7355;">Loading latest episodes...</div>';
    
    // Try to fetch real YouTube videos
    fetchLatestVideos();
});

// Add some CSS for loading state
const style = document.createElement('style');
style.textContent = `
    .episodes-grid {
        min-height: 300px;
    }
    
    .episode-card {
        opacity: 0;
        animation: fadeIn 0.6s ease-in-out forwards;
    }
    
    .episode-card:nth-child(1) { animation-delay: 0.1s; }
    .episode-card:nth-child(2) { animation-delay: 0.2s; }
    .episode-card:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
