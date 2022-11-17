const getParameter = require('js2args');
const glob = require('glob');

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
    files.forEach(file => console.log(file));

    // compile application

    // use gulp to package a single file

    // copy to out folder


} else {
    console.error(`The toolname ${toolName} is not recognized. Did you forget to implement it?`)
}