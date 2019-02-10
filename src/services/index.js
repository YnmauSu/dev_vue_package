import * as Storage from '@/utils/storage';
import CONFIG from '@/assets/js/config'
import qs from 'qs';

// 表格INX
export function autoAddTableInx(inx) {
    let i = parseInt(inx) + 1 + '';
    let first = '0';
    return first.repeat(4 - i.length) + i
}

// 获取默认时间
export function getDefaultTime(value = 'Y-M-D') {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let nowDay = nowTime.getDate();
        let [isYear, isMonth, isDay] = [value.indexOf('Y') > -1, value.indexOf('M') > -1, value.indexOf('D') > -1];
        let date1 = `${isYear ? year : ' '}-${isMonth ? month : ' '}-${isDay ? '01' : ''}`.replace(/[-\s]{2}/, '').replace(/((^\s+-)|(\s+-$)|(-$))/, '');
        let date2 = `${isYear ? year : ' '}-${isMonth ? month : ' '}-${isDay ? nowDay : ''}`.replace(/[-\s]{2}/, '').replace(/((^\s+-)|(\s+-$)|(-$))/, '');

        let hour = nowTime.getHours();
        let minute = nowTime.getMinutes();
        let second = nowTime.getSeconds();

        let [isHour, isMinute, isSecond] = [value.indexOf('h') > -1, value.indexOf('m') > -1, value.indexOf('s') > -1];
        let dateTs = `${isHour ? '00' : ' '}:${isMinute ? '00' : ' '}:${isSecond ? '00' : ''}`.replace(/[:\s]{2}/, '').replace(/((^\s+:)|(\s+:$))/, '');
        let dateTe = `${isHour ? hour : ' '}:${isMinute ? minute : ' '}:${isSecond ? second : ''}`.replace(/[:\s]{2}/, '').replace(/((^\s+:)|(\s+:$))/, '');

        let dateS = date1 + (dateTs && date1 ? ' ' + dateTs : dateTs);
        let dateE = date2 + (dateTe && date2 ? ' ' + dateTe : dateTe);

        if (dateS && dateE) {
            resolve({
                start: dateS,
                end: dateE
            })
        } else {
            reject({
                start: '0000-10-17',
                end: '9999-10-17'
            })
        }
    })
}

//获取默认时间（单日期）
export function getSingleDate() {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let nowDay = nowTime.getDate();
        // let date1 = year + '-' + month + '-' + '01';
        let dates = year + '-' + month + '-' + nowDay;

        if (dates) {
            resolve({
                date: dates,
            })
        } else {
            reject({
                date: 9999-10-17,
            })
        }
    })
}


//转换日期格式
Date.prototype.format= function(format) {
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))  format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

//获取当月的下一个月时间（包含年份）
export function getNextTime() {

    return new Promise((resolve, reject) => {

        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 2 > 12 ? 1 : nowTime.getMonth() + 2;
        let date1 = new Date(year, month-1, 1).format('yyyy-MM-dd');
        let date2 = new Date(year, month, 0).format('yyyy-MM-dd');

        if (date1 && date2) {
            resolve({
                start: date1,
                end: date2
            })
        } else {
            reject({
                start: '0000-10-17',
                end: '9999-10-17'
            })
        }
    })
}

//获取当月的下一个月份
export function getNextMonth() {

    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 2 > 12 ? 1 : nowTime.getMonth() + 2;
        let date1 = new Date(year, month-1, 1).format('MM-dd');
        let date2 = new Date(year, month, 0).format('MM-dd');


        if (date1 && date2) {
            resolve({
                start: date1,
                end: date2
            })
        } else {
            reject({
                start: '10-17',
                end: '10-17'
            })
        }
    })
}

//获取默认月份
export function getDefaultMonth() {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let currentMonth = year + '-' + month;

        if(currentMonth){
            resolve({
                month: currentMonth
            })
        }else {
            reject({
                month: '0000-10'
            })
        }
    })
}

//计算天数
export function getDays() {
    let s1 = '2016-05-12';
    let s2 = '2016-05-12';
    s1 = new Date(s1.replace(/-/g, "/"));
    s2 = new Date(s2.replace(/-/g, "/"));
    let days = s2.getTime() - s1.getTime();
    let time = parseInt(days / (1000 * 60 * 60 * 24));
}

/**
 * 获取指定时间
 *      params
 *          type: 类型 默认 aftertime ; val N个月后的日期
 * */
export function getAppointDate(val, num = 3, type = 'aftertime') {
    let backVal;
    switch (type) {
        case 'aftertime':
            let month = val.match(/-\d{1,2}/)[0];
            let inx = val.search(/-\d{1,2}/);
            month *= -1;
            let totalMonth = month + num;
            let addYear = Math.floor((month + num) / 12);
            let intCountDate = totalMonth % 12 || totalMonth;

            let countDate = totalMonth <= 12 ? `${val.substring(0, inx)}-${intCountDate}` : `${val.substring(0, inx) * 1 + addYear}-${intCountDate}`;
            let is31Day = [1, 3, 5, 7, 8, 10, 12];
            let is30Day = [4, 6, 9, 11];

            let day = val.match(/-\d{1,2}$/)[0] * - 1;

            if (is31Day.indexOf(intCountDate) > -1) {
                day = day > 31 ? 31 : day;
            } else if (is30Day.indexOf(intCountDate) > -1) {
                day = day > 30 ? 30 : day;
            } else {
                if (val.substring(0, 3) % 4 === 0) {
                    day = day > 29 ? 29 : day;
                } else {
                    day = day > 28 ? 28 : day;
                }
            }
            backVal = countDate + '-' + day;
            break;
    }
    return backVal;
}

// 按钮权限控制
export function autoButtonAuthorityControl (name) {
    // console.log(this);
    console.log(name);
    return false;
}

// 获取地址栏参数
export function getAddressModelParams() {
    let path = window.location.href.replace('#/', '');
    let pathParams = path.substring(path.indexOf('?') + 1, path.length);
    return qs.parse(pathParams)
}

// 刷新内容高度
let timeout;
export function refreshContentHeight(vm) {
    document.querySelector('body').style.overflow = 'hidden';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        vm.initTable = false;
        vm.tableHeight = CONFIG.setTableHeight('ui-main-module');
        vm.initTable = true;
        document.querySelector('body').style.overflow = '';
    }, 400)
}

/**
 * 遍历表格数据
 * params:
 *          data  表格列表数据
 *          prop1 需要的key
 *          prop2 转后的value
 *           list  optionList
 * */

export function changeTableInfoProps(data, prop1, prop2, list, key = 'key', value = 'value') {
    if (Array.isArray(list)) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < list.length; j++) {
                if (list[j][key] === (data[i][prop1] + '')) {
                    data[i][prop2] = list[j][value];
                    break;
                }
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            data[i][prop2] = list[data[i][prop1]];
        }
    }
}

/**
 * 距离当天30天日期
 *          
 * */

export function getThirtyDayDateRange() {
    const end = new Date();
    const endDate = formatDate(end)
    const thirtyDay = 1000 * 60 * 60 * 24 * 30;
    const start = end.getTime() - thirtyDay;
    const startDate = formatDate(new Date(start))
    return [startDate, endDate]
}

function formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1): ('0' + date.getMonth() + 1)
    const day = date.getDate() > 10 ? (date.getDate()): ('0' + date.getDate())
    return year + '-' + month + '-' + day
}
