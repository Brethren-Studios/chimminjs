const {
    isFunction,
    isObject,
    isString
} = require('../util');

/**
 * @callback responseCallback
 * @param {*} - response
 */

/**
 * Required and optional arguments for CHIMAjax
 * request validated and mapped to object.
 *
 * @typedef {Object} RequestArgs
 * @property {string} url
 * @property {*} [data]
 * @property {responseCallback} [callback]
 * @property {string} [dataType] - data type expected in response
 *
 */

/**
 * Validates arguments and maps them to an object.
 *
 * @param {Array} args - URL, and optional data, callback, dataType
 * @returns {RequestArgs} - arguments object
 */
function handleArguments(args) {
    const result = {};
    if (!args.length || !isString(args[0])) {
        throw new Error('URL string argument must be provided.');
    }
    result.url = args[0];

    // all 4 args
    if (args.length === 4) {
        result.data = args[1];
        result.callback = args[2];
        result.dataType = args[3];
    // 3 args
    } else if (args.length === 3) {
        // url, data, callback
        if (isFunction(args[2])) {
            result.data = args[1];
            result.callback = args[2];
        // url, callback, dataType
        } else if (isFunction(args[1])) {
            result.callback = args[1];
            result.dataType = args[2];
        // url, data, dataType
        } else if (isString(args[2])) {
            result.data = args[1];
            result.dataType = args[2];
        }
    // no data provided, second arg is callback
    } else if (isFunction(args[1])) {
        result.callback = args[1];
    // no callback provided, second arg is data
    } else {
        result.data = args[1];
    }
    return result;
}

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

// response types
const _TEXT = 'text',
    _JSON = 'json',
    _BLOB = 'blob',
    _ARBUF = 'arraybuffer',
    _DOC = 'document';

const _CONTENT_TYPE = 'Content-Type';
// MIME types/subtypes
const _APP = 'application',
    _OCTET = 'octet-stream',
    _IMAGE = 'image',
    _AUDIO = 'audio',
    _VIDEO = 'video';

/**
 * Validates content type and returns the corresponding response type.
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 *
 * @param {string} contentType
 * @returns {string} - response type
 */
function findResponseType(contentType) {
    if (contentType.includes(_TEXT)) {
        return 'text';
    }
    if (contentType.includes(_APP)) {
        // json object
        if (contentType.includes(_JSON)) {
            return _JSON;
        // binary file for download
        } else if (contentType.includes(_OCTET)) {
            return _BLOB
        // *
        } else {
            return _TEXT
        }
    }
    if (contentType.includes(_IMAGE) ||
        contentType.includes(_AUDIO) ||
        contentType.includes(_VIDEO)
    ) {
        return _BLOB;
    }
    console.warn('Unexpected content type:', contentType);
    return _TEXT;
}

/**
 * Validates response type and processes data accordingly.
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
 *
 * @param {string} type - response type
 * @param {string} data - unprocessed raw data
 * @returns {*}
 */
function processResponse(type, data) {
    // plain text or HTML
    if (type === _TEXT) {
        return data;
    }
    // JSON object
    if (type === _JSON) {
        return JSON.parse(data);
    }
    // blob binary type
    if (type === _BLOB) {
        return data;
    }
    // if Buffer
    if (type === _ARBUF) {
        return data;
    }
    // HTML
    if (type === _DOC) {
        return data;
    }
    // no data type inferred, try parsing
    console.warn('Unexpected response type:', type);
    try {
        return JSON.parse(data);
    } catch (err) {
        return data;
    }
}

/**
 * CHIMAjax's very own XMLHttpRequest wrapper,
 * adding a simple interface and several helper methods.
 *
 * @typedef {Object} chimXHR
 * @property {Object} _xhr
 * @property {string} _url
 * @property {string} _dataType
 * @property {boolean} _legacy - determines which event handler to use
 * @property {*} _data - body of the response
 */

/**
 *
 * @constructor {chimXHR}
 * @param {string} url - request URL
 * @param {string} dataType - response data type
 */
const chimXHR = function chimXHR(url, dataType) {
    this._xhr = new XMLHttpRequest();
    this._url = url;
    this._dataType = dataType;
    // some old browsers don't support onload
    this._legacy = !(this._xhr.onload === null);
};

