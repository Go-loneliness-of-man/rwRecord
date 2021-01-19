const Record = require('./code/rwRecord.js');

const root = `${__dirname}/logs`; // 日志目录根路径
const typeList = ['test']; // 类型列表
const env = 'production'; // 运行环境
const render = (kv) => { // 渲染函数
    let str = '';
    const hash = {
        title: v => `\n${v}`,
        content: v => `\n${v}`,
    }
    Object.keys(kv).forEach(key => {
        const value = kv[key];
        str += hash[key](value);
    });
    return str;
};

const demo1 = new Record(root, typeList, render, env);

demo1.test({
    title: '测试',
    content: '测试内容1',
});

demo1.test({
    title: '测试',
    content: '测试内容2',
});

// 修改默认行后再执行
setTimeout(() => {
    demo1.defaultRows = () => '\n\n自定义默认行';
    demo1.test({
        title: '测试2',
        content: '测试内容3',
    });

    demo1.test({
        title: '测试2',
        content: '测试内容4',
    });
}, 1000);

