/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/10
 * Time: 19:02
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config';

// 获取视频分类信息
export function getVideoListInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...params,
        ...CONFIG.ajaxData
    };
    return http.getAjax('/video/video/getVideoList', data);
}

// 添加视频信息
export function addVideoInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/video/video/addVideo', data);
}

// 修改视频信息
export function modifyVideoInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/video/video/updateVideo', data);
}

// 修改上架信息
export function togglePushInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/video/video/push_set', data);
}