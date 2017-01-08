import toggler from './core/toggler';
import webmodule from './core/module';
import getTpl from './core/getTpl';
import algoliasearch from 'algoliasearch';

toggler();
webmodule.init();

/**
 * @namespace
 * @property {object}  result
 * @property {number}  result.nbPages
 * @namespace
 * @property {object}  item
 * @property {number}  defaults.stars_count
 * @property {string}  defaults.reserve_url
 * @property {string}  defaults.price_range
 * @property {number}  defaults.reviews_count
 * @property {string}  defaults.food_type
 * @property {string}  defaults.image_url
 * @property {Array}  defaults.payment_options
 */


//todo use helper to sort by geo position or aroundLatLngViaIP if no geo available

var client = algoliasearch('TDV4I77F2F', 'c5731b2aa4cb316c0f55990145f0126d');

var DOMResult = document.querySelector('.js-result');
var DOMResultMetric = document.querySelector('.js-result-count');

const itemPerPage = 3;
let currentUIPage = 0;

var currentResult = [];
var currentResultFiltered = [];

const includedPaymentCard = ['AMEX', 'Visa', 'Discover', 'MasterCard'].join(',');
const mergedPaymentCard = {
    'Diners Club': 'Discover', 'Carte Blanche': 'Discover'
};
var getStars = function (r) {
    return '★'.repeat(Math.abs(r))
};
var makeStars = function (score) {
    return getTpl({stars: getStars(score), stared: getStars(score - 5)}, 'tpl_stars')
};

var concatResult = function (res, allRes) {
    return allRes.concat(res);
};
var showListResult = function (html, addHtml = true, isOver) {
    if (addHtml) {
        DOMResult.innerHTML = html;
    }
    else {
        DOMResult.insertAdjacentHTML('beforeend', html);
    }
    DOMResult.classList.toggle('no-more-result', isOver)
};
var setFilterHTML = function (name, filters) {
    let html = '';
    let aFilters = Object.keys(filters).sort(function (a, b) {
        return filters[b].length - filters[a].length;
    });
    for (var i = 0; i < aFilters.length; i++) {
        let item = aFilters[i];
        let options = {count: filters[item].length, type: item};
        if ('stars' === name) {
            options['content'] = makeStars(item);
        }
        if ('payment' === name) {
            item = mergedPaymentCard[item] || item;
            options.name = item;
            var include = new RegExp(item).test(includedPaymentCard);
            if (!include) {
                continue;
            }
        }
        options['hide'] = i >= 5 ? 'mod-hide' : '';
        html += getTpl(options, 'tpl_filter_' + name);
    }
    $(`.js-filter[data-name="${name}"]`).html(html).toggleClass('show-more-filter', aFilters.length > 5);
};

var nextResult = function () {
    currentUIPage++;
    insertResult();
};

var insertResult = function (page = currentUIPage) {
    let html = '';
    let currentIndex = page * itemPerPage;
    let toIndex = (page + 1) * itemPerPage;
    for (let i = currentIndex; i < Math.min(Math.max(i, toIndex), currentResultFiltered.length); i++) {
        let item = currentResultFiltered[i];
        let starsCountRounded = Math.floor(item.stars_count);
        html += getTpl({
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
    let isOver = currentResultFiltered.length < toIndex;
    showListResult(html, page === 0, isOver);

    currentUIPage = page;
};
var clearFilter = function () {
    currentResultFiltered = Object.assign(currentResult);
    insertResult(0);

};
var filterResult = function (filterType, filterName) {
    currentResultFiltered = currentResult.filter(function (item) {
        let itemFilter = item[filterType];
        if ('payment' === filterType) {
            itemFilter = itemFilter.join ? itemFilter.join(',') : itemFilter;//if in any case when it's single there's no array
            itemFilter = mergedPaymentCard[itemFilter] || itemFilter;
        }
        return new RegExp(filterName).test(itemFilter);
    });
    insertResult(0);
};

var searchEnd = function (allRes, timing) {
    let allFoodType = {};
    let allStarsCount = {};
    let allPayment = {};
    currentUIPage = 0; //always reset
    currentResult = Object.assign(allRes);
    currentResultFiltered = Object.assign(allRes);
    for (let i = 0; i < allRes.length; i++) {
        let item = allRes[i];
        let id = item.objectID;
        let foodType = item.food_type;
        let starsCountRounded = Math.floor(item.stars_count);
        let payment = item.payment_options;
        (allFoodType[foodType] = allFoodType[foodType] ? allFoodType[foodType] : []).push(id);
        (allStarsCount[starsCountRounded] = allStarsCount[starsCountRounded] ? allStarsCount[starsCountRounded] : []).push(id);
        for (let iPayment = 0; iPayment < payment.length; iPayment++) {
            (allPayment[payment[iPayment]] = allPayment[payment[iPayment]] ? allPayment[payment[iPayment]] : []).push(id);
        }
    }

    setFilterHTML('foods', allFoodType);
    setFilterHTML('stars', allStarsCount);
    setFilterHTML('payment', allPayment);
    //todo need a function
    DOMResultMetric.innerHTML = getTpl({count: allRes.length, time: timing / 1000}, 'tpl_search_total');
    insertResult(currentUIPage);
};
var searchStart = function (query) {
    let allRes = [];
    let timing = 0;
    var searchDone = function searchDone(err, content) {
        let result = content.results[0];
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
        }
        else {
            searchEnd(allRes, timing);
        }
    };
    client.search([{
        indexName: 'all',
        query: query
    }], searchDone);
};
let TIMEOUTsearch = 0;
$('.js-search').on('input', function () {
    let query = this.value;
    clearTimeout(TIMEOUTsearch);
    TIMEOUTsearch = setTimeout(function () {
        searchStart(query);
    }, 200);
});

$('.js-show-more-result').on('click', function () {
    nextResult();
});
$('body').on('click mouseenter mouseleave', '.js-filter-item', function (e) {
    let type = e.type;
    //enter/leave = highlight
    let filterType = this.getAttribute('data-type');
    let filterName = this.getAttribute('data-name');

    if (/mouseleave|mouseenter/.test(type)) {
        if (type === 'mouseenter') {
            let $css = $('<style>').html(`
                .result-wrapper {
                    transform: scale(.3)!important;
                    transition: transform 250ms 5s!important;
                }
                .result-item:not([data-type-${filterType}*="${filterName}"]){
                    opacity: .5!important;
                }
            `).attr('id', 'highlightcss');
            $('head').append($css);
        }
        else {
            $('#highlightcss').remove();
        }
    }
    if ('click' === type) {
        let currentActive = document.querySelector('.js-filter-item.active');
        if (!this.classList.contains('active')) {
            filterResult(filterType, filterName);
            this.classList.add('active');
        }
        else {
            clearFilter();
        }
        currentActive && currentActive.classList.remove('active');
    }


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
