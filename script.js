/* =========================================
   1. ЛОГИКА ЭТАПОВ ПРОИЗВОДСТВА (Слайдер)
   ========================================= */
let currentStage = 1;
const totalStages = 5;
let stageInterval;
let isUserInteracted = false;

function selectStage(stageNum) {
    const evt = window.event;
    if (evt && evt.isTrusted) {
        isUserInteracted = true;
        stopAutoSlide();
    }

    currentStage = stageNum;

    // Сброс
    document.querySelectorAll('.stage-card').forEach(card => {
        card.classList.remove('bg-brand-orange', 'border-brand-orange', 'active-stage', 'shadow-lg');
        card.classList.add('bg-white', 'border-stone-100', 'shadow-sm');

        const title = card.querySelector('.stage-title');
        const desc = card.querySelector('.stage-desc');
        const num = card.querySelector('.stage-num');

        if(title) { title.classList.remove('text-white'); title.classList.add('text-brand-dark'); }
        if(desc) { desc.classList.remove('text-white/90'); desc.classList.add('text-stone-500'); }
        if(num) { num.classList.remove('text-white/30'); num.classList.add('text-stone-100'); }
    });

    // Активный
    const activeCard = document.querySelector(`.stage-card[data-id="${stageNum}"]`);
    if (activeCard) {
        activeCard.classList.remove('bg-white', 'border-stone-100', 'shadow-sm');
        activeCard.classList.add('bg-brand-orange', 'border-brand-orange', 'active-stage', 'shadow-lg');

        const title = activeCard.querySelector('.stage-title');
        const desc = activeCard.querySelector('.stage-desc');
        const num = activeCard.querySelector('.stage-num');

        if(title) { title.classList.remove('text-brand-dark'); title.classList.add('text-white'); }
        if(desc) { desc.classList.remove('text-stone-500'); desc.classList.add('text-white/90'); }
        if(num) { num.classList.remove('text-stone-100'); num.classList.add('text-white/30'); }
    }

    // Контент
    for (let i = 1; i <= totalStages; i++) {
        const content = document.getElementById(`stage-content-${i}`);
        if (content) content.classList.add('hidden');
    }
    const showContent = document.getElementById(`stage-content-${stageNum}`);
    if (showContent) {
        showContent.classList.remove('hidden');
        showContent.classList.remove('animate-fade-in');
        void showContent.offsetWidth;
        showContent.classList.add('animate-fade-in');
    }
}

function startAutoSlide() {
    stageInterval = setInterval(() => {
        let next = currentStage + 1;
        if (next > totalStages) next = 1;
        selectStage(next);
    }, 4000);
}

function stopAutoSlide() {
    clearInterval(stageInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    startAutoSlide();
});


/* =========================================
   2. ОБРАБОТКА ФОРМ (ВАЛИДАЦИЯ + СБОР ДАННЫХ)
   ========================================= */

// Маска телефона
document.addEventListener('input', function (e) {
    if (e.target.type === 'tel' || e.target.name === 'quiz_phone') {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (!x[2] && x[1] !== '') {
            e.target.value = '+7 ';
        } else {
            e.target.value = !x[2] ? '+7' : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        }
    }
});

async function handleFormSubmit(event, sourceName) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input');

    let isValid = true;

    // Проверка пустоты
    inputs.forEach(input => {
        if (input.type !== 'hidden' && !input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500', 'ring-1', 'ring-red-500');
            input.addEventListener('input', () => input.classList.remove('border-red-500', 'ring-1', 'ring-red-500'), {once: true});
        }
    });

    // Проверка телефона
    const telInput = form.querySelector('input[type="tel"]') || form.querySelector('input[name="quiz_phone"]');
    if (telInput) {
        const rawNumbers = telInput.value.replace(/\D/g, '');
        if (rawNumbers.length < 11) {
            isValid = false;
            alert('Пожалуйста, введите корректный номер телефона.');
            telInput.classList.add('border-red-500', 'ring-1', 'ring-red-500');
            return;
        }
    }

    if (!isValid) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    // Сбор данных Квиза (включая мессенджер)
    if (sourceName === 'Квиз') {
        const q1 = document.querySelector('input[name="purpose"]:checked')?.value || '-';
        const q2 = document.querySelector('input[name="area"]:checked')?.value || '-';
        const q3 = document.querySelector('input[name="timing"]:checked')?.value || '-';
        const q4 = document.querySelector('input[name="contact_method"]:checked')?.value || '-'; // НОВОЕ ПОЛЕ

        console.log(`Заявка Квиз:
        Цель: ${q1}
        Площадь: ${q2}
        Срок: ${q3}
        Связь: ${q4} 
        `);
    }

    const originalBtnText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Отправка...';

    setTimeout(() => {
        alert(`Спасибо! Ваша заявка "${sourceName}" принята.`);
        form.reset();

        if (typeof closeModal === 'function') closeModal();
        if (typeof closeProjectModal === 'function') closeProjectModal();

        btn.disabled = false;
        btn.innerText = originalBtnText;
    }, 1000);
}


