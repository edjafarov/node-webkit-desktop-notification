/*
  DesktopNotification(title, options)
    options:
      width: 288, // 
      height: 96, // 
      body: null, // text body for notification
      icon: null, // icon of notification
      ease: easeFunctions.easeOutSine, //ease function
      htmlBody: null, //notification body as HTML
      easeTime: 125 //how fast notification should show    
      styles: null //additional styles to add for notification  

  DesktopNotification instance
    methods:
      show
      close
      on
      off
      emit
    properties
      onclick
      onshow
      onclose
      onerror
    events
      body.click
      show
      close
      showStart
      closeStart
      error
      close.click


TODO:
  iconBase64: //base64 represetation of icon
  css: []
*/

/*
* wrapper for lib
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            return (root.DesktopNotification = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals
        root.DesktopNotification = factory();
    }
}(this, function () {

  var gui = global.window.nwDispatcher.requireNwGui();
//----------------    
/* STATIC stuff */
//----------------

// get urrent script's url, used to find .html file for popups
var scriptSource = (function(scripts) {
    var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1];

    if (script.getAttribute.length !== undefined) {
        return script.src
    }
    return script.getAttribute('src', -1)
}());


/* easing functions for popup animations */
var easeFunctions = {
  easeInQuad: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad: function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  easeInCubic: function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart: function (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart: function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint: function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine: function (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  easeOutSine: function (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  easeInOutSine: function (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  easeInExpo: function (t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo: function (t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOutExpo: function (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc: function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  easeInElastic: function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  easeOutElastic: function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },
  easeInOutElastic: function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * (.3 * 1.5);
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },
  easeInBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  easeInBounce: function (t, b, c, d) {
    return c - easing.easeOutBounce(d - t, 0, c, d) + b;
  },
  easeOutBounce: function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  }
}


var defaultOptions = {
  width: 288,  // max size of html5 notifications
  height: 96, // max size of html5 notifications
  x: 10000,
  y:10000,
  body: null,
  icon: null,
  ease: easeFunctions.easeOutSine,
  htmlBody: null,
  javascript: [],
  css: [],
  
  frame: false,
  toolbar: false,
  'always-on-top': true,
  show: true,
  resizable: false,
  focus: false,

  easeTime: 125
};

// smallest time between frames ms
var keyStep = 1000/120;
// margin between popups
var margin = 10;

//----------------    
/* ENGINE       */
//----------------

//current movement tasks
var movements = [];

var engine = setInterval(function(){
  movements.forEach(function(movement, i){
    if(!movement.finished && !movement.win.isMoving || movement.win.isMoving == movement) movement.makeStep();
    if(movement.finished) movements.splice(i, 1);
  });
}, keyStep);


function MovementTask(win, start, diff, steps, ease, done){
  this.step = 0;
  this.win = win;
  this.start = start || {};

  this.diff = diff;
  this.steps = steps;
  this.ease = ease;
  this.done = done;
}

MovementTask.prototype.makeStep = function(){
  if(!this.win.isActive) {
    this.finished = true;
    delete this.win.isMoving;
    if(this.done) this.done.apply(this);
    return;
  }
  if(!this.win.isMoving) {
    this.win.isMoving = this;
    this.start.x = this.start.x || this.win.x;
    this.start.y = this.start.y || this.win.y;
  }
  
  var x = this.diff.x?Math.floor(this.ease(this.step, this.start.x, this.diff.x, this.steps)):this.start.x;
  var y = this.diff.y?Math.floor(this.ease(this.step, this.start.y, this.diff.y, this.steps)):this.start.y;
  
  this.win.moveTo(x, y);
  this.step+=1;
  if(this.step >= this.steps - 1){
    this.finished = true;
    delete this.win.isMoving;
    if(this.done)this.done.apply(this);
  }
}
//TODO: to save resources and make performance higher we need to create window pool 
//every notification before shown will be taken from the pool and used

var tagged = {};
var activeNotifications = []; 

//UTILS
function getNextAvailTop(toIth){
  var len = activeNotifications.length;
  if(toIth == 0 || toIth > 0) len = toIth;
  var summHeight = screen.availTop + 10;
  
  for(var i=0; i< len; i++){
    summHeight+= activeNotifications[i].options.height + margin;
  }

  return summHeight;
}

function extend(a, byB){
  for(var key in byB){
    if(byB[key]) a[key] = byB[key];
  }
  return a;
}

function clone(obj){
  var newobj = JSON.parse(JSON.stringify(obj));
  for(var key in obj){
    if(typeof(obj[key]) == 'function'){
      newobj[key] = obj[key];
    }
  }
  return newobj;
}

function rightBorder(){ 
  var screen = global.window.screen;
  return screen.availLeft + screen.availWidth;
}

/*-------*
* EMITTER CLASS, to get messaging in place for popups
*--------*/
/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

var scriptArr = scriptSource.split("/");
scriptArr.splice(scriptArr.length - 1, 1);
var desktopNotificationHtml = scriptArr.join("/") + "/desktopNotification.html";
var winPool = [];

for(var w= 0;w < 6;w++){
  var winOpen = gui.Window.open(desktopNotificationHtml, defaultOptions);
  winOpen.on('loaded', function(){
    Emitter(this.window);
  });
  winPool.push(winOpen);
}


window.onunload = function(){
  for(var w= 0;w < winPool.length;w++){
    winPool[w].close(true);
  }
}

function getFreeWin(){
  var result;
  for(var i = 0; i< winPool.length; i++){
    if(!winPool[i].isBusy) {
      result = winPool[i];
      break;
    }
  }
  if(!result){
    result = gui.Window.open(
    desktopNotificationHtml, defaultOptions);
    winPool.push(result);
  }
  result.isBusy = true;
  result.originalHtml = result.window.document.body.innerHTML;
  return result;
}

function release(wind){
  //still we need Ideally to reload the notification:(
  wind.window.off();
  wind.window.document.body.innerHTML = wind.originalHtml;
  delete wind.originalHtml;
  delete wind.isBusy;
}
/**
* DESKTOP NOTIFICATIONS CLASS
*
*
* title - The title that must be shown within the notification
* options (Optional) - An object that allows to configure the notification. It can have the following properties:
*   -dir : The direction of the notification; it can be auto, ltr, or rtl-
*   -lang: Specifiy the lang used within the notification. This string must be a valid BCP 47 language tag.-
*   body: A string representing an extra content to display within the notification
*   tag: An ID for a given notification that allows to retrieve, replace or remove it if necessary
*   icon: The URL of an image to be used as an icon by the notification
*/

function DesktopNotification(title, options){
  this.title = title;
  this.options = extend(clone(defaultOptions), options);
  
  //put tagged into hash
  if(this.options.tag) tagged[this.options.tag] = this;

  this.win = getFreeWin();

  this.win.resizeTo(this.options.width, this.options.height);

  this.win.moveTo(rightBorder() + 10, getNextAvailTop());


  // on<stuff> events implementation
  this.on('body.click', function(){
    if(this.onclick) this.onclick.call(this);
  }.bind(this));  
  this.on('show', function(){
    if(this.onshow) this.onshow.call(this);
  }.bind(this));
  this.on('error', function(){
    if(this.onerror) this.onerror.call(this);
  }.bind(this));
  this.on('close', function(){
    if(this.onclose) this.onclose.call(this);
  }.bind(this));
}

DesktopNotification.ease = easeFunctions;

DesktopNotification.get = function(tag){
  return tagged[tag];
}

DesktopNotification.prototype.on = function(){
  var arg = arguments;  
  this.win.window.on.apply(this.win.window, arg);
};

DesktopNotification.prototype.off = function(){
  var arg = arguments;
  this.win.window.off.apply(this.win.window, arg);
};

DesktopNotification.prototype.emit = function(){
  var arg = arguments;
  this.win.window.emit.apply(this.win.window, arg);
};


/**
* show notification
*/
DesktopNotification.prototype.show = function(cb){
  //this.win.setShowInTaskbar(false);

  this.win.moveTo(rightBorder() + 10, getNextAvailTop());
  activeNotifications.push(this);
  this.win.isActive = true;
  
  this.on('close.click', function(){
    this.close();
  }.bind(this));
  
  var msgDoc = this.win.window.document;
  //if htmlBody is not defined
  if(!this.options.htmlBody){
    var image = msgDoc.getElementById('image');
    var message = msgDoc.getElementById('message');
    var notification = msgDoc.getElementById('notification');
    
    //if there is no icon
    if(!this.options.icon){
      notification.className = "no-icon";
    } else {
      image.getElementsByTagName('img')[0].src = this.options.icon;
    }
    message.getElementsByTagName('h3')[0].innerHTML = this.title;
    message.getElementsByTagName('p')[0].innerHTML = this.options.body;
  } else {
    msgDoc.body.innerHTML = this.options.htmlBody;
  }

  if(this.options.styles){
    var node = msgDoc.createElement('style');
    node.innerHTML = this.options.styles;
    msgDoc.body.appendChild(node);
  }

  this.emit('showStart');

  movements.push(new MovementTask(this.win, {}, 
                {x: -this.options.width -20, y: 0}, this.options.easeTime/keyStep, this.options.ease, function(){
                  this.emit('show');
                  if(cb) cb.call(this);
                }.bind(this)));


}

/**
* close notification
*/
DesktopNotification.prototype.close = function(cb){

  var start = this.win.x;
  this.win.moveTo(this.win.x, this.win.y);
  
  this.emit('closeStart');

  movements.push(new MovementTask(this.win, {}, 
                  {x: this.options.width + 20, y: 0}, this.options.easeTime/keyStep, this.options.ease, done.bind(this)));
  function done(){
    // need to move up all of previous
    // all of them should be frozen until end movement
    // enigne should handle this
    var spliceIth = activeNotifications.indexOf(this);
    activeNotifications.splice(spliceIth, 1);
    this.win.isActive = false;
    
    if(activeNotifications[spliceIth]){
      var diffY = getNextAvailTop(spliceIth) - activeNotifications[spliceIth].win.y;
      for(var i=spliceIth; i<activeNotifications.length;i++){
        movements.push(new MovementTask(activeNotifications[i].win, {}, 
                    {x: 0, y: diffY}, defaultOptions.easeTime/keyStep, defaultOptions.ease))
      }
    }
    release(this.win);
    
    this.emit('close');
    if(cb) cb.call(this);
  }

};
  

  return DesktopNotification;
}));




//UTIL

/**
mac gesture:
// boolean that stores if a swipe has been performed.
var bScrolled = false;
// countdown in ms before resetting the boolean.
var iTime = 1000;
var oTimeout;
window.addEventListener('mousewheel', function(e) {
  console.log("wheel", e.wheelDeltaY, e.wheelDeltaX);
  if (e.wheelDeltaY === 0) {
  // there is an horizontal scroll
    if (!bScrolled) {
    // no need to set bScrolled to true if it has been done within the iTime time. 
      bScrolled = true;
      oTimeout = setTimeout(function(){
        bScrolled = false;
      }, iTime);
    }
  }
});

window.onpopstate = function() {
  // clear the timeout to be sure we keep the correct value for bScrolled
  clearTimeout(oTimeout);
  // check if there has been a swipe prior to the change of history state
  if (bScrolled) {
    // check which browser & OS the user is using, then
    // trigger your awesome custom transition.
    console.log("gest");
  }
}
**/
