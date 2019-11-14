/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/6
 * Time: 9:41
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config';

// 获取用户信息列表
export function getUserInfoList(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...params,
        ...CONFIG.ajaxData
    };
    return http.getAjax('/user/user/getAdminUserList', data);
}

// 新增用户信息
export function confirmAddUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/user/user/addAdminUser', data);
}

// 修改用户信息
export function confirmModifyUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/user/user/updateAdminUser', data);
}

// 修改用户状态
export function toggleUserState(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/user/user/enableProhibitUser', data);
}
