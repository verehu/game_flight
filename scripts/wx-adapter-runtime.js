// ============================================================
// WeChat Mini Game Adapter — injected inside the IIFE bundle
// via Rollup output.intro so all `var` declarations live in
// the same function scope as Phaser.
// ============================================================

var __wxSys = typeof wx !== 'undefined' ? wx.getSystemInfoSync() : {};
var __screenW = __wxSys.screenWidth || 375;
var __screenH = __wxSys.screenHeight || 667;
var __dpr = __wxSys.pixelRatio || 2;

// ---- Main Canvas ----
var canvas = (typeof wx !== 'undefined') ? wx.createCanvas() : null;
if (canvas) { canvas.width = __screenW; canvas.height = __screenH; }
if (typeof GameGlobal !== 'undefined') { try { GameGlobal.canvas = canvas; } catch(_){} }


// ---- performance ----
var performance = (typeof wx !== 'undefined' && wx.getPerformance)
  ? wx.getPerformance()
  : { now: function() { return Date.now(); } };

// ---- requestAnimationFrame ----
var requestAnimationFrame = (typeof GameGlobal !== 'undefined' && GameGlobal.requestAnimationFrame)
  ? GameGlobal.requestAnimationFrame
  : function(cb) { return setTimeout(cb, 16); };
var cancelAnimationFrame = (typeof GameGlobal !== 'undefined' && GameGlobal.cancelAnimationFrame)
  ? GameGlobal.cancelAnimationFrame
  : clearTimeout;

// ---- Minimal EventTarget ----
function __EventTarget() { this.__listeners = Object.create(null); }
__EventTarget.prototype.addEventListener = function(t, fn) {
  if (!this.__listeners[t]) this.__listeners[t] = [];
  this.__listeners[t].push(fn);
};
__EventTarget.prototype.removeEventListener = function(t, fn) {
  var a = this.__listeners[t]; if (!a) return;
  var i = a.indexOf(fn); if (i !== -1) a.splice(i, 1);
};
__EventTarget.prototype.dispatchEvent = function(e) {
  if (!e.target) e.target = this;
  var a = this.__listeners[e.type];
  if (a) for (var i = 0; i < a.length; i++) a[i].call(this, e);
};

// ---- HTMLElement ----
function HTMLElement(tag) {
  __EventTarget.call(this);
  this.tagName = (tag || '').toUpperCase();
  this.className = '';
  this.children = [];
  this.childNodes = [];
  this.parentNode = null;
  this.parentElement = null;
  this.innerHTML = '';
  this.innerText = '';
  this.textContent = '';
  this.id = '';
  this.dataset = {};
  this._cw = 0; this._ch = 0;
  this.style = { width:'',height:'',top:'0px',left:'0px',position:'',display:'',cursor:'default',pointerEvents:'',visibility:'',overflow:'' };
  this.classList = { _l:[], add:function(c){if(this._l.indexOf(c)===-1)this._l.push(c)}, remove:function(c){var i=this._l.indexOf(c);if(i!==-1)this._l.splice(i,1)}, contains:function(c){return this._l.indexOf(c)!==-1} };
}
HTMLElement.prototype = Object.create(__EventTarget.prototype);
HTMLElement.prototype.constructor = HTMLElement;
HTMLElement.prototype.setAttribute = function(n,v) { this[n]=v; };
HTMLElement.prototype.getAttribute = function(n) { return this[n]; };
HTMLElement.prototype.removeAttribute = function(n) { delete this[n]; };
HTMLElement.prototype.appendChild = function(c) { c.parentNode=this; c.parentElement=this; this.children.push(c); this.childNodes.push(c); return c; };
HTMLElement.prototype.removeChild = function(c) { var i=this.children.indexOf(c); if(i!==-1){this.children.splice(i,1);this.childNodes.splice(i,1);} c.parentNode=null; c.parentElement=null; return c; };
HTMLElement.prototype.insertBefore = function(n,r) { n.parentNode=this; n.parentElement=this; if(!r){this.children.push(n);this.childNodes.push(n);}else{var i=this.children.indexOf(r);if(i!==-1){this.children.splice(i,0,n);this.childNodes.splice(i,0,n);}else{this.children.push(n);this.childNodes.push(n);}} return n; };
HTMLElement.prototype.getBoundingClientRect = function() { return {x:0,y:0,top:0,left:0,width:this._cw,height:this._ch,right:this._cw,bottom:this._ch}; };
HTMLElement.prototype.focus = function(){};
HTMLElement.prototype.blur = function(){};
HTMLElement.prototype.cloneNode = function() { return new HTMLElement(this.tagName); };
Object.defineProperty(HTMLElement.prototype, 'clientWidth',  { get: function(){return this._cw;}, set: function(v){this._cw=v;} });
Object.defineProperty(HTMLElement.prototype, 'clientHeight', { get: function(){return this._ch;}, set: function(v){this._ch=v;} });
Object.defineProperty(HTMLElement.prototype, 'offsetWidth',  { get: function(){return this._cw;}, set: function(v){this._cw=v;} });
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { get: function(){return this._ch;}, set: function(v){this._ch=v;} });

