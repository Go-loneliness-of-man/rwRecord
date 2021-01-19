const fs = require('fs');

class lib {

    // 将一个函数转为偏函数
    partial (func, ... params) {
      return (... p2) => func(... params, ... p2);
    }

    // 打开文件
    open (path) {
        return new Promise((res, rej) => {
            fs.open(path, 'a+', '777', (err, fd) => {
                err ? res(err) : res(fd);
            });
        });
    }

    // 写文件
    fsWrite (fd, str) {
        return new Promise((res, rej) => {
            fs.write(fd, str, 0, 'utf8', (err) => {
                err ? res(err) : res();
            });
        });
    }

    // 检测文件是否存在
    exists (path) {
        return new Promise((res, rej) => {
            fs.access(path, (err) => {
                err ? res(err) : res();
            });
        });
    }

    // 创建目录
    mkdir (path) {
        return new Promise((res, rej) => {
            fs.mkdir(path, { recursive: true }, (err) => {
                err ? res(err) : res();
            });
        });
    }

    // 生成目录
    async createDir (path) {
        const pathList = path.split(/[\\/]{1}/i).slice(0, -1); // 去掉文件名
        let dir = '';
        let len = pathList.length;
        for (let i = 1; i < len; i++) {
            const item = `/${pathList[i]}`
            dir += i === 1 ? `${pathList[0]}${item}` : item;
            const isDirExists = await this.exists(dir);
            if (isDirExists) { // 创建目录
                await this.mkdir(dir);
            }
        }
    }

    // 写一次文件
    async write (path, str, callback = () => {}) {
        const fd = await this.open(path); // 打开文件
        const res = await this.fsWrite(fd, str); // 写入内容
        callback(res);
    }
}

module.exports = new lib();
