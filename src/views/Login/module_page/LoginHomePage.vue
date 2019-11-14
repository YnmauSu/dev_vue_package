<template>
    <div class="ui-login">
        <div class="ui-login_header"></div>
        <div class="ui-login_content">
            <div class="ui-login__title">
                欢迎
            </div>
            <div class="ui-login_window shadow">
                <div class="ui-login__dialog--toggle" v-if="isOperation !== 'forgetPwd'">
                <span :class="isOperation === 'login' && 'ui-login___dialog--active'"
                      style="margin: 0 auto;"
                      @click="handleToggleOperation('login')">登录</span>
                    <!--<span :class="isOperation === 'register' && 'ui-login___dialog&#45;&#45;active'"-->
                          <!--@click="handleToggleOperation('register')">注册</span>-->
                </div>
                <div class="ui-login__dialog--title" v-if="isOperation === 'forgetPwd'">
                    <span>重置密码</span>
                    <span class="ui-btn_close" @click="closeResetView"></span>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0"
                         class="ui-login__dialog__form">
                    <div v-if="isOperation === 'login'">
                        <el-form-item prop="username" class="ui-login__dialog__input">
                            <el-input type="text"
                                      v-model="loginForm.username"
                                      auto-complete="off"
                                      placeholder="帐号"
                                      @keyup.enter.native="handleLoginSubmit">
                                <i class="iconfont icon-shoujihaoma" slot="prefix"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password" class="ui-login__dialog--not_margin">
                            <el-input
                                type="password"
                                v-model="loginForm.password"
                                auto-complete="off"
                                placeholder="密码"
                                @keyup.enter.native="handleLoginSubmit">
                                <i class="iconfont icon-mima" slot="prefix"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="ui-login__dialog__input text_left ui-about_forget">
                            <el-checkbox v-model="isSavePwd">记住密码</el-checkbox>
                            <!--<span class="ui-login__dialog__wjpwd" @click="handleClickLogin('forgetPwd')">忘记密码</span>-->
                        </el-form-item>
                        <div class="ui-login__dialog__button">
                            <el-button type="primary" @click="handleLoginSubmit" :loading="loading">登录</el-button>
                            <!--<el-button type="text" class="ui-login__dialog__button&#45;&#45;register">注册</el-button>-->
                        </div>
                    </div>

                    <div v-if="isOperation === 'register'" class="ui-login__dialog--register">
                        <el-form-item prop="phone" class="ui-login__dialog__input">
                            <el-input type="text"
                                      v-model="loginForm.phone"
                                      auto-complete="off"
                                      placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="identifyingCode" class="ui-login__dialog__input">
                            <el-input type="text" class="ui-code_input"
                                      v-model="loginForm.identifyingCode"
                                      auto-complete="off"
                                      placeholder="请输入验证码"></el-input>
                            <el-button type="primary" v-if="!codeTimeOut" class="ui-login__dialog--get_code"
                                       size="small"
                                       @click="handleGetValidateCode('1')">获取验证码
                            </el-button>
                            <el-button type="primary" v-if="codeTimeOut" disabled class="ui-login__dialog--get_code"
                                       size="small" @click="handleGetValidateCode('1')">{{timeOutNumber}}秒后可再次发送
                            </el-button>
                        </el-form-item>
                        <el-form-item prop="registerPwd" class="ui-login__dialog__input">
                            <el-input type="password"
                                      v-model="loginForm.registerPwd"
                                      auto-complete="off"
                                      placeholder="请输入密码"
                                      @blur="handleValidateRegisterPassword('registerPwd')"></el-input>
                        </el-form-item>
                        <el-form-item prop="registerAgainPwd" class="ui-login__dialog__input">
                            <el-input type="password"
                                      v-model="loginForm.registerAgainPwd"
                                      auto-complete="off"
                                      placeholder="请再次输入密码"
                                      @blur="handleValidateRegisterPassword('registerAgainPwd')"></el-input>
                        </el-form-item>
                        <div class="ui-login__dialog__button ui-btn_success">
                            <el-button type="primary" @click="handleSaveRegister">注册</el-button>
                            <!--<el-button type="text" class="ui-login__dialog__button&#45;&#45;register">注册</el-button>-->
                        </div>
                    </div>

                    <div v-if="isOperation === 'forgetPwd'" class="ui-login__dialog--register">
                        <el-form-item prop="forgetPhone" class="ui-login__dialog__input">
                            <el-input type="text"
                                      v-model="loginForm.forgetPhone"
                                      auto-complete="off"
                                      placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="forgetIdentifyingCode" class="ui-login__dialog__input">
                            <el-input type="text" class="ui-code_input"
                                      v-model="loginForm.forgetIdentifyingCode"
                                      auto-complete="off"
                                      placeholder="请输入验证码"></el-input>
                            <el-button v-if="!codeTimeOut" type="primary" class="ui-login__dialog--get_code"
                                       size="small"
                                       @click="handleGetValidateCode('2')">获取验证码
                            </el-button>
                            <el-button v-if="codeTimeOut" disabled type="primary" class="ui-login__dialog--get_code"
                                       size="small" @click="handleGetValidateCode('2')">{{timeOutNumber}}秒后可再次发送
                            </el-button>
                        </el-form-item>
                        <el-form-item prop="forgetPwd" class="ui-login__dialog__input">
                            <el-input type="password"
                                      v-model="loginForm.forgetPwd"
                                      auto-complete="off"
                                      placeholder="请输入密码"
                                      @blur="handleValidateForgetPassword('forgetPwd')"></el-input>
                        </el-form-item>
                        <el-form-item prop="forgetAgainPwd" class="ui-login__dialog__input">
                            <el-input type="password"
                                      v-model="loginForm.forgetAgainPwd"
                                      auto-complete="off"
                                      placeholder="请再次输入密码"
                                      @blur="handleValidateForgetPassword('forgetAgainPwd')"></el-input>
                        </el-form-item>
                        <div class="ui-login__dialog__button ui-btn_success">
                            <el-button type="primary" @click="handleResetPassword">完成</el-button>
                            <!--<el-button type="text" class="ui-login__dialog__button&#45;&#45;register">注册</el-button>-->
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
        <!--<div class="footer"><span class="copyright">Copyright 深圳市易佰网络科技有限公司.</span><span>| 备案号：粤ICP备16061117号-1</span></div>-->
    </div>
