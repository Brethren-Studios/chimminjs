import util from '../../util';

const {
    isObject,
    isString,
    isDefined
} = util;

/**
 * @typedef {function} EventHandler
 * @param {object} e event
 */

/**
 * A lightweight wrapper around an HTMLElement that
 * provides an interface for commonly used DOM manipulation methods.
 * @typedef {object} CHIMNode
 * @property {HTMLElement} _node
 */

/**
 * @param {HTMLElement} node - represents HTML node
 * @constructor
 */
const CHIMNode = function CHIMNode(node) {
    // init node
    this._node = node;
};

// public methods
CHIMNode.prototype = {
    /**
     * Appends this node to the node argument as
     * as the last child element.
     * @param {object} el - parent element to which this node is appended
     */
    appendTo: function appendTo(el) {
        if (!isObject(el)) {
            throw new Error('You must provide a valid element.');
        }

        if (!(el instanceof CHIMNode)) {
            if (el instanceof HTMLElement) {
                el.appendChild(this._node);
            } else {
                throw new Error('You cannot append to an HTMLCollection or NodeList.');
            }
        } else {
            el._node.appendChild(this._node);
        }
    },
    /**
     * Removes this node from the DOM.
     */
    remove: function remove() {
        this._node.parentElement.removeChild(this._node);
    },
    /**
     * Adds the class to this node / list of nodes.
     * @param {string} className
     */
    addClass: function addClass(className) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        this._node.classList.add(className);
    },
    /**
     * Adds 1+ classes to this node.
     * @param {...string} args
     */
    addClasses: function addClasses(...args) {
        if (!args) {
            throw new Error('You must provide at least one class name.');
        }

        args.forEach((className) => {
            this._node.classList.add(className);
        });
    },
    /**
     * Removes a class from this node.
     * @param {string} className
     */
    removeClass: function removeClass(className) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        this._node.classList.remove(className);
    },
    /**
     * Adds or removes a class depending on the value
     * of the bool argument.
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

        if (bool) {
            this._node.classList.add(className);
        } else {
            this._node.classList.remove(className);
        }
    },
    /**
     * Modifies the property of the node.
     * Only supports scalar properties (e.g. value, disabled, etc.).
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

        if (!isDefined(value)) {
            return this._node[prop];
        } else {
            this._node[prop] = value;
        }
    },
    /**
     * Applies the CSS to this node.
     * @param {string} prop
     * @param {string} value
     */
    applyCss: function applyCss(prop, value) {
        if ((!prop || !isString(prop))|| (!value)) {
            throw new Error('You must provide a valid property and value.');
        }

        this._node.style[prop] = value;
    },
    /**
     * Modifies the innerHTML of the node.
     * If no argument is supplied, returns innerHTML.
     * @param {string} [txt]
     * @returns {string|array|undefined}
     */
    text: function text(txt) {
        if (isObject(txt)) {
            throw new Error('CHIMNode.text(...) does not support non-scalar values.');
        }


        if (!isDefined(txt)) {
            return this._node.innerHTML;
        } else {
            this._node.innerHTML = txt;
        }
    },
    /**
     * Modifies the value of an input element. If no
     * argument is supplied, returns the value. Does
     * not support NodeList.
     * @param {string} [text]
     * @returns {*}
     */
    value: function value(text) {
        if (isObject(text)) {
            throw new Error('CHIMNode.value(...) does not support non-scalar values.');
        }

        if (!isDefined(text)) {
            return this._node.value;
        } else {
            this._node.value = text;
        }
    },
    /**
     * Gives focus to an element.
     */
    focus: function focus() {
        this._node.focus();
    },

    /**
     * Callback that fires after an event.
     * @callback EventHandler
     * @param {object} e - event
     */

    /**
     * Adds a click listener to a node.
     * @param {EventHandler} handler
     * @param {object} [options]
     */
    onClick: function onClick(handler, options) {
        this._node.addEventListener('click', handler, options || false);
    },
    /**
     * Adds a keyup listener to a node.
     * @param {EventHandler} handler
     * @param {object} [options]
     */
    onKeyup: function onKeyup(handler, options) {
        this._node.addEventListener('keyup', handler, options || false);
    },
    /**
     * Adds a keydown listener to a node.
     * @param {EventHandler} handler
     * @param {object} [options]
     */
    onKeydown: function onKeydown(handler, options) {
        this._node.addEventListener('keydown', handler, options || false);
    },
    /**
     * Adds a keypress listener to a node.
     * @param {EventHandler} handler
     * @param {object} [options]
     */
    onKeypress: function onKeypress(handler, options) {
        this._node.addEventListener('keypress', handler, options || false);
    },
    /**
     * Adds a submit listener to a node.
     * Used for form submission.
     * @param {EventHandler} handler
     * @param {object} [options]
     */
    onSubmit: function onSubmit(handler, options) {
        this._node.addEventListener('submit', handler, options || false);
    }
};

export default CHIMNode;
