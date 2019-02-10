import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import { message } from '../utils/message-box';
import {
    clearSessionStorage,
    getSessionStorage
} from '@/utils/storage';
import CONFIG from '../assets/js/config'
import router from '../router'

const rootApi = CONFIG.PRODUCTION_PATH;

let http = axios.create({
    timeout: '20000'
});

let httpFile = axios.create({
    timeout: '20000',
    headers:{
        'Content-Type':'multipart/form-data'
    }
});

http.interceptors.request.use(config => {
    store.commit('SAVE_LOADING_STATE', true);
    return config;
}, error => {
    console.log(error)
});

http.interceptors.response.use(response => {
    store.commit('SAVE_LOADING_STATE', false);
    return response;
}, error => {
    if (error.response.status === 401) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    } else if (error.response.status === 402) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    }
});

httpFile.interceptors.request.use(config => {
    store.commit('SAVE_LOADING_STATE', true);
    return config;
}, error => {
    console.log(error)
});

httpFile.interceptors.response.use(response => {
    store.commit('SAVE_LOADING_STATE', false);
    return response;
}, error => {
    if (error.response.status === 401) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    } else if (error.response.status === 402) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_PRODUCTION_PATH)
        } else {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_DEVELOPMENT_PATH)
        }
    }
});

http.getAjax = function (url, params) {
    url = url.toLowerCase();
    if (process.env.NODE_ENV == 'production') {
        return http.get(rootApi + url, { params: params });
    } else {
        return http.get(url, { params: params });
    }
};

http.postAjax = function (url, params) {
    if (getSessionStorage('userInfo')) {
        params.user_id = JSON.parse(getSessionStorage('userInfo')).uid;
    }
    url = url.toLowerCase();
    if (process.env.NODE_ENV == 'production') {
        return http.post(rootApi + url, qs.stringify(params));
    } else {
        return http.post(url, qs.stringify(params));
    }
};

http.fileAjax = function (url, params) {
    if (getSessionStorage('userInfo')) {
        params.append('user_id', JSON.parse(getSessionStorage('userInfo')).uid)
    }
    url = url.toLowerCase();
    if (process.env.NODE_ENV == 'production') {
        return httpFile.post(rootApi + url, params);
    } else {
        return httpFile.post(url, params);
    }
};

export default http;