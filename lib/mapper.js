/*
 * /lib/mapper.js
 */
var fs = require('fs');
var Mustache = require('mustache');
var mapper = function() {};
 
mapper.prototype = {
 
  renderView : function(name, data, layout, callback) {
    var self = this;
 
    if (typeof callback !== 'function') throw ViewCallbackException;
 
    self.getView(name, 'html', function(content) {
      if(layout === true)
      {
          var template = Mustache.to_html(content, data);
 
          self.getLayout({}, function(content) {
            content = self.setLayoutContent(content, template, data);
            callback(content);
          });
      }
      else
      {
          var template = Mustache.to_html(content, data);
          callback(template);
      }
    });
  },
  getView : function(name, format, callback) {
    var self = this;
 
    if (!name) {
      return '';
    }
 
    var format = format ? format : 'html';
    var path = './views/actions/' + name + '.' + format;
 
    // callback handling
    var callback = (typeof callback === 'function') ? callback : function() {
    };
 
    fs.readFile(path, function(error, content) {
      if (error) {
        throw {name: "ViewNotFoundException", message:"view niet gevonden: " + path};
      } else {
        callback(content.toString());
      }
    });
  },
  getLayout : function(options, callback) {
    var self = this;
    var options = options ? options : {
      'name' : 'screen-game',
      'format' : 'html'
    };
    var name   = options.name ? options.name : 'screen-game';
    var format = options.format ? options.format : 'html';
 
    // callback handling
    var callback = (typeof callback === 'function') ? callback : function() {
    };
 
    var path = './views/layouts/' + name + '.' + format;
 
    fs.readFile(path, function(error, content) {
      if (error) {
        throw {name: "LayoutNotFoundException", message:"layout niet gevonden: " + path};
      } else {
        callback(content.toString());
      }
    });
  },
  setLayoutContent : function(layout, content, data) {
  var self = this;
  var layout = layout ? layout : '';
  var context = {
    'content_for_layout' : content ? content : '',
    'data' : data
  };
  return Mustache.to_html(layout, context);
  }
};
 
module.exports = new mapper();