// ---- Patch drawImage on any 2D context to unwrap adapter objects ----
var __patchCount = 0;
function __patchCtx(ctx) {
  if (!ctx || ctx.__drawPatched) return ctx;
  __patchCount++;
  function unwrapSource(source) {
    if (!source) return source;
    if (source.__canvas) return source.__canvas;
    if (source.__wx) return source.__wx;
    if (source.__c) return source.__c;
    if (source.canvas && (source.canvas.__c || source.canvas.__wx || source.canvas.__canvas)) return unwrapSource(source.canvas);
    if (source.image && (source.image.__c || source.image.__wx || source.image.__canvas)) return unwrapSource(source.image);
    return source;
  }
  var orig = ctx.drawImage;
  if (orig) {
    ctx.drawImage = function(source) {
      var args = Array.prototype.slice.call(arguments);
      args[0] = unwrapSource(source);
      return orig.apply(ctx, args);
    };
  }
  var origPattern = ctx.createPattern;
  if (origPattern) {
    ctx.createPattern = function(source, repetition) {
      var unwrapped = unwrapSource(source);
      return origPattern.call(ctx, unwrapped, repetition);
    };
  }
  var origPutImage = ctx.putImageData;
  if (origPutImage) ctx.putImageData = function() { return origPutImage.apply(ctx, arguments); };
  ctx.__drawPatched = true;
  return ctx;
}

function __normalizeAssetUrl(v) {
  if (typeof v === 'string') return v;
  if (!v) return '';
  if (typeof v.href === 'string') return v.href;
  if (typeof v.src === 'string') return v.src;
  if (typeof v.url === 'string') return v.url;
  if (typeof v.path === 'string') return v.path;
  if (typeof v.toString === 'function') {
    var s = v.toString();
    if (s && s !== '[object Object]') return s;
  }
  return '';
}

// Patch raw canvas getContext so Phaser's rendering context gets drawImage unwrapping
if (canvas) {
  var __origGetCtx = canvas.getContext.bind(canvas);
  canvas.getContext = function(type, attrs) {
    return __patchCtx(__origGetCtx(type, attrs));
  };
}

// ---- base64 decoder (pure JS, no wx/browser dependency) ----
var __b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var __b64lookup = new Uint8Array(256);
for (var __i = 0; __i < __b64chars.length; __i++) __b64lookup[__b64chars.charCodeAt(__i)] = __i;
function __b64ToBuffer(b64) {
  var len = b64.length;
  while (len > 0 && b64[len - 1] === '=') len--;
  var bufLen = (len * 3 / 4) | 0;
  var bytes = new Uint8Array(bufLen);
  var p = 0;
  for (var i = 0; i < len; i += 4) {
    var e1 = __b64lookup[b64.charCodeAt(i)];
    var e2 = __b64lookup[b64.charCodeAt(i + 1)];
    var e3 = __b64lookup[b64.charCodeAt(i + 2)];
    var e4 = __b64lookup[b64.charCodeAt(i + 3)];
    if (p < bufLen) bytes[p++] = (e1 << 2) | (e2 >> 4);
    if (p < bufLen) bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
    if (p < bufLen) bytes[p++] = ((e3 & 3) << 6) | (e4 & 63);
  }
  return bytes.buffer;
}

