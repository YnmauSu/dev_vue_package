/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/10
 * Time: 18:18
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config';

// 获取视频分类信息
export function getVideoClassifyList(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...params,
        ...CONFIG.ajaxData
    };
    return http.getAjax('/video/video_class/getVideoClassList', data);
}

// 添加视频分类
export function addVideoClassify(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/video/video/addVideoClass', data);
}

// 修改视频分类
export function modifyVideoClassify(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/video/video_class/updateVideoClass', data);
}

// 删除视频分类
export function deleteVideoClassify(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/video/video_class/deleteClass', data);
}