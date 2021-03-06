#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const [, , ...args] = process.argv;

if (args.length != 2) {
    console.log('Usage: sparkan <dataFolder/File> <targetFolder>');
    return;
}

const webappSrcFolder = `${__dirname}/../public`;
const dataFolder = path.resolve(args[0]);
const targetFolder = path.resolve(args[1]);

if (!fs.existsSync(targetFolder)) {
    console.log(`\nCreating target folder '${targetFolder}'`);
    fs.mkdirSync(targetFolder);
}

console.log('\nCopying Sparkan files:');
copyFiles(webappSrcFolder, targetFolder, ['bin', 'package.json', 'package-lock.json']);

const dataJsPath = path.join(targetFolder, 'data.js');
console.log(`\nGenerating '${dataJsPath}' from:`);
const dataJsContent = generateDataJsContent(dataFolder);
fs.writeFileSync(dataJsPath, dataJsContent);

const indexHtml = path.join(targetFolder, 'index.html');
console.log(`\nDone, open file://${indexHtml}`);
console.log('');

function copyFiles(srcFolder, targetFolder, excludes) {
    fs.readdirSync(srcFolder).forEach((file) => {
        if (!excludes.includes(file)) {
            const srcPath = path.join(srcFolder, file);
            const targetPath = path.join(targetFolder, file);
            console.log(`\tCopying '${srcPath}' to '${targetPath}'`);
            fs.copyFileSync(srcPath, targetPath);
        }
    });
}

function generateDataJsContent(dataFolder) {
    const now = new Date();
    let dataJsLines = [];
    dataJsLines.push(`// data.js - generated by sparkan-cli, at ${now.toUTCString()}.`);
    dataJsLines.push(`const createdAt = new Date("${now.toISOString()}");`);
    dataJsLines.push('const providedEvents = [');

    fs.readdirSync(dataFolder).forEach((file) => {
        const filePath = path.join(dataFolder, file);
        if (file.endsWith('.json')) {
            console.log(`\tIncluding '${filePath}'`);
            const jsonContent = fs.readFileSync(filePath);
            const json = JSON.parse(jsonContent);

            const sourceName = json.sourceName;
            json.reports.forEach((report) => {
                report.sourceName = sourceName;
                dataJsLines.push(`    ${JSON.stringify(report)},`);
            });
        } else {
            console.log(`\tIgnoring '${filePath}'`);
        }
    });
    dataJsLines.push(']\n');
    return dataJsLines.join('\n');
}
