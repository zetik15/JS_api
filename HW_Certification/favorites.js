const favoritesContainer = document.getElementById('favorites-container');
const emptyMessage = document.getElementById('empty-message');
const favoriteTemplate = document.getElementById('favorite-template');

function updateEmptyState() {
    let liked = JSON.parse(localStorage.getItem('liked')) || [];
    if (emptyMessage) {
        if (liked.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    let liked = JSON.parse(localStorage.getItem('liked')) || [];
    
    updateEmptyState();

    liked.forEach(imageData => {
        const cloneFavoriteTemplate = favoriteTemplate.content.cloneNode(true);

        const img = cloneFavoriteTemplate.querySelector('img');
        img.src = imageData.url;

        const removeBtn = cloneFavoriteTemplate.querySelector('.remove-btn');
        removeBtn.className = 'remove-btn';
        removeBtn.dataset.id = imageData.id;

        const viewOriginal = cloneFavoriteTemplate.querySelector('.view-original');
        viewOriginal.href = `https://unsplash.com/photos/${imageData.id}`;
        viewOriginal.className = 'view-original';

        const likeDate = cloneFavoriteTemplate.querySelector('.like-date');
        const timestamp = parseInt(imageData.date);
        const date = new Date(timestamp);
        likeDate.textContent = date.toLocaleDateString('ru-RU')
        likeDate.className = 'like-date';

        favoritesContainer.appendChild(cloneFavoriteTemplate);

        removeBtn.addEventListener('click', function (e) {
            const imageId = removeBtn.dataset.id;

            let liked = JSON.parse(localStorage.getItem('liked'));

            liked = liked.filter(item => item.id !== imageId);

            localStorage.setItem('liked', JSON.stringify(liked));

            const card = removeBtn.closest('.favorite-item');
            if (card) {
                card.remove();
            }

            updateEmptyState();
        });
    });
});