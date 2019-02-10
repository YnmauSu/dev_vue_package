const HEIGHTINFO = {
    NAV: 0,
    WINDOW_HEIGHT: window.innerHeight,
    TAP_HEIGHT: 48,
    TABLE_MARGIN: 35
};

const CONFIG = {
    ajaxData: {
        request_type: 1
    },
    pageData: {
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [20, 50, 100, 200]
    },
    setTableHeight(_e, other, _d) {
        let extra = ['ui-search-area', 'ui-fn-module', 'ui-main-module-page'];

        if (other && other.length) {
            extra = extra.concat(other);
        }

        let mainView = window.getEleAttr(`.${_e}`);
        let tableHeight = HEIGHTINFO.NAV + HEIGHTINFO.TAP_HEIGHT + (_d ? 0 : HEIGHTINFO.TABLE_MARGIN);
        let userAgent = navigator.userAgent;
        for (let i = 0; i < extra.length; i++) {

            // 获取容器元素
            let ele = window.getEleAttr(`.${extra[i]}`, mainView);
            if (!ele) continue;

            tableHeight += ele.offsetHeight;

            let eleMargin, eleTBMargin;
            let eleCss = document.defaultView.getComputedStyle(ele);
            if (userAgent.indexOf('Firefox') > -1) {
                eleTBMargin = parseInt(eleCss['margin-top']) + parseInt(eleCss['margin-bottom']);
            } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf("MSIE") > -1 && !userAgent.indexOf("Opera") > -1) {
                let ieCss = ele.currentStyle;
                eleTBMargin = parseInt(ieCss['marginTop']) + parseInt(ieCss['marginBottom']);
            } else {
                eleMargin = eleCss.margin.split(' ');
                eleTBMargin = parseInt(eleMargin[2]) ? parseInt(eleMargin[0]) + parseInt(eleMargin[2]) : parseInt(eleMargin[0]);
            }

            tableHeight = eleTBMargin + tableHeight;
        }
        tableHeight = HEIGHTINFO.WINDOW_HEIGHT - tableHeight;
        return tableHeight + 'px';
    },
    HOME_PATH: 'http://192.168.9.126:8864',
    // IN_PRODUCTION_PATH: 'http://secapi.yibainetwork.com',
    IN_PRODUCTION_PATH: document.referrer,
    IN_DEVELOPMENT_PATH: 'http://192.168.9.126:8864',
    // PRODUCTION_PATH: 'http://sec.yibainetwork.com'
    PRODUCTION_PATH: window.location.origin,
    FIP_PATH: process.env.NODE_ENV == 'production' ? window.location.origin : 'http://192.168.9.126:8871',

    // 搜索框宽度
    SEARCH_DATE_WIDTH: '438'

};

export default CONFIG;