document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    function applyTheme(primary, secondary) {
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--secondary-color', secondary);
        document.body.style.backgroundColor = primary;
        document.body.style.color = secondary;
        const elements = document.querySelectorAll('.navbar, .navbar-left h1, .navbar-right a, .card, .preview-btn');
        elements.forEach(el => {
            el.style.backgroundColor = secondary;
            el.style.color = primary;
        });
        setupHoverEffects();
    }

    function setupHoverEffects() {
        const hoverElements = document.querySelectorAll('.preview-btn, .card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseover', () => {
                el.style.backgroundColor = 'var(--primary-color)';
                el.style.color = 'var(--secondary-color)';
            });
            el.addEventListener('mouseout', () => {
                el.style.backgroundColor = 'var(--secondary-color)';
                el.style.color = 'var(--primary-color)';
            });
        });
    }

    function saveTheme(theme) {
        localStorage.setItem('selectedTheme', theme);
    }

    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            const themeLink = document.querySelector(`[data-theme="${savedTheme}"]`);
            if (themeLink) {
                const primary = themeLink.getAttribute('data-primary');
                const secondary = themeLink.getAttribute('data-secondary');
                applyTheme(primary, secondary);
                dropdownBtn.textContent = themeLink.textContent;
            }
        }
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const primary = event.target.getAttribute('data-primary');
            const secondary = event.target.getAttribute('data-secondary');
            applyTheme(primary, secondary);
            dropdownBtn.textContent = event.target.textContent;
            saveTheme(event.target.getAttribute('data-theme'));
            dropdownContent.style.display = 'none';
        });
    });

    dropdownBtn.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownContent.style.display = 'none';
        }
    });

    // Apply default theme or load saved theme
    loadSavedTheme();
    if (!localStorage.getItem('selectedTheme')) {
        const defaultTheme = dropdownLinks[0];
        applyTheme(defaultTheme.getAttribute('data-primary'), defaultTheme.getAttribute('data-secondary'));
        dropdownBtn.textContent = defaultTheme.textContent;
    }
});