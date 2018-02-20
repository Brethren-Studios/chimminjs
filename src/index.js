const AjaxService = require('./chimmin/ajax');
const bindToHTMLElementProto = require('./chimmin/dom');

const init = function init() {
    window.chimmin = function() {
        bindToHTMLElementProto();
        window.ajax = AjaxService;
    };
};

init();