/* =========================================
   3. ДАННЫЕ ПРОЕКТОВ
   ========================================= */
const projectsData = {
    'm10': {
        title: 'Модульный дом М-10',
        subtitle: 'Уют в гармонии с природой',
        price: 'от 750 000 ₽',
        area: '15',
        images: [
            '/m10.jpg',
            'photo_2026-01-12_00-00-52.jpg',
            'photo_2026-01-12_00-00-50.jpg'
        ],
        specs: [
            'Габариты: 4000 × 2500 × 2300 мм',
            'Утепление: 150 мм (Зима)',
            'Каркас: строганая доска',
            'Отделка: вагонка',
            'Терраса: ~2,5 м²'
        ],
        description: 'Компактный, стильный и продуманный — идеален для дачи, глэмпинга или уединённого отдыха. Тёплый деревянный фасад, панорамные окна и аккуратная терраса.'
    },
    'm15': {
        title: 'Модульный дом М-15',
        subtitle: 'Максимум пользы на минимуме метров',
        price: 'от 950 000 ₽',
        area: '17.5',
        images: [
            '/m15.jpg',
            'photo_2026-01-12_00-00-43.jpg',
            'photo_2026-01-12_00-00-41.jpg'
        ],
        specs: [
            'Габариты: 6000 × 2500 × 2700 мм',
            'Планировка: Студия + С/У',
            'Каркас: строганая доска',
            'Окна: Панорамные',
            'Срок монтажа: 1 день'
        ],
        description: 'Увеличенная версия хита. Дополнительные метры позволяют разместить полноценную кухню и шкаф. Отличный вариант для дачи выходного дня.'
    },
    'm25': {
        title: 'Модульный дом М-25',
        subtitle: 'Компактный минимализм с комфортом',
        price: 'от 1 490 000 ₽',
        area: '25',
        images: [
            '/m25.jpg',
            'photo_2026-01-12_00-00-47.jpg',
            'photo_2026-01-12_00-00-56.jpg',
            'photo_2026-01-12_00-00-55.jpg'
        ],
        specs: [
            'Площадь: ~25 м²',
            'Стиль: Минимализм',
            'Окна: Большие панорамные',
            'Планировка: Кухня-гостиная + спальня',
            'Особенность: Открытая терраса'
        ],
        description: 'Современный модульный дом в стиле минимализма. Прямоугольная форма, аккуратная геометрия. Внутри предусмотрено всё для автономной жизни: гостиная, кухня, спальня и санузел.'
    },
    'm40': {
        title: 'Модульный дом М-40',
        subtitle: 'Современный минимализм и уют',
        price: 'от 1 890 000 ₽',
        area: '40',
        images: [
            '/m40.jpg',
            'photo_2026-01-12_00-00-46.jpg',
            'photo_2026-01-12_00-00-44.jpg',
            'photo_2026-01-12_00-00-42.jpg'
        ],
        specs: [
            'Площадь: ~40 м²',
            'Стиль: Барнхаус / Минимализм',
            'Окна: Панорамные',
            'Планировка: Гостиная + кухня + спальня',
            'Назначение: Для ПМЖ'
        ],
        description: 'Полноценный дом для постоянного проживания. Просторная гостиная с зоной отдыха, кухня, отдельная спальня и санузел. Экологичные материалы и энергосбережение.'
    }
};

/* --- ЛОГИКА ГАЛЕРЕИ В МОДАЛКЕ --- */
let currentGalleryScroll = 0;

