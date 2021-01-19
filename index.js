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

// 基本用法
demo1.test({
    title: '测试',
    content: '测试内容1',
});
demo1.test({
    title: '测试',
    content: '测试内容2',
});

// 在写入时传入 render，替换全局 render
const render2 = () => '\n直接传入 render，替换全局 render';
demo1.test({
    title: '测试2',
    content: '测试内容3',
}, render2);
demo1.test({
    title: '测试2',
    content: '测试内容4',
}, render2);

// 修改默认行后再执行，由于同步代码执行快于异步执行的队列，这里延迟 1s 再修改配置演示
setTimeout(() => {
    demo1.defaultRows = () => '\n\n自定义默认行';
    demo1.test({
        title: '测试3',
        content: '测试内容5',
    });
    demo1.test({
        title: '测试3',
        content: '测试内容6',
    });
}, 1000);
