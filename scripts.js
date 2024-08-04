document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    function applyTheme(primary, secondary, primaryName, secondaryName) {
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--secondary-color', secondary);
        document.body.style.backgroundColor = primary;
        document.body.style.color = secondary;

        const elements = document.querySelectorAll('.navbar, .navbar-left h1, .navbar-right a, .card, .preview-btn, h2');
        elements.forEach(el => {
            el.style.backgroundColor = secondary;
            el.style.color = primary;
        });

        // Special handling for the "Select a Theme" text
        const selectThemeText = document.querySelector('h2');
        if (selectThemeText) {
            selectThemeText.style.backgroundColor = 'transparent';
            selectThemeText.style.color = secondary;
        }

        // Update color info cards
        updateColorInfo(primary, secondary, primaryName, secondaryName);

        setupHoverEffects(primary, secondary);
    }

    function updateColorInfo(primary, secondary, primaryName, secondaryName) {
        const primaryCard = document.querySelector('.primary-color');
        const secondaryCard = document.querySelector('.secondary-color');

        primaryCard.querySelector('.color-name').textContent = primaryName;
        primaryCard.querySelector('.color-code').textContent = primary;
        primaryCard.style.backgroundColor = primary;
        primaryCard.style.color = secondary;

        secondaryCard.querySelector('.color-name').textContent = secondaryName;
        secondaryCard.querySelector('.color-code').textContent = secondary;
        secondaryCard.style.backgroundColor = secondary;
        secondaryCard.style.color = primary;
    }

    function setupHoverEffects(primary, secondary) {
        const hoverElements = document.querySelectorAll('.preview-btn, .card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseover', () => {
                el.style.backgroundColor = lightenDarkenColor(secondary, -20);  // Slightly darker
                el.style.color = primary;
                el.style.boxShadow = `0 0 10px ${lightenDarkenColor(primary, -20)}`;
            });
            el.addEventListener('mouseout', () => {
                el.style.backgroundColor = secondary;
                el.style.color = primary;
                el.style.boxShadow = 'none';
            });
        });
    }

    function lightenDarkenColor(col, amt) {
        let usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        let num = parseInt(col,16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
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
                const primaryName = themeLink.getAttribute('data-primary-name') || 'Primary';
                const secondaryName = themeLink.getAttribute('data-secondary-name') || 'Secondary';
                applyTheme(primary, secondary, primaryName, secondaryName);
                dropdownBtn.textContent = themeLink.textContent;
            }
        }
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const primary = event.target.getAttribute('data-primary');
            const secondary = event.target.getAttribute('data-secondary');
            const primaryName = event.target.getAttribute('data-primary-name') || 'Primary';
            const secondaryName = event.target.getAttribute('data-secondary-name') || 'Secondary';
            applyTheme(primary, secondary, primaryName, secondaryName);
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
        const primary = defaultTheme.getAttribute('data-primary');
        const secondary = defaultTheme.getAttribute('data-secondary');
        const primaryName = defaultTheme.getAttribute('data-primary-name') || 'Primary';
        const secondaryName = defaultTheme.getAttribute('data-secondary-name') || 'Secondary';
        applyTheme(primary, secondary, primaryName, secondaryName);
        dropdownBtn.textContent = defaultTheme.textContent;
    }
});