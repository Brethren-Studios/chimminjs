
export default {
    /**
     *
     * @param {*} functionToCheck
     * @returns {boolean}
     */
    isFunction: function isFunction(functionToCheck) {
        return (functionToCheck &&
            {}.toString.call(functionToCheck) === '[object Function]');
    },
    /**
     *
     * @param stringToCheck
     * @returns {boolean}
     */
    isString: function isString(stringToCheck) {
        return (typeof stringToCheck === 'string');
    },
    /**
     *
     * @param objectToCheck
     * @returns {boolean}
     */
    isObject: function isObject(objectToCheck) {
        return (typeof objectToCheck === 'object');
    },
    /**
     *
     * @param boolToCheck
     * @returns {boolean}
     */
    isBoolean: function isBoolean(boolToCheck) {
        return (typeof boolToCheck === 'boolean');
    },
    /**
     *
     * @param valueToCheck
     * @returns {boolean}
     */
    isDefined: function isDefined(valueToCheck) {
        return valueToCheck !== undefined && valueToCheck !== null;
    }
};
