var http  = require('http');
const host = 'partnerapi.funda.nl';
const APIkey = '85c4a5975ed84e0c885594ba76cbd11b';
const zo = '&zo=/heel-nederland/';
var PageNumber = 15000;
var objectNumber = 15;

this.randomhouses = function(callback) {
    
    var pagina1 = Math.floor(Math.random()*PageNumber);
    var paging1 = '&page=' + pagina1;
    var pagina2 = Math.floor(Math.random()*PageNumber);
    var paging2 = '&page=' + pagina2;
    var aanbod = 'koop';
    var complete = false;
    
    var result1, result2;
    
    
    var path1 = '/feeds/Aanbod.svc/json/'+ APIkey + '/?type=' + aanbod + zo + paging1;
    var options1 = {          
          host: 'partnerapi.funda.nl',
          path: path1
        };
    console.log(path1);
    var path2 = '/feeds/Aanbod.svc/json/'+ APIkey + '/?type=' + aanbod + zo + paging2;
    var options2 = {          
          host: 'partnerapi.funda.nl',
          path: path2
        };
    console.log(path2);
    this.resultlistFromAPI(options1, function(json1) {
        if(json1 === null)
        {
            callback(null); 
        }
        if(complete === true)
        {
            callback(json1, result2); 
        }
        else
        {
            result1 = json1;
            complete = true;
        }
    });
    this.resultlistFromAPI(options2, function(json2) {
        if(json2 === null)
        {
            callback(null); 
        }
        if(complete === true)
        {
            callback(result1, json2); 
        }
        else
        {
            result2 = json2;
            complete = true;
        }
    });
    
}

this.resultlistFromAPI = function(options, callback) {
    http.get(options, function(res) {
        var body = "";
        res.on('data', function (chunk) {            
            body += chunk;        
        }); 
        
        res.on('end', function () {            
            callback(JSON.parse(body)); 
        }); 
    }).on('error', function(e) {
        console.log(e.message);
        callback(null);
    });
  }
