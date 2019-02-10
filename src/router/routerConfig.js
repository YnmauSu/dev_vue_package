import Store from '@/store';

const config = {
    navList: [
        {
            name: '订单管理',
            path: '',
            icon: 'icon-shouyeguanli',
            children: [
                {
                    name: '预测单',
                    path: '/',
                },
                {
                    name: '建议单',
                    path: '/'
                },
                {
                    name: '备货单',
                    path: '/'
                }
            ]
        }
    ]
};

const configFn = {
    navJumpFn(inx) {
        const configNav = this.getRouteConfig();
        let inxArr = inx.split('-');
        let to = {};
        switch (inxArr.length) {
            case 1:
                to = configNav[inxArr[0] - 1];
                break;
            case 2:
                to = configNav[inxArr[0] - 1].children[inxArr[1] - 1];
                break;
            case 3:
                to = configNav[inxArr[0] - 1].children[inxArr[1] - 1].children[inxArr[2] - 1];
                break;
        }
        return to
    },
    getRouteIndex(path) {
        const configNav = this.getRouteConfig();
        let callBack = function(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].path === path) {
                    return {
                        isTrue: 1,
                        index: i + 1
                    }
                }

                if (arr[i].children && arr[i].children.length) {
                    let backInfo = callBack(arr[i].children);
                    if (backInfo && backInfo.isTrue) {
                        return {
                            isTrue: 1,
                            index: `${i + 1}-${backInfo.index}`
                        }
                    }
                }
            }
        };

        let backInfo = callBack(configNav);
        return backInfo && backInfo.isTrue && backInfo.index
    },
    getRouteConfig() {
        // try {
        //     const configNav = [ ...config.navList ];
        //     const permit = Store.getters.permitPath;
        //     let navList = [];
        //
        //     // 递归函数
        //     let callBack = function (children) {
        //
        //         let itemList = [];
        //         for (let i = 0; i < children.length; i++) {
        //             const item = children[i];
        //             let itemArea = { ...item };
        //
        //             if (!item.path && item.children && item.children.length) {
        //                 const backArr = callBack(item.children);
        //                 if (backArr.length) {
        //                     itemArea.children = backArr;
        //                     itemList.push(itemArea)
        //                 }
        //             } else if (permit.indexOf(item.path) > -1) {
        //                 itemList.push(itemArea)
        //             }
        //         }
        //         return [...itemList]
        //     };
        //
        //     for (let i = 0; i < configNav.length; i++) {
        //         const item = configNav[i];
        //         let itemArea = { ...item };
        //
        //         if (item.children && item.children.length) {
        //             const backArr = callBack(item.children);
        //             if (backArr.length) {
        //                 itemArea.children = backArr;
        //                 navList.push(itemArea)
        //             }
        //         } else if (permit.indexOf(item.path) > -1) {
        //             navList.push(itemArea);
        //         }
        //     }
        //     return [...navList];
        // } catch (e) {
        //     console.log(e)
        // }
        return config.navList
    }

};

export default configFn;