// ---- Image (wraps wx.createImage, handles data URLs via canvas) ----
function Image() {
  __EventTarget.call(this);
  this.tagName = 'IMG';
  this.type = 'image';
  this.style = {};
  this.crossOrigin = '';
  this.complete = false;
  this.width = 0; this.height = 0;
  this.naturalWidth = 0; this.naturalHeight = 0;
  this.__wx = (typeof wx !== 'undefined') ? wx.createImage() : {};
  this.__canvas = null;
  var self = this;
  this.__wx.onload = function() {
    self.width = self.__wx.width; self.height = self.__wx.height;
    self.naturalWidth = self.__wx.width; self.naturalHeight = self.__wx.height;
    self.complete = true;
    if (typeof self.onload === 'function') self.onload({ target: self, type: 'load' });
    self.dispatchEvent({ type: 'load', target: self });
  };
  this.__wx.onerror = function(e) {
    console.warn('[wx-img] error: ' + (self.__wx.src || '').substring(0, 80));
    if (typeof self.onerror === 'function') self.onerror({ target: self, type: 'error', message: e && e.message || '' });
    self.dispatchEvent({ type: 'error', target: self });
  };
}
Image.prototype = Object.create(__EventTarget.prototype);
Image.prototype.constructor = Image;
Object.defineProperty(Image.prototype, 'src', {
  get: function() { return this.__src || ''; },
  set: function(v) {
    v = __normalizeAssetUrl(v);
    this.__src = v;

    if (typeof v === 'string' && v.indexOf('data:') === 0) {
      var self = this;
      var commaIdx = v.indexOf(',');
      var w = 4, h = 4;
      if (commaIdx !== -1) {
        try {
          var raw = __b64ToBuffer(v.substring(commaIdx + 1));
          var u8 = new Uint8Array(raw);
          if (u8.length >= 24 && u8[0]===0x89 && u8[1]===0x50 && u8[2]===0x4E && u8[3]===0x47) {
            w = (u8[16]<<24)|(u8[17]<<16)|(u8[18]<<8)|u8[19];
            h = (u8[20]<<24)|(u8[21]<<16)|(u8[22]<<8)|u8[23];
          }
        } catch(e) {}
      }
      if (w <= 0 || w > 2048) w = 4;
      if (h <= 0 || h > 2048) h = 4;
      var fallbackCanvas = wx.createCanvas();
      fallbackCanvas.width = w; fallbackCanvas.height = h;
      var fctx = fallbackCanvas.getContext('2d');
      fctx.fillStyle = '#ffffff';
      fctx.fillRect(0, 0, w, h);
      self.__canvas = fallbackCanvas;
      self.width = w; self.height = h;
      self.naturalWidth = w; self.naturalHeight = h;
      self.complete = true;
      Promise.resolve().then(function() {
        try {
          if (typeof self.onload === 'function') self.onload({ target: self, type: 'load' });
          self.dispatchEvent({ type: 'load', target: self });
        } catch(loadErr) {
          console.error('[wx-adapter] data URL image load callback failed: ' + (loadErr.message||loadErr));
        }
      });
      return;
    }

    if (!v) {
      var self = this;
      Promise.resolve().then(function() {
        if (typeof self.onerror === 'function') self.onerror({ target:self, type:'error', message:'empty image src' });
        self.dispatchEvent({ type:'error', target:self, message:'empty image src' });
      });
      return;
    }
    if (typeof v === 'string' && v.charAt(0) === '/' && v.charAt(1) !== '/') v = v.substring(1);
    this.__wx.src = v;
  }
});
Image.prototype.setAttribute = function(n,v) { if(n==='src'){this.src=v;}else{this[n]=v;} };
Image.prototype.getAttribute = function(n) { return this[n]; };
Image.prototype.getBoundingClientRect = function() { return {x:0,y:0,top:0,left:0,width:this.width,height:this.height,right:this.width,bottom:this.height}; };

