/**
 * init
 */
import module from "../core/module";

var moduleTest = (function () {

    var ready = function (elem) {

        console.info(`le module test-no-load a été init au DOMReady via l'élément`, elem, this);

        $(elem).on('click', function () {
            elem.insertAdjacentHTML('afterEnd', `<h2 class="js-module" data-module="test-no-load">Test no-load</h2>`);
            module.parse($('.js-module'));

        });

    };

    return {
        init: ready
    }

})();

export default moduleTest;