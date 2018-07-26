'use strict';
module.exports.PreloadCorsOptions = (function (PACWISP, Q) {

  let instance;

  function PreloadCorsOptions(options) {
    this.init(options);
  }

  PreloadCorsOptions.prototype = {
    constructor: PreloadCorsOptions,
    options: {
      token: '',
      settings: {
        method: 'GET',
        contentType: 'application/json',
        headers: {
          'X-API-Version': 1,
          Authorization: ''
        }
      }
    },
    init: function (options) {
      var self = this;
      self.ajaxRequest = require('./ajax-request').AjaxRequest.create();

      // ajaxRequest.makeRequest('GET', 'https://jsonplaceholder.typicode.com/posts/1')
      // 	.then(function (result) {
      // 		console.log('ajaxRequest.makeRequest', result);
      // 	})
      self.config(options);
      return this;
    },
    config: function (options) {
      var self = this;
      Object.assign(self.options, options);
      return this;
    },
    fetch: function (urlArray, token) {
      var self = this;

      if (token) {
        self.options.settings.headers.Authorization = token;
      }

      var promiseArray = urlArray.map((config) => {
        self.options.settings.method = config.method;
        if (config.data) {
          self.options.settings.data = JSON.stringify(config.data);
        }
        return self.ajaxRequest.makeRequest(config.url, self.options.settings);
      });

      Q.all(promiseArray)
        .then((response) => {
          console.log('preLoadCORSOptions Response:', response);
        })
        .catch((err) => {
          console.log('preLoadCORSOptions Error:', err);
        })
        .done();

    }
  }

  return {
    create: function (options) {
      if (!instance) {
        instance = new PreloadCorsOptions(options);
      }
      return instance;
    }
  };

})(PACWISP || {}, Q);