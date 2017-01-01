import toggler from './core/toggler';
import webmodule from './core/module';
import getTpl from './core/getTpl';
import algoliasearch from 'algoliasearch';

toggler();
webmodule.init();

var client = algoliasearch('TDV4I77F2F', 'c5731b2aa4cb316c0f55990145f0126d');

var DOMResult = document.querySelector('.js-result');
var DOMResultMetric = document.querySelector('.js-result-count');

const itemPerPage = 3;
let currentUIPage = 0;
var getStars = function (r) {
    return '★'.repeat(Math.abs(r))
};
var makeStars = function (score) {
    return getTpl({stars: getStars(score), stared: getStars(score - 5)}, 'tpl_stars')
};

var concatResult = function (res, allRes) {
    return allRes.concat(res);
};
var showListResult = function (html, addHtml = true) {
    if (addHtml) {
        DOMResult.innerHTML = html;
    }
    else {
        DOMResult.insertAdjacentHTML('beforeend', html);
    }
};
var setFilterHTML = function (name, filters) {
    let html = '';
    let aFilters = Object.keys(filters);
    //todo sort by desc quantity
    for (var i = 0; i < aFilters.length; i++) {
        let item = aFilters[i];
        let options = {count: filters[item].length, type: item};
        if ('stars' === name) {
            options['content'] = makeStars(item);
        }
        options['hide'] = i >= 5 ? 'mod-hide' : '';
        html += getTpl(options, 'tpl_filter_' + name);
    }
    $(`.js-filter[data-name="${name}"]`).html(html).toggleClass('show-more-filter', aFilters.length > 5);
};

var insertResult = function (page) {
    //todo paginate result
};

var searchEnd = function (allRes, timing) {
    let html = '';
    let allFoodType = {};
    let allStarsCount = {};
    let allPayment = {};
    currentUIPage = 0; //always reset

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
        if (i < itemPerPage) {
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
    }

    setFilterHTML('foods', allFoodType);
    setFilterHTML('stars', allStarsCount);
    setFilterHTML('payment', allPayment);
    showListResult(html);
    //todo need a function
    DOMResultMetric.innerHTML = getTpl({count: allRes.length, time: timing / 1000}, 'tpl_search_total');

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
$('.js-search').on('input', function (e) {
    let query = this.value;
    clearTimeout(TIMEOUTsearch);
    TIMEOUTsearch = setTimeout(function () {
        searchStart(query);
    }, 200);
});
$('body').on('click mouseenter mouseleave', '.js-filter-item', function (e) {
    let type = e.type;
    //enter/leave = highlight
    let filterType = this.getAttribute('data-type');
    let filterName = this.getAttribute('data-name');

    if (/mouseleave|mouseenter/.test(type)) {
        if (type === 'mouseenter') {
            let $css = $('<style>').html(`
                .result-item:not([data-type-${filterType}*="${filterName}"]){
                    opacity: .5;
                }
            `).attr('id', 'highlightcss');
            $('head').append($css);
        }
        else {
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
