const {
    isFunction,
    isObject,
    isString
} = require('../../util');


/**
 * Adds a single param to the resulting list.
 *
 * @param {string} prefix - prefixes param for scalar representation of nested objects
 * @param {*} obj - data called on recursively to traverse all params
 * @param {addToParams} add - serializes and adds to result
 */
function buildParams(prefix, obj, add) {
    if (Array.isArray(obj)) {
        // serialize array item
        obj.forEach((v, i) => {
            // if prefix is already in `nestedObj[]` format
            if ((/\[]$/).test(prefix)) {
                // treat each array item as a scalar
                add(prefix, v);
            } else {
                // item is non-scalar (array or object), encode its numeric index
                buildParams(
                    `${prefix}[${(isObject(v) && v != null ? i : '')}]`,
                    v,
                    add
                );
            }
        });
    } else if (isObject(obj)) {
        // serialize object item
        Object.keys(obj).forEach((name) => {
            buildParams(`${prefix}[${name}]`, obj[name], add);
        });
    } else {
        // serialize scalar item
        add(prefix, obj);
    }
}

/**
 * Separates data objects into logical scalar units
 * and serializes them as query parameters.
 *
 * @param {*} a - data object to serialize
 * @returns {string} - data in request params format
 */
function serialize(a) {
    if (!a) {
        throw new Error('The serialize method must be called on data.');
    }

    if (isString(a)) {
        // if string passed in, assume it's already a query string
        return a;
    }

    const s = [],
        /**
         * Takes key/value combination and adds to list of params.
         *
         * @callback addToParams
         * @param {string} key - key of data value to serialize
         * @param {*} valueOrFunction - data value or function returning data value
         */
        add = (key, valueOrFunction) => {
            // if value is a function, invoke it and use its return value
            const value = isFunction(valueOrFunction) ?
                valueOrFunction() :
                valueOrFunction;

            s[s.length] = `${encodeURIComponent(key).trim()}=${encodeURIComponent(value == null ? '' : value)}`;
        };

    if (Array.isArray(a)) {
        // if an array was passed in, assume it is an array of form elements
        a.forEach((el) => {
            add(el.name, el.value);
        });
    } else {
        // else, encode params recursively
        Object.keys(a).forEach((prefix) => {
            buildParams(prefix, a[prefix], add);
        });
    }
    // return the resulting serialization
    return s.join('&');
}

module.exports = serialize;