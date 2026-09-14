"use strict";

const pageSlider = document.querySelector(".page-slider");

if (pageSlider) {
    const slides = pageSlider.querySelectorAll(".page-slide");
    const dots = pageSlider.querySelectorAll(".slider-dot");
    const previousButton = pageSlider.querySelector(".previous");
    const nextButton = pageSlider.querySelector(".next");

    let currentSlide = 0;
    let slideTimer = null;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function showSlide(index) {
        if (slides.length === 0) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === currentSlide;

            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === currentSlide;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlider() {
        if (reducedMotion || slides.length <= 1) {
            return;
        }

        stopSlider();

        slideTimer = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        if (slideTimer !== null) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    function restartSlider() {
        stopSlider();
        startSlider();
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            previousSlide();
            restartSlider();
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            nextSlide();
            restartSlider();
        });
    }

    dots.forEach((dot, dotIndex) => {
        dot.addEventListener("click", () => {
            showSlide(dotIndex);
            restartSlider();
        });
    });

    pageSlider.addEventListener("mouseenter", stopSlider);
    pageSlider.addEventListener("mouseleave", startSlider);

    pageSlider.addEventListener("focusin", stopSlider);
    pageSlider.addEventListener("focusout", (event) => {
        if (!pageSlider.contains(event.relatedTarget)) {
            startSlider();
        }
    });

    showSlide(0);
    startSlider();
}

/* ================================
   Page Transitions
================================ */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
    const internalLinks = document.querySelectorAll(
        'a[href]:not([target="_blank"]):not([download])'
    );

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const destination = link.href;
            const currentPage = window.location.href;

            const isSamePageLink =
                link.getAttribute("href").startsWith("#");

            const isExternalLink =
                link.origin !== window.location.origin;

            const isSameDestination =
                destination === currentPage;

            if (
                isSamePageLink ||
                isExternalLink ||
                isSameDestination
            ) {
                return;
            }

            event.preventDefault();

            document.body.classList.add(
                "page-transitioning-out"
            );

            setTimeout(() => {
                window.location.href = destination;
            }, 350);
        });
    });
}