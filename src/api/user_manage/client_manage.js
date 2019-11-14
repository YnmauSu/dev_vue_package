/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/10
 * Time: 17:35
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config';

// 获取客户端信息
export function getClientManageInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...params,
        ...CONFIG.ajaxData
    };
    return http.getAjax('/user/client_user/getClientUserList', data);
}

// 更新客户端信息
export function updateClientManageInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/user/client_user/updateClientUser', data);
}

// 修改用户状态
export function modifyUserState(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/user/client_user/status_set', data);
}