var mongo = require('mongoskin');
var http  = require('http');

const connectionstring = 'mongodb://rawne:brinky@dharma.mongohq.com:10043/awesomedb';
var db = mongo.db(connectionstring);


this.new_session = function(id, prijs1, prijs2, naam) {
    db.collection('sessions').insert({id: id.toString(), expires:Date.now() + (20 * 1000), prijs1 : prijs1, prijs2 : prijs2, naam: naam}) //20 seconds
}

this.new_highscore = function(id, score, rondes, naam) {
    db.collection('highscores').insert({id: id.toString(), date:Date.now(), score : score, rondes : rondes, naam : naam})
}

this.get_highscore = function(id, callback) {
    db.collection('highscores').find({id: id.toString()}).toArray(function(err, items){
    if(err){
        console.log(err.message);
        throw err; 
    } 
    
    if(items.length > 0)
    {
        callback(items[0]);
    }else
    {
        callback(null);
    }  
  });
}
this.get_highscores_by_name = function(naam, callback) {
    db.collection('highscores').find({naam: naam}, {limit:10, sort:[['score', -1]]}).toArray(function(err, items){
    if(err){
        console.log(err.message);
        throw err; 
    } 
    
    if(items.length > 0)
    {
        callback(items);
    }else
    {
        callback(null);
    }  
  });
}
this.get_highscores = function(callback) {
    db.collection('highscores').find({}, {limit:10, sort:[['score', -1]]}).toArray(function(err, items){
    if(err){
        console.log(err.message);
        throw err; 
    } 
    
    if(items.length > 0)
    {
        callback(items);
    }else
    {
        callback(null);
    }  
  });
}


this.remove_session = function(id, score, rondes) {
    db.collection('highscores').remove({id: id});
}

this.get_session = function(id, callback) {
    db.collection('sessions').find({id:id.toString()}).toArray(function(err, items){
    if(err){
        console.log(err.message);
        throw err; 
    } 
    
    if(items.length > 0)
    {
        callback(items[0]);
    }else
    {
        callback(null);
    }  
  });
}

this.update_session_correct = function(id, totalScore) {
    db.collection('sessions').update({id: id.toString()}, {$set: {score: totalScore}});
    db.collection('sessions').update({id: id.toString()}, {$inc: {correct : 1}});
}

this.update_session_incorrect = function(id) {
    db.collection('sessions').update({id: id.toString()}, {$inc: {incorrect : 1}});

}

this.update_session = function(id, prijs1, prijs2) {
    db.collection('sessions').update({id: id.toString()}, {$set: {prijs1: prijs1, prijs2: prijs2, expires:Date.now() + (20 * 1000)}});

}

 
