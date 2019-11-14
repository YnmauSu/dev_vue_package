
import { loginByUserName, getUserInfo } from '../api/login';
import * as types from './mutation-type';
import * as storage from '@/utils/storage';

export default {
    LoginByUserName ({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            loginByUserName(userInfo).then(response => {
                if (response.data.status) {
                    storage.setSessionStorage('user_info', response.data.data);
                }
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
};
