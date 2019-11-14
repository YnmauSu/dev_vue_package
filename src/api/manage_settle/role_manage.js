/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/6
 * Time: 20:52
 *
 */

import http from '@/http';
import CONFIG from '@/assets/js/config';

// 获取角色信息列表
export function getRoleInfoList(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...params,
        ...CONFIG.ajaxData
    };
    return http.getAjax('/role/role/getRoleList', data);
}

// 获取角色树状数据
export function getRoleTreeData(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/resource/resource/getResourceInfo', data);
}

// 新增角色
export function addRoleData(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/role/role/addRole', data);
}

// 修改角色
export function modifyRoleData(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/role/role/updateRole', data);
}

// 删除角色
export function deleteRoleData(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/role/role/deleteRole', data);
}