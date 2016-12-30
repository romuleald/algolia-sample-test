//todo endpoint should be in params
var ajax = require("./ajax");

var useService = (function () {
    "use strict";

    let endpoint = {};

    var init = function (endPoint) {
        endpoint = Object.assign({}, endPoint);
    };
    /**
     *
     * @param API_service {string}
     * @param params {object} data sent to the API
     * @param loader {Boolean} display or not the loader
     * @returns {jQuery} ajax
     */
    var call = function (API_service, params, loader) {
        if (endpoint[API_service]) {

            let options = {
                url: endpoint[API_service].url
            };
            if(endpoint[API_service].params){
                params = Object.assign(endpoint[API_service].params, params);
            }

            options.method = endpoint[API_service].method;
            if (endpoint[API_service].contentType != undefined) {
                options.contentType = endpoint[API_service].contentType;
            }
            if (endpoint[API_service].processData != undefined) {
                options.processData = endpoint[API_service].processData;
            }
            options.data = params;
            return ajax(options, loader)
        }
        else {
            throw new Error(`API Service ${API_service} not defined`)
        }
    };
    return {
        init: init,
        call: call
    };

})();

module.exports = useService;