const {
    isObject,
    isString,
    isDefined
} = require('../util');

/**
 * A lightweight wrapper around an HTMLElement or NodeList that
 * provides an interface for commonly used DOM manipulation methods.
 *
 * @typedef {Object} CHIMNode
 * @property {HTMLElement|Array<HTMLElement>} _node
 * @property {boolean} _isNodeList
 */

/**
 *
 * @param selector {string|Object} - represents HTML node(s)
 * @constructor
 */
const CHIMNode = function(selector) {
    if (!isString(selector) &&
        !(selector instanceof HTMLElement) &&
        !(selector instanceof NodeList) &&
        !(selector instanceof HTMLCollection))
    {
        throw new Error('A CHIMNode needs a selector.');
    }

    // init CHIMNode
    this._init = function (selector) {
        // if CSS selector (ID, class name, tag name)
        if (isString(selector)) {
            const nodeList = document.querySelectorAll(selector);
            if (nodeList.length > 1) {
                this._isNodeList = true;
                return Array.from(nodeList);
            } else {
                return nodeList[0];
            }
        // if HTML node
        } else {
            const node = selector;
            // if single HTMLElement
            if (node instanceof HTMLElement) {
                return node;
            // if HTMLCollection or NodeList
            } else {
                if (node.length > 1) {
                    this._isNodeList = true;
                    return Array.from(node);
                } else {
                    return node[0];
                }
            }
        }
    };

    // private variables
    this._isNodeList = false;

    // init node
    this._node = this._init(selector);
};

