const getParameter = require('js2args');
const glob = require('glob');
const path = require('path');
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
    // get all file names in the input dir
    const files = glob.sync(params.dir);

    // container for the final data-file
    const data = {}

    // # TODO: build and copy the input file 
    files.forEach(file => {
        console.log(file);
        return;
        // skip parameters.json if we are scanning default /in/*
        if (file.endsWith('parameters.json')) return

        switch (path.extname(file)) {
            case '.dat':
                data[path.basename(file, '.dat')]
        }
    });

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