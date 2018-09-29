/**
 * Basic wrapper for an HTML document object.
 * @param doc
 * @constructor
 */
const CHIMDoc = function(doc) {
    this._doc = doc;
};

CHIMDoc.prototype = {
    onReady: function onReady(init) {
        this._doc.addEventListener('DOMContentLoaded', init);
    }
};

export default CHIMDoc;