// public methods
CHIMNode.prototype = {
    /**
     * Appends this node to the node argument as
     * as the last child element. Does not support NodeList.
     *
     * @param {Object} chimNode - parent element to which this node is appended
     */
    appendTo: function appendTo(chimNode) {
        if (!(chimNode instanceof CHIMNode)) {
            if (chimNode instanceof HTMLElement) {
                chimNode.appendChild(this._node);
            }
            throw new Error('You cannot append to an HTMLCollection or NodeList.');
        } else {
            if (this._isNodeList || chimNode._isNodeList) {
                throw new Error('You cannot append to/with a NodeList.');
            }
            chimNode._node.appendChild(this._node);
        }
    },
    /**
     * Removes this node / list of nodes from the DOM.
     */
    remove: function remove() {
        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.parentElement.removeChild(el);
            });
        } else {
            this._node.parentElement.removeChild(this._node);
        }
    },
    /**
     * Adds the class to this node / list of nodes.
     *
     * @param {string} className
     */
    addClass: function addClass(className) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.classList.add(className);
            });
        } else {
            this._node.classList.add(className);
        }
    },
    /**
     * Adds 1+ classes to this node / list of nodes.
     *
     * @param {...string} args
     */
    addClasses: function addClasses(...args) {
        if (!args) {
            throw new Error('You must provide at least one class name.');
        }

        if (this._isNodeList) {
            this._node.forEach((el) => {
                args.forEach((className) => {
                    if (!isString(className)) {
                        throw new Error('Class names must be strings.');
                    }
                    el.classList.add(className);
                });
            });
        } else {
            args.forEach((className) => {
                this._node.classList.add(className);
            });
        }
    },
    /**
     * Removes a class from this node / list of nodes.
     *
     * @param {string} className
     */
    removeClass: function removeClass(className) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.classList.remove(className);
            });
        } else {
            this._node.classList.remove(className);
        }
    },
    /**
     * Adds or removes a class depending on the value
     * of the bool argument.
     *
     * @param {string} className
     * @param {boolean} bool
     */
    toggleClass: function toggleClass(className, bool) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        if (bool === undefined) {
            throw new Error('Bool argument required.');
        }

        if (this._isNodeList) {
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
    /**
     * Modifies the property of the node / list or nodes.
     * Only supports scalar properties (e.g. value, disabled, etc.).
     *
     * @param {string} prop
     * @param {string|boolean|Number} value
     */
    prop: function prop(prop, value) {
        if (!prop || !isString(prop)) {
            throw new Error('You must provide a valid property name.');
        }

        if (isObject(value)) {
            throw new Error('CHIMNode.prop(...) does not support properties with non-scalar values.');
        }

        if (this._isNodeList) {
            if (!isDefined(value)) {
                const res = [];
                this._node.forEach((el) => {
                    res[prop] = el[prop];
                });
                return res;
            } else {
                this._node.forEach((el) => {
                    el[prop] = value;
                });
            }
        } else {
            if (!isDefined(value)) {
                return this._node[prop];
            } else {
                this._node[prop] = value;
            }
        }

    },
    /**
     * Applies the CSS to this node / list of nodes.
     *
     * @param {string} prop
     * @param {string} value
     */
    applyCss: function applyCss(prop, value) {
        if ((!prop || !isString(prop))|| (!value)) {
            throw new Error('You must provide a valid property and value.');
        }

        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.style[prop] = value;
            });
        } else {
            this._node.style[prop] = value;
        }
    },
    /**
     * Modifies the innerHTML of the node / list of nodes.
     * If no argument is supplied, returns innerHTML.
     *
     * @param {string} [txt]
     * @returns {string|Array|undefined}
     */
    text: function text(txt) {
        if (isObject(txt)) {
            throw new Error('CHIMNode.text(...) does not support non-scalar values.');
        }

        if (this._isNodeList) {
            if (!isDefined(txt)) {
                const res = [];
                this._node.forEach((el) => {
                    res.push(el.innerHTML);
                });
                return res;
            } else {
                this._node.forEach((el, i) => {
                    this._node[i].innerHTML = txt;
                });
            }
        } else {
            if (!isDefined(txt)) {
                return this._node.innerHTML;
            } else {
                this._node.innerHTML = txt;
            }
        }
    },
    /**
     * Modifies the value of an input element. If no
     * argument is supplied, returns the value. Does
     * not support NodeList.
     *
     * @param {string} [text]
     * @returns {*}
     */
    value: function value(text) {
        if (isObject(text)) {
            throw new Error('CHIMNode.value(...) does not support non-scalar values.');
        }

        if (this._isNodeList) {
            throw new Error('You cannot change the value of a NodeList.');
        } else {
            if (!isDefined(text)) {
                return this._node.value;
            } else {
                this._node.value = text;
            }
        }
    },
    /**
     * Gives focus to an element. Does not support NodeList.
     */
    focus: function focus() {
        if (this._isNodeList) {
            throw new Error('You can only focus on a single HTMLElement.');
        }

        this._node.focus();
    },

    /**
     * Callback that fires after an event.
     *
     * @callback eventHandler
     * @param {Object} e - event
     */

    /**
     * Adds a click listener to a node / list of nodes.
     *
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onClick: function onClick(handler, options) {
        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.addEventListener('click', handler, options || false);
            });
        } else {
            this._node.addEventListener('click', handler, options || false);
        }
    },
    /**
     * Adds a keyup listener to a node / list of nodes.
     *
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onKeyup: function onKeyup(handler, options) {
        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.addEventListener('keyup', handler, options || false);
            });
        } else {
            this._node.addEventListener('keyup', handler, options || false);
        }
    },
    /**
     * Adds a keydown listener to a node / list of nodes.
     *
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onKeydown: function onKeydown(handler, options) {
        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.addEventListener('keydown', handler, options || false);
            });
        } else {
            this._node.addEventListener('keydown', handler, options || false);
        }
    },
    /**
     * Adds a keypress listener to a node / list of nodes.
     *
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onKeypress: function onKeypress(handler, options) {
        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.addEventListener('keypress', handler, options || false);
            });
        } else {
            this._node.addEventListener('keypress', handler, options || false);
        }
    },
    /**
     * Adds a submit listener to a node / list of nodes.
     * Used for form submission.
     *
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onSubmit: function onSubmit(handler, options) {
        if (this._isNodeList) {
            this._node.forEach((el) => {
                el.addEventListener('submit', handler, options || false);
            });
        } else {
            this._node.addEventListener('submit', handler, options || false);
        }
    }
};

module.exports = CHIMNode;
