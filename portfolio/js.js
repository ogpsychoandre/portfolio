// Ativar efeito de colagem interativo ao fazer scroll
window.addEventListener('scroll', () => {
    const items = document.querySelectorAll('.polaroid-item');
    const triggerBottom = window.innerHeight / 5 * 4;

    items.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;

        if(itemTop < triggerBottom) {
            item.style.opacity = '1';
        }
    });
});

// Scroll suave para as âncoras da página
document.querySelectorAll('.navbar nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Lógica do Slideshow Automático da Secção About
function startAboutSlideshow() {
    const slides = document.querySelectorAll('.about-slideshow-container .slide-img');
    if (slides.length === 0) return; // Proteção caso não existam imagens

    let currentSlide = 0;
    const slideInterval = 3000; // Tempo em milissegundos (3 segundos por imagem)

    setInterval(() => {
        // Remove a classe ativa da imagem atual
        slides[currentSlide].classList.remove('active');

        // Avança para a próxima imagem (e volta a 0 se chegar ao fim)
        currentSlide = (currentSlide + 1) % slides.length;

        // Adiciona a classe ativa à nova imagem
        slides[currentSlide].classList.add('active');
    }, slideInterval);
}

// Inicia o slideshow assim que a página estiver carregada
document.addEventListener('DOMContentLoaded', startAboutSlideshow);



// ==========================================================================
// ABOUT ME — SEQUENTIAL SLIDE-IN COM POSIÇÕES FINAIS ESCALONADAS
// Cada imagem desliza da direita e fica deslocada — como fotos em leque
// ==========================================================================

window.addEventListener('scroll', () => {
    const aboutContainer = document.querySelector('.about-sticky-container');
    const slide1 = document.querySelector('.slide-1');
    const slide2 = document.querySelector('.slide-2');
    const slide3 = document.querySelector('.slide-3');

    if (!aboutContainer) return;

    const rect = aboutContainer.getBoundingClientRect();
    const containerHeight = aboutContainer.scrollHeight - window.innerHeight;

    let progress = -rect.top / containerHeight;
    progress = Math.max(0, Math.min(1, progress));

    // Cada slide tem:
    // start/end: quando anima (0 a 1 = início ao fim do scroll da secção)
    // finalX: posição X final em % (0 = sem deslocamento extra, negativo = mais à esquerda)
    // finalY: posição Y final em % para deslocar verticalmente
    // rot: rotação final em graus
    // scale: escala final (< 1 = mais pequeno, permite ver as outras por baixo)
    const slides = [
        {
            el: slide1,
            start: 0.00, end: 0.28,
            finalX: -18,   // fica mais à esquerda
            finalY: 0,    // ligeiramente acima
            rot: -4,
            scale: 0.78,
            zIndex: 1
        },
        {
            el: slide2,
            start: 0.22, end: 0.55,
            finalX: 0,    // centro
            finalY: 0,    // ligeiramente abaixo
            rot: 2,
            scale: 0.85,
            zIndex: 2
        },
        {
            el: slide3,
            start: 0.48, end: 0.88,
            finalX: 19,   // mais à direita
            finalY: 0,
            rot: -1.5,
            scale: 0.80,
            zIndex: 3
        },
    ];

    slides.forEach(({ el, start, end, finalX, finalY, rot, scale, zIndex }) => {
        if (!el) return;

        let p = (progress - start) / (end - start);
        p = Math.max(0, Math.min(1, p));

        // Easing suave (ease-out cubic)
        const eased = 1 - Math.pow(1 - p, 3);

        // Slide da direita (110%) para a posição final (finalX%)
        const translateX = 110 + (finalX - 110) * eased;
        const translateY = finalY * eased;
        const currentRot  = rot * eased;
        const currentScale = 1 + (scale - 1) * eased;
        const opacity = Math.min(1, eased * 2);

        el.style.transform = `translate(${translateX}%, ${translateY}%) rotate(${currentRot}deg) scale(${currentScale})`;
        el.style.opacity   = opacity;
        el.style.zIndex    = zIndex;
    });
});


// ==========================================================================
// PROJECTS — 3 FASES: ZOOM IN → JUNTAR → SLIDE UP SEQUENCIAL
// ==========================================================================

window.addEventListener('scroll', () => {
    const container = document.querySelector('.projects-sticky-container');
    if (!container) return;

    const items = document.querySelectorAll('.project-card');
    if (items.length === 0) return;

    const rect = container.getBoundingClientRect();
    const containerHeight = container.scrollHeight - window.innerHeight;
    let progress = -rect.top / containerHeight;
    progress = Math.max(0, Math.min(1, progress));

    const total = items.length;

    // --- FASE 1: ZOOM IN (0 → 0.25) ---
    // Cada card nasce pequeno e espalhado, cresce para o seu lugar
    // --- FASE 2: JUNTAR (0.25 → 0.45) ---
    // Convergem todos para o centro, formando uma pilha
    // --- FASE 3: SLIDE UP (0.45 → 1.0) ---
    // Cada card sai pelo topo sequencialmente, revelando o próximo

    // Posições iniciais espalhadas (como na referência)
    const spreadPositions = [
        { x: -38, y: -20, rot: -8,  scale: 0.55 },
        { x:   0, y:  15, rot:  3,  scale: 0.60 },
        { x:  36, y: -18, rot:  6,  scale: 0.52 },
    ];

    const PHASE1_END   = 0.25;
    const PHASE2_END   = 0.45;
    const PHASE3_START = 0.45;
    const PHASE3_END   = 1.00;

    items.forEach((item, index) => {
        const spread = spreadPositions[index] || { x: 0, y: 0, rot: 0, scale: 0.5 };

        if (progress < PHASE1_END) {
            // FASE 1: cada card faz zoom in a partir de escala 0
            let p = progress / PHASE1_END;
            // delay sequencial: card 0 começa em 0, card 1 em 0.1, card 2 em 0.2
            const delay = index * 0.12;
            p = Math.max(0, (p - delay) / (1 - delay));
            const eased = 1 - Math.pow(1 - p, 3);

            const currentScale = spread.scale * eased;
            const currentX     = spread.x * eased;
            const currentY     = spread.y * eased;
            const currentRot   = spread.rot * eased;
            const opacity      = Math.min(1, eased * 1.5);

            item.style.transform = `translate(calc(-50% + ${currentX}%), calc(-50% + ${currentY}%)) rotate(${currentRot}deg) scale(${currentScale})`;
            item.style.opacity   = opacity;
            item.style.zIndex    = index + 1;

        } else if (progress < PHASE2_END) {
            // FASE 2: convergem para o centro (x→0, y→0, rot→0, scale→1)
            let p = (progress - PHASE1_END) / (PHASE2_END - PHASE1_END);
            const eased = 1 - Math.pow(1 - p, 2);

            const currentX     = spread.x * (1 - eased);
            const currentY     = spread.y * (1 - eased);
            const currentRot   = spread.rot * (1 - eased);
            const currentScale = spread.scale + (1 - spread.scale) * eased;

            item.style.transform = `translate(calc(-50% + ${currentX}%), calc(-50% + ${currentY}%)) rotate(${currentRot}deg) scale(${currentScale})`;
            item.style.opacity   = 1;
            // z-index reverso: o último card fica no topo para slide up
            item.style.zIndex    = total - index;

        } else {
            // FASE 3: slide up sequencial
            // Cada card tem uma janela de scroll proporcional
            const phaseRange = PHASE3_END - PHASE3_START;
            const slotSize   = phaseRange / total;
            const slotStart  = PHASE3_START + index * slotSize;
            const slotEnd    = slotStart + slotSize;

            let p = (progress - slotStart) / (slotEnd - slotStart);
            p = Math.max(0, Math.min(1, p));
            const eased = p < 0.5
                ? 2 * p * p
                : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease-in-out quad

            // Sai pelo topo: translateY vai de 0% a -120%
            const translateY = -120 * eased;

            item.style.transform = `translate(calc(-50% + 0%), calc(-50% + ${translateY}%)) rotate(0deg) scale(1)`;
            item.style.opacity   = 1 - (eased > 0.85 ? (eased - 0.85) / 0.15 : 0);
            item.style.zIndex    = total - index;
        }
    });
});

// ==========================================================================
// BG VIDEO — Só faz play quando a secção de projetos entra no viewport
// ==========================================================================

const bgVideo = document.querySelector('.projects-sticky-wrapper video');

if (bgVideo) {
    bgVideo.muted = true; // necessário para autoplay funcionar no browser

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bgVideo.play();
            } else {
                bgVideo.pause();
            }
        });
    }, {
        threshold: 0.1 // começa quando 10% da secção está visível
    });

    observer.observe(document.querySelector('.projects-sticky-container'));
}




