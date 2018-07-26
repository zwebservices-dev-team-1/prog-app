'use strict';

import './style-sheet.css';
import './project_media/common/scss/main.scss';

require('./project_media/common/js/polyfills.js')();

require('./vendors.js')();

var APP = require('./project_media/common/js/script.js')();

// var Util = require("./project_media/common/js/util.js");
