const chimAJAX = require('./chimmin/ajax/ajax');
const chimDOM = require('./chimmin/dom/dom');

const init = function init() {
    window.chim = function(selector) {
        return chimDOM(selector);
    };
    window.chim.go = chimAJAX;
};

init();

