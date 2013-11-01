/*
 * /lib/dispatcher.js
 */
var fs                      = require('fs');
var url                     = require('url');
var controller            = require('./controller');
var response_handler            = require('./response_handler');
var qs =                require('querystring');
var cookie_handler = require('./cookie_handler.js');
 
this.dispatch = function(req, res, db) {
  const hostname = 'http://fdx-c9-rawne_1.c9.io';
  
  //set up response object
  var cookieHandler = new cookie_handler(req);
  var responseHandler = new response_handler(res, cookieHandler);
  var my_controller = new controller(db, cookieHandler, hostname);
  var requestedUrl = url.parse(req.url);
  var parts, action, argument, argument2, argument3;
  if (requestedUrl.pathname == '/') {
    action = 'home';
    argument = "";
  } else {
    parts    = req.url.split('/');
    action   = parts[1];
    argument = parts[2];
    argument2 = parts[3];
    argument3 = parts[4];
  }
  if(typeof my_controller[action] == 'function')
  {      
      try {
          my_controller[action](argument, function(content, json) { 
            if (content) {
                if(json)
                {
                    responseHandler.renderJson(content);
                }
                else
                {
                    responseHandler.renderHtml(content);
                }
            } else {
              responseHandler.serverError(404);
            }
          });  
      
    } catch (error) {
      console.log(error);
    }        
  }
  //only executing registered actions
  else {
    responseHandler.renderWebroot(requestedUrl);
  }
  function renderContent(content, html)
  {
    if (content) {
                  responseHandler.renderHtml(content);
                } else {
                  responseHandler.serverError(404);
                }
  }
  
};


