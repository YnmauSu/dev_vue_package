/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/12
 * Time: 20:16
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config';

// 获取推广列表信息
export function getSpreadPageInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...params,
        ...CONFIG.ajaxData
    };
    return http.getAjax('/system/popularize/getPopularizeList', data);
}

// 添加视频分类
export function addSpreadInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/system/popularize/addPopularize', data);
}

// 修改视频分类
export function modifySpreadInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/system/popularize/updatePopularize', data);
}

// 切换状态
export function toggleSpreadState(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/system/popularize/show_set', data);
}