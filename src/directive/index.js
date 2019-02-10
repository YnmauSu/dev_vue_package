/*
 * @Author: CaseeLee 
 * @Date: 2018-12-04 9:53:09 
 * @Last Modified by: CaseeLee
 * @Last Modified time: 2018-12-04 15:52:52
 */

/**
 * 全局动态添加属性指令
 * @param {*} el :指定dom
 * @param {*} binding :绑定对象
 */
export const bindingProp = function (el, binding) {
    if (!binding.value) return;
    Object.keys(binding.value).forEach(item => {
        el.setAttribute(item, binding.value[item]);
    });
};

export default {
    bindingProp,
}

