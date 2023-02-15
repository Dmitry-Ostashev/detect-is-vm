"use strict";

const WIN_PLATFORM = 'win32';
const LINUX_PLATFORM = 'linux';
const MAC_PLATFORM = 'darwin';
const VM_REGEX = /virtual|vmWare|hyperv|wsl/gi;

const util = require('util');
const { spawn, exec } = require('node:child_process');
const os   = require('os');

function getCommandOutput (command) {
    return new Promise(resolve => {
        exec(command, (error, stdout, stderr) => {
            console.log(stdout);

            resolve(stdout);
        });
    });
}

async function isLinuxVM () {
    const LINUX_COMMAND = 'systemd-detect-virt';
    const output        = await getCommandOutput(LINUX_COMMAND);

    return VM_REGEX.test(output);
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

async function checkIsVM () {
    switch (os.platform()) {
        case LINUX_PLATFORM: return await isLinuxVM();
        case WIN_PLATFORM: return await isWinVM();
        default:
            return false;
    }

    return isVM;
}

module.exports = checkIsVM;
