/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/10
 * Time: 16:25
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config'

// 获取资源列表
export function getResourceListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/resource/resource/getResourceInfo', data);
}

// 新增资源
export function addResourceInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/resource/resource/addResource', data);
}

// 修改资源
export function modifyResourceInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/resource/resource/editResource', data);
}

// 删除资源
export function deleteResourceInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/resource/resource/delResource', data);
}

