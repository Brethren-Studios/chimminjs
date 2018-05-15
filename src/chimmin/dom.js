/**
 * Constructs a CHIMNode, which is just a lightweight
 * wrapper around an HTMLElement or NodeList that provides
 * an interface for commonly used DOM manipulation methods.
 *
 * @param selector {string|Object} - represents HTML node(s)
 * @constructor
 */
const CHIMNode = function(selector) {
    if (typeof selector !== 'string' &&
        !(selector instanceof HTMLElement) &&
        !(selector instanceof NodeList) &&
        !(selector instanceof HTMLCollection))
    {
        throw new Error('A CHIMNode needs a selector.');
    }

    // init CHIMNode
    this._init = function (selector) {
        // if CSS selector (ID, class name, tag name)
        if (typeof selector === 'string') {
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
        if (typeof chimNode !== 'object') {
            throw new Error('You can only append to another CHIMNode.');
        }
        if (this._isNodeList || chimNode._isNodeList) {
            throw new Error('You cannot append a NodeList.');
        }

        chimNode._node.appendChild(this._node);
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
        if (!className) {
            throw new Error('You must provide a class name.');
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
        if (!className) {
            throw new Error('You must provide a class name.');
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
     * @param {*} value
     */
    // TODO: should this also return the prop if no value is supplied?
    prop: function prop(prop, value) {
        if (!prop || (!value && !(typeof value === 'boolean'))) {
            throw new Error('propertyName and value arguments required.');
        }

        if (this._isNodeList) {
            this._node.forEach((el) => {
                el[prop] = value;
            });
        } else {
            this._node[prop] = value;
        }

    },
    /**
     * Applies the CSS to this node / list of nodes.
     *
     * @param {string} prop
     * @param {string} value
     */
    applyCss: function applyCss(prop, value) {
        if (!prop || !value) {
            throw new Error('You must provide a property and value.');
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
     * If no argument is supplied, returns the innerHTML.
     *
     * @param {string} [input]
     * @returns {string|Object[]}
     */
    text: function text(input) {
        if (this._isNodeList) {
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
    /**
     * Modifies the value of an input element. If no
     * argument is supplied, returns the value. Does
     * not support NodeList.
     *
     * @param {string} [input]
     * @returns {*}
     */
    value: function value(input) {
        if (this._isNodeList) {
            throw new Error('You cannot change the value of a NodeList.');
        } else {
            if (!input && typeof input !== 'string') {
                return this._node.value;
            } else {
                this._node.value = input;
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
     * @param {Object} options
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
     * @param {Object} options
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
     * @param {Object} options
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
     * @param {Object} options
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
     * @param {Object} options
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