// ---- Audio (wraps wx.createInnerAudioContext) ----
function Audio(url) {
  __EventTarget.call(this);
  this.tagName = 'AUDIO'; this.type = 'audio'; this.style = {};
  var self = this;
  this.__wx = (typeof wx !== 'undefined') ? wx.createInnerAudioContext() : {};
  if (this.__wx && typeof this.__wx.onCanplay === 'function') {
    this.__wx.onCanplay(function(){ self.dispatchEvent({type:'canplaythrough',target:self}); if(typeof self.oncanplaythrough==='function') self.oncanplaythrough({target:self}); });
    this.__wx.onEnded(function(){ self.dispatchEvent({type:'ended',target:self}); if(typeof self.onended==='function') self.onended({target:self}); });
    this.__wx.onError(function(e){ self.dispatchEvent({type:'error',target:self}); if(typeof self.onerror==='function') self.onerror({target:self,message:e&&e.errMsg||''}); });
  }
  if (url) this.src = url;
}
Audio.prototype = Object.create(__EventTarget.prototype);
Audio.prototype.constructor = Audio;
Object.defineProperty(Audio.prototype, 'src', {
  get: function() { return this.__wx ? this.__wx.src : ''; },
  set: function(v) { v=__normalizeAssetUrl(v); if (typeof v==='string' && v.charAt(0)==='/' && v.charAt(1)!=='/') v=v.substring(1); if(this.__wx) this.__wx.src=v; }
});
Object.defineProperty(Audio.prototype, 'loop',       { get: function(){return this.__wx&&this.__wx.loop;}, set: function(v){if(this.__wx)this.__wx.loop=v;} });
Object.defineProperty(Audio.prototype, 'volume',     { get: function(){return this.__wx?this.__wx.volume:1;}, set: function(v){if(this.__wx)this.__wx.volume=v;} });
Object.defineProperty(Audio.prototype, 'currentTime',{ get: function(){return this.__wx?this.__wx.currentTime:0;}, set: function(v){if(this.__wx)this.__wx.seek(v);} });
Object.defineProperty(Audio.prototype, 'paused',     { get: function(){return this.__wx?this.__wx.paused:true;} });
Object.defineProperty(Audio.prototype, 'duration',   { get: function(){return this.__wx?this.__wx.duration:0;} });
Audio.prototype.play = function(){ if(this.__wx) this.__wx.play(); };
Audio.prototype.pause = function(){ if(this.__wx) this.__wx.pause(); };
Audio.prototype.load = function(){};
Audio.prototype.canPlayType = function(t){ if(!t) return ''; if(t.indexOf('mpeg')!==-1||t.indexOf('mp3')!==-1) return 'probably'; if(t.indexOf('ogg')!==-1) return 'maybe'; if(t.indexOf('wav')!==-1) return 'probably'; return ''; };
Audio.prototype.cloneNode = function(){ var c=new Audio(this.src); c.loop=this.loop; c.volume=this.volume; return c; };
Audio.prototype.setAttribute = function(n,v){this[n]=v;};
Audio.prototype.getAttribute = function(n){return this[n];};
Audio.prototype.destroy = function(){ if(this.__wx) this.__wx.destroy(); };

// ---- OffscreenCanvas (for document.createElement('canvas')) ----
function __OffCanvas(w, h) {
  var c = (typeof wx !== 'undefined') ? wx.createCanvas() : null;
  if (c) { c.width = w || 1; c.height = h || 1; }
  this.__c = c;
  this.tagName = 'CANVAS'; this.type = 'canvas';
  this.parentNode = null; this.parentElement = null;
  this.children = []; this.childNodes = [];
  this.id = ''; this.dataset = {};
  this.style = { width:(w||1)+'px', height:(h||1)+'px', top:'0px', left:'0px', cursor:'default', position:'' };
  this.classList = { add:function(){}, remove:function(){} };
}
Object.defineProperty(__OffCanvas.prototype, 'width',  { get: function(){return this.__c?this.__c.width:0;}, set: function(v){if(this.__c)this.__c.width=v; this.style.width=v+'px';} });
Object.defineProperty(__OffCanvas.prototype, 'height', { get: function(){return this.__c?this.__c.height:0;}, set: function(v){if(this.__c)this.__c.height=v; this.style.height=v+'px';} });
Object.defineProperty(__OffCanvas.prototype, 'clientWidth',  { get: function(){return this.width;} });
Object.defineProperty(__OffCanvas.prototype, 'clientHeight', { get: function(){return this.height;} });
__OffCanvas.prototype.getContext = function(t, a) { return this.__c ? __patchCtx(this.__c.getContext(t, a)) : null; };
__OffCanvas.prototype.getBoundingClientRect = function() { return {x:0,y:0,top:0,left:0,width:this.width,height:this.height,right:this.width,bottom:this.height}; };
__OffCanvas.prototype.addEventListener = function(t,fn,o) { if(this.__c&&this.__c.addEventListener) this.__c.addEventListener(t,fn,o); };
__OffCanvas.prototype.removeEventListener = function(t,fn) { if(this.__c&&this.__c.removeEventListener) this.__c.removeEventListener(t,fn); };
__OffCanvas.prototype.dispatchEvent = function(){};
__OffCanvas.prototype.setAttribute = function(n,v){this[n]=v;};
__OffCanvas.prototype.getAttribute = function(n){return this[n];};
__OffCanvas.prototype.focus = function(){};
__OffCanvas.prototype.blur = function(){};
__OffCanvas.prototype.toDataURL = function(t,q) { return this.__c && this.__c.toDataURL ? this.__c.toDataURL(t,q) : ''; };

