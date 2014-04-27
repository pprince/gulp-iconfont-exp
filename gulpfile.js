'use strict';

require('coffee-script/register');

process.chdir(__dirname);

var glob = require('glob');

glob.sync('tasks/*.{js,coffee}').forEach(function(taskFile){
    require('./' + taskFile);
});

