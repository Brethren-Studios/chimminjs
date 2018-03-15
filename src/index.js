const CHIMAjax = require('./chimmin/ajax');
const CHIMNode = require('./chimmin/dom');

const init = function init() {
    window.chim = function(selector) {
        if (selector.constructor.name === 'HTMLDocument' || selector.nodeName === '#document') {
            const CHIMDoc = function(doc) {
                return {
                    onReady: function onReady(init) {
                        doc.addEventListener('DOMContentLoaded', init);
                    }
                };
            };
            return CHIMDoc(
                selector
                );
        } else {
            return new CHIMNode(
                selector
                );
        }
        
    };

    window.chim.go = CHIMAjax;
};

init();

