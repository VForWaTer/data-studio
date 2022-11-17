const getParameter = require('js2args');

// get the tool names
const toolName = process.env.RUN_TOOL || 'foobar';

// load the parameters
params = getParameter();

// switch the toolName
if (toolName === 'foobar') {
   console.log('You are running the template directly. Please change the foobar function.')
   console.log(params) 
} else {
    console.error(`The toolname ${toolName} is not recognized. Did you forget to implement it?`)
}