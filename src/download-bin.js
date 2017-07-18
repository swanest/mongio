const https = require('https'),
    fs = require('fs'),
    BASE_URL = 'https://raw.githubusercontent.com/swanest/mongio/master/bin/',
    crypto = require('crypto'),
    pkg = require('../package.json');

let PLATFORM = '';
if (process.platform === 'linux') {
    if (fs.existsSync('/etc/alpine-release'))
        PLATFORM = '-linux-alpine';
    else
        PLATFORM = '-linux';
}

['mongodump', 'mongorestore'].forEach(function (binaryName) {
    new Promise(
        function (resolve, reject) {
            const binaryFile = fs.createWriteStream(__dirname + '/' + binaryName);
            console.log('Downloading %s', BASE_URL + binaryName + PLATFORM);
            https.get(BASE_URL + binaryName + PLATFORM, function (response) {
                response.pipe(binaryFile);
                binaryFile.on('finish', function () {
                    binaryFile.close(resolve);
                });
            }).on('error', function (err) {
                fs.unlink(__dirname + '/' + binaryName);
                reject(err.message);
            });
        })
        .then(function () {
            return checksum(__dirname + '/' + binaryName);
        })
        .then(function (hash) {
            if (pkg.checksums[binaryName + PLATFORM] === hash) {
                console.log('Checksum OK (%s): %s', binaryName, hash);
                fs.chmodSync(__dirname + '/' + binaryName, '755');
            } else {
                console.error('Checksum ERROR %s (%s) != %s (%s)', hash, binaryName, pkg.checksums[binaryName + PLATFORM], binaryName + PLATFORM);
                process.exit(1);
            }
        })
        .catch(function (e) {
            console.error(e);
            process.exit(1);
        });
});

function checksum(file) {
    const hash = crypto.createHash('md5');

    const stream = fs.createReadStream(file);

    stream.on('data', function (data) {
        hash.update(data, 'utf8')
    });

    return new Promise(function (resolve) {
        stream.on('end', function () {
            resolve(hash.digest('hex'));
        })
    });
}