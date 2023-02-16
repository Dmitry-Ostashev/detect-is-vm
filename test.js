import isDocker from 'is-docker';
import checkIsVM from './index.js';
import isCI from 'is-ci';

(async () => {
    const isVM = await checkIsVM(); 

    console.log(`Is virtual machine: ${isVM}`);
    console.log(`Is docker: ${isDocker()}`);
    console.log(`Is CI: ${isCI}`);
})();