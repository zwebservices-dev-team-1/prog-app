'use strict';
module.exports = function () {

  // Webpack pre-compiling
  var templateHeader = require('raw-loader!../../views/swaCheckoutHeader.ejs');
  var templateSuccess = require('raw-loader!../../views/success.ejs');
  var templateVendors = require('raw-loader!../../views/vendors.ejs');
  var EnvironmentSettings = require('../../../environment/' + ENVIRONMENT);

  if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').then(function (registration) {
              // Registration was successful
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function (err) {
              // registration failed :(
              console.log('ServiceWorker registration failed: ', err);
          });
      });
  }


};