// Función para aplicar un estilo de fondo
function applyBackgroundStyle(styleNumber) {
    const root = document.documentElement;
    switch (styleNumber) {
        case 1:
            root.style.setProperty('--current-bg', 'var(--bg-style-1)');
            break;
        case 2:
            root.style.setProperty('--current-bg', 'var(--bg-style-2)');
            break;
        case 3:
            root.style.setProperty('--current-bg', 'var(--bg-style-3)');
            break;
        case 4:
            root.style.setProperty('--current-bg', 'var(--bg-style-4)');
            break;
        default:
            root.style.setProperty('--current-bg', 'var(--bg-style-1)');
    }
}

// Función para aplicar un color
function applyColor(colorNumber) {
    const root = document.documentElement;
    switch (colorNumber) {
        case 1:
            root.style.setProperty('--current-color', 'var(--color-1)');
            break;
        case 2:
            root.style.setProperty('--current-color', 'var(--color-2)');
            break;
        case 3:
            root.style.setProperty('--current-color', 'var(--color-3)');
            break;
        case 4:
            root.style.setProperty('--current-color', 'var(--color-4)');
            break;
        case 5:
            root.style.setProperty('--current-color', 'var(--color-5)');
            break;
        case 6:
            root.style.setProperty('--current-color', 'var(--color-6)');
            break;
        default:
            root.style.setProperty('--current-color', 'var(--color-1)');
    }
}

// Ejemplo de uso
applyBackgroundStyle(0); // Aplica el fondo degradado
applyColor(3); // Aplica un color
