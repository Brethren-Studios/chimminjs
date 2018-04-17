/*
Copyright 2018 Brethren Studios

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const CHIMAjax = {
    /**
     * Callback handling response body.
     *
     * @callback handleResponse
     * @param {string|Object} response - Response body.
     */

    /**
     *
     * @param {string} prefix - prefixes form entries if defined
     * @param obj - data called on recursively to traverse all params
     * @param add - serializes and adds to result
     */
    buildParams(prefix, obj, add) {
        if (Array.isArray(obj)) {
            // serialize array item
            obj.forEach((v, i) => {
                if ((/\[\]$/).test(prefix)) {
                    // treat each array item as a scalar
                    add(prefix, v);
                } else {
                    // item is non-scalar (array or object), encode its numeric index
                    CHIMAjax.buildParams(
                        `${prefix}[${(typeof v === 'object' && v != null ? i : '')}]`,
                        v,
                        add
                    );
                }
            });
        } else if (typeof obj === 'object') {
            // serialize object item
            Object.keys(obj).forEach((name) => {
                CHIMAjax
                    .buildParams(`${prefix}[${name}]`, obj[name], add);
            });
        } else {
            // serialize scalar item
            add(prefix, obj);
        }
    },
    /**
     *
     * @param {Object} a - data object to serialize
     * @returns {string} - data in request params format
     */
    params(a) {
        if (typeof a === 'string') {
            // if string passed in, assume it's already a query string
            return a;
        }

        const s = [],
            isFunction = (functionToCheck) => {
                return (functionToCheck &&
                    {}.toString.call(functionToCheck) === '[object Function]');
            },
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
                CHIMAjax.buildParams(prefix, a[prefix], add);
            });
        }
        // return the resulting serialization
        return s.join('&');
    },
    /**
     *
     * @param {string} url - request URL
     * @param data {Object|string} - query params
     * @param {handleResponse} callback
     */
    get(url, data, callback) {
        if (!url || typeof url !== 'string' || !data || !callback) {
            throw Error('All args are required and url must be a string.');
        }

        console.log('Sending GET to', url, '...');
        const xhr = new XMLHttpRequest();

        function queryStr(params) {
            if (params.length) {
                return `?${params}`;
            }
            return '';
        }
        const query = queryStr(CHIMAjax.params(data));

        xhr.open('GET', url + query);

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
     *
     * @param {string} url - request URL
     * @param data
     * @param {handleResponse} callback
     */
    post(url, data, callback) {
        if (!url || typeof url !== 'string' || !data || !callback) {
            throw Error('All args are required and url must be a string.');
        }

        console.log('Sending POST to', url, '...');
        const xhr = new XMLHttpRequest();

        function queryStr(params) {
            if (params.length) {
                return `?${params}`;
            }
            return '';
        }

        if (Array.isArray(data) || typeof data === 'string') {
            const query = queryStr(CHIMAjax.params(data));
            xhr.open('POST', url + query);

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
     *
     * @param {string} url - request URL
     * @param {Object} data - request data for json
     * @param {handleResponse} callback
     */
    put(url, data, callback) {
        if (!url || typeof url !== 'string' || !data || !callback) {
            throw Error('All args are required and url must be a string.');
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
