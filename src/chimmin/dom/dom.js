const {
    isString,
} = require('../../util');

const CHIMDoc = require('./doc');
const CHIMNode = require('./node');
const CHIMList = require('./list');

/**
 * Public interface for DOM module, exposing a method
 * that uses a selector to construct a CHIM doc/node/list.
 *
 * @param selector
 * @returns {*}
 */
const chimDOM = function chimDOM(selector) {
    // if document
    if (selector instanceof HTMLDocument ||
        selector.constructor.name === 'HTMLDocument' ||
        selector.nodeName === '#document'
    ) {
        return new CHIMDoc(selector);
    }

    // if string selector (ID, class name, tag name)
    else if (isString(selector)) {
        const nodeList = document.querySelectorAll(selector);
        if (nodeList.length > 1) {
            return new CHIMList(nodeList);
        } else {
            return new CHIMNode(nodeList[0]);
        }

    }
    // if HTMLElement
    else if (selector instanceof HTMLElement ||
        selector.constructor.name === 'HTMLDocument'
    ) {
        return new CHIMNode(selector);
    }

    // if HTMLCollection or NodeList
    else if (
            selector instanceof NodeList ||
            selector.constructor.name === 'NodeList' ||
            selector instanceof HTMLCollection ||
            selector.constructor.name === 'HTMLCollection'
        ) {
            const list = selector;
            // if HTMLCollection or NodeList
            if (list.length > 1) {
                return new CHIMList(list);
            } else {
                return new CHIMNode(list[0]);
            }
    } else {
        console.error('Invalid selector:', selector);
    }
};

module.exports = chimDOM;
