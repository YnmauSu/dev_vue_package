import http from '@/http';
import md5 from 'blueimp-md5';

export function loginByUserName (params = {}) {
    const data = {
        ...params,
        pwd: md5(params.pwd)
    };
    return http.postAjax('/login/login/adminLogin', data);
}

export function loginOut (uid) {
    const data = {
        uid: uid
    };
    return http.postAjax('/login/logout', data);
}

export function updatePassword(obj) {
    const data = {
        uid: obj.uid,
        pwd: obj.oldPwd,
        newpwd: obj.newPwd
    };
    return http.postAjax('/login/updatepwd', data);
}

export function getUserInfo(queryParams) {
    // const data = {};
    return http.getAjax('/login/login/getuserinfo', queryParams);
}