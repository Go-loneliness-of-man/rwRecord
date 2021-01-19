const dayjs = require('dayjs');
const lib = require('./lib.js');
const assert = require('assert').strict; // 严格模式
const Queue = require('./queue.js'); // 过载保护队列，解决异步写入顺序问题

module.exports = class record {

    root; // 根路径
    typeList; // 日志类型列表
    render; // 渲染方法，由用户传入
    env; // 运行环境
    isDefaultRows; // 是否生成默认行
    queue; // 队列实例

    constructor(root, typeList = ['info', 'err'], render = () => { }, env = 'production', isDefaultRows = true, defaultRows = null, max = 10000 * 10) {
        const params = { typeList, root, render, env, isDefaultRows }; // 默认参数
        const paramsKeys = Object.keys(params); // 取出 key
        const retainKeys = [...paramsKeys, 'write', 'constructor', 'defaultRows', 'queue']; // 保留的类型关键字
        paramsKeys.forEach(key => { // 赋默认值
            this[key] = params[key];
        });
        if (defaultRows) { // 覆盖默认行方法
            this.defaultRows = defaultRows.bind(this);
        }
        this.queue = new Queue(max);
        this.typeList.forEach(type => { // 生成工具函数
            assert(!retainKeys.includes(type), new Error(`${type} 是保留字，请选择别的字符串作为日志类型`));
            this[type] = lib.partial(this.write.bind(this), type);
        });
    }

    // 生成默认行
    defaultRows (type) {
        const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        return `\n\n${type}\n${time}`;
    }

    // 写一条日志记录
    async write (type, kv, render = null) {
        this.queue.push(async () => { // 将任务放入队列
            const date = dayjs().format('YYYY-MM-DD'); // 当前日期
            const path = `${this.root}/${this.env}/${type}/${date}.log`; // 日志文件路径
            await lib.createDir(path); // 生成目录
            let str = this.isDefaultRows ? this.defaultRows(type) : ''; // 是否生成默认行
            str += render ? render(kv) : this.render(kv); // 是否采用全局 render
            await lib.write(path, str); // 执行写入操作
            this.queue.emit('complete'); // 通知队列写入完毕
        });
    }
}
