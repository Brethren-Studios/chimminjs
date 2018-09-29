import util from '../../util';
import chimXHR from './xhr';

const { 
    isFunction,
    isString
} = util;

/**
 * @callback responseCallback
 * @param {*} [body] - response body
 */

/**
 * Required and optional arguments for chimAJAX
 * request validated and mapped to object.
 * @typedef {Object} RequestArgs
 * @property {string} url
 * @property {*} [data]
 * @property {responseCallback} [callback]
 * @property {string} [dataType] - data type expected in response
 */

/**
 * Validates arguments and maps them to an object.
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
 * Public interface for the AJAX module, exposing
 * HTTP methods GET, POST, & PUT.
 * @type {Object}
 * @property {httpGet} get
 * @property {httpPost} post
 * @property {httpPut} put
 */
const chimAJAX = {
    /**
     * Sends a GET request to the provided URL. If a
     * data parameter is included, serialized data is sent
     * along with the request.
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

        xhr.setContentType('application/www-form-urlencoded; charset=UTF-8');
        xhr.sendRequest();

        xhr.handleResponse(callback);
    },
    /**
     * Sends a POST request to the provided URL. If a
     * data parameter is included, serialized data is sent
     * along with the request in query parameter or JSON format.
     * @function httpPost
     * @param {...*} args - URL, [data, [callback, [dataType]]]
     * @returns {void}
     */
    post(...args) {
        const { url, data, callback, dataType } = handleArguments(args);

        console.log('Sending POST to', url, '...');
        const xhr = new chimXHR(url, dataType);

        if (Array.isArray(data) || isString(data) || !data) {
            xhr.addQueryParams(data);

            xhr.openRequest('POST');

            xhr.setContentType('application/www-form-urlencoded; charset=UTF-8');
            xhr.sendRequest();
        } else {
            xhr.openRequest('POST');

            xhr.setContentType('application/json');
            xhr.sendRequest(JSON.stringify(data));
        }

        xhr.handleResponse(callback);
    },
    /**
     * Sends a PUT request to the provided URL. Data is serialized
     * and sent along with the request in JSON format.
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

        if (Array.isArray(data) || isString(data) || !data) {
            xhr.addQueryParams(data);

            xhr.openRequest('PUT');

            xhr.setContentType('application/www-form-urlencoded; charset=UTF-8');
            xhr.sendRequest();
        } else {
            xhr.openRequest('PUT');

            xhr.setContentType('application/json');
            xhr.sendRequest(JSON.stringify(data));
        }

        xhr.handleResponse(callback);
    }
};

export default chimAJAX;
