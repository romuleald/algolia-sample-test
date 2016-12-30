import toggler from './core/toggler';
import webmodule from './core/module';
import getTpl from './core/getTpl';
import algoliasearch from 'algoliasearch';

toggler();
webmodule.init();

var client = algoliasearch('TDV4I77F2F', 'c5731b2aa4cb316c0f55990145f0126d');
var searchList = client.initIndex('all');
//need https
//searchList.setSettings({'hitsPerPage': 200}, function(err) {
//    if (!err) {
//        console.log('success');
//    }
//});
$('.js-search').on('input', function (e) {

    searchList.search(this.value, function searchDone(err, content) {
        let html = '';
        var hits = content.hits;
        for (let i = 0; i < hits.length; i++) {
            let item = hits[i];
            html += getTpl(item, 'tpl_search');
        }
        $('.js-result').html(html);
    });

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