// ==========================================================================
// NAVLINE — linha animada por scroll entre about me / projects / contact
// ==========================================================================

(function () {
    const container = document.getElementById('navlineContainer');
    if (!container) return;

    const pathEl  = document.getElementById('navlinePath');
    const dotEl   = document.getElementById('navlineDot');
    const stamps  = [0, 1, 2].map(i => document.getElementById('ns' + i));
    const wordEls = [0, 1, 2].map(i => document.getElementById('nw' + i));

    // % do scroll da secção em que cada stamp aparece
    const STAMP_AT   = [0.12, 0.42, 0.72];
    // % do scroll em que as letras explodem
    const EXPLODE_AT = [0.32, 0.60, 0.88];

    let stampDone   = [false, false, false];
    let explodeDone = [false, false, false];
    let pathLen     = 0;

    // --- constrói o path SVG com base nas posições reais das palavras ---
    function buildPath() {
        const W = window.innerWidth;
        const H = window.innerHeight;

        const centers = wordEls.map(w => {
            const r = w.getBoundingClientRect();
            return r.left + r.width / 2;
        });

        const y = H * 0.56;

        const d = `
            M ${-60},${y + 70}
            C ${centers[0] - 200},${y + 20}
              ${centers[0] - 60},${y - 50}
              ${centers[0]},${y - 8}
            C ${centers[0] + 90},${y + 30}
              ${(centers[0] + centers[1]) / 2 - 40},${y + 40}
              ${centers[1]},${y}
            C ${centers[1] + 80},${y - 40}
              ${(centers[1] + centers[2]) / 2},${y - 30}
              ${centers[2]},${y - 12}
            C ${centers[2] + 110},${y + 10}
              ${W + 60},${y - 40}
              ${W + 140},${y - 90}
        `.trim();

        pathEl.setAttribute('d', d);

        const len = pathEl.getTotalLength();
        pathEl.setAttribute('stroke-dasharray', len);
        pathEl.setAttribute('stroke-dashoffset', len);
        return len;
    }

    // --- easing ---
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // --- explode letras de uma palavra ---
    function explodeLetters(idx) {
        const letters = wordEls[idx].querySelectorAll('.navline-letters span');
        letters.forEach((l, i) => {
            const spread = (i - letters.length / 2) * 30 + (Math.random() - 0.5) * 20;
            const drop   = 70 + Math.random() * 60;
            const rot    = (Math.random() - 0.5) * 35;
            l.style.transition = `transform 0.55s cubic-bezier(0.4,0,1,1) ${i * 35}ms,
                                  opacity   0.45s ease                      ${i * 35}ms`;
            l.style.transform  = `translate(${spread}px, ${drop}px) rotate(${rot}deg)`;
            l.style.opacity    = '0';
        });
    }

    // --- repõe letras (ao fazer scroll para trás) ---
    function resetLetters(idx) {
        const letters = wordEls[idx].querySelectorAll('.navline-letters span');
        letters.forEach(l => {
            l.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
            l.style.transform  = 'none';
            l.style.opacity    = '1';
        });
    }

    // --- loop de scroll ---
    function onScroll() {
        const rect       = container.getBoundingClientRect();
        const scrollable = container.scrollHeight - window.innerHeight;
        const p          = Math.max(0, Math.min(1, -rect.top / scrollable));

        // progresso da linha
        const eased  = easeInOut(Math.min(p / 0.96, 1));
        const offset = pathLen * (1 - eased);
        pathEl.setAttribute('stroke-dashoffset', offset);

        // ponto que segue a linha
        if (p > 0.01 && pathLen > 0) {
            const pt = pathEl.getPointAtLength(eased * pathLen);
            dotEl.setAttribute('cx', pt.x);
            dotEl.setAttribute('cy', pt.y);
            dotEl.setAttribute('opacity', '1');
        } else {
            dotEl.setAttribute('opacity', '0');
        }

        // stamps e explosões
        for (let i = 0; i < 3; i++) {
            // stamp aparece
            if (p >= STAMP_AT[i] && !stampDone[i]) {
                stampDone[i] = true;
                stamps[i].classList.add('visible');
            }
            // stamp desaparece (scroll para trás)
            if (p < STAMP_AT[i] && stampDone[i]) {
                stampDone[i] = false;
                stamps[i].classList.remove('visible');
                if (explodeDone[i]) {
                    explodeDone[i] = false;
                    resetLetters(i);
                }
            }
            // letras explodem
            if (p >= EXPLODE_AT[i] && !explodeDone[i]) {
                explodeDone[i] = true;
                explodeLetters(i);
            }
        }
    }

    // --- init ---
    function init() {
        requestAnimationFrame(() => {
            pathLen = buildPath();
            onScroll();
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        pathLen = buildPath();
        onScroll();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();




// ==========================================================================
// FREEMADE — scroll horizontal via scroll vertical
// Pinturas: esquerda → direita
// Vídeos:   direita → esquerda (sentido oposto)
// ==========================================================================

(function () {

    // --- PINTURAS ---
    const paintingsContainer = document.getElementById('freemadePaintings');
    const paintingsTrack     = document.getElementById('paintingsTrack');


    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function getProgress(container) {
        if (!container) return 0;
        const rect       = container.getBoundingClientRect();
        const scrollable = container.scrollHeight - window.innerHeight;
        return Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    function animatePaintings() {
        if (!paintingsContainer || !paintingsTrack) return;

        const p = getProgress(paintingsContainer);
        const eased = easeOut(p);

        // distância máxima a percorrer: largura total do track menos a largura do viewport
        const trackW   = paintingsTrack.scrollWidth;
        const viewW    = window.innerWidth;
        const maxShift = trackW - viewW + 120; // +padding

        const translateX = -(eased * maxShift);
        paintingsTrack.style.transform = `translateX(${translateX}px)`;
    }



    function onScroll() {
        animatePaintings();

    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onScroll);
    } else {
        onScroll();
    }

})();

// ==========================================================================
// VÍDEOS FREEMADE — mute/unmute, um de cada vez
// Todos começam muted e em autoplay
// Clicar no botão desmutar um muta automaticamente os outros
// ==========================================================================

(function () {

    // autoplay de todos os vídeos assim que a secção entra no viewport
    const videoItems = document.querySelectorAll('.freemade-videos-container .video-item');
    if (!videoItems.length) return;

    // IntersectionObserver para dar play quando visíveis
    const playObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.2 });

    videoItems.forEach(item => playObserver.observe(item));

    // mute/unmute — um de cada vez
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        const btn   = item.querySelector('.video-unmute-btn');
        if (!video || !btn) return;

        video.muted  = true;
        video.volume = 1;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const isCurrentlyMuted = video.muted;

            if (isCurrentlyMuted) {
                // muta todos os outros primeiro
                videoItems.forEach(other => {
                    if (other === item) return;
                    const v = other.querySelector('video');
                    if (v) v.muted = true;
                    other.classList.remove('is-unmuted');
                });

                // desmutar este
                video.muted = false;
                item.classList.add('is-unmuted');

            } else {
                // mutar este
                video.muted = true;
                item.classList.remove('is-unmuted');
            }
        });
    });

})();
// ==========================================================================
// FREEMADE VÍDEOS — scroll horizontal sentido oposto
// ==========================================================================

