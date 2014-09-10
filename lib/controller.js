var mapper = require('./mapper');
var http = require("http");
var controller = function(db, ch, hn) {
    this.cookie_handler = ch;
    this.database = db;
    this.hostname = hn;
    this.fundaAPI = require('../datalayer/fundaAPI.js');
};
    
    
var APIkey = '85c4a5975ed84e0c885594ba76cbd11b';
var PageNumber = 10000;
var objectNumber = 14;

controller.prototype = {
  cookie_handler:{},
  fundaAPI:{},
  database:{},
  hostname:{},
  gameover : function(session) {
    var highscore = session.score;
    var rondes = session.correct + 1;
    var naam = 'funderiaan'
    if(session.naam != '')
        naam = session.naam
    this.database.new_highscore(session.id, highscore, rondes, naam);
  },
  selection : function(choice, callback) {
    var datetime = Date.now();
    var session = this.cookie_handler.get_session();    
    var correct = false;
    var in_time = false;
    var self = this;
    this.database.get_session(session, function(session)
    { 
        var answer = 1;
        if(session.prijs1 < session.prijs2)
        {
            answer = 2;
        }
        if(answer == choice)
        {
            correct = true;
        }
        if(datetime < session.expires)
        {
            in_time = true;
        }
        
        if(in_time)
        {
            var objectLink1 = "";
            var objectLink2 = "";
            var aantalCorrect = session.correct === undefined ? 0 : session.correct;
            var aantalIncorrect = session.incorrect === undefined ? 0 : session.incorrect;
            var sesScore = session.score === undefined ? 0 : session.score;

            var imageCorrect;
            var pageCorrect;
            
            if(correct !== true)
            {
                var gameOver = "GAME OVER";
                if(choice == 3)
                {
                    gameOver = "TIJD VERSTREKEN";
                }
                imageCorrect = '<div class="overlay"><img src="http://images.sodahead.com/polls/002502229/3159695671_600px_Red_xsvg_answer_101_xlarge.png"></div>';
                pageCorrect = '<div class="overlay page"><h2>'+gameOver+'</h2><div class="scores"><p><strong>'+sesScore+'</strong><br>Score</p><p><strong>'+aantalCorrect+'</strong><br>Aantal rondes</p></div><div class="action"><a href="speel" id="startNew">Start nieuw spel</a></div><div class="action action-alt half"><a href="http://www.facebook.com/sharer.php?s=100&p[title]=Ik haalde '+sesScore+' punten met DuurderGluurder&p[url]=http%3a%2f%2ffdx-c9-rawne_1.c9.io" target="_blank">Deel je score</a><a href="/">Terug naar start</a></div></div>';
                aantalIncorrect ++;
                
                self.gameover(session);
                
                self.database.update_session_incorrect(session.id);
                session.id = undefined;
            }
            else
            {
                var time_left = session.expires - datetime;
                var score = Math.floor((time_left - 5000) / 1000) + 15;
                if(session.score !== undefined)
                {
                    score += session.score;
                }
                aantalCorrect ++;
                sesScore = score === undefined ? 0 : score;
            
                imageCorrect = '<div class="overlay"><img src="http://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Yes_check.svg/150px-Yes_check.svg.png"></div>';
                pageCorrect = '<div class="overlay page"><h2 class="result">Al <strong>'+sesScore+'</strong> punten</h2><p>in '+aantalCorrect+' rondes</p><div class="action"><a href="#" id="next">VOLGENDE</a></div></div>';
            
                self.database.update_session_correct(session.id, (score));
            }
            
            var imageUrl1 = imageCorrect;
            var imageUrl2 = pageCorrect;
            var data = {
                'result'  : correct.toString(),
                'prijs1' : session.prijs1,
                'prijs2' : session.prijs2,
                'session' : session.id,
                'imageUrl1' : imageUrl1,
                'imageUrl2' : imageUrl2,
                'objectLink1' : objectLink1,
                'objectLink2' : objectLink2,
                'aantalCorrect': aantalCorrect,
                'aantalIncorrect': aantalIncorrect
            };
            
            mapper.renderView('result', data, false, function(data) {
              callback(data);
            });
        }
        else
        {
            var data2 = {
                'result': 'De sessie is verlopen..'
            };
            mapper.renderView('error', data2, false, function(data) {
              callback(data);
            });

        }
    });
    
  },
  speel : function(session, callback) {
    var self = this;
    var name = self.cookie_handler.get_name();
    
    var objectIndex1 = Math.floor(Math.random()*objectNumber);
    var objectIndex2 = Math.floor(Math.random()*objectNumber);
    var datetime = Date.now();
    
    self.fundaAPI.randomhouses(function(result1, result2){
        if(result1.Objects.length <= objectIndex1)
            objectIndex1 = result1.Objects.count - 1;
        if(result2.Objects.length <= objectIndex2)
            objectIndex2 = result2.Objects.count - 1;
        console.log(objectIndex1);
        console.log(objectIndex2);
        var prijs1 = result1.Objects[objectIndex1].Koopprijs;
        var prijs2 = result2.Objects[objectIndex2].Koopprijs;
        
        var first_request = (session === undefined || session === '');
        var id = session;
        
        if(first_request)
        {
            var naam = name === undefined ? "Fundariaan" : name;
            id= Math.floor(Math.random()*10000000);
            self.database.new_session(id, prijs1, prijs2, naam);
            self.cookie_handler.write_cookie('session', id);
        }
        else
        {
            self.database.update_session(id, prijs1, prijs2);
        }
        
        var data = {
                    'object1' : result1.Objects[objectIndex1],
                    'object2' : result2.Objects[objectIndex2]
                    };        
            mapper.renderView('game', data, first_request, function(data) { //if first request, we need layout //if first request, we need layout
              callback(data);
            });
    });
    
  },
  fix : function(argument, callback){
      this.database.remove_highscore(argument);
  },
  facebook : function(argument, callback){
      var self = this;
    var name = self.cookie_handler.get_name();
    callback = (typeof callback === 'function') ? callback : function() {};
    self.database.get_highscores(function(result){
        self.database.get_highscores_by_name(name, function(pers_highscores){
        
            var data = {
                                'highscores' : result,
                                'name': name,
                                'highscore' : pers_highscores === null ? undefined : pers_highscores[0]
                        };        
            
            mapper.renderView('facebookhome', data, true, function(data) {
              callback(data);
            });
        });
    });
  },
  home : function(argument, callback) {
    var self = this;
    var name = self.cookie_handler.get_name();
    callback = (typeof callback === 'function') ? callback : function() {};
    self.database.get_highscores(function(result){
        self.database.get_highscores_by_name(name, function(pers_highscores){
        
            var data = {
                                'highscores' : result,
                                'name': name,
                                'highscore' : pers_highscores === null ? undefined : pers_highscores[0]
                        };        
            
            mapper.renderView('home', data, true, function(data) {
              callback(data);
            });
        });
    });
            
  }
};
 
module.exports = controller;