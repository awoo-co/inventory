// Simple button click handlers with alerts + D-pad navigation for KaiOS
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.inventory-grid');
    const buttons = Array.from(document.querySelectorAll('.cube-button'));
    const softkeyLeft = document.querySelector('.softkey-left');
    const softkeyRight = document.querySelector('.softkey-right');

    // Click handler shows alert
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const label = (button.textContent || button.innerText || '').trim();
            alert('You selected slot ' + label + '!');
        });
    });

    if (!buttons.length) return;

    // Ensure focus starts on the first button
    let focusedIndex = 0;
    buttons[0].focus();

    // Determine current column count matching CSS breakpoints
    function getColumnCount() {
        const w = window.innerWidth || document.documentElement.clientWidth;
        if (w <= 280) return 3;
        if (w <= 360) return 4;
        if (w <= 480) return 6;
        return 9;
    }

    function moveFocus(nextIndex) {
        if (nextIndex < 0 || nextIndex >= buttons.length) return;
        focusedIndex = nextIndex;
        buttons[focusedIndex].focus();
    }

    // Handle D-pad / keyboard
    document.addEventListener('keydown', (e) => {
        // Only handle if focus is within our grid
        const active = document.activeElement;
        const isInside = active && (active.classList && active.classList.contains('cube-button'));
        if (!isInside) return;

        const cols = getColumnCount();
        const idx = buttons.indexOf(active);
        if (idx === -1) return;

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                moveFocus(idx + 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moveFocus(idx - 1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveFocus(idx + cols);
                break;
            case 'ArrowUp':
                e.preventDefault();
                moveFocus(idx - cols);
                break;
            case 'Enter':
            case 'OK': // Some devices send 'OK'
                e.preventDefault();
                active.click();
                break;
            default:
                break;
        }
    });

    // Update focus position on resize so Down/Up stay aligned to grid
    window.addEventListener('resize', () => {
        // No-op: columns recalc on next key press via getColumnCount
    });

    // Softkey actions (KaiOS)
    function handleReload() {
        try { location.reload(); } catch (_) {}
    }
    function handleExit() {
        // Try to close; fallback to history/back or blank
        try { window.close(); } catch (_) {}
        try { history.back(); } catch (_) {}
        try { location.replace('about:blank'); } catch (_) {}
    }

    if (softkeyLeft) {
        softkeyLeft.addEventListener('click', handleReload);
        softkeyLeft.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'OK') handleReload();
        });
    }
    if (softkeyRight) {
        softkeyRight.addEventListener('click', handleExit);
        softkeyRight.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'OK') handleExit();
        });
    }

    // Global key handling for KaiOS softkeys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'SoftLeft') {
            e.preventDefault();
            handleReload();
        } else if (e.key === 'SoftRight') {
            e.preventDefault();
            handleExit();
        }
    });
});
