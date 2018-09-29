import util from '../../util';
import serialize from './serialize';

const {
    isString,
    isDefined
} = util;

/**
 * XHR Spec:
 * https://xhr.spec.whatwg.org
 */

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
 * @param {string} contentType
 * @returns {string} - response type
 */
function findResponseType(contentType) {
    if (contentType.includes(_TEXT)) {
        return _TEXT;
    }
    if (contentType.includes(_APP)) {
        // json object
        if (contentType.includes(_JSON)) {
            return _JSON;
            // binary file for download
        } else if (contentType.includes(_OCTET)) {
            return _BLOB;
            // *
        } else {
            return _TEXT;
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
        try {
            return JSON.parse(data);
        } catch (err) {
            console.error('Invalid or undefined JSON object:', data);
            return data;
        }
    }
    // blob binary type
    if (type === _BLOB) {
        return data;
    }
    // if ArrayBuffer
    if (type === _ARBUF) {
        return data;
    }
    // HTML / XML
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
    this._legacy = !isDefined(this._xhr.onload);
};

chimXHR.prototype = {
    /**
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
     * @param {Object} header - HTTP request header options
     */
    setHeader: function setHeader(header) {
        const self = this;
        Object.keys(header).forEach((el) => {
            self._xhr.setRequestHeader(el, header[el]);
        });
    },
    setContentType: function setContentType(contentType) {
        this.setHeader({
            [_CONTENT_TYPE]: contentType
        });
    },
    /**
     * @param {string} requestType - HTTP action
     */
    openRequest: function openRequest(requestType) {
        this._xhr.open(requestType, this._url);
    },
    /**
     * Sends request with optional data parameter. If
     * data type is 'document', set the response type.
     * See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/HTML_in_XMLHttpRequest
     * @param {String} [data] - data to send as JSON with request
     */
    sendRequest: function sendRequest(data) {
        if (this._dataType === _DOC) {
            this._xhr.responseType = _DOC;
        }
        this._xhr.send(data);
    },
    /**
     * Fires a callback on successful response or error.
     * @param {responseCallback} callback
     */
    handleResponse: function handleResponse(callback) {
        const DONE = 4; // readyState 4 means request is done
        const OK = 200; // status 200 is a successful return

        // if browser is modern, XMLHttpRequest 'onload' listener
        if (!this._legacy) {
            this._xhr.onerror = () => {
                this.fail(callback);
            };
            this._xhr.onload = () => {
                if (this._xhr.status === OK) {
                    this.success(callback);
                } else {
                    this.fail(callback);
                }
            };
        // if legacy, 'onreadystatechange' listener
        } else {
            console.warn('You are using an old browser. Consider upgrading for improved support.');
            this._xhr.onreadystatechange = () => {
                if (this._xhr.readyState === DONE) {
                    if (this._xhr.status === OK) {
                        this.success(callback);
                    } else {
                        this.fail(callback);
                    }
                }
            };
        }
    },
    /**
     * On response success.
     * @param {responseCallback} callback
     */
    success: function success(callback) {
        this.setResponseType();
        this.processResponseData();
        console.log('Response:', this._responseType === _BLOB ? this._url : this._data);
        callback && callback(this._data);
    },
    /**
     * On response fail.
     * @param {responseCallback} callback
     */
    fail: function fail(callback) {
        const { status, statusText } = this._xhr;
        // HTTP/2 does not populate the statusText property
        const error = statusText ? `${status} - ${statusText}` : `${status}`;
        console.error('ERROR', error);
        callback && callback();
    },
    /**
     * Sets the response type to the provided dataType parameter,
     * if none is provided it infers the response type from the
     * content type.
     */
    setResponseType: function setResponseType() {
        const contentType = this._xhr.getResponseHeader(_CONTENT_TYPE);
        this._responseType = this._dataType || findResponseType(contentType);
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

export default chimXHR;
