const prevBtn = document.querySelector('.nav-btn.prev-btn');
const nextBtn = document.querySelector('.nav-btn.next-btn');
const unsplashImage = document.getElementById('unsplash-image');
const photographerName = document.getElementById('photographer-name');
const likeBtn = document.getElementById('like-button');
const likesCount = document.getElementById('likes-count');

let currentPage = 1;
isLoading = false;
let currentImage = null;
const loadedImageId = new Set();

async function getImage(page, direction = 'next') {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/?page=${page}&per_page=1&client_id=${config.UNSPLASH_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
        }
        const images = await response.json();

        if (images.length > 0 && loadedImageId.has(images[0].id)) {
            if (direction === 'next') {
                currentPage++;
                return getImage(currentPage, direction);
            } else if (direction === 'prev') {
                if (currentPage > 1) {
                    currentPage--;
                }
                return images;
            }
        }

        if (images.length > 0) {
            loadedImageId.add(images[0].id);
        }

        return images;
    } catch (error) {
        console.error('Ошибка', error);
        return [];
    }
}

async function renderImage(direction = 'next') {
    if (isLoading) return;

    try {
        isLoading = true;

        unsplashImage.classList.add('loading');

        const images = await getImage(currentPage, direction);

        if (!images || images.length === 0) {
            console.log('Не удалось получить изображения');
            unsplashImage.classList.remove('loading');
            isLoading = false;
        }

        const image = images[0];
        currentImage = image;

        if (!image || !image.urls || !image.urls.regular) {
            console.log('Полученное изображение не содержит нужных данных');
            unsplashImage.classList.remove('loading');
            isLoading = false;
        }

        await new Promise(resolve => {
            unsplashImage.onload = resolve;
            unsplashImage.src = image.urls.regular;
        });

        unsplashImage.dataset.id = image.id;
        
        photographerName.textContent = `${image.user.first_name}` + `${image.user.last_name}`;

        updateLikeState();

        unsplashImage.classList.remove('loading');
    } catch (error) {
        console.error('Ошибка', error.message);
        isLoading = false;
    }
    isLoading = false;
}

likeBtn.addEventListener('click', handleLikeClick);

function handleLikeClick() {
    likeBtn.classList.toggle('liked');

    let liked = JSON.parse(localStorage.getItem('liked')) || [];

    const likedImage = {
        id: unsplashImage.dataset.id,
        url: currentImage.urls.regular,
        name: `${currentImage.user.first_name} ${currentImage.user.last_name}`,
        date: Date.now().toString(),
        likes: parseInt(likesCount.textContent)
    };

    const index = liked.findIndex(item => item.id === likedImage.id);

    if (likeBtn.classList.contains('liked')) {
        likedImage.likes = parseInt(likesCount.textContent) + 1;
        likesCount.textContent = likedImage.likes;

        if (index === -1) {
            liked.push(likedImage);
        }
    } else {
        likesCount.textContent = parseInt(likesCount.textContent) - 1;
        if (index !== -1) {
            liked.splice(index, 1)
        }
    }

    localStorage.setItem('liked', JSON.stringify(liked));
}

function updateLikeState() {
    const liked = JSON.parse(localStorage.getItem('liked')) || [];
    const likedImage = liked.find(item => item.id === unsplashImage.dataset.id);
    
    if (!likedImage) {
        const randomLikes = Math.floor(Math.random() * 887);
        likesCount.textContent = randomLikes;
        likeBtn.classList.remove('liked');
    } else {
        likesCount.textContent = likedImage.likes;
        likeBtn.classList.add('liked');
    }
}

function nextImage() {
    currentPage++;
    renderImage('next');
}

nextBtn.addEventListener('mousedown', nextImage);

function prevImage() {
    if (currentPage > 1) {
        currentPage--;
        renderImage('prev');
    }
}

prevBtn.addEventListener('mousedown', prevImage);

renderImage();