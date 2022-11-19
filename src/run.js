const getParameter = require('js2args');
const glob = require('glob');
const shell = require('shelljs');
const fs = require('fs-extra');

// get the tool names
const toolName = process.env.RUN_TOOL || 'studio';


// switch the toolName
if (toolName === 'studio') {
    // load the parameters
    const params = getParameter();

    // copy the recognized datasets to the application
    if (!params.dir) {
        params.dir = '/in/*'
    }
    const files = glob.sync(params.dir);
    // # TODO: build and copy the input file 
    files.forEach(file => console.log(file));

    // compile application
    shell.exec('cd src/data-studio && npm run build')
    // copy to out folder
    fs.copySync('/src/data-studio/build', '/out/build', {overwrite: true})

    // use gulp to package a single file
    shell.exec('cd src/data-studio && npx gulp')
    // copy to out folder
    fs.copyFileSync('/src/data-studio/build/index.html', '/out/index.html', {overwrite: true})


} else {
    console.error(`The toolname ${toolName} is not recognized. Did you forget to implement it?`)
}