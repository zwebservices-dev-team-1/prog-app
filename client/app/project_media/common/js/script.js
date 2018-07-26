'use strict';
module.exports = function () {

  // Webpack pre-compiling
  var templateHeader = require('raw-loader!../../views/swaCheckoutHeader.ejs');
  var templateSuccess = require('raw-loader!../../views/success.ejs');
  var templateVendors = require('raw-loader!../../views/vendors.ejs');
  var EnvironmentSettings = require('../../../environment/' + ENVIRONMENT);


};