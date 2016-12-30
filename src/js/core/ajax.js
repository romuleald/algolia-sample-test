var ajaxloader = require("./ajax-load").default;
/**
 * @param options {object}
 * @param [loader=true] {Boolean}
 */
var ajax = (function () {
    "use strict";

    var onAlways = function () {
        //todo should be in params
    };
    var onFail = function (jqXHR, textStatus, errorThrown) {
        //NOT FOUND OR METHOD NOT ALLOWED
        //todo should be in params
    };

    return function (options, loader = false) {
        if (loader) {
            if (ajaxloader.ready) {
                ajaxloader.show();
            }
            else {
                console.error('load not ready')
            }
        }
        return $.ajax(options).always(loader ? ajaxloader.hide : onAlways).fail(onFail);
    };

})();

module.exports = ajax;