const path = require("path");
const exec = require('child_process').exec;
const fs = require('fs');

const packageName = require("../package.json").name;

let pathsToProjects = [
    "/home/silas/Projekte/web/project-echo",
    // "/home/silas/Projekte/web/stories",
    "/home/silas/Projekte/web/smd-mail",
    "/home/silas/Projekte/web/hoffnungsfest",
    "/home/silas/Projekte/i9/mbb",

    // "/var/www/i9/mbb"
];

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            let curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

async function execPromise(command) {
    return new Promise((resolve, reject) => {
        console.log("executing " + command + "...");
        exec(command, (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (err) {
                reject([err, stdout, stderr]);
            } else {
                resolve([stdout, stderr]);
            }
        });
    });
}

execPromise("npm pack").then(async (std) => {
    let thisPath = process.cwd();
    let name = std[0].trim();
    let pathToTar = path.resolve(thisPath, name);

    if (!fs.existsSync("tmp")) {
        fs.mkdirSync("tmp");
    }
    process.chdir("tmp");
    await execPromise("tar -xvzf " + pathToTar + " -C ./");
    process.chdir("package");
    fs.unlinkSync("package.json");

    let promise = Promise.resolve();
    pathsToProjects.forEach((project) => {
        promise = promise.then(async () => {
            let resultDir = path.resolve(project, "node_modules", packageName);
            return execPromise("cp -r ./* "+resultDir);
        });
    });
    await promise;

    process.chdir(thisPath);
    fs.unlinkSync(name);
    deleteFolderRecursive("tmp");

    console.log("done!");
}).catch(e => {
    console.error(e);
});
