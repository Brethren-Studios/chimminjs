import chimAJAX from './chimmin/ajax/ajax';
import chimDOM from './chimmin/dom/dom';

const init = function init() {
    window.chim = function(selector) {
        return chimDOM(selector);
    };
    window.chim.go = chimAJAX;
};

init();
