export default (function() {  
     /* DOM Lite */


    /**
     *
     * @param init
     */
    HTMLDocument.prototype.onReady = function onReady(init) {
        this.addEventListener('DOMContentLoaded', init);
    };

    
    HTMLElement.prototype.addClass = function addClass(className) {
        if (!className) {
            throw Error('You must provide a class name.');
        }
        this.classList.add(className);
    };

    HTMLElement.prototype.addClasses = function addClasses(...args) {
        if (!args) {
            throw Error('You must provide at least one class name.');
        }
        args.forEach((className) => {
            this.classList.add(className);
        });
    };

    HTMLElement.prototype.removeClass = function removeClass(className) {
        if (!className) {
            throw Error('You must provide a class name.');
        }
        this.classList.remove(className);
    };

    HTMLElement.prototype.toggleClass = function toggleClass(className, bool) {
        if (bool === undefined) {
            throw Error('Bool argument required.');
        }
        if (bool) {
            this.classList.add(className);
        } else {
            this.classList.remove(className);
        }
    };

    HTMLElement.prototype.applyCss = function applyCss(prop, value) {
        if (!prop || !value) {
            throw Error('You must provide a property and value.');
        }
        this.style[prop] = value;
    };


    HTMLElement.prototype.onClick = function onClick(handler, options) {
        this.addEventListener('click', handler, options || false);
    };

    HTMLElement.prototype.onKeyup = function onKeyup(handler) {
        this.addEventListener('keyup', handler);
    };
});