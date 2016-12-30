/**
 * init
 */

var webmodule = (function () {


    const SELECTOR_INITIALIZED = 'js-module-init';
    let regIsInit = new RegExp(SELECTOR_INITIALIZED);
    /*
     module auto init
     just add .js-module to an HTML elem and a module name
     that will match a file in "modules" folder and it will work

     <h2 class="js-module" data-module="test">desktop/tablette</h2>

     each module can export a ready() (or init()) and a load() function
     */


    var _create = function (module, moduleName, DOMModule) {
        module.init = module.init || module.ready;
        let data = {};
        for (var i = 0; DOMModule.attributes[i]; i++) {
            var attribute = DOMModule.attributes[i];
            let name = attribute.nodeName;
            if (new RegExp(`^data-module-${moduleName}--`).test(name)) {
                let dataName = name.split(`data-module-${moduleName}--`)[1];
                data[dataName] = {value: attribute.nodeValue};
            }
        }
        return Object.create(module, data);
    };

    /**
     *
     * @param modules {NodeList}
     * @param loadFlag=false {Boolean}
     * @return {{ready: Array, load: Array}}
     */
    var parseModules = function (modules, loadFlag = false) {
        let moduleReady = [];
        let modulesLoad = [];
        for (let DOMModule of modules) {
            if (!regIsInit.test(DOMModule.className)) {
                let _moduleNameSplit = DOMModule.getAttribute('data-module').split(' ');
                for (var i = 0; i < _moduleNameSplit.length; i++) {
                    var _moduleName = _moduleNameSplit[i];
                    try {
                        let importModule = require('../modules/' + _moduleName).default;
                        var module = _create(importModule, _moduleName, DOMModule);
                        moduleReady.push({module: module, elem: DOMModule});
                        loadFlag && modulesLoad.push({module: module, elem: DOMModule});
                    }
                    catch (e) {
                        console.error(e);
                        console.error('Module not foud', '../modules/' + _moduleName, DOMModule);
                    }
                }
            }
        }

        exec(moduleReady, true);

        loadFlag && window.addEventListener('load', function () {
            exec(modulesLoad, null, true);
        });
    };

    var init = function () {
        parseModules(document.querySelectorAll('.js-module'), true);
    };

    /**
     *
     * @param modules
     * @param flag=false {Boolean} addClass to mark module has already done
     * @param doLoad=false {Boolean} exec load function
     */
    var exec = function (modules, flag = false, doLoad = false) {
        modules.forEach(function (o) {
            let module = o.module;
            if (!doLoad && module.init) {
                module.init(o.elem);
                if (flag) {
                    o.elem.className += ' ' + SELECTOR_INITIALIZED;
                }
            }
            if (doLoad && module.load) {
                module.load(o.elem);
            }
        });
    };

    return {
        ready: exec,
        init: init,
        parse: parseModules
    }

})();

module.exports = webmodule;