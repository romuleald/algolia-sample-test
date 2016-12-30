import toggler from './core/toggler';
import webmodule from './core/module';
import service from './core/get-service';
import getTpl from './core/getTpl';
import algoliasearch from 'algoliasearch';

toggler();
webmodule.init();
//service.init(jsonendpoint);
//


var client = algoliasearch('TDV4I77F2F', 'c5731b2aa4cb316c0f55990145f0126d');
var index = client.initIndex('getstarted_actors');

$('.js-search').on('input', function (e) {

    index.search(this.value, function searchDone(err, content) {
        console.log(err, content);
        let html = '';
        for (let i = 0; i < content.hits.length; i++) {
            let item = content.hits[i];
            html += getTpl(item, 'tpl_search');
        }
        $('.js-result').html(html);
    });

});