(function () {
    const videosContainer = document.getElementById('freemadeVideos');
    const videosTrack     = document.getElementById('videosTrack');
    if (!videosContainer || !videosTrack) return;

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function onScroll() {
        const rect       = videosContainer.getBoundingClientRect();
        const scrollable = videosContainer.scrollHeight - window.innerHeight;
        const p          = Math.max(0, Math.min(1, -rect.top / scrollable));
        const eased      = easeOut(p);

        const trackW   = videosTrack.scrollWidth;
        const viewW    = window.innerWidth;
        const maxShift = trackW - viewW + 200;

        // começa deslocado à direita e move para a esquerda
        const startOffset = maxShift * 0.5;
        const translateX  = startOffset - (eased * maxShift);
        videosTrack.style.transform = `translateX(${translateX}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

(function () {
    const videosContainer = document.getElementById('freemadeVideos2');
    const videosTrack     = document.getElementById('videosTrack2');
    if (!videosContainer || !videosTrack) return;

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function onScroll() {
        const rect       = videosContainer.getBoundingClientRect();
        const scrollable = videosContainer.scrollHeight - window.innerHeight;
        const p          = Math.max(0, Math.min(1, -rect.top / scrollable));
        const eased      = easeOut(p);

        const trackW     = videosTrack.scrollWidth;
        const viewW      = window.innerWidth;
        const maxShift   = trackW - viewW + 200;

        // este vai da esquerda para a direita (sentido normal)
        const translateX = -(eased * maxShift);
        videosTrack.style.transform = `translateX(${translateX}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ==========================================================================
// SONDER — controlos de vídeo
// ==========================================================================
(function () {
    const video    = document.getElementById('sonderVideo');
    const btnPlay  = document.getElementById('sonderPlay');
    const btnMute  = document.getElementById('sonderMute');
    const progress = document.getElementById('sonderProgress');
    const volume   = document.getElementById('sonderVolume');
    if (!video) return;

    video.muted  = true;
    video.volume = 1;

    // play / pause
    btnPlay.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            btnPlay.classList.add('is-playing');
        } else {
            video.pause();
            btnPlay.classList.remove('is-playing');
        }
    });

    // mute / unmute
    btnMute.addEventListener('click', () => {
        video.muted = !video.muted;
        btnMute.classList.toggle('is-unmuted', !video.muted);
        volume.value = video.muted ? 0 : video.volume;
    });

    // volume slider
    volume.addEventListener('input', () => {
        video.volume = parseFloat(volume.value);
        video.muted  = volume.value == 0;
        btnMute.classList.toggle('is-unmuted', !video.muted);
    });

    // progresso em tempo real
    video.addEventListener('timeupdate', () => {
        if (!video.duration) return;
        progress.value = (video.currentTime / video.duration) * 100;
    });

    // scrubbing
    progress.addEventListener('input', () => {
        if (!video.duration) return;
        video.currentTime = (parseFloat(progress.value) / 100) * video.duration;
    });
})();