// ---- body / documentElement ----
var __body = new HTMLElement('body');
__body._cw = __screenW; __body._ch = __screenH;
var __docEl = new HTMLElement('html');
__docEl._cw = __screenW; __docEl._ch = __screenH;
__docEl.style.width = __screenW + 'px'; __docEl.style.height = __screenH + 'px';
__docEl.ontouchstart = null;
var __head = new HTMLElement('head');

// ---- Canvas Proxy (wraps main canvas for DOM-like access) ----
var __canvasListeners = {};
var __canvasProxy = {
  tagName: 'CANVAS', type: 'canvas', id: '',
  style: { width: __screenW+'px', height: __screenH+'px', top:'0px', left:'0px', cursor:'default', position:'' },
  classList: { add:function(){}, remove:function(){} },
  dataset: {}, parentNode: __body, parentElement: __body,
  children: [], childNodes: [], __listeners: __canvasListeners,
  get width() { return canvas ? canvas.width : 0; },
  set width(v) { if (canvas) canvas.width = v; },
  get height() { return canvas ? canvas.height : 0; },
  set height(v) { if (canvas) canvas.height = v; },
  get clientWidth() { return canvas ? canvas.width : 0; },
  get clientHeight() { return canvas ? canvas.height : 0; },
  getContext: function(t,a) { return canvas ? __patchCtx(canvas.getContext(t,a)) : null; },
  getBoundingClientRect: function() { return {x:0,y:0,top:0,left:0,width:__screenW,height:__screenH,right:__screenW,bottom:__screenH}; },
  addEventListener: function(t,fn) { if(!__canvasListeners[t]) __canvasListeners[t]=[]; __canvasListeners[t].push(fn); },
  removeEventListener: function(t,fn) { var a=__canvasListeners[t]; if(a){var i=a.indexOf(fn);if(i!==-1)a.splice(i,1);} },
  dispatchEvent: function(e) { var a=__canvasListeners[e.type]; if(a) for(var i=0;i<a.length;i++) a[i](e); },
  setAttribute: function(n,v){this[n]=v;}, getAttribute: function(n){return this[n];},
  focus: function(){}, blur: function(){},
  toDataURL: function(t,q) { return canvas&&canvas.toDataURL ? canvas.toDataURL(t,q) : ''; }
};
__body.appendChild(__canvasProxy);
if (canvas) {
  function __safeSetCanvasProp(name, value) {
    try { canvas[name] = value; return; } catch (_) {}
    try { Object.defineProperty(canvas, name, { value:value, configurable:true }); } catch (_) {}
  }
  __safeSetCanvasProp('style', __canvasProxy.style);
  __safeSetCanvasProp('parentNode', __body);
  __safeSetCanvasProp('parentElement', __body);
  __safeSetCanvasProp('addEventListener', function(t, fn) { __canvasProxy.addEventListener(t, fn); });
  __safeSetCanvasProp('removeEventListener', function(t, fn) { __canvasProxy.removeEventListener(t, fn); });
  __safeSetCanvasProp('dispatchEvent', function(e) { __canvasProxy.dispatchEvent(e); });
  __safeSetCanvasProp('getBoundingClientRect', function() { return __canvasProxy.getBoundingClientRect(); });
  __safeSetCanvasProp('setAttribute', function(n, v) { __safeSetCanvasProp(n, v); });
  __safeSetCanvasProp('getAttribute', function(n) { return canvas[n]; });
  __safeSetCanvasProp('focus', __noop);
  __safeSetCanvasProp('blur', __noop);
}

