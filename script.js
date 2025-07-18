document.addEventListener("DOMContentLoaded", function () {
    /* Controle do Cabeçalho e Menu Mobile */
    const header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    const mobileMenuIcon = document.querySelector(".mobile-menu-icon");
    const mainNav = document.querySelector(".main-nav");

    if (mobileMenuIcon && mainNav) {
        mobileMenuIcon.addEventListener("click", () => {
            mobileMenuIcon.classList.toggle("active");
            mainNav.classList.toggle("active");
        });
    }

    /* Navegação e Rolagem Suave (para a Landing Page Única) */
    document.querySelectorAll('.main-nav a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector(".header").offsetHeight;
                // Ajusta o offset para o scroll-reveal ou para a visualização ideal
                const offset =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight -
                    20;

                window.scrollTo({
                    top: offset,
                    behavior: "smooth",
                });

                if (mainNav.classList.contains("active")) {
                    // Fecha o menu mobile após clicar em um link interno
                    mainNav.classList.remove("active");
                    mobileMenuIcon.classList.remove("active");
                }
            }
        });
    });

    /* Ativar link da seção visível na navegação */
    const sections = document.querySelectorAll("section[id], footer[id]"); // Seleciona todas as seções e o footer com ID
    const navLinks = document.querySelectorAll(".main-nav ul li a");

    const observerOptionsNav = {
        root: null,
        rootMargin: "-50% 0px -49% 0px", // Ativa o link quando a seção está no meio da tela
        threshold: 0,
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptionsNav);

    sections.forEach((section) => {
        navObserver.observe(section);
    });

    /* Animação Scroll Reveal */
    const scrollRevealElements = document.querySelectorAll(".scroll-reveal");

    const observerOptionsReveal = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // O elemento é revelado quando 10% dele está visível
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target); // Parar de observar depois de revelar
            }
        });
    }, observerOptionsReveal);

    scrollRevealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    /* Carrossel de Projetos */
    const carousel = document.querySelector(".project-carousel");
    const carouselItems = document.querySelectorAll(
        ".project-carousel .carousel-item"
    );
    const dotsContainer = document.querySelector(".carousel-nav-dots");
    const prevArrow = document.querySelector(".prev-arrow");
    const nextArrow = document.querySelector(".next-arrow");
    let currentIndex = 0;
    let autoSlideInterval;

    if (carouselItems.length > 0) {
        // Cria os pontos de navegação
        carouselItems.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                moveToSlide(index);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".carousel-nav-dots .dot");

        // Garante que o carousel se ajusta para mostrar apenas 1 item por vez com overflow hidden
        carousel.style.display = "flex";
        carousel.style.transition = "none"; // Temporariamente desativa a transição para ajuste inicial

        function moveToSlide(index) {
            if (index >= carouselItems.length) {
                index = 0;
            } else if (index < 0) {
                index = carouselItems.length - 1;
            }
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
            currentIndex = index;
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 5000); // Muda a cada 5 segundos
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Adiciona event listeners para as setas
        if (prevArrow && nextArrow) {
            prevArrow.addEventListener("click", () => {
                moveToSlide(currentIndex - 1);
                resetAutoSlide();
            });
            nextArrow.addEventListener("click", () => {
                moveToSlide(currentIndex + 1);
                resetAutoSlide();
            });
        }

        // Inicia o carrossel automaticamente
        startAutoSlide();

        // Pausar slide ao passar o mouse e reiniciar ao tirar
        carousel.addEventListener("mouseenter", () =>
            clearInterval(autoSlideInterval)
        );
        carousel.addEventListener("mouseleave", () => startAutoSlide());

        // Ativa a transição suave após o ajuste inicial
        setTimeout(() => {
            carousel.style.transition = "transform 0.5s ease-in-out";
        }, 100);
    }
});