function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    const titleEl = document.getElementById('pm-title') || document.getElementById('modal-title');
    if (titleEl) titleEl.innerText = data.title;
    const subEl = document.getElementById('pm-subtitle') || document.getElementById('modal-subtitle');
    if (subEl) subEl.innerText = data.subtitle;
    const descEl = document.getElementById('pm-description') || document.getElementById('modal-description');
    if (descEl) descEl.innerText = data.description;
    const priceEl = document.getElementById('pm-price');
    if (priceEl) priceEl.innerText = data.price;
    const areaEl = document.getElementById('pm-area');
    if (areaEl) areaEl.innerText = data.area;

    const galleryContainer = document.getElementById('pm-gallery');
    const dotsContainer = document.getElementById('pm-dots');

    if (galleryContainer && data.images) {
        galleryContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        currentGalleryScroll = 0;
        data.images.forEach((imgSrc, index) => {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'w-full h-full shrink-0 snap-center relative bg-stone-100 flex items-center justify-center overflow-hidden';
            imgDiv.innerHTML = `<img src="${imgSrc}" class="w-full h-full object-cover" alt="${data.title}">`;
            galleryContainer.appendChild(imgDiv);
            const dot = document.createElement('div');
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-white w-6' : 'bg-white/50'}`;
            dotsContainer.appendChild(dot);
        });
        galleryContainer.onscroll = () => updateDots(galleryContainer, dotsContainer);
    }

    const specsContainer = document.getElementById('pm-specs') || document.getElementById('modal-specs');
    if (specsContainer) {
        specsContainer.innerHTML = '';
        data.specs.forEach(spec => {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-3';
            li.innerHTML = `<span class="text-brand-orange mt-1">●</span><span>${spec}</span>`;
            specsContainer.appendChild(li);
        });
    }

    const modal = document.getElementById('project-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function scrollGallery(direction) {
    const gallery = document.getElementById('pm-gallery');
    if (!gallery) return;
    const width = gallery.clientWidth;
    gallery.scrollBy({ left: width * direction, behavior: 'smooth' });
}

function updateDots(gallery, dotsContainer) {
    const width = gallery.clientWidth;
    const scrollPos = gallery.scrollLeft;
    const index = Math.round(scrollPos / width);
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
        if (i === index) {
            dots[i].className = 'w-6 h-2 rounded-full bg-white transition-all duration-300';
        } else {
            dots[i].className = 'w-2 h-2 rounded-full bg-white/50 transition-all duration-300';
        }
    }
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.body.style.overflow = '';
}


/* =========================================
   4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   ========================================= */
function openModal(source = 'Заявка с сайта') {
    const sourceInput = document.getElementById('modal-source');
    if (sourceInput) sourceInput.value = source;

    const title = document.getElementById('modal-title');
    if (source === 'Видео производства' && title) {
        title.innerText = 'Получить видео';
    } else if (title) {
        title.innerText = 'Оставить заявку';
    }

    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
}

const widgetMobile = document.getElementById('promo-widget-mobile');
setTimeout(() => {
    if (widgetMobile) {
        widgetMobile.classList.remove('translate-y-[150%]', 'opacity-0');
    }
}, 3000);

function dismissWidgetMobile() {
    if (widgetMobile) {
        widgetMobile.classList.add('translate-y-[150%]', 'opacity-0');
        setTimeout(() => widgetMobile.remove(), 700);
    }
}

const cookieBanner = document.getElementById('cookie-banner');
if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        if (cookieBanner) cookieBanner.classList.remove('translate-y-[150%]', 'opacity-0');
    }, 1000);
}

function closeCookieBanner() {
    if (cookieBanner) {
        cookieBanner.classList.add('translate-y-[150%]', 'opacity-0');
        setTimeout(() => cookieBanner.remove(), 700);
        localStorage.setItem('cookieConsent', 'true');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

const deadline = new Date();
deadline.setDate(deadline.getDate() + 2);
function updateTimer() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const now = new Date();
    const diff = deadline - now;
    if (diff <= 0) {
        el.innerText = "00:00:00";
        return;
    }
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    el.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
setInterval(updateTimer, 1000);
updateTimer();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href.startsWith('#')) return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const menu = document.getElementById('mobile-menu');
            if (menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
            }
        }
    });
});

const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
});
backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =========================================
   5. ЛОГИКА КВИЗА (Quiz) - ИСПРАВЛЕНА
   ========================================= */
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const steps = document.querySelectorAll('.quiz-step');
const progressBar = document.getElementById('progress-bar');
const currentStepNum = document.getElementById('current-step-num');