</template>

<script>
    import * as storage from '@/utils/storage';
    import {
        // loginByUserName,
        // getMessageValidateCode,
        // registerByUserName,
        // resetPassword
    } from '../../../api/login'
    import {mapActions} from 'vuex';
    import CONFIG from '../../../assets/js/config'

    export default {
        name: "LoginNavBar",
        data() {
            return {
                isSavePwd: false,
                loading: false,
                isOperation: 'login',
                loginForm: {
                    password: '',
                    username: '',
                    errmsg: '',
                    phone: '',
                    identifyingCode: '',
                    registerPwd: '',
                    registerAgainPwd: '',
                    forgetIdentifyingCode: '',
                    forgetPhone: '',
                    forgetPwd: '',
                    forgetAgainPwd: ''
                },
                rules: {
                    password: [
                        {
                            required: true,
                            message: '请输入正确的密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在6-15位字符之间',
                            trigger: 'blur'
                        },
                        // {
                        //     ...CONFIG.rule.password
                        // },
                        {
                            pattern: /^[0-9A-Za-z]+$/,
                            trigger: 'blur',
                            message: '密码只能是大小写字母加数字的组合'
                        }
                    ],
                    username: [
                        {
                            required: true,
                            message: '请输入正确的账号',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 15,
                            message: '长度在2-15位字符之间',
                            trigger: 'blur'
                        }
                    ],
                    registerPwd: [
                        {
                            required: true,
                            message: '密码不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在6-15位字符之间',
                            trigger: 'blur'
                        },
                        {
                            pattern: '',
                            trigger: 'blur',
                            message: '密码不一致'
                        },
                        // {
                        //     ...CONFIG.rule.password
                        // },
                        {
                            pattern: /^[0-9A-Za-z]+$/,
                            trigger: 'blur',
                            message: '密码只能是大小写字母加数字的组合'
                        }
                    ],
                    registerAgainPwd: [
                        {
                            required: true,
                            message: '密码不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在6-15位字符之间',
                            trigger: 'blur'
                        },
                        {
                            pattern: '',
                            trigger: 'blur',
                            message: '密码不一致'
                        },
                        // {
                        //     ...CONFIG.rule.password
                        // },
                        {
                            pattern: /^[0-9A-Za-z]+$/,
                            trigger: 'blur',
                            message: '密码只能是大小写字母加数字的组合'
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            message: '手机号不能为空',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^1[0-9]{10}$/,
                            trigger: 'blur',
                            message: '请输入正确的手机号'
                        }
                    ],
                    forgetPhone: [
                        {
                            required: true,
                            message: '手机号不能为空',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^1[0-9]{10}$/,
                            trigger: 'blur',
                            message: '请输入正确的手机号'
                        }
                    ],
                    identifyingCode: [
                        {
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'
                        }
                    ],
                    forgetIdentifyingCode: [
                        {
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'
                        }
                    ],
                    forgetPwd: [
                        {
                            required: true,
                            message: '密码不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在6-15位字符之间',
                            trigger: 'blur'
                        },
                        {
                            pattern: '',
                            trigger: 'blur',
                            message: '密码不一致'
                        },
                        // {
                        //     ...CONFIG.rule.password
                        // },
                        {
                            pattern: /^[0-9A-Za-z]+$/,
                            trigger: 'blur',
                            message: '密码只能是大小写字母加数字的组合'
                        }
                    ],
                    forgetAgainPwd: [
                        {
                            required: true,
                            message: '密码不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在6-15位字符之间',
                            trigger: 'blur'
                        },
                        {
                            pattern: '',
                            trigger: 'blur',
                            message: '密码不一致'
                        },
                        // {
                        //     ...CONFIG.rule.password
                        // },
                        {
                            pattern: /^[0-9A-Za-z]+$/,
                            trigger: 'blur',
                            message: '密码只能是大小写字母加数字的组合'
                        }
                    ]
                },

                // 验证码延时
                codeTimeOut: false,
                timeOutNumber: 0
            }
        },
        created() {
            if (storage.getLocalStorage('userPwd')) {
                const userPwd = JSON.parse(storage.getLocalStorage('userPwd'));
                this.loginForm.username = userPwd.username;
                this.loginForm.password = userPwd.userpass;
                this.isSavePwd = true;
            } else {
                this.isSavePwd = false;
            }
        },
        methods: {
            ...mapActions([
                'LoginByUserName',
                'GetSystemModuleList'
            ]),
            // loginByUserName,
            // getMessageValidateCode,
            // registerByUserName,
            // resetPassword,

            // 切换操作
            handleToggleOperation(val) {
                this.isOperation = val;
            },
            // 退出重置密码
            closeResetView(){
                this.isOperation = 'login';
            },
            // 点击登录
            handleClickLogin(key) {
                this.isOperation = key
            },

            // 登录
            handleLoginSubmit() {
                this.$refs.loginForm.validate(res => {
                    if (res) {
                        console.log(this.loginForm);
                        let obj = {
                            login_name: this.loginForm.username,
                            pwd: this.loginForm.password
                        };
                        this.LoginByUserName(obj).then(({ data }) => {
                            if (data.status) {
                                this.$message.success('操作成功！');
                                this.$router.push({
                                    path: '/home'
                                })
                            } else {
                                this.$message.error(data.errorMess || '操作失败！');
                            }
                        })
                    }
                })
            },

            // 手动校验注册密码框
            handleValidateRegisterPassword() {
                if (this.loginForm.registerAgainPwd && this.loginForm.registerPwd) {
                    this.rules['registerPwd'][2].pattern = new RegExp("^" + this.loginForm.registerAgainPwd + "$", "gm");
                    this.rules['registerAgainPwd'][2].pattern = new RegExp("^" + this.loginForm.registerPwd + "$", "gm");

                    // registerPwd
                    this.$refs['loginForm'] && this.$refs['loginForm'].validateField('registerPwd', function (e) {
                        console.log(e);
                    });
                    this.$refs['loginForm'] && this.$refs['loginForm'].validateField('registerAgainPwd', function (e) {
                        console.log(e);
                    });
                }
            },

            // 校验忘记密码密码框
            handleValidateForgetPassword() {
                if (this.loginForm.forgetAgainPwd && this.loginForm.forgetPwd) {
                    this.rules['forgetPwd'][2].pattern = new RegExp("^" + this.loginForm.forgetAgainPwd + "$", "gm");
                    this.rules['forgetAgainPwd'][2].pattern = new RegExp("^" + this.loginForm.forgetPwd + "$", "gm");

                    // registerPwd
                    this.$refs['loginForm'] && this.$refs['loginForm'].validateField('forgetPwd', function (e) {
                        console.log(e);
                    });
                    this.$refs['loginForm'] && this.$refs['loginForm'].validateField('forgetAgainPwd', function (e) {
                        console.log(e);
                    });
                }
            },

            // 获取验证码
            handleGetValidateCode(type) {
                let key = type === '1' ? 'phone' : 'forgetPhone';
                this.$refs['loginForm'] && this.$refs['loginForm'].validateField(key, (e) => {
                    if (!e) {
                        let obj = {
                            type: type,
                            tel: this.loginForm[key]
                        };
                        this.getMessageValidateCode(obj).then(({data}) => {
                            if (data.status) {
                                this.$message.success('验证码已发送, 请注意查收!');
                                this.codeTimeOut = true;
                                this.timeOutNumber = 60;
                                const timeout = setInterval(() => {
                                    this.timeOutNumber--;
                                    if (this.timeOutNumber <= 0) {
                                        clearInterval(timeout);
                                        this.codeTimeOut = false;
                                    }
                                }, 1000);
                            } else {
                                this.$message.error(data.errorMess || '操作失败!')
                            }
                        })
                    }
                });
            },

            // 注册
            handleSaveRegister() {

                this.$refs['loginForm'].validate((res) => {
                    if (res) {
                        let obj = {
                            tel: this.loginForm.phone.trim(),
                            password: this.loginForm.registerPwd,
                            identifying_code: this.loginForm.identifyingCode.trim(),
                        };

                        this.registerByUserName(obj).then(({data}) => {
                            if (data.status) {
                                this.$message.success('注册成功!');
                                this.$store.commit('SAVE_LOGIN_INFO', data);
                                this.$router.push('/enterprise_info');
                            } else {
                                this.$message.error(data.errorMess || '操作失败!')
                            }
                        });
                    }
                });
            },

            // 重置密码
            handleResetPassword() {
                this.$refs['loginForm'].validate((res) => {
                    if (res) {
                        let obj = {
                            tel: this.loginForm.forgetPhone.trim(),
                            pwd: this.loginForm.forgetAgainPwd,
                            identifying_code: this.loginForm.forgetIdentifyingCode.trim()
                        };
                        this.resetPassword(obj).then(({data}) => {
                            if (data.status) {
                                this.isOperation = 'login';
                                this.loginForm.forgetIdentifyingCode = '';
                                this.loginForm.forgetPhone = '';
                                this.loginForm.forgetPwd = '';
                                this.loginForm.forgetAgainPwd = '';
                                this.$message.success('操作成功!');
                            } else {
                                this.$message.error(data.errorMess || '操作失败')
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    @import (reference) '../../../assets/less/index';
    @base-nav-height: 40px;
    @font-color: #00234a;
    @font-size: 16px;
    @window-width: 1920 / 100%;
    @active-color: #048fD4;
    .ui-login {
        font-size: @font-size;
        .ui-btn_success{
            margin-top: 55px;
        }
        .ui-login_content {
            position: absolute;
            left: 50%;
            top: 218px;
            z-index: 100;
            margin-left: -227px;
        }
        .ui-login__title {
            font-size: 33px;
            color: #fff;
            font-weight: bold;
            margin-bottom: 40px;
        }
        .ui-login_header {
            width: 100%;
            height: 445px;
            background: url("../../../assets/image/login-bg.jpg") no-repeat center;
            background-size: cover;
        }
        .ui-login__dialog--title {
            font-size: 17px;
            margin-bottom: 20px;
            color: @active-color;
        }
        .ui-login_window {
            width: 280px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            padding: 30px 65px;
            .ui-login__dialog--toggle {
                display: flex;
                justify-content: space-between;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 30px;
                span {
                    padding: 0 15px 12px;
                }
                .ui-login___dialog--active {
                    border-bottom: 2px solid @active-color;
                }
            }
            .el-button {
                width: 100%;
            }
            .ui-login__dialog__wjpwd {
                float: right;
            }
            .ui-about_forget {
                margin-bottom: 40px;
                /*margin-top: -18px;*/
                text-align: left;
            }
            .ui-code_input {
                width: 72%;
                float: left;
                input {
                    width: 100%;
                }
            }
            .ui-login__dialog--get_code {
                width: 25%;
                padding: 12px 5px;
                float: right;
            }
        }
        .ui-btn_close {
            color: #898989;
            border-radius: 12px;
            line-height: 20px;
            text-align: center;
            height: 20px;
            width: 20px;
            font-size: 13px;
            padding: 1px;
            position: absolute;
            top: 12px;
            right: 10px;
        }
        .ui-btn_close::before {
            content: "\2716";
        }
        .shadow {
            position: relative;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0),
            0px 0px 20px rgba(0, 0, 0, 0.1) inset;
        }

        .shadow::before,
        .shadow::after {
            content: "";
            position: absolute;
            z-index: -1;
            bottom: 15px;
            left: 15px;
            width: 50%;
            height: 20%;
            box-shadow: 0 20px 15px rgba(0, 0, 0, 0.1);
            transform: rotate(-4deg);
        }

        .shadow::after {
            right: 15px;
            left: auto;
            transform: rotate(3deg);
        }
        .ui-login__content {
            width: 1390px;
            margin: 0 auto;
        }

        .ui-login__head {
            overflow: hidden;
            height: @base-nav-height;
            background: #ffffff;

            .ui-login__head__logo {
                margin-top: 20px;
                float: left;
                /*margin-left: 260px;*/
            }

            .ui-login__nav {
                margin-left: 250px;
                float: left;
            }

            .ui-login__operate {
                float: right;
            }

            .ui-login__nav, .ui-login__operate {
                color: @font-color;
                margin-top: 35px;

                li {
                    float: left;
                    height: 35px;

                    span {
                        display: inline-block;
                        margin: 0 30px;
                        height: 35px;
                        border-bottom: 4px solid transparent;
                        cursor: pointer;

                        &:hover {
                            color: @active-color;
                        }
                    }

                    span.ui-login__nav--active {
                        border-color: @active-color;
                        color: @active-color;
                    }
                }
            }
        }
        .footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 112px;
            line-height: 112px;
            text-align: center;
            .copyright {
                margin-right: 20px;
            }
        }
    }
</style>
