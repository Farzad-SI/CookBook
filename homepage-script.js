(function () {
    function getScrollParent(node) {
        if (!node) return window;
        var parent = node.parentElement;
        while (parent) {
            var style = getComputedStyle(parent);
            var overflowY = style.overflowY;
            if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return window;
    }

    function highlightStep(stepId) {
        var element = document.getElementById(stepId);
        if (!element) return;

        document.querySelectorAll('.sp-step-highlight').forEach(function (item) {
            item.classList.remove('sp-step-highlight');
        });

        var scrollParent = getScrollParent(element);
        if (scrollParent === window) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            var parentRect = scrollParent.getBoundingClientRect();
            var elRect = element.getBoundingClientRect();
            var offset = (elRect.top - parentRect.top) - (scrollParent.clientHeight / 2) + (elRect.height / 2);
            scrollParent.scrollBy({ top: offset, behavior: 'smooth' });
        }
        try {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}

        setTimeout(function () {
            element.classList.add('sp-step-highlight');
            setTimeout(function () {
                element.classList.remove('sp-step-highlight');
            }, 2200);
        }, 450);
    }

    function bindStepClicks(root) {
        var scope = root || document;
        var items = scope.querySelectorAll('[data-step-target]');

        items.forEach(function (item) {
            if (item.dataset.bound === 'true') return;
            item.dataset.bound = 'true';

            item.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var stepId = item.getAttribute('data-step-target');
                highlightStep(stepId);

                return false;
            });
        });
    }

    function init() {
        bindStepClicks();

        var observer = new MutationObserver(function (mutations) {
            var shouldRebind = false;
            mutations.forEach(function (m) {
                if (m.addedNodes && m.addedNodes.length) shouldRebind = true;
            });
            if (shouldRebind) bindStepClicks();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(function () {
            observer.disconnect();
        }, 20000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(bindStepClicks, 1000);
    setTimeout(bindStepClicks, 3000);
    setTimeout(bindStepClicks, 6000);
})();
