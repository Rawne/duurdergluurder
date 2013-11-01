(function($){$.fn.jCarouselLite=function(o){o=$.extend({btnPrev:null,btnNext:null,btnGo:null,mouseWheel:false,auto:null,speed:200,easing:null,vertical:false,circular:true,visible:3,start:0,scroll:1,beforeStart:null,afterEnd:null},o||{});return this.each(function(){var b=false,animCss=o.vertical?"top":"left",sizeCss=o.vertical?"height":"width";var c=$(this),ul=$("ul",c),tLi=$("li",ul),tl=tLi.size(),v=o.visible;if(o.circular){ul.prepend(tLi.slice(tl-v-1+1).clone()).append(tLi.slice(0,v).clone());o.start+=v}var f=$("li",ul),itemLength=f.size(),curr=o.start;c.css("visibility","visible");f.css({overflow:"hidden",float:o.vertical?"none":"left"});ul.css({margin:"0",padding:"0",position:"relative","list-style-type":"none","z-index":"1"});c.css({overflow:"hidden",position:"relative","z-index":"2",left:"0px"});var g=o.vertical?height(f):width(f);var h=g*itemLength;var j=g*v;f.css({width:f.width(),height:f.height()});ul.css(sizeCss,h+"px").css(animCss,-(curr*g));c.css(sizeCss,j+"px");if(o.btnPrev)$(o.btnPrev).click(function(){return go(curr-o.scroll)});if(o.btnNext)$(o.btnNext).click(function(){return go(curr+o.scroll)});if(o.btnGo)$.each(o.btnGo,function(i,a){$(a).click(function(){return go(o.circular?o.visible+i:i)})});if(o.mouseWheel&&c.mousewheel)c.mousewheel(function(e,d){return d>0?go(curr-o.scroll):go(curr+o.scroll)});if(o.auto)setInterval(function(){go(curr+o.scroll)},o.auto+o.speed);function vis(){return f.slice(curr).slice(0,v)};function go(a){if(!b){if(o.beforeStart)o.beforeStart.call(this,vis());if(o.circular){if(a<=o.start-v-1){ul.css(animCss,-((itemLength-(v*2))*g)+"px");curr=a==o.start-v-1?itemLength-(v*2)-1:itemLength-(v*2)-o.scroll}else if(a>=itemLength-v+1){ul.css(animCss,-((v)*g)+"px");curr=a==itemLength-v+1?v+1:v+o.scroll}else curr=a}else{if(a<0||a>itemLength-v)return;else curr=a}b=true;ul.animate(animCss=="left"?{left:-(curr*g)}:{top:-(curr*g)},o.speed,o.easing,function(){if(o.afterEnd)o.afterEnd.call(this,vis());b=false});if(!o.circular){$(o.btnPrev+","+o.btnNext).removeClass("disabled");$((curr-o.scroll<0&&o.btnPrev)||(curr+o.scroll>itemLength-v&&o.btnNext)||[]).addClass("disabled")}}return false}})};function css(a,b){return parseInt($.css(a[0],b))||0};function width(a){return a[0].offsetWidth+css(a,'marginLeft')+css(a,'marginRight')};function height(a){return a[0].offsetHeight+css(a,'marginTop')+css(a,'marginBottom')}})(jQuery);

var foundSliders = 0;
/**
 * @copyright Carousel
 * @param {Object} elem
 */
Carousel = function(elem){
  this.elem = elem;
  foundSliders++;
  this.add();
};
Carousel.prototype = {
  add: function(){
    var wrapper, self;
    self = this;
    wrapper = $('<div class="slider" />');

    this.elem.wrap(wrapper);
    this.addPaging();
  },
  addPaging: function(){
    var self, pagingElem, pagingInfoElem;
    self = this;

    pagingElem = $('<ul class="link-list paging-list" id="GSlider'+foundSliders+'" />');
    pagingElem.append('<li><a href="#" class="paging prev disabled">Vorige</a></li>');
    pagingElem.append('<li><a href="#" class="paging next">Volgende</a></li>');
    self.paging = pagingElem;

    pagingElem.find('a').click(function(e){
      e.preventDefault();
    });

    pagingElem.insertAfter(self.elem.parent('div.slider'));
  },
  start: function(){
    var self = this;
    this.elem.parent('div.slider').jCarouselLite({
      visible : 1,
      speed : 250,
      scroll  : 1,
      circular: false,
          btnNext : '#GSlider'+foundSliders+' a.paging.next',
          btnPrev:  '#GSlider'+foundSliders+' a.paging.prev'
      });

    // fixes incorrect li / div.slider height with actual item height (after image load event)
    this.elem.find('img:first').load(function(){
      var itemHeight = self.elem.find('li a').height();
      self.elem.find('li').height(outerHeight);
      self.elem.parent('div.slider').height(itemHeight);
    });
  }
};
$( document ).ready(function() {
    $('ul.objects div.figure ul').each(function(){
      var gallery = new Carousel($(this));
      gallery.start();
    });
});