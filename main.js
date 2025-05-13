document.addEventListener('DOMContentLoaded', () => {
    // Scroll-prompt functionaliteit
    const scrollPromptElement = document.getElementById('scrollPrompt');
    function checkScrollPromptVisibility() {
        if (scrollPromptElement) {
            if (window.scrollY < 50) {
                scrollPromptElement.classList.add('visible');
            } else {
                scrollPromptElement.classList.remove('visible');
            }
        }
    }
    window.addEventListener('scroll', checkScrollPromptVisibility);
    window.addEventListener('load', checkScrollPromptVisibility);

    // Klikbare scroll-prompt die smooth naar de eerste assignment box scrolt
    scrollPromptElement.addEventListener('click', (e) => {
        e.preventDefault();
        // Zoek de eerste .assignment in het document
        const firstAssignment = document.querySelector('.assignment');
        if (firstAssignment) {
            firstAssignment.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Beeldspraak interactie voor emoji - nu robuust, werkt altijd!
    document.querySelectorAll('.beeldspraak').forEach(el => {
        const origineleInhoud = el.innerHTML;
        const typeBeeldspraak = el.dataset.type;
        let isHovering = false;

        // Gebruik mouseover/mouseout zodat het ook werkt als je over mark of br gaat
        el.addEventListener('mouseover', (event) => {
            if (isHovering) return;
            isHovering = true;
            if (typeBeeldspraak) {
                el.innerHTML = `<mark style="font-size:1.4em;display:inline-block;text-align:center;width:100%">${typeBeeldspraak}</mark>`;
            }
        });
        el.addEventListener('mouseout', (event) => {
            // Alleen terugzetten als je echt buiten de .beeldspraak span gaat
            if (!el.contains(event.relatedTarget)) {
                el.innerHTML = origineleInhoud;
                isHovering = false;
            }
        });
    });

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