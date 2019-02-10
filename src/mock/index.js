import Mock from 'mockjs';

let Random = Mock.Random;

Random.datetime('yyyy-MM-dd HH:mm:ss');

let data = Mock.mock({
    data_list: {
        key: ['序号', '图片', '标题', '摘要', '资讯类型', '活动状态', '发布时间', '操作'],
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'value|1-20': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            'image': require('../assets/image/wenjian.png'),
            'title|1': ['易佰网络', '易佰咨询', '易佰云', '易佰风光', '易佰美女'],
            'detail|1': ['基多拉坑王驾到辣鸡往来单据卡位建档立卡无尽的快乐静安寺来得及拉我还', '大连裤袜吉林大街瓦楞机快来救我', '交流电卡未接来电jaw来得及拉我觉得离开', '忽视的好时机大赛科技把那些部门那'],
            'type|1': ['尾牙年会', '生日会', '兴趣俱乐部', '部门团建', '公司动态'],
            'state|1': ['待审核', '审核不通过', '已发布', '已撤回', '待提交'],
            'time|1': '@datetime',
            'detailInfo|1': []
        }]
    },
    page_data: {
        limit: 20,
        offset: 1,
        'total|1-20': 1
    }
});

let postSettingdata = Mock.mock({
    data_list: {
        key:  ["序号", "职位名称",  "职位类型", "所属部门", "工作地点", "状态", "操作"],
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'value|1-20': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            'applyName': 'bb',
            'is_del': 1,
            'title|1': ['易佰网络', '易佰咨询', '易佰云', '易佰风光', '易佰美女'],
            'detail|1': ['基多拉坑王驾到辣鸡往来单据卡位建档立卡无尽的快乐静安寺来得及拉我还', '大连裤袜吉林大街瓦楞机快来救我', '交流电卡未接来电jaw来得及拉我觉得离开', '忽视的好时机大赛科技把那些部门那'],
            'type|1': ['尾牙年会', '生日会', '兴趣俱乐部', '部门团建', '公司动态'],
            'state|1': ['待审核', '审核不通过', '已发布', '已撤回', '待提交'],
            'time|1': '@datetime'
        }],
        data_list: {
            status_list: {1: "已发布", 2: "待发布", 3: "已撤销"},
            department: {'开发': "开发", '技术': "技术", '产品': "产品"},
            jobArea: {'南山': "南山", '罗湖': "罗湖", '清湖': "清湖"},
            jobType: {'Java工程师': "Java工程师", 'php': "php", 'web': "web"},
        }
    },
    status: 1,
    page_data: {
        limit: 20,
        offset: 1,
        'total|1-20': 1
    }
});
// let data = require('../api/json_data/census_register');

Mock.mock(/\/api\/consult_list\/getinfo/, function (option) {
    return {
        ...data
    }
});

Mock.mock(/\/api\/post_setting\/list/, function (option) {
    return {
        ...postSettingdata
    }
});