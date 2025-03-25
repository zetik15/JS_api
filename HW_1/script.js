async function getData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ошибка: ${error}`);
        return null;
    }
}

getData('data.json');

const scheduleList = document.getElementById('schedule-list');
const template = document.getElementById('class-template');
const dayBtns = document.querySelectorAll('.day-btn');

document.addEventListener('DOMContentLoaded', async function () {
    const lessons = await getData('./data.json');
    let userBookings = JSON.parse(localStorage.getItem('userBookings')) || [];

    lessons.forEach(lesson => {
        const cloneTemplate = template.content.cloneNode(true);

        const className = cloneTemplate.querySelector('.class-name');
        const classDay = cloneTemplate.querySelector('.class-day');
        const classTime = cloneTemplate.querySelector('.class-time');
        const classParticipants = cloneTemplate.querySelector('.class-participants');
        const signupBtn = cloneTemplate.querySelector('.signup-btn');
        const cancelBtn = cloneTemplate.querySelector('.cancel-btn');
        const fullMessage = cloneTemplate.querySelector('.full-message');

        signupBtn.dataset.id = lesson.id;
        cancelBtn.dataset.id = lesson.id;
        classDay.dataset.day = lesson.day

        className.textContent = lesson.name;
        classDay.textContent = lesson.day;
        classTime.textContent = lesson.time;
        classParticipants.textContent = 'Участники: ' + lesson.currentParticipants + '/' + lesson.maxParticipants;

        scheduleList.appendChild(cloneTemplate);

        if (lesson.currentParticipants === lesson.maxParticipants) {
            fullMessage.style.display = 'block';
            signupBtn.style.display = 'none';
        }

        if (userBookings.includes(lesson.id)) {
            signupBtn.style.display = 'none';
            cancelBtn.style.display = 'block';
        }

        signupBtn.addEventListener('click', function (e) {
            const target = e.target;

            const id = parseInt(target.dataset.id);

            const lesson = lessons.find(item => item.id === id);
            userBookings.push(id);
            localStorage.setItem('userBookings', JSON.stringify(userBookings));

            if (lesson.currentParticipants < lesson.maxParticipants) {
                lesson.currentParticipants++;

                classParticipants.textContent = 'Участники: ' + lesson.currentParticipants + '/' + lesson.maxParticipants;

                target.style.display = 'none';
                cancelBtn.style.display = 'block';
            }
        });

        cancelBtn.addEventListener('click', function (e) {
            const target = e.target;

            const id = parseInt(target.dataset.id);

            const lesson = lessons.find(item => item.id === id);
            const index = userBookings.indexOf(id);

            if (index !== -1) {
                userBookings.splice(index, 1);
                localStorage.setItem('userBookings', JSON.stringify(userBookings));
            }

            lesson.currentParticipants--;

            classParticipants.textContent = 'Участники: ' + lesson.currentParticipants + '/' + lesson.maxParticipants;

            cancelBtn.style.display = 'none';
            signupBtn.style.display = 'block';
            signupBtn.disabled = false;
        });

        dayBtns.forEach(dayBtn => {
            dayBtn.addEventListener('click', function (e) {
                const activeDayBtns = document.querySelectorAll('.active');

                activeDayBtns.forEach(activeDayBtn => {
                    activeDayBtn.classList.remove('active')
                });

                dayBtn.classList.add('active');

                const selectedDay = dayBtn.dataset.day;

                const allCardsLessons = document.querySelectorAll('.class-card');

                if (selectedDay === 'all') {
                    allCardsLessons.forEach(card => {
                        card.style.display = '';
                    });
                } else {
                    allCardsLessons.forEach(card => {
                        const cardDay = card.querySelector('.class-day').dataset.day;
        
                        if (cardDay === selectedDay) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
});