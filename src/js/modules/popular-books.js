/**
 * init
 */
var getService = require('../core/get-service');
var getTpl = require('../core/getTpl');
var popularBook = (function () {
    //
    var ready = function (elem) {
        elem.addEventListener('click', function () {
            getService.call('popular_books').done(function (data) {
                console.info(data);
                let html = getTpl(null, 'tpl_popularbooks_th');
                data.records.forEach(function (item) {
                    console.info(item.fields.collection);
                    html += getTpl(item.fields, 'tpl_popularbooks', true);
                });
                document.getElementById('loadpopularbooks').innerHTML = html;
            });
        });
        console.info(`le module popular-books a été init au DOMReady via l'élément`, elem);

    };

    return {
        ready: ready
    }

})();

export default popularBook;