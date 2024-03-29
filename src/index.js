const fs = require("fs"),
    {exec} = require('child_process');
let cmdName = ['mongorestore', 'mongodump'];

function objToOpts(args) {
    let cmd = "", keys = Object.keys(args);
    keys.forEach(function (k) {
        let sp = " ";
        if (args[k] == "" || args[k][0] == "=")
            sp = "";
        cmd += ` --${k}${sp}${args[k]}`;
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