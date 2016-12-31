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
	
	var _getTpl = __webpack_require__(9);
	
	var _getTpl2 = _interopRequireDefault(_getTpl);
	
	var _algoliasearch = __webpack_require__(12);
	
	var _algoliasearch2 = _interopRequireDefault(_algoliasearch);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _toggler2.default)();
	_module2.default.init();
	
	var client = (0, _algoliasearch2.default)('TDV4I77F2F', 'c5731b2aa4cb316c0f55990145f0126d');
	
	var DOMResult = document.querySelector('.js-result');
	
	var itemPerPage = 3;
	var currentUIPage = 0;
	var getStars = function getStars(r) {
	    return '★'.repeat(Math.abs(r));
	};
	var makeStars = function makeStars(score) {
	    return (0, _getTpl2.default)({ stars: getStars(score), stared: getStars(score - 5) }, 'tpl_stars');
	};
	
	var concatResult = function concatResult(res, allRes) {
	    return allRes.concat(res);
	};
	var showListResult = function showListResult(html) {
	    var addHtml = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	
	    if (addHtml) {
	        DOMResult.innerHTML = html;
	    } else {
	        DOMResult.insertAdjacentHTML('beforeend', html);
	    }
	};
	var setFilterHTML = function setFilterHTML(name, filters) {
	    var html = '';
	    var aFilters = Object.keys(filters);
	    aFilters.forEach(function (item) {
	        var options = { count: filters[item].length, type: item };
	        if ('stars' === name) {
	            options['content'] = makeStars(item);
	        }
	        html += (0, _getTpl2.default)(options, 'tpl_filter_' + name);
	    });
	    $('.js-filter[data-name="' + name + '"]').html(html);
	};
	var searchEnd = function searchEnd(allRes) {
	    var html = '';
	    var allFoodType = {};
	    var allStarsCount = {};
	    var allPayment = {};
	    currentUIPage = 0; //always reset
	
	    for (var i = 0; i < allRes.length; i++) {
	        var item = allRes[i];
	        var id = item.objectID;
	        var foodType = item.food_type;
	        var starsCount = Math.floor(item.stars_count);
	        var payment = item.payment_options;
	        (allFoodType[foodType] = allFoodType[foodType] ? allFoodType[foodType] : []).push(id);
	        (allStarsCount[starsCount] = allStarsCount[starsCount] ? allStarsCount[starsCount] : []).push(id);
	        for (var iPayment = 0; iPayment < payment.length; iPayment++) {
	            (allPayment[payment[iPayment]] = allPayment[payment[iPayment]] ? allPayment[payment[iPayment]] : []).push(id);
	        }
	        if (i < itemPerPage) {
	            html += (0, _getTpl2.default)({
	                media: item.image_url,
	                name: item.name,
	                reserveurl: item.reserve_url,
	                score: item.stars_count,
	                stars: getStars(item.stars_count),
	                review: item.reviews_count,
	                foodtype: item.food_type,
	                place: item.area,
	                pricerange: item.price_range
	            }, 'tpl_search');
	        }
	    }
	
	    setFilterHTML('foods', allFoodType);
	    setFilterHTML('stars', allStarsCount);
	    setFilterHTML('payment', allPayment);
	    showListResult(html);
	};
	var searchStart = function searchStart(query) {
	    var allRes = [];
	    var searchDone = function searchDone(err, content) {
	        var result = content.results[0];
	        allRes = concatResult(result.hits, allRes);
	        if (result.nbPages > result.page + 1) {
	            client.search([{
	                indexName: 'all',
	                query: query,
	                params: {
	                    page: result.page + 1
	                }
	            }], searchDone);
	        } else {
	            searchEnd(allRes);
	        }
	    };
	    client.search([{
	        indexName: 'all',
	        query: query
	    }], searchDone);
	};
	var TIMEOUTsearch = 0;
	$('.js-search').on('input', function (e) {
	    var query = this.value;
	    clearTimeout(TIMEOUTsearch);
	    TIMEOUTsearch = setTimeout(function () {
	        searchStart(query);
	    }, 200);
	});
	
	//merge jsons
	//$.getJSON('resources/dataset/restaurants_list.json').done(function (listRes) {
	//    $.getJSON('resources/dataset/restaurants_info.json').done(function (infoRes) {
	//        let all = listRes.map(function(listItem) {
	//            return Object.assign(infoRes.filter(function (infoItem) {
	//                return infoItem.objectID === listItem.objectID;
	//            })[0], listItem)
	//        });
	//        console.info(JSON.stringify(all));
	//    })
	//});

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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var AlgoliaSearch = __webpack_require__(13);
	var createAlgoliasearch = __webpack_require__(38);
	
	module.exports = createAlgoliasearch(AlgoliaSearch);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = AlgoliaSearch;
	
	var Index = __webpack_require__(14);
	var deprecate = __webpack_require__(20);
	var deprecatedMessage = __webpack_require__(21);
	var AlgoliaSearchCore = __webpack_require__(32);
	var inherits = __webpack_require__(15);
	var errors = __webpack_require__(18);
	
	function AlgoliaSearch() {
	  AlgoliaSearchCore.apply(this, arguments);
	}
	
	inherits(AlgoliaSearch, AlgoliaSearchCore);
	
	/*
	 * Delete an index
	 *
	 * @param indexName the name of index to delete
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer that contains the task ID
	 */
	AlgoliaSearch.prototype.deleteIndex = function (indexName, callback) {
	  return this._jsonRequest({
	    method: 'DELETE',
	    url: '/1/indexes/' + encodeURIComponent(indexName),
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/**
	 * Move an existing index.
	 * @param srcIndexName the name of index to copy.
	 * @param dstIndexName the new index name that will contains a copy of
	 * srcIndexName (destination will be overriten if it already exist).
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer that contains the task ID
	 */
	AlgoliaSearch.prototype.moveIndex = function (srcIndexName, dstIndexName, callback) {
	  var postObj = {
	    operation: 'move', destination: dstIndexName
	  };
	  return this._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/**
	 * Copy an existing index.
	 * @param srcIndexName the name of index to copy.
	 * @param dstIndexName the new index name that will contains a copy
	 * of srcIndexName (destination will be overriten if it already exist).
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer that contains the task ID
	 */
	AlgoliaSearch.prototype.copyIndex = function (srcIndexName, dstIndexName, callback) {
	  var postObj = {
	    operation: 'copy', destination: dstIndexName
	  };
	  return this._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/**
	 * Return last log entries.
	 * @param offset Specify the first entry to retrieve (0-based, 0 is the most recent log entry).
	 * @param length Specify the maximum number of entries to retrieve starting
	 * at offset. Maximum allowed value: 1000.
	 * @param type Specify the maximum number of entries to retrieve starting
	 * at offset. Maximum allowed value: 1000.
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer that contains the task ID
	 */
	AlgoliaSearch.prototype.getLogs = function (offset, length, callback) {
	  var clone = __webpack_require__(23);
	  var params = {};
	  if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) === 'object') {
	    // getLogs(params)
	    params = clone(offset);
	    callback = length;
	  } else if (arguments.length === 0 || typeof offset === 'function') {
	    // getLogs([cb])
	    callback = offset;
	  } else if (arguments.length === 1 || typeof length === 'function') {
	    // getLogs(1, [cb)]
	    callback = length;
	    params.offset = offset;
	  } else {
	    // getLogs(1, 2, [cb])
	    params.offset = offset;
	    params.length = length;
	  }
	
	  if (params.offset === undefined) params.offset = 0;
	  if (params.length === undefined) params.length = 10;
	
	  return this._jsonRequest({
	    method: 'GET',
	    url: '/1/logs?' + this._getSearchParams(params, ''),
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	 * List all existing indexes (paginated)
	 *
	 * @param page The page to retrieve, starting at 0.
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer with index list
	 */
	AlgoliaSearch.prototype.listIndexes = function (page, callback) {
	  var params = '';
	
	  if (page === undefined || typeof page === 'function') {
	    callback = page;
	  } else {
	    params = '?page=' + page;
	  }
	
	  return this._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes' + params,
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	 * Get the index object initialized
	 *
	 * @param indexName the name of index
	 * @param callback the result callback with one argument (the Index instance)
	 */
	AlgoliaSearch.prototype.initIndex = function (indexName) {
	  return new Index(this, indexName);
	};
	
	/*
	 * List all existing user keys with their associated ACLs
	 *
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer with user keys list
	 */
	AlgoliaSearch.prototype.listUserKeys = function (callback) {
	  return this._jsonRequest({
	    method: 'GET',
	    url: '/1/keys',
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	 * Get ACL of a user key
	 *
	 * @param key
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer with user keys list
	 */
	AlgoliaSearch.prototype.getUserKeyACL = function (key, callback) {
	  return this._jsonRequest({
	    method: 'GET',
	    url: '/1/keys/' + key,
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	 * Delete an existing user key
	 * @param key
	 * @param callback the result callback called with two arguments
	 *  error: null or Error('message')
	 *  content: the server answer with user keys list
	 */
	AlgoliaSearch.prototype.deleteUserKey = function (key, callback) {
	  return this._jsonRequest({
	    method: 'DELETE',
	    url: '/1/keys/' + key,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	 * Add a new global API key
	 *
	 * @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
	 *   can contains the following values:
	 *     - search: allow to search (https and http)
	 *     - addObject: allows to add/update an object in the index (https only)
	 *     - deleteObject : allows to delete an existing object (https only)
	 *     - deleteIndex : allows to delete index content (https only)
	 *     - settings : allows to get index settings (https only)
	 *     - editSettings : allows to change index settings (https only)
	 * @param {Object} [params] - Optionnal parameters to set for the key
	 * @param {number} params.validity - Number of seconds after which the key will be automatically removed (0 means no time limit for this key)
	 * @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
	 * @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
	 * @param {string[]} params.indexes - Allowed targeted indexes for this key
	 * @param {string} params.description - A description for your key
	 * @param {string[]} params.referers - A list of authorized referers
	 * @param {Object} params.queryParameters - Force the key to use specific query parameters
	 * @param {Function} callback - The result callback called with two arguments
	 *   error: null or Error('message')
	 *   content: the server answer with user keys list
	 * @return {Promise|undefined} Returns a promise if no callback given
	 * @example
	 * client.addUserKey(['search'], {
	 *   validity: 300,
	 *   maxQueriesPerIPPerHour: 2000,
	 *   maxHitsPerQuery: 3,
	 *   indexes: ['fruits'],
	 *   description: 'Eat three fruits',
	 *   referers: ['*.algolia.com'],
	 *   queryParameters: {
	 *     tagFilters: ['public'],
	 *   }
	 * })
	 * @see {@link https://www.algolia.com/doc/rest_api#AddKey|Algolia REST API Documentation}
	 */
	AlgoliaSearch.prototype.addUserKey = function (acls, params, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: client.addUserKey(arrayOfAcls[, params, callback])';
	
	  if (!isArray(acls)) {
	    throw new Error(usage);
	  }
	
	  if (arguments.length === 1 || typeof params === 'function') {
	    callback = params;
	    params = null;
	  }
	
	  var postObj = {
	    acl: acls
	  };
	
	  if (params) {
	    postObj.validity = params.validity;
	    postObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
	    postObj.maxHitsPerQuery = params.maxHitsPerQuery;
	    postObj.indexes = params.indexes;
	    postObj.description = params.description;
	
	    if (params.queryParameters) {
	      postObj.queryParameters = this._getSearchParams(params.queryParameters, '');
	    }
	
	    postObj.referers = params.referers;
	  }
	
	  return this._jsonRequest({
	    method: 'POST',
	    url: '/1/keys',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/**
	 * Add a new global API key
	 * @deprecated Please use client.addUserKey()
	 */
	AlgoliaSearch.prototype.addUserKeyWithValidity = deprecate(function (acls, params, callback) {
	  return this.addUserKey(acls, params, callback);
	}, deprecatedMessage('client.addUserKeyWithValidity()', 'client.addUserKey()'));
	
	/**
	 * Update an existing API key
	 * @param {string} key - The key to update
	 * @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
	 *   can contains the following values:
	 *     - search: allow to search (https and http)
	 *     - addObject: allows to add/update an object in the index (https only)
	 *     - deleteObject : allows to delete an existing object (https only)
	 *     - deleteIndex : allows to delete index content (https only)
	 *     - settings : allows to get index settings (https only)
	 *     - editSettings : allows to change index settings (https only)
	 * @param {Object} [params] - Optionnal parameters to set for the key
	 * @param {number} params.validity - Number of seconds after which the key will be automatically removed (0 means no time limit for this key)
	 * @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
	 * @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
	 * @param {string[]} params.indexes - Allowed targeted indexes for this key
	 * @param {string} params.description - A description for your key
	 * @param {string[]} params.referers - A list of authorized referers
	 * @param {Object} params.queryParameters - Force the key to use specific query parameters
	 * @param {Function} callback - The result callback called with two arguments
	 *   error: null or Error('message')
	 *   content: the server answer with user keys list
	 * @return {Promise|undefined} Returns a promise if no callback given
	 * @example
	 * client.updateUserKey('APIKEY', ['search'], {
	 *   validity: 300,
	 *   maxQueriesPerIPPerHour: 2000,
	 *   maxHitsPerQuery: 3,
	 *   indexes: ['fruits'],
	 *   description: 'Eat three fruits',
	 *   referers: ['*.algolia.com'],
	 *   queryParameters: {
	 *     tagFilters: ['public'],
	 *   }
	 * })
	 * @see {@link https://www.algolia.com/doc/rest_api#UpdateIndexKey|Algolia REST API Documentation}
	 */
	AlgoliaSearch.prototype.updateUserKey = function (key, acls, params, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: client.updateUserKey(key, arrayOfAcls[, params, callback])';
	
	  if (!isArray(acls)) {
	    throw new Error(usage);
	  }
	
	  if (arguments.length === 2 || typeof params === 'function') {
	    callback = params;
	    params = null;
	  }
	
	  var putObj = {
	    acl: acls
	  };
	
	  if (params) {
	    putObj.validity = params.validity;
	    putObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
	    putObj.maxHitsPerQuery = params.maxHitsPerQuery;
	    putObj.indexes = params.indexes;
	    putObj.description = params.description;
	
	    if (params.queryParameters) {
	      putObj.queryParameters = this._getSearchParams(params.queryParameters, '');
	    }
	
	    putObj.referers = params.referers;
	  }
	
	  return this._jsonRequest({
	    method: 'PUT',
	    url: '/1/keys/' + key,
	    body: putObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/**
	 * Initialize a new batch of search queries
	 * @deprecated use client.search()
	 */
	AlgoliaSearch.prototype.startQueriesBatch = deprecate(function startQueriesBatchDeprecated() {
	  this._batch = [];
	}, deprecatedMessage('client.startQueriesBatch()', 'client.search()'));
	
	/**
	 * Add a search query in the batch
	 * @deprecated use client.search()
	 */
	AlgoliaSearch.prototype.addQueryInBatch = deprecate(function addQueryInBatchDeprecated(indexName, query, args) {
	  this._batch.push({
	    indexName: indexName,
	    query: query,
	    params: args
	  });
	}, deprecatedMessage('client.addQueryInBatch()', 'client.search()'));
	
	/**
	 * Launch the batch of queries using XMLHttpRequest.
	 * @deprecated use client.search()
	 */
	AlgoliaSearch.prototype.sendQueriesBatch = deprecate(function sendQueriesBatchDeprecated(callback) {
	  return this.search(this._batch, callback);
	}, deprecatedMessage('client.sendQueriesBatch()', 'client.search()'));
	
	/**
	 * Perform write operations accross multiple indexes.
	 *
	 * To reduce the amount of time spent on network round trips,
	 * you can create, update, or delete several objects in one call,
	 * using the batch endpoint (all operations are done in the given order).
	 *
	 * Available actions:
	 *   - addObject
	 *   - updateObject
	 *   - partialUpdateObject
	 *   - partialUpdateObjectNoCreate
	 *   - deleteObject
	 *
	 * https://www.algolia.com/doc/rest_api#Indexes
	 * @param  {Object[]} operations An array of operations to perform
	 * @return {Promise|undefined} Returns a promise if no callback given
	 * @example
	 * client.batch([{
	 *   action: 'addObject',
	 *   indexName: 'clients',
	 *   body: {
	 *     name: 'Bill'
	 *   }
	 * }, {
	 *   action: 'udpateObject',
	 *   indexName: 'fruits',
	 *   body: {
	 *     objectID: '29138',
	 *     name: 'banana'
	 *   }
	 * }], cb)
	 */
	AlgoliaSearch.prototype.batch = function (operations, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: client.batch(operations[, callback])';
	
	  if (!isArray(operations)) {
	    throw new Error(usage);
	  }
	
	  return this._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/*/batch',
	    body: {
	      requests: operations
	    },
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	// environment specific methods
	AlgoliaSearch.prototype.destroy = notImplemented;
	AlgoliaSearch.prototype.enableRateLimitForward = notImplemented;
	AlgoliaSearch.prototype.disableRateLimitForward = notImplemented;
	AlgoliaSearch.prototype.useSecuredAPIKey = notImplemented;
	AlgoliaSearch.prototype.disableSecuredAPIKey = notImplemented;
	AlgoliaSearch.prototype.generateSecuredApiKey = notImplemented;
	
	function notImplemented() {
	  var message = 'Not implemented in this environment.\n' + 'If you feel this is a mistake, write to support@algolia.com';
	
	  throw new errors.AlgoliaSearchError(message);
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var inherits = __webpack_require__(15);
	var IndexCore = __webpack_require__(16);
	var deprecate = __webpack_require__(20);
	var deprecatedMessage = __webpack_require__(21);
	var exitPromise = __webpack_require__(29);
	var errors = __webpack_require__(18);
	
	module.exports = Index;
	
	function Index() {
	  IndexCore.apply(this, arguments);
	}
	
	inherits(Index, IndexCore);
	
	/*
	* Add an object in this index
	*
	* @param content contains the javascript object to add inside the index
	* @param objectID (optional) an objectID you want to attribute to this object
	* (if the attribute already exist the old object will be overwrite)
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that contains 3 elements: createAt, taskId and objectID
	*/
	Index.prototype.addObject = function (content, objectID, callback) {
	  var indexObj = this;
	
	  if (arguments.length === 1 || typeof objectID === 'function') {
	    callback = objectID;
	    objectID = undefined;
	  }
	
	  return this.as._jsonRequest({
	    method: objectID !== undefined ? 'PUT' : // update or create
	    'POST', // create (API generates an objectID)
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + ( // create
	    objectID !== undefined ? '/' + encodeURIComponent(objectID) : ''), // update or create
	    body: content,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Add several objects
	*
	* @param objects contains an array of objects to add
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that updateAt and taskID
	*/
	Index.prototype.addObjects = function (objects, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: index.addObjects(arrayOfObjects[, callback])';
	
	  if (!isArray(objects)) {
	    throw new Error(usage);
	  }
	
	  var indexObj = this;
	  var postObj = {
	    requests: []
	  };
	  for (var i = 0; i < objects.length; ++i) {
	    var request = {
	      action: 'addObject',
	      body: objects[i]
	    };
	    postObj.requests.push(request);
	  }
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Update partially an object (only update attributes passed in argument)
	*
	* @param partialObject contains the javascript attributes to override, the
	*  object must contains an objectID attribute
	* @param createIfNotExists (optional) if false, avoid an automatic creation of the object
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that contains 3 elements: createAt, taskId and objectID
	*/
	Index.prototype.partialUpdateObject = function (partialObject, createIfNotExists, callback) {
	  if (arguments.length === 1 || typeof createIfNotExists === 'function') {
	    callback = createIfNotExists;
	    createIfNotExists = undefined;
	  }
	
	  var indexObj = this;
	  var url = '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(partialObject.objectID) + '/partial';
	  if (createIfNotExists === false) {
	    url += '?createIfNotExists=false';
	  }
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: url,
	    body: partialObject,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Partially Override the content of several objects
	*
	* @param objects contains an array of objects to update (each object must contains a objectID attribute)
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that updateAt and taskID
	*/
	Index.prototype.partialUpdateObjects = function (objects, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: index.partialUpdateObjects(arrayOfObjects[, callback])';
	
	  if (!isArray(objects)) {
	    throw new Error(usage);
	  }
	
	  var indexObj = this;
	  var postObj = {
	    requests: []
	  };
	  for (var i = 0; i < objects.length; ++i) {
	    var request = {
	      action: 'partialUpdateObject',
	      objectID: objects[i].objectID,
	      body: objects[i]
	    };
	    postObj.requests.push(request);
	  }
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Override the content of object
	*
	* @param object contains the javascript object to save, the object must contains an objectID attribute
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that updateAt and taskID
	*/
	Index.prototype.saveObject = function (object, callback) {
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'PUT',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(object.objectID),
	    body: object,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Override the content of several objects
	*
	* @param objects contains an array of objects to update (each object must contains a objectID attribute)
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that updateAt and taskID
	*/
	Index.prototype.saveObjects = function (objects, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: index.saveObjects(arrayOfObjects[, callback])';
	
	  if (!isArray(objects)) {
	    throw new Error(usage);
	  }
	
	  var indexObj = this;
	  var postObj = {
	    requests: []
	  };
	  for (var i = 0; i < objects.length; ++i) {
	    var request = {
	      action: 'updateObject',
	      objectID: objects[i].objectID,
	      body: objects[i]
	    };
	    postObj.requests.push(request);
	  }
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Delete an object from the index
	*
	* @param objectID the unique identifier of object to delete
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that contains 3 elements: createAt, taskId and objectID
	*/
	Index.prototype.deleteObject = function (objectID, callback) {
	  if (typeof objectID === 'function' || typeof objectID !== 'string' && typeof objectID !== 'number') {
	    var err = new errors.AlgoliaSearchError('Cannot delete an object without an objectID');
	    callback = objectID;
	    if (typeof callback === 'function') {
	      return callback(err);
	    }
	
	    return this.as._promise.reject(err);
	  }
	
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'DELETE',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID),
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Delete several objects from an index
	*
	* @param objectIDs contains an array of objectID to delete
	* @param callback (optional) the result callback called with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that contains 3 elements: createAt, taskId and objectID
	*/
	Index.prototype.deleteObjects = function (objectIDs, callback) {
	  var isArray = __webpack_require__(27);
	  var map = __webpack_require__(28);
	
	  var usage = 'Usage: index.deleteObjects(arrayOfObjectIDs[, callback])';
	
	  if (!isArray(objectIDs)) {
	    throw new Error(usage);
	  }
	
	  var indexObj = this;
	  var postObj = {
	    requests: map(objectIDs, function prepareRequest(objectID) {
	      return {
	        action: 'deleteObject',
	        objectID: objectID,
	        body: {
	          objectID: objectID
	        }
	      };
	    })
	  };
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Delete all objects matching a query
	*
	* @param query the query string
	* @param params the optional query parameters
	* @param callback (optional) the result callback called with one argument
	*  error: null or Error('message')
	*/
	Index.prototype.deleteByQuery = function (query, params, callback) {
	  var clone = __webpack_require__(23);
	  var map = __webpack_require__(28);
	
	  var indexObj = this;
	  var client = indexObj.as;
	
	  if (arguments.length === 1 || typeof params === 'function') {
	    callback = params;
	    params = {};
	  } else {
	    params = clone(params);
	  }
	
	  params.attributesToRetrieve = 'objectID';
	  params.hitsPerPage = 1000;
	  params.distinct = false;
	
	  // when deleting, we should never use cache to get the
	  // search results
	  this.clearCache();
	
	  // there's a problem in how we use the promise chain,
	  // see how waitTask is done
	  var promise = this.search(query, params).then(stopOrDelete);
	
	  function stopOrDelete(searchContent) {
	    // stop here
	    if (searchContent.nbHits === 0) {
	      // return indexObj.as._request.resolve();
	      return searchContent;
	    }
	
	    // continue and do a recursive call
	    var objectIDs = map(searchContent.hits, function getObjectID(object) {
	      return object.objectID;
	    });
	
	    return indexObj.deleteObjects(objectIDs).then(waitTask).then(doDeleteByQuery);
	  }
	
	  function waitTask(deleteObjectsContent) {
	    return indexObj.waitTask(deleteObjectsContent.taskID);
	  }
	
	  function doDeleteByQuery() {
	    return indexObj.deleteByQuery(query, params);
	  }
	
	  if (!callback) {
	    return promise;
	  }
	
	  promise.then(success, failure);
	
	  function success() {
	    exitPromise(function exit() {
	      callback(null);
	    }, client._setTimeout || setTimeout);
	  }
	
	  function failure(err) {
	    exitPromise(function exit() {
	      callback(err);
	    }, client._setTimeout || setTimeout);
	  }
	};
	
	/*
	* Browse all content from an index using events. Basically this will do
	* .browse() -> .browseFrom -> .browseFrom -> .. until all the results are returned
	*
	* @param {string} query - The full text query
	* @param {Object} [queryParameters] - Any search query parameter
	* @return {EventEmitter}
	* @example
	* var browser = index.browseAll('cool songs', {
	*   tagFilters: 'public,comments',
	*   hitsPerPage: 500
	* });
	*
	* browser.on('result', function resultCallback(content) {
	*   console.log(content.hits);
	* });
	*
	* // if any error occurs, you get it
	* browser.on('error', function(err) {
	*   throw err;
	* });
	*
	* // when you have browsed the whole index, you get this event
	* browser.on('end', function() {
	*   console.log('finished');
	* });
	*
	* // at any point if you want to stop the browsing process, you can stop it manually
	* // otherwise it will go on and on
	* browser.stop();
	*
	* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
	*/
	Index.prototype.browseAll = function (query, queryParameters) {
	  if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') {
	    queryParameters = query;
	    query = undefined;
	  }
	
	  var merge = __webpack_require__(22);
	
	  var IndexBrowser = __webpack_require__(30);
	
	  var browser = new IndexBrowser();
	  var client = this.as;
	  var index = this;
	  var params = client._getSearchParams(merge({}, queryParameters || {}, {
	    query: query
	  }), '');
	
	  // start browsing
	  browseLoop();
	
	  function browseLoop(cursor) {
	    if (browser._stopped) {
	      return;
	    }
	
	    var queryString;
	
	    if (cursor !== undefined) {
	      queryString = 'cursor=' + encodeURIComponent(cursor);
	    } else {
	      queryString = params;
	    }
	
	    client._jsonRequest({
	      method: 'GET',
	      url: '/1/indexes/' + encodeURIComponent(index.indexName) + '/browse?' + queryString,
	      hostType: 'read',
	      callback: browseCallback
	    });
	  }
	
	  function browseCallback(err, content) {
	    if (browser._stopped) {
	      return;
	    }
	
	    if (err) {
	      browser._error(err);
	      return;
	    }
	
	    browser._result(content);
	
	    // no cursor means we are finished browsing
	    if (content.cursor === undefined) {
	      browser._end();
	      return;
	    }
	
	    browseLoop(content.cursor);
	  }
	
	  return browser;
	};
	
	/*
	* Get a Typeahead.js adapter
	* @param searchParams contains an object with query parameters (see search for details)
	*/
	Index.prototype.ttAdapter = function (params) {
	  var self = this;
	  return function ttAdapter(query, syncCb, asyncCb) {
	    var cb;
	
	    if (typeof asyncCb === 'function') {
	      // typeahead 0.11
	      cb = asyncCb;
	    } else {
	      // pre typeahead 0.11
	      cb = syncCb;
	    }
	
	    self.search(query, params, function searchDone(err, content) {
	      if (err) {
	        cb(err);
	        return;
	      }
	
	      cb(content.hits);
	    });
	  };
	};
	
	/*
	* Wait the publication of a task on the server.
	* All server task are asynchronous and you can check with this method that the task is published.
	*
	* @param taskID the id of the task returned by server
	* @param callback the result callback with with two arguments:
	*  error: null or Error('message')
	*  content: the server answer that contains the list of results
	*/
	Index.prototype.waitTask = function (taskID, callback) {
	  // wait minimum 100ms before retrying
	  var baseDelay = 100;
	  // wait maximum 5s before retrying
	  var maxDelay = 5000;
	  var loop = 0;
	
	  // waitTask() must be handled differently from other methods,
	  // it's a recursive method using a timeout
	  var indexObj = this;
	  var client = indexObj.as;
	
	  var promise = retryLoop();
	
	  function retryLoop() {
	    return client._jsonRequest({
	      method: 'GET',
	      hostType: 'read',
	      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/task/' + taskID
	    }).then(function success(content) {
	      loop++;
	      var delay = baseDelay * loop * loop;
	      if (delay > maxDelay) {
	        delay = maxDelay;
	      }
	
	      if (content.status !== 'published') {
	        return client._promise.delay(delay).then(retryLoop);
	      }
	
	      return content;
	    });
	  }
	
	  if (!callback) {
	    return promise;
	  }
	
	  promise.then(successCb, failureCb);
	
	  function successCb(content) {
	    exitPromise(function exit() {
	      callback(null, content);
	    }, client._setTimeout || setTimeout);
	  }
	
	  function failureCb(err) {
	    exitPromise(function exit() {
	      callback(err);
	    }, client._setTimeout || setTimeout);
	  }
	};
	
	/*
	* This function deletes the index content. Settings and index specific API keys are kept untouched.
	*
	* @param callback (optional) the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the settings object or the error message if a failure occured
	*/
	Index.prototype.clearIndex = function (callback) {
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/clear',
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Get settings of this index
	*
	* @param callback (optional) the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the settings object or the error message if a failure occured
	*/
	Index.prototype.getSettings = function (callback) {
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings?getVersion=2',
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	Index.prototype.searchSynonyms = function (params, callback) {
	  if (typeof params === 'function') {
	    callback = params;
	    params = {};
	  } else if (params === undefined) {
	    params = {};
	  }
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/search',
	    body: params,
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	Index.prototype.saveSynonym = function (synonym, opts, callback) {
	  if (typeof opts === 'function') {
	    callback = opts;
	    opts = {};
	  } else if (opts === undefined) {
	    opts = {};
	  }
	
	  return this.as._jsonRequest({
	    method: 'PUT',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(synonym.objectID) + '?forwardToSlaves=' + (opts.forwardToSlaves ? 'true' : 'false'),
	    body: synonym,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	Index.prototype.getSynonym = function (objectID, callback) {
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(objectID),
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	Index.prototype.deleteSynonym = function (objectID, opts, callback) {
	  if (typeof opts === 'function') {
	    callback = opts;
	    opts = {};
	  } else if (opts === undefined) {
	    opts = {};
	  }
	
	  return this.as._jsonRequest({
	    method: 'DELETE',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(objectID) + '?forwardToSlaves=' + (opts.forwardToSlaves ? 'true' : 'false'),
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	Index.prototype.clearSynonyms = function (opts, callback) {
	  if (typeof opts === 'function') {
	    callback = opts;
	    opts = {};
	  } else if (opts === undefined) {
	    opts = {};
	  }
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/clear' + '?forwardToSlaves=' + (opts.forwardToSlaves ? 'true' : 'false'),
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	Index.prototype.batchSynonyms = function (synonyms, opts, callback) {
	  if (typeof opts === 'function') {
	    callback = opts;
	    opts = {};
	  } else if (opts === undefined) {
	    opts = {};
	  }
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/batch' + '?forwardToSlaves=' + (opts.forwardToSlaves ? 'true' : 'false') + '&replaceExistingSynonyms=' + (opts.replaceExistingSynonyms ? 'true' : 'false'),
	    hostType: 'write',
	    body: synonyms,
	    callback: callback
	  });
	};
	
	/*
	* Set settings for this index
	*
	* @param settigns the settings object that can contains :
	* - minWordSizefor1Typo: (integer) the minimum number of characters to accept one typo (default = 3).
	* - minWordSizefor2Typos: (integer) the minimum number of characters to accept two typos (default = 7).
	* - hitsPerPage: (integer) the number of hits per page (default = 10).
	* - attributesToRetrieve: (array of strings) default list of attributes to retrieve in objects.
	*   If set to null, all attributes are retrieved.
	* - attributesToHighlight: (array of strings) default list of attributes to highlight.
	*   If set to null, all indexed attributes are highlighted.
	* - attributesToSnippet**: (array of strings) default list of attributes to snippet alongside the number
	* of words to return (syntax is attributeName:nbWords).
	*   By default no snippet is computed. If set to null, no snippet is computed.
	* - attributesToIndex: (array of strings) the list of fields you want to index.
	*   If set to null, all textual and numerical attributes of your objects are indexed,
	*   but you should update it to get optimal results.
	*   This parameter has two important uses:
	*     - Limit the attributes to index: For example if you store a binary image in base64,
	*     you want to store it and be able to
	*       retrieve it but you don't want to search in the base64 string.
	*     - Control part of the ranking*: (see the ranking parameter for full explanation)
	*     Matches in attributes at the beginning of
	*       the list will be considered more important than matches in attributes further down the list.
	*       In one attribute, matching text at the beginning of the attribute will be
	*       considered more important than text after, you can disable
	*       this behavior if you add your attribute inside `unordered(AttributeName)`,
	*       for example attributesToIndex: ["title", "unordered(text)"].
	* - attributesForFaceting: (array of strings) The list of fields you want to use for faceting.
	*   All strings in the attribute selected for faceting are extracted and added as a facet.
	*   If set to null, no attribute is used for faceting.
	* - attributeForDistinct: (string) The attribute name used for the Distinct feature.
	* This feature is similar to the SQL "distinct" keyword: when enabled
	*   in query with the distinct=1 parameter, all hits containing a duplicate
	*   value for this attribute are removed from results.
	*   For example, if the chosen attribute is show_name and several hits have
	*   the same value for show_name, then only the best one is kept and others are removed.
	* - ranking: (array of strings) controls the way results are sorted.
	*   We have six available criteria:
	*    - typo: sort according to number of typos,
	*    - geo: sort according to decreassing distance when performing a geo-location based search,
	*    - proximity: sort according to the proximity of query words in hits,
	*    - attribute: sort according to the order of attributes defined by attributesToIndex,
	*    - exact:
	*        - if the user query contains one word: sort objects having an attribute
	*        that is exactly the query word before others.
	*          For example if you search for the "V" TV show, you want to find it
	*          with the "V" query and avoid to have all popular TV
	*          show starting by the v letter before it.
	*        - if the user query contains multiple words: sort according to the
	*        number of words that matched exactly (and not as a prefix).
	*    - custom: sort according to a user defined formula set in **customRanking** attribute.
	*   The standard order is ["typo", "geo", "proximity", "attribute", "exact", "custom"]
	* - customRanking: (array of strings) lets you specify part of the ranking.
	*   The syntax of this condition is an array of strings containing attributes
	*   prefixed by asc (ascending order) or desc (descending order) operator.
	*   For example `"customRanking" => ["desc(population)", "asc(name)"]`
	* - queryType: Select how the query words are interpreted, it can be one of the following value:
	*   - prefixAll: all query words are interpreted as prefixes,
	*   - prefixLast: only the last word is interpreted as a prefix (default behavior),
	*   - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
	* - highlightPreTag: (string) Specify the string that is inserted before
	* the highlighted parts in the query result (default to "<em>").
	* - highlightPostTag: (string) Specify the string that is inserted after
	* the highlighted parts in the query result (default to "</em>").
	* - optionalWords: (array of strings) Specify a list of words that should
	* be considered as optional when found in the query.
	* @param callback (optional) the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the server answer or the error message if a failure occured
	*/
	Index.prototype.setSettings = function (settings, opts, callback) {
	  if (arguments.length === 1 || typeof opts === 'function') {
	    callback = opts;
	    opts = {};
	  }
	
	  var forwardToSlaves = opts.forwardToSlaves || false;
	
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'PUT',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings?forwardToSlaves=' + (forwardToSlaves ? 'true' : 'false'),
	    hostType: 'write',
	    body: settings,
	    callback: callback
	  });
	};
	
	/*
	* List all existing user keys associated to this index
	*
	* @param callback the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the server answer with user keys list
	*/
	Index.prototype.listUserKeys = function (callback) {
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	* Get ACL of a user key associated to this index
	*
	* @param key
	* @param callback the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the server answer with user keys list
	*/
	Index.prototype.getUserKeyACL = function (key, callback) {
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	* Delete an existing user key associated to this index
	*
	* @param key
	* @param callback the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the server answer with user keys list
	*/
	Index.prototype.deleteUserKey = function (key, callback) {
	  var indexObj = this;
	  return this.as._jsonRequest({
	    method: 'DELETE',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/*
	* Add a new API key to this index
	*
	* @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
	*   can contains the following values:
	*     - search: allow to search (https and http)
	*     - addObject: allows to add/update an object in the index (https only)
	*     - deleteObject : allows to delete an existing object (https only)
	*     - deleteIndex : allows to delete index content (https only)
	*     - settings : allows to get index settings (https only)
	*     - editSettings : allows to change index settings (https only)
	* @param {Object} [params] - Optionnal parameters to set for the key
	* @param {number} params.validity - Number of seconds after which the key will
	* be automatically removed (0 means no time limit for this key)
	* @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
	* @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
	* @param {string} params.description - A description for your key
	* @param {string[]} params.referers - A list of authorized referers
	* @param {Object} params.queryParameters - Force the key to use specific query parameters
	* @param {Function} callback - The result callback called with two arguments
	*   error: null or Error('message')
	*   content: the server answer with user keys list
	* @return {Promise|undefined} Returns a promise if no callback given
	* @example
	* index.addUserKey(['search'], {
	*   validity: 300,
	*   maxQueriesPerIPPerHour: 2000,
	*   maxHitsPerQuery: 3,
	*   description: 'Eat three fruits',
	*   referers: ['*.algolia.com'],
	*   queryParameters: {
	*     tagFilters: ['public'],
	*   }
	* })
	* @see {@link https://www.algolia.com/doc/rest_api#AddIndexKey|Algolia REST API Documentation}
	*/
	Index.prototype.addUserKey = function (acls, params, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: index.addUserKey(arrayOfAcls[, params, callback])';
	
	  if (!isArray(acls)) {
	    throw new Error(usage);
	  }
	
	  if (arguments.length === 1 || typeof params === 'function') {
	    callback = params;
	    params = null;
	  }
	
	  var postObj = {
	    acl: acls
	  };
	
	  if (params) {
	    postObj.validity = params.validity;
	    postObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
	    postObj.maxHitsPerQuery = params.maxHitsPerQuery;
	    postObj.description = params.description;
	
	    if (params.queryParameters) {
	      postObj.queryParameters = this.as._getSearchParams(params.queryParameters, '');
	    }
	
	    postObj.referers = params.referers;
	  }
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/keys',
	    body: postObj,
	    hostType: 'write',
	    callback: callback
	  });
	};
	
	/**
	* Add an existing user key associated to this index
	* @deprecated use index.addUserKey()
	*/
	Index.prototype.addUserKeyWithValidity = deprecate(function deprecatedAddUserKeyWithValidity(acls, params, callback) {
	  return this.addUserKey(acls, params, callback);
	}, deprecatedMessage('index.addUserKeyWithValidity()', 'index.addUserKey()'));
	
	/**
	* Update an existing API key of this index
	* @param {string} key - The key to update
	* @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
	*   can contains the following values:
	*     - search: allow to search (https and http)
	*     - addObject: allows to add/update an object in the index (https only)
	*     - deleteObject : allows to delete an existing object (https only)
	*     - deleteIndex : allows to delete index content (https only)
	*     - settings : allows to get index settings (https only)
	*     - editSettings : allows to change index settings (https only)
	* @param {Object} [params] - Optionnal parameters to set for the key
	* @param {number} params.validity - Number of seconds after which the key will
	* be automatically removed (0 means no time limit for this key)
	* @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
	* @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
	* @param {string} params.description - A description for your key
	* @param {string[]} params.referers - A list of authorized referers
	* @param {Object} params.queryParameters - Force the key to use specific query parameters
	* @param {Function} callback - The result callback called with two arguments
	*   error: null or Error('message')
	*   content: the server answer with user keys list
	* @return {Promise|undefined} Returns a promise if no callback given
	* @example
	* index.updateUserKey('APIKEY', ['search'], {
	*   validity: 300,
	*   maxQueriesPerIPPerHour: 2000,
	*   maxHitsPerQuery: 3,
	*   description: 'Eat three fruits',
	*   referers: ['*.algolia.com'],
	*   queryParameters: {
	*     tagFilters: ['public'],
	*   }
	* })
	* @see {@link https://www.algolia.com/doc/rest_api#UpdateIndexKey|Algolia REST API Documentation}
	*/
	Index.prototype.updateUserKey = function (key, acls, params, callback) {
	  var isArray = __webpack_require__(27);
	  var usage = 'Usage: index.updateUserKey(key, arrayOfAcls[, params, callback])';
	
	  if (!isArray(acls)) {
	    throw new Error(usage);
	  }
	
	  if (arguments.length === 2 || typeof params === 'function') {
	    callback = params;
	    params = null;
	  }
	
	  var putObj = {
	    acl: acls
	  };
	
	  if (params) {
	    putObj.validity = params.validity;
	    putObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
	    putObj.maxHitsPerQuery = params.maxHitsPerQuery;
	    putObj.description = params.description;
	
	    if (params.queryParameters) {
	      putObj.queryParameters = this.as._getSearchParams(params.queryParameters, '');
	    }
	
	    putObj.referers = params.referers;
	  }
	
	  return this.as._jsonRequest({
	    method: 'PUT',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/keys/' + key,
	    body: putObj,
	    hostType: 'write',
	    callback: callback
	  });
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function TempCtor() {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var buildSearchMethod = __webpack_require__(17);
	var deprecate = __webpack_require__(20);
	var deprecatedMessage = __webpack_require__(21);
	
	module.exports = IndexCore;
	
	/*
	* Index class constructor.
	* You should not use this method directly but use initIndex() function
	*/
	function IndexCore(algoliasearch, indexName) {
	  this.indexName = indexName;
	  this.as = algoliasearch;
	  this.typeAheadArgs = null;
	  this.typeAheadValueOption = null;
	
	  // make sure every index instance has it's own cache
	  this.cache = {};
	}
	
	/*
	* Clear all queries in cache
	*/
	IndexCore.prototype.clearCache = function () {
	  this.cache = {};
	};
	
	/*
	* Search inside the index using XMLHttpRequest request (Using a POST query to
	* minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
	*
	* @param query the full text query
	* @param args (optional) if set, contains an object with query parameters:
	* - page: (integer) Pagination parameter used to select the page to retrieve.
	*                   Page is zero-based and defaults to 0. Thus,
	*                   to retrieve the 10th page you need to set page=9
	* - hitsPerPage: (integer) Pagination parameter used to select the number of hits per page. Defaults to 20.
	* - attributesToRetrieve: a string that contains the list of object attributes
	* you want to retrieve (let you minimize the answer size).
	*   Attributes are separated with a comma (for example "name,address").
	*   You can also use an array (for example ["name","address"]).
	*   By default, all attributes are retrieved. You can also use '*' to retrieve all
	*   values when an attributesToRetrieve setting is specified for your index.
	* - attributesToHighlight: a string that contains the list of attributes you
	*   want to highlight according to the query.
	*   Attributes are separated by a comma. You can also use an array (for example ["name","address"]).
	*   If an attribute has no match for the query, the raw value is returned.
	*   By default all indexed text attributes are highlighted.
	*   You can use `*` if you want to highlight all textual attributes.
	*   Numerical attributes are not highlighted.
	*   A matchLevel is returned for each highlighted attribute and can contain:
	*      - full: if all the query terms were found in the attribute,
	*      - partial: if only some of the query terms were found,
	*      - none: if none of the query terms were found.
	* - attributesToSnippet: a string that contains the list of attributes to snippet alongside
	* the number of words to return (syntax is `attributeName:nbWords`).
	*    Attributes are separated by a comma (Example: attributesToSnippet=name:10,content:10).
	*    You can also use an array (Example: attributesToSnippet: ['name:10','content:10']).
	*    By default no snippet is computed.
	* - minWordSizefor1Typo: the minimum number of characters in a query word to accept one typo in this word.
	* Defaults to 3.
	* - minWordSizefor2Typos: the minimum number of characters in a query word
	* to accept two typos in this word. Defaults to 7.
	* - getRankingInfo: if set to 1, the result hits will contain ranking
	* information in _rankingInfo attribute.
	* - aroundLatLng: search for entries around a given
	* latitude/longitude (specified as two floats separated by a comma).
	*   For example aroundLatLng=47.316669,5.016670).
	*   You can specify the maximum distance in meters with the aroundRadius parameter (in meters)
	*   and the precision for ranking with aroundPrecision
	*   (for example if you set aroundPrecision=100, two objects that are distant of
	*   less than 100m will be considered as identical for "geo" ranking parameter).
	*   At indexing, you should specify geoloc of an object with the _geoloc attribute
	*   (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
	* - insideBoundingBox: search entries inside a given area defined by the two extreme points
	* of a rectangle (defined by 4 floats: p1Lat,p1Lng,p2Lat,p2Lng).
	*   For example insideBoundingBox=47.3165,4.9665,47.3424,5.0201).
	*   At indexing, you should specify geoloc of an object with the _geoloc attribute
	*   (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
	* - numericFilters: a string that contains the list of numeric filters you want to
	* apply separated by a comma.
	*   The syntax of one filter is `attributeName` followed by `operand` followed by `value`.
	*   Supported operands are `<`, `<=`, `=`, `>` and `>=`.
	*   You can have multiple conditions on one attribute like for example numericFilters=price>100,price<1000.
	*   You can also use an array (for example numericFilters: ["price>100","price<1000"]).
	* - tagFilters: filter the query by a set of tags. You can AND tags by separating them by commas.
	*   To OR tags, you must add parentheses. For example, tags=tag1,(tag2,tag3) means tag1 AND (tag2 OR tag3).
	*   You can also use an array, for example tagFilters: ["tag1",["tag2","tag3"]]
	*   means tag1 AND (tag2 OR tag3).
	*   At indexing, tags should be added in the _tags** attribute
	*   of objects (for example {"_tags":["tag1","tag2"]}).
	* - facetFilters: filter the query by a list of facets.
	*   Facets are separated by commas and each facet is encoded as `attributeName:value`.
	*   For example: `facetFilters=category:Book,author:John%20Doe`.
	*   You can also use an array (for example `["category:Book","author:John%20Doe"]`).
	* - facets: List of object attributes that you want to use for faceting.
	*   Comma separated list: `"category,author"` or array `['category','author']`
	*   Only attributes that have been added in **attributesForFaceting** index setting
	*   can be used in this parameter.
	*   You can also use `*` to perform faceting on all attributes specified in **attributesForFaceting**.
	* - queryType: select how the query words are interpreted, it can be one of the following value:
	*    - prefixAll: all query words are interpreted as prefixes,
	*    - prefixLast: only the last word is interpreted as a prefix (default behavior),
	*    - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
	* - optionalWords: a string that contains the list of words that should
	* be considered as optional when found in the query.
	*   Comma separated and array are accepted.
	* - distinct: If set to 1, enable the distinct feature (disabled by default)
	* if the attributeForDistinct index setting is set.
	*   This feature is similar to the SQL "distinct" keyword: when enabled
	*   in a query with the distinct=1 parameter,
	*   all hits containing a duplicate value for the attributeForDistinct attribute are removed from results.
	*   For example, if the chosen attribute is show_name and several hits have
	*   the same value for show_name, then only the best
	*   one is kept and others are removed.
	* - restrictSearchableAttributes: List of attributes you want to use for
	* textual search (must be a subset of the attributesToIndex index setting)
	* either comma separated or as an array
	* @param callback the result callback called with two arguments:
	*  error: null or Error('message'). If false, the content contains the error.
	*  content: the server answer that contains the list of results.
	*/
	IndexCore.prototype.search = buildSearchMethod('query');
	
	/*
	* -- BETA --
	* Search a record similar to the query inside the index using XMLHttpRequest request (Using a POST query to
	* minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
	*
	* @param query the similar query
	* @param args (optional) if set, contains an object with query parameters.
	*   All search parameters are supported (see search function), restrictSearchableAttributes and facetFilters
	*   are the two most useful to restrict the similar results and get more relevant content
	*/
	IndexCore.prototype.similarSearch = buildSearchMethod('similarQuery');
	
	/*
	* Browse index content. The response content will have a `cursor` property that you can use
	* to browse subsequent pages for this query. Use `index.browseFrom(cursor)` when you want.
	*
	* @param {string} query - The full text query
	* @param {Object} [queryParameters] - Any search query parameter
	* @param {Function} [callback] - The result callback called with two arguments
	*   error: null or Error('message')
	*   content: the server answer with the browse result
	* @return {Promise|undefined} Returns a promise if no callback given
	* @example
	* index.browse('cool songs', {
	*   tagFilters: 'public,comments',
	*   hitsPerPage: 500
	* }, callback);
	* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
	*/
	IndexCore.prototype.browse = function (query, queryParameters, callback) {
	  var merge = __webpack_require__(22);
	
	  var indexObj = this;
	
	  var page;
	  var hitsPerPage;
	
	  // we check variadic calls that are not the one defined
	  // .browse()/.browse(fn)
	  // => page = 0
	  if (arguments.length === 0 || arguments.length === 1 && typeof arguments[0] === 'function') {
	    page = 0;
	    callback = arguments[0];
	    query = undefined;
	  } else if (typeof arguments[0] === 'number') {
	    // .browse(2)/.browse(2, 10)/.browse(2, fn)/.browse(2, 10, fn)
	    page = arguments[0];
	    if (typeof arguments[1] === 'number') {
	      hitsPerPage = arguments[1];
	    } else if (typeof arguments[1] === 'function') {
	      callback = arguments[1];
	      hitsPerPage = undefined;
	    }
	    query = undefined;
	    queryParameters = undefined;
	  } else if (_typeof(arguments[0]) === 'object') {
	    // .browse(queryParameters)/.browse(queryParameters, cb)
	    if (typeof arguments[1] === 'function') {
	      callback = arguments[1];
	    }
	    queryParameters = arguments[0];
	    query = undefined;
	  } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
	    // .browse(query, cb)
	    callback = arguments[1];
	    queryParameters = undefined;
	  }
	
	  // otherwise it's a .browse(query)/.browse(query, queryParameters)/.browse(query, queryParameters, cb)
	
	  // get search query parameters combining various possible calls
	  // to .browse();
	  queryParameters = merge({}, queryParameters || {}, {
	    page: page,
	    hitsPerPage: hitsPerPage,
	    query: query
	  });
	
	  var params = this.as._getSearchParams(queryParameters, '');
	
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/browse?' + params,
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	* Continue browsing from a previous position (cursor), obtained via a call to `.browse()`.
	*
	* @param {string} query - The full text query
	* @param {Object} [queryParameters] - Any search query parameter
	* @param {Function} [callback] - The result callback called with two arguments
	*   error: null or Error('message')
	*   content: the server answer with the browse result
	* @return {Promise|undefined} Returns a promise if no callback given
	* @example
	* index.browseFrom('14lkfsakl32', callback);
	* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
	*/
	IndexCore.prototype.browseFrom = function (cursor, callback) {
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/browse?cursor=' + encodeURIComponent(cursor),
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	* Search for facet values
	* https://www.algolia.com/doc/rest-api/search#search-for-facet-values
	*
	* @param {string} params.facetName Facet name, name of the attribute to search for values in.
	* Must be declared as a facet
	* @param {string} params.facetQuery Query for the facet search
	* @param {string} [params.*] Any search parameter of Algolia,
	* see https://www.algolia.com/doc/api-client/javascript/search#search-parameters
	* Pagination is not supported. The page and hitsPerPage parameters will be ignored.
	* @param callback (optional)
	*/
	IndexCore.prototype.searchForFacetValues = function (params, callback) {
	  var clone = __webpack_require__(23);
	  var omit = __webpack_require__(24);
	  var usage = 'Usage: index.searchForFacetValues({facetName, facetQuery, ...params}[, callback])';
	
	  if (params.facetName === undefined || params.facetQuery === undefined) {
	    throw new Error(usage);
	  }
	
	  var facetName = params.facetName;
	  var filteredParams = omit(clone(params), function (keyName) {
	    return keyName === 'facetName';
	  });
	  var searchParameters = this.as._getSearchParams(filteredParams, '');
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/facets/' + encodeURIComponent(facetName) + '/query',
	    hostType: 'read',
	    body: { params: searchParameters },
	    callback: callback
	  });
	};
	
	IndexCore.prototype.searchFacet = deprecate(function (params, callback) {
	  return this.searchForFacetValues(params, callback);
	}, deprecatedMessage('index.searchFacet(params[, callback])', 'index.searchForFacetValues(params[, callback])'));
	
	IndexCore.prototype._search = function (params, url, callback) {
	  return this.as._jsonRequest({
	    cache: this.cache,
	    method: 'POST',
	    url: url || '/1/indexes/' + encodeURIComponent(this.indexName) + '/query',
	    body: { params: params },
	    hostType: 'read',
	    fallback: {
	      method: 'GET',
	      url: '/1/indexes/' + encodeURIComponent(this.indexName),
	      body: { params: params }
	    },
	    callback: callback
	  });
	};
	
	/*
	* Get an object from this index
	*
	* @param objectID the unique identifier of the object to retrieve
	* @param attrs (optional) if set, contains the array of attribute names to retrieve
	* @param callback (optional) the result callback called with two arguments
	*  error: null or Error('message')
	*  content: the object to retrieve or the error message if a failure occured
	*/
	IndexCore.prototype.getObject = function (objectID, attrs, callback) {
	  var indexObj = this;
	
	  if (arguments.length === 1 || typeof attrs === 'function') {
	    callback = attrs;
	    attrs = undefined;
	  }
	
	  var params = '';
	  if (attrs !== undefined) {
	    params = '?attributes=';
	    for (var i = 0; i < attrs.length; ++i) {
	      if (i !== 0) {
	        params += ',';
	      }
	      params += attrs[i];
	    }
	  }
	
	  return this.as._jsonRequest({
	    method: 'GET',
	    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID) + params,
	    hostType: 'read',
	    callback: callback
	  });
	};
	
	/*
	* Get several objects from this index
	*
	* @param objectIDs the array of unique identifier of objects to retrieve
	*/
	IndexCore.prototype.getObjects = function (objectIDs, attributesToRetrieve, callback) {
	  var isArray = __webpack_require__(27);
	  var map = __webpack_require__(28);
	
	  var usage = 'Usage: index.getObjects(arrayOfObjectIDs[, callback])';
	
	  if (!isArray(objectIDs)) {
	    throw new Error(usage);
	  }
	
	  var indexObj = this;
	
	  if (arguments.length === 1 || typeof attributesToRetrieve === 'function') {
	    callback = attributesToRetrieve;
	    attributesToRetrieve = undefined;
	  }
	
	  var body = {
	    requests: map(objectIDs, function prepareRequest(objectID) {
	      var request = {
	        indexName: indexObj.indexName,
	        objectID: objectID
	      };
	
	      if (attributesToRetrieve) {
	        request.attributesToRetrieve = attributesToRetrieve.join(',');
	      }
	
	      return request;
	    })
	  };
	
	  return this.as._jsonRequest({
	    method: 'POST',
	    url: '/1/indexes/*/objects',
	    hostType: 'read',
	    body: body,
	    callback: callback
	  });
	};
	
	IndexCore.prototype.as = null;
	IndexCore.prototype.indexName = null;
	IndexCore.prototype.typeAheadArgs = null;
	IndexCore.prototype.typeAheadValueOption = null;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = buildSearchMethod;
	
	var errors = __webpack_require__(18);
	
	function buildSearchMethod(queryParam, url) {
	  return function search(query, args, callback) {
	    // warn V2 users on how to search
	    if (typeof query === 'function' && (typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' || (typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
	      // .search(query, params, cb)
	      // .search(cb, params)
	      throw new errors.AlgoliaSearchError('index.search usage is index.search(query, params, cb)');
	    }
	
	    if (arguments.length === 0 || typeof query === 'function') {
	      // .search(), .search(cb)
	      callback = query;
	      query = '';
	    } else if (arguments.length === 1 || typeof args === 'function') {
	      // .search(query/args), .search(query, cb)
	      callback = args;
	      args = undefined;
	    }
	
	    // .search(args), careful: typeof null === 'object'
	    if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object' && query !== null) {
	      args = query;
	      query = undefined;
	    } else if (query === undefined || query === null) {
	      // .search(undefined/null)
	      query = '';
	    }
	
	    var params = '';
	
	    if (query !== undefined) {
	      params += queryParam + '=' + encodeURIComponent(query);
	    }
	
	    if (args !== undefined) {
	      // `_getSearchParams` will augment params, do not be fooled by the = versus += from previous if
	      params = this.as._getSearchParams(args, params);
	    }
	
	    return this._search(params, url, callback);
	  };
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// This file hosts our error definitions
	// We use custom error "types" so that we can act on them when we need it
	// e.g.: if error instanceof errors.UnparsableJSON then..
	
	var inherits = __webpack_require__(15);
	
	function AlgoliaSearchError(message, extraProperties) {
	  var forEach = __webpack_require__(19);
	
	  var error = this;
	
	  // try to get a stacktrace
	  if (typeof Error.captureStackTrace === 'function') {
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    error.stack = new Error().stack || 'Cannot get a stacktrace, browser is too old';
	  }
	
	  this.name = 'AlgoliaSearchError';
	  this.message = message || 'Unknown error';
	
	  if (extraProperties) {
	    forEach(extraProperties, function addToErrorObject(value, key) {
	      error[key] = value;
	    });
	  }
	}
	
	inherits(AlgoliaSearchError, Error);
	
	function createCustomError(name, message) {
	  function AlgoliaSearchCustomError() {
	    var args = Array.prototype.slice.call(arguments, 0);
	
	    // custom message not set, use default
	    if (typeof args[0] !== 'string') {
	      args.unshift(message);
	    }
	
	    AlgoliaSearchError.apply(this, args);
	    this.name = 'AlgoliaSearch' + name + 'Error';
	  }
	
	  inherits(AlgoliaSearchCustomError, AlgoliaSearchError);
	
	  return AlgoliaSearchCustomError;
	}
	
	// late exports to let various fn defs and inherits take place
	module.exports = {
	  AlgoliaSearchError: AlgoliaSearchError,
	  UnparsableJSON: createCustomError('UnparsableJSON', 'Could not parse the incoming response as JSON, see err.more for details'),
	  RequestTimeout: createCustomError('RequestTimeout', 'Request timedout before getting a response'),
	  Network: createCustomError('Network', 'Network issue, see err.more for details'),
	  JSONPScriptFail: createCustomError('JSONPScriptFail', '<script> was loaded but did not call our provided callback'),
	  JSONPScriptError: createCustomError('JSONPScriptError', '<script> unable to load due to an `error` event on it'),
	  Unknown: createCustomError('Unknown', 'Unknown error occured')
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;
	
	module.exports = function forEach(obj, fn, ctx) {
	    if (toString.call(fn) !== '[object Function]') {
	        throw new TypeError('iterator must be a function');
	    }
	    var l = obj.length;
	    if (l === +l) {
	        for (var i = 0; i < l; i++) {
	            fn.call(ctx, obj[i], i, obj);
	        }
	    } else {
	        for (var k in obj) {
	            if (hasOwn.call(obj, k)) {
	                fn.call(ctx, obj[k], k, obj);
	            }
	        }
	    }
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function deprecate(fn, message) {
	  var warned = false;
	
	  function deprecated() {
	    if (!warned) {
	      /* eslint no-console:0 */
	      console.log(message);
	      warned = true;
	    }
	
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function deprecatedMessage(previousUsage, newUsage) {
	  var githubAnchorLink = previousUsage.toLowerCase().replace('.', '').replace('()', '');
	
	  return 'algoliasearch: `' + previousUsage + '` was replaced by `' + newUsage + '`. Please see https://github.com/algolia/algoliasearch-client-js/wiki/Deprecated#' + githubAnchorLink;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var foreach = __webpack_require__(19);
	
	module.exports = function merge(destination /* , sources */) {
	  var sources = Array.prototype.slice.call(arguments);
	
	  foreach(sources, function (source) {
	    for (var keyName in source) {
	      if (source.hasOwnProperty(keyName)) {
	        if (_typeof(destination[keyName]) === 'object' && _typeof(source[keyName]) === 'object') {
	          destination[keyName] = merge({}, destination[keyName], source[keyName]);
	        } else if (source[keyName] !== undefined) {
	          destination[keyName] = source[keyName];
	        }
	      }
	    }
	  });
	
	  return destination;
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function clone(obj) {
	  return JSON.parse(JSON.stringify(obj));
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function omit(obj, test) {
	  var keys = __webpack_require__(25);
	  var foreach = __webpack_require__(19);
	
	  var filtered = {};
	
	  foreach(keys(obj), function doFilter(keyName) {
	    if (test(keyName) !== true) {
	      filtered[keyName] = obj[keyName];
	    }
	  });
	
	  return filtered;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// modified from https://github.com/es-shims/es5-shim
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var isArgs = __webpack_require__(26);
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
	var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = function () {
		/* global window */
		if (typeof window === 'undefined') {
			return false;
		}
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && _typeof(window[k]) === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}();
	var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};
	
	var keysShim = function keys(object) {
		var isObject = object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];
	
		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}
	
		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}
	
		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}
	
		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
	
			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
	
	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = function () {
				// Safari 5.0 bug
				return (Object.keys(arguments) || '').length === 2;
			}(1, 2);
			if (!keysWorksWithArguments) {
				var originalKeys = Object.keys;
				Object.keys = function keys(object) {
					if (isArgs(object)) {
						return originalKeys(slice.call(object));
					} else {
						return originalKeys(object);
					}
				};
			}
		} else {
			Object.keys = keysShim;
		}
		return Object.keys || keysShim;
	};
	
	module.exports = keysShim;

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var toStr = Object.prototype.toString;
	
	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' && value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var foreach = __webpack_require__(19);
	
	module.exports = function map(arr, fn) {
	  var newArr = [];
	  foreach(arr, function (item, itemIndex) {
	    newArr.push(fn(item, itemIndex, arr));
	  });
	  return newArr;
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	// Parse cloud does not supports setTimeout
	// We do not store a setTimeout reference in the client everytime
	// We only fallback to a fake setTimeout when not available
	// setTimeout cannot be override globally sadly
	module.exports = function exitPromise(fn, _setTimeout) {
	  _setTimeout(fn, 0);
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// This is the object returned by the `index.browseAll()` method
	
	module.exports = IndexBrowser;
	
	var inherits = __webpack_require__(15);
	var EventEmitter = __webpack_require__(31).EventEmitter;
	
	function IndexBrowser() {}
	
	inherits(IndexBrowser, EventEmitter);
	
	IndexBrowser.prototype.stop = function () {
	  this._stopped = true;
	  this._clean();
	};
	
	IndexBrowser.prototype._end = function () {
	  this.emit('end');
	  this._clean();
	};
	
	IndexBrowser.prototype._error = function (err) {
	  this.emit('error', err);
	  this._clean();
	};
	
	IndexBrowser.prototype._result = function (content) {
	  this.emit('result', content);
	};
	
	IndexBrowser.prototype._clean = function () {
	  this.removeAllListeners('stop');
	  this.removeAllListeners('end');
	  this.removeAllListeners('error');
	  this.removeAllListeners('result');
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events) this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler)) return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;
	
	  if (!isFunction(listener)) throw TypeError('listener must be a function');
	
	  if (!this._events) this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener)) throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type]) return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0) return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;
	
	  if (!this._events) return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	module.exports = AlgoliaSearchCore;
	
	var errors = __webpack_require__(18);
	var exitPromise = __webpack_require__(29);
	var IndexCore = __webpack_require__(16);
	var store = __webpack_require__(34);
	
	// We will always put the API KEY in the JSON body in case of too long API KEY,
	// to avoid query string being too long and failing in various conditions (our server limit, browser limit,
	// proxies limit)
	var MAX_API_KEY_LENGTH = 500;
	var RESET_APP_DATA_TIMER = process.env.RESET_APP_DATA_TIMER && parseInt(process.env.RESET_APP_DATA_TIMER, 10) || 60 * 2 * 1000; // after 2 minutes reset to first host
	
	/*
	 * Algolia Search library initialization
	 * https://www.algolia.com/
	 *
	 * @param {string} applicationID - Your applicationID, found in your dashboard
	 * @param {string} apiKey - Your API key, found in your dashboard
	 * @param {Object} [opts]
	 * @param {number} [opts.timeout=2000] - The request timeout set in milliseconds,
	 * another request will be issued after this timeout
	 * @param {string} [opts.protocol='http:'] - The protocol used to query Algolia Search API.
	 *                                        Set to 'https:' to force using https.
	 *                                        Default to document.location.protocol in browsers
	 * @param {Object|Array} [opts.hosts={
	 *           read: [this.applicationID + '-dsn.algolia.net'].concat([
	 *             this.applicationID + '-1.algolianet.com',
	 *             this.applicationID + '-2.algolianet.com',
	 *             this.applicationID + '-3.algolianet.com']
	 *           ]),
	 *           write: [this.applicationID + '.algolia.net'].concat([
	 *             this.applicationID + '-1.algolianet.com',
	 *             this.applicationID + '-2.algolianet.com',
	 *             this.applicationID + '-3.algolianet.com']
	 *           ]) - The hosts to use for Algolia Search API.
	 *           If you provide them, you will less benefit from our HA implementation
	 */
	function AlgoliaSearchCore(applicationID, apiKey, opts) {
	  var debug = __webpack_require__(35)('algoliasearch');
	
	  var clone = __webpack_require__(23);
	  var isArray = __webpack_require__(27);
	  var map = __webpack_require__(28);
	
	  var usage = 'Usage: algoliasearch(applicationID, apiKey, opts)';
	
	  if (opts._allowEmptyCredentials !== true && !applicationID) {
	    throw new errors.AlgoliaSearchError('Please provide an application ID. ' + usage);
	  }
	
	  if (opts._allowEmptyCredentials !== true && !apiKey) {
	    throw new errors.AlgoliaSearchError('Please provide an API key. ' + usage);
	  }
	
	  this.applicationID = applicationID;
	  this.apiKey = apiKey;
	
	  this.hosts = {
	    read: [],
	    write: []
	  };
	
	  opts = opts || {};
	
	  var protocol = opts.protocol || 'https:';
	  this._timeouts = opts.timeouts || {
	    connect: 1 * 1000, // 500ms connect is GPRS latency
	    read: 2 * 1000,
	    write: 30 * 1000
	  };
	
	  // backward compat, if opts.timeout is passed, we use it to configure all timeouts like before
	  if (opts.timeout) {
	    this._timeouts.connect = this._timeouts.read = this._timeouts.write = opts.timeout;
	  }
	
	  // while we advocate for colon-at-the-end values: 'http:' for `opts.protocol`
	  // we also accept `http` and `https`. It's a common error.
	  if (!/:$/.test(protocol)) {
	    protocol = protocol + ':';
	  }
	
	  if (opts.protocol !== 'http:' && opts.protocol !== 'https:') {
	    throw new errors.AlgoliaSearchError('protocol must be `http:` or `https:` (was `' + opts.protocol + '`)');
	  }
	
	  this._checkAppIdData();
	
	  if (!opts.hosts) {
	    var defaultHosts = map(this._shuffleResult, function (hostNumber) {
	      return applicationID + '-' + hostNumber + '.algolianet.com';
	    });
	
	    // no hosts given, compute defaults
	    this.hosts.read = [this.applicationID + '-dsn.algolia.net'].concat(defaultHosts);
	    this.hosts.write = [this.applicationID + '.algolia.net'].concat(defaultHosts);
	  } else if (isArray(opts.hosts)) {
	    // when passing custom hosts, we need to have a different host index if the number
	    // of write/read hosts are different.
	    this.hosts.read = clone(opts.hosts);
	    this.hosts.write = clone(opts.hosts);
	  } else {
	    this.hosts.read = clone(opts.hosts.read);
	    this.hosts.write = clone(opts.hosts.write);
	  }
	
	  // add protocol and lowercase hosts
	  this.hosts.read = map(this.hosts.read, prepareHost(protocol));
	  this.hosts.write = map(this.hosts.write, prepareHost(protocol));
	
	  this.extraHeaders = [];
	
	  // In some situations you might want to warm the cache
	  this.cache = opts._cache || {};
	
	  this._ua = opts._ua;
	  this._useCache = opts._useCache === undefined || opts._cache ? true : opts._useCache;
	  this._useFallback = opts.useFallback === undefined ? true : opts.useFallback;
	
	  this._setTimeout = opts._setTimeout;
	
	  debug('init done, %j', this);
	}
	
	/*
	 * Get the index object initialized
	 *
	 * @param indexName the name of index
	 * @param callback the result callback with one argument (the Index instance)
	 */
	AlgoliaSearchCore.prototype.initIndex = function (indexName) {
	  return new IndexCore(this, indexName);
	};
	
	/**
	* Add an extra field to the HTTP request
	*
	* @param name the header field name
	* @param value the header field value
	*/
	AlgoliaSearchCore.prototype.setExtraHeader = function (name, value) {
	  this.extraHeaders.push({
	    name: name.toLowerCase(), value: value
	  });
	};
	
	/**
	* Augment sent x-algolia-agent with more data, each agent part
	* is automatically separated from the others by a semicolon;
	*
	* @param algoliaAgent the agent to add
	*/
	AlgoliaSearchCore.prototype.addAlgoliaAgent = function (algoliaAgent) {
	  this._ua += ';' + algoliaAgent;
	};
	
	/*
	 * Wrapper that try all hosts to maximize the quality of service
	 */
	AlgoliaSearchCore.prototype._jsonRequest = function (initialOpts) {
	  this._checkAppIdData();
	
	  var requestDebug = __webpack_require__(35)('algoliasearch:' + initialOpts.url);
	
	  var body;
	  var cache = initialOpts.cache;
	  var client = this;
	  var tries = 0;
	  var usingFallback = false;
	  var hasFallback = client._useFallback && client._request.fallback && initialOpts.fallback;
	  var headers;
	
	  if (this.apiKey.length > MAX_API_KEY_LENGTH && initialOpts.body !== undefined && (initialOpts.body.params !== undefined || // index.search()
	  initialOpts.body.requests !== undefined) // client.search()
	  ) {
	      initialOpts.body.apiKey = this.apiKey;
	      headers = this._computeRequestHeaders(false);
	    } else {
	    headers = this._computeRequestHeaders();
	  }
	
	  if (initialOpts.body !== undefined) {
	    body = safeJSONStringify(initialOpts.body);
	  }
	
	  requestDebug('request start');
	  var debugData = [];
	
	  function doRequest(requester, reqOpts) {
	    client._checkAppIdData();
	
	    var startTime = new Date();
	    var cacheID;
	
	    if (client._useCache) {
	      cacheID = initialOpts.url;
	    }
	
	    // as we sometime use POST requests to pass parameters (like query='aa'),
	    // the cacheID must also include the body to be different between calls
	    if (client._useCache && body) {
	      cacheID += '_body_' + reqOpts.body;
	    }
	
	    // handle cache existence
	    if (client._useCache && cache && cache[cacheID] !== undefined) {
	      requestDebug('serving response from cache');
	      return client._promise.resolve(JSON.parse(cache[cacheID]));
	    }
	
	    // if we reached max tries
	    if (tries >= client.hosts[initialOpts.hostType].length) {
	      if (!hasFallback || usingFallback) {
	        requestDebug('could not get any response');
	        // then stop
	        return client._promise.reject(new errors.AlgoliaSearchError('Cannot connect to the AlgoliaSearch API.' + ' Send an email to support@algolia.com to report and resolve the issue.' + ' Application id was: ' + client.applicationID, { debugData: debugData }));
	      }
	
	      requestDebug('switching to fallback');
	
	      // let's try the fallback starting from here
	      tries = 0;
	
	      // method, url and body are fallback dependent
	      reqOpts.method = initialOpts.fallback.method;
	      reqOpts.url = initialOpts.fallback.url;
	      reqOpts.jsonBody = initialOpts.fallback.body;
	      if (reqOpts.jsonBody) {
	        reqOpts.body = safeJSONStringify(reqOpts.jsonBody);
	      }
	      // re-compute headers, they could be omitting the API KEY
	      headers = client._computeRequestHeaders();
	
	      reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
	      client._setHostIndexByType(0, initialOpts.hostType);
	      usingFallback = true; // the current request is now using fallback
	      return doRequest(client._request.fallback, reqOpts);
	    }
	
	    var currentHost = client._getHostByType(initialOpts.hostType);
	
	    var url = currentHost + reqOpts.url;
	    var options = {
	      body: reqOpts.body,
	      jsonBody: reqOpts.jsonBody,
	      method: reqOpts.method,
	      headers: headers,
	      timeouts: reqOpts.timeouts,
	      debug: requestDebug
	    };
	
	    requestDebug('method: %s, url: %s, headers: %j, timeouts: %d', options.method, url, options.headers, options.timeouts);
	
	    if (requester === client._request.fallback) {
	      requestDebug('using fallback');
	    }
	
	    // `requester` is any of this._request or this._request.fallback
	    // thus it needs to be called using the client as context
	    return requester.call(client, url, options).then(success, tryFallback);
	
	    function success(httpResponse) {
	      // compute the status of the response,
	      //
	      // When in browser mode, using XDR or JSONP, we have no statusCode available
	      // So we rely on our API response `status` property.
	      // But `waitTask` can set a `status` property which is not the statusCode (it's the task status)
	      // So we check if there's a `message` along `status` and it means it's an error
	      //
	      // That's the only case where we have a response.status that's not the http statusCode
	      var status = httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status ||
	
	      // this is important to check the request statusCode AFTER the body eventual
	      // statusCode because some implementations (jQuery XDomainRequest transport) may
	      // send statusCode 200 while we had an error
	      httpResponse.statusCode ||
	
	      // When in browser mode, using XDR or JSONP
	      // we default to success when no error (no response.status && response.message)
	      // If there was a JSON.parse() error then body is null and it fails
	      httpResponse && httpResponse.body && 200;
	
	      requestDebug('received response: statusCode: %s, computed statusCode: %d, headers: %j', httpResponse.statusCode, status, httpResponse.headers);
	
	      var httpResponseOk = Math.floor(status / 100) === 2;
	
	      var endTime = new Date();
	      debugData.push({
	        currentHost: currentHost,
	        headers: removeCredentials(headers),
	        content: body || null,
	        contentLength: body !== undefined ? body.length : null,
	        method: reqOpts.method,
	        timeouts: reqOpts.timeouts,
	        url: reqOpts.url,
	        startTime: startTime,
	        endTime: endTime,
	        duration: endTime - startTime,
	        statusCode: status
	      });
	
	      if (httpResponseOk) {
	        if (client._useCache && cache) {
	          cache[cacheID] = httpResponse.responseText;
	        }
	
	        return httpResponse.body;
	      }
	
	      var shouldRetry = Math.floor(status / 100) !== 4;
	
	      if (shouldRetry) {
	        tries += 1;
	        return retryRequest();
	      }
	
	      requestDebug('unrecoverable error');
	
	      // no success and no retry => fail
	      var unrecoverableError = new errors.AlgoliaSearchError(httpResponse.body && httpResponse.body.message, { debugData: debugData, statusCode: status });
	
	      return client._promise.reject(unrecoverableError);
	    }
	
	    function tryFallback(err) {
	      // error cases:
	      //  While not in fallback mode:
	      //    - CORS not supported
	      //    - network error
	      //  While in fallback mode:
	      //    - timeout
	      //    - network error
	      //    - badly formatted JSONP (script loaded, did not call our callback)
	      //  In both cases:
	      //    - uncaught exception occurs (TypeError)
	      requestDebug('error: %s, stack: %s', err.message, err.stack);
	
	      var endTime = new Date();
	      debugData.push({
	        currentHost: currentHost,
	        headers: removeCredentials(headers),
	        content: body || null,
	        contentLength: body !== undefined ? body.length : null,
	        method: reqOpts.method,
	        timeouts: reqOpts.timeouts,
	        url: reqOpts.url,
	        startTime: startTime,
	        endTime: endTime,
	        duration: endTime - startTime
	      });
	
	      if (!(err instanceof errors.AlgoliaSearchError)) {
	        err = new errors.Unknown(err && err.message, err);
	      }
	
	      tries += 1;
	
	      // stop the request implementation when:
	      if (
	      // we did not generate this error,
	      // it comes from a throw in some other piece of code
	      err instanceof errors.Unknown ||
	
	      // server sent unparsable JSON
	      err instanceof errors.UnparsableJSON ||
	
	      // max tries and already using fallback or no fallback
	      tries >= client.hosts[initialOpts.hostType].length && (usingFallback || !hasFallback)) {
	        // stop request implementation for this command
	        err.debugData = debugData;
	        return client._promise.reject(err);
	      }
	
	      // When a timeout occured, retry by raising timeout
	      if (err instanceof errors.RequestTimeout) {
	        return retryRequestWithHigherTimeout();
	      }
	
	      return retryRequest();
	    }
	
	    function retryRequest() {
	      requestDebug('retrying request');
	      client._incrementHostIndex(initialOpts.hostType);
	      return doRequest(requester, reqOpts);
	    }
	
	    function retryRequestWithHigherTimeout() {
	      requestDebug('retrying request with higher timeout');
	      client._incrementHostIndex(initialOpts.hostType);
	      client._incrementTimeoutMultipler();
	      reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
	      return doRequest(requester, reqOpts);
	    }
	  }
	
	  var promise = doRequest(client._request, {
	    url: initialOpts.url,
	    method: initialOpts.method,
	    body: body,
	    jsonBody: initialOpts.body,
	    timeouts: client._getTimeoutsForRequest(initialOpts.hostType)
	  });
	
	  // either we have a callback
	  // either we are using promises
	  if (initialOpts.callback) {
	    promise.then(function okCb(content) {
	      exitPromise(function () {
	        initialOpts.callback(null, content);
	      }, client._setTimeout || setTimeout);
	    }, function nookCb(err) {
	      exitPromise(function () {
	        initialOpts.callback(err);
	      }, client._setTimeout || setTimeout);
	    });
	  } else {
	    return promise;
	  }
	};
	
	/*
	* Transform search param object in query string
	*/
	AlgoliaSearchCore.prototype._getSearchParams = function (args, params) {
	  if (args === undefined || args === null) {
	    return params;
	  }
	  for (var key in args) {
	    if (key !== null && args[key] !== undefined && args.hasOwnProperty(key)) {
	      params += params === '' ? '' : '&';
	      params += key + '=' + encodeURIComponent(Object.prototype.toString.call(args[key]) === '[object Array]' ? safeJSONStringify(args[key]) : args[key]);
	    }
	  }
	  return params;
	};
	
	AlgoliaSearchCore.prototype._computeRequestHeaders = function (withAPIKey) {
	  var forEach = __webpack_require__(19);
	
	  var requestHeaders = {
	    'x-algolia-agent': this._ua,
	    'x-algolia-application-id': this.applicationID
	  };
	
	  // browser will inline headers in the url, node.js will use http headers
	  // but in some situations, the API KEY will be too long (big secured API keys)
	  // so if the request is a POST and the KEY is very long, we will be asked to not put
	  // it into headers but in the JSON body
	  if (withAPIKey !== false) {
	    requestHeaders['x-algolia-api-key'] = this.apiKey;
	  }
	
	  if (this.userToken) {
	    requestHeaders['x-algolia-usertoken'] = this.userToken;
	  }
	
	  if (this.securityTags) {
	    requestHeaders['x-algolia-tagfilters'] = this.securityTags;
	  }
	
	  if (this.extraHeaders) {
	    forEach(this.extraHeaders, function addToRequestHeaders(header) {
	      requestHeaders[header.name] = header.value;
	    });
	  }
	
	  return requestHeaders;
	};
	
	/**
	 * Search through multiple indices at the same time
	 * @param  {Object[]}   queries  An array of queries you want to run.
	 * @param {string} queries[].indexName The index name you want to target
	 * @param {string} [queries[].query] The query to issue on this index. Can also be passed into `params`
	 * @param {Object} queries[].params Any search param like hitsPerPage, ..
	 * @param  {Function} callback Callback to be called
	 * @return {Promise|undefined} Returns a promise if no callback given
	 */
	AlgoliaSearchCore.prototype.search = function (queries, opts, callback) {
	  var isArray = __webpack_require__(27);
	  var map = __webpack_require__(28);
	
	  var usage = 'Usage: client.search(arrayOfQueries[, callback])';
	
	  if (!isArray(queries)) {
	    throw new Error(usage);
	  }
	
	  if (typeof opts === 'function') {
	    callback = opts;
	    opts = {};
	  } else if (opts === undefined) {
	    opts = {};
	  }
	
	  var client = this;
	
	  var postObj = {
	    requests: map(queries, function prepareRequest(query) {
	      var params = '';
	
	      // allow query.query
	      // so we are mimicing the index.search(query, params) method
	      // {indexName:, query:, params:}
	      if (query.query !== undefined) {
	        params += 'query=' + encodeURIComponent(query.query);
	      }
	
	      return {
	        indexName: query.indexName,
	        params: client._getSearchParams(query.params, params)
	      };
	    })
	  };
	
	  var JSONPParams = map(postObj.requests, function prepareJSONPParams(request, requestId) {
	    return requestId + '=' + encodeURIComponent('/1/indexes/' + encodeURIComponent(request.indexName) + '?' + request.params);
	  }).join('&');
	
	  var url = '/1/indexes/*/queries';
	
	  if (opts.strategy !== undefined) {
	    url += '?strategy=' + opts.strategy;
	  }
	
	  return this._jsonRequest({
	    cache: this.cache,
	    method: 'POST',
	    url: url,
	    body: postObj,
	    hostType: 'read',
	    fallback: {
	      method: 'GET',
	      url: '/1/indexes/*',
	      body: {
	        params: JSONPParams
	      }
	    },
	    callback: callback
	  });
	};
	
	/**
	 * Set the extra security tagFilters header
	 * @param {string|array} tags The list of tags defining the current security filters
	 */
	AlgoliaSearchCore.prototype.setSecurityTags = function (tags) {
	  if (Object.prototype.toString.call(tags) === '[object Array]') {
	    var strTags = [];
	    for (var i = 0; i < tags.length; ++i) {
	      if (Object.prototype.toString.call(tags[i]) === '[object Array]') {
	        var oredTags = [];
	        for (var j = 0; j < tags[i].length; ++j) {
	          oredTags.push(tags[i][j]);
	        }
	        strTags.push('(' + oredTags.join(',') + ')');
	      } else {
	        strTags.push(tags[i]);
	      }
	    }
	    tags = strTags.join(',');
	  }
	
	  this.securityTags = tags;
	};
	
	/**
	 * Set the extra user token header
	 * @param {string} userToken The token identifying a uniq user (used to apply rate limits)
	 */
	AlgoliaSearchCore.prototype.setUserToken = function (userToken) {
	  this.userToken = userToken;
	};
	
	/**
	 * Clear all queries in client's cache
	 * @return undefined
	 */
	AlgoliaSearchCore.prototype.clearCache = function () {
	  this.cache = {};
	};
	
	/**
	* Set the number of milliseconds a request can take before automatically being terminated.
	* @deprecated
	* @param {Number} milliseconds
	*/
	AlgoliaSearchCore.prototype.setRequestTimeout = function (milliseconds) {
	  if (milliseconds) {
	    this._timeouts.connect = this._timeouts.read = this._timeouts.write = milliseconds;
	  }
	};
	
	/**
	* Set the three different (connect, read, write) timeouts to be used when requesting
	* @param {Object} timeouts
	*/
	AlgoliaSearchCore.prototype.setTimeouts = function (timeouts) {
	  this._timeouts = timeouts;
	};
	
	/**
	* Get the three different (connect, read, write) timeouts to be used when requesting
	* @param {Object} timeouts
	*/
	AlgoliaSearchCore.prototype.getTimeouts = function () {
	  return this._timeouts;
	};
	
	AlgoliaSearchCore.prototype._getAppIdData = function () {
	  var data = store.get(this.applicationID);
	  if (data !== null) this._cacheAppIdData(data);
	  return data;
	};
	
	AlgoliaSearchCore.prototype._setAppIdData = function (data) {
	  data.lastChange = new Date().getTime();
	  this._cacheAppIdData(data);
	  return store.set(this.applicationID, data);
	};
	
	AlgoliaSearchCore.prototype._checkAppIdData = function () {
	  var data = this._getAppIdData();
	  var now = new Date().getTime();
	  if (data === null || now - data.lastChange > RESET_APP_DATA_TIMER) {
	    return this._resetInitialAppIdData(data);
	  }
	
	  return data;
	};
	
	AlgoliaSearchCore.prototype._resetInitialAppIdData = function (data) {
	  var newData = data || {};
	  newData.hostIndexes = { read: 0, write: 0 };
	  newData.timeoutMultiplier = 1;
	  newData.shuffleResult = newData.shuffleResult || shuffle([1, 2, 3]);
	  return this._setAppIdData(newData);
	};
	
	AlgoliaSearchCore.prototype._cacheAppIdData = function (data) {
	  this._hostIndexes = data.hostIndexes;
	  this._timeoutMultiplier = data.timeoutMultiplier;
	  this._shuffleResult = data.shuffleResult;
	};
	
	AlgoliaSearchCore.prototype._partialAppIdDataUpdate = function (newData) {
	  var foreach = __webpack_require__(19);
	  var currentData = this._getAppIdData();
	  foreach(newData, function (value, key) {
	    currentData[key] = value;
	  });
	
	  return this._setAppIdData(currentData);
	};
	
	AlgoliaSearchCore.prototype._getHostByType = function (hostType) {
	  return this.hosts[hostType][this._getHostIndexByType(hostType)];
	};
	
	AlgoliaSearchCore.prototype._getTimeoutMultiplier = function () {
	  return this._timeoutMultiplier;
	};
	
	AlgoliaSearchCore.prototype._getHostIndexByType = function (hostType) {
	  return this._hostIndexes[hostType];
	};
	
	AlgoliaSearchCore.prototype._setHostIndexByType = function (hostIndex, hostType) {
	  var clone = __webpack_require__(23);
	  var newHostIndexes = clone(this._hostIndexes);
	  newHostIndexes[hostType] = hostIndex;
	  this._partialAppIdDataUpdate({ hostIndexes: newHostIndexes });
	  return hostIndex;
	};
	
	AlgoliaSearchCore.prototype._incrementHostIndex = function (hostType) {
	  return this._setHostIndexByType((this._getHostIndexByType(hostType) + 1) % this.hosts[hostType].length, hostType);
	};
	
	AlgoliaSearchCore.prototype._incrementTimeoutMultipler = function () {
	  var timeoutMultiplier = Math.max(this._timeoutMultiplier + 1, 4);
	  return this._partialAppIdDataUpdate({ timeoutMultiplier: timeoutMultiplier });
	};
	
	AlgoliaSearchCore.prototype._getTimeoutsForRequest = function (hostType) {
	  return {
	    connect: this._timeouts.connect * this._timeoutMultiplier,
	    complete: this._timeouts[hostType] * this._timeoutMultiplier
	  };
	};
	
	function prepareHost(protocol) {
	  return function prepare(host) {
	    return protocol + '//' + host.toLowerCase();
	  };
	}
	
	// Prototype.js < 1.7, a widely used library, defines a weird
	// Array.prototype.toJSON function that will fail to stringify our content
	// appropriately
	// refs:
	//   - https://groups.google.com/forum/#!topic/prototype-core/E-SAVvV_V9Q
	//   - https://github.com/sstephenson/prototype/commit/038a2985a70593c1a86c230fadbdfe2e4898a48c
	//   - http://stackoverflow.com/a/3148441/147079
	function safeJSONStringify(obj) {
	  /* eslint no-extend-native:0 */
	
	  if (Array.prototype.toJSON === undefined) {
	    return JSON.stringify(obj);
	  }
	
	  var toJSON = Array.prototype.toJSON;
	  delete Array.prototype.toJSON;
	  var out = JSON.stringify(obj);
	  Array.prototype.toJSON = toJSON;
	
	  return out;
	}
	
	function shuffle(array) {
	  var currentIndex = array.length;
	  var temporaryValue;
	  var randomIndex;
	
	  // While there remain elements to shuffle...
	  while (currentIndex !== 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	
	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	
	  return array;
	}
	
	function removeCredentials(headers) {
	  var newHeaders = {};
	
	  for (var headerName in headers) {
	    if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
	      var value;
	
	      if (headerName === 'x-algolia-api-key' || headerName === 'x-algolia-application-id') {
	        value = '**hidden for security purposes**';
	      } else {
	        value = headers[headerName];
	      }
	
	      newHeaders[headerName] = value;
	    }
	  }
	
	  return newHeaders;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)))

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var debug = __webpack_require__(35)('algoliasearch:src/hostIndexState.js');
	var localStorageNamespace = 'algoliasearch-client-js';
	
	var store;
	var moduleStore = {
	  state: {},
	  set: function set(key, data) {
	    this.state[key] = data;
	    return this.state[key];
	  },
	  get: function get(key) {
	    return this.state[key] || null;
	  }
	};
	
	var localStorageStore = {
	  set: function set(key, data) {
	    try {
	      var namespace = JSON.parse(global.localStorage[localStorageNamespace]);
	      namespace[key] = data;
	      global.localStorage[localStorageNamespace] = JSON.stringify(namespace);
	      return namespace[key];
	    } catch (e) {
	      debug('localStorage set failed with', e);
	      cleanup();
	      store = moduleStore;
	      return store.set(key, data);
	    }
	  },
	  get: function get(key) {
	    return JSON.parse(global.localStorage[localStorageNamespace])[key] || null;
	  }
	};
	
	store = supportsLocalStorage() ? localStorageStore : moduleStore;
	
	module.exports = {
	  get: getOrSet,
	  set: getOrSet
	};
	
	function getOrSet(key, data) {
	  if (arguments.length === 1) {
	    return store.get(key);
	  }
	
	  return store.set(key, data);
	}
	
	function supportsLocalStorage() {
	  try {
	    if ('localStorage' in global && global.localStorage !== null && !global.localStorage[localStorageNamespace]) {
	      // actual creation of the namespace
	      global.localStorage.setItem(localStorageNamespace, JSON.stringify({}));
	      return true;
	    }
	
	    return false;
	  } catch (_) {
	    return false;
	  }
	}
	
	// In case of any error on localStorage, we clean our own namespace, this should handle
	// quota errors when a lot of keys + data are used
	function cleanup() {
	  try {
	    global.localStorage.removeItem(localStorageNamespace);
	  } catch (_) {
	    // nothing to do
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(36);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
	    return true;
	  }
	
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style ||
	  // is firebug? http://stackoverflow.com/a/398120/376773
	  typeof window !== 'undefined' && window && window.console && (console.firebug || console.exception && console.table) ||
	  // is firefox >= v31?
	  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	  typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
	  // double check webkit in userAgent just in case we are in a worker
	  typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function (v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs(args) {
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return;
	
	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit');
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function (match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch (e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  try {
	    return exports.storage.debug;
	  } catch (e) {}
	
	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (typeof process !== 'undefined' && 'env' in process) {
	    return process.env.DEBUG;
	  }
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = createDebug.debug = createDebug.default = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(37);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor(namespace) {
	  var hash = 0,
	      i;
	
	  for (i in namespace) {
	    hash = (hash << 5) - hash + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }
	
	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function createDebug(namespace) {
	
	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;
	
	    var self = debug;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);
	
	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	
	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);
	
	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }
	
	  return debug;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function (val, options) {
	  options = options || {};
	  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = String(str);
	  if (str.length > 10000) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtLong(ms) {
	  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var global = __webpack_require__(39);
	var Promise = global.Promise || __webpack_require__(40).Promise;
	
	// This is the standalone browser build entry point
	// Browser implementation of the Algolia Search JavaScript client,
	// using XMLHttpRequest, XDomainRequest and JSONP as fallback
	module.exports = function createAlgoliasearch(AlgoliaSearch, uaSuffix) {
	  var inherits = __webpack_require__(15);
	  var errors = __webpack_require__(18);
	  var inlineHeaders = __webpack_require__(42);
	  var jsonpRequest = __webpack_require__(44);
	  var places = __webpack_require__(45);
	  uaSuffix = uaSuffix || '';
	
	  if (process.env.NODE_ENV === 'debug') {
	    __webpack_require__(35).enable('algoliasearch*');
	  }
	
	  function algoliasearch(applicationID, apiKey, opts) {
	    var cloneDeep = __webpack_require__(23);
	
	    var getDocumentProtocol = __webpack_require__(46);
	
	    opts = cloneDeep(opts || {});
	
	    if (opts.protocol === undefined) {
	      opts.protocol = getDocumentProtocol();
	    }
	
	    opts._ua = opts._ua || algoliasearch.ua;
	
	    return new AlgoliaSearchBrowser(applicationID, apiKey, opts);
	  }
	
	  algoliasearch.version = __webpack_require__(47);
	  algoliasearch.ua = 'Algolia for vanilla JavaScript ' + uaSuffix + algoliasearch.version;
	  algoliasearch.initPlaces = places(algoliasearch);
	
	  // we expose into window no matter how we are used, this will allow
	  // us to easily debug any website running algolia
	  global.__algolia = {
	    debug: __webpack_require__(35),
	    algoliasearch: algoliasearch
	  };
	
	  var support = {
	    hasXMLHttpRequest: 'XMLHttpRequest' in global,
	    hasXDomainRequest: 'XDomainRequest' in global
	  };
	
	  if (support.hasXMLHttpRequest) {
	    support.cors = 'withCredentials' in new XMLHttpRequest();
	  }
	
	  function AlgoliaSearchBrowser() {
	    // call AlgoliaSearch constructor
	    AlgoliaSearch.apply(this, arguments);
	  }
	
	  inherits(AlgoliaSearchBrowser, AlgoliaSearch);
	
	  AlgoliaSearchBrowser.prototype._request = function request(url, opts) {
	    return new Promise(function wrapRequest(resolve, reject) {
	      // no cors or XDomainRequest, no request
	      if (!support.cors && !support.hasXDomainRequest) {
	        // very old browser, not supported
	        reject(new errors.Network('CORS not supported'));
	        return;
	      }
	
	      url = inlineHeaders(url, opts.headers);
	
	      var body = opts.body;
	      var req = support.cors ? new XMLHttpRequest() : new XDomainRequest();
	      var reqTimeout;
	      var timedOut;
	      var connected = false;
	
	      reqTimeout = setTimeout(onTimeout, opts.timeouts.connect);
	      // we set an empty onprogress listener
	      // so that XDomainRequest on IE9 is not aborted
	      // refs:
	      //  - https://github.com/algolia/algoliasearch-client-js/issues/76
	      //  - https://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
	      req.onprogress = onProgress;
	      if ('onreadystatechange' in req) req.onreadystatechange = onReadyStateChange;
	      req.onload = onLoad;
	      req.onerror = onError;
	
	      // do not rely on default XHR async flag, as some analytics code like hotjar
	      // breaks it and set it to false by default
	      if (req instanceof XMLHttpRequest) {
	        req.open(opts.method, url, true);
	      } else {
	        req.open(opts.method, url);
	      }
	
	      // headers are meant to be sent after open
	      if (support.cors) {
	        if (body) {
	          if (opts.method === 'POST') {
	            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Simple_requests
	            req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	          } else {
	            req.setRequestHeader('content-type', 'application/json');
	          }
	        }
	        req.setRequestHeader('accept', 'application/json');
	      }
	
	      req.send(body);
	
	      // event object not received in IE8, at least
	      // but we do not use it, still important to note
	      function onLoad() /* event */{
	        // When browser does not supports req.timeout, we can
	        // have both a load and timeout event, since handled by a dumb setTimeout
	        if (timedOut) {
	          return;
	        }
	
	        clearTimeout(reqTimeout);
	
	        var out;
	
	        try {
	          out = {
	            body: JSON.parse(req.responseText),
	            responseText: req.responseText,
	            statusCode: req.status,
	            // XDomainRequest does not have any response headers
	            headers: req.getAllResponseHeaders && req.getAllResponseHeaders() || {}
	          };
	        } catch (e) {
	          out = new errors.UnparsableJSON({
	            more: req.responseText
	          });
	        }
	
	        if (out instanceof errors.UnparsableJSON) {
	          reject(out);
	        } else {
	          resolve(out);
	        }
	      }
	
	      function onError(event) {
	        if (timedOut) {
	          return;
	        }
	
	        clearTimeout(reqTimeout);
	
	        // error event is trigerred both with XDR/XHR on:
	        //   - DNS error
	        //   - unallowed cross domain request
	        reject(new errors.Network({
	          more: event
	        }));
	      }
	
	      function onTimeout() {
	        timedOut = true;
	        req.abort();
	
	        reject(new errors.RequestTimeout());
	      }
	
	      function onConnect() {
	        connected = true;
	        clearTimeout(reqTimeout);
	        reqTimeout = setTimeout(onTimeout, opts.timeouts.complete);
	      }
	
	      function onProgress() {
	        if (!connected) onConnect();
	      }
	
	      function onReadyStateChange() {
	        if (!connected && req.readyState > 1) onConnect();
	      }
	    });
	  };
	
	  AlgoliaSearchBrowser.prototype._request.fallback = function requestFallback(url, opts) {
	    url = inlineHeaders(url, opts.headers);
	
	    return new Promise(function wrapJsonpRequest(resolve, reject) {
	      jsonpRequest(url, opts, function jsonpRequestDone(err, content) {
	        if (err) {
	          reject(err);
	          return;
	        }
	
	        resolve(content);
	      });
	    });
	  };
	
	  AlgoliaSearchBrowser.prototype._promise = {
	    reject: function rejectPromise(val) {
	      return Promise.reject(val);
	    },
	    resolve: function resolvePromise(val) {
	      return Promise.resolve(val);
	    },
	    delay: function delayPromise(ms) {
	      return new Promise(function resolveOnTimeout(resolve /* , reject*/) {
	        setTimeout(resolve, ms);
	      });
	    }
	  };
	
	  return algoliasearch;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)))

/***/ },
/* 39 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	if (typeof window !== "undefined") {
	    module.exports = window;
	} else if (typeof global !== "undefined") {
	    module.exports = global;
	} else if (typeof self !== "undefined") {
	    module.exports = self;
	} else {
	    module.exports = {};
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   4.0.5
	 */
	
	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.ES6Promise = factory();
	})(undefined, function () {
	  'use strict';
	
	  function objectOrFunction(x) {
	    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
	  }
	
	  function isFunction(x) {
	    return typeof x === 'function';
	  }
	
	  var _isArray = undefined;
	  if (!Array.isArray) {
	    _isArray = function _isArray(x) {
	      return Object.prototype.toString.call(x) === '[object Array]';
	    };
	  } else {
	    _isArray = Array.isArray;
	  }
	
	  var isArray = _isArray;
	
	  var len = 0;
	  var vertxNext = undefined;
	  var customSchedulerFn = undefined;
	
	  var asap = function asap(callback, arg) {
	    queue[len] = callback;
	    queue[len + 1] = arg;
	    len += 2;
	    if (len === 2) {
	      // If len is 2, that means that we need to schedule an async flush.
	      // If additional callbacks are queued before the queue is flushed, they
	      // will be processed by this flush that we are scheduling.
	      if (customSchedulerFn) {
	        customSchedulerFn(flush);
	      } else {
	        scheduleFlush();
	      }
	    }
	  };
	
	  function setScheduler(scheduleFn) {
	    customSchedulerFn = scheduleFn;
	  }
	
	  function setAsap(asapFn) {
	    asap = asapFn;
	  }
	
	  var browserWindow = typeof window !== 'undefined' ? window : undefined;
	  var browserGlobal = browserWindow || {};
	  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
	
	  // test for web worker but not in IE10
	  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
	
	  // node
	  function useNextTick() {
	    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	    // see https://github.com/cujojs/when/issues/410 for details
	    return function () {
	      return process.nextTick(flush);
	    };
	  }
	
	  // vertx
	  function useVertxTimer() {
	    if (typeof vertxNext !== 'undefined') {
	      return function () {
	        vertxNext(flush);
	      };
	    }
	
	    return useSetTimeout();
	  }
	
	  function useMutationObserver() {
	    var iterations = 0;
	    var observer = new BrowserMutationObserver(flush);
	    var node = document.createTextNode('');
	    observer.observe(node, { characterData: true });
	
	    return function () {
	      node.data = iterations = ++iterations % 2;
	    };
	  }
	
	  // web worker
	  function useMessageChannel() {
	    var channel = new MessageChannel();
	    channel.port1.onmessage = flush;
	    return function () {
	      return channel.port2.postMessage(0);
	    };
	  }
	
	  function useSetTimeout() {
	    // Store setTimeout reference so es6-promise will be unaffected by
	    // other code modifying setTimeout (like sinon.useFakeTimers())
	    var globalSetTimeout = setTimeout;
	    return function () {
	      return globalSetTimeout(flush, 1);
	    };
	  }
	
	  var queue = new Array(1000);
	  function flush() {
	    for (var i = 0; i < len; i += 2) {
	      var callback = queue[i];
	      var arg = queue[i + 1];
	
	      callback(arg);
	
	      queue[i] = undefined;
	      queue[i + 1] = undefined;
	    }
	
	    len = 0;
	  }
	
	  function attemptVertx() {
	    try {
	      var r = require;
	      var vertx = __webpack_require__(41);
	      vertxNext = vertx.runOnLoop || vertx.runOnContext;
	      return useVertxTimer();
	    } catch (e) {
	      return useSetTimeout();
	    }
	  }
	
	  var scheduleFlush = undefined;
	  // Decide what async method to use to triggering processing of queued callbacks:
	  if (isNode) {
	    scheduleFlush = useNextTick();
	  } else if (BrowserMutationObserver) {
	    scheduleFlush = useMutationObserver();
	  } else if (isWorker) {
	    scheduleFlush = useMessageChannel();
	  } else if (browserWindow === undefined && "function" === 'function') {
	    scheduleFlush = attemptVertx();
	  } else {
	    scheduleFlush = useSetTimeout();
	  }
	
	  function then(onFulfillment, onRejection) {
	    var _arguments = arguments;
	
	    var parent = this;
	
	    var child = new this.constructor(noop);
	
	    if (child[PROMISE_ID] === undefined) {
	      makePromise(child);
	    }
	
	    var _state = parent._state;
	
	    if (_state) {
	      (function () {
	        var callback = _arguments[_state - 1];
	        asap(function () {
	          return invokeCallback(_state, child, callback, parent._result);
	        });
	      })();
	    } else {
	      subscribe(parent, child, onFulfillment, onRejection);
	    }
	
	    return child;
	  }
	
	  /**
	    `Promise.resolve` returns a promise that will become resolved with the
	    passed `value`. It is shorthand for the following:
	  
	    ```javascript
	    let promise = new Promise(function(resolve, reject){
	      resolve(1);
	    });
	  
	    promise.then(function(value){
	      // value === 1
	    });
	    ```
	  
	    Instead of writing the above, your code now simply becomes the following:
	  
	    ```javascript
	    let promise = Promise.resolve(1);
	  
	    promise.then(function(value){
	      // value === 1
	    });
	    ```
	  
	    @method resolve
	    @static
	    @param {Any} value value that the returned promise will be resolved with
	    Useful for tooling.
	    @return {Promise} a promise that will become fulfilled with the given
	    `value`
	  */
	  function resolve(object) {
	    /*jshint validthis:true */
	    var Constructor = this;
	
	    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
	      return object;
	    }
	
	    var promise = new Constructor(noop);
	    _resolve(promise, object);
	    return promise;
	  }
	
	  var PROMISE_ID = Math.random().toString(36).substring(16);
	
	  function noop() {}
	
	  var PENDING = void 0;
	  var FULFILLED = 1;
	  var REJECTED = 2;
	
	  var GET_THEN_ERROR = new ErrorObject();
	
	  function selfFulfillment() {
	    return new TypeError("You cannot resolve a promise with itself");
	  }
	
	  function cannotReturnOwn() {
	    return new TypeError('A promises callback cannot return that same promise.');
	  }
	
	  function getThen(promise) {
	    try {
	      return promise.then;
	    } catch (error) {
	      GET_THEN_ERROR.error = error;
	      return GET_THEN_ERROR;
	    }
	  }
	
	  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	    try {
	      then.call(value, fulfillmentHandler, rejectionHandler);
	    } catch (e) {
	      return e;
	    }
	  }
	
	  function handleForeignThenable(promise, thenable, then) {
	    asap(function (promise) {
	      var sealed = false;
	      var error = tryThen(then, thenable, function (value) {
	        if (sealed) {
	          return;
	        }
	        sealed = true;
	        if (thenable !== value) {
	          _resolve(promise, value);
	        } else {
	          fulfill(promise, value);
	        }
	      }, function (reason) {
	        if (sealed) {
	          return;
	        }
	        sealed = true;
	
	        _reject(promise, reason);
	      }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	      if (!sealed && error) {
	        sealed = true;
	        _reject(promise, error);
	      }
	    }, promise);
	  }
	
	  function handleOwnThenable(promise, thenable) {
	    if (thenable._state === FULFILLED) {
	      fulfill(promise, thenable._result);
	    } else if (thenable._state === REJECTED) {
	      _reject(promise, thenable._result);
	    } else {
	      subscribe(thenable, undefined, function (value) {
	        return _resolve(promise, value);
	      }, function (reason) {
	        return _reject(promise, reason);
	      });
	    }
	  }
	
	  function handleMaybeThenable(promise, maybeThenable, then$$) {
	    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
	      handleOwnThenable(promise, maybeThenable);
	    } else {
	      if (then$$ === GET_THEN_ERROR) {
	        _reject(promise, GET_THEN_ERROR.error);
	      } else if (then$$ === undefined) {
	        fulfill(promise, maybeThenable);
	      } else if (isFunction(then$$)) {
	        handleForeignThenable(promise, maybeThenable, then$$);
	      } else {
	        fulfill(promise, maybeThenable);
	      }
	    }
	  }
	
	  function _resolve(promise, value) {
	    if (promise === value) {
	      _reject(promise, selfFulfillment());
	    } else if (objectOrFunction(value)) {
	      handleMaybeThenable(promise, value, getThen(value));
	    } else {
	      fulfill(promise, value);
	    }
	  }
	
	  function publishRejection(promise) {
	    if (promise._onerror) {
	      promise._onerror(promise._result);
	    }
	
	    publish(promise);
	  }
	
	  function fulfill(promise, value) {
	    if (promise._state !== PENDING) {
	      return;
	    }
	
	    promise._result = value;
	    promise._state = FULFILLED;
	
	    if (promise._subscribers.length !== 0) {
	      asap(publish, promise);
	    }
	  }
	
	  function _reject(promise, reason) {
	    if (promise._state !== PENDING) {
	      return;
	    }
	    promise._state = REJECTED;
	    promise._result = reason;
	
	    asap(publishRejection, promise);
	  }
	
	  function subscribe(parent, child, onFulfillment, onRejection) {
	    var _subscribers = parent._subscribers;
	    var length = _subscribers.length;
	
	    parent._onerror = null;
	
	    _subscribers[length] = child;
	    _subscribers[length + FULFILLED] = onFulfillment;
	    _subscribers[length + REJECTED] = onRejection;
	
	    if (length === 0 && parent._state) {
	      asap(publish, parent);
	    }
	  }
	
	  function publish(promise) {
	    var subscribers = promise._subscribers;
	    var settled = promise._state;
	
	    if (subscribers.length === 0) {
	      return;
	    }
	
	    var child = undefined,
	        callback = undefined,
	        detail = promise._result;
	
	    for (var i = 0; i < subscribers.length; i += 3) {
	      child = subscribers[i];
	      callback = subscribers[i + settled];
	
	      if (child) {
	        invokeCallback(settled, child, callback, detail);
	      } else {
	        callback(detail);
	      }
	    }
	
	    promise._subscribers.length = 0;
	  }
	
	  function ErrorObject() {
	    this.error = null;
	  }
	
	  var TRY_CATCH_ERROR = new ErrorObject();
	
	  function tryCatch(callback, detail) {
	    try {
	      return callback(detail);
	    } catch (e) {
	      TRY_CATCH_ERROR.error = e;
	      return TRY_CATCH_ERROR;
	    }
	  }
	
	  function invokeCallback(settled, promise, callback, detail) {
	    var hasCallback = isFunction(callback),
	        value = undefined,
	        error = undefined,
	        succeeded = undefined,
	        failed = undefined;
	
	    if (hasCallback) {
	      value = tryCatch(callback, detail);
	
	      if (value === TRY_CATCH_ERROR) {
	        failed = true;
	        error = value.error;
	        value = null;
	      } else {
	        succeeded = true;
	      }
	
	      if (promise === value) {
	        _reject(promise, cannotReturnOwn());
	        return;
	      }
	    } else {
	      value = detail;
	      succeeded = true;
	    }
	
	    if (promise._state !== PENDING) {
	      // noop
	    } else if (hasCallback && succeeded) {
	      _resolve(promise, value);
	    } else if (failed) {
	      _reject(promise, error);
	    } else if (settled === FULFILLED) {
	      fulfill(promise, value);
	    } else if (settled === REJECTED) {
	      _reject(promise, value);
	    }
	  }
	
	  function initializePromise(promise, resolver) {
	    try {
	      resolver(function resolvePromise(value) {
	        _resolve(promise, value);
	      }, function rejectPromise(reason) {
	        _reject(promise, reason);
	      });
	    } catch (e) {
	      _reject(promise, e);
	    }
	  }
	
	  var id = 0;
	  function nextId() {
	    return id++;
	  }
	
	  function makePromise(promise) {
	    promise[PROMISE_ID] = id++;
	    promise._state = undefined;
	    promise._result = undefined;
	    promise._subscribers = [];
	  }
	
	  function Enumerator(Constructor, input) {
	    this._instanceConstructor = Constructor;
	    this.promise = new Constructor(noop);
	
	    if (!this.promise[PROMISE_ID]) {
	      makePromise(this.promise);
	    }
	
	    if (isArray(input)) {
	      this._input = input;
	      this.length = input.length;
	      this._remaining = input.length;
	
	      this._result = new Array(this.length);
	
	      if (this.length === 0) {
	        fulfill(this.promise, this._result);
	      } else {
	        this.length = this.length || 0;
	        this._enumerate();
	        if (this._remaining === 0) {
	          fulfill(this.promise, this._result);
	        }
	      }
	    } else {
	      _reject(this.promise, validationError());
	    }
	  }
	
	  function validationError() {
	    return new Error('Array Methods must be provided an Array');
	  };
	
	  Enumerator.prototype._enumerate = function () {
	    var length = this.length;
	    var _input = this._input;
	
	    for (var i = 0; this._state === PENDING && i < length; i++) {
	      this._eachEntry(_input[i], i);
	    }
	  };
	
	  Enumerator.prototype._eachEntry = function (entry, i) {
	    var c = this._instanceConstructor;
	    var resolve$$ = c.resolve;
	
	    if (resolve$$ === resolve) {
	      var _then = getThen(entry);
	
	      if (_then === then && entry._state !== PENDING) {
	        this._settledAt(entry._state, i, entry._result);
	      } else if (typeof _then !== 'function') {
	        this._remaining--;
	        this._result[i] = entry;
	      } else if (c === Promise) {
	        var promise = new c(noop);
	        handleMaybeThenable(promise, entry, _then);
	        this._willSettleAt(promise, i);
	      } else {
	        this._willSettleAt(new c(function (resolve$$) {
	          return resolve$$(entry);
	        }), i);
	      }
	    } else {
	      this._willSettleAt(resolve$$(entry), i);
	    }
	  };
	
	  Enumerator.prototype._settledAt = function (state, i, value) {
	    var promise = this.promise;
	
	    if (promise._state === PENDING) {
	      this._remaining--;
	
	      if (state === REJECTED) {
	        _reject(promise, value);
	      } else {
	        this._result[i] = value;
	      }
	    }
	
	    if (this._remaining === 0) {
	      fulfill(promise, this._result);
	    }
	  };
	
	  Enumerator.prototype._willSettleAt = function (promise, i) {
	    var enumerator = this;
	
	    subscribe(promise, undefined, function (value) {
	      return enumerator._settledAt(FULFILLED, i, value);
	    }, function (reason) {
	      return enumerator._settledAt(REJECTED, i, reason);
	    });
	  };
	
	  /**
	    `Promise.all` accepts an array of promises, and returns a new promise which
	    is fulfilled with an array of fulfillment values for the passed promises, or
	    rejected with the reason of the first passed promise to be rejected. It casts all
	    elements of the passed iterable to promises as it runs this algorithm.
	  
	    Example:
	  
	    ```javascript
	    let promise1 = resolve(1);
	    let promise2 = resolve(2);
	    let promise3 = resolve(3);
	    let promises = [ promise1, promise2, promise3 ];
	  
	    Promise.all(promises).then(function(array){
	      // The array here would be [ 1, 2, 3 ];
	    });
	    ```
	  
	    If any of the `promises` given to `all` are rejected, the first promise
	    that is rejected will be given as an argument to the returned promises's
	    rejection handler. For example:
	  
	    Example:
	  
	    ```javascript
	    let promise1 = resolve(1);
	    let promise2 = reject(new Error("2"));
	    let promise3 = reject(new Error("3"));
	    let promises = [ promise1, promise2, promise3 ];
	  
	    Promise.all(promises).then(function(array){
	      // Code here never runs because there are rejected promises!
	    }, function(error) {
	      // error.message === "2"
	    });
	    ```
	  
	    @method all
	    @static
	    @param {Array} entries array of promises
	    @param {String} label optional string for labeling the promise.
	    Useful for tooling.
	    @return {Promise} promise that is fulfilled when all `promises` have been
	    fulfilled, or rejected if any of them become rejected.
	    @static
	  */
	  function all(entries) {
	    return new Enumerator(this, entries).promise;
	  }
	
	  /**
	    `Promise.race` returns a new promise which is settled in the same way as the
	    first passed promise to settle.
	  
	    Example:
	  
	    ```javascript
	    let promise1 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        resolve('promise 1');
	      }, 200);
	    });
	  
	    let promise2 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        resolve('promise 2');
	      }, 100);
	    });
	  
	    Promise.race([promise1, promise2]).then(function(result){
	      // result === 'promise 2' because it was resolved before promise1
	      // was resolved.
	    });
	    ```
	  
	    `Promise.race` is deterministic in that only the state of the first
	    settled promise matters. For example, even if other promises given to the
	    `promises` array argument are resolved, but the first settled promise has
	    become rejected before the other promises became fulfilled, the returned
	    promise will become rejected:
	  
	    ```javascript
	    let promise1 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        resolve('promise 1');
	      }, 200);
	    });
	  
	    let promise2 = new Promise(function(resolve, reject){
	      setTimeout(function(){
	        reject(new Error('promise 2'));
	      }, 100);
	    });
	  
	    Promise.race([promise1, promise2]).then(function(result){
	      // Code here never runs
	    }, function(reason){
	      // reason.message === 'promise 2' because promise 2 became rejected before
	      // promise 1 became fulfilled
	    });
	    ```
	  
	    An example real-world use case is implementing timeouts:
	  
	    ```javascript
	    Promise.race([ajax('foo.json'), timeout(5000)])
	    ```
	  
	    @method race
	    @static
	    @param {Array} promises array of promises to observe
	    Useful for tooling.
	    @return {Promise} a promise which settles in the same way as the first passed
	    promise to settle.
	  */
	  function race(entries) {
	    /*jshint validthis:true */
	    var Constructor = this;
	
	    if (!isArray(entries)) {
	      return new Constructor(function (_, reject) {
	        return reject(new TypeError('You must pass an array to race.'));
	      });
	    } else {
	      return new Constructor(function (resolve, reject) {
	        var length = entries.length;
	        for (var i = 0; i < length; i++) {
	          Constructor.resolve(entries[i]).then(resolve, reject);
	        }
	      });
	    }
	  }
	
	  /**
	    `Promise.reject` returns a promise rejected with the passed `reason`.
	    It is shorthand for the following:
	  
	    ```javascript
	    let promise = new Promise(function(resolve, reject){
	      reject(new Error('WHOOPS'));
	    });
	  
	    promise.then(function(value){
	      // Code here doesn't run because the promise is rejected!
	    }, function(reason){
	      // reason.message === 'WHOOPS'
	    });
	    ```
	  
	    Instead of writing the above, your code now simply becomes the following:
	  
	    ```javascript
	    let promise = Promise.reject(new Error('WHOOPS'));
	  
	    promise.then(function(value){
	      // Code here doesn't run because the promise is rejected!
	    }, function(reason){
	      // reason.message === 'WHOOPS'
	    });
	    ```
	  
	    @method reject
	    @static
	    @param {Any} reason value that the returned promise will be rejected with.
	    Useful for tooling.
	    @return {Promise} a promise rejected with the given `reason`.
	  */
	  function reject(reason) {
	    /*jshint validthis:true */
	    var Constructor = this;
	    var promise = new Constructor(noop);
	    _reject(promise, reason);
	    return promise;
	  }
	
	  function needsResolver() {
	    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	  }
	
	  function needsNew() {
	    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	  }
	
	  /**
	    Promise objects represent the eventual result of an asynchronous operation. The
	    primary way of interacting with a promise is through its `then` method, which
	    registers callbacks to receive either a promise's eventual value or the reason
	    why the promise cannot be fulfilled.
	  
	    Terminology
	    -----------
	  
	    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	    - `thenable` is an object or function that defines a `then` method.
	    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	    - `exception` is a value that is thrown using the throw statement.
	    - `reason` is a value that indicates why a promise was rejected.
	    - `settled` the final resting state of a promise, fulfilled or rejected.
	  
	    A promise can be in one of three states: pending, fulfilled, or rejected.
	  
	    Promises that are fulfilled have a fulfillment value and are in the fulfilled
	    state.  Promises that are rejected have a rejection reason and are in the
	    rejected state.  A fulfillment value is never a thenable.
	  
	    Promises can also be said to *resolve* a value.  If this value is also a
	    promise, then the original promise's settled state will match the value's
	    settled state.  So a promise that *resolves* a promise that rejects will
	    itself reject, and a promise that *resolves* a promise that fulfills will
	    itself fulfill.
	  
	  
	    Basic Usage:
	    ------------
	  
	    ```js
	    let promise = new Promise(function(resolve, reject) {
	      // on success
	      resolve(value);
	  
	      // on failure
	      reject(reason);
	    });
	  
	    promise.then(function(value) {
	      // on fulfillment
	    }, function(reason) {
	      // on rejection
	    });
	    ```
	  
	    Advanced Usage:
	    ---------------
	  
	    Promises shine when abstracting away asynchronous interactions such as
	    `XMLHttpRequest`s.
	  
	    ```js
	    function getJSON(url) {
	      return new Promise(function(resolve, reject){
	        let xhr = new XMLHttpRequest();
	  
	        xhr.open('GET', url);
	        xhr.onreadystatechange = handler;
	        xhr.responseType = 'json';
	        xhr.setRequestHeader('Accept', 'application/json');
	        xhr.send();
	  
	        function handler() {
	          if (this.readyState === this.DONE) {
	            if (this.status === 200) {
	              resolve(this.response);
	            } else {
	              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	            }
	          }
	        };
	      });
	    }
	  
	    getJSON('/posts.json').then(function(json) {
	      // on fulfillment
	    }, function(reason) {
	      // on rejection
	    });
	    ```
	  
	    Unlike callbacks, promises are great composable primitives.
	  
	    ```js
	    Promise.all([
	      getJSON('/posts'),
	      getJSON('/comments')
	    ]).then(function(values){
	      values[0] // => postsJSON
	      values[1] // => commentsJSON
	  
	      return values;
	    });
	    ```
	  
	    @class Promise
	    @param {function} resolver
	    Useful for tooling.
	    @constructor
	  */
	  function Promise(resolver) {
	    this[PROMISE_ID] = nextId();
	    this._result = this._state = undefined;
	    this._subscribers = [];
	
	    if (noop !== resolver) {
	      typeof resolver !== 'function' && needsResolver();
	      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	    }
	  }
	
	  Promise.all = all;
	  Promise.race = race;
	  Promise.resolve = resolve;
	  Promise.reject = reject;
	  Promise._setScheduler = setScheduler;
	  Promise._setAsap = setAsap;
	  Promise._asap = asap;
	
	  Promise.prototype = {
	    constructor: Promise,
	
	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	    
	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	    
	      Chaining
	      --------
	    
	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	    
	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	    
	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	    
	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	    
	      Assimilation
	      ------------
	    
	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	    
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	    
	      If the assimliated promise rejects, then the downstream promise will also reject.
	    
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	    
	      Simple Example
	      --------------
	    
	      Synchronous Example
	    
	      ```javascript
	      let result;
	    
	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	    
	      Errback Example
	    
	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	    
	      Promise Example;
	    
	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	    
	      Advanced Example
	      --------------
	    
	      Synchronous Example
	    
	      ```javascript
	      let author, books;
	    
	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	    
	      Errback Example
	    
	      ```js
	    
	      function foundBooks(books) {
	    
	      }
	    
	      function failure(reason) {
	    
	      }
	    
	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	    
	      Promise Example;
	    
	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	    
	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	    then: then,
	
	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	    
	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }
	    
	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }
	    
	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```
	    
	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	    'catch': function _catch(onRejection) {
	      return this.then(null, onRejection);
	    }
	  };
	
	  function polyfill() {
	    var local = undefined;
	
	    if (typeof global !== 'undefined') {
	      local = global;
	    } else if (typeof self !== 'undefined') {
	      local = self;
	    } else {
	      try {
	        local = Function('return this')();
	      } catch (e) {
	        throw new Error('polyfill failed because global object is unavailable in this environment');
	      }
	    }
	
	    var P = local.Promise;
	
	    if (P) {
	      var promiseToString = null;
	      try {
	        promiseToString = Object.prototype.toString.call(P.resolve());
	      } catch (e) {
	        // silently ignored
	      }
	
	      if (promiseToString === '[object Promise]' && !P.cast) {
	        return;
	      }
	    }
	
	    local.Promise = Promise;
	  }
	
	  // Strange compat..
	  Promise.polyfill = polyfill;
	  Promise.Promise = Promise;
	
	  return Promise;
	});
	//# sourceMappingURL=es6-promise.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33), (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = inlineHeaders;
	
	var encode = __webpack_require__(43);
	
	function inlineHeaders(url, headers) {
	  if (/\?/.test(url)) {
	    url += '&';
	  } else {
	    url += '?';
	  }
	
	  return url + encode(headers);
	}

/***/ },
/* 43 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var stringifyPrimitive = function stringifyPrimitive(v) {
	  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function (obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
	    return map(objectKeys(obj), function (k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (isArray(obj[k])) {
	        return map(obj[k], function (v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
	};
	
	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};
	
	function map(xs, f) {
	  if (xs.map) return xs.map(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}
	
	var objectKeys = Object.keys || function (obj) {
	  var res = [];
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
	  }
	  return res;
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = jsonpRequest;
	
	var errors = __webpack_require__(18);
	
	var JSONPCounter = 0;
	
	function jsonpRequest(url, opts, cb) {
	  if (opts.method !== 'GET') {
	    cb(new Error('Method ' + opts.method + ' ' + url + ' is not supported by JSONP.'));
	    return;
	  }
	
	  opts.debug('JSONP: start');
	
	  var cbCalled = false;
	  var timedOut = false;
	
	  JSONPCounter += 1;
	  var head = document.getElementsByTagName('head')[0];
	  var script = document.createElement('script');
	  var cbName = 'algoliaJSONP_' + JSONPCounter;
	  var done = false;
	
	  window[cbName] = function (data) {
	    removeGlobals();
	
	    if (timedOut) {
	      opts.debug('JSONP: Late answer, ignoring');
	      return;
	    }
	
	    cbCalled = true;
	
	    clean();
	
	    cb(null, {
	      body: data /* ,
	                 // We do not send the statusCode, there's no statusCode in JSONP, it will be
	                 // computed using data.status && data.message like with XDR
	                 statusCode*/
	    });
	  };
	
	  // add callback by hand
	  url += '&callback=' + cbName;
	
	  // add body params manually
	  if (opts.jsonBody && opts.jsonBody.params) {
	    url += '&' + opts.jsonBody.params;
	  }
	
	  var ontimeout = setTimeout(timeout, opts.timeouts.complete);
	
	  // script onreadystatechange needed only for
	  // <= IE8
	  // https://github.com/angular/angular.js/issues/4523
	  script.onreadystatechange = readystatechange;
	  script.onload = success;
	  script.onerror = error;
	
	  script.async = true;
	  script.defer = true;
	  script.src = url;
	  head.appendChild(script);
	
	  function success() {
	    opts.debug('JSONP: success');
	
	    if (done || timedOut) {
	      return;
	    }
	
	    done = true;
	
	    // script loaded but did not call the fn => script loading error
	    if (!cbCalled) {
	      opts.debug('JSONP: Fail. Script loaded but did not call the callback');
	      clean();
	      cb(new errors.JSONPScriptFail());
	    }
	  }
	
	  function readystatechange() {
	    if (this.readyState === 'loaded' || this.readyState === 'complete') {
	      success();
	    }
	  }
	
	  function clean() {
	    clearTimeout(ontimeout);
	    script.onload = null;
	    script.onreadystatechange = null;
	    script.onerror = null;
	    head.removeChild(script);
	  }
	
	  function removeGlobals() {
	    try {
	      delete window[cbName];
	      delete window[cbName + '_loaded'];
	    } catch (e) {
	      window[cbName] = window[cbName + '_loaded'] = undefined;
	    }
	  }
	
	  function timeout() {
	    opts.debug('JSONP: Script timeout');
	    timedOut = true;
	    clean();
	    cb(new errors.RequestTimeout());
	  }
	
	  function error() {
	    opts.debug('JSONP: Script error');
	
	    if (done || timedOut) {
	      return;
	    }
	
	    clean();
	    cb(new errors.JSONPScriptError());
	  }
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	module.exports = createPlacesClient;
	
	var buildSearchMethod = __webpack_require__(17);
	
	function createPlacesClient(algoliasearch) {
	  return function places(appID, apiKey, opts) {
	    var cloneDeep = __webpack_require__(23);
	
	    opts = opts && cloneDeep(opts) || {};
	    opts.hosts = opts.hosts || ['places-dsn.algolia.net', 'places-1.algolianet.com', 'places-2.algolianet.com', 'places-3.algolianet.com'];
	
	    // allow initPlaces() no arguments => community rate limited
	    if (arguments.length === 0 || (typeof appID === 'undefined' ? 'undefined' : _typeof(appID)) === 'object' || appID === undefined) {
	      appID = '';
	      apiKey = '';
	      opts._allowEmptyCredentials = true;
	    }
	
	    var client = algoliasearch(appID, apiKey, opts);
	    var index = client.initIndex('places');
	    index.search = buildSearchMethod('query', '/1/places/query');
	    return index;
	  };
	}

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = getDocumentProtocol;
	
	function getDocumentProtocol() {
	  var protocol = window.document.location.protocol;
	
	  // when in `file:` mode (local html file), default to `http:`
	  if (protocol !== 'http:' && protocol !== 'https:') {
	    protocol = 'http:';
	  }
	
	  return protocol;
	}

/***/ },
/* 47 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = '3.20.2';

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmM5MWZjNzRjOGQ2NzAyYzYxZTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2VudHJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL3RvZ2dsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvcmUvbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzIF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcG9wdWxhci1ib29rcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXQtc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9hamF4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL2FqYXgtbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXRUcGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90ZXN0LW5vLWxvYWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9icm93c2VyL2J1aWxkcy9hbGdvbGlhc2VhcmNoLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvQWxnb2xpYVNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL0luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleENvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9idWlsZFNlYXJjaE1ldGhvZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9mb3JlYWNoL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvZGVwcmVjYXRlLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvZGVwcmVjYXRlZE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Nsb25lLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvb21pdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9vYmplY3Qta2V5cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9vYmplY3Qta2V5cy9pc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvbWFwLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvZXhpdFByb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleEJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL34vZXZlbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL0FsZ29saWFTZWFyY2hDb3JlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL3N0b3JlLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2RlYnVnL3NyYy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2RlYnVnL3NyYy9kZWJ1Zy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9kZWJ1Zy9+L21zL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9jcmVhdGVBbGdvbGlhc2VhcmNoLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2dsb2JhbC93aW5kb3cuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL34vZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vdmVydHggKGlnbm9yZWQpIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9pbmxpbmUtaGVhZGVycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9qc29ucC1yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvcGxhY2VzLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9nZXQtZG9jdW1lbnQtcHJvdG9jb2wuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy92ZXJzaW9uLmpzIl0sIm5hbWVzIjpbImluaXQiLCJjbGllbnQiLCJET01SZXN1bHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpdGVtUGVyUGFnZSIsImN1cnJlbnRVSVBhZ2UiLCJnZXRTdGFycyIsInIiLCJyZXBlYXQiLCJNYXRoIiwiYWJzIiwibWFrZVN0YXJzIiwic2NvcmUiLCJzdGFycyIsInN0YXJlZCIsImNvbmNhdFJlc3VsdCIsInJlcyIsImFsbFJlcyIsImNvbmNhdCIsInNob3dMaXN0UmVzdWx0IiwiaHRtbCIsImFkZEh0bWwiLCJpbm5lckhUTUwiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJzZXRGaWx0ZXJIVE1MIiwibmFtZSIsImZpbHRlcnMiLCJhRmlsdGVycyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiaXRlbSIsIm9wdGlvbnMiLCJjb3VudCIsImxlbmd0aCIsInR5cGUiLCIkIiwic2VhcmNoRW5kIiwiYWxsRm9vZFR5cGUiLCJhbGxTdGFyc0NvdW50IiwiYWxsUGF5bWVudCIsImkiLCJpZCIsIm9iamVjdElEIiwiZm9vZFR5cGUiLCJmb29kX3R5cGUiLCJzdGFyc0NvdW50IiwiZmxvb3IiLCJzdGFyc19jb3VudCIsInBheW1lbnQiLCJwYXltZW50X29wdGlvbnMiLCJwdXNoIiwiaVBheW1lbnQiLCJtZWRpYSIsImltYWdlX3VybCIsInJlc2VydmV1cmwiLCJyZXNlcnZlX3VybCIsInJldmlldyIsInJldmlld3NfY291bnQiLCJmb29kdHlwZSIsInBsYWNlIiwiYXJlYSIsInByaWNlcmFuZ2UiLCJwcmljZV9yYW5nZSIsInNlYXJjaFN0YXJ0IiwicXVlcnkiLCJzZWFyY2hEb25lIiwiZXJyIiwiY29udGVudCIsInJlc3VsdCIsInJlc3VsdHMiLCJoaXRzIiwibmJQYWdlcyIsInBhZ2UiLCJzZWFyY2giLCJpbmRleE5hbWUiLCJwYXJhbXMiLCJUSU1FT1VUc2VhcmNoIiwib24iLCJlIiwidmFsdWUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwianNUb2dnbGVyIiwiX2Nzc1NlbGVjdG9yIiwiX2FjdGl2ZUNsYXNzIiwiX2N1cnJlbnRUcmlnZ2VyQ2xhc3MiLCJfY3NzU2VsZWN0b3JDb250ZW50Iiwic2VsZWN0b3IiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCIkYWxsTGlua3NUb2dnbGVyIiwiJGxpbmtUb2dnbGVyIiwiYWN0aW9uIiwidG9nZ2xlIiwidGVzdCIsIm9wZW5pbmciLCJkYXRhIiwiY2xvc2luZyIsImNsb3NlQWxsIiwiJGFsbENvbnRlbnRzIiwiZ3JvdXAiLCJ0b2dnbGVyX2lkIiwiJGNvbnRlbnQiLCJmaWx0ZXIiLCIkY29udGVudEdyb3VwIiwiaXNBY3RpdmUiLCJoYXNDbGFzcyIsIiRsaW5rc1RvZ2dsZXJHcm91cCIsInJlbW92ZUNsYXNzIiwidHJpZ2dlciIsImFkZENsYXNzIiwidGFnTmFtZSIsInByZXZlbnREZWZhdWx0IiwiY3NzU2VsZWN0b3IiLCJjc3NTZWxlY3RvckNvbnRlbnQiLCJhY3RpdmVDbGFzcyIsImV2ZW50cyIsImN1cnJlbnRUcmlnZ2VyQ2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwid2VibW9kdWxlIiwiU0VMRUNUT1JfSU5JVElBTElaRUQiLCJyZWdJc0luaXQiLCJSZWdFeHAiLCJfY3JlYXRlIiwibW9kdWxlTmFtZSIsIkRPTU1vZHVsZSIsInJlYWR5IiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZSIsIm5vZGVOYW1lIiwiZGF0YU5hbWUiLCJzcGxpdCIsIm5vZGVWYWx1ZSIsImNyZWF0ZSIsInBhcnNlTW9kdWxlcyIsIm1vZHVsZXMiLCJsb2FkRmxhZyIsIm1vZHVsZVJlYWR5IiwibW9kdWxlc0xvYWQiLCJjbGFzc05hbWUiLCJfbW9kdWxlTmFtZVNwbGl0IiwiZ2V0QXR0cmlidXRlIiwiX21vZHVsZU5hbWUiLCJpbXBvcnRNb2R1bGUiLCJkZWZhdWx0IiwiZWxlbSIsImNvbnNvbGUiLCJlcnJvciIsImV4ZWMiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicXVlcnlTZWxlY3RvckFsbCIsImZsYWciLCJkb0xvYWQiLCJvIiwibG9hZCIsInBhcnNlIiwiZ2V0U2VydmljZSIsInJlcXVpcmUiLCJnZXRUcGwiLCJwb3B1bGFyQm9vayIsImNhbGwiLCJkb25lIiwiaW5mbyIsInJlY29yZHMiLCJmaWVsZHMiLCJjb2xsZWN0aW9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJhamF4IiwidXNlU2VydmljZSIsImVuZHBvaW50IiwiZW5kUG9pbnQiLCJhc3NpZ24iLCJBUElfc2VydmljZSIsImxvYWRlciIsInVybCIsIm1ldGhvZCIsImNvbnRlbnRUeXBlIiwidW5kZWZpbmVkIiwicHJvY2Vzc0RhdGEiLCJFcnJvciIsImFqYXhsb2FkZXIiLCJvbkFsd2F5cyIsIm9uRmFpbCIsImpxWEhSIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwic2hvdyIsImFsd2F5cyIsImhpZGUiLCJmYWlsIiwiYWpheGxvYWQiLCJfdHBsIiwiJGFqYXhsb2FkZXIiLCJfY3NzQ2xhc3MiLCJzdGF0dXMiLCJfaXNSZWFkeSIsInRwbCIsIiR0YXJnZXQiLCJjc3NDbGFzcyIsImJvZHkiLCJjYWNoZSIsImdldENhY2hlIiwidGVtcGxhdGVJZCIsInNldENhY2hlIiwiZ2V0dHBsIiwiZGVidWciLCJ0ZW1wbGF0ZUhUTUwiLCJyZXBsYWNlIiwibW9kdWxlVGVzdCIsIkFsZ29saWFTZWFyY2giLCJjcmVhdGVBbGdvbGlhc2VhcmNoIiwiSW5kZXgiLCJkZXByZWNhdGUiLCJkZXByZWNhdGVkTWVzc2FnZSIsIkFsZ29saWFTZWFyY2hDb3JlIiwiaW5oZXJpdHMiLCJlcnJvcnMiLCJhcHBseSIsImFyZ3VtZW50cyIsInByb3RvdHlwZSIsImRlbGV0ZUluZGV4IiwiY2FsbGJhY2siLCJfanNvblJlcXVlc3QiLCJlbmNvZGVVUklDb21wb25lbnQiLCJob3N0VHlwZSIsIm1vdmVJbmRleCIsInNyY0luZGV4TmFtZSIsImRzdEluZGV4TmFtZSIsInBvc3RPYmoiLCJvcGVyYXRpb24iLCJkZXN0aW5hdGlvbiIsImNvcHlJbmRleCIsImdldExvZ3MiLCJvZmZzZXQiLCJjbG9uZSIsIl9nZXRTZWFyY2hQYXJhbXMiLCJsaXN0SW5kZXhlcyIsImluaXRJbmRleCIsImxpc3RVc2VyS2V5cyIsImdldFVzZXJLZXlBQ0wiLCJrZXkiLCJkZWxldGVVc2VyS2V5IiwiYWRkVXNlcktleSIsImFjbHMiLCJpc0FycmF5IiwidXNhZ2UiLCJhY2wiLCJ2YWxpZGl0eSIsIm1heFF1ZXJpZXNQZXJJUFBlckhvdXIiLCJtYXhIaXRzUGVyUXVlcnkiLCJpbmRleGVzIiwiZGVzY3JpcHRpb24iLCJxdWVyeVBhcmFtZXRlcnMiLCJyZWZlcmVycyIsImFkZFVzZXJLZXlXaXRoVmFsaWRpdHkiLCJ1cGRhdGVVc2VyS2V5IiwicHV0T2JqIiwic3RhcnRRdWVyaWVzQmF0Y2giLCJzdGFydFF1ZXJpZXNCYXRjaERlcHJlY2F0ZWQiLCJfYmF0Y2giLCJhZGRRdWVyeUluQmF0Y2giLCJhZGRRdWVyeUluQmF0Y2hEZXByZWNhdGVkIiwiYXJncyIsInNlbmRRdWVyaWVzQmF0Y2giLCJzZW5kUXVlcmllc0JhdGNoRGVwcmVjYXRlZCIsImJhdGNoIiwib3BlcmF0aW9ucyIsInJlcXVlc3RzIiwiZGVzdHJveSIsIm5vdEltcGxlbWVudGVkIiwiZW5hYmxlUmF0ZUxpbWl0Rm9yd2FyZCIsImRpc2FibGVSYXRlTGltaXRGb3J3YXJkIiwidXNlU2VjdXJlZEFQSUtleSIsImRpc2FibGVTZWN1cmVkQVBJS2V5IiwiZ2VuZXJhdGVTZWN1cmVkQXBpS2V5IiwibWVzc2FnZSIsIkFsZ29saWFTZWFyY2hFcnJvciIsIkluZGV4Q29yZSIsImV4aXRQcm9taXNlIiwiYWRkT2JqZWN0IiwiaW5kZXhPYmoiLCJhcyIsImFkZE9iamVjdHMiLCJvYmplY3RzIiwicmVxdWVzdCIsInBhcnRpYWxVcGRhdGVPYmplY3QiLCJwYXJ0aWFsT2JqZWN0IiwiY3JlYXRlSWZOb3RFeGlzdHMiLCJwYXJ0aWFsVXBkYXRlT2JqZWN0cyIsInNhdmVPYmplY3QiLCJvYmplY3QiLCJzYXZlT2JqZWN0cyIsImRlbGV0ZU9iamVjdCIsIl9wcm9taXNlIiwicmVqZWN0IiwiZGVsZXRlT2JqZWN0cyIsIm9iamVjdElEcyIsIm1hcCIsInByZXBhcmVSZXF1ZXN0IiwiZGVsZXRlQnlRdWVyeSIsImF0dHJpYnV0ZXNUb1JldHJpZXZlIiwiaGl0c1BlclBhZ2UiLCJkaXN0aW5jdCIsImNsZWFyQ2FjaGUiLCJwcm9taXNlIiwidGhlbiIsInN0b3BPckRlbGV0ZSIsInNlYXJjaENvbnRlbnQiLCJuYkhpdHMiLCJnZXRPYmplY3RJRCIsIndhaXRUYXNrIiwiZG9EZWxldGVCeVF1ZXJ5IiwiZGVsZXRlT2JqZWN0c0NvbnRlbnQiLCJ0YXNrSUQiLCJzdWNjZXNzIiwiZmFpbHVyZSIsImV4aXQiLCJfc2V0VGltZW91dCIsImJyb3dzZUFsbCIsIm1lcmdlIiwiSW5kZXhCcm93c2VyIiwiYnJvd3NlciIsImluZGV4IiwiYnJvd3NlTG9vcCIsImN1cnNvciIsIl9zdG9wcGVkIiwicXVlcnlTdHJpbmciLCJicm93c2VDYWxsYmFjayIsIl9lcnJvciIsIl9yZXN1bHQiLCJfZW5kIiwidHRBZGFwdGVyIiwic2VsZiIsInN5bmNDYiIsImFzeW5jQ2IiLCJjYiIsImJhc2VEZWxheSIsIm1heERlbGF5IiwibG9vcCIsInJldHJ5TG9vcCIsImRlbGF5Iiwic3VjY2Vzc0NiIiwiZmFpbHVyZUNiIiwiY2xlYXJJbmRleCIsImdldFNldHRpbmdzIiwic2VhcmNoU3lub255bXMiLCJzYXZlU3lub255bSIsInN5bm9ueW0iLCJvcHRzIiwiZm9yd2FyZFRvU2xhdmVzIiwiZ2V0U3lub255bSIsImRlbGV0ZVN5bm9ueW0iLCJjbGVhclN5bm9ueW1zIiwiYmF0Y2hTeW5vbnltcyIsInN5bm9ueW1zIiwicmVwbGFjZUV4aXN0aW5nU3lub255bXMiLCJzZXRTZXR0aW5ncyIsInNldHRpbmdzIiwiZGVwcmVjYXRlZEFkZFVzZXJLZXlXaXRoVmFsaWRpdHkiLCJjdG9yIiwic3VwZXJDdG9yIiwic3VwZXJfIiwiY29uc3RydWN0b3IiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJUZW1wQ3RvciIsImJ1aWxkU2VhcmNoTWV0aG9kIiwiYWxnb2xpYXNlYXJjaCIsInR5cGVBaGVhZEFyZ3MiLCJ0eXBlQWhlYWRWYWx1ZU9wdGlvbiIsInNpbWlsYXJTZWFyY2giLCJicm93c2UiLCJicm93c2VGcm9tIiwic2VhcmNoRm9yRmFjZXRWYWx1ZXMiLCJvbWl0IiwiZmFjZXROYW1lIiwiZmFjZXRRdWVyeSIsImZpbHRlcmVkUGFyYW1zIiwia2V5TmFtZSIsInNlYXJjaFBhcmFtZXRlcnMiLCJzZWFyY2hGYWNldCIsIl9zZWFyY2giLCJmYWxsYmFjayIsImdldE9iamVjdCIsImF0dHJzIiwiZ2V0T2JqZWN0cyIsImpvaW4iLCJxdWVyeVBhcmFtIiwiZXh0cmFQcm9wZXJ0aWVzIiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJzdGFjayIsImFkZFRvRXJyb3JPYmplY3QiLCJjcmVhdGVDdXN0b21FcnJvciIsIkFsZ29saWFTZWFyY2hDdXN0b21FcnJvciIsIkFycmF5Iiwic2xpY2UiLCJ1bnNoaWZ0IiwiVW5wYXJzYWJsZUpTT04iLCJSZXF1ZXN0VGltZW91dCIsIk5ldHdvcmsiLCJKU09OUFNjcmlwdEZhaWwiLCJKU09OUFNjcmlwdEVycm9yIiwiVW5rbm93biIsImhhc093biIsImhhc093blByb3BlcnR5IiwidG9TdHJpbmciLCJvYmoiLCJmbiIsImN0eCIsIlR5cGVFcnJvciIsImwiLCJrIiwid2FybmVkIiwiZGVwcmVjYXRlZCIsImxvZyIsInByZXZpb3VzVXNhZ2UiLCJuZXdVc2FnZSIsImdpdGh1YkFuY2hvckxpbmsiLCJ0b0xvd2VyQ2FzZSIsImZvcmVhY2giLCJzb3VyY2VzIiwic291cmNlIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbHRlcmVkIiwiZG9GaWx0ZXIiLCJoYXMiLCJ0b1N0ciIsImlzQXJncyIsImlzRW51bWVyYWJsZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwiaGFzRG9udEVudW1CdWciLCJoYXNQcm90b0VudW1CdWciLCJkb250RW51bXMiLCJlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSIsImV4Y2x1ZGVkS2V5cyIsIiRjb25zb2xlIiwiJGV4dGVybmFsIiwiJGZyYW1lIiwiJGZyYW1lRWxlbWVudCIsIiRmcmFtZXMiLCIkaW5uZXJIZWlnaHQiLCIkaW5uZXJXaWR0aCIsIiRvdXRlckhlaWdodCIsIiRvdXRlcldpZHRoIiwiJHBhZ2VYT2Zmc2V0IiwiJHBhZ2VZT2Zmc2V0IiwiJHBhcmVudCIsIiRzY3JvbGxMZWZ0IiwiJHNjcm9sbFRvcCIsIiRzY3JvbGxYIiwiJHNjcm9sbFkiLCIkc2VsZiIsIiR3ZWJraXRJbmRleGVkREIiLCIkd2Via2l0U3RvcmFnZUluZm8iLCIkd2luZG93IiwiaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnIiwiZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5Iiwia2V5c1NoaW0iLCJpc09iamVjdCIsImlzRnVuY3Rpb24iLCJpc0FyZ3VtZW50cyIsImlzU3RyaW5nIiwidGhlS2V5cyIsInNraXBQcm90byIsIlN0cmluZyIsImoiLCJza2lwQ29uc3RydWN0b3IiLCJzaGltIiwic2hpbU9iamVjdEtleXMiLCJrZXlzV29ya3NXaXRoQXJndW1lbnRzIiwib3JpZ2luYWxLZXlzIiwic3RyIiwiY2FsbGVlIiwiYXJyIiwibmV3QXJyIiwiaXRlbUluZGV4IiwiRXZlbnRFbWl0dGVyIiwic3RvcCIsIl9jbGVhbiIsImVtaXQiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJfZXZlbnRzIiwiX21heExpc3RlbmVycyIsImRlZmF1bHRNYXhMaXN0ZW5lcnMiLCJzZXRNYXhMaXN0ZW5lcnMiLCJuIiwiaXNOdW1iZXIiLCJpc05hTiIsImVyIiwiaGFuZGxlciIsImxlbiIsImxpc3RlbmVycyIsImNvbnRleHQiLCJpc1VuZGVmaW5lZCIsImFkZExpc3RlbmVyIiwibGlzdGVuZXIiLCJtIiwibmV3TGlzdGVuZXIiLCJ0cmFjZSIsIm9uY2UiLCJmaXJlZCIsImciLCJyZW1vdmVMaXN0ZW5lciIsImxpc3QiLCJwb3NpdGlvbiIsInNwbGljZSIsInJldCIsImxpc3RlbmVyQ291bnQiLCJldmxpc3RlbmVyIiwiZW1pdHRlciIsImFyZyIsInN0b3JlIiwiTUFYX0FQSV9LRVlfTEVOR1RIIiwiUkVTRVRfQVBQX0RBVEFfVElNRVIiLCJwcm9jZXNzIiwiZW52IiwicGFyc2VJbnQiLCJhcHBsaWNhdGlvbklEIiwiYXBpS2V5IiwiX2FsbG93RW1wdHlDcmVkZW50aWFscyIsImhvc3RzIiwicmVhZCIsIndyaXRlIiwicHJvdG9jb2wiLCJfdGltZW91dHMiLCJ0aW1lb3V0cyIsImNvbm5lY3QiLCJ0aW1lb3V0IiwiX2NoZWNrQXBwSWREYXRhIiwiZGVmYXVsdEhvc3RzIiwiX3NodWZmbGVSZXN1bHQiLCJob3N0TnVtYmVyIiwicHJlcGFyZUhvc3QiLCJleHRyYUhlYWRlcnMiLCJfY2FjaGUiLCJfdWEiLCJfdXNlQ2FjaGUiLCJfdXNlRmFsbGJhY2siLCJ1c2VGYWxsYmFjayIsInNldEV4dHJhSGVhZGVyIiwiYWRkQWxnb2xpYUFnZW50IiwiYWxnb2xpYUFnZW50IiwiaW5pdGlhbE9wdHMiLCJyZXF1ZXN0RGVidWciLCJ0cmllcyIsInVzaW5nRmFsbGJhY2siLCJoYXNGYWxsYmFjayIsIl9yZXF1ZXN0IiwiaGVhZGVycyIsIl9jb21wdXRlUmVxdWVzdEhlYWRlcnMiLCJzYWZlSlNPTlN0cmluZ2lmeSIsImRlYnVnRGF0YSIsImRvUmVxdWVzdCIsInJlcXVlc3RlciIsInJlcU9wdHMiLCJzdGFydFRpbWUiLCJEYXRlIiwiY2FjaGVJRCIsInJlc29sdmUiLCJqc29uQm9keSIsIl9nZXRUaW1lb3V0c0ZvclJlcXVlc3QiLCJfc2V0SG9zdEluZGV4QnlUeXBlIiwiY3VycmVudEhvc3QiLCJfZ2V0SG9zdEJ5VHlwZSIsInRyeUZhbGxiYWNrIiwiaHR0cFJlc3BvbnNlIiwic3RhdHVzQ29kZSIsImh0dHBSZXNwb25zZU9rIiwiZW5kVGltZSIsInJlbW92ZUNyZWRlbnRpYWxzIiwiY29udGVudExlbmd0aCIsImR1cmF0aW9uIiwicmVzcG9uc2VUZXh0Iiwic2hvdWxkUmV0cnkiLCJyZXRyeVJlcXVlc3QiLCJ1bnJlY292ZXJhYmxlRXJyb3IiLCJyZXRyeVJlcXVlc3RXaXRoSGlnaGVyVGltZW91dCIsIl9pbmNyZW1lbnRIb3N0SW5kZXgiLCJfaW5jcmVtZW50VGltZW91dE11bHRpcGxlciIsIm9rQ2IiLCJub29rQ2IiLCJ3aXRoQVBJS2V5IiwicmVxdWVzdEhlYWRlcnMiLCJ1c2VyVG9rZW4iLCJzZWN1cml0eVRhZ3MiLCJhZGRUb1JlcXVlc3RIZWFkZXJzIiwiaGVhZGVyIiwicXVlcmllcyIsIkpTT05QUGFyYW1zIiwicHJlcGFyZUpTT05QUGFyYW1zIiwicmVxdWVzdElkIiwic3RyYXRlZ3kiLCJzZXRTZWN1cml0eVRhZ3MiLCJ0YWdzIiwic3RyVGFncyIsIm9yZWRUYWdzIiwic2V0VXNlclRva2VuIiwic2V0UmVxdWVzdFRpbWVvdXQiLCJtaWxsaXNlY29uZHMiLCJzZXRUaW1lb3V0cyIsImdldFRpbWVvdXRzIiwiX2dldEFwcElkRGF0YSIsImdldCIsIl9jYWNoZUFwcElkRGF0YSIsIl9zZXRBcHBJZERhdGEiLCJsYXN0Q2hhbmdlIiwiZ2V0VGltZSIsInNldCIsIm5vdyIsIl9yZXNldEluaXRpYWxBcHBJZERhdGEiLCJuZXdEYXRhIiwiaG9zdEluZGV4ZXMiLCJ0aW1lb3V0TXVsdGlwbGllciIsInNodWZmbGVSZXN1bHQiLCJzaHVmZmxlIiwiX2hvc3RJbmRleGVzIiwiX3RpbWVvdXRNdWx0aXBsaWVyIiwiX3BhcnRpYWxBcHBJZERhdGFVcGRhdGUiLCJjdXJyZW50RGF0YSIsIl9nZXRIb3N0SW5kZXhCeVR5cGUiLCJfZ2V0VGltZW91dE11bHRpcGxpZXIiLCJob3N0SW5kZXgiLCJuZXdIb3N0SW5kZXhlcyIsIm1heCIsImNvbXBsZXRlIiwicHJlcGFyZSIsImhvc3QiLCJ0b0pTT04iLCJvdXQiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJyYW5kb20iLCJuZXdIZWFkZXJzIiwiaGVhZGVyTmFtZSIsImNhY2hlZFNldFRpbWVvdXQiLCJjYWNoZWRDbGVhclRpbWVvdXQiLCJkZWZhdWx0U2V0VGltb3V0IiwiZGVmYXVsdENsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJxdWV1ZSIsImRyYWluaW5nIiwiY3VycmVudFF1ZXVlIiwicXVldWVJbmRleCIsImNsZWFuVXBOZXh0VGljayIsImRyYWluUXVldWUiLCJydW4iLCJuZXh0VGljayIsIkl0ZW0iLCJ0aXRsZSIsImFyZ3YiLCJ2ZXJzaW9uIiwidmVyc2lvbnMiLCJub29wIiwib2ZmIiwiYmluZGluZyIsImN3ZCIsImNoZGlyIiwiZGlyIiwidW1hc2siLCJsb2NhbFN0b3JhZ2VOYW1lc3BhY2UiLCJtb2R1bGVTdG9yZSIsInN0YXRlIiwibG9jYWxTdG9yYWdlU3RvcmUiLCJuYW1lc3BhY2UiLCJnbG9iYWwiLCJsb2NhbFN0b3JhZ2UiLCJjbGVhbnVwIiwic3VwcG9ydHNMb2NhbFN0b3JhZ2UiLCJnZXRPclNldCIsInNldEl0ZW0iLCJfIiwicmVtb3ZlSXRlbSIsImZvcm1hdEFyZ3MiLCJzYXZlIiwidXNlQ29sb3JzIiwic3RvcmFnZSIsImNocm9tZSIsImxvY2FsIiwibG9jYWxzdG9yYWdlIiwiY29sb3JzIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJmaXJlYnVnIiwiZXhjZXB0aW9uIiwidGFibGUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJtYXRjaCIsIiQxIiwiZm9ybWF0dGVycyIsInYiLCJodW1hbml6ZSIsImRpZmYiLCJjIiwiY29sb3IiLCJsYXN0QyIsIkZ1bmN0aW9uIiwibmFtZXNwYWNlcyIsIkRFQlVHIiwiZW5hYmxlIiwiY3JlYXRlRGVidWciLCJjb2VyY2UiLCJkaXNhYmxlIiwiZW5hYmxlZCIsIm5hbWVzIiwic2tpcHMiLCJwcmV2VGltZSIsInNlbGVjdENvbG9yIiwiaGFzaCIsImNoYXJDb2RlQXQiLCJjdXJyIiwibXMiLCJwcmV2IiwiZm9ybWF0IiwiZm9ybWF0dGVyIiwidmFsIiwibG9nRm4iLCJiaW5kIiwic3Vic3RyIiwicyIsImgiLCJkIiwieSIsImxvbmciLCJmbXRMb25nIiwiZm10U2hvcnQiLCJwYXJzZUZsb2F0Iiwicm91bmQiLCJwbHVyYWwiLCJjZWlsIiwiUHJvbWlzZSIsInVhU3VmZml4IiwiaW5saW5lSGVhZGVycyIsImpzb25wUmVxdWVzdCIsInBsYWNlcyIsIk5PREVfRU5WIiwiY2xvbmVEZWVwIiwiZ2V0RG9jdW1lbnRQcm90b2NvbCIsInVhIiwiQWxnb2xpYVNlYXJjaEJyb3dzZXIiLCJpbml0UGxhY2VzIiwiX19hbGdvbGlhIiwic3VwcG9ydCIsImhhc1hNTEh0dHBSZXF1ZXN0IiwiaGFzWERvbWFpblJlcXVlc3QiLCJjb3JzIiwiWE1MSHR0cFJlcXVlc3QiLCJ3cmFwUmVxdWVzdCIsInJlcSIsIlhEb21haW5SZXF1ZXN0IiwicmVxVGltZW91dCIsInRpbWVkT3V0IiwiY29ubmVjdGVkIiwib25UaW1lb3V0Iiwib25wcm9ncmVzcyIsIm9uUHJvZ3Jlc3MiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJvblJlYWR5U3RhdGVDaGFuZ2UiLCJvbmxvYWQiLCJvbkxvYWQiLCJvbmVycm9yIiwib25FcnJvciIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsImdldEFsbFJlc3BvbnNlSGVhZGVycyIsIm1vcmUiLCJldmVudCIsImFib3J0Iiwib25Db25uZWN0IiwicmVhZHlTdGF0ZSIsInJlcXVlc3RGYWxsYmFjayIsIndyYXBKc29ucFJlcXVlc3QiLCJqc29ucFJlcXVlc3REb25lIiwicmVqZWN0UHJvbWlzZSIsInJlc29sdmVQcm9taXNlIiwiZGVsYXlQcm9taXNlIiwicmVzb2x2ZU9uVGltZW91dCIsImZhY3RvcnkiLCJFUzZQcm9taXNlIiwib2JqZWN0T3JGdW5jdGlvbiIsIngiLCJfaXNBcnJheSIsInZlcnR4TmV4dCIsImN1c3RvbVNjaGVkdWxlckZuIiwiYXNhcCIsImZsdXNoIiwic2NoZWR1bGVGbHVzaCIsInNldFNjaGVkdWxlciIsInNjaGVkdWxlRm4iLCJzZXRBc2FwIiwiYXNhcEZuIiwiYnJvd3NlcldpbmRvdyIsImJyb3dzZXJHbG9iYWwiLCJCcm93c2VyTXV0YXRpb25PYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJXZWJLaXRNdXRhdGlvbk9ic2VydmVyIiwiaXNOb2RlIiwiaXNXb3JrZXIiLCJVaW50OENsYW1wZWRBcnJheSIsImltcG9ydFNjcmlwdHMiLCJNZXNzYWdlQ2hhbm5lbCIsInVzZU5leHRUaWNrIiwidXNlVmVydHhUaW1lciIsInVzZVNldFRpbWVvdXQiLCJ1c2VNdXRhdGlvbk9ic2VydmVyIiwiaXRlcmF0aW9ucyIsIm9ic2VydmVyIiwibm9kZSIsImNyZWF0ZVRleHROb2RlIiwib2JzZXJ2ZSIsImNoYXJhY3RlckRhdGEiLCJ1c2VNZXNzYWdlQ2hhbm5lbCIsImNoYW5uZWwiLCJwb3J0MSIsIm9ubWVzc2FnZSIsInBvcnQyIiwicG9zdE1lc3NhZ2UiLCJnbG9iYWxTZXRUaW1lb3V0IiwiYXR0ZW1wdFZlcnR4IiwidmVydHgiLCJydW5Pbkxvb3AiLCJydW5PbkNvbnRleHQiLCJvbkZ1bGZpbGxtZW50Iiwib25SZWplY3Rpb24iLCJfYXJndW1lbnRzIiwicGFyZW50IiwiY2hpbGQiLCJQUk9NSVNFX0lEIiwibWFrZVByb21pc2UiLCJfc3RhdGUiLCJpbnZva2VDYWxsYmFjayIsInN1YnNjcmliZSIsIkNvbnN0cnVjdG9yIiwiX3Jlc29sdmUiLCJzdWJzdHJpbmciLCJQRU5ESU5HIiwiRlVMRklMTEVEIiwiUkVKRUNURUQiLCJHRVRfVEhFTl9FUlJPUiIsIkVycm9yT2JqZWN0Iiwic2VsZkZ1bGZpbGxtZW50IiwiY2Fubm90UmV0dXJuT3duIiwiZ2V0VGhlbiIsInRyeVRoZW4iLCJmdWxmaWxsbWVudEhhbmRsZXIiLCJyZWplY3Rpb25IYW5kbGVyIiwiaGFuZGxlRm9yZWlnblRoZW5hYmxlIiwidGhlbmFibGUiLCJzZWFsZWQiLCJmdWxmaWxsIiwicmVhc29uIiwiX3JlamVjdCIsIl9sYWJlbCIsImhhbmRsZU93blRoZW5hYmxlIiwiaGFuZGxlTWF5YmVUaGVuYWJsZSIsIm1heWJlVGhlbmFibGUiLCJ0aGVuJCQiLCJwdWJsaXNoUmVqZWN0aW9uIiwiX29uZXJyb3IiLCJwdWJsaXNoIiwiX3N1YnNjcmliZXJzIiwic3Vic2NyaWJlcnMiLCJzZXR0bGVkIiwiZGV0YWlsIiwiVFJZX0NBVENIX0VSUk9SIiwidHJ5Q2F0Y2giLCJoYXNDYWxsYmFjayIsInN1Y2NlZWRlZCIsImZhaWxlZCIsImluaXRpYWxpemVQcm9taXNlIiwicmVzb2x2ZXIiLCJuZXh0SWQiLCJFbnVtZXJhdG9yIiwiaW5wdXQiLCJfaW5zdGFuY2VDb25zdHJ1Y3RvciIsIl9pbnB1dCIsIl9yZW1haW5pbmciLCJfZW51bWVyYXRlIiwidmFsaWRhdGlvbkVycm9yIiwiX2VhY2hFbnRyeSIsImVudHJ5IiwicmVzb2x2ZSQkIiwiX3RoZW4iLCJfc2V0dGxlZEF0IiwiX3dpbGxTZXR0bGVBdCIsImVudW1lcmF0b3IiLCJhbGwiLCJlbnRyaWVzIiwicmFjZSIsIm5lZWRzUmVzb2x2ZXIiLCJuZWVkc05ldyIsIl9zZXRTY2hlZHVsZXIiLCJfc2V0QXNhcCIsIl9hc2FwIiwiX2NhdGNoIiwicG9seWZpbGwiLCJQIiwicHJvbWlzZVRvU3RyaW5nIiwiY2FzdCIsImVuY29kZSIsInN0cmluZ2lmeVByaW1pdGl2ZSIsImlzRmluaXRlIiwic2VwIiwiZXEiLCJvYmplY3RLZXlzIiwia3MiLCJ4cyIsImYiLCJKU09OUENvdW50ZXIiLCJjYkNhbGxlZCIsImhlYWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInNjcmlwdCIsImNyZWF0ZUVsZW1lbnQiLCJjYk5hbWUiLCJyZW1vdmVHbG9iYWxzIiwiY2xlYW4iLCJvbnRpbWVvdXQiLCJyZWFkeXN0YXRlY2hhbmdlIiwiYXN5bmMiLCJkZWZlciIsInNyYyIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJjcmVhdGVQbGFjZXNDbGllbnQiLCJhcHBJRCIsImxvY2F0aW9uIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQSxrQkFBVUEsSUFBVjs7QUFFQSxLQUFJQyxTQUFTLDZCQUFjLFlBQWQsRUFBNEIsa0NBQTVCLENBQWI7O0FBRUEsS0FBSUMsWUFBWUMsU0FBU0MsYUFBVCxDQUF1QixZQUF2QixD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O0FBQ0Q7O0FBRUQsU0FBSTNnQixTQUFTa1gsY0FBY3FqQixLQUFkLEVBQXFCN1osTUFBckIsRUFBNkI1SyxJQUE3QixDQUFiO0FBQ0EsU0FBSTFCLFFBQVFwVSxPQUFPK08sU0FBUCxDQUFpQixRQUFqQixDQUFaO0FBQ0FxRixXQUFNMVAsTUFBTixHQUFldVMsa0JBQWtCLE9BQWxCLEVBQTJCLGlCQUEzQixDQUFmO0FBQ0EsWUFBTzdDLEtBQVA7QUFDRCxJQXRCRDtBQXVCRCxFOzs7Ozs7QUM1QkQ7O0FBRUE5TSxRQUFPQyxPQUFQLEdBQWlCbW5CLG1CQUFqQjs7QUFFQSxVQUFTQSxtQkFBVCxHQUErQjtBQUM3QixPQUFJM04sV0FBV3pYLE9BQU9wSixRQUFQLENBQWdCczZCLFFBQWhCLENBQXlCelosUUFBeEM7O0FBRUE7QUFDQSxPQUFJQSxhQUFhLE9BQWIsSUFBd0JBLGFBQWEsUUFBekMsRUFBbUQ7QUFDakRBLGdCQUFXLE9BQVg7QUFDRDs7QUFFRCxVQUFPQSxRQUFQO0FBQ0QsRTs7Ozs7O0FDYkQ7O0FBRUF6WixRQUFPQyxPQUFQLEdBQWlCLFFBQWpCLEMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZjOTFmYzc0YzhkNjcwMmM2MWU5IiwiaW1wb3J0IHRvZ2dsZXIgZnJvbSAnLi9jb3JlL3RvZ2dsZXInO1xuaW1wb3J0IHdlYm1vZHVsZSBmcm9tICcuL2NvcmUvbW9kdWxlJztcbmltcG9ydCBnZXRUcGwgZnJvbSAnLi9jb3JlL2dldFRwbCc7XG5pbXBvcnQgYWxnb2xpYXNlYXJjaCBmcm9tICdhbGdvbGlhc2VhcmNoJztcblxudG9nZ2xlcigpO1xud2VibW9kdWxlLmluaXQoKTtcblxudmFyIGNsaWVudCA9IGFsZ29saWFzZWFyY2goJ1REVjRJNzdGMkYnLCAnYzU3MzFiMmFhNGNiMzE2YzBmNTU5OTAxNDVmMDEyNmQnKTtcblxudmFyIERPTVJlc3VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yZXN1bHQnKTtcblxuY29uc3QgaXRlbVBlclBhZ2UgPSAzO1xubGV0IGN1cnJlbnRVSVBhZ2UgPSAwO1xudmFyIGdldFN0YXJzID0gZnVuY3Rpb24gKHIpIHtcbiAgICByZXR1cm4gJ+KYhScucmVwZWF0KE1hdGguYWJzKHIpKVxufTtcbnZhciBtYWtlU3RhcnMgPSBmdW5jdGlvbiAoc2NvcmUpIHtcbiAgICByZXR1cm4gZ2V0VHBsKHtzdGFyczogZ2V0U3RhcnMoc2NvcmUpLCBzdGFyZWQ6IGdldFN0YXJzKHNjb3JlIC0gNSl9LCAndHBsX3N0YXJzJylcbn07XG5cbnZhciBjb25jYXRSZXN1bHQgPSBmdW5jdGlvbiAocmVzLCBhbGxSZXMpIHtcbiAgICByZXR1cm4gYWxsUmVzLmNvbmNhdChyZXMpO1xufTtcbnZhciBzaG93TGlzdFJlc3VsdCA9IGZ1bmN0aW9uIChodG1sLCBhZGRIdG1sID0gdHJ1ZSkge1xuICAgIGlmIChhZGRIdG1sKSB7XG4gICAgICAgIERPTVJlc3VsdC5pbm5lckhUTUwgPSBodG1sO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgRE9NUmVzdWx0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgaHRtbCk7XG4gICAgfVxufTtcbnZhciBzZXRGaWx0ZXJIVE1MID0gZnVuY3Rpb24gKG5hbWUsIGZpbHRlcnMpIHtcbiAgICBsZXQgaHRtbCA9ICcnO1xuICAgIGxldCBhRmlsdGVycyA9IE9iamVjdC5rZXlzKGZpbHRlcnMpO1xuICAgIGFGaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7Y291bnQ6IGZpbHRlcnNbaXRlbV0ubGVuZ3RoLCB0eXBlOiBpdGVtfTtcbiAgICAgICAgaWYgKCdzdGFycycgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIG9wdGlvbnNbJ2NvbnRlbnQnXSA9IG1ha2VTdGFycyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBodG1sICs9IGdldFRwbChvcHRpb25zLCAndHBsX2ZpbHRlcl8nICsgbmFtZSk7XG4gICAgfSk7XG4gICAgJChgLmpzLWZpbHRlcltkYXRhLW5hbWU9XCIke25hbWV9XCJdYCkuaHRtbChodG1sKTtcbn07XG52YXIgc2VhcmNoRW5kID0gZnVuY3Rpb24gKGFsbFJlcykge1xuICAgIGxldCBodG1sID0gJyc7XG4gICAgbGV0IGFsbEZvb2RUeXBlID0ge307XG4gICAgbGV0IGFsbFN0YXJzQ291bnQgPSB7fTtcbiAgICBsZXQgYWxsUGF5bWVudCA9IHt9O1xuICAgIGN1cnJlbnRVSVBhZ2UgPSAwOyAvL2Fsd2F5cyByZXNldFxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxSZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBhbGxSZXNbaV07XG4gICAgICAgIGxldCBpZCA9IGl0ZW0ub2JqZWN0SUQ7XG4gICAgICAgIGxldCBmb29kVHlwZSA9IGl0ZW0uZm9vZF90eXBlO1xuICAgICAgICBsZXQgc3RhcnNDb3VudCA9IE1hdGguZmxvb3IoaXRlbS5zdGFyc19jb3VudCk7XG4gICAgICAgIGxldCBwYXltZW50ID0gaXRlbS5wYXltZW50X29wdGlvbnM7XG4gICAgICAgIChhbGxGb29kVHlwZVtmb29kVHlwZV0gPSBhbGxGb29kVHlwZVtmb29kVHlwZV0gPyBhbGxGb29kVHlwZVtmb29kVHlwZV0gOiBbXSkucHVzaChpZCk7XG4gICAgICAgIChhbGxTdGFyc0NvdW50W3N0YXJzQ291bnRdID0gYWxsU3RhcnNDb3VudFtzdGFyc0NvdW50XSA/IGFsbFN0YXJzQ291bnRbc3RhcnNDb3VudF0gOiBbXSkucHVzaChpZCk7XG4gICAgICAgIGZvciAobGV0IGlQYXltZW50ID0gMDsgaVBheW1lbnQgPCBwYXltZW50Lmxlbmd0aDsgaVBheW1lbnQrKykge1xuICAgICAgICAgICAgKGFsbFBheW1lbnRbcGF5bWVudFtpUGF5bWVudF1dID0gYWxsUGF5bWVudFtwYXltZW50W2lQYXltZW50XV0gPyBhbGxQYXltZW50W3BheW1lbnRbaVBheW1lbnRdXSA6IFtdKS5wdXNoKGlkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA8IGl0ZW1QZXJQYWdlKSB7XG4gICAgICAgICAgICBodG1sICs9IGdldFRwbCh7XG4gICAgICAgICAgICAgICAgbWVkaWE6IGl0ZW0uaW1hZ2VfdXJsLFxuICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICByZXNlcnZldXJsOiBpdGVtLnJlc2VydmVfdXJsLFxuICAgICAgICAgICAgICAgIHNjb3JlOiBpdGVtLnN0YXJzX2NvdW50LFxuICAgICAgICAgICAgICAgIHN0YXJzOiBnZXRTdGFycyhpdGVtLnN0YXJzX2NvdW50KSxcbiAgICAgICAgICAgICAgICByZXZpZXc6IGl0ZW0ucmV2aWV3c19jb3VudCxcbiAgICAgICAgICAgICAgICBmb29kdHlwZTogaXRlbS5mb29kX3R5cGUsXG4gICAgICAgICAgICAgICAgcGxhY2U6IGl0ZW0uYXJlYSxcbiAgICAgICAgICAgICAgICBwcmljZXJhbmdlOiBpdGVtLnByaWNlX3JhbmdlXG4gICAgICAgICAgICB9LCAndHBsX3NlYXJjaCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RmlsdGVySFRNTCgnZm9vZHMnLCBhbGxGb29kVHlwZSk7XG4gICAgc2V0RmlsdGVySFRNTCgnc3RhcnMnLCBhbGxTdGFyc0NvdW50KTtcbiAgICBzZXRGaWx0ZXJIVE1MKCdwYXltZW50JywgYWxsUGF5bWVudCk7XG4gICAgc2hvd0xpc3RSZXN1bHQoaHRtbCk7XG59O1xudmFyIHNlYXJjaFN0YXJ0ID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gICAgbGV0IGFsbFJlcyA9IFtdO1xuICAgIHZhciBzZWFyY2hEb25lID0gZnVuY3Rpb24gc2VhcmNoRG9uZShlcnIsIGNvbnRlbnQpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGNvbnRlbnQucmVzdWx0c1swXTtcbiAgICAgICAgYWxsUmVzID0gY29uY2F0UmVzdWx0KHJlc3VsdC5oaXRzLCBhbGxSZXMpO1xuICAgICAgICBpZiAocmVzdWx0Lm5iUGFnZXMgPiByZXN1bHQucGFnZSArIDEpIHtcbiAgICAgICAgICAgIGNsaWVudC5zZWFyY2goW3tcbiAgICAgICAgICAgICAgICBpbmRleE5hbWU6ICdhbGwnLFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogcmVzdWx0LnBhZ2UgKyAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV0sIHNlYXJjaERvbmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoRW5kKGFsbFJlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNsaWVudC5zZWFyY2goW3tcbiAgICAgICAgaW5kZXhOYW1lOiAnYWxsJyxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgfV0sIHNlYXJjaERvbmUpO1xufTtcbmxldCBUSU1FT1VUc2VhcmNoID0gMDtcbiQoJy5qcy1zZWFyY2gnKS5vbignaW5wdXQnLCBmdW5jdGlvbiAoZSkge1xuICAgIGxldCBxdWVyeSA9IHRoaXMudmFsdWU7XG4gICAgY2xlYXJUaW1lb3V0KFRJTUVPVVRzZWFyY2gpO1xuICAgIFRJTUVPVVRzZWFyY2ggPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VhcmNoU3RhcnQocXVlcnkpO1xuICAgIH0sIDIwMCk7XG59KTtcblxuLy9tZXJnZSBqc29uc1xuLy8kLmdldEpTT04oJ3Jlc291cmNlcy9kYXRhc2V0L3Jlc3RhdXJhbnRzX2xpc3QuanNvbicpLmRvbmUoZnVuY3Rpb24gKGxpc3RSZXMpIHtcbi8vICAgICQuZ2V0SlNPTigncmVzb3VyY2VzL2RhdGFzZXQvcmVzdGF1cmFudHNfaW5mby5qc29uJykuZG9uZShmdW5jdGlvbiAoaW5mb1Jlcykge1xuLy8gICAgICAgIGxldCBhbGwgPSBsaXN0UmVzLm1hcChmdW5jdGlvbihsaXN0SXRlbSkge1xuLy8gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihpbmZvUmVzLmZpbHRlcihmdW5jdGlvbiAoaW5mb0l0ZW0pIHtcbi8vICAgICAgICAgICAgICAgIHJldHVybiBpbmZvSXRlbS5vYmplY3RJRCA9PT0gbGlzdEl0ZW0ub2JqZWN0SUQ7XG4vLyAgICAgICAgICAgIH0pWzBdLCBsaXN0SXRlbSlcbi8vICAgICAgICB9KTtcbi8vICAgICAgICBjb25zb2xlLmluZm8oSlNPTi5zdHJpbmdpZnkoYWxsKSk7XG4vLyAgICB9KVxuLy99KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9lbnRyeS5qcyIsIi8qKlxuICogQ3JlYXRlZCBieSBzdGVmYW4gY292YSAmIGFudG9pbmUgc2FuY2hleiBvbiAyNi8wMS8yMDE1LlxuICogQHZlcnNpb24gMS4xXG4gKlxuICogdHJpZ2dlcjpcbiAqIDxsaSBjbGFzcz1cImpzLXRvZ2dsZXJcIiBkYXRhLXRvZ2dsZXItZ3JvdXA9XCJncm91cFwiIGRhdGEtdG9nZ2xlci1pZD1cImlkXCI+XG4gKiBhdmFpbGFibGUgb3B0aW9uczpcbiAqIGRhdGEtdG9nZ2xlci1hY3Rpb249XCJvcGVufGNsb3NlfGNsb3NlLWFsbFwiXG4gKlxuICogcmVjZWl2ZXI6XG4gKiA8ZGl2IGNsYXNzPVwianMtaXRlbS10b2dnbGVyXCIgZGF0YS10b2dnbGVyLWdyb3VwPVwiZ3JvdXBcIiBkYXRhLXRvZ2dsZXItaXRlbWlkPVwiaWRcIj5cbiAqIGF2YWlsYWJsZSBvcHRpb25zOlxuICogZGF0YS10b2dnbGVyLWdyb3VwLW5vLWNsb3NlPVwidHJ1ZVwiXG4gKlxuICovXG52YXIganNUb2dnbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZXQgX2Nzc1NlbGVjdG9yID0gJyc7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgbGV0IF9hY3RpdmVDbGFzcyA9ICcnO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxldCBfY3VycmVudFRyaWdnZXJDbGFzcyA9ICcnO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxldCBfY3NzU2VsZWN0b3JDb250ZW50ID0gJyc7XG5cbiAgICB2YXIgc2VsZWN0b3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpOy8vdG9kbyBjaGVjayBob3cgdG8gaW1wcm92ZSB0aGlzIHF1aWNrIGZpeFxuICAgICAgICB2YXIgJGFsbExpbmtzVG9nZ2xlciA9ICQoX2Nzc1NlbGVjdG9yKTtcbiAgICAgICAgdmFyICRsaW5rVG9nZ2xlciA9ICQodGhpcyk7XG4gICAgICAgIHZhciBhY3Rpb24gPSBlLnR5cGU7XG4gICAgICAgIHZhciB0b2dnbGUgPSAvY2xpY2t8dG9nZ2xlLy50ZXN0KGFjdGlvbik7XG4gICAgICAgIHZhciBvcGVuaW5nID0gYWN0aW9uID09PSAnb3BlbicgfHwgJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItYWN0aW9uJykgPT09ICdvcGVuJztcbiAgICAgICAgdmFyIGNsb3NpbmcgPSBhY3Rpb24gPT09ICdjbG9zZScgfHwgJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItYWN0aW9uJykgPT09ICdjbG9zZSc7XG4gICAgICAgIHZhciBjbG9zZUFsbCA9IGFjdGlvbiA9PT0gJ2Nsb3NlLWFsbCcgfHwgJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItYWN0aW9uJykgPT09ICdjbG9zZS1hbGwnO1xuXG4gICAgICAgIHZhciAkYWxsQ29udGVudHMgPSAkKF9jc3NTZWxlY3RvckNvbnRlbnQpO1xuICAgICAgICB2YXIgZ3JvdXAgPSAkbGlua1RvZ2dsZXIuZGF0YSgndG9nZ2xlci1ncm91cCcpO1xuICAgICAgICB2YXIgdG9nZ2xlcl9pZCA9ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWlkJyk7XG4gICAgICAgIHZhciAkY29udGVudCA9ICRhbGxDb250ZW50cy5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItaXRlbWlkPScgKyB0b2dnbGVyX2lkICsgJ11bZGF0YS10b2dnbGVyLWdyb3VwPScgKyBncm91cCArICddJyk7XG4gICAgICAgIHZhciAkY29udGVudEdyb3VwID0gY2xvc2luZyA/ICRjb250ZW50IDogJGFsbENvbnRlbnRzLmZpbHRlcignW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IG9wZW5pbmcgPyAhb3BlbmluZyA6IGNsb3NpbmcgPyBjbG9zaW5nIDogJGNvbnRlbnQuaGFzQ2xhc3MoX2FjdGl2ZUNsYXNzKTtcblxuICAgICAgICAvLyBBZGQgcmVtb3ZlIGNsYXNzZXNcbiAgICAgICAgaWYgKCRjb250ZW50LmRhdGEoJ3RvZ2dsZXItZ3JvdXAtbm8tY2xvc2UnKSAmJiAhKCh0b2dnbGUgfHwgb3BlbmluZyB8fCBjbG9zaW5nKSAmJiAhaXNBY3RpdmUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvZ2dsZSB8fCBvcGVuaW5nIHx8IGNsb3NpbmcgfHwgY2xvc2VBbGwpIHtcbiAgICAgICAgICAgIGxldCAkbGlua3NUb2dnbGVyR3JvdXAgPSAkYWxsTGlua3NUb2dnbGVyLmZpbHRlcignW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuICAgICAgICAgICAgJGxpbmtzVG9nZ2xlckdyb3VwLnJlbW92ZUNsYXNzKF9hY3RpdmVDbGFzcyArICcgJyArIF9jdXJyZW50VHJpZ2dlckNsYXNzKTtcbiAgICAgICAgICAgICRjb250ZW50R3JvdXAuZmlsdGVyKCcuJyArIF9hY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3MoX2FjdGl2ZUNsYXNzKS50cmlnZ2VyKCdjbG9zZS5jb250ZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0FjdGl2ZSAmJiAhY2xvc2VBbGwgJiYgIWNsb3NpbmcpIHtcbiAgICAgICAgICAgIGxldCAkbGlua3NUb2dnbGVyR3JvdXAgPSAkYWxsTGlua3NUb2dnbGVyLmZpbHRlcignW2RhdGEtdG9nZ2xlci1pZD0nICsgdG9nZ2xlcl9pZCArICddW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuICAgICAgICAgICAgJGxpbmtzVG9nZ2xlckdyb3VwLmFkZENsYXNzKF9hY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAkbGlua1RvZ2dsZXIuYWRkQ2xhc3MoX2N1cnJlbnRUcmlnZ2VyQ2xhc3MpO1xuICAgICAgICAgICAgJGNvbnRlbnQuYWRkQ2xhc3MoX2FjdGl2ZUNsYXNzKS50cmlnZ2VyKCdvcGVuLmNvbnRlbnQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50YWdOYW1lID09PSBcIkFcIikge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjc3NTZWxlY3RvclxuICAgICAqIEBwYXJhbSBjc3NTZWxlY3RvckNvbnRlbnRcbiAgICAgKiBAcGFyYW0gYWN0aXZlQ2xhc3NcbiAgICAgKiBAcGFyYW0gZXZlbnRzXG4gICAgICogQHBhcmFtIGN1cnJlbnRUcmlnZ2VyQ2xhc3NcbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gKHtjc3NTZWxlY3RvciA9ICcuanMtdG9nZ2xlcicsIGNzc1NlbGVjdG9yQ29udGVudCA9ICcuanMtaXRlbS10b2dnbGVyJywgYWN0aXZlQ2xhc3MgPSAnYWN0aXZlJywgZXZlbnRzID0gJycsIGN1cnJlbnRUcmlnZ2VyQ2xhc3MgPSAnY3VycmVudC10cmlnZ2VyJ30gPSB7fSkge1xuICAgICAgICBldmVudHMgPSBldmVudHMgPyAnICcgKyBldmVudHMgOiAnJztcbiAgICAgICAgX2Nzc1NlbGVjdG9yID0gY3NzU2VsZWN0b3I7XG4gICAgICAgIF9jc3NTZWxlY3RvckNvbnRlbnQgPSBjc3NTZWxlY3RvckNvbnRlbnQ7XG4gICAgICAgIF9hY3RpdmVDbGFzcyA9IGFjdGl2ZUNsYXNzO1xuICAgICAgICBfY3VycmVudFRyaWdnZXJDbGFzcyA9IGN1cnJlbnRUcmlnZ2VyQ2xhc3M7XG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2sgb3BlbiBjbG9zZSB0b2dnbGUnICsgZXZlbnRzLCBjc3NTZWxlY3Rvciwgc2VsZWN0b3IpO1xuICAgIH07XG5cbn0pKCk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBqc1RvZ2dsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvdG9nZ2xlci5qcyIsIi8qKlxuICogaW5pdFxuICovXG5cbnZhciB3ZWJtb2R1bGUgPSAoZnVuY3Rpb24gKCkge1xuXG5cbiAgICBjb25zdCBTRUxFQ1RPUl9JTklUSUFMSVpFRCA9ICdqcy1tb2R1bGUtaW5pdCc7XG4gICAgbGV0IHJlZ0lzSW5pdCA9IG5ldyBSZWdFeHAoU0VMRUNUT1JfSU5JVElBTElaRUQpO1xuICAgIC8qXG4gICAgIG1vZHVsZSBhdXRvIGluaXRcbiAgICAganVzdCBhZGQgLmpzLW1vZHVsZSB0byBhbiBIVE1MIGVsZW0gYW5kIGEgbW9kdWxlIG5hbWVcbiAgICAgdGhhdCB3aWxsIG1hdGNoIGEgZmlsZSBpbiBcIm1vZHVsZXNcIiBmb2xkZXIgYW5kIGl0IHdpbGwgd29ya1xuXG4gICAgIDxoMiBjbGFzcz1cImpzLW1vZHVsZVwiIGRhdGEtbW9kdWxlPVwidGVzdFwiPmRlc2t0b3AvdGFibGV0dGU8L2gyPlxuXG4gICAgIGVhY2ggbW9kdWxlIGNhbiBleHBvcnQgYSByZWFkeSgpIChvciBpbml0KCkpIGFuZCBhIGxvYWQoKSBmdW5jdGlvblxuICAgICAqL1xuXG5cbiAgICB2YXIgX2NyZWF0ZSA9IGZ1bmN0aW9uIChtb2R1bGUsIG1vZHVsZU5hbWUsIERPTU1vZHVsZSkge1xuICAgICAgICBtb2R1bGUuaW5pdCA9IG1vZHVsZS5pbml0IHx8IG1vZHVsZS5yZWFkeTtcbiAgICAgICAgbGV0IGRhdGEgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IERPTU1vZHVsZS5hdHRyaWJ1dGVzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBET01Nb2R1bGUuYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlLm5vZGVOYW1lO1xuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAoYF5kYXRhLW1vZHVsZS0ke21vZHVsZU5hbWV9LS1gKS50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGFOYW1lID0gbmFtZS5zcGxpdChgZGF0YS1tb2R1bGUtJHttb2R1bGVOYW1lfS0tYClbMV07XG4gICAgICAgICAgICAgICAgZGF0YVtkYXRhTmFtZV0gPSB7dmFsdWU6IGF0dHJpYnV0ZS5ub2RlVmFsdWV9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG1vZHVsZSwgZGF0YSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG1vZHVsZXMge05vZGVMaXN0fVxuICAgICAqIEBwYXJhbSBsb2FkRmxhZz1mYWxzZSB7Qm9vbGVhbn1cbiAgICAgKiBAcmV0dXJuIHt7cmVhZHk6IEFycmF5LCBsb2FkOiBBcnJheX19XG4gICAgICovXG4gICAgdmFyIHBhcnNlTW9kdWxlcyA9IGZ1bmN0aW9uIChtb2R1bGVzLCBsb2FkRmxhZyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBtb2R1bGVSZWFkeSA9IFtdO1xuICAgICAgICBsZXQgbW9kdWxlc0xvYWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgRE9NTW9kdWxlIG9mIG1vZHVsZXMpIHtcbiAgICAgICAgICAgIGlmICghcmVnSXNJbml0LnRlc3QoRE9NTW9kdWxlLmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgX21vZHVsZU5hbWVTcGxpdCA9IERPTU1vZHVsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kdWxlJykuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9tb2R1bGVOYW1lU3BsaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9tb2R1bGVOYW1lID0gX21vZHVsZU5hbWVTcGxpdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnRNb2R1bGUgPSByZXF1aXJlKCcuLi9tb2R1bGVzLycgKyBfbW9kdWxlTmFtZSkuZGVmYXVsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb2R1bGUgPSBfY3JlYXRlKGltcG9ydE1vZHVsZSwgX21vZHVsZU5hbWUsIERPTU1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVSZWFkeS5wdXNoKHttb2R1bGU6IG1vZHVsZSwgZWxlbTogRE9NTW9kdWxlfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkRmxhZyAmJiBtb2R1bGVzTG9hZC5wdXNoKHttb2R1bGU6IG1vZHVsZSwgZWxlbTogRE9NTW9kdWxlfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdNb2R1bGUgbm90IGZvdWQnLCAnLi4vbW9kdWxlcy8nICsgX21vZHVsZU5hbWUsIERPTU1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleGVjKG1vZHVsZVJlYWR5LCB0cnVlKTtcblxuICAgICAgICBsb2FkRmxhZyAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4ZWMobW9kdWxlc0xvYWQsIG51bGwsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBhcnNlTW9kdWxlcyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kdWxlJyksIHRydWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtb2R1bGVzXG4gICAgICogQHBhcmFtIGZsYWc9ZmFsc2Uge0Jvb2xlYW59IGFkZENsYXNzIHRvIG1hcmsgbW9kdWxlIGhhcyBhbHJlYWR5IGRvbmVcbiAgICAgKiBAcGFyYW0gZG9Mb2FkPWZhbHNlIHtCb29sZWFufSBleGVjIGxvYWQgZnVuY3Rpb25cbiAgICAgKi9cbiAgICB2YXIgZXhlYyA9IGZ1bmN0aW9uIChtb2R1bGVzLCBmbGFnID0gZmFsc2UsIGRvTG9hZCA9IGZhbHNlKSB7XG4gICAgICAgIG1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG8ubW9kdWxlO1xuICAgICAgICAgICAgaWYgKCFkb0xvYWQgJiYgbW9kdWxlLmluaXQpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdChvLmVsZW0pO1xuICAgICAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIG8uZWxlbS5jbGFzc05hbWUgKz0gJyAnICsgU0VMRUNUT1JfSU5JVElBTElaRUQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRvTG9hZCAmJiBtb2R1bGUubG9hZCkge1xuICAgICAgICAgICAgICAgIG1vZHVsZS5sb2FkKG8uZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZWFkeTogZXhlYyxcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgcGFyc2U6IHBhcnNlTW9kdWxlc1xuICAgIH1cblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSB3ZWJtb2R1bGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvbW9kdWxlLmpzIiwidmFyIG1hcCA9IHtcblx0XCIuL3BvcHVsYXItYm9va3NcIjogNSxcblx0XCIuL3BvcHVsYXItYm9va3MuanNcIjogNSxcblx0XCIuL3Rlc3RcIjogMTAsXG5cdFwiLi90ZXN0LW5vLWxvYWRcIjogMTEsXG5cdFwiLi90ZXN0LW5vLWxvYWQuanNcIjogMTEsXG5cdFwiLi90ZXN0LmpzXCI6IDEwXG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpKTtcbn07XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHJldHVybiBtYXBbcmVxXSB8fCAoZnVuY3Rpb24oKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIicuXCIpIH0oKSk7XG59O1xud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IDQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2R1bGVzIF5cXC5cXC8uKiRcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBpbml0XG4gKi9cbnZhciBnZXRTZXJ2aWNlID0gcmVxdWlyZSgnLi4vY29yZS9nZXQtc2VydmljZScpO1xudmFyIGdldFRwbCA9IHJlcXVpcmUoJy4uL2NvcmUvZ2V0VHBsJyk7XG52YXIgcG9wdWxhckJvb2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vXG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdldFNlcnZpY2UuY2FsbCgncG9wdWxhcl9ib29rcycpLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oZGF0YSk7XG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBnZXRUcGwobnVsbCwgJ3RwbF9wb3B1bGFyYm9va3NfdGgnKTtcbiAgICAgICAgICAgICAgICBkYXRhLnJlY29yZHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oaXRlbS5maWVsZHMuY29sbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gZ2V0VHBsKGl0ZW0uZmllbGRzLCAndHBsX3BvcHVsYXJib29rcycsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkcG9wdWxhcmJvb2tzJykuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBsZSBtb2R1bGUgcG9wdWxhci1ib29rcyBhIMOpdMOpIGluaXQgYXUgRE9NUmVhZHkgdmlhIGwnw6lsw6ltZW50YCwgZWxlbSk7XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZHk6IHJlYWR5XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBwb3B1bGFyQm9vaztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy9wb3B1bGFyLWJvb2tzLmpzIiwiLy90b2RvIGVuZHBvaW50IHNob3VsZCBiZSBpbiBwYXJhbXNcbnZhciBhamF4ID0gcmVxdWlyZShcIi4vYWpheFwiKTtcblxudmFyIHVzZVNlcnZpY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IGVuZHBvaW50ID0ge307XG5cbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChlbmRQb2ludCkge1xuICAgICAgICBlbmRwb2ludCA9IE9iamVjdC5hc3NpZ24oe30sIGVuZFBvaW50KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIEFQSV9zZXJ2aWNlIHtzdHJpbmd9XG4gICAgICogQHBhcmFtIHBhcmFtcyB7b2JqZWN0fSBkYXRhIHNlbnQgdG8gdGhlIEFQSVxuICAgICAqIEBwYXJhbSBsb2FkZXIge0Jvb2xlYW59IGRpc3BsYXkgb3Igbm90IHRoZSBsb2FkZXJcbiAgICAgKiBAcmV0dXJucyB7alF1ZXJ5fSBhamF4XG4gICAgICovXG4gICAgdmFyIGNhbGwgPSBmdW5jdGlvbiAoQVBJX3NlcnZpY2UsIHBhcmFtcywgbG9hZGVyKSB7XG4gICAgICAgIGlmIChlbmRwb2ludFtBUElfc2VydmljZV0pIHtcblxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBlbmRwb2ludFtBUElfc2VydmljZV0udXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYoZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnBhcmFtcyl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihlbmRwb2ludFtBUElfc2VydmljZV0ucGFyYW1zLCBwYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRpb25zLm1ldGhvZCA9IGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5tZXRob2Q7XG4gICAgICAgICAgICBpZiAoZW5kcG9pbnRbQVBJX3NlcnZpY2VdLmNvbnRlbnRUeXBlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29udGVudFR5cGUgPSBlbmRwb2ludFtBUElfc2VydmljZV0uY29udGVudFR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnByb2Nlc3NEYXRhICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucHJvY2Vzc0RhdGEgPSBlbmRwb2ludFtBUElfc2VydmljZV0ucHJvY2Vzc0RhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcHRpb25zLmRhdGEgPSBwYXJhbXM7XG4gICAgICAgICAgICByZXR1cm4gYWpheChvcHRpb25zLCBsb2FkZXIpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSBTZXJ2aWNlICR7QVBJX3NlcnZpY2V9IG5vdCBkZWZpbmVkYClcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgY2FsbDogY2FsbFxuICAgIH07XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gdXNlU2VydmljZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9nZXQtc2VydmljZS5qcyIsInZhciBhamF4bG9hZGVyID0gcmVxdWlyZShcIi4vYWpheC1sb2FkXCIpLmRlZmF1bHQ7XG4vKipcbiAqIEBwYXJhbSBvcHRpb25zIHtvYmplY3R9XG4gKiBAcGFyYW0gW2xvYWRlcj10cnVlXSB7Qm9vbGVhbn1cbiAqL1xudmFyIGFqYXggPSAoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIG9uQWx3YXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvL3RvZG8gc2hvdWxkIGJlIGluIHBhcmFtc1xuICAgIH07XG4gICAgdmFyIG9uRmFpbCA9IGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgLy9OT1QgRk9VTkQgT1IgTUVUSE9EIE5PVCBBTExPV0VEXG4gICAgICAgIC8vdG9kbyBzaG91bGQgYmUgaW4gcGFyYW1zXG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAob3B0aW9ucywgbG9hZGVyID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKGxvYWRlcikge1xuICAgICAgICAgICAgaWYgKGFqYXhsb2FkZXIucmVhZHkpIHtcbiAgICAgICAgICAgICAgICBhamF4bG9hZGVyLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2xvYWQgbm90IHJlYWR5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJC5hamF4KG9wdGlvbnMpLmFsd2F5cyhsb2FkZXIgPyBhamF4bG9hZGVyLmhpZGUgOiBvbkFsd2F5cykuZmFpbChvbkZhaWwpO1xuICAgIH07XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9hamF4LmpzIiwidmFyIGFqYXhsb2FkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vdG9kbyB0cGwgc2hvdWxkIGJlIGluIHBhcmFtXG4gICAgbGV0IF90cGwgPSAnPGRpdiBpZD1cImFqYXhsb2FkZXJcIiBjbGFzcz1cIndpbmRvd3M4XCI+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF8xXCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzJcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfM1wiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF80XCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzVcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfNlwiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF83XCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgXG4gICAgbGV0ICRhamF4bG9hZGVyO1xuICAgIGxldCBfY3NzQ2xhc3MgPSAnJztcbiAgICBsZXQgc3RhdHVzID0gMDtcbiAgICBsZXQgX2lzUmVhZHkgPSBmYWxzZTtcbiAgICB2YXIgc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhdHVzLS07XG4gICAgICAgICRhamF4bG9hZGVyLmFkZENsYXNzKF9jc3NDbGFzcyk7XG4gICAgfTtcbiAgICB2YXIgaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhdHVzKys7XG4gICAgICAgIHN0YXR1cyA9PT0gMCAmJiAkYWpheGxvYWRlci5yZW1vdmVDbGFzcyhfY3NzQ2xhc3MpO1xuICAgIH07XG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoe3RwbCwgJHRhcmdldCwgY3NzQ2xhc3N9KSB7XG4gICAgICAgIF9jc3NDbGFzcyA9IGNzc0NsYXNzIHx8ICdhamF4bG9hZGVyLXNob3cnO1xuICAgICAgICBfdHBsID0gdHBsO1xuICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdHBsKTtcbiAgICAgICAgJGFqYXhsb2FkZXIgPSAkdGFyZ2V0IHx8ICQoJyNhamF4bG9hZGVyJyk7XG4gICAgICAgIF9pc1JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICR0YXJnZXQ7XG4gICAgfTtcbiAgICB2YXIgcmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfaXNSZWFkeVxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgc2hvdzogc2hvdyxcbiAgICAgICAgaGlkZTogaGlkZSxcbiAgICAgICAgcmVhZHk6IHJlYWR5XG4gICAgfVxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhamF4bG9hZDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9hamF4LWxvYWQuanMiLCJ2YXIgZ2V0VHBsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBsZXQgY2FjaGUgPSB7fTtcbiAgICB2YXIgZ2V0Q2FjaGUgPSBmdW5jdGlvbiAodGVtcGxhdGVJZCkge1xuICAgICAgICByZXR1cm4gY2FjaGVbdGVtcGxhdGVJZF07XG4gICAgfTtcbiAgICB2YXIgc2V0Q2FjaGUgPSBmdW5jdGlvbiAodGVtcGxhdGVJZCwgaHRtbCkge1xuICAgICAgICBjYWNoZVt0ZW1wbGF0ZUlkXSA9IGh0bWw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgZm9ybWVkIG9iamVjdCB0aGF0IG1hdGNoIGluIHRlbXBsYXRlIHtmb286J2Jhcid9IHdpbGwgcmVwbGFjZSB7e2Zvb319IHdpdGggYmFyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlSWQgSFRNTCBhdHRyaWJ1dGUgaWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBIVE1sIHRlbXBsYXRlIHRyYW5zZm9ybWVkXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGdldHRwbChkYXRhLCB0ZW1wbGF0ZUlkLCBkZWJ1ZyA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUhUTUwgPSBnZXRDYWNoZSh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgaWYgKGdldENhY2hlKHRlbXBsYXRlSWQpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZUhUTUwgPSBnZXRDYWNoZSh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0cGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKTtcbiAgICAgICAgICAgIHRlbXBsYXRlSFRNTCA9IHRwbC5pbm5lckhUTUw7XG4gICAgICAgICAgICBzZXRDYWNoZSh0ZW1wbGF0ZUlkLCB0ZW1wbGF0ZUhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZUhUTUwucmVwbGFjZSgve3sgPyhbXn1dKikgK319L2csIGZ1bmN0aW9uIChzZWFyY2gsIHJlc3VsdCkge1xuICAgICAgICAgICAgZGVidWcgJiYgY29uc29sZS5pbmZvKHJlc3VsdCwgZGF0YVtyZXN1bHRdKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhW3Jlc3VsdF0gfHwgJyc7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGdldFRwbDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29yZS9nZXRUcGwuanMiLCIvKipcbiAqIGluaXRcbiAqL1xuXG52YXIgbW9kdWxlVGVzdCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcmVhZHkgPSBmdW5jdGlvbiAoZWxlbSkge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbyhgbGUgbW9kdWxlIHRlc3QgYSDDqXTDqSBpbml0IGF1IERPTVJlYWR5IHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0sIHRoaXMpO1xuXG4gICAgfTtcbiAgICB2YXIgbG9hZCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgbGUgbW9kdWxlIHRlc3QgYSDDqXTDqSBpbml0IGF1IExPQUQgdmlhIGwnw6lsw6ltZW50YCwgZWxlbSwgdGhpcyk7XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZHk6IHJlYWR5LFxuICAgICAgICBsb2FkOiBsb2FkXG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBtb2R1bGVUZXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3Rlc3QuanMiLCIvKipcbiAqIGluaXRcbiAqL1xuaW1wb3J0IG1vZHVsZSBmcm9tIFwiLi4vY29yZS9tb2R1bGVcIjtcblxudmFyIG1vZHVsZVRlc3QgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKGVsZW0pIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oYGxlIG1vZHVsZSB0ZXN0LW5vLWxvYWQgYSDDqXTDqSBpbml0IGF1IERPTVJlYWR5IHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0sIHRoaXMpO1xuXG4gICAgICAgICQoZWxlbSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWxlbS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyRW5kJywgYDxoMiBjbGFzcz1cImpzLW1vZHVsZVwiIGRhdGEtbW9kdWxlPVwidGVzdC1uby1sb2FkXCI+VGVzdCBuby1sb2FkPC9oMj5gKTtcbiAgICAgICAgICAgIG1vZHVsZS5wYXJzZSgkKCcuanMtbW9kdWxlJykpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IHJlYWR5XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBtb2R1bGVUZXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tb2R1bGVzL3Rlc3Qtbm8tbG9hZC5qcyIsIid1c2Ugc3RyaWN0JztcblxudmFyIEFsZ29saWFTZWFyY2ggPSByZXF1aXJlKCcuLi8uLi9BbGdvbGlhU2VhcmNoLmpzJyk7XG52YXIgY3JlYXRlQWxnb2xpYXNlYXJjaCA9IHJlcXVpcmUoJy4uL2NyZWF0ZUFsZ29saWFzZWFyY2guanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBbGdvbGlhc2VhcmNoKEFsZ29saWFTZWFyY2gpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9icm93c2VyL2J1aWxkcy9hbGdvbGlhc2VhcmNoLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBBbGdvbGlhU2VhcmNoO1xuXG52YXIgSW5kZXggPSByZXF1aXJlKCcuL0luZGV4LmpzJyk7XG52YXIgZGVwcmVjYXRlID0gcmVxdWlyZSgnLi9kZXByZWNhdGUuanMnKTtcbnZhciBkZXByZWNhdGVkTWVzc2FnZSA9IHJlcXVpcmUoJy4vZGVwcmVjYXRlZE1lc3NhZ2UuanMnKTtcbnZhciBBbGdvbGlhU2VhcmNoQ29yZSA9IHJlcXVpcmUoJy4vQWxnb2xpYVNlYXJjaENvcmUuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxuZnVuY3Rpb24gQWxnb2xpYVNlYXJjaCgpIHtcbiAgQWxnb2xpYVNlYXJjaENvcmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdHMoQWxnb2xpYVNlYXJjaCwgQWxnb2xpYVNlYXJjaENvcmUpO1xuXG4vKlxuICogRGVsZXRlIGFuIGluZGV4XG4gKlxuICogQHBhcmFtIGluZGV4TmFtZSB0aGUgbmFtZSBvZiBpbmRleCB0byBkZWxldGVcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiAqICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4gKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyB0aGUgdGFzayBJRFxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5kZWxldGVJbmRleCA9IGZ1bmN0aW9uKGluZGV4TmFtZSwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE5hbWUpLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qKlxuICogTW92ZSBhbiBleGlzdGluZyBpbmRleC5cbiAqIEBwYXJhbSBzcmNJbmRleE5hbWUgdGhlIG5hbWUgb2YgaW5kZXggdG8gY29weS5cbiAqIEBwYXJhbSBkc3RJbmRleE5hbWUgdGhlIG5ldyBpbmRleCBuYW1lIHRoYXQgd2lsbCBjb250YWlucyBhIGNvcHkgb2ZcbiAqIHNyY0luZGV4TmFtZSAoZGVzdGluYXRpb24gd2lsbCBiZSBvdmVycml0ZW4gaWYgaXQgYWxyZWFkeSBleGlzdCkuXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgY29udGFpbnMgdGhlIHRhc2sgSURcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUubW92ZUluZGV4ID0gZnVuY3Rpb24oc3JjSW5kZXhOYW1lLCBkc3RJbmRleE5hbWUsIGNhbGxiYWNrKSB7XG4gIHZhciBwb3N0T2JqID0ge1xuICAgIG9wZXJhdGlvbjogJ21vdmUnLCBkZXN0aW5hdGlvbjogZHN0SW5kZXhOYW1lXG4gIH07XG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHNyY0luZGV4TmFtZSkgKyAnL29wZXJhdGlvbicsXG4gICAgYm9keTogcG9zdE9iaixcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKipcbiAqIENvcHkgYW4gZXhpc3RpbmcgaW5kZXguXG4gKiBAcGFyYW0gc3JjSW5kZXhOYW1lIHRoZSBuYW1lIG9mIGluZGV4IHRvIGNvcHkuXG4gKiBAcGFyYW0gZHN0SW5kZXhOYW1lIHRoZSBuZXcgaW5kZXggbmFtZSB0aGF0IHdpbGwgY29udGFpbnMgYSBjb3B5XG4gKiBvZiBzcmNJbmRleE5hbWUgKGRlc3RpbmF0aW9uIHdpbGwgYmUgb3ZlcnJpdGVuIGlmIGl0IGFscmVhZHkgZXhpc3QpLlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuICogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IGNvbnRhaW5zIHRoZSB0YXNrIElEXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmNvcHlJbmRleCA9IGZ1bmN0aW9uKHNyY0luZGV4TmFtZSwgZHN0SW5kZXhOYW1lLCBjYWxsYmFjaykge1xuICB2YXIgcG9zdE9iaiA9IHtcbiAgICBvcGVyYXRpb246ICdjb3B5JywgZGVzdGluYXRpb246IGRzdEluZGV4TmFtZVxuICB9O1xuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChzcmNJbmRleE5hbWUpICsgJy9vcGVyYXRpb24nLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gbGFzdCBsb2cgZW50cmllcy5cbiAqIEBwYXJhbSBvZmZzZXQgU3BlY2lmeSB0aGUgZmlyc3QgZW50cnkgdG8gcmV0cmlldmUgKDAtYmFzZWQsIDAgaXMgdGhlIG1vc3QgcmVjZW50IGxvZyBlbnRyeSkuXG4gKiBAcGFyYW0gbGVuZ3RoIFNwZWNpZnkgdGhlIG1heGltdW0gbnVtYmVyIG9mIGVudHJpZXMgdG8gcmV0cmlldmUgc3RhcnRpbmdcbiAqIGF0IG9mZnNldC4gTWF4aW11bSBhbGxvd2VkIHZhbHVlOiAxMDAwLlxuICogQHBhcmFtIHR5cGUgU3BlY2lmeSB0aGUgbWF4aW11bSBudW1iZXIgb2YgZW50cmllcyB0byByZXRyaWV2ZSBzdGFydGluZ1xuICogYXQgb2Zmc2V0LiBNYXhpbXVtIGFsbG93ZWQgdmFsdWU6IDEwMDAuXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgY29udGFpbnMgdGhlIHRhc2sgSURcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZ2V0TG9ncyA9IGZ1bmN0aW9uKG9mZnNldCwgbGVuZ3RoLCBjYWxsYmFjaykge1xuICB2YXIgY2xvbmUgPSByZXF1aXJlKCcuL2Nsb25lLmpzJyk7XG4gIHZhciBwYXJhbXMgPSB7fTtcbiAgaWYgKHR5cGVvZiBvZmZzZXQgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gZ2V0TG9ncyhwYXJhbXMpXG4gICAgcGFyYW1zID0gY2xvbmUob2Zmc2V0KTtcbiAgICBjYWxsYmFjayA9IGxlbmd0aDtcbiAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBvZmZzZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBnZXRMb2dzKFtjYl0pXG4gICAgY2FsbGJhY2sgPSBvZmZzZXQ7XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2YgbGVuZ3RoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gZ2V0TG9ncygxLCBbY2IpXVxuICAgIGNhbGxiYWNrID0gbGVuZ3RoO1xuICAgIHBhcmFtcy5vZmZzZXQgPSBvZmZzZXQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gZ2V0TG9ncygxLCAyLCBbY2JdKVxuICAgIHBhcmFtcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgcGFyYW1zLmxlbmd0aCA9IGxlbmd0aDtcbiAgfVxuXG4gIGlmIChwYXJhbXMub2Zmc2V0ID09PSB1bmRlZmluZWQpIHBhcmFtcy5vZmZzZXQgPSAwO1xuICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSBwYXJhbXMubGVuZ3RoID0gMTA7XG5cbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy8xL2xvZ3M/JyArIHRoaXMuX2dldFNlYXJjaFBhcmFtcyhwYXJhbXMsICcnKSxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4gKiBMaXN0IGFsbCBleGlzdGluZyBpbmRleGVzIChwYWdpbmF0ZWQpXG4gKlxuICogQHBhcmFtIHBhZ2UgVGhlIHBhZ2UgdG8gcmV0cmlldmUsIHN0YXJ0aW5nIGF0IDAuXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHdpdGggaW5kZXggbGlzdFxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5saXN0SW5kZXhlcyA9IGZ1bmN0aW9uKHBhZ2UsIGNhbGxiYWNrKSB7XG4gIHZhciBwYXJhbXMgPSAnJztcblxuICBpZiAocGFnZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBwYWdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBwYWdlO1xuICB9IGVsc2Uge1xuICAgIHBhcmFtcyA9ICc/cGFnZT0nICsgcGFnZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzJyArIHBhcmFtcyxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4gKiBHZXQgdGhlIGluZGV4IG9iamVjdCBpbml0aWFsaXplZFxuICpcbiAqIEBwYXJhbSBpbmRleE5hbWUgdGhlIG5hbWUgb2YgaW5kZXhcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIHdpdGggb25lIGFyZ3VtZW50ICh0aGUgSW5kZXggaW5zdGFuY2UpXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmluaXRJbmRleCA9IGZ1bmN0aW9uKGluZGV4TmFtZSkge1xuICByZXR1cm4gbmV3IEluZGV4KHRoaXMsIGluZGV4TmFtZSk7XG59O1xuXG4vKlxuICogTGlzdCBhbGwgZXhpc3RpbmcgdXNlciBrZXlzIHdpdGggdGhlaXIgYXNzb2NpYXRlZCBBQ0xzXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuICogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmxpc3RVc2VyS2V5cyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9rZXlzJyxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4gKiBHZXQgQUNMIG9mIGEgdXNlciBrZXlcbiAqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHdpdGggdXNlciBrZXlzIGxpc3RcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZ2V0VXNlcktleUFDTCA9IGZ1bmN0aW9uKGtleSwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy8xL2tleXMvJyArIGtleSxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4gKiBEZWxldGUgYW4gZXhpc3RpbmcgdXNlciBrZXlcbiAqIEBwYXJhbSBrZXlcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiAqICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4gKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB1c2VyIGtleXMgbGlzdFxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5kZWxldGVVc2VyS2V5ID0gZnVuY3Rpb24oa2V5LCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgdXJsOiAnLzEva2V5cy8nICsga2V5LFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4gKiBBZGQgYSBuZXcgZ2xvYmFsIEFQSSBrZXlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhY2xzIC0gVGhlIGxpc3Qgb2YgQUNMIGZvciB0aGlzIGtleS4gRGVmaW5lZCBieSBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXRcbiAqICAgY2FuIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICogICAgIC0gc2VhcmNoOiBhbGxvdyB0byBzZWFyY2ggKGh0dHBzIGFuZCBodHRwKVxuICogICAgIC0gYWRkT2JqZWN0OiBhbGxvd3MgdG8gYWRkL3VwZGF0ZSBhbiBvYmplY3QgaW4gdGhlIGluZGV4IChodHRwcyBvbmx5KVxuICogICAgIC0gZGVsZXRlT2JqZWN0IDogYWxsb3dzIHRvIGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3QgKGh0dHBzIG9ubHkpXG4gKiAgICAgLSBkZWxldGVJbmRleCA6IGFsbG93cyB0byBkZWxldGUgaW5kZXggY29udGVudCAoaHR0cHMgb25seSlcbiAqICAgICAtIHNldHRpbmdzIDogYWxsb3dzIHRvIGdldCBpbmRleCBzZXR0aW5ncyAoaHR0cHMgb25seSlcbiAqICAgICAtIGVkaXRTZXR0aW5ncyA6IGFsbG93cyB0byBjaGFuZ2UgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4gKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc10gLSBPcHRpb25uYWwgcGFyYW1ldGVycyB0byBzZXQgZm9yIHRoZSBrZXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMudmFsaWRpdHkgLSBOdW1iZXIgb2Ygc2Vjb25kcyBhZnRlciB3aGljaCB0aGUga2V5IHdpbGwgYmUgYXV0b21hdGljYWxseSByZW1vdmVkICgwIG1lYW5zIG5vIHRpbWUgbGltaXQgZm9yIHRoaXMga2V5KVxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyIC0gTnVtYmVyIG9mIEFQSSBjYWxscyBhbGxvd2VkIGZyb20gYW4gSVAgYWRkcmVzcyBwZXIgaG91clxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhIaXRzUGVyUXVlcnkgLSBOdW1iZXIgb2YgaGl0cyB0aGlzIEFQSSBrZXkgY2FuIHJldHJpZXZlIGluIG9uZSBjYWxsXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXJhbXMuaW5kZXhlcyAtIEFsbG93ZWQgdGFyZ2V0ZWQgaW5kZXhlcyBmb3IgdGhpcyBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuZGVzY3JpcHRpb24gLSBBIGRlc2NyaXB0aW9uIGZvciB5b3VyIGtleVxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1zLnJlZmVyZXJzIC0gQSBsaXN0IG9mIGF1dGhvcml6ZWQgcmVmZXJlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMucXVlcnlQYXJhbWV0ZXJzIC0gRm9yY2UgdGhlIGtleSB0byB1c2Ugc3BlY2lmaWMgcXVlcnkgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiAqICAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4gKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiAqIEBleGFtcGxlXG4gKiBjbGllbnQuYWRkVXNlcktleShbJ3NlYXJjaCddLCB7XG4gKiAgIHZhbGlkaXR5OiAzMDAsXG4gKiAgIG1heFF1ZXJpZXNQZXJJUFBlckhvdXI6IDIwMDAsXG4gKiAgIG1heEhpdHNQZXJRdWVyeTogMyxcbiAqICAgaW5kZXhlczogWydmcnVpdHMnXSxcbiAqICAgZGVzY3JpcHRpb246ICdFYXQgdGhyZWUgZnJ1aXRzJyxcbiAqICAgcmVmZXJlcnM6IFsnKi5hbGdvbGlhLmNvbSddLFxuICogICBxdWVyeVBhcmFtZXRlcnM6IHtcbiAqICAgICB0YWdGaWx0ZXJzOiBbJ3B1YmxpYyddLFxuICogICB9XG4gKiB9KVxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL3Jlc3RfYXBpI0FkZEtleXxBbGdvbGlhIFJFU1QgQVBJIERvY3VtZW50YXRpb259XG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmFkZFVzZXJLZXkgPSBmdW5jdGlvbihhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGNsaWVudC5hZGRVc2VyS2V5KGFycmF5T2ZBY2xzWywgcGFyYW1zLCBjYWxsYmFja10pJztcblxuICBpZiAoIWlzQXJyYXkoYWNscykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgfHwgdHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gcGFyYW1zO1xuICAgIHBhcmFtcyA9IG51bGw7XG4gIH1cblxuICB2YXIgcG9zdE9iaiA9IHtcbiAgICBhY2w6IGFjbHNcbiAgfTtcblxuICBpZiAocGFyYW1zKSB7XG4gICAgcG9zdE9iai52YWxpZGl0eSA9IHBhcmFtcy52YWxpZGl0eTtcbiAgICBwb3N0T2JqLm1heFF1ZXJpZXNQZXJJUFBlckhvdXIgPSBwYXJhbXMubWF4UXVlcmllc1BlcklQUGVySG91cjtcbiAgICBwb3N0T2JqLm1heEhpdHNQZXJRdWVyeSA9IHBhcmFtcy5tYXhIaXRzUGVyUXVlcnk7XG4gICAgcG9zdE9iai5pbmRleGVzID0gcGFyYW1zLmluZGV4ZXM7XG4gICAgcG9zdE9iai5kZXNjcmlwdGlvbiA9IHBhcmFtcy5kZXNjcmlwdGlvbjtcblxuICAgIGlmIChwYXJhbXMucXVlcnlQYXJhbWV0ZXJzKSB7XG4gICAgICBwb3N0T2JqLnF1ZXJ5UGFyYW1ldGVycyA9IHRoaXMuX2dldFNlYXJjaFBhcmFtcyhwYXJhbXMucXVlcnlQYXJhbWV0ZXJzLCAnJyk7XG4gICAgfVxuXG4gICAgcG9zdE9iai5yZWZlcmVycyA9IHBhcmFtcy5yZWZlcmVycztcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEva2V5cycsXG4gICAgYm9keTogcG9zdE9iaixcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKipcbiAqIEFkZCBhIG5ldyBnbG9iYWwgQVBJIGtleVxuICogQGRlcHJlY2F0ZWQgUGxlYXNlIHVzZSBjbGllbnQuYWRkVXNlcktleSgpXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmFkZFVzZXJLZXlXaXRoVmFsaWRpdHkgPSBkZXByZWNhdGUoZnVuY3Rpb24oYWNscywgcGFyYW1zLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5hZGRVc2VyS2V5KGFjbHMsIHBhcmFtcywgY2FsbGJhY2spO1xufSwgZGVwcmVjYXRlZE1lc3NhZ2UoJ2NsaWVudC5hZGRVc2VyS2V5V2l0aFZhbGlkaXR5KCknLCAnY2xpZW50LmFkZFVzZXJLZXkoKScpKTtcblxuLyoqXG4gKiBVcGRhdGUgYW4gZXhpc3RpbmcgQVBJIGtleVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gdXBkYXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhY2xzIC0gVGhlIGxpc3Qgb2YgQUNMIGZvciB0aGlzIGtleS4gRGVmaW5lZCBieSBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXRcbiAqICAgY2FuIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICogICAgIC0gc2VhcmNoOiBhbGxvdyB0byBzZWFyY2ggKGh0dHBzIGFuZCBodHRwKVxuICogICAgIC0gYWRkT2JqZWN0OiBhbGxvd3MgdG8gYWRkL3VwZGF0ZSBhbiBvYmplY3QgaW4gdGhlIGluZGV4IChodHRwcyBvbmx5KVxuICogICAgIC0gZGVsZXRlT2JqZWN0IDogYWxsb3dzIHRvIGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3QgKGh0dHBzIG9ubHkpXG4gKiAgICAgLSBkZWxldGVJbmRleCA6IGFsbG93cyB0byBkZWxldGUgaW5kZXggY29udGVudCAoaHR0cHMgb25seSlcbiAqICAgICAtIHNldHRpbmdzIDogYWxsb3dzIHRvIGdldCBpbmRleCBzZXR0aW5ncyAoaHR0cHMgb25seSlcbiAqICAgICAtIGVkaXRTZXR0aW5ncyA6IGFsbG93cyB0byBjaGFuZ2UgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4gKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc10gLSBPcHRpb25uYWwgcGFyYW1ldGVycyB0byBzZXQgZm9yIHRoZSBrZXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMudmFsaWRpdHkgLSBOdW1iZXIgb2Ygc2Vjb25kcyBhZnRlciB3aGljaCB0aGUga2V5IHdpbGwgYmUgYXV0b21hdGljYWxseSByZW1vdmVkICgwIG1lYW5zIG5vIHRpbWUgbGltaXQgZm9yIHRoaXMga2V5KVxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyIC0gTnVtYmVyIG9mIEFQSSBjYWxscyBhbGxvd2VkIGZyb20gYW4gSVAgYWRkcmVzcyBwZXIgaG91clxuICogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhIaXRzUGVyUXVlcnkgLSBOdW1iZXIgb2YgaGl0cyB0aGlzIEFQSSBrZXkgY2FuIHJldHJpZXZlIGluIG9uZSBjYWxsXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXJhbXMuaW5kZXhlcyAtIEFsbG93ZWQgdGFyZ2V0ZWQgaW5kZXhlcyBmb3IgdGhpcyBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuZGVzY3JpcHRpb24gLSBBIGRlc2NyaXB0aW9uIGZvciB5b3VyIGtleVxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1zLnJlZmVyZXJzIC0gQSBsaXN0IG9mIGF1dGhvcml6ZWQgcmVmZXJlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMucXVlcnlQYXJhbWV0ZXJzIC0gRm9yY2UgdGhlIGtleSB0byB1c2Ugc3BlY2lmaWMgcXVlcnkgcGFyYW1ldGVyc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiAqICAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4gKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiAqIEBleGFtcGxlXG4gKiBjbGllbnQudXBkYXRlVXNlcktleSgnQVBJS0VZJywgWydzZWFyY2gnXSwge1xuICogICB2YWxpZGl0eTogMzAwLFxuICogICBtYXhRdWVyaWVzUGVySVBQZXJIb3VyOiAyMDAwLFxuICogICBtYXhIaXRzUGVyUXVlcnk6IDMsXG4gKiAgIGluZGV4ZXM6IFsnZnJ1aXRzJ10sXG4gKiAgIGRlc2NyaXB0aW9uOiAnRWF0IHRocmVlIGZydWl0cycsXG4gKiAgIHJlZmVyZXJzOiBbJyouYWxnb2xpYS5jb20nXSxcbiAqICAgcXVlcnlQYXJhbWV0ZXJzOiB7XG4gKiAgICAgdGFnRmlsdGVyczogWydwdWJsaWMnXSxcbiAqICAgfVxuICogfSlcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9yZXN0X2FwaSNVcGRhdGVJbmRleEtleXxBbGdvbGlhIFJFU1QgQVBJIERvY3VtZW50YXRpb259XG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLnVwZGF0ZVVzZXJLZXkgPSBmdW5jdGlvbihrZXksIGFjbHMsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciB1c2FnZSA9ICdVc2FnZTogY2xpZW50LnVwZGF0ZVVzZXJLZXkoa2V5LCBhcnJheU9mQWNsc1ssIHBhcmFtcywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KGFjbHMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyIHx8IHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICBwYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgdmFyIHB1dE9iaiA9IHtcbiAgICBhY2w6IGFjbHNcbiAgfTtcblxuICBpZiAocGFyYW1zKSB7XG4gICAgcHV0T2JqLnZhbGlkaXR5ID0gcGFyYW1zLnZhbGlkaXR5O1xuICAgIHB1dE9iai5tYXhRdWVyaWVzUGVySVBQZXJIb3VyID0gcGFyYW1zLm1heFF1ZXJpZXNQZXJJUFBlckhvdXI7XG4gICAgcHV0T2JqLm1heEhpdHNQZXJRdWVyeSA9IHBhcmFtcy5tYXhIaXRzUGVyUXVlcnk7XG4gICAgcHV0T2JqLmluZGV4ZXMgPSBwYXJhbXMuaW5kZXhlcztcbiAgICBwdXRPYmouZGVzY3JpcHRpb24gPSBwYXJhbXMuZGVzY3JpcHRpb247XG5cbiAgICBpZiAocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycykge1xuICAgICAgcHV0T2JqLnF1ZXJ5UGFyYW1ldGVycyA9IHRoaXMuX2dldFNlYXJjaFBhcmFtcyhwYXJhbXMucXVlcnlQYXJhbWV0ZXJzLCAnJyk7XG4gICAgfVxuXG4gICAgcHV0T2JqLnJlZmVyZXJzID0gcGFyYW1zLnJlZmVyZXJzO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIHVybDogJy8xL2tleXMvJyArIGtleSxcbiAgICBib2R5OiBwdXRPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGJhdGNoIG9mIHNlYXJjaCBxdWVyaWVzXG4gKiBAZGVwcmVjYXRlZCB1c2UgY2xpZW50LnNlYXJjaCgpXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLnN0YXJ0UXVlcmllc0JhdGNoID0gZGVwcmVjYXRlKGZ1bmN0aW9uIHN0YXJ0UXVlcmllc0JhdGNoRGVwcmVjYXRlZCgpIHtcbiAgdGhpcy5fYmF0Y2ggPSBbXTtcbn0sIGRlcHJlY2F0ZWRNZXNzYWdlKCdjbGllbnQuc3RhcnRRdWVyaWVzQmF0Y2goKScsICdjbGllbnQuc2VhcmNoKCknKSk7XG5cbi8qKlxuICogQWRkIGEgc2VhcmNoIHF1ZXJ5IGluIHRoZSBiYXRjaFxuICogQGRlcHJlY2F0ZWQgdXNlIGNsaWVudC5zZWFyY2goKVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5hZGRRdWVyeUluQmF0Y2ggPSBkZXByZWNhdGUoZnVuY3Rpb24gYWRkUXVlcnlJbkJhdGNoRGVwcmVjYXRlZChpbmRleE5hbWUsIHF1ZXJ5LCBhcmdzKSB7XG4gIHRoaXMuX2JhdGNoLnB1c2goe1xuICAgIGluZGV4TmFtZTogaW5kZXhOYW1lLFxuICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICBwYXJhbXM6IGFyZ3NcbiAgfSk7XG59LCBkZXByZWNhdGVkTWVzc2FnZSgnY2xpZW50LmFkZFF1ZXJ5SW5CYXRjaCgpJywgJ2NsaWVudC5zZWFyY2goKScpKTtcblxuLyoqXG4gKiBMYXVuY2ggdGhlIGJhdGNoIG9mIHF1ZXJpZXMgdXNpbmcgWE1MSHR0cFJlcXVlc3QuXG4gKiBAZGVwcmVjYXRlZCB1c2UgY2xpZW50LnNlYXJjaCgpXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLnNlbmRRdWVyaWVzQmF0Y2ggPSBkZXByZWNhdGUoZnVuY3Rpb24gc2VuZFF1ZXJpZXNCYXRjaERlcHJlY2F0ZWQoY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuc2VhcmNoKHRoaXMuX2JhdGNoLCBjYWxsYmFjayk7XG59LCBkZXByZWNhdGVkTWVzc2FnZSgnY2xpZW50LnNlbmRRdWVyaWVzQmF0Y2goKScsICdjbGllbnQuc2VhcmNoKCknKSk7XG5cbi8qKlxuICogUGVyZm9ybSB3cml0ZSBvcGVyYXRpb25zIGFjY3Jvc3MgbXVsdGlwbGUgaW5kZXhlcy5cbiAqXG4gKiBUbyByZWR1Y2UgdGhlIGFtb3VudCBvZiB0aW1lIHNwZW50IG9uIG5ldHdvcmsgcm91bmQgdHJpcHMsXG4gKiB5b3UgY2FuIGNyZWF0ZSwgdXBkYXRlLCBvciBkZWxldGUgc2V2ZXJhbCBvYmplY3RzIGluIG9uZSBjYWxsLFxuICogdXNpbmcgdGhlIGJhdGNoIGVuZHBvaW50IChhbGwgb3BlcmF0aW9ucyBhcmUgZG9uZSBpbiB0aGUgZ2l2ZW4gb3JkZXIpLlxuICpcbiAqIEF2YWlsYWJsZSBhY3Rpb25zOlxuICogICAtIGFkZE9iamVjdFxuICogICAtIHVwZGF0ZU9iamVjdFxuICogICAtIHBhcnRpYWxVcGRhdGVPYmplY3RcbiAqICAgLSBwYXJ0aWFsVXBkYXRlT2JqZWN0Tm9DcmVhdGVcbiAqICAgLSBkZWxldGVPYmplY3RcbiAqXG4gKiBodHRwczovL3d3dy5hbGdvbGlhLmNvbS9kb2MvcmVzdF9hcGkjSW5kZXhlc1xuICogQHBhcmFtICB7T2JqZWN0W119IG9wZXJhdGlvbnMgQW4gYXJyYXkgb2Ygb3BlcmF0aW9ucyB0byBwZXJmb3JtXG4gKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiAqIEBleGFtcGxlXG4gKiBjbGllbnQuYmF0Y2goW3tcbiAqICAgYWN0aW9uOiAnYWRkT2JqZWN0JyxcbiAqICAgaW5kZXhOYW1lOiAnY2xpZW50cycsXG4gKiAgIGJvZHk6IHtcbiAqICAgICBuYW1lOiAnQmlsbCdcbiAqICAgfVxuICogfSwge1xuICogICBhY3Rpb246ICd1ZHBhdGVPYmplY3QnLFxuICogICBpbmRleE5hbWU6ICdmcnVpdHMnLFxuICogICBib2R5OiB7XG4gKiAgICAgb2JqZWN0SUQ6ICcyOTEzOCcsXG4gKiAgICAgbmFtZTogJ2JhbmFuYSdcbiAqICAgfVxuICogfV0sIGNiKVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uKG9wZXJhdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGNsaWVudC5iYXRjaChvcGVyYXRpb25zWywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KG9wZXJhdGlvbnMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8qL2JhdGNoJyxcbiAgICBib2R5OiB7XG4gICAgICByZXF1ZXN0czogb3BlcmF0aW9uc1xuICAgIH0sXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLy8gZW52aXJvbm1lbnQgc3BlY2lmaWMgbWV0aG9kc1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZGVzdHJveSA9IG5vdEltcGxlbWVudGVkO1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZW5hYmxlUmF0ZUxpbWl0Rm9yd2FyZCA9IG5vdEltcGxlbWVudGVkO1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZGlzYWJsZVJhdGVMaW1pdEZvcndhcmQgPSBub3RJbXBsZW1lbnRlZDtcbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLnVzZVNlY3VyZWRBUElLZXkgPSBub3RJbXBsZW1lbnRlZDtcbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmRpc2FibGVTZWN1cmVkQVBJS2V5ID0gbm90SW1wbGVtZW50ZWQ7XG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5nZW5lcmF0ZVNlY3VyZWRBcGlLZXkgPSBub3RJbXBsZW1lbnRlZDtcblxuZnVuY3Rpb24gbm90SW1wbGVtZW50ZWQoKSB7XG4gIHZhciBtZXNzYWdlID0gJ05vdCBpbXBsZW1lbnRlZCBpbiB0aGlzIGVudmlyb25tZW50LlxcbicgK1xuICAgICdJZiB5b3UgZmVlbCB0aGlzIGlzIGEgbWlzdGFrZSwgd3JpdGUgdG8gc3VwcG9ydEBhbGdvbGlhLmNvbSc7XG5cbiAgdGhyb3cgbmV3IGVycm9ycy5BbGdvbGlhU2VhcmNoRXJyb3IobWVzc2FnZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL0FsZ29saWFTZWFyY2guanMiLCJ2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIEluZGV4Q29yZSA9IHJlcXVpcmUoJy4vSW5kZXhDb3JlLmpzJyk7XG52YXIgZGVwcmVjYXRlID0gcmVxdWlyZSgnLi9kZXByZWNhdGUuanMnKTtcbnZhciBkZXByZWNhdGVkTWVzc2FnZSA9IHJlcXVpcmUoJy4vZGVwcmVjYXRlZE1lc3NhZ2UuanMnKTtcbnZhciBleGl0UHJvbWlzZSA9IHJlcXVpcmUoJy4vZXhpdFByb21pc2UuanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4O1xuXG5mdW5jdGlvbiBJbmRleCgpIHtcbiAgSW5kZXhDb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXRzKEluZGV4LCBJbmRleENvcmUpO1xuXG4vKlxuKiBBZGQgYW4gb2JqZWN0IGluIHRoaXMgaW5kZXhcbipcbiogQHBhcmFtIGNvbnRlbnQgY29udGFpbnMgdGhlIGphdmFzY3JpcHQgb2JqZWN0IHRvIGFkZCBpbnNpZGUgdGhlIGluZGV4XG4qIEBwYXJhbSBvYmplY3RJRCAob3B0aW9uYWwpIGFuIG9iamVjdElEIHlvdSB3YW50IHRvIGF0dHJpYnV0ZSB0byB0aGlzIG9iamVjdFxuKiAoaWYgdGhlIGF0dHJpYnV0ZSBhbHJlYWR5IGV4aXN0IHRoZSBvbGQgb2JqZWN0IHdpbGwgYmUgb3ZlcndyaXRlKVxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHM6XG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IGNvbnRhaW5zIDMgZWxlbWVudHM6IGNyZWF0ZUF0LCB0YXNrSWQgYW5kIG9iamVjdElEXG4qL1xuSW5kZXgucHJvdG90eXBlLmFkZE9iamVjdCA9IGZ1bmN0aW9uKGNvbnRlbnQsIG9iamVjdElELCBjYWxsYmFjaykge1xuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBvYmplY3RJRCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb2JqZWN0SUQ7XG4gICAgb2JqZWN0SUQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogb2JqZWN0SUQgIT09IHVuZGVmaW5lZCA/XG4gICAgJ1BVVCcgOiAvLyB1cGRhdGUgb3IgY3JlYXRlXG4gICAgJ1BPU1QnLCAvLyBjcmVhdGUgKEFQSSBnZW5lcmF0ZXMgYW4gb2JqZWN0SUQpXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAvLyBjcmVhdGVcbiAgICAob2JqZWN0SUQgIT09IHVuZGVmaW5lZCA/ICcvJyArIGVuY29kZVVSSUNvbXBvbmVudChvYmplY3RJRCkgOiAnJyksIC8vIHVwZGF0ZSBvciBjcmVhdGVcbiAgICBib2R5OiBjb250ZW50LFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIEFkZCBzZXZlcmFsIG9iamVjdHNcbipcbiogQHBhcmFtIG9iamVjdHMgY29udGFpbnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB0byBhZGRcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCB1cGRhdGVBdCBhbmQgdGFza0lEXG4qL1xuSW5kZXgucHJvdG90eXBlLmFkZE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RzLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC5hZGRPYmplY3RzKGFycmF5T2ZPYmplY3RzWywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KG9iamVjdHMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHZhciBwb3N0T2JqID0ge1xuICAgIHJlcXVlc3RzOiBbXVxuICB9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgIGFjdGlvbjogJ2FkZE9iamVjdCcsXG4gICAgICBib2R5OiBvYmplY3RzW2ldXG4gICAgfTtcbiAgICBwb3N0T2JqLnJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvYmF0Y2gnLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogVXBkYXRlIHBhcnRpYWxseSBhbiBvYmplY3QgKG9ubHkgdXBkYXRlIGF0dHJpYnV0ZXMgcGFzc2VkIGluIGFyZ3VtZW50KVxuKlxuKiBAcGFyYW0gcGFydGlhbE9iamVjdCBjb250YWlucyB0aGUgamF2YXNjcmlwdCBhdHRyaWJ1dGVzIHRvIG92ZXJyaWRlLCB0aGVcbiogIG9iamVjdCBtdXN0IGNvbnRhaW5zIGFuIG9iamVjdElEIGF0dHJpYnV0ZVxuKiBAcGFyYW0gY3JlYXRlSWZOb3RFeGlzdHMgKG9wdGlvbmFsKSBpZiBmYWxzZSwgYXZvaWQgYW4gYXV0b21hdGljIGNyZWF0aW9uIG9mIHRoZSBvYmplY3RcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyAzIGVsZW1lbnRzOiBjcmVhdGVBdCwgdGFza0lkIGFuZCBvYmplY3RJRFxuKi9cbkluZGV4LnByb3RvdHlwZS5wYXJ0aWFsVXBkYXRlT2JqZWN0ID0gZnVuY3Rpb24ocGFydGlhbE9iamVjdCwgY3JlYXRlSWZOb3RFeGlzdHMsIGNhbGxiYWNrKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBjcmVhdGVJZk5vdEV4aXN0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gY3JlYXRlSWZOb3RFeGlzdHM7XG4gICAgY3JlYXRlSWZOb3RFeGlzdHMgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICB2YXIgdXJsID0gJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcnRpYWxPYmplY3Qub2JqZWN0SUQpICsgJy9wYXJ0aWFsJztcbiAgaWYgKGNyZWF0ZUlmTm90RXhpc3RzID09PSBmYWxzZSkge1xuICAgIHVybCArPSAnP2NyZWF0ZUlmTm90RXhpc3RzPWZhbHNlJztcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiB1cmwsXG4gICAgYm9keTogcGFydGlhbE9iamVjdCxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBQYXJ0aWFsbHkgT3ZlcnJpZGUgdGhlIGNvbnRlbnQgb2Ygc2V2ZXJhbCBvYmplY3RzXG4qXG4qIEBwYXJhbSBvYmplY3RzIGNvbnRhaW5zIGFuIGFycmF5IG9mIG9iamVjdHMgdG8gdXBkYXRlIChlYWNoIG9iamVjdCBtdXN0IGNvbnRhaW5zIGEgb2JqZWN0SUQgYXR0cmlidXRlKVxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHM6XG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IHVwZGF0ZUF0IGFuZCB0YXNrSURcbiovXG5JbmRleC5wcm90b3R5cGUucGFydGlhbFVwZGF0ZU9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RzLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC5wYXJ0aWFsVXBkYXRlT2JqZWN0cyhhcnJheU9mT2JqZWN0c1ssIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShvYmplY3RzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICB2YXIgcG9zdE9iaiA9IHtcbiAgICByZXF1ZXN0czogW11cbiAgfTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICBhY3Rpb246ICdwYXJ0aWFsVXBkYXRlT2JqZWN0JyxcbiAgICAgIG9iamVjdElEOiBvYmplY3RzW2ldLm9iamVjdElELFxuICAgICAgYm9keTogb2JqZWN0c1tpXVxuICAgIH07XG4gICAgcG9zdE9iai5yZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICB9XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2JhdGNoJyxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIE92ZXJyaWRlIHRoZSBjb250ZW50IG9mIG9iamVjdFxuKlxuKiBAcGFyYW0gb2JqZWN0IGNvbnRhaW5zIHRoZSBqYXZhc2NyaXB0IG9iamVjdCB0byBzYXZlLCB0aGUgb2JqZWN0IG11c3QgY29udGFpbnMgYW4gb2JqZWN0SUQgYXR0cmlidXRlXG4qIEBwYXJhbSBjYWxsYmFjayAob3B0aW9uYWwpIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50czpcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgdXBkYXRlQXQgYW5kIHRhc2tJRFxuKi9cbkluZGV4LnByb3RvdHlwZS5zYXZlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBjYWxsYmFjaykge1xuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnLycgKyBlbmNvZGVVUklDb21wb25lbnQob2JqZWN0Lm9iamVjdElEKSxcbiAgICBib2R5OiBvYmplY3QsXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogT3ZlcnJpZGUgdGhlIGNvbnRlbnQgb2Ygc2V2ZXJhbCBvYmplY3RzXG4qXG4qIEBwYXJhbSBvYmplY3RzIGNvbnRhaW5zIGFuIGFycmF5IG9mIG9iamVjdHMgdG8gdXBkYXRlIChlYWNoIG9iamVjdCBtdXN0IGNvbnRhaW5zIGEgb2JqZWN0SUQgYXR0cmlidXRlKVxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHM6XG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IHVwZGF0ZUF0IGFuZCB0YXNrSURcbiovXG5JbmRleC5wcm90b3R5cGUuc2F2ZU9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RzLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC5zYXZlT2JqZWN0cyhhcnJheU9mT2JqZWN0c1ssIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShvYmplY3RzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICB2YXIgcG9zdE9iaiA9IHtcbiAgICByZXF1ZXN0czogW11cbiAgfTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICBhY3Rpb246ICd1cGRhdGVPYmplY3QnLFxuICAgICAgb2JqZWN0SUQ6IG9iamVjdHNbaV0ub2JqZWN0SUQsXG4gICAgICBib2R5OiBvYmplY3RzW2ldXG4gICAgfTtcbiAgICBwb3N0T2JqLnJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvYmF0Y2gnLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogRGVsZXRlIGFuIG9iamVjdCBmcm9tIHRoZSBpbmRleFxuKlxuKiBAcGFyYW0gb2JqZWN0SUQgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIG9iamVjdCB0byBkZWxldGVcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyAzIGVsZW1lbnRzOiBjcmVhdGVBdCwgdGFza0lkIGFuZCBvYmplY3RJRFxuKi9cbkluZGV4LnByb3RvdHlwZS5kZWxldGVPYmplY3QgPSBmdW5jdGlvbihvYmplY3RJRCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBvYmplY3RJRCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2Ygb2JqZWN0SUQgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBvYmplY3RJRCAhPT0gJ251bWJlcicpIHtcbiAgICB2YXIgZXJyID0gbmV3IGVycm9ycy5BbGdvbGlhU2VhcmNoRXJyb3IoJ0Nhbm5vdCBkZWxldGUgYW4gb2JqZWN0IHdpdGhvdXQgYW4gb2JqZWN0SUQnKTtcbiAgICBjYWxsYmFjayA9IG9iamVjdElEO1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmFzLl9wcm9taXNlLnJlamVjdChlcnIpO1xuICB9XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9iamVjdElEKSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBEZWxldGUgc2V2ZXJhbCBvYmplY3RzIGZyb20gYW4gaW5kZXhcbipcbiogQHBhcmFtIG9iamVjdElEcyBjb250YWlucyBhbiBhcnJheSBvZiBvYmplY3RJRCB0byBkZWxldGVcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyAzIGVsZW1lbnRzOiBjcmVhdGVBdCwgdGFza0lkIGFuZCBvYmplY3RJRFxuKi9cbkluZGV4LnByb3RvdHlwZS5kZWxldGVPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0SURzLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XG5cbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC5kZWxldGVPYmplY3RzKGFycmF5T2ZPYmplY3RJRHNbLCBjYWxsYmFja10pJztcblxuICBpZiAoIWlzQXJyYXkob2JqZWN0SURzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICB2YXIgcG9zdE9iaiA9IHtcbiAgICByZXF1ZXN0czogbWFwKG9iamVjdElEcywgZnVuY3Rpb24gcHJlcGFyZVJlcXVlc3Qob2JqZWN0SUQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFjdGlvbjogJ2RlbGV0ZU9iamVjdCcsXG4gICAgICAgIG9iamVjdElEOiBvYmplY3RJRCxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIG9iamVjdElEOiBvYmplY3RJRFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pXG4gIH07XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvYmF0Y2gnLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogRGVsZXRlIGFsbCBvYmplY3RzIG1hdGNoaW5nIGEgcXVlcnlcbipcbiogQHBhcmFtIHF1ZXJ5IHRoZSBxdWVyeSBzdHJpbmdcbiogQHBhcmFtIHBhcmFtcyB0aGUgb3B0aW9uYWwgcXVlcnkgcGFyYW1ldGVyc1xuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIG9uZSBhcmd1bWVudFxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKi9cbkluZGV4LnByb3RvdHlwZS5kZWxldGVCeVF1ZXJ5ID0gZnVuY3Rpb24ocXVlcnksIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgdmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZS5qcycpO1xuICB2YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICB2YXIgY2xpZW50ID0gaW5kZXhPYmouYXM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgfHwgdHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gcGFyYW1zO1xuICAgIHBhcmFtcyA9IHt9O1xuICB9IGVsc2Uge1xuICAgIHBhcmFtcyA9IGNsb25lKHBhcmFtcyk7XG4gIH1cblxuICBwYXJhbXMuYXR0cmlidXRlc1RvUmV0cmlldmUgPSAnb2JqZWN0SUQnO1xuICBwYXJhbXMuaGl0c1BlclBhZ2UgPSAxMDAwO1xuICBwYXJhbXMuZGlzdGluY3QgPSBmYWxzZTtcblxuICAvLyB3aGVuIGRlbGV0aW5nLCB3ZSBzaG91bGQgbmV2ZXIgdXNlIGNhY2hlIHRvIGdldCB0aGVcbiAgLy8gc2VhcmNoIHJlc3VsdHNcbiAgdGhpcy5jbGVhckNhY2hlKCk7XG5cbiAgLy8gdGhlcmUncyBhIHByb2JsZW0gaW4gaG93IHdlIHVzZSB0aGUgcHJvbWlzZSBjaGFpbixcbiAgLy8gc2VlIGhvdyB3YWl0VGFzayBpcyBkb25lXG4gIHZhciBwcm9taXNlID0gdGhpc1xuICAuc2VhcmNoKHF1ZXJ5LCBwYXJhbXMpXG4gIC50aGVuKHN0b3BPckRlbGV0ZSk7XG5cbiAgZnVuY3Rpb24gc3RvcE9yRGVsZXRlKHNlYXJjaENvbnRlbnQpIHtcbiAgICAvLyBzdG9wIGhlcmVcbiAgICBpZiAoc2VhcmNoQ29udGVudC5uYkhpdHMgPT09IDApIHtcbiAgICAgIC8vIHJldHVybiBpbmRleE9iai5hcy5fcmVxdWVzdC5yZXNvbHZlKCk7XG4gICAgICByZXR1cm4gc2VhcmNoQ29udGVudDtcbiAgICB9XG5cbiAgICAvLyBjb250aW51ZSBhbmQgZG8gYSByZWN1cnNpdmUgY2FsbFxuICAgIHZhciBvYmplY3RJRHMgPSBtYXAoc2VhcmNoQ29udGVudC5oaXRzLCBmdW5jdGlvbiBnZXRPYmplY3RJRChvYmplY3QpIHtcbiAgICAgIHJldHVybiBvYmplY3Qub2JqZWN0SUQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5kZXhPYmpcbiAgICAuZGVsZXRlT2JqZWN0cyhvYmplY3RJRHMpXG4gICAgLnRoZW4od2FpdFRhc2spXG4gICAgLnRoZW4oZG9EZWxldGVCeVF1ZXJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdhaXRUYXNrKGRlbGV0ZU9iamVjdHNDb250ZW50KSB7XG4gICAgcmV0dXJuIGluZGV4T2JqLndhaXRUYXNrKGRlbGV0ZU9iamVjdHNDb250ZW50LnRhc2tJRCk7XG4gIH1cblxuICBmdW5jdGlvbiBkb0RlbGV0ZUJ5UXVlcnkoKSB7XG4gICAgcmV0dXJuIGluZGV4T2JqLmRlbGV0ZUJ5UXVlcnkocXVlcnksIHBhcmFtcyk7XG4gIH1cblxuICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBwcm9taXNlLnRoZW4oc3VjY2VzcywgZmFpbHVyZSk7XG5cbiAgZnVuY3Rpb24gc3VjY2VzcygpIHtcbiAgICBleGl0UHJvbWlzZShmdW5jdGlvbiBleGl0KCkge1xuICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgfSwgY2xpZW50Ll9zZXRUaW1lb3V0IHx8IHNldFRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFpbHVyZShlcnIpIHtcbiAgICBleGl0UHJvbWlzZShmdW5jdGlvbiBleGl0KCkge1xuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9LCBjbGllbnQuX3NldFRpbWVvdXQgfHwgc2V0VGltZW91dCk7XG4gIH1cbn07XG5cbi8qXG4qIEJyb3dzZSBhbGwgY29udGVudCBmcm9tIGFuIGluZGV4IHVzaW5nIGV2ZW50cy4gQmFzaWNhbGx5IHRoaXMgd2lsbCBkb1xuKiAuYnJvd3NlKCkgLT4gLmJyb3dzZUZyb20gLT4gLmJyb3dzZUZyb20gLT4gLi4gdW50aWwgYWxsIHRoZSByZXN1bHRzIGFyZSByZXR1cm5lZFxuKlxuKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLSBUaGUgZnVsbCB0ZXh0IHF1ZXJ5XG4qIEBwYXJhbSB7T2JqZWN0fSBbcXVlcnlQYXJhbWV0ZXJzXSAtIEFueSBzZWFyY2ggcXVlcnkgcGFyYW1ldGVyXG4qIEByZXR1cm4ge0V2ZW50RW1pdHRlcn1cbiogQGV4YW1wbGVcbiogdmFyIGJyb3dzZXIgPSBpbmRleC5icm93c2VBbGwoJ2Nvb2wgc29uZ3MnLCB7XG4qICAgdGFnRmlsdGVyczogJ3B1YmxpYyxjb21tZW50cycsXG4qICAgaGl0c1BlclBhZ2U6IDUwMFxuKiB9KTtcbipcbiogYnJvd3Nlci5vbigncmVzdWx0JywgZnVuY3Rpb24gcmVzdWx0Q2FsbGJhY2soY29udGVudCkge1xuKiAgIGNvbnNvbGUubG9nKGNvbnRlbnQuaGl0cyk7XG4qIH0pO1xuKlxuKiAvLyBpZiBhbnkgZXJyb3Igb2NjdXJzLCB5b3UgZ2V0IGl0XG4qIGJyb3dzZXIub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG4qICAgdGhyb3cgZXJyO1xuKiB9KTtcbipcbiogLy8gd2hlbiB5b3UgaGF2ZSBicm93c2VkIHRoZSB3aG9sZSBpbmRleCwgeW91IGdldCB0aGlzIGV2ZW50XG4qIGJyb3dzZXIub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuKiAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCcpO1xuKiB9KTtcbipcbiogLy8gYXQgYW55IHBvaW50IGlmIHlvdSB3YW50IHRvIHN0b3AgdGhlIGJyb3dzaW5nIHByb2Nlc3MsIHlvdSBjYW4gc3RvcCBpdCBtYW51YWxseVxuKiAvLyBvdGhlcndpc2UgaXQgd2lsbCBnbyBvbiBhbmQgb25cbiogYnJvd3Nlci5zdG9wKCk7XG4qXG4qIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9yZXN0X2FwaSNCcm93c2V8QWxnb2xpYSBSRVNUIEFQSSBEb2N1bWVudGF0aW9ufVxuKi9cbkluZGV4LnByb3RvdHlwZS5icm93c2VBbGwgPSBmdW5jdGlvbihxdWVyeSwgcXVlcnlQYXJhbWV0ZXJzKSB7XG4gIGlmICh0eXBlb2YgcXVlcnkgPT09ICdvYmplY3QnKSB7XG4gICAgcXVlcnlQYXJhbWV0ZXJzID0gcXVlcnk7XG4gICAgcXVlcnkgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlLmpzJyk7XG5cbiAgdmFyIEluZGV4QnJvd3NlciA9IHJlcXVpcmUoJy4vSW5kZXhCcm93c2VyJyk7XG5cbiAgdmFyIGJyb3dzZXIgPSBuZXcgSW5kZXhCcm93c2VyKCk7XG4gIHZhciBjbGllbnQgPSB0aGlzLmFzO1xuICB2YXIgaW5kZXggPSB0aGlzO1xuICB2YXIgcGFyYW1zID0gY2xpZW50Ll9nZXRTZWFyY2hQYXJhbXMoXG4gICAgbWVyZ2Uoe30sIHF1ZXJ5UGFyYW1ldGVycyB8fCB7fSwge1xuICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgfSksICcnXG4gICk7XG5cbiAgLy8gc3RhcnQgYnJvd3NpbmdcbiAgYnJvd3NlTG9vcCgpO1xuXG4gIGZ1bmN0aW9uIGJyb3dzZUxvb3AoY3Vyc29yKSB7XG4gICAgaWYgKGJyb3dzZXIuX3N0b3BwZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcXVlcnlTdHJpbmc7XG5cbiAgICBpZiAoY3Vyc29yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJ2N1cnNvcj0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGN1cnNvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1ZXJ5U3RyaW5nID0gcGFyYW1zO1xuICAgIH1cblxuICAgIGNsaWVudC5fanNvblJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleC5pbmRleE5hbWUpICsgJy9icm93c2U/JyArIHF1ZXJ5U3RyaW5nLFxuICAgICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICAgIGNhbGxiYWNrOiBicm93c2VDYWxsYmFja1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYnJvd3NlQ2FsbGJhY2soZXJyLCBjb250ZW50KSB7XG4gICAgaWYgKGJyb3dzZXIuX3N0b3BwZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICBicm93c2VyLl9lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJyb3dzZXIuX3Jlc3VsdChjb250ZW50KTtcblxuICAgIC8vIG5vIGN1cnNvciBtZWFucyB3ZSBhcmUgZmluaXNoZWQgYnJvd3NpbmdcbiAgICBpZiAoY29udGVudC5jdXJzb3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYnJvd3Nlci5fZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYnJvd3NlTG9vcChjb250ZW50LmN1cnNvcik7XG4gIH1cblxuICByZXR1cm4gYnJvd3Nlcjtcbn07XG5cbi8qXG4qIEdldCBhIFR5cGVhaGVhZC5qcyBhZGFwdGVyXG4qIEBwYXJhbSBzZWFyY2hQYXJhbXMgY29udGFpbnMgYW4gb2JqZWN0IHdpdGggcXVlcnkgcGFyYW1ldGVycyAoc2VlIHNlYXJjaCBmb3IgZGV0YWlscylcbiovXG5JbmRleC5wcm90b3R5cGUudHRBZGFwdGVyID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIGZ1bmN0aW9uIHR0QWRhcHRlcihxdWVyeSwgc3luY0NiLCBhc3luY0NiKSB7XG4gICAgdmFyIGNiO1xuXG4gICAgaWYgKHR5cGVvZiBhc3luY0NiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyB0eXBlYWhlYWQgMC4xMVxuICAgICAgY2IgPSBhc3luY0NiO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwcmUgdHlwZWFoZWFkIDAuMTFcbiAgICAgIGNiID0gc3luY0NiO1xuICAgIH1cblxuICAgIHNlbGYuc2VhcmNoKHF1ZXJ5LCBwYXJhbXMsIGZ1bmN0aW9uIHNlYXJjaERvbmUoZXJyLCBjb250ZW50KSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNiKGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY2IoY29udGVudC5oaXRzKTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbi8qXG4qIFdhaXQgdGhlIHB1YmxpY2F0aW9uIG9mIGEgdGFzayBvbiB0aGUgc2VydmVyLlxuKiBBbGwgc2VydmVyIHRhc2sgYXJlIGFzeW5jaHJvbm91cyBhbmQgeW91IGNhbiBjaGVjayB3aXRoIHRoaXMgbWV0aG9kIHRoYXQgdGhlIHRhc2sgaXMgcHVibGlzaGVkLlxuKlxuKiBAcGFyYW0gdGFza0lEIHRoZSBpZCBvZiB0aGUgdGFzayByZXR1cm5lZCBieSBzZXJ2ZXJcbiogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgd2l0aCB3aXRoIHR3byBhcmd1bWVudHM6XG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIHJlc3VsdHNcbiovXG5JbmRleC5wcm90b3R5cGUud2FpdFRhc2sgPSBmdW5jdGlvbih0YXNrSUQsIGNhbGxiYWNrKSB7XG4gIC8vIHdhaXQgbWluaW11bSAxMDBtcyBiZWZvcmUgcmV0cnlpbmdcbiAgdmFyIGJhc2VEZWxheSA9IDEwMDtcbiAgLy8gd2FpdCBtYXhpbXVtIDVzIGJlZm9yZSByZXRyeWluZ1xuICB2YXIgbWF4RGVsYXkgPSA1MDAwO1xuICB2YXIgbG9vcCA9IDA7XG5cbiAgLy8gd2FpdFRhc2soKSBtdXN0IGJlIGhhbmRsZWQgZGlmZmVyZW50bHkgZnJvbSBvdGhlciBtZXRob2RzLFxuICAvLyBpdCdzIGEgcmVjdXJzaXZlIG1ldGhvZCB1c2luZyBhIHRpbWVvdXRcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgdmFyIGNsaWVudCA9IGluZGV4T2JqLmFzO1xuXG4gIHZhciBwcm9taXNlID0gcmV0cnlMb29wKCk7XG5cbiAgZnVuY3Rpb24gcmV0cnlMb29wKCkge1xuICAgIHJldHVybiBjbGllbnQuX2pzb25SZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL3Rhc2svJyArIHRhc2tJRFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gc3VjY2Vzcyhjb250ZW50KSB7XG4gICAgICBsb29wKys7XG4gICAgICB2YXIgZGVsYXkgPSBiYXNlRGVsYXkgKiBsb29wICogbG9vcDtcbiAgICAgIGlmIChkZWxheSA+IG1heERlbGF5KSB7XG4gICAgICAgIGRlbGF5ID0gbWF4RGVsYXk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250ZW50LnN0YXR1cyAhPT0gJ3B1Ymxpc2hlZCcpIHtcbiAgICAgICAgcmV0dXJuIGNsaWVudC5fcHJvbWlzZS5kZWxheShkZWxheSkudGhlbihyZXRyeUxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghY2FsbGJhY2spIHtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHByb21pc2UudGhlbihzdWNjZXNzQ2IsIGZhaWx1cmVDYik7XG5cbiAgZnVuY3Rpb24gc3VjY2Vzc0NiKGNvbnRlbnQpIHtcbiAgICBleGl0UHJvbWlzZShmdW5jdGlvbiBleGl0KCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgY29udGVudCk7XG4gICAgfSwgY2xpZW50Ll9zZXRUaW1lb3V0IHx8IHNldFRpbWVvdXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFpbHVyZUNiKGVycikge1xuICAgIGV4aXRQcm9taXNlKGZ1bmN0aW9uIGV4aXQoKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH0sIGNsaWVudC5fc2V0VGltZW91dCB8fCBzZXRUaW1lb3V0KTtcbiAgfVxufTtcblxuLypcbiogVGhpcyBmdW5jdGlvbiBkZWxldGVzIHRoZSBpbmRleCBjb250ZW50LiBTZXR0aW5ncyBhbmQgaW5kZXggc3BlY2lmaWMgQVBJIGtleXMgYXJlIGtlcHQgdW50b3VjaGVkLlxuKlxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXR0aW5ncyBvYmplY3Qgb3IgdGhlIGVycm9yIG1lc3NhZ2UgaWYgYSBmYWlsdXJlIG9jY3VyZWRcbiovXG5JbmRleC5wcm90b3R5cGUuY2xlYXJJbmRleCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2NsZWFyJyxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBHZXQgc2V0dGluZ3Mgb2YgdGhpcyBpbmRleFxuKlxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXR0aW5ncyBvYmplY3Qgb3IgdGhlIGVycm9yIG1lc3NhZ2UgaWYgYSBmYWlsdXJlIG9jY3VyZWRcbiovXG5JbmRleC5wcm90b3R5cGUuZ2V0U2V0dGluZ3MgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL3NldHRpbmdzP2dldFZlcnNpb249MicsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5JbmRleC5wcm90b3R5cGUuc2VhcmNoU3lub255bXMgPSBmdW5jdGlvbihwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgcGFyYW1zID0ge307XG4gIH0gZWxzZSBpZiAocGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICBwYXJhbXMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvc3lub255bXMvc2VhcmNoJyxcbiAgICBib2R5OiBwYXJhbXMsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5JbmRleC5wcm90b3R5cGUuc2F2ZVN5bm9ueW0gPSBmdW5jdGlvbihzeW5vbnltLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9IGVsc2UgaWYgKG9wdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9zeW5vbnltcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHN5bm9ueW0ub2JqZWN0SUQpICtcbiAgICAgICc/Zm9yd2FyZFRvU2xhdmVzPScgKyAob3B0cy5mb3J3YXJkVG9TbGF2ZXMgPyAndHJ1ZScgOiAnZmFsc2UnKSxcbiAgICBib2R5OiBzeW5vbnltLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbkluZGV4LnByb3RvdHlwZS5nZXRTeW5vbnltID0gZnVuY3Rpb24ob2JqZWN0SUQsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9zeW5vbnltcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9iamVjdElEKSxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbkluZGV4LnByb3RvdHlwZS5kZWxldGVTeW5vbnltID0gZnVuY3Rpb24ob2JqZWN0SUQsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH0gZWxzZSBpZiAob3B0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmluZGV4TmFtZSkgKyAnL3N5bm9ueW1zLycgKyBlbmNvZGVVUklDb21wb25lbnQob2JqZWN0SUQpICtcbiAgICAgICc/Zm9yd2FyZFRvU2xhdmVzPScgKyAob3B0cy5mb3J3YXJkVG9TbGF2ZXMgPyAndHJ1ZScgOiAnZmFsc2UnKSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5JbmRleC5wcm90b3R5cGUuY2xlYXJTeW5vbnltcyA9IGZ1bmN0aW9uKG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH0gZWxzZSBpZiAob3B0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9zeW5vbnltcy9jbGVhcicgK1xuICAgICAgJz9mb3J3YXJkVG9TbGF2ZXM9JyArIChvcHRzLmZvcndhcmRUb1NsYXZlcyA/ICd0cnVlJyA6ICdmYWxzZScpLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbkluZGV4LnByb3RvdHlwZS5iYXRjaFN5bm9ueW1zID0gZnVuY3Rpb24oc3lub255bXMsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH0gZWxzZSBpZiAob3B0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9zeW5vbnltcy9iYXRjaCcgK1xuICAgICAgJz9mb3J3YXJkVG9TbGF2ZXM9JyArIChvcHRzLmZvcndhcmRUb1NsYXZlcyA/ICd0cnVlJyA6ICdmYWxzZScpICtcbiAgICAgICcmcmVwbGFjZUV4aXN0aW5nU3lub255bXM9JyArIChvcHRzLnJlcGxhY2VFeGlzdGluZ1N5bm9ueW1zID8gJ3RydWUnIDogJ2ZhbHNlJyksXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgYm9keTogc3lub255bXMsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogU2V0IHNldHRpbmdzIGZvciB0aGlzIGluZGV4XG4qXG4qIEBwYXJhbSBzZXR0aWducyB0aGUgc2V0dGluZ3Mgb2JqZWN0IHRoYXQgY2FuIGNvbnRhaW5zIDpcbiogLSBtaW5Xb3JkU2l6ZWZvcjFUeXBvOiAoaW50ZWdlcikgdGhlIG1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdG8gYWNjZXB0IG9uZSB0eXBvIChkZWZhdWx0ID0gMykuXG4qIC0gbWluV29yZFNpemVmb3IyVHlwb3M6IChpbnRlZ2VyKSB0aGUgbWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0byBhY2NlcHQgdHdvIHR5cG9zIChkZWZhdWx0ID0gNykuXG4qIC0gaGl0c1BlclBhZ2U6IChpbnRlZ2VyKSB0aGUgbnVtYmVyIG9mIGhpdHMgcGVyIHBhZ2UgKGRlZmF1bHQgPSAxMCkuXG4qIC0gYXR0cmlidXRlc1RvUmV0cmlldmU6IChhcnJheSBvZiBzdHJpbmdzKSBkZWZhdWx0IGxpc3Qgb2YgYXR0cmlidXRlcyB0byByZXRyaWV2ZSBpbiBvYmplY3RzLlxuKiAgIElmIHNldCB0byBudWxsLCBhbGwgYXR0cmlidXRlcyBhcmUgcmV0cmlldmVkLlxuKiAtIGF0dHJpYnV0ZXNUb0hpZ2hsaWdodDogKGFycmF5IG9mIHN0cmluZ3MpIGRlZmF1bHQgbGlzdCBvZiBhdHRyaWJ1dGVzIHRvIGhpZ2hsaWdodC5cbiogICBJZiBzZXQgdG8gbnVsbCwgYWxsIGluZGV4ZWQgYXR0cmlidXRlcyBhcmUgaGlnaGxpZ2h0ZWQuXG4qIC0gYXR0cmlidXRlc1RvU25pcHBldCoqOiAoYXJyYXkgb2Ygc3RyaW5ncykgZGVmYXVsdCBsaXN0IG9mIGF0dHJpYnV0ZXMgdG8gc25pcHBldCBhbG9uZ3NpZGUgdGhlIG51bWJlclxuKiBvZiB3b3JkcyB0byByZXR1cm4gKHN5bnRheCBpcyBhdHRyaWJ1dGVOYW1lOm5iV29yZHMpLlxuKiAgIEJ5IGRlZmF1bHQgbm8gc25pcHBldCBpcyBjb21wdXRlZC4gSWYgc2V0IHRvIG51bGwsIG5vIHNuaXBwZXQgaXMgY29tcHV0ZWQuXG4qIC0gYXR0cmlidXRlc1RvSW5kZXg6IChhcnJheSBvZiBzdHJpbmdzKSB0aGUgbGlzdCBvZiBmaWVsZHMgeW91IHdhbnQgdG8gaW5kZXguXG4qICAgSWYgc2V0IHRvIG51bGwsIGFsbCB0ZXh0dWFsIGFuZCBudW1lcmljYWwgYXR0cmlidXRlcyBvZiB5b3VyIG9iamVjdHMgYXJlIGluZGV4ZWQsXG4qICAgYnV0IHlvdSBzaG91bGQgdXBkYXRlIGl0IHRvIGdldCBvcHRpbWFsIHJlc3VsdHMuXG4qICAgVGhpcyBwYXJhbWV0ZXIgaGFzIHR3byBpbXBvcnRhbnQgdXNlczpcbiogICAgIC0gTGltaXQgdGhlIGF0dHJpYnV0ZXMgdG8gaW5kZXg6IEZvciBleGFtcGxlIGlmIHlvdSBzdG9yZSBhIGJpbmFyeSBpbWFnZSBpbiBiYXNlNjQsXG4qICAgICB5b3Ugd2FudCB0byBzdG9yZSBpdCBhbmQgYmUgYWJsZSB0b1xuKiAgICAgICByZXRyaWV2ZSBpdCBidXQgeW91IGRvbid0IHdhbnQgdG8gc2VhcmNoIGluIHRoZSBiYXNlNjQgc3RyaW5nLlxuKiAgICAgLSBDb250cm9sIHBhcnQgb2YgdGhlIHJhbmtpbmcqOiAoc2VlIHRoZSByYW5raW5nIHBhcmFtZXRlciBmb3IgZnVsbCBleHBsYW5hdGlvbilcbiogICAgIE1hdGNoZXMgaW4gYXR0cmlidXRlcyBhdCB0aGUgYmVnaW5uaW5nIG9mXG4qICAgICAgIHRoZSBsaXN0IHdpbGwgYmUgY29uc2lkZXJlZCBtb3JlIGltcG9ydGFudCB0aGFuIG1hdGNoZXMgaW4gYXR0cmlidXRlcyBmdXJ0aGVyIGRvd24gdGhlIGxpc3QuXG4qICAgICAgIEluIG9uZSBhdHRyaWJ1dGUsIG1hdGNoaW5nIHRleHQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXR0cmlidXRlIHdpbGwgYmVcbiogICAgICAgY29uc2lkZXJlZCBtb3JlIGltcG9ydGFudCB0aGFuIHRleHQgYWZ0ZXIsIHlvdSBjYW4gZGlzYWJsZVxuKiAgICAgICB0aGlzIGJlaGF2aW9yIGlmIHlvdSBhZGQgeW91ciBhdHRyaWJ1dGUgaW5zaWRlIGB1bm9yZGVyZWQoQXR0cmlidXRlTmFtZSlgLFxuKiAgICAgICBmb3IgZXhhbXBsZSBhdHRyaWJ1dGVzVG9JbmRleDogW1widGl0bGVcIiwgXCJ1bm9yZGVyZWQodGV4dClcIl0uXG4qIC0gYXR0cmlidXRlc0ZvckZhY2V0aW5nOiAoYXJyYXkgb2Ygc3RyaW5ncykgVGhlIGxpc3Qgb2YgZmllbGRzIHlvdSB3YW50IHRvIHVzZSBmb3IgZmFjZXRpbmcuXG4qICAgQWxsIHN0cmluZ3MgaW4gdGhlIGF0dHJpYnV0ZSBzZWxlY3RlZCBmb3IgZmFjZXRpbmcgYXJlIGV4dHJhY3RlZCBhbmQgYWRkZWQgYXMgYSBmYWNldC5cbiogICBJZiBzZXQgdG8gbnVsbCwgbm8gYXR0cmlidXRlIGlzIHVzZWQgZm9yIGZhY2V0aW5nLlxuKiAtIGF0dHJpYnV0ZUZvckRpc3RpbmN0OiAoc3RyaW5nKSBUaGUgYXR0cmlidXRlIG5hbWUgdXNlZCBmb3IgdGhlIERpc3RpbmN0IGZlYXR1cmUuXG4qIFRoaXMgZmVhdHVyZSBpcyBzaW1pbGFyIHRvIHRoZSBTUUwgXCJkaXN0aW5jdFwiIGtleXdvcmQ6IHdoZW4gZW5hYmxlZFxuKiAgIGluIHF1ZXJ5IHdpdGggdGhlIGRpc3RpbmN0PTEgcGFyYW1ldGVyLCBhbGwgaGl0cyBjb250YWluaW5nIGEgZHVwbGljYXRlXG4qICAgdmFsdWUgZm9yIHRoaXMgYXR0cmlidXRlIGFyZSByZW1vdmVkIGZyb20gcmVzdWx0cy5cbiogICBGb3IgZXhhbXBsZSwgaWYgdGhlIGNob3NlbiBhdHRyaWJ1dGUgaXMgc2hvd19uYW1lIGFuZCBzZXZlcmFsIGhpdHMgaGF2ZVxuKiAgIHRoZSBzYW1lIHZhbHVlIGZvciBzaG93X25hbWUsIHRoZW4gb25seSB0aGUgYmVzdCBvbmUgaXMga2VwdCBhbmQgb3RoZXJzIGFyZSByZW1vdmVkLlxuKiAtIHJhbmtpbmc6IChhcnJheSBvZiBzdHJpbmdzKSBjb250cm9scyB0aGUgd2F5IHJlc3VsdHMgYXJlIHNvcnRlZC5cbiogICBXZSBoYXZlIHNpeCBhdmFpbGFibGUgY3JpdGVyaWE6XG4qICAgIC0gdHlwbzogc29ydCBhY2NvcmRpbmcgdG8gbnVtYmVyIG9mIHR5cG9zLFxuKiAgICAtIGdlbzogc29ydCBhY2NvcmRpbmcgdG8gZGVjcmVhc3NpbmcgZGlzdGFuY2Ugd2hlbiBwZXJmb3JtaW5nIGEgZ2VvLWxvY2F0aW9uIGJhc2VkIHNlYXJjaCxcbiogICAgLSBwcm94aW1pdHk6IHNvcnQgYWNjb3JkaW5nIHRvIHRoZSBwcm94aW1pdHkgb2YgcXVlcnkgd29yZHMgaW4gaGl0cyxcbiogICAgLSBhdHRyaWJ1dGU6IHNvcnQgYWNjb3JkaW5nIHRvIHRoZSBvcmRlciBvZiBhdHRyaWJ1dGVzIGRlZmluZWQgYnkgYXR0cmlidXRlc1RvSW5kZXgsXG4qICAgIC0gZXhhY3Q6XG4qICAgICAgICAtIGlmIHRoZSB1c2VyIHF1ZXJ5IGNvbnRhaW5zIG9uZSB3b3JkOiBzb3J0IG9iamVjdHMgaGF2aW5nIGFuIGF0dHJpYnV0ZVxuKiAgICAgICAgdGhhdCBpcyBleGFjdGx5IHRoZSBxdWVyeSB3b3JkIGJlZm9yZSBvdGhlcnMuXG4qICAgICAgICAgIEZvciBleGFtcGxlIGlmIHlvdSBzZWFyY2ggZm9yIHRoZSBcIlZcIiBUViBzaG93LCB5b3Ugd2FudCB0byBmaW5kIGl0XG4qICAgICAgICAgIHdpdGggdGhlIFwiVlwiIHF1ZXJ5IGFuZCBhdm9pZCB0byBoYXZlIGFsbCBwb3B1bGFyIFRWXG4qICAgICAgICAgIHNob3cgc3RhcnRpbmcgYnkgdGhlIHYgbGV0dGVyIGJlZm9yZSBpdC5cbiogICAgICAgIC0gaWYgdGhlIHVzZXIgcXVlcnkgY29udGFpbnMgbXVsdGlwbGUgd29yZHM6IHNvcnQgYWNjb3JkaW5nIHRvIHRoZVxuKiAgICAgICAgbnVtYmVyIG9mIHdvcmRzIHRoYXQgbWF0Y2hlZCBleGFjdGx5IChhbmQgbm90IGFzIGEgcHJlZml4KS5cbiogICAgLSBjdXN0b206IHNvcnQgYWNjb3JkaW5nIHRvIGEgdXNlciBkZWZpbmVkIGZvcm11bGEgc2V0IGluICoqY3VzdG9tUmFua2luZyoqIGF0dHJpYnV0ZS5cbiogICBUaGUgc3RhbmRhcmQgb3JkZXIgaXMgW1widHlwb1wiLCBcImdlb1wiLCBcInByb3hpbWl0eVwiLCBcImF0dHJpYnV0ZVwiLCBcImV4YWN0XCIsIFwiY3VzdG9tXCJdXG4qIC0gY3VzdG9tUmFua2luZzogKGFycmF5IG9mIHN0cmluZ3MpIGxldHMgeW91IHNwZWNpZnkgcGFydCBvZiB0aGUgcmFua2luZy5cbiogICBUaGUgc3ludGF4IG9mIHRoaXMgY29uZGl0aW9uIGlzIGFuIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyBhdHRyaWJ1dGVzXG4qICAgcHJlZml4ZWQgYnkgYXNjIChhc2NlbmRpbmcgb3JkZXIpIG9yIGRlc2MgKGRlc2NlbmRpbmcgb3JkZXIpIG9wZXJhdG9yLlxuKiAgIEZvciBleGFtcGxlIGBcImN1c3RvbVJhbmtpbmdcIiA9PiBbXCJkZXNjKHBvcHVsYXRpb24pXCIsIFwiYXNjKG5hbWUpXCJdYFxuKiAtIHF1ZXJ5VHlwZTogU2VsZWN0IGhvdyB0aGUgcXVlcnkgd29yZHMgYXJlIGludGVycHJldGVkLCBpdCBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWU6XG4qICAgLSBwcmVmaXhBbGw6IGFsbCBxdWVyeSB3b3JkcyBhcmUgaW50ZXJwcmV0ZWQgYXMgcHJlZml4ZXMsXG4qICAgLSBwcmVmaXhMYXN0OiBvbmx5IHRoZSBsYXN0IHdvcmQgaXMgaW50ZXJwcmV0ZWQgYXMgYSBwcmVmaXggKGRlZmF1bHQgYmVoYXZpb3IpLFxuKiAgIC0gcHJlZml4Tm9uZTogbm8gcXVlcnkgd29yZCBpcyBpbnRlcnByZXRlZCBhcyBhIHByZWZpeC4gVGhpcyBvcHRpb24gaXMgbm90IHJlY29tbWVuZGVkLlxuKiAtIGhpZ2hsaWdodFByZVRhZzogKHN0cmluZykgU3BlY2lmeSB0aGUgc3RyaW5nIHRoYXQgaXMgaW5zZXJ0ZWQgYmVmb3JlXG4qIHRoZSBoaWdobGlnaHRlZCBwYXJ0cyBpbiB0aGUgcXVlcnkgcmVzdWx0IChkZWZhdWx0IHRvIFwiPGVtPlwiKS5cbiogLSBoaWdobGlnaHRQb3N0VGFnOiAoc3RyaW5nKSBTcGVjaWZ5IHRoZSBzdHJpbmcgdGhhdCBpcyBpbnNlcnRlZCBhZnRlclxuKiB0aGUgaGlnaGxpZ2h0ZWQgcGFydHMgaW4gdGhlIHF1ZXJ5IHJlc3VsdCAoZGVmYXVsdCB0byBcIjwvZW0+XCIpLlxuKiAtIG9wdGlvbmFsV29yZHM6IChhcnJheSBvZiBzdHJpbmdzKSBTcGVjaWZ5IGEgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZFxuKiBiZSBjb25zaWRlcmVkIGFzIG9wdGlvbmFsIHdoZW4gZm91bmQgaW4gdGhlIHF1ZXJ5LlxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIG9yIHRoZSBlcnJvciBtZXNzYWdlIGlmIGEgZmFpbHVyZSBvY2N1cmVkXG4qL1xuSW5kZXgucHJvdG90eXBlLnNldFNldHRpbmdzID0gZnVuY3Rpb24oc2V0dGluZ3MsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHZhciBmb3J3YXJkVG9TbGF2ZXMgPSBvcHRzLmZvcndhcmRUb1NsYXZlcyB8fCBmYWxzZTtcblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL3NldHRpbmdzP2ZvcndhcmRUb1NsYXZlcz0nXG4gICAgICArIChmb3J3YXJkVG9TbGF2ZXMgPyAndHJ1ZScgOiAnZmFsc2UnKSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBib2R5OiBzZXR0aW5ncyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBMaXN0IGFsbCBleGlzdGluZyB1c2VyIGtleXMgYXNzb2NpYXRlZCB0byB0aGlzIGluZGV4XG4qXG4qIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHdpdGggdXNlciBrZXlzIGxpc3RcbiovXG5JbmRleC5wcm90b3R5cGUubGlzdFVzZXJLZXlzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy9rZXlzJyxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIEdldCBBQ0wgb2YgYSB1c2VyIGtleSBhc3NvY2lhdGVkIHRvIHRoaXMgaW5kZXhcbipcbiogQHBhcmFtIGtleVxuKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4qL1xuSW5kZXgucHJvdG90eXBlLmdldFVzZXJLZXlBQ0wgPSBmdW5jdGlvbihrZXksIGNhbGxiYWNrKSB7XG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcva2V5cy8nICsga2V5LFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogRGVsZXRlIGFuIGV4aXN0aW5nIHVzZXIga2V5IGFzc29jaWF0ZWQgdG8gdGhpcyBpbmRleFxuKlxuKiBAcGFyYW0ga2V5XG4qIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHdpdGggdXNlciBrZXlzIGxpc3RcbiovXG5JbmRleC5wcm90b3R5cGUuZGVsZXRlVXNlcktleSA9IGZ1bmN0aW9uKGtleSwgY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy9rZXlzLycgKyBrZXksXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogQWRkIGEgbmV3IEFQSSBrZXkgdG8gdGhpcyBpbmRleFxuKlxuKiBAcGFyYW0ge3N0cmluZ1tdfSBhY2xzIC0gVGhlIGxpc3Qgb2YgQUNMIGZvciB0aGlzIGtleS4gRGVmaW5lZCBieSBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXRcbiogICBjYW4gY29udGFpbnMgdGhlIGZvbGxvd2luZyB2YWx1ZXM6XG4qICAgICAtIHNlYXJjaDogYWxsb3cgdG8gc2VhcmNoIChodHRwcyBhbmQgaHR0cClcbiogICAgIC0gYWRkT2JqZWN0OiBhbGxvd3MgdG8gYWRkL3VwZGF0ZSBhbiBvYmplY3QgaW4gdGhlIGluZGV4IChodHRwcyBvbmx5KVxuKiAgICAgLSBkZWxldGVPYmplY3QgOiBhbGxvd3MgdG8gZGVsZXRlIGFuIGV4aXN0aW5nIG9iamVjdCAoaHR0cHMgb25seSlcbiogICAgIC0gZGVsZXRlSW5kZXggOiBhbGxvd3MgdG8gZGVsZXRlIGluZGV4IGNvbnRlbnQgKGh0dHBzIG9ubHkpXG4qICAgICAtIHNldHRpbmdzIDogYWxsb3dzIHRvIGdldCBpbmRleCBzZXR0aW5ncyAoaHR0cHMgb25seSlcbiogICAgIC0gZWRpdFNldHRpbmdzIDogYWxsb3dzIHRvIGNoYW5nZSBpbmRleCBzZXR0aW5ncyAoaHR0cHMgb25seSlcbiogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdIC0gT3B0aW9ubmFsIHBhcmFtZXRlcnMgdG8gc2V0IGZvciB0aGUga2V5XG4qIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMudmFsaWRpdHkgLSBOdW1iZXIgb2Ygc2Vjb25kcyBhZnRlciB3aGljaCB0aGUga2V5IHdpbGxcbiogYmUgYXV0b21hdGljYWxseSByZW1vdmVkICgwIG1lYW5zIG5vIHRpbWUgbGltaXQgZm9yIHRoaXMga2V5KVxuKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1heFF1ZXJpZXNQZXJJUFBlckhvdXIgLSBOdW1iZXIgb2YgQVBJIGNhbGxzIGFsbG93ZWQgZnJvbSBhbiBJUCBhZGRyZXNzIHBlciBob3VyXG4qIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5IC0gTnVtYmVyIG9mIGhpdHMgdGhpcyBBUEkga2V5IGNhbiByZXRyaWV2ZSBpbiBvbmUgY2FsbFxuKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmRlc2NyaXB0aW9uIC0gQSBkZXNjcmlwdGlvbiBmb3IgeW91ciBrZXlcbiogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1zLnJlZmVyZXJzIC0gQSBsaXN0IG9mIGF1dGhvcml6ZWQgcmVmZXJlcnNcbiogQHBhcmFtIHtPYmplY3R9IHBhcmFtcy5xdWVyeVBhcmFtZXRlcnMgLSBGb3JjZSB0aGUga2V5IHRvIHVzZSBzcGVjaWZpYyBxdWVyeSBwYXJhbWV0ZXJzXG4qIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHdpdGggdXNlciBrZXlzIGxpc3RcbiogQHJldHVybiB7UHJvbWlzZXx1bmRlZmluZWR9IFJldHVybnMgYSBwcm9taXNlIGlmIG5vIGNhbGxiYWNrIGdpdmVuXG4qIEBleGFtcGxlXG4qIGluZGV4LmFkZFVzZXJLZXkoWydzZWFyY2gnXSwge1xuKiAgIHZhbGlkaXR5OiAzMDAsXG4qICAgbWF4UXVlcmllc1BlcklQUGVySG91cjogMjAwMCxcbiogICBtYXhIaXRzUGVyUXVlcnk6IDMsXG4qICAgZGVzY3JpcHRpb246ICdFYXQgdGhyZWUgZnJ1aXRzJyxcbiogICByZWZlcmVyczogWycqLmFsZ29saWEuY29tJ10sXG4qICAgcXVlcnlQYXJhbWV0ZXJzOiB7XG4qICAgICB0YWdGaWx0ZXJzOiBbJ3B1YmxpYyddLFxuKiAgIH1cbiogfSlcbiogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL3Jlc3RfYXBpI0FkZEluZGV4S2V5fEFsZ29saWEgUkVTVCBBUEkgRG9jdW1lbnRhdGlvbn1cbiovXG5JbmRleC5wcm90b3R5cGUuYWRkVXNlcktleSA9IGZ1bmN0aW9uKGFjbHMsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciB1c2FnZSA9ICdVc2FnZTogaW5kZXguYWRkVXNlcktleShhcnJheU9mQWNsc1ssIHBhcmFtcywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KGFjbHMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICBwYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgdmFyIHBvc3RPYmogPSB7XG4gICAgYWNsOiBhY2xzXG4gIH07XG5cbiAgaWYgKHBhcmFtcykge1xuICAgIHBvc3RPYmoudmFsaWRpdHkgPSBwYXJhbXMudmFsaWRpdHk7XG4gICAgcG9zdE9iai5tYXhRdWVyaWVzUGVySVBQZXJIb3VyID0gcGFyYW1zLm1heFF1ZXJpZXNQZXJJUFBlckhvdXI7XG4gICAgcG9zdE9iai5tYXhIaXRzUGVyUXVlcnkgPSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5O1xuICAgIHBvc3RPYmouZGVzY3JpcHRpb24gPSBwYXJhbXMuZGVzY3JpcHRpb247XG5cbiAgICBpZiAocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycykge1xuICAgICAgcG9zdE9iai5xdWVyeVBhcmFtZXRlcnMgPSB0aGlzLmFzLl9nZXRTZWFyY2hQYXJhbXMocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycywgJycpO1xuICAgIH1cblxuICAgIHBvc3RPYmoucmVmZXJlcnMgPSBwYXJhbXMucmVmZXJlcnM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmluZGV4TmFtZSkgKyAnL2tleXMnLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLyoqXG4qIEFkZCBhbiBleGlzdGluZyB1c2VyIGtleSBhc3NvY2lhdGVkIHRvIHRoaXMgaW5kZXhcbiogQGRlcHJlY2F0ZWQgdXNlIGluZGV4LmFkZFVzZXJLZXkoKVxuKi9cbkluZGV4LnByb3RvdHlwZS5hZGRVc2VyS2V5V2l0aFZhbGlkaXR5ID0gZGVwcmVjYXRlKGZ1bmN0aW9uIGRlcHJlY2F0ZWRBZGRVc2VyS2V5V2l0aFZhbGlkaXR5KGFjbHMsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuYWRkVXNlcktleShhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn0sIGRlcHJlY2F0ZWRNZXNzYWdlKCdpbmRleC5hZGRVc2VyS2V5V2l0aFZhbGlkaXR5KCknLCAnaW5kZXguYWRkVXNlcktleSgpJykpO1xuXG4vKipcbiogVXBkYXRlIGFuIGV4aXN0aW5nIEFQSSBrZXkgb2YgdGhpcyBpbmRleFxuKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byB1cGRhdGVcbiogQHBhcmFtIHtzdHJpbmdbXX0gYWNscyAtIFRoZSBsaXN0IG9mIEFDTCBmb3IgdGhpcyBrZXkuIERlZmluZWQgYnkgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0XG4qICAgY2FuIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuKiAgICAgLSBzZWFyY2g6IGFsbG93IHRvIHNlYXJjaCAoaHR0cHMgYW5kIGh0dHApXG4qICAgICAtIGFkZE9iamVjdDogYWxsb3dzIHRvIGFkZC91cGRhdGUgYW4gb2JqZWN0IGluIHRoZSBpbmRleCAoaHR0cHMgb25seSlcbiogICAgIC0gZGVsZXRlT2JqZWN0IDogYWxsb3dzIHRvIGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3QgKGh0dHBzIG9ubHkpXG4qICAgICAtIGRlbGV0ZUluZGV4IDogYWxsb3dzIHRvIGRlbGV0ZSBpbmRleCBjb250ZW50IChodHRwcyBvbmx5KVxuKiAgICAgLSBzZXR0aW5ncyA6IGFsbG93cyB0byBnZXQgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4qICAgICAtIGVkaXRTZXR0aW5ncyA6IGFsbG93cyB0byBjaGFuZ2UgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4qIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXSAtIE9wdGlvbm5hbCBwYXJhbWV0ZXJzIHRvIHNldCBmb3IgdGhlIGtleVxuKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLnZhbGlkaXR5IC0gTnVtYmVyIG9mIHNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGtleSB3aWxsXG4qIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCAoMCBtZWFucyBubyB0aW1lIGxpbWl0IGZvciB0aGlzIGtleSlcbiogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyIC0gTnVtYmVyIG9mIEFQSSBjYWxscyBhbGxvd2VkIGZyb20gYW4gSVAgYWRkcmVzcyBwZXIgaG91clxuKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1heEhpdHNQZXJRdWVyeSAtIE51bWJlciBvZiBoaXRzIHRoaXMgQVBJIGtleSBjYW4gcmV0cmlldmUgaW4gb25lIGNhbGxcbiogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5kZXNjcmlwdGlvbiAtIEEgZGVzY3JpcHRpb24gZm9yIHlvdXIga2V5XG4qIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtcy5yZWZlcmVycyAtIEEgbGlzdCBvZiBhdXRob3JpemVkIHJlZmVyZXJzXG4qIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMucXVlcnlQYXJhbWV0ZXJzIC0gRm9yY2UgdGhlIGtleSB0byB1c2Ugc3BlY2lmaWMgcXVlcnkgcGFyYW1ldGVyc1xuKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuKiAgIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4qIEByZXR1cm4ge1Byb21pc2V8dW5kZWZpbmVkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBnaXZlblxuKiBAZXhhbXBsZVxuKiBpbmRleC51cGRhdGVVc2VyS2V5KCdBUElLRVknLCBbJ3NlYXJjaCddLCB7XG4qICAgdmFsaWRpdHk6IDMwMCxcbiogICBtYXhRdWVyaWVzUGVySVBQZXJIb3VyOiAyMDAwLFxuKiAgIG1heEhpdHNQZXJRdWVyeTogMyxcbiogICBkZXNjcmlwdGlvbjogJ0VhdCB0aHJlZSBmcnVpdHMnLFxuKiAgIHJlZmVyZXJzOiBbJyouYWxnb2xpYS5jb20nXSxcbiogICBxdWVyeVBhcmFtZXRlcnM6IHtcbiogICAgIHRhZ0ZpbHRlcnM6IFsncHVibGljJ10sXG4qICAgfVxuKiB9KVxuKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5hbGdvbGlhLmNvbS9kb2MvcmVzdF9hcGkjVXBkYXRlSW5kZXhLZXl8QWxnb2xpYSBSRVNUIEFQSSBEb2N1bWVudGF0aW9ufVxuKi9cbkluZGV4LnByb3RvdHlwZS51cGRhdGVVc2VyS2V5ID0gZnVuY3Rpb24oa2V5LCBhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGluZGV4LnVwZGF0ZVVzZXJLZXkoa2V5LCBhcnJheU9mQWNsc1ssIHBhcmFtcywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KGFjbHMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyIHx8IHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICBwYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgdmFyIHB1dE9iaiA9IHtcbiAgICBhY2w6IGFjbHNcbiAgfTtcblxuICBpZiAocGFyYW1zKSB7XG4gICAgcHV0T2JqLnZhbGlkaXR5ID0gcGFyYW1zLnZhbGlkaXR5O1xuICAgIHB1dE9iai5tYXhRdWVyaWVzUGVySVBQZXJIb3VyID0gcGFyYW1zLm1heFF1ZXJpZXNQZXJJUFBlckhvdXI7XG4gICAgcHV0T2JqLm1heEhpdHNQZXJRdWVyeSA9IHBhcmFtcy5tYXhIaXRzUGVyUXVlcnk7XG4gICAgcHV0T2JqLmRlc2NyaXB0aW9uID0gcGFyYW1zLmRlc2NyaXB0aW9uO1xuXG4gICAgaWYgKHBhcmFtcy5xdWVyeVBhcmFtZXRlcnMpIHtcbiAgICAgIHB1dE9iai5xdWVyeVBhcmFtZXRlcnMgPSB0aGlzLmFzLl9nZXRTZWFyY2hQYXJhbXMocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycywgJycpO1xuICAgIH1cblxuICAgIHB1dE9iai5yZWZlcmVycyA9IHBhcmFtcy5yZWZlcmVycztcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9rZXlzLycgKyBrZXksXG4gICAgYm9keTogcHV0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL0luZGV4LmpzIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwidmFyIGJ1aWxkU2VhcmNoTWV0aG9kID0gcmVxdWlyZSgnLi9idWlsZFNlYXJjaE1ldGhvZC5qcycpO1xudmFyIGRlcHJlY2F0ZSA9IHJlcXVpcmUoJy4vZGVwcmVjYXRlLmpzJyk7XG52YXIgZGVwcmVjYXRlZE1lc3NhZ2UgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZWRNZXNzYWdlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5kZXhDb3JlO1xuXG4vKlxuKiBJbmRleCBjbGFzcyBjb25zdHJ1Y3Rvci5cbiogWW91IHNob3VsZCBub3QgdXNlIHRoaXMgbWV0aG9kIGRpcmVjdGx5IGJ1dCB1c2UgaW5pdEluZGV4KCkgZnVuY3Rpb25cbiovXG5mdW5jdGlvbiBJbmRleENvcmUoYWxnb2xpYXNlYXJjaCwgaW5kZXhOYW1lKSB7XG4gIHRoaXMuaW5kZXhOYW1lID0gaW5kZXhOYW1lO1xuICB0aGlzLmFzID0gYWxnb2xpYXNlYXJjaDtcbiAgdGhpcy50eXBlQWhlYWRBcmdzID0gbnVsbDtcbiAgdGhpcy50eXBlQWhlYWRWYWx1ZU9wdGlvbiA9IG51bGw7XG5cbiAgLy8gbWFrZSBzdXJlIGV2ZXJ5IGluZGV4IGluc3RhbmNlIGhhcyBpdCdzIG93biBjYWNoZVxuICB0aGlzLmNhY2hlID0ge307XG59XG5cbi8qXG4qIENsZWFyIGFsbCBxdWVyaWVzIGluIGNhY2hlXG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5jbGVhckNhY2hlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2FjaGUgPSB7fTtcbn07XG5cbi8qXG4qIFNlYXJjaCBpbnNpZGUgdGhlIGluZGV4IHVzaW5nIFhNTEh0dHBSZXF1ZXN0IHJlcXVlc3QgKFVzaW5nIGEgUE9TVCBxdWVyeSB0b1xuKiBtaW5pbWl6ZSBudW1iZXIgb2YgT1BUSU9OUyBxdWVyaWVzOiBDcm9zcy1PcmlnaW4gUmVzb3VyY2UgU2hhcmluZykuXG4qXG4qIEBwYXJhbSBxdWVyeSB0aGUgZnVsbCB0ZXh0IHF1ZXJ5XG4qIEBwYXJhbSBhcmdzIChvcHRpb25hbCkgaWYgc2V0LCBjb250YWlucyBhbiBvYmplY3Qgd2l0aCBxdWVyeSBwYXJhbWV0ZXJzOlxuKiAtIHBhZ2U6IChpbnRlZ2VyKSBQYWdpbmF0aW9uIHBhcmFtZXRlciB1c2VkIHRvIHNlbGVjdCB0aGUgcGFnZSB0byByZXRyaWV2ZS5cbiogICAgICAgICAgICAgICAgICAgUGFnZSBpcyB6ZXJvLWJhc2VkIGFuZCBkZWZhdWx0cyB0byAwLiBUaHVzLFxuKiAgICAgICAgICAgICAgICAgICB0byByZXRyaWV2ZSB0aGUgMTB0aCBwYWdlIHlvdSBuZWVkIHRvIHNldCBwYWdlPTlcbiogLSBoaXRzUGVyUGFnZTogKGludGVnZXIpIFBhZ2luYXRpb24gcGFyYW1ldGVyIHVzZWQgdG8gc2VsZWN0IHRoZSBudW1iZXIgb2YgaGl0cyBwZXIgcGFnZS4gRGVmYXVsdHMgdG8gMjAuXG4qIC0gYXR0cmlidXRlc1RvUmV0cmlldmU6IGEgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIGxpc3Qgb2Ygb2JqZWN0IGF0dHJpYnV0ZXNcbiogeW91IHdhbnQgdG8gcmV0cmlldmUgKGxldCB5b3UgbWluaW1pemUgdGhlIGFuc3dlciBzaXplKS5cbiogICBBdHRyaWJ1dGVzIGFyZSBzZXBhcmF0ZWQgd2l0aCBhIGNvbW1hIChmb3IgZXhhbXBsZSBcIm5hbWUsYWRkcmVzc1wiKS5cbiogICBZb3UgY2FuIGFsc28gdXNlIGFuIGFycmF5IChmb3IgZXhhbXBsZSBbXCJuYW1lXCIsXCJhZGRyZXNzXCJdKS5cbiogICBCeSBkZWZhdWx0LCBhbGwgYXR0cmlidXRlcyBhcmUgcmV0cmlldmVkLiBZb3UgY2FuIGFsc28gdXNlICcqJyB0byByZXRyaWV2ZSBhbGxcbiogICB2YWx1ZXMgd2hlbiBhbiBhdHRyaWJ1dGVzVG9SZXRyaWV2ZSBzZXR0aW5nIGlzIHNwZWNpZmllZCBmb3IgeW91ciBpbmRleC5cbiogLSBhdHRyaWJ1dGVzVG9IaWdobGlnaHQ6IGEgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIGxpc3Qgb2YgYXR0cmlidXRlcyB5b3VcbiogICB3YW50IHRvIGhpZ2hsaWdodCBhY2NvcmRpbmcgdG8gdGhlIHF1ZXJ5LlxuKiAgIEF0dHJpYnV0ZXMgYXJlIHNlcGFyYXRlZCBieSBhIGNvbW1hLiBZb3UgY2FuIGFsc28gdXNlIGFuIGFycmF5IChmb3IgZXhhbXBsZSBbXCJuYW1lXCIsXCJhZGRyZXNzXCJdKS5cbiogICBJZiBhbiBhdHRyaWJ1dGUgaGFzIG5vIG1hdGNoIGZvciB0aGUgcXVlcnksIHRoZSByYXcgdmFsdWUgaXMgcmV0dXJuZWQuXG4qICAgQnkgZGVmYXVsdCBhbGwgaW5kZXhlZCB0ZXh0IGF0dHJpYnV0ZXMgYXJlIGhpZ2hsaWdodGVkLlxuKiAgIFlvdSBjYW4gdXNlIGAqYCBpZiB5b3Ugd2FudCB0byBoaWdobGlnaHQgYWxsIHRleHR1YWwgYXR0cmlidXRlcy5cbiogICBOdW1lcmljYWwgYXR0cmlidXRlcyBhcmUgbm90IGhpZ2hsaWdodGVkLlxuKiAgIEEgbWF0Y2hMZXZlbCBpcyByZXR1cm5lZCBmb3IgZWFjaCBoaWdobGlnaHRlZCBhdHRyaWJ1dGUgYW5kIGNhbiBjb250YWluOlxuKiAgICAgIC0gZnVsbDogaWYgYWxsIHRoZSBxdWVyeSB0ZXJtcyB3ZXJlIGZvdW5kIGluIHRoZSBhdHRyaWJ1dGUsXG4qICAgICAgLSBwYXJ0aWFsOiBpZiBvbmx5IHNvbWUgb2YgdGhlIHF1ZXJ5IHRlcm1zIHdlcmUgZm91bmQsXG4qICAgICAgLSBub25lOiBpZiBub25lIG9mIHRoZSBxdWVyeSB0ZXJtcyB3ZXJlIGZvdW5kLlxuKiAtIGF0dHJpYnV0ZXNUb1NuaXBwZXQ6IGEgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIGxpc3Qgb2YgYXR0cmlidXRlcyB0byBzbmlwcGV0IGFsb25nc2lkZVxuKiB0aGUgbnVtYmVyIG9mIHdvcmRzIHRvIHJldHVybiAoc3ludGF4IGlzIGBhdHRyaWJ1dGVOYW1lOm5iV29yZHNgKS5cbiogICAgQXR0cmlidXRlcyBhcmUgc2VwYXJhdGVkIGJ5IGEgY29tbWEgKEV4YW1wbGU6IGF0dHJpYnV0ZXNUb1NuaXBwZXQ9bmFtZToxMCxjb250ZW50OjEwKS5cbiogICAgWW91IGNhbiBhbHNvIHVzZSBhbiBhcnJheSAoRXhhbXBsZTogYXR0cmlidXRlc1RvU25pcHBldDogWyduYW1lOjEwJywnY29udGVudDoxMCddKS5cbiogICAgQnkgZGVmYXVsdCBubyBzbmlwcGV0IGlzIGNvbXB1dGVkLlxuKiAtIG1pbldvcmRTaXplZm9yMVR5cG86IHRoZSBtaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIGluIGEgcXVlcnkgd29yZCB0byBhY2NlcHQgb25lIHR5cG8gaW4gdGhpcyB3b3JkLlxuKiBEZWZhdWx0cyB0byAzLlxuKiAtIG1pbldvcmRTaXplZm9yMlR5cG9zOiB0aGUgbWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiBhIHF1ZXJ5IHdvcmRcbiogdG8gYWNjZXB0IHR3byB0eXBvcyBpbiB0aGlzIHdvcmQuIERlZmF1bHRzIHRvIDcuXG4qIC0gZ2V0UmFua2luZ0luZm86IGlmIHNldCB0byAxLCB0aGUgcmVzdWx0IGhpdHMgd2lsbCBjb250YWluIHJhbmtpbmdcbiogaW5mb3JtYXRpb24gaW4gX3JhbmtpbmdJbmZvIGF0dHJpYnV0ZS5cbiogLSBhcm91bmRMYXRMbmc6IHNlYXJjaCBmb3IgZW50cmllcyBhcm91bmQgYSBnaXZlblxuKiBsYXRpdHVkZS9sb25naXR1ZGUgKHNwZWNpZmllZCBhcyB0d28gZmxvYXRzIHNlcGFyYXRlZCBieSBhIGNvbW1hKS5cbiogICBGb3IgZXhhbXBsZSBhcm91bmRMYXRMbmc9NDcuMzE2NjY5LDUuMDE2NjcwKS5cbiogICBZb3UgY2FuIHNwZWNpZnkgdGhlIG1heGltdW0gZGlzdGFuY2UgaW4gbWV0ZXJzIHdpdGggdGhlIGFyb3VuZFJhZGl1cyBwYXJhbWV0ZXIgKGluIG1ldGVycylcbiogICBhbmQgdGhlIHByZWNpc2lvbiBmb3IgcmFua2luZyB3aXRoIGFyb3VuZFByZWNpc2lvblxuKiAgIChmb3IgZXhhbXBsZSBpZiB5b3Ugc2V0IGFyb3VuZFByZWNpc2lvbj0xMDAsIHR3byBvYmplY3RzIHRoYXQgYXJlIGRpc3RhbnQgb2ZcbiogICBsZXNzIHRoYW4gMTAwbSB3aWxsIGJlIGNvbnNpZGVyZWQgYXMgaWRlbnRpY2FsIGZvciBcImdlb1wiIHJhbmtpbmcgcGFyYW1ldGVyKS5cbiogICBBdCBpbmRleGluZywgeW91IHNob3VsZCBzcGVjaWZ5IGdlb2xvYyBvZiBhbiBvYmplY3Qgd2l0aCB0aGUgX2dlb2xvYyBhdHRyaWJ1dGVcbiogICAoaW4gdGhlIGZvcm0ge1wiX2dlb2xvY1wiOntcImxhdFwiOjQ4Ljg1MzQwOSwgXCJsbmdcIjoyLjM0ODgwMH19KVxuKiAtIGluc2lkZUJvdW5kaW5nQm94OiBzZWFyY2ggZW50cmllcyBpbnNpZGUgYSBnaXZlbiBhcmVhIGRlZmluZWQgYnkgdGhlIHR3byBleHRyZW1lIHBvaW50c1xuKiBvZiBhIHJlY3RhbmdsZSAoZGVmaW5lZCBieSA0IGZsb2F0czogcDFMYXQscDFMbmcscDJMYXQscDJMbmcpLlxuKiAgIEZvciBleGFtcGxlIGluc2lkZUJvdW5kaW5nQm94PTQ3LjMxNjUsNC45NjY1LDQ3LjM0MjQsNS4wMjAxKS5cbiogICBBdCBpbmRleGluZywgeW91IHNob3VsZCBzcGVjaWZ5IGdlb2xvYyBvZiBhbiBvYmplY3Qgd2l0aCB0aGUgX2dlb2xvYyBhdHRyaWJ1dGVcbiogICAoaW4gdGhlIGZvcm0ge1wiX2dlb2xvY1wiOntcImxhdFwiOjQ4Ljg1MzQwOSwgXCJsbmdcIjoyLjM0ODgwMH19KVxuKiAtIG51bWVyaWNGaWx0ZXJzOiBhIHN0cmluZyB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIG51bWVyaWMgZmlsdGVycyB5b3Ugd2FudCB0b1xuKiBhcHBseSBzZXBhcmF0ZWQgYnkgYSBjb21tYS5cbiogICBUaGUgc3ludGF4IG9mIG9uZSBmaWx0ZXIgaXMgYGF0dHJpYnV0ZU5hbWVgIGZvbGxvd2VkIGJ5IGBvcGVyYW5kYCBmb2xsb3dlZCBieSBgdmFsdWVgLlxuKiAgIFN1cHBvcnRlZCBvcGVyYW5kcyBhcmUgYDxgLCBgPD1gLCBgPWAsIGA+YCBhbmQgYD49YC5cbiogICBZb3UgY2FuIGhhdmUgbXVsdGlwbGUgY29uZGl0aW9ucyBvbiBvbmUgYXR0cmlidXRlIGxpa2UgZm9yIGV4YW1wbGUgbnVtZXJpY0ZpbHRlcnM9cHJpY2U+MTAwLHByaWNlPDEwMDAuXG4qICAgWW91IGNhbiBhbHNvIHVzZSBhbiBhcnJheSAoZm9yIGV4YW1wbGUgbnVtZXJpY0ZpbHRlcnM6IFtcInByaWNlPjEwMFwiLFwicHJpY2U8MTAwMFwiXSkuXG4qIC0gdGFnRmlsdGVyczogZmlsdGVyIHRoZSBxdWVyeSBieSBhIHNldCBvZiB0YWdzLiBZb3UgY2FuIEFORCB0YWdzIGJ5IHNlcGFyYXRpbmcgdGhlbSBieSBjb21tYXMuXG4qICAgVG8gT1IgdGFncywgeW91IG11c3QgYWRkIHBhcmVudGhlc2VzLiBGb3IgZXhhbXBsZSwgdGFncz10YWcxLCh0YWcyLHRhZzMpIG1lYW5zIHRhZzEgQU5EICh0YWcyIE9SIHRhZzMpLlxuKiAgIFlvdSBjYW4gYWxzbyB1c2UgYW4gYXJyYXksIGZvciBleGFtcGxlIHRhZ0ZpbHRlcnM6IFtcInRhZzFcIixbXCJ0YWcyXCIsXCJ0YWczXCJdXVxuKiAgIG1lYW5zIHRhZzEgQU5EICh0YWcyIE9SIHRhZzMpLlxuKiAgIEF0IGluZGV4aW5nLCB0YWdzIHNob3VsZCBiZSBhZGRlZCBpbiB0aGUgX3RhZ3MqKiBhdHRyaWJ1dGVcbiogICBvZiBvYmplY3RzIChmb3IgZXhhbXBsZSB7XCJfdGFnc1wiOltcInRhZzFcIixcInRhZzJcIl19KS5cbiogLSBmYWNldEZpbHRlcnM6IGZpbHRlciB0aGUgcXVlcnkgYnkgYSBsaXN0IG9mIGZhY2V0cy5cbiogICBGYWNldHMgYXJlIHNlcGFyYXRlZCBieSBjb21tYXMgYW5kIGVhY2ggZmFjZXQgaXMgZW5jb2RlZCBhcyBgYXR0cmlidXRlTmFtZTp2YWx1ZWAuXG4qICAgRm9yIGV4YW1wbGU6IGBmYWNldEZpbHRlcnM9Y2F0ZWdvcnk6Qm9vayxhdXRob3I6Sm9obiUyMERvZWAuXG4qICAgWW91IGNhbiBhbHNvIHVzZSBhbiBhcnJheSAoZm9yIGV4YW1wbGUgYFtcImNhdGVnb3J5OkJvb2tcIixcImF1dGhvcjpKb2huJTIwRG9lXCJdYCkuXG4qIC0gZmFjZXRzOiBMaXN0IG9mIG9iamVjdCBhdHRyaWJ1dGVzIHRoYXQgeW91IHdhbnQgdG8gdXNlIGZvciBmYWNldGluZy5cbiogICBDb21tYSBzZXBhcmF0ZWQgbGlzdDogYFwiY2F0ZWdvcnksYXV0aG9yXCJgIG9yIGFycmF5IGBbJ2NhdGVnb3J5JywnYXV0aG9yJ11gXG4qICAgT25seSBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIGluICoqYXR0cmlidXRlc0ZvckZhY2V0aW5nKiogaW5kZXggc2V0dGluZ1xuKiAgIGNhbiBiZSB1c2VkIGluIHRoaXMgcGFyYW1ldGVyLlxuKiAgIFlvdSBjYW4gYWxzbyB1c2UgYCpgIHRvIHBlcmZvcm0gZmFjZXRpbmcgb24gYWxsIGF0dHJpYnV0ZXMgc3BlY2lmaWVkIGluICoqYXR0cmlidXRlc0ZvckZhY2V0aW5nKiouXG4qIC0gcXVlcnlUeXBlOiBzZWxlY3QgaG93IHRoZSBxdWVyeSB3b3JkcyBhcmUgaW50ZXJwcmV0ZWQsIGl0IGNhbiBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZTpcbiogICAgLSBwcmVmaXhBbGw6IGFsbCBxdWVyeSB3b3JkcyBhcmUgaW50ZXJwcmV0ZWQgYXMgcHJlZml4ZXMsXG4qICAgIC0gcHJlZml4TGFzdDogb25seSB0aGUgbGFzdCB3b3JkIGlzIGludGVycHJldGVkIGFzIGEgcHJlZml4IChkZWZhdWx0IGJlaGF2aW9yKSxcbiogICAgLSBwcmVmaXhOb25lOiBubyBxdWVyeSB3b3JkIGlzIGludGVycHJldGVkIGFzIGEgcHJlZml4LiBUaGlzIG9wdGlvbiBpcyBub3QgcmVjb21tZW5kZWQuXG4qIC0gb3B0aW9uYWxXb3JkczogYSBzdHJpbmcgdGhhdCBjb250YWlucyB0aGUgbGlzdCBvZiB3b3JkcyB0aGF0IHNob3VsZFxuKiBiZSBjb25zaWRlcmVkIGFzIG9wdGlvbmFsIHdoZW4gZm91bmQgaW4gdGhlIHF1ZXJ5LlxuKiAgIENvbW1hIHNlcGFyYXRlZCBhbmQgYXJyYXkgYXJlIGFjY2VwdGVkLlxuKiAtIGRpc3RpbmN0OiBJZiBzZXQgdG8gMSwgZW5hYmxlIHRoZSBkaXN0aW5jdCBmZWF0dXJlIChkaXNhYmxlZCBieSBkZWZhdWx0KVxuKiBpZiB0aGUgYXR0cmlidXRlRm9yRGlzdGluY3QgaW5kZXggc2V0dGluZyBpcyBzZXQuXG4qICAgVGhpcyBmZWF0dXJlIGlzIHNpbWlsYXIgdG8gdGhlIFNRTCBcImRpc3RpbmN0XCIga2V5d29yZDogd2hlbiBlbmFibGVkXG4qICAgaW4gYSBxdWVyeSB3aXRoIHRoZSBkaXN0aW5jdD0xIHBhcmFtZXRlcixcbiogICBhbGwgaGl0cyBjb250YWluaW5nIGEgZHVwbGljYXRlIHZhbHVlIGZvciB0aGUgYXR0cmlidXRlRm9yRGlzdGluY3QgYXR0cmlidXRlIGFyZSByZW1vdmVkIGZyb20gcmVzdWx0cy5cbiogICBGb3IgZXhhbXBsZSwgaWYgdGhlIGNob3NlbiBhdHRyaWJ1dGUgaXMgc2hvd19uYW1lIGFuZCBzZXZlcmFsIGhpdHMgaGF2ZVxuKiAgIHRoZSBzYW1lIHZhbHVlIGZvciBzaG93X25hbWUsIHRoZW4gb25seSB0aGUgYmVzdFxuKiAgIG9uZSBpcyBrZXB0IGFuZCBvdGhlcnMgYXJlIHJlbW92ZWQuXG4qIC0gcmVzdHJpY3RTZWFyY2hhYmxlQXR0cmlidXRlczogTGlzdCBvZiBhdHRyaWJ1dGVzIHlvdSB3YW50IHRvIHVzZSBmb3JcbiogdGV4dHVhbCBzZWFyY2ggKG11c3QgYmUgYSBzdWJzZXQgb2YgdGhlIGF0dHJpYnV0ZXNUb0luZGV4IGluZGV4IHNldHRpbmcpXG4qIGVpdGhlciBjb21tYSBzZXBhcmF0ZWQgb3IgYXMgYW4gYXJyYXlcbiogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50czpcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJykuIElmIGZhbHNlLCB0aGUgY29udGVudCBjb250YWlucyB0aGUgZXJyb3IuXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIHJlc3VsdHMuXG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5zZWFyY2ggPSBidWlsZFNlYXJjaE1ldGhvZCgncXVlcnknKTtcblxuLypcbiogLS0gQkVUQSAtLVxuKiBTZWFyY2ggYSByZWNvcmQgc2ltaWxhciB0byB0aGUgcXVlcnkgaW5zaWRlIHRoZSBpbmRleCB1c2luZyBYTUxIdHRwUmVxdWVzdCByZXF1ZXN0IChVc2luZyBhIFBPU1QgcXVlcnkgdG9cbiogbWluaW1pemUgbnVtYmVyIG9mIE9QVElPTlMgcXVlcmllczogQ3Jvc3MtT3JpZ2luIFJlc291cmNlIFNoYXJpbmcpLlxuKlxuKiBAcGFyYW0gcXVlcnkgdGhlIHNpbWlsYXIgcXVlcnlcbiogQHBhcmFtIGFyZ3MgKG9wdGlvbmFsKSBpZiBzZXQsIGNvbnRhaW5zIGFuIG9iamVjdCB3aXRoIHF1ZXJ5IHBhcmFtZXRlcnMuXG4qICAgQWxsIHNlYXJjaCBwYXJhbWV0ZXJzIGFyZSBzdXBwb3J0ZWQgKHNlZSBzZWFyY2ggZnVuY3Rpb24pLCByZXN0cmljdFNlYXJjaGFibGVBdHRyaWJ1dGVzIGFuZCBmYWNldEZpbHRlcnNcbiogICBhcmUgdGhlIHR3byBtb3N0IHVzZWZ1bCB0byByZXN0cmljdCB0aGUgc2ltaWxhciByZXN1bHRzIGFuZCBnZXQgbW9yZSByZWxldmFudCBjb250ZW50XG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5zaW1pbGFyU2VhcmNoID0gYnVpbGRTZWFyY2hNZXRob2QoJ3NpbWlsYXJRdWVyeScpO1xuXG4vKlxuKiBCcm93c2UgaW5kZXggY29udGVudC4gVGhlIHJlc3BvbnNlIGNvbnRlbnQgd2lsbCBoYXZlIGEgYGN1cnNvcmAgcHJvcGVydHkgdGhhdCB5b3UgY2FuIHVzZVxuKiB0byBicm93c2Ugc3Vic2VxdWVudCBwYWdlcyBmb3IgdGhpcyBxdWVyeS4gVXNlIGBpbmRleC5icm93c2VGcm9tKGN1cnNvcilgIHdoZW4geW91IHdhbnQuXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSAtIFRoZSBmdWxsIHRleHQgcXVlcnlcbiogQHBhcmFtIHtPYmplY3R9IFtxdWVyeVBhcmFtZXRlcnNdIC0gQW55IHNlYXJjaCBxdWVyeSBwYXJhbWV0ZXJcbiogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIFRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuKiAgIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHRoZSBicm93c2UgcmVzdWx0XG4qIEByZXR1cm4ge1Byb21pc2V8dW5kZWZpbmVkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBnaXZlblxuKiBAZXhhbXBsZVxuKiBpbmRleC5icm93c2UoJ2Nvb2wgc29uZ3MnLCB7XG4qICAgdGFnRmlsdGVyczogJ3B1YmxpYyxjb21tZW50cycsXG4qICAgaGl0c1BlclBhZ2U6IDUwMFxuKiB9LCBjYWxsYmFjayk7XG4qIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9yZXN0X2FwaSNCcm93c2V8QWxnb2xpYSBSRVNUIEFQSSBEb2N1bWVudGF0aW9ufVxuKi9cbkluZGV4Q29yZS5wcm90b3R5cGUuYnJvd3NlID0gZnVuY3Rpb24ocXVlcnksIHF1ZXJ5UGFyYW1ldGVycywgY2FsbGJhY2spIHtcbiAgdmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZS5qcycpO1xuXG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG5cbiAgdmFyIHBhZ2U7XG4gIHZhciBoaXRzUGVyUGFnZTtcblxuICAvLyB3ZSBjaGVjayB2YXJpYWRpYyBjYWxscyB0aGF0IGFyZSBub3QgdGhlIG9uZSBkZWZpbmVkXG4gIC8vIC5icm93c2UoKS8uYnJvd3NlKGZuKVxuICAvLyA9PiBwYWdlID0gMFxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICBwYWdlID0gMDtcbiAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgICBxdWVyeSA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnbnVtYmVyJykge1xuICAgIC8vIC5icm93c2UoMikvLmJyb3dzZSgyLCAxMCkvLmJyb3dzZSgyLCBmbikvLmJyb3dzZSgyLCAxMCwgZm4pXG4gICAgcGFnZSA9IGFyZ3VtZW50c1swXTtcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGhpdHNQZXJQYWdlID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbMV07XG4gICAgICBoaXRzUGVyUGFnZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcXVlcnkgPSB1bmRlZmluZWQ7XG4gICAgcXVlcnlQYXJhbWV0ZXJzID0gdW5kZWZpbmVkO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgLy8gLmJyb3dzZShxdWVyeVBhcmFtZXRlcnMpLy5icm93c2UocXVlcnlQYXJhbWV0ZXJzLCBjYilcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICAgIHF1ZXJ5UGFyYW1ldGVycyA9IGFyZ3VtZW50c1swXTtcbiAgICBxdWVyeSA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gLmJyb3dzZShxdWVyeSwgY2IpXG4gICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbMV07XG4gICAgcXVlcnlQYXJhbWV0ZXJzID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gb3RoZXJ3aXNlIGl0J3MgYSAuYnJvd3NlKHF1ZXJ5KS8uYnJvd3NlKHF1ZXJ5LCBxdWVyeVBhcmFtZXRlcnMpLy5icm93c2UocXVlcnksIHF1ZXJ5UGFyYW1ldGVycywgY2IpXG5cbiAgLy8gZ2V0IHNlYXJjaCBxdWVyeSBwYXJhbWV0ZXJzIGNvbWJpbmluZyB2YXJpb3VzIHBvc3NpYmxlIGNhbGxzXG4gIC8vIHRvIC5icm93c2UoKTtcbiAgcXVlcnlQYXJhbWV0ZXJzID0gbWVyZ2Uoe30sIHF1ZXJ5UGFyYW1ldGVycyB8fCB7fSwge1xuICAgIHBhZ2U6IHBhZ2UsXG4gICAgaGl0c1BlclBhZ2U6IGhpdHNQZXJQYWdlLFxuICAgIHF1ZXJ5OiBxdWVyeVxuICB9KTtcblxuICB2YXIgcGFyYW1zID0gdGhpcy5hcy5fZ2V0U2VhcmNoUGFyYW1zKHF1ZXJ5UGFyYW1ldGVycywgJycpO1xuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvYnJvd3NlPycgKyBwYXJhbXMsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBDb250aW51ZSBicm93c2luZyBmcm9tIGEgcHJldmlvdXMgcG9zaXRpb24gKGN1cnNvciksIG9idGFpbmVkIHZpYSBhIGNhbGwgdG8gYC5icm93c2UoKWAuXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBxdWVyeSAtIFRoZSBmdWxsIHRleHQgcXVlcnlcbiogQHBhcmFtIHtPYmplY3R9IFtxdWVyeVBhcmFtZXRlcnNdIC0gQW55IHNlYXJjaCBxdWVyeSBwYXJhbWV0ZXJcbiogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSAtIFRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuKiAgIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHRoZSBicm93c2UgcmVzdWx0XG4qIEByZXR1cm4ge1Byb21pc2V8dW5kZWZpbmVkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBnaXZlblxuKiBAZXhhbXBsZVxuKiBpbmRleC5icm93c2VGcm9tKCcxNGxrZnNha2wzMicsIGNhbGxiYWNrKTtcbiogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL3Jlc3RfYXBpI0Jyb3dzZXxBbGdvbGlhIFJFU1QgQVBJIERvY3VtZW50YXRpb259XG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5icm93c2VGcm9tID0gZnVuY3Rpb24oY3Vyc29yLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvYnJvd3NlP2N1cnNvcj0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGN1cnNvciksXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBTZWFyY2ggZm9yIGZhY2V0IHZhbHVlc1xuKiBodHRwczovL3d3dy5hbGdvbGlhLmNvbS9kb2MvcmVzdC1hcGkvc2VhcmNoI3NlYXJjaC1mb3ItZmFjZXQtdmFsdWVzXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuZmFjZXROYW1lIEZhY2V0IG5hbWUsIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBzZWFyY2ggZm9yIHZhbHVlcyBpbi5cbiogTXVzdCBiZSBkZWNsYXJlZCBhcyBhIGZhY2V0XG4qIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuZmFjZXRRdWVyeSBRdWVyeSBmb3IgdGhlIGZhY2V0IHNlYXJjaFxuKiBAcGFyYW0ge3N0cmluZ30gW3BhcmFtcy4qXSBBbnkgc2VhcmNoIHBhcmFtZXRlciBvZiBBbGdvbGlhLFxuKiBzZWUgaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL2FwaS1jbGllbnQvamF2YXNjcmlwdC9zZWFyY2gjc2VhcmNoLXBhcmFtZXRlcnNcbiogUGFnaW5hdGlvbiBpcyBub3Qgc3VwcG9ydGVkLiBUaGUgcGFnZSBhbmQgaGl0c1BlclBhZ2UgcGFyYW1ldGVycyB3aWxsIGJlIGlnbm9yZWQuXG4qIEBwYXJhbSBjYWxsYmFjayAob3B0aW9uYWwpXG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5zZWFyY2hGb3JGYWNldFZhbHVlcyA9IGZ1bmN0aW9uKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgdmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZS5qcycpO1xuICB2YXIgb21pdCA9IHJlcXVpcmUoJy4vb21pdC5qcycpO1xuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGluZGV4LnNlYXJjaEZvckZhY2V0VmFsdWVzKHtmYWNldE5hbWUsIGZhY2V0UXVlcnksIC4uLnBhcmFtc31bLCBjYWxsYmFja10pJztcblxuICBpZiAocGFyYW1zLmZhY2V0TmFtZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5mYWNldFF1ZXJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgdmFyIGZhY2V0TmFtZSA9IHBhcmFtcy5mYWNldE5hbWU7XG4gIHZhciBmaWx0ZXJlZFBhcmFtcyA9IG9taXQoY2xvbmUocGFyYW1zKSwgZnVuY3Rpb24oa2V5TmFtZSkge1xuICAgIHJldHVybiBrZXlOYW1lID09PSAnZmFjZXROYW1lJztcbiAgfSk7XG4gIHZhciBzZWFyY2hQYXJhbWV0ZXJzID0gdGhpcy5hcy5fZ2V0U2VhcmNoUGFyYW1zKGZpbHRlcmVkUGFyYW1zLCAnJyk7XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvZmFjZXRzLycgKyBlbmNvZGVVUklDb21wb25lbnQoZmFjZXROYW1lKSArICcvcXVlcnknLFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgYm9keToge3BhcmFtczogc2VhcmNoUGFyYW1ldGVyc30sXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuSW5kZXhDb3JlLnByb3RvdHlwZS5zZWFyY2hGYWNldCA9IGRlcHJlY2F0ZShmdW5jdGlvbihwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLnNlYXJjaEZvckZhY2V0VmFsdWVzKHBhcmFtcywgY2FsbGJhY2spO1xufSwgZGVwcmVjYXRlZE1lc3NhZ2UoXG4gICdpbmRleC5zZWFyY2hGYWNldChwYXJhbXNbLCBjYWxsYmFja10pJyxcbiAgJ2luZGV4LnNlYXJjaEZvckZhY2V0VmFsdWVzKHBhcmFtc1ssIGNhbGxiYWNrXSknXG4pKTtcblxuSW5kZXhDb3JlLnByb3RvdHlwZS5fc2VhcmNoID0gZnVuY3Rpb24ocGFyYW1zLCB1cmwsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgY2FjaGU6IHRoaXMuY2FjaGUsXG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiB1cmwgfHwgJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmluZGV4TmFtZSkgKyAnL3F1ZXJ5JyxcbiAgICBib2R5OiB7cGFyYW1zOiBwYXJhbXN9LFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgZmFsbGJhY2s6IHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpLFxuICAgICAgYm9keToge3BhcmFtczogcGFyYW1zfVxuICAgIH0sXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogR2V0IGFuIG9iamVjdCBmcm9tIHRoaXMgaW5kZXhcbipcbiogQHBhcmFtIG9iamVjdElEIHRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgb2JqZWN0IHRvIHJldHJpZXZlXG4qIEBwYXJhbSBhdHRycyAob3B0aW9uYWwpIGlmIHNldCwgY29udGFpbnMgdGhlIGFycmF5IG9mIGF0dHJpYnV0ZSBuYW1lcyB0byByZXRyaWV2ZVxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBvYmplY3QgdG8gcmV0cmlldmUgb3IgdGhlIGVycm9yIG1lc3NhZ2UgaWYgYSBmYWlsdXJlIG9jY3VyZWRcbiovXG5JbmRleENvcmUucHJvdG90eXBlLmdldE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdElELCBhdHRycywgY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2YgYXR0cnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGF0dHJzO1xuICAgIGF0dHJzID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIHBhcmFtcyA9ICcnO1xuICBpZiAoYXR0cnMgIT09IHVuZGVmaW5lZCkge1xuICAgIHBhcmFtcyA9ICc/YXR0cmlidXRlcz0nO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgIHBhcmFtcyArPSAnLCc7XG4gICAgICB9XG4gICAgICBwYXJhbXMgKz0gYXR0cnNbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9iamVjdElEKSArIHBhcmFtcyxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIEdldCBzZXZlcmFsIG9iamVjdHMgZnJvbSB0aGlzIGluZGV4XG4qXG4qIEBwYXJhbSBvYmplY3RJRHMgdGhlIGFycmF5IG9mIHVuaXF1ZSBpZGVudGlmaWVyIG9mIG9iamVjdHMgdG8gcmV0cmlldmVcbiovXG5JbmRleENvcmUucHJvdG90eXBlLmdldE9iamVjdHMgPSBmdW5jdGlvbihvYmplY3RJRHMsIGF0dHJpYnV0ZXNUb1JldHJpZXZlLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XG5cbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC5nZXRPYmplY3RzKGFycmF5T2ZPYmplY3RJRHNbLCBjYWxsYmFja10pJztcblxuICBpZiAoIWlzQXJyYXkob2JqZWN0SURzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBhdHRyaWJ1dGVzVG9SZXRyaWV2ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gYXR0cmlidXRlc1RvUmV0cmlldmU7XG4gICAgYXR0cmlidXRlc1RvUmV0cmlldmUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgYm9keSA9IHtcbiAgICByZXF1ZXN0czogbWFwKG9iamVjdElEcywgZnVuY3Rpb24gcHJlcGFyZVJlcXVlc3Qob2JqZWN0SUQpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICBpbmRleE5hbWU6IGluZGV4T2JqLmluZGV4TmFtZSxcbiAgICAgICAgb2JqZWN0SUQ6IG9iamVjdElEXG4gICAgICB9O1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1RvUmV0cmlldmUpIHtcbiAgICAgICAgcmVxdWVzdC5hdHRyaWJ1dGVzVG9SZXRyaWV2ZSA9IGF0dHJpYnV0ZXNUb1JldHJpZXZlLmpvaW4oJywnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfSlcbiAgfTtcblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvKi9vYmplY3RzJyxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGJvZHk6IGJvZHksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuSW5kZXhDb3JlLnByb3RvdHlwZS5hcyA9IG51bGw7XG5JbmRleENvcmUucHJvdG90eXBlLmluZGV4TmFtZSA9IG51bGw7XG5JbmRleENvcmUucHJvdG90eXBlLnR5cGVBaGVhZEFyZ3MgPSBudWxsO1xuSW5kZXhDb3JlLnByb3RvdHlwZS50eXBlQWhlYWRWYWx1ZU9wdGlvbiA9IG51bGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL0luZGV4Q29yZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gYnVpbGRTZWFyY2hNZXRob2Q7XG5cbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG5mdW5jdGlvbiBidWlsZFNlYXJjaE1ldGhvZChxdWVyeVBhcmFtLCB1cmwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHNlYXJjaChxdWVyeSwgYXJncywgY2FsbGJhY2spIHtcbiAgICAvLyB3YXJuIFYyIHVzZXJzIG9uIGhvdyB0byBzZWFyY2hcbiAgICBpZiAodHlwZW9mIHF1ZXJ5ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBhcmdzID09PSAnb2JqZWN0JyB8fFxuICAgICAgdHlwZW9mIGNhbGxiYWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgLy8gLnNlYXJjaChxdWVyeSwgcGFyYW1zLCBjYilcbiAgICAgIC8vIC5zZWFyY2goY2IsIHBhcmFtcylcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKCdpbmRleC5zZWFyY2ggdXNhZ2UgaXMgaW5kZXguc2VhcmNoKHF1ZXJ5LCBwYXJhbXMsIGNiKScpO1xuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBxdWVyeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gLnNlYXJjaCgpLCAuc2VhcmNoKGNiKVxuICAgICAgY2FsbGJhY2sgPSBxdWVyeTtcbiAgICAgIHF1ZXJ5ID0gJyc7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBhcmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyAuc2VhcmNoKHF1ZXJ5L2FyZ3MpLCAuc2VhcmNoKHF1ZXJ5LCBjYilcbiAgICAgIGNhbGxiYWNrID0gYXJncztcbiAgICAgIGFyZ3MgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gLnNlYXJjaChhcmdzKSwgY2FyZWZ1bDogdHlwZW9mIG51bGwgPT09ICdvYmplY3QnXG4gICAgaWYgKHR5cGVvZiBxdWVyeSA9PT0gJ29iamVjdCcgJiYgcXVlcnkgIT09IG51bGwpIHtcbiAgICAgIGFyZ3MgPSBxdWVyeTtcbiAgICAgIHF1ZXJ5ID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAocXVlcnkgPT09IHVuZGVmaW5lZCB8fCBxdWVyeSA9PT0gbnVsbCkgeyAvLyAuc2VhcmNoKHVuZGVmaW5lZC9udWxsKVxuICAgICAgcXVlcnkgPSAnJztcbiAgICB9XG5cbiAgICB2YXIgcGFyYW1zID0gJyc7XG5cbiAgICBpZiAocXVlcnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcGFyYW1zICs9IHF1ZXJ5UGFyYW0gKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocXVlcnkpO1xuICAgIH1cblxuICAgIGlmIChhcmdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGBfZ2V0U2VhcmNoUGFyYW1zYCB3aWxsIGF1Z21lbnQgcGFyYW1zLCBkbyBub3QgYmUgZm9vbGVkIGJ5IHRoZSA9IHZlcnN1cyArPSBmcm9tIHByZXZpb3VzIGlmXG4gICAgICBwYXJhbXMgPSB0aGlzLmFzLl9nZXRTZWFyY2hQYXJhbXMoYXJncywgcGFyYW1zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2VhcmNoKHBhcmFtcywgdXJsLCBjYWxsYmFjayk7XG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2J1aWxkU2VhcmNoTWV0aG9kLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGlzIGZpbGUgaG9zdHMgb3VyIGVycm9yIGRlZmluaXRpb25zXG4vLyBXZSB1c2UgY3VzdG9tIGVycm9yIFwidHlwZXNcIiBzbyB0aGF0IHdlIGNhbiBhY3Qgb24gdGhlbSB3aGVuIHdlIG5lZWQgaXRcbi8vIGUuZy46IGlmIGVycm9yIGluc3RhbmNlb2YgZXJyb3JzLlVucGFyc2FibGVKU09OIHRoZW4uLlxuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5mdW5jdGlvbiBBbGdvbGlhU2VhcmNoRXJyb3IobWVzc2FnZSwgZXh0cmFQcm9wZXJ0aWVzKSB7XG4gIHZhciBmb3JFYWNoID0gcmVxdWlyZSgnZm9yZWFjaCcpO1xuXG4gIHZhciBlcnJvciA9IHRoaXM7XG5cbiAgLy8gdHJ5IHRvIGdldCBhIHN0YWNrdHJhY2VcbiAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICB9IGVsc2Uge1xuICAgIGVycm9yLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjayB8fCAnQ2Fubm90IGdldCBhIHN0YWNrdHJhY2UsIGJyb3dzZXIgaXMgdG9vIG9sZCc7XG4gIH1cblxuICB0aGlzLm5hbWUgPSAnQWxnb2xpYVNlYXJjaEVycm9yJztcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcic7XG5cbiAgaWYgKGV4dHJhUHJvcGVydGllcykge1xuICAgIGZvckVhY2goZXh0cmFQcm9wZXJ0aWVzLCBmdW5jdGlvbiBhZGRUb0Vycm9yT2JqZWN0KHZhbHVlLCBrZXkpIHtcbiAgICAgIGVycm9yW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxufVxuXG5pbmhlcml0cyhBbGdvbGlhU2VhcmNoRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gY3JlYXRlQ3VzdG9tRXJyb3IobmFtZSwgbWVzc2FnZSkge1xuICBmdW5jdGlvbiBBbGdvbGlhU2VhcmNoQ3VzdG9tRXJyb3IoKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgLy8gY3VzdG9tIG1lc3NhZ2Ugbm90IHNldCwgdXNlIGRlZmF1bHRcbiAgICBpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnKSB7XG4gICAgICBhcmdzLnVuc2hpZnQobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgQWxnb2xpYVNlYXJjaEVycm9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIHRoaXMubmFtZSA9ICdBbGdvbGlhU2VhcmNoJyArIG5hbWUgKyAnRXJyb3InO1xuICB9XG5cbiAgaW5oZXJpdHMoQWxnb2xpYVNlYXJjaEN1c3RvbUVycm9yLCBBbGdvbGlhU2VhcmNoRXJyb3IpO1xuXG4gIHJldHVybiBBbGdvbGlhU2VhcmNoQ3VzdG9tRXJyb3I7XG59XG5cbi8vIGxhdGUgZXhwb3J0cyB0byBsZXQgdmFyaW91cyBmbiBkZWZzIGFuZCBpbmhlcml0cyB0YWtlIHBsYWNlXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWxnb2xpYVNlYXJjaEVycm9yOiBBbGdvbGlhU2VhcmNoRXJyb3IsXG4gIFVucGFyc2FibGVKU09OOiBjcmVhdGVDdXN0b21FcnJvcihcbiAgICAnVW5wYXJzYWJsZUpTT04nLFxuICAgICdDb3VsZCBub3QgcGFyc2UgdGhlIGluY29taW5nIHJlc3BvbnNlIGFzIEpTT04sIHNlZSBlcnIubW9yZSBmb3IgZGV0YWlscydcbiAgKSxcbiAgUmVxdWVzdFRpbWVvdXQ6IGNyZWF0ZUN1c3RvbUVycm9yKFxuICAgICdSZXF1ZXN0VGltZW91dCcsXG4gICAgJ1JlcXVlc3QgdGltZWRvdXQgYmVmb3JlIGdldHRpbmcgYSByZXNwb25zZSdcbiAgKSxcbiAgTmV0d29yazogY3JlYXRlQ3VzdG9tRXJyb3IoXG4gICAgJ05ldHdvcmsnLFxuICAgICdOZXR3b3JrIGlzc3VlLCBzZWUgZXJyLm1vcmUgZm9yIGRldGFpbHMnXG4gICksXG4gIEpTT05QU2NyaXB0RmFpbDogY3JlYXRlQ3VzdG9tRXJyb3IoXG4gICAgJ0pTT05QU2NyaXB0RmFpbCcsXG4gICAgJzxzY3JpcHQ+IHdhcyBsb2FkZWQgYnV0IGRpZCBub3QgY2FsbCBvdXIgcHJvdmlkZWQgY2FsbGJhY2snXG4gICksXG4gIEpTT05QU2NyaXB0RXJyb3I6IGNyZWF0ZUN1c3RvbUVycm9yKFxuICAgICdKU09OUFNjcmlwdEVycm9yJyxcbiAgICAnPHNjcmlwdD4gdW5hYmxlIHRvIGxvYWQgZHVlIHRvIGFuIGBlcnJvcmAgZXZlbnQgb24gaXQnXG4gICksXG4gIFVua25vd246IGNyZWF0ZUN1c3RvbUVycm9yKFxuICAgICdVbmtub3duJyxcbiAgICAnVW5rbm93biBlcnJvciBvY2N1cmVkJ1xuICApXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9lcnJvcnMuanMiLCJcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChvYmosIGZuLCBjdHgpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChmbikgIT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIHZhciBsID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobCA9PT0gK2wpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGZuLmNhbGwoY3R4LCBvYmpbaV0sIGksIG9iaik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKG9iaiwgaykpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGN0eCwgb2JqW2tdLCBrLCBvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vZm9yZWFjaC9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVwcmVjYXRlKGZuLCBtZXNzYWdlKSB7XG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICAvKiBlc2xpbnQgbm8tY29uc29sZTowICovXG4gICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2RlcHJlY2F0ZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVwcmVjYXRlZE1lc3NhZ2UocHJldmlvdXNVc2FnZSwgbmV3VXNhZ2UpIHtcbiAgdmFyIGdpdGh1YkFuY2hvckxpbmsgPSBwcmV2aW91c1VzYWdlLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgnLicsICcnKVxuICAgIC5yZXBsYWNlKCcoKScsICcnKTtcblxuICByZXR1cm4gJ2FsZ29saWFzZWFyY2g6IGAnICsgcHJldmlvdXNVc2FnZSArICdgIHdhcyByZXBsYWNlZCBieSBgJyArIG5ld1VzYWdlICtcbiAgICAnYC4gUGxlYXNlIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYWxnb2xpYS9hbGdvbGlhc2VhcmNoLWNsaWVudC1qcy93aWtpL0RlcHJlY2F0ZWQjJyArIGdpdGh1YkFuY2hvckxpbms7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9kZXByZWNhdGVkTWVzc2FnZS5qcyIsInZhciBmb3JlYWNoID0gcmVxdWlyZSgnZm9yZWFjaCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlKGRlc3RpbmF0aW9uLyogLCBzb3VyY2VzICovKSB7XG4gIHZhciBzb3VyY2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICBmb3JlYWNoKHNvdXJjZXMsIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIGZvciAodmFyIGtleU5hbWUgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleU5hbWUpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGVzdGluYXRpb25ba2V5TmFtZV0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBzb3VyY2Vba2V5TmFtZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgZGVzdGluYXRpb25ba2V5TmFtZV0gPSBtZXJnZSh7fSwgZGVzdGluYXRpb25ba2V5TmFtZV0sIHNvdXJjZVtrZXlOYW1lXSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlW2tleU5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkZXN0aW5hdGlvbltrZXlOYW1lXSA9IHNvdXJjZVtrZXlOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvbWVyZ2UuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Nsb25lLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbWl0KG9iaiwgdGVzdCkge1xuICB2YXIga2V5cyA9IHJlcXVpcmUoJ29iamVjdC1rZXlzJyk7XG4gIHZhciBmb3JlYWNoID0gcmVxdWlyZSgnZm9yZWFjaCcpO1xuXG4gIHZhciBmaWx0ZXJlZCA9IHt9O1xuXG4gIGZvcmVhY2goa2V5cyhvYmopLCBmdW5jdGlvbiBkb0ZpbHRlcihrZXlOYW1lKSB7XG4gICAgaWYgKHRlc3Qoa2V5TmFtZSkgIT09IHRydWUpIHtcbiAgICAgIGZpbHRlcmVkW2tleU5hbWVdID0gb2JqW2tleU5hbWVdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGZpbHRlcmVkO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvb21pdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuLy8gbW9kaWZpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW1cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBpc0FyZ3MgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyk7XG52YXIgaXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBoYXNEb250RW51bUJ1ZyA9ICFpc0VudW1lcmFibGUuY2FsbCh7IHRvU3RyaW5nOiBudWxsIH0sICd0b1N0cmluZycpO1xudmFyIGhhc1Byb3RvRW51bUJ1ZyA9IGlzRW51bWVyYWJsZS5jYWxsKGZ1bmN0aW9uICgpIHt9LCAncHJvdG90eXBlJyk7XG52YXIgZG9udEVudW1zID0gW1xuXHQndG9TdHJpbmcnLFxuXHQndG9Mb2NhbGVTdHJpbmcnLFxuXHQndmFsdWVPZicsXG5cdCdoYXNPd25Qcm9wZXJ0eScsXG5cdCdpc1Byb3RvdHlwZU9mJyxcblx0J3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcblx0J2NvbnN0cnVjdG9yJ1xuXTtcbnZhciBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSA9IGZ1bmN0aW9uIChvKSB7XG5cdHZhciBjdG9yID0gby5jb25zdHJ1Y3Rvcjtcblx0cmV0dXJuIGN0b3IgJiYgY3Rvci5wcm90b3R5cGUgPT09IG87XG59O1xudmFyIGV4Y2x1ZGVkS2V5cyA9IHtcblx0JGNvbnNvbGU6IHRydWUsXG5cdCRleHRlcm5hbDogdHJ1ZSxcblx0JGZyYW1lOiB0cnVlLFxuXHQkZnJhbWVFbGVtZW50OiB0cnVlLFxuXHQkZnJhbWVzOiB0cnVlLFxuXHQkaW5uZXJIZWlnaHQ6IHRydWUsXG5cdCRpbm5lcldpZHRoOiB0cnVlLFxuXHQkb3V0ZXJIZWlnaHQ6IHRydWUsXG5cdCRvdXRlcldpZHRoOiB0cnVlLFxuXHQkcGFnZVhPZmZzZXQ6IHRydWUsXG5cdCRwYWdlWU9mZnNldDogdHJ1ZSxcblx0JHBhcmVudDogdHJ1ZSxcblx0JHNjcm9sbExlZnQ6IHRydWUsXG5cdCRzY3JvbGxUb3A6IHRydWUsXG5cdCRzY3JvbGxYOiB0cnVlLFxuXHQkc2Nyb2xsWTogdHJ1ZSxcblx0JHNlbGY6IHRydWUsXG5cdCR3ZWJraXRJbmRleGVkREI6IHRydWUsXG5cdCR3ZWJraXRTdG9yYWdlSW5mbzogdHJ1ZSxcblx0JHdpbmRvdzogdHJ1ZVxufTtcbnZhciBoYXNBdXRvbWF0aW9uRXF1YWxpdHlCdWcgPSAoZnVuY3Rpb24gKCkge1xuXHQvKiBnbG9iYWwgd2luZG93ICovXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZmFsc2U7IH1cblx0Zm9yICh2YXIgayBpbiB3aW5kb3cpIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKCFleGNsdWRlZEtleXNbJyQnICsga10gJiYgaGFzLmNhbGwod2luZG93LCBrKSAmJiB3aW5kb3dba10gIT09IG51bGwgJiYgdHlwZW9mIHdpbmRvd1trXSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSh3aW5kb3dba10pO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufSgpKTtcbnZhciBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZUlmTm90QnVnZ3kgPSBmdW5jdGlvbiAobykge1xuXHQvKiBnbG9iYWwgd2luZG93ICovXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAhaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnKSB7XG5cdFx0cmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG8pO1xuXHR9XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG8pO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xuXG52YXIga2V5c1NoaW0gPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXHR2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG5cdHZhciBpc0Z1bmN0aW9uID0gdG9TdHIuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR2YXIgaXNBcmd1bWVudHMgPSBpc0FyZ3Mob2JqZWN0KTtcblx0dmFyIGlzU3RyaW5nID0gaXNPYmplY3QgJiYgdG9TdHIuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBTdHJpbmddJztcblx0dmFyIHRoZUtleXMgPSBbXTtcblxuXHRpZiAoIWlzT2JqZWN0ICYmICFpc0Z1bmN0aW9uICYmICFpc0FyZ3VtZW50cykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBhIG5vbi1vYmplY3QnKTtcblx0fVxuXG5cdHZhciBza2lwUHJvdG8gPSBoYXNQcm90b0VudW1CdWcgJiYgaXNGdW5jdGlvbjtcblx0aWYgKGlzU3RyaW5nICYmIG9iamVjdC5sZW5ndGggPiAwICYmICFoYXMuY2FsbChvYmplY3QsIDApKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3QubGVuZ3RoOyArK2kpIHtcblx0XHRcdHRoZUtleXMucHVzaChTdHJpbmcoaSkpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChpc0FyZ3VtZW50cyAmJiBvYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgb2JqZWN0Lmxlbmd0aDsgKytqKSB7XG5cdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKGopKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcblx0XHRcdGlmICghKHNraXBQcm90byAmJiBuYW1lID09PSAncHJvdG90eXBlJykgJiYgaGFzLmNhbGwob2JqZWN0LCBuYW1lKSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKG5hbWUpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoaGFzRG9udEVudW1CdWcpIHtcblx0XHR2YXIgc2tpcENvbnN0cnVjdG9yID0gZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5KG9iamVjdCk7XG5cblx0XHRmb3IgKHZhciBrID0gMDsgayA8IGRvbnRFbnVtcy5sZW5ndGg7ICsraykge1xuXHRcdFx0aWYgKCEoc2tpcENvbnN0cnVjdG9yICYmIGRvbnRFbnVtc1trXSA9PT0gJ2NvbnN0cnVjdG9yJykgJiYgaGFzLmNhbGwob2JqZWN0LCBkb250RW51bXNba10pKSB7XG5cdFx0XHRcdHRoZUtleXMucHVzaChkb250RW51bXNba10pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGhlS2V5cztcbn07XG5cbmtleXNTaGltLnNoaW0gPSBmdW5jdGlvbiBzaGltT2JqZWN0S2V5cygpIHtcblx0aWYgKE9iamVjdC5rZXlzKSB7XG5cdFx0dmFyIGtleXNXb3Jrc1dpdGhBcmd1bWVudHMgPSAoZnVuY3Rpb24gKCkge1xuXHRcdFx0Ly8gU2FmYXJpIDUuMCBidWdcblx0XHRcdHJldHVybiAoT2JqZWN0LmtleXMoYXJndW1lbnRzKSB8fCAnJykubGVuZ3RoID09PSAyO1xuXHRcdH0oMSwgMikpO1xuXHRcdGlmICgha2V5c1dvcmtzV2l0aEFyZ3VtZW50cykge1xuXHRcdFx0dmFyIG9yaWdpbmFsS2V5cyA9IE9iamVjdC5rZXlzO1xuXHRcdFx0T2JqZWN0LmtleXMgPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXHRcdFx0XHRpZiAoaXNBcmdzKG9iamVjdCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3JpZ2luYWxLZXlzKHNsaWNlLmNhbGwob2JqZWN0KSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsS2V5cyhvYmplY3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRPYmplY3Qua2V5cyA9IGtleXNTaGltO1xuXHR9XG5cdHJldHVybiBPYmplY3Qua2V5cyB8fCBrZXlzU2hpbTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c1NoaW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9vYmplY3Qta2V5cy9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuXHR2YXIgc3RyID0gdG9TdHIuY2FsbCh2YWx1ZSk7XG5cdHZhciBpc0FyZ3MgPSBzdHIgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXHRpZiAoIWlzQXJncykge1xuXHRcdGlzQXJncyA9IHN0ciAhPT0gJ1tvYmplY3QgQXJyYXldJyAmJlxuXHRcdFx0dmFsdWUgIT09IG51bGwgJiZcblx0XHRcdHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcblx0XHRcdHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInICYmXG5cdFx0XHR2YWx1ZS5sZW5ndGggPj0gMCAmJlxuXHRcdFx0dG9TdHIuY2FsbCh2YWx1ZS5jYWxsZWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR9XG5cdHJldHVybiBpc0FyZ3M7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vb2JqZWN0LWtleXMvaXNBcmd1bWVudHMuanMiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L2lzYXJyYXkvaW5kZXguanMiLCJ2YXIgZm9yZWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICB2YXIgbmV3QXJyID0gW107XG4gIGZvcmVhY2goYXJyLCBmdW5jdGlvbihpdGVtLCBpdGVtSW5kZXgpIHtcbiAgICBuZXdBcnIucHVzaChmbihpdGVtLCBpdGVtSW5kZXgsIGFycikpO1xuICB9KTtcbiAgcmV0dXJuIG5ld0Fycjtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL21hcC5qcyIsIi8vIFBhcnNlIGNsb3VkIGRvZXMgbm90IHN1cHBvcnRzIHNldFRpbWVvdXRcbi8vIFdlIGRvIG5vdCBzdG9yZSBhIHNldFRpbWVvdXQgcmVmZXJlbmNlIGluIHRoZSBjbGllbnQgZXZlcnl0aW1lXG4vLyBXZSBvbmx5IGZhbGxiYWNrIHRvIGEgZmFrZSBzZXRUaW1lb3V0IHdoZW4gbm90IGF2YWlsYWJsZVxuLy8gc2V0VGltZW91dCBjYW5ub3QgYmUgb3ZlcnJpZGUgZ2xvYmFsbHkgc2FkbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXhpdFByb21pc2UoZm4sIF9zZXRUaW1lb3V0KSB7XG4gIF9zZXRUaW1lb3V0KGZuLCAwKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2V4aXRQcm9taXNlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGlzIGlzIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIGBpbmRleC5icm93c2VBbGwoKWAgbWV0aG9kXG5cbm1vZHVsZS5leHBvcnRzID0gSW5kZXhCcm93c2VyO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxuZnVuY3Rpb24gSW5kZXhCcm93c2VyKCkge1xufVxuXG5pbmhlcml0cyhJbmRleEJyb3dzZXIsIEV2ZW50RW1pdHRlcik7XG5cbkluZGV4QnJvd3Nlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zdG9wcGVkID0gdHJ1ZTtcbiAgdGhpcy5fY2xlYW4oKTtcbn07XG5cbkluZGV4QnJvd3Nlci5wcm90b3R5cGUuX2VuZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2VuZCcpO1xuICB0aGlzLl9jbGVhbigpO1xufTtcblxuSW5kZXhCcm93c2VyLnByb3RvdHlwZS5fZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIHRoaXMuX2NsZWFuKCk7XG59O1xuXG5JbmRleEJyb3dzZXIucHJvdG90eXBlLl9yZXN1bHQgPSBmdW5jdGlvbihjb250ZW50KSB7XG4gIHRoaXMuZW1pdCgncmVzdWx0JywgY29udGVudCk7XG59O1xuXG5JbmRleEJyb3dzZXIucHJvdG90eXBlLl9jbGVhbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnc3RvcCcpO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZW5kJyk7XG4gIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdlcnJvcicpO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVzdWx0Jyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleEJyb3dzZXIuanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9ldmVudHMvZXZlbnRzLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBBbGdvbGlhU2VhcmNoQ29yZTtcblxudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgZXhpdFByb21pc2UgPSByZXF1aXJlKCcuL2V4aXRQcm9taXNlLmpzJyk7XG52YXIgSW5kZXhDb3JlID0gcmVxdWlyZSgnLi9JbmRleENvcmUuanMnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUuanMnKTtcblxuLy8gV2Ugd2lsbCBhbHdheXMgcHV0IHRoZSBBUEkgS0VZIGluIHRoZSBKU09OIGJvZHkgaW4gY2FzZSBvZiB0b28gbG9uZyBBUEkgS0VZLFxuLy8gdG8gYXZvaWQgcXVlcnkgc3RyaW5nIGJlaW5nIHRvbyBsb25nIGFuZCBmYWlsaW5nIGluIHZhcmlvdXMgY29uZGl0aW9ucyAob3VyIHNlcnZlciBsaW1pdCwgYnJvd3NlciBsaW1pdCxcbi8vIHByb3hpZXMgbGltaXQpXG52YXIgTUFYX0FQSV9LRVlfTEVOR1RIID0gNTAwO1xudmFyIFJFU0VUX0FQUF9EQVRBX1RJTUVSID1cbiAgcHJvY2Vzcy5lbnYuUkVTRVRfQVBQX0RBVEFfVElNRVIgJiYgcGFyc2VJbnQocHJvY2Vzcy5lbnYuUkVTRVRfQVBQX0RBVEFfVElNRVIsIDEwKSB8fFxuICA2MCAqIDIgKiAxMDAwOyAvLyBhZnRlciAyIG1pbnV0ZXMgcmVzZXQgdG8gZmlyc3QgaG9zdFxuXG4vKlxuICogQWxnb2xpYSBTZWFyY2ggbGlicmFyeSBpbml0aWFsaXphdGlvblxuICogaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGFwcGxpY2F0aW9uSUQgLSBZb3VyIGFwcGxpY2F0aW9uSUQsIGZvdW5kIGluIHlvdXIgZGFzaGJvYXJkXG4gKiBAcGFyYW0ge3N0cmluZ30gYXBpS2V5IC0gWW91ciBBUEkga2V5LCBmb3VuZCBpbiB5b3VyIGRhc2hib2FyZFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVvdXQ9MjAwMF0gLSBUaGUgcmVxdWVzdCB0aW1lb3V0IHNldCBpbiBtaWxsaXNlY29uZHMsXG4gKiBhbm90aGVyIHJlcXVlc3Qgd2lsbCBiZSBpc3N1ZWQgYWZ0ZXIgdGhpcyB0aW1lb3V0XG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdHMucHJvdG9jb2w9J2h0dHA6J10gLSBUaGUgcHJvdG9jb2wgdXNlZCB0byBxdWVyeSBBbGdvbGlhIFNlYXJjaCBBUEkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZXQgdG8gJ2h0dHBzOicgdG8gZm9yY2UgdXNpbmcgaHR0cHMuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0IHRvIGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sIGluIGJyb3dzZXJzXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gW29wdHMuaG9zdHM9e1xuICogICAgICAgICAgIHJlYWQ6IFt0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLWRzbi5hbGdvbGlhLm5ldCddLmNvbmNhdChbXG4gKiAgICAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLTEuYWxnb2xpYW5ldC5jb20nLFxuICogICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbklEICsgJy0yLmFsZ29saWFuZXQuY29tJyxcbiAqICAgICAgICAgICAgIHRoaXMuYXBwbGljYXRpb25JRCArICctMy5hbGdvbGlhbmV0LmNvbSddXG4gKiAgICAgICAgICAgXSksXG4gKiAgICAgICAgICAgd3JpdGU6IFt0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLmFsZ29saWEubmV0J10uY29uY2F0KFtcbiAqICAgICAgICAgICAgIHRoaXMuYXBwbGljYXRpb25JRCArICctMS5hbGdvbGlhbmV0LmNvbScsXG4gKiAgICAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLTIuYWxnb2xpYW5ldC5jb20nLFxuICogICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbklEICsgJy0zLmFsZ29saWFuZXQuY29tJ11cbiAqICAgICAgICAgICBdKSAtIFRoZSBob3N0cyB0byB1c2UgZm9yIEFsZ29saWEgU2VhcmNoIEFQSS5cbiAqICAgICAgICAgICBJZiB5b3UgcHJvdmlkZSB0aGVtLCB5b3Ugd2lsbCBsZXNzIGJlbmVmaXQgZnJvbSBvdXIgSEEgaW1wbGVtZW50YXRpb25cbiAqL1xuZnVuY3Rpb24gQWxnb2xpYVNlYXJjaENvcmUoYXBwbGljYXRpb25JRCwgYXBpS2V5LCBvcHRzKSB7XG4gIHZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FsZ29saWFzZWFyY2gnKTtcblxuICB2YXIgY2xvbmUgPSByZXF1aXJlKCcuL2Nsb25lLmpzJyk7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcblxuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGFsZ29saWFzZWFyY2goYXBwbGljYXRpb25JRCwgYXBpS2V5LCBvcHRzKSc7XG5cbiAgaWYgKG9wdHMuX2FsbG93RW1wdHlDcmVkZW50aWFscyAhPT0gdHJ1ZSAmJiAhYXBwbGljYXRpb25JRCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhbiBhcHBsaWNhdGlvbiBJRC4gJyArIHVzYWdlKTtcbiAgfVxuXG4gIGlmIChvcHRzLl9hbGxvd0VtcHR5Q3JlZGVudGlhbHMgIT09IHRydWUgJiYgIWFwaUtleSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhbiBBUEkga2V5LiAnICsgdXNhZ2UpO1xuICB9XG5cbiAgdGhpcy5hcHBsaWNhdGlvbklEID0gYXBwbGljYXRpb25JRDtcbiAgdGhpcy5hcGlLZXkgPSBhcGlLZXk7XG5cbiAgdGhpcy5ob3N0cyA9IHtcbiAgICByZWFkOiBbXSxcbiAgICB3cml0ZTogW11cbiAgfTtcblxuICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICB2YXIgcHJvdG9jb2wgPSBvcHRzLnByb3RvY29sIHx8ICdodHRwczonO1xuICB0aGlzLl90aW1lb3V0cyA9IG9wdHMudGltZW91dHMgfHwge1xuICAgIGNvbm5lY3Q6IDEgKiAxMDAwLCAvLyA1MDBtcyBjb25uZWN0IGlzIEdQUlMgbGF0ZW5jeVxuICAgIHJlYWQ6IDIgKiAxMDAwLFxuICAgIHdyaXRlOiAzMCAqIDEwMDBcbiAgfTtcblxuICAvLyBiYWNrd2FyZCBjb21wYXQsIGlmIG9wdHMudGltZW91dCBpcyBwYXNzZWQsIHdlIHVzZSBpdCB0byBjb25maWd1cmUgYWxsIHRpbWVvdXRzIGxpa2UgYmVmb3JlXG4gIGlmIChvcHRzLnRpbWVvdXQpIHtcbiAgICB0aGlzLl90aW1lb3V0cy5jb25uZWN0ID0gdGhpcy5fdGltZW91dHMucmVhZCA9IHRoaXMuX3RpbWVvdXRzLndyaXRlID0gb3B0cy50aW1lb3V0O1xuICB9XG5cbiAgLy8gd2hpbGUgd2UgYWR2b2NhdGUgZm9yIGNvbG9uLWF0LXRoZS1lbmQgdmFsdWVzOiAnaHR0cDonIGZvciBgb3B0cy5wcm90b2NvbGBcbiAgLy8gd2UgYWxzbyBhY2NlcHQgYGh0dHBgIGFuZCBgaHR0cHNgLiBJdCdzIGEgY29tbW9uIGVycm9yLlxuICBpZiAoIS86JC8udGVzdChwcm90b2NvbCkpIHtcbiAgICBwcm90b2NvbCA9IHByb3RvY29sICsgJzonO1xuICB9XG5cbiAgaWYgKG9wdHMucHJvdG9jb2wgIT09ICdodHRwOicgJiYgb3B0cy5wcm90b2NvbCAhPT0gJ2h0dHBzOicpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkFsZ29saWFTZWFyY2hFcnJvcigncHJvdG9jb2wgbXVzdCBiZSBgaHR0cDpgIG9yIGBodHRwczpgICh3YXMgYCcgKyBvcHRzLnByb3RvY29sICsgJ2ApJyk7XG4gIH1cblxuICB0aGlzLl9jaGVja0FwcElkRGF0YSgpO1xuXG4gIGlmICghb3B0cy5ob3N0cykge1xuICAgIHZhciBkZWZhdWx0SG9zdHMgPSBtYXAodGhpcy5fc2h1ZmZsZVJlc3VsdCwgZnVuY3Rpb24oaG9zdE51bWJlcikge1xuICAgICAgcmV0dXJuIGFwcGxpY2F0aW9uSUQgKyAnLScgKyBob3N0TnVtYmVyICsgJy5hbGdvbGlhbmV0LmNvbSc7XG4gICAgfSk7XG5cbiAgICAvLyBubyBob3N0cyBnaXZlbiwgY29tcHV0ZSBkZWZhdWx0c1xuICAgIHRoaXMuaG9zdHMucmVhZCA9IFt0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLWRzbi5hbGdvbGlhLm5ldCddLmNvbmNhdChkZWZhdWx0SG9zdHMpO1xuICAgIHRoaXMuaG9zdHMud3JpdGUgPSBbdGhpcy5hcHBsaWNhdGlvbklEICsgJy5hbGdvbGlhLm5ldCddLmNvbmNhdChkZWZhdWx0SG9zdHMpO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkob3B0cy5ob3N0cykpIHtcbiAgICAvLyB3aGVuIHBhc3NpbmcgY3VzdG9tIGhvc3RzLCB3ZSBuZWVkIHRvIGhhdmUgYSBkaWZmZXJlbnQgaG9zdCBpbmRleCBpZiB0aGUgbnVtYmVyXG4gICAgLy8gb2Ygd3JpdGUvcmVhZCBob3N0cyBhcmUgZGlmZmVyZW50LlxuICAgIHRoaXMuaG9zdHMucmVhZCA9IGNsb25lKG9wdHMuaG9zdHMpO1xuICAgIHRoaXMuaG9zdHMud3JpdGUgPSBjbG9uZShvcHRzLmhvc3RzKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmhvc3RzLnJlYWQgPSBjbG9uZShvcHRzLmhvc3RzLnJlYWQpO1xuICAgIHRoaXMuaG9zdHMud3JpdGUgPSBjbG9uZShvcHRzLmhvc3RzLndyaXRlKTtcbiAgfVxuXG4gIC8vIGFkZCBwcm90b2NvbCBhbmQgbG93ZXJjYXNlIGhvc3RzXG4gIHRoaXMuaG9zdHMucmVhZCA9IG1hcCh0aGlzLmhvc3RzLnJlYWQsIHByZXBhcmVIb3N0KHByb3RvY29sKSk7XG4gIHRoaXMuaG9zdHMud3JpdGUgPSBtYXAodGhpcy5ob3N0cy53cml0ZSwgcHJlcGFyZUhvc3QocHJvdG9jb2wpKTtcblxuICB0aGlzLmV4dHJhSGVhZGVycyA9IFtdO1xuXG4gIC8vIEluIHNvbWUgc2l0dWF0aW9ucyB5b3UgbWlnaHQgd2FudCB0byB3YXJtIHRoZSBjYWNoZVxuICB0aGlzLmNhY2hlID0gb3B0cy5fY2FjaGUgfHwge307XG5cbiAgdGhpcy5fdWEgPSBvcHRzLl91YTtcbiAgdGhpcy5fdXNlQ2FjaGUgPSBvcHRzLl91c2VDYWNoZSA9PT0gdW5kZWZpbmVkIHx8IG9wdHMuX2NhY2hlID8gdHJ1ZSA6IG9wdHMuX3VzZUNhY2hlO1xuICB0aGlzLl91c2VGYWxsYmFjayA9IG9wdHMudXNlRmFsbGJhY2sgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRzLnVzZUZhbGxiYWNrO1xuXG4gIHRoaXMuX3NldFRpbWVvdXQgPSBvcHRzLl9zZXRUaW1lb3V0O1xuXG4gIGRlYnVnKCdpbml0IGRvbmUsICVqJywgdGhpcyk7XG59XG5cbi8qXG4gKiBHZXQgdGhlIGluZGV4IG9iamVjdCBpbml0aWFsaXplZFxuICpcbiAqIEBwYXJhbSBpbmRleE5hbWUgdGhlIG5hbWUgb2YgaW5kZXhcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIHdpdGggb25lIGFyZ3VtZW50ICh0aGUgSW5kZXggaW5zdGFuY2UpXG4gKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5pbml0SW5kZXggPSBmdW5jdGlvbihpbmRleE5hbWUpIHtcbiAgcmV0dXJuIG5ldyBJbmRleENvcmUodGhpcywgaW5kZXhOYW1lKTtcbn07XG5cbi8qKlxuKiBBZGQgYW4gZXh0cmEgZmllbGQgdG8gdGhlIEhUVFAgcmVxdWVzdFxuKlxuKiBAcGFyYW0gbmFtZSB0aGUgaGVhZGVyIGZpZWxkIG5hbWVcbiogQHBhcmFtIHZhbHVlIHRoZSBoZWFkZXIgZmllbGQgdmFsdWVcbiovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuc2V0RXh0cmFIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB0aGlzLmV4dHJhSGVhZGVycy5wdXNoKHtcbiAgICBuYW1lOiBuYW1lLnRvTG93ZXJDYXNlKCksIHZhbHVlOiB2YWx1ZVxuICB9KTtcbn07XG5cbi8qKlxuKiBBdWdtZW50IHNlbnQgeC1hbGdvbGlhLWFnZW50IHdpdGggbW9yZSBkYXRhLCBlYWNoIGFnZW50IHBhcnRcbiogaXMgYXV0b21hdGljYWxseSBzZXBhcmF0ZWQgZnJvbSB0aGUgb3RoZXJzIGJ5IGEgc2VtaWNvbG9uO1xuKlxuKiBAcGFyYW0gYWxnb2xpYUFnZW50IHRoZSBhZ2VudCB0byBhZGRcbiovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuYWRkQWxnb2xpYUFnZW50ID0gZnVuY3Rpb24oYWxnb2xpYUFnZW50KSB7XG4gIHRoaXMuX3VhICs9ICc7JyArIGFsZ29saWFBZ2VudDtcbn07XG5cbi8qXG4gKiBXcmFwcGVyIHRoYXQgdHJ5IGFsbCBob3N0cyB0byBtYXhpbWl6ZSB0aGUgcXVhbGl0eSBvZiBzZXJ2aWNlXG4gKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fanNvblJlcXVlc3QgPSBmdW5jdGlvbihpbml0aWFsT3B0cykge1xuICB0aGlzLl9jaGVja0FwcElkRGF0YSgpO1xuXG4gIHZhciByZXF1ZXN0RGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhbGdvbGlhc2VhcmNoOicgKyBpbml0aWFsT3B0cy51cmwpO1xuXG4gIHZhciBib2R5O1xuICB2YXIgY2FjaGUgPSBpbml0aWFsT3B0cy5jYWNoZTtcbiAgdmFyIGNsaWVudCA9IHRoaXM7XG4gIHZhciB0cmllcyA9IDA7XG4gIHZhciB1c2luZ0ZhbGxiYWNrID0gZmFsc2U7XG4gIHZhciBoYXNGYWxsYmFjayA9IGNsaWVudC5fdXNlRmFsbGJhY2sgJiYgY2xpZW50Ll9yZXF1ZXN0LmZhbGxiYWNrICYmIGluaXRpYWxPcHRzLmZhbGxiYWNrO1xuICB2YXIgaGVhZGVycztcblxuICBpZiAoXG4gICAgdGhpcy5hcGlLZXkubGVuZ3RoID4gTUFYX0FQSV9LRVlfTEVOR1RIICYmXG4gICAgaW5pdGlhbE9wdHMuYm9keSAhPT0gdW5kZWZpbmVkICYmXG4gICAgKGluaXRpYWxPcHRzLmJvZHkucGFyYW1zICE9PSB1bmRlZmluZWQgfHwgLy8gaW5kZXguc2VhcmNoKClcbiAgICBpbml0aWFsT3B0cy5ib2R5LnJlcXVlc3RzICE9PSB1bmRlZmluZWQpIC8vIGNsaWVudC5zZWFyY2goKVxuICApIHtcbiAgICBpbml0aWFsT3B0cy5ib2R5LmFwaUtleSA9IHRoaXMuYXBpS2V5O1xuICAgIGhlYWRlcnMgPSB0aGlzLl9jb21wdXRlUmVxdWVzdEhlYWRlcnMoZmFsc2UpO1xuICB9IGVsc2Uge1xuICAgIGhlYWRlcnMgPSB0aGlzLl9jb21wdXRlUmVxdWVzdEhlYWRlcnMoKTtcbiAgfVxuXG4gIGlmIChpbml0aWFsT3B0cy5ib2R5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBib2R5ID0gc2FmZUpTT05TdHJpbmdpZnkoaW5pdGlhbE9wdHMuYm9keSk7XG4gIH1cblxuICByZXF1ZXN0RGVidWcoJ3JlcXVlc3Qgc3RhcnQnKTtcbiAgdmFyIGRlYnVnRGF0YSA9IFtdO1xuXG4gIGZ1bmN0aW9uIGRvUmVxdWVzdChyZXF1ZXN0ZXIsIHJlcU9wdHMpIHtcbiAgICBjbGllbnQuX2NoZWNrQXBwSWREYXRhKCk7XG5cbiAgICB2YXIgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICB2YXIgY2FjaGVJRDtcblxuICAgIGlmIChjbGllbnQuX3VzZUNhY2hlKSB7XG4gICAgICBjYWNoZUlEID0gaW5pdGlhbE9wdHMudXJsO1xuICAgIH1cblxuICAgIC8vIGFzIHdlIHNvbWV0aW1lIHVzZSBQT1NUIHJlcXVlc3RzIHRvIHBhc3MgcGFyYW1ldGVycyAobGlrZSBxdWVyeT0nYWEnKSxcbiAgICAvLyB0aGUgY2FjaGVJRCBtdXN0IGFsc28gaW5jbHVkZSB0aGUgYm9keSB0byBiZSBkaWZmZXJlbnQgYmV0d2VlbiBjYWxsc1xuICAgIGlmIChjbGllbnQuX3VzZUNhY2hlICYmIGJvZHkpIHtcbiAgICAgIGNhY2hlSUQgKz0gJ19ib2R5XycgKyByZXFPcHRzLmJvZHk7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIGNhY2hlIGV4aXN0ZW5jZVxuICAgIGlmIChjbGllbnQuX3VzZUNhY2hlICYmIGNhY2hlICYmIGNhY2hlW2NhY2hlSURdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcXVlc3REZWJ1Zygnc2VydmluZyByZXNwb25zZSBmcm9tIGNhY2hlJyk7XG4gICAgICByZXR1cm4gY2xpZW50Ll9wcm9taXNlLnJlc29sdmUoSlNPTi5wYXJzZShjYWNoZVtjYWNoZUlEXSkpO1xuICAgIH1cblxuICAgIC8vIGlmIHdlIHJlYWNoZWQgbWF4IHRyaWVzXG4gICAgaWYgKHRyaWVzID49IGNsaWVudC5ob3N0c1tpbml0aWFsT3B0cy5ob3N0VHlwZV0ubGVuZ3RoKSB7XG4gICAgICBpZiAoIWhhc0ZhbGxiYWNrIHx8IHVzaW5nRmFsbGJhY2spIHtcbiAgICAgICAgcmVxdWVzdERlYnVnKCdjb3VsZCBub3QgZ2V0IGFueSByZXNwb25zZScpO1xuICAgICAgICAvLyB0aGVuIHN0b3BcbiAgICAgICAgcmV0dXJuIGNsaWVudC5fcHJvbWlzZS5yZWplY3QobmV3IGVycm9ycy5BbGdvbGlhU2VhcmNoRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBjb25uZWN0IHRvIHRoZSBBbGdvbGlhU2VhcmNoIEFQSS4nICtcbiAgICAgICAgICAnIFNlbmQgYW4gZW1haWwgdG8gc3VwcG9ydEBhbGdvbGlhLmNvbSB0byByZXBvcnQgYW5kIHJlc29sdmUgdGhlIGlzc3VlLicgK1xuICAgICAgICAgICcgQXBwbGljYXRpb24gaWQgd2FzOiAnICsgY2xpZW50LmFwcGxpY2F0aW9uSUQsIHtkZWJ1Z0RhdGE6IGRlYnVnRGF0YX1cbiAgICAgICAgKSk7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3REZWJ1Zygnc3dpdGNoaW5nIHRvIGZhbGxiYWNrJyk7XG5cbiAgICAgIC8vIGxldCdzIHRyeSB0aGUgZmFsbGJhY2sgc3RhcnRpbmcgZnJvbSBoZXJlXG4gICAgICB0cmllcyA9IDA7XG5cbiAgICAgIC8vIG1ldGhvZCwgdXJsIGFuZCBib2R5IGFyZSBmYWxsYmFjayBkZXBlbmRlbnRcbiAgICAgIHJlcU9wdHMubWV0aG9kID0gaW5pdGlhbE9wdHMuZmFsbGJhY2subWV0aG9kO1xuICAgICAgcmVxT3B0cy51cmwgPSBpbml0aWFsT3B0cy5mYWxsYmFjay51cmw7XG4gICAgICByZXFPcHRzLmpzb25Cb2R5ID0gaW5pdGlhbE9wdHMuZmFsbGJhY2suYm9keTtcbiAgICAgIGlmIChyZXFPcHRzLmpzb25Cb2R5KSB7XG4gICAgICAgIHJlcU9wdHMuYm9keSA9IHNhZmVKU09OU3RyaW5naWZ5KHJlcU9wdHMuanNvbkJvZHkpO1xuICAgICAgfVxuICAgICAgLy8gcmUtY29tcHV0ZSBoZWFkZXJzLCB0aGV5IGNvdWxkIGJlIG9taXR0aW5nIHRoZSBBUEkgS0VZXG4gICAgICBoZWFkZXJzID0gY2xpZW50Ll9jb21wdXRlUmVxdWVzdEhlYWRlcnMoKTtcblxuICAgICAgcmVxT3B0cy50aW1lb3V0cyA9IGNsaWVudC5fZ2V0VGltZW91dHNGb3JSZXF1ZXN0KGluaXRpYWxPcHRzLmhvc3RUeXBlKTtcbiAgICAgIGNsaWVudC5fc2V0SG9zdEluZGV4QnlUeXBlKDAsIGluaXRpYWxPcHRzLmhvc3RUeXBlKTtcbiAgICAgIHVzaW5nRmFsbGJhY2sgPSB0cnVlOyAvLyB0aGUgY3VycmVudCByZXF1ZXN0IGlzIG5vdyB1c2luZyBmYWxsYmFja1xuICAgICAgcmV0dXJuIGRvUmVxdWVzdChjbGllbnQuX3JlcXVlc3QuZmFsbGJhY2ssIHJlcU9wdHMpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50SG9zdCA9IGNsaWVudC5fZ2V0SG9zdEJ5VHlwZShpbml0aWFsT3B0cy5ob3N0VHlwZSk7XG5cbiAgICB2YXIgdXJsID0gY3VycmVudEhvc3QgKyByZXFPcHRzLnVybDtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGJvZHk6IHJlcU9wdHMuYm9keSxcbiAgICAgIGpzb25Cb2R5OiByZXFPcHRzLmpzb25Cb2R5LFxuICAgICAgbWV0aG9kOiByZXFPcHRzLm1ldGhvZCxcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICB0aW1lb3V0czogcmVxT3B0cy50aW1lb3V0cyxcbiAgICAgIGRlYnVnOiByZXF1ZXN0RGVidWdcbiAgICB9O1xuXG4gICAgcmVxdWVzdERlYnVnKCdtZXRob2Q6ICVzLCB1cmw6ICVzLCBoZWFkZXJzOiAlaiwgdGltZW91dHM6ICVkJyxcbiAgICAgIG9wdGlvbnMubWV0aG9kLCB1cmwsIG9wdGlvbnMuaGVhZGVycywgb3B0aW9ucy50aW1lb3V0cyk7XG5cbiAgICBpZiAocmVxdWVzdGVyID09PSBjbGllbnQuX3JlcXVlc3QuZmFsbGJhY2spIHtcbiAgICAgIHJlcXVlc3REZWJ1ZygndXNpbmcgZmFsbGJhY2snKTtcbiAgICB9XG5cbiAgICAvLyBgcmVxdWVzdGVyYCBpcyBhbnkgb2YgdGhpcy5fcmVxdWVzdCBvciB0aGlzLl9yZXF1ZXN0LmZhbGxiYWNrXG4gICAgLy8gdGh1cyBpdCBuZWVkcyB0byBiZSBjYWxsZWQgdXNpbmcgdGhlIGNsaWVudCBhcyBjb250ZXh0XG4gICAgcmV0dXJuIHJlcXVlc3Rlci5jYWxsKGNsaWVudCwgdXJsLCBvcHRpb25zKS50aGVuKHN1Y2Nlc3MsIHRyeUZhbGxiYWNrKTtcblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoaHR0cFJlc3BvbnNlKSB7XG4gICAgICAvLyBjb21wdXRlIHRoZSBzdGF0dXMgb2YgdGhlIHJlc3BvbnNlLFxuICAgICAgLy9cbiAgICAgIC8vIFdoZW4gaW4gYnJvd3NlciBtb2RlLCB1c2luZyBYRFIgb3IgSlNPTlAsIHdlIGhhdmUgbm8gc3RhdHVzQ29kZSBhdmFpbGFibGVcbiAgICAgIC8vIFNvIHdlIHJlbHkgb24gb3VyIEFQSSByZXNwb25zZSBgc3RhdHVzYCBwcm9wZXJ0eS5cbiAgICAgIC8vIEJ1dCBgd2FpdFRhc2tgIGNhbiBzZXQgYSBgc3RhdHVzYCBwcm9wZXJ0eSB3aGljaCBpcyBub3QgdGhlIHN0YXR1c0NvZGUgKGl0J3MgdGhlIHRhc2sgc3RhdHVzKVxuICAgICAgLy8gU28gd2UgY2hlY2sgaWYgdGhlcmUncyBhIGBtZXNzYWdlYCBhbG9uZyBgc3RhdHVzYCBhbmQgaXQgbWVhbnMgaXQncyBhbiBlcnJvclxuICAgICAgLy9cbiAgICAgIC8vIFRoYXQncyB0aGUgb25seSBjYXNlIHdoZXJlIHdlIGhhdmUgYSByZXNwb25zZS5zdGF0dXMgdGhhdCdzIG5vdCB0aGUgaHR0cCBzdGF0dXNDb2RlXG4gICAgICB2YXIgc3RhdHVzID0gaHR0cFJlc3BvbnNlICYmIGh0dHBSZXNwb25zZS5ib2R5ICYmIGh0dHBSZXNwb25zZS5ib2R5Lm1lc3NhZ2UgJiYgaHR0cFJlc3BvbnNlLmJvZHkuc3RhdHVzIHx8XG5cbiAgICAgICAgLy8gdGhpcyBpcyBpbXBvcnRhbnQgdG8gY2hlY2sgdGhlIHJlcXVlc3Qgc3RhdHVzQ29kZSBBRlRFUiB0aGUgYm9keSBldmVudHVhbFxuICAgICAgICAvLyBzdGF0dXNDb2RlIGJlY2F1c2Ugc29tZSBpbXBsZW1lbnRhdGlvbnMgKGpRdWVyeSBYRG9tYWluUmVxdWVzdCB0cmFuc3BvcnQpIG1heVxuICAgICAgICAvLyBzZW5kIHN0YXR1c0NvZGUgMjAwIHdoaWxlIHdlIGhhZCBhbiBlcnJvclxuICAgICAgICBodHRwUmVzcG9uc2Uuc3RhdHVzQ29kZSB8fFxuXG4gICAgICAgIC8vIFdoZW4gaW4gYnJvd3NlciBtb2RlLCB1c2luZyBYRFIgb3IgSlNPTlBcbiAgICAgICAgLy8gd2UgZGVmYXVsdCB0byBzdWNjZXNzIHdoZW4gbm8gZXJyb3IgKG5vIHJlc3BvbnNlLnN0YXR1cyAmJiByZXNwb25zZS5tZXNzYWdlKVxuICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYSBKU09OLnBhcnNlKCkgZXJyb3IgdGhlbiBib2R5IGlzIG51bGwgYW5kIGl0IGZhaWxzXG4gICAgICAgIGh0dHBSZXNwb25zZSAmJiBodHRwUmVzcG9uc2UuYm9keSAmJiAyMDA7XG5cbiAgICAgIHJlcXVlc3REZWJ1ZygncmVjZWl2ZWQgcmVzcG9uc2U6IHN0YXR1c0NvZGU6ICVzLCBjb21wdXRlZCBzdGF0dXNDb2RlOiAlZCwgaGVhZGVyczogJWonLFxuICAgICAgICBodHRwUmVzcG9uc2Uuc3RhdHVzQ29kZSwgc3RhdHVzLCBodHRwUmVzcG9uc2UuaGVhZGVycyk7XG5cbiAgICAgIHZhciBodHRwUmVzcG9uc2VPayA9IE1hdGguZmxvb3Ioc3RhdHVzIC8gMTAwKSA9PT0gMjtcblxuICAgICAgdmFyIGVuZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGVidWdEYXRhLnB1c2goe1xuICAgICAgICBjdXJyZW50SG9zdDogY3VycmVudEhvc3QsXG4gICAgICAgIGhlYWRlcnM6IHJlbW92ZUNyZWRlbnRpYWxzKGhlYWRlcnMpLFxuICAgICAgICBjb250ZW50OiBib2R5IHx8IG51bGwsXG4gICAgICAgIGNvbnRlbnRMZW5ndGg6IGJvZHkgIT09IHVuZGVmaW5lZCA/IGJvZHkubGVuZ3RoIDogbnVsbCxcbiAgICAgICAgbWV0aG9kOiByZXFPcHRzLm1ldGhvZCxcbiAgICAgICAgdGltZW91dHM6IHJlcU9wdHMudGltZW91dHMsXG4gICAgICAgIHVybDogcmVxT3B0cy51cmwsXG4gICAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lOiBlbmRUaW1lLFxuICAgICAgICBkdXJhdGlvbjogZW5kVGltZSAtIHN0YXJ0VGltZSxcbiAgICAgICAgc3RhdHVzQ29kZTogc3RhdHVzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGh0dHBSZXNwb25zZU9rKSB7XG4gICAgICAgIGlmIChjbGllbnQuX3VzZUNhY2hlICYmIGNhY2hlKSB7XG4gICAgICAgICAgY2FjaGVbY2FjaGVJRF0gPSBodHRwUmVzcG9uc2UucmVzcG9uc2VUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGh0dHBSZXNwb25zZS5ib2R5O1xuICAgICAgfVxuXG4gICAgICB2YXIgc2hvdWxkUmV0cnkgPSBNYXRoLmZsb29yKHN0YXR1cyAvIDEwMCkgIT09IDQ7XG5cbiAgICAgIGlmIChzaG91bGRSZXRyeSkge1xuICAgICAgICB0cmllcyArPSAxO1xuICAgICAgICByZXR1cm4gcmV0cnlSZXF1ZXN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3REZWJ1ZygndW5yZWNvdmVyYWJsZSBlcnJvcicpO1xuXG4gICAgICAvLyBubyBzdWNjZXNzIGFuZCBubyByZXRyeSA9PiBmYWlsXG4gICAgICB2YXIgdW5yZWNvdmVyYWJsZUVycm9yID0gbmV3IGVycm9ycy5BbGdvbGlhU2VhcmNoRXJyb3IoXG4gICAgICAgIGh0dHBSZXNwb25zZS5ib2R5ICYmIGh0dHBSZXNwb25zZS5ib2R5Lm1lc3NhZ2UsIHtkZWJ1Z0RhdGE6IGRlYnVnRGF0YSwgc3RhdHVzQ29kZTogc3RhdHVzfVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGNsaWVudC5fcHJvbWlzZS5yZWplY3QodW5yZWNvdmVyYWJsZUVycm9yKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cnlGYWxsYmFjayhlcnIpIHtcbiAgICAgIC8vIGVycm9yIGNhc2VzOlxuICAgICAgLy8gIFdoaWxlIG5vdCBpbiBmYWxsYmFjayBtb2RlOlxuICAgICAgLy8gICAgLSBDT1JTIG5vdCBzdXBwb3J0ZWRcbiAgICAgIC8vICAgIC0gbmV0d29yayBlcnJvclxuICAgICAgLy8gIFdoaWxlIGluIGZhbGxiYWNrIG1vZGU6XG4gICAgICAvLyAgICAtIHRpbWVvdXRcbiAgICAgIC8vICAgIC0gbmV0d29yayBlcnJvclxuICAgICAgLy8gICAgLSBiYWRseSBmb3JtYXR0ZWQgSlNPTlAgKHNjcmlwdCBsb2FkZWQsIGRpZCBub3QgY2FsbCBvdXIgY2FsbGJhY2spXG4gICAgICAvLyAgSW4gYm90aCBjYXNlczpcbiAgICAgIC8vICAgIC0gdW5jYXVnaHQgZXhjZXB0aW9uIG9jY3VycyAoVHlwZUVycm9yKVxuICAgICAgcmVxdWVzdERlYnVnKCdlcnJvcjogJXMsIHN0YWNrOiAlcycsIGVyci5tZXNzYWdlLCBlcnIuc3RhY2spO1xuXG4gICAgICB2YXIgZW5kVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICBkZWJ1Z0RhdGEucHVzaCh7XG4gICAgICAgIGN1cnJlbnRIb3N0OiBjdXJyZW50SG9zdCxcbiAgICAgICAgaGVhZGVyczogcmVtb3ZlQ3JlZGVudGlhbHMoaGVhZGVycyksXG4gICAgICAgIGNvbnRlbnQ6IGJvZHkgfHwgbnVsbCxcbiAgICAgICAgY29udGVudExlbmd0aDogYm9keSAhPT0gdW5kZWZpbmVkID8gYm9keS5sZW5ndGggOiBudWxsLFxuICAgICAgICBtZXRob2Q6IHJlcU9wdHMubWV0aG9kLFxuICAgICAgICB0aW1lb3V0czogcmVxT3B0cy50aW1lb3V0cyxcbiAgICAgICAgdXJsOiByZXFPcHRzLnVybCxcbiAgICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWU6IGVuZFRpbWUsXG4gICAgICAgIGR1cmF0aW9uOiBlbmRUaW1lIC0gc3RhcnRUaW1lXG4gICAgICB9KTtcblxuICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgZXJyb3JzLkFsZ29saWFTZWFyY2hFcnJvcikpIHtcbiAgICAgICAgZXJyID0gbmV3IGVycm9ycy5Vbmtub3duKGVyciAmJiBlcnIubWVzc2FnZSwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgdHJpZXMgKz0gMTtcblxuICAgICAgLy8gc3RvcCB0aGUgcmVxdWVzdCBpbXBsZW1lbnRhdGlvbiB3aGVuOlxuICAgICAgaWYgKFxuICAgICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIHRoaXMgZXJyb3IsXG4gICAgICAgIC8vIGl0IGNvbWVzIGZyb20gYSB0aHJvdyBpbiBzb21lIG90aGVyIHBpZWNlIG9mIGNvZGVcbiAgICAgICAgZXJyIGluc3RhbmNlb2YgZXJyb3JzLlVua25vd24gfHxcblxuICAgICAgICAvLyBzZXJ2ZXIgc2VudCB1bnBhcnNhYmxlIEpTT05cbiAgICAgICAgZXJyIGluc3RhbmNlb2YgZXJyb3JzLlVucGFyc2FibGVKU09OIHx8XG5cbiAgICAgICAgLy8gbWF4IHRyaWVzIGFuZCBhbHJlYWR5IHVzaW5nIGZhbGxiYWNrIG9yIG5vIGZhbGxiYWNrXG4gICAgICAgIHRyaWVzID49IGNsaWVudC5ob3N0c1tpbml0aWFsT3B0cy5ob3N0VHlwZV0ubGVuZ3RoICYmXG4gICAgICAgICh1c2luZ0ZhbGxiYWNrIHx8ICFoYXNGYWxsYmFjaykpIHtcbiAgICAgICAgLy8gc3RvcCByZXF1ZXN0IGltcGxlbWVudGF0aW9uIGZvciB0aGlzIGNvbW1hbmRcbiAgICAgICAgZXJyLmRlYnVnRGF0YSA9IGRlYnVnRGF0YTtcbiAgICAgICAgcmV0dXJuIGNsaWVudC5fcHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hlbiBhIHRpbWVvdXQgb2NjdXJlZCwgcmV0cnkgYnkgcmFpc2luZyB0aW1lb3V0XG4gICAgICBpZiAoZXJyIGluc3RhbmNlb2YgZXJyb3JzLlJlcXVlc3RUaW1lb3V0KSB7XG4gICAgICAgIHJldHVybiByZXRyeVJlcXVlc3RXaXRoSGlnaGVyVGltZW91dCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0cnlSZXF1ZXN0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0cnlSZXF1ZXN0KCkge1xuICAgICAgcmVxdWVzdERlYnVnKCdyZXRyeWluZyByZXF1ZXN0Jyk7XG4gICAgICBjbGllbnQuX2luY3JlbWVudEhvc3RJbmRleChpbml0aWFsT3B0cy5ob3N0VHlwZSk7XG4gICAgICByZXR1cm4gZG9SZXF1ZXN0KHJlcXVlc3RlciwgcmVxT3B0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmV0cnlSZXF1ZXN0V2l0aEhpZ2hlclRpbWVvdXQoKSB7XG4gICAgICByZXF1ZXN0RGVidWcoJ3JldHJ5aW5nIHJlcXVlc3Qgd2l0aCBoaWdoZXIgdGltZW91dCcpO1xuICAgICAgY2xpZW50Ll9pbmNyZW1lbnRIb3N0SW5kZXgoaW5pdGlhbE9wdHMuaG9zdFR5cGUpO1xuICAgICAgY2xpZW50Ll9pbmNyZW1lbnRUaW1lb3V0TXVsdGlwbGVyKCk7XG4gICAgICByZXFPcHRzLnRpbWVvdXRzID0gY2xpZW50Ll9nZXRUaW1lb3V0c0ZvclJlcXVlc3QoaW5pdGlhbE9wdHMuaG9zdFR5cGUpO1xuICAgICAgcmV0dXJuIGRvUmVxdWVzdChyZXF1ZXN0ZXIsIHJlcU9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm9taXNlID0gZG9SZXF1ZXN0KFxuICAgIGNsaWVudC5fcmVxdWVzdCwge1xuICAgICAgdXJsOiBpbml0aWFsT3B0cy51cmwsXG4gICAgICBtZXRob2Q6IGluaXRpYWxPcHRzLm1ldGhvZCxcbiAgICAgIGJvZHk6IGJvZHksXG4gICAgICBqc29uQm9keTogaW5pdGlhbE9wdHMuYm9keSxcbiAgICAgIHRpbWVvdXRzOiBjbGllbnQuX2dldFRpbWVvdXRzRm9yUmVxdWVzdChpbml0aWFsT3B0cy5ob3N0VHlwZSlcbiAgICB9XG4gICk7XG5cbiAgLy8gZWl0aGVyIHdlIGhhdmUgYSBjYWxsYmFja1xuICAvLyBlaXRoZXIgd2UgYXJlIHVzaW5nIHByb21pc2VzXG4gIGlmIChpbml0aWFsT3B0cy5jYWxsYmFjaykge1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiBva0NiKGNvbnRlbnQpIHtcbiAgICAgIGV4aXRQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpbml0aWFsT3B0cy5jYWxsYmFjayhudWxsLCBjb250ZW50KTtcbiAgICAgIH0sIGNsaWVudC5fc2V0VGltZW91dCB8fCBzZXRUaW1lb3V0KTtcbiAgICB9LCBmdW5jdGlvbiBub29rQ2IoZXJyKSB7XG4gICAgICBleGl0UHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbE9wdHMuY2FsbGJhY2soZXJyKTtcbiAgICAgIH0sIGNsaWVudC5fc2V0VGltZW91dCB8fCBzZXRUaW1lb3V0KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufTtcblxuLypcbiogVHJhbnNmb3JtIHNlYXJjaCBwYXJhbSBvYmplY3QgaW4gcXVlcnkgc3RyaW5nXG4qL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9nZXRTZWFyY2hQYXJhbXMgPSBmdW5jdGlvbihhcmdzLCBwYXJhbXMpIHtcbiAgaWYgKGFyZ3MgPT09IHVuZGVmaW5lZCB8fCBhcmdzID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gYXJncykge1xuICAgIGlmIChrZXkgIT09IG51bGwgJiYgYXJnc1trZXldICE9PSB1bmRlZmluZWQgJiYgYXJncy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBwYXJhbXMgKz0gcGFyYW1zID09PSAnJyA/ICcnIDogJyYnO1xuICAgICAgcGFyYW1zICs9IGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnc1trZXldKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA/IHNhZmVKU09OU3RyaW5naWZ5KGFyZ3Nba2V5XSkgOiBhcmdzW2tleV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9jb21wdXRlUmVxdWVzdEhlYWRlcnMgPSBmdW5jdGlvbih3aXRoQVBJS2V5KSB7XG4gIHZhciBmb3JFYWNoID0gcmVxdWlyZSgnZm9yZWFjaCcpO1xuXG4gIHZhciByZXF1ZXN0SGVhZGVycyA9IHtcbiAgICAneC1hbGdvbGlhLWFnZW50JzogdGhpcy5fdWEsXG4gICAgJ3gtYWxnb2xpYS1hcHBsaWNhdGlvbi1pZCc6IHRoaXMuYXBwbGljYXRpb25JRFxuICB9O1xuXG4gIC8vIGJyb3dzZXIgd2lsbCBpbmxpbmUgaGVhZGVycyBpbiB0aGUgdXJsLCBub2RlLmpzIHdpbGwgdXNlIGh0dHAgaGVhZGVyc1xuICAvLyBidXQgaW4gc29tZSBzaXR1YXRpb25zLCB0aGUgQVBJIEtFWSB3aWxsIGJlIHRvbyBsb25nIChiaWcgc2VjdXJlZCBBUEkga2V5cylcbiAgLy8gc28gaWYgdGhlIHJlcXVlc3QgaXMgYSBQT1NUIGFuZCB0aGUgS0VZIGlzIHZlcnkgbG9uZywgd2Ugd2lsbCBiZSBhc2tlZCB0byBub3QgcHV0XG4gIC8vIGl0IGludG8gaGVhZGVycyBidXQgaW4gdGhlIEpTT04gYm9keVxuICBpZiAod2l0aEFQSUtleSAhPT0gZmFsc2UpIHtcbiAgICByZXF1ZXN0SGVhZGVyc1sneC1hbGdvbGlhLWFwaS1rZXknXSA9IHRoaXMuYXBpS2V5O1xuICB9XG5cbiAgaWYgKHRoaXMudXNlclRva2VuKSB7XG4gICAgcmVxdWVzdEhlYWRlcnNbJ3gtYWxnb2xpYS11c2VydG9rZW4nXSA9IHRoaXMudXNlclRva2VuO1xuICB9XG5cbiAgaWYgKHRoaXMuc2VjdXJpdHlUYWdzKSB7XG4gICAgcmVxdWVzdEhlYWRlcnNbJ3gtYWxnb2xpYS10YWdmaWx0ZXJzJ10gPSB0aGlzLnNlY3VyaXR5VGFncztcbiAgfVxuXG4gIGlmICh0aGlzLmV4dHJhSGVhZGVycykge1xuICAgIGZvckVhY2godGhpcy5leHRyYUhlYWRlcnMsIGZ1bmN0aW9uIGFkZFRvUmVxdWVzdEhlYWRlcnMoaGVhZGVyKSB7XG4gICAgICByZXF1ZXN0SGVhZGVyc1toZWFkZXIubmFtZV0gPSBoZWFkZXIudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVxdWVzdEhlYWRlcnM7XG59O1xuXG4vKipcbiAqIFNlYXJjaCB0aHJvdWdoIG11bHRpcGxlIGluZGljZXMgYXQgdGhlIHNhbWUgdGltZVxuICogQHBhcmFtICB7T2JqZWN0W119ICAgcXVlcmllcyAgQW4gYXJyYXkgb2YgcXVlcmllcyB5b3Ugd2FudCB0byBydW4uXG4gKiBAcGFyYW0ge3N0cmluZ30gcXVlcmllc1tdLmluZGV4TmFtZSBUaGUgaW5kZXggbmFtZSB5b3Ugd2FudCB0byB0YXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcXVlcmllc1tdLnF1ZXJ5XSBUaGUgcXVlcnkgdG8gaXNzdWUgb24gdGhpcyBpbmRleC4gQ2FuIGFsc28gYmUgcGFzc2VkIGludG8gYHBhcmFtc2BcbiAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyaWVzW10ucGFyYW1zIEFueSBzZWFyY2ggcGFyYW0gbGlrZSBoaXRzUGVyUGFnZSwgLi5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBiZSBjYWxsZWRcbiAqIEByZXR1cm4ge1Byb21pc2V8dW5kZWZpbmVkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBnaXZlblxuICovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24ocXVlcmllcywgb3B0cywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciBtYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xuXG4gIHZhciB1c2FnZSA9ICdVc2FnZTogY2xpZW50LnNlYXJjaChhcnJheU9mUXVlcmllc1ssIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShxdWVyaWVzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9IGVsc2UgaWYgKG9wdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHZhciBjbGllbnQgPSB0aGlzO1xuXG4gIHZhciBwb3N0T2JqID0ge1xuICAgIHJlcXVlc3RzOiBtYXAocXVlcmllcywgZnVuY3Rpb24gcHJlcGFyZVJlcXVlc3QocXVlcnkpIHtcbiAgICAgIHZhciBwYXJhbXMgPSAnJztcblxuICAgICAgLy8gYWxsb3cgcXVlcnkucXVlcnlcbiAgICAgIC8vIHNvIHdlIGFyZSBtaW1pY2luZyB0aGUgaW5kZXguc2VhcmNoKHF1ZXJ5LCBwYXJhbXMpIG1ldGhvZFxuICAgICAgLy8ge2luZGV4TmFtZTosIHF1ZXJ5OiwgcGFyYW1zOn1cbiAgICAgIGlmIChxdWVyeS5xdWVyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBhcmFtcyArPSAncXVlcnk9JyArIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeS5xdWVyeSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluZGV4TmFtZTogcXVlcnkuaW5kZXhOYW1lLFxuICAgICAgICBwYXJhbXM6IGNsaWVudC5fZ2V0U2VhcmNoUGFyYW1zKHF1ZXJ5LnBhcmFtcywgcGFyYW1zKVxuICAgICAgfTtcbiAgICB9KVxuICB9O1xuXG4gIHZhciBKU09OUFBhcmFtcyA9IG1hcChwb3N0T2JqLnJlcXVlc3RzLCBmdW5jdGlvbiBwcmVwYXJlSlNPTlBQYXJhbXMocmVxdWVzdCwgcmVxdWVzdElkKSB7XG4gICAgcmV0dXJuIHJlcXVlc3RJZCArICc9JyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQoXG4gICAgICAgICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQocmVxdWVzdC5pbmRleE5hbWUpICsgJz8nICtcbiAgICAgICAgcmVxdWVzdC5wYXJhbXNcbiAgICAgICk7XG4gIH0pLmpvaW4oJyYnKTtcblxuICB2YXIgdXJsID0gJy8xL2luZGV4ZXMvKi9xdWVyaWVzJztcblxuICBpZiAob3B0cy5zdHJhdGVneSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdXJsICs9ICc/c3RyYXRlZ3k9JyArIG9wdHMuc3RyYXRlZ3k7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIGNhY2hlOiB0aGlzLmNhY2hlLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogdXJsLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBmYWxsYmFjazoge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy8xL2luZGV4ZXMvKicsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHBhcmFtczogSlNPTlBQYXJhbXNcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBleHRyYSBzZWN1cml0eSB0YWdGaWx0ZXJzIGhlYWRlclxuICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHRhZ3MgVGhlIGxpc3Qgb2YgdGFncyBkZWZpbmluZyB0aGUgY3VycmVudCBzZWN1cml0eSBmaWx0ZXJzXG4gKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5zZXRTZWN1cml0eVRhZ3MgPSBmdW5jdGlvbih0YWdzKSB7XG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFncykgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICB2YXIgc3RyVGFncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YWdzW2ldKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICB2YXIgb3JlZFRhZ3MgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0YWdzW2ldLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgb3JlZFRhZ3MucHVzaCh0YWdzW2ldW2pdKTtcbiAgICAgICAgfVxuICAgICAgICBzdHJUYWdzLnB1c2goJygnICsgb3JlZFRhZ3Muam9pbignLCcpICsgJyknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0clRhZ3MucHVzaCh0YWdzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGFncyA9IHN0clRhZ3Muam9pbignLCcpO1xuICB9XG5cbiAgdGhpcy5zZWN1cml0eVRhZ3MgPSB0YWdzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGV4dHJhIHVzZXIgdG9rZW4gaGVhZGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXNlclRva2VuIFRoZSB0b2tlbiBpZGVudGlmeWluZyBhIHVuaXEgdXNlciAodXNlZCB0byBhcHBseSByYXRlIGxpbWl0cylcbiAqL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLnNldFVzZXJUb2tlbiA9IGZ1bmN0aW9uKHVzZXJUb2tlbikge1xuICB0aGlzLnVzZXJUb2tlbiA9IHVzZXJUb2tlbjtcbn07XG5cbi8qKlxuICogQ2xlYXIgYWxsIHF1ZXJpZXMgaW4gY2xpZW50J3MgY2FjaGVcbiAqIEByZXR1cm4gdW5kZWZpbmVkXG4gKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5jbGVhckNhY2hlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY2FjaGUgPSB7fTtcbn07XG5cbi8qKlxuKiBTZXQgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYSByZXF1ZXN0IGNhbiB0YWtlIGJlZm9yZSBhdXRvbWF0aWNhbGx5IGJlaW5nIHRlcm1pbmF0ZWQuXG4qIEBkZXByZWNhdGVkXG4qIEBwYXJhbSB7TnVtYmVyfSBtaWxsaXNlY29uZHNcbiovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuc2V0UmVxdWVzdFRpbWVvdXQgPSBmdW5jdGlvbihtaWxsaXNlY29uZHMpIHtcbiAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgIHRoaXMuX3RpbWVvdXRzLmNvbm5lY3QgPSB0aGlzLl90aW1lb3V0cy5yZWFkID0gdGhpcy5fdGltZW91dHMud3JpdGUgPSBtaWxsaXNlY29uZHM7XG4gIH1cbn07XG5cbi8qKlxuKiBTZXQgdGhlIHRocmVlIGRpZmZlcmVudCAoY29ubmVjdCwgcmVhZCwgd3JpdGUpIHRpbWVvdXRzIHRvIGJlIHVzZWQgd2hlbiByZXF1ZXN0aW5nXG4qIEBwYXJhbSB7T2JqZWN0fSB0aW1lb3V0c1xuKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5zZXRUaW1lb3V0cyA9IGZ1bmN0aW9uKHRpbWVvdXRzKSB7XG4gIHRoaXMuX3RpbWVvdXRzID0gdGltZW91dHM7XG59O1xuXG4vKipcbiogR2V0IHRoZSB0aHJlZSBkaWZmZXJlbnQgKGNvbm5lY3QsIHJlYWQsIHdyaXRlKSB0aW1lb3V0cyB0byBiZSB1c2VkIHdoZW4gcmVxdWVzdGluZ1xuKiBAcGFyYW0ge09iamVjdH0gdGltZW91dHNcbiovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuZ2V0VGltZW91dHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX3RpbWVvdXRzO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9nZXRBcHBJZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGEgPSBzdG9yZS5nZXQodGhpcy5hcHBsaWNhdGlvbklEKTtcbiAgaWYgKGRhdGEgIT09IG51bGwpIHRoaXMuX2NhY2hlQXBwSWREYXRhKGRhdGEpO1xuICByZXR1cm4gZGF0YTtcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fc2V0QXBwSWREYXRhID0gZnVuY3Rpb24oZGF0YSkge1xuICBkYXRhLmxhc3RDaGFuZ2UgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICB0aGlzLl9jYWNoZUFwcElkRGF0YShkYXRhKTtcbiAgcmV0dXJuIHN0b3JlLnNldCh0aGlzLmFwcGxpY2F0aW9uSUQsIGRhdGEpO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9jaGVja0FwcElkRGF0YSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSA9IHRoaXMuX2dldEFwcElkRGF0YSgpO1xuICB2YXIgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgaWYgKGRhdGEgPT09IG51bGwgfHwgbm93IC0gZGF0YS5sYXN0Q2hhbmdlID4gUkVTRVRfQVBQX0RBVEFfVElNRVIpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzZXRJbml0aWFsQXBwSWREYXRhKGRhdGEpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX3Jlc2V0SW5pdGlhbEFwcElkRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdmFyIG5ld0RhdGEgPSBkYXRhIHx8IHt9O1xuICBuZXdEYXRhLmhvc3RJbmRleGVzID0ge3JlYWQ6IDAsIHdyaXRlOiAwfTtcbiAgbmV3RGF0YS50aW1lb3V0TXVsdGlwbGllciA9IDE7XG4gIG5ld0RhdGEuc2h1ZmZsZVJlc3VsdCA9IG5ld0RhdGEuc2h1ZmZsZVJlc3VsdCB8fCBzaHVmZmxlKFsxLCAyLCAzXSk7XG4gIHJldHVybiB0aGlzLl9zZXRBcHBJZERhdGEobmV3RGF0YSk7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX2NhY2hlQXBwSWREYXRhID0gZnVuY3Rpb24oZGF0YSkge1xuICB0aGlzLl9ob3N0SW5kZXhlcyA9IGRhdGEuaG9zdEluZGV4ZXM7XG4gIHRoaXMuX3RpbWVvdXRNdWx0aXBsaWVyID0gZGF0YS50aW1lb3V0TXVsdGlwbGllcjtcbiAgdGhpcy5fc2h1ZmZsZVJlc3VsdCA9IGRhdGEuc2h1ZmZsZVJlc3VsdDtcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fcGFydGlhbEFwcElkRGF0YVVwZGF0ZSA9IGZ1bmN0aW9uKG5ld0RhdGEpIHtcbiAgdmFyIGZvcmVhY2ggPSByZXF1aXJlKCdmb3JlYWNoJyk7XG4gIHZhciBjdXJyZW50RGF0YSA9IHRoaXMuX2dldEFwcElkRGF0YSgpO1xuICBmb3JlYWNoKG5ld0RhdGEsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICBjdXJyZW50RGF0YVtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzLl9zZXRBcHBJZERhdGEoY3VycmVudERhdGEpO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9nZXRIb3N0QnlUeXBlID0gZnVuY3Rpb24oaG9zdFR5cGUpIHtcbiAgcmV0dXJuIHRoaXMuaG9zdHNbaG9zdFR5cGVdW3RoaXMuX2dldEhvc3RJbmRleEJ5VHlwZShob3N0VHlwZSldO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9nZXRUaW1lb3V0TXVsdGlwbGllciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fdGltZW91dE11bHRpcGxpZXI7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX2dldEhvc3RJbmRleEJ5VHlwZSA9IGZ1bmN0aW9uKGhvc3RUeXBlKSB7XG4gIHJldHVybiB0aGlzLl9ob3N0SW5kZXhlc1tob3N0VHlwZV07XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX3NldEhvc3RJbmRleEJ5VHlwZSA9IGZ1bmN0aW9uKGhvc3RJbmRleCwgaG9zdFR5cGUpIHtcbiAgdmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZScpO1xuICB2YXIgbmV3SG9zdEluZGV4ZXMgPSBjbG9uZSh0aGlzLl9ob3N0SW5kZXhlcyk7XG4gIG5ld0hvc3RJbmRleGVzW2hvc3RUeXBlXSA9IGhvc3RJbmRleDtcbiAgdGhpcy5fcGFydGlhbEFwcElkRGF0YVVwZGF0ZSh7aG9zdEluZGV4ZXM6IG5ld0hvc3RJbmRleGVzfSk7XG4gIHJldHVybiBob3N0SW5kZXg7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX2luY3JlbWVudEhvc3RJbmRleCA9IGZ1bmN0aW9uKGhvc3RUeXBlKSB7XG4gIHJldHVybiB0aGlzLl9zZXRIb3N0SW5kZXhCeVR5cGUoXG4gICAgKHRoaXMuX2dldEhvc3RJbmRleEJ5VHlwZShob3N0VHlwZSkgKyAxKSAlIHRoaXMuaG9zdHNbaG9zdFR5cGVdLmxlbmd0aCwgaG9zdFR5cGVcbiAgKTtcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5faW5jcmVtZW50VGltZW91dE11bHRpcGxlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGltZW91dE11bHRpcGxpZXIgPSBNYXRoLm1heCh0aGlzLl90aW1lb3V0TXVsdGlwbGllciArIDEsIDQpO1xuICByZXR1cm4gdGhpcy5fcGFydGlhbEFwcElkRGF0YVVwZGF0ZSh7dGltZW91dE11bHRpcGxpZXI6IHRpbWVvdXRNdWx0aXBsaWVyfSk7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX2dldFRpbWVvdXRzRm9yUmVxdWVzdCA9IGZ1bmN0aW9uKGhvc3RUeXBlKSB7XG4gIHJldHVybiB7XG4gICAgY29ubmVjdDogdGhpcy5fdGltZW91dHMuY29ubmVjdCAqIHRoaXMuX3RpbWVvdXRNdWx0aXBsaWVyLFxuICAgIGNvbXBsZXRlOiB0aGlzLl90aW1lb3V0c1tob3N0VHlwZV0gKiB0aGlzLl90aW1lb3V0TXVsdGlwbGllclxuICB9O1xufTtcblxuZnVuY3Rpb24gcHJlcGFyZUhvc3QocHJvdG9jb2wpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByZXBhcmUoaG9zdCkge1xuICAgIHJldHVybiBwcm90b2NvbCArICcvLycgKyBob3N0LnRvTG93ZXJDYXNlKCk7XG4gIH07XG59XG5cbi8vIFByb3RvdHlwZS5qcyA8IDEuNywgYSB3aWRlbHkgdXNlZCBsaWJyYXJ5LCBkZWZpbmVzIGEgd2VpcmRcbi8vIEFycmF5LnByb3RvdHlwZS50b0pTT04gZnVuY3Rpb24gdGhhdCB3aWxsIGZhaWwgdG8gc3RyaW5naWZ5IG91ciBjb250ZW50XG4vLyBhcHByb3ByaWF0ZWx5XG4vLyByZWZzOlxuLy8gICAtIGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyF0b3BpYy9wcm90b3R5cGUtY29yZS9FLVNBVnZWX1Y5UVxuLy8gICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9zc3RlcGhlbnNvbi9wcm90b3R5cGUvY29tbWl0LzAzOGEyOTg1YTcwNTkzYzFhODZjMjMwZmFkYmRmZTJlNDg5OGE0OGNcbi8vICAgLSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTQ4NDQxLzE0NzA3OVxuZnVuY3Rpb24gc2FmZUpTT05TdHJpbmdpZnkob2JqKSB7XG4gIC8qIGVzbGludCBuby1leHRlbmQtbmF0aXZlOjAgKi9cblxuICBpZiAoQXJyYXkucHJvdG90eXBlLnRvSlNPTiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH1cblxuICB2YXIgdG9KU09OID0gQXJyYXkucHJvdG90eXBlLnRvSlNPTjtcbiAgZGVsZXRlIEFycmF5LnByb3RvdHlwZS50b0pTT047XG4gIHZhciBvdXQgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuICBBcnJheS5wcm90b3R5cGUudG9KU09OID0gdG9KU09OO1xuXG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcbiAgdmFyIHRlbXBvcmFyeVZhbHVlO1xuICB2YXIgcmFuZG9tSW5kZXg7XG5cbiAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ3JlZGVudGlhbHMoaGVhZGVycykge1xuICB2YXIgbmV3SGVhZGVycyA9IHt9O1xuXG4gIGZvciAodmFyIGhlYWRlck5hbWUgaW4gaGVhZGVycykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaGVhZGVycywgaGVhZGVyTmFtZSkpIHtcbiAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgaWYgKGhlYWRlck5hbWUgPT09ICd4LWFsZ29saWEtYXBpLWtleScgfHwgaGVhZGVyTmFtZSA9PT0gJ3gtYWxnb2xpYS1hcHBsaWNhdGlvbi1pZCcpIHtcbiAgICAgICAgdmFsdWUgPSAnKipoaWRkZW4gZm9yIHNlY3VyaXR5IHB1cnBvc2VzKionO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBoZWFkZXJzW2hlYWRlck5hbWVdO1xuICAgICAgfVxuXG4gICAgICBuZXdIZWFkZXJzW2hlYWRlck5hbWVdID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0hlYWRlcnM7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL0FsZ29saWFTZWFyY2hDb3JlLmpzIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsInZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FsZ29saWFzZWFyY2g6c3JjL2hvc3RJbmRleFN0YXRlLmpzJyk7XG52YXIgbG9jYWxTdG9yYWdlTmFtZXNwYWNlID0gJ2FsZ29saWFzZWFyY2gtY2xpZW50LWpzJztcblxudmFyIHN0b3JlO1xudmFyIG1vZHVsZVN0b3JlID0ge1xuICBzdGF0ZToge30sXG4gIHNldDogZnVuY3Rpb24oa2V5LCBkYXRhKSB7XG4gICAgdGhpcy5zdGF0ZVtrZXldID0gZGF0YTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVtrZXldO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlW2tleV0gfHwgbnVsbDtcbiAgfVxufTtcblxudmFyIGxvY2FsU3RvcmFnZVN0b3JlID0ge1xuICBzZXQ6IGZ1bmN0aW9uKGtleSwgZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgbmFtZXNwYWNlID0gSlNPTi5wYXJzZShnbG9iYWwubG9jYWxTdG9yYWdlW2xvY2FsU3RvcmFnZU5hbWVzcGFjZV0pO1xuICAgICAgbmFtZXNwYWNlW2tleV0gPSBkYXRhO1xuICAgICAgZ2xvYmFsLmxvY2FsU3RvcmFnZVtsb2NhbFN0b3JhZ2VOYW1lc3BhY2VdID0gSlNPTi5zdHJpbmdpZnkobmFtZXNwYWNlKTtcbiAgICAgIHJldHVybiBuYW1lc3BhY2Vba2V5XTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkZWJ1ZygnbG9jYWxTdG9yYWdlIHNldCBmYWlsZWQgd2l0aCcsIGUpO1xuICAgICAgY2xlYW51cCgpO1xuICAgICAgc3RvcmUgPSBtb2R1bGVTdG9yZTtcbiAgICAgIHJldHVybiBzdG9yZS5zZXQoa2V5LCBkYXRhKTtcbiAgICB9XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZ2xvYmFsLmxvY2FsU3RvcmFnZVtsb2NhbFN0b3JhZ2VOYW1lc3BhY2VdKVtrZXldIHx8IG51bGw7XG4gIH1cbn07XG5cbnN0b3JlID0gc3VwcG9ydHNMb2NhbFN0b3JhZ2UoKSA/IGxvY2FsU3RvcmFnZVN0b3JlIDogbW9kdWxlU3RvcmU7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXQ6IGdldE9yU2V0LFxuICBzZXQ6IGdldE9yU2V0XG59O1xuXG5mdW5jdGlvbiBnZXRPclNldChrZXksIGRhdGEpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gc3RvcmUuZ2V0KGtleSk7XG4gIH1cblxuICByZXR1cm4gc3RvcmUuc2V0KGtleSwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzTG9jYWxTdG9yYWdlKCkge1xuICB0cnkge1xuICAgIGlmICgnbG9jYWxTdG9yYWdlJyBpbiBnbG9iYWwgJiZcbiAgICAgIGdsb2JhbC5sb2NhbFN0b3JhZ2UgIT09IG51bGwgJiZcbiAgICAgICFnbG9iYWwubG9jYWxTdG9yYWdlW2xvY2FsU3RvcmFnZU5hbWVzcGFjZV0pIHtcbiAgICAgIC8vIGFjdHVhbCBjcmVhdGlvbiBvZiB0aGUgbmFtZXNwYWNlXG4gICAgICBnbG9iYWwubG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlTmFtZXNwYWNlLCBKU09OLnN0cmluZ2lmeSh7fSkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8vIEluIGNhc2Ugb2YgYW55IGVycm9yIG9uIGxvY2FsU3RvcmFnZSwgd2UgY2xlYW4gb3VyIG93biBuYW1lc3BhY2UsIHRoaXMgc2hvdWxkIGhhbmRsZVxuLy8gcXVvdGEgZXJyb3JzIHdoZW4gYSBsb3Qgb2Yga2V5cyArIGRhdGEgYXJlIHVzZWRcbmZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gIHRyeSB7XG4gICAgZ2xvYmFsLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGxvY2FsU3RvcmFnZU5hbWVzcGFjZSk7XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICAvLyBub3RoaW5nIHRvIGRvXG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvc3RvcmUuanMiLCIvKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWVcbiAgICAgICAgICAgICAgICYmICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWUuc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgPyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgICAgICAgICAgICAgOiBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICdsaWdodHNlYWdyZWVuJyxcbiAgJ2ZvcmVzdGdyZWVuJyxcbiAgJ2dvbGRlbnJvZCcsXG4gICdkb2RnZXJibHVlJyxcbiAgJ2RhcmtvcmNoaWQnLFxuICAnY3JpbXNvbidcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICAvLyBOQjogSW4gYW4gRWxlY3Ryb24gcHJlbG9hZCBzY3JpcHQsIGRvY3VtZW50IHdpbGwgYmUgZGVmaW5lZCBidXQgbm90IGZ1bGx5XG4gIC8vIGluaXRpYWxpemVkLiBTaW5jZSB3ZSBrbm93IHdlJ3JlIGluIENocm9tZSwgd2UnbGwganVzdCBkZXRlY3QgdGhpcyBjYXNlXG4gIC8vIGV4cGxpY2l0bHlcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAmJiB0eXBlb2Ygd2luZG93LnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG4gIHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudCAmJiAnV2Via2l0QXBwZWFyYW5jZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKSB8fFxuICAgIC8vIGlzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICYmIHdpbmRvdy5jb25zb2xlICYmIChjb25zb2xlLmZpcmVidWcgfHwgKGNvbnNvbGUuZXhjZXB0aW9uICYmIGNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLCAxMCkgPj0gMzEpIHx8XG4gICAgLy8gZG91YmxlIGNoZWNrIHdlYmtpdCBpbiB1c2VyQWdlbnQganVzdCBpbiBjYXNlIHdlIGFyZSBpbiBhIHdvcmtlclxuICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnIubWVzc2FnZTtcbiAgfVxufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm47XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKVxuXG4gIC8vIHRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG4gIC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cbiAgLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIGlmICgnJSUnID09PSBtYXRjaCkgcmV0dXJuO1xuICAgIGluZGV4Kys7XG4gICAgaWYgKCclYycgPT09IG1hdGNoKSB7XG4gICAgICAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgYXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuc3RvcmFnZS5kZWJ1ZztcbiAgfSBjYXRjaChlKSB7fVxuXG4gIC8vIElmIGRlYnVnIGlzbid0IHNldCBpbiBMUywgYW5kIHdlJ3JlIGluIEVsZWN0cm9uLCB0cnkgdG8gbG9hZCAkREVCVUdcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAnZW52JyBpbiBwcm9jZXNzKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MuZW52LkRFQlVHO1xuICB9XG59XG5cbi8qKlxuICogRW5hYmxlIG5hbWVzcGFjZXMgbGlzdGVkIGluIGBsb2NhbFN0b3JhZ2UuZGVidWdgIGluaXRpYWxseS5cbiAqL1xuXG5leHBvcnRzLmVuYWJsZShsb2FkKCkpO1xuXG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvY2Fsc3RvcmFnZSgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgfSBjYXRjaCAoZSkge31cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L2RlYnVnL3NyYy9icm93c2VyLmpzIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWcuZGVmYXVsdCA9IGNyZWF0ZURlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAqL1xuXG52YXIgcHJldlRpbWU7XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcbiAgdmFyIGhhc2ggPSAwLCBpO1xuXG4gIGZvciAoaSBpbiBuYW1lc3BhY2UpIHtcbiAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXG4gIGZ1bmN0aW9uIGRlYnVnKCkge1xuICAgIC8vIGRpc2FibGVkP1xuICAgIGlmICghZGVidWcuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgdmFyIHNlbGYgPSBkZWJ1ZztcblxuICAgIC8vIHNldCBgZGlmZmAgdGltZXN0YW1wXG4gICAgdmFyIGN1cnIgPSArbmV3IERhdGUoKTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuICAgIHNlbGYuZGlmZiA9IG1zO1xuICAgIHNlbGYucHJldiA9IHByZXZUaW1lO1xuICAgIHNlbGYuY3VyciA9IGN1cnI7XG4gICAgcHJldlRpbWUgPSBjdXJyO1xuXG4gICAgLy8gdHVybiB0aGUgYGFyZ3VtZW50c2AgaW50byBhIHByb3BlciBBcnJheVxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlT1xuICAgICAgYXJncy51bnNoaWZ0KCclTycpO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgZnVuY3Rpb24obWF0Y2gsIGZvcm1hdCkge1xuICAgICAgLy8gaWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuICAgICAgaWYgKG1hdGNoID09PSAnJSUnKSByZXR1cm4gbWF0Y2g7XG4gICAgICBpbmRleCsrO1xuICAgICAgdmFyIGZvcm1hdHRlciA9IGV4cG9ydHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBtYXRjaCA9IGZvcm1hdHRlci5jYWxsKHNlbGYsIHZhbCk7XG5cbiAgICAgICAgLy8gbm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuICAgICAgICBhcmdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGluZGV4LS07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG5cbiAgICAvLyBhcHBseSBlbnYtc3BlY2lmaWMgZm9ybWF0dGluZyAoY29sb3JzLCBldGMuKVxuICAgIGV4cG9ydHMuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuXG4gICAgdmFyIGxvZ0ZuID0gZGVidWcubG9nIHx8IGV4cG9ydHMubG9nIHx8IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4gICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cblxuICBkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIGRlYnVnLmVuYWJsZWQgPSBleHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKTtcbiAgZGVidWcudXNlQ29sb3JzID0gZXhwb3J0cy51c2VDb2xvcnMoKTtcbiAgZGVidWcuY29sb3IgPSBzZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXG4gIC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5pbml0KSB7XG4gICAgZXhwb3J0cy5pbml0KGRlYnVnKTtcbiAgfVxuXG4gIHJldHVybiBkZWJ1Zztcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICB2YXIgc3BsaXQgPSAobmFtZXNwYWNlcyB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgdmFyIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9kZWJ1Zy9zcmMvZGVidWcuanMiLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwXG52YXIgbSA9IHMgKiA2MFxudmFyIGggPSBtICogNjBcbnZhciBkID0gaCAqIDI0XG52YXIgeSA9IGQgKiAzNjUuMjVcblxuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWxcbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbClcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWwpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgP1xuXHRcdFx0Zm10TG9uZyh2YWwpIDpcblx0XHRcdGZtdFNob3J0KHZhbClcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ3ZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgdmFsaWQgbnVtYmVyLiB2YWw9JyArIEpTT04uc3RyaW5naWZ5KHZhbCkpXG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKVxuICBpZiAoc3RyLmxlbmd0aCA+IDEwMDAwKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhzdHIpXG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pXG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKClcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZFxuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaFxuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgY2FzZSAnbWlucyc6XG4gICAgY2FzZSAnbWluJzpcbiAgICBjYXNlICdtJzpcbiAgICAgIHJldHVybiBuICogbVxuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogc1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCdcbiAgfVxuICBpZiAobXMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCdcbiAgfVxuICBpZiAobXMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSdcbiAgfVxuICBpZiAobXMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncydcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnXG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHJldHVybiBwbHVyYWwobXMsIGQsICdkYXknKSB8fFxuICAgIHBsdXJhbChtcywgaCwgJ2hvdXInKSB8fFxuICAgIHBsdXJhbChtcywgbSwgJ21pbnV0ZScpIHx8XG4gICAgcGx1cmFsKG1zLCBzLCAnc2Vjb25kJykgfHxcbiAgICBtcyArICcgbXMnXG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHtcbiAgICByZXR1cm5cbiAgfVxuICBpZiAobXMgPCBuICogMS41KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWVcbiAgfVxuICByZXR1cm4gTWF0aC5jZWlsKG1zIC8gbikgKyAnICcgKyBuYW1lICsgJ3MnXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9kZWJ1Zy9+L21zL2luZGV4LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnZ2xvYmFsJyk7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlIHx8IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcblxuLy8gVGhpcyBpcyB0aGUgc3RhbmRhbG9uZSBicm93c2VyIGJ1aWxkIGVudHJ5IHBvaW50XG4vLyBCcm93c2VyIGltcGxlbWVudGF0aW9uIG9mIHRoZSBBbGdvbGlhIFNlYXJjaCBKYXZhU2NyaXB0IGNsaWVudCxcbi8vIHVzaW5nIFhNTEh0dHBSZXF1ZXN0LCBYRG9tYWluUmVxdWVzdCBhbmQgSlNPTlAgYXMgZmFsbGJhY2tcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlQWxnb2xpYXNlYXJjaChBbGdvbGlhU2VhcmNoLCB1YVN1ZmZpeCkge1xuICB2YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuICB2YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJyk7XG4gIHZhciBpbmxpbmVIZWFkZXJzID0gcmVxdWlyZSgnLi9pbmxpbmUtaGVhZGVycycpO1xuICB2YXIganNvbnBSZXF1ZXN0ID0gcmVxdWlyZSgnLi9qc29ucC1yZXF1ZXN0Jyk7XG4gIHZhciBwbGFjZXMgPSByZXF1aXJlKCcuLi9wbGFjZXMuanMnKTtcbiAgdWFTdWZmaXggPSB1YVN1ZmZpeCB8fCAnJztcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZWJ1ZycpIHtcbiAgICByZXF1aXJlKCdkZWJ1ZycpLmVuYWJsZSgnYWxnb2xpYXNlYXJjaConKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsZ29saWFzZWFyY2goYXBwbGljYXRpb25JRCwgYXBpS2V5LCBvcHRzKSB7XG4gICAgdmFyIGNsb25lRGVlcCA9IHJlcXVpcmUoJy4uL2Nsb25lLmpzJyk7XG5cbiAgICB2YXIgZ2V0RG9jdW1lbnRQcm90b2NvbCA9IHJlcXVpcmUoJy4vZ2V0LWRvY3VtZW50LXByb3RvY29sJyk7XG5cbiAgICBvcHRzID0gY2xvbmVEZWVwKG9wdHMgfHwge30pO1xuXG4gICAgaWYgKG9wdHMucHJvdG9jb2wgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0cy5wcm90b2NvbCA9IGdldERvY3VtZW50UHJvdG9jb2woKTtcbiAgICB9XG5cbiAgICBvcHRzLl91YSA9IG9wdHMuX3VhIHx8IGFsZ29saWFzZWFyY2gudWE7XG5cbiAgICByZXR1cm4gbmV3IEFsZ29saWFTZWFyY2hCcm93c2VyKGFwcGxpY2F0aW9uSUQsIGFwaUtleSwgb3B0cyk7XG4gIH1cblxuICBhbGdvbGlhc2VhcmNoLnZlcnNpb24gPSByZXF1aXJlKCcuLi92ZXJzaW9uLmpzJyk7XG4gIGFsZ29saWFzZWFyY2gudWEgPSAnQWxnb2xpYSBmb3IgdmFuaWxsYSBKYXZhU2NyaXB0ICcgKyB1YVN1ZmZpeCArIGFsZ29saWFzZWFyY2gudmVyc2lvbjtcbiAgYWxnb2xpYXNlYXJjaC5pbml0UGxhY2VzID0gcGxhY2VzKGFsZ29saWFzZWFyY2gpO1xuXG4gIC8vIHdlIGV4cG9zZSBpbnRvIHdpbmRvdyBubyBtYXR0ZXIgaG93IHdlIGFyZSB1c2VkLCB0aGlzIHdpbGwgYWxsb3dcbiAgLy8gdXMgdG8gZWFzaWx5IGRlYnVnIGFueSB3ZWJzaXRlIHJ1bm5pbmcgYWxnb2xpYVxuICBnbG9iYWwuX19hbGdvbGlhID0ge1xuICAgIGRlYnVnOiByZXF1aXJlKCdkZWJ1ZycpLFxuICAgIGFsZ29saWFzZWFyY2g6IGFsZ29saWFzZWFyY2hcbiAgfTtcblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBoYXNYTUxIdHRwUmVxdWVzdDogJ1hNTEh0dHBSZXF1ZXN0JyBpbiBnbG9iYWwsXG4gICAgaGFzWERvbWFpblJlcXVlc3Q6ICdYRG9tYWluUmVxdWVzdCcgaW4gZ2xvYmFsXG4gIH07XG5cbiAgaWYgKHN1cHBvcnQuaGFzWE1MSHR0cFJlcXVlc3QpIHtcbiAgICBzdXBwb3J0LmNvcnMgPSAnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEFsZ29saWFTZWFyY2hCcm93c2VyKCkge1xuICAgIC8vIGNhbGwgQWxnb2xpYVNlYXJjaCBjb25zdHJ1Y3RvclxuICAgIEFsZ29saWFTZWFyY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIGluaGVyaXRzKEFsZ29saWFTZWFyY2hCcm93c2VyLCBBbGdvbGlhU2VhcmNoKTtcblxuICBBbGdvbGlhU2VhcmNoQnJvd3Nlci5wcm90b3R5cGUuX3JlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KHVybCwgb3B0cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiB3cmFwUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIC8vIG5vIGNvcnMgb3IgWERvbWFpblJlcXVlc3QsIG5vIHJlcXVlc3RcbiAgICAgIGlmICghc3VwcG9ydC5jb3JzICYmICFzdXBwb3J0Lmhhc1hEb21haW5SZXF1ZXN0KSB7XG4gICAgICAgIC8vIHZlcnkgb2xkIGJyb3dzZXIsIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgcmVqZWN0KG5ldyBlcnJvcnMuTmV0d29yaygnQ09SUyBub3Qgc3VwcG9ydGVkJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVybCA9IGlubGluZUhlYWRlcnModXJsLCBvcHRzLmhlYWRlcnMpO1xuXG4gICAgICB2YXIgYm9keSA9IG9wdHMuYm9keTtcbiAgICAgIHZhciByZXEgPSBzdXBwb3J0LmNvcnMgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBYRG9tYWluUmVxdWVzdCgpO1xuICAgICAgdmFyIHJlcVRpbWVvdXQ7XG4gICAgICB2YXIgdGltZWRPdXQ7XG4gICAgICB2YXIgY29ubmVjdGVkID0gZmFsc2U7XG5cbiAgICAgIHJlcVRpbWVvdXQgPSBzZXRUaW1lb3V0KG9uVGltZW91dCwgb3B0cy50aW1lb3V0cy5jb25uZWN0KTtcbiAgICAgIC8vIHdlIHNldCBhbiBlbXB0eSBvbnByb2dyZXNzIGxpc3RlbmVyXG4gICAgICAvLyBzbyB0aGF0IFhEb21haW5SZXF1ZXN0IG9uIElFOSBpcyBub3QgYWJvcnRlZFxuICAgICAgLy8gcmVmczpcbiAgICAgIC8vICAtIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGdvbGlhL2FsZ29saWFzZWFyY2gtY2xpZW50LWpzL2lzc3Vlcy83NlxuICAgICAgLy8gIC0gaHR0cHM6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9pZS9lbi1VUy8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmUvaWU5LXJ0bS14ZG9tYWlucmVxdWVzdC1pc3N1ZWQtcmVxdWVzdHMtbWF5LWFib3J0LWlmLWFsbC1ldmVudC1oYW5kbGVycy1ub3Qtc3BlY2lmaWVkP2ZvcnVtPWlld2ViZGV2ZWxvcG1lbnRcbiAgICAgIHJlcS5vbnByb2dyZXNzID0gb25Qcm9ncmVzcztcbiAgICAgIGlmICgnb25yZWFkeXN0YXRlY2hhbmdlJyBpbiByZXEpIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBvblJlYWR5U3RhdGVDaGFuZ2U7XG4gICAgICByZXEub25sb2FkID0gb25Mb2FkO1xuICAgICAgcmVxLm9uZXJyb3IgPSBvbkVycm9yO1xuXG4gICAgICAvLyBkbyBub3QgcmVseSBvbiBkZWZhdWx0IFhIUiBhc3luYyBmbGFnLCBhcyBzb21lIGFuYWx5dGljcyBjb2RlIGxpa2UgaG90amFyXG4gICAgICAvLyBicmVha3MgaXQgYW5kIHNldCBpdCB0byBmYWxzZSBieSBkZWZhdWx0XG4gICAgICBpZiAocmVxIGluc3RhbmNlb2YgWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgcmVxLm9wZW4ob3B0cy5tZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEub3BlbihvcHRzLm1ldGhvZCwgdXJsKTtcbiAgICAgIH1cblxuICAgICAgLy8gaGVhZGVycyBhcmUgbWVhbnQgdG8gYmUgc2VudCBhZnRlciBvcGVuXG4gICAgICBpZiAoc3VwcG9ydC5jb3JzKSB7XG4gICAgICAgIGlmIChib2R5KSB7XG4gICAgICAgICAgaWYgKG9wdHMubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUVFAvQWNjZXNzX2NvbnRyb2xfQ09SUyNTaW1wbGVfcmVxdWVzdHNcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignYWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIH1cblxuICAgICAgcmVxLnNlbmQoYm9keSk7XG5cbiAgICAgIC8vIGV2ZW50IG9iamVjdCBub3QgcmVjZWl2ZWQgaW4gSUU4LCBhdCBsZWFzdFxuICAgICAgLy8gYnV0IHdlIGRvIG5vdCB1c2UgaXQsIHN0aWxsIGltcG9ydGFudCB0byBub3RlXG4gICAgICBmdW5jdGlvbiBvbkxvYWQoLyogZXZlbnQgKi8pIHtcbiAgICAgICAgLy8gV2hlbiBicm93c2VyIGRvZXMgbm90IHN1cHBvcnRzIHJlcS50aW1lb3V0LCB3ZSBjYW5cbiAgICAgICAgLy8gaGF2ZSBib3RoIGEgbG9hZCBhbmQgdGltZW91dCBldmVudCwgc2luY2UgaGFuZGxlZCBieSBhIGR1bWIgc2V0VGltZW91dFxuICAgICAgICBpZiAodGltZWRPdXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQocmVxVGltZW91dCk7XG5cbiAgICAgICAgdmFyIG91dDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIG91dCA9IHtcbiAgICAgICAgICAgIGJvZHk6IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCksXG4gICAgICAgICAgICByZXNwb25zZVRleHQ6IHJlcS5yZXNwb25zZVRleHQsXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiByZXEuc3RhdHVzLFxuICAgICAgICAgICAgLy8gWERvbWFpblJlcXVlc3QgZG9lcyBub3QgaGF2ZSBhbnkgcmVzcG9uc2UgaGVhZGVyc1xuICAgICAgICAgICAgaGVhZGVyczogcmVxLmdldEFsbFJlc3BvbnNlSGVhZGVycyAmJiByZXEuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwge31cbiAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgb3V0ID0gbmV3IGVycm9ycy5VbnBhcnNhYmxlSlNPTih7XG4gICAgICAgICAgICBtb3JlOiByZXEucmVzcG9uc2VUZXh0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3V0IGluc3RhbmNlb2YgZXJyb3JzLlVucGFyc2FibGVKU09OKSB7XG4gICAgICAgICAgcmVqZWN0KG91dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShvdXQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRpbWVkT3V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuXG4gICAgICAgIC8vIGVycm9yIGV2ZW50IGlzIHRyaWdlcnJlZCBib3RoIHdpdGggWERSL1hIUiBvbjpcbiAgICAgICAgLy8gICAtIEROUyBlcnJvclxuICAgICAgICAvLyAgIC0gdW5hbGxvd2VkIGNyb3NzIGRvbWFpbiByZXF1ZXN0XG4gICAgICAgIHJlamVjdChcbiAgICAgICAgICBuZXcgZXJyb3JzLk5ldHdvcmsoe1xuICAgICAgICAgICAgbW9yZTogZXZlbnRcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICAgIHRpbWVkT3V0ID0gdHJ1ZTtcbiAgICAgICAgcmVxLmFib3J0KCk7XG5cbiAgICAgICAgcmVqZWN0KG5ldyBlcnJvcnMuUmVxdWVzdFRpbWVvdXQoKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uQ29ubmVjdCgpIHtcbiAgICAgICAgY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuICAgICAgICByZXFUaW1lb3V0ID0gc2V0VGltZW91dChvblRpbWVvdXQsIG9wdHMudGltZW91dHMuY29tcGxldGUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvblByb2dyZXNzKCkge1xuICAgICAgICBpZiAoIWNvbm5lY3RlZCkgb25Db25uZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uUmVhZHlTdGF0ZUNoYW5nZSgpIHtcbiAgICAgICAgaWYgKCFjb25uZWN0ZWQgJiYgcmVxLnJlYWR5U3RhdGUgPiAxKSBvbkNvbm5lY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBBbGdvbGlhU2VhcmNoQnJvd3Nlci5wcm90b3R5cGUuX3JlcXVlc3QuZmFsbGJhY2sgPSBmdW5jdGlvbiByZXF1ZXN0RmFsbGJhY2sodXJsLCBvcHRzKSB7XG4gICAgdXJsID0gaW5saW5lSGVhZGVycyh1cmwsIG9wdHMuaGVhZGVycyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gd3JhcEpzb25wUmVxdWVzdChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGpzb25wUmVxdWVzdCh1cmwsIG9wdHMsIGZ1bmN0aW9uIGpzb25wUmVxdWVzdERvbmUoZXJyLCBjb250ZW50KSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgQWxnb2xpYVNlYXJjaEJyb3dzZXIucHJvdG90eXBlLl9wcm9taXNlID0ge1xuICAgIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0UHJvbWlzZSh2YWwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh2YWwpO1xuICAgIH0sXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbCk7XG4gICAgfSxcbiAgICBkZWxheTogZnVuY3Rpb24gZGVsYXlQcm9taXNlKG1zKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gcmVzb2x2ZU9uVGltZW91dChyZXNvbHZlLyogLCByZWplY3QqLykge1xuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gYWxnb2xpYXNlYXJjaDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Jyb3dzZXIvY3JlYXRlQWxnb2xpYXNlYXJjaC5qcyIsImlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7fTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L2dsb2JhbC93aW5kb3cuanMiLCIvKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vc3RlZmFucGVubmVyL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDQuMC41XG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICAoZ2xvYmFsLkVTNlByb21pc2UgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbnZhciBfaXNBcnJheSA9IHVuZGVmaW5lZDtcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICBfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbn0gZWxzZSB7XG4gIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbn1cblxudmFyIGlzQXJyYXkgPSBfaXNBcnJheTtcblxudmFyIGxlbiA9IDA7XG52YXIgdmVydHhOZXh0ID0gdW5kZWZpbmVkO1xudmFyIGN1c3RvbVNjaGVkdWxlckZuID0gdW5kZWZpbmVkO1xuXG52YXIgYXNhcCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICBxdWV1ZVtsZW5dID0gY2FsbGJhY2s7XG4gIHF1ZXVlW2xlbiArIDFdID0gYXJnO1xuICBsZW4gKz0gMjtcbiAgaWYgKGxlbiA9PT0gMikge1xuICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICBpZiAoY3VzdG9tU2NoZWR1bGVyRm4pIHtcbiAgICAgIGN1c3RvbVNjaGVkdWxlckZuKGZsdXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgY3VzdG9tU2NoZWR1bGVyRm4gPSBzY2hlZHVsZUZuO1xufVxuXG5mdW5jdGlvbiBzZXRBc2FwKGFzYXBGbikge1xuICBhc2FwID0gYXNhcEZuO1xufVxuXG52YXIgYnJvd3NlcldpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkO1xudmFyIGJyb3dzZXJHbG9iYWwgPSBicm93c2VyV2luZG93IHx8IHt9O1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICh7fSkudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4vLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxudmFyIGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbi8vIHZlcnR4XG5mdW5jdGlvbiB1c2VWZXJ0eFRpbWVyKCkge1xuICBpZiAodHlwZW9mIHZlcnR4TmV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmVydHhOZXh0KGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBub2RlLmRhdGEgPSBpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMjtcbiAgfTtcbn1cblxuLy8gd2ViIHdvcmtlclxuZnVuY3Rpb24gdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIGVzNi1wcm9taXNlIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIGdsb2JhbFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWxTZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuXG4gICAgY2FsbGJhY2soYXJnKTtcblxuICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIGF0dGVtcHRWZXJ0eCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICB2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgIHJldHVybiB1c2VWZXJ0eFRpbWVyKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xuICB9XG59XG5cbnZhciBzY2hlZHVsZUZsdXNoID0gdW5kZWZpbmVkO1xuLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbmlmIChpc05vZGUpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG59IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG59IGVsc2UgaWYgKGlzV29ya2VyKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VNZXNzYWdlQ2hhbm5lbCgpO1xufSBlbHNlIGlmIChicm93c2VyV2luZG93ID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IGF0dGVtcHRWZXJ0eCgpO1xufSBlbHNlIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblxuICB2YXIgcGFyZW50ID0gdGhpcztcblxuICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoY2hpbGRbUFJPTUlTRV9JRF0gPT09IHVuZGVmaW5lZCkge1xuICAgIG1ha2VQcm9taXNlKGNoaWxkKTtcbiAgfVxuXG4gIHZhciBfc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gIGlmIChfc3RhdGUpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gX2FyZ3VtZW50c1tfc3RhdGUgLSAxXTtcbiAgICAgIGFzYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2soX3N0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pKCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlc29sdmVgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgcmVzb2x2ZWQgd2l0aCB0aGVcbiAgcGFzc2VkIGB2YWx1ZWAuIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZXNvbHZlKDEpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgxKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIHZhbHVlID09PSAxXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlc29sdmVcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gdmFsdWUgdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGhcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSBmdWxmaWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAgYHZhbHVlYFxuKi9cbmZ1bmN0aW9uIHJlc29sdmUob2JqZWN0KSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QuY29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxudmFyIFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMTYpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIFBFTkRJTkcgPSB2b2lkIDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG5cbnZhciBHRVRfVEhFTl9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiBzZWxmRnVsZmlsbG1lbnQoKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFwiWW91IGNhbm5vdCByZXNvbHZlIGEgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKTtcbn1cblxuZnVuY3Rpb24gY2Fubm90UmV0dXJuT3duKCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVuKHByb21pc2UpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgcmV0dXJuIEdFVF9USEVOX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICB0cnkge1xuICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSwgdGhlbikge1xuICBhc2FwKGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgIHZhciBlcnJvciA9IHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9XG4gIH0sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBGVUxGSUxMRUQpIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCkge1xuICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJiB0aGVuJCQgPT09IHRoZW4gJiYgbWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3Rvci5yZXNvbHZlID09PSByZXNvbHZlKSB7XG4gICAgaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoZW4kJCA9PT0gR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgR0VUX1RIRU5fRVJST1IuZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodGhlbiQkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoZW4kJCkpIHtcbiAgICAgIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIHNlbGZGdWxmaWxsbWVudCgpKTtcbiAgfSBlbHNlIGlmIChvYmplY3RPckZ1bmN0aW9uKHZhbHVlKSkge1xuICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUsIGdldFRoZW4odmFsdWUpKTtcbiAgfSBlbHNlIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gIH1cblxuICBwdWJsaXNoKHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRDtcblxuICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwcm9taXNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJvbWlzZS5fc3RhdGUgPSBSRUpFQ1RFRDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gIGFzYXAocHVibGlzaFJlamVjdGlvbiwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICB2YXIgX3N1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgdmFyIGxlbmd0aCA9IF9zdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgcGFyZW50Ll9vbmVycm9yID0gbnVsbDtcblxuICBfc3Vic2NyaWJlcnNbbGVuZ3RoXSA9IGNoaWxkO1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBSRUpFQ1RFRF0gPSBvblJlamVjdGlvbjtcblxuICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHBhcmVudCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaChwcm9taXNlKSB7XG4gIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY2hpbGQgPSB1bmRlZmluZWQsXG4gICAgICBjYWxsYmFjayA9IHVuZGVmaW5lZCxcbiAgICAgIGRldGFpbCA9IHByb21pc2UuX3Jlc3VsdDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgY2hpbGQgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICBjYWxsYmFjayA9IHN1YnNjcmliZXJzW2kgKyBzZXR0bGVkXTtcblxuICAgIGlmIChjaGlsZCkge1xuICAgICAgaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgIH1cbiAgfVxuXG4gIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG59XG5cbmZ1bmN0aW9uIEVycm9yT2JqZWN0KCkge1xuICB0aGlzLmVycm9yID0gbnVsbDtcbn1cblxudmFyIFRSWV9DQVRDSF9FUlJPUiA9IG5ldyBFcnJvck9iamVjdCgpO1xuXG5mdW5jdGlvbiB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgIHJldHVybiBUUllfQ0FUQ0hfRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICB2YXIgaGFzQ2FsbGJhY2sgPSBpc0Z1bmN0aW9uKGNhbGxiYWNrKSxcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkLFxuICAgICAgZXJyb3IgPSB1bmRlZmluZWQsXG4gICAgICBzdWNjZWVkZWQgPSB1bmRlZmluZWQsXG4gICAgICBmYWlsZWQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdmFsdWUgPSB0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgLy8gbm9vcFxuICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoZmFpbGVkKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgZSk7XG4gIH1cbn1cblxudmFyIGlkID0gMDtcbmZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cbmZ1bmN0aW9uIG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgcHJvbWlzZVtQUk9NSVNFX0lEXSA9IGlkKys7XG4gIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG59XG5cbmZ1bmN0aW9uIEVudW1lcmF0b3IoQ29uc3RydWN0b3IsIGlucHV0KSB7XG4gIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgdGhpcy5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmICghdGhpcy5wcm9taXNlW1BST01JU0VfSURdKSB7XG4gICAgbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5sZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcblxuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMDtcbiAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgX3JlamVjdCh0aGlzLnByb21pc2UsIHZhbGlkYXRpb25FcnJvcigpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0aW9uRXJyb3IoKSB7XG4gIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICB2YXIgX2lucHV0ID0gdGhpcy5faW5wdXQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IHRoaXMuX3N0YXRlID09PSBQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2VhY2hFbnRyeShfaW5wdXRbaV0sIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24gKGVudHJ5LCBpKSB7XG4gIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgdmFyIHJlc29sdmUkJCA9IGMucmVzb2x2ZTtcblxuICBpZiAocmVzb2x2ZSQkID09PSByZXNvbHZlKSB7XG4gICAgdmFyIF90aGVuID0gZ2V0VGhlbihlbnRyeSk7XG5cbiAgICBpZiAoX3RoZW4gPT09IHRoZW4gJiYgZW50cnkuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBfdGhlbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICB9IGVsc2UgaWYgKGMgPT09IFByb21pc2UpIHtcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobm9vcCk7XG4gICAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCBfdGhlbik7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQocHJvbWlzZSwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbiAocmVzb2x2ZSQkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlJCQoZW50cnkpO1xuICAgICAgfSksIGkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl93aWxsU2V0dGxlQXQocmVzb2x2ZSQkKGVudHJ5KSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbiAoc3RhdGUsIGksIHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbiAocHJvbWlzZSwgaSkge1xuICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoUkVKRUNURUQsIGksIHJlYXNvbik7XG4gIH0pO1xufTtcblxuLyoqXG4gIGBQcm9taXNlLmFsbGAgYWNjZXB0cyBhbiBhcnJheSBvZiBwcm9taXNlcywgYW5kIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaFxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMgZm9yIHRoZSBwYXNzZWQgcHJvbWlzZXMsIG9yXG4gIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gYmUgcmVqZWN0ZWQuIEl0IGNhc3RzIGFsbFxuICBlbGVtZW50cyBvZiB0aGUgcGFzc2VkIGl0ZXJhYmxlIHRvIHByb21pc2VzIGFzIGl0IHJ1bnMgdGhpcyBhbGdvcml0aG0uXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlc29sdmUoMik7XG4gIGxldCBwcm9taXNlMyA9IHJlc29sdmUoMyk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgbGV0IHByb21pc2UzID0gcmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gZW50cmllcyBhcnJheSBvZiBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuICBAc3RhdGljXG4qL1xuZnVuY3Rpb24gYWxsKGVudHJpZXMpIHtcbiAgcmV0dXJuIG5ldyBFbnVtZXJhdG9yKHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yYWNlYCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2ggaXMgc2V0dGxlZCBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlXG4gIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIHNldHRsZS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMicpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFByb21pc2UucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdFxuICBzZXR0bGVkIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlXG4gIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IHNldHRsZWQgcHJvbWlzZSBoYXNcbiAgYmVjb21lIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gIHByb21pc2Ugd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcigncHJvbWlzZSAyJykpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQW4gZXhhbXBsZSByZWFsLXdvcmxkIHVzZSBjYXNlIGlzIGltcGxlbWVudGluZyB0aW1lb3V0czpcblxuICBgYGBqYXZhc2NyaXB0XG4gIFByb21pc2UucmFjZShbYWpheCgnZm9vLmpzb24nKSwgdGltZW91dCg1MDAwKV0pXG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2Ugd2hpY2ggc2V0dGxlcyBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlIGZpcnN0IHBhc3NlZFxuICBwcm9taXNlIHRvIHNldHRsZS5cbiovXG5mdW5jdGlvbiByYWNlKGVudHJpZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkoZW50cmllcykpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChfLCByZWplY3QpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkIGByZWFzb25gLlxuICBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlbiBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKG5vb3ApO1xuICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBuZWVkc1Jlc29sdmVyKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG59XG5cbmZ1bmN0aW9uIG5lZWRzTmV3KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmFpbGVkIHRvIGNvbnN0cnVjdCAnUHJvbWlzZSc6IFBsZWFzZSB1c2UgdGhlICduZXcnIG9wZXJhdG9yLCB0aGlzIG9iamVjdCBjb25zdHJ1Y3RvciBjYW5ub3QgYmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24uXCIpO1xufVxuXG4vKipcbiAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cbiAgd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgVGVybWlub2xvZ3lcbiAgLS0tLS0tLS0tLS1cblxuICAtIGBwcm9taXNlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gd2l0aCBhIGB0aGVuYCBtZXRob2Qgd2hvc2UgYmVoYXZpb3IgY29uZm9ybXMgdG8gdGhpcyBzcGVjaWZpY2F0aW9uLlxuICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cbiAgLSBgZXhjZXB0aW9uYCBpcyBhIHZhbHVlIHRoYXQgaXMgdGhyb3duIHVzaW5nIHRoZSB0aHJvdyBzdGF0ZW1lbnQuXG4gIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXG5cbiAgQSBwcm9taXNlIGNhbiBiZSBpbiBvbmUgb2YgdGhyZWUgc3RhdGVzOiBwZW5kaW5nLCBmdWxmaWxsZWQsIG9yIHJlamVjdGVkLlxuXG4gIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcbiAgcmVqZWN0ZWQgc3RhdGUuICBBIGZ1bGZpbGxtZW50IHZhbHVlIGlzIG5ldmVyIGEgdGhlbmFibGUuXG5cbiAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcbiAgc2V0dGxlZCBzdGF0ZS4gIFNvIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgcmVqZWN0cyB3aWxsXG4gIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgaXRzZWxmIGZ1bGZpbGwuXG5cblxuICBCYXNpYyBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tXG5cbiAgYGBganNcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyBvbiBzdWNjZXNzXG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG5cbiAgICAvLyBvbiBmYWlsdXJlXG4gICAgcmVqZWN0KHJlYXNvbik7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgQWR2YW5jZWQgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLS0tLVxuXG4gIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcbiAgYFhNTEh0dHBSZXF1ZXN0YHMuXG5cbiAgYGBganNcbiAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlcjtcbiAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdnZXRKU09OOiBgJyArIHVybCArICdgIGZhaWxlZCB3aXRoIHN0YXR1czogWycgKyB0aGlzLnN0YXR1cyArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEpTT04oJy9wb3N0cy5qc29uJykudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBVbmxpa2UgY2FsbGJhY2tzLCBwcm9taXNlcyBhcmUgZ3JlYXQgY29tcG9zYWJsZSBwcmltaXRpdmVzLlxuXG4gIGBgYGpzXG4gIFByb21pc2UuYWxsKFtcbiAgICBnZXRKU09OKCcvcG9zdHMnKSxcbiAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XG4gICAgdmFsdWVzWzBdIC8vID0+IHBvc3RzSlNPTlxuICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH0pO1xuICBgYGBcblxuICBAY2xhc3MgUHJvbWlzZVxuICBAcGFyYW0ge2Z1bmN0aW9ufSByZXNvbHZlclxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEBjb25zdHJ1Y3RvclxuKi9cbmZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgdGhpc1tQUk9NSVNFX0lEXSA9IG5leHRJZCgpO1xuICB0aGlzLl9yZXN1bHQgPSB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICBpZiAobm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICB0eXBlb2YgcmVzb2x2ZXIgIT09ICdmdW5jdGlvbicgJiYgbmVlZHNSZXNvbHZlcigpO1xuICAgIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlID8gaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbmVlZHNOZXcoKTtcbiAgfVxufVxuXG5Qcm9taXNlLmFsbCA9IGFsbDtcblByb21pc2UucmFjZSA9IHJhY2U7XG5Qcm9taXNlLnJlc29sdmUgPSByZXNvbHZlO1xuUHJvbWlzZS5yZWplY3QgPSByZWplY3Q7XG5Qcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBzZXRTY2hlZHVsZXI7XG5Qcm9taXNlLl9zZXRBc2FwID0gc2V0QXNhcDtcblByb21pc2UuX2FzYXAgPSBhc2FwO1xuXG5Qcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFByb21pc2UsXG5cbiAgLyoqXG4gICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQ2hhaW5pbmdcbiAgICAtLS0tLS0tLVxuICBcbiAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICB9KTtcbiAgXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgfSk7XG4gICAgYGBgXG4gICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFzc2ltaWxhdGlvblxuICAgIC0tLS0tLS0tLS0tLVxuICBcbiAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBTaW1wbGUgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCByZXN1bHQ7XG4gIFxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgIC0tLS0tLS0tLS0tLS0tXG4gIFxuICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGxldCBhdXRob3IsIGJvb2tzO1xuICBcbiAgICB0cnkge1xuICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gIFxuICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcbiAgXG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuICBcbiAgICB9XG4gIFxuICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZEF1dGhvcigpLlxuICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCB0aGVuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gIHRoZW46IHRoZW4sXG5cbiAgLyoqXG4gICAgYGNhdGNoYCBpcyBzaW1wbHkgc3VnYXIgZm9yIGB0aGVuKHVuZGVmaW5lZCwgb25SZWplY3Rpb24pYCB3aGljaCBtYWtlcyBpdCB0aGUgc2FtZVxuICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG4gIFxuICAgIGBgYGpzXG4gICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gICAgfVxuICBcbiAgICAvLyBzeW5jaHJvbm91c1xuICAgIHRyeSB7XG4gICAgICBmaW5kQXV0aG9yKCk7XG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfVxuICBcbiAgICAvLyBhc3luYyB3aXRoIHByb21pc2VzXG4gICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIGNhdGNoXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgJ2NhdGNoJzogZnVuY3Rpb24gX2NhdGNoKG9uUmVqZWN0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICAgIHZhciBsb2NhbCA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IGdsb2JhbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsID0gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgIGlmIChQKSB7XG4gICAgICAgIHZhciBwcm9taXNlVG9TdHJpbmcgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvbWlzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gc2lsZW50bHkgaWdub3JlZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2VUb1N0cmluZyA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsLlByb21pc2UgPSBQcm9taXNlO1xufVxuXG4vLyBTdHJhbmdlIGNvbXBhdC4uXG5Qcm9taXNlLnBvbHlmaWxsID0gcG9seWZpbGw7XG5Qcm9taXNlLlByb21pc2UgPSBQcm9taXNlO1xuXG5yZXR1cm4gUHJvbWlzZTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVzNi1wcm9taXNlLm1hcFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L2VzNi1wcm9taXNlL2Rpc3QvZXM2LXByb21pc2UuanMiLCIvKiAoaWdub3JlZCkgKi9cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyB2ZXJ0eCAoaWdub3JlZClcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBpbmxpbmVIZWFkZXJzO1xuXG52YXIgZW5jb2RlID0gcmVxdWlyZSgncXVlcnlzdHJpbmctZXMzL2VuY29kZScpO1xuXG5mdW5jdGlvbiBpbmxpbmVIZWFkZXJzKHVybCwgaGVhZGVycykge1xuICBpZiAoL1xcPy8udGVzdCh1cmwpKSB7XG4gICAgdXJsICs9ICcmJztcbiAgfSBlbHNlIHtcbiAgICB1cmwgKz0gJz8nO1xuICB9XG5cbiAgcmV0dXJuIHVybCArIGVuY29kZShoZWFkZXJzKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9pbmxpbmUtaGVhZGVycy5qcyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBqc29ucFJlcXVlc3Q7XG5cbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuLi9lcnJvcnMnKTtcblxudmFyIEpTT05QQ291bnRlciA9IDA7XG5cbmZ1bmN0aW9uIGpzb25wUmVxdWVzdCh1cmwsIG9wdHMsIGNiKSB7XG4gIGlmIChvcHRzLm1ldGhvZCAhPT0gJ0dFVCcpIHtcbiAgICBjYihuZXcgRXJyb3IoJ01ldGhvZCAnICsgb3B0cy5tZXRob2QgKyAnICcgKyB1cmwgKyAnIGlzIG5vdCBzdXBwb3J0ZWQgYnkgSlNPTlAuJykpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG9wdHMuZGVidWcoJ0pTT05QOiBzdGFydCcpO1xuXG4gIHZhciBjYkNhbGxlZCA9IGZhbHNlO1xuICB2YXIgdGltZWRPdXQgPSBmYWxzZTtcblxuICBKU09OUENvdW50ZXIgKz0gMTtcbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHZhciBjYk5hbWUgPSAnYWxnb2xpYUpTT05QXycgKyBKU09OUENvdW50ZXI7XG4gIHZhciBkb25lID0gZmFsc2U7XG5cbiAgd2luZG93W2NiTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmVtb3ZlR2xvYmFscygpO1xuXG4gICAgaWYgKHRpbWVkT3V0KSB7XG4gICAgICBvcHRzLmRlYnVnKCdKU09OUDogTGF0ZSBhbnN3ZXIsIGlnbm9yaW5nJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2JDYWxsZWQgPSB0cnVlO1xuXG4gICAgY2xlYW4oKTtcblxuICAgIGNiKG51bGwsIHtcbiAgICAgIGJvZHk6IGRhdGEvKiAsXG4gICAgICAvLyBXZSBkbyBub3Qgc2VuZCB0aGUgc3RhdHVzQ29kZSwgdGhlcmUncyBubyBzdGF0dXNDb2RlIGluIEpTT05QLCBpdCB3aWxsIGJlXG4gICAgICAvLyBjb21wdXRlZCB1c2luZyBkYXRhLnN0YXR1cyAmJiBkYXRhLm1lc3NhZ2UgbGlrZSB3aXRoIFhEUlxuICAgICAgc3RhdHVzQ29kZSovXG4gICAgfSk7XG4gIH07XG5cbiAgLy8gYWRkIGNhbGxiYWNrIGJ5IGhhbmRcbiAgdXJsICs9ICcmY2FsbGJhY2s9JyArIGNiTmFtZTtcblxuICAvLyBhZGQgYm9keSBwYXJhbXMgbWFudWFsbHlcbiAgaWYgKG9wdHMuanNvbkJvZHkgJiYgb3B0cy5qc29uQm9keS5wYXJhbXMpIHtcbiAgICB1cmwgKz0gJyYnICsgb3B0cy5qc29uQm9keS5wYXJhbXM7XG4gIH1cblxuICB2YXIgb250aW1lb3V0ID0gc2V0VGltZW91dCh0aW1lb3V0LCBvcHRzLnRpbWVvdXRzLmNvbXBsZXRlKTtcblxuICAvLyBzY3JpcHQgb25yZWFkeXN0YXRlY2hhbmdlIG5lZWRlZCBvbmx5IGZvclxuICAvLyA8PSBJRThcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvNDUyM1xuICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gcmVhZHlzdGF0ZWNoYW5nZTtcbiAgc2NyaXB0Lm9ubG9hZCA9IHN1Y2Nlc3M7XG4gIHNjcmlwdC5vbmVycm9yID0gZXJyb3I7XG5cbiAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgc2NyaXB0LmRlZmVyID0gdHJ1ZTtcbiAgc2NyaXB0LnNyYyA9IHVybDtcbiAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXG4gIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgb3B0cy5kZWJ1ZygnSlNPTlA6IHN1Y2Nlc3MnKTtcblxuICAgIGlmIChkb25lIHx8IHRpbWVkT3V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZG9uZSA9IHRydWU7XG5cbiAgICAvLyBzY3JpcHQgbG9hZGVkIGJ1dCBkaWQgbm90IGNhbGwgdGhlIGZuID0+IHNjcmlwdCBsb2FkaW5nIGVycm9yXG4gICAgaWYgKCFjYkNhbGxlZCkge1xuICAgICAgb3B0cy5kZWJ1ZygnSlNPTlA6IEZhaWwuIFNjcmlwdCBsb2FkZWQgYnV0IGRpZCBub3QgY2FsbCB0aGUgY2FsbGJhY2snKTtcbiAgICAgIGNsZWFuKCk7XG4gICAgICBjYihuZXcgZXJyb3JzLkpTT05QU2NyaXB0RmFpbCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkeXN0YXRlY2hhbmdlKCkge1xuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgc3VjY2VzcygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuKCkge1xuICAgIGNsZWFyVGltZW91dChvbnRpbWVvdXQpO1xuICAgIHNjcmlwdC5vbmxvYWQgPSBudWxsO1xuICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIHNjcmlwdC5vbmVycm9yID0gbnVsbDtcbiAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVHbG9iYWxzKCkge1xuICAgIHRyeSB7XG4gICAgICBkZWxldGUgd2luZG93W2NiTmFtZV07XG4gICAgICBkZWxldGUgd2luZG93W2NiTmFtZSArICdfbG9hZGVkJ107XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgd2luZG93W2NiTmFtZV0gPSB3aW5kb3dbY2JOYW1lICsgJ19sb2FkZWQnXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lb3V0KCkge1xuICAgIG9wdHMuZGVidWcoJ0pTT05QOiBTY3JpcHQgdGltZW91dCcpO1xuICAgIHRpbWVkT3V0ID0gdHJ1ZTtcbiAgICBjbGVhbigpO1xuICAgIGNiKG5ldyBlcnJvcnMuUmVxdWVzdFRpbWVvdXQoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICBvcHRzLmRlYnVnKCdKU09OUDogU2NyaXB0IGVycm9yJyk7XG5cbiAgICBpZiAoZG9uZSB8fCB0aW1lZE91dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsZWFuKCk7XG4gICAgY2IobmV3IGVycm9ycy5KU09OUFNjcmlwdEVycm9yKCkpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Jyb3dzZXIvanNvbnAtcmVxdWVzdC5qcyIsIm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUGxhY2VzQ2xpZW50O1xuXG52YXIgYnVpbGRTZWFyY2hNZXRob2QgPSByZXF1aXJlKCcuL2J1aWxkU2VhcmNoTWV0aG9kLmpzJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYWNlc0NsaWVudChhbGdvbGlhc2VhcmNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwbGFjZXMoYXBwSUQsIGFwaUtleSwgb3B0cykge1xuICAgIHZhciBjbG9uZURlZXAgPSByZXF1aXJlKCcuL2Nsb25lLmpzJyk7XG5cbiAgICBvcHRzID0gb3B0cyAmJiBjbG9uZURlZXAob3B0cykgfHwge307XG4gICAgb3B0cy5ob3N0cyA9IG9wdHMuaG9zdHMgfHwgW1xuICAgICAgJ3BsYWNlcy1kc24uYWxnb2xpYS5uZXQnLFxuICAgICAgJ3BsYWNlcy0xLmFsZ29saWFuZXQuY29tJyxcbiAgICAgICdwbGFjZXMtMi5hbGdvbGlhbmV0LmNvbScsXG4gICAgICAncGxhY2VzLTMuYWxnb2xpYW5ldC5jb20nXG4gICAgXTtcblxuICAgIC8vIGFsbG93IGluaXRQbGFjZXMoKSBubyBhcmd1bWVudHMgPT4gY29tbXVuaXR5IHJhdGUgbGltaXRlZFxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBhcHBJRCA9PT0gJ29iamVjdCcgfHwgYXBwSUQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYXBwSUQgPSAnJztcbiAgICAgIGFwaUtleSA9ICcnO1xuICAgICAgb3B0cy5fYWxsb3dFbXB0eUNyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgY2xpZW50ID0gYWxnb2xpYXNlYXJjaChhcHBJRCwgYXBpS2V5LCBvcHRzKTtcbiAgICB2YXIgaW5kZXggPSBjbGllbnQuaW5pdEluZGV4KCdwbGFjZXMnKTtcbiAgICBpbmRleC5zZWFyY2ggPSBidWlsZFNlYXJjaE1ldGhvZCgncXVlcnknLCAnLzEvcGxhY2VzL3F1ZXJ5Jyk7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9wbGFjZXMuanMiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RG9jdW1lbnRQcm90b2NvbDtcblxuZnVuY3Rpb24gZ2V0RG9jdW1lbnRQcm90b2NvbCgpIHtcbiAgdmFyIHByb3RvY29sID0gd2luZG93LmRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sO1xuXG4gIC8vIHdoZW4gaW4gYGZpbGU6YCBtb2RlIChsb2NhbCBodG1sIGZpbGUpLCBkZWZhdWx0IHRvIGBodHRwOmBcbiAgaWYgKHByb3RvY29sICE9PSAnaHR0cDonICYmIHByb3RvY29sICE9PSAnaHR0cHM6Jykge1xuICAgIHByb3RvY29sID0gJ2h0dHA6JztcbiAgfVxuXG4gIHJldHVybiBwcm90b2NvbDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9nZXQtZG9jdW1lbnQtcHJvdG9jb2wuanMiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJzMuMjAuMic7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL3ZlcnNpb24uanMiXSwic291cmNlUm9vdCI6IiJ9