// ---- document ----
var document = {
  readyState: 'complete',
  visibilityState: 'visible',
  hidden: false,
  fullscreenEnabled: false,
  documentElement: __docEl,
  head: __head,
  body: __body,
  scripts: [],
  createElement: function(tag) {
    var t = tag.toLowerCase();
    if (t === 'canvas') return new __OffCanvas();
    if (t === 'img' || t === 'image') return new Image();
    if (t === 'audio') return new Audio();
    return new HTMLElement(tag);
  },
  createElementNS: function(ns, tag) { return this.createElement(tag); },
  createTextNode: function() { return new HTMLElement('#text'); },
  getElementById: function(id) { if (id==='canvas'||id==='game') return __canvasProxy; return null; },
  getElementsByTagName: function(tag) {
    var t = tag.toLowerCase();
    if(t==='canvas') return [__canvasProxy]; if(t==='body') return [__body]; if(t==='head') return [__head]; if(t==='html') return [__docEl];
    return [];
  },
  getElementsByClassName: function() { return []; },
  querySelector: function(sel) {
    if (sel==='#app'||sel==='canvas'||sel==='#canvas') return __canvasProxy;
    if (sel==='body') return __body; if (sel==='head') return __head;
    return null;
  },
  querySelectorAll: function(sel) { var el=this.querySelector(sel); return el?[el]:[]; },
  elementFromPoint: function() { return __canvasProxy; },
  elementsFromPoint: function() { return [__canvasProxy]; },
  addEventListener: function(type, fn) {
    if (type==='visibilitychange' && typeof wx!=='undefined') {
      var self = this;
      if(wx.onShow) wx.onShow(function(){ self.visibilityState='visible'; self.hidden=false; fn({type:'visibilitychange',target:self}); });
      if(wx.onHide) wx.onHide(function(){ self.visibilityState='hidden'; self.hidden=true; fn({type:'visibilitychange',target:self}); });
    }
    if (type==='touchstart'||type==='touchmove'||type==='touchend'||type==='touchcancel') {
      __canvasProxy.addEventListener(type, fn);
    }
  },
  removeEventListener: function(){}
};

// ---- navigator ----
var navigator = {
  userAgent: 'Mozilla/5.0 (iPhone; WeChat MiniGame) Phaser/3.90.0 ' + (__wxSys.model || ''),
  appVersion: '5.0',
  platform: __wxSys.platform || 'iPhone',
  language: __wxSys.language || 'zh_CN',
  languages: [__wxSys.language || 'zh_CN'],
  onLine: true,
  maxTouchPoints: 10,
  hardwareConcurrency: 4,
  vibrate: function() { if(typeof wx!=='undefined') wx.vibrateShort && wx.vibrateShort({type:'medium'}); return true; },
  getGamepads: function() { return []; },
  clipboard: { writeText: function(){return Promise.resolve();}, readText: function(){return Promise.resolve('');} }
};

// ---- localStorage ----
var localStorage = {
  getItem: function(k) { if(typeof wx==='undefined') return null; var v=wx.getStorageSync(k); return v===''?null:v; },
  setItem: function(k,v) { if(typeof wx!=='undefined') wx.setStorageSync(k,v); },
  removeItem: function(k) { if(typeof wx!=='undefined') wx.removeStorageSync(k); },
  clear: function() { if(typeof wx!=='undefined') wx.clearStorageSync(); },
  get length() { if(typeof wx==='undefined') return 0; var i=wx.getStorageInfoSync(); return i.keys?i.keys.length:0; },
  key: function(idx) { if(typeof wx==='undefined') return null; var i=wx.getStorageInfoSync(); return i.keys?i.keys[idx]||null:null; }
};

var location = { href:'game.js', protocol:'https:', host:'minigame', hostname:'minigame', port:'', pathname:'/game.js', search:'', hash:'', origin:'https://minigame' };

var screen = { width:__screenW, height:__screenH, availWidth:__screenW, availHeight:__screenH, colorDepth:24,
  orientation:{ type:'portrait-primary', angle:0, addEventListener:function(){}, removeEventListener:function(){} }
};

// ---- XMLHttpRequest ----
var __NativeXHR = (typeof GameGlobal !== 'undefined' && GameGlobal.XMLHttpRequest) ? GameGlobal.XMLHttpRequest : null;
var XMLHttpRequest = (function() {
  if (!__NativeXHR) {
    return function FakeXHR() {
      this.readyState=0;this.status=0;this.statusText='';this.responseText='';this.response=null;this.responseType='';
      this.onload=null;this.onerror=null;this.onreadystatechange=null;this.ontimeout=null;this.onprogress=null;
      this.open=function(){};this.send=function(){};this.abort=function(){};this.setRequestHeader=function(){};
      this.addEventListener=function(){};this.removeEventListener=function(){};
      this.getResponseHeader=function(){return null;};this.getAllResponseHeaders=function(){return '';};
      this.overrideMimeType=function(){};
    };
  }
  function PatchedXHR() {
    var xhr = new __NativeXHR();
    var origOpen = xhr.open.bind(xhr);
    xhr.open = function(method, url) {
      url = __normalizeAssetUrl(url);
      if (typeof url === 'string' && url.charAt(0) === '/' && url.charAt(1) !== '/' && url.indexOf('http') !== 0) {
        url = url.substring(1);
      }
      var args = Array.prototype.slice.call(arguments);
      args[1] = url;
      return origOpen.apply(xhr, args);
    };
    return xhr;
  }
  PatchedXHR.DONE = 4; PatchedXHR.HEADERS_RECEIVED = 2;
  PatchedXHR.LOADING = 3; PatchedXHR.OPENED = 1; PatchedXHR.UNSENT = 0;
  return PatchedXHR;
})();

