// Configuration - MUST UPDATE THESE!
const GITHUB_USERNAME = "shahudh-hitman"; // e.g. "weddingphotos"
const REPO_NAME = "shahudh-hitman.github.io"; // e.g. "our-wedding"
const PHOTO_FOLDER = "photos"; // Name of your photos folder

async function loadGitHubPhotos() {
    const gallery = document.getElementById('github-gallery');
    gallery.innerHTML = '<div class="loading">Loading photos...</div>';

    try {
        // Fetch photo list from GitHub API
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${PHOTO_FOLDER}?ref=main`
        );
        
        if (!response.ok) throw new Error("Failed to fetch photos");
        
        const files = await response.json();
        
        // Filter for image files only
        const imageFiles = files.filter(file => 
            file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );

        if (imageFiles.length === 0) {
            gallery.innerHTML = '<div class="loading">No photos yet. Check back soon!</div>';
            return;
        }

        // Clear loading message
        gallery.innerHTML = '';

        // Display each image
        imageFiles.forEach(file => {
            const imgUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${PHOTO_FOLDER}/${file.name}`;
            
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'Wedding photo';
            img.loading = 'lazy';
            
            photoItem.appendChild(img);
            gallery.appendChild(photoItem);
        });

    } catch (error) {
        console.error("Error loading photos:", error);
        gallery.innerHTML = '<div class="loading">Could not load photos. Please check back later.</div>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadGitHubPhotos);

// Optional: Auto-refresh every 5 minutes
setInterval(loadGitHubPhotos, 300000);
