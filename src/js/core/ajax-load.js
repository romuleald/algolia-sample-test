var ajaxload = (function () {
    "use strict";

    //todo tpl should be in param
    let _tpl = '<div id="ajaxloader" class="windows8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_6"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_7"><div class="wInnerBall"></div></div></div>';
   
    let $ajaxloader;
    let _cssClass = '';
    let status = 0;
    let _isReady = false;
    var show = function () {
        status--;
        $ajaxloader.addClass(_cssClass);
    };
    var hide = function () {
        status++;
        status === 0 && $ajaxloader.removeClass(_cssClass);
    };
    var init = function ({tpl, $target, cssClass}) {
        _cssClass = cssClass || 'ajaxloader-show';
        _tpl = tpl;
        document.body.insertAdjacentHTML('beforeend', tpl);
        $ajaxloader = $target || $('#ajaxloader');
        _isReady = true;
        return $target;
    };
    var ready = function () {
        return _isReady
    };
    return {
        init: init,
        show: show,
        hide: hide,
        ready: ready
    }
})();

module.exports = ajaxload;