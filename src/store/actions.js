
import { loginByUserName, getUserInfo } from '../api/login';
import * as types from './mutation-type';
import * as storage from '@/utils/storage';

export default {
    LoginByUserName ({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            loginByUserName(userInfo.user_name, userInfo.pwd).then(response => {
                const data = response.data;

            }).catch(error => {
                reject(error);
            });
        });
    }
};
