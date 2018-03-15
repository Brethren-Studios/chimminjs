/**
 *
 * @param selector {string|Object} - represents HTML node(s)
 * @constructor
 */
const CHIMNode = function(selector) {
    if (typeof selector !== 'string' &&
        selector.constructor.__proto__.name !== 'HTMLElement')
    {
        throw Error('A CHIMNode needs a selector.');
    }

    // private methods
    this._init = function (selector) {
        if (typeof selector === 'string') {
            if (selector[0] === '#') {
                return document.getElementById(selector.substring(1));
            }
            if (selector[0] === '.') {
                this._isHTMLCollection = true;
                return Array.from(document.getElementsByClassName(selector.substring(1)));
            } else {
                this._isHTMLCollection = true;
                return Array.from(document.getElementsByTagName(selector));
            } 
        } else {
            return selector;
        }
    };

    // private variables
    this._isHTMLCollection = false;

    // init node
    this._node = this._init(selector);
};

// public methods
CHIMNode.prototype = {
    appendTo: function appendTo(chim) {
        if (typeof chim !== 'object') {
            throw Error('You can only append to another CHIMNode');
        }
        if (this._isHTMLCollection || chim._isHTMLCollection) {
            throw Error('You cannot append an HTMLCollection.');
        }

        chim._node.appendChild(this._node);
    },

    remove: function remove() {
        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.parentElement.removeChild(el);
            });
        } else {
            this._node.parentElement.removeChild(this._node);
        }
    },

    addClass: function addClass(className) {
        if (!className) {
            throw Error('You must provide a class name.');
        }

        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.classList.add(className);
            });
        } else {
            this._node.classList.add(className);
        }
    },

    addClasses: function addClasses(...args) {
        if (!args) {
            throw Error('You must provide at least one class name.');
        }

        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                args.forEach((className) => {
                    el.classList.add(className);
                });
            });
        } else {
            args.forEach((className) => {
                this._node.classList.add(className);
            });
        }
    },

    removeClass: function removeClass(className) {
        if (!className) {
            throw Error('You must provide a class name.');
        }

        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.classList.remove(className);
            });
        } else {
            this._node.classList.remove(className);
        }
    },

    toggleClass: function toggleClass(className, bool) {
        if (bool === undefined) {
            throw Error('Bool argument required.');
        }

        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                if (bool) {
                    el.classList.add(className);
                } else {
                    el.classList.remove(className);
                }
            });
        } else {
            if (bool) {
                this._node.classList.add(className);
            } else {
                this._node.classList.remove(className);
            }
        }
    },

    prop: function prop(prop, value) {
        if (!prop || (!value && !(typeof value === 'boolean'))) {
            throw Error('propertyName and value arguments required.');
        }

        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el[prop] = value;
            });
        } else {
            this._node[prop] = value;
        }

    },

    applyCss: function applyCss(prop, value) {
        if (!prop || !value) {
            throw Error('You must provide a property and value.');
        }

        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.style[prop] = value;
            });
        } else {
            this._node.style[prop] = value;
        }
    },

    text: function text(input) {
        if (this._isHTMLCollection) {
            if (!input && typeof input !== 'string') {
                const res = [];
                this._node.forEach((el) => {
                    res.push(el.innerHTML);
                });
                return res;
            } else {
                this._node.forEach((el) => {
                    el.innerHTML = input;
                });
            }
        } else {
            if (!input && typeof input !== 'string') {
                return this._node.innerHTML;
            } else {
                this._node.innerHTML = input;
            }
        }
    },

    value: function value(input) {
        if (this._isHTMLCollection) {
            throw Error('You cannot  change the value of an HTMLCollection.');
        } else {
            if (!input && typeof input !== 'string') {
                return this._node.value;
            } else {
                this._node.value = input;
            }
        }
    },

    focus: function focus() {
        if (this._isHTMLCollection) {
            throw Error('You can only focus on a single HTMLElement.');
        }

        this._node.focus();
    },

    onClick: function onClick(handler, options) {
        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.addEventListener('click', handler, options || false);
            });
        } else {
            this._node.addEventListener('click', handler, options || false);
        }
    },

    onKeyup: function onKeyup(handler, options) {
        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.addEventListener('keyup', handler, options || false);
            });
        } else {
            this._node.addEventListener('keyup', handler, options || false);
        }
    },

    onKeydown: function onKeydown(handler, options) {
        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.addEventListener('keydown', handler, options || false);
            });
        } else {
            this._node.addEventListener('keydown', handler, options || false);
        }
    },

    onKeypress: function onKeypress(handler, options) {
        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.addEventListener('keypress', handler, options || false);
            });
        } else {
            this._node.addEventListener('keypress', handler, options || false);
        }
    },

    onSubmit: function onSubmit(handler, options) {
        if (this._isHTMLCollection) {
            this._node.forEach((el) => {
                el.addEventListener('submit', handler, options || false);
            });
        } else {
            this._node.addEventListener('submit', handler, options || false);
        }
    }
};

module.exports = CHIMNode;
