const CHIMAjax = require('./chimmin/ajax');
const CHIMNode = require('./chimmin/dom');

const init = function init() {
    window.chim = function(selector) {
        return new CHIMNode(
            selector
        );
    };
    window.ajax = CHIMAjax;
};

init();

