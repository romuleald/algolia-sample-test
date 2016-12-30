/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toggler = __webpack_require__(2);
	
	var _toggler2 = _interopRequireDefault(_toggler);
	
	var _module = __webpack_require__(3);
	
	var _module2 = _interopRequireDefault(_module);
	
	var _getService = __webpack_require__(6);
	
	var _getService2 = _interopRequireDefault(_getService);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _toggler2.default)();
	_module2.default.init();
	_getService2.default.init(jsonendpoint);
	//

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by stefan cova & antoine sanchez on 26/01/2015.
	 * @version 1.1
	 *
	 * trigger:
	 * <li class="js-toggler" data-toggler-group="group" data-toggler-id="id">
	 * available options:
	 * data-toggler-action="open|close|close-all"
	 *
	 * receiver:
	 * <div class="js-item-toggler" data-toggler-group="group" data-toggler-itemid="id">
	 * available options:
	 * data-toggler-group-no-close="true"
	 *
	 */
	var jsToggler = function () {
	    /**
	     *
	     * @type {string}
	     * @private
	     */
	    var _cssSelector = '';
	    /**
	     *
	     * @type {string}
	     * @private
	     */
	    var _activeClass = '';
	    /**
	     *
	     * @type {string}
	     * @private
	     */
	    var _currentTriggerClass = '';
	    /**
	     *
	     * @type {string}
	     * @private
	     */
	    var _cssSelectorContent = '';
	
	    var selector = function selector(e) {
	        e.stopImmediatePropagation(); //todo check how to improve this quick fix
	        var $allLinksToggler = $(_cssSelector);
	        var $linkToggler = $(this);
	        var action = e.type;
	        var toggle = /click|toggle/.test(action);
	        var opening = action === 'open' || $linkToggler.data('toggler-action') === 'open';
	        var closing = action === 'close' || $linkToggler.data('toggler-action') === 'close';
	        var closeAll = action === 'close-all' || $linkToggler.data('toggler-action') === 'close-all';
	
	        var $allContents = $(_cssSelectorContent);
	        var group = $linkToggler.data('toggler-group');
	        var toggler_id = $linkToggler.data('toggler-id');
	        var $content = $allContents.filter('[data-toggler-itemid=' + toggler_id + '][data-toggler-group=' + group + ']');
	        var $contentGroup = closing ? $content : $allContents.filter('[data-toggler-group=' + group + ']');
	
	        var isActive = opening ? !opening : closing ? closing : $content.hasClass(_activeClass);
	
	        // Add remove classes
	        if ($content.data('toggler-group-no-close') && !((toggle || opening || closing) && !isActive)) {
	            return;
	        }
	        if (toggle || opening || closing || closeAll) {
	            var $linksTogglerGroup = $allLinksToggler.filter('[data-toggler-group=' + group + ']');
	            $linksTogglerGroup.removeClass(_activeClass + ' ' + _currentTriggerClass);
	            $contentGroup.filter('.' + _activeClass).removeClass(_activeClass).trigger('close.content');
	        }
	        if (!isActive && !closeAll && !closing) {
	            var _$linksTogglerGroup = $allLinksToggler.filter('[data-toggler-id=' + toggler_id + '][data-toggler-group=' + group + ']');
	            _$linksTogglerGroup.addClass(_activeClass);
	            $linkToggler.addClass(_currentTriggerClass);
	            $content.addClass(_activeClass).trigger('open.content');
	        }
	        if (this.tagName === "A") {
	            e.preventDefault();
	        }
	    };
	    /**
	     *
	     * @param cssSelector
	     * @param cssSelectorContent
	     * @param activeClass
	     * @param events
	     * @param currentTriggerClass
	     */
	    return function () {
	        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	            _ref$cssSelector = _ref.cssSelector,
	            cssSelector = _ref$cssSelector === undefined ? '.js-toggler' : _ref$cssSelector,
	            _ref$cssSelectorConte = _ref.cssSelectorContent,
	            cssSelectorContent = _ref$cssSelectorConte === undefined ? '.js-item-toggler' : _ref$cssSelectorConte,
	            _ref$activeClass = _ref.activeClass,
	            activeClass = _ref$activeClass === undefined ? 'active' : _ref$activeClass,
	            _ref$events = _ref.events,
	            events = _ref$events === undefined ? '' : _ref$events,
	            _ref$currentTriggerCl = _ref.currentTriggerClass,
	            currentTriggerClass = _ref$currentTriggerCl === undefined ? 'current-trigger' : _ref$currentTriggerCl;
	
	        events = events ? ' ' + events : '';
	        _cssSelector = cssSelector;
	        _cssSelectorContent = cssSelectorContent;
	        _activeClass = activeClass;
	        _currentTriggerClass = currentTriggerClass;
	        $('body').on('click open close toggle' + events, cssSelector, selector);
	    };
	}();
	
	module.exports = jsToggler;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * init
	 */
	
	var webmodule = function () {
	
	    var SELECTOR_INITIALIZED = 'js-module-init';
	    var regIsInit = new RegExp(SELECTOR_INITIALIZED);
	    /*
	     module auto init
	     just add .js-module to an HTML elem and a module name
	     that will match a file in "modules" folder and it will work
	      <h2 class="js-module" data-module="test">desktop/tablette</h2>
	      each module can export a ready() (or init()) and a load() function
	     */
	
	    var _create = function _create(module, moduleName, DOMModule) {
	        module.init = module.init || module.ready;
	        var data = {};
	        for (var i = 0; DOMModule.attributes[i]; i++) {
	            var attribute = DOMModule.attributes[i];
	            var name = attribute.nodeName;
	            if (new RegExp('^data-module-' + moduleName + '--').test(name)) {
	                var dataName = name.split('data-module-' + moduleName + '--')[1];
	                data[dataName] = { value: attribute.nodeValue };
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
	    var parseModules = function parseModules(modules) {
	        var loadFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        var moduleReady = [];
	        var modulesLoad = [];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	            for (var _iterator = modules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var DOMModule = _step.value;
	
	                if (!regIsInit.test(DOMModule.className)) {
	                    var _moduleNameSplit = DOMModule.getAttribute('data-module').split(' ');
	                    for (var i = 0; i < _moduleNameSplit.length; i++) {
	                        var _moduleName = _moduleNameSplit[i];
	                        try {
	                            var importModule = __webpack_require__(4)("./" + _moduleName).default;
	                            var module = _create(importModule, _moduleName, DOMModule);
	                            moduleReady.push({ module: module, elem: DOMModule });
	                            loadFlag && modulesLoad.push({ module: module, elem: DOMModule });
	                        } catch (e) {
	                            console.error(e);
	                            console.error('Module not foud', '../modules/' + _moduleName, DOMModule);
	                        }
	                    }
	                }
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }
	
	        exec(moduleReady, true);
	
	        loadFlag && window.addEventListener('load', function () {
	            exec(modulesLoad, null, true);
	        });
	    };
	
	    var init = function init() {
	        parseModules(document.querySelectorAll('.js-module'), true);
	    };
	
	    /**
	     *
	     * @param modules
	     * @param flag=false {Boolean} addClass to mark module has already done
	     * @param doLoad=false {Boolean} exec load function
	     */
	    var exec = function exec(modules) {
	        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	        var doLoad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        modules.forEach(function (o) {
	            var module = o.module;
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
	    };
	}();
	
	module.exports = webmodule;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./popular-books": 5,
		"./popular-books.js": 5,
		"./test": 10,
		"./test-no-load": 11,
		"./test-no-load.js": 11,
		"./test.js": 10
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 4;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * init
	 */
	var getService = __webpack_require__(6);
	var getTpl = __webpack_require__(9);
	var popularBook = function () {
	    //
	    var ready = function ready(elem) {
	        elem.addEventListener('click', function () {
	            getService.call('popular_books').done(function (data) {
	                console.info(data);
	                var html = getTpl(null, 'tpl_popularbooks_th');
	                data.records.forEach(function (item) {
	                    console.info(item.fields.collection);
	                    html += getTpl(item.fields, 'tpl_popularbooks', true);
	                });
	                document.getElementById('loadpopularbooks').innerHTML = html;
	            });
	        });
	        console.info('le module popular-books a \xE9t\xE9 init au DOMReady via l\'\xE9l\xE9ment', elem);
	    };
	
	    return {
	        ready: ready
	    };
	}();
	
	exports.default = popularBook;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	//todo endpoint should be in params
	var ajax = __webpack_require__(7);
	
	var useService = function () {
	    "use strict";
	
	    var endpoint = {};
	
	    var init = function init(endPoint) {
	        endpoint = Object.assign({}, endPoint);
	    };
	    /**
	     *
	     * @param API_service {string}
	     * @param params {object} data sent to the API
	     * @param loader {Boolean} display or not the loader
	     * @returns {jQuery} ajax
	     */
	    var call = function call(API_service, params, loader) {
	        if (endpoint[API_service]) {
	
	            var options = {
	                url: endpoint[API_service].url
	            };
	            if (endpoint[API_service].params) {
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
	            return ajax(options, loader);
	        } else {
	            throw new Error("API Service " + API_service + " not defined");
	        }
	    };
	    return {
	        init: init,
	        call: call
	    };
	}();
	
	module.exports = useService;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var ajaxloader = __webpack_require__(8).default;
	/**
	 * @param options {object}
	 * @param [loader=true] {Boolean}
	 */
	var ajax = function () {
	    "use strict";
	
	    var onAlways = function onAlways() {
	        //todo should be in params
	    };
	    var onFail = function onFail(jqXHR, textStatus, errorThrown) {
	        //NOT FOUND OR METHOD NOT ALLOWED
	        //todo should be in params
	    };
	
	    return function (options) {
	        var loader = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        if (loader) {
	            if (ajaxloader.ready) {
	                ajaxloader.show();
	            } else {
	                console.error('load not ready');
	            }
	        }
	        return $.ajax(options).always(loader ? ajaxloader.hide : onAlways).fail(onFail);
	    };
	}();
	
	module.exports = ajax;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var ajaxload = function () {
	    "use strict";
	
	    //todo tpl should be in param
	
	    var _tpl = '<div id="ajaxloader" class="windows8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_6"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_7"><div class="wInnerBall"></div></div></div>';
	
	    var $ajaxloader = void 0;
	    var _cssClass = '';
	    var status = 0;
	    var _isReady = false;
	    var show = function show() {
	        status--;
	        $ajaxloader.addClass(_cssClass);
	    };
	    var hide = function hide() {
	        status++;
	        status === 0 && $ajaxloader.removeClass(_cssClass);
	    };
	    var init = function init(_ref) {
	        var tpl = _ref.tpl,
	            $target = _ref.$target,
	            cssClass = _ref.cssClass;
	
	        _cssClass = cssClass || 'ajaxloader-show';
	        _tpl = tpl;
	        document.body.insertAdjacentHTML('beforeend', tpl);
	        $ajaxloader = $target || $('#ajaxloader');
	        _isReady = true;
	        return $target;
	    };
	    var ready = function ready() {
	        return _isReady;
	    };
	    return {
	        init: init,
	        show: show,
	        hide: hide,
	        ready: ready
	    };
	}();
	
	module.exports = ajaxload;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	var getTpl = function () {
	    "use strict";
	
	    var cache = {};
	    var getCache = function getCache(templateId) {
	        return cache[templateId];
	    };
	    var setCache = function setCache(templateId, html) {
	        cache[templateId] = html;
	    };
	
	    /**
	     *
	     * @param {Object} data formed object that match in template {foo:'bar'} will replace {{foo}} with bar
	     * @param {String} templateId HTML attribute id
	     * @returns {string} HTMl template transformed
	     */
	    return function gettpl(data, templateId) {
	        var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        var templateHTML = getCache(templateId);
	        if (getCache(templateId)) {
	            templateHTML = getCache(templateId);
	        } else {
	            var tpl = document.getElementById(templateId);
	            templateHTML = tpl.innerHTML;
	            setCache(templateId, templateHTML);
	        }
	        return templateHTML.replace(/{{ ?([^}]*) +}}/g, function (search, result) {
	            debug && console.info(result, data[result]);
	            return data[result] || '';
	        });
	    };
	}();
	module.exports = getTpl;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * init
	 */
	
	var moduleTest = function () {
	
	    var ready = function ready(elem) {
	
	        console.info("le module test a \xE9t\xE9 init au DOMReady via l'\xE9l\xE9ment", elem, this);
	    };
	    var load = function load(elem) {
	        console.info("le module test a \xE9t\xE9 init au LOAD via l'\xE9l\xE9ment", elem, this);
	    };
	
	    return {
	        ready: ready,
	        load: load
	    };
	}();
	
	exports.default = moduleTest;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _module2 = __webpack_require__(3);
	
	var _module3 = _interopRequireDefault(_module2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var moduleTest = function () {
	
	    var ready = function ready(elem) {
	
	        console.info('le module test-no-load a \xE9t\xE9 init au DOMReady via l\'\xE9l\xE9ment', elem, this);
	
	        $(elem).on('click', function () {
	            elem.insertAdjacentHTML('afterEnd', '<h2 class="js-module" data-module="test-no-load">Test no-load</h2>');
	            _module3.default.parse($('.js-module'));
	        });
	    };
	
	    return {
	        init: ready
	    };
	}(); /**
	      * init
	      */
	exports.default = moduleTest;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODY2MGFiODBiODYxYjJhODI2MmQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2VudHJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL3RvZ2dsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvcmUvbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzIF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcG9wdWxhci1ib29rcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXQtc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9hamF4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL2FqYXgtbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXRUcGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90ZXN0LW5vLWxvYWQuanMiXSwibmFtZXMiOlsiaW5pdCIsImpzb25lbmRwb2ludCIsImpzVG9nZ2xlciIsIl9jc3NTZWxlY3RvciIsIl9hY3RpdmVDbGFzcyIsIl9jdXJyZW50VHJpZ2dlckNsYXNzIiwiX2Nzc1NlbGVjdG9yQ29udGVudCIsInNlbGVjdG9yIiwiZSIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsIiRhbGxMaW5rc1RvZ2dsZXIiLCIkIiwiJGxpbmtUb2dnbGVyIiwiYWN0aW9uIiwidHlwZSIsInRvZ2dsZSIsInRlc3QiLCJvcGVuaW5nIiwiZGF0YSIsImNsb3NpbmciLCJjbG9zZUFsbCIsIiRhbGxDb250ZW50cyIsImdyb3VwIiwidG9nZ2xlcl9pZCIsIiRjb250ZW50IiwiZmlsdGVyIiwiJGNvbnRlbnRHcm91cCIsImlzQWN0aXZlIiwiaGFzQ2xhc3MiLCIkbGlua3NUb2dnbGVyR3JvdXAiLCJyZW1vdmVDbGFzcyIsInRyaWdnZXIiLCJhZGRDbGFzcyIsInRhZ05hbWUiLCJwcmV2ZW50RGVmYXVsdCIsImNzc1NlbGVjdG9yIiwiY3NzU2VsZWN0b3JDb250ZW50IiwiYWN0aXZlQ2xhc3MiLCJldmVudHMiLCJjdXJyZW50VHJpZ2dlckNsYXNzIiwib24iLCJtb2R1bGUiLCJleHBvcnRzIiwid2VibW9kdWxlIiwiU0VMRUNUT1JfSU5JVElBTElaRUQiLCJyZWdJc0luaXQiLCJSZWdFeHAiLCJfY3JlYXRlIiwibW9kdWxlTmFtZSIsIkRPTU1vZHVsZSIsInJlYWR5IiwiaSIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGUiLCJuYW1lIiwibm9kZU5hbWUiLCJkYXRhTmFtZSIsInNwbGl0IiwidmFsdWUiLCJub2RlVmFsdWUiLCJPYmplY3QiLCJjcmVhdGUiLCJwYXJzZU1vZHVsZXMiLCJtb2R1bGVzIiwibG9hZEZsYWciLCJtb2R1bGVSZWFkeSIsIm1vZHVsZXNMb2FkIiwiY2xhc3NOYW1lIiwiX21vZHVsZU5hbWVTcGxpdCIsImdldEF0dHJpYnV0ZSIsImxlbmd0aCIsIl9tb2R1bGVOYW1lIiwiaW1wb3J0TW9kdWxlIiwiZGVmYXVsdCIsInB1c2giLCJlbGVtIiwiY29uc29sZSIsImVycm9yIiwiZXhlYyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmbGFnIiwiZG9Mb2FkIiwiZm9yRWFjaCIsIm8iLCJsb2FkIiwicGFyc2UiLCJnZXRTZXJ2aWNlIiwicmVxdWlyZSIsImdldFRwbCIsInBvcHVsYXJCb29rIiwiY2FsbCIsImRvbmUiLCJpbmZvIiwiaHRtbCIsInJlY29yZHMiLCJpdGVtIiwiZmllbGRzIiwiY29sbGVjdGlvbiIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiYWpheCIsInVzZVNlcnZpY2UiLCJlbmRwb2ludCIsImVuZFBvaW50IiwiYXNzaWduIiwiQVBJX3NlcnZpY2UiLCJwYXJhbXMiLCJsb2FkZXIiLCJvcHRpb25zIiwidXJsIiwibWV0aG9kIiwiY29udGVudFR5cGUiLCJ1bmRlZmluZWQiLCJwcm9jZXNzRGF0YSIsIkVycm9yIiwiYWpheGxvYWRlciIsIm9uQWx3YXlzIiwib25GYWlsIiwianFYSFIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJzaG93IiwiYWx3YXlzIiwiaGlkZSIsImZhaWwiLCJhamF4bG9hZCIsIl90cGwiLCIkYWpheGxvYWRlciIsIl9jc3NDbGFzcyIsInN0YXR1cyIsIl9pc1JlYWR5IiwidHBsIiwiJHRhcmdldCIsImNzc0NsYXNzIiwiYm9keSIsImluc2VydEFkamFjZW50SFRNTCIsImNhY2hlIiwiZ2V0Q2FjaGUiLCJ0ZW1wbGF0ZUlkIiwic2V0Q2FjaGUiLCJnZXR0cGwiLCJkZWJ1ZyIsInRlbXBsYXRlSFRNTCIsInJlcGxhY2UiLCJzZWFyY2giLCJyZXN1bHQiLCJtb2R1bGVUZXN0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0Esa0JBQVVBLElBQVY7QUFDQSxzQkFBUUEsSUFBUixDQUFhQyxZQUFiO0FBQ0EsRzs7Ozs7Ozs7QUNQQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsS0FBSUMsWUFBYSxZQUFZO0FBQ3pCOzs7OztBQUtBLFNBQUlDLGVBQWUsRUFBbkI7QUFDQTs7Ozs7QUFLQSxTQUFJQyxlQUFlLEVBQW5CO0FBQ0E7Ozs7O0FBS0EsU0FBSUMsdUJBQXVCLEVBQTNCO0FBQ0E7Ozs7O0FBS0EsU0FBSUMsc0JBQXNCLEVBQTFCOztBQUVBLFNBQUlDLFdBQVcsU0FBWEEsUUFBVyxDQUFVQyxDQUFWLEVBQWE7QUFDeEJBLFdBQUVDLHdCQUFG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QUFFSHFDLGVBQU1BO0FBRkgsTUFBUDtBQUtILEVBakJnQixFQUFqQjs7bUJBbUJlOEQsVTs7Ozs7Ozs7Ozs7O0FDcEJmOzs7Ozs7QUFFQSxLQUFJQSxhQUFjLFlBQVk7O0FBRTFCLFNBQUluRyxRQUFRLFNBQVJBLEtBQVEsQ0FBVXlCLElBQVYsRUFBZ0I7O0FBRXhCQyxpQkFBUW1CLElBQVIsNkVBQTRFcEIsSUFBNUUsRUFBa0YsSUFBbEY7O0FBRUFoRSxXQUFFZ0UsSUFBRixFQUFRbkMsRUFBUixDQUFXLE9BQVgsRUFBb0IsWUFBWTtBQUM1Qm1DLGtCQUFLK0Qsa0JBQUwsQ0FBd0IsVUFBeEI7QUFDQSw4QkFBT2xELEtBQVAsQ0FBYTdFLEVBQUUsWUFBRixDQUFiO0FBRUgsVUFKRDtBQU1ILE1BVkQ7O0FBWUEsWUFBTztBQUNIWCxlQUFNa0Q7QUFESCxNQUFQO0FBSUgsRUFsQmdCLEVBQWpCLEMsQ0FMQTs7O21CQXlCZW1HLFUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg2NjBhYjgwYjg2MWIyYTgyNjJkIiwiaW1wb3J0IHRvZ2dsZXIgZnJvbSAnLi9jb3JlL3RvZ2dsZXInO1xuaW1wb3J0IHdlYm1vZHVsZSBmcm9tICcuL2NvcmUvbW9kdWxlJztcbmltcG9ydCBzZXJ2aWNlIGZyb20gJy4vY29yZS9nZXQtc2VydmljZSc7XG5cbnRvZ2dsZXIoKTtcbndlYm1vZHVsZS5pbml0KCk7XG5zZXJ2aWNlLmluaXQoanNvbmVuZHBvaW50KTtcbi8vXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvZW50cnkuanMiLCIvKipcbiAqIENyZWF0ZWQgYnkgc3RlZmFuIGNvdmEgJiBhbnRvaW5lIHNhbmNoZXogb24gMjYvMDEvMjAxNS5cbiAqIEB2ZXJzaW9uIDEuMVxuICpcbiAqIHRyaWdnZXI6XG4gKiA8bGkgY2xhc3M9XCJqcy10b2dnbGVyXCIgZGF0YS10b2dnbGVyLWdyb3VwPVwiZ3JvdXBcIiBkYXRhLXRvZ2dsZXItaWQ9XCJpZFwiPlxuICogYXZhaWxhYmxlIG9wdGlvbnM6XG4gKiBkYXRhLXRvZ2dsZXItYWN0aW9uPVwib3BlbnxjbG9zZXxjbG9zZS1hbGxcIlxuICpcbiAqIHJlY2VpdmVyOlxuICogPGRpdiBjbGFzcz1cImpzLWl0ZW0tdG9nZ2xlclwiIGRhdGEtdG9nZ2xlci1ncm91cD1cImdyb3VwXCIgZGF0YS10b2dnbGVyLWl0ZW1pZD1cImlkXCI+XG4gKiBhdmFpbGFibGUgb3B0aW9uczpcbiAqIGRhdGEtdG9nZ2xlci1ncm91cC1uby1jbG9zZT1cInRydWVcIlxuICpcbiAqL1xudmFyIGpzVG9nZ2xlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgbGV0IF9jc3NTZWxlY3RvciA9ICcnO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxldCBfYWN0aXZlQ2xhc3MgPSAnJztcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZXQgX2N1cnJlbnRUcmlnZ2VyQ2xhc3MgPSAnJztcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZXQgX2Nzc1NlbGVjdG9yQ29udGVudCA9ICcnO1xuXG4gICAgdmFyIHNlbGVjdG9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTsvL3RvZG8gY2hlY2sgaG93IHRvIGltcHJvdmUgdGhpcyBxdWljayBmaXhcbiAgICAgICAgdmFyICRhbGxMaW5rc1RvZ2dsZXIgPSAkKF9jc3NTZWxlY3Rvcik7XG4gICAgICAgIHZhciAkbGlua1RvZ2dsZXIgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgYWN0aW9uID0gZS50eXBlO1xuICAgICAgICB2YXIgdG9nZ2xlID0gL2NsaWNrfHRvZ2dsZS8udGVzdChhY3Rpb24pO1xuICAgICAgICB2YXIgb3BlbmluZyA9IGFjdGlvbiA9PT0gJ29wZW4nIHx8ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWFjdGlvbicpID09PSAnb3Blbic7XG4gICAgICAgIHZhciBjbG9zaW5nID0gYWN0aW9uID09PSAnY2xvc2UnIHx8ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWFjdGlvbicpID09PSAnY2xvc2UnO1xuICAgICAgICB2YXIgY2xvc2VBbGwgPSBhY3Rpb24gPT09ICdjbG9zZS1hbGwnIHx8ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWFjdGlvbicpID09PSAnY2xvc2UtYWxsJztcblxuICAgICAgICB2YXIgJGFsbENvbnRlbnRzID0gJChfY3NzU2VsZWN0b3JDb250ZW50KTtcbiAgICAgICAgdmFyIGdyb3VwID0gJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItZ3JvdXAnKTtcbiAgICAgICAgdmFyIHRvZ2dsZXJfaWQgPSAkbGlua1RvZ2dsZXIuZGF0YSgndG9nZ2xlci1pZCcpO1xuICAgICAgICB2YXIgJGNvbnRlbnQgPSAkYWxsQ29udGVudHMuZmlsdGVyKCdbZGF0YS10b2dnbGVyLWl0ZW1pZD0nICsgdG9nZ2xlcl9pZCArICddW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuICAgICAgICB2YXIgJGNvbnRlbnRHcm91cCA9IGNsb3NpbmcgPyAkY29udGVudCA6ICRhbGxDb250ZW50cy5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKTtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSBvcGVuaW5nID8gIW9wZW5pbmcgOiBjbG9zaW5nID8gY2xvc2luZyA6ICRjb250ZW50Lmhhc0NsYXNzKF9hY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgLy8gQWRkIHJlbW92ZSBjbGFzc2VzXG4gICAgICAgIGlmICgkY29udGVudC5kYXRhKCd0b2dnbGVyLWdyb3VwLW5vLWNsb3NlJykgJiYgISgodG9nZ2xlIHx8IG9wZW5pbmcgfHwgY2xvc2luZykgJiYgIWlzQWN0aXZlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2dnbGUgfHwgb3BlbmluZyB8fCBjbG9zaW5nIHx8IGNsb3NlQWxsKSB7XG4gICAgICAgICAgICBsZXQgJGxpbmtzVG9nZ2xlckdyb3VwID0gJGFsbExpbmtzVG9nZ2xlci5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKTtcbiAgICAgICAgICAgICRsaW5rc1RvZ2dsZXJHcm91cC5yZW1vdmVDbGFzcyhfYWN0aXZlQ2xhc3MgKyAnICcgKyBfY3VycmVudFRyaWdnZXJDbGFzcyk7XG4gICAgICAgICAgICAkY29udGVudEdyb3VwLmZpbHRlcignLicgKyBfYWN0aXZlQ2xhc3MpLnJlbW92ZUNsYXNzKF9hY3RpdmVDbGFzcykudHJpZ2dlcignY2xvc2UuY29udGVudCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNBY3RpdmUgJiYgIWNsb3NlQWxsICYmICFjbG9zaW5nKSB7XG4gICAgICAgICAgICBsZXQgJGxpbmtzVG9nZ2xlckdyb3VwID0gJGFsbExpbmtzVG9nZ2xlci5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItaWQ9JyArIHRvZ2dsZXJfaWQgKyAnXVtkYXRhLXRvZ2dsZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKTtcbiAgICAgICAgICAgICRsaW5rc1RvZ2dsZXJHcm91cC5hZGRDbGFzcyhfYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgJGxpbmtUb2dnbGVyLmFkZENsYXNzKF9jdXJyZW50VHJpZ2dlckNsYXNzKTtcbiAgICAgICAgICAgICRjb250ZW50LmFkZENsYXNzKF9hY3RpdmVDbGFzcykudHJpZ2dlcignb3Blbi5jb250ZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGFnTmFtZSA9PT0gXCJBXCIpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY3NzU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0gY3NzU2VsZWN0b3JDb250ZW50XG4gICAgICogQHBhcmFtIGFjdGl2ZUNsYXNzXG4gICAgICogQHBhcmFtIGV2ZW50c1xuICAgICAqIEBwYXJhbSBjdXJyZW50VHJpZ2dlckNsYXNzXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh7Y3NzU2VsZWN0b3IgPSAnLmpzLXRvZ2dsZXInLCBjc3NTZWxlY3RvckNvbnRlbnQgPSAnLmpzLWl0ZW0tdG9nZ2xlcicsIGFjdGl2ZUNsYXNzID0gJ2FjdGl2ZScsIGV2ZW50cyA9ICcnLCBjdXJyZW50VHJpZ2dlckNsYXNzID0gJ2N1cnJlbnQtdHJpZ2dlcid9ID0ge30pIHtcbiAgICAgICAgZXZlbnRzID0gZXZlbnRzID8gJyAnICsgZXZlbnRzIDogJyc7XG4gICAgICAgIF9jc3NTZWxlY3RvciA9IGNzc1NlbGVjdG9yO1xuICAgICAgICBfY3NzU2VsZWN0b3JDb250ZW50ID0gY3NzU2VsZWN0b3JDb250ZW50O1xuICAgICAgICBfYWN0aXZlQ2xhc3MgPSBhY3RpdmVDbGFzcztcbiAgICAgICAgX2N1cnJlbnRUcmlnZ2VyQ2xhc3MgPSBjdXJyZW50VHJpZ2dlckNsYXNzO1xuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrIG9wZW4gY2xvc2UgdG9nZ2xlJyArIGV2ZW50cywgY3NzU2VsZWN0b3IsIHNlbGVjdG9yKTtcbiAgICB9O1xuXG59KSgpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ganNUb2dnbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9jb3JlL3RvZ2dsZXIuanMiLCIvKipcbiAqIGluaXRcbiAqL1xuXG52YXIgd2VibW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcblxuXG4gICAgY29uc3QgU0VMRUNUT1JfSU5JVElBTElaRUQgPSAnanMtbW9kdWxlLWluaXQnO1xuICAgIGxldCByZWdJc0luaXQgPSBuZXcgUmVnRXhwKFNFTEVDVE9SX0lOSVRJQUxJWkVEKTtcbiAgICAvKlxuICAgICBtb2R1bGUgYXV0byBpbml0XG4gICAgIGp1c3QgYWRkIC5qcy1tb2R1bGUgdG8gYW4gSFRNTCBlbGVtIGFuZCBhIG1vZHVsZSBuYW1lXG4gICAgIHRoYXQgd2lsbCBtYXRjaCBhIGZpbGUgaW4gXCJtb2R1bGVzXCIgZm9sZGVyIGFuZCBpdCB3aWxsIHdvcmtcblxuICAgICA8aDIgY2xhc3M9XCJqcy1tb2R1bGVcIiBkYXRhLW1vZHVsZT1cInRlc3RcIj5kZXNrdG9wL3RhYmxldHRlPC9oMj5cblxuICAgICBlYWNoIG1vZHVsZSBjYW4gZXhwb3J0IGEgcmVhZHkoKSAob3IgaW5pdCgpKSBhbmQgYSBsb2FkKCkgZnVuY3Rpb25cbiAgICAgKi9cblxuXG4gICAgdmFyIF9jcmVhdGUgPSBmdW5jdGlvbiAobW9kdWxlLCBtb2R1bGVOYW1lLCBET01Nb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmluaXQgPSBtb2R1bGUuaW5pdCB8fCBtb2R1bGUucmVhZHk7XG4gICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBET01Nb2R1bGUuYXR0cmlidXRlc1tpXTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gRE9NTW9kdWxlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5ub2RlTmFtZTtcbiAgICAgICAgICAgIGlmIChuZXcgUmVnRXhwKGBeZGF0YS1tb2R1bGUtJHttb2R1bGVOYW1lfS0tYCkudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhTmFtZSA9IG5hbWUuc3BsaXQoYGRhdGEtbW9kdWxlLSR7bW9kdWxlTmFtZX0tLWApWzFdO1xuICAgICAgICAgICAgICAgIGRhdGFbZGF0YU5hbWVdID0ge3ZhbHVlOiBhdHRyaWJ1dGUubm9kZVZhbHVlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShtb2R1bGUsIGRhdGEpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtb2R1bGVzIHtOb2RlTGlzdH1cbiAgICAgKiBAcGFyYW0gbG9hZEZsYWc9ZmFsc2Uge0Jvb2xlYW59XG4gICAgICogQHJldHVybiB7e3JlYWR5OiBBcnJheSwgbG9hZDogQXJyYXl9fVxuICAgICAqL1xuICAgIHZhciBwYXJzZU1vZHVsZXMgPSBmdW5jdGlvbiAobW9kdWxlcywgbG9hZEZsYWcgPSBmYWxzZSkge1xuICAgICAgICBsZXQgbW9kdWxlUmVhZHkgPSBbXTtcbiAgICAgICAgbGV0IG1vZHVsZXNMb2FkID0gW107XG4gICAgICAgIGZvciAobGV0IERPTU1vZHVsZSBvZiBtb2R1bGVzKSB7XG4gICAgICAgICAgICBpZiAoIXJlZ0lzSW5pdC50ZXN0KERPTU1vZHVsZS5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9tb2R1bGVOYW1lU3BsaXQgPSBET01Nb2R1bGUuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZHVsZScpLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfbW9kdWxlTmFtZVNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbW9kdWxlTmFtZSA9IF9tb2R1bGVOYW1lU3BsaXRbaV07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW1wb3J0TW9kdWxlID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8nICsgX21vZHVsZU5hbWUpLmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kdWxlID0gX2NyZWF0ZShpbXBvcnRNb2R1bGUsIF9tb2R1bGVOYW1lLCBET01Nb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlUmVhZHkucHVzaCh7bW9kdWxlOiBtb2R1bGUsIGVsZW06IERPTU1vZHVsZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEZsYWcgJiYgbW9kdWxlc0xvYWQucHVzaCh7bW9kdWxlOiBtb2R1bGUsIGVsZW06IERPTU1vZHVsZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignTW9kdWxlIG5vdCBmb3VkJywgJy4uL21vZHVsZXMvJyArIF9tb2R1bGVOYW1lLCBET01Nb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhlYyhtb2R1bGVSZWFkeSwgdHJ1ZSk7XG5cbiAgICAgICAgbG9hZEZsYWcgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleGVjKG1vZHVsZXNMb2FkLCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwYXJzZU1vZHVsZXMoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW1vZHVsZScpLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbW9kdWxlc1xuICAgICAqIEBwYXJhbSBmbGFnPWZhbHNlIHtCb29sZWFufSBhZGRDbGFzcyB0byBtYXJrIG1vZHVsZSBoYXMgYWxyZWFkeSBkb25lXG4gICAgICogQHBhcmFtIGRvTG9hZD1mYWxzZSB7Qm9vbGVhbn0gZXhlYyBsb2FkIGZ1bmN0aW9uXG4gICAgICovXG4gICAgdmFyIGV4ZWMgPSBmdW5jdGlvbiAobW9kdWxlcywgZmxhZyA9IGZhbHNlLCBkb0xvYWQgPSBmYWxzZSkge1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgIGxldCBtb2R1bGUgPSBvLm1vZHVsZTtcbiAgICAgICAgICAgIGlmICghZG9Mb2FkICYmIG1vZHVsZS5pbml0KSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmluaXQoby5lbGVtKTtcbiAgICAgICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICBvLmVsZW0uY2xhc3NOYW1lICs9ICcgJyArIFNFTEVDVE9SX0lOSVRJQUxJWkVEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb0xvYWQgJiYgbW9kdWxlLmxvYWQpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUubG9hZChvLmVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZHk6IGV4ZWMsXG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIHBhcnNlOiBwYXJzZU1vZHVsZXNcbiAgICB9XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2VibW9kdWxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9jb3JlL21vZHVsZS5qcyIsInZhciBtYXAgPSB7XG5cdFwiLi9wb3B1bGFyLWJvb2tzXCI6IDUsXG5cdFwiLi9wb3B1bGFyLWJvb2tzLmpzXCI6IDUsXG5cdFwiLi90ZXN0XCI6IDEwLFxuXHRcIi4vdGVzdC1uby1sb2FkXCI6IDExLFxuXHRcIi4vdGVzdC1uby1sb2FkLmpzXCI6IDExLFxuXHRcIi4vdGVzdC5qc1wiOiAxMFxufTtcbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyh3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSk7XG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRyZXR1cm4gbWFwW3JlcV0gfHwgKGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInLlwiKSB9KCkpO1xufTtcbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSA0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kdWxlcyBeXFwuXFwvLiokXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogaW5pdFxuICovXG52YXIgZ2V0U2VydmljZSA9IHJlcXVpcmUoJy4uL2NvcmUvZ2V0LXNlcnZpY2UnKTtcbnZhciBnZXRUcGwgPSByZXF1aXJlKCcuLi9jb3JlL2dldFRwbCcpO1xudmFyIHBvcHVsYXJCb29rID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvL1xuICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBnZXRTZXJ2aWNlLmNhbGwoJ3BvcHVsYXJfYm9va3MnKS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGRhdGEpO1xuICAgICAgICAgICAgICAgIGxldCBodG1sID0gZ2V0VHBsKG51bGwsICd0cGxfcG9wdWxhcmJvb2tzX3RoJyk7XG4gICAgICAgICAgICAgICAgZGF0YS5yZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGl0ZW0uZmllbGRzLmNvbGxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICBodG1sICs9IGdldFRwbChpdGVtLmZpZWxkcywgJ3RwbF9wb3B1bGFyYm9va3MnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZHBvcHVsYXJib29rcycpLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgbGUgbW9kdWxlIHBvcHVsYXItYm9va3MgYSDDqXTDqSBpbml0IGF1IERPTVJlYWR5IHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0pO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWR5OiByZWFkeVxuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgcG9wdWxhckJvb2s7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcG9wdWxhci1ib29rcy5qcyIsIi8vdG9kbyBlbmRwb2ludCBzaG91bGQgYmUgaW4gcGFyYW1zXG52YXIgYWpheCA9IHJlcXVpcmUoXCIuL2FqYXhcIik7XG5cbnZhciB1c2VTZXJ2aWNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBlbmRwb2ludCA9IHt9O1xuXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoZW5kUG9pbnQpIHtcbiAgICAgICAgZW5kcG9pbnQgPSBPYmplY3QuYXNzaWduKHt9LCBlbmRQb2ludCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBBUElfc2VydmljZSB7c3RyaW5nfVxuICAgICAqIEBwYXJhbSBwYXJhbXMge29iamVjdH0gZGF0YSBzZW50IHRvIHRoZSBBUElcbiAgICAgKiBAcGFyYW0gbG9hZGVyIHtCb29sZWFufSBkaXNwbGF5IG9yIG5vdCB0aGUgbG9hZGVyXG4gICAgICogQHJldHVybnMge2pRdWVyeX0gYWpheFxuICAgICAqL1xuICAgIHZhciBjYWxsID0gZnVuY3Rpb24gKEFQSV9zZXJ2aWNlLCBwYXJhbXMsIGxvYWRlcikge1xuICAgICAgICBpZiAoZW5kcG9pbnRbQVBJX3NlcnZpY2VdKSB7XG5cbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmKGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5wYXJhbXMpe1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnBhcmFtcywgcGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3B0aW9ucy5tZXRob2QgPSBlbmRwb2ludFtBUElfc2VydmljZV0ubWV0aG9kO1xuICAgICAgICAgICAgaWYgKGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5jb250ZW50VHlwZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gZW5kcG9pbnRbQVBJX3NlcnZpY2VdLmNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5wcm9jZXNzRGF0YSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnByb2Nlc3NEYXRhID0gZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnByb2Nlc3NEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gcGFyYW1zO1xuICAgICAgICAgICAgcmV0dXJuIGFqYXgob3B0aW9ucywgbG9hZGVyKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgU2VydmljZSAke0FQSV9zZXJ2aWNlfSBub3QgZGVmaW5lZGApXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIGNhbGw6IGNhbGxcbiAgICB9O1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZVNlcnZpY2U7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvZ2V0LXNlcnZpY2UuanMiLCJ2YXIgYWpheGxvYWRlciA9IHJlcXVpcmUoXCIuL2FqYXgtbG9hZFwiKS5kZWZhdWx0O1xuLyoqXG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fVxuICogQHBhcmFtIFtsb2FkZXI9dHJ1ZV0ge0Jvb2xlYW59XG4gKi9cbnZhciBhamF4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBvbkFsd2F5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy90b2RvIHNob3VsZCBiZSBpbiBwYXJhbXNcbiAgICB9O1xuICAgIHZhciBvbkZhaWwgPSBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIC8vTk9UIEZPVU5EIE9SIE1FVEhPRCBOT1QgQUxMT1dFRFxuICAgICAgICAvL3RvZG8gc2hvdWxkIGJlIGluIHBhcmFtc1xuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9wdGlvbnMsIGxvYWRlciA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChsb2FkZXIpIHtcbiAgICAgICAgICAgIGlmIChhamF4bG9hZGVyLnJlYWR5KSB7XG4gICAgICAgICAgICAgICAgYWpheGxvYWRlci5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdsb2FkIG5vdCByZWFkeScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQuYWpheChvcHRpb25zKS5hbHdheXMobG9hZGVyID8gYWpheGxvYWRlci5oaWRlIDogb25BbHdheXMpLmZhaWwob25GYWlsKTtcbiAgICB9O1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXg7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvYWpheC5qcyIsInZhciBhamF4bG9hZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvL3RvZG8gdHBsIHNob3VsZCBiZSBpbiBwYXJhbVxuICAgIGxldCBfdHBsID0gJzxkaXYgaWQ9XCJhamF4bG9hZGVyXCIgY2xhc3M9XCJ3aW5kb3dzOFwiPjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfMVwiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF8yXCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzNcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfNFwiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF81XCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzZcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfN1wiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgIFxuICAgIGxldCAkYWpheGxvYWRlcjtcbiAgICBsZXQgX2Nzc0NsYXNzID0gJyc7XG4gICAgbGV0IHN0YXR1cyA9IDA7XG4gICAgbGV0IF9pc1JlYWR5ID0gZmFsc2U7XG4gICAgdmFyIHNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0YXR1cy0tO1xuICAgICAgICAkYWpheGxvYWRlci5hZGRDbGFzcyhfY3NzQ2xhc3MpO1xuICAgIH07XG4gICAgdmFyIGhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0YXR1cysrO1xuICAgICAgICBzdGF0dXMgPT09IDAgJiYgJGFqYXhsb2FkZXIucmVtb3ZlQ2xhc3MoX2Nzc0NsYXNzKTtcbiAgICB9O1xuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKHt0cGwsICR0YXJnZXQsIGNzc0NsYXNzfSkge1xuICAgICAgICBfY3NzQ2xhc3MgPSBjc3NDbGFzcyB8fCAnYWpheGxvYWRlci1zaG93JztcbiAgICAgICAgX3RwbCA9IHRwbDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRwbCk7XG4gICAgICAgICRhamF4bG9hZGVyID0gJHRhcmdldCB8fCAkKCcjYWpheGxvYWRlcicpO1xuICAgICAgICBfaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0O1xuICAgIH07XG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX2lzUmVhZHlcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIHNob3c6IHNob3csXG4gICAgICAgIGhpZGU6IGhpZGUsXG4gICAgICAgIHJlYWR5OiByZWFkeVxuICAgIH1cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheGxvYWQ7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvYWpheC1sb2FkLmpzIiwidmFyIGdldFRwbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbGV0IGNhY2hlID0ge307XG4gICAgdmFyIGdldENhY2hlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlW3RlbXBsYXRlSWRdO1xuICAgIH07XG4gICAgdmFyIHNldENhY2hlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWQsIGh0bWwpIHtcbiAgICAgICAgY2FjaGVbdGVtcGxhdGVJZF0gPSBodG1sO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGZvcm1lZCBvYmplY3QgdGhhdCBtYXRjaCBpbiB0ZW1wbGF0ZSB7Zm9vOidiYXInfSB3aWxsIHJlcGxhY2Uge3tmb299fSB3aXRoIGJhclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZUlkIEhUTUwgYXR0cmlidXRlIGlkXG4gICAgICogQHJldHVybnMge3N0cmluZ30gSFRNbCB0ZW1wbGF0ZSB0cmFuc2Zvcm1lZFxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBnZXR0cGwoZGF0YSwgdGVtcGxhdGVJZCwgZGVidWcgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdGVtcGxhdGVIVE1MID0gZ2V0Q2FjaGUodGVtcGxhdGVJZCk7XG4gICAgICAgIGlmIChnZXRDYWNoZSh0ZW1wbGF0ZUlkKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVIVE1MID0gZ2V0Q2FjaGUodGVtcGxhdGVJZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgdHBsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCk7XG4gICAgICAgICAgICB0ZW1wbGF0ZUhUTUwgPSB0cGwuaW5uZXJIVE1MO1xuICAgICAgICAgICAgc2V0Q2FjaGUodGVtcGxhdGVJZCwgdGVtcGxhdGVIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVtcGxhdGVIVE1MLnJlcGxhY2UoL3t7ID8oW159XSopICt9fS9nLCBmdW5jdGlvbiAoc2VhcmNoLCByZXN1bHQpIHtcbiAgICAgICAgICAgIGRlYnVnICYmIGNvbnNvbGUuaW5mbyhyZXN1bHQsIGRhdGFbcmVzdWx0XSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVtyZXN1bHRdIHx8ICcnO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBnZXRUcGw7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvZ2V0VHBsLmpzIiwiLyoqXG4gKiBpbml0XG4gKi9cblxudmFyIG1vZHVsZVRlc3QgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKGVsZW0pIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oYGxlIG1vZHVsZSB0ZXN0IGEgw6l0w6kgaW5pdCBhdSBET01SZWFkeSB2aWEgbCfDqWzDqW1lbnRgLCBlbGVtLCB0aGlzKTtcblxuICAgIH07XG4gICAgdmFyIGxvYWQgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICBjb25zb2xlLmluZm8oYGxlIG1vZHVsZSB0ZXN0IGEgw6l0w6kgaW5pdCBhdSBMT0FEIHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0sIHRoaXMpO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWR5OiByZWFkeSxcbiAgICAgICAgbG9hZDogbG9hZFxuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9kdWxlVGVzdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90ZXN0LmpzIiwiLyoqXG4gKiBpbml0XG4gKi9cbmltcG9ydCBtb2R1bGUgZnJvbSBcIi4uL2NvcmUvbW9kdWxlXCI7XG5cbnZhciBtb2R1bGVUZXN0ID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cbiAgICAgICAgY29uc29sZS5pbmZvKGBsZSBtb2R1bGUgdGVzdC1uby1sb2FkIGEgw6l0w6kgaW5pdCBhdSBET01SZWFkeSB2aWEgbCfDqWzDqW1lbnRgLCBlbGVtLCB0aGlzKTtcblxuICAgICAgICAkKGVsZW0pLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsZW0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlckVuZCcsIGA8aDIgY2xhc3M9XCJqcy1tb2R1bGVcIiBkYXRhLW1vZHVsZT1cInRlc3Qtbm8tbG9hZFwiPlRlc3Qgbm8tbG9hZDwvaDI+YCk7XG4gICAgICAgICAgICBtb2R1bGUucGFyc2UoJCgnLmpzLW1vZHVsZScpKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0OiByZWFkeVxuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9kdWxlVGVzdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90ZXN0LW5vLWxvYWQuanMiXSwic291cmNlUm9vdCI6IiJ9