chimXHR.prototype = {
    /**
     *
     * @param {*} data - data to send with the request as query params
     */
    addQueryParams: function addQueryParams(data) {
        if (data) {
            if (!isString(data)) {
                this._url += '?';
            }
            this._url += serialize(data);
        }
    },
    /**
     *
     * @param {Object} header - http request header options
     */
    setHeader: function setHeader(header) {
        const self = this;
        Object.keys(header).forEach((el) => {
            self._xhr.setRequestHeader(el, header[el]);
        });
    },
    /**
     *
     * @param {string} requestType - HTTP verb
     */
    openRequest: function openRequest(requestType) {
        this._xhr.open(requestType, this._url);
    },
    /**
     * Sends request with optional data parameter. If
     * data type is 'document', set the response type.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/HTML_in_XMLHttpRequest
     *
     * @param {String} [data] - data to send as JSON with request
     */
    sendRequest: function sendRequest(data) {
        if (this._dataType === _DOC) {
            this._xhr.responseType = _DOC;
        }
        this._xhr.send(data);
    },
    /**
     * Fires a callback on successful response or error
     *
     * @param {responseCallback} callback
     */
    handleResponse: function handleResponse(callback) {
        // if browser is modern, XMLHttpRequest 'onload' listener
        if (!this._legacy) {
            this._xhr.onload = () => {
                this.success(callback);
            };
            this._xhr.onerror = (err) => {
                console.error(err);
                this.fail(callback);
            };
        // if legacy, 'onreadystatechange' listener
        } else {
            console.warn('You are using an old browser. Consider upgrading for improved support.');
            const DONE = 4; // readyState 4 means request is done
            const OK = 200; // status 200 is a successful return

            this._xhr.onreadystatechange = () => {
                if (this._xhr.readyState === DONE) {
                    if (this._xhr.status === OK) {
                        this.success(callback);
                    } else {
                        this.fail(callback);
                    }
                }
            }
        }
    },
    /**
     * On response success.
     *
     * @param {responseCallback} callback
     */
    success: function success(callback) {
        this.setResponseType();
        this.processResponseData();
        console.log('Success:', this._responseType === _BLOB ? this._url : this._data);
        callback && callback(this._data);
    },
    /**
     * On response fail.
     *
     * @param {responseCallback} callback
     */
    fail: function fail(callback) {
        console.log('Error:', this._xhr.statusText);
        callback && callback(this._xhr.statusText);
    },
    /**
     * Sets the response type to the provided dataType parameter,
     * if none is provided it infers the response type from the
     * content type.
     *
     */
    setResponseType: function setResponseType() {
        const responseHeader = this._xhr.getResponseHeader(_CONTENT_TYPE);
        this._responseType = this._dataType || findResponseType(responseHeader);
    },
    /**
     * Processes the response text based on its type.
     */
    processResponseData: function processResponseData() {
        let data;
        if (this._dataType === _DOC) {
            data = this._xhr.response || this._xhr.responseXML;
        } else {
            data = this._xhr.responseText;
        }
        this._data = processResponse(this._responseType, data);
    }
};

/**
 * Public interface for the requests module, exposing
 * HTTP methods GET, POST, & PUT.
 *
 * @type {Object}
 * @property {httpGet} get
 * @property {httpPost} post
 * @property {httpPut} put
 */
const CHIMAjax = {
    /**
     * Sends a GET request to the provided URL. If a
     * data parameter is included, serialized data is sent
     * along with the request.
     *
     * @function httpGet
     * @param {...*} args - URL, [data, [callback, [dataType]]]
     * @returns {void}
     */
    get(...args) {
        const { url, data, callback, dataType } = handleArguments(args);

        console.log('Sending GET to', url, '...');
        const xhr = new chimXHR(url, dataType);

        xhr.addQueryParams(data);

        xhr.openRequest('GET');

        xhr.setHeader({ [_CONTENT_TYPE]: 'application/www-form-urlencoded; charset=UTF-8' });
        xhr.sendRequest();

        xhr.handleResponse(callback);
    },
    /**
     * Sends a POST request to the provided URL. If a
     * data parameter is included, serialized data is sent
     * along with the request in query parameter or JSON format.
     *
     * @function httpPost
     * @param {...*} args - URL, [data, [callback, [dataType]]]
     * @returns {void}
     */
    post(...args) {
        const { url, data, callback, dataType } = handleArguments(args);

        console.log('Sending POST to', url, '...');
        const xhr = new chimXHR(url, dataType);

        xhr.addQueryParams(data);

        xhr.openRequest('POST');

        if (Array.isArray(data) || isString(data) || !data) {
            xhr.setHeader({ [_CONTENT_TYPE]: 'application/www-form-urlencoded; charset=UTF-8' });
            xhr.sendRequest();
        } else {
            xhr.setHeader({ [_CONTENT_TYPE]: 'application/json' });
            xhr.sendRequest(JSON.stringify(data));
        }

        xhr.handleResponse(callback);
    },
    /**
     * Sends a PUT request to the provided URL. Data is serialized
     * and sent along with the request in JSON format.
     *
     * @function httpPut
     * @param {...*} args - URL, data, [callback, [dataType]]
     * @returns {void}
     */
    put(...args) {
        const { url, data, callback, dataType } = handleArguments(args);

        if (!data) {
            throw new Error('A PUT request must include data.');
        }

        console.log('Sending PUT to', url, '...');
        const xhr = new chimXHR(url, dataType);

        xhr.addQueryParams(data);

        xhr.openRequest('PUT');

        if (Array.isArray(data) || isString(data) || !data) {
            xhr.setHeader({ [_CONTENT_TYPE]: 'application/www-form-urlencoded; charset=UTF-8' });
            xhr.sendRequest();
        } else {
            xhr.setHeader({ [_CONTENT_TYPE]: 'application/json' });
            xhr.sendRequest(JSON.stringify(data));
        }

        xhr.handleResponse(callback);
    }
};

module.exports = CHIMAjax;
