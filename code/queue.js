const events = require('events');

// I/O 队列
module.exports = class queue extends events {
    queue = []; // I/O 队列
    max; // 最大 I/O 数
    current = false; // 当前是否正在执行 I/O

    constructor(max = 10) {
        super();
        this.max = max;
        this.on('freeTime', this.run.bind(this)); // 监听队列空闲
        this.on('complete', this.currentCut.bind(this)); // 监听 I/O 完成
    }

    // I/O 入队
    push (item) {
        this.queue.push(item); // 将 I/O 放入队列等待执行
        this.emit('freeTime'); // 通知执行
    }

    // 监听 I/O 完成
    currentCut () {
        this.current = false;
        this.emit('freeTime'); // 通知执行
    }

    // 执行 I/O
    run () {
        if (!this.queue.length) { // 队列为空，不执行
            return;
        }
        if (this.queue.length >= this.max) { // 当前队列过大，不写入，打印信息
            console.log(`队列满了，当前队列中等待的任务数：${ this.queue.length }`);
        } else if (!this.current) { // 没有正在执行的 I/O，取出一个执行
            const item = this.queue.shift(); // I/O 出队
            this.current = true;
            item(); // 执行 I/O
        }
    }
}
