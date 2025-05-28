document.addEventListener('DOMContentLoaded', () => {
    // Scroll-prompt functionaliteit
    const scrollPromptElement = document.getElementById('scrollPrompt');
    function checkScrollPromptVisibility() {
        if (scrollPromptElement) {
            if (window.scrollY < 2250) {
                scrollPromptElement.classList.add('visible');
            } else {
                scrollPromptElement.classList.remove('visible');
            }
        }
    }
    window.addEventListener('scroll', checkScrollPromptVisibility);
    window.addEventListener('load', checkScrollPromptVisibility); // Controleer ook bij laden

    // Klikbare scroll-prompt
    if (scrollPromptElement) {
        scrollPromptElement.addEventListener('click', (e) => {
            e.preventDefault();
            const firstAssignment = document.querySelector('.assignment');
            if (firstAssignment) {
                firstAssignment.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Parallax animatie
    const gedichtPre = document.querySelector('#gedichtContainer pre');
    const liedPre = document.querySelector('#liedContainer pre');
    window.addEventListener('scroll', () => {
        let scrollOffset = window.pageYOffset;
        const maxParallaxOffset = 15;
        if (gedichtPre) {
            let offset = Math.min(scrollOffset * 0.02, maxParallaxOffset);
            gedichtPre.style.transform = `translateY(${offset}px)`;
        }
        if (liedPre) {
            let offset = Math.min(scrollOffset * 0.02, maxParallaxOffset);
            liedPre.style.transform = `translateY(${offset}px)`;
        }
    });
});
