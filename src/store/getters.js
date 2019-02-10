
const getters = {
    loginInfo: state => state.loginInfo,
    systemId: state => state.systemId,
    showLoading: state => state.showLoading,
    buttonList: state => state.buttonList,
    queryParamsInfo: state => state.queryParamsInfo,
    permitPath: state => state.permitPath,
    permitResource: state => state.permitResource,

    // 导航激活index
    navIndex: state => state.navIndex,


    // 多页签
    tabLabel: state => state.tabLabel
};

export default getters