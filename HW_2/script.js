// Заготовка для JavaScript кода слайдера
// Здесь вы можете реализовать логику слайдера самостоятельно

// Подсказки по декомпозиции задания:
// 1. Получите доступ к элементам DOM (изображения, кнопки, точки)
// 2. Создайте переменную для хранения индекса текущего изображения
// 3. Создайте функции для переключения изображений (вперед, назад)
// 4. Добавьте обработчики событий для кнопок и точек
// 5. Реализуйте циклическое переключение (после последнего - первое)

const sliderImages = document.querySelectorAll('.slider-image');
const prevBtn = document.querySelector('.slider-btn.prev-btn');
const nextBtn = document.querySelector('.slider-btn.next-btn');
const sliderDots = document.querySelectorAll('.slider-dot');

let currentIndex = 0;
let countImages = sliderImages.length;

function renderImage(currentIndex) {
    sliderImages.forEach(image => {
        image.classList.remove('active');
    });

    sliderImages[currentIndex].classList.add('active');

    sliderDots.forEach(dot => {
        dot.classList.remove('active');
    });

    sliderDots[currentIndex].classList.add('active');
}

function nextImage() {
    currentIndex++

    if (currentIndex >= countImages) {
        currentIndex = 0;
    }

    renderImage(currentIndex);
}

function prevImage() {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = countImages - 1;
    }

    renderImage(currentIndex);
}

nextBtn.addEventListener('click', function (e) {
    nextImage()
});

prevBtn.addEventListener('click', function (e) {
    prevImage();
});

sliderDots.forEach(dot => {
    dot.addEventListener('click', function (e) {
        const attributeDot = parseInt(dot.getAttribute('data-index'));

        renderImage(attributeDot);
        currentIndex = attributeDot;
    });
});