// Теперь 4 вопроса!
let currentStepIndex = 0;
const totalQuizQuestions = 4; // Было 3, стало 4

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            updateQuizUI();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateQuizUI();
        }
    });
}

function updateQuizUI() {
    steps.forEach((step, index) => {
        if (index === currentStepIndex) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });

    // Прогресс бар (теперь делитель totalQuizQuestions)
    const progress = ((currentStepIndex + 1) / (totalQuizQuestions + 1)) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (currentStepIndex < steps.length - 1) {
        if (currentStepNum) currentStepNum.innerText = currentStepIndex + 1;
        if (nextBtn) nextBtn.classList.remove('hidden');
        const nav = document.getElementById('quiz-nav');
        if (nav) nav.classList.remove('hidden');
    } else {
        // Финал
        if (currentStepNum) currentStepNum.innerText = totalQuizQuestions;
        if (nextBtn) nextBtn.classList.add('hidden');
        const nav = document.getElementById('quiz-nav');
        if (nav) nav.classList.add('hidden');
    }

    if (currentStepIndex === 0) {
        if (prevBtn) prevBtn.classList.add('invisible');
    } else {
        if (prevBtn) prevBtn.classList.remove('invisible');
    }
}

/* =========================================
   7. ЛОГИКА ГАЛЕРЕИ ВНИЗУ (Load More + Слайдер)
   ========================================= */
const totalPhotos = 35;
const photosPath = 'gallery/';
const photosExtension = '.jpg';
let visiblePhotos = 0;
const step = 6;
let currentPhotoIndex = 1; // Запоминаем текущий номер открытого фото

function loadMorePhotos() {
    const grid = document.getElementById('gallery-grid');
    const btn = document.getElementById('load-more-btn');

    if (!grid) return;

    const nextLimit = Math.min(visiblePhotos + step, totalPhotos);

    for (let i = visiblePhotos + 1; i <= nextLimit; i++) {
        const div = document.createElement('div');
        div.className = 'relative h-72 rounded-2xl overflow-hidden cursor-pointer group animate-fade-in';

        // ВАЖНО: Передаем i (номер), а не путь строкой
        div.onclick = function() { openGalleryModal(i); };

        div.innerHTML = `
            <img src="${photosPath}${i}${photosExtension}" 
                 alt="Объект ${i}" 
                 loading="lazy"
                 class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                <span class="text-white opacity-0 group-hover:opacity-100 text-3xl font-bold transition transform scale-50 group-hover:scale-100">🔍</span>
            </div>
        `;
        grid.appendChild(div);
    }

    visiblePhotos = nextLimit;

    if (visiblePhotos >= totalPhotos) {
        if(btn) btn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMorePhotos();
});

// Открытие модалки по номеру фото
function openGalleryModal(index) {
    currentPhotoIndex = index;
    updateGalleryImage();

    const modal = document.getElementById('gallery-modal');
    if(modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Переключение фото (стрелки)
function changeGalleryPhoto(direction) {
    currentPhotoIndex += direction;

    // Зацикливаем галерею (если дошли до конца - идем в начало)
    if (currentPhotoIndex > totalPhotos) currentPhotoIndex = 1;
    if (currentPhotoIndex < 1) currentPhotoIndex = totalPhotos;

    updateGalleryImage();
}

// Обновление картинки в модалке
function updateGalleryImage() {
    const img = document.getElementById('gallery-modal-img');
    if (img) {
        // Небольшой эффект исчезновения при смене (опционально)
        img.style.opacity = '0.5';
        setTimeout(() => {
            img.src = `${photosPath}${currentPhotoIndex}${photosExtension}`;
            img.onload = () => { img.style.opacity = '1'; };
        }, 150);
    }
}

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Управление клавиатурой (Esc и Стрелки)
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('gallery-modal');
    if (modal && !modal.classList.contains('hidden')) {
        if (event.key === "Escape") closeGalleryModal();
        if (event.key === "ArrowRight") changeGalleryPhoto(1);
        if (event.key === "ArrowLeft") changeGalleryPhoto(-1);
    }
});

/* =========================================
   8. ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
   ========================================= */
function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Блокируем скролл фона
    } else {
        console.error('Ошибка: Элемент #privacy-modal не найден в HTML');
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Возвращаем скролл
    }
}