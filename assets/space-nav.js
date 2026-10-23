/**
 * Space Hub Navigation Anchor
 * Injects a floating retro-futuristic return button to navigate back to Space (index.html)
 */
(function() {
    if (document.getElementById('space-hub-nav')) return;

    const nav = document.createElement('a');
    nav.id = 'space-hub-nav';
    nav.href = '../index.html';
    nav.title = 'Return to Space (Esc)';
    nav.setAttribute('aria-label', 'Return to Space');
    nav.innerHTML = `
        <span class="space-hub-icon">✦</span>
        <span class="space-hub-text">SPACE</span>
    `;

    const style = document.createElement('style');
    style.textContent = `
        #space-hub-nav {
            position: fixed;
            top: 18px;
            left: 18px;
            z-index: 99999;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 8px 14px;
            background: rgba(10, 15, 25, 0.72);
            color: #d8e5f2;
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 999px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            text-decoration: none;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.28);
            transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
            user-select: none;
            cursor: pointer;
        }

        #space-hub-nav:hover {
            background: rgba(18, 28, 48, 0.9);
            color: #ffffff;
            border-color: rgba(0, 242, 255, 0.5);
            box-shadow: 0 0 16px rgba(0, 242, 255, 0.35), 0 4px 20px rgba(0, 0, 0, 0.4);
            transform: translateY(-1px) scale(1.02);
        }

        #space-hub-nav:active {
            transform: translateY(1px) scale(0.98);
        }

        #space-hub-nav .space-hub-icon {
            font-size: 13px;
            color: #00f2ff;
            transition: transform 0.3s ease;
            display: inline-block;
        }

        #space-hub-nav:hover .space-hub-icon {
            transform: rotate(90deg) scale(1.15);
        }

        @media (max-width: 600px) {
            #space-hub-nav {
                top: 12px;
                left: 12px;
                padding: 6px 10px;
                font-size: 10px;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(nav);

    // Keyboard shortcut: Esc to return to Space
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (activeTag !== 'input' && activeTag !== 'textarea') {
                window.location.href = '../index.html';
            }
        }
    });
})();
