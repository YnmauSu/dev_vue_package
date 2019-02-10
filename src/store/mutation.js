
import * as types from './mutation-type';
import * as Storage from '@/utils/storage';
import Store from '@/store';
import buttonList from '../authority/button_config';

export default {
    [types.SAVE_LOADING_STATE] (state, data) {
        state.showLoading = data;
    },

    // 保存登录信息
    [types.SAVE_LOGIN_INFO] (state, loginInfo) {
        state.loginInfo = loginInfo;
        Storage.setSessionStorage('userInfo', loginInfo ? JSON.stringify(loginInfo) : '');
    },

    // 保存按钮配置
    [types.SAVE_BUTTON_CONFIG] (state, saveInfo) {
        state.buttonList = buttonList[saveInfo.replace(/^[\/]/, '')] && buttonList[saveInfo.replace(/^[\/]/, '')].buttonList;
    },

    // 保存查询参数
    [types.SAVE_QUERY_PARAMS_INFO] (state, saveInfo) {
        state.queryParamsInfo[saveInfo.key] = saveInfo.value;
    },

    // 保存多页签对象
    [types.SAVE_MULTIPLE_OBJ] (state, saveInfo) {
        state.multipleObj = saveInfo;
    },

    // 保存权限资源菜单
    [types.SAVE_PERMIT_PATH_INFO] (state, infoList) {
        let arr = [];
        for (let i = 0; i < infoList.length; i++) {
            arr.push(infoList[i].resource_path)
        }
        state.permitPath = state.permitPath.concat(arr);
    },

    // 保存权限资源按钮
    [types.SAVE_PERMIT_RESOURCE_INFO] (state, infoList) {
        // 递归函数
        let callBack = function (children, saveObj, isRoot) {
            if (children && children.length) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].children && children[i].children.length) {
                        saveObj[children[i].resource_name] = {};
                        callBack(children[i].children, saveObj[children[i].resource_name])
                    } else {
                        saveObj[children[i].resource_name] = true
                    }
                }
            } else if (isRoot) {
                return true;
            }
        };
        let obj = {};
        for (let i = 0; i < infoList.length; i++) {
            obj[infoList[i].resource_name] = {};
            callBack(infoList[i].children, obj[infoList[i].resource_name], true) === true ? obj[infoList[i].resource_name] = true : false;
        }
        state.permitResource = obj;
    },

    /**
     * 保存页签:
     *  isRemove 1 移除单个; 2 移除全部
     * **/
    [types.SAVE_TAB_LABELS] (state, saveInfo) {

        let initFn = (obj) => {
            for (let key in obj) {
                switch (typeof obj[key]) {
                    case 'number':
                        obj[key] = 0;
                        break;
                    case 'string':
                        obj[key] = '';
                        break;
                    case 'boolean':
                        obj[key] = false;
                        break;
                    case 'object':
                        obj[key] = obj[key] instanceof Array ? [] : {};
                        break;
                }
            }
        };

        if (saveInfo.isRemove === 1) {
            state.tabLabel.splice(saveInfo.isRemoveInx, 1);
            let resetObj = state[saveInfo.path.replace('/', '')];
            initFn(resetObj);
        } else if (saveInfo.isRemove === 2) {
            let leaveArr = [];
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    leaveArr.push(state.tabLabel[i]);
                    break;
                }
            }
            // 关闭全部的缓存
            let pathArr = Array.from(Store.getters.permitPath);
            for (let i = 0; i < pathArr.length; i++) {
                if (pathArr[i] === saveInfo.path) continue;
                let resetObj = state[pathArr[i].replace('/', '')];
                initFn(resetObj);
            }
            state.tabLabel.splice(0);
            state.tabLabel = leaveArr;
        } else {
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    return;
                }
            }
            if (state.tabLabel.length > 7) {
                initFn(state[state.tabLabel[0].path.replace('/', '')]);
                state.tabLabel.shift();
            }
            state.tabLabel.push(saveInfo);
        }
    },

    // 导航激活INDEX
    [types.SAVE_NAV_INDEX] (state, saveInfo) {
        state.navIndex = saveInfo;
    }
}