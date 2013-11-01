var http = require("http");

var cookie_handler = function(req) {
    this.request = req;
    this.cookie = new String();
};

cookie_handler.prototype = {   
    request: {}, 
    cookie: {},
    write_cookie : function(name, value)
    {            
        this.cookie = name + '=' + value + ';path=/';          
    },
    
    read_cookies : function()
    {    
        var cookies = {};
          this.request.headers.cookie && this.request.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cookies[ parts[ 0 ].trim() ] = ( unescape(parts[ 1 ]) || '' ).trim();
        });   
        
        return cookies;
    },
    get_session : function()
    {
        var cookies = this.read_cookies();
            
        if(cookies !== undefined && cookies['session'] !== undefined)
        {
            return cookies['session'];
        }
            return undefined;
    },
    get_name : function()
    {
        var cookies = this.read_cookies();
            
        if(cookies !== undefined && cookies['name'] !== undefined)
        {
            return cookies['name'];
        }
            return undefined;
    }
}

module.exports = cookie_handler;