var fetch = (typeof GameGlobal !== 'undefined' && GameGlobal.fetch) ? GameGlobal.fetch
          : (typeof fetch !== 'undefined') ? fetch
          : function() { return Promise.reject(new Error('fetch not available')); };

var AudioContext = (typeof GameGlobal !== 'undefined' && GameGlobal.AudioContext) ? GameGlobal.AudioContext
                 : (typeof wx !== 'undefined' && wx.createWebAudioContext) ? function() { return wx.createWebAudioContext(); }
                 : undefined;
var webkitAudioContext = AudioContext;

var __noop = function(){};

// ---- window ----
var window = {
  canvas: canvas, document: document, location: location, navigator: navigator,
  localStorage: localStorage, performance: performance, screen: screen,
  innerWidth: __screenW, innerHeight: __screenH, outerWidth: __screenW, outerHeight: __screenH,
  devicePixelRatio: __dpr,
  requestAnimationFrame: requestAnimationFrame, cancelAnimationFrame: cancelAnimationFrame,
  setTimeout: (typeof GameGlobal!=='undefined'&&GameGlobal.setTimeout)||setTimeout,
  clearTimeout: (typeof GameGlobal!=='undefined'&&GameGlobal.clearTimeout)||clearTimeout,
  setInterval: (typeof GameGlobal!=='undefined'&&GameGlobal.setInterval)||setInterval,
  clearInterval: (typeof GameGlobal!=='undefined'&&GameGlobal.clearInterval)||clearInterval,
  Image: Image, Audio: Audio, HTMLElement: HTMLElement,
  HTMLCanvasElement: __OffCanvas, HTMLImageElement: Image, HTMLAudioElement: Audio, HTMLVideoElement: HTMLElement,
  Event: function Event(t) { this.type=t; this.target=null; this.currentTarget=null; this.preventDefault=__noop; this.stopPropagation=__noop; },
  MouseEvent: function MouseEvent(t) { this.type=t; this.target=null; this.preventDefault=__noop; this.stopPropagation=__noop; },
  TouchEvent: function TouchEvent(t) { this.type=t; this.target=null; this.touches=[]; this.changedTouches=[]; this.preventDefault=__noop; this.stopPropagation=__noop; },
  KeyboardEvent: function KeyboardEvent(t) { this.type=t; this.target=null; this.code=''; this.key=''; this.preventDefault=__noop; this.stopPropagation=__noop; },
  URL: typeof URL !== 'undefined' ? URL : function(u) { this.href = u; this.toString = function(){return this.href;}; },
  XMLHttpRequest: XMLHttpRequest, AudioContext: AudioContext, webkitAudioContext: webkitAudioContext,
  fetch: fetch,
  console: typeof console !== 'undefined' ? console : { log:__noop, warn:__noop, error:__noop, info:__noop, debug:__noop },
  alert: __noop, confirm: function(){return true;}, prompt: function(){return '';},
  getComputedStyle: function() { return { getPropertyValue: function(){return '';} }; },
  addEventListener: function(type, fn) {
    if (type==='resize' && typeof wx!=='undefined' && wx.onWindowResize) {
      var self = this;
      wx.onWindowResize(function(res) { self.innerWidth=res.windowWidth; self.innerHeight=res.windowHeight; fn({type:'resize',target:self}); });
    }
    if (type==='touchstart'||type==='touchmove'||type==='touchend'||type==='touchcancel'||type==='pointerdown'||type==='pointermove'||type==='pointerup'||type==='mousedown'||type==='mousemove'||type==='mouseup') {
      __canvasProxy.addEventListener(type, fn);
    }
    document.addEventListener(type, fn);
  },
  removeEventListener: __noop,
  focus: __noop, blur: __noop, close: __noop, open: __noop, scrollTo: __noop,
  matchMedia: function() { return { matches:false, addListener:__noop, removeListener:__noop, addEventListener:__noop, removeEventListener:__noop }; },
  DOMParser: function DOMParser() { this.parseFromString = function() { return { querySelector:function(){return null;}, querySelectorAll:function(){return [];} }; }; },
  atob: typeof atob !== 'undefined' ? atob : function(s) {
    var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', o='', i=0;
    s=s.replace(/=+$/,'');
    while(i<s.length){ var e1=chars.indexOf(s.charAt(i++)),e2=chars.indexOf(s.charAt(i++)),e3=chars.indexOf(s.charAt(i++)),e4=chars.indexOf(s.charAt(i++));
    o+=String.fromCharCode((e1<<2)|(e2>>4)); if(e3!==64) o+=String.fromCharCode(((e2&15)<<4)|(e3>>2)); if(e4!==64) o+=String.fromCharCode(((e3&3)<<6)|e4); }
    return o;
  },
  btoa: typeof btoa !== 'undefined' ? btoa : function(s) {
    var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', o='';
    for(var i=0;i<s.length;i+=3){ var a=s.charCodeAt(i),b=s.charCodeAt(i+1),c=s.charCodeAt(i+2);
    o+=chars[a>>2]; o+=chars[((a&3)<<4)|(b>>4)]; o+=(i+1<s.length)?chars[((b&15)<<2)|(c>>6)]:'='; o+=(i+2<s.length)?chars[c&63]:'='; }
    return o;
  }
};
window.self = window; window.top = window; window.parent = window; window.window = window;
var self = window; var top = window; var parent = window;
var HTMLCanvasElement = __OffCanvas;
var HTMLImageElement = Image;
var HTMLAudioElement = Audio;
var HTMLVideoElement = HTMLElement;
var Element = HTMLElement;

