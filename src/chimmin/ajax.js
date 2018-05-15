/**
 *
 * @param {*} functionToCheck
 * @returns {boolean}
 */
function isFunction(functionToCheck) {
    return (functionToCheck &&
        {}.toString.call(functionToCheck) === '[object Function]');
}

/**
 *
 * @param {string} prefix - prefixes form entries if defined
 * @param obj - data called on recursively to traverse all params
 * @param add - serializes and adds to result
 */
function buildParams(prefix, obj, add) {
    if (Array.isArray(obj)) {
        // serialize array item
        obj.forEach((v, i) => {
            if ((/\[\]$/).test(prefix)) {
                // treat each array item as a scalar
                add(prefix, v);
            } else {
                // item is non-scalar (array or object), encode its numeric index
                buildParams(
                    `${prefix}[${(typeof v === 'object' && v != null ? i : '')}]`,
                    v,
                    add
                );
            }
        });
    } else if (typeof obj === 'object') {
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
 *
 * @param {Object} a - data object to serialize
 * @returns {string} - data in request params format
 */
function serialize(a) {
    if (!a) {
        return '';
    }
    if (typeof a === 'string') {
        // if string passed in, assume it's already a query string
        return a;
    }

    const s = ['?'],
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

/**
 * Callback handling response body.
 *
 * @callback handleResponse
 * @param {string|Object} response - Response body.
 */

/**
 * Required and optional arguments for ChimAJAX
 * request validated and mapped to object.
 *
 * @typedef {Object} RequestArgs
 * @property {string} url
 * @property {*} [data]
 * @property {handleResponse} [callback]
 */

/**
 * Validates arguments and maps them to an object.
 *
 * @param {Object[]} args - URL, and optional data and/or callback
 * @returns {RequestArgs} - arguments object
 */
const handleArguments = function(args) {
    const result = {};
    if (!args.length || typeof args[0] !== 'string') {
        throw new Error('URL string argument must be provided.');
    }
   result.url = args[0];

    // all 3 args
    if (args.length === 3) {
        result.data = args[1];
        result.callback = args[2];
    // no data provided, second arg is callback
    } else if (isFunction(args[1])) {
        result.callback = args[1];
    } else {
        result.data = args[1];
    }
    return result;
};

const CHIMAjax = {
    /**
     * Sends a GET request to the provided URL. If a
     * data parameter is included, serialized data is sent
     * along with the request.
     *
     * @param {...*} args - URL, and optional data and/or callback
     */
    get(...args) {
        const { url, data, callback } = handleArguments(args);


        console.log('Sending GET to', url, '...');
        const xhr = new XMLHttpRequest();

        const params = serialize(data);

        xhr.open('GET', url + params);

        xhr.setRequestHeader('Content-Type', 'application/www-form-urlencoded');
        xhr.send();

        xhr.onreadystatechange = () => {
            const DONE = 4; // readyState 4 means request is done
            const OK = 200; // status 200 is a successful return
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    const parsed = JSON.parse(xhr.responseText);
                    console.log('Response received:', parsed);
                    callback && callback(parsed);
                } else {
                    console.log('Error received:', xhr.status);
                    callback && callback(xhr.status);
                }
            }
        };
    },
    /**
     * Sends a POST request to the provided URL. If a
     * data parameter is included, serialized data is sent
     * along with the request in query parameter or JSON format.
     *
     * @param {...*} args - URL, and optional data and/or callback
     */
    post(...args) {
        const { url, data, callback } = handleArguments(args);

        console.log('Sending POST to', url, '...');
        const xhr = new XMLHttpRequest();

        if (Array.isArray(data) || typeof data === 'string' || !data) {
            const params = serialize(data);
            xhr.open('POST', url + params);

            xhr.setRequestHeader('Content-Type', 'application/www-form-urlencoded');
            xhr.send();
        } else {
            xhr.open('POST', url);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }


        xhr.onreadystatechange = () => {
            const DONE = 4; // readyState 4 means request is done
            const OK = 200; // status 200 is a successful return
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    const parsed = JSON.parse(xhr.responseText);
                    console.log('Response received:', parsed);
                    callback && callback(parsed);
                } else {
                    console.log('Error received:', xhr.status);
                    callback && callback(xhr.status);
                }
            }
        };
    },
    /**
     * Sends a PUT request to the provided URL.
     * Data is serialized and sent along with
     * the request in JSON format.
     *
     * @param {...*} args - URL, data, and optional callback
     */
    put(...args) {
        const { url, data, callback } = handleArguments(args);

        if (!data) {
            throw new Error('A PUT request must include data.');
        }

        console.log('Sending PUT to', url, '...');
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));


        xhr.onreadystatechange = () => {
            const DONE = 4; // readyState 4 means request is done
            const OK = 200; // status 200 is a successful return
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    const parsed = JSON.parse(xhr.responseText);
                    console.log('Response received:', parsed);
                    callback && callback(parsed);
                } else {
                    console.log('Error received:', xhr.status);
                    callback && callback(xhr.status);
                }
            }
        };
    }
};

module.exports = CHIMAjax;
