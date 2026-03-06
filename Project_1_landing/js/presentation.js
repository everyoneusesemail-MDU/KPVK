/**
 * КП Вилла Крым — Презентация
 * Smooth scroll, slide nav, progress, animated counters, parallax, plot-size animation
 */
(function () {
    'use strict';

    const container = document.getElementById('slidesContainer');
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progressBar');
    const dotsContainer = document.getElementById('slideDots');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const totalSlides = slides.length;
    const customCursor = document.getElementById('customCursor');
    const slideMenu = document.getElementById('slideMenu');
    const slideMenuList = document.getElementById('slideMenuList');
    const slideMenuToggle = document.getElementById('slideMenuToggle');

    if (!container || !slides.length) return;

    // Creative animated cursor setup
    if (customCursor) {
        let cursorVisible = false;

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            customCursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${customCursor.classList.contains('is-link') ? 1.6 : customCursor.classList.contains('is-press') ? 0.7 : 0.9})`;
            if (!cursorVisible) {
                customCursor.style.opacity = '1';
                cursorVisible = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
            cursorVisible = false;
        });

        document.addEventListener('mousedown', () => {
            customCursor.classList.add('is-press');
        });

        document.addEventListener('mouseup', () => {
            customCursor.classList.remove('is-press');
        });

        const interactiveSelectors =
            'a, button, .location-items li, .infra-card, .slide-dot, .nav-btn, .theme-btn, .infra-nav, .note-chip, .house-card, .stroygrad-card, .stroygrad-card-plan-btn, .price-package-toggle, .scenarios-tab, .scenarios-arrow, .contact-block-social-btn, .contact-block-write-btn, .contact-block-phone, .contact-address-link';

        document.addEventListener('mouseover', (e) => {
            if (!customCursor) return;
            const target = e.target.closest(interactiveSelectors);
            customCursor.classList.toggle('is-link', !!target);
        });

        document.addEventListener('mouseout', (e) => {
            const toElement = e.relatedTarget;
            if (!toElement || !toElement.closest || !toElement.closest(interactiveSelectors)) {
                customCursor.classList.remove('is-link');
            }
        });
    }

    // Build dots
    slides.forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Слайд ${i + 1}`);
        dot.dataset.index = String(i);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slide-dot');

    function goToSlide(index) {
        const i = Math.max(0, Math.min(index, totalSlides - 1));
        const slide = slides[i];
        if (slide) {
            slide.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function setActiveSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        const pct = ((index + 1) / totalSlides) * 100;
        if (progressBar) progressBar.style.height = pct + '%';
        // Animate counters when stats slide становится активным (third slide, index 2)
        if (index === 2) animateCounters();

        // Обновляем режим меню слайдов (только бургер‑меню)
        if (slideMenu && slideMenuList) {
            const isFull = false;
            slideMenu.classList.toggle('slide-menu--full', isFull);
            slideMenu.classList.toggle('slide-menu--burger', !isFull);
            if (isFull) {
                slideMenu.classList.remove('slide-menu--open');
            }
            const items = slideMenuList.querySelectorAll('.slide-menu-item');
            items.forEach((btn, i) => {
                btn.classList.toggle('is-active', i === index);
            });
        }
    }

    // Intersection Observer: which slide is in view
    const observerOptions = { root: container, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const slide = entry.target;
            const index = Array.from(slides).indexOf(slide);
            setActiveSlide(index);
        });
    }, observerOptions);

    slides.forEach((slide) => observer.observe(slide));

    // Build slide titles menu (горизонтальное меню / burger)
    if (slideMenuList) {
        slides.forEach((slide, i) => {
            let label = '';
            const h1 = slide.querySelector('h1.slide-title');
            const h2 = slide.querySelector('h2.slide-heading');
            if (h1) label = h1.textContent.trim();
            else if (h2) label = h2.textContent.trim();
            else if (i === 0) label = 'Вступление';
            else label = `Слайд ${i + 1}`;

            // Кастомные подписи и скрытие отдельных слайдов только для меню
            let menuLabel = label;
            let hideFromMenu = false;

            if (i === 0) {
                // Первый слайд
                menuLabel = 'Главная';
            }

            if (h1) {
                // Hero‑слайд c заголовком "Ваш новый сценарий для лучшей жизни" — не показываем в меню
                if (label === 'Ваш новый сценарий для лучшей жизни') {
                    hideFromMenu = true;
                }
            } else if (h2) {
                switch (label) {
                    case 'Основные характеристики КП Вилла Крым':
                        menuLabel = 'О «Вилле Крым»';
                        break;
                    case 'Городская инфраструктура вокруг КП «Вилла Крым»':
                        menuLabel = 'Городская инфраструктура';
                        break;
                    case 'Инженерные коммуникации КП «Вилла Крым»':
                        menuLabel = 'Инженерные коммуникации';
                        break;
                    case 'Пакетные предложения «Вилла Крым»':
                        menuLabel = 'Пакетные предложения на дома';
                        break;
                    case 'Без скрытых доплат — всё включено':
                        hideFromMenu = true;
                        break;
                    case 'Сценарии жизни в «Вилла Крым»':
                        menuLabel = 'Сценарии жизни';
                        break;
                    case 'Проекты каменных домов «Стройград»':
                        menuLabel = 'Каменные дома';
                        break;
                    case 'Проекты модульных домов':
                    case 'Проекты модульных домов MODULDOM ЮГ':
                        menuLabel = 'Модульные дома';
                        break;
                    case 'Топ-10 мест в Керчи и окрестностях':
                        menuLabel = 'Достопримечательности';
                        break;
                    case 'Истории тех, кто уже переехал':
                        menuLabel = 'Отзывы';
                        break;
                    case 'Ваш путь от заявки до ключей':
                        hideFromMenu = true;
                        break;
                    case 'Начните свой путь к дому в Крыму сегодня':
                        menuLabel = 'Контакты';
                        break;
                }
            }

            if (hideFromMenu) {
                return;
            }

            if (menuLabel.length > 42) {
                menuLabel = menuLabel.slice(0, 39).trimEnd() + '…';
            }

            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'slide-menu-item';
            btn.textContent = menuLabel;
            btn.addEventListener('click', () => goToSlide(i));
            li.appendChild(btn);
            slideMenuList.appendChild(li);
        });
    }

    if (slideMenuToggle && slideMenu) {
        slideMenuToggle.addEventListener('click', () => {
            if (!slideMenu.classList.contains('slide-menu--burger')) return;
            slideMenu.classList.toggle('slide-menu--open');
        });
    }

    // Initial state
    setActiveSlide(0);

    prevBtn.addEventListener('click', () => {
        const current = Array.from(slides).findIndex((s) => s.classList.contains('is-active'));
        goToSlide(current - 1);
    });

    nextBtn.addEventListener('click', () => {
        const current = Array.from(slides).findIndex((s) => s.classList.contains('is-active'));
        goToSlide(current + 1);
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const current = Array.from(slides).findIndex((s) => s.classList.contains('is-active'));
            goToSlide(current - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            const current = Array.from(slides).findIndex((s) => s.classList.contains('is-active'));
            goToSlide(current + 1);
        }
    });

    // Animated counters (slide 3)
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        const cards = document.querySelectorAll('.stat-card[data-value]');
        cards.forEach((card) => {
            const value = parseInt(card.dataset.value, 10);
            const range = card.dataset.range ? parseInt(card.dataset.range, 10) : null;
            const span = card.querySelector('.stat-num');
            if (!span) return;
            const duration = 1500;
            const start = performance.now();
            function tick(now) {
                const elapsed = now - start;
                const t = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - t, 3);
                if (range != null) {
                    const current = Math.round(value + (range - value) * easeOut);
                    span.textContent = current;
                } else {
                    span.textContent = Math.round(value * easeOut);
                }
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
        countersAnimated = true;
    }

    // Prepare investment line charts (set dash lengths for smooth draw animation)
    const investPaths = document.querySelectorAll('.invest-line-path');
    investPaths.forEach((path) => {
        try {
            const length = path.getTotalLength();
            path.style.strokeDasharray = String(length);
            path.style.strokeDashoffset = String(length);
        } catch (e) {
            // ignore in case SVG is not fully ready
        }
    });

    // Parallax: move background shapes on scroll
    const shapes = document.querySelectorAll('.parallax-shapes .shape');
    const videoIntro = document.querySelector('.video-intro-media');
    if (shapes.length || videoIntro) {
        container.addEventListener(
            'scroll',
            () => {
                const scrollTop = container.scrollTop;
                const maxScroll = container.scrollHeight - container.clientHeight;
                const pct = maxScroll > 0 ? scrollTop / maxScroll : 0;
                if (shapes.length) {
                    shapes.forEach((shape, i) => {
                        const speed = (i % 2 === 0 ? 1 : -1) * (20 + i * 10);
                        const y = pct * speed;
                        shape.style.transform = `translateY(${y}px)`;
                    });
                }

                if (videoIntro) {
                    const vh = container.clientHeight || 1;
                    const t = Math.min(1, Math.max(0, scrollTop / vh));
                    const scale = 1 + t * 0.2;
                    const translateY = t * -80;
                    const opacity = 1 - t * 1.1;
                    videoIntro.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    videoIntro.style.opacity = String(Math.max(0, opacity));
                }
            },
            { passive: true }
        );
    }

    // Rotating plot size 6–8–12 with blur effect (slide 1)
    const plotSizeEl = document.querySelector('.plot-size');
    if (plotSizeEl) {
        const values = (plotSizeEl.dataset.values || '6,8,12')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
        let idx = 0;

        const changeValue = () => {
            if (!values.length) return;
            plotSizeEl.classList.add('is-changing');
            setTimeout(() => {
                idx = (idx + 1) % values.length;
                plotSizeEl.textContent = values[idx];
                plotSizeEl.classList.remove('is-changing');
            }, 220);
        };

        setTimeout(() => {
            changeValue();
            setInterval(changeValue, 2600);
        }, 1600);
    }

    // ----- Slide 2: Infrastructure 3D carousel -----
    (function setupInfraCarousel() {
        const carousel = document.getElementById('infraCarousel');
        if (!carousel) return;

        const cards = Array.from(carousel.querySelectorAll('.infra-card'));
        if (!cards.length) return;

        let index = 0;
        const prevBtn = carousel.querySelector('.infra-nav--prev');
        const nextBtn = carousel.querySelector('.infra-nav--next');
        const dotsContainer = carousel.querySelector('.infra-dots');
        const viewport = carousel.querySelector('.infra-carousel-viewport');

        const dots = cards.map((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'infra-dot' + (i === 0 ? ' is-active' : '');
            dot.dataset.index = String(i);
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', () => goTo(i));
            return dot;
        });

        function update() {
            const len = cards.length;
            const leftIndex = (index - 1 + len) % len;
            const rightIndex = (index + 1) % len;

            cards.forEach((card, i) => {
                card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');
                if (i === index) card.classList.add('is-center');
                else if (i === leftIndex) card.classList.add('is-left');
                else if (i === rightIndex) card.classList.add('is-right');
                else card.classList.add('is-hidden');

                const video = card.querySelector('video');
                if (video) {
                    if (i === index) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function goTo(i) {
            const len = cards.length;
            index = (i + len) % len;
            update();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goTo(index - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goTo(index + 1));
        }

        // Touch / swipe support (особенно для мобильных)
        if (viewport && 'ontouchstart' in window) {
            let touchStartX = 0;
            let touchStartY = 0;
            let isSwiping = false;

            viewport.addEventListener('touchstart', (e) => {
                const t = e.touches[0];
                touchStartX = t.clientX;
                touchStartY = t.clientY;
                isSwiping = false;
            }, { passive: true });

            viewport.addEventListener('touchmove', (e) => {
                const t = e.touches[0];
                const dx = t.clientX - touchStartX;
                const dy = t.clientY - touchStartY;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
                    // Горизонтальный жест — помечаем как свайп, чтобы не скроллить страницу
                    isSwiping = true;
                    e.preventDefault();
                }
            }, { passive: false });

            viewport.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - touchStartX;
                const threshold = 40;
                if (dx > threshold) {
                    goTo(index - 1);
                } else if (dx < -threshold) {
                    goTo(index + 1);
                }
            });
        }

        update();
    })();

    // ----- Slide 5: Engineering communications tabs -----
    (function setupEngTabs() {
        const rootEl = document.getElementById('engTabs');
        if (!rootEl) return;

        const tabs = Array.from(rootEl.querySelectorAll('.eng-tab'));
        const panels = Array.from(rootEl.querySelectorAll('.eng-panel'));
        if (!tabs.length || !panels.length) return;

        function activate(name) {
            tabs.forEach((btn) => {
                const active = btn.dataset.eng === name;
                btn.classList.toggle('is-active', active);
            });
            panels.forEach((panel) => {
                const active = panel.dataset.engPanel === name;
                panel.classList.toggle('is-active', active);
            });
        }

        tabs.forEach((btn) => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.eng;
                if (!name) return;
                activate(name);
            });
        });

        const initial = tabs[0] && tabs[0].dataset.eng;
        if (initial) {
            activate(initial);
        }
    })();

    // ----- New Slide 8: All included tabs ("Без скрытых доплат — всё включено") -----
    (function setupAllIncTabs() {
        const rootEl = document.getElementById('allIncTabs');
        if (!rootEl) return;

        const tabs = Array.from(rootEl.querySelectorAll('.allinc-tab'));
        const panels = Array.from(rootEl.querySelectorAll('.allinc-panel'));
        if (!tabs.length || !panels.length) return;

        function activate(name) {
            tabs.forEach((btn) => {
                const active = btn.dataset.allinc === name;
                btn.classList.toggle('is-active', active);
            });
            panels.forEach((panel) => {
                const active = panel.dataset.allincPanel === name;
                panel.classList.toggle('is-active', active);
            });
        }

        tabs.forEach((btn) => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.allinc;
                if (!name) return;
                activate(name);
            });
        });

        const initial = tabs[0] && tabs[0].dataset.allinc;
        if (initial) {
            activate(initial);
        }
    })();

    // ----- Scenarios slide: tabs + carousels -----
    (function setupScenariosTabs() {
        const rootEl = document.getElementById('scenariosTabs');
        if (!rootEl) return;

        const tabs = Array.from(rootEl.querySelectorAll('.scenarios-tab'));
        const panels = Array.from(rootEl.querySelectorAll('.scenarios-panel'));
        if (!tabs.length || !panels.length) return;

        function activate(name) {
            tabs.forEach((btn) => {
                btn.classList.toggle('is-active', btn.dataset.scenario === name);
            });
            panels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.dataset.scenarioPanel === name);
            });
        }

        tabs.forEach((btn) => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.scenario;
                if (!name) return;
                activate(name);
            });
        });

        activate(tabs[0] && tabs[0].dataset.scenario);
    })();

    (function setupScenariosCarousels() {
        function updateCarouselTransform(carousel) {
            const inner = carousel && carousel.querySelector('.scenarios-carousel-inner');
            if (!inner) return;
            const slides = inner.querySelectorAll('.scenarios-slide');
            const index = carousel._scenarioIndex || 0;

            if (carousel.classList.contains('testimonials-carousel')) {
                const total = slides.length;
                const visibleNeighbors = 2;

                slides.forEach((slide, i) => {
                    const offset = i - index;
                    const abs = Math.abs(offset);

                    if (abs === 0) {
                        slide.style.opacity = '1';
                        slide.style.pointerEvents = 'auto';
                        slide.style.transform = 'translateX(-50%) translateZ(80px) rotateY(0deg)';
                    } else if (abs <= visibleNeighbors) {
                        const direction = offset < 0 ? -1 : 1;
                        const angle = direction * 28 * abs;
                        const x = direction * 220;
                        const z = -160 - 80 * (abs - 1);
                        const scale = 0.9 - 0.07 * (abs - 1);
                        slide.style.opacity = '0.45';
                        slide.style.pointerEvents = 'none';
                        slide.style.transform = `translateX(-50%) translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg) scale(${scale})`;
                    } else {
                        slide.style.opacity = '0';
                        slide.style.pointerEvents = 'none';
                        slide.style.transform = 'translateX(-50%) translateZ(-400px) rotateY(0deg)';
                    }
                });
            } else {
                const slideWidth = 100;
                inner.style.transform = `translateX(-${index * slideWidth}%)`;
            }
        }

        document.querySelectorAll('.scenarios-carousel').forEach((carousel) => {
            const inner = carousel.querySelector('.scenarios-carousel-inner');
            const slides = inner ? inner.querySelectorAll('.scenarios-slide') : [];
            const total = slides.length;
            carousel._scenarioIndex = 0;
            carousel._scenarioTotal = total;

            const prevBtn = carousel.querySelector('.scenarios-prev');
            const nextBtn = carousel.querySelector('.scenarios-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (total <= 1) return;
                    carousel._scenarioIndex = Math.max(0, carousel._scenarioIndex - 1);
                    updateCarouselTransform(carousel);
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (total <= 1) return;
                    carousel._scenarioIndex = Math.min(total - 1, carousel._scenarioIndex + 1);
                    updateCarouselTransform(carousel);
                });
            }
            updateCarouselTransform(carousel);
        });
    })();

    // ----- Project sliders (Stroygrad + Moduldom): horizontal drag-to-scroll -----
    (function setupProjectSliders() {
        const wraps = document.querySelectorAll('.project-slider-wrap');
        wraps.forEach((wrap) => {
            let isDown = false;
            let startX;
            let scrollLeft;

            wrap.addEventListener('mousedown', (e) => {
                isDown = true;
                wrap._didDrag = false;
                wrap.classList.add('is-dragging');
                startX = e.pageX - wrap.offsetLeft;
                scrollLeft = wrap.scrollLeft;
            });

            wrap.addEventListener('mouseleave', () => {
                isDown = false;
                wrap.classList.remove('is-dragging');
            });

            wrap.addEventListener('mouseup', () => {
                isDown = false;
                wrap.classList.remove('is-dragging');
            });

            wrap.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const x = e.pageX - wrap.offsetLeft;
                const walk = (x - startX) * 1.2;
                if (Math.abs(walk) > 5) wrap._didDrag = true;
                e.preventDefault();
                wrap.scrollLeft = scrollLeft - walk;
            });
        });
    })();

    // ----- Package descriptions (Базовый / Комфортный / Максимальный) -----
    (function setupPackageToggles() {
        const containers = document.querySelectorAll('.stroygrad-card-prices');
        if (!containers.length) return;

        containers.forEach((container) => {
            container.addEventListener('click', (e) => {
                const btn = e.target.closest('.price-package-toggle');
                if (!btn || !container.contains(btn)) return;
                e.preventDefault();

                const item = btn.closest('.price-package');
                if (!item) return;

                const isOpen = item.classList.contains('is-open');
                container.querySelectorAll('.price-package').forEach((pkg) =>
                    pkg.classList.remove('is-open')
                );
                if (!isOpen) {
                    item.classList.add('is-open');
                }
            });
        });
    })();

    // ----- Plan modal: "Посмотреть планировку" -----
    (function setupPlanModal() {
        const modal = document.getElementById('planModal');
        const backdrop = document.getElementById('planModalBackdrop');
        const closeBtn = document.getElementById('planModalClose');
        const titleEl = document.getElementById('planModalTitle');
        const imageEl = document.getElementById('planModalImage');
        const placeholderEl = document.getElementById('planModalPlaceholder');
        if (!modal || !backdrop || !closeBtn || !titleEl) return;

        function open(title) {
            if (titleEl) titleEl.textContent = title || 'Планировка';
            if (imageEl) {
                imageEl.innerHTML = '';
                imageEl.style.display = 'none';
            }
            if (placeholderEl) {
                placeholderEl.style.display = 'block';
                placeholderEl.textContent = 'Планировка проекта будет добавлена.';
            }
            modal.setAttribute('aria-hidden', 'false');
        }

        function close() {
            modal.setAttribute('aria-hidden', 'true');
        }

        document.querySelectorAll('.stroygrad-card-plan-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const wrap = btn.closest('.project-slider-wrap');
                if (wrap && wrap._didDrag) return;
                const plan = btn.getAttribute('data-plan') || 'Планировка';
                open(plan);
            });
        });

        backdrop.addEventListener('click', close);
        closeBtn.addEventListener('click', close);
    })();

    // ----- Slide 4: Location tabs + Yandex map (iframe, без API ключа) -----
    (function setupLocationTabs() {
        const rootEl = document.getElementById('locationTabs');
        const mapFrame = document.getElementById('yandexMapFrame');
        if (!rootEl || !mapFrame) return;

        const tabs = Array.from(rootEl.querySelectorAll('.location-tab'));
        const panels = Array.from(rootEl.querySelectorAll('.location-panel'));
        if (!tabs.length || !panels.length) return;

        const villageQuery = encodeURIComponent('Керчь, проезд Лазурного берега, 2');

        function updateMap(addressText) {
            if (!addressText) return;
            const destQuery = encodeURIComponent(`Керчь, ${addressText}`);
            const base =
                'https://yandex.ru/map-widget/v1/?z=13&l=map&lang=ru_RU&scroll=true&rtt=auto&rtext=';
            mapFrame.src = `${base}${villageQuery}~${destQuery}`;
        }

        function activate(tabName) {
            tabs.forEach((btn) => {
                const active = btn.dataset.tab === tabName;
                btn.classList.toggle('is-active', active);
            });
            panels.forEach((panel) => {
                const active = panel.dataset.tabPanel === tabName;
                panel.classList.toggle('is-active', active);
            });
        }

        tabs.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const name = btn.dataset.tab;
                if (!name) return;
                activate(name);
            });
        });

        // Клик по адресу — обновление карты
        const addressItems = rootEl.querySelectorAll('.location-items li');
        addressItems.forEach((li) => {
            li.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const span = li.querySelector('span');
                const address = span ? span.textContent.trim() : li.textContent.trim();
                updateMap(address);
            });
        });

        // Инициализация: активируем первый таб и показываем первый мед‑адрес
        const initial = tabs[0] && tabs[0].dataset.tab;
        if (initial) {
            activate(initial);
            const firstMedSpan = rootEl.querySelector(
                '.location-panel[data-tab-panel="med"] .location-items li span'
            );
            if (firstMedSpan) {
                updateMap(firstMedSpan.textContent.trim());
            }
        }
    })();

    // ----- Top 10 places: маршрут от КП Вилла Крым + фото локации 1:1 -----
    (function setupTop10Map() {
        const listEl = document.getElementById('top10PlacesList');
        const mapFrame = document.getElementById('top10MapFrame');
        const photoEl = document.getElementById('top10Photo');
        if (!listEl || !mapFrame || !photoEl) return;

        const villageQuery = encodeURIComponent('Керчь, проезд Лазурного берега, 2');
        const base = 'https://yandex.ru/map-widget/v1/?z=12&l=map&lang=ru_RU&scroll=true&rtt=auto&rtext=';

        function buildRouteUrl(dest) {
            const destQuery = encodeURIComponent(dest);
            return base + villageQuery + '~' + destQuery;
        }

        function setActivePlace(li) {
            listEl.querySelectorAll('li').forEach((item) => item.classList.remove('is-active'));
            li.classList.add('is-active');
            const dest = li.getAttribute('data-dest');
            const place = li.getAttribute('data-place') || '';
            if (dest) {
                mapFrame.src = buildRouteUrl(dest);
            }
            photoEl.className = 'top10-photo top10-photo--' + (place || 'mitridat');
        }

        listEl.querySelectorAll('li').forEach((li) => {
            li.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setActivePlace(li);
            });
        });

        const firstLi = listEl.querySelector('li.is-active') || listEl.querySelector('li');
        if (firstLi) {
            setActivePlace(firstLi);
        }
    })();

    // ----- Последний слайд: кнопки «Наши соцсети» -----
    (function setupContactSocialToggles() {
        document.querySelectorAll('.contact-block-social-btn').forEach((btn) => {
            const id = btn.getAttribute('aria-controls');
            const panel = id ? document.getElementById(id) : null;
            if (!panel) return;

            btn.addEventListener('click', () => {
                const isOpen = panel.classList.toggle('is-open');
                btn.setAttribute('aria-expanded', isOpen);
                panel.setAttribute('aria-hidden', !isOpen);
            });
        });
    })();

    // ----- Последний слайд: клик по адресу — карта с меткой (ll + pt) -----
    (function setupContactMap() {
        const mapFrame = document.getElementById('contactMapFrame');
        if (!mapFrame) return;

        const base = 'https://yandex.ru/map-widget/v1/?z=16&l=map&lang=ru_RU&scroll=true';
        const defaultPt = '36.404586,45.294491';

        function buildMapUrlWithMarker(pt) {
            return base + '&ll=' + pt + '&pt=' + pt + ',pm2rdm';
        }

        document.querySelectorAll('.contact-address-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pt = link.getAttribute('data-map-pt');
                if (!pt) return;
                mapFrame.src = buildMapUrlWithMarker(pt);
            });
        });

        mapFrame.src = buildMapUrlWithMarker(defaultPt);
    })();

    // ===== Theme switcher (BRANDBOOK / WHITE / STONE / WOOD) =====
    const themeButtons = document.querySelectorAll('.theme-btn');
    const detailToggle = document.getElementById('detailToggle');
    const root = document.documentElement;
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeArrow = document.getElementById('themeArrow');

    // Create background layers for each slide (used for themed photos)
    const slideBgLayers = [];
    slides.forEach((slide) => {
        const bg = document.createElement('div');
        bg.className = 'slide-bg-image';
        slide.insertBefore(bg, slide.firstChild);
        slideBgLayers.push(bg);
    });

    function updateThemeArrow(activeBtn) {
        if (!themeArrow || !themeSwitcher || !activeBtn) return;
        const switchRect = themeSwitcher.getBoundingClientRect();
        const labelEl = themeSwitcher.querySelector('.theme-style-title');
        if (!labelEl) return;
        const labelRect = labelEl.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();

        const startX = Math.max(
            0,
            labelRect.right - switchRect.left + 8
        );
        const endX = btnRect.left + btnRect.width / 2 - switchRect.left;
        const width = Math.max(40, endX - startX);

        themeArrow.style.left = `${startX}px`;
        themeArrow.style.width = `${width}px`;
    }

    const themeBackgrounds = {
        stone: [
            'images/stone-01.png',
            'images/stone-02.png',
            'images/stone-03.png',
            'images/stone-04.png',
            'images/stone-05.png',
            'images/stone-06.png',
            'images/stone-07.png',
            'images/stone-08.png',
            'images/stone-09.png',
            'images/stone-10.png',
            'images/stone-11.png',
            'images/stone-12.png',
            'images/stone-13.png'
        ],
        wood: [
            'images/wood-01.png',
            'images/wood-02.png',
            'images/wood-03.png',
            'images/wood-04.png',
            'images/wood-05.png',
            'images/wood-06.png',
            'images/wood-07.png',
            'images/wood-08.png',
            'images/wood-09.png',
            'images/wood-10.png',
            'images/wood-11.png',
            'images/wood-12.png',
            'images/wood-13.png'
        ]
    };

    let currentTheme = 'wood';

    function applyTheme(theme) {
        currentTheme = theme;
        root.setAttribute('data-theme', theme);

        let activeBtn = null;
        themeButtons.forEach((btn) => {
            const isActive = btn.dataset.theme === theme;
            btn.classList.toggle('active', isActive);
            if (isActive) activeBtn = btn;
        });

        if (activeBtn) {
            // slight timeout, чтобы учесть возможную анимацию layout при загрузке
            requestAnimationFrame(() => updateThemeArrow(activeBtn));
        }

        // Reset detail view when theme changes
        slides.forEach((slide) => slide.classList.remove('is-detail'));

        if (theme === 'brand' || theme === 'white') {
            slideBgLayers.forEach((bg) => {
                bg.style.backgroundImage = '';
            });
            if (detailToggle) {
                detailToggle.classList.remove('detail-toggle--visible');
            }
            return;
        }

        const images = themeBackgrounds[theme] || [];
        slideBgLayers.forEach((bg, index) => {
            const url = images[index] || images[images.length - 1] || '';
            bg.style.backgroundImage = url ? `url(${url})` : '';
        });

        if (detailToggle) {
            detailToggle.classList.add('detail-toggle--visible');
        }
    }

    if (themeButtons.length) {
        themeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                if (!theme || theme === currentTheme) return;
                applyTheme(theme);
            });
        });
        applyTheme('wood');
        // стартовая позиция стрелки (по активной теме по умолчанию)
        const initialActive = Array.from(themeButtons).find((btn) =>
            btn.classList.contains('active')
        );
        if (initialActive) {
            requestAnimationFrame(() => updateThemeArrow(initialActive));
        }
    }

    // Detail toggle: bring background photo to foreground for active slide
    if (detailToggle) {
        detailToggle.addEventListener('click', () => {
            if (currentTheme === 'brand') return;
            const currentIndex = Array.from(slides).findIndex((s) => s.classList.contains('is-active'));
            const targetSlide = slides[currentIndex] || slides[0];
            if (!targetSlide) return;

            const willBeDetail = !targetSlide.classList.contains('is-detail');
            slides.forEach((s) => s.classList.remove('is-detail'));
            if (willBeDetail) {
                targetSlide.classList.add('is-detail');
            }
        });
    }

    // Steps path toggle (MODULDOM vs STROYGRAD)
    (function setupStepsPathToggle() {
        const stepsLayout = document.querySelector('.steps-layout');
        if (!stepsLayout) return;
        const buttons = stepsLayout.querySelectorAll('.steps-path-btn');
        const branches = stepsLayout.querySelectorAll('.steps-branch');
        if (!buttons.length || !branches.length) return;

        function activate(path) {
            buttons.forEach((btn) => {
                btn.classList.toggle('is-active', btn.dataset.path === path);
            });
            branches.forEach((branch) => {
                branch.classList.toggle('is-active', branch.dataset.path === path);
            });
        }

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const path = btn.dataset.path;
                if (!path) return;
                activate(path);
            });
        });

        activate('moduldom');
    })();
})(); 