// ---- Touch Event Forwarding ----
(function() {
  if (typeof wx === 'undefined') return;
  function adaptTouches(wxt) {
    if (!wxt) return [];
    var out = [];
    for (var i = 0; i < wxt.length; i++) {
      var t = wxt[i];
      out.push({ identifier:t.identifier, clientX:t.clientX, clientY:t.clientY,
        pageX:t.pageX||t.clientX, pageY:t.pageY||t.clientY,
        screenX:t.clientX, screenY:t.clientY, radiusX:10, radiusY:10, force:1, target:__canvasProxy });
    }
    return out;
  }
  function dispatch(type, wxEvt) {
    var touches = adaptTouches(wxEvt.touches);
    var changed = adaptTouches(wxEvt.changedTouches);
    var evt = { type:type, touches:touches, changedTouches:changed, targetTouches:touches,
      target:__canvasProxy, currentTarget:__canvasProxy, timeStamp:Date.now(), preventDefault:__noop, stopPropagation:__noop };
    if (changed.length > 0) {
      evt.clientX=changed[0].clientX; evt.clientY=changed[0].clientY;
      evt.pageX=changed[0].pageX; evt.pageY=changed[0].pageY;
      evt.screenX=changed[0].screenX; evt.screenY=changed[0].screenY;
      evt.pointerId = changed[0].identifier;
      evt.button = 0;
    }
    __canvasProxy.dispatchEvent(evt);
  }
  wx.onTouchStart(function(e) { dispatch('touchstart',e); dispatch('pointerdown',e); dispatch('mousedown',e); });
  wx.onTouchMove(function(e)  { dispatch('touchmove',e);  dispatch('pointermove',e); dispatch('mousemove',e); });
  wx.onTouchEnd(function(e)   { dispatch('touchend',e);   dispatch('pointerup',e);   dispatch('mouseup',e);   });
  wx.onTouchCancel(function(e){ dispatch('touchcancel',e); });
})();

// ---- Push onto GameGlobal ----
(function() {
  if (typeof GameGlobal === 'undefined') return;
  var pairs = { window:window, self:window, document:document, navigator:navigator, localStorage:localStorage, location:location,
    performance:performance, screen:screen, Image:Image, Audio:Audio, HTMLElement:HTMLElement,
    HTMLCanvasElement:HTMLCanvasElement, HTMLImageElement:HTMLImageElement, HTMLAudioElement:HTMLAudioElement,
    HTMLVideoElement:HTMLVideoElement, Element:Element,
    XMLHttpRequest:XMLHttpRequest, requestAnimationFrame:requestAnimationFrame, cancelAnimationFrame:cancelAnimationFrame,
    canvas:canvas, innerWidth:__screenW, innerHeight:__screenH, devicePixelRatio:__dpr };
  var keys = Object.keys(pairs);
  for (var i = 0; i < keys.length; i++) {
    try { GameGlobal[keys[i]] = pairs[keys[i]]; } catch(_) {
      try { Object.defineProperty(GameGlobal, keys[i], { value: pairs[keys[i]], writable:true, configurable:true }); } catch(__) {}
    }
  }
})();
