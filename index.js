"use strict";

import { exec } from 'node:child_process';
import { stderr } from 'node:process';
import os from 'os';

const WIN_PLATFORM = 'win32';
const LINUX_PLATFORM = 'linux';
const MAC_PLATFORM = 'darwin';
const VM_REGEX = /virtual|vmWare|hyperv|wsl|hyper-v|microsoft/gi;


function getCommandOutput (command) {
    return new Promise(resolve => {
        exec(command, (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            console.log(error);

            resolve(stdout);
        });
    });
}

function isLinuxVM () {
    const LINUX_COMMAND = 'systemd-detect-virt';
    const NOT_FOUND_REGEX = /systemd-detect-virt: not found/ig;

    return new Promise(resolve => {
        let error = '';

        exec(LINUX_COMMAND, (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);

            error = stderr;
            console.log(error.message);
        }).on('exit', code => resolve(!NOT_FOUND_REGEX.test(stderr) || code === 0));
    });
}

async function isWinVM () {
    const VM_BIOS              = '0';
    const BIOS_NUMBER_COMMAND  = 'WMIC BIOS GET SERIALNUMBER';
    const MODEL_COMMAND        = 'WMIC COMPUTERSYSTEM GET MODEL';
    const MANUFACTURER_COMMAND = 'WMIC COMPUTERSYSTEM GET MANUFACTURER';

    const biosNumberOutput   = await getCommandOutput(BIOS_NUMBER_COMMAND);
    const modelOutput        = await getCommandOutput(MODEL_COMMAND);
    const manufacturerOutput = await getCommandOutput(MANUFACTURER_COMMAND);

    return biosNumberOutput === VM_BIOS || VM_REGEX.test(modelOutput) || VM_REGEX.test(manufacturerOutput);
}

async function isMacVM () {
    const MAC_COMMAND = 'ioreg -l | grep -e Manufacturer -e \'Vendor Name\'';

    return VM_REGEX.test(await getCommandOutput(MAC_COMMAND));
}
async function checkIsVM () {
    switch (os.platform()) {
        case LINUX_PLATFORM: return isLinuxVM();
        case WIN_PLATFORM: return await isWinVM();
        case MAC_PLATFORM: return await isMacVM();
        default:
            return false;
    }

    return isVM;
}

export default checkIsVM;
