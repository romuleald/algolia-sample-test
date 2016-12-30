var getTpl = (function () {
    "use strict";
    let cache = {};
    var getCache = function (templateId) {
        return cache[templateId];
    };
    var setCache = function (templateId, html) {
        cache[templateId] = html;
    };

    /**
     *
     * @param {Object} data formed object that match in template {foo:'bar'} will replace {{foo}} with bar
     * @param {String} templateId HTML attribute id
     * @returns {string} HTMl template transformed
     */
    return function gettpl(data, templateId, debug = false) {
        let templateHTML = getCache(templateId);
        if (getCache(templateId)) {
            templateHTML = getCache(templateId);
        }
        else {
            let tpl = document.getElementById(templateId);
            templateHTML = tpl.innerHTML;
            setCache(templateId, templateHTML);
        }
        return templateHTML.replace(/{{ ?([^}]*) +}}/g, function (search, result) {
            debug && console.info(result, data[result]);
            return data[result] || '';
        });
    };

})();
module.exports = getTpl;