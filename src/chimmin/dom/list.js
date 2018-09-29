import util from '../../util';

const {
    isObject,
    isString,
    isDefined
} = util;

/**
 * A lightweight wrapper around a NodeList or HTMLCollection that
 * provides an interface for commonly used DOM manipulation methods.
 * @typedef {Object} CHIMList
 * @property {Array<HTMLElement>} _list
 */

/**
 * @param {NodeList|HTMLCollection} list - represents HTML collection
 * @constructor
 */
const CHIMList = function CHIMList(list) {
    // init list
    this._list = Array.from(list);
};

// public methods
CHIMList.prototype = {
    /**
     * Removes this list of nodes from the DOM.
     */
    remove: function remove() {
        this._list.forEach((el) => {
            el.parentElement.removeChild(el);
        });
    },
    /**
     * Adds the class to each node.
     * @param {string} className
     */
    addClass: function addClass(className) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        this._list.forEach((el) => {
            el.classList.add(className);
        });
    },
    /**
     * Adds 1+ classes to each node.
     * @param {...string} args
     */
    addClasses: function addClasses(...args) {
        if (!args) {
            throw new Error('You must provide at least one class name.');
        }

        this._list.forEach((el) => {
            args.forEach((className) => {
                if (!isString(className)) {
                    throw new Error('Class names must be strings.');
                }
                el.classList.add(className);
            });
        });
    },
    /**
     * Removes a class from each node.
     * @param {string} className
     */
    removeClass: function removeClass(className) {
        if (!className || !isString(className)) {
            throw new Error('You must provide a string class name argument.');
        }

        this._list.forEach((el) => {
            el.classList.remove(className);
        });
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

        this._list.forEach((el) => {
            if (bool) {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        });
    },
    /**
     * Modifies the properties of each node.
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
            const res = [];
            this._list.forEach((el) => {
                res[prop] = el[prop];
            });
            return res;
        } else {
            this._list.forEach((el) => {
                el[prop] = value;
            });
        }

    },
    /**
     * Applies the CSS to this list of nodes.
     * @param {string} prop
     * @param {string} value
     */
    applyCss: function applyCss(prop, value) {
        if ((!prop || !isString(prop))|| (!value)) {
            throw new Error('You must provide a valid property and value.');
        }

        this._list.forEach((el) => {
            el.style[prop] = value;
        });
    },
    /**
     * Modifies the innerHTML of the list of nodes.
     * If no argument is supplied, returns innerHTML.
     * @param {string} [txt]
     * @returns {string|Array|undefined}
     */
    text: function text(txt) {
        if (isObject(txt)) {
            throw new Error('CHIMNode.text(...) does not support non-scalar values.');
        }

        if (!isDefined(txt)) {
            const res = [];
            this._list.forEach((el) => {
                res.push(el.innerHTML);
            });
            return res;
        } else {
            this._list.forEach((el, i) => {
                this._list[i].innerHTML = txt;
            });
        }
    },
    /**
     * Callback that fires after an event.
     * @callback eventHandler
     * @param {Object} e - event
     */

    /**
     * Adds a click listener to a list of nodes.
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onClick: function onClick(handler, options) {
        this._list.forEach((el) => {
            el.addEventListener('click', handler, options || false);
        });
    },
    /**
     * Adds a keyup listener to a list of nodes.
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onKeyup: function onKeyup(handler, options) {
        this._list.forEach((el) => {
            el.addEventListener('keyup', handler, options || false);
        });
    },
    /**
     * Adds a keydown listener to a list of nodes.
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onKeydown: function onKeydown(handler, options) {
        this._list.forEach((el) => {
            el.addEventListener('keydown', handler, options || false);
        });
    },
    /**
     * Adds a keypress listener to a list of nodes.
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onKeypress: function onKeypress(handler, options) {
        this._list.forEach((el) => {
            el.addEventListener('keypress', handler, options || false);
        });
    },
    /**
     * Adds a submit listener to a list of nodes.
     * Used for form submission.
     * @param {eventHandler} handler
     * @param {Object} [options]
     */
    onSubmit: function onSubmit(handler, options) {
        this._list.forEach((el) => {
            el.addEventListener('submit', handler, options || false);
        });
    }
};

export default CHIMList;
