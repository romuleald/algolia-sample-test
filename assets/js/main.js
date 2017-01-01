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
	var DOMResultMetric = document.querySelector('.js-result-count');
	
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
	    //todo sort by desc quantity
	    for (var i = 0; i < aFilters.length; i++) {
	        var item = aFilters[i];
	        var options = { count: filters[item].length, type: item };
	        if ('stars' === name) {
	            options['content'] = makeStars(item);
	        }
	        options['hide'] = i >= 5 ? 'mod-hide' : '';
	        html += (0, _getTpl2.default)(options, 'tpl_filter_' + name);
	    }
	    $('.js-filter[data-name="' + name + '"]').html(html).toggleClass('show-more-filter', aFilters.length > 5);
	};
	
	var insertResult = function insertResult(page) {
	    //todo paginate result
	};
	
	var searchEnd = function searchEnd(allRes, timing) {
	    var html = '';
	    var allFoodType = {};
	    var allStarsCount = {};
	    var allPayment = {};
	    currentUIPage = 0; //always reset
	
	    for (var i = 0; i < allRes.length; i++) {
	        var item = allRes[i];
	        var id = item.objectID;
	        var foodType = item.food_type;
	        var starsCountRounded = Math.floor(item.stars_count);
	        var payment = item.payment_options;
	        (allFoodType[foodType] = allFoodType[foodType] ? allFoodType[foodType] : []).push(id);
	        (allStarsCount[starsCountRounded] = allStarsCount[starsCountRounded] ? allStarsCount[starsCountRounded] : []).push(id);
	        for (var iPayment = 0; iPayment < payment.length; iPayment++) {
	            (allPayment[payment[iPayment]] = allPayment[payment[iPayment]] ? allPayment[payment[iPayment]] : []).push(id);
	        }
	        if (i < itemPerPage) {
	            html += (0, _getTpl2.default)({
	                media: item.image_url,
	                name: item.name,
	                reserveurl: item.reserve_url,
	                score: item.stars_count,
	                scoreRounded: starsCountRounded,
	                stars: getStars(item.stars_count),
	                review: item.reviews_count,
	                foodtype: item.food_type,
	                place: item.area,
	                pricerange: item.price_range,
	                payment: item.payment_options.join(',')
	            }, 'tpl_search');
	        }
	    }
	
	    setFilterHTML('foods', allFoodType);
	    setFilterHTML('stars', allStarsCount);
	    setFilterHTML('payment', allPayment);
	    showListResult(html);
	    //todo need a function
	    DOMResultMetric.innerHTML = (0, _getTpl2.default)({ count: allRes.length, time: timing / 1000 }, 'tpl_search_total');
	};
	var searchStart = function searchStart(query) {
	    var allRes = [];
	    var timing = 0;
	    var searchDone = function searchDone(err, content) {
	        var result = content.results[0];
	        timing += result.processingTimeMS;
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
	            searchEnd(allRes, timing);
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
	$('body').on('click mouseenter mouseleave', '.js-filter-item', function (e) {
	    var type = e.type;
	    //enter/leave = highlight
	    var filterType = this.getAttribute('data-type');
	    var filterName = this.getAttribute('data-name');
	
	    if (/mouseleave|mouseenter/.test(type)) {
	        if (type === 'mouseenter') {
	            var $css = $('<style>').html('\n                .result-item:not([data-type-' + filterType + '*="' + filterName + '"]){\n                    opacity: .5;\n                }\n            ').attr('id', 'highlightcss');
	            $('head').append($css);
	        } else {
	            $('#highlightcss').remove();
	        }
	    }
	    //click = filter
	
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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';
	
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGJhYzVlMTc4N2MwMzEyZGVlOTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2VudHJ5LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL3RvZ2dsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvcmUvbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2R1bGVzIF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvcG9wdWxhci1ib29rcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXQtc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9hamF4LmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9jb3JlL2FqYXgtbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvY29yZS9nZXRUcGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvdGVzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kdWxlcy90ZXN0LW5vLWxvYWQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9icm93c2VyL2J1aWxkcy9hbGdvbGlhc2VhcmNoLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvQWxnb2xpYVNlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL0luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleENvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9idWlsZFNlYXJjaE1ldGhvZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9mb3JlYWNoL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvZGVwcmVjYXRlLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvZGVwcmVjYXRlZE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Nsb25lLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvb21pdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9vYmplY3Qta2V5cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9vYmplY3Qta2V5cy9pc0FyZ3VtZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvbWFwLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvZXhpdFByb21pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleEJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL34vZXZlbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL0FsZ29saWFTZWFyY2hDb3JlLmpzIiwid2VicGFjazovLy8od2VicGFjaykvfi9ub2RlLWxpYnMtYnJvd3Nlci9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvc3JjL3N0b3JlLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2RlYnVnL3NyYy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2RlYnVnL3NyYy9kZWJ1Zy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9kZWJ1Zy9+L21zL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9jcmVhdGVBbGdvbGlhc2VhcmNoLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9+L2dsb2JhbC93aW5kb3cuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL34vZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vdmVydHggKGlnbm9yZWQpIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9pbmxpbmUtaGVhZGVycy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29saWFzZWFyY2gvfi9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9qc29ucC1yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvcGxhY2VzLmpzIiwid2VicGFjazovLy8uL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9nZXQtZG9jdW1lbnQtcHJvdG9jb2wuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvbGlhc2VhcmNoL3NyYy92ZXJzaW9uLmpzIl0sIm5hbWVzIjpbImluaXQiLCJjbGllbnQiLCJET01SZXN1bHQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJET01SZXN1bHRNZXRyaWMiLCJpdGVtUGVyUGFnZSIsImN1cnJlbnRVSVBhZ2UiLCJnZXRTdGFycyIsInIiLCJyZXBlYXQiLCJNYXRoIiwiYWJzIiwibWFrZVN0YXJzIiwic2NvcmUiLCJzdGFycyIsInN0YXJlZCIsImNvbmNhdFJlc3VsdCIsInJlcyIsImFsbFJlcyIsImNvbmNhdCIsInNob3dMaXN0UmVzdWx0IiwiaHRtbCIsImFkZEh0bWwiLCJpbm5lckhUTUwiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJzZXRGaWx0ZXJIVE1MIiwibmFtZSIsImZpbHRlcnMiLCJhRmlsdGVycyIsIk9iamVjdCIsImtleXMiLCJpIiwibGVuZ3RoIiwiaXRlbSIsIm9wdGlvbnMiLCJjb3VudCIsInR5cGUiLCIkIiwidG9nZ2xlQ2xhc3MiLCJpbnNlcnRSZXN1bHQiLCJwYWdlIiwic2VhcmNoRW5kIiwidGltaW5nIiwiYWxsRm9vZFR5cGUiLCJhbGxTdGFyc0NvdW50IiwiYWxsUGF5bWVudCIsImlkIiwib2JqZWN0SUQiLCJmb29kVHlwZSIsImZvb2RfdHlwZSIsInN0YXJzQ291bnRSb3VuZGVkIiwiZmxvb3IiLCJzdGFyc19jb3VudCIsInBheW1lbnQiLCJwYXltZW50X29wdGlvbnMiLCJwdXNoIiwiaVBheW1lbnQiLCJtZWRpYSIsImltYWdlX3VybCIsInJlc2VydmV1cmwiLCJyZXNlcnZlX3VybCIsInNjb3JlUm91bmRlZCIsInJldmlldyIsInJldmlld3NfY291bnQiLCJmb29kdHlwZSIsInBsYWNlIiwiYXJlYSIsInByaWNlcmFuZ2UiLCJwcmljZV9yYW5nZSIsImpvaW4iLCJ0aW1lIiwic2VhcmNoU3RhcnQiLCJxdWVyeSIsInNlYXJjaERvbmUiLCJlcnIiLCJjb250ZW50IiwicmVzdWx0IiwicmVzdWx0cyIsInByb2Nlc3NpbmdUaW1lTVMiLCJoaXRzIiwibmJQYWdlcyIsInNlYXJjaCIsImluZGV4TmFtZSIsInBhcmFtcyIsIlRJTUVPVVRzZWFyY2giLCJvbiIsImUiLCJ2YWx1ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJmaWx0ZXJUeXBlIiwiZ2V0QXR0cmlidXRlIiwiZmlsdGVyTmFtZSIsInRlc3QiLCIkY3NzIiwiYXR0ciIsImFwcGVuZCIsInJlbW92ZSIsImpzVG9nZ2xlciIsIl9jc3NTZWxlY3RvciIsIl9hY3RpdmVDbGFzcyIsIl9jdXJyZW50VHJpZ2dlckNsYXNzIiwiX2Nzc1NlbGVjdG9yQ29udGVudCIsInNlbGVjdG9yIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiJGFsbExpbmtzVG9nZ2xlciIsIiRsaW5rVG9nZ2xlciIsImFjdGlvbiIsInRvZ2dsZSIsIm9wZW5pbmciLCJkYXRhIiwiY2xvc2luZyIsImNsb3NlQWxsIiwiJGFsbENvbnRlbnRzIiwiZ3JvdXAiLCJ0b2dnbGVyX2lkIiwiJGNvbnRlbnQiLCJmaWx0ZXIiLCIkY29udGVudEdyb3VwIiwiaXNBY3RpdmUiLCJoYXNDbGFzcyIsIiRsaW5rc1RvZ2dsZXJHcm91cCIsInJlbW92ZUNsYXNzIiwidHJpZ2dlciIsImFkZENsYXNzIiwidGFnTmFtZSIsInByZXZlbnREZWZhdWx0IiwiY3NzU2VsZWN0b3IiLCJjc3NTZWxlY3RvckNvbnRlbnQiLCJhY3RpdmVDbGFzcyIsImV2ZW50cyIsImN1cnJlbnRUcmlnZ2VyQ2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwid2VibW9kdWxlIiwiU0VMRUNUT1JfSU5JVElBTElaRUQiLCJyZWdJc0luaXQiLCJSZWdFeHAiLCJfY3JlYXRlIiwibW9kdWxlTmFtZSIsIkRPTU1vZHVsZSIsInJlYWR5IiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZSIsIm5vZGVOYW1lIiwiZGF0YU5hbWUiLCJzcGxpdCIsIm5vZGVWYWx1ZSIsImNyZWF0ZSIsInBhcnNlTW9kdWxlcyIsIm1vZHVsZXMiLCJsb2FkRmxhZyIsIm1vZHVsZVJlYWR5IiwibW9kdWxlc0xvYWQiLCJjbGFzc05hbWUiLCJfbW9kdWxlTmFtZVNwbGl0IiwiX21vZHVsZU5hbWUiLCJpbXBvcnRNb2R1bGUiLCJkZWZhdWx0IiwiZWxlbSIsImNvbnNvbGUiLCJlcnJvciIsImV4ZWMiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicXVlcnlTZWxlY3RvckFsbCIsImZsYWciLCJkb0xvYWQiLCJmb3JFYWNoIiwibyIsImxvYWQiLCJwYXJzZSIsImdldFNlcnZpY2UiLCJyZXF1aXJlIiwiZ2V0VHBsIiwicG9wdWxhckJvb2siLCJjYWxsIiwiZG9uZSIsImluZm8iLCJyZWNvcmRzIiwiZmllbGRzIiwiY29sbGVjdGlvbiIsImdldEVsZW1lbnRCeUlkIiwiYWpheCIsInVzZVNlcnZpY2UiLCJlbmRwb2ludCIsImVuZFBvaW50IiwiYXNzaWduIiwiQVBJX3NlcnZpY2UiLCJsb2FkZXIiLCJ1cmwiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInVuZGVmaW5lZCIsInByb2Nlc3NEYXRhIiwiRXJyb3IiLCJhamF4bG9hZGVyIiwib25BbHdheXMiLCJvbkZhaWwiLCJqcVhIUiIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsInNob3ciLCJhbHdheXMiLCJoaWRlIiwiZmFpbCIsImFqYXhsb2FkIiwiX3RwbCIsIiRhamF4bG9hZGVyIiwiX2Nzc0NsYXNzIiwic3RhdHVzIiwiX2lzUmVhZHkiLCJ0cGwiLCIkdGFyZ2V0IiwiY3NzQ2xhc3MiLCJib2R5IiwiY2FjaGUiLCJnZXRDYWNoZSIsInRlbXBsYXRlSWQiLCJzZXRDYWNoZSIsImdldHRwbCIsImRlYnVnIiwidGVtcGxhdGVIVE1MIiwicmVwbGFjZSIsIm1vZHVsZVRlc3QiLCJBbGdvbGlhU2VhcmNoIiwiY3JlYXRlQWxnb2xpYXNlYXJjaCIsIkluZGV4IiwiZGVwcmVjYXRlIiwiZGVwcmVjYXRlZE1lc3NhZ2UiLCJBbGdvbGlhU2VhcmNoQ29yZSIsImluaGVyaXRzIiwiZXJyb3JzIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJwcm90b3R5cGUiLCJkZWxldGVJbmRleCIsImNhbGxiYWNrIiwiX2pzb25SZXF1ZXN0IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiaG9zdFR5cGUiLCJtb3ZlSW5kZXgiLCJzcmNJbmRleE5hbWUiLCJkc3RJbmRleE5hbWUiLCJwb3N0T2JqIiwib3BlcmF0aW9uIiwiZGVzdGluYXRpb24iLCJjb3B5SW5kZXgiLCJnZXRMb2dzIiwib2Zmc2V0IiwiY2xvbmUiLCJfZ2V0U2VhcmNoUGFyYW1zIiwibGlzdEluZGV4ZXMiLCJpbml0SW5kZXgiLCJsaXN0VXNlcktleXMiLCJnZXRVc2VyS2V5QUNMIiwia2V5IiwiZGVsZXRlVXNlcktleSIsImFkZFVzZXJLZXkiLCJhY2xzIiwiaXNBcnJheSIsInVzYWdlIiwiYWNsIiwidmFsaWRpdHkiLCJtYXhRdWVyaWVzUGVySVBQZXJIb3VyIiwibWF4SGl0c1BlclF1ZXJ5IiwiaW5kZXhlcyIsImRlc2NyaXB0aW9uIiwicXVlcnlQYXJhbWV0ZXJzIiwicmVmZXJlcnMiLCJhZGRVc2VyS2V5V2l0aFZhbGlkaXR5IiwidXBkYXRlVXNlcktleSIsInB1dE9iaiIsInN0YXJ0UXVlcmllc0JhdGNoIiwic3RhcnRRdWVyaWVzQmF0Y2hEZXByZWNhdGVkIiwiX2JhdGNoIiwiYWRkUXVlcnlJbkJhdGNoIiwiYWRkUXVlcnlJbkJhdGNoRGVwcmVjYXRlZCIsImFyZ3MiLCJzZW5kUXVlcmllc0JhdGNoIiwic2VuZFF1ZXJpZXNCYXRjaERlcHJlY2F0ZWQiLCJiYXRjaCIsIm9wZXJhdGlvbnMiLCJyZXF1ZXN0cyIsImRlc3Ryb3kiLCJub3RJbXBsZW1lbnRlZCIsImVuYWJsZVJhdGVMaW1pdEZvcndhcmQiLCJkaXNhYmxlUmF0ZUxpbWl0Rm9yd2FyZCIsInVzZVNlY3VyZWRBUElLZXkiLCJkaXNhYmxlU2VjdXJlZEFQSUtleSIsImdlbmVyYXRlU2VjdXJlZEFwaUtleSIsIm1lc3NhZ2UiLCJBbGdvbGlhU2VhcmNoRXJyb3IiLCJJbmRleENvcmUiLCJleGl0UHJvbWlzZSIsImFkZE9iamVjdCIsImluZGV4T2JqIiwiYXMiLCJhZGRPYmplY3RzIiwib2JqZWN0cyIsInJlcXVlc3QiLCJwYXJ0aWFsVXBkYXRlT2JqZWN0IiwicGFydGlhbE9iamVjdCIsImNyZWF0ZUlmTm90RXhpc3RzIiwicGFydGlhbFVwZGF0ZU9iamVjdHMiLCJzYXZlT2JqZWN0Iiwib2JqZWN0Iiwic2F2ZU9iamVjdHMiLCJkZWxldGVPYmplY3QiLCJfcHJvbWlzZSIsInJlamVjdCIsImRlbGV0ZU9iamVjdHMiLCJvYmplY3RJRHMiLCJtYXAiLCJwcmVwYXJlUmVxdWVzdCIsImRlbGV0ZUJ5UXVlcnkiLCJhdHRyaWJ1dGVzVG9SZXRyaWV2ZSIsImhpdHNQZXJQYWdlIiwiZGlzdGluY3QiLCJjbGVhckNhY2hlIiwicHJvbWlzZSIsInRoZW4iLCJzdG9wT3JEZWxldGUiLCJzZWFyY2hDb250ZW50IiwibmJIaXRzIiwiZ2V0T2JqZWN0SUQiLCJ3YWl0VGFzayIsImRvRGVsZXRlQnlRdWVyeSIsImRlbGV0ZU9iamVjdHNDb250ZW50IiwidGFza0lEIiwic3VjY2VzcyIsImZhaWx1cmUiLCJleGl0IiwiX3NldFRpbWVvdXQiLCJicm93c2VBbGwiLCJtZXJnZSIsIkluZGV4QnJvd3NlciIsImJyb3dzZXIiLCJpbmRleCIsImJyb3dzZUxvb3AiLCJjdXJzb3IiLCJfc3RvcHBlZCIsInF1ZXJ5U3RyaW5nIiwiYnJvd3NlQ2FsbGJhY2siLCJfZXJyb3IiLCJfcmVzdWx0IiwiX2VuZCIsInR0QWRhcHRlciIsInNlbGYiLCJzeW5jQ2IiLCJhc3luY0NiIiwiY2IiLCJiYXNlRGVsYXkiLCJtYXhEZWxheSIsImxvb3AiLCJyZXRyeUxvb3AiLCJkZWxheSIsInN1Y2Nlc3NDYiIsImZhaWx1cmVDYiIsImNsZWFySW5kZXgiLCJnZXRTZXR0aW5ncyIsInNlYXJjaFN5bm9ueW1zIiwic2F2ZVN5bm9ueW0iLCJzeW5vbnltIiwib3B0cyIsImZvcndhcmRUb1NsYXZlcyIsImdldFN5bm9ueW0iLCJkZWxldGVTeW5vbnltIiwiY2xlYXJTeW5vbnltcyIsImJhdGNoU3lub255bXMiLCJzeW5vbnltcyIsInJlcGxhY2VFeGlzdGluZ1N5bm9ueW1zIiwic2V0U2V0dGluZ3MiLCJzZXR0aW5ncyIsImRlcHJlY2F0ZWRBZGRVc2VyS2V5V2l0aFZhbGlkaXR5IiwiY3RvciIsInN1cGVyQ3RvciIsInN1cGVyXyIsImNvbnN0cnVjdG9yIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiVGVtcEN0b3IiLCJidWlsZFNlYXJjaE1ldGhvZCIsImFsZ29saWFzZWFyY2giLCJ0eXBlQWhlYWRBcmdzIiwidHlwZUFoZWFkVmFsdWVPcHRpb24iLCJzaW1pbGFyU2VhcmNoIiwiYnJvd3NlIiwiYnJvd3NlRnJvbSIsInNlYXJjaEZvckZhY2V0VmFsdWVzIiwib21pdCIsImZhY2V0TmFtZSIsImZhY2V0UXVlcnkiLCJmaWx0ZXJlZFBhcmFtcyIsImtleU5hbWUiLCJzZWFyY2hQYXJhbWV0ZXJzIiwic2VhcmNoRmFjZXQiLCJfc2VhcmNoIiwiZmFsbGJhY2siLCJnZXRPYmplY3QiLCJhdHRycyIsImdldE9iamVjdHMiLCJxdWVyeVBhcmFtIiwiZXh0cmFQcm9wZXJ0aWVzIiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJzdGFjayIsImFkZFRvRXJyb3JPYmplY3QiLCJjcmVhdGVDdXN0b21FcnJvciIsIkFsZ29saWFTZWFyY2hDdXN0b21FcnJvciIsIkFycmF5Iiwic2xpY2UiLCJ1bnNoaWZ0IiwiVW5wYXJzYWJsZUpTT04iLCJSZXF1ZXN0VGltZW91dCIsIk5ldHdvcmsiLCJKU09OUFNjcmlwdEZhaWwiLCJKU09OUFNjcmlwdEVycm9yIiwiVW5rbm93biIsImhhc093biIsImhhc093blByb3BlcnR5IiwidG9TdHJpbmciLCJvYmoiLCJmbiIsImN0eCIsIlR5cGVFcnJvciIsImwiLCJrIiwid2FybmVkIiwiZGVwcmVjYXRlZCIsImxvZyIsInByZXZpb3VzVXNhZ2UiLCJuZXdVc2FnZSIsImdpdGh1YkFuY2hvckxpbmsiLCJ0b0xvd2VyQ2FzZSIsImZvcmVhY2giLCJzb3VyY2VzIiwic291cmNlIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbHRlcmVkIiwiZG9GaWx0ZXIiLCJoYXMiLCJ0b1N0ciIsImlzQXJncyIsImlzRW51bWVyYWJsZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwiaGFzRG9udEVudW1CdWciLCJoYXNQcm90b0VudW1CdWciLCJkb250RW51bXMiLCJlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSIsImV4Y2x1ZGVkS2V5cyIsIiRjb25zb2xlIiwiJGV4dGVybmFsIiwiJGZyYW1lIiwiJGZyYW1lRWxlbWVudCIsIiRmcmFtZXMiLCIkaW5uZXJIZWlnaHQiLCIkaW5uZXJXaWR0aCIsIiRvdXRlckhlaWdodCIsIiRvdXRlcldpZHRoIiwiJHBhZ2VYT2Zmc2V0IiwiJHBhZ2VZT2Zmc2V0IiwiJHBhcmVudCIsIiRzY3JvbGxMZWZ0IiwiJHNjcm9sbFRvcCIsIiRzY3JvbGxYIiwiJHNjcm9sbFkiLCIkc2VsZiIsIiR3ZWJraXRJbmRleGVkREIiLCIkd2Via2l0U3RvcmFnZUluZm8iLCIkd2luZG93IiwiaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnIiwiZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5Iiwia2V5c1NoaW0iLCJpc09iamVjdCIsImlzRnVuY3Rpb24iLCJpc0FyZ3VtZW50cyIsImlzU3RyaW5nIiwidGhlS2V5cyIsInNraXBQcm90byIsIlN0cmluZyIsImoiLCJza2lwQ29uc3RydWN0b3IiLCJzaGltIiwic2hpbU9iamVjdEtleXMiLCJrZXlzV29ya3NXaXRoQXJndW1lbnRzIiwib3JpZ2luYWxLZXlzIiwic3RyIiwiY2FsbGVlIiwiYXJyIiwibmV3QXJyIiwiaXRlbUluZGV4IiwiRXZlbnRFbWl0dGVyIiwic3RvcCIsIl9jbGVhbiIsImVtaXQiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJfZXZlbnRzIiwiX21heExpc3RlbmVycyIsImRlZmF1bHRNYXhMaXN0ZW5lcnMiLCJzZXRNYXhMaXN0ZW5lcnMiLCJuIiwiaXNOdW1iZXIiLCJpc05hTiIsImVyIiwiaGFuZGxlciIsImxlbiIsImxpc3RlbmVycyIsImNvbnRleHQiLCJpc1VuZGVmaW5lZCIsImFkZExpc3RlbmVyIiwibGlzdGVuZXIiLCJtIiwibmV3TGlzdGVuZXIiLCJ0cmFjZSIsIm9uY2UiLCJmaXJlZCIsImciLCJyZW1vdmVMaXN0ZW5lciIsImxpc3QiLCJwb3NpdGlvbiIsInNwbGljZSIsInJldCIsImxpc3RlbmVyQ291bnQiLCJldmxpc3RlbmVyIiwiZW1pdHRlciIsImFyZyIsInN0b3JlIiwiTUFYX0FQSV9LRVlfTEVOR1RIIiwiUkVTRVRfQVBQX0RBVEFfVElNRVIiLCJwcm9jZXNzIiwiZW52IiwicGFyc2VJbnQiLCJhcHBsaWNhdGlvbklEIiwiYXBpS2V5IiwiX2FsbG93RW1wdHlDcmVkZW50aWFscyIsImhvc3RzIiwicmVhZCIsIndyaXRlIiwicHJvdG9jb2wiLCJfdGltZW91dHMiLCJ0aW1lb3V0cyIsImNvbm5lY3QiLCJ0aW1lb3V0IiwiX2NoZWNrQXBwSWREYXRhIiwiZGVmYXVsdEhvc3RzIiwiX3NodWZmbGVSZXN1bHQiLCJob3N0TnVtYmVyIiwicHJlcGFyZUhvc3QiLCJleHRyYUhlYWRlcnMiLCJfY2FjaGUiLCJfdWEiLCJfdXNlQ2FjaGUiLCJfdXNlRmFsbGJhY2siLCJ1c2VGYWxsYmFjayIsInNldEV4dHJhSGVhZGVyIiwiYWRkQWxnb2xpYUFnZW50IiwiYWxnb2xpYUFnZW50IiwiaW5pdGlhbE9wdHMiLCJyZXF1ZXN0RGVidWciLCJ0cmllcyIsInVzaW5nRmFsbGJhY2siLCJoYXNGYWxsYmFjayIsIl9yZXF1ZXN0IiwiaGVhZGVycyIsIl9jb21wdXRlUmVxdWVzdEhlYWRlcnMiLCJzYWZlSlNPTlN0cmluZ2lmeSIsImRlYnVnRGF0YSIsImRvUmVxdWVzdCIsInJlcXVlc3RlciIsInJlcU9wdHMiLCJzdGFydFRpbWUiLCJEYXRlIiwiY2FjaGVJRCIsInJlc29sdmUiLCJqc29uQm9keSIsIl9nZXRUaW1lb3V0c0ZvclJlcXVlc3QiLCJfc2V0SG9zdEluZGV4QnlUeXBlIiwiY3VycmVudEhvc3QiLCJfZ2V0SG9zdEJ5VHlwZSIsInRyeUZhbGxiYWNrIiwiaHR0cFJlc3BvbnNlIiwic3RhdHVzQ29kZSIsImh0dHBSZXNwb25zZU9rIiwiZW5kVGltZSIsInJlbW92ZUNyZWRlbnRpYWxzIiwiY29udGVudExlbmd0aCIsImR1cmF0aW9uIiwicmVzcG9uc2VUZXh0Iiwic2hvdWxkUmV0cnkiLCJyZXRyeVJlcXVlc3QiLCJ1bnJlY292ZXJhYmxlRXJyb3IiLCJyZXRyeVJlcXVlc3RXaXRoSGlnaGVyVGltZW91dCIsIl9pbmNyZW1lbnRIb3N0SW5kZXgiLCJfaW5jcmVtZW50VGltZW91dE11bHRpcGxlciIsIm9rQ2IiLCJub29rQ2IiLCJ3aXRoQVBJS2V5IiwicmVxdWVzdEhlYWRlcnMiLCJ1c2VyVG9rZW4iLCJzZWN1cml0eVRhZ3MiLCJhZGRUb1JlcXVlc3RIZWFkZXJzIiwiaGVhZGVyIiwicXVlcmllcyIsIkpTT05QUGFyYW1zIiwicHJlcGFyZUpTT05QUGFyYW1zIiwicmVxdWVzdElkIiwic3RyYXRlZ3kiLCJzZXRTZWN1cml0eVRhZ3MiLCJ0YWdzIiwic3RyVGFncyIsIm9yZWRUYWdzIiwic2V0VXNlclRva2VuIiwic2V0UmVxdWVzdFRpbWVvdXQiLCJtaWxsaXNlY29uZHMiLCJzZXRUaW1lb3V0cyIsImdldFRpbWVvdXRzIiwiX2dldEFwcElkRGF0YSIsImdldCIsIl9jYWNoZUFwcElkRGF0YSIsIl9zZXRBcHBJZERhdGEiLCJsYXN0Q2hhbmdlIiwiZ2V0VGltZSIsInNldCIsIm5vdyIsIl9yZXNldEluaXRpYWxBcHBJZERhdGEiLCJuZXdEYXRhIiwiaG9zdEluZGV4ZXMiLCJ0aW1lb3V0TXVsdGlwbGllciIsInNodWZmbGVSZXN1bHQiLCJzaHVmZmxlIiwiX2hvc3RJbmRleGVzIiwiX3RpbWVvdXRNdWx0aXBsaWVyIiwiX3BhcnRpYWxBcHBJZERhdGFVcGRhdGUiLCJjdXJyZW50RGF0YSIsIl9nZXRIb3N0SW5kZXhCeVR5cGUiLCJfZ2V0VGltZW91dE11bHRpcGxpZXIiLCJob3N0SW5kZXgiLCJuZXdIb3N0SW5kZXhlcyIsIm1heCIsImNvbXBsZXRlIiwicHJlcGFyZSIsImhvc3QiLCJ0b0pTT04iLCJvdXQiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJyYW5kb20iLCJuZXdIZWFkZXJzIiwiaGVhZGVyTmFtZSIsImNhY2hlZFNldFRpbWVvdXQiLCJjYWNoZWRDbGVhclRpbWVvdXQiLCJkZWZhdWx0U2V0VGltb3V0IiwiZGVmYXVsdENsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJxdWV1ZSIsImRyYWluaW5nIiwiY3VycmVudFF1ZXVlIiwicXVldWVJbmRleCIsImNsZWFuVXBOZXh0VGljayIsImRyYWluUXVldWUiLCJydW4iLCJuZXh0VGljayIsIkl0ZW0iLCJ0aXRsZSIsImFyZ3YiLCJ2ZXJzaW9uIiwidmVyc2lvbnMiLCJub29wIiwib2ZmIiwiYmluZGluZyIsImN3ZCIsImNoZGlyIiwiZGlyIiwidW1hc2siLCJsb2NhbFN0b3JhZ2VOYW1lc3BhY2UiLCJtb2R1bGVTdG9yZSIsInN0YXRlIiwibG9jYWxTdG9yYWdlU3RvcmUiLCJuYW1lc3BhY2UiLCJnbG9iYWwiLCJsb2NhbFN0b3JhZ2UiLCJjbGVhbnVwIiwic3VwcG9ydHNMb2NhbFN0b3JhZ2UiLCJnZXRPclNldCIsInNldEl0ZW0iLCJfIiwicmVtb3ZlSXRlbSIsImZvcm1hdEFyZ3MiLCJzYXZlIiwidXNlQ29sb3JzIiwic3RvcmFnZSIsImNocm9tZSIsImxvY2FsIiwibG9jYWxzdG9yYWdlIiwiY29sb3JzIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJmaXJlYnVnIiwiZXhjZXB0aW9uIiwidGFibGUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJtYXRjaCIsIiQxIiwiZm9ybWF0dGVycyIsInYiLCJodW1hbml6ZSIsImRpZmYiLCJjIiwiY29sb3IiLCJsYXN0QyIsIkZ1bmN0aW9uIiwibmFtZXNwYWNlcyIsIkRFQlVHIiwiZW5hYmxlIiwiY3JlYXRlRGVidWciLCJjb2VyY2UiLCJkaXNhYmxlIiwiZW5hYmxlZCIsIm5hbWVzIiwic2tpcHMiLCJwcmV2VGltZSIsInNlbGVjdENvbG9yIiwiaGFzaCIsImNoYXJDb2RlQXQiLCJjdXJyIiwibXMiLCJwcmV2IiwiZm9ybWF0IiwiZm9ybWF0dGVyIiwidmFsIiwibG9nRm4iLCJiaW5kIiwic3Vic3RyIiwicyIsImgiLCJkIiwieSIsImxvbmciLCJmbXRMb25nIiwiZm10U2hvcnQiLCJwYXJzZUZsb2F0Iiwicm91bmQiLCJwbHVyYWwiLCJjZWlsIiwiUHJvbWlzZSIsInVhU3VmZml4IiwiaW5saW5lSGVhZGVycyIsImpzb25wUmVxdWVzdCIsInBsYWNlcyIsIk5PREVfRU5WIiwiY2xvbmVEZWVwIiwiZ2V0RG9jdW1lbnRQcm90b2NvbCIsInVhIiwiQWxnb2xpYVNlYXJjaEJyb3dzZXIiLCJpbml0UGxhY2VzIiwiX19hbGdvbGlhIiwic3VwcG9ydCIsImhhc1hNTEh0dHBSZXF1ZXN0IiwiaGFzWERvbWFpblJlcXVlc3QiLCJjb3JzIiwiWE1MSHR0cFJlcXVlc3QiLCJ3cmFwUmVxdWVzdCIsInJlcSIsIlhEb21haW5SZXF1ZXN0IiwicmVxVGltZW91dCIsInRpbWVkT3V0IiwiY29ubmVjdGVkIiwib25UaW1lb3V0Iiwib25wcm9ncmVzcyIsIm9uUHJvZ3Jlc3MiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJvblJlYWR5U3RhdGVDaGFuZ2UiLCJvbmxvYWQiLCJvbkxvYWQiLCJvbmVycm9yIiwib25FcnJvciIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsImdldEFsbFJlc3BvbnNlSGVhZGVycyIsIm1vcmUiLCJldmVudCIsImFib3J0Iiwib25Db25uZWN0IiwicmVhZHlTdGF0ZSIsInJlcXVlc3RGYWxsYmFjayIsIndyYXBKc29ucFJlcXVlc3QiLCJqc29ucFJlcXVlc3REb25lIiwicmVqZWN0UHJvbWlzZSIsInJlc29sdmVQcm9taXNlIiwiZGVsYXlQcm9taXNlIiwicmVzb2x2ZU9uVGltZW91dCIsImZhY3RvcnkiLCJFUzZQcm9taXNlIiwib2JqZWN0T3JGdW5jdGlvbiIsIngiLCJfaXNBcnJheSIsInZlcnR4TmV4dCIsImN1c3RvbVNjaGVkdWxlckZuIiwiYXNhcCIsImZsdXNoIiwic2NoZWR1bGVGbHVzaCIsInNldFNjaGVkdWxlciIsInNjaGVkdWxlRm4iLCJzZXRBc2FwIiwiYXNhcEZuIiwiYnJvd3NlcldpbmRvdyIsImJyb3dzZXJHbG9iYWwiLCJCcm93c2VyTXV0YXRpb25PYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJXZWJLaXRNdXRhdGlvbk9ic2VydmVyIiwiaXNOb2RlIiwiaXNXb3JrZXIiLCJVaW50OENsYW1wZWRBcnJheSIsImltcG9ydFNjcmlwdHMiLCJNZXNzYWdlQ2hhbm5lbCIsInVzZU5leHRUaWNrIiwidXNlVmVydHhUaW1lciIsInVzZVNldFRpbWVvdXQiLCJ1c2VNdXRhdGlvbk9ic2VydmVyIiwiaXRlcmF0aW9ucyIsIm9ic2VydmVyIiwibm9kZSIsImNyZWF0ZVRleHROb2RlIiwib2JzZXJ2ZSIsImNoYXJhY3RlckRhdGEiLCJ1c2VNZXNzYWdlQ2hhbm5lbCIsImNoYW5uZWwiLCJwb3J0MSIsIm9ubWVzc2FnZSIsInBvcnQyIiwicG9zdE1lc3NhZ2UiLCJnbG9iYWxTZXRUaW1lb3V0IiwiYXR0ZW1wdFZlcnR4IiwidmVydHgiLCJydW5Pbkxvb3AiLCJydW5PbkNvbnRleHQiLCJvbkZ1bGZpbGxtZW50Iiwib25SZWplY3Rpb24iLCJfYXJndW1lbnRzIiwicGFyZW50IiwiY2hpbGQiLCJQUk9NSVNFX0lEIiwibWFrZVByb21pc2UiLCJfc3RhdGUiLCJpbnZva2VDYWxsYmFjayIsInN1YnNjcmliZSIsIkNvbnN0cnVjdG9yIiwiX3Jlc29sdmUiLCJzdWJzdHJpbmciLCJQRU5ESU5HIiwiRlVMRklMTEVEIiwiUkVKRUNURUQiLCJHRVRfVEhFTl9FUlJPUiIsIkVycm9yT2JqZWN0Iiwic2VsZkZ1bGZpbGxtZW50IiwiY2Fubm90UmV0dXJuT3duIiwiZ2V0VGhlbiIsInRyeVRoZW4iLCJmdWxmaWxsbWVudEhhbmRsZXIiLCJyZWplY3Rpb25IYW5kbGVyIiwiaGFuZGxlRm9yZWlnblRoZW5hYmxlIiwidGhlbmFibGUiLCJzZWFsZWQiLCJmdWxmaWxsIiwicmVhc29uIiwiX3JlamVjdCIsIl9sYWJlbCIsImhhbmRsZU93blRoZW5hYmxlIiwiaGFuZGxlTWF5YmVUaGVuYWJsZSIsIm1heWJlVGhlbmFibGUiLCJ0aGVuJCQiLCJwdWJsaXNoUmVqZWN0aW9uIiwiX29uZXJyb3IiLCJwdWJsaXNoIiwiX3N1YnNjcmliZXJzIiwic3Vic2NyaWJlcnMiLCJzZXR0bGVkIiwiZGV0YWlsIiwiVFJZX0NBVENIX0VSUk9SIiwidHJ5Q2F0Y2giLCJoYXNDYWxsYmFjayIsInN1Y2NlZWRlZCIsImZhaWxlZCIsImluaXRpYWxpemVQcm9taXNlIiwicmVzb2x2ZXIiLCJuZXh0SWQiLCJFbnVtZXJhdG9yIiwiaW5wdXQiLCJfaW5zdGFuY2VDb25zdHJ1Y3RvciIsIl9pbnB1dCIsIl9yZW1haW5pbmciLCJfZW51bWVyYXRlIiwidmFsaWRhdGlvbkVycm9yIiwiX2VhY2hFbnRyeSIsImVudHJ5IiwicmVzb2x2ZSQkIiwiX3RoZW4iLCJfc2V0dGxlZEF0IiwiX3dpbGxTZXR0bGVBdCIsImVudW1lcmF0b3IiLCJhbGwiLCJlbnRyaWVzIiwicmFjZSIsIm5lZWRzUmVzb2x2ZXIiLCJuZWVkc05ldyIsIl9zZXRTY2hlZHVsZXIiLCJfc2V0QXNhcCIsIl9hc2FwIiwiX2NhdGNoIiwicG9seWZpbGwiLCJQIiwicHJvbWlzZVRvU3RyaW5nIiwiY2FzdCIsImVuY29kZSIsInN0cmluZ2lmeVByaW1pdGl2ZSIsImlzRmluaXRlIiwic2VwIiwiZXEiLCJvYmplY3RLZXlzIiwia3MiLCJ4cyIsImYiLCJKU09OUENvdW50ZXIiLCJjYkNhbGxlZCIsImhlYWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInNjcmlwdCIsImNyZWF0ZUVsZW1lbnQiLCJjYk5hbWUiLCJyZW1vdmVHbG9iYWxzIiwiY2xlYW4iLCJvbnRpbWVvdXQiLCJyZWFkeXN0YXRlY2hhbmdlIiwiYXN5bmMiLCJkZWZlciIsInNyYyIsImFwcGVuZENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJjcmVhdGVQbGFjZXNDbGllbnQiLCJhcHBJRCIsImxvY2F0aW9uIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFD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c3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZGJhYzVlMTc4N2MwMzEyZGVlOTIiLCJpbXBvcnQgdG9nZ2xlciBmcm9tICcuL2NvcmUvdG9nZ2xlcic7XG5pbXBvcnQgd2VibW9kdWxlIGZyb20gJy4vY29yZS9tb2R1bGUnO1xuaW1wb3J0IGdldFRwbCBmcm9tICcuL2NvcmUvZ2V0VHBsJztcbmltcG9ydCBhbGdvbGlhc2VhcmNoIGZyb20gJ2FsZ29saWFzZWFyY2gnO1xuXG50b2dnbGVyKCk7XG53ZWJtb2R1bGUuaW5pdCgpO1xuXG52YXIgY2xpZW50ID0gYWxnb2xpYXNlYXJjaCgnVERWNEk3N0YyRicsICdjNTczMWIyYWE0Y2IzMTZjMGY1NTk5MDE0NWYwMTI2ZCcpO1xuXG52YXIgRE9NUmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXJlc3VsdCcpO1xudmFyIERPTVJlc3VsdE1ldHJpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1yZXN1bHQtY291bnQnKTtcblxuY29uc3QgaXRlbVBlclBhZ2UgPSAzO1xubGV0IGN1cnJlbnRVSVBhZ2UgPSAwO1xudmFyIGdldFN0YXJzID0gZnVuY3Rpb24gKHIpIHtcbiAgICByZXR1cm4gJ+KYhScucmVwZWF0KE1hdGguYWJzKHIpKVxufTtcbnZhciBtYWtlU3RhcnMgPSBmdW5jdGlvbiAoc2NvcmUpIHtcbiAgICByZXR1cm4gZ2V0VHBsKHtzdGFyczogZ2V0U3RhcnMoc2NvcmUpLCBzdGFyZWQ6IGdldFN0YXJzKHNjb3JlIC0gNSl9LCAndHBsX3N0YXJzJylcbn07XG5cbnZhciBjb25jYXRSZXN1bHQgPSBmdW5jdGlvbiAocmVzLCBhbGxSZXMpIHtcbiAgICByZXR1cm4gYWxsUmVzLmNvbmNhdChyZXMpO1xufTtcbnZhciBzaG93TGlzdFJlc3VsdCA9IGZ1bmN0aW9uIChodG1sLCBhZGRIdG1sID0gdHJ1ZSkge1xuICAgIGlmIChhZGRIdG1sKSB7XG4gICAgICAgIERPTVJlc3VsdC5pbm5lckhUTUwgPSBodG1sO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgRE9NUmVzdWx0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgaHRtbCk7XG4gICAgfVxufTtcbnZhciBzZXRGaWx0ZXJIVE1MID0gZnVuY3Rpb24gKG5hbWUsIGZpbHRlcnMpIHtcbiAgICBsZXQgaHRtbCA9ICcnO1xuICAgIGxldCBhRmlsdGVycyA9IE9iamVjdC5rZXlzKGZpbHRlcnMpO1xuICAgIC8vdG9kbyBzb3J0IGJ5IGRlc2MgcXVhbnRpdHlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFGaWx0ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gYUZpbHRlcnNbaV07XG4gICAgICAgIGxldCBvcHRpb25zID0ge2NvdW50OiBmaWx0ZXJzW2l0ZW1dLmxlbmd0aCwgdHlwZTogaXRlbX07XG4gICAgICAgIGlmICgnc3RhcnMnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBvcHRpb25zWydjb250ZW50J10gPSBtYWtlU3RhcnMoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1snaGlkZSddID0gaSA+PSA1ID8gJ21vZC1oaWRlJyA6ICcnO1xuICAgICAgICBodG1sICs9IGdldFRwbChvcHRpb25zLCAndHBsX2ZpbHRlcl8nICsgbmFtZSk7XG4gICAgfVxuICAgICQoYC5qcy1maWx0ZXJbZGF0YS1uYW1lPVwiJHtuYW1lfVwiXWApLmh0bWwoaHRtbCkudG9nZ2xlQ2xhc3MoJ3Nob3ctbW9yZS1maWx0ZXInLCBhRmlsdGVycy5sZW5ndGggPiA1KTtcbn07XG5cbnZhciBpbnNlcnRSZXN1bHQgPSBmdW5jdGlvbiAocGFnZSkge1xuICAgIC8vdG9kbyBwYWdpbmF0ZSByZXN1bHRcbn07XG5cbnZhciBzZWFyY2hFbmQgPSBmdW5jdGlvbiAoYWxsUmVzLCB0aW1pbmcpIHtcbiAgICBsZXQgaHRtbCA9ICcnO1xuICAgIGxldCBhbGxGb29kVHlwZSA9IHt9O1xuICAgIGxldCBhbGxTdGFyc0NvdW50ID0ge307XG4gICAgbGV0IGFsbFBheW1lbnQgPSB7fTtcbiAgICBjdXJyZW50VUlQYWdlID0gMDsgLy9hbHdheXMgcmVzZXRcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gYWxsUmVzW2ldO1xuICAgICAgICBsZXQgaWQgPSBpdGVtLm9iamVjdElEO1xuICAgICAgICBsZXQgZm9vZFR5cGUgPSBpdGVtLmZvb2RfdHlwZTtcbiAgICAgICAgbGV0IHN0YXJzQ291bnRSb3VuZGVkID0gTWF0aC5mbG9vcihpdGVtLnN0YXJzX2NvdW50KTtcbiAgICAgICAgbGV0IHBheW1lbnQgPSBpdGVtLnBheW1lbnRfb3B0aW9ucztcbiAgICAgICAgKGFsbEZvb2RUeXBlW2Zvb2RUeXBlXSA9IGFsbEZvb2RUeXBlW2Zvb2RUeXBlXSA/IGFsbEZvb2RUeXBlW2Zvb2RUeXBlXSA6IFtdKS5wdXNoKGlkKTtcbiAgICAgICAgKGFsbFN0YXJzQ291bnRbc3RhcnNDb3VudFJvdW5kZWRdID0gYWxsU3RhcnNDb3VudFtzdGFyc0NvdW50Um91bmRlZF0gPyBhbGxTdGFyc0NvdW50W3N0YXJzQ291bnRSb3VuZGVkXSA6IFtdKS5wdXNoKGlkKTtcbiAgICAgICAgZm9yIChsZXQgaVBheW1lbnQgPSAwOyBpUGF5bWVudCA8IHBheW1lbnQubGVuZ3RoOyBpUGF5bWVudCsrKSB7XG4gICAgICAgICAgICAoYWxsUGF5bWVudFtwYXltZW50W2lQYXltZW50XV0gPSBhbGxQYXltZW50W3BheW1lbnRbaVBheW1lbnRdXSA/IGFsbFBheW1lbnRbcGF5bWVudFtpUGF5bWVudF1dIDogW10pLnB1c2goaWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpIDwgaXRlbVBlclBhZ2UpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gZ2V0VHBsKHtcbiAgICAgICAgICAgICAgICBtZWRpYTogaXRlbS5pbWFnZV91cmwsXG4gICAgICAgICAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgIHJlc2VydmV1cmw6IGl0ZW0ucmVzZXJ2ZV91cmwsXG4gICAgICAgICAgICAgICAgc2NvcmU6IGl0ZW0uc3RhcnNfY291bnQsXG4gICAgICAgICAgICAgICAgc2NvcmVSb3VuZGVkOiBzdGFyc0NvdW50Um91bmRlZCxcbiAgICAgICAgICAgICAgICBzdGFyczogZ2V0U3RhcnMoaXRlbS5zdGFyc19jb3VudCksXG4gICAgICAgICAgICAgICAgcmV2aWV3OiBpdGVtLnJldmlld3NfY291bnQsXG4gICAgICAgICAgICAgICAgZm9vZHR5cGU6IGl0ZW0uZm9vZF90eXBlLFxuICAgICAgICAgICAgICAgIHBsYWNlOiBpdGVtLmFyZWEsXG4gICAgICAgICAgICAgICAgcHJpY2VyYW5nZTogaXRlbS5wcmljZV9yYW5nZSxcbiAgICAgICAgICAgICAgICBwYXltZW50OiBpdGVtLnBheW1lbnRfb3B0aW9ucy5qb2luKCcsJylcbiAgICAgICAgICAgIH0sICd0cGxfc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRGaWx0ZXJIVE1MKCdmb29kcycsIGFsbEZvb2RUeXBlKTtcbiAgICBzZXRGaWx0ZXJIVE1MKCdzdGFycycsIGFsbFN0YXJzQ291bnQpO1xuICAgIHNldEZpbHRlckhUTUwoJ3BheW1lbnQnLCBhbGxQYXltZW50KTtcbiAgICBzaG93TGlzdFJlc3VsdChodG1sKTtcbiAgICAvL3RvZG8gbmVlZCBhIGZ1bmN0aW9uXG4gICAgRE9NUmVzdWx0TWV0cmljLmlubmVySFRNTCA9IGdldFRwbCh7Y291bnQ6IGFsbFJlcy5sZW5ndGgsIHRpbWU6IHRpbWluZyAvIDEwMDB9LCAndHBsX3NlYXJjaF90b3RhbCcpO1xuXG59O1xudmFyIHNlYXJjaFN0YXJ0ID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gICAgbGV0IGFsbFJlcyA9IFtdO1xuICAgIGxldCB0aW1pbmcgPSAwO1xuICAgIHZhciBzZWFyY2hEb25lID0gZnVuY3Rpb24gc2VhcmNoRG9uZShlcnIsIGNvbnRlbnQpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGNvbnRlbnQucmVzdWx0c1swXTtcbiAgICAgICAgdGltaW5nICs9IHJlc3VsdC5wcm9jZXNzaW5nVGltZU1TO1xuICAgICAgICBhbGxSZXMgPSBjb25jYXRSZXN1bHQocmVzdWx0LmhpdHMsIGFsbFJlcyk7XG4gICAgICAgIGlmIChyZXN1bHQubmJQYWdlcyA+IHJlc3VsdC5wYWdlICsgMSkge1xuICAgICAgICAgICAgY2xpZW50LnNlYXJjaChbe1xuICAgICAgICAgICAgICAgIGluZGV4TmFtZTogJ2FsbCcsXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiByZXN1bHQucGFnZSArIDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XSwgc2VhcmNoRG9uZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hFbmQoYWxsUmVzLCB0aW1pbmcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjbGllbnQuc2VhcmNoKFt7XG4gICAgICAgIGluZGV4TmFtZTogJ2FsbCcsXG4gICAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgIH1dLCBzZWFyY2hEb25lKTtcbn07XG5sZXQgVElNRU9VVHNlYXJjaCA9IDA7XG4kKCcuanMtc2VhcmNoJykub24oJ2lucHV0JywgZnVuY3Rpb24gKGUpIHtcbiAgICBsZXQgcXVlcnkgPSB0aGlzLnZhbHVlO1xuICAgIGNsZWFyVGltZW91dChUSU1FT1VUc2VhcmNoKTtcbiAgICBUSU1FT1VUc2VhcmNoID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlYXJjaFN0YXJ0KHF1ZXJ5KTtcbiAgICB9LCAyMDApO1xufSk7XG4kKCdib2R5Jykub24oJ2NsaWNrIG1vdXNlZW50ZXIgbW91c2VsZWF2ZScsICcuanMtZmlsdGVyLWl0ZW0nLCBmdW5jdGlvbiAoZSkge1xuICAgIGxldCB0eXBlID0gZS50eXBlO1xuICAgIC8vZW50ZXIvbGVhdmUgPSBoaWdobGlnaHRcbiAgICBsZXQgZmlsdGVyVHlwZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKTtcbiAgICBsZXQgZmlsdGVyTmFtZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcblxuICAgIGlmICgvbW91c2VsZWF2ZXxtb3VzZWVudGVyLy50ZXN0KHR5cGUpKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnbW91c2VlbnRlcicpIHtcbiAgICAgICAgICAgIGxldCAkY3NzID0gJCgnPHN0eWxlPicpLmh0bWwoYFxuICAgICAgICAgICAgICAgIC5yZXN1bHQtaXRlbTpub3QoW2RhdGEtdHlwZS0ke2ZpbHRlclR5cGV9Kj1cIiR7ZmlsdGVyTmFtZX1cIl0pe1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAuNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBgKS5hdHRyKCdpZCcsICdoaWdobGlnaHRjc3MnKTtcbiAgICAgICAgICAgICQoJ2hlYWQnKS5hcHBlbmQoJGNzcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKCcjaGlnaGxpZ2h0Y3NzJykucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICAvL2NsaWNrID0gZmlsdGVyXG5cblxufSk7XG5cbi8vbWVyZ2UganNvbnNcbi8vJC5nZXRKU09OKCdyZXNvdXJjZXMvZGF0YXNldC9yZXN0YXVyYW50c19saXN0Lmpzb24nKS5kb25lKGZ1bmN0aW9uIChsaXN0UmVzKSB7XG4vLyAgICAkLmdldEpTT04oJ3Jlc291cmNlcy9kYXRhc2V0L3Jlc3RhdXJhbnRzX2luZm8uanNvbicpLmRvbmUoZnVuY3Rpb24gKGluZm9SZXMpIHtcbi8vICAgICAgICBsZXQgYWxsID0gbGlzdFJlcy5tYXAoZnVuY3Rpb24obGlzdEl0ZW0pIHtcbi8vICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5mb1Jlcy5maWx0ZXIoZnVuY3Rpb24gKGluZm9JdGVtKSB7XG4vLyAgICAgICAgICAgICAgICByZXR1cm4gaW5mb0l0ZW0ub2JqZWN0SUQgPT09IGxpc3RJdGVtLm9iamVjdElEO1xuLy8gICAgICAgICAgICB9KVswXSwgbGlzdEl0ZW0pXG4vLyAgICAgICAgfSk7XG4vLyAgICAgICAgY29uc29sZS5pbmZvKEpTT04uc3RyaW5naWZ5KGFsbCkpO1xuLy8gICAgfSlcbi8vfSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvZW50cnkuanMiLCIvKipcbiAqIENyZWF0ZWQgYnkgc3RlZmFuIGNvdmEgJiBhbnRvaW5lIHNhbmNoZXogb24gMjYvMDEvMjAxNS5cbiAqIEB2ZXJzaW9uIDEuMVxuICpcbiAqIHRyaWdnZXI6XG4gKiA8bGkgY2xhc3M9XCJqcy10b2dnbGVyXCIgZGF0YS10b2dnbGVyLWdyb3VwPVwiZ3JvdXBcIiBkYXRhLXRvZ2dsZXItaWQ9XCJpZFwiPlxuICogYXZhaWxhYmxlIG9wdGlvbnM6XG4gKiBkYXRhLXRvZ2dsZXItYWN0aW9uPVwib3BlbnxjbG9zZXxjbG9zZS1hbGxcIlxuICpcbiAqIHJlY2VpdmVyOlxuICogPGRpdiBjbGFzcz1cImpzLWl0ZW0tdG9nZ2xlclwiIGRhdGEtdG9nZ2xlci1ncm91cD1cImdyb3VwXCIgZGF0YS10b2dnbGVyLWl0ZW1pZD1cImlkXCI+XG4gKiBhdmFpbGFibGUgb3B0aW9uczpcbiAqIGRhdGEtdG9nZ2xlci1ncm91cC1uby1jbG9zZT1cInRydWVcIlxuICpcbiAqL1xudmFyIGpzVG9nZ2xlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgbGV0IF9jc3NTZWxlY3RvciA9ICcnO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxldCBfYWN0aXZlQ2xhc3MgPSAnJztcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZXQgX2N1cnJlbnRUcmlnZ2VyQ2xhc3MgPSAnJztcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBsZXQgX2Nzc1NlbGVjdG9yQ29udGVudCA9ICcnO1xuXG4gICAgdmFyIHNlbGVjdG9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTsvL3RvZG8gY2hlY2sgaG93IHRvIGltcHJvdmUgdGhpcyBxdWljayBmaXhcbiAgICAgICAgdmFyICRhbGxMaW5rc1RvZ2dsZXIgPSAkKF9jc3NTZWxlY3Rvcik7XG4gICAgICAgIHZhciAkbGlua1RvZ2dsZXIgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgYWN0aW9uID0gZS50eXBlO1xuICAgICAgICB2YXIgdG9nZ2xlID0gL2NsaWNrfHRvZ2dsZS8udGVzdChhY3Rpb24pO1xuICAgICAgICB2YXIgb3BlbmluZyA9IGFjdGlvbiA9PT0gJ29wZW4nIHx8ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWFjdGlvbicpID09PSAnb3Blbic7XG4gICAgICAgIHZhciBjbG9zaW5nID0gYWN0aW9uID09PSAnY2xvc2UnIHx8ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWFjdGlvbicpID09PSAnY2xvc2UnO1xuICAgICAgICB2YXIgY2xvc2VBbGwgPSBhY3Rpb24gPT09ICdjbG9zZS1hbGwnIHx8ICRsaW5rVG9nZ2xlci5kYXRhKCd0b2dnbGVyLWFjdGlvbicpID09PSAnY2xvc2UtYWxsJztcblxuICAgICAgICB2YXIgJGFsbENvbnRlbnRzID0gJChfY3NzU2VsZWN0b3JDb250ZW50KTtcbiAgICAgICAgdmFyIGdyb3VwID0gJGxpbmtUb2dnbGVyLmRhdGEoJ3RvZ2dsZXItZ3JvdXAnKTtcbiAgICAgICAgdmFyIHRvZ2dsZXJfaWQgPSAkbGlua1RvZ2dsZXIuZGF0YSgndG9nZ2xlci1pZCcpO1xuICAgICAgICB2YXIgJGNvbnRlbnQgPSAkYWxsQ29udGVudHMuZmlsdGVyKCdbZGF0YS10b2dnbGVyLWl0ZW1pZD0nICsgdG9nZ2xlcl9pZCArICddW2RhdGEtdG9nZ2xlci1ncm91cD0nICsgZ3JvdXAgKyAnXScpO1xuICAgICAgICB2YXIgJGNvbnRlbnRHcm91cCA9IGNsb3NpbmcgPyAkY29udGVudCA6ICRhbGxDb250ZW50cy5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKTtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSBvcGVuaW5nID8gIW9wZW5pbmcgOiBjbG9zaW5nID8gY2xvc2luZyA6ICRjb250ZW50Lmhhc0NsYXNzKF9hY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgLy8gQWRkIHJlbW92ZSBjbGFzc2VzXG4gICAgICAgIGlmICgkY29udGVudC5kYXRhKCd0b2dnbGVyLWdyb3VwLW5vLWNsb3NlJykgJiYgISgodG9nZ2xlIHx8IG9wZW5pbmcgfHwgY2xvc2luZykgJiYgIWlzQWN0aXZlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2dnbGUgfHwgb3BlbmluZyB8fCBjbG9zaW5nIHx8IGNsb3NlQWxsKSB7XG4gICAgICAgICAgICBsZXQgJGxpbmtzVG9nZ2xlckdyb3VwID0gJGFsbExpbmtzVG9nZ2xlci5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKTtcbiAgICAgICAgICAgICRsaW5rc1RvZ2dsZXJHcm91cC5yZW1vdmVDbGFzcyhfYWN0aXZlQ2xhc3MgKyAnICcgKyBfY3VycmVudFRyaWdnZXJDbGFzcyk7XG4gICAgICAgICAgICAkY29udGVudEdyb3VwLmZpbHRlcignLicgKyBfYWN0aXZlQ2xhc3MpLnJlbW92ZUNsYXNzKF9hY3RpdmVDbGFzcykudHJpZ2dlcignY2xvc2UuY29udGVudCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNBY3RpdmUgJiYgIWNsb3NlQWxsICYmICFjbG9zaW5nKSB7XG4gICAgICAgICAgICBsZXQgJGxpbmtzVG9nZ2xlckdyb3VwID0gJGFsbExpbmtzVG9nZ2xlci5maWx0ZXIoJ1tkYXRhLXRvZ2dsZXItaWQ9JyArIHRvZ2dsZXJfaWQgKyAnXVtkYXRhLXRvZ2dsZXItZ3JvdXA9JyArIGdyb3VwICsgJ10nKTtcbiAgICAgICAgICAgICRsaW5rc1RvZ2dsZXJHcm91cC5hZGRDbGFzcyhfYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgJGxpbmtUb2dnbGVyLmFkZENsYXNzKF9jdXJyZW50VHJpZ2dlckNsYXNzKTtcbiAgICAgICAgICAgICRjb250ZW50LmFkZENsYXNzKF9hY3RpdmVDbGFzcykudHJpZ2dlcignb3Blbi5jb250ZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGFnTmFtZSA9PT0gXCJBXCIpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY3NzU2VsZWN0b3JcbiAgICAgKiBAcGFyYW0gY3NzU2VsZWN0b3JDb250ZW50XG4gICAgICogQHBhcmFtIGFjdGl2ZUNsYXNzXG4gICAgICogQHBhcmFtIGV2ZW50c1xuICAgICAqIEBwYXJhbSBjdXJyZW50VHJpZ2dlckNsYXNzXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh7Y3NzU2VsZWN0b3IgPSAnLmpzLXRvZ2dsZXInLCBjc3NTZWxlY3RvckNvbnRlbnQgPSAnLmpzLWl0ZW0tdG9nZ2xlcicsIGFjdGl2ZUNsYXNzID0gJ2FjdGl2ZScsIGV2ZW50cyA9ICcnLCBjdXJyZW50VHJpZ2dlckNsYXNzID0gJ2N1cnJlbnQtdHJpZ2dlcid9ID0ge30pIHtcbiAgICAgICAgZXZlbnRzID0gZXZlbnRzID8gJyAnICsgZXZlbnRzIDogJyc7XG4gICAgICAgIF9jc3NTZWxlY3RvciA9IGNzc1NlbGVjdG9yO1xuICAgICAgICBfY3NzU2VsZWN0b3JDb250ZW50ID0gY3NzU2VsZWN0b3JDb250ZW50O1xuICAgICAgICBfYWN0aXZlQ2xhc3MgPSBhY3RpdmVDbGFzcztcbiAgICAgICAgX2N1cnJlbnRUcmlnZ2VyQ2xhc3MgPSBjdXJyZW50VHJpZ2dlckNsYXNzO1xuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrIG9wZW4gY2xvc2UgdG9nZ2xlJyArIGV2ZW50cywgY3NzU2VsZWN0b3IsIHNlbGVjdG9yKTtcbiAgICB9O1xuXG59KSgpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ganNUb2dnbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9jb3JlL3RvZ2dsZXIuanMiLCIvKipcbiAqIGluaXRcbiAqL1xuXG52YXIgd2VibW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcblxuXG4gICAgY29uc3QgU0VMRUNUT1JfSU5JVElBTElaRUQgPSAnanMtbW9kdWxlLWluaXQnO1xuICAgIGxldCByZWdJc0luaXQgPSBuZXcgUmVnRXhwKFNFTEVDVE9SX0lOSVRJQUxJWkVEKTtcbiAgICAvKlxuICAgICBtb2R1bGUgYXV0byBpbml0XG4gICAgIGp1c3QgYWRkIC5qcy1tb2R1bGUgdG8gYW4gSFRNTCBlbGVtIGFuZCBhIG1vZHVsZSBuYW1lXG4gICAgIHRoYXQgd2lsbCBtYXRjaCBhIGZpbGUgaW4gXCJtb2R1bGVzXCIgZm9sZGVyIGFuZCBpdCB3aWxsIHdvcmtcblxuICAgICA8aDIgY2xhc3M9XCJqcy1tb2R1bGVcIiBkYXRhLW1vZHVsZT1cInRlc3RcIj5kZXNrdG9wL3RhYmxldHRlPC9oMj5cblxuICAgICBlYWNoIG1vZHVsZSBjYW4gZXhwb3J0IGEgcmVhZHkoKSAob3IgaW5pdCgpKSBhbmQgYSBsb2FkKCkgZnVuY3Rpb25cbiAgICAgKi9cblxuXG4gICAgdmFyIF9jcmVhdGUgPSBmdW5jdGlvbiAobW9kdWxlLCBtb2R1bGVOYW1lLCBET01Nb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmluaXQgPSBtb2R1bGUuaW5pdCB8fCBtb2R1bGUucmVhZHk7XG4gICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBET01Nb2R1bGUuYXR0cmlidXRlc1tpXTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gRE9NTW9kdWxlLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZS5ub2RlTmFtZTtcbiAgICAgICAgICAgIGlmIChuZXcgUmVnRXhwKGBeZGF0YS1tb2R1bGUtJHttb2R1bGVOYW1lfS0tYCkudGVzdChuYW1lKSkge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhTmFtZSA9IG5hbWUuc3BsaXQoYGRhdGEtbW9kdWxlLSR7bW9kdWxlTmFtZX0tLWApWzFdO1xuICAgICAgICAgICAgICAgIGRhdGFbZGF0YU5hbWVdID0ge3ZhbHVlOiBhdHRyaWJ1dGUubm9kZVZhbHVlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShtb2R1bGUsIGRhdGEpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtb2R1bGVzIHtOb2RlTGlzdH1cbiAgICAgKiBAcGFyYW0gbG9hZEZsYWc9ZmFsc2Uge0Jvb2xlYW59XG4gICAgICogQHJldHVybiB7e3JlYWR5OiBBcnJheSwgbG9hZDogQXJyYXl9fVxuICAgICAqL1xuICAgIHZhciBwYXJzZU1vZHVsZXMgPSBmdW5jdGlvbiAobW9kdWxlcywgbG9hZEZsYWcgPSBmYWxzZSkge1xuICAgICAgICBsZXQgbW9kdWxlUmVhZHkgPSBbXTtcbiAgICAgICAgbGV0IG1vZHVsZXNMb2FkID0gW107XG4gICAgICAgIGZvciAobGV0IERPTU1vZHVsZSBvZiBtb2R1bGVzKSB7XG4gICAgICAgICAgICBpZiAoIXJlZ0lzSW5pdC50ZXN0KERPTU1vZHVsZS5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgbGV0IF9tb2R1bGVOYW1lU3BsaXQgPSBET01Nb2R1bGUuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZHVsZScpLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfbW9kdWxlTmFtZVNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbW9kdWxlTmFtZSA9IF9tb2R1bGVOYW1lU3BsaXRbaV07XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW1wb3J0TW9kdWxlID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8nICsgX21vZHVsZU5hbWUpLmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9kdWxlID0gX2NyZWF0ZShpbXBvcnRNb2R1bGUsIF9tb2R1bGVOYW1lLCBET01Nb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlUmVhZHkucHVzaCh7bW9kdWxlOiBtb2R1bGUsIGVsZW06IERPTU1vZHVsZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZEZsYWcgJiYgbW9kdWxlc0xvYWQucHVzaCh7bW9kdWxlOiBtb2R1bGUsIGVsZW06IERPTU1vZHVsZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignTW9kdWxlIG5vdCBmb3VkJywgJy4uL21vZHVsZXMvJyArIF9tb2R1bGVOYW1lLCBET01Nb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhlYyhtb2R1bGVSZWFkeSwgdHJ1ZSk7XG5cbiAgICAgICAgbG9hZEZsYWcgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleGVjKG1vZHVsZXNMb2FkLCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwYXJzZU1vZHVsZXMoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLW1vZHVsZScpLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbW9kdWxlc1xuICAgICAqIEBwYXJhbSBmbGFnPWZhbHNlIHtCb29sZWFufSBhZGRDbGFzcyB0byBtYXJrIG1vZHVsZSBoYXMgYWxyZWFkeSBkb25lXG4gICAgICogQHBhcmFtIGRvTG9hZD1mYWxzZSB7Qm9vbGVhbn0gZXhlYyBsb2FkIGZ1bmN0aW9uXG4gICAgICovXG4gICAgdmFyIGV4ZWMgPSBmdW5jdGlvbiAobW9kdWxlcywgZmxhZyA9IGZhbHNlLCBkb0xvYWQgPSBmYWxzZSkge1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAgIGxldCBtb2R1bGUgPSBvLm1vZHVsZTtcbiAgICAgICAgICAgIGlmICghZG9Mb2FkICYmIG1vZHVsZS5pbml0KSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLmluaXQoby5lbGVtKTtcbiAgICAgICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgICAgICBvLmVsZW0uY2xhc3NOYW1lICs9ICcgJyArIFNFTEVDVE9SX0lOSVRJQUxJWkVEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb0xvYWQgJiYgbW9kdWxlLmxvYWQpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUubG9hZChvLmVsZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZHk6IGV4ZWMsXG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIHBhcnNlOiBwYXJzZU1vZHVsZXNcbiAgICB9XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gd2VibW9kdWxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9jb3JlL21vZHVsZS5qcyIsInZhciBtYXAgPSB7XG5cdFwiLi9wb3B1bGFyLWJvb2tzXCI6IDUsXG5cdFwiLi9wb3B1bGFyLWJvb2tzLmpzXCI6IDUsXG5cdFwiLi90ZXN0XCI6IDEwLFxuXHRcIi4vdGVzdC1uby1sb2FkXCI6IDExLFxuXHRcIi4vdGVzdC1uby1sb2FkLmpzXCI6IDExLFxuXHRcIi4vdGVzdC5qc1wiOiAxMFxufTtcbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyh3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSk7XG59O1xuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRyZXR1cm4gbWFwW3JlcV0gfHwgKGZ1bmN0aW9uKCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInLlwiKSB9KCkpO1xufTtcbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSA0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kdWxlcyBeXFwuXFwvLiokXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogaW5pdFxuICovXG52YXIgZ2V0U2VydmljZSA9IHJlcXVpcmUoJy4uL2NvcmUvZ2V0LXNlcnZpY2UnKTtcbnZhciBnZXRUcGwgPSByZXF1aXJlKCcuLi9jb3JlL2dldFRwbCcpO1xudmFyIHBvcHVsYXJCb29rID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvL1xuICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBnZXRTZXJ2aWNlLmNhbGwoJ3BvcHVsYXJfYm9va3MnKS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGRhdGEpO1xuICAgICAgICAgICAgICAgIGxldCBodG1sID0gZ2V0VHBsKG51bGwsICd0cGxfcG9wdWxhcmJvb2tzX3RoJyk7XG4gICAgICAgICAgICAgICAgZGF0YS5yZWNvcmRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGl0ZW0uZmllbGRzLmNvbGxlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICBodG1sICs9IGdldFRwbChpdGVtLmZpZWxkcywgJ3RwbF9wb3B1bGFyYm9va3MnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZHBvcHVsYXJib29rcycpLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgbGUgbW9kdWxlIHBvcHVsYXItYm9va3MgYSDDqXTDqSBpbml0IGF1IERPTVJlYWR5IHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0pO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWR5OiByZWFkeVxuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgcG9wdWxhckJvb2s7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvcG9wdWxhci1ib29rcy5qcyIsIi8vdG9kbyBlbmRwb2ludCBzaG91bGQgYmUgaW4gcGFyYW1zXG52YXIgYWpheCA9IHJlcXVpcmUoXCIuL2FqYXhcIik7XG5cbnZhciB1c2VTZXJ2aWNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBlbmRwb2ludCA9IHt9O1xuXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoZW5kUG9pbnQpIHtcbiAgICAgICAgZW5kcG9pbnQgPSBPYmplY3QuYXNzaWduKHt9LCBlbmRQb2ludCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBBUElfc2VydmljZSB7c3RyaW5nfVxuICAgICAqIEBwYXJhbSBwYXJhbXMge29iamVjdH0gZGF0YSBzZW50IHRvIHRoZSBBUElcbiAgICAgKiBAcGFyYW0gbG9hZGVyIHtCb29sZWFufSBkaXNwbGF5IG9yIG5vdCB0aGUgbG9hZGVyXG4gICAgICogQHJldHVybnMge2pRdWVyeX0gYWpheFxuICAgICAqL1xuICAgIHZhciBjYWxsID0gZnVuY3Rpb24gKEFQSV9zZXJ2aWNlLCBwYXJhbXMsIGxvYWRlcikge1xuICAgICAgICBpZiAoZW5kcG9pbnRbQVBJX3NlcnZpY2VdKSB7XG5cbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmKGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5wYXJhbXMpe1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnBhcmFtcywgcGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3B0aW9ucy5tZXRob2QgPSBlbmRwb2ludFtBUElfc2VydmljZV0ubWV0aG9kO1xuICAgICAgICAgICAgaWYgKGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5jb250ZW50VHlwZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnRlbnRUeXBlID0gZW5kcG9pbnRbQVBJX3NlcnZpY2VdLmNvbnRlbnRUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVuZHBvaW50W0FQSV9zZXJ2aWNlXS5wcm9jZXNzRGF0YSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnByb2Nlc3NEYXRhID0gZW5kcG9pbnRbQVBJX3NlcnZpY2VdLnByb2Nlc3NEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9ucy5kYXRhID0gcGFyYW1zO1xuICAgICAgICAgICAgcmV0dXJuIGFqYXgob3B0aW9ucywgbG9hZGVyKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgU2VydmljZSAke0FQSV9zZXJ2aWNlfSBub3QgZGVmaW5lZGApXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIGNhbGw6IGNhbGxcbiAgICB9O1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZVNlcnZpY2U7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvZ2V0LXNlcnZpY2UuanMiLCJ2YXIgYWpheGxvYWRlciA9IHJlcXVpcmUoXCIuL2FqYXgtbG9hZFwiKS5kZWZhdWx0O1xuLyoqXG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fVxuICogQHBhcmFtIFtsb2FkZXI9dHJ1ZV0ge0Jvb2xlYW59XG4gKi9cbnZhciBhamF4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBvbkFsd2F5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy90b2RvIHNob3VsZCBiZSBpbiBwYXJhbXNcbiAgICB9O1xuICAgIHZhciBvbkZhaWwgPSBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIC8vTk9UIEZPVU5EIE9SIE1FVEhPRCBOT1QgQUxMT1dFRFxuICAgICAgICAvL3RvZG8gc2hvdWxkIGJlIGluIHBhcmFtc1xuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9wdGlvbnMsIGxvYWRlciA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChsb2FkZXIpIHtcbiAgICAgICAgICAgIGlmIChhamF4bG9hZGVyLnJlYWR5KSB7XG4gICAgICAgICAgICAgICAgYWpheGxvYWRlci5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdsb2FkIG5vdCByZWFkeScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQuYWpheChvcHRpb25zKS5hbHdheXMobG9hZGVyID8gYWpheGxvYWRlci5oaWRlIDogb25BbHdheXMpLmZhaWwob25GYWlsKTtcbiAgICB9O1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXg7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvYWpheC5qcyIsInZhciBhamF4bG9hZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvL3RvZG8gdHBsIHNob3VsZCBiZSBpbiBwYXJhbVxuICAgIGxldCBfdHBsID0gJzxkaXYgaWQ9XCJhamF4bG9hZGVyXCIgY2xhc3M9XCJ3aW5kb3dzOFwiPjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfMVwiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF8yXCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzNcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfNFwiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndCYWxsXCIgaWQ9XCJ3QmFsbF81XCI+PGRpdiBjbGFzcz1cIndJbm5lckJhbGxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid0JhbGxcIiBpZD1cIndCYWxsXzZcIj48ZGl2IGNsYXNzPVwid0lubmVyQmFsbFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3QmFsbFwiIGlkPVwid0JhbGxfN1wiPjxkaXYgY2xhc3M9XCJ3SW5uZXJCYWxsXCI+PC9kaXY+PC9kaXY+PC9kaXY+JztcbiAgIFxuICAgIGxldCAkYWpheGxvYWRlcjtcbiAgICBsZXQgX2Nzc0NsYXNzID0gJyc7XG4gICAgbGV0IHN0YXR1cyA9IDA7XG4gICAgbGV0IF9pc1JlYWR5ID0gZmFsc2U7XG4gICAgdmFyIHNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0YXR1cy0tO1xuICAgICAgICAkYWpheGxvYWRlci5hZGRDbGFzcyhfY3NzQ2xhc3MpO1xuICAgIH07XG4gICAgdmFyIGhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0YXR1cysrO1xuICAgICAgICBzdGF0dXMgPT09IDAgJiYgJGFqYXhsb2FkZXIucmVtb3ZlQ2xhc3MoX2Nzc0NsYXNzKTtcbiAgICB9O1xuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKHt0cGwsICR0YXJnZXQsIGNzc0NsYXNzfSkge1xuICAgICAgICBfY3NzQ2xhc3MgPSBjc3NDbGFzcyB8fCAnYWpheGxvYWRlci1zaG93JztcbiAgICAgICAgX3RwbCA9IHRwbDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRwbCk7XG4gICAgICAgICRhamF4bG9hZGVyID0gJHRhcmdldCB8fCAkKCcjYWpheGxvYWRlcicpO1xuICAgICAgICBfaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0O1xuICAgIH07XG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX2lzUmVhZHlcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIHNob3c6IHNob3csXG4gICAgICAgIGhpZGU6IGhpZGUsXG4gICAgICAgIHJlYWR5OiByZWFkeVxuICAgIH1cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheGxvYWQ7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvYWpheC1sb2FkLmpzIiwidmFyIGdldFRwbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgbGV0IGNhY2hlID0ge307XG4gICAgdmFyIGdldENhY2hlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlW3RlbXBsYXRlSWRdO1xuICAgIH07XG4gICAgdmFyIHNldENhY2hlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWQsIGh0bWwpIHtcbiAgICAgICAgY2FjaGVbdGVtcGxhdGVJZF0gPSBodG1sO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGZvcm1lZCBvYmplY3QgdGhhdCBtYXRjaCBpbiB0ZW1wbGF0ZSB7Zm9vOidiYXInfSB3aWxsIHJlcGxhY2Uge3tmb299fSB3aXRoIGJhclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZUlkIEhUTUwgYXR0cmlidXRlIGlkXG4gICAgICogQHJldHVybnMge3N0cmluZ30gSFRNbCB0ZW1wbGF0ZSB0cmFuc2Zvcm1lZFxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiBnZXR0cGwoZGF0YSwgdGVtcGxhdGVJZCwgZGVidWcgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdGVtcGxhdGVIVE1MID0gZ2V0Q2FjaGUodGVtcGxhdGVJZCk7XG4gICAgICAgIGlmIChnZXRDYWNoZSh0ZW1wbGF0ZUlkKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVIVE1MID0gZ2V0Q2FjaGUodGVtcGxhdGVJZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgdHBsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCk7XG4gICAgICAgICAgICB0ZW1wbGF0ZUhUTUwgPSB0cGwuaW5uZXJIVE1MO1xuICAgICAgICAgICAgc2V0Q2FjaGUodGVtcGxhdGVJZCwgdGVtcGxhdGVIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVtcGxhdGVIVE1MLnJlcGxhY2UoL3t7ID8oW159XSopICt9fS9nLCBmdW5jdGlvbiAoc2VhcmNoLCByZXN1bHQpIHtcbiAgICAgICAgICAgIGRlYnVnICYmIGNvbnNvbGUuaW5mbyhyZXN1bHQsIGRhdGFbcmVzdWx0XSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVtyZXN1bHRdIHx8ICcnO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KSgpO1xubW9kdWxlLmV4cG9ydHMgPSBnZXRUcGw7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvcmUvZ2V0VHBsLmpzIiwiLyoqXG4gKiBpbml0XG4gKi9cblxudmFyIG1vZHVsZVRlc3QgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHJlYWR5ID0gZnVuY3Rpb24gKGVsZW0pIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oYGxlIG1vZHVsZSB0ZXN0IGEgw6l0w6kgaW5pdCBhdSBET01SZWFkeSB2aWEgbCfDqWzDqW1lbnRgLCBlbGVtLCB0aGlzKTtcblxuICAgIH07XG4gICAgdmFyIGxvYWQgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICBjb25zb2xlLmluZm8oYGxlIG1vZHVsZSB0ZXN0IGEgw6l0w6kgaW5pdCBhdSBMT0FEIHZpYSBsJ8OpbMOpbWVudGAsIGVsZW0sIHRoaXMpO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWR5OiByZWFkeSxcbiAgICAgICAgbG9hZDogbG9hZFxuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9kdWxlVGVzdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90ZXN0LmpzIiwiLyoqXG4gKiBpbml0XG4gKi9cbmltcG9ydCBtb2R1bGUgZnJvbSBcIi4uL2NvcmUvbW9kdWxlXCI7XG5cbnZhciBtb2R1bGVUZXN0ID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cbiAgICAgICAgY29uc29sZS5pbmZvKGBsZSBtb2R1bGUgdGVzdC1uby1sb2FkIGEgw6l0w6kgaW5pdCBhdSBET01SZWFkeSB2aWEgbCfDqWzDqW1lbnRgLCBlbGVtLCB0aGlzKTtcblxuICAgICAgICAkKGVsZW0pLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsZW0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlckVuZCcsIGA8aDIgY2xhc3M9XCJqcy1tb2R1bGVcIiBkYXRhLW1vZHVsZT1cInRlc3Qtbm8tbG9hZFwiPlRlc3Qgbm8tbG9hZDwvaDI+YCk7XG4gICAgICAgICAgICBtb2R1bGUucGFyc2UoJCgnLmpzLW1vZHVsZScpKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0OiByZWFkeVxuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9kdWxlVGVzdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbW9kdWxlcy90ZXN0LW5vLWxvYWQuanMiLCIndXNlIHN0cmljdCc7XG5cbnZhciBBbGdvbGlhU2VhcmNoID0gcmVxdWlyZSgnLi4vLi4vQWxnb2xpYVNlYXJjaC5qcycpO1xudmFyIGNyZWF0ZUFsZ29saWFzZWFyY2ggPSByZXF1aXJlKCcuLi9jcmVhdGVBbGdvbGlhc2VhcmNoLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQWxnb2xpYXNlYXJjaChBbGdvbGlhU2VhcmNoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvYnJvd3Nlci9idWlsZHMvYWxnb2xpYXNlYXJjaC5qcyIsIm1vZHVsZS5leHBvcnRzID0gQWxnb2xpYVNlYXJjaDtcblxudmFyIEluZGV4ID0gcmVxdWlyZSgnLi9JbmRleC5qcycpO1xudmFyIGRlcHJlY2F0ZSA9IHJlcXVpcmUoJy4vZGVwcmVjYXRlLmpzJyk7XG52YXIgZGVwcmVjYXRlZE1lc3NhZ2UgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZWRNZXNzYWdlLmpzJyk7XG52YXIgQWxnb2xpYVNlYXJjaENvcmUgPSByZXF1aXJlKCcuL0FsZ29saWFTZWFyY2hDb3JlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbmZ1bmN0aW9uIEFsZ29saWFTZWFyY2goKSB7XG4gIEFsZ29saWFTZWFyY2hDb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXRzKEFsZ29saWFTZWFyY2gsIEFsZ29saWFTZWFyY2hDb3JlKTtcblxuLypcbiAqIERlbGV0ZSBhbiBpbmRleFxuICpcbiAqIEBwYXJhbSBpbmRleE5hbWUgdGhlIG5hbWUgb2YgaW5kZXggdG8gZGVsZXRlXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgY29udGFpbnMgdGhlIHRhc2sgSURcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZGVsZXRlSW5kZXggPSBmdW5jdGlvbihpbmRleE5hbWUsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhOYW1lKSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKipcbiAqIE1vdmUgYW4gZXhpc3RpbmcgaW5kZXguXG4gKiBAcGFyYW0gc3JjSW5kZXhOYW1lIHRoZSBuYW1lIG9mIGluZGV4IHRvIGNvcHkuXG4gKiBAcGFyYW0gZHN0SW5kZXhOYW1lIHRoZSBuZXcgaW5kZXggbmFtZSB0aGF0IHdpbGwgY29udGFpbnMgYSBjb3B5IG9mXG4gKiBzcmNJbmRleE5hbWUgKGRlc3RpbmF0aW9uIHdpbGwgYmUgb3ZlcnJpdGVuIGlmIGl0IGFscmVhZHkgZXhpc3QpLlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuICogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IGNvbnRhaW5zIHRoZSB0YXNrIElEXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLm1vdmVJbmRleCA9IGZ1bmN0aW9uKHNyY0luZGV4TmFtZSwgZHN0SW5kZXhOYW1lLCBjYWxsYmFjaykge1xuICB2YXIgcG9zdE9iaiA9IHtcbiAgICBvcGVyYXRpb246ICdtb3ZlJywgZGVzdGluYXRpb246IGRzdEluZGV4TmFtZVxuICB9O1xuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChzcmNJbmRleE5hbWUpICsgJy9vcGVyYXRpb24nLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLyoqXG4gKiBDb3B5IGFuIGV4aXN0aW5nIGluZGV4LlxuICogQHBhcmFtIHNyY0luZGV4TmFtZSB0aGUgbmFtZSBvZiBpbmRleCB0byBjb3B5LlxuICogQHBhcmFtIGRzdEluZGV4TmFtZSB0aGUgbmV3IGluZGV4IG5hbWUgdGhhdCB3aWxsIGNvbnRhaW5zIGEgY29weVxuICogb2Ygc3JjSW5kZXhOYW1lIChkZXN0aW5hdGlvbiB3aWxsIGJlIG92ZXJyaXRlbiBpZiBpdCBhbHJlYWR5IGV4aXN0KS5cbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiAqICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4gKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyB0aGUgdGFzayBJRFxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5jb3B5SW5kZXggPSBmdW5jdGlvbihzcmNJbmRleE5hbWUsIGRzdEluZGV4TmFtZSwgY2FsbGJhY2spIHtcbiAgdmFyIHBvc3RPYmogPSB7XG4gICAgb3BlcmF0aW9uOiAnY29weScsIGRlc3RpbmF0aW9uOiBkc3RJbmRleE5hbWVcbiAgfTtcbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoc3JjSW5kZXhOYW1lKSArICcvb3BlcmF0aW9uJyxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGxhc3QgbG9nIGVudHJpZXMuXG4gKiBAcGFyYW0gb2Zmc2V0IFNwZWNpZnkgdGhlIGZpcnN0IGVudHJ5IHRvIHJldHJpZXZlICgwLWJhc2VkLCAwIGlzIHRoZSBtb3N0IHJlY2VudCBsb2cgZW50cnkpLlxuICogQHBhcmFtIGxlbmd0aCBTcGVjaWZ5IHRoZSBtYXhpbXVtIG51bWJlciBvZiBlbnRyaWVzIHRvIHJldHJpZXZlIHN0YXJ0aW5nXG4gKiBhdCBvZmZzZXQuIE1heGltdW0gYWxsb3dlZCB2YWx1ZTogMTAwMC5cbiAqIEBwYXJhbSB0eXBlIFNwZWNpZnkgdGhlIG1heGltdW0gbnVtYmVyIG9mIGVudHJpZXMgdG8gcmV0cmlldmUgc3RhcnRpbmdcbiAqIGF0IG9mZnNldC4gTWF4aW11bSBhbGxvd2VkIHZhbHVlOiAxMDAwLlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuICogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IGNvbnRhaW5zIHRoZSB0YXNrIElEXG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmdldExvZ3MgPSBmdW5jdGlvbihvZmZzZXQsIGxlbmd0aCwgY2FsbGJhY2spIHtcbiAgdmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZS5qcycpO1xuICB2YXIgcGFyYW1zID0ge307XG4gIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSAnb2JqZWN0Jykge1xuICAgIC8vIGdldExvZ3MocGFyYW1zKVxuICAgIHBhcmFtcyA9IGNsb25lKG9mZnNldCk7XG4gICAgY2FsbGJhY2sgPSBsZW5ndGg7XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB0eXBlb2Ygb2Zmc2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gZ2V0TG9ncyhbY2JdKVxuICAgIGNhbGxiYWNrID0gb2Zmc2V0O1xuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgfHwgdHlwZW9mIGxlbmd0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIGdldExvZ3MoMSwgW2NiKV1cbiAgICBjYWxsYmFjayA9IGxlbmd0aDtcbiAgICBwYXJhbXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9IGVsc2Uge1xuICAgIC8vIGdldExvZ3MoMSwgMiwgW2NiXSlcbiAgICBwYXJhbXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIHBhcmFtcy5sZW5ndGggPSBsZW5ndGg7XG4gIH1cblxuICBpZiAocGFyYW1zLm9mZnNldCA9PT0gdW5kZWZpbmVkKSBwYXJhbXMub2Zmc2V0ID0gMDtcbiAgaWYgKHBhcmFtcy5sZW5ndGggPT09IHVuZGVmaW5lZCkgcGFyYW1zLmxlbmd0aCA9IDEwO1xuXG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9sb2dzPycgKyB0aGlzLl9nZXRTZWFyY2hQYXJhbXMocGFyYW1zLCAnJyksXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuICogTGlzdCBhbGwgZXhpc3RpbmcgaW5kZXhlcyAocGFnaW5hdGVkKVxuICpcbiAqIEBwYXJhbSBwYWdlIFRoZSBwYWdlIHRvIHJldHJpZXZlLCBzdGFydGluZyBhdCAwLlxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuICogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIGluZGV4IGxpc3RcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUubGlzdEluZGV4ZXMgPSBmdW5jdGlvbihwYWdlLCBjYWxsYmFjaykge1xuICB2YXIgcGFyYW1zID0gJyc7XG5cbiAgaWYgKHBhZ2UgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgcGFnZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gcGFnZTtcbiAgfSBlbHNlIHtcbiAgICBwYXJhbXMgPSAnP3BhZ2U9JyArIHBhZ2U7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcycgKyBwYXJhbXMsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuICogR2V0IHRoZSBpbmRleCBvYmplY3QgaW5pdGlhbGl6ZWRcbiAqXG4gKiBAcGFyYW0gaW5kZXhOYW1lIHRoZSBuYW1lIG9mIGluZGV4XG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayB3aXRoIG9uZSBhcmd1bWVudCAodGhlIEluZGV4IGluc3RhbmNlKVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5pbml0SW5kZXggPSBmdW5jdGlvbihpbmRleE5hbWUpIHtcbiAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLCBpbmRleE5hbWUpO1xufTtcblxuLypcbiAqIExpc3QgYWxsIGV4aXN0aW5nIHVzZXIga2V5cyB3aXRoIHRoZWlyIGFzc29jaWF0ZWQgQUNMc1xuICpcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiAqICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4gKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB1c2VyIGtleXMgbGlzdFxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5saXN0VXNlcktleXMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEva2V5cycsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuICogR2V0IEFDTCBvZiBhIHVzZXIga2V5XG4gKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuICogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4gKi9cbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmdldFVzZXJLZXlBQ0wgPSBmdW5jdGlvbihrZXksIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9rZXlzLycgKyBrZXksXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuICogRGVsZXRlIGFuIGV4aXN0aW5nIHVzZXIga2V5XG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuICogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHdpdGggdXNlciBrZXlzIGxpc3RcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZGVsZXRlVXNlcktleSA9IGZ1bmN0aW9uKGtleSwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgIHVybDogJy8xL2tleXMvJyArIGtleSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuICogQWRkIGEgbmV3IGdsb2JhbCBBUEkga2V5XG4gKlxuICogQHBhcmFtIHtzdHJpbmdbXX0gYWNscyAtIFRoZSBsaXN0IG9mIEFDTCBmb3IgdGhpcyBrZXkuIERlZmluZWQgYnkgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0XG4gKiAgIGNhbiBjb250YWlucyB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAqICAgICAtIHNlYXJjaDogYWxsb3cgdG8gc2VhcmNoIChodHRwcyBhbmQgaHR0cClcbiAqICAgICAtIGFkZE9iamVjdDogYWxsb3dzIHRvIGFkZC91cGRhdGUgYW4gb2JqZWN0IGluIHRoZSBpbmRleCAoaHR0cHMgb25seSlcbiAqICAgICAtIGRlbGV0ZU9iamVjdCA6IGFsbG93cyB0byBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0IChodHRwcyBvbmx5KVxuICogICAgIC0gZGVsZXRlSW5kZXggOiBhbGxvd3MgdG8gZGVsZXRlIGluZGV4IGNvbnRlbnQgKGh0dHBzIG9ubHkpXG4gKiAgICAgLSBzZXR0aW5ncyA6IGFsbG93cyB0byBnZXQgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4gKiAgICAgLSBlZGl0U2V0dGluZ3MgOiBhbGxvd3MgdG8gY2hhbmdlIGluZGV4IHNldHRpbmdzIChodHRwcyBvbmx5KVxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdIC0gT3B0aW9ubmFsIHBhcmFtZXRlcnMgdG8gc2V0IGZvciB0aGUga2V5XG4gKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLnZhbGlkaXR5IC0gTnVtYmVyIG9mIHNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGtleSB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCAoMCBtZWFucyBubyB0aW1lIGxpbWl0IGZvciB0aGlzIGtleSlcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4UXVlcmllc1BlcklQUGVySG91ciAtIE51bWJlciBvZiBBUEkgY2FsbHMgYWxsb3dlZCBmcm9tIGFuIElQIGFkZHJlc3MgcGVyIGhvdXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5IC0gTnVtYmVyIG9mIGhpdHMgdGhpcyBBUEkga2V5IGNhbiByZXRyaWV2ZSBpbiBvbmUgY2FsbFxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1zLmluZGV4ZXMgLSBBbGxvd2VkIHRhcmdldGVkIGluZGV4ZXMgZm9yIHRoaXMga2V5XG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmRlc2NyaXB0aW9uIC0gQSBkZXNjcmlwdGlvbiBmb3IgeW91ciBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtcy5yZWZlcmVycyAtIEEgbGlzdCBvZiBhdXRob3JpemVkIHJlZmVyZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zLnF1ZXJ5UGFyYW1ldGVycyAtIEZvcmNlIHRoZSBrZXkgdG8gdXNlIHNwZWNpZmljIHF1ZXJ5IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB1c2VyIGtleXMgbGlzdFxuICogQHJldHVybiB7UHJvbWlzZXx1bmRlZmluZWR9IFJldHVybnMgYSBwcm9taXNlIGlmIG5vIGNhbGxiYWNrIGdpdmVuXG4gKiBAZXhhbXBsZVxuICogY2xpZW50LmFkZFVzZXJLZXkoWydzZWFyY2gnXSwge1xuICogICB2YWxpZGl0eTogMzAwLFxuICogICBtYXhRdWVyaWVzUGVySVBQZXJIb3VyOiAyMDAwLFxuICogICBtYXhIaXRzUGVyUXVlcnk6IDMsXG4gKiAgIGluZGV4ZXM6IFsnZnJ1aXRzJ10sXG4gKiAgIGRlc2NyaXB0aW9uOiAnRWF0IHRocmVlIGZydWl0cycsXG4gKiAgIHJlZmVyZXJzOiBbJyouYWxnb2xpYS5jb20nXSxcbiAqICAgcXVlcnlQYXJhbWV0ZXJzOiB7XG4gKiAgICAgdGFnRmlsdGVyczogWydwdWJsaWMnXSxcbiAqICAgfVxuICogfSlcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9yZXN0X2FwaSNBZGRLZXl8QWxnb2xpYSBSRVNUIEFQSSBEb2N1bWVudGF0aW9ufVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5hZGRVc2VyS2V5ID0gZnVuY3Rpb24oYWNscywgcGFyYW1zLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBjbGllbnQuYWRkVXNlcktleShhcnJheU9mQWNsc1ssIHBhcmFtcywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KGFjbHMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICBwYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgdmFyIHBvc3RPYmogPSB7XG4gICAgYWNsOiBhY2xzXG4gIH07XG5cbiAgaWYgKHBhcmFtcykge1xuICAgIHBvc3RPYmoudmFsaWRpdHkgPSBwYXJhbXMudmFsaWRpdHk7XG4gICAgcG9zdE9iai5tYXhRdWVyaWVzUGVySVBQZXJIb3VyID0gcGFyYW1zLm1heFF1ZXJpZXNQZXJJUFBlckhvdXI7XG4gICAgcG9zdE9iai5tYXhIaXRzUGVyUXVlcnkgPSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5O1xuICAgIHBvc3RPYmouaW5kZXhlcyA9IHBhcmFtcy5pbmRleGVzO1xuICAgIHBvc3RPYmouZGVzY3JpcHRpb24gPSBwYXJhbXMuZGVzY3JpcHRpb247XG5cbiAgICBpZiAocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycykge1xuICAgICAgcG9zdE9iai5xdWVyeVBhcmFtZXRlcnMgPSB0aGlzLl9nZXRTZWFyY2hQYXJhbXMocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycywgJycpO1xuICAgIH1cblxuICAgIHBvc3RPYmoucmVmZXJlcnMgPSBwYXJhbXMucmVmZXJlcnM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2tleXMnLFxuICAgIGJvZHk6IHBvc3RPYmosXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGQgYSBuZXcgZ2xvYmFsIEFQSSBrZXlcbiAqIEBkZXByZWNhdGVkIFBsZWFzZSB1c2UgY2xpZW50LmFkZFVzZXJLZXkoKVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5hZGRVc2VyS2V5V2l0aFZhbGlkaXR5ID0gZGVwcmVjYXRlKGZ1bmN0aW9uKGFjbHMsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuYWRkVXNlcktleShhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn0sIGRlcHJlY2F0ZWRNZXNzYWdlKCdjbGllbnQuYWRkVXNlcktleVdpdGhWYWxpZGl0eSgpJywgJ2NsaWVudC5hZGRVc2VyS2V5KCknKSk7XG5cbi8qKlxuICogVXBkYXRlIGFuIGV4aXN0aW5nIEFQSSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IHRvIHVwZGF0ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gYWNscyAtIFRoZSBsaXN0IG9mIEFDTCBmb3IgdGhpcyBrZXkuIERlZmluZWQgYnkgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0XG4gKiAgIGNhbiBjb250YWlucyB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAqICAgICAtIHNlYXJjaDogYWxsb3cgdG8gc2VhcmNoIChodHRwcyBhbmQgaHR0cClcbiAqICAgICAtIGFkZE9iamVjdDogYWxsb3dzIHRvIGFkZC91cGRhdGUgYW4gb2JqZWN0IGluIHRoZSBpbmRleCAoaHR0cHMgb25seSlcbiAqICAgICAtIGRlbGV0ZU9iamVjdCA6IGFsbG93cyB0byBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0IChodHRwcyBvbmx5KVxuICogICAgIC0gZGVsZXRlSW5kZXggOiBhbGxvd3MgdG8gZGVsZXRlIGluZGV4IGNvbnRlbnQgKGh0dHBzIG9ubHkpXG4gKiAgICAgLSBzZXR0aW5ncyA6IGFsbG93cyB0byBnZXQgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4gKiAgICAgLSBlZGl0U2V0dGluZ3MgOiBhbGxvd3MgdG8gY2hhbmdlIGluZGV4IHNldHRpbmdzIChodHRwcyBvbmx5KVxuICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdIC0gT3B0aW9ubmFsIHBhcmFtZXRlcnMgdG8gc2V0IGZvciB0aGUga2V5XG4gKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLnZhbGlkaXR5IC0gTnVtYmVyIG9mIHNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGtleSB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCAoMCBtZWFucyBubyB0aW1lIGxpbWl0IGZvciB0aGlzIGtleSlcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4UXVlcmllc1BlcklQUGVySG91ciAtIE51bWJlciBvZiBBUEkgY2FsbHMgYWxsb3dlZCBmcm9tIGFuIElQIGFkZHJlc3MgcGVyIGhvdXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5IC0gTnVtYmVyIG9mIGhpdHMgdGhpcyBBUEkga2V5IGNhbiByZXRyaWV2ZSBpbiBvbmUgY2FsbFxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGFyYW1zLmluZGV4ZXMgLSBBbGxvd2VkIHRhcmdldGVkIGluZGV4ZXMgZm9yIHRoaXMga2V5XG4gKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmRlc2NyaXB0aW9uIC0gQSBkZXNjcmlwdGlvbiBmb3IgeW91ciBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtcy5yZWZlcmVycyAtIEEgbGlzdCBvZiBhdXRob3JpemVkIHJlZmVyZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zLnF1ZXJ5UGFyYW1ldGVycyAtIEZvcmNlIHRoZSBrZXkgdG8gdXNlIHNwZWNpZmljIHF1ZXJ5IHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4gKiAgIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiAqICAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB1c2VyIGtleXMgbGlzdFxuICogQHJldHVybiB7UHJvbWlzZXx1bmRlZmluZWR9IFJldHVybnMgYSBwcm9taXNlIGlmIG5vIGNhbGxiYWNrIGdpdmVuXG4gKiBAZXhhbXBsZVxuICogY2xpZW50LnVwZGF0ZVVzZXJLZXkoJ0FQSUtFWScsIFsnc2VhcmNoJ10sIHtcbiAqICAgdmFsaWRpdHk6IDMwMCxcbiAqICAgbWF4UXVlcmllc1BlcklQUGVySG91cjogMjAwMCxcbiAqICAgbWF4SGl0c1BlclF1ZXJ5OiAzLFxuICogICBpbmRleGVzOiBbJ2ZydWl0cyddLFxuICogICBkZXNjcmlwdGlvbjogJ0VhdCB0aHJlZSBmcnVpdHMnLFxuICogICByZWZlcmVyczogWycqLmFsZ29saWEuY29tJ10sXG4gKiAgIHF1ZXJ5UGFyYW1ldGVyczoge1xuICogICAgIHRhZ0ZpbHRlcnM6IFsncHVibGljJ10sXG4gKiAgIH1cbiAqIH0pXG4gKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5hbGdvbGlhLmNvbS9kb2MvcmVzdF9hcGkjVXBkYXRlSW5kZXhLZXl8QWxnb2xpYSBSRVNUIEFQSSBEb2N1bWVudGF0aW9ufVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS51cGRhdGVVc2VyS2V5ID0gZnVuY3Rpb24oa2V5LCBhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGNsaWVudC51cGRhdGVVc2VyS2V5KGtleSwgYXJyYXlPZkFjbHNbLCBwYXJhbXMsIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShhY2xzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiB8fCB0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfVxuXG4gIHZhciBwdXRPYmogPSB7XG4gICAgYWNsOiBhY2xzXG4gIH07XG5cbiAgaWYgKHBhcmFtcykge1xuICAgIHB1dE9iai52YWxpZGl0eSA9IHBhcmFtcy52YWxpZGl0eTtcbiAgICBwdXRPYmoubWF4UXVlcmllc1BlcklQUGVySG91ciA9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyO1xuICAgIHB1dE9iai5tYXhIaXRzUGVyUXVlcnkgPSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5O1xuICAgIHB1dE9iai5pbmRleGVzID0gcGFyYW1zLmluZGV4ZXM7XG4gICAgcHV0T2JqLmRlc2NyaXB0aW9uID0gcGFyYW1zLmRlc2NyaXB0aW9uO1xuXG4gICAgaWYgKHBhcmFtcy5xdWVyeVBhcmFtZXRlcnMpIHtcbiAgICAgIHB1dE9iai5xdWVyeVBhcmFtZXRlcnMgPSB0aGlzLl9nZXRTZWFyY2hQYXJhbXMocGFyYW1zLnF1ZXJ5UGFyYW1ldGVycywgJycpO1xuICAgIH1cblxuICAgIHB1dE9iai5yZWZlcmVycyA9IHBhcmFtcy5yZWZlcmVycztcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICB1cmw6ICcvMS9rZXlzLycgKyBrZXksXG4gICAgYm9keTogcHV0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBiYXRjaCBvZiBzZWFyY2ggcXVlcmllc1xuICogQGRlcHJlY2F0ZWQgdXNlIGNsaWVudC5zZWFyY2goKVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5zdGFydFF1ZXJpZXNCYXRjaCA9IGRlcHJlY2F0ZShmdW5jdGlvbiBzdGFydFF1ZXJpZXNCYXRjaERlcHJlY2F0ZWQoKSB7XG4gIHRoaXMuX2JhdGNoID0gW107XG59LCBkZXByZWNhdGVkTWVzc2FnZSgnY2xpZW50LnN0YXJ0UXVlcmllc0JhdGNoKCknLCAnY2xpZW50LnNlYXJjaCgpJykpO1xuXG4vKipcbiAqIEFkZCBhIHNlYXJjaCBxdWVyeSBpbiB0aGUgYmF0Y2hcbiAqIEBkZXByZWNhdGVkIHVzZSBjbGllbnQuc2VhcmNoKClcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuYWRkUXVlcnlJbkJhdGNoID0gZGVwcmVjYXRlKGZ1bmN0aW9uIGFkZFF1ZXJ5SW5CYXRjaERlcHJlY2F0ZWQoaW5kZXhOYW1lLCBxdWVyeSwgYXJncykge1xuICB0aGlzLl9iYXRjaC5wdXNoKHtcbiAgICBpbmRleE5hbWU6IGluZGV4TmFtZSxcbiAgICBxdWVyeTogcXVlcnksXG4gICAgcGFyYW1zOiBhcmdzXG4gIH0pO1xufSwgZGVwcmVjYXRlZE1lc3NhZ2UoJ2NsaWVudC5hZGRRdWVyeUluQmF0Y2goKScsICdjbGllbnQuc2VhcmNoKCknKSk7XG5cbi8qKlxuICogTGF1bmNoIHRoZSBiYXRjaCBvZiBxdWVyaWVzIHVzaW5nIFhNTEh0dHBSZXF1ZXN0LlxuICogQGRlcHJlY2F0ZWQgdXNlIGNsaWVudC5zZWFyY2goKVxuICovXG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5zZW5kUXVlcmllc0JhdGNoID0gZGVwcmVjYXRlKGZ1bmN0aW9uIHNlbmRRdWVyaWVzQmF0Y2hEZXByZWNhdGVkKGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLnNlYXJjaCh0aGlzLl9iYXRjaCwgY2FsbGJhY2spO1xufSwgZGVwcmVjYXRlZE1lc3NhZ2UoJ2NsaWVudC5zZW5kUXVlcmllc0JhdGNoKCknLCAnY2xpZW50LnNlYXJjaCgpJykpO1xuXG4vKipcbiAqIFBlcmZvcm0gd3JpdGUgb3BlcmF0aW9ucyBhY2Nyb3NzIG11bHRpcGxlIGluZGV4ZXMuXG4gKlxuICogVG8gcmVkdWNlIHRoZSBhbW91bnQgb2YgdGltZSBzcGVudCBvbiBuZXR3b3JrIHJvdW5kIHRyaXBzLFxuICogeW91IGNhbiBjcmVhdGUsIHVwZGF0ZSwgb3IgZGVsZXRlIHNldmVyYWwgb2JqZWN0cyBpbiBvbmUgY2FsbCxcbiAqIHVzaW5nIHRoZSBiYXRjaCBlbmRwb2ludCAoYWxsIG9wZXJhdGlvbnMgYXJlIGRvbmUgaW4gdGhlIGdpdmVuIG9yZGVyKS5cbiAqXG4gKiBBdmFpbGFibGUgYWN0aW9uczpcbiAqICAgLSBhZGRPYmplY3RcbiAqICAgLSB1cGRhdGVPYmplY3RcbiAqICAgLSBwYXJ0aWFsVXBkYXRlT2JqZWN0XG4gKiAgIC0gcGFydGlhbFVwZGF0ZU9iamVjdE5vQ3JlYXRlXG4gKiAgIC0gZGVsZXRlT2JqZWN0XG4gKlxuICogaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL3Jlc3RfYXBpI0luZGV4ZXNcbiAqIEBwYXJhbSAge09iamVjdFtdfSBvcGVyYXRpb25zIEFuIGFycmF5IG9mIG9wZXJhdGlvbnMgdG8gcGVyZm9ybVxuICogQHJldHVybiB7UHJvbWlzZXx1bmRlZmluZWR9IFJldHVybnMgYSBwcm9taXNlIGlmIG5vIGNhbGxiYWNrIGdpdmVuXG4gKiBAZXhhbXBsZVxuICogY2xpZW50LmJhdGNoKFt7XG4gKiAgIGFjdGlvbjogJ2FkZE9iamVjdCcsXG4gKiAgIGluZGV4TmFtZTogJ2NsaWVudHMnLFxuICogICBib2R5OiB7XG4gKiAgICAgbmFtZTogJ0JpbGwnXG4gKiAgIH1cbiAqIH0sIHtcbiAqICAgYWN0aW9uOiAndWRwYXRlT2JqZWN0JyxcbiAqICAgaW5kZXhOYW1lOiAnZnJ1aXRzJyxcbiAqICAgYm9keToge1xuICogICAgIG9iamVjdElEOiAnMjkxMzgnLFxuICogICAgIG5hbWU6ICdiYW5hbmEnXG4gKiAgIH1cbiAqIH1dLCBjYilcbiAqL1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbihvcGVyYXRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBjbGllbnQuYmF0Y2gob3BlcmF0aW9uc1ssIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShvcGVyYXRpb25zKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvKi9iYXRjaCcsXG4gICAgYm9keToge1xuICAgICAgcmVxdWVzdHM6IG9wZXJhdGlvbnNcbiAgICB9LFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8vIGVudmlyb25tZW50IHNwZWNpZmljIG1ldGhvZHNcbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmRlc3Ryb3kgPSBub3RJbXBsZW1lbnRlZDtcbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmVuYWJsZVJhdGVMaW1pdEZvcndhcmQgPSBub3RJbXBsZW1lbnRlZDtcbkFsZ29saWFTZWFyY2gucHJvdG90eXBlLmRpc2FibGVSYXRlTGltaXRGb3J3YXJkID0gbm90SW1wbGVtZW50ZWQ7XG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS51c2VTZWN1cmVkQVBJS2V5ID0gbm90SW1wbGVtZW50ZWQ7XG5BbGdvbGlhU2VhcmNoLnByb3RvdHlwZS5kaXNhYmxlU2VjdXJlZEFQSUtleSA9IG5vdEltcGxlbWVudGVkO1xuQWxnb2xpYVNlYXJjaC5wcm90b3R5cGUuZ2VuZXJhdGVTZWN1cmVkQXBpS2V5ID0gbm90SW1wbGVtZW50ZWQ7XG5cbmZ1bmN0aW9uIG5vdEltcGxlbWVudGVkKCkge1xuICB2YXIgbWVzc2FnZSA9ICdOb3QgaW1wbGVtZW50ZWQgaW4gdGhpcyBlbnZpcm9ubWVudC5cXG4nICtcbiAgICAnSWYgeW91IGZlZWwgdGhpcyBpcyBhIG1pc3Rha2UsIHdyaXRlIHRvIHN1cHBvcnRAYWxnb2xpYS5jb20nO1xuXG4gIHRocm93IG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKG1lc3NhZ2UpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9BbGdvbGlhU2VhcmNoLmpzIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBJbmRleENvcmUgPSByZXF1aXJlKCcuL0luZGV4Q29yZS5qcycpO1xudmFyIGRlcHJlY2F0ZSA9IHJlcXVpcmUoJy4vZGVwcmVjYXRlLmpzJyk7XG52YXIgZGVwcmVjYXRlZE1lc3NhZ2UgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZWRNZXNzYWdlLmpzJyk7XG52YXIgZXhpdFByb21pc2UgPSByZXF1aXJlKCcuL2V4aXRQcm9taXNlLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRleDtcblxuZnVuY3Rpb24gSW5kZXgoKSB7XG4gIEluZGV4Q29yZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0cyhJbmRleCwgSW5kZXhDb3JlKTtcblxuLypcbiogQWRkIGFuIG9iamVjdCBpbiB0aGlzIGluZGV4XG4qXG4qIEBwYXJhbSBjb250ZW50IGNvbnRhaW5zIHRoZSBqYXZhc2NyaXB0IG9iamVjdCB0byBhZGQgaW5zaWRlIHRoZSBpbmRleFxuKiBAcGFyYW0gb2JqZWN0SUQgKG9wdGlvbmFsKSBhbiBvYmplY3RJRCB5b3Ugd2FudCB0byBhdHRyaWJ1dGUgdG8gdGhpcyBvYmplY3RcbiogKGlmIHRoZSBhdHRyaWJ1dGUgYWxyZWFkeSBleGlzdCB0aGUgb2xkIG9iamVjdCB3aWxsIGJlIG92ZXJ3cml0ZSlcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyAzIGVsZW1lbnRzOiBjcmVhdGVBdCwgdGFza0lkIGFuZCBvYmplY3RJRFxuKi9cbkluZGV4LnByb3RvdHlwZS5hZGRPYmplY3QgPSBmdW5jdGlvbihjb250ZW50LCBvYmplY3RJRCwgY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2Ygb2JqZWN0SUQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9iamVjdElEO1xuICAgIG9iamVjdElEID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6IG9iamVjdElEICE9PSB1bmRlZmluZWQgP1xuICAgICdQVVQnIDogLy8gdXBkYXRlIG9yIGNyZWF0ZVxuICAgICdQT1NUJywgLy8gY3JlYXRlIChBUEkgZ2VuZXJhdGVzIGFuIG9iamVjdElEKVxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgLy8gY3JlYXRlXG4gICAgKG9iamVjdElEICE9PSB1bmRlZmluZWQgPyAnLycgKyBlbmNvZGVVUklDb21wb25lbnQob2JqZWN0SUQpIDogJycpLCAvLyB1cGRhdGUgb3IgY3JlYXRlXG4gICAgYm9keTogY29udGVudCxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBBZGQgc2V2ZXJhbCBvYmplY3RzXG4qXG4qIEBwYXJhbSBvYmplY3RzIGNvbnRhaW5zIGFuIGFycmF5IG9mIG9iamVjdHMgdG8gYWRkXG4qIEBwYXJhbSBjYWxsYmFjayAob3B0aW9uYWwpIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50czpcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgdXBkYXRlQXQgYW5kIHRhc2tJRFxuKi9cbkluZGV4LnByb3RvdHlwZS5hZGRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0cywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciB1c2FnZSA9ICdVc2FnZTogaW5kZXguYWRkT2JqZWN0cyhhcnJheU9mT2JqZWN0c1ssIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShvYmplY3RzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICB2YXIgcG9zdE9iaiA9IHtcbiAgICByZXF1ZXN0czogW11cbiAgfTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICBhY3Rpb246ICdhZGRPYmplY3QnLFxuICAgICAgYm9keTogb2JqZWN0c1tpXVxuICAgIH07XG4gICAgcG9zdE9iai5yZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICB9XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2JhdGNoJyxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIFVwZGF0ZSBwYXJ0aWFsbHkgYW4gb2JqZWN0IChvbmx5IHVwZGF0ZSBhdHRyaWJ1dGVzIHBhc3NlZCBpbiBhcmd1bWVudClcbipcbiogQHBhcmFtIHBhcnRpYWxPYmplY3QgY29udGFpbnMgdGhlIGphdmFzY3JpcHQgYXR0cmlidXRlcyB0byBvdmVycmlkZSwgdGhlXG4qICBvYmplY3QgbXVzdCBjb250YWlucyBhbiBvYmplY3RJRCBhdHRyaWJ1dGVcbiogQHBhcmFtIGNyZWF0ZUlmTm90RXhpc3RzIChvcHRpb25hbCkgaWYgZmFsc2UsIGF2b2lkIGFuIGF1dG9tYXRpYyBjcmVhdGlvbiBvZiB0aGUgb2JqZWN0XG4qIEBwYXJhbSBjYWxsYmFjayAob3B0aW9uYWwpIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50czpcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgY29udGFpbnMgMyBlbGVtZW50czogY3JlYXRlQXQsIHRhc2tJZCBhbmQgb2JqZWN0SURcbiovXG5JbmRleC5wcm90b3R5cGUucGFydGlhbFVwZGF0ZU9iamVjdCA9IGZ1bmN0aW9uKHBhcnRpYWxPYmplY3QsIGNyZWF0ZUlmTm90RXhpc3RzLCBjYWxsYmFjaykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2YgY3JlYXRlSWZOb3RFeGlzdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGNyZWF0ZUlmTm90RXhpc3RzO1xuICAgIGNyZWF0ZUlmTm90RXhpc3RzID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgdmFyIHVybCA9ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvJyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJ0aWFsT2JqZWN0Lm9iamVjdElEKSArICcvcGFydGlhbCc7XG4gIGlmIChjcmVhdGVJZk5vdEV4aXN0cyA9PT0gZmFsc2UpIHtcbiAgICB1cmwgKz0gJz9jcmVhdGVJZk5vdEV4aXN0cz1mYWxzZSc7XG4gIH1cblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogdXJsLFxuICAgIGJvZHk6IHBhcnRpYWxPYmplY3QsXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogUGFydGlhbGx5IE92ZXJyaWRlIHRoZSBjb250ZW50IG9mIHNldmVyYWwgb2JqZWN0c1xuKlxuKiBAcGFyYW0gb2JqZWN0cyBjb250YWlucyBhbiBhcnJheSBvZiBvYmplY3RzIHRvIHVwZGF0ZSAoZWFjaCBvYmplY3QgbXVzdCBjb250YWlucyBhIG9iamVjdElEIGF0dHJpYnV0ZSlcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCB1cGRhdGVBdCBhbmQgdGFza0lEXG4qL1xuSW5kZXgucHJvdG90eXBlLnBhcnRpYWxVcGRhdGVPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0cywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciB1c2FnZSA9ICdVc2FnZTogaW5kZXgucGFydGlhbFVwZGF0ZU9iamVjdHMoYXJyYXlPZk9iamVjdHNbLCBjYWxsYmFja10pJztcblxuICBpZiAoIWlzQXJyYXkob2JqZWN0cykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgdmFyIHBvc3RPYmogPSB7XG4gICAgcmVxdWVzdHM6IFtdXG4gIH07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7ICsraSkge1xuICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgYWN0aW9uOiAncGFydGlhbFVwZGF0ZU9iamVjdCcsXG4gICAgICBvYmplY3RJRDogb2JqZWN0c1tpXS5vYmplY3RJRCxcbiAgICAgIGJvZHk6IG9iamVjdHNbaV1cbiAgICB9O1xuICAgIHBvc3RPYmoucmVxdWVzdHMucHVzaChyZXF1ZXN0KTtcbiAgfVxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy9iYXRjaCcsXG4gICAgYm9keTogcG9zdE9iaixcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBPdmVycmlkZSB0aGUgY29udGVudCBvZiBvYmplY3RcbipcbiogQHBhcmFtIG9iamVjdCBjb250YWlucyB0aGUgamF2YXNjcmlwdCBvYmplY3QgdG8gc2F2ZSwgdGhlIG9iamVjdCBtdXN0IGNvbnRhaW5zIGFuIG9iamVjdElEIGF0dHJpYnV0ZVxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKSB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHM6XG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB0aGF0IHVwZGF0ZUF0IGFuZCB0YXNrSURcbiovXG5JbmRleC5wcm90b3R5cGUuc2F2ZU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9iamVjdC5vYmplY3RJRCksXG4gICAgYm9keTogb2JqZWN0LFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIE92ZXJyaWRlIHRoZSBjb250ZW50IG9mIHNldmVyYWwgb2JqZWN0c1xuKlxuKiBAcGFyYW0gb2JqZWN0cyBjb250YWlucyBhbiBhcnJheSBvZiBvYmplY3RzIHRvIHVwZGF0ZSAoZWFjaCBvYmplY3QgbXVzdCBjb250YWlucyBhIG9iamVjdElEIGF0dHJpYnV0ZSlcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCB1cGRhdGVBdCBhbmQgdGFza0lEXG4qL1xuSW5kZXgucHJvdG90eXBlLnNhdmVPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0cywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciB1c2FnZSA9ICdVc2FnZTogaW5kZXguc2F2ZU9iamVjdHMoYXJyYXlPZk9iamVjdHNbLCBjYWxsYmFja10pJztcblxuICBpZiAoIWlzQXJyYXkob2JqZWN0cykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgdmFyIHBvc3RPYmogPSB7XG4gICAgcmVxdWVzdHM6IFtdXG4gIH07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7ICsraSkge1xuICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgYWN0aW9uOiAndXBkYXRlT2JqZWN0JyxcbiAgICAgIG9iamVjdElEOiBvYmplY3RzW2ldLm9iamVjdElELFxuICAgICAgYm9keTogb2JqZWN0c1tpXVxuICAgIH07XG4gICAgcG9zdE9iai5yZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICB9XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2JhdGNoJyxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIERlbGV0ZSBhbiBvYmplY3QgZnJvbSB0aGUgaW5kZXhcbipcbiogQHBhcmFtIG9iamVjdElEIHRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiBvYmplY3QgdG8gZGVsZXRlXG4qIEBwYXJhbSBjYWxsYmFjayAob3B0aW9uYWwpIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50czpcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgY29udGFpbnMgMyBlbGVtZW50czogY3JlYXRlQXQsIHRhc2tJZCBhbmQgb2JqZWN0SURcbiovXG5JbmRleC5wcm90b3R5cGUuZGVsZXRlT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0SUQsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0SUQgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG9iamVjdElEICE9PSAnc3RyaW5nJyAmJiB0eXBlb2Ygb2JqZWN0SUQgIT09ICdudW1iZXInKSB7XG4gICAgdmFyIGVyciA9IG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKCdDYW5ub3QgZGVsZXRlIGFuIG9iamVjdCB3aXRob3V0IGFuIG9iamVjdElEJyk7XG4gICAgY2FsbGJhY2sgPSBvYmplY3RJRDtcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hcy5fcHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgfVxuXG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvJyArIGVuY29kZVVSSUNvbXBvbmVudChvYmplY3RJRCksXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogRGVsZXRlIHNldmVyYWwgb2JqZWN0cyBmcm9tIGFuIGluZGV4XG4qXG4qIEBwYXJhbSBvYmplY3RJRHMgY29udGFpbnMgYW4gYXJyYXkgb2Ygb2JqZWN0SUQgdG8gZGVsZXRlXG4qIEBwYXJhbSBjYWxsYmFjayAob3B0aW9uYWwpIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50czpcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogIGNvbnRlbnQ6IHRoZSBzZXJ2ZXIgYW5zd2VyIHRoYXQgY29udGFpbnMgMyBlbGVtZW50czogY3JlYXRlQXQsIHRhc2tJZCBhbmQgb2JqZWN0SURcbiovXG5JbmRleC5wcm90b3R5cGUuZGVsZXRlT2JqZWN0cyA9IGZ1bmN0aW9uKG9iamVjdElEcywgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciBtYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xuXG4gIHZhciB1c2FnZSA9ICdVc2FnZTogaW5kZXguZGVsZXRlT2JqZWN0cyhhcnJheU9mT2JqZWN0SURzWywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KG9iamVjdElEcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgdmFyIHBvc3RPYmogPSB7XG4gICAgcmVxdWVzdHM6IG1hcChvYmplY3RJRHMsIGZ1bmN0aW9uIHByZXBhcmVSZXF1ZXN0KG9iamVjdElEKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhY3Rpb246ICdkZWxldGVPYmplY3QnLFxuICAgICAgICBvYmplY3RJRDogb2JqZWN0SUQsXG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBvYmplY3RJRDogb2JqZWN0SURcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KVxuICB9O1xuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2JhdGNoJyxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIERlbGV0ZSBhbGwgb2JqZWN0cyBtYXRjaGluZyBhIHF1ZXJ5XG4qXG4qIEBwYXJhbSBxdWVyeSB0aGUgcXVlcnkgc3RyaW5nXG4qIEBwYXJhbSBwYXJhbXMgdGhlIG9wdGlvbmFsIHF1ZXJ5IHBhcmFtZXRlcnNcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCBvbmUgYXJndW1lbnRcbiogIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiovXG5JbmRleC5wcm90b3R5cGUuZGVsZXRlQnlRdWVyeSA9IGZ1bmN0aW9uKHF1ZXJ5LCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHZhciBjbG9uZSA9IHJlcXVpcmUoJy4vY2xvbmUuanMnKTtcbiAgdmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgdmFyIGNsaWVudCA9IGluZGV4T2JqLmFzO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxIHx8IHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IHBhcmFtcztcbiAgICBwYXJhbXMgPSB7fTtcbiAgfSBlbHNlIHtcbiAgICBwYXJhbXMgPSBjbG9uZShwYXJhbXMpO1xuICB9XG5cbiAgcGFyYW1zLmF0dHJpYnV0ZXNUb1JldHJpZXZlID0gJ29iamVjdElEJztcbiAgcGFyYW1zLmhpdHNQZXJQYWdlID0gMTAwMDtcbiAgcGFyYW1zLmRpc3RpbmN0ID0gZmFsc2U7XG5cbiAgLy8gd2hlbiBkZWxldGluZywgd2Ugc2hvdWxkIG5ldmVyIHVzZSBjYWNoZSB0byBnZXQgdGhlXG4gIC8vIHNlYXJjaCByZXN1bHRzXG4gIHRoaXMuY2xlYXJDYWNoZSgpO1xuXG4gIC8vIHRoZXJlJ3MgYSBwcm9ibGVtIGluIGhvdyB3ZSB1c2UgdGhlIHByb21pc2UgY2hhaW4sXG4gIC8vIHNlZSBob3cgd2FpdFRhc2sgaXMgZG9uZVxuICB2YXIgcHJvbWlzZSA9IHRoaXNcbiAgLnNlYXJjaChxdWVyeSwgcGFyYW1zKVxuICAudGhlbihzdG9wT3JEZWxldGUpO1xuXG4gIGZ1bmN0aW9uIHN0b3BPckRlbGV0ZShzZWFyY2hDb250ZW50KSB7XG4gICAgLy8gc3RvcCBoZXJlXG4gICAgaWYgKHNlYXJjaENvbnRlbnQubmJIaXRzID09PSAwKSB7XG4gICAgICAvLyByZXR1cm4gaW5kZXhPYmouYXMuX3JlcXVlc3QucmVzb2x2ZSgpO1xuICAgICAgcmV0dXJuIHNlYXJjaENvbnRlbnQ7XG4gICAgfVxuXG4gICAgLy8gY29udGludWUgYW5kIGRvIGEgcmVjdXJzaXZlIGNhbGxcbiAgICB2YXIgb2JqZWN0SURzID0gbWFwKHNlYXJjaENvbnRlbnQuaGl0cywgZnVuY3Rpb24gZ2V0T2JqZWN0SUQob2JqZWN0KSB7XG4gICAgICByZXR1cm4gb2JqZWN0Lm9iamVjdElEO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluZGV4T2JqXG4gICAgLmRlbGV0ZU9iamVjdHMob2JqZWN0SURzKVxuICAgIC50aGVuKHdhaXRUYXNrKVxuICAgIC50aGVuKGRvRGVsZXRlQnlRdWVyeSk7XG4gIH1cblxuICBmdW5jdGlvbiB3YWl0VGFzayhkZWxldGVPYmplY3RzQ29udGVudCkge1xuICAgIHJldHVybiBpbmRleE9iai53YWl0VGFzayhkZWxldGVPYmplY3RzQ29udGVudC50YXNrSUQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9EZWxldGVCeVF1ZXJ5KCkge1xuICAgIHJldHVybiBpbmRleE9iai5kZWxldGVCeVF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpO1xuICB9XG5cbiAgaWYgKCFjYWxsYmFjaykge1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgcHJvbWlzZS50aGVuKHN1Y2Nlc3MsIGZhaWx1cmUpO1xuXG4gIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgZXhpdFByb21pc2UoZnVuY3Rpb24gZXhpdCgpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgIH0sIGNsaWVudC5fc2V0VGltZW91dCB8fCBzZXRUaW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWx1cmUoZXJyKSB7XG4gICAgZXhpdFByb21pc2UoZnVuY3Rpb24gZXhpdCgpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfSwgY2xpZW50Ll9zZXRUaW1lb3V0IHx8IHNldFRpbWVvdXQpO1xuICB9XG59O1xuXG4vKlxuKiBCcm93c2UgYWxsIGNvbnRlbnQgZnJvbSBhbiBpbmRleCB1c2luZyBldmVudHMuIEJhc2ljYWxseSB0aGlzIHdpbGwgZG9cbiogLmJyb3dzZSgpIC0+IC5icm93c2VGcm9tIC0+IC5icm93c2VGcm9tIC0+IC4uIHVudGlsIGFsbCB0aGUgcmVzdWx0cyBhcmUgcmV0dXJuZWRcbipcbiogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5IC0gVGhlIGZ1bGwgdGV4dCBxdWVyeVxuKiBAcGFyYW0ge09iamVjdH0gW3F1ZXJ5UGFyYW1ldGVyc10gLSBBbnkgc2VhcmNoIHF1ZXJ5IHBhcmFtZXRlclxuKiBAcmV0dXJuIHtFdmVudEVtaXR0ZXJ9XG4qIEBleGFtcGxlXG4qIHZhciBicm93c2VyID0gaW5kZXguYnJvd3NlQWxsKCdjb29sIHNvbmdzJywge1xuKiAgIHRhZ0ZpbHRlcnM6ICdwdWJsaWMsY29tbWVudHMnLFxuKiAgIGhpdHNQZXJQYWdlOiA1MDBcbiogfSk7XG4qXG4qIGJyb3dzZXIub24oJ3Jlc3VsdCcsIGZ1bmN0aW9uIHJlc3VsdENhbGxiYWNrKGNvbnRlbnQpIHtcbiogICBjb25zb2xlLmxvZyhjb250ZW50LmhpdHMpO1xuKiB9KTtcbipcbiogLy8gaWYgYW55IGVycm9yIG9jY3VycywgeW91IGdldCBpdFxuKiBicm93c2VyLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuKiAgIHRocm93IGVycjtcbiogfSk7XG4qXG4qIC8vIHdoZW4geW91IGhhdmUgYnJvd3NlZCB0aGUgd2hvbGUgaW5kZXgsIHlvdSBnZXQgdGhpcyBldmVudFxuKiBicm93c2VyLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiogICBjb25zb2xlLmxvZygnZmluaXNoZWQnKTtcbiogfSk7XG4qXG4qIC8vIGF0IGFueSBwb2ludCBpZiB5b3Ugd2FudCB0byBzdG9wIHRoZSBicm93c2luZyBwcm9jZXNzLCB5b3UgY2FuIHN0b3AgaXQgbWFudWFsbHlcbiogLy8gb3RoZXJ3aXNlIGl0IHdpbGwgZ28gb24gYW5kIG9uXG4qIGJyb3dzZXIuc3RvcCgpO1xuKlxuKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5hbGdvbGlhLmNvbS9kb2MvcmVzdF9hcGkjQnJvd3NlfEFsZ29saWEgUkVTVCBBUEkgRG9jdW1lbnRhdGlvbn1cbiovXG5JbmRleC5wcm90b3R5cGUuYnJvd3NlQWxsID0gZnVuY3Rpb24ocXVlcnksIHF1ZXJ5UGFyYW1ldGVycykge1xuICBpZiAodHlwZW9mIHF1ZXJ5ID09PSAnb2JqZWN0Jykge1xuICAgIHF1ZXJ5UGFyYW1ldGVycyA9IHF1ZXJ5O1xuICAgIHF1ZXJ5ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIG1lcmdlID0gcmVxdWlyZSgnLi9tZXJnZS5qcycpO1xuXG4gIHZhciBJbmRleEJyb3dzZXIgPSByZXF1aXJlKCcuL0luZGV4QnJvd3NlcicpO1xuXG4gIHZhciBicm93c2VyID0gbmV3IEluZGV4QnJvd3NlcigpO1xuICB2YXIgY2xpZW50ID0gdGhpcy5hcztcbiAgdmFyIGluZGV4ID0gdGhpcztcbiAgdmFyIHBhcmFtcyA9IGNsaWVudC5fZ2V0U2VhcmNoUGFyYW1zKFxuICAgIG1lcmdlKHt9LCBxdWVyeVBhcmFtZXRlcnMgfHwge30sIHtcbiAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgIH0pLCAnJ1xuICApO1xuXG4gIC8vIHN0YXJ0IGJyb3dzaW5nXG4gIGJyb3dzZUxvb3AoKTtcblxuICBmdW5jdGlvbiBicm93c2VMb29wKGN1cnNvcikge1xuICAgIGlmIChicm93c2VyLl9zdG9wcGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHF1ZXJ5U3RyaW5nO1xuXG4gICAgaWYgKGN1cnNvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBxdWVyeVN0cmluZyA9ICdjdXJzb3I9JyArIGVuY29kZVVSSUNvbXBvbmVudChjdXJzb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBxdWVyeVN0cmluZyA9IHBhcmFtcztcbiAgICB9XG5cbiAgICBjbGllbnQuX2pzb25SZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXguaW5kZXhOYW1lKSArICcvYnJvd3NlPycgKyBxdWVyeVN0cmluZyxcbiAgICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgICBjYWxsYmFjazogYnJvd3NlQ2FsbGJhY2tcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJyb3dzZUNhbGxiYWNrKGVyciwgY29udGVudCkge1xuICAgIGlmIChicm93c2VyLl9zdG9wcGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVycikge1xuICAgICAgYnJvd3Nlci5fZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBicm93c2VyLl9yZXN1bHQoY29udGVudCk7XG5cbiAgICAvLyBubyBjdXJzb3IgbWVhbnMgd2UgYXJlIGZpbmlzaGVkIGJyb3dzaW5nXG4gICAgaWYgKGNvbnRlbnQuY3Vyc29yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGJyb3dzZXIuX2VuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJyb3dzZUxvb3AoY29udGVudC5jdXJzb3IpO1xuICB9XG5cbiAgcmV0dXJuIGJyb3dzZXI7XG59O1xuXG4vKlxuKiBHZXQgYSBUeXBlYWhlYWQuanMgYWRhcHRlclxuKiBAcGFyYW0gc2VhcmNoUGFyYW1zIGNvbnRhaW5zIGFuIG9iamVjdCB3aXRoIHF1ZXJ5IHBhcmFtZXRlcnMgKHNlZSBzZWFyY2ggZm9yIGRldGFpbHMpXG4qL1xuSW5kZXgucHJvdG90eXBlLnR0QWRhcHRlciA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBmdW5jdGlvbiB0dEFkYXB0ZXIocXVlcnksIHN5bmNDYiwgYXN5bmNDYikge1xuICAgIHZhciBjYjtcblxuICAgIGlmICh0eXBlb2YgYXN5bmNDYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gdHlwZWFoZWFkIDAuMTFcbiAgICAgIGNiID0gYXN5bmNDYjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcHJlIHR5cGVhaGVhZCAwLjExXG4gICAgICBjYiA9IHN5bmNDYjtcbiAgICB9XG5cbiAgICBzZWxmLnNlYXJjaChxdWVyeSwgcGFyYW1zLCBmdW5jdGlvbiBzZWFyY2hEb25lKGVyciwgY29udGVudCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYihlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNiKGNvbnRlbnQuaGl0cyk7XG4gICAgfSk7XG4gIH07XG59O1xuXG4vKlxuKiBXYWl0IHRoZSBwdWJsaWNhdGlvbiBvZiBhIHRhc2sgb24gdGhlIHNlcnZlci5cbiogQWxsIHNlcnZlciB0YXNrIGFyZSBhc3luY2hyb25vdXMgYW5kIHlvdSBjYW4gY2hlY2sgd2l0aCB0aGlzIG1ldGhvZCB0aGF0IHRoZSB0YXNrIGlzIHB1Ymxpc2hlZC5cbipcbiogQHBhcmFtIHRhc2tJRCB0aGUgaWQgb2YgdGhlIHRhc2sgcmV0dXJuZWQgYnkgc2VydmVyXG4qIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIHdpdGggd2l0aCB0d28gYXJndW1lbnRzOlxuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyB0aGUgbGlzdCBvZiByZXN1bHRzXG4qL1xuSW5kZXgucHJvdG90eXBlLndhaXRUYXNrID0gZnVuY3Rpb24odGFza0lELCBjYWxsYmFjaykge1xuICAvLyB3YWl0IG1pbmltdW0gMTAwbXMgYmVmb3JlIHJldHJ5aW5nXG4gIHZhciBiYXNlRGVsYXkgPSAxMDA7XG4gIC8vIHdhaXQgbWF4aW11bSA1cyBiZWZvcmUgcmV0cnlpbmdcbiAgdmFyIG1heERlbGF5ID0gNTAwMDtcbiAgdmFyIGxvb3AgPSAwO1xuXG4gIC8vIHdhaXRUYXNrKCkgbXVzdCBiZSBoYW5kbGVkIGRpZmZlcmVudGx5IGZyb20gb3RoZXIgbWV0aG9kcyxcbiAgLy8gaXQncyBhIHJlY3Vyc2l2ZSBtZXRob2QgdXNpbmcgYSB0aW1lb3V0XG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHZhciBjbGllbnQgPSBpbmRleE9iai5hcztcblxuICB2YXIgcHJvbWlzZSA9IHJldHJ5TG9vcCgpO1xuXG4gIGZ1bmN0aW9uIHJldHJ5TG9vcCgpIHtcbiAgICByZXR1cm4gY2xpZW50Ll9qc29uUmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy90YXNrLycgKyB0YXNrSURcbiAgICB9KS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MoY29udGVudCkge1xuICAgICAgbG9vcCsrO1xuICAgICAgdmFyIGRlbGF5ID0gYmFzZURlbGF5ICogbG9vcCAqIGxvb3A7XG4gICAgICBpZiAoZGVsYXkgPiBtYXhEZWxheSkge1xuICAgICAgICBkZWxheSA9IG1heERlbGF5O1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGVudC5zdGF0dXMgIT09ICdwdWJsaXNoZWQnKSB7XG4gICAgICAgIHJldHVybiBjbGllbnQuX3Byb21pc2UuZGVsYXkoZGVsYXkpLnRoZW4ocmV0cnlMb29wKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBwcm9taXNlLnRoZW4oc3VjY2Vzc0NiLCBmYWlsdXJlQ2IpO1xuXG4gIGZ1bmN0aW9uIHN1Y2Nlc3NDYihjb250ZW50KSB7XG4gICAgZXhpdFByb21pc2UoZnVuY3Rpb24gZXhpdCgpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGNvbnRlbnQpO1xuICAgIH0sIGNsaWVudC5fc2V0VGltZW91dCB8fCBzZXRUaW1lb3V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWx1cmVDYihlcnIpIHtcbiAgICBleGl0UHJvbWlzZShmdW5jdGlvbiBleGl0KCkge1xuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9LCBjbGllbnQuX3NldFRpbWVvdXQgfHwgc2V0VGltZW91dCk7XG4gIH1cbn07XG5cbi8qXG4qIFRoaXMgZnVuY3Rpb24gZGVsZXRlcyB0aGUgaW5kZXggY29udGVudC4gU2V0dGluZ3MgYW5kIGluZGV4IHNwZWNpZmljIEFQSSBrZXlzIGFyZSBrZXB0IHVudG91Y2hlZC5cbipcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2V0dGluZ3Mgb2JqZWN0IG9yIHRoZSBlcnJvciBtZXNzYWdlIGlmIGEgZmFpbHVyZSBvY2N1cmVkXG4qL1xuSW5kZXgucHJvdG90eXBlLmNsZWFySW5kZXggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy9jbGVhcicsXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogR2V0IHNldHRpbmdzIG9mIHRoaXMgaW5kZXhcbipcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2V0dGluZ3Mgb2JqZWN0IG9yIHRoZSBlcnJvciBtZXNzYWdlIGlmIGEgZmFpbHVyZSBvY2N1cmVkXG4qL1xuSW5kZXgucHJvdG90eXBlLmdldFNldHRpbmdzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy9zZXR0aW5ncz9nZXRWZXJzaW9uPTInLFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuSW5kZXgucHJvdG90eXBlLnNlYXJjaFN5bm9ueW1zID0gZnVuY3Rpb24ocGFyYW1zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gcGFyYW1zO1xuICAgIHBhcmFtcyA9IHt9O1xuICB9IGVsc2UgaWYgKHBhcmFtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcGFyYW1zID0ge307XG4gIH1cblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmluZGV4TmFtZSkgKyAnL3N5bm9ueW1zL3NlYXJjaCcsXG4gICAgYm9keTogcGFyYW1zLFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuSW5kZXgucHJvdG90eXBlLnNhdmVTeW5vbnltID0gZnVuY3Rpb24oc3lub255bSwgb3B0cywgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfSBlbHNlIGlmIChvcHRzID09PSB1bmRlZmluZWQpIHtcbiAgICBvcHRzID0ge307XG4gIH1cblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvc3lub255bXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChzeW5vbnltLm9iamVjdElEKSArXG4gICAgICAnP2ZvcndhcmRUb1NsYXZlcz0nICsgKG9wdHMuZm9yd2FyZFRvU2xhdmVzID8gJ3RydWUnIDogJ2ZhbHNlJyksXG4gICAgYm9keTogc3lub255bSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5JbmRleC5wcm90b3R5cGUuZ2V0U3lub255bSA9IGZ1bmN0aW9uKG9iamVjdElELCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvc3lub255bXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChvYmplY3RJRCksXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5JbmRleC5wcm90b3R5cGUuZGVsZXRlU3lub255bSA9IGZ1bmN0aW9uKG9iamVjdElELCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9IGVsc2UgaWYgKG9wdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9zeW5vbnltcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9iamVjdElEKSArXG4gICAgICAnP2ZvcndhcmRUb1NsYXZlcz0nICsgKG9wdHMuZm9yd2FyZFRvU2xhdmVzID8gJ3RydWUnIDogJ2ZhbHNlJyksXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuSW5kZXgucHJvdG90eXBlLmNsZWFyU3lub255bXMgPSBmdW5jdGlvbihvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9IGVsc2UgaWYgKG9wdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvc3lub255bXMvY2xlYXInICtcbiAgICAgICc/Zm9yd2FyZFRvU2xhdmVzPScgKyAob3B0cy5mb3J3YXJkVG9TbGF2ZXMgPyAndHJ1ZScgOiAnZmFsc2UnKSxcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5JbmRleC5wcm90b3R5cGUuYmF0Y2hTeW5vbnltcyA9IGZ1bmN0aW9uKHN5bm9ueW1zLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9IGVsc2UgaWYgKG9wdHMgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcvc3lub255bXMvYmF0Y2gnICtcbiAgICAgICc/Zm9yd2FyZFRvU2xhdmVzPScgKyAob3B0cy5mb3J3YXJkVG9TbGF2ZXMgPyAndHJ1ZScgOiAnZmFsc2UnKSArXG4gICAgICAnJnJlcGxhY2VFeGlzdGluZ1N5bm9ueW1zPScgKyAob3B0cy5yZXBsYWNlRXhpc3RpbmdTeW5vbnltcyA/ICd0cnVlJyA6ICdmYWxzZScpLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGJvZHk6IHN5bm9ueW1zLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIFNldCBzZXR0aW5ncyBmb3IgdGhpcyBpbmRleFxuKlxuKiBAcGFyYW0gc2V0dGlnbnMgdGhlIHNldHRpbmdzIG9iamVjdCB0aGF0IGNhbiBjb250YWlucyA6XG4qIC0gbWluV29yZFNpemVmb3IxVHlwbzogKGludGVnZXIpIHRoZSBtaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIGFjY2VwdCBvbmUgdHlwbyAoZGVmYXVsdCA9IDMpLlxuKiAtIG1pbldvcmRTaXplZm9yMlR5cG9zOiAoaW50ZWdlcikgdGhlIG1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdG8gYWNjZXB0IHR3byB0eXBvcyAoZGVmYXVsdCA9IDcpLlxuKiAtIGhpdHNQZXJQYWdlOiAoaW50ZWdlcikgdGhlIG51bWJlciBvZiBoaXRzIHBlciBwYWdlIChkZWZhdWx0ID0gMTApLlxuKiAtIGF0dHJpYnV0ZXNUb1JldHJpZXZlOiAoYXJyYXkgb2Ygc3RyaW5ncykgZGVmYXVsdCBsaXN0IG9mIGF0dHJpYnV0ZXMgdG8gcmV0cmlldmUgaW4gb2JqZWN0cy5cbiogICBJZiBzZXQgdG8gbnVsbCwgYWxsIGF0dHJpYnV0ZXMgYXJlIHJldHJpZXZlZC5cbiogLSBhdHRyaWJ1dGVzVG9IaWdobGlnaHQ6IChhcnJheSBvZiBzdHJpbmdzKSBkZWZhdWx0IGxpc3Qgb2YgYXR0cmlidXRlcyB0byBoaWdobGlnaHQuXG4qICAgSWYgc2V0IHRvIG51bGwsIGFsbCBpbmRleGVkIGF0dHJpYnV0ZXMgYXJlIGhpZ2hsaWdodGVkLlxuKiAtIGF0dHJpYnV0ZXNUb1NuaXBwZXQqKjogKGFycmF5IG9mIHN0cmluZ3MpIGRlZmF1bHQgbGlzdCBvZiBhdHRyaWJ1dGVzIHRvIHNuaXBwZXQgYWxvbmdzaWRlIHRoZSBudW1iZXJcbiogb2Ygd29yZHMgdG8gcmV0dXJuIChzeW50YXggaXMgYXR0cmlidXRlTmFtZTpuYldvcmRzKS5cbiogICBCeSBkZWZhdWx0IG5vIHNuaXBwZXQgaXMgY29tcHV0ZWQuIElmIHNldCB0byBudWxsLCBubyBzbmlwcGV0IGlzIGNvbXB1dGVkLlxuKiAtIGF0dHJpYnV0ZXNUb0luZGV4OiAoYXJyYXkgb2Ygc3RyaW5ncykgdGhlIGxpc3Qgb2YgZmllbGRzIHlvdSB3YW50IHRvIGluZGV4LlxuKiAgIElmIHNldCB0byBudWxsLCBhbGwgdGV4dHVhbCBhbmQgbnVtZXJpY2FsIGF0dHJpYnV0ZXMgb2YgeW91ciBvYmplY3RzIGFyZSBpbmRleGVkLFxuKiAgIGJ1dCB5b3Ugc2hvdWxkIHVwZGF0ZSBpdCB0byBnZXQgb3B0aW1hbCByZXN1bHRzLlxuKiAgIFRoaXMgcGFyYW1ldGVyIGhhcyB0d28gaW1wb3J0YW50IHVzZXM6XG4qICAgICAtIExpbWl0IHRoZSBhdHRyaWJ1dGVzIHRvIGluZGV4OiBGb3IgZXhhbXBsZSBpZiB5b3Ugc3RvcmUgYSBiaW5hcnkgaW1hZ2UgaW4gYmFzZTY0LFxuKiAgICAgeW91IHdhbnQgdG8gc3RvcmUgaXQgYW5kIGJlIGFibGUgdG9cbiogICAgICAgcmV0cmlldmUgaXQgYnV0IHlvdSBkb24ndCB3YW50IHRvIHNlYXJjaCBpbiB0aGUgYmFzZTY0IHN0cmluZy5cbiogICAgIC0gQ29udHJvbCBwYXJ0IG9mIHRoZSByYW5raW5nKjogKHNlZSB0aGUgcmFua2luZyBwYXJhbWV0ZXIgZm9yIGZ1bGwgZXhwbGFuYXRpb24pXG4qICAgICBNYXRjaGVzIGluIGF0dHJpYnV0ZXMgYXQgdGhlIGJlZ2lubmluZyBvZlxuKiAgICAgICB0aGUgbGlzdCB3aWxsIGJlIGNvbnNpZGVyZWQgbW9yZSBpbXBvcnRhbnQgdGhhbiBtYXRjaGVzIGluIGF0dHJpYnV0ZXMgZnVydGhlciBkb3duIHRoZSBsaXN0LlxuKiAgICAgICBJbiBvbmUgYXR0cmlidXRlLCBtYXRjaGluZyB0ZXh0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGF0dHJpYnV0ZSB3aWxsIGJlXG4qICAgICAgIGNvbnNpZGVyZWQgbW9yZSBpbXBvcnRhbnQgdGhhbiB0ZXh0IGFmdGVyLCB5b3UgY2FuIGRpc2FibGVcbiogICAgICAgdGhpcyBiZWhhdmlvciBpZiB5b3UgYWRkIHlvdXIgYXR0cmlidXRlIGluc2lkZSBgdW5vcmRlcmVkKEF0dHJpYnV0ZU5hbWUpYCxcbiogICAgICAgZm9yIGV4YW1wbGUgYXR0cmlidXRlc1RvSW5kZXg6IFtcInRpdGxlXCIsIFwidW5vcmRlcmVkKHRleHQpXCJdLlxuKiAtIGF0dHJpYnV0ZXNGb3JGYWNldGluZzogKGFycmF5IG9mIHN0cmluZ3MpIFRoZSBsaXN0IG9mIGZpZWxkcyB5b3Ugd2FudCB0byB1c2UgZm9yIGZhY2V0aW5nLlxuKiAgIEFsbCBzdHJpbmdzIGluIHRoZSBhdHRyaWJ1dGUgc2VsZWN0ZWQgZm9yIGZhY2V0aW5nIGFyZSBleHRyYWN0ZWQgYW5kIGFkZGVkIGFzIGEgZmFjZXQuXG4qICAgSWYgc2V0IHRvIG51bGwsIG5vIGF0dHJpYnV0ZSBpcyB1c2VkIGZvciBmYWNldGluZy5cbiogLSBhdHRyaWJ1dGVGb3JEaXN0aW5jdDogKHN0cmluZykgVGhlIGF0dHJpYnV0ZSBuYW1lIHVzZWQgZm9yIHRoZSBEaXN0aW5jdCBmZWF0dXJlLlxuKiBUaGlzIGZlYXR1cmUgaXMgc2ltaWxhciB0byB0aGUgU1FMIFwiZGlzdGluY3RcIiBrZXl3b3JkOiB3aGVuIGVuYWJsZWRcbiogICBpbiBxdWVyeSB3aXRoIHRoZSBkaXN0aW5jdD0xIHBhcmFtZXRlciwgYWxsIGhpdHMgY29udGFpbmluZyBhIGR1cGxpY2F0ZVxuKiAgIHZhbHVlIGZvciB0aGlzIGF0dHJpYnV0ZSBhcmUgcmVtb3ZlZCBmcm9tIHJlc3VsdHMuXG4qICAgRm9yIGV4YW1wbGUsIGlmIHRoZSBjaG9zZW4gYXR0cmlidXRlIGlzIHNob3dfbmFtZSBhbmQgc2V2ZXJhbCBoaXRzIGhhdmVcbiogICB0aGUgc2FtZSB2YWx1ZSBmb3Igc2hvd19uYW1lLCB0aGVuIG9ubHkgdGhlIGJlc3Qgb25lIGlzIGtlcHQgYW5kIG90aGVycyBhcmUgcmVtb3ZlZC5cbiogLSByYW5raW5nOiAoYXJyYXkgb2Ygc3RyaW5ncykgY29udHJvbHMgdGhlIHdheSByZXN1bHRzIGFyZSBzb3J0ZWQuXG4qICAgV2UgaGF2ZSBzaXggYXZhaWxhYmxlIGNyaXRlcmlhOlxuKiAgICAtIHR5cG86IHNvcnQgYWNjb3JkaW5nIHRvIG51bWJlciBvZiB0eXBvcyxcbiogICAgLSBnZW86IHNvcnQgYWNjb3JkaW5nIHRvIGRlY3JlYXNzaW5nIGRpc3RhbmNlIHdoZW4gcGVyZm9ybWluZyBhIGdlby1sb2NhdGlvbiBiYXNlZCBzZWFyY2gsXG4qICAgIC0gcHJveGltaXR5OiBzb3J0IGFjY29yZGluZyB0byB0aGUgcHJveGltaXR5IG9mIHF1ZXJ5IHdvcmRzIGluIGhpdHMsXG4qICAgIC0gYXR0cmlidXRlOiBzb3J0IGFjY29yZGluZyB0byB0aGUgb3JkZXIgb2YgYXR0cmlidXRlcyBkZWZpbmVkIGJ5IGF0dHJpYnV0ZXNUb0luZGV4LFxuKiAgICAtIGV4YWN0OlxuKiAgICAgICAgLSBpZiB0aGUgdXNlciBxdWVyeSBjb250YWlucyBvbmUgd29yZDogc29ydCBvYmplY3RzIGhhdmluZyBhbiBhdHRyaWJ1dGVcbiogICAgICAgIHRoYXQgaXMgZXhhY3RseSB0aGUgcXVlcnkgd29yZCBiZWZvcmUgb3RoZXJzLlxuKiAgICAgICAgICBGb3IgZXhhbXBsZSBpZiB5b3Ugc2VhcmNoIGZvciB0aGUgXCJWXCIgVFYgc2hvdywgeW91IHdhbnQgdG8gZmluZCBpdFxuKiAgICAgICAgICB3aXRoIHRoZSBcIlZcIiBxdWVyeSBhbmQgYXZvaWQgdG8gaGF2ZSBhbGwgcG9wdWxhciBUVlxuKiAgICAgICAgICBzaG93IHN0YXJ0aW5nIGJ5IHRoZSB2IGxldHRlciBiZWZvcmUgaXQuXG4qICAgICAgICAtIGlmIHRoZSB1c2VyIHF1ZXJ5IGNvbnRhaW5zIG11bHRpcGxlIHdvcmRzOiBzb3J0IGFjY29yZGluZyB0byB0aGVcbiogICAgICAgIG51bWJlciBvZiB3b3JkcyB0aGF0IG1hdGNoZWQgZXhhY3RseSAoYW5kIG5vdCBhcyBhIHByZWZpeCkuXG4qICAgIC0gY3VzdG9tOiBzb3J0IGFjY29yZGluZyB0byBhIHVzZXIgZGVmaW5lZCBmb3JtdWxhIHNldCBpbiAqKmN1c3RvbVJhbmtpbmcqKiBhdHRyaWJ1dGUuXG4qICAgVGhlIHN0YW5kYXJkIG9yZGVyIGlzIFtcInR5cG9cIiwgXCJnZW9cIiwgXCJwcm94aW1pdHlcIiwgXCJhdHRyaWJ1dGVcIiwgXCJleGFjdFwiLCBcImN1c3RvbVwiXVxuKiAtIGN1c3RvbVJhbmtpbmc6IChhcnJheSBvZiBzdHJpbmdzKSBsZXRzIHlvdSBzcGVjaWZ5IHBhcnQgb2YgdGhlIHJhbmtpbmcuXG4qICAgVGhlIHN5bnRheCBvZiB0aGlzIGNvbmRpdGlvbiBpcyBhbiBhcnJheSBvZiBzdHJpbmdzIGNvbnRhaW5pbmcgYXR0cmlidXRlc1xuKiAgIHByZWZpeGVkIGJ5IGFzYyAoYXNjZW5kaW5nIG9yZGVyKSBvciBkZXNjIChkZXNjZW5kaW5nIG9yZGVyKSBvcGVyYXRvci5cbiogICBGb3IgZXhhbXBsZSBgXCJjdXN0b21SYW5raW5nXCIgPT4gW1wiZGVzYyhwb3B1bGF0aW9uKVwiLCBcImFzYyhuYW1lKVwiXWBcbiogLSBxdWVyeVR5cGU6IFNlbGVjdCBob3cgdGhlIHF1ZXJ5IHdvcmRzIGFyZSBpbnRlcnByZXRlZCwgaXQgY2FuIGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlOlxuKiAgIC0gcHJlZml4QWxsOiBhbGwgcXVlcnkgd29yZHMgYXJlIGludGVycHJldGVkIGFzIHByZWZpeGVzLFxuKiAgIC0gcHJlZml4TGFzdDogb25seSB0aGUgbGFzdCB3b3JkIGlzIGludGVycHJldGVkIGFzIGEgcHJlZml4IChkZWZhdWx0IGJlaGF2aW9yKSxcbiogICAtIHByZWZpeE5vbmU6IG5vIHF1ZXJ5IHdvcmQgaXMgaW50ZXJwcmV0ZWQgYXMgYSBwcmVmaXguIFRoaXMgb3B0aW9uIGlzIG5vdCByZWNvbW1lbmRlZC5cbiogLSBoaWdobGlnaHRQcmVUYWc6IChzdHJpbmcpIFNwZWNpZnkgdGhlIHN0cmluZyB0aGF0IGlzIGluc2VydGVkIGJlZm9yZVxuKiB0aGUgaGlnaGxpZ2h0ZWQgcGFydHMgaW4gdGhlIHF1ZXJ5IHJlc3VsdCAoZGVmYXVsdCB0byBcIjxlbT5cIikuXG4qIC0gaGlnaGxpZ2h0UG9zdFRhZzogKHN0cmluZykgU3BlY2lmeSB0aGUgc3RyaW5nIHRoYXQgaXMgaW5zZXJ0ZWQgYWZ0ZXJcbiogdGhlIGhpZ2hsaWdodGVkIHBhcnRzIGluIHRoZSBxdWVyeSByZXN1bHQgKGRlZmF1bHQgdG8gXCI8L2VtPlwiKS5cbiogLSBvcHRpb25hbFdvcmRzOiAoYXJyYXkgb2Ygc3RyaW5ncykgU3BlY2lmeSBhIGxpc3Qgb2Ygd29yZHMgdGhhdCBzaG91bGRcbiogYmUgY29uc2lkZXJlZCBhcyBvcHRpb25hbCB3aGVuIGZvdW5kIGluIHRoZSBxdWVyeS5cbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciBvciB0aGUgZXJyb3IgbWVzc2FnZSBpZiBhIGZhaWx1cmUgb2NjdXJlZFxuKi9cbkluZGV4LnByb3RvdHlwZS5zZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBvcHRzLCBjYWxsYmFjaykge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH1cblxuICB2YXIgZm9yd2FyZFRvU2xhdmVzID0gb3B0cy5mb3J3YXJkVG9TbGF2ZXMgfHwgZmFsc2U7XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQVVQnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudChpbmRleE9iai5pbmRleE5hbWUpICsgJy9zZXR0aW5ncz9mb3J3YXJkVG9TbGF2ZXM9J1xuICAgICAgKyAoZm9yd2FyZFRvU2xhdmVzID8gJ3RydWUnIDogJ2ZhbHNlJyksXG4gICAgaG9zdFR5cGU6ICd3cml0ZScsXG4gICAgYm9keTogc2V0dGluZ3MsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogTGlzdCBhbGwgZXhpc3RpbmcgdXNlciBrZXlzIGFzc29jaWF0ZWQgdG8gdGhpcyBpbmRleFxuKlxuKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4qL1xuSW5kZXgucHJvdG90eXBlLmxpc3RVc2VyS2V5cyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcva2V5cycsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBHZXQgQUNMIG9mIGEgdXNlciBrZXkgYXNzb2NpYXRlZCB0byB0aGlzIGluZGV4XG4qXG4qIEBwYXJhbSBrZXlcbiogQHBhcmFtIGNhbGxiYWNrIHRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuKiAgZXJyb3I6IG51bGwgb3IgRXJyb3IoJ21lc3NhZ2UnKVxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB1c2VyIGtleXMgbGlzdFxuKi9cbkluZGV4LnByb3RvdHlwZS5nZXRVc2VyS2V5QUNMID0gZnVuY3Rpb24oa2V5LCBjYWxsYmFjaykge1xuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2tleXMvJyArIGtleSxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIERlbGV0ZSBhbiBleGlzdGluZyB1c2VyIGtleSBhc3NvY2lhdGVkIHRvIHRoaXMgaW5kZXhcbipcbiogQHBhcmFtIGtleVxuKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4qL1xuSW5kZXgucHJvdG90eXBlLmRlbGV0ZVVzZXJLZXkgPSBmdW5jdGlvbihrZXksIGNhbGxiYWNrKSB7XG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcva2V5cy8nICsga2V5LFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIEFkZCBhIG5ldyBBUEkga2V5IHRvIHRoaXMgaW5kZXhcbipcbiogQHBhcmFtIHtzdHJpbmdbXX0gYWNscyAtIFRoZSBsaXN0IG9mIEFDTCBmb3IgdGhpcyBrZXkuIERlZmluZWQgYnkgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0XG4qICAgY2FuIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuKiAgICAgLSBzZWFyY2g6IGFsbG93IHRvIHNlYXJjaCAoaHR0cHMgYW5kIGh0dHApXG4qICAgICAtIGFkZE9iamVjdDogYWxsb3dzIHRvIGFkZC91cGRhdGUgYW4gb2JqZWN0IGluIHRoZSBpbmRleCAoaHR0cHMgb25seSlcbiogICAgIC0gZGVsZXRlT2JqZWN0IDogYWxsb3dzIHRvIGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3QgKGh0dHBzIG9ubHkpXG4qICAgICAtIGRlbGV0ZUluZGV4IDogYWxsb3dzIHRvIGRlbGV0ZSBpbmRleCBjb250ZW50IChodHRwcyBvbmx5KVxuKiAgICAgLSBzZXR0aW5ncyA6IGFsbG93cyB0byBnZXQgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4qICAgICAtIGVkaXRTZXR0aW5ncyA6IGFsbG93cyB0byBjaGFuZ2UgaW5kZXggc2V0dGluZ3MgKGh0dHBzIG9ubHkpXG4qIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXSAtIE9wdGlvbm5hbCBwYXJhbWV0ZXJzIHRvIHNldCBmb3IgdGhlIGtleVxuKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLnZhbGlkaXR5IC0gTnVtYmVyIG9mIHNlY29uZHMgYWZ0ZXIgd2hpY2ggdGhlIGtleSB3aWxsXG4qIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCAoMCBtZWFucyBubyB0aW1lIGxpbWl0IGZvciB0aGlzIGtleSlcbiogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyIC0gTnVtYmVyIG9mIEFQSSBjYWxscyBhbGxvd2VkIGZyb20gYW4gSVAgYWRkcmVzcyBwZXIgaG91clxuKiBAcGFyYW0ge251bWJlcn0gcGFyYW1zLm1heEhpdHNQZXJRdWVyeSAtIE51bWJlciBvZiBoaXRzIHRoaXMgQVBJIGtleSBjYW4gcmV0cmlldmUgaW4gb25lIGNhbGxcbiogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcy5kZXNjcmlwdGlvbiAtIEEgZGVzY3JpcHRpb24gZm9yIHlvdXIga2V5XG4qIEBwYXJhbSB7c3RyaW5nW119IHBhcmFtcy5yZWZlcmVycyAtIEEgbGlzdCBvZiBhdXRob3JpemVkIHJlZmVyZXJzXG4qIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMucXVlcnlQYXJhbWV0ZXJzIC0gRm9yY2UgdGhlIGtleSB0byB1c2Ugc3BlY2lmaWMgcXVlcnkgcGFyYW1ldGVyc1xuKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSByZXN1bHQgY2FsbGJhY2sgY2FsbGVkIHdpdGggdHdvIGFyZ3VtZW50c1xuKiAgIGVycm9yOiBudWxsIG9yIEVycm9yKCdtZXNzYWdlJylcbiogICBjb250ZW50OiB0aGUgc2VydmVyIGFuc3dlciB3aXRoIHVzZXIga2V5cyBsaXN0XG4qIEByZXR1cm4ge1Byb21pc2V8dW5kZWZpbmVkfSBSZXR1cm5zIGEgcHJvbWlzZSBpZiBubyBjYWxsYmFjayBnaXZlblxuKiBAZXhhbXBsZVxuKiBpbmRleC5hZGRVc2VyS2V5KFsnc2VhcmNoJ10sIHtcbiogICB2YWxpZGl0eTogMzAwLFxuKiAgIG1heFF1ZXJpZXNQZXJJUFBlckhvdXI6IDIwMDAsXG4qICAgbWF4SGl0c1BlclF1ZXJ5OiAzLFxuKiAgIGRlc2NyaXB0aW9uOiAnRWF0IHRocmVlIGZydWl0cycsXG4qICAgcmVmZXJlcnM6IFsnKi5hbGdvbGlhLmNvbSddLFxuKiAgIHF1ZXJ5UGFyYW1ldGVyczoge1xuKiAgICAgdGFnRmlsdGVyczogWydwdWJsaWMnXSxcbiogICB9XG4qIH0pXG4qIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9yZXN0X2FwaSNBZGRJbmRleEtleXxBbGdvbGlhIFJFU1QgQVBJIERvY3VtZW50YXRpb259XG4qL1xuSW5kZXgucHJvdG90eXBlLmFkZFVzZXJLZXkgPSBmdW5jdGlvbihhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGluZGV4LmFkZFVzZXJLZXkoYXJyYXlPZkFjbHNbLCBwYXJhbXMsIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShhY2xzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfVxuXG4gIHZhciBwb3N0T2JqID0ge1xuICAgIGFjbDogYWNsc1xuICB9O1xuXG4gIGlmIChwYXJhbXMpIHtcbiAgICBwb3N0T2JqLnZhbGlkaXR5ID0gcGFyYW1zLnZhbGlkaXR5O1xuICAgIHBvc3RPYmoubWF4UXVlcmllc1BlcklQUGVySG91ciA9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyO1xuICAgIHBvc3RPYmoubWF4SGl0c1BlclF1ZXJ5ID0gcGFyYW1zLm1heEhpdHNQZXJRdWVyeTtcbiAgICBwb3N0T2JqLmRlc2NyaXB0aW9uID0gcGFyYW1zLmRlc2NyaXB0aW9uO1xuXG4gICAgaWYgKHBhcmFtcy5xdWVyeVBhcmFtZXRlcnMpIHtcbiAgICAgIHBvc3RPYmoucXVlcnlQYXJhbWV0ZXJzID0gdGhpcy5hcy5fZ2V0U2VhcmNoUGFyYW1zKHBhcmFtcy5xdWVyeVBhcmFtZXRlcnMsICcnKTtcbiAgICB9XG5cbiAgICBwb3N0T2JqLnJlZmVyZXJzID0gcGFyYW1zLnJlZmVyZXJzO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9rZXlzJyxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAnd3JpdGUnLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qKlxuKiBBZGQgYW4gZXhpc3RpbmcgdXNlciBrZXkgYXNzb2NpYXRlZCB0byB0aGlzIGluZGV4XG4qIEBkZXByZWNhdGVkIHVzZSBpbmRleC5hZGRVc2VyS2V5KClcbiovXG5JbmRleC5wcm90b3R5cGUuYWRkVXNlcktleVdpdGhWYWxpZGl0eSA9IGRlcHJlY2F0ZShmdW5jdGlvbiBkZXByZWNhdGVkQWRkVXNlcktleVdpdGhWYWxpZGl0eShhY2xzLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLmFkZFVzZXJLZXkoYWNscywgcGFyYW1zLCBjYWxsYmFjayk7XG59LCBkZXByZWNhdGVkTWVzc2FnZSgnaW5kZXguYWRkVXNlcktleVdpdGhWYWxpZGl0eSgpJywgJ2luZGV4LmFkZFVzZXJLZXkoKScpKTtcblxuLyoqXG4qIFVwZGF0ZSBhbiBleGlzdGluZyBBUEkga2V5IG9mIHRoaXMgaW5kZXhcbiogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gdXBkYXRlXG4qIEBwYXJhbSB7c3RyaW5nW119IGFjbHMgLSBUaGUgbGlzdCBvZiBBQ0wgZm9yIHRoaXMga2V5LiBEZWZpbmVkIGJ5IGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdFxuKiAgIGNhbiBjb250YWlucyB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiogICAgIC0gc2VhcmNoOiBhbGxvdyB0byBzZWFyY2ggKGh0dHBzIGFuZCBodHRwKVxuKiAgICAgLSBhZGRPYmplY3Q6IGFsbG93cyB0byBhZGQvdXBkYXRlIGFuIG9iamVjdCBpbiB0aGUgaW5kZXggKGh0dHBzIG9ubHkpXG4qICAgICAtIGRlbGV0ZU9iamVjdCA6IGFsbG93cyB0byBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0IChodHRwcyBvbmx5KVxuKiAgICAgLSBkZWxldGVJbmRleCA6IGFsbG93cyB0byBkZWxldGUgaW5kZXggY29udGVudCAoaHR0cHMgb25seSlcbiogICAgIC0gc2V0dGluZ3MgOiBhbGxvd3MgdG8gZ2V0IGluZGV4IHNldHRpbmdzIChodHRwcyBvbmx5KVxuKiAgICAgLSBlZGl0U2V0dGluZ3MgOiBhbGxvd3MgdG8gY2hhbmdlIGluZGV4IHNldHRpbmdzIChodHRwcyBvbmx5KVxuKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc10gLSBPcHRpb25uYWwgcGFyYW1ldGVycyB0byBzZXQgZm9yIHRoZSBrZXlcbiogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy52YWxpZGl0eSAtIE51bWJlciBvZiBzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBrZXkgd2lsbFxuKiBiZSBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgKDAgbWVhbnMgbm8gdGltZSBsaW1pdCBmb3IgdGhpcyBrZXkpXG4qIEBwYXJhbSB7bnVtYmVyfSBwYXJhbXMubWF4UXVlcmllc1BlcklQUGVySG91ciAtIE51bWJlciBvZiBBUEkgY2FsbHMgYWxsb3dlZCBmcm9tIGFuIElQIGFkZHJlc3MgcGVyIGhvdXJcbiogQHBhcmFtIHtudW1iZXJ9IHBhcmFtcy5tYXhIaXRzUGVyUXVlcnkgLSBOdW1iZXIgb2YgaGl0cyB0aGlzIEFQSSBrZXkgY2FuIHJldHJpZXZlIGluIG9uZSBjYWxsXG4qIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMuZGVzY3JpcHRpb24gLSBBIGRlc2NyaXB0aW9uIGZvciB5b3VyIGtleVxuKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXJhbXMucmVmZXJlcnMgLSBBIGxpc3Qgb2YgYXV0aG9yaXplZCByZWZlcmVyc1xuKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zLnF1ZXJ5UGFyYW1ldGVycyAtIEZvcmNlIHRoZSBrZXkgdG8gdXNlIHNwZWNpZmljIHF1ZXJ5IHBhcmFtZXRlcnNcbiogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB1c2VyIGtleXMgbGlzdFxuKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiogQGV4YW1wbGVcbiogaW5kZXgudXBkYXRlVXNlcktleSgnQVBJS0VZJywgWydzZWFyY2gnXSwge1xuKiAgIHZhbGlkaXR5OiAzMDAsXG4qICAgbWF4UXVlcmllc1BlcklQUGVySG91cjogMjAwMCxcbiogICBtYXhIaXRzUGVyUXVlcnk6IDMsXG4qICAgZGVzY3JpcHRpb246ICdFYXQgdGhyZWUgZnJ1aXRzJyxcbiogICByZWZlcmVyczogWycqLmFsZ29saWEuY29tJ10sXG4qICAgcXVlcnlQYXJhbWV0ZXJzOiB7XG4qICAgICB0YWdGaWx0ZXJzOiBbJ3B1YmxpYyddLFxuKiAgIH1cbiogfSlcbiogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL3Jlc3RfYXBpI1VwZGF0ZUluZGV4S2V5fEFsZ29saWEgUkVTVCBBUEkgRG9jdW1lbnRhdGlvbn1cbiovXG5JbmRleC5wcm90b3R5cGUudXBkYXRlVXNlcktleSA9IGZ1bmN0aW9uKGtleSwgYWNscywgcGFyYW1zLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC51cGRhdGVVc2VyS2V5KGtleSwgYXJyYXlPZkFjbHNbLCBwYXJhbXMsIGNhbGxiYWNrXSknO1xuXG4gIGlmICghaXNBcnJheShhY2xzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcih1c2FnZSk7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiB8fCB0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgcGFyYW1zID0gbnVsbDtcbiAgfVxuXG4gIHZhciBwdXRPYmogPSB7XG4gICAgYWNsOiBhY2xzXG4gIH07XG5cbiAgaWYgKHBhcmFtcykge1xuICAgIHB1dE9iai52YWxpZGl0eSA9IHBhcmFtcy52YWxpZGl0eTtcbiAgICBwdXRPYmoubWF4UXVlcmllc1BlcklQUGVySG91ciA9IHBhcmFtcy5tYXhRdWVyaWVzUGVySVBQZXJIb3VyO1xuICAgIHB1dE9iai5tYXhIaXRzUGVyUXVlcnkgPSBwYXJhbXMubWF4SGl0c1BlclF1ZXJ5O1xuICAgIHB1dE9iai5kZXNjcmlwdGlvbiA9IHBhcmFtcy5kZXNjcmlwdGlvbjtcblxuICAgIGlmIChwYXJhbXMucXVlcnlQYXJhbWV0ZXJzKSB7XG4gICAgICBwdXRPYmoucXVlcnlQYXJhbWV0ZXJzID0gdGhpcy5hcy5fZ2V0U2VhcmNoUGFyYW1zKHBhcmFtcy5xdWVyeVBhcmFtZXRlcnMsICcnKTtcbiAgICB9XG5cbiAgICBwdXRPYmoucmVmZXJlcnMgPSBwYXJhbXMucmVmZXJlcnM7XG4gIH1cblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSArICcva2V5cy8nICsga2V5LFxuICAgIGJvZHk6IHB1dE9iaixcbiAgICBob3N0VHlwZTogJ3dyaXRlJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleC5qcyIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsInZhciBidWlsZFNlYXJjaE1ldGhvZCA9IHJlcXVpcmUoJy4vYnVpbGRTZWFyY2hNZXRob2QuanMnKTtcbnZhciBkZXByZWNhdGUgPSByZXF1aXJlKCcuL2RlcHJlY2F0ZS5qcycpO1xudmFyIGRlcHJlY2F0ZWRNZXNzYWdlID0gcmVxdWlyZSgnLi9kZXByZWNhdGVkTWVzc2FnZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4Q29yZTtcblxuLypcbiogSW5kZXggY2xhc3MgY29uc3RydWN0b3IuXG4qIFlvdSBzaG91bGQgbm90IHVzZSB0aGlzIG1ldGhvZCBkaXJlY3RseSBidXQgdXNlIGluaXRJbmRleCgpIGZ1bmN0aW9uXG4qL1xuZnVuY3Rpb24gSW5kZXhDb3JlKGFsZ29saWFzZWFyY2gsIGluZGV4TmFtZSkge1xuICB0aGlzLmluZGV4TmFtZSA9IGluZGV4TmFtZTtcbiAgdGhpcy5hcyA9IGFsZ29saWFzZWFyY2g7XG4gIHRoaXMudHlwZUFoZWFkQXJncyA9IG51bGw7XG4gIHRoaXMudHlwZUFoZWFkVmFsdWVPcHRpb24gPSBudWxsO1xuXG4gIC8vIG1ha2Ugc3VyZSBldmVyeSBpbmRleCBpbnN0YW5jZSBoYXMgaXQncyBvd24gY2FjaGVcbiAgdGhpcy5jYWNoZSA9IHt9O1xufVxuXG4vKlxuKiBDbGVhciBhbGwgcXVlcmllcyBpbiBjYWNoZVxuKi9cbkluZGV4Q29yZS5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNhY2hlID0ge307XG59O1xuXG4vKlxuKiBTZWFyY2ggaW5zaWRlIHRoZSBpbmRleCB1c2luZyBYTUxIdHRwUmVxdWVzdCByZXF1ZXN0IChVc2luZyBhIFBPU1QgcXVlcnkgdG9cbiogbWluaW1pemUgbnVtYmVyIG9mIE9QVElPTlMgcXVlcmllczogQ3Jvc3MtT3JpZ2luIFJlc291cmNlIFNoYXJpbmcpLlxuKlxuKiBAcGFyYW0gcXVlcnkgdGhlIGZ1bGwgdGV4dCBxdWVyeVxuKiBAcGFyYW0gYXJncyAob3B0aW9uYWwpIGlmIHNldCwgY29udGFpbnMgYW4gb2JqZWN0IHdpdGggcXVlcnkgcGFyYW1ldGVyczpcbiogLSBwYWdlOiAoaW50ZWdlcikgUGFnaW5hdGlvbiBwYXJhbWV0ZXIgdXNlZCB0byBzZWxlY3QgdGhlIHBhZ2UgdG8gcmV0cmlldmUuXG4qICAgICAgICAgICAgICAgICAgIFBhZ2UgaXMgemVyby1iYXNlZCBhbmQgZGVmYXVsdHMgdG8gMC4gVGh1cyxcbiogICAgICAgICAgICAgICAgICAgdG8gcmV0cmlldmUgdGhlIDEwdGggcGFnZSB5b3UgbmVlZCB0byBzZXQgcGFnZT05XG4qIC0gaGl0c1BlclBhZ2U6IChpbnRlZ2VyKSBQYWdpbmF0aW9uIHBhcmFtZXRlciB1c2VkIHRvIHNlbGVjdCB0aGUgbnVtYmVyIG9mIGhpdHMgcGVyIHBhZ2UuIERlZmF1bHRzIHRvIDIwLlxuKiAtIGF0dHJpYnV0ZXNUb1JldHJpZXZlOiBhIHN0cmluZyB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIG9iamVjdCBhdHRyaWJ1dGVzXG4qIHlvdSB3YW50IHRvIHJldHJpZXZlIChsZXQgeW91IG1pbmltaXplIHRoZSBhbnN3ZXIgc2l6ZSkuXG4qICAgQXR0cmlidXRlcyBhcmUgc2VwYXJhdGVkIHdpdGggYSBjb21tYSAoZm9yIGV4YW1wbGUgXCJuYW1lLGFkZHJlc3NcIikuXG4qICAgWW91IGNhbiBhbHNvIHVzZSBhbiBhcnJheSAoZm9yIGV4YW1wbGUgW1wibmFtZVwiLFwiYWRkcmVzc1wiXSkuXG4qICAgQnkgZGVmYXVsdCwgYWxsIGF0dHJpYnV0ZXMgYXJlIHJldHJpZXZlZC4gWW91IGNhbiBhbHNvIHVzZSAnKicgdG8gcmV0cmlldmUgYWxsXG4qICAgdmFsdWVzIHdoZW4gYW4gYXR0cmlidXRlc1RvUmV0cmlldmUgc2V0dGluZyBpcyBzcGVjaWZpZWQgZm9yIHlvdXIgaW5kZXguXG4qIC0gYXR0cmlidXRlc1RvSGlnaGxpZ2h0OiBhIHN0cmluZyB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIGF0dHJpYnV0ZXMgeW91XG4qICAgd2FudCB0byBoaWdobGlnaHQgYWNjb3JkaW5nIHRvIHRoZSBxdWVyeS5cbiogICBBdHRyaWJ1dGVzIGFyZSBzZXBhcmF0ZWQgYnkgYSBjb21tYS4gWW91IGNhbiBhbHNvIHVzZSBhbiBhcnJheSAoZm9yIGV4YW1wbGUgW1wibmFtZVwiLFwiYWRkcmVzc1wiXSkuXG4qICAgSWYgYW4gYXR0cmlidXRlIGhhcyBubyBtYXRjaCBmb3IgdGhlIHF1ZXJ5LCB0aGUgcmF3IHZhbHVlIGlzIHJldHVybmVkLlxuKiAgIEJ5IGRlZmF1bHQgYWxsIGluZGV4ZWQgdGV4dCBhdHRyaWJ1dGVzIGFyZSBoaWdobGlnaHRlZC5cbiogICBZb3UgY2FuIHVzZSBgKmAgaWYgeW91IHdhbnQgdG8gaGlnaGxpZ2h0IGFsbCB0ZXh0dWFsIGF0dHJpYnV0ZXMuXG4qICAgTnVtZXJpY2FsIGF0dHJpYnV0ZXMgYXJlIG5vdCBoaWdobGlnaHRlZC5cbiogICBBIG1hdGNoTGV2ZWwgaXMgcmV0dXJuZWQgZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgYXR0cmlidXRlIGFuZCBjYW4gY29udGFpbjpcbiogICAgICAtIGZ1bGw6IGlmIGFsbCB0aGUgcXVlcnkgdGVybXMgd2VyZSBmb3VuZCBpbiB0aGUgYXR0cmlidXRlLFxuKiAgICAgIC0gcGFydGlhbDogaWYgb25seSBzb21lIG9mIHRoZSBxdWVyeSB0ZXJtcyB3ZXJlIGZvdW5kLFxuKiAgICAgIC0gbm9uZTogaWYgbm9uZSBvZiB0aGUgcXVlcnkgdGVybXMgd2VyZSBmb3VuZC5cbiogLSBhdHRyaWJ1dGVzVG9TbmlwcGV0OiBhIHN0cmluZyB0aGF0IGNvbnRhaW5zIHRoZSBsaXN0IG9mIGF0dHJpYnV0ZXMgdG8gc25pcHBldCBhbG9uZ3NpZGVcbiogdGhlIG51bWJlciBvZiB3b3JkcyB0byByZXR1cm4gKHN5bnRheCBpcyBgYXR0cmlidXRlTmFtZTpuYldvcmRzYCkuXG4qICAgIEF0dHJpYnV0ZXMgYXJlIHNlcGFyYXRlZCBieSBhIGNvbW1hIChFeGFtcGxlOiBhdHRyaWJ1dGVzVG9TbmlwcGV0PW5hbWU6MTAsY29udGVudDoxMCkuXG4qICAgIFlvdSBjYW4gYWxzbyB1c2UgYW4gYXJyYXkgKEV4YW1wbGU6IGF0dHJpYnV0ZXNUb1NuaXBwZXQ6IFsnbmFtZToxMCcsJ2NvbnRlbnQ6MTAnXSkuXG4qICAgIEJ5IGRlZmF1bHQgbm8gc25pcHBldCBpcyBjb21wdXRlZC5cbiogLSBtaW5Xb3JkU2l6ZWZvcjFUeXBvOiB0aGUgbWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiBhIHF1ZXJ5IHdvcmQgdG8gYWNjZXB0IG9uZSB0eXBvIGluIHRoaXMgd29yZC5cbiogRGVmYXVsdHMgdG8gMy5cbiogLSBtaW5Xb3JkU2l6ZWZvcjJUeXBvczogdGhlIG1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgaW4gYSBxdWVyeSB3b3JkXG4qIHRvIGFjY2VwdCB0d28gdHlwb3MgaW4gdGhpcyB3b3JkLiBEZWZhdWx0cyB0byA3LlxuKiAtIGdldFJhbmtpbmdJbmZvOiBpZiBzZXQgdG8gMSwgdGhlIHJlc3VsdCBoaXRzIHdpbGwgY29udGFpbiByYW5raW5nXG4qIGluZm9ybWF0aW9uIGluIF9yYW5raW5nSW5mbyBhdHRyaWJ1dGUuXG4qIC0gYXJvdW5kTGF0TG5nOiBzZWFyY2ggZm9yIGVudHJpZXMgYXJvdW5kIGEgZ2l2ZW5cbiogbGF0aXR1ZGUvbG9uZ2l0dWRlIChzcGVjaWZpZWQgYXMgdHdvIGZsb2F0cyBzZXBhcmF0ZWQgYnkgYSBjb21tYSkuXG4qICAgRm9yIGV4YW1wbGUgYXJvdW5kTGF0TG5nPTQ3LjMxNjY2OSw1LjAxNjY3MCkuXG4qICAgWW91IGNhbiBzcGVjaWZ5IHRoZSBtYXhpbXVtIGRpc3RhbmNlIGluIG1ldGVycyB3aXRoIHRoZSBhcm91bmRSYWRpdXMgcGFyYW1ldGVyIChpbiBtZXRlcnMpXG4qICAgYW5kIHRoZSBwcmVjaXNpb24gZm9yIHJhbmtpbmcgd2l0aCBhcm91bmRQcmVjaXNpb25cbiogICAoZm9yIGV4YW1wbGUgaWYgeW91IHNldCBhcm91bmRQcmVjaXNpb249MTAwLCB0d28gb2JqZWN0cyB0aGF0IGFyZSBkaXN0YW50IG9mXG4qICAgbGVzcyB0aGFuIDEwMG0gd2lsbCBiZSBjb25zaWRlcmVkIGFzIGlkZW50aWNhbCBmb3IgXCJnZW9cIiByYW5raW5nIHBhcmFtZXRlcikuXG4qICAgQXQgaW5kZXhpbmcsIHlvdSBzaG91bGQgc3BlY2lmeSBnZW9sb2Mgb2YgYW4gb2JqZWN0IHdpdGggdGhlIF9nZW9sb2MgYXR0cmlidXRlXG4qICAgKGluIHRoZSBmb3JtIHtcIl9nZW9sb2NcIjp7XCJsYXRcIjo0OC44NTM0MDksIFwibG5nXCI6Mi4zNDg4MDB9fSlcbiogLSBpbnNpZGVCb3VuZGluZ0JveDogc2VhcmNoIGVudHJpZXMgaW5zaWRlIGEgZ2l2ZW4gYXJlYSBkZWZpbmVkIGJ5IHRoZSB0d28gZXh0cmVtZSBwb2ludHNcbiogb2YgYSByZWN0YW5nbGUgKGRlZmluZWQgYnkgNCBmbG9hdHM6IHAxTGF0LHAxTG5nLHAyTGF0LHAyTG5nKS5cbiogICBGb3IgZXhhbXBsZSBpbnNpZGVCb3VuZGluZ0JveD00Ny4zMTY1LDQuOTY2NSw0Ny4zNDI0LDUuMDIwMSkuXG4qICAgQXQgaW5kZXhpbmcsIHlvdSBzaG91bGQgc3BlY2lmeSBnZW9sb2Mgb2YgYW4gb2JqZWN0IHdpdGggdGhlIF9nZW9sb2MgYXR0cmlidXRlXG4qICAgKGluIHRoZSBmb3JtIHtcIl9nZW9sb2NcIjp7XCJsYXRcIjo0OC44NTM0MDksIFwibG5nXCI6Mi4zNDg4MDB9fSlcbiogLSBudW1lcmljRmlsdGVyczogYSBzdHJpbmcgdGhhdCBjb250YWlucyB0aGUgbGlzdCBvZiBudW1lcmljIGZpbHRlcnMgeW91IHdhbnQgdG9cbiogYXBwbHkgc2VwYXJhdGVkIGJ5IGEgY29tbWEuXG4qICAgVGhlIHN5bnRheCBvZiBvbmUgZmlsdGVyIGlzIGBhdHRyaWJ1dGVOYW1lYCBmb2xsb3dlZCBieSBgb3BlcmFuZGAgZm9sbG93ZWQgYnkgYHZhbHVlYC5cbiogICBTdXBwb3J0ZWQgb3BlcmFuZHMgYXJlIGA8YCwgYDw9YCwgYD1gLCBgPmAgYW5kIGA+PWAuXG4qICAgWW91IGNhbiBoYXZlIG11bHRpcGxlIGNvbmRpdGlvbnMgb24gb25lIGF0dHJpYnV0ZSBsaWtlIGZvciBleGFtcGxlIG51bWVyaWNGaWx0ZXJzPXByaWNlPjEwMCxwcmljZTwxMDAwLlxuKiAgIFlvdSBjYW4gYWxzbyB1c2UgYW4gYXJyYXkgKGZvciBleGFtcGxlIG51bWVyaWNGaWx0ZXJzOiBbXCJwcmljZT4xMDBcIixcInByaWNlPDEwMDBcIl0pLlxuKiAtIHRhZ0ZpbHRlcnM6IGZpbHRlciB0aGUgcXVlcnkgYnkgYSBzZXQgb2YgdGFncy4gWW91IGNhbiBBTkQgdGFncyBieSBzZXBhcmF0aW5nIHRoZW0gYnkgY29tbWFzLlxuKiAgIFRvIE9SIHRhZ3MsIHlvdSBtdXN0IGFkZCBwYXJlbnRoZXNlcy4gRm9yIGV4YW1wbGUsIHRhZ3M9dGFnMSwodGFnMix0YWczKSBtZWFucyB0YWcxIEFORCAodGFnMiBPUiB0YWczKS5cbiogICBZb3UgY2FuIGFsc28gdXNlIGFuIGFycmF5LCBmb3IgZXhhbXBsZSB0YWdGaWx0ZXJzOiBbXCJ0YWcxXCIsW1widGFnMlwiLFwidGFnM1wiXV1cbiogICBtZWFucyB0YWcxIEFORCAodGFnMiBPUiB0YWczKS5cbiogICBBdCBpbmRleGluZywgdGFncyBzaG91bGQgYmUgYWRkZWQgaW4gdGhlIF90YWdzKiogYXR0cmlidXRlXG4qICAgb2Ygb2JqZWN0cyAoZm9yIGV4YW1wbGUge1wiX3RhZ3NcIjpbXCJ0YWcxXCIsXCJ0YWcyXCJdfSkuXG4qIC0gZmFjZXRGaWx0ZXJzOiBmaWx0ZXIgdGhlIHF1ZXJ5IGJ5IGEgbGlzdCBvZiBmYWNldHMuXG4qICAgRmFjZXRzIGFyZSBzZXBhcmF0ZWQgYnkgY29tbWFzIGFuZCBlYWNoIGZhY2V0IGlzIGVuY29kZWQgYXMgYGF0dHJpYnV0ZU5hbWU6dmFsdWVgLlxuKiAgIEZvciBleGFtcGxlOiBgZmFjZXRGaWx0ZXJzPWNhdGVnb3J5OkJvb2ssYXV0aG9yOkpvaG4lMjBEb2VgLlxuKiAgIFlvdSBjYW4gYWxzbyB1c2UgYW4gYXJyYXkgKGZvciBleGFtcGxlIGBbXCJjYXRlZ29yeTpCb29rXCIsXCJhdXRob3I6Sm9obiUyMERvZVwiXWApLlxuKiAtIGZhY2V0czogTGlzdCBvZiBvYmplY3QgYXR0cmlidXRlcyB0aGF0IHlvdSB3YW50IHRvIHVzZSBmb3IgZmFjZXRpbmcuXG4qICAgQ29tbWEgc2VwYXJhdGVkIGxpc3Q6IGBcImNhdGVnb3J5LGF1dGhvclwiYCBvciBhcnJheSBgWydjYXRlZ29yeScsJ2F1dGhvciddYFxuKiAgIE9ubHkgYXR0cmlidXRlcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCBpbiAqKmF0dHJpYnV0ZXNGb3JGYWNldGluZyoqIGluZGV4IHNldHRpbmdcbiogICBjYW4gYmUgdXNlZCBpbiB0aGlzIHBhcmFtZXRlci5cbiogICBZb3UgY2FuIGFsc28gdXNlIGAqYCB0byBwZXJmb3JtIGZhY2V0aW5nIG9uIGFsbCBhdHRyaWJ1dGVzIHNwZWNpZmllZCBpbiAqKmF0dHJpYnV0ZXNGb3JGYWNldGluZyoqLlxuKiAtIHF1ZXJ5VHlwZTogc2VsZWN0IGhvdyB0aGUgcXVlcnkgd29yZHMgYXJlIGludGVycHJldGVkLCBpdCBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWU6XG4qICAgIC0gcHJlZml4QWxsOiBhbGwgcXVlcnkgd29yZHMgYXJlIGludGVycHJldGVkIGFzIHByZWZpeGVzLFxuKiAgICAtIHByZWZpeExhc3Q6IG9ubHkgdGhlIGxhc3Qgd29yZCBpcyBpbnRlcnByZXRlZCBhcyBhIHByZWZpeCAoZGVmYXVsdCBiZWhhdmlvciksXG4qICAgIC0gcHJlZml4Tm9uZTogbm8gcXVlcnkgd29yZCBpcyBpbnRlcnByZXRlZCBhcyBhIHByZWZpeC4gVGhpcyBvcHRpb24gaXMgbm90IHJlY29tbWVuZGVkLlxuKiAtIG9wdGlvbmFsV29yZHM6IGEgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIGxpc3Qgb2Ygd29yZHMgdGhhdCBzaG91bGRcbiogYmUgY29uc2lkZXJlZCBhcyBvcHRpb25hbCB3aGVuIGZvdW5kIGluIHRoZSBxdWVyeS5cbiogICBDb21tYSBzZXBhcmF0ZWQgYW5kIGFycmF5IGFyZSBhY2NlcHRlZC5cbiogLSBkaXN0aW5jdDogSWYgc2V0IHRvIDEsIGVuYWJsZSB0aGUgZGlzdGluY3QgZmVhdHVyZSAoZGlzYWJsZWQgYnkgZGVmYXVsdClcbiogaWYgdGhlIGF0dHJpYnV0ZUZvckRpc3RpbmN0IGluZGV4IHNldHRpbmcgaXMgc2V0LlxuKiAgIFRoaXMgZmVhdHVyZSBpcyBzaW1pbGFyIHRvIHRoZSBTUUwgXCJkaXN0aW5jdFwiIGtleXdvcmQ6IHdoZW4gZW5hYmxlZFxuKiAgIGluIGEgcXVlcnkgd2l0aCB0aGUgZGlzdGluY3Q9MSBwYXJhbWV0ZXIsXG4qICAgYWxsIGhpdHMgY29udGFpbmluZyBhIGR1cGxpY2F0ZSB2YWx1ZSBmb3IgdGhlIGF0dHJpYnV0ZUZvckRpc3RpbmN0IGF0dHJpYnV0ZSBhcmUgcmVtb3ZlZCBmcm9tIHJlc3VsdHMuXG4qICAgRm9yIGV4YW1wbGUsIGlmIHRoZSBjaG9zZW4gYXR0cmlidXRlIGlzIHNob3dfbmFtZSBhbmQgc2V2ZXJhbCBoaXRzIGhhdmVcbiogICB0aGUgc2FtZSB2YWx1ZSBmb3Igc2hvd19uYW1lLCB0aGVuIG9ubHkgdGhlIGJlc3RcbiogICBvbmUgaXMga2VwdCBhbmQgb3RoZXJzIGFyZSByZW1vdmVkLlxuKiAtIHJlc3RyaWN0U2VhcmNoYWJsZUF0dHJpYnV0ZXM6IExpc3Qgb2YgYXR0cmlidXRlcyB5b3Ugd2FudCB0byB1c2UgZm9yXG4qIHRleHR1YWwgc2VhcmNoIChtdXN0IGJlIGEgc3Vic2V0IG9mIHRoZSBhdHRyaWJ1dGVzVG9JbmRleCBpbmRleCBzZXR0aW5nKVxuKiBlaXRoZXIgY29tbWEgc2VwYXJhdGVkIG9yIGFzIGFuIGFycmF5XG4qIEBwYXJhbSBjYWxsYmFjayB0aGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHM6XG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpLiBJZiBmYWxzZSwgdGhlIGNvbnRlbnQgY29udGFpbnMgdGhlIGVycm9yLlxuKiAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgdGhhdCBjb250YWlucyB0aGUgbGlzdCBvZiByZXN1bHRzLlxuKi9cbkluZGV4Q29yZS5wcm90b3R5cGUuc2VhcmNoID0gYnVpbGRTZWFyY2hNZXRob2QoJ3F1ZXJ5Jyk7XG5cbi8qXG4qIC0tIEJFVEEgLS1cbiogU2VhcmNoIGEgcmVjb3JkIHNpbWlsYXIgdG8gdGhlIHF1ZXJ5IGluc2lkZSB0aGUgaW5kZXggdXNpbmcgWE1MSHR0cFJlcXVlc3QgcmVxdWVzdCAoVXNpbmcgYSBQT1NUIHF1ZXJ5IHRvXG4qIG1pbmltaXplIG51bWJlciBvZiBPUFRJT05TIHF1ZXJpZXM6IENyb3NzLU9yaWdpbiBSZXNvdXJjZSBTaGFyaW5nKS5cbipcbiogQHBhcmFtIHF1ZXJ5IHRoZSBzaW1pbGFyIHF1ZXJ5XG4qIEBwYXJhbSBhcmdzIChvcHRpb25hbCkgaWYgc2V0LCBjb250YWlucyBhbiBvYmplY3Qgd2l0aCBxdWVyeSBwYXJhbWV0ZXJzLlxuKiAgIEFsbCBzZWFyY2ggcGFyYW1ldGVycyBhcmUgc3VwcG9ydGVkIChzZWUgc2VhcmNoIGZ1bmN0aW9uKSwgcmVzdHJpY3RTZWFyY2hhYmxlQXR0cmlidXRlcyBhbmQgZmFjZXRGaWx0ZXJzXG4qICAgYXJlIHRoZSB0d28gbW9zdCB1c2VmdWwgdG8gcmVzdHJpY3QgdGhlIHNpbWlsYXIgcmVzdWx0cyBhbmQgZ2V0IG1vcmUgcmVsZXZhbnQgY29udGVudFxuKi9cbkluZGV4Q29yZS5wcm90b3R5cGUuc2ltaWxhclNlYXJjaCA9IGJ1aWxkU2VhcmNoTWV0aG9kKCdzaW1pbGFyUXVlcnknKTtcblxuLypcbiogQnJvd3NlIGluZGV4IGNvbnRlbnQuIFRoZSByZXNwb25zZSBjb250ZW50IHdpbGwgaGF2ZSBhIGBjdXJzb3JgIHByb3BlcnR5IHRoYXQgeW91IGNhbiB1c2VcbiogdG8gYnJvd3NlIHN1YnNlcXVlbnQgcGFnZXMgZm9yIHRoaXMgcXVlcnkuIFVzZSBgaW5kZXguYnJvd3NlRnJvbShjdXJzb3IpYCB3aGVuIHlvdSB3YW50LlxuKlxuKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLSBUaGUgZnVsbCB0ZXh0IHF1ZXJ5XG4qIEBwYXJhbSB7T2JqZWN0fSBbcXVlcnlQYXJhbWV0ZXJzXSAtIEFueSBzZWFyY2ggcXVlcnkgcGFyYW1ldGVyXG4qIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gLSBUaGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB0aGUgYnJvd3NlIHJlc3VsdFxuKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiogQGV4YW1wbGVcbiogaW5kZXguYnJvd3NlKCdjb29sIHNvbmdzJywge1xuKiAgIHRhZ0ZpbHRlcnM6ICdwdWJsaWMsY29tbWVudHMnLFxuKiAgIGhpdHNQZXJQYWdlOiA1MDBcbiogfSwgY2FsbGJhY2spO1xuKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5hbGdvbGlhLmNvbS9kb2MvcmVzdF9hcGkjQnJvd3NlfEFsZ29saWEgUkVTVCBBUEkgRG9jdW1lbnRhdGlvbn1cbiovXG5JbmRleENvcmUucHJvdG90eXBlLmJyb3dzZSA9IGZ1bmN0aW9uKHF1ZXJ5LCBxdWVyeVBhcmFtZXRlcnMsIGNhbGxiYWNrKSB7XG4gIHZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UuanMnKTtcblxuICB2YXIgaW5kZXhPYmogPSB0aGlzO1xuXG4gIHZhciBwYWdlO1xuICB2YXIgaGl0c1BlclBhZ2U7XG5cbiAgLy8gd2UgY2hlY2sgdmFyaWFkaWMgY2FsbHMgdGhhdCBhcmUgbm90IHRoZSBvbmUgZGVmaW5lZFxuICAvLyAuYnJvd3NlKCkvLmJyb3dzZShmbilcbiAgLy8gPT4gcGFnZSA9IDBcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGFnZSA9IDA7XG4gICAgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gICAgcXVlcnkgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAvLyAuYnJvd3NlKDIpLy5icm93c2UoMiwgMTApLy5icm93c2UoMiwgZm4pLy5icm93c2UoMiwgMTAsIGZuKVxuICAgIHBhZ2UgPSBhcmd1bWVudHNbMF07XG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdudW1iZXInKSB7XG4gICAgICBoaXRzUGVyUGFnZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzWzFdO1xuICAgICAgaGl0c1BlclBhZ2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHF1ZXJ5ID0gdW5kZWZpbmVkO1xuICAgIHF1ZXJ5UGFyYW1ldGVycyA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgIC8vIC5icm93c2UocXVlcnlQYXJhbWV0ZXJzKS8uYnJvd3NlKHF1ZXJ5UGFyYW1ldGVycywgY2IpXG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzWzFdO1xuICAgIH1cbiAgICBxdWVyeVBhcmFtZXRlcnMgPSBhcmd1bWVudHNbMF07XG4gICAgcXVlcnkgPSB1bmRlZmluZWQ7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIC5icm93c2UocXVlcnksIGNiKVxuICAgIGNhbGxiYWNrID0gYXJndW1lbnRzWzFdO1xuICAgIHF1ZXJ5UGFyYW1ldGVycyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIG90aGVyd2lzZSBpdCdzIGEgLmJyb3dzZShxdWVyeSkvLmJyb3dzZShxdWVyeSwgcXVlcnlQYXJhbWV0ZXJzKS8uYnJvd3NlKHF1ZXJ5LCBxdWVyeVBhcmFtZXRlcnMsIGNiKVxuXG4gIC8vIGdldCBzZWFyY2ggcXVlcnkgcGFyYW1ldGVycyBjb21iaW5pbmcgdmFyaW91cyBwb3NzaWJsZSBjYWxsc1xuICAvLyB0byAuYnJvd3NlKCk7XG4gIHF1ZXJ5UGFyYW1ldGVycyA9IG1lcmdlKHt9LCBxdWVyeVBhcmFtZXRlcnMgfHwge30sIHtcbiAgICBwYWdlOiBwYWdlLFxuICAgIGhpdHNQZXJQYWdlOiBoaXRzUGVyUGFnZSxcbiAgICBxdWVyeTogcXVlcnlcbiAgfSk7XG5cbiAgdmFyIHBhcmFtcyA9IHRoaXMuYXMuX2dldFNlYXJjaFBhcmFtcyhxdWVyeVBhcmFtZXRlcnMsICcnKTtcblxuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGluZGV4T2JqLmluZGV4TmFtZSkgKyAnL2Jyb3dzZT8nICsgcGFyYW1zLFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogQ29udGludWUgYnJvd3NpbmcgZnJvbSBhIHByZXZpb3VzIHBvc2l0aW9uIChjdXJzb3IpLCBvYnRhaW5lZCB2aWEgYSBjYWxsIHRvIGAuYnJvd3NlKClgLlxuKlxuKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLSBUaGUgZnVsbCB0ZXh0IHF1ZXJ5XG4qIEBwYXJhbSB7T2JqZWN0fSBbcXVlcnlQYXJhbWV0ZXJzXSAtIEFueSBzZWFyY2ggcXVlcnkgcGFyYW1ldGVyXG4qIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gLSBUaGUgcmVzdWx0IGNhbGxiYWNrIGNhbGxlZCB3aXRoIHR3byBhcmd1bWVudHNcbiogICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICAgY29udGVudDogdGhlIHNlcnZlciBhbnN3ZXIgd2l0aCB0aGUgYnJvd3NlIHJlc3VsdFxuKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiogQGV4YW1wbGVcbiogaW5kZXguYnJvd3NlRnJvbSgnMTRsa2ZzYWtsMzInLCBjYWxsYmFjayk7XG4qIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9yZXN0X2FwaSNCcm93c2V8QWxnb2xpYSBSRVNUIEFQSSBEb2N1bWVudGF0aW9ufVxuKi9cbkluZGV4Q29yZS5wcm90b3R5cGUuYnJvd3NlRnJvbSA9IGZ1bmN0aW9uKGN1cnNvciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy8xL2luZGV4ZXMvJyArIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmluZGV4TmFtZSkgKyAnL2Jyb3dzZT9jdXJzb3I9JyArIGVuY29kZVVSSUNvbXBvbmVudChjdXJzb3IpLFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxuLypcbiogU2VhcmNoIGZvciBmYWNldCB2YWx1ZXNcbiogaHR0cHM6Ly93d3cuYWxnb2xpYS5jb20vZG9jL3Jlc3QtYXBpL3NlYXJjaCNzZWFyY2gtZm9yLWZhY2V0LXZhbHVlc1xuKlxuKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmZhY2V0TmFtZSBGYWNldCBuYW1lLCBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgdG8gc2VhcmNoIGZvciB2YWx1ZXMgaW4uXG4qIE11c3QgYmUgZGVjbGFyZWQgYXMgYSBmYWNldFxuKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zLmZhY2V0UXVlcnkgUXVlcnkgZm9yIHRoZSBmYWNldCBzZWFyY2hcbiogQHBhcmFtIHtzdHJpbmd9IFtwYXJhbXMuKl0gQW55IHNlYXJjaCBwYXJhbWV0ZXIgb2YgQWxnb2xpYSxcbiogc2VlIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL2RvYy9hcGktY2xpZW50L2phdmFzY3JpcHQvc2VhcmNoI3NlYXJjaC1wYXJhbWV0ZXJzXG4qIFBhZ2luYXRpb24gaXMgbm90IHN1cHBvcnRlZC4gVGhlIHBhZ2UgYW5kIGhpdHNQZXJQYWdlIHBhcmFtZXRlcnMgd2lsbCBiZSBpZ25vcmVkLlxuKiBAcGFyYW0gY2FsbGJhY2sgKG9wdGlvbmFsKVxuKi9cbkluZGV4Q29yZS5wcm90b3R5cGUuc2VhcmNoRm9yRmFjZXRWYWx1ZXMgPSBmdW5jdGlvbihwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHZhciBjbG9uZSA9IHJlcXVpcmUoJy4vY2xvbmUuanMnKTtcbiAgdmFyIG9taXQgPSByZXF1aXJlKCcuL29taXQuanMnKTtcbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBpbmRleC5zZWFyY2hGb3JGYWNldFZhbHVlcyh7ZmFjZXROYW1lLCBmYWNldFF1ZXJ5LCAuLi5wYXJhbXN9WywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKHBhcmFtcy5mYWNldE5hbWUgPT09IHVuZGVmaW5lZCB8fCBwYXJhbXMuZmFjZXRRdWVyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHVzYWdlKTtcbiAgfVxuXG4gIHZhciBmYWNldE5hbWUgPSBwYXJhbXMuZmFjZXROYW1lO1xuICB2YXIgZmlsdGVyZWRQYXJhbXMgPSBvbWl0KGNsb25lKHBhcmFtcyksIGZ1bmN0aW9uKGtleU5hbWUpIHtcbiAgICByZXR1cm4ga2V5TmFtZSA9PT0gJ2ZhY2V0TmFtZSc7XG4gIH0pO1xuICB2YXIgc2VhcmNoUGFyYW1ldGVycyA9IHRoaXMuYXMuX2dldFNlYXJjaFBhcmFtcyhmaWx0ZXJlZFBhcmFtcywgJycpO1xuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAnLzEvaW5kZXhlcy8nICtcbiAgICAgIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmluZGV4TmFtZSkgKyAnL2ZhY2V0cy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KGZhY2V0TmFtZSkgKyAnL3F1ZXJ5JyxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGJvZHk6IHtwYXJhbXM6IHNlYXJjaFBhcmFtZXRlcnN9LFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbkluZGV4Q29yZS5wcm90b3R5cGUuc2VhcmNoRmFjZXQgPSBkZXByZWNhdGUoZnVuY3Rpb24ocGFyYW1zLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5zZWFyY2hGb3JGYWNldFZhbHVlcyhwYXJhbXMsIGNhbGxiYWNrKTtcbn0sIGRlcHJlY2F0ZWRNZXNzYWdlKFxuICAnaW5kZXguc2VhcmNoRmFjZXQocGFyYW1zWywgY2FsbGJhY2tdKScsXG4gICdpbmRleC5zZWFyY2hGb3JGYWNldFZhbHVlcyhwYXJhbXNbLCBjYWxsYmFja10pJ1xuKSk7XG5cbkluZGV4Q29yZS5wcm90b3R5cGUuX3NlYXJjaCA9IGZ1bmN0aW9uKHBhcmFtcywgdXJsLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5hcy5fanNvblJlcXVlc3Qoe1xuICAgIGNhY2hlOiB0aGlzLmNhY2hlLFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogdXJsIHx8ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5pbmRleE5hbWUpICsgJy9xdWVyeScsXG4gICAgYm9keToge3BhcmFtczogcGFyYW1zfSxcbiAgICBob3N0VHlwZTogJ3JlYWQnLFxuICAgIGZhbGxiYWNrOiB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaW5kZXhOYW1lKSxcbiAgICAgIGJvZHk6IHtwYXJhbXM6IHBhcmFtc31cbiAgICB9LFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbi8qXG4qIEdldCBhbiBvYmplY3QgZnJvbSB0aGlzIGluZGV4XG4qXG4qIEBwYXJhbSBvYmplY3RJRCB0aGUgdW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIG9iamVjdCB0byByZXRyaWV2ZVxuKiBAcGFyYW0gYXR0cnMgKG9wdGlvbmFsKSBpZiBzZXQsIGNvbnRhaW5zIHRoZSBhcnJheSBvZiBhdHRyaWJ1dGUgbmFtZXMgdG8gcmV0cmlldmVcbiogQHBhcmFtIGNhbGxiYWNrIChvcHRpb25hbCkgdGhlIHJlc3VsdCBjYWxsYmFjayBjYWxsZWQgd2l0aCB0d28gYXJndW1lbnRzXG4qICBlcnJvcjogbnVsbCBvciBFcnJvcignbWVzc2FnZScpXG4qICBjb250ZW50OiB0aGUgb2JqZWN0IHRvIHJldHJpZXZlIG9yIHRoZSBlcnJvciBtZXNzYWdlIGlmIGEgZmFpbHVyZSBvY2N1cmVkXG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5nZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3RJRCwgYXR0cnMsIGNhbGxiYWNrKSB7XG4gIHZhciBpbmRleE9iaiA9IHRoaXM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgfHwgdHlwZW9mIGF0dHJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBhdHRycztcbiAgICBhdHRycyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHZhciBwYXJhbXMgPSAnJztcbiAgaWYgKGF0dHJzICE9PSB1bmRlZmluZWQpIHtcbiAgICBwYXJhbXMgPSAnP2F0dHJpYnV0ZXM9JztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaSAhPT0gMCkge1xuICAgICAgICBwYXJhbXMgKz0gJywnO1xuICAgICAgfVxuICAgICAgcGFyYW1zICs9IGF0dHJzW2ldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmFzLl9qc29uUmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLycgKyBlbmNvZGVVUklDb21wb25lbnQoaW5kZXhPYmouaW5kZXhOYW1lKSArICcvJyArIGVuY29kZVVSSUNvbXBvbmVudChvYmplY3RJRCkgKyBwYXJhbXMsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKlxuKiBHZXQgc2V2ZXJhbCBvYmplY3RzIGZyb20gdGhpcyBpbmRleFxuKlxuKiBAcGFyYW0gb2JqZWN0SURzIHRoZSBhcnJheSBvZiB1bmlxdWUgaWRlbnRpZmllciBvZiBvYmplY3RzIHRvIHJldHJpZXZlXG4qL1xuSW5kZXhDb3JlLnByb3RvdHlwZS5nZXRPYmplY3RzID0gZnVuY3Rpb24ob2JqZWN0SURzLCBhdHRyaWJ1dGVzVG9SZXRyaWV2ZSwgY2FsbGJhY2spIHtcbiAgdmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5Jyk7XG4gIHZhciBtYXAgPSByZXF1aXJlKCcuL21hcC5qcycpO1xuXG4gIHZhciB1c2FnZSA9ICdVc2FnZTogaW5kZXguZ2V0T2JqZWN0cyhhcnJheU9mT2JqZWN0SURzWywgY2FsbGJhY2tdKSc7XG5cbiAgaWYgKCFpc0FycmF5KG9iamVjdElEcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgdmFyIGluZGV4T2JqID0gdGhpcztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2YgYXR0cmlidXRlc1RvUmV0cmlldmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGF0dHJpYnV0ZXNUb1JldHJpZXZlO1xuICAgIGF0dHJpYnV0ZXNUb1JldHJpZXZlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIGJvZHkgPSB7XG4gICAgcmVxdWVzdHM6IG1hcChvYmplY3RJRHMsIGZ1bmN0aW9uIHByZXBhcmVSZXF1ZXN0KG9iamVjdElEKSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgaW5kZXhOYW1lOiBpbmRleE9iai5pbmRleE5hbWUsXG4gICAgICAgIG9iamVjdElEOiBvYmplY3RJRFxuICAgICAgfTtcblxuICAgICAgaWYgKGF0dHJpYnV0ZXNUb1JldHJpZXZlKSB7XG4gICAgICAgIHJlcXVlc3QuYXR0cmlidXRlc1RvUmV0cmlldmUgPSBhdHRyaWJ1dGVzVG9SZXRyaWV2ZS5qb2luKCcsJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgIH0pXG4gIH07XG5cbiAgcmV0dXJuIHRoaXMuYXMuX2pzb25SZXF1ZXN0KHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6ICcvMS9pbmRleGVzLyovb2JqZWN0cycsXG4gICAgaG9zdFR5cGU6ICdyZWFkJyxcbiAgICBib2R5OiBib2R5LFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbkluZGV4Q29yZS5wcm90b3R5cGUuYXMgPSBudWxsO1xuSW5kZXhDb3JlLnByb3RvdHlwZS5pbmRleE5hbWUgPSBudWxsO1xuSW5kZXhDb3JlLnByb3RvdHlwZS50eXBlQWhlYWRBcmdzID0gbnVsbDtcbkluZGV4Q29yZS5wcm90b3R5cGUudHlwZUFoZWFkVmFsdWVPcHRpb24gPSBudWxsO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9JbmRleENvcmUuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGJ1aWxkU2VhcmNoTWV0aG9kO1xuXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxuZnVuY3Rpb24gYnVpbGRTZWFyY2hNZXRob2QocXVlcnlQYXJhbSwgdXJsKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzZWFyY2gocXVlcnksIGFyZ3MsIGNhbGxiYWNrKSB7XG4gICAgLy8gd2FybiBWMiB1c2VycyBvbiBob3cgdG8gc2VhcmNoXG4gICAgaWYgKHR5cGVvZiBxdWVyeSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgYXJncyA9PT0gJ29iamVjdCcgfHxcbiAgICAgIHR5cGVvZiBjYWxsYmFjayA9PT0gJ29iamVjdCcpIHtcbiAgICAgIC8vIC5zZWFyY2gocXVlcnksIHBhcmFtcywgY2IpXG4gICAgICAvLyAuc2VhcmNoKGNiLCBwYXJhbXMpXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkFsZ29saWFTZWFyY2hFcnJvcignaW5kZXguc2VhcmNoIHVzYWdlIGlzIGluZGV4LnNlYXJjaChxdWVyeSwgcGFyYW1zLCBjYiknKTtcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB0eXBlb2YgcXVlcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIC5zZWFyY2goKSwgLnNlYXJjaChjYilcbiAgICAgIGNhbGxiYWNrID0gcXVlcnk7XG4gICAgICBxdWVyeSA9ICcnO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSB8fCB0eXBlb2YgYXJncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gLnNlYXJjaChxdWVyeS9hcmdzKSwgLnNlYXJjaChxdWVyeSwgY2IpXG4gICAgICBjYWxsYmFjayA9IGFyZ3M7XG4gICAgICBhcmdzID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIC5zZWFyY2goYXJncyksIGNhcmVmdWw6IHR5cGVvZiBudWxsID09PSAnb2JqZWN0J1xuICAgIGlmICh0eXBlb2YgcXVlcnkgPT09ICdvYmplY3QnICYmIHF1ZXJ5ICE9PSBudWxsKSB7XG4gICAgICBhcmdzID0gcXVlcnk7XG4gICAgICBxdWVyeSA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHF1ZXJ5ID09PSB1bmRlZmluZWQgfHwgcXVlcnkgPT09IG51bGwpIHsgLy8gLnNlYXJjaCh1bmRlZmluZWQvbnVsbClcbiAgICAgIHF1ZXJ5ID0gJyc7XG4gICAgfVxuXG4gICAgdmFyIHBhcmFtcyA9ICcnO1xuXG4gICAgaWYgKHF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHBhcmFtcyArPSBxdWVyeVBhcmFtICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KTtcbiAgICB9XG5cbiAgICBpZiAoYXJncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBgX2dldFNlYXJjaFBhcmFtc2Agd2lsbCBhdWdtZW50IHBhcmFtcywgZG8gbm90IGJlIGZvb2xlZCBieSB0aGUgPSB2ZXJzdXMgKz0gZnJvbSBwcmV2aW91cyBpZlxuICAgICAgcGFyYW1zID0gdGhpcy5hcy5fZ2V0U2VhcmNoUGFyYW1zKGFyZ3MsIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlYXJjaChwYXJhbXMsIHVybCwgY2FsbGJhY2spO1xuICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9idWlsZFNlYXJjaE1ldGhvZC5qcyIsIid1c2Ugc3RyaWN0JztcblxuLy8gVGhpcyBmaWxlIGhvc3RzIG91ciBlcnJvciBkZWZpbml0aW9uc1xuLy8gV2UgdXNlIGN1c3RvbSBlcnJvciBcInR5cGVzXCIgc28gdGhhdCB3ZSBjYW4gYWN0IG9uIHRoZW0gd2hlbiB3ZSBuZWVkIGl0XG4vLyBlLmcuOiBpZiBlcnJvciBpbnN0YW5jZW9mIGVycm9ycy5VbnBhcnNhYmxlSlNPTiB0aGVuLi5cblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZnVuY3Rpb24gQWxnb2xpYVNlYXJjaEVycm9yKG1lc3NhZ2UsIGV4dHJhUHJvcGVydGllcykge1xuICB2YXIgZm9yRWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcblxuICB2YXIgZXJyb3IgPSB0aGlzO1xuXG4gIC8vIHRyeSB0byBnZXQgYSBzdGFja3RyYWNlXG4gIGlmICh0eXBlb2YgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICBlcnJvci5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2sgfHwgJ0Nhbm5vdCBnZXQgYSBzdGFja3RyYWNlLCBicm93c2VyIGlzIHRvbyBvbGQnO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ0FsZ29saWFTZWFyY2hFcnJvcic7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InO1xuXG4gIGlmIChleHRyYVByb3BlcnRpZXMpIHtcbiAgICBmb3JFYWNoKGV4dHJhUHJvcGVydGllcywgZnVuY3Rpb24gYWRkVG9FcnJvck9iamVjdCh2YWx1ZSwga2V5KSB7XG4gICAgICBlcnJvcltrZXldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cbn1cblxuaW5oZXJpdHMoQWxnb2xpYVNlYXJjaEVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIGNyZWF0ZUN1c3RvbUVycm9yKG5hbWUsIG1lc3NhZ2UpIHtcbiAgZnVuY3Rpb24gQWxnb2xpYVNlYXJjaEN1c3RvbUVycm9yKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgIC8vIGN1c3RvbSBtZXNzYWdlIG5vdCBzZXQsIHVzZSBkZWZhdWx0XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdICE9PSAnc3RyaW5nJykge1xuICAgICAgYXJncy51bnNoaWZ0KG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIEFsZ29saWFTZWFyY2hFcnJvci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB0aGlzLm5hbWUgPSAnQWxnb2xpYVNlYXJjaCcgKyBuYW1lICsgJ0Vycm9yJztcbiAgfVxuXG4gIGluaGVyaXRzKEFsZ29saWFTZWFyY2hDdXN0b21FcnJvciwgQWxnb2xpYVNlYXJjaEVycm9yKTtcblxuICByZXR1cm4gQWxnb2xpYVNlYXJjaEN1c3RvbUVycm9yO1xufVxuXG4vLyBsYXRlIGV4cG9ydHMgdG8gbGV0IHZhcmlvdXMgZm4gZGVmcyBhbmQgaW5oZXJpdHMgdGFrZSBwbGFjZVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFsZ29saWFTZWFyY2hFcnJvcjogQWxnb2xpYVNlYXJjaEVycm9yLFxuICBVbnBhcnNhYmxlSlNPTjogY3JlYXRlQ3VzdG9tRXJyb3IoXG4gICAgJ1VucGFyc2FibGVKU09OJyxcbiAgICAnQ291bGQgbm90IHBhcnNlIHRoZSBpbmNvbWluZyByZXNwb25zZSBhcyBKU09OLCBzZWUgZXJyLm1vcmUgZm9yIGRldGFpbHMnXG4gICksXG4gIFJlcXVlc3RUaW1lb3V0OiBjcmVhdGVDdXN0b21FcnJvcihcbiAgICAnUmVxdWVzdFRpbWVvdXQnLFxuICAgICdSZXF1ZXN0IHRpbWVkb3V0IGJlZm9yZSBnZXR0aW5nIGEgcmVzcG9uc2UnXG4gICksXG4gIE5ldHdvcms6IGNyZWF0ZUN1c3RvbUVycm9yKFxuICAgICdOZXR3b3JrJyxcbiAgICAnTmV0d29yayBpc3N1ZSwgc2VlIGVyci5tb3JlIGZvciBkZXRhaWxzJ1xuICApLFxuICBKU09OUFNjcmlwdEZhaWw6IGNyZWF0ZUN1c3RvbUVycm9yKFxuICAgICdKU09OUFNjcmlwdEZhaWwnLFxuICAgICc8c2NyaXB0PiB3YXMgbG9hZGVkIGJ1dCBkaWQgbm90IGNhbGwgb3VyIHByb3ZpZGVkIGNhbGxiYWNrJ1xuICApLFxuICBKU09OUFNjcmlwdEVycm9yOiBjcmVhdGVDdXN0b21FcnJvcihcbiAgICAnSlNPTlBTY3JpcHRFcnJvcicsXG4gICAgJzxzY3JpcHQ+IHVuYWJsZSB0byBsb2FkIGR1ZSB0byBhbiBgZXJyb3JgIGV2ZW50IG9uIGl0J1xuICApLFxuICBVbmtub3duOiBjcmVhdGVDdXN0b21FcnJvcihcbiAgICAnVW5rbm93bicsXG4gICAgJ1Vua25vd24gZXJyb3Igb2NjdXJlZCdcbiAgKVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvZXJyb3JzLmpzIiwiXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAob2JqLCBmbiwgY3R4KSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwoZm4pICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2l0ZXJhdG9yIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cbiAgICB2YXIgbCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGwgPT09ICtsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBmbi5jYWxsKGN0eCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChvYmosIGspKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjdHgsIG9ialtrXSwgaywgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L2ZvcmVhY2gvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlcHJlY2F0ZShmbiwgbWVzc2FnZSkge1xuICB2YXIgd2FybmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgLyogZXNsaW50IG5vLWNvbnNvbGU6MCAqL1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9kZXByZWNhdGUuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlcHJlY2F0ZWRNZXNzYWdlKHByZXZpb3VzVXNhZ2UsIG5ld1VzYWdlKSB7XG4gIHZhciBnaXRodWJBbmNob3JMaW5rID0gcHJldmlvdXNVc2FnZS50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoJy4nLCAnJylcbiAgICAucmVwbGFjZSgnKCknLCAnJyk7XG5cbiAgcmV0dXJuICdhbGdvbGlhc2VhcmNoOiBgJyArIHByZXZpb3VzVXNhZ2UgKyAnYCB3YXMgcmVwbGFjZWQgYnkgYCcgKyBuZXdVc2FnZSArXG4gICAgJ2AuIFBsZWFzZSBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FsZ29saWEvYWxnb2xpYXNlYXJjaC1jbGllbnQtanMvd2lraS9EZXByZWNhdGVkIycgKyBnaXRodWJBbmNob3JMaW5rO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvZGVwcmVjYXRlZE1lc3NhZ2UuanMiLCJ2YXIgZm9yZWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZShkZXN0aW5hdGlvbi8qICwgc291cmNlcyAqLykge1xuICB2YXIgc291cmNlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgZm9yZWFjaChzb3VyY2VzLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBrZXlOYW1lIGluIHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXlOYW1lKSkge1xuICAgICAgICBpZiAodHlwZW9mIGRlc3RpbmF0aW9uW2tleU5hbWVdID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc291cmNlW2tleU5hbWVdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGRlc3RpbmF0aW9uW2tleU5hbWVdID0gbWVyZ2Uoe30sIGRlc3RpbmF0aW9uW2tleU5hbWVdLCBzb3VyY2Vba2V5TmFtZV0pO1xuICAgICAgICB9IGVsc2UgaWYgKHNvdXJjZVtrZXlOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZGVzdGluYXRpb25ba2V5TmFtZV0gPSBzb3VyY2Vba2V5TmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL21lcmdlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9jbG9uZS5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb21pdChvYmosIHRlc3QpIHtcbiAgdmFyIGtleXMgPSByZXF1aXJlKCdvYmplY3Qta2V5cycpO1xuICB2YXIgZm9yZWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcblxuICB2YXIgZmlsdGVyZWQgPSB7fTtcblxuICBmb3JlYWNoKGtleXMob2JqKSwgZnVuY3Rpb24gZG9GaWx0ZXIoa2V5TmFtZSkge1xuICAgIGlmICh0ZXN0KGtleU5hbWUpICE9PSB0cnVlKSB7XG4gICAgICBmaWx0ZXJlZFtrZXlOYW1lXSA9IG9ialtrZXlOYW1lXTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBmaWx0ZXJlZDtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL29taXQuanMiLCIndXNlIHN0cmljdCc7XG5cbi8vIG1vZGlmaWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaXNBcmdzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpO1xudmFyIGlzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgaGFzRG9udEVudW1CdWcgPSAhaXNFbnVtZXJhYmxlLmNhbGwoeyB0b1N0cmluZzogbnVsbCB9LCAndG9TdHJpbmcnKTtcbnZhciBoYXNQcm90b0VudW1CdWcgPSBpc0VudW1lcmFibGUuY2FsbChmdW5jdGlvbiAoKSB7fSwgJ3Byb3RvdHlwZScpO1xudmFyIGRvbnRFbnVtcyA9IFtcblx0J3RvU3RyaW5nJyxcblx0J3RvTG9jYWxlU3RyaW5nJyxcblx0J3ZhbHVlT2YnLFxuXHQnaGFzT3duUHJvcGVydHknLFxuXHQnaXNQcm90b3R5cGVPZicsXG5cdCdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG5cdCdjb25zdHJ1Y3Rvcidcbl07XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUgPSBmdW5jdGlvbiAobykge1xuXHR2YXIgY3RvciA9IG8uY29uc3RydWN0b3I7XG5cdHJldHVybiBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvO1xufTtcbnZhciBleGNsdWRlZEtleXMgPSB7XG5cdCRjb25zb2xlOiB0cnVlLFxuXHQkZXh0ZXJuYWw6IHRydWUsXG5cdCRmcmFtZTogdHJ1ZSxcblx0JGZyYW1lRWxlbWVudDogdHJ1ZSxcblx0JGZyYW1lczogdHJ1ZSxcblx0JGlubmVySGVpZ2h0OiB0cnVlLFxuXHQkaW5uZXJXaWR0aDogdHJ1ZSxcblx0JG91dGVySGVpZ2h0OiB0cnVlLFxuXHQkb3V0ZXJXaWR0aDogdHJ1ZSxcblx0JHBhZ2VYT2Zmc2V0OiB0cnVlLFxuXHQkcGFnZVlPZmZzZXQ6IHRydWUsXG5cdCRwYXJlbnQ6IHRydWUsXG5cdCRzY3JvbGxMZWZ0OiB0cnVlLFxuXHQkc2Nyb2xsVG9wOiB0cnVlLFxuXHQkc2Nyb2xsWDogdHJ1ZSxcblx0JHNjcm9sbFk6IHRydWUsXG5cdCRzZWxmOiB0cnVlLFxuXHQkd2Via2l0SW5kZXhlZERCOiB0cnVlLFxuXHQkd2Via2l0U3RvcmFnZUluZm86IHRydWUsXG5cdCR3aW5kb3c6IHRydWVcbn07XG52YXIgaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnID0gKGZ1bmN0aW9uICgpIHtcblx0LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGZvciAodmFyIGsgaW4gd2luZG93KSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICghZXhjbHVkZWRLZXlzWyckJyArIGtdICYmIGhhcy5jYWxsKHdpbmRvdywgaykgJiYgd2luZG93W2tdICE9PSBudWxsICYmIHR5cGVvZiB3aW5kb3dba10gPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUod2luZG93W2tdKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn0oKSk7XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5ID0gZnVuY3Rpb24gKG8pIHtcblx0LyogZ2xvYmFsIHdpbmRvdyAqL1xuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc0F1dG9tYXRpb25FcXVhbGl0eUJ1Zykge1xuXHRcdHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvKTtcblx0fVxuXHR0cnkge1xuXHRcdHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcblxudmFyIGtleXNTaGltID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0dmFyIGlzT2JqZWN0ID0gb2JqZWN0ICE9PSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnO1xuXHR2YXIgaXNGdW5jdGlvbiA9IHRvU3RyLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0dmFyIGlzQXJndW1lbnRzID0gaXNBcmdzKG9iamVjdCk7XG5cdHZhciBpc1N0cmluZyA9IGlzT2JqZWN0ICYmIHRvU3RyLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cdHZhciB0aGVLZXlzID0gW107XG5cblx0aWYgKCFpc09iamVjdCAmJiAhaXNGdW5jdGlvbiAmJiAhaXNBcmd1bWVudHMpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0Jyk7XG5cdH1cblxuXHR2YXIgc2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRnVuY3Rpb247XG5cdGlmIChpc1N0cmluZyAmJiBvYmplY3QubGVuZ3RoID4gMCAmJiAhaGFzLmNhbGwob2JqZWN0LCAwKSkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0Lmxlbmd0aDsgKytpKSB7XG5cdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKGkpKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoaXNBcmd1bWVudHMgJiYgb2JqZWN0Lmxlbmd0aCA+IDApIHtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG9iamVjdC5sZW5ndGg7ICsraikge1xuXHRcdFx0dGhlS2V5cy5wdXNoKFN0cmluZyhqKSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG5cdFx0XHRpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIGhhcy5jYWxsKG9iamVjdCwgbmFtZSkpIHtcblx0XHRcdFx0dGhlS2V5cy5wdXNoKFN0cmluZyhuYW1lKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGhhc0RvbnRFbnVtQnVnKSB7XG5cdFx0dmFyIHNraXBDb25zdHJ1Y3RvciA9IGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlSWZOb3RCdWdneShvYmplY3QpO1xuXG5cdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBkb250RW51bXMubGVuZ3RoOyArK2spIHtcblx0XHRcdGlmICghKHNraXBDb25zdHJ1Y3RvciAmJiBkb250RW51bXNba10gPT09ICdjb25zdHJ1Y3RvcicpICYmIGhhcy5jYWxsKG9iamVjdCwgZG9udEVudW1zW2tdKSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2goZG9udEVudW1zW2tdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHRoZUtleXM7XG59O1xuXG5rZXlzU2hpbS5zaGltID0gZnVuY3Rpb24gc2hpbU9iamVjdEtleXMoKSB7XG5cdGlmIChPYmplY3Qua2V5cykge1xuXHRcdHZhciBrZXlzV29ya3NXaXRoQXJndW1lbnRzID0gKGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIFNhZmFyaSA1LjAgYnVnXG5cdFx0XHRyZXR1cm4gKE9iamVjdC5rZXlzKGFyZ3VtZW50cykgfHwgJycpLmxlbmd0aCA9PT0gMjtcblx0XHR9KDEsIDIpKTtcblx0XHRpZiAoIWtleXNXb3Jrc1dpdGhBcmd1bWVudHMpIHtcblx0XHRcdHZhciBvcmlnaW5hbEtleXMgPSBPYmplY3Qua2V5cztcblx0XHRcdE9iamVjdC5rZXlzID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblx0XHRcdFx0aWYgKGlzQXJncyhvYmplY3QpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsS2V5cyhzbGljZS5jYWxsKG9iamVjdCkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvcmlnaW5hbEtleXMob2JqZWN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0T2JqZWN0LmtleXMgPSBrZXlzU2hpbTtcblx0fVxuXHRyZXR1cm4gT2JqZWN0LmtleXMgfHwga2V5c1NoaW07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNTaGltO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vb2JqZWN0LWtleXMvaW5kZXguanMiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcblx0dmFyIHN0ciA9IHRvU3RyLmNhbGwodmFsdWUpO1xuXHR2YXIgaXNBcmdzID0gc3RyID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcblx0aWYgKCFpc0FyZ3MpIHtcblx0XHRpc0FyZ3MgPSBzdHIgIT09ICdbb2JqZWN0IEFycmF5XScgJiZcblx0XHRcdHZhbHVlICE9PSBudWxsICYmXG5cdFx0XHR0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG5cdFx0XHR0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJyAmJlxuXHRcdFx0dmFsdWUubGVuZ3RoID49IDAgJiZcblx0XHRcdHRvU3RyLmNhbGwodmFsdWUuY2FsbGVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblx0fVxuXHRyZXR1cm4gaXNBcmdzO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L29iamVjdC1rZXlzL2lzQXJndW1lbnRzLmpzIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9pc2FycmF5L2luZGV4LmpzIiwidmFyIGZvcmVhY2ggPSByZXF1aXJlKCdmb3JlYWNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgdmFyIG5ld0FyciA9IFtdO1xuICBmb3JlYWNoKGFyciwgZnVuY3Rpb24oaXRlbSwgaXRlbUluZGV4KSB7XG4gICAgbmV3QXJyLnB1c2goZm4oaXRlbSwgaXRlbUluZGV4LCBhcnIpKTtcbiAgfSk7XG4gIHJldHVybiBuZXdBcnI7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9tYXAuanMiLCIvLyBQYXJzZSBjbG91ZCBkb2VzIG5vdCBzdXBwb3J0cyBzZXRUaW1lb3V0XG4vLyBXZSBkbyBub3Qgc3RvcmUgYSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBpbiB0aGUgY2xpZW50IGV2ZXJ5dGltZVxuLy8gV2Ugb25seSBmYWxsYmFjayB0byBhIGZha2Ugc2V0VGltZW91dCB3aGVuIG5vdCBhdmFpbGFibGVcbi8vIHNldFRpbWVvdXQgY2Fubm90IGJlIG92ZXJyaWRlIGdsb2JhbGx5IHNhZGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4aXRQcm9taXNlKGZuLCBfc2V0VGltZW91dCkge1xuICBfc2V0VGltZW91dChmbiwgMCk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9leGl0UHJvbWlzZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuLy8gVGhpcyBpcyB0aGUgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSBgaW5kZXguYnJvd3NlQWxsKClgIG1ldGhvZFxuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4QnJvd3NlcjtcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbmZ1bmN0aW9uIEluZGV4QnJvd3NlcigpIHtcbn1cblxuaW5oZXJpdHMoSW5kZXhCcm93c2VyLCBFdmVudEVtaXR0ZXIpO1xuXG5JbmRleEJyb3dzZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc3RvcHBlZCA9IHRydWU7XG4gIHRoaXMuX2NsZWFuKCk7XG59O1xuXG5JbmRleEJyb3dzZXIucHJvdG90eXBlLl9lbmQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgdGhpcy5fY2xlYW4oKTtcbn07XG5cbkluZGV4QnJvd3Nlci5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB0aGlzLl9jbGVhbigpO1xufTtcblxuSW5kZXhCcm93c2VyLnByb3RvdHlwZS5fcmVzdWx0ID0gZnVuY3Rpb24oY29udGVudCkge1xuICB0aGlzLmVtaXQoJ3Jlc3VsdCcsIGNvbnRlbnQpO1xufTtcblxuSW5kZXhCcm93c2VyLnByb3RvdHlwZS5fY2xlYW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3N0b3AnKTtcbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2VuZCcpO1xuICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZXJyb3InKTtcbiAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3Jlc3VsdCcpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvSW5kZXhCcm93c2VyLmpzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vZXZlbnRzL2V2ZW50cy5qcyIsIm1vZHVsZS5leHBvcnRzID0gQWxnb2xpYVNlYXJjaENvcmU7XG5cbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIGV4aXRQcm9taXNlID0gcmVxdWlyZSgnLi9leGl0UHJvbWlzZS5qcycpO1xudmFyIEluZGV4Q29yZSA9IHJlcXVpcmUoJy4vSW5kZXhDb3JlLmpzJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlLmpzJyk7XG5cbi8vIFdlIHdpbGwgYWx3YXlzIHB1dCB0aGUgQVBJIEtFWSBpbiB0aGUgSlNPTiBib2R5IGluIGNhc2Ugb2YgdG9vIGxvbmcgQVBJIEtFWSxcbi8vIHRvIGF2b2lkIHF1ZXJ5IHN0cmluZyBiZWluZyB0b28gbG9uZyBhbmQgZmFpbGluZyBpbiB2YXJpb3VzIGNvbmRpdGlvbnMgKG91ciBzZXJ2ZXIgbGltaXQsIGJyb3dzZXIgbGltaXQsXG4vLyBwcm94aWVzIGxpbWl0KVxudmFyIE1BWF9BUElfS0VZX0xFTkdUSCA9IDUwMDtcbnZhciBSRVNFVF9BUFBfREFUQV9USU1FUiA9XG4gIHByb2Nlc3MuZW52LlJFU0VUX0FQUF9EQVRBX1RJTUVSICYmIHBhcnNlSW50KHByb2Nlc3MuZW52LlJFU0VUX0FQUF9EQVRBX1RJTUVSLCAxMCkgfHxcbiAgNjAgKiAyICogMTAwMDsgLy8gYWZ0ZXIgMiBtaW51dGVzIHJlc2V0IHRvIGZpcnN0IGhvc3RcblxuLypcbiAqIEFsZ29saWEgU2VhcmNoIGxpYnJhcnkgaW5pdGlhbGl6YXRpb25cbiAqIGh0dHBzOi8vd3d3LmFsZ29saWEuY29tL1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcHBsaWNhdGlvbklEIC0gWW91ciBhcHBsaWNhdGlvbklELCBmb3VuZCBpbiB5b3VyIGRhc2hib2FyZFxuICogQHBhcmFtIHtzdHJpbmd9IGFwaUtleSAtIFlvdXIgQVBJIGtleSwgZm91bmQgaW4geW91ciBkYXNoYm9hcmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c11cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lb3V0PTIwMDBdIC0gVGhlIHJlcXVlc3QgdGltZW91dCBzZXQgaW4gbWlsbGlzZWNvbmRzLFxuICogYW5vdGhlciByZXF1ZXN0IHdpbGwgYmUgaXNzdWVkIGFmdGVyIHRoaXMgdGltZW91dFxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnByb3RvY29sPSdodHRwOiddIC0gVGhlIHByb3RvY29sIHVzZWQgdG8gcXVlcnkgQWxnb2xpYSBTZWFyY2ggQVBJLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2V0IHRvICdodHRwczonIHRvIGZvcmNlIHVzaW5nIGh0dHBzLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdCB0byBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCBpbiBicm93c2Vyc1xuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IFtvcHRzLmhvc3RzPXtcbiAqICAgICAgICAgICByZWFkOiBbdGhpcy5hcHBsaWNhdGlvbklEICsgJy1kc24uYWxnb2xpYS5uZXQnXS5jb25jYXQoW1xuICogICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbklEICsgJy0xLmFsZ29saWFuZXQuY29tJyxcbiAqICAgICAgICAgICAgIHRoaXMuYXBwbGljYXRpb25JRCArICctMi5hbGdvbGlhbmV0LmNvbScsXG4gKiAgICAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLTMuYWxnb2xpYW5ldC5jb20nXVxuICogICAgICAgICAgIF0pLFxuICogICAgICAgICAgIHdyaXRlOiBbdGhpcy5hcHBsaWNhdGlvbklEICsgJy5hbGdvbGlhLm5ldCddLmNvbmNhdChbXG4gKiAgICAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uSUQgKyAnLTEuYWxnb2xpYW5ldC5jb20nLFxuICogICAgICAgICAgICAgdGhpcy5hcHBsaWNhdGlvbklEICsgJy0yLmFsZ29saWFuZXQuY29tJyxcbiAqICAgICAgICAgICAgIHRoaXMuYXBwbGljYXRpb25JRCArICctMy5hbGdvbGlhbmV0LmNvbSddXG4gKiAgICAgICAgICAgXSkgLSBUaGUgaG9zdHMgdG8gdXNlIGZvciBBbGdvbGlhIFNlYXJjaCBBUEkuXG4gKiAgICAgICAgICAgSWYgeW91IHByb3ZpZGUgdGhlbSwgeW91IHdpbGwgbGVzcyBiZW5lZml0IGZyb20gb3VyIEhBIGltcGxlbWVudGF0aW9uXG4gKi9cbmZ1bmN0aW9uIEFsZ29saWFTZWFyY2hDb3JlKGFwcGxpY2F0aW9uSUQsIGFwaUtleSwgb3B0cykge1xuICB2YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhbGdvbGlhc2VhcmNoJyk7XG5cbiAgdmFyIGNsb25lID0gcmVxdWlyZSgnLi9jbG9uZS5qcycpO1xuICB2YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbiAgdmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwLmpzJyk7XG5cbiAgdmFyIHVzYWdlID0gJ1VzYWdlOiBhbGdvbGlhc2VhcmNoKGFwcGxpY2F0aW9uSUQsIGFwaUtleSwgb3B0cyknO1xuXG4gIGlmIChvcHRzLl9hbGxvd0VtcHR5Q3JlZGVudGlhbHMgIT09IHRydWUgJiYgIWFwcGxpY2F0aW9uSUQpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkFsZ29saWFTZWFyY2hFcnJvcignUGxlYXNlIHByb3ZpZGUgYW4gYXBwbGljYXRpb24gSUQuICcgKyB1c2FnZSk7XG4gIH1cblxuICBpZiAob3B0cy5fYWxsb3dFbXB0eUNyZWRlbnRpYWxzICE9PSB0cnVlICYmICFhcGlLZXkpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkFsZ29saWFTZWFyY2hFcnJvcignUGxlYXNlIHByb3ZpZGUgYW4gQVBJIGtleS4gJyArIHVzYWdlKTtcbiAgfVxuXG4gIHRoaXMuYXBwbGljYXRpb25JRCA9IGFwcGxpY2F0aW9uSUQ7XG4gIHRoaXMuYXBpS2V5ID0gYXBpS2V5O1xuXG4gIHRoaXMuaG9zdHMgPSB7XG4gICAgcmVhZDogW10sXG4gICAgd3JpdGU6IFtdXG4gIH07XG5cbiAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgdmFyIHByb3RvY29sID0gb3B0cy5wcm90b2NvbCB8fCAnaHR0cHM6JztcbiAgdGhpcy5fdGltZW91dHMgPSBvcHRzLnRpbWVvdXRzIHx8IHtcbiAgICBjb25uZWN0OiAxICogMTAwMCwgLy8gNTAwbXMgY29ubmVjdCBpcyBHUFJTIGxhdGVuY3lcbiAgICByZWFkOiAyICogMTAwMCxcbiAgICB3cml0ZTogMzAgKiAxMDAwXG4gIH07XG5cbiAgLy8gYmFja3dhcmQgY29tcGF0LCBpZiBvcHRzLnRpbWVvdXQgaXMgcGFzc2VkLCB3ZSB1c2UgaXQgdG8gY29uZmlndXJlIGFsbCB0aW1lb3V0cyBsaWtlIGJlZm9yZVxuICBpZiAob3B0cy50aW1lb3V0KSB7XG4gICAgdGhpcy5fdGltZW91dHMuY29ubmVjdCA9IHRoaXMuX3RpbWVvdXRzLnJlYWQgPSB0aGlzLl90aW1lb3V0cy53cml0ZSA9IG9wdHMudGltZW91dDtcbiAgfVxuXG4gIC8vIHdoaWxlIHdlIGFkdm9jYXRlIGZvciBjb2xvbi1hdC10aGUtZW5kIHZhbHVlczogJ2h0dHA6JyBmb3IgYG9wdHMucHJvdG9jb2xgXG4gIC8vIHdlIGFsc28gYWNjZXB0IGBodHRwYCBhbmQgYGh0dHBzYC4gSXQncyBhIGNvbW1vbiBlcnJvci5cbiAgaWYgKCEvOiQvLnRlc3QocHJvdG9jb2wpKSB7XG4gICAgcHJvdG9jb2wgPSBwcm90b2NvbCArICc6JztcbiAgfVxuXG4gIGlmIChvcHRzLnByb3RvY29sICE9PSAnaHR0cDonICYmIG9wdHMucHJvdG9jb2wgIT09ICdodHRwczonKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5BbGdvbGlhU2VhcmNoRXJyb3IoJ3Byb3RvY29sIG11c3QgYmUgYGh0dHA6YCBvciBgaHR0cHM6YCAod2FzIGAnICsgb3B0cy5wcm90b2NvbCArICdgKScpO1xuICB9XG5cbiAgdGhpcy5fY2hlY2tBcHBJZERhdGEoKTtcblxuICBpZiAoIW9wdHMuaG9zdHMpIHtcbiAgICB2YXIgZGVmYXVsdEhvc3RzID0gbWFwKHRoaXMuX3NodWZmbGVSZXN1bHQsIGZ1bmN0aW9uKGhvc3ROdW1iZXIpIHtcbiAgICAgIHJldHVybiBhcHBsaWNhdGlvbklEICsgJy0nICsgaG9zdE51bWJlciArICcuYWxnb2xpYW5ldC5jb20nO1xuICAgIH0pO1xuXG4gICAgLy8gbm8gaG9zdHMgZ2l2ZW4sIGNvbXB1dGUgZGVmYXVsdHNcbiAgICB0aGlzLmhvc3RzLnJlYWQgPSBbdGhpcy5hcHBsaWNhdGlvbklEICsgJy1kc24uYWxnb2xpYS5uZXQnXS5jb25jYXQoZGVmYXVsdEhvc3RzKTtcbiAgICB0aGlzLmhvc3RzLndyaXRlID0gW3RoaXMuYXBwbGljYXRpb25JRCArICcuYWxnb2xpYS5uZXQnXS5jb25jYXQoZGVmYXVsdEhvc3RzKTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KG9wdHMuaG9zdHMpKSB7XG4gICAgLy8gd2hlbiBwYXNzaW5nIGN1c3RvbSBob3N0cywgd2UgbmVlZCB0byBoYXZlIGEgZGlmZmVyZW50IGhvc3QgaW5kZXggaWYgdGhlIG51bWJlclxuICAgIC8vIG9mIHdyaXRlL3JlYWQgaG9zdHMgYXJlIGRpZmZlcmVudC5cbiAgICB0aGlzLmhvc3RzLnJlYWQgPSBjbG9uZShvcHRzLmhvc3RzKTtcbiAgICB0aGlzLmhvc3RzLndyaXRlID0gY2xvbmUob3B0cy5ob3N0cyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ob3N0cy5yZWFkID0gY2xvbmUob3B0cy5ob3N0cy5yZWFkKTtcbiAgICB0aGlzLmhvc3RzLndyaXRlID0gY2xvbmUob3B0cy5ob3N0cy53cml0ZSk7XG4gIH1cblxuICAvLyBhZGQgcHJvdG9jb2wgYW5kIGxvd2VyY2FzZSBob3N0c1xuICB0aGlzLmhvc3RzLnJlYWQgPSBtYXAodGhpcy5ob3N0cy5yZWFkLCBwcmVwYXJlSG9zdChwcm90b2NvbCkpO1xuICB0aGlzLmhvc3RzLndyaXRlID0gbWFwKHRoaXMuaG9zdHMud3JpdGUsIHByZXBhcmVIb3N0KHByb3RvY29sKSk7XG5cbiAgdGhpcy5leHRyYUhlYWRlcnMgPSBbXTtcblxuICAvLyBJbiBzb21lIHNpdHVhdGlvbnMgeW91IG1pZ2h0IHdhbnQgdG8gd2FybSB0aGUgY2FjaGVcbiAgdGhpcy5jYWNoZSA9IG9wdHMuX2NhY2hlIHx8IHt9O1xuXG4gIHRoaXMuX3VhID0gb3B0cy5fdWE7XG4gIHRoaXMuX3VzZUNhY2hlID0gb3B0cy5fdXNlQ2FjaGUgPT09IHVuZGVmaW5lZCB8fCBvcHRzLl9jYWNoZSA/IHRydWUgOiBvcHRzLl91c2VDYWNoZTtcbiAgdGhpcy5fdXNlRmFsbGJhY2sgPSBvcHRzLnVzZUZhbGxiYWNrID09PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0cy51c2VGYWxsYmFjaztcblxuICB0aGlzLl9zZXRUaW1lb3V0ID0gb3B0cy5fc2V0VGltZW91dDtcblxuICBkZWJ1ZygnaW5pdCBkb25lLCAlaicsIHRoaXMpO1xufVxuXG4vKlxuICogR2V0IHRoZSBpbmRleCBvYmplY3QgaW5pdGlhbGl6ZWRcbiAqXG4gKiBAcGFyYW0gaW5kZXhOYW1lIHRoZSBuYW1lIG9mIGluZGV4XG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIHJlc3VsdCBjYWxsYmFjayB3aXRoIG9uZSBhcmd1bWVudCAodGhlIEluZGV4IGluc3RhbmNlKVxuICovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuaW5pdEluZGV4ID0gZnVuY3Rpb24oaW5kZXhOYW1lKSB7XG4gIHJldHVybiBuZXcgSW5kZXhDb3JlKHRoaXMsIGluZGV4TmFtZSk7XG59O1xuXG4vKipcbiogQWRkIGFuIGV4dHJhIGZpZWxkIHRvIHRoZSBIVFRQIHJlcXVlc3RcbipcbiogQHBhcmFtIG5hbWUgdGhlIGhlYWRlciBmaWVsZCBuYW1lXG4qIEBwYXJhbSB2YWx1ZSB0aGUgaGVhZGVyIGZpZWxkIHZhbHVlXG4qL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLnNldEV4dHJhSGVhZGVyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5leHRyYUhlYWRlcnMucHVzaCh7XG4gICAgbmFtZTogbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZTogdmFsdWVcbiAgfSk7XG59O1xuXG4vKipcbiogQXVnbWVudCBzZW50IHgtYWxnb2xpYS1hZ2VudCB3aXRoIG1vcmUgZGF0YSwgZWFjaCBhZ2VudCBwYXJ0XG4qIGlzIGF1dG9tYXRpY2FsbHkgc2VwYXJhdGVkIGZyb20gdGhlIG90aGVycyBieSBhIHNlbWljb2xvbjtcbipcbiogQHBhcmFtIGFsZ29saWFBZ2VudCB0aGUgYWdlbnQgdG8gYWRkXG4qL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLmFkZEFsZ29saWFBZ2VudCA9IGZ1bmN0aW9uKGFsZ29saWFBZ2VudCkge1xuICB0aGlzLl91YSArPSAnOycgKyBhbGdvbGlhQWdlbnQ7XG59O1xuXG4vKlxuICogV3JhcHBlciB0aGF0IHRyeSBhbGwgaG9zdHMgdG8gbWF4aW1pemUgdGhlIHF1YWxpdHkgb2Ygc2VydmljZVxuICovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX2pzb25SZXF1ZXN0ID0gZnVuY3Rpb24oaW5pdGlhbE9wdHMpIHtcbiAgdGhpcy5fY2hlY2tBcHBJZERhdGEoKTtcblxuICB2YXIgcmVxdWVzdERlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYWxnb2xpYXNlYXJjaDonICsgaW5pdGlhbE9wdHMudXJsKTtcblxuICB2YXIgYm9keTtcbiAgdmFyIGNhY2hlID0gaW5pdGlhbE9wdHMuY2FjaGU7XG4gIHZhciBjbGllbnQgPSB0aGlzO1xuICB2YXIgdHJpZXMgPSAwO1xuICB2YXIgdXNpbmdGYWxsYmFjayA9IGZhbHNlO1xuICB2YXIgaGFzRmFsbGJhY2sgPSBjbGllbnQuX3VzZUZhbGxiYWNrICYmIGNsaWVudC5fcmVxdWVzdC5mYWxsYmFjayAmJiBpbml0aWFsT3B0cy5mYWxsYmFjaztcbiAgdmFyIGhlYWRlcnM7XG5cbiAgaWYgKFxuICAgIHRoaXMuYXBpS2V5Lmxlbmd0aCA+IE1BWF9BUElfS0VZX0xFTkdUSCAmJlxuICAgIGluaXRpYWxPcHRzLmJvZHkgIT09IHVuZGVmaW5lZCAmJlxuICAgIChpbml0aWFsT3B0cy5ib2R5LnBhcmFtcyAhPT0gdW5kZWZpbmVkIHx8IC8vIGluZGV4LnNlYXJjaCgpXG4gICAgaW5pdGlhbE9wdHMuYm9keS5yZXF1ZXN0cyAhPT0gdW5kZWZpbmVkKSAvLyBjbGllbnQuc2VhcmNoKClcbiAgKSB7XG4gICAgaW5pdGlhbE9wdHMuYm9keS5hcGlLZXkgPSB0aGlzLmFwaUtleTtcbiAgICBoZWFkZXJzID0gdGhpcy5fY29tcHV0ZVJlcXVlc3RIZWFkZXJzKGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBoZWFkZXJzID0gdGhpcy5fY29tcHV0ZVJlcXVlc3RIZWFkZXJzKCk7XG4gIH1cblxuICBpZiAoaW5pdGlhbE9wdHMuYm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYm9keSA9IHNhZmVKU09OU3RyaW5naWZ5KGluaXRpYWxPcHRzLmJvZHkpO1xuICB9XG5cbiAgcmVxdWVzdERlYnVnKCdyZXF1ZXN0IHN0YXJ0Jyk7XG4gIHZhciBkZWJ1Z0RhdGEgPSBbXTtcblxuICBmdW5jdGlvbiBkb1JlcXVlc3QocmVxdWVzdGVyLCByZXFPcHRzKSB7XG4gICAgY2xpZW50Ll9jaGVja0FwcElkRGF0YSgpO1xuXG4gICAgdmFyIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGNhY2hlSUQ7XG5cbiAgICBpZiAoY2xpZW50Ll91c2VDYWNoZSkge1xuICAgICAgY2FjaGVJRCA9IGluaXRpYWxPcHRzLnVybDtcbiAgICB9XG5cbiAgICAvLyBhcyB3ZSBzb21ldGltZSB1c2UgUE9TVCByZXF1ZXN0cyB0byBwYXNzIHBhcmFtZXRlcnMgKGxpa2UgcXVlcnk9J2FhJyksXG4gICAgLy8gdGhlIGNhY2hlSUQgbXVzdCBhbHNvIGluY2x1ZGUgdGhlIGJvZHkgdG8gYmUgZGlmZmVyZW50IGJldHdlZW4gY2FsbHNcbiAgICBpZiAoY2xpZW50Ll91c2VDYWNoZSAmJiBib2R5KSB7XG4gICAgICBjYWNoZUlEICs9ICdfYm9keV8nICsgcmVxT3B0cy5ib2R5O1xuICAgIH1cblxuICAgIC8vIGhhbmRsZSBjYWNoZSBleGlzdGVuY2VcbiAgICBpZiAoY2xpZW50Ll91c2VDYWNoZSAmJiBjYWNoZSAmJiBjYWNoZVtjYWNoZUlEXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXF1ZXN0RGVidWcoJ3NlcnZpbmcgcmVzcG9uc2UgZnJvbSBjYWNoZScpO1xuICAgICAgcmV0dXJuIGNsaWVudC5fcHJvbWlzZS5yZXNvbHZlKEpTT04ucGFyc2UoY2FjaGVbY2FjaGVJRF0pKTtcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSByZWFjaGVkIG1heCB0cmllc1xuICAgIGlmICh0cmllcyA+PSBjbGllbnQuaG9zdHNbaW5pdGlhbE9wdHMuaG9zdFR5cGVdLmxlbmd0aCkge1xuICAgICAgaWYgKCFoYXNGYWxsYmFjayB8fCB1c2luZ0ZhbGxiYWNrKSB7XG4gICAgICAgIHJlcXVlc3REZWJ1ZygnY291bGQgbm90IGdldCBhbnkgcmVzcG9uc2UnKTtcbiAgICAgICAgLy8gdGhlbiBzdG9wXG4gICAgICAgIHJldHVybiBjbGllbnQuX3Byb21pc2UucmVqZWN0KG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgY29ubmVjdCB0byB0aGUgQWxnb2xpYVNlYXJjaCBBUEkuJyArXG4gICAgICAgICAgJyBTZW5kIGFuIGVtYWlsIHRvIHN1cHBvcnRAYWxnb2xpYS5jb20gdG8gcmVwb3J0IGFuZCByZXNvbHZlIHRoZSBpc3N1ZS4nICtcbiAgICAgICAgICAnIEFwcGxpY2F0aW9uIGlkIHdhczogJyArIGNsaWVudC5hcHBsaWNhdGlvbklELCB7ZGVidWdEYXRhOiBkZWJ1Z0RhdGF9XG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0RGVidWcoJ3N3aXRjaGluZyB0byBmYWxsYmFjaycpO1xuXG4gICAgICAvLyBsZXQncyB0cnkgdGhlIGZhbGxiYWNrIHN0YXJ0aW5nIGZyb20gaGVyZVxuICAgICAgdHJpZXMgPSAwO1xuXG4gICAgICAvLyBtZXRob2QsIHVybCBhbmQgYm9keSBhcmUgZmFsbGJhY2sgZGVwZW5kZW50XG4gICAgICByZXFPcHRzLm1ldGhvZCA9IGluaXRpYWxPcHRzLmZhbGxiYWNrLm1ldGhvZDtcbiAgICAgIHJlcU9wdHMudXJsID0gaW5pdGlhbE9wdHMuZmFsbGJhY2sudXJsO1xuICAgICAgcmVxT3B0cy5qc29uQm9keSA9IGluaXRpYWxPcHRzLmZhbGxiYWNrLmJvZHk7XG4gICAgICBpZiAocmVxT3B0cy5qc29uQm9keSkge1xuICAgICAgICByZXFPcHRzLmJvZHkgPSBzYWZlSlNPTlN0cmluZ2lmeShyZXFPcHRzLmpzb25Cb2R5KTtcbiAgICAgIH1cbiAgICAgIC8vIHJlLWNvbXB1dGUgaGVhZGVycywgdGhleSBjb3VsZCBiZSBvbWl0dGluZyB0aGUgQVBJIEtFWVxuICAgICAgaGVhZGVycyA9IGNsaWVudC5fY29tcHV0ZVJlcXVlc3RIZWFkZXJzKCk7XG5cbiAgICAgIHJlcU9wdHMudGltZW91dHMgPSBjbGllbnQuX2dldFRpbWVvdXRzRm9yUmVxdWVzdChpbml0aWFsT3B0cy5ob3N0VHlwZSk7XG4gICAgICBjbGllbnQuX3NldEhvc3RJbmRleEJ5VHlwZSgwLCBpbml0aWFsT3B0cy5ob3N0VHlwZSk7XG4gICAgICB1c2luZ0ZhbGxiYWNrID0gdHJ1ZTsgLy8gdGhlIGN1cnJlbnQgcmVxdWVzdCBpcyBub3cgdXNpbmcgZmFsbGJhY2tcbiAgICAgIHJldHVybiBkb1JlcXVlc3QoY2xpZW50Ll9yZXF1ZXN0LmZhbGxiYWNrLCByZXFPcHRzKTtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudEhvc3QgPSBjbGllbnQuX2dldEhvc3RCeVR5cGUoaW5pdGlhbE9wdHMuaG9zdFR5cGUpO1xuXG4gICAgdmFyIHVybCA9IGN1cnJlbnRIb3N0ICsgcmVxT3B0cy51cmw7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBib2R5OiByZXFPcHRzLmJvZHksXG4gICAgICBqc29uQm9keTogcmVxT3B0cy5qc29uQm9keSxcbiAgICAgIG1ldGhvZDogcmVxT3B0cy5tZXRob2QsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgdGltZW91dHM6IHJlcU9wdHMudGltZW91dHMsXG4gICAgICBkZWJ1ZzogcmVxdWVzdERlYnVnXG4gICAgfTtcblxuICAgIHJlcXVlc3REZWJ1ZygnbWV0aG9kOiAlcywgdXJsOiAlcywgaGVhZGVyczogJWosIHRpbWVvdXRzOiAlZCcsXG4gICAgICBvcHRpb25zLm1ldGhvZCwgdXJsLCBvcHRpb25zLmhlYWRlcnMsIG9wdGlvbnMudGltZW91dHMpO1xuXG4gICAgaWYgKHJlcXVlc3RlciA9PT0gY2xpZW50Ll9yZXF1ZXN0LmZhbGxiYWNrKSB7XG4gICAgICByZXF1ZXN0RGVidWcoJ3VzaW5nIGZhbGxiYWNrJyk7XG4gICAgfVxuXG4gICAgLy8gYHJlcXVlc3RlcmAgaXMgYW55IG9mIHRoaXMuX3JlcXVlc3Qgb3IgdGhpcy5fcmVxdWVzdC5mYWxsYmFja1xuICAgIC8vIHRodXMgaXQgbmVlZHMgdG8gYmUgY2FsbGVkIHVzaW5nIHRoZSBjbGllbnQgYXMgY29udGV4dFxuICAgIHJldHVybiByZXF1ZXN0ZXIuY2FsbChjbGllbnQsIHVybCwgb3B0aW9ucykudGhlbihzdWNjZXNzLCB0cnlGYWxsYmFjayk7XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzKGh0dHBSZXNwb25zZSkge1xuICAgICAgLy8gY29tcHV0ZSB0aGUgc3RhdHVzIG9mIHRoZSByZXNwb25zZSxcbiAgICAgIC8vXG4gICAgICAvLyBXaGVuIGluIGJyb3dzZXIgbW9kZSwgdXNpbmcgWERSIG9yIEpTT05QLCB3ZSBoYXZlIG5vIHN0YXR1c0NvZGUgYXZhaWxhYmxlXG4gICAgICAvLyBTbyB3ZSByZWx5IG9uIG91ciBBUEkgcmVzcG9uc2UgYHN0YXR1c2AgcHJvcGVydHkuXG4gICAgICAvLyBCdXQgYHdhaXRUYXNrYCBjYW4gc2V0IGEgYHN0YXR1c2AgcHJvcGVydHkgd2hpY2ggaXMgbm90IHRoZSBzdGF0dXNDb2RlIChpdCdzIHRoZSB0YXNrIHN0YXR1cylcbiAgICAgIC8vIFNvIHdlIGNoZWNrIGlmIHRoZXJlJ3MgYSBgbWVzc2FnZWAgYWxvbmcgYHN0YXR1c2AgYW5kIGl0IG1lYW5zIGl0J3MgYW4gZXJyb3JcbiAgICAgIC8vXG4gICAgICAvLyBUaGF0J3MgdGhlIG9ubHkgY2FzZSB3aGVyZSB3ZSBoYXZlIGEgcmVzcG9uc2Uuc3RhdHVzIHRoYXQncyBub3QgdGhlIGh0dHAgc3RhdHVzQ29kZVxuICAgICAgdmFyIHN0YXR1cyA9IGh0dHBSZXNwb25zZSAmJiBodHRwUmVzcG9uc2UuYm9keSAmJiBodHRwUmVzcG9uc2UuYm9keS5tZXNzYWdlICYmIGh0dHBSZXNwb25zZS5ib2R5LnN0YXR1cyB8fFxuXG4gICAgICAgIC8vIHRoaXMgaXMgaW1wb3J0YW50IHRvIGNoZWNrIHRoZSByZXF1ZXN0IHN0YXR1c0NvZGUgQUZURVIgdGhlIGJvZHkgZXZlbnR1YWxcbiAgICAgICAgLy8gc3RhdHVzQ29kZSBiZWNhdXNlIHNvbWUgaW1wbGVtZW50YXRpb25zIChqUXVlcnkgWERvbWFpblJlcXVlc3QgdHJhbnNwb3J0KSBtYXlcbiAgICAgICAgLy8gc2VuZCBzdGF0dXNDb2RlIDIwMCB3aGlsZSB3ZSBoYWQgYW4gZXJyb3JcbiAgICAgICAgaHR0cFJlc3BvbnNlLnN0YXR1c0NvZGUgfHxcblxuICAgICAgICAvLyBXaGVuIGluIGJyb3dzZXIgbW9kZSwgdXNpbmcgWERSIG9yIEpTT05QXG4gICAgICAgIC8vIHdlIGRlZmF1bHQgdG8gc3VjY2VzcyB3aGVuIG5vIGVycm9yIChubyByZXNwb25zZS5zdGF0dXMgJiYgcmVzcG9uc2UubWVzc2FnZSlcbiAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGEgSlNPTi5wYXJzZSgpIGVycm9yIHRoZW4gYm9keSBpcyBudWxsIGFuZCBpdCBmYWlsc1xuICAgICAgICBodHRwUmVzcG9uc2UgJiYgaHR0cFJlc3BvbnNlLmJvZHkgJiYgMjAwO1xuXG4gICAgICByZXF1ZXN0RGVidWcoJ3JlY2VpdmVkIHJlc3BvbnNlOiBzdGF0dXNDb2RlOiAlcywgY29tcHV0ZWQgc3RhdHVzQ29kZTogJWQsIGhlYWRlcnM6ICVqJyxcbiAgICAgICAgaHR0cFJlc3BvbnNlLnN0YXR1c0NvZGUsIHN0YXR1cywgaHR0cFJlc3BvbnNlLmhlYWRlcnMpO1xuXG4gICAgICB2YXIgaHR0cFJlc3BvbnNlT2sgPSBNYXRoLmZsb29yKHN0YXR1cyAvIDEwMCkgPT09IDI7XG5cbiAgICAgIHZhciBlbmRUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgIGRlYnVnRGF0YS5wdXNoKHtcbiAgICAgICAgY3VycmVudEhvc3Q6IGN1cnJlbnRIb3N0LFxuICAgICAgICBoZWFkZXJzOiByZW1vdmVDcmVkZW50aWFscyhoZWFkZXJzKSxcbiAgICAgICAgY29udGVudDogYm9keSB8fCBudWxsLFxuICAgICAgICBjb250ZW50TGVuZ3RoOiBib2R5ICE9PSB1bmRlZmluZWQgPyBib2R5Lmxlbmd0aCA6IG51bGwsXG4gICAgICAgIG1ldGhvZDogcmVxT3B0cy5tZXRob2QsXG4gICAgICAgIHRpbWVvdXRzOiByZXFPcHRzLnRpbWVvdXRzLFxuICAgICAgICB1cmw6IHJlcU9wdHMudXJsLFxuICAgICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZTogZW5kVGltZSxcbiAgICAgICAgZHVyYXRpb246IGVuZFRpbWUgLSBzdGFydFRpbWUsXG4gICAgICAgIHN0YXR1c0NvZGU6IHN0YXR1c1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChodHRwUmVzcG9uc2VPaykge1xuICAgICAgICBpZiAoY2xpZW50Ll91c2VDYWNoZSAmJiBjYWNoZSkge1xuICAgICAgICAgIGNhY2hlW2NhY2hlSURdID0gaHR0cFJlc3BvbnNlLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBodHRwUmVzcG9uc2UuYm9keTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNob3VsZFJldHJ5ID0gTWF0aC5mbG9vcihzdGF0dXMgLyAxMDApICE9PSA0O1xuXG4gICAgICBpZiAoc2hvdWxkUmV0cnkpIHtcbiAgICAgICAgdHJpZXMgKz0gMTtcbiAgICAgICAgcmV0dXJuIHJldHJ5UmVxdWVzdCgpO1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0RGVidWcoJ3VucmVjb3ZlcmFibGUgZXJyb3InKTtcblxuICAgICAgLy8gbm8gc3VjY2VzcyBhbmQgbm8gcmV0cnkgPT4gZmFpbFxuICAgICAgdmFyIHVucmVjb3ZlcmFibGVFcnJvciA9IG5ldyBlcnJvcnMuQWxnb2xpYVNlYXJjaEVycm9yKFxuICAgICAgICBodHRwUmVzcG9uc2UuYm9keSAmJiBodHRwUmVzcG9uc2UuYm9keS5tZXNzYWdlLCB7ZGVidWdEYXRhOiBkZWJ1Z0RhdGEsIHN0YXR1c0NvZGU6IHN0YXR1c31cbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBjbGllbnQuX3Byb21pc2UucmVqZWN0KHVucmVjb3ZlcmFibGVFcnJvcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJ5RmFsbGJhY2soZXJyKSB7XG4gICAgICAvLyBlcnJvciBjYXNlczpcbiAgICAgIC8vICBXaGlsZSBub3QgaW4gZmFsbGJhY2sgbW9kZTpcbiAgICAgIC8vICAgIC0gQ09SUyBub3Qgc3VwcG9ydGVkXG4gICAgICAvLyAgICAtIG5ldHdvcmsgZXJyb3JcbiAgICAgIC8vICBXaGlsZSBpbiBmYWxsYmFjayBtb2RlOlxuICAgICAgLy8gICAgLSB0aW1lb3V0XG4gICAgICAvLyAgICAtIG5ldHdvcmsgZXJyb3JcbiAgICAgIC8vICAgIC0gYmFkbHkgZm9ybWF0dGVkIEpTT05QIChzY3JpcHQgbG9hZGVkLCBkaWQgbm90IGNhbGwgb3VyIGNhbGxiYWNrKVxuICAgICAgLy8gIEluIGJvdGggY2FzZXM6XG4gICAgICAvLyAgICAtIHVuY2F1Z2h0IGV4Y2VwdGlvbiBvY2N1cnMgKFR5cGVFcnJvcilcbiAgICAgIHJlcXVlc3REZWJ1ZygnZXJyb3I6ICVzLCBzdGFjazogJXMnLCBlcnIubWVzc2FnZSwgZXJyLnN0YWNrKTtcblxuICAgICAgdmFyIGVuZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGVidWdEYXRhLnB1c2goe1xuICAgICAgICBjdXJyZW50SG9zdDogY3VycmVudEhvc3QsXG4gICAgICAgIGhlYWRlcnM6IHJlbW92ZUNyZWRlbnRpYWxzKGhlYWRlcnMpLFxuICAgICAgICBjb250ZW50OiBib2R5IHx8IG51bGwsXG4gICAgICAgIGNvbnRlbnRMZW5ndGg6IGJvZHkgIT09IHVuZGVmaW5lZCA/IGJvZHkubGVuZ3RoIDogbnVsbCxcbiAgICAgICAgbWV0aG9kOiByZXFPcHRzLm1ldGhvZCxcbiAgICAgICAgdGltZW91dHM6IHJlcU9wdHMudGltZW91dHMsXG4gICAgICAgIHVybDogcmVxT3B0cy51cmwsXG4gICAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lOiBlbmRUaW1lLFxuICAgICAgICBkdXJhdGlvbjogZW5kVGltZSAtIHN0YXJ0VGltZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghKGVyciBpbnN0YW5jZW9mIGVycm9ycy5BbGdvbGlhU2VhcmNoRXJyb3IpKSB7XG4gICAgICAgIGVyciA9IG5ldyBlcnJvcnMuVW5rbm93bihlcnIgJiYgZXJyLm1lc3NhZ2UsIGVycik7XG4gICAgICB9XG5cbiAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgIC8vIHN0b3AgdGhlIHJlcXVlc3QgaW1wbGVtZW50YXRpb24gd2hlbjpcbiAgICAgIGlmIChcbiAgICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSB0aGlzIGVycm9yLFxuICAgICAgICAvLyBpdCBjb21lcyBmcm9tIGEgdGhyb3cgaW4gc29tZSBvdGhlciBwaWVjZSBvZiBjb2RlXG4gICAgICAgIGVyciBpbnN0YW5jZW9mIGVycm9ycy5Vbmtub3duIHx8XG5cbiAgICAgICAgLy8gc2VydmVyIHNlbnQgdW5wYXJzYWJsZSBKU09OXG4gICAgICAgIGVyciBpbnN0YW5jZW9mIGVycm9ycy5VbnBhcnNhYmxlSlNPTiB8fFxuXG4gICAgICAgIC8vIG1heCB0cmllcyBhbmQgYWxyZWFkeSB1c2luZyBmYWxsYmFjayBvciBubyBmYWxsYmFja1xuICAgICAgICB0cmllcyA+PSBjbGllbnQuaG9zdHNbaW5pdGlhbE9wdHMuaG9zdFR5cGVdLmxlbmd0aCAmJlxuICAgICAgICAodXNpbmdGYWxsYmFjayB8fCAhaGFzRmFsbGJhY2spKSB7XG4gICAgICAgIC8vIHN0b3AgcmVxdWVzdCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhpcyBjb21tYW5kXG4gICAgICAgIGVyci5kZWJ1Z0RhdGEgPSBkZWJ1Z0RhdGE7XG4gICAgICAgIHJldHVybiBjbGllbnQuX3Byb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoZW4gYSB0aW1lb3V0IG9jY3VyZWQsIHJldHJ5IGJ5IHJhaXNpbmcgdGltZW91dFxuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIGVycm9ycy5SZXF1ZXN0VGltZW91dCkge1xuICAgICAgICByZXR1cm4gcmV0cnlSZXF1ZXN0V2l0aEhpZ2hlclRpbWVvdXQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldHJ5UmVxdWVzdCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldHJ5UmVxdWVzdCgpIHtcbiAgICAgIHJlcXVlc3REZWJ1ZygncmV0cnlpbmcgcmVxdWVzdCcpO1xuICAgICAgY2xpZW50Ll9pbmNyZW1lbnRIb3N0SW5kZXgoaW5pdGlhbE9wdHMuaG9zdFR5cGUpO1xuICAgICAgcmV0dXJuIGRvUmVxdWVzdChyZXF1ZXN0ZXIsIHJlcU9wdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldHJ5UmVxdWVzdFdpdGhIaWdoZXJUaW1lb3V0KCkge1xuICAgICAgcmVxdWVzdERlYnVnKCdyZXRyeWluZyByZXF1ZXN0IHdpdGggaGlnaGVyIHRpbWVvdXQnKTtcbiAgICAgIGNsaWVudC5faW5jcmVtZW50SG9zdEluZGV4KGluaXRpYWxPcHRzLmhvc3RUeXBlKTtcbiAgICAgIGNsaWVudC5faW5jcmVtZW50VGltZW91dE11bHRpcGxlcigpO1xuICAgICAgcmVxT3B0cy50aW1lb3V0cyA9IGNsaWVudC5fZ2V0VGltZW91dHNGb3JSZXF1ZXN0KGluaXRpYWxPcHRzLmhvc3RUeXBlKTtcbiAgICAgIHJldHVybiBkb1JlcXVlc3QocmVxdWVzdGVyLCByZXFPcHRzKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IGRvUmVxdWVzdChcbiAgICBjbGllbnQuX3JlcXVlc3QsIHtcbiAgICAgIHVybDogaW5pdGlhbE9wdHMudXJsLFxuICAgICAgbWV0aG9kOiBpbml0aWFsT3B0cy5tZXRob2QsXG4gICAgICBib2R5OiBib2R5LFxuICAgICAganNvbkJvZHk6IGluaXRpYWxPcHRzLmJvZHksXG4gICAgICB0aW1lb3V0czogY2xpZW50Ll9nZXRUaW1lb3V0c0ZvclJlcXVlc3QoaW5pdGlhbE9wdHMuaG9zdFR5cGUpXG4gICAgfVxuICApO1xuXG4gIC8vIGVpdGhlciB3ZSBoYXZlIGEgY2FsbGJhY2tcbiAgLy8gZWl0aGVyIHdlIGFyZSB1c2luZyBwcm9taXNlc1xuICBpZiAoaW5pdGlhbE9wdHMuY2FsbGJhY2spIHtcbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gb2tDYihjb250ZW50KSB7XG4gICAgICBleGl0UHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgaW5pdGlhbE9wdHMuY2FsbGJhY2sobnVsbCwgY29udGVudCk7XG4gICAgICB9LCBjbGllbnQuX3NldFRpbWVvdXQgfHwgc2V0VGltZW91dCk7XG4gICAgfSwgZnVuY3Rpb24gbm9va0NiKGVycikge1xuICAgICAgZXhpdFByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIGluaXRpYWxPcHRzLmNhbGxiYWNrKGVycik7XG4gICAgICB9LCBjbGllbnQuX3NldFRpbWVvdXQgfHwgc2V0VGltZW91dCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn07XG5cbi8qXG4qIFRyYW5zZm9ybSBzZWFyY2ggcGFyYW0gb2JqZWN0IGluIHF1ZXJ5IHN0cmluZ1xuKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fZ2V0U2VhcmNoUGFyYW1zID0gZnVuY3Rpb24oYXJncywgcGFyYW1zKSB7XG4gIGlmIChhcmdzID09PSB1bmRlZmluZWQgfHwgYXJncyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGFyZ3MpIHtcbiAgICBpZiAoa2V5ICE9PSBudWxsICYmIGFyZ3Nba2V5XSAhPT0gdW5kZWZpbmVkICYmIGFyZ3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcGFyYW1zICs9IHBhcmFtcyA9PT0gJycgPyAnJyA6ICcmJztcbiAgICAgIHBhcmFtcyArPSBrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3Nba2V5XSkgPT09ICdbb2JqZWN0IEFycmF5XScgPyBzYWZlSlNPTlN0cmluZ2lmeShhcmdzW2tleV0pIDogYXJnc1trZXldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcmFtcztcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fY29tcHV0ZVJlcXVlc3RIZWFkZXJzID0gZnVuY3Rpb24od2l0aEFQSUtleSkge1xuICB2YXIgZm9yRWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcblxuICB2YXIgcmVxdWVzdEhlYWRlcnMgPSB7XG4gICAgJ3gtYWxnb2xpYS1hZ2VudCc6IHRoaXMuX3VhLFxuICAgICd4LWFsZ29saWEtYXBwbGljYXRpb24taWQnOiB0aGlzLmFwcGxpY2F0aW9uSURcbiAgfTtcblxuICAvLyBicm93c2VyIHdpbGwgaW5saW5lIGhlYWRlcnMgaW4gdGhlIHVybCwgbm9kZS5qcyB3aWxsIHVzZSBodHRwIGhlYWRlcnNcbiAgLy8gYnV0IGluIHNvbWUgc2l0dWF0aW9ucywgdGhlIEFQSSBLRVkgd2lsbCBiZSB0b28gbG9uZyAoYmlnIHNlY3VyZWQgQVBJIGtleXMpXG4gIC8vIHNvIGlmIHRoZSByZXF1ZXN0IGlzIGEgUE9TVCBhbmQgdGhlIEtFWSBpcyB2ZXJ5IGxvbmcsIHdlIHdpbGwgYmUgYXNrZWQgdG8gbm90IHB1dFxuICAvLyBpdCBpbnRvIGhlYWRlcnMgYnV0IGluIHRoZSBKU09OIGJvZHlcbiAgaWYgKHdpdGhBUElLZXkgIT09IGZhbHNlKSB7XG4gICAgcmVxdWVzdEhlYWRlcnNbJ3gtYWxnb2xpYS1hcGkta2V5J10gPSB0aGlzLmFwaUtleTtcbiAgfVxuXG4gIGlmICh0aGlzLnVzZXJUb2tlbikge1xuICAgIHJlcXVlc3RIZWFkZXJzWyd4LWFsZ29saWEtdXNlcnRva2VuJ10gPSB0aGlzLnVzZXJUb2tlbjtcbiAgfVxuXG4gIGlmICh0aGlzLnNlY3VyaXR5VGFncykge1xuICAgIHJlcXVlc3RIZWFkZXJzWyd4LWFsZ29saWEtdGFnZmlsdGVycyddID0gdGhpcy5zZWN1cml0eVRhZ3M7XG4gIH1cblxuICBpZiAodGhpcy5leHRyYUhlYWRlcnMpIHtcbiAgICBmb3JFYWNoKHRoaXMuZXh0cmFIZWFkZXJzLCBmdW5jdGlvbiBhZGRUb1JlcXVlc3RIZWFkZXJzKGhlYWRlcikge1xuICAgICAgcmVxdWVzdEhlYWRlcnNbaGVhZGVyLm5hbWVdID0gaGVhZGVyLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVlc3RIZWFkZXJzO1xufTtcblxuLyoqXG4gKiBTZWFyY2ggdGhyb3VnaCBtdWx0aXBsZSBpbmRpY2VzIGF0IHRoZSBzYW1lIHRpbWVcbiAqIEBwYXJhbSAge09iamVjdFtdfSAgIHF1ZXJpZXMgIEFuIGFycmF5IG9mIHF1ZXJpZXMgeW91IHdhbnQgdG8gcnVuLlxuICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJpZXNbXS5pbmRleE5hbWUgVGhlIGluZGV4IG5hbWUgeW91IHdhbnQgdG8gdGFyZ2V0XG4gKiBAcGFyYW0ge3N0cmluZ30gW3F1ZXJpZXNbXS5xdWVyeV0gVGhlIHF1ZXJ5IHRvIGlzc3VlIG9uIHRoaXMgaW5kZXguIENhbiBhbHNvIGJlIHBhc3NlZCBpbnRvIGBwYXJhbXNgXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcmllc1tdLnBhcmFtcyBBbnkgc2VhcmNoIHBhcmFtIGxpa2UgaGl0c1BlclBhZ2UsIC4uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gYmUgY2FsbGVkXG4gKiBAcmV0dXJuIHtQcm9taXNlfHVuZGVmaW5lZH0gUmV0dXJucyBhIHByb21pc2UgaWYgbm8gY2FsbGJhY2sgZ2l2ZW5cbiAqL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uKHF1ZXJpZXMsIG9wdHMsIGNhbGxiYWNrKSB7XG4gIHZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpO1xuICB2YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAuanMnKTtcblxuICB2YXIgdXNhZ2UgPSAnVXNhZ2U6IGNsaWVudC5zZWFyY2goYXJyYXlPZlF1ZXJpZXNbLCBjYWxsYmFja10pJztcblxuICBpZiAoIWlzQXJyYXkocXVlcmllcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IodXNhZ2UpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfSBlbHNlIGlmIChvcHRzID09PSB1bmRlZmluZWQpIHtcbiAgICBvcHRzID0ge307XG4gIH1cblxuICB2YXIgY2xpZW50ID0gdGhpcztcblxuICB2YXIgcG9zdE9iaiA9IHtcbiAgICByZXF1ZXN0czogbWFwKHF1ZXJpZXMsIGZ1bmN0aW9uIHByZXBhcmVSZXF1ZXN0KHF1ZXJ5KSB7XG4gICAgICB2YXIgcGFyYW1zID0gJyc7XG5cbiAgICAgIC8vIGFsbG93IHF1ZXJ5LnF1ZXJ5XG4gICAgICAvLyBzbyB3ZSBhcmUgbWltaWNpbmcgdGhlIGluZGV4LnNlYXJjaChxdWVyeSwgcGFyYW1zKSBtZXRob2RcbiAgICAgIC8vIHtpbmRleE5hbWU6LCBxdWVyeTosIHBhcmFtczp9XG4gICAgICBpZiAocXVlcnkucXVlcnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJhbXMgKz0gJ3F1ZXJ5PScgKyBlbmNvZGVVUklDb21wb25lbnQocXVlcnkucXVlcnkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbmRleE5hbWU6IHF1ZXJ5LmluZGV4TmFtZSxcbiAgICAgICAgcGFyYW1zOiBjbGllbnQuX2dldFNlYXJjaFBhcmFtcyhxdWVyeS5wYXJhbXMsIHBhcmFtcylcbiAgICAgIH07XG4gICAgfSlcbiAgfTtcblxuICB2YXIgSlNPTlBQYXJhbXMgPSBtYXAocG9zdE9iai5yZXF1ZXN0cywgZnVuY3Rpb24gcHJlcGFyZUpTT05QUGFyYW1zKHJlcXVlc3QsIHJlcXVlc3RJZCkge1xuICAgIHJldHVybiByZXF1ZXN0SWQgKyAnPScgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICAnLzEvaW5kZXhlcy8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHJlcXVlc3QuaW5kZXhOYW1lKSArICc/JyArXG4gICAgICAgIHJlcXVlc3QucGFyYW1zXG4gICAgICApO1xuICB9KS5qb2luKCcmJyk7XG5cbiAgdmFyIHVybCA9ICcvMS9pbmRleGVzLyovcXVlcmllcyc7XG5cbiAgaWYgKG9wdHMuc3RyYXRlZ3kgIT09IHVuZGVmaW5lZCkge1xuICAgIHVybCArPSAnP3N0cmF0ZWd5PScgKyBvcHRzLnN0cmF0ZWd5O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2pzb25SZXF1ZXN0KHtcbiAgICBjYWNoZTogdGhpcy5jYWNoZSxcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICB1cmw6IHVybCxcbiAgICBib2R5OiBwb3N0T2JqLFxuICAgIGhvc3RUeXBlOiAncmVhZCcsXG4gICAgZmFsbGJhY2s6IHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvMS9pbmRleGVzLyonLFxuICAgICAgYm9keToge1xuICAgICAgICBwYXJhbXM6IEpTT05QUGFyYW1zXG4gICAgICB9XG4gICAgfSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSk7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgZXh0cmEgc2VjdXJpdHkgdGFnRmlsdGVycyBoZWFkZXJcbiAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB0YWdzIFRoZSBsaXN0IG9mIHRhZ3MgZGVmaW5pbmcgdGhlIGN1cnJlbnQgc2VjdXJpdHkgZmlsdGVyc1xuICovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuc2V0U2VjdXJpdHlUYWdzID0gZnVuY3Rpb24odGFncykge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhZ3MpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgdmFyIHN0clRhZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFnc1tpXSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgdmFyIG9yZWRUYWdzID0gW107XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGFnc1tpXS5sZW5ndGg7ICsraikge1xuICAgICAgICAgIG9yZWRUYWdzLnB1c2godGFnc1tpXVtqXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RyVGFncy5wdXNoKCcoJyArIG9yZWRUYWdzLmpvaW4oJywnKSArICcpJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHJUYWdzLnB1c2godGFnc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRhZ3MgPSBzdHJUYWdzLmpvaW4oJywnKTtcbiAgfVxuXG4gIHRoaXMuc2VjdXJpdHlUYWdzID0gdGFncztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBleHRyYSB1c2VyIHRva2VuIGhlYWRlclxuICogQHBhcmFtIHtzdHJpbmd9IHVzZXJUb2tlbiBUaGUgdG9rZW4gaWRlbnRpZnlpbmcgYSB1bmlxIHVzZXIgKHVzZWQgdG8gYXBwbHkgcmF0ZSBsaW1pdHMpXG4gKi9cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5zZXRVc2VyVG9rZW4gPSBmdW5jdGlvbih1c2VyVG9rZW4pIHtcbiAgdGhpcy51c2VyVG9rZW4gPSB1c2VyVG9rZW47XG59O1xuXG4vKipcbiAqIENsZWFyIGFsbCBxdWVyaWVzIGluIGNsaWVudCdzIGNhY2hlXG4gKiBAcmV0dXJuIHVuZGVmaW5lZFxuICovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuY2xlYXJDYWNoZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNhY2hlID0ge307XG59O1xuXG4vKipcbiogU2V0IHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGEgcmVxdWVzdCBjYW4gdGFrZSBiZWZvcmUgYXV0b21hdGljYWxseSBiZWluZyB0ZXJtaW5hdGVkLlxuKiBAZGVwcmVjYXRlZFxuKiBAcGFyYW0ge051bWJlcn0gbWlsbGlzZWNvbmRzXG4qL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLnNldFJlcXVlc3RUaW1lb3V0ID0gZnVuY3Rpb24obWlsbGlzZWNvbmRzKSB7XG4gIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICB0aGlzLl90aW1lb3V0cy5jb25uZWN0ID0gdGhpcy5fdGltZW91dHMucmVhZCA9IHRoaXMuX3RpbWVvdXRzLndyaXRlID0gbWlsbGlzZWNvbmRzO1xuICB9XG59O1xuXG4vKipcbiogU2V0IHRoZSB0aHJlZSBkaWZmZXJlbnQgKGNvbm5lY3QsIHJlYWQsIHdyaXRlKSB0aW1lb3V0cyB0byBiZSB1c2VkIHdoZW4gcmVxdWVzdGluZ1xuKiBAcGFyYW0ge09iamVjdH0gdGltZW91dHNcbiovXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuc2V0VGltZW91dHMgPSBmdW5jdGlvbih0aW1lb3V0cykge1xuICB0aGlzLl90aW1lb3V0cyA9IHRpbWVvdXRzO1xufTtcblxuLyoqXG4qIEdldCB0aGUgdGhyZWUgZGlmZmVyZW50IChjb25uZWN0LCByZWFkLCB3cml0ZSkgdGltZW91dHMgdG8gYmUgdXNlZCB3aGVuIHJlcXVlc3RpbmdcbiogQHBhcmFtIHtPYmplY3R9IHRpbWVvdXRzXG4qL1xuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLmdldFRpbWVvdXRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl90aW1lb3V0cztcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fZ2V0QXBwSWREYXRhID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0gc3RvcmUuZ2V0KHRoaXMuYXBwbGljYXRpb25JRCk7XG4gIGlmIChkYXRhICE9PSBudWxsKSB0aGlzLl9jYWNoZUFwcElkRGF0YShkYXRhKTtcbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX3NldEFwcElkRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgZGF0YS5sYXN0Q2hhbmdlID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgdGhpcy5fY2FjaGVBcHBJZERhdGEoZGF0YSk7XG4gIHJldHVybiBzdG9yZS5zZXQodGhpcy5hcHBsaWNhdGlvbklELCBkYXRhKTtcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fY2hlY2tBcHBJZERhdGEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9nZXRBcHBJZERhdGEoKTtcbiAgdmFyIG5vdyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gIGlmIChkYXRhID09PSBudWxsIHx8IG5vdyAtIGRhdGEubGFzdENoYW5nZSA+IFJFU0VUX0FQUF9EQVRBX1RJTUVSKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc2V0SW5pdGlhbEFwcElkRGF0YShkYXRhKTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9yZXNldEluaXRpYWxBcHBJZERhdGEgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBuZXdEYXRhID0gZGF0YSB8fCB7fTtcbiAgbmV3RGF0YS5ob3N0SW5kZXhlcyA9IHtyZWFkOiAwLCB3cml0ZTogMH07XG4gIG5ld0RhdGEudGltZW91dE11bHRpcGxpZXIgPSAxO1xuICBuZXdEYXRhLnNodWZmbGVSZXN1bHQgPSBuZXdEYXRhLnNodWZmbGVSZXN1bHQgfHwgc2h1ZmZsZShbMSwgMiwgM10pO1xuICByZXR1cm4gdGhpcy5fc2V0QXBwSWREYXRhKG5ld0RhdGEpO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9jYWNoZUFwcElkRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgdGhpcy5faG9zdEluZGV4ZXMgPSBkYXRhLmhvc3RJbmRleGVzO1xuICB0aGlzLl90aW1lb3V0TXVsdGlwbGllciA9IGRhdGEudGltZW91dE11bHRpcGxpZXI7XG4gIHRoaXMuX3NodWZmbGVSZXN1bHQgPSBkYXRhLnNodWZmbGVSZXN1bHQ7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX3BhcnRpYWxBcHBJZERhdGFVcGRhdGUgPSBmdW5jdGlvbihuZXdEYXRhKSB7XG4gIHZhciBmb3JlYWNoID0gcmVxdWlyZSgnZm9yZWFjaCcpO1xuICB2YXIgY3VycmVudERhdGEgPSB0aGlzLl9nZXRBcHBJZERhdGEoKTtcbiAgZm9yZWFjaChuZXdEYXRhLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgY3VycmVudERhdGFba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICByZXR1cm4gdGhpcy5fc2V0QXBwSWREYXRhKGN1cnJlbnREYXRhKTtcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fZ2V0SG9zdEJ5VHlwZSA9IGZ1bmN0aW9uKGhvc3RUeXBlKSB7XG4gIHJldHVybiB0aGlzLmhvc3RzW2hvc3RUeXBlXVt0aGlzLl9nZXRIb3N0SW5kZXhCeVR5cGUoaG9zdFR5cGUpXTtcbn07XG5cbkFsZ29saWFTZWFyY2hDb3JlLnByb3RvdHlwZS5fZ2V0VGltZW91dE11bHRpcGxpZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX3RpbWVvdXRNdWx0aXBsaWVyO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9nZXRIb3N0SW5kZXhCeVR5cGUgPSBmdW5jdGlvbihob3N0VHlwZSkge1xuICByZXR1cm4gdGhpcy5faG9zdEluZGV4ZXNbaG9zdFR5cGVdO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9zZXRIb3N0SW5kZXhCeVR5cGUgPSBmdW5jdGlvbihob3N0SW5kZXgsIGhvc3RUeXBlKSB7XG4gIHZhciBjbG9uZSA9IHJlcXVpcmUoJy4vY2xvbmUnKTtcbiAgdmFyIG5ld0hvc3RJbmRleGVzID0gY2xvbmUodGhpcy5faG9zdEluZGV4ZXMpO1xuICBuZXdIb3N0SW5kZXhlc1tob3N0VHlwZV0gPSBob3N0SW5kZXg7XG4gIHRoaXMuX3BhcnRpYWxBcHBJZERhdGFVcGRhdGUoe2hvc3RJbmRleGVzOiBuZXdIb3N0SW5kZXhlc30pO1xuICByZXR1cm4gaG9zdEluZGV4O1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9pbmNyZW1lbnRIb3N0SW5kZXggPSBmdW5jdGlvbihob3N0VHlwZSkge1xuICByZXR1cm4gdGhpcy5fc2V0SG9zdEluZGV4QnlUeXBlKFxuICAgICh0aGlzLl9nZXRIb3N0SW5kZXhCeVR5cGUoaG9zdFR5cGUpICsgMSkgJSB0aGlzLmhvc3RzW2hvc3RUeXBlXS5sZW5ndGgsIGhvc3RUeXBlXG4gICk7XG59O1xuXG5BbGdvbGlhU2VhcmNoQ29yZS5wcm90b3R5cGUuX2luY3JlbWVudFRpbWVvdXRNdWx0aXBsZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRpbWVvdXRNdWx0aXBsaWVyID0gTWF0aC5tYXgodGhpcy5fdGltZW91dE11bHRpcGxpZXIgKyAxLCA0KTtcbiAgcmV0dXJuIHRoaXMuX3BhcnRpYWxBcHBJZERhdGFVcGRhdGUoe3RpbWVvdXRNdWx0aXBsaWVyOiB0aW1lb3V0TXVsdGlwbGllcn0pO1xufTtcblxuQWxnb2xpYVNlYXJjaENvcmUucHJvdG90eXBlLl9nZXRUaW1lb3V0c0ZvclJlcXVlc3QgPSBmdW5jdGlvbihob3N0VHlwZSkge1xuICByZXR1cm4ge1xuICAgIGNvbm5lY3Q6IHRoaXMuX3RpbWVvdXRzLmNvbm5lY3QgKiB0aGlzLl90aW1lb3V0TXVsdGlwbGllcixcbiAgICBjb21wbGV0ZTogdGhpcy5fdGltZW91dHNbaG9zdFR5cGVdICogdGhpcy5fdGltZW91dE11bHRpcGxpZXJcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIHByZXBhcmVIb3N0KHByb3RvY29sKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcmVwYXJlKGhvc3QpIHtcbiAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgaG9zdC50b0xvd2VyQ2FzZSgpO1xuICB9O1xufVxuXG4vLyBQcm90b3R5cGUuanMgPCAxLjcsIGEgd2lkZWx5IHVzZWQgbGlicmFyeSwgZGVmaW5lcyBhIHdlaXJkXG4vLyBBcnJheS5wcm90b3R5cGUudG9KU09OIGZ1bmN0aW9uIHRoYXQgd2lsbCBmYWlsIHRvIHN0cmluZ2lmeSBvdXIgY29udGVudFxuLy8gYXBwcm9wcmlhdGVseVxuLy8gcmVmczpcbi8vICAgLSBodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhdG9waWMvcHJvdG90eXBlLWNvcmUvRS1TQVZ2Vl9WOVFcbi8vICAgLSBodHRwczovL2dpdGh1Yi5jb20vc3N0ZXBoZW5zb24vcHJvdG90eXBlL2NvbW1pdC8wMzhhMjk4NWE3MDU5M2MxYTg2YzIzMGZhZGJkZmUyZTQ4OThhNDhjXG4vLyAgIC0gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzE0ODQ0MS8xNDcwNzlcbmZ1bmN0aW9uIHNhZmVKU09OU3RyaW5naWZ5KG9iaikge1xuICAvKiBlc2xpbnQgbm8tZXh0ZW5kLW5hdGl2ZTowICovXG5cbiAgaWYgKEFycmF5LnByb3RvdHlwZS50b0pTT04gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9XG5cbiAgdmFyIHRvSlNPTiA9IEFycmF5LnByb3RvdHlwZS50b0pTT047XG4gIGRlbGV0ZSBBcnJheS5wcm90b3R5cGUudG9KU09OO1xuICB2YXIgb3V0ID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgQXJyYXkucHJvdG90eXBlLnRvSlNPTiA9IHRvSlNPTjtcblxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBzaHVmZmxlKGFycmF5KSB7XG4gIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gIHZhciB0ZW1wb3JhcnlWYWx1ZTtcbiAgdmFyIHJhbmRvbUluZGV4O1xuXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcbiAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNyZWRlbnRpYWxzKGhlYWRlcnMpIHtcbiAgdmFyIG5ld0hlYWRlcnMgPSB7fTtcblxuICBmb3IgKHZhciBoZWFkZXJOYW1lIGluIGhlYWRlcnMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhlYWRlcnMsIGhlYWRlck5hbWUpKSB7XG4gICAgICB2YXIgdmFsdWU7XG5cbiAgICAgIGlmIChoZWFkZXJOYW1lID09PSAneC1hbGdvbGlhLWFwaS1rZXknIHx8IGhlYWRlck5hbWUgPT09ICd4LWFsZ29saWEtYXBwbGljYXRpb24taWQnKSB7XG4gICAgICAgIHZhbHVlID0gJyoqaGlkZGVuIGZvciBzZWN1cml0eSBwdXJwb3NlcyoqJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gaGVhZGVyc1toZWFkZXJOYW1lXTtcbiAgICAgIH1cblxuICAgICAgbmV3SGVhZGVyc1toZWFkZXJOYW1lXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdIZWFkZXJzO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9BbGdvbGlhU2VhcmNoQ29yZS5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gKHdlYnBhY2spL34vbm9kZS1saWJzLWJyb3dzZXIvfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ2YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhbGdvbGlhc2VhcmNoOnNyYy9ob3N0SW5kZXhTdGF0ZS5qcycpO1xudmFyIGxvY2FsU3RvcmFnZU5hbWVzcGFjZSA9ICdhbGdvbGlhc2VhcmNoLWNsaWVudC1qcyc7XG5cbnZhciBzdG9yZTtcbnZhciBtb2R1bGVTdG9yZSA9IHtcbiAgc3RhdGU6IHt9LFxuICBzZXQ6IGZ1bmN0aW9uKGtleSwgZGF0YSkge1xuICAgIHRoaXMuc3RhdGVba2V5XSA9IGRhdGE7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVba2V5XTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVtrZXldIHx8IG51bGw7XG4gIH1cbn07XG5cbnZhciBsb2NhbFN0b3JhZ2VTdG9yZSA9IHtcbiAgc2V0OiBmdW5jdGlvbihrZXksIGRhdGEpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIG5hbWVzcGFjZSA9IEpTT04ucGFyc2UoZ2xvYmFsLmxvY2FsU3RvcmFnZVtsb2NhbFN0b3JhZ2VOYW1lc3BhY2VdKTtcbiAgICAgIG5hbWVzcGFjZVtrZXldID0gZGF0YTtcbiAgICAgIGdsb2JhbC5sb2NhbFN0b3JhZ2VbbG9jYWxTdG9yYWdlTmFtZXNwYWNlXSA9IEpTT04uc3RyaW5naWZ5KG5hbWVzcGFjZSk7XG4gICAgICByZXR1cm4gbmFtZXNwYWNlW2tleV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZGVidWcoJ2xvY2FsU3RvcmFnZSBzZXQgZmFpbGVkIHdpdGgnLCBlKTtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIHN0b3JlID0gbW9kdWxlU3RvcmU7XG4gICAgICByZXR1cm4gc3RvcmUuc2V0KGtleSwgZGF0YSk7XG4gICAgfVxuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGdsb2JhbC5sb2NhbFN0b3JhZ2VbbG9jYWxTdG9yYWdlTmFtZXNwYWNlXSlba2V5XSB8fCBudWxsO1xuICB9XG59O1xuXG5zdG9yZSA9IHN1cHBvcnRzTG9jYWxTdG9yYWdlKCkgPyBsb2NhbFN0b3JhZ2VTdG9yZSA6IG1vZHVsZVN0b3JlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0OiBnZXRPclNldCxcbiAgc2V0OiBnZXRPclNldFxufTtcblxuZnVuY3Rpb24gZ2V0T3JTZXQoa2V5LCBkYXRhKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHN0b3JlLmdldChrZXkpO1xuICB9XG5cbiAgcmV0dXJuIHN0b3JlLnNldChrZXksIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBzdXBwb3J0c0xvY2FsU3RvcmFnZSgpIHtcbiAgdHJ5IHtcbiAgICBpZiAoJ2xvY2FsU3RvcmFnZScgaW4gZ2xvYmFsICYmXG4gICAgICBnbG9iYWwubG9jYWxTdG9yYWdlICE9PSBudWxsICYmXG4gICAgICAhZ2xvYmFsLmxvY2FsU3RvcmFnZVtsb2NhbFN0b3JhZ2VOYW1lc3BhY2VdKSB7XG4gICAgICAvLyBhY3R1YWwgY3JlYXRpb24gb2YgdGhlIG5hbWVzcGFjZVxuICAgICAgZ2xvYmFsLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZU5hbWVzcGFjZSwgSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBJbiBjYXNlIG9mIGFueSBlcnJvciBvbiBsb2NhbFN0b3JhZ2UsIHdlIGNsZWFuIG91ciBvd24gbmFtZXNwYWNlLCB0aGlzIHNob3VsZCBoYW5kbGVcbi8vIHF1b3RhIGVycm9ycyB3aGVuIGEgbG90IG9mIGtleXMgKyBkYXRhIGFyZSB1c2VkXG5mdW5jdGlvbiBjbGVhbnVwKCkge1xuICB0cnkge1xuICAgIGdsb2JhbC5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShsb2NhbFN0b3JhZ2VOYW1lc3BhY2UpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgLy8gbm90aGluZyB0byBkb1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL3N0b3JlLmpzIiwiLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lXG4gICAgICAgICAgICAgICAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgID8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgICAgICAgICAgICAgIDogbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuICAnbGlnaHRzZWFncmVlbicsXG4gICdmb3Jlc3RncmVlbicsXG4gICdnb2xkZW5yb2QnLFxuICAnZG9kZ2VyYmx1ZScsXG4gICdkYXJrb3JjaGlkJyxcbiAgJ2NyaW1zb24nXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgJiYgdHlwZW9mIHdpbmRvdy5wcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQgJiYgJ1dlYmtpdEFwcGVhcmFuY2UnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyAmJiB3aW5kb3cuY29uc29sZSAmJiAoY29uc29sZS5maXJlYnVnIHx8IChjb25zb2xlLmV4Y2VwdGlvbiAmJiBjb25zb2xlLnRhYmxlKSkpIHx8XG4gICAgLy8gaXMgZmlyZWZveCA+PSB2MzE/XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG4gICAgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuICAgIC8vIGRvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyLm1lc3NhZ2U7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0JylcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB0cnkge1xuICAgIHJldHVybiBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cblxuICAvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuICAgIHJldHVybiBwcm9jZXNzLmVudi5ERUJVRztcbiAgfVxufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgbG9jYWxTdG9yYWdlLmRlYnVnYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9kZWJ1Zy9zcmMvYnJvd3Nlci5qcyIsIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnLmRlZmF1bHQgPSBjcmVhdGVEZWJ1ZztcbmV4cG9ydHMuY29lcmNlID0gY29lcmNlO1xuZXhwb3J0cy5kaXNhYmxlID0gZGlzYWJsZTtcbmV4cG9ydHMuZW5hYmxlID0gZW5hYmxlO1xuZXhwb3J0cy5lbmFibGVkID0gZW5hYmxlZDtcbmV4cG9ydHMuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICovXG5cbmV4cG9ydHMubmFtZXMgPSBbXTtcbmV4cG9ydHMuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG4gKlxuICogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycyA9IHt9O1xuXG4vKipcbiAqIFByZXZpb3VzIGxvZyB0aW1lc3RhbXAuXG4gKi9cblxudmFyIHByZXZUaW1lO1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG4gIHZhciBoYXNoID0gMCwgaTtcblxuICBmb3IgKGkgaW4gbmFtZXNwYWNlKSB7XG4gICAgaGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIG5hbWVzcGFjZS5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cblxuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICAvLyBkaXNhYmxlZD9cbiAgICBpZiAoIWRlYnVnLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciBzZWxmID0gZGVidWc7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIHR1cm4gdGhlIGBhcmd1bWVudHNgIGludG8gYSBwcm9wZXIgQXJyYXlcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgYXJnc1swXSA9IGV4cG9ydHMuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgLy8gYW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cbiAgICAgIGFyZ3MudW5zaGlmdCgnJU8nKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgLy8gYXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcbiAgICBleHBvcnRzLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuICAgIHZhciBsb2dGbiA9IGRlYnVnLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG5cbiAgZGVidWcubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICBkZWJ1Zy5lbmFibGVkID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSk7XG4gIGRlYnVnLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gIGRlYnVnLmNvbG9yID0gc2VsZWN0Q29sb3IobmFtZXNwYWNlKTtcblxuICAvLyBlbnYtc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGRlYnVnIGluc3RhbmNlc1xuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGV4cG9ydHMuaW5pdCkge1xuICAgIGV4cG9ydHMuaW5pdChkZWJ1Zyk7XG4gIH1cblxuICByZXR1cm4gZGVidWc7XG59XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICBleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7XG5cbiAgdmFyIHNwbGl0ID0gKG5hbWVzcGFjZXMgfHwgJycpLnNwbGl0KC9bXFxzLF0rLyk7XG4gIHZhciBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICghc3BsaXRbaV0pIGNvbnRpbnVlOyAvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuICAgIG5hbWVzcGFjZXMgPSBzcGxpdFtpXS5yZXBsYWNlKC9cXCovZywgJy4qPycpO1xuICAgIGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcbiAgICAgIGV4cG9ydHMuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc3Vic3RyKDEpICsgJyQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cG9ydHMubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMgKyAnJCcpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gIGV4cG9ydHMuZW5hYmxlKCcnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuICB2YXIgaSwgbGVuO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMubmFtZXNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb2VyY2UgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuICByZXR1cm4gdmFsO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vZGVidWcvc3JjL2RlYnVnLmpzIiwiLyoqXG4gKiBIZWxwZXJzLlxuICovXG5cbnZhciBzID0gMTAwMFxudmFyIG0gPSBzICogNjBcbnZhciBoID0gbSAqIDYwXG52YXIgZCA9IGggKiAyNFxudmFyIHkgPSBkICogMzY1LjI1XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsXG4gIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwYXJzZSh2YWwpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNOYU4odmFsKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5sb25nID9cblx0XHRcdGZtdExvbmcodmFsKSA6XG5cdFx0XHRmbXRTaG9ydCh2YWwpXG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgKyBKU09OLnN0cmluZ2lmeSh2YWwpKVxufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgc3RyID0gU3RyaW5nKHN0cilcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDAwMCkge1xuICAgIHJldHVyblxuICB9XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoc3RyKVxuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKVxuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeVxuICAgIGNhc2UgJ2RheXMnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnZCc6XG4gICAgICByZXR1cm4gbiAqIGRcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGhcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG1cbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3NlY3MnOlxuICAgIGNhc2UgJ3NlYyc6XG4gICAgY2FzZSAncyc6XG4gICAgICByZXR1cm4gbiAqIHNcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbi8qKlxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10U2hvcnQobXMpIHtcbiAgaWYgKG1zID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnXG4gIH1cbiAgaWYgKG1zID49IGgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnXG4gIH1cbiAgaWYgKG1zID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nXG4gIH1cbiAgaWYgKG1zID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnXG4gIH1cbiAgcmV0dXJuIG1zICsgJ21zJ1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICByZXR1cm4gcGx1cmFsKG1zLCBkLCAnZGF5JykgfHxcbiAgICBwbHVyYWwobXMsIGgsICdob3VyJykgfHxcbiAgICBwbHVyYWwobXMsIG0sICdtaW51dGUnKSB8fFxuICAgIHBsdXJhbChtcywgcywgJ3NlY29uZCcpIHx8XG4gICAgbXMgKyAnIG1zJ1xufVxuXG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbiwgbmFtZSkge1xuICBpZiAobXMgPCBuKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKG1zIDwgbiAqIDEuNSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lXG4gIH1cbiAgcmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJ1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL34vZGVidWcvfi9tcy9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbCA9IHJlcXVpcmUoJ2dsb2JhbCcpO1xudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZSB8fCByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XG5cbi8vIFRoaXMgaXMgdGhlIHN0YW5kYWxvbmUgYnJvd3NlciBidWlsZCBlbnRyeSBwb2ludFxuLy8gQnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgQWxnb2xpYSBTZWFyY2ggSmF2YVNjcmlwdCBjbGllbnQsXG4vLyB1c2luZyBYTUxIdHRwUmVxdWVzdCwgWERvbWFpblJlcXVlc3QgYW5kIEpTT05QIGFzIGZhbGxiYWNrXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUFsZ29saWFzZWFyY2goQWxnb2xpYVNlYXJjaCwgdWFTdWZmaXgpIHtcbiAgdmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbiAgdmFyIGVycm9ycyA9IHJlcXVpcmUoJy4uL2Vycm9ycycpO1xuICB2YXIgaW5saW5lSGVhZGVycyA9IHJlcXVpcmUoJy4vaW5saW5lLWhlYWRlcnMnKTtcbiAgdmFyIGpzb25wUmVxdWVzdCA9IHJlcXVpcmUoJy4vanNvbnAtcmVxdWVzdCcpO1xuICB2YXIgcGxhY2VzID0gcmVxdWlyZSgnLi4vcGxhY2VzLmpzJyk7XG4gIHVhU3VmZml4ID0gdWFTdWZmaXggfHwgJyc7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGVidWcnKSB7XG4gICAgcmVxdWlyZSgnZGVidWcnKS5lbmFibGUoJ2FsZ29saWFzZWFyY2gqJyk7XG4gIH1cblxuICBmdW5jdGlvbiBhbGdvbGlhc2VhcmNoKGFwcGxpY2F0aW9uSUQsIGFwaUtleSwgb3B0cykge1xuICAgIHZhciBjbG9uZURlZXAgPSByZXF1aXJlKCcuLi9jbG9uZS5qcycpO1xuXG4gICAgdmFyIGdldERvY3VtZW50UHJvdG9jb2wgPSByZXF1aXJlKCcuL2dldC1kb2N1bWVudC1wcm90b2NvbCcpO1xuXG4gICAgb3B0cyA9IGNsb25lRGVlcChvcHRzIHx8IHt9KTtcblxuICAgIGlmIChvcHRzLnByb3RvY29sID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdHMucHJvdG9jb2wgPSBnZXREb2N1bWVudFByb3RvY29sKCk7XG4gICAgfVxuXG4gICAgb3B0cy5fdWEgPSBvcHRzLl91YSB8fCBhbGdvbGlhc2VhcmNoLnVhO1xuXG4gICAgcmV0dXJuIG5ldyBBbGdvbGlhU2VhcmNoQnJvd3NlcihhcHBsaWNhdGlvbklELCBhcGlLZXksIG9wdHMpO1xuICB9XG5cbiAgYWxnb2xpYXNlYXJjaC52ZXJzaW9uID0gcmVxdWlyZSgnLi4vdmVyc2lvbi5qcycpO1xuICBhbGdvbGlhc2VhcmNoLnVhID0gJ0FsZ29saWEgZm9yIHZhbmlsbGEgSmF2YVNjcmlwdCAnICsgdWFTdWZmaXggKyBhbGdvbGlhc2VhcmNoLnZlcnNpb247XG4gIGFsZ29saWFzZWFyY2guaW5pdFBsYWNlcyA9IHBsYWNlcyhhbGdvbGlhc2VhcmNoKTtcblxuICAvLyB3ZSBleHBvc2UgaW50byB3aW5kb3cgbm8gbWF0dGVyIGhvdyB3ZSBhcmUgdXNlZCwgdGhpcyB3aWxsIGFsbG93XG4gIC8vIHVzIHRvIGVhc2lseSBkZWJ1ZyBhbnkgd2Vic2l0ZSBydW5uaW5nIGFsZ29saWFcbiAgZ2xvYmFsLl9fYWxnb2xpYSA9IHtcbiAgICBkZWJ1ZzogcmVxdWlyZSgnZGVidWcnKSxcbiAgICBhbGdvbGlhc2VhcmNoOiBhbGdvbGlhc2VhcmNoXG4gIH07XG5cbiAgdmFyIHN1cHBvcnQgPSB7XG4gICAgaGFzWE1MSHR0cFJlcXVlc3Q6ICdYTUxIdHRwUmVxdWVzdCcgaW4gZ2xvYmFsLFxuICAgIGhhc1hEb21haW5SZXF1ZXN0OiAnWERvbWFpblJlcXVlc3QnIGluIGdsb2JhbFxuICB9O1xuXG4gIGlmIChzdXBwb3J0Lmhhc1hNTEh0dHBSZXF1ZXN0KSB7XG4gICAgc3VwcG9ydC5jb3JzID0gJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBBbGdvbGlhU2VhcmNoQnJvd3NlcigpIHtcbiAgICAvLyBjYWxsIEFsZ29saWFTZWFyY2ggY29uc3RydWN0b3JcbiAgICBBbGdvbGlhU2VhcmNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBpbmhlcml0cyhBbGdvbGlhU2VhcmNoQnJvd3NlciwgQWxnb2xpYVNlYXJjaCk7XG5cbiAgQWxnb2xpYVNlYXJjaEJyb3dzZXIucHJvdG90eXBlLl9yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdCh1cmwsIG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gd3JhcFJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAvLyBubyBjb3JzIG9yIFhEb21haW5SZXF1ZXN0LCBubyByZXF1ZXN0XG4gICAgICBpZiAoIXN1cHBvcnQuY29ycyAmJiAhc3VwcG9ydC5oYXNYRG9tYWluUmVxdWVzdCkge1xuICAgICAgICAvLyB2ZXJ5IG9sZCBicm93c2VyLCBub3Qgc3VwcG9ydGVkXG4gICAgICAgIHJlamVjdChuZXcgZXJyb3JzLk5ldHdvcmsoJ0NPUlMgbm90IHN1cHBvcnRlZCcpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cmwgPSBpbmxpbmVIZWFkZXJzKHVybCwgb3B0cy5oZWFkZXJzKTtcblxuICAgICAgdmFyIGJvZHkgPSBvcHRzLmJvZHk7XG4gICAgICB2YXIgcmVxID0gc3VwcG9ydC5jb3JzID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgWERvbWFpblJlcXVlc3QoKTtcbiAgICAgIHZhciByZXFUaW1lb3V0O1xuICAgICAgdmFyIHRpbWVkT3V0O1xuICAgICAgdmFyIGNvbm5lY3RlZCA9IGZhbHNlO1xuXG4gICAgICByZXFUaW1lb3V0ID0gc2V0VGltZW91dChvblRpbWVvdXQsIG9wdHMudGltZW91dHMuY29ubmVjdCk7XG4gICAgICAvLyB3ZSBzZXQgYW4gZW1wdHkgb25wcm9ncmVzcyBsaXN0ZW5lclxuICAgICAgLy8gc28gdGhhdCBYRG9tYWluUmVxdWVzdCBvbiBJRTkgaXMgbm90IGFib3J0ZWRcbiAgICAgIC8vIHJlZnM6XG4gICAgICAvLyAgLSBodHRwczovL2dpdGh1Yi5jb20vYWxnb2xpYS9hbGdvbGlhc2VhcmNoLWNsaWVudC1qcy9pc3N1ZXMvNzZcbiAgICAgIC8vICAtIGh0dHBzOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvaWUvZW4tVVMvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlL2llOS1ydG0teGRvbWFpbnJlcXVlc3QtaXNzdWVkLXJlcXVlc3RzLW1heS1hYm9ydC1pZi1hbGwtZXZlbnQtaGFuZGxlcnMtbm90LXNwZWNpZmllZD9mb3J1bT1pZXdlYmRldmVsb3BtZW50XG4gICAgICByZXEub25wcm9ncmVzcyA9IG9uUHJvZ3Jlc3M7XG4gICAgICBpZiAoJ29ucmVhZHlzdGF0ZWNoYW5nZScgaW4gcmVxKSByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gb25SZWFkeVN0YXRlQ2hhbmdlO1xuICAgICAgcmVxLm9ubG9hZCA9IG9uTG9hZDtcbiAgICAgIHJlcS5vbmVycm9yID0gb25FcnJvcjtcblxuICAgICAgLy8gZG8gbm90IHJlbHkgb24gZGVmYXVsdCBYSFIgYXN5bmMgZmxhZywgYXMgc29tZSBhbmFseXRpY3MgY29kZSBsaWtlIGhvdGphclxuICAgICAgLy8gYnJlYWtzIGl0IGFuZCBzZXQgaXQgdG8gZmFsc2UgYnkgZGVmYXVsdFxuICAgICAgaWYgKHJlcSBpbnN0YW5jZW9mIFhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgIHJlcS5vcGVuKG9wdHMubWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxLm9wZW4ob3B0cy5tZXRob2QsIHVybCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGhlYWRlcnMgYXJlIG1lYW50IHRvIGJlIHNlbnQgYWZ0ZXIgb3BlblxuICAgICAgaWYgKHN1cHBvcnQuY29ycykge1xuICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgIGlmIChvcHRzLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVFRQL0FjY2Vzc19jb250cm9sX0NPUlMjU2ltcGxlX3JlcXVlc3RzXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ2FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB9XG5cbiAgICAgIHJlcS5zZW5kKGJvZHkpO1xuXG4gICAgICAvLyBldmVudCBvYmplY3Qgbm90IHJlY2VpdmVkIGluIElFOCwgYXQgbGVhc3RcbiAgICAgIC8vIGJ1dCB3ZSBkbyBub3QgdXNlIGl0LCBzdGlsbCBpbXBvcnRhbnQgdG8gbm90ZVxuICAgICAgZnVuY3Rpb24gb25Mb2FkKC8qIGV2ZW50ICovKSB7XG4gICAgICAgIC8vIFdoZW4gYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0cyByZXEudGltZW91dCwgd2UgY2FuXG4gICAgICAgIC8vIGhhdmUgYm90aCBhIGxvYWQgYW5kIHRpbWVvdXQgZXZlbnQsIHNpbmNlIGhhbmRsZWQgYnkgYSBkdW1iIHNldFRpbWVvdXRcbiAgICAgICAgaWYgKHRpbWVkT3V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuXG4gICAgICAgIHZhciBvdXQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBvdXQgPSB7XG4gICAgICAgICAgICBib2R5OiBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpLFxuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXEucmVzcG9uc2VUZXh0LFxuICAgICAgICAgICAgc3RhdHVzQ29kZTogcmVxLnN0YXR1cyxcbiAgICAgICAgICAgIC8vIFhEb21haW5SZXF1ZXN0IGRvZXMgbm90IGhhdmUgYW55IHJlc3BvbnNlIGhlYWRlcnNcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcS5nZXRBbGxSZXNwb25zZUhlYWRlcnMgJiYgcmVxLmdldEFsbFJlc3BvbnNlSGVhZGVycygpIHx8IHt9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIG91dCA9IG5ldyBlcnJvcnMuVW5wYXJzYWJsZUpTT04oe1xuICAgICAgICAgICAgbW9yZTogcmVxLnJlc3BvbnNlVGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dCBpbnN0YW5jZW9mIGVycm9ycy5VbnBhcnNhYmxlSlNPTikge1xuICAgICAgICAgIHJlamVjdChvdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUob3V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aW1lZE91dCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsZWFyVGltZW91dChyZXFUaW1lb3V0KTtcblxuICAgICAgICAvLyBlcnJvciBldmVudCBpcyB0cmlnZXJyZWQgYm90aCB3aXRoIFhEUi9YSFIgb246XG4gICAgICAgIC8vICAgLSBETlMgZXJyb3JcbiAgICAgICAgLy8gICAtIHVuYWxsb3dlZCBjcm9zcyBkb21haW4gcmVxdWVzdFxuICAgICAgICByZWplY3QoXG4gICAgICAgICAgbmV3IGVycm9ycy5OZXR3b3JrKHtcbiAgICAgICAgICAgIG1vcmU6IGV2ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgICB0aW1lZE91dCA9IHRydWU7XG4gICAgICAgIHJlcS5hYm9ydCgpO1xuXG4gICAgICAgIHJlamVjdChuZXcgZXJyb3JzLlJlcXVlc3RUaW1lb3V0KCkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbkNvbm5lY3QoKSB7XG4gICAgICAgIGNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIGNsZWFyVGltZW91dChyZXFUaW1lb3V0KTtcbiAgICAgICAgcmVxVGltZW91dCA9IHNldFRpbWVvdXQob25UaW1lb3V0LCBvcHRzLnRpbWVvdXRzLmNvbXBsZXRlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25Qcm9ncmVzcygpIHtcbiAgICAgICAgaWYgKCFjb25uZWN0ZWQpIG9uQ29ubmVjdCgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvblJlYWR5U3RhdGVDaGFuZ2UoKSB7XG4gICAgICAgIGlmICghY29ubmVjdGVkICYmIHJlcS5yZWFkeVN0YXRlID4gMSkgb25Db25uZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgQWxnb2xpYVNlYXJjaEJyb3dzZXIucHJvdG90eXBlLl9yZXF1ZXN0LmZhbGxiYWNrID0gZnVuY3Rpb24gcmVxdWVzdEZhbGxiYWNrKHVybCwgb3B0cykge1xuICAgIHVybCA9IGlubGluZUhlYWRlcnModXJsLCBvcHRzLmhlYWRlcnMpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIHdyYXBKc29ucFJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBqc29ucFJlcXVlc3QodXJsLCBvcHRzLCBmdW5jdGlvbiBqc29ucFJlcXVlc3REb25lKGVyciwgY29udGVudCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShjb250ZW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIEFsZ29saWFTZWFyY2hCcm93c2VyLnByb3RvdHlwZS5fcHJvbWlzZSA9IHtcbiAgICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdFByb21pc2UodmFsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QodmFsKTtcbiAgICB9LFxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWwpO1xuICAgIH0sXG4gICAgZGVsYXk6IGZ1bmN0aW9uIGRlbGF5UHJvbWlzZShtcykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIHJlc29sdmVPblRpbWVvdXQocmVzb2x2ZS8qICwgcmVqZWN0Ki8pIHtcbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGFsZ29saWFzZWFyY2g7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9icm93c2VyL2NyZWF0ZUFsZ29saWFzZWFyY2guanMiLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9nbG9iYWwvd2luZG93LmpzIiwiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjAuNVxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHIgPSByZXF1aXJlO1xuICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHVuZGVmaW5lZDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICBpZiAoX3N0YXRlKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IF9hcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlc29sdmVkIHdpdGggdGhlXG4gIHBhc3NlZCBgdmFsdWVgLiBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3Jlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBQRU5ESU5HID0gdm9pZCAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgPSAyO1xuXG52YXIgR0VUX1RIRU5fRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbihwcm9taXNlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBHRVRfVEhFTl9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgdHJ5IHtcbiAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgYXNhcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICB2YXIgZXJyb3IgPSB0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfVxuICB9LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQgPT09IEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoZW4kJCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0aGVuJCQpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBzZWxmRnVsZmlsbG1lbnQoKSk7XG4gIH0gZWxzZSBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBnZXRUaGVuKHZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcblxuICBhc2FwKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9zdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBfc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBFcnJvck9iamVjdCgpIHtcbiAgdGhpcy5lcnJvciA9IG51bGw7XG59XG5cbnZhciBUUllfQ0FUQ0hfRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICByZXR1cm4gVFJZX0NBVENIX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkLFxuICAgICAgc3VjY2VlZGVkID0gdW5kZWZpbmVkLFxuICAgICAgZmFpbGVkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHZhbHVlID0gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gIH1cblxuICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIF9yZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGlvbkVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgdmFyIF9pbnB1dCA9IHRoaXMuX2lucHV0O1xuXG4gIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lYWNoRW50cnkoX2lucHV0W2ldLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIChlbnRyeSwgaSkge1xuICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gIHZhciByZXNvbHZlJCQgPSBjLnJlc29sdmU7XG5cbiAgaWYgKHJlc29sdmUkJCA9PT0gcmVzb2x2ZSkge1xuICAgIHZhciBfdGhlbiA9IGdldFRoZW4oZW50cnkpO1xuXG4gICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XG4gICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKG5vb3ApO1xuICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24gKHJlc29sdmUkJCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSQkKGVudHJ5KTtcbiAgICAgIH0pLCBpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUkJChlbnRyeSksIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gKHN0YXRlLCBpLCB2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gKHByb21pc2UsIGkpIHtcbiAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gIHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KFJFSkVDVEVELCBpLCByZWFzb24pO1xuICB9KTtcbn07XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbChlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvcih0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIHRoaXNbUFJPTUlTRV9JRF0gPSBuZXh0SWQoKTtcbiAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaWYgKG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gIH1cbn1cblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLnJhY2UgPSByYWNlO1xuUHJvbWlzZS5yZXNvbHZlID0gcmVzb2x2ZTtcblByb21pc2UucmVqZWN0ID0gcmVqZWN0O1xuUHJvbWlzZS5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZS5fc2V0QXNhcCA9IHNldEFzYXA7XG5Qcm9taXNlLl9hc2FwID0gYXNhcDtcblxuUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQcm9taXNlLFxuXG4gIC8qKlxuICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIENoYWluaW5nXG4gICAgLS0tLS0tLS1cbiAgXG4gICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgfSk7XG4gIFxuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgIH0pO1xuICAgIGBgYFxuICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBc3NpbWlsYXRpb25cbiAgICAtLS0tLS0tLS0tLS1cbiAgXG4gICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgU2ltcGxlIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgcmVzdWx0O1xuICBcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgYXV0aG9yLCBib29rcztcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICBcbiAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgXG4gICAgfVxuICBcbiAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRBdXRob3IoKS5cbiAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgdGhlblxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICB0aGVuOiB0aGVuLFxuXG4gIC8qKlxuICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBcbiAgICBgYGBqc1xuICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgIH1cbiAgXG4gICAgLy8gc3luY2hyb25vdXNcbiAgICB0cnkge1xuICAgICAgZmluZEF1dGhvcigpO1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH1cbiAgXG4gICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCBjYXRjaFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gICdjYXRjaCc6IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgICB2YXIgbG9jYWwgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICBpZiAoUCkge1xuICAgICAgICB2YXIgcHJvbWlzZVRvU3RyaW5nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZS5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuUHJvbWlzZS5Qcm9taXNlID0gUHJvbWlzZTtcblxucmV0dXJuIFByb21pc2U7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczYtcHJvbWlzZS5tYXBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvfi9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwiLyogKGlnbm9yZWQpICovXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gdmVydHggKGlnbm9yZWQpXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5saW5lSGVhZGVycztcblxudmFyIGVuY29kZSA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUnKTtcblxuZnVuY3Rpb24gaW5saW5lSGVhZGVycyh1cmwsIGhlYWRlcnMpIHtcbiAgaWYgKC9cXD8vLnRlc3QodXJsKSkge1xuICAgIHVybCArPSAnJic7XG4gIH0gZWxzZSB7XG4gICAgdXJsICs9ICc/JztcbiAgfVxuXG4gIHJldHVybiB1cmwgKyBlbmNvZGUoaGVhZGVycyk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Jyb3dzZXIvaW5saW5lLWhlYWRlcnMuanMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9+L3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnBSZXF1ZXN0O1xuXG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi4vZXJyb3JzJyk7XG5cbnZhciBKU09OUENvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBqc29ucFJlcXVlc3QodXJsLCBvcHRzLCBjYikge1xuICBpZiAob3B0cy5tZXRob2QgIT09ICdHRVQnKSB7XG4gICAgY2IobmV3IEVycm9yKCdNZXRob2QgJyArIG9wdHMubWV0aG9kICsgJyAnICsgdXJsICsgJyBpcyBub3Qgc3VwcG9ydGVkIGJ5IEpTT05QLicpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBvcHRzLmRlYnVnKCdKU09OUDogc3RhcnQnKTtcblxuICB2YXIgY2JDYWxsZWQgPSBmYWxzZTtcbiAgdmFyIHRpbWVkT3V0ID0gZmFsc2U7XG5cbiAgSlNPTlBDb3VudGVyICs9IDE7XG4gIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICB2YXIgY2JOYW1lID0gJ2FsZ29saWFKU09OUF8nICsgSlNPTlBDb3VudGVyO1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gIHdpbmRvd1tjYk5hbWVdID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJlbW92ZUdsb2JhbHMoKTtcblxuICAgIGlmICh0aW1lZE91dCkge1xuICAgICAgb3B0cy5kZWJ1ZygnSlNPTlA6IExhdGUgYW5zd2VyLCBpZ25vcmluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNiQ2FsbGVkID0gdHJ1ZTtcblxuICAgIGNsZWFuKCk7XG5cbiAgICBjYihudWxsLCB7XG4gICAgICBib2R5OiBkYXRhLyogLFxuICAgICAgLy8gV2UgZG8gbm90IHNlbmQgdGhlIHN0YXR1c0NvZGUsIHRoZXJlJ3Mgbm8gc3RhdHVzQ29kZSBpbiBKU09OUCwgaXQgd2lsbCBiZVxuICAgICAgLy8gY29tcHV0ZWQgdXNpbmcgZGF0YS5zdGF0dXMgJiYgZGF0YS5tZXNzYWdlIGxpa2Ugd2l0aCBYRFJcbiAgICAgIHN0YXR1c0NvZGUqL1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIGFkZCBjYWxsYmFjayBieSBoYW5kXG4gIHVybCArPSAnJmNhbGxiYWNrPScgKyBjYk5hbWU7XG5cbiAgLy8gYWRkIGJvZHkgcGFyYW1zIG1hbnVhbGx5XG4gIGlmIChvcHRzLmpzb25Cb2R5ICYmIG9wdHMuanNvbkJvZHkucGFyYW1zKSB7XG4gICAgdXJsICs9ICcmJyArIG9wdHMuanNvbkJvZHkucGFyYW1zO1xuICB9XG5cbiAgdmFyIG9udGltZW91dCA9IHNldFRpbWVvdXQodGltZW91dCwgb3B0cy50aW1lb3V0cy5jb21wbGV0ZSk7XG5cbiAgLy8gc2NyaXB0IG9ucmVhZHlzdGF0ZWNoYW5nZSBuZWVkZWQgb25seSBmb3JcbiAgLy8gPD0gSUU4XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvaXNzdWVzLzQ1MjNcbiAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5c3RhdGVjaGFuZ2U7XG4gIHNjcmlwdC5vbmxvYWQgPSBzdWNjZXNzO1xuICBzY3JpcHQub25lcnJvciA9IGVycm9yO1xuXG4gIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gIHNjcmlwdC5kZWZlciA9IHRydWU7XG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgIG9wdHMuZGVidWcoJ0pTT05QOiBzdWNjZXNzJyk7XG5cbiAgICBpZiAoZG9uZSB8fCB0aW1lZE91dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgLy8gc2NyaXB0IGxvYWRlZCBidXQgZGlkIG5vdCBjYWxsIHRoZSBmbiA9PiBzY3JpcHQgbG9hZGluZyBlcnJvclxuICAgIGlmICghY2JDYWxsZWQpIHtcbiAgICAgIG9wdHMuZGVidWcoJ0pTT05QOiBGYWlsLiBTY3JpcHQgbG9hZGVkIGJ1dCBkaWQgbm90IGNhbGwgdGhlIGNhbGxiYWNrJyk7XG4gICAgICBjbGVhbigpO1xuICAgICAgY2IobmV3IGVycm9ycy5KU09OUFNjcmlwdEZhaWwoKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZHlzdGF0ZWNoYW5nZSgpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSAnbG9hZGVkJyB8fCB0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgIHN1Y2Nlc3MoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbigpIHtcbiAgICBjbGVhclRpbWVvdXQob250aW1lb3V0KTtcbiAgICBzY3JpcHQub25sb2FkID0gbnVsbDtcbiAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICBzY3JpcHQub25lcnJvciA9IG51bGw7XG4gICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlR2xvYmFscygpIHtcbiAgICB0cnkge1xuICAgICAgZGVsZXRlIHdpbmRvd1tjYk5hbWVdO1xuICAgICAgZGVsZXRlIHdpbmRvd1tjYk5hbWUgKyAnX2xvYWRlZCddO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHdpbmRvd1tjYk5hbWVdID0gd2luZG93W2NiTmFtZSArICdfbG9hZGVkJ10gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGltZW91dCgpIHtcbiAgICBvcHRzLmRlYnVnKCdKU09OUDogU2NyaXB0IHRpbWVvdXQnKTtcbiAgICB0aW1lZE91dCA9IHRydWU7XG4gICAgY2xlYW4oKTtcbiAgICBjYihuZXcgZXJyb3JzLlJlcXVlc3RUaW1lb3V0KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgb3B0cy5kZWJ1ZygnSlNPTlA6IFNjcmlwdCBlcnJvcicpO1xuXG4gICAgaWYgKGRvbmUgfHwgdGltZWRPdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjbGVhbigpO1xuICAgIGNiKG5ldyBlcnJvcnMuSlNPTlBTY3JpcHRFcnJvcigpKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy9icm93c2VyL2pzb25wLXJlcXVlc3QuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVBsYWNlc0NsaWVudDtcblxudmFyIGJ1aWxkU2VhcmNoTWV0aG9kID0gcmVxdWlyZSgnLi9idWlsZFNlYXJjaE1ldGhvZC5qcycpO1xuXG5mdW5jdGlvbiBjcmVhdGVQbGFjZXNDbGllbnQoYWxnb2xpYXNlYXJjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gcGxhY2VzKGFwcElELCBhcGlLZXksIG9wdHMpIHtcbiAgICB2YXIgY2xvbmVEZWVwID0gcmVxdWlyZSgnLi9jbG9uZS5qcycpO1xuXG4gICAgb3B0cyA9IG9wdHMgJiYgY2xvbmVEZWVwKG9wdHMpIHx8IHt9O1xuICAgIG9wdHMuaG9zdHMgPSBvcHRzLmhvc3RzIHx8IFtcbiAgICAgICdwbGFjZXMtZHNuLmFsZ29saWEubmV0JyxcbiAgICAgICdwbGFjZXMtMS5hbGdvbGlhbmV0LmNvbScsXG4gICAgICAncGxhY2VzLTIuYWxnb2xpYW5ldC5jb20nLFxuICAgICAgJ3BsYWNlcy0zLmFsZ29saWFuZXQuY29tJ1xuICAgIF07XG5cbiAgICAvLyBhbGxvdyBpbml0UGxhY2VzKCkgbm8gYXJndW1lbnRzID0+IGNvbW11bml0eSByYXRlIGxpbWl0ZWRcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCB0eXBlb2YgYXBwSUQgPT09ICdvYmplY3QnIHx8IGFwcElEID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFwcElEID0gJyc7XG4gICAgICBhcGlLZXkgPSAnJztcbiAgICAgIG9wdHMuX2FsbG93RW1wdHlDcmVkZW50aWFscyA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGNsaWVudCA9IGFsZ29saWFzZWFyY2goYXBwSUQsIGFwaUtleSwgb3B0cyk7XG4gICAgdmFyIGluZGV4ID0gY2xpZW50LmluaXRJbmRleCgncGxhY2VzJyk7XG4gICAgaW5kZXguc2VhcmNoID0gYnVpbGRTZWFyY2hNZXRob2QoJ3F1ZXJ5JywgJy8xL3BsYWNlcy9xdWVyeScpO1xuICAgIHJldHVybiBpbmRleDtcbiAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vYWxnb2xpYXNlYXJjaC9zcmMvcGxhY2VzLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERvY3VtZW50UHJvdG9jb2w7XG5cbmZ1bmN0aW9uIGdldERvY3VtZW50UHJvdG9jb2woKSB7XG4gIHZhciBwcm90b2NvbCA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbDtcblxuICAvLyB3aGVuIGluIGBmaWxlOmAgbW9kZSAobG9jYWwgaHRtbCBmaWxlKSwgZGVmYXVsdCB0byBgaHR0cDpgXG4gIGlmIChwcm90b2NvbCAhPT0gJ2h0dHA6JyAmJiBwcm90b2NvbCAhPT0gJ2h0dHBzOicpIHtcbiAgICBwcm90b2NvbCA9ICdodHRwOic7XG4gIH1cblxuICByZXR1cm4gcHJvdG9jb2w7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2FsZ29saWFzZWFyY2gvc3JjL2Jyb3dzZXIvZ2V0LWRvY3VtZW50LXByb3RvY29sLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICczLjIwLjInO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9hbGdvbGlhc2VhcmNoL3NyYy92ZXJzaW9uLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==