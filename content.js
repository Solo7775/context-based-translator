if (window.aiTranslatorContentScriptLoaded) {
    // Script already loaded
} else {
    window.aiTranslatorContentScriptLoaded = true;

    let overlay = null;

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "get_context") {
            const selection = window.getSelection();
            let context = "";
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                let parent = range.commonAncestorContainer;
                if (parent.nodeType === 3) { // Text node
                    parent = parent.parentNode;
                }
                context = parent.innerText || parent.textContent;
                // Limit context length to avoid excessive token usage
                if (context.length > 2000) {
                    context = context.substring(0, 2000);
                }
            }
            sendResponse({
                context: context,
                url: window.location.href
            });
        } else if (request.action === "show_loading") {
            showOverlay(request.text, "Analyzing and Translating...", true);
        } else if (request.action === "show_result") {
            updateOverlay(request.translated, request.explanation, false);
        } else if (request.action === "show_error") {
            updateOverlay(`Error: ${request.error}`, null, false, true);
        }
    });

    function createOverlay() {
        if (overlay) return overlay;

        const container = document.createElement('div');
        container.id = 'ai-translator-overlay';

        const header = document.createElement('div');
        header.className = 'ai-translator-header';

        const titleWrapper = document.createElement('div');
        titleWrapper.style.display = 'flex';
        titleWrapper.style.alignItems = 'center';

        const logo = document.createElement('img');
        logo.src = chrome.runtime.getURL('icons/icon48.png');
        logo.className = 'ai-translator-logo';

        const title = document.createElement('span');
        title.textContent = 'AI Translator';

        titleWrapper.appendChild(logo);
        titleWrapper.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'ai-translator-close';
        closeBtn.onclick = removeOverlay;

        header.appendChild(titleWrapper);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'ai-translator-content';

        container.appendChild(header);
        container.appendChild(content);

        document.body.appendChild(container);
        overlay = container;

        // Make draggable
        makeDraggable(container, header);

        return container;
    }

    function showOverlay(originalText, initialMessage, isLoading) {
        removeOverlay(); // Remove existing if any

        const container = createOverlay();
        const content = container.querySelector('.ai-translator-content');

        content.innerHTML = `
    <div class="ai-translator-original-wrapper">
        <div class="ai-translator-original">"${originalText.substring(0, 100)}${originalText.length > 100 ? '...' : ''}"</div>
        <button class="ai-translator-play-btn" title="Listen">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        </button>
    </div>
    <div class="ai-translator-result ${isLoading ? 'loading' : ''}">${initialMessage}</div>
  `;

        // Add click listener for play button
        const playBtn = container.querySelector('.ai-translator-play-btn');
        playBtn.onclick = (e) => {
            e.stopPropagation();
            const utterance = new SpeechSynthesisUtterance(originalText);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        };

        // Position near selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Calculate position (below selection, but keep in viewport)
            let top = rect.bottom + window.scrollY + 10;
            let left = rect.left + window.scrollX;

            // Adjust if off screen
            if (left + 300 > window.innerWidth) {
                left = window.innerWidth - 320;
            }

            container.style.top = `${top}px`;
            container.style.left = `${left}px`;
        }
    }

    function updateOverlay(text, explanation, isLoading, isError = false) {
        if (!overlay) return;

        const content = overlay.querySelector('.ai-translator-result');
        content.textContent = text;
        content.className = `ai-translator-result ${isLoading ? 'loading' : ''} ${isError ? 'error' : ''}`;

        // Handle explanation
        let explanationEl = overlay.querySelector('.ai-translator-explanation');
        if (explanation && !isLoading && !isError) {
            if (!explanationEl) {
                explanationEl = document.createElement('div');
                explanationEl.className = 'ai-translator-explanation';
                overlay.querySelector('.ai-translator-content').appendChild(explanationEl);
            }
            explanationEl.textContent = explanation;
            explanationEl.style.display = 'block';
        } else if (explanationEl) {
            explanationEl.style.display = 'none';
        }
    }

    function removeOverlay() {
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}
