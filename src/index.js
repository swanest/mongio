const cmdName = process.platform === 'linux' ? ['mongorestore-linux', 'mongodump-linux'] : ['mongorestore', 'mongodump'];
const {exec, execSync} = require('child_process');

function objToOpts(args) {
    let cmd = "", keys = Object.keys(args);
    keys.forEach(function (k) {
        cmd += ` -${k} ${args[k]}`;
    });
    return cmd;
};

let backup = function (args = {}) {
    let cmd = `${__dirname}/${cmdName[1]}${objToOpts(args)}`;
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, out, stderr) => {
            if (err) return reject(err);
            return resolve();
        });
    });
};

let restore = function (args = {}) {
    let cmd = `${__dirname}/${cmdName[0]}${objToOpts(args)}`;
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, out, stderr) => {
            if (err) return reject(err);
            return resolve();
        });
    });
};

module.exports = {backup, restore};