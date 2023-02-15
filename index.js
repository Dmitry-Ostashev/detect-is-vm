"use strict";

const WIN_PLATFORM = 'win32';
const LINUX_PLATFORM = 'linux';
const MAC_PLATFORM = 'darwin';
const VM_REGEX = /virtual|vmWare|hyperv|wsl/gi;

const util = require('util');
const { spawn, exec } = require('node:child_process');
const os   = require('os');

function checkCommandOutput (command) {
    return new Promise(resolve => {
        exec(command, (error, stdout, stderr) => {
            console.log(stdout);

            resolve(VM_REGEX.test(stdout));
        });
    });
}

async function isLinuxVM () {
    const LINUX_COMMAND = 'systemd-detect-virt';

    return await checkCommandOutput(LINUX_COMMAND);
}

async function checkIsVM () {
    let isVM = false;

    switch (os.platform()) {
        case LINUX_PLATFORM: isVM = await isLinuxVM();
        break;
        default:
    }

    return isVM;
}

(async () => {
    const isVM = await checkIsVM();

    console.log(isVM);
})();
