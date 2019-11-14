import AUTHORITY_BUTTON from '@/authority/button_config'

const HEIGHTINFO = {
    NAV: 0,
    WINDOW_HEIGHT: window.innerHeight,
    TAP_HEIGHT: 48,
    TABLE_MARGIN: 35
};

const RULE_CONFIG = {

    // 手机
    phone: {
        pattern: /^[0-9]{11}$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 纯数字
    number: {
        pattern: /^[0-9]+$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 身份证
    idNumber: {
        pattern: /^[0-9A-Za-z]+$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 邮箱
    email: {
        pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 必填
    requiredBlur: [
        {
            required: true,
            trigger: 'blur',
            message: '带*号不能为空！'
        },
        {
            pattern: /[^\s]+/,
            trigger: 'blur',
            message: '输入有误！'
        }
    ],

    // 必填
    requiredChange: {
        required: true,
        trigger: 'change',
        message: '带*号不能为空！'
    },

    image: ['.png', '.jpeg', '.gif', '.jpg'],

    size: {
        pattern: /^\d+\*\d+\*\d+$/ig,
        message: '输入有误！',
        trigger: 'blur'
    },
    password: {
        pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,15}$/,
        message: '密码必须包含大写字母、小写字母和数字',
        trigger: 'blur'
    }
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
    SEARCH_DATE_WIDTH: '438',

    // 权限控制按钮
    AUTHORITY_BUTTON,

    // 规则
    RULE_CONFIG,

    // 文件格式
    FILE_FORMAT: {
        VIDEO_FORMAT: ['.MP4', '.MKV', '.AVI', '.WMV', '.HEVC', '.MKV', '.GP', '.FLV', '.SWF', '.HTML5', '.M4V', '.MOV', '.ASF', '.DV', '.VOB', '.OGV', '.YouTube', '.ASF', '.RM', '.MOD', '.TOD'],

        EXCEL_FORMAT: ['.xls', '.xlsx'],

        ZIP_FORMAT: ['.zip', '.rar'],

        IMAGE_FORMAT: ['.jpg', '.png', '.jpeg', '.gif'],

        TXT_FORMAT: ['.txt', '.text'],

        PDF_FORMAT: ['.pdf'],

        WORD_FORMAT: ['.doc', '.docx']
    },
};

export default CONFIG;