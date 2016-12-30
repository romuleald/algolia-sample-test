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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjJmYjY1ZTVjZDg5ZjIxODc1YjUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2VudHJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL3RvZ2dsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvcmUvbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzIF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcG9wdWxhci1ib29rcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXQtc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9hamF4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL2FqYXgtbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXRUcGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90ZXN0LW5vLWxvYWQuanMiXSwibmFtZXMiOlsiaW5pdCIsImpzb25lbmRwb2ludCIsImpzVG9nZ2xlciIsIl9jc3NTZWxlY3RvciIsIl9hY3RpdmVDbGFzcyIsIl9jdXJyZW50VHJpZ2dlckNsYXNzIiwiX2Nzc1NlbGVjdG9yQ29udGVudCIsInNlbGVjdG9yIiwiZSIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsIiRhbGxMaW5rc1RvZ2dsZXIiLCIkIiwiJGxpbmtUb2dnbGVyIiwiYWN0aW9uIiwidHlwZSIsInRvZ2dsZSIsInRlc3QiLCJvcGVuaW5nIiwiZGF0YSIsImNsb3NpbmciLCJjbG9zZUFsbCIsIiRhbGxDb250ZW50cyIsImdyb3VwIiwidG9nZ2xlcl9pZCIsIiRjb250ZW50IiwiZmlsdGVyIiwiJGNvbnRlbnRHcm91cCIsImlzQWN0aXZlIiwiaGFzQ2xhc3MiLCIkbGlua3NUb2dnbGVyR3JvdXAiLCJyZW1vdmVDbGFzcyIsInRyaWdnZXIiLCJhZGRDbGFzcyIsInRhZ05hbWUiLCJwcmV2ZW50RGVmYXVsdCIsImNzc1NlbGVjdG9yIiwiY3NzU2VsZWN0b3JDb250ZW50IiwiYWN0aXZlQ2xhc3MiLCJldmVudHMiLCJjdXJyZW50VHJpZ2dlckNsYXNzIiwib24iLCJtb2R1bGUiLCJleHBvcnRzIiwid2VibW9kdWxlIiwiU0VMRUNUT1JfSU5JVElBTElaRUQiLCJyZWdJc0luaXQiLCJSZWdFeHAiLCJfY3JlYXRlIiwibW9kdWxlTmFtZSIsIkRPTU1vZHVsZSIsInJlYWR5IiwiaSIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGUiLCJuYW1lIiwibm9kZU5hbWUiLCJkYXRhTmFtZSIsInNwbGl0IiwidmFsdWUiLCJub2RlVmFsdWUiLCJPYmplY3QiLCJjcmVhdGUiLCJwYXJzZU1vZHVsZXMiLCJtb2R1bGVzIiwibG9hZEZsYWciLCJtb2R1bGVSZWFkeSIsIm1vZHVsZXNMb2FkIiwiY2xhc3NOYW1lIiwiX21vZHVsZU5hbWVTcGxpdCIsImdldEF0dHJpYnV0ZSIsImxlbmd0aCIsIl9tb2R1bGVOYW1lIiwiaW1wb3J0TW9kdWxlIiwiZGVmYXVsdCIsInB1c2giLCJlbGVtIiwiY29uc29sZSIsImVycm9yIiwiZXhlYyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmbGFnIiwiZG9Mb2FkIiwiZm9yRWFjaCIsIm8iLCJsb2FkIiwicGFyc2UiLCJnZXRTZXJ2aWNlIiwicmVxdWlyZSIsImdldFRwbCIsInBvcHVsYXJCb29rIiwiY2FsbCIsImRvbmUiLCJpbmZvIiwiaHRtbCIsInJlY29yZHMiLCJpdGVtIiwiZmllbGRzIiwiY29sbGVjdGlvbiIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiYWpheCIsInVzZVNlcnZpY2UiLCJlbmRwb2ludCIsImVuZFBvaW50IiwiYXNzaWduIiwiQVBJX3NlcnZpY2UiLCJwYXJhbXMiLCJsb2FkZXIiLCJvcHRpb25zIiwidXJsIiwibWV0aG9kIiwiY29udGVudFR5cGUiLCJ1bmRlZmluZWQiLCJwcm9jZXNzRGF0YSIsIkVycm9yIiwiYWpheGxvYWRlciIsIm9uQWx3YXlzIiwib25GYWlsIiwianFYSFIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJzaG93IiwiYWx3YXlzIiwiaGlkZSIsImZhaWwiLCJhamF4bG9hZCIsIl90cGwiLCIkYWpheGxvYWRlciIsIl9jc3NDbGFzcyIsInN0YXR1cyIsIl9pc1JlYWR5IiwidHBsIiwiJHRhcmdldCIsImNzc0NsYXNzIiwiYm9keSIsImluc2VydEFkamFjZW50SFRNTCIsImNhY2hlIiwiZ2V0Q2FjaGUiLCJ0ZW1wbGF0ZUlkIiwic2V0Q2FjaGUiLCJnZXR0cGwiLCJkZWJ1ZyIsInRlbXBsYXRlSFRNTCIsInJlcGxhY2UiLCJzZWFyY2giLCJyZXN1bHQiLCJtb2R1bGVUZXN0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0Esa0JBQVVBLElBQVY7QUFDQSxzQkFBUUEsSUFBUixDQUFhQyxZQUFiO0FBQ0EsRzs7Ozs7Ozs7QUNQQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsS0FBSUMsWUFBYSxZQUFZO0FBQ3pCOzs7OztBQUtBLFNBQUlDLGVBQWUsRUFBbkI7QUFDQTs7Ozs7QUFLQSxTQUFJQyxlQUFlLEVBQW5CO0FBQ0E7Ozs7O0FBS0EsU0FBSUMsdUJBQXVCLEVBQTNCO0FBQ0E7Ozs7O0FBS0EsU0FBSUMsc0JBQXNCLEVBQTFCOztBQUVBLFNBQUlDLFdBQVcsU0FBWEEsUUFBVyxDQUFVQyxDQUFWLEVBQWE7QUFDeEJBLFdBQUVDLHdCQUFG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QUFFSHFDLGVBQU1BO0FBRkgsTUFBUDtBQUtILEVBakJnQixFQUFqQjs7bUJBbUJlOEQsVTs7Ozs7Ozs7Ozs7O0FDcEJmOzs7Ozs7QUFFQSxLQUFJQSxhQUFjLFlBQVk7O0FBRTFCLFNBQUluRyxRQUFRLFNBQVJBLEtBQVEsQ0FBVXlCLElBQVYsRUFBZ0I7O0FBRXhCQyxpQkFBUW1CLElBQVIsNkVBQTRFcEIsSUFBNUUsRUFBa0YsSUFBbEY7O0FBRUFoRSxXQUFFZ0UsSUFBRixFQUFRbkMsRUFBUixDQUFXLE9BQVgsRUFBb0IsWUFBWTtBQUM1Qm1DLGtCQUFLK0Qsa0JBQUwsQ0FBd0IsVUFBeEI7QUFDQSw4QkFBT2xELEtBQVAsQ0FBYTdFLEVBQUUsWUFBRixDQUFiO0FBRUgsVUFKRDtBQU1ILE1BVkQ7O0FBWUEsWUFBTztBQUNIWCxlQUFNa0Q7QUFESCxNQUFQO0FBSUgsRUFsQmdCLEVBQWpCLEMsQ0FMQTs7O21CQXlCZW1HLFUiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjJmYjY1ZTVjZDg5ZjIxODc1YjUiLCJpbXBvcnQgdG9nZ2xlciBmcm9tICcuL2NvcmUvdG9nZ2xlcic7XG5pbXBvcnQgd2VibW9kdWxlIGZyb20gJy4vY29yZS9tb2R1bGUnO1xuaW1wb3J0IHNlcnZpY2UgZnJvbSAnLi9jb3JlL2dldC1zZXJ2aWNlJztcblxudG9nZ2xlcigpO1xud2VibW9kdWxlLmluaXQoKTtcbnNlcnZpY2UuaW5pdChqc29uZW5kcG9pbnQpO1xuLy9cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9lbnRyeS5qcyIsIi8qKlxuICogQ3JlYXRlZCBieSBzdGVmYW4gY292YSAmIGFudG9pbmUgc2FuY2hleiBvbiAyNi8wMS8yMDE1LlxuICogQHZlcnNpb24gMS4xXG4gKlxuICogdHJpZ2dlcjpcbiAqIDxsaSBjbGFzcz1cImpzLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZXItZ3JvdXA9XCJncm91cFwiIGRhdGEtdG9nZ2xlci1pZD1cImlkXCI+XG4gKiBhdmFpbGFibGUgb3B0aW9uczpcbiAqIGRhdGEtdG9nZ2xlci1hY3Rpb249XCJvcGVufGNsb3NlfGNsb3NlLWFsbFwiXG4gKlxuICogcmVjZWl2ZXI6XG4gKiA8ZGl2IGNsYXNzPVwianMtaXRlbS10b2dnbGVyXCIgZGF0YS10b2dnbGVyLWdyb3VwPVwiZ3JvdXBcIiBkYXRhLXRvZ2dsZXItaXRlbWlkPVwiaWRcIj5cbiAqIGF2YWlsYWJsZSBvcHRpb25zOlxuICogZGF0YS10b2dnbGVyLWdyb3VwLW5vLWNsb3NlPVwidHJ1ZVwiXG4gKlxuICovXG52YXIganNUb2dnbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZXQgX2Nzc1NlbGVjdG9yID0gJyc7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgbGV0IF9hY3RpdmVDbGFzcyA9ICcnO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxldCBfY3VycmVudFRyaWdnZXJDbGFzcyA9ICcnO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxldCBfY3NzU2VsZWN0b3JDb250ZW50ID0gJyc7XG5cbiAgICB2YXIgc2VsZWN0b3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpOy8vdG9kbyBjaGVjayBob3cgdG8gaW1wcm92ZSB0aGlzIHF1aWNrIGZpeFxuICAgICAgICB2YXIgJGFsbExpbmtzVG9nZ2xlciA9ICQoX2Nzc1NlbGVjdG9yKTtcbiAgICAgICAgdmFyICRsaW5rVG9nZ2xlciA9ICQodGhpcyk7XG4gICAgICAgIHZhciBhY3Rpb24gPSBlLnR5cGU7XG4gICAgICAgIHZhciB0b2dnbGUgPSAvY2xpY2t8dG9nZ2xlLy50ZXN0KGFjdGlvbik7XG4gICAgICAgIHZhciBvcGVuaW5nID0gYWN0aW9uID09PSAnb3BlbicgfHwgJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItYWN0aW9uJykgPT09ICdvcGVuJztcbiAgICAgICAgdmFyIGNsb3NpbmcgPSBhY3Rpb24gPT09ICdjbG9zZScgfHwgJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItYWN0aW9uJykgPT09ICdjbG9zZSc7XG4gICAgICAgIHZhciBjbG9zZUFsbCA9IGFjdGlvbiA9PT0gJ2Nsb3NlLWFsbCcgfHwgJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItYWN0aW9uJykgPT09ICdjbG9zZS1hbGwnO1xuXG4gICAgICAgIHZhciAkYWxsQ29udGVudHMgPSAkKF9jc3NTZWxlY3RvckNvbnRlbnQpO1xuICAgICAgICB2YXIgZ3JvdXAgPSAkbGlua1RvZ2dsZXIuZGF0YSgndG9nZ2xlci1ncm91cCcpO1xuICAgICAgICB2YXIgdG9nZ2xlcl9pZCA9ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWlkJyk7XG4gICAgICAgIHZhciAkY29udGVudCA9ICRhbGxDb250ZW50cy5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItaXRlbWlkPScgKyB0b2dnbGVyX2lkICsgJ11bZGF0YS10b2dnbGVyLWdyb3VwPScgKyBncm91cCArICddJyk7XG4gICAgICAgIHZhciAkY29udGVudEdyb3VwID0gY2xvc2luZyA/ICRjb250ZW50IDogJGFsbENvbnRlbnRzLmZpbHRlcignW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IG9wZW5pbmcgPyAhb3BlbmluZyA6IGNsb3NpbmcgPyBjbG9zaW5nIDogJGNvbnRlbnQuaGFzQ2xhc3MoX2FjdGl2ZUNsYXNzKTtcblxuICAgICAgICAvLyBBZGQgcmVtb3ZlIGNsYXNzZXNcbiAgICAgICAgaWYgKCRjb250ZW50LmRhdGEoJ3RvZ2dsZXItZ3JvdXAtbm8tY2xvc2UnKSAmJiAhKCh0b2dnbGUgfHwgb3BlbmluZyB8fCBjbG9zaW5nKSAmJiAhaXNBY3RpdmUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvZ2dsZSB8fCBvcGVuaW5nIHx8IGNsb3NpbmcgfHwgY2xvc2VBbGwpIHtcbiAgICAgICAgICAgIGxldCAkbGlua3NUb2dnbGVyR3JvdXAgPSAkYWxsTGlua3NUb2dnbGVyLmZpbHRlcignW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuICAgICAgICAgICAgJGxpbmtzVG9nZ2xlckdyb3VwLnJlbW92ZUNsYXNzKF9hY3RpdmVDbGFzcyArICcgJyArIF9jdXJyZW50VHJpZ2dlckNsYXNzKTtcbiAgICAgICAgICAgICRjb250ZW50R3JvdXAuZmlsdGVyKCcuJyArIF9hY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3MoX2FjdGl2ZUNsYXNzKS50cmlnZ2VyKCdjbG9zZS5jb250ZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0FjdGl2ZSAmJiAhY2xvc2VBbGwgJiYgIWNsb3NpbmcpIHtcbiAgICAgICAgICAgIGxldCAkbGlua3NUb2dnbGVyR3JvdXAgPSAkYWxsTGlua3NUb2dnbGVyLmZpbHRlcignW2RhdGEtdG9nZ2xlci1pZD0nICsgdG9nZ2xlcl9pZCArICddW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuICAgICAgICAgICAgJGxpbmtzVG9nZ2xlckdyb3VwLmFkZENsYXNzKF9hY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAkbGlua1RvZ2dsZXIuYWRkQ2xhc3MoX2N1cnJlbnRUcmlnZ2VyQ2xhc3MpO1xuICAgICAgICAgICAgJGNvbnRlbnQuYWRkQ2xhc3MoX2FjdGl2ZUNsYXNzKS50cmlnZ2VyKCdvcGVuLmNvbnRlbnQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50YWdOYW1lID09PSBcIkFcIikge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjc3NTZWxlY3RvclxuICAgICAqIEBwYXJhbSBjc3NTZWxlY3RvckNvbnRlbnRcbiAgICAgKiBAcGFyYW0gYWN0aXZlQ2xhc3NcbiAgICAgKiBAcGFyYW0gZXZlbnRzXG4gICAgICogQHBhcmFtIGN1cnJlbnRUcmlnZ2VyQ2xhc3NcbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gKHtjc3NTZWxlY3RvciA9ICcuanMtdG9nZ2xlcicsIGNzc1NlbGVjdG9yQ29udGVudCA9ICcuanMtaXRlbS10b2dnbGVyJywgYWN0aXZlQ2xhc3MgPSAnYWN0aXZlJywgZXZlbnRzID0gJycsIGN1cnJlbnRUcmlnZ2VyQ2xhc3MgPSAnY3VycmVudC10cmlnZ2VyJ30gPSB7fSkge1xuICAgICAgICBldmVudHMgPSBldmVudHMgPyAnICcgKyBldmVudHMgOiAnJztcbiAgICAgICAgX2Nzc1NlbGVjdG9yID0gY3NzU2VsZWN0b3I7XG4gICAgICAgIF9jc3NTZWxlY3RvckNvbnRlbnQgPSBjc3NTZWxlY3RvckNvbnRlbnQ7XG4gICAgICAgIF9hY3RpdmVDbGFzcyA9IGFjdGl2ZUNsYXNzO1xuICAgICAgICBfY3VycmVudFRyaWdnZXJDbGFzcyA9IGN1cnJlbnRUcmlnZ2VyQ2xhc3M7XG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2sgb3BlbiBjbG9zZSB0b2dnbGUnICsgZXZlbnRzLCBjc3NTZWxlY3Rvciwgc2VsZWN0b3IpO1xuICAgIH07XG5cbn0pKCk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBqc1RvZ2dsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvdG9nZ2xlci5qcyIsIi8qKlxuICogaW5pdFxuICovXG5cbnZhciB3ZWJtb2R1bGUgPSAoZnVuY3Rpb24gKCkge1xuXG5cbiAgICBjb25zdCBTRUxFQ1RPUl9JTklUSUFMSVpFRCA9ICdqcy1tb2R1bGUtaW5pdCc7XG4gICAgbGV0IHJlZ0lzSW5pdCA9IG5ldyBSZWdFeHAoU0VMRUNUT1JfSU5JVElBTElaRUQpO1xuICAgIC8qXG4gICAgIG1vZHVsZSBhdXRvIGluaXRcbiAgICAganVzdCBhZGQgLmpzLW1vZHVsZSB0byBhbiBIVE1MIGVsZW0gYW5kIGEgbW9kdWxlIG5hbWVcbiAgICAgdGhhdCB3aWxsIG1hdGNoIGEgZmlsZSBpbiBcIm1vZHVsZXNcIiBmb2xkZXIgYW5kIGl0IHdpbGwgd29ya1xuXG4gICAgIDxoMiBjbGFzcz1cImpzLW1vZHVsZVwiIGRhdGEtbW9kdWxlPVwidGVzdFwiPmRlc2t0b3AvdGFibGV0dGU8L2gyPlxuXG4gICAgIGVhY2ggbW9kdWxlIGNhbiBleHBvcnQgYSByZWFkeSgpIChvciBpbml0KCkpIGFuZCBhIGxvYWQoKSBmdW5jdGlvblxuICAgICAqL1xuXG5cbiAgICB2YXIgX2NyZWF0ZSA9IGZ1bmN0aW9uIChtb2R1bGUsIG1vZHVsZU5hbWUsIERPTU1vZHVsZSkge1xuICAgICAgICBtb2R1bGUuaW5pdCA9IG1vZHVsZS5pbml0IHx8IG1vZHVsZS5yZWFkeTtcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IERPTU1vZHVsZS5hdHRyaWJ1dGVzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBET01Nb2R1bGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5vZGVOYW1lO1xuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAoYF5kYXRhLW1vZHVsZS0ke21vZHVsZU5hbWV9LS1gKS50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGFOYW1lID0gbmFtZS5zcGxpdChgZGF0YS1tb2R1bGUtJHttb2R1bGVOYW1lfS0tYClbMV07XG4gICAgICAgICAgICAgICAgZGF0YVtkYXRhTmFtZV0gPSB7dmFsdWU6IGF0dHJpYnV0ZS5ub2RlVmFsdWV9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG1vZHVsZSwgZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG1vZHVsZXMge05vZGVMaXN0fVxuICAgICAqIEBwYXJhbSBsb2FkRmxhZz1mYWxzZSB7Qm9vbGVhbn1cbiAgICAgKiBAcmV0dXJuIHt7cmVhZHk6IEFycmF5LCBsb2FkOiBBcnJheX19XG4gICAgICovXG4gICAgdmFyIHBhcnNlTW9kdWxlcyA9IGZ1bmN0aW9uIChtb2R1bGVzLCBsb2FkRmxhZyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBtb2R1bGVSZWFkeSA9IFtdO1xuICAgICAgICBsZXQgbW9kdWxlc0xvYWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgRE9NTW9kdWxlIG9mIG1vZHVsZXMpIHtcbiAgICAgICAgICAgIGlmICghcmVnSXNJbml0LnRlc3QoRE9NTW9kdWxlLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgX21vZHVsZU5hbWVTcGxpdCA9IERPTU1vZHVsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kdWxlJykuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9tb2R1bGVOYW1lU3BsaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9tb2R1bGVOYW1lID0gX21vZHVsZU5hbWVTcGxpdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnRNb2R1bGUgPSByZXF1aXJlKCcuLi9tb2R1bGVzLycgKyBfbW9kdWxlTmFtZSkuZGVmYXVsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2R1bGUgPSBfY3JlYXRlKGltcG9ydE1vZHVsZSwgX21vZHVsZU5hbWUsIERPTU1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVSZWFkeS5wdXNoKHttb2R1bGU6IG1vZHVsZSwgZWxlbTogRE9NTW9kdWxlfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkRmxhZyAmJiBtb2R1bGVzTG9hZC5wdXNoKHttb2R1bGU6IG1vZHVsZSwgZWxlbTogRE9NTW9kdWxlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdNb2R1bGUgbm90IGZvdWQnLCAnLi4vbW9kdWxlcy8nICsgX21vZHVsZU5hbWUsIERPTU1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleGVjKG1vZHVsZVJlYWR5LCB0cnVlKTtcblxuICAgICAgICBsb2FkRmxhZyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4ZWMobW9kdWxlc0xvYWQsIG51bGwsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBhcnNlTW9kdWxlcyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kdWxlJyksIHRydWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtb2R1bGVzXG4gICAgICogQHBhcmFtIGZsYWc9ZmFsc2Uge0Jvb2xlYW59IGFkZENsYXNzIHRvIG1hcmsgbW9kdWxlIGhhcyBhbHJlYWR5IGRvbmVcbiAgICAgKiBAcGFyYW0gZG9Mb2FkPWZhbHNlIHtCb29sZWFufSBleGVjIGxvYWQgZnVuY3Rpb25cbiAgICAgKi9cbiAgICB2YXIgZXhlYyA9IGZ1bmN0aW9uIChtb2R1bGVzLCBmbGFnID0gZmFsc2UsIGRvTG9hZCA9IGZhbHNlKSB7XG4gICAgICAgIG1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG8ubW9kdWxlO1xuICAgICAgICAgICAgaWYgKCFkb0xvYWQgJiYgbW9kdWxlLmluaXQpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdChvLmVsZW0pO1xuICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIG8uZWxlbS5jbGFzc05hbWUgKz0gJyAnICsgU0VMRUNUT1JfSU5JVElBTElaRUQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRvTG9hZCAmJiBtb2R1bGUubG9hZCkge1xuICAgICAgICAgICAgICAgIG1vZHVsZS5sb2FkKG8uZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZWFkeTogZXhlYyxcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgcGFyc2U6IHBhcnNlTW9kdWxlc1xuICAgIH1cblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3ZWJtb2R1bGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvbW9kdWxlLmpzIiwidmFyIG1hcCA9IHtcblx0XCIuL3BvcHVsYXItYm9va3NcIjogNSxcblx0XCIuL3BvcHVsYXItYm9va3MuanNcIjogNSxcblx0XCIuL3Rlc3RcIjogMTAsXG5cdFwiLi90ZXN0LW5vLWxvYWRcIjogMTEsXG5cdFwiLi90ZXN0LW5vLWxvYWQuanNcIjogMTEsXG5cdFwiLi90ZXN0LmpzXCI6IDEwXG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpKTtcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHJldHVybiBtYXBbcmVxXSB8fCAoZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIicuXCIpIH0oKSk7XG59O1xud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IDQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2R1bGVzIF5cXC5cXC8uKiRcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBpbml0XG4gKi9cbnZhciBnZXRTZXJ2aWNlID0gcmVxdWlyZSgnLi4vY29yZS9nZXQtc2VydmljZScpO1xudmFyIGdldFRwbCA9IHJlcXVpcmUoJy4uL2NvcmUvZ2V0VHBsJyk7XG52YXIgcG9wdWxhckJvb2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vXG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdldFNlcnZpY2UuY2FsbCgncG9wdWxhcl9ib29rcycpLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oZGF0YSk7XG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBnZXRUcGwobnVsbCwgJ3RwbF9wb3B1bGFyYm9va3NfdGgnKTtcbiAgICAgICAgICAgICAgICBkYXRhLnJlY29yZHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oaXRlbS5maWVsZHMuY29sbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ2V0VHBsKGl0ZW0uZmllbGRzLCAndHBsX3BvcHVsYXJib29rcycsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkcG9wdWxhcmJvb2tzJykuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBsZSBtb2R1bGUgcG9wdWxhci1ib29rcyBhIMOpdMOpIGluaXQgYXUgRE9NUmVhZHkgdmlhIGwnw6lsw6ltZW50YCwgZWxlbSk7XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZHk6IHJlYWR5XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBwb3B1bGFyQm9vaztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9wb3B1bGFyLWJvb2tzLmpzIiwiLy90b2RvIGVuZHBvaW50IHNob3VsZCBiZSBpbiBwYXJhbXNcbnZhciBhamF4ID0gcmVxdWlyZShcIi4vYWpheFwiKTtcblxudmFyIHVzZVNlcnZpY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IGVuZHBvaW50ID0ge307XG5cbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChlbmRQb2ludCkge1xuICAgICAgICBlbmRwb2ludCA9IE9iamVjdC5hc3NpZ24oe30sIGVuZFBvaW50KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIEFQSV9zZXJ2aWNlIHtzdHJpbmd9XG4gICAgICogQHBhcmFtIHBhcmFtcyB7b2JqZWN0fSBkYXRhIHNlbnQgdG8gdGhlIEFQSVxuICAgICAqIEBwYXJhbSBsb2FkZXIge0Jvb2xlYW59IGRpc3BsYXkgb3Igbm90IHRoZSBsb2FkZXJcbiAgICAgKiBAcmV0dXJucyB7alF1ZXJ5fSBhamF4XG4gICAgICovXG4gICAgdmFyIGNhbGwgPSBmdW5jdGlvbiAoQVBJX3NlcnZpY2UsIHBhcmFtcywgbG9hZGVyKSB7XG4gICAgICAgIGlmIChlbmRwb2ludFtBUElfc2VydmljZV0pIHtcblxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFtBUElfc2VydmljZV0udXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYoZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnBhcmFtcyl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihlbmRwb2ludFtBUElfc2VydmljZV0ucGFyYW1zLCBwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRpb25zLm1ldGhvZCA9IGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5tZXRob2Q7XG4gICAgICAgICAgICBpZiAoZW5kcG9pbnRbQVBJX3NlcnZpY2VdLmNvbnRlbnRUeXBlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBlbmRwb2ludFtBUElfc2VydmljZV0uY29udGVudFR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnByb2Nlc3NEYXRhICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucHJvY2Vzc0RhdGEgPSBlbmRwb2ludFtBUElfc2VydmljZV0ucHJvY2Vzc0RhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHRpb25zLmRhdGEgPSBwYXJhbXM7XG4gICAgICAgICAgICByZXR1cm4gYWpheChvcHRpb25zLCBsb2FkZXIpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSBTZXJ2aWNlICR7QVBJX3NlcnZpY2V9IG5vdCBkZWZpbmVkYClcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgY2FsbDogY2FsbFxuICAgIH07XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gdXNlU2VydmljZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9nZXQtc2VydmljZS5qcyIsInZhciBhamF4bG9hZGVyID0gcmVxdWlyZShcIi4vYWpheC1sb2FkXCIpLmRlZmF1bHQ7XG4vKipcbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9XG4gKiBAcGFyYW0gW2xvYWRlcj10cnVlXSB7Qm9vbGVhbn1cbiAqL1xudmFyIGFqYXggPSAoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIG9uQWx3YXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvL3RvZG8gc2hvdWxkIGJlIGluIHBhcmFtc1xuICAgIH07XG4gICAgdmFyIG9uRmFpbCA9IGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgLy9OT1QgRk9VTkQgT1IgTUVUSE9EIE5PVCBBTExPV0VEXG4gICAgICAgIC8vdG9kbyBzaG91bGQgYmUgaW4gcGFyYW1zXG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAob3B0aW9ucywgbG9hZGVyID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGxvYWRlcikge1xuICAgICAgICAgICAgaWYgKGFqYXhsb2FkZXIucmVhZHkpIHtcbiAgICAgICAgICAgICAgICBhamF4bG9hZGVyLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2xvYWQgbm90IHJlYWR5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJC5hamF4KG9wdGlvbnMpLmFsd2F5cyhsb2FkZXIgPyBhamF4bG9hZGVyLmhpZGUgOiBvbkFsd2F5cykuZmFpbChvbkZhaWwpO1xuICAgIH07XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9hamF4LmpzIiwidmFyIGFqYXhsb2FkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vdG9kbyB0cGwgc2hvdWxkIGJlIGluIHBhcmFtXG4gICAgbGV0IF90cGwgPSAnPGRpdiBpZD1cImFqYXhsb2FkZXJcIiBjbGFzcz1cIndpbmRvd3M4XCI+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF8xXCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzJcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfM1wiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF80XCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzVcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfNlwiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF83XCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgXG4gICAgbGV0ICRhamF4bG9hZGVyO1xuICAgIGxldCBfY3NzQ2xhc3MgPSAnJztcbiAgICBsZXQgc3RhdHVzID0gMDtcbiAgICBsZXQgX2lzUmVhZHkgPSBmYWxzZTtcbiAgICB2YXIgc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhdHVzLS07XG4gICAgICAgICRhamF4bG9hZGVyLmFkZENsYXNzKF9jc3NDbGFzcyk7XG4gICAgfTtcbiAgICB2YXIgaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhdHVzKys7XG4gICAgICAgIHN0YXR1cyA9PT0gMCAmJiAkYWpheGxvYWRlci5yZW1vdmVDbGFzcyhfY3NzQ2xhc3MpO1xuICAgIH07XG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoe3RwbCwgJHRhcmdldCwgY3NzQ2xhc3N9KSB7XG4gICAgICAgIF9jc3NDbGFzcyA9IGNzc0NsYXNzIHx8ICdhamF4bG9hZGVyLXNob3cnO1xuICAgICAgICBfdHBsID0gdHBsO1xuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdHBsKTtcbiAgICAgICAgJGFqYXhsb2FkZXIgPSAkdGFyZ2V0IHx8ICQoJyNhamF4bG9hZGVyJyk7XG4gICAgICAgIF9pc1JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICR0YXJnZXQ7XG4gICAgfTtcbiAgICB2YXIgcmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfaXNSZWFkeVxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgc2hvdzogc2hvdyxcbiAgICAgICAgaGlkZTogaGlkZSxcbiAgICAgICAgcmVhZHk6IHJlYWR5XG4gICAgfVxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhamF4bG9hZDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9hamF4LWxvYWQuanMiLCJ2YXIgZ2V0VHBsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBsZXQgY2FjaGUgPSB7fTtcbiAgICB2YXIgZ2V0Q2FjaGUgPSBmdW5jdGlvbiAodGVtcGxhdGVJZCkge1xuICAgICAgICByZXR1cm4gY2FjaGVbdGVtcGxhdGVJZF07XG4gICAgfTtcbiAgICB2YXIgc2V0Q2FjaGUgPSBmdW5jdGlvbiAodGVtcGxhdGVJZCwgaHRtbCkge1xuICAgICAgICBjYWNoZVt0ZW1wbGF0ZUlkXSA9IGh0bWw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZm9ybWVkIG9iamVjdCB0aGF0IG1hdGNoIGluIHRlbXBsYXRlIHtmb286J2Jhcid9IHdpbGwgcmVwbGFjZSB7e2Zvb319IHdpdGggYmFyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlSWQgSFRNTCBhdHRyaWJ1dGUgaWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1sIHRlbXBsYXRlIHRyYW5zZm9ybWVkXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGdldHRwbChkYXRhLCB0ZW1wbGF0ZUlkLCBkZWJ1ZyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUhUTUwgPSBnZXRDYWNoZSh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgaWYgKGdldENhY2hlKHRlbXBsYXRlSWQpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZUhUTUwgPSBnZXRDYWNoZSh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0cGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgICAgIHRlbXBsYXRlSFRNTCA9IHRwbC5pbm5lckhUTUw7XG4gICAgICAgICAgICBzZXRDYWNoZSh0ZW1wbGF0ZUlkLCB0ZW1wbGF0ZUhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZUhUTUwucmVwbGFjZSgve3sgPyhbXn1dKikgK319L2csIGZ1bmN0aW9uIChzZWFyY2gsIHJlc3VsdCkge1xuICAgICAgICAgICAgZGVidWcgJiYgY29uc29sZS5pbmZvKHJlc3VsdCwgZGF0YVtyZXN1bHRdKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhW3Jlc3VsdF0gfHwgJyc7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGdldFRwbDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9nZXRUcGwuanMiLCIvKipcbiAqIGluaXRcbiAqL1xuXG52YXIgbW9kdWxlVGVzdCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcmVhZHkgPSBmdW5jdGlvbiAoZWxlbSkge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbyhgbGUgbW9kdWxlIHRlc3QgYSDDqXTDqSBpbml0IGF1IERPTVJlYWR5IHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0sIHRoaXMpO1xuXG4gICAgfTtcbiAgICB2YXIgbG9hZCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgbGUgbW9kdWxlIHRlc3QgYSDDqXTDqSBpbml0IGF1IExPQUQgdmlhIGwnw6lsw6ltZW50YCwgZWxlbSwgdGhpcyk7XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZHk6IHJlYWR5LFxuICAgICAgICBsb2FkOiBsb2FkXG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBtb2R1bGVUZXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3Rlc3QuanMiLCIvKipcbiAqIGluaXRcbiAqL1xuaW1wb3J0IG1vZHVsZSBmcm9tIFwiLi4vY29yZS9tb2R1bGVcIjtcblxudmFyIG1vZHVsZVRlc3QgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKGVsZW0pIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oYGxlIG1vZHVsZSB0ZXN0LW5vLWxvYWQgYSDDqXTDqSBpbml0IGF1IERPTVJlYWR5IHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0sIHRoaXMpO1xuXG4gICAgICAgICQoZWxlbSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWxlbS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyRW5kJywgYDxoMiBjbGFzcz1cImpzLW1vZHVsZVwiIGRhdGEtbW9kdWxlPVwidGVzdC1uby1sb2FkXCI+VGVzdCBuby1sb2FkPC9oMj5gKTtcbiAgICAgICAgICAgIG1vZHVsZS5wYXJzZSgkKCcuanMtbW9kdWxlJykpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IHJlYWR5XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBtb2R1bGVUZXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3Rlc3Qtbm8tbG9hZC5qcyJdLCJzb3VyY2VSb290IjoiIn0=