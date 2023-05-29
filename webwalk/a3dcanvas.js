(function () {
  var _ = _ || {};
  _.scope = {};
  _.arrayIteratorImpl = function (a) {
      var b = 0;
      return function () {
          return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
      };
  };
  _.arrayIterator = function (a) {
      return { next: _.arrayIteratorImpl(a) };
  };
  _.ASSUME_ES5 = !1;
  _.ASSUME_NO_NATIVE_MAP = !1;
  _.ASSUME_NO_NATIVE_SET = !1;
  _.SIMPLE_FROUND_POLYFILL = !1;
  _.defineProperty =
      _.ASSUME_ES5 || "function" == typeof Object.defineProperties
          ? Object.defineProperty
          : function (a, b, c) {
                a != Array.prototype && a != Object.prototype && (a[b] = c.value);
            };
  _.getGlobal = function (a) {
      a = ["object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, a];
      for (var b = 0; b < a.length; ++b) {
          var c = a[b];
          if (c && c.Math == Math) return c;
      }
      return globalThis;
  };
  _.global = _.getGlobal(this);
  _.SYMBOL_PREFIX = "jscomp_symbol_";
  _.initSymbol = function () {
      _.initSymbol = function () {};
      _.global.Symbol || (_.global.Symbol = _.Symbol);
  };
  _.SymbolClass = function (a, b) {
      this.$jscomp$symbol$id_ = a;
      _.defineProperty(this, "description", { configurable: !0, writable: !0, value: b });
  };
  _.SymbolClass.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
  };
  _.Symbol = (function () {
      function a(c) {
          if (this instanceof a) throw new TypeError("Symbol is not a constructor");
          return new _.SymbolClass(_.SYMBOL_PREFIX + (c || "") + "_" + b++, c);
      }
      var b = 0;
      return a;
  })();
  _.initSymbolIterator = function () {
      _.initSymbol();
      var a = _.global.Symbol.iterator;
      a || (a = _.global.Symbol.iterator = _.global.Symbol("Symbol.iterator"));
      "function" != typeof Array.prototype[a] &&
          _.defineProperty(Array.prototype, a, {
              configurable: !0,
              writable: !0,
              value: function () {
                  return _.iteratorPrototype(_.arrayIteratorImpl(this));
              },
          });
      _.initSymbolIterator = function () {};
  };
  _.initSymbolAsyncIterator = function () {
      _.initSymbol();
      var a = _.global.Symbol.asyncIterator;
      a || (a = _.global.Symbol.asyncIterator = _.global.Symbol("Symbol.asyncIterator"));
      _.initSymbolAsyncIterator = function () {};
  };
  _.iteratorPrototype = function (a) {
      _.initSymbolIterator();
      a = { next: a };
      a[_.global.Symbol.iterator] = function () {
          return this;
      };
      return a;
  };
  _.makeIterator = function (a) {
      var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      return b ? b.call(a) : _.arrayIterator(a);
  };
  _.arrayFromIterator = function (a) {
      for (var b, c = []; !(b = a.next()).done; ) c.push(b.value);
      return c;
  };
  _.arrayFromIterable = function (a) {
      return a instanceof Array ? a : _.arrayFromIterator(_.makeIterator(a));
  };
  _.objectCreate =
      _.ASSUME_ES5 || "function" == typeof Object.create
          ? Object.create
          : function (a) {
                function b() {}
                b.prototype = a;
                return new b();
            };
  _.underscoreProtoCanBeSet = function () {
      var a = { a: !0 },
          b = {};
      try {
          return (b.__proto__ = a), b.a;
      } catch (c) {}
      return !1;
  };
  _.setPrototypeOf =
      "function" == typeof Object.setPrototypeOf
          ? Object.setPrototypeOf
          : _.underscoreProtoCanBeSet()
          ? function (a, b) {
                a.__proto__ = b;
                if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
                return a;
            }
          : null;
  _.inherits = function (a, b) {
      a.prototype = _.objectCreate(b.prototype);
      a.prototype.constructor = a;
      if (_.setPrototypeOf) {
          var c = _.setPrototypeOf;
          c(a, b);
      } else
          for (c in b)
              if ("prototype" != c)
                  if (Object.defineProperties) {
                      var d = Object.getOwnPropertyDescriptor(b, c);
                      d && Object.defineProperty(a, c, d);
                  } else a[c] = b[c];
      a.superClass_ = b.prototype;
  };
  _.FORCE_POLYFILL_PROMISE = !1;
  _.generator = {};
  _.generator.ensureIteratorResultIsObject_ = function (a) {
      if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
  };
  _.generator.Context = function () {
      this.isRunning_ = !1;
      this.yieldAllIterator_ = null;
      this.yieldResult = void 0;
      this.nextAddress = 1;
      this.finallyAddress_ = this.catchAddress_ = 0;
      this.finallyContexts_ = this.abruptCompletion_ = null;
  };
  _.generator.Context.prototype.start_ = function () {
      if (this.isRunning_) throw new TypeError("Generator is already running");
      this.isRunning_ = !0;
  };
  _.generator.Context.prototype.stop_ = function () {
      this.isRunning_ = !1;
  };
  _.generator.Context.prototype.jumpToErrorHandler_ = function () {
      this.nextAddress = this.catchAddress_ || this.finallyAddress_;
  };
  _.generator.Context.prototype.next_ = function (a) {
      this.yieldResult = a;
  };
  _.generator.Context.prototype.throw_ = function (a) {
      this.abruptCompletion_ = { exception: a, isException: !0 };
      this.jumpToErrorHandler_();
  };
  _.generator.Context.prototype.return = function (a) {
      this.abruptCompletion_ = { return: a };
      this.nextAddress = this.finallyAddress_;
  };
  _.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
      this.abruptCompletion_ = { jumpTo: a };
      this.nextAddress = this.finallyAddress_;
  };
  _.generator.Context.prototype.yield = function (a, b) {
      this.nextAddress = b;
      return { value: a };
  };
  _.generator.Context.prototype.yieldAll = function (a, b) {
      a = _.makeIterator(a);
      var c = a.next();
      _.generator.ensureIteratorResultIsObject_(c);
      if (c.done) (this.yieldResult = c.value), (this.nextAddress = b);
      else return (this.yieldAllIterator_ = a), this.yield(c.value, b);
  };
  _.generator.Context.prototype.jumpTo = function (a) {
      this.nextAddress = a;
  };
  _.generator.Context.prototype.jumpToEnd = function () {
      this.nextAddress = 0;
  };
  _.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
      this.catchAddress_ = a;
      void 0 != b && (this.finallyAddress_ = b);
  };
  _.generator.Context.prototype.setFinallyBlock = function (a) {
      this.catchAddress_ = 0;
      this.finallyAddress_ = a || 0;
  };
  _.generator.Context.prototype.leaveTryBlock = function (a, b) {
      this.nextAddress = a;
      this.catchAddress_ = b || 0;
  };
  _.generator.Context.prototype.enterCatchBlock = function (a) {
      this.catchAddress_ = a || 0;
      a = this.abruptCompletion_.exception;
      this.abruptCompletion_ = null;
      return a;
  };
  _.generator.Context.prototype.enterFinallyBlock = function (a, b, c) {
      c ? (this.finallyContexts_[c] = this.abruptCompletion_) : (this.finallyContexts_ = [this.abruptCompletion_]);
      this.catchAddress_ = a || 0;
      this.finallyAddress_ = b || 0;
  };
  _.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
      b = this.finallyContexts_.splice(b || 0)[0];
      if ((b = this.abruptCompletion_ = this.abruptCompletion_ || b)) {
          if (b.isException) return this.jumpToErrorHandler_();
          void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? ((this.nextAddress = b.jumpTo), (this.abruptCompletion_ = null)) : (this.nextAddress = this.finallyAddress_);
      } else this.nextAddress = a;
  };
  _.generator.Context.prototype.forIn = function (a) {
      return new _.generator.Context.PropertyIterator(a);
  };
  _.generator.Context.PropertyIterator = function (a) {
      this.object_ = a;
      this.properties_ = [];
      for (var b in a) this.properties_.push(b);
      this.properties_.reverse();
  };
  _.generator.Context.PropertyIterator.prototype.getNext = function () {
      for (; 0 < this.properties_.length; ) {
          var a = this.properties_.pop();
          if (a in this.object_) return a;
      }
      return null;
  };
  _.generator.Engine_ = function (a) {
      this.context_ = new _.generator.Context();
      this.program_ = a;
  };
  _.generator.Engine_.prototype.next_ = function (a) {
      this.context_.start_();
      if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
      this.context_.next_(a);
      return this.nextStep_();
  };
  _.generator.Engine_.prototype.return_ = function (a) {
      this.context_.start_();
      var b = this.context_.yieldAllIterator_;
      if (b)
          return this.yieldAllStep_(
              "return" in b
                  ? b["return"]
                  : function (a) {
                        return { value: a, done: !0 };
                    },
              a,
              this.context_.return
          );
      this.context_.return(a);
      return this.nextStep_();
  };
  _.generator.Engine_.prototype.throw_ = function (a) {
      this.context_.start_();
      if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
      this.context_.throw_(a);
      return this.nextStep_();
  };
  _.generator.Engine_.prototype.yieldAllStep_ = function (a, b, c) {
      try {
          var d = a.call(this.context_.yieldAllIterator_, b);
          _.generator.ensureIteratorResultIsObject_(d);
          if (!d.done) return this.context_.stop_(), d;
          var e = d.value;
      } catch (f) {
          return (this.context_.yieldAllIterator_ = null), this.context_.throw_(f), this.nextStep_();
      }
      this.context_.yieldAllIterator_ = null;
      c.call(this.context_, e);
      return this.nextStep_();
  };
  _.generator.Engine_.prototype.nextStep_ = function () {
      for (; this.context_.nextAddress; )
          try {
              var a = this.program_(this.context_);
              if (a) return this.context_.stop_(), { value: a.value, done: !1 };
          } catch (b) {
              (this.context_.yieldResult = void 0), this.context_.throw_(b);
          }
      this.context_.stop_();
      if (this.context_.abruptCompletion_) {
          a = this.context_.abruptCompletion_;
          this.context_.abruptCompletion_ = null;
          if (a.isException) throw a.exception;
          return { value: a.return, done: !0 };
      }
      return { value: void 0, done: !0 };
  };
  _.generator.Generator_ = function (a) {
      this.next = function (b) {
          return a.next_(b);
      };
      this.throw = function (b) {
          return a.throw_(b);
      };
      this.return = function (b) {
          return a.return_(b);
      };
      _.initSymbolIterator();
      this[Symbol.iterator] = function () {
          return this;
      };
  };
  _.generator.createGenerator = function (a, b) {
      b = new _.generator.Generator_(new _.generator.Engine_(b));
      _.setPrototypeOf && _.setPrototypeOf(b, a.prototype);
      return b;
  };
  _.asyncExecutePromiseGenerator = function (a) {
      function b(b) {
          return a.next(b);
      }
      function c(b) {
          return a.throw(b);
      }
      return new Promise(function (d, e) {
          function f(a) {
              a.done ? d(a.value) : Promise.resolve(a.value).then(b, c).then(f, e);
          }
          f(a.next());
      });
  };
  _.asyncExecutePromiseGeneratorFunction = function (a) {
      return _.asyncExecutePromiseGenerator(a());
  };
  _.asyncExecutePromiseGeneratorProgram = function (a) {
      return _.asyncExecutePromiseGenerator(new _.generator.Generator_(new _.generator.Engine_(a)));
  };
  _.iteratorFromArray = function (a, b) {
      _.initSymbolIterator();
      a instanceof String && (a += "");
      var c = 0,
          d = {
              next: function () {
                  if (c < a.length) {
                      var e = c++;
                      return { value: b(e, a[e]), done: !1 };
                  }
                  d.next = function () {
                      return { done: !0, value: void 0 };
                  };
                  return d.next();
              },
          };
      d[Symbol.iterator] = function () {
          return d;
      };
      return d;
  };
  _.owns = function (a, b) {
      return Object.prototype.hasOwnProperty.call(a, b);
  };
  _.checkStringArgs = function (a, b, c) {
      if (null == a) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
      if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
      return a + "";
  };
  _.checkEs6ConformanceViaProxy = function () {
      try {
          var a = {},
              b = Object.create(
                  new _.global.Proxy(a, {
                      get: function (c, d, e) {
                          return c == a && "q" == d && e == b;
                      },
                  })
              );
          return !0 === b.q;
      } catch (c) {
          return !1;
      }
  };
  _.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
  _.ES6_CONFORMANCE = _.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && _.checkEs6ConformanceViaProxy();
  _.MapEntry = function () {};
  _.assign =
      "function" == typeof Object.assign
          ? Object.assign
          : function (a, b) {
                for (var c = 1; c < arguments.length; c++) {
                    var d = arguments[c];
                    if (d) for (var e in d) _.owns(d, e) && (a[e] = d[e]);
                }
                return a;
            };
  _.findInternal = function (a, b, c) {
      a instanceof String && (a = String(a));
      for (var d = a.length, e = 0; e < d; e++) {
          var f = a[e];
          if (b.call(c, f, e, a)) return { i: e, v: f };
      }
      return { i: -1, v: void 0 };
  };

  (function () {
    /**
     * @param {!Function} a
     * @param {!Object} b
     * @param {?} c
     * @return {?}
     */
      function callApply(a, b, c) {
          return a.call.apply(a.bind, arguments);
      }
    /**
     * @param {!Function} a
     * @param {!Object} b
     * @param {?} c
     * @return {?}
     */
      function apply_(a, b, c) {
          if (!a) throw Error();
          if (2 < arguments.length) {
              var d = Array.prototype.slice.call(arguments, 2);
              return function () {
                  var c = Array.prototype.slice.call(arguments);
                  Array.prototype.unshift.apply(c, d);
                  return a.apply(b, c);
              };
          }
          return function () {
              return a.apply(b, arguments);
          };
      }
      /**
       * @param {!Function} d
       * @param {!Object} e
       * @param {?} f
       * @return {?}
       */
      function run(d, e, f) {
          run = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? callApply : apply_;
          return run.apply(null, arguments);
      }
      function d(a, context) {
          this.a = a;
          this.m = context || a;
          this.c = this.m.document;
      }
      /**
       * 
       * @param {*} a 
       * @param {*} type 
       * @param {*} c 
       * @param {*} append 
       * @returns 
       */
      function addNode(a, type, c, append) {
          type = a.c.createElement(type);
          if (c) for (var e in c) c.hasOwnProperty(e) && ("style" == e ? (type.style.cssText = c[e]) : type.setAttribute(e, c[e]));
          append && type.appendChild(a.c.createTextNode(append));
          return type;
      }
      /**
       * 
       * @param {*} a 
       * @param {*} parentTag 
       * @param {Node} node 
       */
      function insertNode(a, parentTag, node) {
          (a = a.c.getElementsByTagName(parentTag)[0]) || (a = document.documentElement);
          a.insertBefore(node, a.lastChild);
      }
      /**
       * 
       * @param {Node} a 
       */
      function removeNode(a) {
          a.parentNode && a.parentNode.removeChild(a);
      }
      /**
       * 
       * @param {Element} elt 
       * @param {Array} b 
       * @param {Array} c 
       */
      function setNodeStyle(elt, b, c) {
          b = b || [];
          c = c || [];
          for (var clsArr = elt.className.split(/\s+/), i = 0; i < b.length; i += 1) {
              for (var f = false, j = 0; j < clsArr.length; j += 1)
                  if (b[i] === clsArr[j]) {
                      f = true;
                      break;
                  }
              f || clsArr.push(b[i]);
          }
          b = [];
          for (i = 0; i < clsArr.length; i += 1) {
              f = false;
              for (j = 0; j < c.length; j += 1)
                  if (clsArr[i] === c[j]) {
                      f = true;
                      break;
                  }
              f || b.push(clsArr[i]);
          }
          elt.className = b
              .join(" ")
              .replace(/\s+/g, " ")
              .replace(/^\s+|\s+$/, "");
      }
      /**
       * 
       * @param {Element} elt 
       * @param {String} s 
       * @returns 
       */
      function hasStyle(elt, s) {
          elt = elt.className.split(/\s+/);
          for (var i = 0, len = elt.length; i < len; i++) if (elt[i] == s) return true;
          return false;
      }
      function m(a) {
          if ("string" === typeof a.f) return a.f;
          var b = a.m.location.protocol;
          "about:" == b && (b = a.a.location.protocol);
          return "https:" == b ? "https:" : "http:";
      }
      function getHostname(a) {
          return a.m.location.hostname || a.a.location.hostname;
      }
      function p(a, b, c) {
          function d() {
              m && g && h && (m(l), (m = null));
          }
          b = addNode(a, "link", { rel: "stylesheet", href: b, media: "all" });
          var g = !1,
              h = !0,
              l = null,
              m = c || null;
          la
              ? ((b.onload = function () {
                    g = !0;
                    d();
                }),
                (b.onerror = function () {
                    g = !0;
                    l = Error("Stylesheet failed to load");
                    d();
                }))
              : setTimeout(function () {
                    g = !0;
                    d();
                }, 0);
          insertNode(a, "head", b);
      }
      function r(a, b, c, d) {
          var f = a.c.getElementsByTagName("head")[0];
          if (f) {
              var g = addNode(a, "script", { src: b }),
                  h = !1;
              g.onload = g.onreadystatechange = function () {
                  h || (this.readyState && "loaded" != this.readyState && "complete" != this.readyState) || ((h = !0), c && c(null), (g.onload = g.onreadystatechange = null), "HEAD" == g.parentNode.tagName && f.removeChild(g));
              };
              f.appendChild(g);
              setTimeout(function () {
                  h || ((h = !0), c && c(Error("Script load timeout")));
              }, d || 5e3);
              return g;
          }
          return null;
      }
      function q() {
          this.a = 0;
          this.c = null;
      }
      function u(a) {
          a.a++;
          return function () {
              a.a--;
              w(a);
          };
      }
      function v(a, b) {
          a.c = b;
          w(a);
      }
      function w(a) {
          0 == a.a && a.c && (a.c(), (a.c = null));
      }
      function y(a) {
          this.a = a || "-";
      }
      function z(a, b) {
          this.c = a;
          this.f = 4;
          this.a = "n";
          (a = (b || "n4").match(/^([nio])([1-9])$/i)) && ((this.a = a[1]), (this.f = parseInt(a[2], 10)));
      }
      function x(a) {
          return fntStyle(a) + " " + (a.f + "00 300px ") + A(a.c);
      }
      function A(a) {
          var b = [];
          a = a.split(/,\s*/);
          for (var c = 0; c < a.length; c++) {
              var d = a[c].replace(/['"]/g, "");
              -1 != d.indexOf(" ") || /^\d/.test(d) ? b.push("'" + d + "'") : b.push(d);
          }
          return b.join(",");
      }
      function B(a) {
          return a.a + a.f;
      }
      function fntStyle(a) {
          var b = "normal";
          "o" === a.a ? (b = "oblique") : "i" === a.a && (b = "italic");
          return b;
      }
      function C(a) {
          var b = 4,
              c = "n",
              d = null;
          a &&
              ((d = a.match(/(normal|oblique|italic)/i)) && d[1] && (c = d[1].substr(0, 1).toLowerCase()),
              (d = a.match(/([1-9]00|normal|bold)/i)) && d[1] && (/bold/i.test(d[1]) ? (b = 7) : /[1-9]00/.test(d[1]) && (b = parseInt(d[1].substr(0, 1), 10))));
          return c + b;
      }
      function J(a, b) {
          this.c = a;
          this.f = a.m.document.documentElement;
          this.h = b;
          this.a = new y("-");
          this.j = !1 !== b.events;
          this.g = !1 !== b.classes;
      }
      function F(a) {
          a.g && setNodeStyle(a.f, [a.a.c("wf", "loading")]);
          H(a, "loading");
      }
      function I(a) {
          if (a.g) {
              var b = hasStyle(a.f, a.a.c("wf", "active")),
                  c = [],
                  d = [a.a.c("wf", "loading")];
              b || c.push(a.a.c("wf", "inactive"));
              setNodeStyle(a.f, c, d);
          }
          H(a, "inactive");
      }
      function H(a, b, c) {
          if (a.j && a.h[b])
              if (c) a.h[b](c.c, B(c));
              else a.h[b]();
      }
      function M() {
          this.c = {};
      }
      function N(a, b, c) {
          var d = [],
              e;
          for (e in b)
              if (b.hasOwnProperty(e)) {
                  var f = a.c[e];
                  f && d.push(f(b[e], c));
              }
          return d;
      }
      function G(a, b) {
          this.c = a;
          this.f = b;
          this.a = addNode(this.c, "span", { "aria-hidden": "true" }, this.f);
      }
      function D(a) {
          insertNode(a.c, "body", a.a);
      }
      function E(a) {
          return (
              "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" +
              A(a.c) +
              ";font-style:" +
              (fntStyle(a) + ";font-weight:" + (a.f + "00;"))
          );
      }
      function S(a, b, c, d, e, f) {
          this.g = a;
          this.j = b;
          this.a = d;
          this.c = c;
          this.f = e || 3e3;
          this.h = f || void 0;
      }
      function Z(a, b, c, d, e, f, g) {
          this.v = a;
          this.B = b;
          this.c = c;
          this.a = d;
          this.s = g || "BESbswy";
          this.f = {};
          this.w = e || 3e3;
          this.u = f || null;
          this.o = this.j = this.h = this.g = null;
          this.g = new G(this.c, this.s);
          this.h = new G(this.c, this.s);
          this.j = new G(this.c, this.s);
          this.o = new G(this.c, this.s);
          a = new z(this.a.c + ",serif", B(this.a));
          a = E(a);
          this.g.a.style.cssText = a;
          a = new z(this.a.c + ",sans-serif", B(this.a));
          a = E(a);
          this.h.a.style.cssText = a;
          a = new z("serif", B(this.a));
          a = E(a);
          this.j.a.style.cssText = a;
          a = new z("sans-serif", B(this.a));
          a = E(a);
          this.o.a.style.cssText = a;
          D(this.g);
          D(this.h);
          D(this.j);
          D(this.o);
      }
      function Q() {
          if (null === Bb) {
              var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
              Bb = !!a && (536 > parseInt(a[1], 10) || (536 === parseInt(a[1], 10) && 11 >= parseInt(a[2], 10)));
          }
          return Bb;
      }
      function ca(a, b, c) {
          for (var d in hb) if (hb.hasOwnProperty(d) && b === a.f[hb[d]] && c === a.f[hb[d]]) return !0;
          return !1;
      }
      function ha(a) {
          var b = a.g.a.offsetWidth,
              c = a.h.a.offsetWidth,
              d;
          (d = b === a.f.serif && c === a.f["sans-serif"]) || (d = Q() && ca(a, b, c));
          d ? (vb() - a.A >= a.w ? (Q() && ca(a, b, c) && (null === a.u || a.u.hasOwnProperty(a.a.c)) ? Y(a, a.v) : Y(a, a.B)) : fa(a)) : Y(a, a.v);
      }
      function fa(a) {
          setTimeout(
              run(function () {
                  ha(this);
              }, a),
              50
          );
      }
      function Y(a, b) {
          setTimeout(
              run(function () {
                  removeNode(this.g.a);
                  removeNode(this.h.a);
                  removeNode(this.j.a);
                  removeNode(this.o.a);
                  b(this.a);
              }, a),
              0
          );
      }
      function O(a, b, c) {
          this.c = a;
          this.a = b;
          this.f = 0;
          this.o = this.j = !1;
          this.s = c;
      }
      function U(a) {
          0 == --a.f && a.j && (a.o ? ((a = a.a), a.g && setNodeStyle(a.f, [a.a.c("wf", "active")], [a.a.c("wf", "loading"), a.a.c("wf", "inactive")]), H(a, "active")) : I(a.a));
      }
      function aa(a) {
          this.j = a;
          this.a = new M();
          this.h = 0;
          this.f = this.g = !0;
      }
      function V(a, b, d, e, f) {
          var g = 0 == --a.h;
          (a.f || a.g) &&
              setTimeout(function () {
                  var a = f || null,
                      l = e || {};
                  if (0 === d.length && g) I(b.a);
                  else {
                      b.f += d.length;
                      g && (b.j = g);
                      var m,
                          n = [];
                      for (m = 0; m < d.length; m++) {
                          var q = d[m],
                              p = l[q.c],
                              v = b.a,
                              r = q;
                          v.g && setNodeStyle(v.f, [v.a.c("wf", r.c, B(r).toString(), "loading")]);
                          H(v, "fontloading", r);
                          v = null;
                          null === Nb && (Nb = window.FontFace ? ((r = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent)) ? 42 < parseInt(r[1], 10) : !0) : !1);
                          Nb ? (v = new S(run(b.g, b), run(b.h, b), b.c, q, b.s, p)) : (v = new Z(run(b.g, b), run(b.h, b), b.c, q, b.s, a, p));
                          n.push(v);
                      }
                      for (m = 0; m < n.length; m++) n[m].start();
                  }
              }, 0);
      }
      function oa(a, b, c) {
          var d = [],
              e = c.timeout;
          F(b);
          d = N(a.a, c, a.c);
          var f = new O(a.c, b, e);
          a.h = d.length;
          b = 0;
          for (c = d.length; b < c; b++)
              d[b].load(function (b, c, d) {
                  V(a, f, b, c, d);
              });
      }
      function ka(a, b) {
          this.c = a;
          this.a = b;
      }
      function ma(a, b, c) {
          var d = m(a.c);
          a = (a.a.api || "fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/, "");
          return d + "//" + a + "/" + b + ".js" + (c ? "?v=" + c : "");
      }
      function ia(a, b) {
          this.c = a;
          this.a = b;
      }
      function W(a, b, c) {
          a ? (this.c = a) : (this.c = b + pa);
          this.a = [];
          this.f = [];
          this.g = c || "";
      }
      function Ga(a, b) {
          for (var c = b.length, d = 0; d < c; d++) {
              var e = b[d].split(":");
              3 == e.length && a.f.push(e.pop());
              var f = "";
              2 == e.length && "" != e[1] && (f = ":");
              a.a.push(e.join(f));
          }
      }
      function Fa(a) {
          if (0 == a.a.length) throw Error("No fonts to load!");
          if (-1 != a.c.indexOf("kit=")) return a.c;
          for (var b = a.a.length, c = [], d = 0; d < b; d++) c.push(a.a[d].replace(/ /g, "+"));
          b = a.c + "?family=" + c.join("%7C");
          0 < a.f.length && (b += "&subset=" + a.f.join(","));
          0 < a.g.length && (b += "&text=" + encodeURIComponent(a.g));
          return b;
      }
      function jb(a) {
          this.f = a;
          this.a = [];
          this.c = {};
      }
      function Oa(a) {
          for (var b = a.f.length, c = 0; c < b; c++) {
              var d = a.f[c].split(":"),
                  e = d[0].replace(/\+/g, " "),
                  f = ["n4"];
              if (2 <= d.length) {
                  var g = d[1];
                  var h = [];
                  if (g) {
                      g = g.split(",");
                      for (var l = g.length, m = 0; m < l; m++) {
                          var n = g[m];
                          if (n.match(/^[\w-]+$/)) {
                              var q = qa.exec(n.toLowerCase());
                              if (null == q) n = "";
                              else {
                                  n = q[2];
                                  n = null == n || "" == n ? "n" : ra[n];
                                  q = q[1];
                                  if (null == q || "" == q) q = "4";
                                  else {
                                      var p = va[q];
                                      q = p ? p : isNaN(q) ? "4" : q.substr(0, 1);
                                  }
                                  n = [n, q].join("");
                              }
                          } else n = "";
                          n && h.push(n);
                      }
                  }
                  0 < h.length && (f = h);
                  3 == d.length && ((d = d[2]), (h = []), (d = d ? d.split(",") : h), 0 < d.length && (d = wa[d[0]]) && (a.c[e] = d));
              }
              a.c[e] || ((d = wa[e]) && (a.c[e] = d));
              for (d = 0; d < f.length; d += 1) a.a.push(new z(e, f[d]));
          }
      }
      function sa(a, b) {
          this.c = a;
          this.a = b;
      }
      function Db(a, b) {
          this.c = a;
          this.a = b;
      }
      function Ra(a, b) {
          this.c = a;
          this.f = b;
          this.a = [];
      }
      var vb =
              Date.now ||
              function () {
                  return +new Date();
              },
          la = !!window.FontFace;
      y.prototype.c = function (a) {
          for (var b = [], c = 0; c < arguments.length; c++) b.push(arguments[c].replace(/[\W_]+/g, "").toLowerCase());
          return b.join(this.a);
      };
      S.prototype.start = function () {
          var a = this.c.m.document,
              b = this,
              c = vb(),
              d = new Promise(function (d, e) {
                  function f() {
                      vb() - c >= b.f
                          ? e()
                          : a.fonts.load(x(b.a), b.h).then(
                                function (a) {
                                    1 <= a.length ? d() : setTimeout(f, 25);
                                },
                                function () {
                                    e();
                                }
                            );
                  }
                  f();
              }),
              e = new Promise(function (a, c) {
                  setTimeout(c, b.f);
              });
          Promise.race([e, d]).then(
              function () {
                  b.g(b.a);
              },
              function () {
                  b.j(b.a);
              }
          );
      };
      var hb = { D: "serif", C: "sans-serif" },
          Bb = null;
      Z.prototype.start = function () {
          this.f.serif = this.j.a.offsetWidth;
          this.f["sans-serif"] = this.o.a.offsetWidth;
          this.A = vb();
          ha(this);
      };
      var Nb = null;
      O.prototype.g = function (a) {
          var b = this.a;
          b.g && setNodeStyle(b.f, [b.a.c("wf", a.c, B(a).toString(), "active")], [b.a.c("wf", a.c, B(a).toString(), "loading"), b.a.c("wf", a.c, B(a).toString(), "inactive")]);
          H(b, "fontactive", a);
          this.o = !0;
          U(this);
      };
      O.prototype.h = function (a) {
          var b = this.a;
          if (b.g) {
              var c = hasStyle(b.f, b.a.c("wf", a.c, B(a).toString(), "active")),
                  d = [],
                  e = [b.a.c("wf", a.c, B(a).toString(), "loading")];
              c || d.push(b.a.c("wf", a.c, B(a).toString(), "inactive"));
              setNodeStyle(b.f, d, e);
          }
          H(b, "fontinactive", a);
          U(this);
      };
      aa.prototype.load = function (a) {
          this.c = new d(this.j, a.context || this.j);
          this.g = !1 !== a.events;
          this.f = !1 !== a.classes;
          oa(this, new J(this.c, a), a);
      };
      ka.prototype.load = function (a) {
          function b() {
              if (f["__mti_fntLst" + d]) {
                  var c = f["__mti_fntLst" + d](),
                      e = [],
                      g;
                  if (c)
                      for (var h = 0; h < c.length; h++) {
                          var l = c[h].fontfamily;
                          void 0 != c[h].fontStyle && void 0 != c[h].fontWeight ? ((g = c[h].fontStyle + c[h].fontWeight), e.push(new z(l, g))) : e.push(new z(l));
                      }
                  a(e);
              } else
                  setTimeout(function () {
                      b();
                  }, 50);
          }
          var c = this,
              d = c.a.projectId,
              e = c.a.version;
          if (d) {
              var f = c.c.m;
              r(this.c, ma(c, d, e), function (e) {
                  e
                      ? a([])
                      : ((f["__MonotypeConfiguration__" + d] = function () {
                            return c.a;
                        }),
                        b());
              }).id = "__MonotypeAPIScript__" + d;
          } else a([]);
      };
      ia.prototype.load = function (a) {
          var b,
              c = this.a.urls || [],
              d = this.a.families || [],
              e = this.a.testStrings || {},
              f = new q();
          var g = 0;
          for (b = c.length; g < b; g++) p(this.c, c[g], u(f));
          var h = [];
          g = 0;
          for (b = d.length; g < b; g++)
              if (((c = d[g].split(":")), c[1])) for (var l = c[1].split(","), m = 0; m < l.length; m += 1) h.push(new z(c[0], l[m]));
              else h.push(new z(c[0]));
          v(f, function () {
              a(h, e);
          });
      };
      var pa = "//fonts.googleapis.com/css",
          wa = { latin: "BESbswy", "latin-ext": "\u00e7\u00f6\u00fc\u011f\u015f", cyrillic: "\u0439\u044f\u0416", greek: "\u03b1\u03b2\u03a3", khmer: "\u1780\u1781\u1782", Hanuman: "\u1780\u1781\u1782" },
          va = {
              thin: "1",
              extralight: "2",
              "extra-light": "2",
              ultralight: "2",
              "ultra-light": "2",
              light: "3",
              regular: "4",
              book: "4",
              medium: "5",
              "semi-bold": "6",
              semibold: "6",
              "demi-bold": "6",
              demibold: "6",
              bold: "7",
              "extra-bold": "8",
              extrabold: "8",
              "ultra-bold": "8",
              ultrabold: "8",
              black: "9",
              heavy: "9",
              l: "3",
              r: "4",
              b: "7",
          },
          ra = { i: "i", italic: "i", n: "n", normal: "n" },
          qa = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/,
          Da = { Arimo: !0, Cousine: !0, Tinos: !0 };
      sa.prototype.load = function (a) {
          var b = new q(),
              c = this.c,
              d = new W(this.a.api, m(c), this.a.text),
              e = this.a.families;
          Ga(d, e);
          var f = new jb(e);
          Oa(f);
          p(c, Fa(d), u(b));
          v(b, function () {
              a(f.a, f.c, Da);
          });
      };
      Db.prototype.load = function (a) {
          var b = this.a.id,
              c = this.c.m;
          b
              ? r(
                    this.c,
                    (this.a.api || "https://use.typekit.net") + "/" + b + ".js",
                    function (b) {
                        if (b) a([]);
                        else if (c.Typekit && c.Typekit.config && c.Typekit.config.fn) {
                            b = c.Typekit.config.fn;
                            for (var d = [], e = 0; e < b.length; e += 2) for (var f = b[e], g = b[e + 1], h = 0; h < g.length; h++) d.push(new z(f, g[h]));
                            try {
                                c.Typekit.load({ events: !1, classes: !1, async: !0 });
                            } catch (ib) {}
                            a(d);
                        }
                    },
                    2e3
                )
              : a([]);
      };
      Ra.prototype.load = function (a) {
          var b = this.f.id,
              c = this.c.m,
              d = this;
          b
              ? (c.__webfontfontdeckmodule__ || (c.__webfontfontdeckmodule__ = {}),
                (c.__webfontfontdeckmodule__[b] = function (b, c) {
                    b = 0;
                    for (var e = c.fonts.length; b < e; ++b) {
                        var f = c.fonts[b];
                        d.a.push(new z(f.name, C("font-weight:" + f.weight + ";font-style:" + f.style)));
                    }
                    a(d.a);
                }),
                r(this.c, m(this.c) + (this.f.api || "//f.fontdeck.com/s/css/js/") + getHostname(this.c) + "/" + b + ".js", function (b) {
                    b && a([]);
                }))
              : a([]);
      };
      var P = new aa(window);
      P.a.c.custom = function (a, b) {
          return new ia(b, a);
      };
      P.a.c.fontdeck = function (a, b) {
          return new Ra(b, a);
      };
      P.a.c.monotype = function (a, b) {
          return new ka(b, a);
      };
      P.a.c.typekit = function (a, b) {
          return new Db(b, a);
      };
      P.a.c.google = function (a, b) {
          return new sa(b, a);
      };
      var ea = { load: run(P.load, P) };
      "function" === typeof define && define.amd
          ? define(function () {
                return ea;
            })
          : "undefined" !== typeof module && module.exports
          ? (module.exports = ea)
          : ((window.WebFont = ea), window.WebFontConfig && P.load(window.WebFontConfig));
  })();

  window.THREE = THREE;
  THREE.BoxBufferGeometry = function (a, b, c, d, e, f) {
      function g(a, b, c, d, e, f, g, x, A, B) {
          var q = f / A,
              v = g / B,
              r = f / 2,
              u = g / 2,
              w = x / 2;
          g = A + 1;
          var y = B + 1;
          f = 0;
          var z,
              N,
              G = new THREE.Vector3();
          for (N = 0; N < y; N++) {
              var D = N * v - u;
              for (z = 0; z < g; z++) (G[a] = (z * q - r) * d), (G[b] = D * e), (G[c] = w), l.push(G.x, G.y, G.z), (G[a] = 0), (G[b] = 0), (G[c] = 0 < x ? 1 : -1), m.push(G.x, G.y, G.z), n.push(z / A), n.push(1 - N / B), (f += 1);
          }
          for (N = 0; N < B; N++) for (z = 0; z < A; z++) (a = p + z + g * (N + 1)), (b = p + (z + 1) + g * (N + 1)), (c = p + (z + 1) + g * N), h.push(p + z + g * N, a, c), h.push(a, b, c);
          p += f;
      }
      THREE.BufferGeometry.call(this);
      this.parameters = { width: a, height: b, depth: c, widthSegments: d, heightSegments: e, depthSegments: f };
      d = Math.floor(d) || 1;
      e = Math.floor(e) || 1;
      f = Math.floor(f) || 1;
      var h = [],
          l = [],
          m = [],
          n = [],
          p = 0;
      g("z", "y", "x", -1, -1, c, b, a, f, e);
      g("z", "y", "x", 1, -1, c, b, -a, f, e);
      g("x", "z", "y", 1, 1, a, c, b, d, f);
      g("x", "z", "y", 1, -1, a, c, -b, d, f);
      g("x", "y", "z", 1, -1, a, b, c, d, e);
      g("x", "y", "z", -1, -1, a, b, -c, d, e);
      console.assert(65536 >= l.length);
      this.addAttribute("index", new THREE.BufferAttribute(new Uint16Array(h), 1));
      this.addAttribute("position", new THREE.BufferAttribute(new Float32Array(l), 3));
      this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(m), 3));
      this.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(n), 2));
  };
  THREE.BoxBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  THREE.BoxBufferGeometry.prototype.constructor = THREE.BoxBufferGeometry;

    THREE.SphereBufferGeometry = function (a, b, c, d, e, f, g) {
        THREE.BufferGeometry.call(this);
        this.parameters = { radius: a, widthSegments: b, heightSegments: c, phiStart: d, phiLength: e, thetaStart: f, thetaLength: g };
        a = a || 50;
        b = Math.max(3, Math.floor(b) || 8);
        c = Math.max(2, Math.floor(c) || 6);
        d = void 0 !== d ? d : 0;
        e = void 0 !== e ? e : 2 * Math.PI;
        f = void 0 !== f ? f : 0;
        g = void 0 !== g ? g : Math.PI;
        var h = f + g,
            l,
            m,
            n = 0,
            p = [],
            r = new THREE.Vector3(),
            q = new THREE.Vector3(),
            u = [],
            v = [],
            w = [],
            y = [];
        for (m = 0; m <= c; m++) {
            var z = [],
                x = m / c;
            for (l = 0; l <= b; l++) {
                var A = l / b;
                r.x = -a * Math.cos(d + A * e) * Math.sin(f + x * g);
                r.y = a * Math.cos(f + x * g);
                r.z = a * Math.sin(d + A * e) * Math.sin(f + x * g);
                v.push(r.x, r.y, r.z);
                q.set(r.x, r.y, r.z).normalize();
                w.push(q.x, q.y, q.z);
                y.push(A, 1 - x);
                z.push(n++);
            }
            p.push(z);
        }
        for (m = 0; m < c; m++) for (l = 0; l < b; l++) (a = p[m][l + 1]), (d = p[m][l]), (e = p[m + 1][l]), (g = p[m + 1][l + 1]), (0 !== m || 0 < f) && u.push(a, d, g), (m !== c - 1 || h < Math.PI) && u.push(d, e, g);
        console.assert(65536 >= v.length);
        this.addAttribute("index", new THREE.BufferAttribute(new Uint16Array(u), 1));
        this.addAttribute("position", new THREE.BufferAttribute(new Float32Array(v), 3));
        this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(w), 3));
        this.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(y), 2));
    };
    THREE.SphereBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
    THREE.SphereBufferGeometry.prototype.constructor = THREE.SphereBufferGeometry;

  THREE.CylinderBufferGeometry = function (a, b, c, d, e, f, g, h) {
      function l(c) {
          var e,
              f = new THREE.Vector2(),
              l = new THREE.Vector3(),
              u = !0 === c ? a : b,
              w = !0 === c ? 1 : -1;
          var L = q;
          for (e = 1; e <= d; e++) n.push(0, v * w, 0), p.push(0, w, 0), r.push(0.5, 0.5), q++;
          var C = q;
          for (e = 0; e <= d; e++) {
              var J = (e / d) * h + g,
                  F = Math.cos(J);
              J = Math.sin(J);
              l.x = u * J;
              l.y = v * w;
              l.z = u * F;
              n.push(l.x, l.y, l.z);
              p.push(0, w, 0);
              f.x = 0.5 * F + 0.5;
              f.y = 0.5 * J * w + 0.5;
              r.push(f.x, f.y);
              q++;
          }
          for (e = 0; e < d; e++) (f = L + e), (l = C + e), !0 === c ? m.push(l, l + 1, f) : m.push(l + 1, l, f);
      }
      THREE.BufferGeometry.call(this);
      this.parameters = { radiusTop: a, radiusBottom: b, height: c, radialSegments: d, heightSegments: e, openEnded: f, thetaStart: g, thetaLength: h };
      a = void 0 !== a ? a : 20;
      b = void 0 !== b ? b : 20;
      c = void 0 !== c ? c : 100;
      d = Math.floor(d) || 8;
      e = Math.floor(e) || 1;
      f = void 0 !== f ? f : !1;
      g = void 0 !== g ? g : 0;
      h = void 0 !== h ? h : 2 * Math.PI;
      var m = [],
          n = [],
          p = [],
          r = [],
          q = 0,
          u = [],
          v = c / 2;
      (function () {
          var f,
              l,
              z = new THREE.Vector3(),
              x = new THREE.Vector3(),
              A = (b - a) / c;
          for (l = 0; l <= e; l++) {
              var B = [],
                  L = l / e,
                  C = L * (b - a) + a;
              for (f = 0; f <= d; f++) {
                  var J = f / d,
                      F = J * h + g,
                      I = Math.sin(F);
                  F = Math.cos(F);
                  x.x = C * I;
                  x.y = -L * c + v;
                  x.z = C * F;
                  n.push(x.x, x.y, x.z);
                  z.set(I, A, F).normalize();
                  p.push(z.x, z.y, z.z);
                  r.push(J, 1 - L);
                  B.push(q++);
              }
              u.push(B);
          }
          for (f = 0; f < d; f++) for (l = 0; l < e; l++) (z = u[l + 1][f]), (x = u[l + 1][f + 1]), (A = u[l][f + 1]), m.push(u[l][f], z, A), m.push(z, x, A);
      })();
      !1 === f && (0 < a && l(!0), 0 < b && l(!1));
      console.assert(65536 >= n.length);
      this.addAttribute("index", new THREE.BufferAttribute(new Uint16Array(m), 1));
      this.addAttribute("position", new THREE.BufferAttribute(new Float32Array(n), 3));
      this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(p), 3));
      this.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(r), 2));
  };
  THREE.CylinderBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  THREE.CylinderBufferGeometry.prototype.constructor = THREE.CylinderBufferGeometry;
  THREE.TorusBufferGeometry = function (a, b, c, d, e) {
      THREE.BufferGeometry.call(this);
      this.parameters = { radius: a, tube: b, radialSegments: c, tubularSegments: d, arc: e };
      a = a || 1;
      b = b || 0.4;
      c = Math.floor(c) || 8;
      d = Math.floor(d) || 6;
      e = e || 2 * Math.PI;
      var f = [],
          g = [],
          h = [],
          l = [],
          m = new THREE.Vector3(),
          n = new THREE.Vector3(),
          p = new THREE.Vector3(),
          r,
          q;
      for (r = 0; r <= c; r++)
          for (q = 0; q <= d; q++) {
              var u = (q / d) * e,
                  v = (r / c) * Math.PI * 2;
              n.x = (a + b * Math.cos(v)) * Math.cos(u);
              n.y = (a + b * Math.cos(v)) * Math.sin(u);
              n.z = b * Math.sin(v);
              g.push(n.x, n.y, n.z);
              m.x = a * Math.cos(u);
              m.y = a * Math.sin(u);
              p.subVectors(n, m).normalize();
              h.push(p.x, p.y, p.z);
              l.push(q / d);
              l.push(r / c);
          }
      for (r = 1; r <= c; r++) for (q = 1; q <= d; q++) (a = (d + 1) * (r - 1) + q - 1), (b = (d + 1) * (r - 1) + q), (e = (d + 1) * r + q), f.push((d + 1) * r + q - 1, a, e), f.push(a, b, e);
      console.assert(65536 >= g.length);
      this.addAttribute("index", new THREE.BufferAttribute(new Uint16Array(f), 1));
      this.addAttribute("position", new THREE.BufferAttribute(new Float32Array(g), 3));
      this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(h), 3));
      this.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(l), 2));
  };
  THREE.TorusBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  THREE.TorusBufferGeometry.prototype.constructor = THREE.TorusBufferGeometry;
  function ba(a) {
      var b = {};
      a &&
          a
              .substring(1)
              .split("&")
              .forEach(function (a) {
                  var c = a.indexOf("=");
                  0 <= c ? (b[a.substring(0, c)] = a.substring(c + 1)) : (b[a] = void 0);
              });
      return b;
  }
  function da(a) {
      return a in ba(window.location.hash);
  }

  window.WALK = {
      EDIT_MODE: "editor" in ba(window.location.search),
      NO_SCREENSHOTS: da("noscreenshots"),
      DEBUG: da("debug"),
      DEBUG_SHARED_BUFFERS: da("debugbuffers"),
      DEBUG_CAMERA_PATH: da("debugcamerapath"),
      DEBUG_GEOMETRY_MERGING: da("debugmerge"),
      ALWAYS_RENDER: da("alwaysrender"),
      LOG_INFO: da("log") || da("savelog"),
      LOG_TO_SERVER: da("savelog"),
      LOG_TIME: !1,
      PROGRESSIVE_LOADER_AFTER_SEC: 30,
      CONTEXT_LOST_RESTORE_LIMIT: 4,
      HEAD_LIGHT: !1,
      RETRIES_ON_LOAD_ERROR: 3,
      DEFAULT_ANISOTROPY: 4,
      NO_ANISOTROPY: 1,
      FORCE_FXAA: !1,
      FORCE_WEBGL1: da("webgl1"),
      FONT_FAMILIES_TO_LOAD: [],
      MAX_TWO_POINTERS_IN_LINE_DIFF: 40,
      CAMERA_WALK_NEAR: 0.01,
      CAMERA_ORBIT_NEAR_FROM_1M: 0.01,
      CAMERA_MIN_FAR: 100,
      SKY_DISTANCE_TO_SCENE: 100,
      CAMERA_DEFAULT_FOV: 70,
      CAMERA_DEFAULT_MOVE_MAX_SPEED: 1.11,
      CAMERA_MOVE_MAX_SPEED_SHIFT_FACTOR: 2,
      CAMERA_LOOK_SPEED: Math.PI / 1500,
      CAMERA_LOOK_SMOOTHING: 0.1,
      CAMERA_ARROWS_TURN_SPEED: Math.PI / 2,
      CAMERA_SCROLL_SPEED: 0.5,
      CAMERA_FULL_ACCELERATION_TIME: 0.5,
      CAMERA_FULL_DECELERATION_TIME: 0.166,
      CAMERA_MAX_PER_FRAME_LINEAR_DISTANCE: 1,
      CAMERA_FIXED_HEIGHT: null,
      MAX_GROUND_SEARCH_DEPTH: 5.5,
      MATERIAL_PICKER_BALL_MAX_SIZE: 0.1,
      COVER_JSON_URL: "./cover.json",
      AUTO_TOUR_IN_VIEW_STILL_TIME_MS: 3e3,
      CLICK_MOVE_MIN_DISTANCE_TO_OBSTACLE: 0.7,
      CLICK_MOVE_SHOW_TARGET_INDICATOR: !da("nomovetarget"),
      KEY_MOVE_MIN_DISTANCE_TO_OBSTACLE: 0.1,
      MIN_DISTANCE_TO_CEILING: 0.1,
      LIGHT_PROBE_MIRROR_SIZE: 512,
      LIGHT_PROBE_MAX_MIP_SIZE: 128,
      LIGHT_PROBE_MIN_MIP_SIZE: 4,
      LIGHT_PROBE_GLOSS_FOR_MIP: [0.99, 0.9, 0.85, 0.7, 0.4, 0.25],
      DEBUG_LIGHT_PROBE_MIPS: !1,
      ENABLE_AUTO_EXPOSURE_CONTROLS: !1,
      EDITOR_COVER_WIDTH: 1920,
      EDITOR_COVER_HEIGHT: 1080,
      MAX_PANORAMA_SIZE: 8192,
      OBJECT_VISIBILITY_TARGET_SIZE: 128,
      DEFAULT_SKY_NAME: "default",
      EDITOR_CONTROLLED_SKY_NAME: "sky0",
      EDITOR_SELECTION_COLOR: new THREE.Color(5021401).convertGammaToLinear(),
      ALLOW_MOBILE_VR: !0,
      FALLBACK_CAMERA_HEIGHT: 1.6,
      LOAD_PRIORITY: { CORE_RESOURCE: 0, COLORMAP: 1, UV0: 1, DIFFUSE: 2, LIGHTMAP: 3, SKY: 4, SPECULARITY: 5, VIDEO: 6 },
      MERGE_TRANSPARENT_DISABLED: da("nomergetransparent"),
      urlHashContains: da,
      urlHashGetArgument: function (a) {
          var b = ba(window.location.hash);
          return a in b && void 0 !== b[a] ? decodeURI(b[a]) : null;
      },
      urlHashRemoveArgument: function (a) {
          var b = ba(window.location.hash);
          return Object.keys(b)
              .filter(function (b) {
                  return b !== a;
              })
              .map(function (a) {
                  var c = b[a];
                  return a + (void 0 === c ? "" : "=" + c);
              })
              .join("&");
      },
      TELEPORT_TO_VIEW_MAX_TIME: 3,
      TELEPORT_TO_POINT_MAX_TIME: 4.5,
      TELEPORT_PATH_MAX_TIME: 6,
      TELEPORT_TO_VIEW_ACCELERATION: 4,
      TELEPORT_TO_POINT_ACCELERATION: 2,
      TELEPORT_PATH_ACCELERATION: 2,
      GAZE_POINTER_SHOW_LOADING_AFTER_S: 2.5,
      GAZE_POINTER_ACTIVATE_AFTER_S: 4.5,
      SPRITE_ANCHOR_FONT_SIZE: 128,
      POINTER_PRIORITY: { TRANSFORM_CONTROLS: 1, EDITOR_SELECTOR: 2, INTERACTION_DISPATCHER: 3 },
      AVATAR_COLORS: "#f44336 #e81e63 #9c27b0 #673ab7 #3f51b5 #2196f3 #03a9f4 #00bcd4 #009688 #4caf50 #8bc34a #cddc39 #ffeb3b #ffc107 #ff9800 #ff5722 #795548 #9e9e9e #607d8b #ff5084".split(" "),
      STRINGS: {},
      DEFAULT_LANGUAGE: "English",
      ENABLE_MINIMAP: !0,
      FLIP_MOUSE: da("flipmouse"),
      AUTO_PLAY: da("autoplay"),
      HIDE_PLAY: da("hideplay"),
      SHOW_HELP_ON_LOAD: da("help"),
      GAZE_IN_POINTER_LOCK: da("gazeinpointerlock"),
      NO_GAZE_TELEPORT: da("nogazeteleport"),
      VR_LO: da("vrlo"),
      VR_HI: da("vrhi"),
      MOBILE_HI: da("mobilehi"),
      NO_BASIS: da("nobasis"),
      NO_WEBP: da("nowebp"),
  };
  window.WebXRConfig = {
      cardboardConfig: {
          ADDITIONAL_VIEWERS: [],
          DEFAULT_VIEWER: "",
          MOBILE_WAKE_LOCK: !0,
          DEBUG: !1,
          DPDB_URL: null,
          CARDBOARD_UI_DISABLED: !1,
          K_FILTER: 0.98,
          ROTATE_INSTRUCTIONS_DISABLED: !1,
          PREDICTION_TIME_S: 0.04,
          YAW_ONLY: !1,
          BUFFER_SCALE: 1,
          DIRTY_SUBMIT_FRAME_BINDINGS: !1,
      },
  };
  window.GLC = {
      REPEAT: 10497,
      CLAMP_TO_EDGE: 33071,
      MIRRORED_REPEAT: 33648,
      NEAREST: 9728,
      LINEAR: 9729,
      NEAREST_MIPMAP_NEAREST: 9984,
      LINEAR_MIPMAP_NEAREST: 9985,
      NEAREST_MIPMAP_LINEAR: 9986,
      LINEAR_MIPMAP_LINEAR: 9987,
      BYTE: 5120,
      UNSIGNED_BYTE: 5121,
      SHORT: 5122,
      UNSIGNED_SHORT: 5123,
      INT: 5124,
      UNSIGNED_INT: 5125,
      FLOAT: 5126,
      UNSIGNED_SHORT_4_4_4_4: 32819,
      UNSIGNED_SHORT_5_5_5_1: 32820,
      UNSIGNED_SHORT_5_6_5: 33635,
      DEPTH_COMPONENT: 6402,
      ALPHA: 6406,
      RGB: 6407,
      RGBA: 6408,
      LUMINANCE: 6409,
      LUMINANCE_ALPHA: 6410,
      FUNC_ADD: 32774,
      FUNC_SUBTRACT: 32778,
      FUNC_REVERSE_SUBTRACT: 32779,
      ZERO: 0,
      ONE: 1,
      SRC_COLOR: 768,
      ONE_MINUS_SRC_COLOR: 769,
      SRC_ALPHA: 770,
      ONE_MINUS_SRC_ALPHA: 771,
      DST_ALPHA: 772,
      ONE_MINUS_DST_ALPHA: 773,
      DST_COLOR: 774,
      ONE_MINUS_DST_COLOR: 775,
      SRC_ALPHA_SATURATE: 776,
      CONSTANT_COLOR: 32769,
      ONE_MINUS_CONSTANT_COLOR: 32770,
      CONSTANT_ALPHA: 32771,
      ONE_MINUS_CONSTANT_ALPHA: 32772,
      HALF_FLOAT_OES: 36193,
      COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
      COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
      COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
      COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
      COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
      COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
      COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
      COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
      COMPRESSED_RGB_ETC1_WEBGL: 36196,
      COMPRESSED_RGBA_ASTC_4x4_KHR: 37808,
  }; /*
Copyright (C) 2014-present Actif3D
*/
  var ja = 2 * Math.PI;
  WALK.defer = function (a) {
      setTimeout(a, 0);
  };
  function na(a, b, c) {
      return function () {
          a !== b.length && (c(b[a]), WALK.defer(na(a + 1, b, c)));
      };
  }
  WALK.iterateAsync = function (a, b) {
      WALK.defer(na(0, a, b));
  };
  WALK.find = function (a, b) {
      for (var c = 0; c < a.length; c += 1) {
          var d = a[c];
          if (b(d)) return d;
      }
  };
  WALK.filter = function (a, b) {
      for (var c = a.length, d = [], e = 0; e < c; e += 1) b(a[e]) && d.push(a[e]);
      return d;
  };
  WALK.indexOfMax = function (a, b) {
      if (0 === a.length) return null;
      for (var c = 0, d = b ? b(a[0]) : a[0], e = 1; e < a.length; e += 1) {
          var f = b ? b(a[e]) : a[e];
          f > d && ((c = e), (d = f));
      }
      return c;
  };
  WALK.any = function (a, b) {
      for (var c = a.length, d = 0; d < c; d += 1) if (b(a[d])) return !0;
      return !1;
  };
  WALK.removeFromArray = function (a, b) {
      a = b.indexOf(a);
      console.assert(-1 !== a);
      return b.splice(a, 1);
  };
  WALK.shiftItem = function (a, b, c) {
      var d = a.indexOf(b);
      b = a[d];
      for (var e = c > d ? 1 : -1; d !== c; d += e) a[d] = a[d + e];
      a[c] = b;
  };
  WALK.copyProperties = function (a, b, c) {
      for (var d = 0; d < b.length; d += 1) {
          var e = b[d],
              f = a[e];
          void 0 !== f && (c[e] = f);
      }
  };
  WALK.normalizeRotation = function (a) {
      a %= ja;
      return a > Math.PI ? -ja + a : a < -Math.PI ? ja + a : a;
  };
  WALK.yawRotationToPoint = function (a, b) {
      return Math.atan2(-(b.x - a.x), b.y - a.y);
  };
  WALK.setTextContent = function (a, b) {
      void 0 !== a.textContent ? (a.textContent = b) : void 0 !== a.innerText ? (a.innerText = b) : console.warn("textContent and innerText properties are missing");
  };
  WALK.log2 = function (a) {
      return Math.log(a) / Math.log(2);
  };
  WALK.mipsCount = function (a, b) {
      return WALK.log2(b) - WALK.log2(a) + 1;
  };
  WALK.LIGHT_PROBE_MIPS_COUNT = WALK.mipsCount(WALK.LIGHT_PROBE_MIN_MIP_SIZE, WALK.LIGHT_PROBE_MAX_MIP_SIZE);
  WALK.isModifierPressed = function (a) {
      return a.ctrlKey || a.altKey || a.metaKey;
  };
  WALK.round = function (a, b) {
      void 0 === b && (b = 3);
      return +(Math.round(a + "e+" + b) + "e-" + b);
  };
  WALK.preloadImage = function (a) {
      var b = new Image();
      b.src = a;
      return b;
  };
  WALK.onVideoDataReady = function (a, b) {
      function c() {
          a.readyState >= a.HAVE_CURRENT_DATA && (a.removeEventListener("playing", c), a.removeEventListener("timeupdate", c), b(a));
      }
      a.readyState >= a.HAVE_CURRENT_DATA ? b(a) : (a.addEventListener("playing", c), a.addEventListener("timeupdate", c));
  };
  WALK.cloneObject = function (a) {
      return JSON.parse(JSON.stringify(a));
  };
  WALK.readOnlyCopy = function (a) {
      return "object" === typeof a ? Object.freeze(WALK.cloneObject(a)) : a;
  };
  WALK.deepEqual = function (a, b) {
      if (a === b) return !0;
      if ("object" !== typeof a || null === a || "object" !== typeof b || null === b || Object.keys(a).length !== Object.keys(b).length) return !1;
      for (var c = _.makeIterator(Object.keys(a)), d = c.next(); !d.done; d = c.next()) if (((d = d.value), !b.hasOwnProperty(d) || !WALK.deepEqual(a[d], b[d]))) return !1;
      return !0;
  };
  WALK.executableOnlyOnce = function (a) {
      var b = !1,
          c;
      return function () {
          if (b) return c;
          c = a();
          a = null;
          b = !0;
          return c;
      };
  };
  WALK.preventClosureCompilerDeadCodeRemoval = function (a) {
      WALK.preventClosureCompilerDeadCodeRemoval[" "](a);
      return a;
  };
  WALK.preventClosureCompilerDeadCodeRemoval[" "] = function () {
      return null;
  };
  WALK.ICONS = {};
  function ta(a, b, c) {
      WALK.ICONS[a] = { name: a, value: b, fontFamily: c };
  }
  function ua(a, b) {
      ta(a, b, "FontAwesomeSolid");
  }
  function xa(a, b) {
      ta(a, b, "FontAwesomeRegular");
  }
  function ya(a, b) {
      ta(a, b, "FontAwesomeBrands");
  }
  ua("address-book", "\uf2b9");
  ua("address-card", "\uf2bb");
  ua("area-chart", "\uf1fe");
  ua("arrows", "\uf0b2");
  ua("arrow-up", "\uf062");
  ua("arrow-down", "\uf063");
  ua("assistive-listening-systems", "\uf2a2");
  ua("asterisk", "\uf069");
  ua("audio-description", "\uf29e");
  ua("at", "\uf1fa");
  ua("bars", "\uf0c9");
  ua("bell", "\uf0f3");
  ua("book", "\uf02d");
  ua("bookmark", "\uf02e");
  ua("bullhorn", "\uf0a1");
  ua("calculator", "\uf1ec");
  ua("camera", "\uf030");
  ua("chart-bar", "\uf080");
  ua("chart-pie", "\uf200");
  ua("chevron-up", "\uf077");
  ua("chevron-down", "\uf078");
  ua("cloud", "\uf0c2");
  ua("cog", "\uf013");
  ua("comment", "\uf075");
  xa("compass", "\uf14e");
  xa("credit-card", "\uf09d");
  ua("crosshairs", "\uf05b");
  ua("desktop", "\uf108");
  ua("download", "\uf019");
  ua("envelope", "\uf0e0");
  ua("expand", "\uf424");
  ua("external-link", "\uf35d");
  xa("eye", "\uf06e");
  ua("eye-dropper", "\uf1fb");
  ua("film", "\uf008");
  ua("flag", "\uf024");
  ua("folder", "\uf07b");
  ua("gift", "\uf06b");
  ua("headphones", "\uf025");
  ua("highlighter", "\uf591");
  ua("home", "\uf015");
  xa("image", "\uf03e");
  ua("sign-in", "\uf2f6");
  ua("info", "\uf129");
  xa("lightbulb", "\uf0eb");
  ua("magic", "\uf0d0");
  ua("magnet", "\uf076");
  ua("map-marker", "\uf3c5");
  ua("map-pin", "\uf276");
  ua("map-signs", "\uf277");
  ua("paint-brush", "\uf1fc");
  ua("pencil", "\uf303");
  ua("pen", "\uf304");
  ua("phone", "\uf095");
  ua("question", "\uf128");
  ua("search", "\uf002");
  ua("share", "\uf064");
  ua("share-alt", "\uf1e0");
  ua("shopping-cart", "\uf07a");
  ua("sliders", "\uf1de");
  ua("star", "\uf005");
  xa("sticky-note", "\uf249");
  ua("sync", "\uf2f1");
  xa("edit", "\uf044");
  ua("tachometer", "\uf3fd");
  ua("tag", "\uf02b");
  ua("video", "\uf03d");
  ua("wrench", "\uf0ad");
  ua("palette", "\uf53f");
  ua("paint-roller", "\uf5aa");
  ua("play", "\uf04b");
  ua("pause", "\uf04c");
  ua("plus", "\uf067");
  ya("youtube", "\uf167");
  ya("vimeo", "\uf40a");
  ya("facebook", "\uf09a");
  ya("twitter", "\uf099");
  ya("instagram", "\uf16d");
  ya("linkedin", "\uf08c");
  ya("skype", "\uf17e");
  ya("whatsapp", "\uf232");
  ya("facebook-messenger", "\uf39f");
  ya("telegram", "\uf2c6");
  ya("slack", "\uf198");
  var za = new (function () {
      this.hideInfo = function () {
          document.getElementById("info-message").style.display = "none";
      };
      this.info = function (a, b) {
          var c = document.getElementById("info-message");
          c.innerHTML = a;
          c.style.display = "";
          setTimeout(this.hideInfo, b || 15e3);
          console.info(a);
      };
      this.error = function (a) {
          var b = document.getElementById("error-message");
          b.innerHTML = a;
          b.style.display = "";
          console.error(a);
      };
  })();
  var Ba = !1,
      Ca = { NOT_NEEDED: 0, TEST_NEEDED: 1, NEEDED: 2 },
      Ha = new (function () {
          function a() {
              for (d += 1; d < b.length; d += 1) {
                  var a = b[d];
                  if (0 < a.length) {
                      for (var f = 0; f < a.length; f += 1) (c[d] += 1), WALK.defer(a[f]);
                      a.length = 0;
                      break;
                  }
              }
          }
          var b = [],
              c = [],
              d = Infinity;
          (function () {
              var a = 0,
                  d;
              for (d in WALK.LOAD_PRIORITY) WALK.LOAD_PRIORITY.hasOwnProperty(d) && (a = Math.max(a, WALK.LOAD_PRIORITY[d]));
              for (d = 0; d <= a; d += 1) (b[d] = []), (c[d] = 0);
          })();
          this.add = function (e, f) {
              e <= d ? ((c[e] += 1), (d = e), WALK.defer(f)) : (b[e].push(f), 0 === c[d] && a());
          };
          this.finished = function (b) {
              --c[b];
              var e = c[b];
              console.assert(0 <= e);
              b === d && 0 === e && a();
          };
      })();
  function Ia(a) {
      for (
          var b = _.makeIterator(
                  Object.entries({
                      "https://cdn0.shapespark.com/": "https://cdn0-jsbr.shapespark.com/",
                      "https://cdn0.dev.shapespark.com/": "https://cdn0-jsbr-dev.shapespark.com/",
                      "https://cdn0-shapespark-cn-dev.oss-accelerate.aliyuncs.com/": "https://cdn0-jsbr-cn-dev.shapespark.com.cn/",
                      "https://cdn0-shapespark-cn.oss-accelerate.aliyuncs.com/": "https://cdn0-jsbr.shapespark.com.cn/",
                      "https://cdncn0-shapespark.oss-accelerate.aliyuncs.com/": "https://cdncn0-jsbr.shapespark.com.cn/",
                  })
              ),
              c = b.next();
          !c.done;
          c = b.next()
      ) {
          var d = _.makeIterator(c.value);
          c = d.next().value;
          d = d.next().value;
          if (a.startsWith(c)) return a.replace(c, d);
      }
      return a;
  }
  var Ja = new (function () {
      function a(a) {
          a = new Int8Array(a);
          return new BrotliDecode(a).buffer;
      }
      function b(a) {
          h = a;
          for (var b = 0; b < f.length; b += 1) f[b](a);
          f = null;
      }
      function c(a) {
          l
              ? a()
              : (g.push(a),
                1 === g.length &&
                    WALK.loadScriptAndExecute(
                        WALK.getViewerAssetUrl("lib/brotli.min.js"),
                        function () {
                            l = !0;
                            for (var a = 0; a < g.length; a += 1) g[a]();
                            g = null;
                        },
                        function () {
                            return za.error("Cannot load required library");
                        }
                    ));
      }
      function d() {
          (200 <= m.status && 300 > m.status) || 0 === m.status ? b("SSSSSS" === m.responseText) : (console.error("br.buf response", m.status), b(!0));
      }
      function e(a) {
          void 0 !== h ? a(h) : (f.push(a), 1 === f.length && (m.addEventListener("load", d, !1), m.open("GET", WALK.getViewerAssetUrl("3dassets/br.buf"), !0), m.send()));
      }
      var f = [],
          g = [],
          h = void 0,
          l = !1,
          m = new XMLHttpRequest();
      this.decode = function (b, d, f) {
          d
              ? c(function () {
                    f(a(b));
                })
              : e(function (d) {
                    d
                        ? f(b)
                        : c(function () {
                              f(a(b));
                          });
                });
      };
  })();
  function Ka(a, b) {
      return function (c) {
          Ha.finished(a);
          b(c);
      };
  }
  function La(a) {
      this.method = a;
      this.binaryResult = !1;
      this.dataContentType = this.data = null;
      "GET" === a ? ((this.retriesLeft = WALK.RETRIES_ON_LOAD_ERROR), (this.retryDelayMs = 1e3 + 1e3 * Math.random())) : (this.retryDelayMs = this.retriesLeft = 0);
  }
  La.prototype = {
      constructor: La,
      retryScheduled: function () {
          console.assert(0 < this.retriesLeft);
          --this.retriesLeft;
          this.retryDelayMs *= 2;
      },
  };
  function Qa(a, b, c, d, e, f) {
      setTimeout(function () {
          Sa(a, b, c, d, e, f);
      }, b.retryDelayMs);
      b.retryScheduled();
  }
  function Sa(a, b, c, d, e, f) {
      function g(a, b) {
          var c =
              !0 !== WALK.DETECTOR.canForceBrotliBuffers
                  ? Ca.NOT_NEEDED
                  : 0 <= m.getAllResponseHeaders().toLowerCase().indexOf("js-content-encoding:")
                  ? Ca.NEEDED
                  : "br" === m.getResponseHeader("content-encoding")
                  ? Ca.TEST_NEEDED
                  : Ca.NOT_NEEDED;
          c === Ca.NOT_NEEDED ? b(a) : Ja.decode(a, c === Ca.NEEDED, b);
      }
      function h() {
          var g = m.status || 0;
          g = "GET" === b.method && (500 <= g || 0 === g) ? 0 !== b.retriesLeft : !1;
          console.warn("Failed to " + b.method + ": " + a + " (" + m.status + ")" + (g ? ", retrying in " + b.retryDelayMs / 1e3 + "s" : ""));
          if (g) f && !Ba && (console.warn("Switch to jsbr hosts."), (Ba = !0)), Qa(a, b, c, d, e, f);
          else if (void 0 !== d) {
              try {
                  var h = JSON.parse(m.responseText).message;
              } catch (r) {
                  h = void 0;
              }
              d(m.status, h);
          }
          b = m = null;
      }
      function l() {
          if (void 0 !== c)
              if (b.binaryResult) g(m.response, c);
              else {
                  var a = m.getResponseHeader("content-type"),
                      d = m.responseText;
                  d && -1 !== a.indexOf("text/plain")
                      ? g(d, c)
                      : d
                      ? g(d, function (a) {
                            c(JSON.parse(a));
                        })
                      : c();
              }
          b = m = null;
      }
      var m = new XMLHttpRequest();
      void 0 !== e && m.addEventListener("progress", e, !1);
      m.addEventListener(
          "load",
          function () {
              (200 <= m.status && 300 > m.status) || 0 === m.status ? l() : h();
          },
          !1
      );
      m.addEventListener("error", h, !1);
      m.addEventListener("abort", h, !1);
      f && Ba && (a = Ia(a));
      m.open(b.method, a, !0);
      b.binaryResult && (m.responseType = "arraybuffer");
      b.dataContentType && m.setRequestHeader("Content-Type", b.dataContentType);
      "POST" === b.method && m.setRequestHeader("X-Requested-By", "Shapespark");
      m.send(b.data);
  }
  WALK.ajaxGet = function (a, b, c, d, e, f) {
      var g = new La("GET");
      g.binaryResult = b;
      Sa(a, g, c, d, e, f);
  };
  WALK.queueAjaxGet = function (a, b, c, d, e, f, g) {
      g = void 0 === g ? !1 : g;
      Ha.add(a, function () {
          WALK.ajaxGet(b, c, Ka(a, d), Ka(a, e), f, g);
      });
  };
  WALK.ajaxPost = function (a, b, c, d, e, f) {
      var g = new La("POST");
      g.data = c;
      g.dataContentType = b;
      Sa(a, g, d, e, f);
  };
  function Ta(a, b, c, d, e) {
      function f() {
          a(b, c, d, e);
      }
      return function () {
          console.warn("Failed to get: " + b + (f ? ", retrying in " + c.retryDelayMs / 1e3 + "s" : ""));
          0 < c.retriesLeft ? (setTimeout(f, c.retryDelayMs), c.retryScheduled()) : e();
      };
  }
  function Ua(a, b, c, d) {
      var e = new Image();
      e.onload = function () {
          c(e);
          e = null;
      };
      e.onerror = Ta(Ua, a, b, c, d);
      e.crossOrigin = "anonymous";
      e.src = a;
  }
  WALK.queueImageGet = function (a, b, c, d) {
      Ha.add(a, function () {
          var e = new La("GET");
          Ua(b, e, Ka(a, c), Ka(a, d));
      });
  };
  function Va(a, b, c, d) {
      var e = document.createElement("video");
      e.autoplay = !0;
      e.muted = !0;
      e.loop = !0;
      e.setAttribute("playsinline", "");
      e.setAttribute("webkit-playsinline", "");
      e.crossOrigin = "anonymous";
      e.onerror = Ta(Va, a, b, c, d);
      WALK.onVideoDataReady(e, function () {
          e.onerror = void 0;
          c(e);
          e = null;
      });
      e.src = a;
      e.play().catch(function () {});
  }
  WALK.queueVideoGet = function (a, b, c, d) {
      Ha.add(a, function () {
          var e = new La("GET");
          Va(b, e, Ka(a, c), Ka(a, d));
      });
  };
  WALK.loadScriptAndExecute = (function () {
      function a(a) {
          c.add(a);
          var b = d.get(a);
          d.delete(a);
          b.forEach(function (a) {
              try {
                  (0, a.onSuccess)();
              } catch (h) {
                  console.log(h);
              }
          });
      }
      function b(a) {
          var b = d.get(a);
          d.delete(a);
          console.error("Can't load script : " + a);
          b.forEach(function (b) {
              if (void 0 !== b.onError) {
                  b = b.onError.bind(null, a);
                  try {
                      b();
                  } catch (h) {
                      console.log(h);
                  }
              }
          });
      }
      var c = new Set(),
          d = new Map();
      return function (e, f, g) {
          if (c.has(e)) f();
          else if (d.has(e)) d.get(e).push({ onSuccess: f, onError: g });
          else {
              d.set(e, [{ onSuccess: f, onError: g }]);
              f = a.bind(this, e);
              g = b.bind(this, e);
              var h = document.createElement("script");
              h.onload = f;
              h.onerror = g;
              h.src = e;
              h.type = "text/javascript";
              h.crossOrigin = "anonymous";
              document.body.appendChild(h);
          }
      };
  })();
  WALK.loadScriptsUrlAndExecute = function (a, b, c) {
      function d(a) {
          return new Promise(function (b, c) {
              WALK.loadScriptAndExecute(a, b, c);
          });
      }
      a = a.map(function (a) {
          return d(a);
      });
      Promise.all(a)
          .then(b)
          .catch(function (a) {
              void 0 !== c && c(a);
          });
  };
  var Wa = [],
      $a = 0,
      ab = void 0,
      bb = 0;
  function cb(a, b) {
      for (a = a.toString(); a.length < b; ) a = "0" + a;
      return a;
  }
  function db() {
      0 !== bb && ((Wa[Wa.length - 1] += " [" + (bb + 1).toString() + " copies]"), (bb = 0));
  }
  function eb() {
      db();
      0 < $a && Wa.push("[truncated, removed lines " + $a.toString() + "]");
      WALK.ajaxPost("./logs", "application/json", JSON.stringify({ logs: Wa }));
      Wa.length = 0;
      ab = void 0;
      bb = $a = 0;
  }
  function fb(a) {
      var b = console[a].bind(console);
      console[a] = function () {
          for (var c = "", d = "", e = 0; e < arguments.length; ++e) d += (0 === e ? "" : " ") + arguments[e];
          WALK.LOG_TIME && ((c = new Date()), (c = cb(c.getHours(), 2) + ":" + cb(c.getMinutes(), 2) + ":" + cb(c.getSeconds(), 2) + "," + cb(c.getMilliseconds(), 3) + " "));
          e = c;
          var f = d;
          ab === f ? (bb += 1) : 499 <= Wa.length ? ($a += 1) : (db(), (ab = f), (e = e + a.toUpperCase() + " " + f), Wa.push(e), 1 == Wa.length && setTimeout(eb, 5e3));
          b(c + d);
      };
  }
  function gb() {
      window.onerror = function (a, b, c, d, e) {
          console.error("Error occured: " + a + " (" + b + "#" + c.toString() + ":" + d.toString() + "/" + e + ")");
          return !1;
      };
  }
  WALK.log = function () {};
  WALK.logInfoMessages = function () {
      WALK.log = function (a) {
          for (var b = [], c = 0; c < arguments.length; ++c) b[c - 0] = arguments[c];
          console.log.apply(console, _.arrayFromIterable(b));
      };
  };
  WALK.initLoggingToServer = function (a) {
      a && (fb("log"), fb("info"));
      fb("warn");
      fb("error");
      gb();
  };
  WALK.LOG_INFO && WALK.logInfoMessages();
  WALK.LOG_TO_SERVER &&
      WALK.initLoggingToServer(
          !0
      );

  function nb(a, b, c, d, e, f, g, h) {
      this.id = a;
      this.name = b;
      this.parentTexture = c;
      this.textureCropper = d;
      this.extractedTexture = this.stdExt = this.rawExt = null;
      this.uvOffsetScale = new THREE.Vector4(e, f, g, h);
      this.isCutout = !1;
      this.importAutoScale = this.importGpuCompress = !0;
  }
  nb.prototype = {
      addLoadedListener: function (a) {
          this.parentTexture.addLoadedListener(a);
      },
      extractTexture: function () {
          console.assert(null !== this.textureCropper);
          console.assert(null === this.extractedTexture);
          this.extractedTexture = this.textureCropper.cropTextureToPoTTarget(this.parentTexture, this.uvOffsetScale);
      },
      get hasAlpha() {
          return this.parentTexture.hasAlpha;
      },
      serialize: function () {
          return {
              id: this.id,
              name: this.name,
              atlasId: this.parentTexture.id,
              atlasOffset: [this.uvOffsetScale.x, this.uvOffsetScale.y],
              atlasScale: [this.uvOffsetScale.z, this.uvOffsetScale.w],
              rawExt: this.rawExt,
              stdExt: this.stdExt,
              webFormats: [],
              alpha: this.hasAlpha,
              importGpuCompress: this.importGpuCompress,
              importAutoScale: this.importAutoScale,
          };
      },
  };
  function ob(a, b, c, d, e, f, g, h) {
      this.webFormats = this.stdExt = this.rawExt = this.name = this.id = null;
      this.isCube = !1;
      this.image = a;
      this.height = this.width = null;
      this.mipmaps = [];
      this.wrapS = void 0 !== b ? b : GLC.CLAMP_TO_EDGE;
      this.wrapT = void 0 !== c ? c : GLC.CLAMP_TO_EDGE;
      this.magFilter = void 0 !== d ? d : GLC.LINEAR;
      this.minFilter = void 0 !== e ? e : GLC.LINEAR_MIPMAP_LINEAR;
      this.anisotropy = void 0 !== h ? h : 1;
      this.isRgbm = this.isCutout = this.hasAlpha = this.isAnimated = !1;
      this.format = void 0 !== f ? f : GLC.RGBA;
      this.type = void 0 !== g ? g : GLC.UNSIGNED_BYTE;
      this.generateMipmaps = !0;
      this.premultiplyAlpha = !1;
      this.flipY = !0;
      this.unpackAlignment = 4;
      this._textureCropper = this._atlasEntries = null;
      this._needsUpdate = !1;
      this.releaseOnLoadedToGpu = !0;
      this.loaded = !1;
      this._loadedListeners = [];
      this.__webglSlot = this.__webglTexture = null;
      this.importAutoScale = this.importGpuCompress = !0;
      this.passphrase = null;
  }
  ob.prototype = {
      constructor: ob,
      sleepAnimation: function () {
          console.assert(!1);
      },
      wakeAnimation: function () {
          console.assert(!1);
      },
      get needsUpdate() {
          return this._needsUpdate;
      },
      set needsUpdate(a) {
          this._needsUpdate = a;
      },
      isAtlas: function () {
          return null !== this._atlasEntries;
      },
      enableAtlas: function (a) {
          console.assert(!this.isAtlas());
          this._atlasEntries = {};
          this._textureCropper = a;
      },
      getAtlasEntry: function (a, b, c, d, e, f) {
          var g = this._atlasEntries[b];
          if (g) return g;
          console.assert(!this.loaded);
          g = new nb(a, b, this, this._textureCropper, c, d, e, f);
          return (this._atlasEntries[b] = g);
      },
      forEachAtlasEntry: function (a) {
          for (var b in this._atlasEntries) this._atlasEntries.hasOwnProperty(b) && a(this._atlasEntries[b]);
      },
      clone: function (a) {
          void 0 === a && (a = new ob());
          a.isCube = a.isCube;
          a.image = this.image;
          a.mipmaps = this.mipmaps.slice(0);
          a.wrapS = this.wrapS;
          a.wrapT = this.wrapT;
          a.magFilter = this.magFilter;
          a.minFilter = this.minFilter;
          a.anisotropy = this.anisotropy;
          a.isCutout = this.isCutout;
          a.isAnimated = this.isAnimated;
          a.hasAlpha = this.hasAlpha;
          a.format = this.format;
          a.type = this.type;
          a.generateMipmaps = this.generateMipmaps;
          a.premultiplyAlpha = this.premultiplyAlpha;
          a.flipY = this.flipY;
          a.unpackAlignment = this.unpackAlignment;
          a.passphrase = this.passphrase;
          return a;
      },
      serialize: function () {
          var a = { id: this.id, name: this.name, stdExt: this.stdExt, webFormats: this.webFormats, alpha: this.hasAlpha, importGpuCompress: this.importGpuCompress, importAutoScale: this.importAutoScale };
          this.passphrase && (a.passphrase = this.passphrase);
          this.rawExt && (a.rawExt = this.rawExt);
          this.isRgbm && (a.rgbm = !0);
          return a;
      },
      dispose: function () {
          this._loadedListeners = [];
          this.dispatchEvent({ type: "dispose" });
      },
      addLoadedListener: function (a) {
          this.loaded ? a() : this._loadedListeners.push(a);
      },
      notifyLoaded: function () {
          this.loaded = !0;
          for (var a = this._loadedListeners, b = 0; b < a.length; b += 1) a[b]();
          a.length = 0;
      },
  };
  THREE.EventDispatcher.prototype.apply(ob.prototype);
  function pb(a, b, c, d, e, f, g, h, l, m) {
      ob.call(this, null, f, g, h, l, d, e, m);
      this.image = { width: b, height: c };
      this.mipmaps = a;
      this.generateMipmaps = this.flipY = !1;
  }
  pb.prototype = Object.create(ob.prototype);
  pb.prototype.constructor = pb;
  pb.prototype.clone = function () {
      var a = new pb();
      ob.prototype.clone.call(this, a);
      return a;
  };
  function qb(a, b, c, d, e, f, g, h, l, m) {
      ob.call(this, null, f, g, h, l, d, e, m);
      this.image = { data: a, width: b, height: c };
  }
  qb.prototype = Object.create(ob.prototype);
  qb.prototype.constructor = qb;
  qb.prototype.clone = function () {
      var a = new qb();
      ob.prototype.clone.call(this, a);
      return a;
  };
  function rb(a, b, c, d, e, f, g, h, l) {
      var m = this;
      ob.call(this, a, b, c, d, e, f, g, h, l);
      this.generateMipmaps = !1;
      this.isAnimated = !0;
      this.releaseOnLoadedToGpu = !1;
      this._isPlaying = !0;
      this._pauseRequested = this._isSleeping = !1;
      this._videoSrc = null;
      this._pausedTime = 0;
      this._interruptible = !0;
      this._resizedListeners = [];
      this._handlePaused = function () {
          m._pauseRequested ? (m._pauseRequested = !1) : (m._isSleeping = !0);
          !m._isPlaying && m._interruptible && (m.video.src = "");
      };
      this._handleEnded = function () {
          m._isPlaying = !1;
          m._isSleeping = !1;
      };
      this._notifyResized = function () {
          m.width = m.video.videoWidth;
          m.height = m.video.videoHeight;
          for (var a = 0; a < m._resizedListeners.length; a += 1) m._resizedListeners[a]();
      };
  }
  rb.prototype = Object.create(ob.prototype);
  rb.prototype.constructor = rb;
  rb.prototype._srcAtPausedPosition = function () {
      return this._videoSrc + "#t=" + this._pausedTime;
  };
  rb.prototype._pauseVideo = function () {
      this._pausedTime = this.video.currentTime;
      this.video.pause();
  };
  rb.prototype.rewind = function () {
      this._pausedTime = 0;
      this.video.currentTime = 0;
  };
  Object.defineProperty(rb.prototype, "video", {
      get: function () {
          return this.image;
      },
      set: function (a) {
          console.assert(void 0 === this.image, "Video already attached to texture.");
          this.image = a;
          this._videoSrc = a.src;
          this._isPlaying = !a.paused && !a.ended;
          a.addEventListener("pause", this._handlePaused);
          a.addEventListener("ended", this._handleEnded);
          a.addEventListener("resize", this._notifyResized);
          this._isSleeping && this._isPlaying && this._pauseVideo();
      },
  });
  Object.defineProperty(rb.prototype, "muted", {
      get: function () {
          return this.video.muted;
      },
      set: function (a) {
          this.video.muted = a;
      },
  });
  Object.defineProperty(rb.prototype, "loop", {
      get: function () {
          return this.video.loop;
      },
      set: function (a) {
          this.video.loop = a;
      },
  });
  Object.defineProperty(rb.prototype, "isPlaying", {
      get: function () {
          return !this._isSleeping && this._isPlaying;
      },
  });
  rb.prototype.play = function () {
      var a = this;
      if (!this._isPlaying)
          if (this._isSleeping) this._isPlaying = !0;
          else {
              var b = this.video;
              this._interruptible && (b.src = this._srcAtPausedPosition());
              var c = b.play();
              c
                  ? ((this._isPlaying = !0),
                    c.catch(function (b) {
                        console.log("Can't play video texture: " + b);
                        a._isPlaying = !1;
                    }))
                  : (this._isPlaying = !b.paused && !b.ended);
          }
  };
  rb.prototype.pause = function () {
      this._isPlaying && this.video && ((this._isPlaying = !1), this._isSleeping || ((this._pauseRequested = !0), this._pauseVideo()));
  };
  rb.prototype.sleepAnimation = function () {
      this._isSleeping || (this._isPlaying && this.video && this._pauseVideo(), (this._isSleeping = !0));
  };
  rb.prototype.wakeAnimation = function () {
      this._isSleeping && (this._isPlaying && this.video && (this._interruptible && (this.video.src = this._srcAtPausedPosition()), this.video.play()), (this._isSleeping = !1));
  };
  rb.prototype.dispose = function () {
      ob.prototype.dispose.call(this);
      this._isPlaying && this.pause();
      var a = this.video;
      this.image = null;
      this._videoSrc = "";
      this._isPlaying = !1;
      a.src = "";
      a.removeEventListener("pause", this._handlePaused);
      a.removeEventListener("ended", this._handleEnded);
      a.removeEventListener("resize", this._notifyResized);
      this._resizedListeners.length = 0;
  };
  rb.prototype.addResizedListener = function (a) {
      this._resizedListeners.push(a);
  };
  rb.prototype.serialize = function () {
      var a = ob.prototype.serialize.call(this);
      a.video = !0;
      return a;
  };
  Object.defineProperty(rb.prototype, "needsUpdate", {
      get: function () {
          return this._needsUpdate || (this.isPlaying && this.video && !0 !== this.video.seeking && this.video.readyState >= this.video.HAVE_CURRENT_DATA);
      },
      set: function (a) {
          this._needsUpdate = a;
      },
  });
  function sb(a, b, c) {
      this.y = this.x = 0;
      this.width = a;
      this.height = b;
      c = c || {};
      this.wrapS = void 0 !== c.wrapS ? c.wrapS : GLC.CLAMP_TO_EDGE;
      this.wrapT = void 0 !== c.wrapT ? c.wrapT : GLC.CLAMP_TO_EDGE;
      this.magFilter = void 0 !== c.magFilter ? c.magFilter : GLC.LINEAR;
      this.minFilter = void 0 !== c.minFilter ? c.minFilter : GLC.LINEAR_MIPMAP_LINEAR;
      this.anisotropy = void 0 !== c.anisotropy ? c.anisotropy : 1;
      this.offset = new THREE.Vector2(0, 0);
      this.repeat = new THREE.Vector2(1, 1);
      this.format = void 0 !== c.format ? c.format : GLC.RGBA;
      this.type = void 0 !== c.type ? c.type : GLC.UNSIGNED_BYTE;
      this.depthBuffer = void 0 !== c.depthBuffer ? c.depthBuffer : !0;
      this.stencilBuffer = void 0 !== c.stencilBuffer ? c.stencilBuffer : !0;
      this.generateMipmaps = c.generateMipmaps || !1;
      this.shareDepthFrom = void 0 !== c.shareDepthFrom ? c.shareDepthFrom : null;
      this.isCube = !1;
      this.loaded = !0;
      this.__webglSlot = this.__webglTexture = this.__webglRenderbuffer = this.__webglFramebuffer = null;
  }
  sb.prototype = {
      constructor: sb,
      dispose: function () {
          this.dispatchEvent({ type: "dispose" });
      },
  };
  THREE.EventDispatcher.prototype.apply(sb.prototype);
  function tb(a) {
      this.__webglFramebuffer = a;
      this.height = this.width = this.y = this.x = null;
      this.isCube = !1;
  }
  tb.prototype = {
      constructor: tb,
      dispose: function () {
          this.__webglFramebuffer = null;
          this.dispatchEvent({ type: "dispose" });
      },
  };
  THREE.EventDispatcher.prototype.apply(tb.prototype);
  function ub(a, b, c) {
      sb.call(this, a, b, c);
      this.activeCubeFace = 0;
      this.isCube = !0;
      this.__webglFramebuffer = [];
      this.__webglRenderbuffer = [];
  }
  ub.prototype = Object.create(sb.prototype);
  ub.prototype.constructor = ub;
  var wb = WALK.DEBUG;
  function yb(a) {
      var b = { format: GLC.RGBA, magFilter: GLC.NEAREST, minFilter: GLC.NEAREST, stencilBuffer: !1, depthBuffer: !1, generateMipmaps: !1 },
          c = [a.createRenderTarget(1024, 1024, b), a.createRenderTarget(512, 512, b)];
      b = {
          uniforms: { map: { type: "t", value: null }, mapUvStep: { type: "v2", value: null }, mapUvOffsetScale: { type: "v4", value: null } },
          vertexShader: WALK.getShader("alpha_stats_vertex.glsl"),
          fragmentShader: WALK.getShader("alpha_stats_fragment.glsl"),
      };
      var d = new THREE.ShaderPass(b, "map");
      d.material.depthTest = !1;
      d.material.depthWrite = !1;
      var e = new THREE.Vector2(),
          f = new THREE.Vector4();
      d.uniforms.mapUvStep.value = e;
      d.uniforms.mapUvOffsetScale.value = f;
      b = {
          uniforms: { map: { type: "t", value: null }, mapUvStep: { type: "v2", value: null }, mapUvScale: { type: "v2", value: null } },
          vertexShader: WALK.getShader("alpha_stats_vertex.glsl"),
          fragmentShader: WALK.getShader("alpha_stats_combine_fragment.glsl"),
      };
      var g = new THREE.ShaderPass(b, "map");
      g.material.depthTest = !1;
      g.material.depthWrite = !1;
      var h = new THREE.Vector2();
      g.uniforms.mapUvScale.value = h;
      g.uniforms.mapUvStep.value = e;
      var l = new Uint8Array(4096),
          m = null;
      wb && (m = new WALK.Timer());
      this.isCutoutTexture = function (b) {
          var n = void 0 !== b.parentTexture;
          if (n) {
              var r = b.parentTexture;
              var q = b.uvOffsetScale.x;
              var u = b.uvOffsetScale.y;
              var v = b.uvOffsetScale.z;
              var w = b.uvOffsetScale.w;
          } else (r = b), (q = u = 0), (v = w = 1);
          if (!r.hasAlpha || r.video) b.isCutout = !1;
          else {
              wb && m.reset();
              a.enableScissorTest(!0);
              var y = r.width * v,
                  z = r.height * w;
              e.set(1 / y, 1 / z);
              f.set(q, u, v, w);
              y = Math.max(Math.floor(y / 2), 1);
              z = Math.max(Math.floor(z / 2), 1);
              a.setRenderTarget(c[0]);
              a.setViewport(0, 0, y, z);
              a.setScissor(0, 0, y, z);
              d.render(a, c[0], r);
              for (var x = 1, A = c[0]; 1 !== y && 1 !== z; ) {
                  e.set(1 / A.width, 1 / A.height);
                  h.set(y / A.width, z / A.height);
                  y = Math.floor(y / 2);
                  z = Math.floor(z / 2);
                  var B = c[x];
                  a.setRenderTarget(B);
                  a.setViewport(0, 0, y, z);
                  a.setScissor(0, 0, y, z);
                  g.render(a, B, A);
                  A = B;
                  x = (x + 1) % 2;
              }
              a.readPixels(y, z, l);
              A = x = 0;
              y = Math.max(y, z);
              for (z = 0; z < y; ++z) (x += l[4 * z]), (A += l[4 * z + 1]);
              x = (100 * x) / (255 * y);
              A = (100 * A) / (255 * y);
              b.isCutout = 20 > x || 50 < A;
              wb &&
                  ((y = ""),
                  n && (y += "From atlas: " + r.name + " [" + q + ", " + u + ", " + v + ", " + w + "]\n"),
                  console.log(b.name + " " + r.width + "x" + r.height + "\n " + y + "Is cutout: " + b.isCutout + "\n Partialy transparent regions: " + x + "%\n Fully transparent pixels: " + A + "%\n Time: " + m.elapsedSec()));
              a.enableScissorTest(!1);
          }
      };
      this.dispose = function () {
          c[0].dispose();
          c[1].dispose();
          d.dispose();
          g.dispose();
      };
  }
  function zb(a) {
      var b = new THREE.ShaderPass(
          { uniforms: { srcTexture: { type: "t", value: null }, uvOffsetScale: { type: "v4", value: null } }, vertexShader: WALK.getShader("crop_texture_vertex.glsl"), fragmentShader: WALK.getShader("crop_texture_fragment.glsl") },
          "srcTexture"
      );
      b.material.depthTest = !1;
      b.material.depthWrite = !1;
      this.cropTextureToPoTTarget = function (c, d) {
          var e = THREE.Math.nextPowerOfTwo(d.z * c.width),
              f = THREE.Math.nextPowerOfTwo(d.w * c.height);
          e = a.createRenderTarget(e, f, {
              wrapS: GLC.REPEAT,
              wrapT: GLC.REPEAT,
              magFilter: GLC.LINEAR,
              minFilter: GLC.LINEAR_MIPMAP_LINEAR,
              format: GLC.RGBA,
              type: GLC.UNSIGNED_BYTE,
              depthBuffer: !1,
              stencilBuffer: !1,
              generateMipmaps: !0,
          });
          b.uniforms.uvOffsetScale.value = d;
          b.render(a, e, c);
          a.deallocateRenderTargetRenderingBuffers(e);
          return e;
      };
  }
  WALK.SHADERS = {};
  WALK.SHADERS["aabb_query_fragment.glsl"] =
      "//AUTO GENERATED\nvarIn vec3 vPositionW;\nuniform int axis;\nvec4 encodeFloat(in float x) {\nfloat xabs = abs(x);\nfloat r = floor(xabs);\nfloat g = fract(xabs);\nreturn vec4(r / 255.0, g, 0.0, 0.0);\n}\nvoid main() {\nvec3 viewW = cameraPosition - vPositionW;\nif (axis == 0) {\nfragColor = encodeFloat(viewW.x);\n} else if (axis == 1) {\nfragColor = encodeFloat(viewW.y);\n} else if (axis == 2) {\nfragColor = encodeFloat(viewW.z);\n}\n}\n";
  WALK.SHADERS["aabb_query_vertex.glsl"] =
      "//AUTO GENERATED\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\nvarOut vec3 vPositionW;\nvoid main() {\nvec4 transformedPosition = transformPosition();\nvPositionW = (modelMatrix * transformedPosition).xyz;\ngl_Position = projectionMatrix * modelViewMatrix * transformedPosition;\n}\n";
  WALK.SHADERS["accumulate_fragment.glsl"] =
      "//AUTO GENERATED\nuniform float weight;\nuniform sampler2D inputBuffer;\nvarIn vec2 vUv;\nvoid main() {\nvec3 inputColor = texture2D(inputBuffer, vUv).rgb;\nfragColor = vec4(inputColor, weight);\n}\n";
  WALK.SHADERS["accumulate_vertex.glsl"] = "//AUTO GENERATED\nvarOut vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["alpha_stats_combine_fragment.glsl"] =
      "//AUTO GENERATED\nuniform sampler2D map;\nuniform vec2 mapUvStep;\nuniform vec2 mapUvScale;\nvarIn vec2 vUv;\nvoid main() {\nvec2 corner = vUv * mapUvScale- mapUvStep;\nvec2 uv = corner + 0.5 * mapUvStep;\nvec4 p0 = texture2D(map, uv);\nvec4 p1 = texture2D(map, uv + vec2(0.0, mapUvStep.y));\nvec4 p2 = texture2D(map, uv + vec2(mapUvStep.x, 0.0));\nvec4 p3 = texture2D(map, uv + vec2(mapUvStep.x, mapUvStep.y));\nfragColor = vec4((p0.r + p1.r + p2.r + p3.r) / 4.0,\n(p0.g + p1.g + p2.g + p3.g) / 4.0, 0.0, 1.0);\nreturn;\n}\n";
  WALK.SHADERS["alpha_stats_fragment.glsl"] =
      "//AUTO GENERATED\nuniform sampler2D map;\nuniform vec2 mapUvStep;\nuniform vec4 mapUvOffsetScale;\nvarIn vec2 vUv;\nvoid main() {\nvec2 corner = vUv * mapUvOffsetScale.zw + mapUvOffsetScale.xy - mapUvStep;\nvec2 uv = corner + 0.5 * mapUvStep;\nconst float bias = -1.0;\nfloat a0 = texture2D(map, uv, bias).a;\nfloat a1 = texture2D(map, uv + vec2(0.0, mapUvStep.y), bias).a;\nfloat a2 = texture2D(map, uv + vec2(mapUvStep.x, 0.0), bias).a;\nfloat a3 = texture2D(map, uv + vec2(mapUvStep.x, mapUvStep.y), bias).a;\nfloat fully_transparent_count = step(0.0, -a0) + step(0.0, -a1) +\nstep(0.0, -a2) + step(0.0, -a3);\nfloat partialy_transparent_count =\nstep(0.0, -abs(clamp(a0, 0.05, 0.95) - a0)) +\nstep(0.0, -abs(clamp(a1, 0.05, 0.95) - a1)) +\nstep(0.0, -abs(clamp(a2, 0.05, 0.95) - a2)) +\nstep(0.0, -abs(clamp(a3, 0.05, 0.95) - a3));\nfragColor = vec4(step(4.0, partialy_transparent_count),\nfully_transparent_count / 4.0,\n0.0, 1.0);\nreturn;\n}\n";
  WALK.SHADERS["alpha_stats_vertex.glsl"] = "//AUTO GENERATED\nvarOut vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["anchor_vertex.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nvec3 sphericalDecode(in vec2 spNormal) {\nfloat theta = (spNormal.x / 254.0 + 0.5) * PI;\nfloat phi = spNormal.y * (PI / 127.0);\nfloat sinTheta = sin(theta);\nreturn vec3(sinTheta * cos(phi), sinTheta * sin(phi), cos(theta));\n}\n#if defined(USE_BASE_COLOR_TEXTURE) || defined(USE_ROUGHNESS_TEXTURE) || defined(USE_METALLIC_TEXTURE) || defined(USE_BUMP_TEXTURE)\nvarOut vec2 vUv;\n#endif\n#if defined(USE_BUMP_TEXTURE) || defined(USE_FOG)\nvarOut vec3 vPositionV;\n#endif\n#ifdef USE_BUMP_TEXTURE\nvarOut vec3 vNormalV;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT) || defined(USE_FOG)\nvarOut vec3 vPositionW;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvarOut vec3 vNormalW;\n#endif\nvoid main() {\n#if defined(USE_BASE_COLOR_TEXTURE) || defined(USE_ROUGHNESS_TEXTURE) || defined(USE_METALLIC_TEXTURE) || defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvec3 positionW = (modelMatrix * vec4(position, 1.0)).xyz;\nvec3 normal = sphericalDecode(sphericalNormal);\nvec3 normalW = mat3(modelMatrix[0].xyz,\nmodelMatrix[1].xyz,\nmodelMatrix[2].xyz) * normal;\nnormalW = normalize(normalW);\n#endif\n#if defined(USE_BASE_COLOR_TEXTURE) || defined(USE_ROUGHNESS_TEXTURE) || defined(USE_METALLIC_TEXTURE)\nvec3 anchorCenterW = vec3(modelMatrix[3].xyz);\nvec3 cameraUpW = vec3(modelViewMatrix[0].y,\nmodelViewMatrix[1].y,\nmodelViewMatrix[2].y);\nvec3 forwardW = normalize(anchorCenterW - cameraPosition);\nvec3 rightW = cross(forwardW, cameraUpW);\nrightW.z = 0.0;\nrightW = normalize(rightW);\nvec3 upW = cross(rightW, forwardW);\nvUv = vec2(dot(normalW, rightW) * 0.5 + 0.5, dot(normalW, upW) * 0.5 + 0.5);\n#endif\nvec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n#if defined(USE_BUMP_TEXTURE) || defined(USE_FOG)\nvPositionV = -mvPosition.xyz;\n#endif\n#if defined(USE_BUMP_TEXTURE)\nvNormalV = normalize(normalMatrix * normal);\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT) || defined(USE_FOG)\nvPositionW = positionW;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvNormalW = normalW;\n#endif\ngl_Position = projectionMatrix * mvPosition;\n}\n";
  WALK.SHADERS["cap_fragment.glsl"] = "//AUTO GENERATED\nuniform vec3 color;\nvoid main() {\nfragColor = vec4(color, 1.0);\n}\n";
  WALK.SHADERS["cap_vertex.glsl"] =
      "//AUTO GENERATED\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\nvoid main() {\nvec4 transformedPosition = transformPosition();\ngl_Position = projectionMatrix * modelViewMatrix * transformedPosition;\n}\n";
  WALK.SHADERS["copy_opaque_fragment.glsl"] = "//AUTO GENERATED\nuniform sampler2D tDiffuse;\nvarIn vec2 vUv;\nvoid main() {\nfragColor = vec4(texture2D(tDiffuse, vUv).rgb, 1.0);\n}\n";
  WALK.SHADERS["copy_opaque_vertex.glsl"] = "//AUTO GENERATED\nvarOut vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["crop_texture_fragment.glsl"] =
      "//AUTO GENERATED\nuniform sampler2D srcTexture;\nuniform vec4 uvOffsetScale;\nvarIn vec2 vUv;\nvoid main() {\nfragColor = texture2D(srcTexture, uvOffsetScale.xy + vUv * uvOffsetScale.zw);\n}\n";
  WALK.SHADERS["crop_texture_vertex.glsl"] = "//AUTO GENERATED\nvarOut vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["cubemap_filter_fragment.glsl"] =
      "//AUTO GENERATED\nvec3 hdrDecode(in vec4 rgbm) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = rgbm.rgb * (rgbmScale * (1.0 - rgbm.a));\nreturn r * r;\n}\nvec4 cubic(in float v){\nvec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;\nvec4 s = n * n * n;\nfloat x = s.x;\nfloat y = s.y - 4.0 * s.x;\nfloat z = s.z - 4.0 * s.y + 6.0 * s.x;\nfloat w = 6.0 - x - y - z;\nreturn vec4(x, y, z, w) * (1.0 / 6.0);\n}\nvec3 hdrDecodeBicubic(in sampler2D sampler, in vec2 texSize, in vec2 texCoords){\nvec2 invTexSize = 1.0 / texSize;\nvec2 texCoordsScaled = texCoords * texSize - 0.5;\nvec2 fxy = fract(texCoordsScaled);\ntexCoordsScaled -= fxy;\nvec4 xcubic = cubic(fxy.x);\nvec4 ycubic = cubic(fxy.y);\nvec4 c = texCoordsScaled.xxyy + vec2(-0.5, +1.5).xyxy;\nvec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);\nvec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;\noffset *= invTexSize.xxyy;\nvec3 sample0 = hdrDecode(texture2D(sampler, offset.xz));\nvec3 sample1 = hdrDecode(texture2D(sampler, offset.yz));\nvec3 sample2 = hdrDecode(texture2D(sampler, offset.xw));\nvec3 sample3 = hdrDecode(texture2D(sampler, offset.yw));\nfloat sx = s.x / (s.x + s.y);\nfloat sy = s.z / (s.z + s.w);\nreturn mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);\n}\nvec4 hdrEncode(in vec3 rgb) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = sqrt(rgb) / rgbmScale;\nfloat m = max(max(r.r, r.g), r.b);\nm = clamp(m, 1.0 / 255.0, 1.0);\nm = ceil(m * 255.0) / 255.0;\nr /= m;\nreturn vec4(r.r, r.g, r.b, (1.0 - m));\n}\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nfloat rnd(vec2 uv) {\nreturn fract(sin(dot(uv, vec2(12.9898, 78.233) * 2.0)) * 43758.5453);\n}\nvec3 hemisphereSample_cos(vec2 uv, mat3 vecSpace, vec3 cubeDir, float gloss) {\nfloat phi = uv.y * 2.0 * PI;\nfloat cosTheta = sqrt(1.0 - uv.x);\nfloat sinTheta = sqrt(1.0 - cosTheta * cosTheta);\nvec3 sampleDir = vec3(cos(phi) * sinTheta, sin(phi) * sinTheta, cosTheta);\nreturn normalize(mix(vecSpace * sampleDir, cubeDir, gloss));\n}\nmat3 matrixFromVector(vec3 n) { // frisvad\nfloat a = 1.0 / (1.0 + n.z);\nfloat b = -n.x * n.y * a;\nvec3 b1 = vec3(1.0 - n.x * n.x * a, b, -n.x);\nvec3 b2 = vec3(b, 1.0 - n.y * n.y * a, -n.y);\nreturn mat3(b1, b2, n);\n}\nuniform samplerCube envMap;\nuniform float mipSize;\nuniform float face;\nuniform float gloss;\nvoid main(void) {\nvec2 st = 2.0 * floor(gl_FragCoord.xy) / (mipSize - 1.0) - 1.0;\nvec3 vec;\nif (face == 0.0) {\nvec = vec3(1, -st.y, -st.x);\n} else if (face == 1.0) {\nvec = vec3(-1, -st.y, st.x);\n} else if (face == 2.0) {\nvec = vec3(st.x, 1, st.y);\n} else if (face == 3.0) {\nvec = vec3(st.x, -1, -st.y);\n} else if (face == 4.0) {\nvec = vec3(st.x, -st.y, 1);\n} else {\nvec = vec3(-st.x, -st.y, -1);\n}\nmat3 vecSpace = matrixFromVector(normalize(vec));\nvec3 color = vec3(0.0);\nconst int samples = 200;\nvec3 vect;\nfor(int i = 0; i < samples; i++) {\nfloat sini = sin(float(i));\nfloat cosi = cos(float(i));\nfloat rand = rnd(vec2(sini, cosi));\nvect = hemisphereSample_cos(\nvec2(float(i) / float(samples), rand), vecSpace, vec, gloss);\ncolor += hdrDecode(textureCube(envMap, vect));\n}\ncolor /= float(samples);\nfragColor = hdrEncode(color);\n}\n";
  WALK.SHADERS["cubemap_filter_vertex.glsl"] = "//AUTO GENERATED\nvoid main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["cube_to_equirect_fragment.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nuniform samplerCube panoramaCube;\nvarIn vec2 vUv;\nvoid main() {\nvec2 uv = vUv;\nfloat longitude = uv.x * 2. * PI;\nfloat latitude = uv.y * PI;\nvec3 dir = vec3(\nsin(longitude) * sin(latitude),\ncos(longitude) * sin(latitude),\ncos(latitude));\nfragColor = textureCube(panoramaCube, normalize(dir));\n}\n";
  WALK.SHADERS["cube_to_equirect_vertex.glsl"] = "//AUTO GENERATED\nvarOut vec2 vUv;\nvoid main()  {\nvUv = vec2(uv.x, uv.y - 1.0);\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["editor_light_fragment.glsl"] =
      "//AUTO GENERATED\nfloat _l2g(in float x) {\nreturn (x <= 0.0031308) ? x * 12.92 : pow(x, 1.0 / 2.4) * 1.055 - 0.055;\n}\nvec3 linearToGamma(in vec3 rgb) {\nreturn vec3(_l2g(rgb.r), _l2g(rgb.g), _l2g(rgb.b));\n}\nvec3 linearToGammaUnreal(in vec3 rgb) {\nreturn rgb / (rgb + 0.187) * 1.035;\n}\nuniform vec3 color;\nuniform vec3 highlight;\nuniform float highlightMix;\nvarIn vec3 vNormal;\nvarIn vec3 vViewPosition;\nvoid main() {\nvec3 lVector = normalize(vViewPosition.xyz);\nfloat pointDiffuse = max(dot(normalize(vNormal), lVector), 0.0);\nvec3 lightColor = color * pointDiffuse;\nlightColor = mix(lightColor, highlight, highlightMix);\nfragColor = vec4(min(linearToGamma(lightColor), 1.0), 1.0);\n}\n";
  WALK.SHADERS["editor_light_vertex.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nvec3 sphericalDecode(in vec2 spNormal) {\nfloat theta = (spNormal.x / 254.0 + 0.5) * PI;\nfloat phi = spNormal.y * (PI / 127.0);\nfloat sinTheta = sin(theta);\nreturn vec3(sinTheta * cos(phi), sinTheta * sin(phi), cos(theta));\n}\nvarOut vec3 vNormal;\nvarOut vec3 vViewPosition;\nvoid main() {\nvec3 normal = sphericalDecode(sphericalNormal);\nvNormal = normalize(normalMatrix * normal);\nvec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\nvViewPosition = -mvPosition.xyz;\ngl_Position = projectionMatrix * mvPosition;\n}\n";
  WALK.SHADERS["equirect_sky_fragment.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nfloat _g2l(in float x) {\nreturn (x <= 0.04045) ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4);\n}\nvec3 gammaToLinear(in vec3 rgb) {\nreturn vec3(_g2l(rgb.r), _g2l(rgb.g), _g2l(rgb.b));\n}\nfloat _l2g(in float x) {\nreturn (x <= 0.0031308) ? x * 12.92 : pow(x, 1.0 / 2.4) * 1.055 - 0.055;\n}\nvec3 linearToGamma(in vec3 rgb) {\nreturn vec3(_l2g(rgb.r), _l2g(rgb.g), _l2g(rgb.b));\n}\nvec3 linearToGammaUnreal(in vec3 rgb) {\nreturn rgb / (rgb + 0.187) * 1.035;\n}\nvec3 hdrDecode(in vec4 rgbm) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = rgbm.rgb * (rgbmScale * (1.0 - rgbm.a));\nreturn r * r;\n}\nvec4 cubic(in float v){\nvec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;\nvec4 s = n * n * n;\nfloat x = s.x;\nfloat y = s.y - 4.0 * s.x;\nfloat z = s.z - 4.0 * s.y + 6.0 * s.x;\nfloat w = 6.0 - x - y - z;\nreturn vec4(x, y, z, w) * (1.0 / 6.0);\n}\nvec3 hdrDecodeBicubic(in sampler2D sampler, in vec2 texSize, in vec2 texCoords){\nvec2 invTexSize = 1.0 / texSize;\nvec2 texCoordsScaled = texCoords * texSize - 0.5;\nvec2 fxy = fract(texCoordsScaled);\ntexCoordsScaled -= fxy;\nvec4 xcubic = cubic(fxy.x);\nvec4 ycubic = cubic(fxy.y);\nvec4 c = texCoordsScaled.xxyy + vec2(-0.5, +1.5).xyxy;\nvec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);\nvec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;\noffset *= invTexSize.xxyy;\nvec3 sample0 = hdrDecode(texture2D(sampler, offset.xz));\nvec3 sample1 = hdrDecode(texture2D(sampler, offset.yz));\nvec3 sample2 = hdrDecode(texture2D(sampler, offset.xw));\nvec3 sample3 = hdrDecode(texture2D(sampler, offset.yw));\nfloat sx = s.x / (s.x + s.y);\nfloat sy = s.z / (s.z + s.w);\nreturn mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);\n}\nvec4 hdrEncode(in vec3 rgb) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = sqrt(rgb) / rgbmScale;\nfloat m = max(max(r.r, r.g), r.b);\nm = clamp(m, 1.0 / 255.0, 1.0);\nm = ceil(m * 255.0) / 255.0;\nr /= m;\nreturn vec4(r.r, r.g, r.b, (1.0 - m));\n}\n#ifdef USE_FOG\nuniform float distanceDensity;\nuniform float distanceStart;\nuniform float heightDensity;\nuniform float heightStart;\nuniform vec3 color;\nconst float LOG2 = 1.442695;\nvec3 addFog(in vec3 colorIn, in float distance, in vec3 positionW) {\nfloat distanceValue = max(0.0, distance - distanceStart);\nfloat distanceFogExp = 1.0 - exp2(-distanceDensity * distanceDensity *\ndistanceValue * distanceValue * LOG2);\nfloat heightValue = max(0.0, -positionW.z + heightStart);\nfloat heightFogExp = 1.0 - exp2(-heightDensity * heightDensity * heightValue *\nheightValue * LOG2);\nfloat fogAmount = min(1.0, distanceFogExp + heightFogExp);\nreturn mix(colorIn, color, fogAmount);\n}\n#endif\nuniform sampler2D map;\nuniform float exposure;\nuniform float cameraGamma;\nvarIn vec2 vUv;\n#ifdef USE_FOG\nvarIn vec3 vPositionW;\nvarIn vec3 vPositionV;\n#endif\n#ifdef USE_COLORMAP\nvec3 colormap(in sampler2D lut, in vec3 color) {\nconst float resolution = 16.0;\nconst float maxValueIndex = resolution - 1.0;\nconst float sliceWidth = 1.0 / resolution;\nconst float slicePixelWidth = sliceWidth / resolution;\nconst float sliceMarginWidth = 0.5 * slicePixelWidth;\nconst float sliceInnerWidth = sliceWidth - slicePixelWidth;\nconst float slicePixelHeight = 1.0 / resolution;\nconst float sliceMarginHeight = 0.5 * slicePixelHeight;\nconst float sliceInnerHeight = 1.0 - slicePixelHeight;\nfloat bSlice0 = min(floor(color.b * maxValueIndex), maxValueIndex - 1.0);\nfloat bSlice1 = bSlice0 + 1.0;\nfloat bOffset = color.b * maxValueIndex - bSlice0;\nfloat rSlicePos = sliceMarginWidth + color.r * sliceInnerWidth;\nfloat gSlicePos = sliceMarginHeight + color.g * sliceInnerHeight;\nfloat rPos0 = rSlicePos + (bSlice0 * sliceWidth);\nfloat rPos1 = rSlicePos + (bSlice1 * sliceWidth);\nvec3 color0 = texture2D(lut, vec2(rPos0, gSlicePos)).rgb;\nvec3 color1 = texture2D(lut, vec2(rPos1, gSlicePos)).rgb;\nreturn mix(color0, color1, bOffset);\n}\nuniform sampler2D colorMap;\n#endif\nvoid main() {\n#ifdef USE_RGBM_MAP\nvec4 colorRgbm = texture2D(map, vUv);\nvec3 colorLinear = hdrDecode(colorRgbm);\n#else\nvec3 colorLinear = gammaToLinear(texture2D(map, vUv).xyz);\n#endif\n#ifdef USE_FOG\nfloat distance = length(vPositionV);\ncolorLinear = addFog(colorLinear, distance, vPositionW);\n#endif\n#ifdef HDR_OUTPUT\n#ifdef USE_RGBM_MAP\nfragColor = colorRgbm;\n#else\nfragColor = hdrEncode(10.0 * colorLinear);\n#endif\n#else\nvec3 colorExposed = pow(exposure * colorLinear, vec3(cameraGamma));\nvec3 colorGamma =  linearToGammaUnreal(colorExposed);\n#ifdef USE_COLORMAP\nfragColor = vec4(colormap(colorMap, colorGamma), 1.0);\n#else\nfragColor = vec4(colorGamma, 1.0);\n#endif\n#endif\n}\n";
  WALK.SHADERS["equirect_sky_vertex.glsl"] =
      "//AUTO GENERATED\nvarOut vec2 vUv;\n#ifdef USE_FOG\nvarOut vec3 vPositionW;\nvarOut vec3 vPositionV;\n#endif\nvoid main() {\nvUv = uv;\n#ifdef USE_FOG\nvPositionW = (modelMatrix * vec4(position, 1.0)).xyz;\nvPositionV = -(modelViewMatrix * vec4(position, 1.0)).xyz;\n#endif\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["gaze_pointer_fragment.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nconst float pointRadius = 0.01;\nconst float pointBorder = 0.005;\nconst float timerRadius = 0.04;\nconst float timerBorder = 0.02;\nconst vec3 timerColor =  vec3(0.298, 0.619, 0.851);\nvarIn vec2 coords;\nuniform float circleSpan;\nvoid main() {\nfloat dist =  sqrt(dot(coords, coords));\nif (dist < pointRadius) {\nfloat a = 1.0 - smoothstep(pointRadius - pointBorder, pointRadius, dist);\nfragColor = vec4(1.0, 1.0, 1.0, a);\n} else if (-atan(coords.x, -coords.y) < circleSpan) {\nfloat a2 = smoothstep(timerRadius - timerBorder, timerRadius, dist) -\nsmoothstep(timerRadius, timerRadius + timerBorder, dist);\nfragColor = vec4(timerColor, a2);\n} else {\ndiscard;\n}\n}\n";
  WALK.SHADERS["gaze_pointer_vertex.glsl"] =
      "//AUTO GENERATED\nvarOut vec2 coords;\nvoid main() {\ncoords = vec2(position.x, position.y);\nvec4 outPosition = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);\noutPosition.z = -0.1;\ngl_Position = outPosition;\n}\n";
  WALK.SHADERS["luma_fragment.glsl"] =
      "//AUTO GENERATED\nvec3 hdrDecode(in vec4 rgbm) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = rgbm.rgb * (rgbmScale * (1.0 - rgbm.a));\nreturn r * r;\n}\nvec4 cubic(in float v){\nvec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;\nvec4 s = n * n * n;\nfloat x = s.x;\nfloat y = s.y - 4.0 * s.x;\nfloat z = s.z - 4.0 * s.y + 6.0 * s.x;\nfloat w = 6.0 - x - y - z;\nreturn vec4(x, y, z, w) * (1.0 / 6.0);\n}\nvec3 hdrDecodeBicubic(in sampler2D sampler, in vec2 texSize, in vec2 texCoords){\nvec2 invTexSize = 1.0 / texSize;\nvec2 texCoordsScaled = texCoords * texSize - 0.5;\nvec2 fxy = fract(texCoordsScaled);\ntexCoordsScaled -= fxy;\nvec4 xcubic = cubic(fxy.x);\nvec4 ycubic = cubic(fxy.y);\nvec4 c = texCoordsScaled.xxyy + vec2(-0.5, +1.5).xyxy;\nvec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);\nvec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;\noffset *= invTexSize.xxyy;\nvec3 sample0 = hdrDecode(texture2D(sampler, offset.xz));\nvec3 sample1 = hdrDecode(texture2D(sampler, offset.yz));\nvec3 sample2 = hdrDecode(texture2D(sampler, offset.xw));\nvec3 sample3 = hdrDecode(texture2D(sampler, offset.yw));\nfloat sx = s.x / (s.x + s.y);\nfloat sy = s.z / (s.z + s.w);\nreturn mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);\n}\n#ifdef USE_LIGHTMAP\nwebgl2centroid varIn vec2 vUv2;\nuniform sampler2D lightMap;\nuniform vec2 lightMapSize;\nvec3 getLightIntensity() {\nreturn hdrDecodeBicubic(lightMap, lightMapSize, vUv2);\n}\n#else // NOT USE_LIGHTMAP\nvec3 getLightIntensity() {\nreturn vec3(1.0);\n}\n#endif\nuniform vec3 color;\nvoid main() {\nvec3 receivedLight = getLightIntensity();\nvec3 diffuseLight = receivedLight * color;\nfloat luma = 0.299 * diffuseLight.r +\n0.587 * diffuseLight.g +\n0.114 * diffuseLight.b;\nfragColor.r = fract(luma);\nfragColor.g = floor(luma) / 255.0;\n}\n";
  WALK.SHADERS["minimap_add_alpha_fragment.glsl"] =
      "//AUTO GENERATED\nuniform sampler2D tColor;\n#ifdef USE_ALPHA_FROM_COLOR\nuniform vec3 colorFill;\n#else\nuniform sampler2D tAlpha;\n#endif\nvarIn vec2 vUv;\nvoid main() {\nvec4 color = texture2D(tColor, vUv);\n#ifdef USE_ALPHA_FROM_COLOR\nfloat alphaFromColor = (color.r + color.g + color.b) / 3.0;\nfragColor = vec4(colorFill, alphaFromColor);\n#else\nfloat alpha = vec4(texture2D(tAlpha, vUv)).a;\nfragColor = vec4(color.rgb, alpha);\n#endif\n}\n";
  WALK.SHADERS["minimap_add_alpha_vertex.glsl"] = "//AUTO GENERATED\nvarOut vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["mirror_fragment.glsl"] =
      "//AUTO GENERATED\nuniform vec3 mirrorColor;\nuniform sampler2D mirrorSampler;\nvarIn vec4 mirrorCoord;\nfloat blendOverlay(float base, float blend) {\nreturn (base < 0.5 ? (2.0 * base * blend) :\n(1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));\n}\nvoid main() {\nvec4 color = texture2DProj(mirrorSampler, mirrorCoord);\ncolor = vec4(blendOverlay(mirrorColor.r, color.r),\nblendOverlay(mirrorColor.g, color.g),\nblendOverlay(mirrorColor.b, color.b), 1.0);\nfragColor = color;\n}\n";
  WALK.SHADERS["mirror_vertex.glsl"] =
      "//AUTO GENERATED\nuniform mat4 textureMatrix;\nvarOut vec4 mirrorCoord;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\nvec4 worldPosition = modelMatrix * vec4(position, 1.0);\nmirrorCoord = textureMatrix * worldPosition;\ngl_Position = projectionMatrix * mvPosition;\n}\n";
  WALK.SHADERS["object_distance_vertex.glsl"] =
      "//AUTO GENERATED\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\nvarOut vec3 vPositionW;\nvoid main() {\nvec4 transformedPosition = transformPosition();\nvPositionW = (modelMatrix * transformedPosition).xyz;\ngl_Position = projectionMatrix * modelViewMatrix * transformedPosition;\n}\n";
  WALK.SHADERS["object_id_distance_fragment.glsl"] =
      "//AUTO GENERATED\nuniform int objectId;\nvarIn vec3 vPositionW;\nvoid main(void) {\nfloat cameraDistance = min(distance(cameraPosition, vPositionW), 255.0);\nint x = objectId / 256;\nint y = objectId - 256 * x;\nfloat z = floor(cameraDistance);\nfloat a = fract(cameraDistance);\nfragColor = vec4(float(x) / 255.0, float(y) / 255.0,\nz / 255.0, a);\n}\n";
  WALK.SHADERS["object_id_fragment.glsl"] =
      "//AUTO GENERATED\nuniform int objectId;\nvarIn vec3 vPositionW;\nvoid main(void) {\nint x = objectId / (256 * 256);\nint y = (objectId - 256 * 256 * x) / 256;\nint z = (objectId - 256 * 256 * x - 256 * y);\nfragColor = vec4(float(x) / 255.0, float(y) / 255.0,\nfloat(z) / 255.0, 0);\n}\n";
  WALK.SHADERS["outline_fragment.glsl"] = "//AUTO GENERATED\nuniform vec3 color;\nvoid main() {\nfragColor = vec4(color, 1.0);\n}\n";
  WALK.SHADERS["outline_vertex.glsl"] =
      "//AUTO GENERATED\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nvec3 sphericalDecode(in vec2 spNormal) {\nfloat theta = (spNormal.x / 254.0 + 0.5) * PI;\nfloat phi = spNormal.y * (PI / 127.0);\nfloat sinTheta = sin(theta);\nreturn vec3(sinTheta * cos(phi), sinTheta * sin(phi), cos(theta));\n}\nuniform float thickness;\nvoid main() {\nvec3 n = sphericalDecode(sphericalNormal);\nvec3 normal = vec3(\nt0.x * n.x + t0.y * n.y + t0.z * n.z,\nt1.x * n.x + t1.y * n.y + t1.z * n.z,\nt2.x * n.x + t2.y * n.y + t2.z * n.z);\nvec4 transformedPosition = transformPosition();\nfloat distToCamera = cameraPosition.z - transformedPosition.z;\nvec4 movedPosition = vec4(\ntransformedPosition.x - distToCamera * thickness * normal.x,\ntransformedPosition.y - distToCamera * thickness * normal.y,\ntransformedPosition.z, transformedPosition.w);\ngl_Position = projectionMatrix * modelViewMatrix * movedPosition;\n}\n";
  WALK.SHADERS["procedural_sky_fragment.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nfloat _g2l(in float x) {\nreturn (x <= 0.04045) ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4);\n}\nvec3 gammaToLinear(in vec3 rgb) {\nreturn vec3(_g2l(rgb.r), _g2l(rgb.g), _g2l(rgb.b));\n}\nfloat _l2g(in float x) {\nreturn (x <= 0.0031308) ? x * 12.92 : pow(x, 1.0 / 2.4) * 1.055 - 0.055;\n}\nvec3 linearToGamma(in vec3 rgb) {\nreturn vec3(_l2g(rgb.r), _l2g(rgb.g), _l2g(rgb.b));\n}\nvec3 linearToGammaUnreal(in vec3 rgb) {\nreturn rgb / (rgb + 0.187) * 1.035;\n}\n#ifdef USE_FOG\nuniform float distanceDensity;\nuniform float distanceStart;\nuniform float heightDensity;\nuniform float heightStart;\nuniform vec3 color;\nconst float LOG2 = 1.442695;\nvec3 addFog(in vec3 colorIn, in float distance, in vec3 positionW) {\nfloat distanceValue = max(0.0, distance - distanceStart);\nfloat distanceFogExp = 1.0 - exp2(-distanceDensity * distanceDensity *\ndistanceValue * distanceValue * LOG2);\nfloat heightValue = max(0.0, -positionW.z + heightStart);\nfloat heightFogExp = 1.0 - exp2(-heightDensity * heightDensity * heightValue *\nheightValue * LOG2);\nfloat fogAmount = min(1.0, distanceFogExp + heightFogExp);\nreturn mix(colorIn, color, fogAmount);\n}\n#endif\nuniform vec3 topColor;\nuniform vec3 bottomColor;\nuniform float sinBottomAngle;\nuniform float exponent;\nuniform float exposure;\nuniform float cameraGamma;\nvarIn vec3 vWorldDirection;\n#ifdef USE_FOG\nvarIn vec3 vPositionW;\nvarIn vec3 vPositionV;\n#endif\n#ifdef HDR_OUTPUT\nvec4 hdrEncode(in vec3 rgb) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = sqrt(rgb) / rgbmScale;\nfloat m = max(max(r.r, r.g), r.b);\nm = clamp(m, 1.0 / 255.0, 1.0);\nm = ceil(m * 255.0) / 255.0;\nr /= m;\nreturn vec4(r.r, r.g, r.b, (1.0 - m));\n}\n#endif\n#ifdef USE_COLORMAP\nvec3 colormap(in sampler2D lut, in vec3 color) {\nconst float resolution = 16.0;\nconst float maxValueIndex = resolution - 1.0;\nconst float sliceWidth = 1.0 / resolution;\nconst float slicePixelWidth = sliceWidth / resolution;\nconst float sliceMarginWidth = 0.5 * slicePixelWidth;\nconst float sliceInnerWidth = sliceWidth - slicePixelWidth;\nconst float slicePixelHeight = 1.0 / resolution;\nconst float sliceMarginHeight = 0.5 * slicePixelHeight;\nconst float sliceInnerHeight = 1.0 - slicePixelHeight;\nfloat bSlice0 = min(floor(color.b * maxValueIndex), maxValueIndex - 1.0);\nfloat bSlice1 = bSlice0 + 1.0;\nfloat bOffset = color.b * maxValueIndex - bSlice0;\nfloat rSlicePos = sliceMarginWidth + color.r * sliceInnerWidth;\nfloat gSlicePos = sliceMarginHeight + color.g * sliceInnerHeight;\nfloat rPos0 = rSlicePos + (bSlice0 * sliceWidth);\nfloat rPos1 = rSlicePos + (bSlice1 * sliceWidth);\nvec3 color0 = texture2D(lut, vec2(rPos0, gSlicePos)).rgb;\nvec3 color1 = texture2D(lut, vec2(rPos1, gSlicePos)).rgb;\nreturn mix(color0, color1, bOffset);\n}\nuniform sampler2D colorMap;\n#endif\nvoid main() {\nfloat sinDirection = normalize(vWorldDirection).z;\nfloat w = max(0.0, (sinDirection - sinBottomAngle) / (1.0 - sinBottomAngle));\nvec3 colorGamma = mix(bottomColor, topColor, pow(w, exponent));\nvec3 colorLinear = gammaToLinear(colorGamma);\n#ifdef USE_FOG\nfloat distance = length(vPositionV);\ncolorLinear = addFog(colorLinear, distance, vPositionW);\n#endif\n#ifdef HDR_OUTPUT\nfragColor = hdrEncode(10.0 * colorLinear);\n#else\n#ifdef USE_FOG\nvec3 colorExposed = pow(exposure * colorLinear, vec3(cameraGamma));\ncolorGamma =  linearToGammaUnreal(colorExposed);\n#endif\n#ifdef USE_COLORMAP\nfragColor = vec4(colormap(colorMap, colorGamma), 1.0);\n#else\nfragColor = vec4(colorGamma, 1.0);\n#endif\n#endif\n}\n";
  WALK.SHADERS["procedural_sky_vertex.glsl"] =
      "//AUTO GENERATED\n#ifdef USE_FOG\nvarOut vec3 vPositionW;\nvarOut vec3 vPositionV;\n#endif\nvarOut vec3 vWorldDirection;\nvoid main() {\nvec3 positionW = (modelMatrix * vec4(position, 1.0)).xyz;\nvWorldDirection = positionW - cameraPosition;\n#ifdef USE_FOG\nvPositionW = positionW;\nvPositionV = -(modelViewMatrix * vec4(position, 1.0)).xyz;\n#endif\ngl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["rotate_gizmo_material_fragment.glsl"] =
      "//AUTO GENERATED\nuniform vec3 color;\nuniform float opacity;\nuniform vec3 gizmoPosition;\nuniform float sphereRadius;\nvarIn vec4 mPosition;\nvoid discardIfRayIntersectsSphere(vec3 r0, vec3 rd, vec3 s0, float sr) {\nfloat a = dot(rd, rd);\nvec3 s0_r0 = r0 - s0;\nfloat b = 2.0 * dot(rd, s0_r0);\nfloat c = dot(s0_r0, s0_r0) - (sr * sr);\nfloat delta = b * b - 4.0 * a * c;\nif (delta >= 0.0 && -b - sqrt(delta) > 0.0) {\ndiscard;\n}\n}\nvoid main() {\nvec4 outColor;\noutColor.rgb = color;\noutColor.a = opacity;\nvec3 toCamera = normalize(cameraPosition - gizmoPosition);\ndiscardIfRayIntersectsSphere(mPosition.xyz, toCamera, gizmoPosition, sphereRadius);\nfragColor = outColor;\n}\n";
  WALK.SHADERS["rotate_gizmo_material_vertex.glsl"] =
      "//AUTO GENERATED\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\nvarOut vec4 mPosition;\nvoid main() {\nvec4 p = vec4(position, 1.0);\nmPosition = modelMatrix * p;\nvec4 mvPosition = modelViewMatrix * p;\ngl_Position = projectionMatrix * mvPosition;\n}\n";
  WALK.SHADERS["sprite_vertex.glsl"] =
      "//AUTO GENERATED\nuniform vec3 offset;\n#ifdef USE_FOG\nvarOut vec3 vPositionW;\nvarOut vec3 vPositionV;\n#endif\nvarOut vec2 vUv;\nvoid main() {\nvUv = uv;\nvec4 mvPosition = modelViewMatrix * vec4(offset, 1.0);\nvec2 scale;\n#ifdef USE_FOG\nvPositionW = (modelMatrix * vec4(offset, 1.0)).xyz;\nvPositionV = -mvPosition.xyz;\n#endif\nscale.x = length(modelMatrix[0].xyz);\nscale.y = length(modelMatrix[1].xyz);\nvec2 alignedPosition = position.xy * scale;\nmvPosition.xy += alignedPosition;\ngl_Position = projectionMatrix * mvPosition;\n}\n";
  WALK.SHADERS["standard_material_fragment.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nfloat _g2l(in float x) {\nreturn (x <= 0.04045) ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4);\n}\nvec3 gammaToLinear(in vec3 rgb) {\nreturn vec3(_g2l(rgb.r), _g2l(rgb.g), _g2l(rgb.b));\n}\nfloat _l2g(in float x) {\nreturn (x <= 0.0031308) ? x * 12.92 : pow(x, 1.0 / 2.4) * 1.055 - 0.055;\n}\nvec3 linearToGamma(in vec3 rgb) {\nreturn vec3(_l2g(rgb.r), _l2g(rgb.g), _l2g(rgb.b));\n}\nvec3 linearToGammaUnreal(in vec3 rgb) {\nreturn rgb / (rgb + 0.187) * 1.035;\n}\nvec3 hdrDecode(in vec4 rgbm) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = rgbm.rgb * (rgbmScale * (1.0 - rgbm.a));\nreturn r * r;\n}\nvec4 cubic(in float v){\nvec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;\nvec4 s = n * n * n;\nfloat x = s.x;\nfloat y = s.y - 4.0 * s.x;\nfloat z = s.z - 4.0 * s.y + 6.0 * s.x;\nfloat w = 6.0 - x - y - z;\nreturn vec4(x, y, z, w) * (1.0 / 6.0);\n}\nvec3 hdrDecodeBicubic(in sampler2D sampler, in vec2 texSize, in vec2 texCoords){\nvec2 invTexSize = 1.0 / texSize;\nvec2 texCoordsScaled = texCoords * texSize - 0.5;\nvec2 fxy = fract(texCoordsScaled);\ntexCoordsScaled -= fxy;\nvec4 xcubic = cubic(fxy.x);\nvec4 ycubic = cubic(fxy.y);\nvec4 c = texCoordsScaled.xxyy + vec2(-0.5, +1.5).xyxy;\nvec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);\nvec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;\noffset *= invTexSize.xxyy;\nvec3 sample0 = hdrDecode(texture2D(sampler, offset.xz));\nvec3 sample1 = hdrDecode(texture2D(sampler, offset.yz));\nvec3 sample2 = hdrDecode(texture2D(sampler, offset.xw));\nvec3 sample3 = hdrDecode(texture2D(sampler, offset.yw));\nfloat sx = s.x / (s.x + s.y);\nfloat sy = s.z / (s.z + s.w);\nreturn mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);\n}\n#ifdef USE_FOG\nuniform float distanceDensity;\nuniform float distanceStart;\nuniform float heightDensity;\nuniform float heightStart;\nuniform vec3 color;\nconst float LOG2 = 1.442695;\nvec3 addFog(in vec3 colorIn, in float distance, in vec3 positionW) {\nfloat distanceValue = max(0.0, distance - distanceStart);\nfloat distanceFogExp = 1.0 - exp2(-distanceDensity * distanceDensity *\ndistanceValue * distanceValue * LOG2);\nfloat heightValue = max(0.0, -positionW.z + heightStart);\nfloat heightFogExp = 1.0 - exp2(-heightDensity * heightDensity * heightValue *\nheightValue * LOG2);\nfloat fogAmount = min(1.0, distanceFogExp + heightFogExp);\nreturn mix(colorIn, color, fogAmount);\n}\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT) || defined(USE_FOG)\nvarIn vec3 vPositionW;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvarIn vec3 vNormalW;\n#endif\n#if defined(USE_BASE_COLOR_TEXTURE) || defined(USE_ROUGHNESS_TEXTURE) || defined(USE_METALLIC_TEXTURE) || defined(USE_BUMP_TEXTURE)\nvarIn vec2 vUv;\n#endif\n#if defined(USE_BUMP_TEXTURE) || defined(USE_FOG)\nvarIn vec3 vPositionV;\n#endif\n#if defined(USE_BUMP_TEXTURE)\nvarIn vec3 vNormalV;\nuniform float bumpScale;\nuniform sampler2D bumpTexture;\nvec2 dBumpdxy() {\nvec2 texdx = dFdx(vUv);\nvec2 texdy = dFdy(vUv);\nfloat Hll = bumpScale * texture2D(bumpTexture, vUv).x;\nfloat dBx = bumpScale * texture2D(bumpTexture, vUv + texdx).x - Hll;\nfloat dBy = bumpScale * texture2D(bumpTexture, vUv + texdy).x - Hll;\nreturn vec2(dBx, dBy);\n}\nvec3 perturbNormal(in vec3 surfPos, in vec3 surfNorm) {\nvec2 dBdxy = dBumpdxy();\nvec3 vSigmaX = dFdx(surfPos);\nvec3 vSigmaY = dFdy(surfPos);\nvec3 R1 = cross(vSigmaY, surfNorm);\nvec3 R2 = cross(surfNorm, vSigmaX);\nfloat fDet = dot(vSigmaX, R1);\nvec3 vGrad = sign(fDet) * (dBdxy.x * R1 + dBdxy.y * R2);\nreturn normalize(abs(fDet) * surfNorm - vGrad);\n}\n#endif\n#ifdef USE_BASE_COLOR_TEXTURE\nuniform sampler2D baseColorTexture;\nuniform vec4 baseColorAtlasUvMod;\nuniform float alphaDiscardThreshold;\n#ifdef USE_PARALLAX_CORRECTION\n#endif\n#else\nuniform vec3 baseColor;\n#endif\nuniform float opacity;\nuniform vec4 baseColorCorrection;\nvec3 getBaseColor(out float alpha) {\n#ifdef USE_BASE_COLOR_TEXTURE\n#ifdef USE_PARALLAX_CORRECTION\n#else\nvec2 uv = vUv;\n#endif\n#ifdef USE_BASE_COLOR_TEXTURE_ATLAS_REPEAT\nvec2 uvScaled = uv * baseColorAtlasUvMod.zw;\nvec2 dfdx = dFdx(uvScaled);\nvec2 dfdy = dFdy(uvScaled);\nuv = fract(uv) * baseColorAtlasUvMod.zw + baseColorAtlasUvMod.xy;\nvec4 baseColorGamma = texture2DGradEXT(baseColorTexture, uv, dfdx, dfdy);\nfloat textureAlpha = baseColorGamma.a;\n#else\nuv = uv * baseColorAtlasUvMod.zw + baseColorAtlasUvMod.xy;\n#ifdef USE_ALPHA_IN_LOWER_HALF\nvec4 baseColorGamma = texture2D(baseColorTexture,\nvec2(uv.x, .5 + .5 * uv.y));\nfloat textureAlpha = texture2D(baseColorTexture,\nvec2(uv.x, .5 * uv.y)).r;\n#else\nvec4 baseColorGamma = texture2D(baseColorTexture, uv);\nfloat textureAlpha = baseColorGamma.a;\n#endif\n#endif\nvec3 baseColor = gammaToLinear(baseColorGamma.rgb);\nalpha = opacity * textureAlpha;\n#else // NOT USE_BASE_COLOR_TEXTURE\nalpha = opacity;\n#endif\nvec3 baseColorCorrected = baseColorCorrection.a * baseColor +\nbaseColorCorrection.rgb;\nreturn clamp(baseColorCorrected, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));\n}\n#ifdef USE_LIGHTMAP\nwebgl2centroid varIn vec2 vUv2;\nuniform sampler2D lightMap;\nuniform vec2 lightMapSize;\nvec3 getLightIntensity() {\nreturn hdrDecodeBicubic(lightMap, lightMapSize, vUv2);\n}\n#else // NOT USE_LIGHTMAP\nvec3 getLightIntensity() {\nreturn vec3(1.0);\n}\n#endif\n#ifdef USE_ROUGHNESS_TEXTURE\nuniform sampler2D roughnessTexture;\n#else\nuniform float roughness;\n#endif\n#ifdef USE_METALLIC_TEXTURE\nuniform sampler2D metallicTexture;\n#else\nuniform float metallic;\n#endif\nvec3 addSpecularHook(in vec3 baseColor, in vec3 totalIntensity,\ninout float opacity);\n#if defined(USE_ENVMAP)\nconst float DLT = 0.001;\nuniform samplerCube envMap;\nuniform float envMipsCount;\n#ifdef HAVE_TEXTURE_LOD\n#else\nuniform samplerCube envMap2;\n#endif\nstruct Roughness {\nfloat envFresnel; // (1.0 - roughness)^2, used for Fresnel with env map\nfloat envMipLevel0;\nfloat envMipLevel1;\nfloat envMipMixFactor;\n};\nRoughness getRoughnessFactors() {\nRoughness r;\n#ifdef USE_ROUGHNESS_TEXTURE\nfloat roughness = texture2D(roughnessTexture, vUv).x;\n#endif // else roughness is a uniform\nfloat roughness2 = roughness * roughness;\nfloat maxMipLevel = envMipsCount - 1.0;\nfloat mipSelector = roughness * maxMipLevel;\nr.envMipLevel0 = floor(mipSelector);\nr.envMipLevel1 = min(r.envMipLevel0 + 1.0, maxMipLevel);\nr.envMipMixFactor = fract(mipSelector);\nr.envFresnel = (roughness2 - 2.0 * roughness + 1.0);\nreturn r;\n}\n#ifdef USE_ENVMAP_PROJECT\nuniform vec3 envBoxMin;\nuniform vec3 envBoxMax;\nuniform vec3 envMapPosW;\nconst vec3 infBox = vec3(1000.0);\nvec3 cubeMapProject(vec3 reflectionW) {\nvec3 firstPlaneIntersect = (envBoxMax - vPositionW) / reflectionW;\nvec3 secondPlaneIntersect = (envBoxMin - vPositionW) / reflectionW;\nvec3 furthestPlane = max(firstPlaneIntersect, secondPlaneIntersect);\nvec3 furthestPlaneNonNeg =\nstep(0.0, -furthestPlane) * infBox + abs(furthestPlane);\nfloat distance = min(min(furthestPlaneNonNeg.x, furthestPlaneNonNeg.y),\nfurthestPlaneNonNeg.z);\n/*if (furthestPlane.x > 0.0){\ndistance = furthestPlane.x;\n}\nif (furthestPlane.y > 0.0) {\ndistance = min(distance, furthestPlane.y);\n}\nif (furthestPlane.z > 0.0) {\ndistance = min(distance, furthestPlane.z);\n}*/\nvec3 intersectionPosW = vPositionW + reflectionW * distance;\nreturn intersectionPosW - envMapPosW;\n}\n#endif // USE_ENVMAP_PROJECT\nvec3 fixSeams(vec3 vec, float mipLevel) {\nfloat scale = 1.0 - exp2(mipLevel) / 128.0;\nfloat M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));\nif (abs(vec.x) != M) vec.x *= scale;\nif (abs(vec.y) != M) vec.y *= scale;\nif (abs(vec.z) != M) vec.z *= scale;\nreturn vec;\n}\nvec3 getEnvColor(in samplerCube envMap, in Roughness roughness,\nin vec3 reflectionW) {\nvec3 reflectionNormW = normalize(reflectionW);\n#ifdef USE_ENVMAP_PROJECT\nif (envBoxMin.x != envBoxMax.x) {\nreflectionNormW = cubeMapProject(reflectionNormW);\n}\n#endif\nvec3 reflectionNormFixedW = fixSeams(reflectionNormW,\nroughness.envMipLevel0);\n#ifdef HAVE_TEXTURE_LOD\nvec4 cubeColorRaw0 = textureCubeLodEXT(envMap, reflectionNormFixedW,\nroughness.envMipLevel0);\n#else\nvec4 cubeColorRaw0 = textureCube(envMap, reflectionNormFixedW);\n#endif\nvec3 cubeColor0 = hdrDecode(cubeColorRaw0);\n#ifdef HAVE_TEXTURE_LOD\nvec4 cubeColorRaw1 = textureCubeLodEXT(envMap, reflectionNormFixedW,\nroughness.envMipLevel1);\n#else\nvec4 cubeColorRaw1 = textureCube(envMap2, reflectionNormFixedW);\n#endif\nvec3 cubeColor1 = hdrDecode(cubeColorRaw1);\nreturn mix(cubeColor0, cubeColor1, roughness.envMipMixFactor);\n}\nvec3 fresnelSchlickEnv(in vec3 specularColor, in Roughness roughness,\nin float clampCosnv, inout float opacity) {\nfloat fresnel = 1.0 - clampCosnv;\nfloat fresnel2 = fresnel * fresnel;\nfresnel *= fresnel2 * fresnel2;\nfresnel *= roughness.envFresnel;\nopacity = opacity + (1.0 - opacity) * fresnel;\nreturn specularColor + (1.0 - specularColor) * fresnel;\n}\nvec3 getSpecularColor(in vec3 baseColor, float metalic) {\nconst float dielectricF0 = 0.04;\nreturn mix(vec3(dielectricF0), baseColor, metalic);\n}\nfloat getLuminance(in vec3 color) {\nreturn 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;\n}\nvec3 getNormalW() {\n#ifdef USE_BUMP_TEXTURE\nvec3 normalPerturbedV = perturbNormal(-vPositionV, normalize(vNormalV));\nreturn normalize(\ninverseTransformDirection(normalPerturbedV, viewMatrix));\n#else\nreturn normalize(vNormalW);\n#endif\n}\nvec3 addSpecular(in vec3 baseColor, in vec3 totalIntensity,\ninout float opacity) {\nvec3 totalSpec = vec3(0.0, 0.0, 0.0);\n#ifdef USE_METALLIC_TEXTURE\nfloat metallic = texture2D(metallicTexture, vUv).x;\n#endif // else metallic is a uniform\nvec3 diffuseIntensity = totalIntensity * (1.0 - mix(0.04, 1.0, metallic));\nvec3 viewW = normalize(cameraPosition - vPositionW);\nvec3 normalW = getNormalW();\nfloat clampCosnv = saturate(dot(normalW, viewW));\nvec3 reflectionW = reflect(-viewW, normalW);\nvec3 specularColor = getSpecularColor(baseColor, metallic);\nRoughness roughness = getRoughnessFactors();\nvec3 envColor = getEnvColor(envMap, roughness, reflectionW);\nvec3 fresnel = fresnelSchlickEnv(specularColor, roughness,\nclampCosnv, opacity);\ntotalSpec = envColor * fresnel;\nfloat luminance = getLuminance(totalIntensity);\nreturn (baseColor * diffuseIntensity +\ntotalSpec * mix(0.4, 1.0, luminance));\n}\n#else // NOT USE_ENVMAP\nvec3 addSpecular(vec3 baseColor, in vec3 lightIntensity, in float opacity) {\nreturn baseColor * lightIntensity;\n}\n#endif\n#ifdef USE_HIGHLIGTH\nuniform vec3 highlight;\nuniform float highlightMix;\n#endif\n#if defined(HDR_OUTPUT)\nvec4 hdrEncode(in vec3 rgb) {\nconst float rgbmScale = 2.82842712;  // sqrt(8)\nvec3 r = sqrt(rgb) / rgbmScale;\nfloat m = max(max(r.r, r.g), r.b);\nm = clamp(m, 1.0 / 255.0, 1.0);\nm = ceil(m * 255.0) / 255.0;\nr /= m;\nreturn vec4(r.r, r.g, r.b, (1.0 - m));\n}\n#endif\n#ifdef USE_COLORMAP\nvec3 colormap(in sampler2D lut, in vec3 color) {\nconst float resolution = 16.0;\nconst float maxValueIndex = resolution - 1.0;\nconst float sliceWidth = 1.0 / resolution;\nconst float slicePixelWidth = sliceWidth / resolution;\nconst float sliceMarginWidth = 0.5 * slicePixelWidth;\nconst float sliceInnerWidth = sliceWidth - slicePixelWidth;\nconst float slicePixelHeight = 1.0 / resolution;\nconst float sliceMarginHeight = 0.5 * slicePixelHeight;\nconst float sliceInnerHeight = 1.0 - slicePixelHeight;\nfloat bSlice0 = min(floor(color.b * maxValueIndex), maxValueIndex - 1.0);\nfloat bSlice1 = bSlice0 + 1.0;\nfloat bOffset = color.b * maxValueIndex - bSlice0;\nfloat rSlicePos = sliceMarginWidth + color.r * sliceInnerWidth;\nfloat gSlicePos = sliceMarginHeight + color.g * sliceInnerHeight;\nfloat rPos0 = rSlicePos + (bSlice0 * sliceWidth);\nfloat rPos1 = rSlicePos + (bSlice1 * sliceWidth);\nvec3 color0 = texture2D(lut, vec2(rPos0, gSlicePos)).rgb;\nvec3 color1 = texture2D(lut, vec2(rPos1, gSlicePos)).rgb;\nreturn mix(color0, color1, bOffset);\n}\nuniform sampler2D colorMap;\n#endif\n#ifdef USE_CHROMA_KEY\nuniform vec3 chromaKeyColor;\nuniform vec3 chromaKeyDeltaCoeff;\nconst float k32 = sqrt(3.0) / 2.0;\nvec3 rgb2abi(vec3 color) {\nfloat r = color.r;\nfloat g = color.g;\nfloat b = color.b;\nreturn vec3(\nr - 0.5 * g - 0.5 * b,\nk32 * (g - b),\n0.3333 * (r + g + b));\n}\nconst float IPI2 = 0.5 / 3.1415926538;\nvec3 rgb2hci(vec3 color) {\nvec3 abi = rgb2abi(color);\nreturn vec3(\natan(abi.y, abi.x) * IPI2,\nlength(abi.xy),\nabi.z);\n}\nfloat chromaKeyShapeFn(vec3 delta, vec3 color, vec3 key) {\nvec3 diff = color - key;\nvec3 v = delta * vec3(\n0.5 - abs(abs(diff.x) - 0.5),\nabs(diff.y),\nabs(diff.z));\nfloat x = max(v.r, max(v.g, v.b));\nreturn x * x;\n}\nfloat chromaKeyEdgeFn(float a) {\nreturn clamp(.2/.5 * (a - 1.0), 0.0, 1.0);\n}\n#endif\nuniform float emissionStrength;\n#ifdef USE_EXPOSURE_AND_GAMMA\nuniform float exposure;\nuniform float cameraGamma;\n#else\nconst float exposure = 1.0f;\nconst float cameraGamma = 1.0f;\n#endif\nvoid main() {\nfloat alpha;\nvec3 baseColor = getBaseColor(alpha);\n#ifdef USE_CHROMA_KEY\nfloat dist = chromaKeyShapeFn(chromaKeyDeltaCoeff, rgb2hci(baseColor), rgb2hci(chromaKeyColor));\nalpha *= chromaKeyEdgeFn(dist);\n#endif\n#ifdef USE_BASE_COLOR_TEXTURE\nif (alpha < alphaDiscardThreshold) {\ndiscard;\n}\n#endif\nvec3 lightIntensity = getLightIntensity();\n#ifdef USE_HIGHLIGTH\nbaseColor = mix(baseColor, highlight, highlightMix);\nalpha = mix(alpha, 1.0, highlightMix);\n#endif\nvec3 diffuseSpecular = addSpecularHook(baseColor, lightIntensity, alpha);\n#ifdef USE_HEADLIGHT\nvec3 lightW = normalize(cameraPosition - vPositionW.xyz);\nfloat pointDiffuse = max(dot(normalize(vNormalW), lightW), 0.0);\ndiffuseSpecular *= pointDiffuse;\n#endif\nvec3 diffuseSpecularEmissive = diffuseSpecular + baseColor * emissionStrength;\n#ifdef USE_FOG\nfloat distance = length(vPositionV);\ndiffuseSpecularEmissive = addFog(diffuseSpecularEmissive, distance, vPositionW);\n#endif\n#ifdef HDR_OUTPUT\nif (alpha < 0.5) {\ndiscard;\n}\nfragColor = hdrEncode(diffuseSpecularEmissive);\n#else // no HDR_OUTPUT\nvec3 exposedColor = pow(exposure * diffuseSpecularEmissive.xyz,\nvec3(cameraGamma));\nvec3 gammaColor =  linearToGammaUnreal(exposedColor);\n#ifdef USE_COLORMAP\nfragColor = vec4(colormap(colorMap, min(gammaColor, 1.0)), alpha);\n#else\nfragColor = vec4(gammaColor, alpha);\n#endif\n#endif // no HDR_OUTPUT\n}\n";
  WALK.SHADERS["standard_material_vertex.glsl"] =
      "//AUTO GENERATED\nconst float PI = 3.14159265358979;\nconst float RECIPROCAL_PI2 = 0.15915494;\nfloat saturate(in float a) {\nreturn clamp(a, 0.0, 1.0);\n}\nvec3 inverseTransformDirection(in vec3 normal, in mat4 matrix) {\nreturn normalize((vec4(normal, 0.0) * matrix).xyz);\n}\nvec3 sphericalDecode(in vec2 spNormal) {\nfloat theta = (spNormal.x / 254.0 + 0.5) * PI;\nfloat phi = spNormal.y * (PI / 127.0);\nfloat sinTheta = sin(theta);\nreturn vec3(sinTheta * cos(phi), sinTheta * sin(phi), cos(theta));\n}\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\n#if defined(USE_BASE_COLOR_TEXTURE) || defined(USE_ROUGHNESS_TEXTURE) || defined(USE_METALLIC_TEXTURE) || defined(USE_BUMP_TEXTURE)\nvarOut vec2 vUv;\nuniform vec4 uvMod;\n#endif\n#ifdef USE_LIGHTMAP\nwebgl2centroid varOut vec2 vUv2;\n#endif\n#if defined(USE_BUMP_TEXTURE) || defined(USE_FOG)\nvarOut vec3 vPositionV;\n#endif\n#ifdef USE_BUMP_TEXTURE\nvarOut vec3 vNormalV;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT) || defined(USE_FOG)\nvarOut vec3 vPositionW;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvarOut vec3 vNormalW;\n#endif\nvoid main() {\n#if defined(USE_BASE_COLOR_TEXTURE) || defined(USE_ROUGHNESS_TEXTURE) || defined(USE_METALLIC_TEXTURE) || defined(USE_BUMP_TEXTURE)\nvUv = uv * uvMod.zw + uvMod.xy;\n#endif\nvec4 transformedPosition = transformPosition();\nvec4 mvPosition = modelViewMatrix * transformedPosition;\n#ifdef USE_LIGHTMAP\nfloat zeroOrOne = min(uv2.x + uv2.y, 1.0);\nvUv2 = uv2 * uv2Mod.zw + uv2Mod.xy * zeroOrOne;\n#endif\n#if defined(USE_BUMP_TEXTURE) || defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvec3 n = sphericalDecode(sphericalNormal);\nvec3 normal = vec3(\nt0.x * n.x + t0.y * n.y + t0.z * n.z,\nt1.x * n.x + t1.y * n.y + t1.z * n.z,\nt2.x * n.x + t2.y * n.y + t2.z * n.z);\n#endif\n#if defined(USE_BUMP_TEXTURE) || defined(USE_FOG)\nvPositionV = -mvPosition.xyz;\n#endif\n#if defined(USE_BUMP_TEXTURE)\nvNormalV = normalize(normalMatrix * normal);\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT) || defined(USE_FOG)\nvPositionW = (modelMatrix * transformedPosition).xyz;\n#endif\n#if defined(USE_ENVMAP) || defined(USE_HEADLIGHT)\nvNormalW = mat3(modelMatrix[0].xyz,\nmodelMatrix[1].xyz,\nmodelMatrix[2].xyz) * normal;\nvNormalW = normalize(vNormalW);\n#endif\ngl_Position = projectionMatrix * mvPosition;\n}\n";
  WALK.SHADERS["static_render_fragment.glsl"] =
      "//AUTO GENERATED\nfloat _l2g(in float x) {\nreturn (x <= 0.0031308) ? x * 12.92 : pow(x, 1.0 / 2.4) * 1.055 - 0.055;\n}\nvec3 linearToGamma(in vec3 rgb) {\nreturn vec3(_l2g(rgb.r), _l2g(rgb.g), _l2g(rgb.b));\n}\nvec3 linearToGammaUnreal(in vec3 rgb) {\nreturn rgb / (rgb + 0.187) * 1.035;\n}\nuniform sampler2D staticRender;\nuniform vec2 sizeInv;\nvoid main() {\nvec3 colorLinear = texture2D(staticRender, gl_FragCoord.xy * sizeInv).rgb;\nfragColor = vec4(linearToGammaUnreal(colorLinear), 1.0);\n}\n";
  WALK.SHADERS["static_render_vertex.glsl"] = "//AUTO GENERATED\nvoid main() {\ngl_Position = modelViewMatrix * vec4(position, 1.0);\n}\n";
  WALK.SHADERS["water.glsl"] =
      "//AUTO GENERATED\n#ifdef USE_NORMAL_TEXTURE\nuniform float time;\nuniform float wavesScale;\nuniform float refractionFactor;\nuniform sampler2D normalTexture;\nvec4 getNoise(in vec2 uv) {\nvec2 uv0 = (uv / 103.0) + vec2(time / 17.0, time / 29.0);\nvec2 uv1 = uv / 107.0 - vec2(time / -19.0, time / 31.0);\nvec2 uv2 = uv / vec2(897.0, 983.0) + vec2(time / 101.0, time / 97.0);\nvec2 uv3 = uv / vec2(991.0, 877.0) - vec2(time / 109.0, time / -113.0);\nvec4 noise = texture2D(normalTexture, uv0) +\ntexture2D(normalTexture, uv1) +\ntexture2D(normalTexture, uv2) +\ntexture2D(normalTexture, uv3);\nreturn noise * 0.5 - 1.0;\n}\nvec3 addSpecularHook(in vec3 baseColor, in vec3 totalIntensity,\ninout float opacity) {\nvec3 toEyeW = cameraPosition - vPositionW;\nvec3 viewW = normalize(toEyeW);\nvec4 noise = getNoise(vPositionW.xy * wavesScale);\nvec3 normalW = normalize(noise.xyz);\nfloat clampCosnv = saturate(dot(normalW, viewW));\nRoughness roughness;\nroughness.envMipLevel0 = 0.0;\nroughness.envMipLevel1 = 0.0;\nroughness.envMipMixFactor = 0.0;\nroughness.envFresnel = 1.0;\nconst float waterF0 = 0.02;\nvec3 specularColor = vec3(waterF0);\nvec3 reflectionW = reflect(-viewW, normalW);\nvec3 refractionW = refract(-viewW, normalW, 0.75);\nvec3 reflectedEnv = getEnvColor(envMap, roughness, normalize(reflectionW));\nvec3 refractedEnv = refractionFactor *\ngetEnvColor(envMap, roughness, normalize(refractionW));\nvec3 fresnel = fresnelSchlickEnv(specularColor, roughness,\nclampCosnv, opacity);\nvec3 totalSpec = reflectedEnv * fresnel + refractedEnv * (1.0 - fresnel);\nvec3 diffuseIntensity = totalIntensity * 0.98;\nfloat luminance = getLuminance(totalIntensity);\nreturn totalSpec * mix(0.4, 1.0, luminance) + baseColor * diffuseIntensity;\n}\n#else // NOT USE_NORMAL_TEXTURE\nvec3 addSpecularHook(in vec3 baseColor, in vec3 totalIntensity,\ninout float opacity) {\nreturn baseColor * totalIntensity;\n}\n#endif\n";
  WALK.SHADERS["wireframe_fragment.glsl"] =
      "//AUTO GENERATED\nuniform vec3 lineColor;\nuniform float lineMaxAlpha;\nuniform vec3 highlight;\nuniform float highlightMix;\nvarIn vec3 vBaryCentric;\nfloat edgeFactor(){\nvec3 d = fwidth(vBaryCentric);\nvec3 r = smoothstep(vec3(0.0), d * 1.5, vBaryCentric);\nreturn min(min(r.x, r.y), r.z);\n}\nvoid main(void){\nfloat edge = edgeFactor();\nif (edge < 1.0) {\nfragColor = vec4(lineColor, (1.0 - edge) * lineMaxAlpha);\n} else {\nfragColor = vec4(highlight, highlightMix);\n}\n}\n";
  WALK.SHADERS["wireframe_vertex.glsl"] =
      "//AUTO GENERATED\nvec4 transformPosition() {\nreturn vec4(\nt0.x * position.x + t0.y * position.y + t0.z * position.z + t0.w,\nt1.x * position.x + t1.y * position.y + t1.z * position.z + t1.w,\nt2.x * position.x + t2.y * position.y + t2.z * position.z + t2.w,\n1.0);\n}\nattr float order;\nvarOut vec3 vBaryCentric;\nvoid main() {\nif (order == 0.0) {\nvBaryCentric = vec3(1.0, 0.0, 0.0);\n} else if (order == 1.0) {\nvBaryCentric = vec3(0.0, 1.0, 0.0);\n} else {\nvBaryCentric = vec3(0.0, 0.0, 1.0);\n}\nvec4 transformedPosition = transformPosition();\ngl_Position = projectionMatrix * modelViewMatrix * transformedPosition;\n}\n";
  WALK.Shader = function (a, b) {
      this.id = a;
      this.code = b;
  };
  var Ab = 0;
  WALK.InlineShader = function (a) {
      WALK.Shader.call(this, "inline:" + Ab, a);
      Ab += 1;
  };
  WALK.getShader = function (a) {
      return new WALK.Shader(a, WALK.SHADERS[a]);
  };
  var Eb = 0,
      Fb = [0, 0],
      Gb = Object.freeze({ uv: Fb, uv2: Fb, uv2Mod: [0, 0, 1 / 65535, 1 / 65535], t0: [1, 0, 0, 0], t1: [0, 1, 0, 0], t2: [0, 0, 1, 0] }),
      Hb = Object.freeze("position sphericalNormal uv uv2 uv2Mod t0 t1 t2".split(" ")),
      Ib = new WALK.InlineShader("");
  WALK.BaseMaterial = function (a, b, c) {
      var d = this;
      c = void 0 === c ? Ib : c;
      Eb += 1;
      Object.defineProperty(this, "id", { value: Eb });
      this.name = "";
      this.side = THREE.FrontSide;
      this.doNotOverrideSide = !1;
      this.opacity = 1;
      this.transparent = !1;
      this.transparentRenderOrder = 0;
      this.blending = THREE.NoBlending;
      this.blendSrc = GLC.SRC_ALPHA;
      this.blendDst = GLC.ONE_MINUS_SRC_ALPHA;
      this.blendEquation = GLC.FUNC_ADD;
      this.blendEquationAlpha = this.blendDstAlpha = this.blendSrcAlpha = null;
      this.colorWrite = this.depthWrite = this.depthTest = !0;
      this._hideFromLightProbes = !1;
      this._defines = new Set();
      this._definesString = null;
      this._textureLodExtension = this._standardDerivativesExtension = !1;
      this.uniforms = {};
      this.attributes = Hb;
      this._vertexShaderBody = a;
      this._fragmentShaderBody = b;
      this._fragmentShaderHooks = c;
      this.defaultAttributeValues = Gb;
      this.index0AttributeName = void 0;
      this._programNeedsUpdate = this.visible = !0;
      this._sharedMaterialState = this.program = null;
      this.exposureAndGammaSupported = this.colorMapSupported = this.hdrOutputSupported = this.fogSupported = !1;
      var e = { type: "updated", target: this };
      this._updated = function () {
          return d.dispatchEvent(e);
      };
  };
  WALK.BaseMaterial.prototype = {
      constructor: WALK.BaseMaterial,
      get isAnimated() {
          return !1;
      },
      get isPlaying() {
          return !1;
      },
      update: function () {},
      rewind: function () {
          console.assert(!1);
      },
      play: function () {
          console.assert(!1);
      },
      pause: function () {
          console.assert(!1);
      },
      get hideFromLightProbes() {
          return this._hideFromLightProbes;
      },
      set hideFromLightProbes(a) {
          this._hideFromLightProbes = a;
      },
      get programNeedsUpdate() {
          return this._programNeedsUpdate;
      },
      set programNeedsUpdate(a) {
          this._definesString = null;
          this._programNeedsUpdate = a;
      },
      get sharedMaterialState() {
          return this._sharedMaterialState;
      },
      set sharedMaterialState(a) {
          this._sharedMaterialState = a;
          this._setSharedStateUpdate();
          this._applySharedState();
      },
      hasDefine: function (a) {
          return this._defines.has(a);
      },
      addDefine: function (a) {
          this.hasDefine(a) || (this._defines.add(a), (this.programNeedsUpdate = !0));
      },
      removeDefine: function (a) {
          this.hasDefine(a) && (this._defines.delete(a), (this.programNeedsUpdate = !0));
      },
      condDefine: function (a, b) {
          a ? this.addDefine(b) : this.removeDefine(b);
          return a;
      },
      _getDefinesString: function () {
          if (null === this._definesString) {
              for (var a = [], b = _.makeIterator(this._defines), c = b.next(); !c.done; c = b.next()) a.push("#define " + c.value);
              a.sort();
              this._definesString = a.join("\n");
          }
          return this._definesString;
      },
      generateProgramId: function () {
          return [this._fragmentShaderBody.id, this._fragmentShaderHooks.id, this._getDefinesString(), this._vertexShaderBody.id, this._standardDerivativesExtension ? "+" : "", this._textureLodExtension ? "+" : ""].join("$");
      },
      enableStandardDerivativesExtension: function () {
          WALK.DETECTOR.gl.webgl2 || this._standardDerivativesExtension || (this.programNeedsUpdate = this._standardDerivativesExtension = !0);
      },
      enableTextureLodExtension: function () {
          WALK.DETECTOR.gl.webgl2 || this._textureLodExtension || (this.programNeedsUpdate = this._textureLodExtension = !0);
      },
      _getShaderHeader: function () {
          return WALK.DETECTOR.gl.webgl2
              ? "#version 300 es\n#define texture2D texture\n#define textureCube texture\n#define textureCubeLodEXT textureLod\n#define texture2DGradEXT textureGrad\n#define attr in\n#define varOut out\n#define varIn in\n#define webgl2centroid centroid\n"
              : "\n#define attr attribute\n#define varOut varying\n#define varIn varying\n#define webgl2centroid\n";
      },
      generateVertexShader: function () {
          return [
              this._getShaderHeader(),
              "precision highp float;\nprecision highp int;",
              this._getDefinesString(),
              "uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattr vec3 position;\nattr vec2 sphericalNormal;\nattr vec2 uv;\nattr vec2 uv2;\nattr vec4 uv2Mod;\nattr vec4 t0;\nattr vec4 t1;\nattr vec4 t2;",
              this._vertexShaderBody.code,
          ].join("\n");
      },
      generateFragmentShader: function () {
          return [
              this._getShaderHeader(),
              this._standardDerivativesExtension ? "#extension GL_OES_standard_derivatives : enable" : "",
              this._textureLodExtension ? "#extension GL_EXT_shader_texture_lod : require" : "",
              "precision " + WALK.DETECTOR.gl.fragmentPrecision + " float;",
              "precision " + WALK.DETECTOR.gl.fragmentPrecision + " int;",
              this._getDefinesString(),
              "uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;",
              WALK.DETECTOR.gl.webgl2 ? "out vec4 fragColor;" : "#define fragColor gl_FragColor",
              this._fragmentShaderBody.code,
              this._fragmentShaderHooks.code,
          ].join("\n");
      },
      dispose: function () {
          this.dispatchEvent({ type: "dispose" });
      },
      setUniform: function (a, b, c) {
          this.uniforms[a] = { type: b, value: c };
      },
      propertyFromUniform: function (a) {
          Object.defineProperty(this, a, {
              get: function () {
                  return this.uniforms[a].value;
              },
              set: function (b) {
                  this.uniforms[a].value = b;
              },
          });
      },
      hash: function () {
          console.assert(!1, "hash not implemented");
      },
      canMerge: function () {
          console.assert(!1, "canMerge not implemented");
      },
      _setSharedStateUpdate: function () {
          var a = this;
          this._sharedMaterialState.addEventListener("updated", function () {
              a._applySharedState() && a._updated();
          });
      },
      _applySharedState: function () {
          var a = !1;
          if (this.fogSupported) {
              a = this.sharedMaterialState.fog;
              if (this.condDefine(null !== a && a.enabled(), "USE_FOG")) {
                  var b = a.heightEnabled ? a.heightDensity : 0;
                  this.setUniform("distanceDensity", "f", a.distanceEnabled ? a.distanceDensity : 0);
                  this.setUniform("distanceStart", "f", a.distanceStart);
                  this.setUniform("heightDensity", "f", b);
                  this.setUniform("heightStart", "f", a.heightStart);
                  this.setUniform("color", "c", a.color);
              }
              a = !0;
          }
          this.hdrOutputSupported && (this.condDefine(this.sharedMaterialState.hdrOutput, "HDR_OUTPUT"), (a = !0));
          this.colorMapSupported && ((a = this.sharedMaterialState.colorMap), this.condDefine(null !== a, "USE_COLORMAP") && this.setUniform("colorMap", "t", a), (a = !0));
          this.exposureAndGammaSupported &&
              (this.addDefine("USE_EXPOSURE_AND_GAMMA"), this.setUniform("exposure", "f", Math.pow(2, this.sharedMaterialState.cameraExposure)), this.setUniform("cameraGamma", "f", this.sharedMaterialState.cameraGamma), (a = !0));
          return a;
      },
  };
  THREE.EventDispatcher.prototype.apply(WALK.BaseMaterial.prototype);
  THREE.FXAAShader = {
      uniforms: { tDiffuse: { type: "t", value: null }, resolution: { type: "v2", value: new THREE.Vector2(1 / 1024, 1 / 512) } },
      vertexShader: new WALK.InlineShader("void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"),
      fragmentShader: new WALK.InlineShader(
          "uniform sampler2D tDiffuse;\nuniform vec2 resolution;\n#define FXAA_REDUCE_MIN   (1.0/128.0)\n#define FXAA_REDUCE_MUL   (1.0/8.0)\n#define FXAA_SPAN_MAX     8.0\nvoid main() {\nvec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;\nvec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;\nvec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );\nvec3 rgbM  = rgbaM.xyz;\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat lumaNW = dot( rgbNW, luma );\nfloat lumaNE = dot( rgbNE, luma );\nfloat lumaSW = dot( rgbSW, luma );\nfloat lumaSE = dot( rgbSE, luma );\nfloat lumaM  = dot( rgbM,  luma );\nfloat lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );\nfloat lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );\nvec2 dir;\ndir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\ndir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\nfloat dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );\nfloat rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\ndir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),\nmax( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\ndir * rcpDirMin)) * resolution;\nvec4 rgbA = (1.0/2.0) * (\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (1.0/3.0 - 0.5)) +\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (2.0/3.0 - 0.5)));\nvec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (0.0/3.0 - 0.5)) +\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (3.0/3.0 - 0.5)));\nfloat lumaB = dot(rgbB, vec4(luma, 0.0));\nif ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {\nfragColor = rgbA;\n} else {\nfragColor = rgbB;\n}\n}"
      ),
  };
  THREE.EffectComposer = function (a) {
      this.renderer = a;
      this.renderTarget2 = this.renderTarget1 = null;
      this.passes = [];
  };
  THREE.EffectComposer.prototype = {
      addPass: function (a) {
          this.passes.push(a);
      },
      disposeTarget: function () {
          this.renderTarget1 && (this.renderTarget1.dispose(), (this.renderTarget1 = null));
          this.renderTarget2 && (this.renderTarget2.dispose(), (this.renderTarget2 = null));
      },
      configureTarget: function (a, b, c) {
          this.disposeTarget();
          this.renderTarget1 = this.renderer.createRenderTarget(a, b, c);
          this.renderTarget2 = this.renderer.createRenderTarget(a, b, c);
      },
      render: (function () {
          var a, b;
          return function (c) {
              a = this.renderTarget1;
              b = this.renderTarget2;
              var d,
                  e = this.passes.length;
              for (d = 0; d < e; d++) {
                  var f = this.passes[d];
                  f.enabled && (f.render(this.renderer, a, b, c), f.needsSwap && d != e - 1 && ((f = b), (b = a), (a = f)));
              }
          };
      })(),
  };
  THREE.ShaderPass = function (a, b) {
      this.textureID = void 0 !== b ? b : "tDiffuse";
      this.material = new WALK.BaseMaterial(a.vertexShader, a.fragmentShader);
      this.material.uniforms = THREE.UniformsUtils.clone(a.uniforms);
      this.uniforms = this.material.uniforms;
      this.renderToScreen = !1;
      this.needsSwap = this.enabled = !0;
      this.clear = !1;
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this.scene = new THREE.Scene();
      this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material);
      this.scene.add(this.quad);
  };
  THREE.ShaderPass.prototype = {
      render: function (a, b, c) {
          var d = this.material.uniforms[this.textureID];
          d && (d.value = c);
          this.renderToScreen ? a.render(this.scene, this.camera) : a.render(this.scene, this.camera, b, this.clear);
      },
      dispose: function () {
          this.material.dispose();
          this.quad.geometry.dispose();
      },
  };
  THREE.RenderPass = function (a, b, c) {
      this.scene = a;
      this.camera = b;
      this.overrideMaterial = c;
      this.needsSwap = this.clear = this.enabled = !0;
  };
  THREE.RenderPass.prototype = {
      render: function (a, b) {
          var c = this.scene.overrideMaterial;
          this.overrideMaterial && (this.scene.overrideMaterial = this.overrideMaterial);
          a.render(this.scene, this.camera, b, this.clear);
          this.scene.overrideMaterial = c;
      },
  };
  function Jb(a) {
      return !isNaN(a) && isFinite(a);
  }
  function Kb(a, b) {
      for (var c = 0, d = a.length; c < d; c++) if (a[c] === b) return c;
      return -1;
  }
  THREE.Octree = function (a) {
      a = a || {};
      this.nodeCount = 0;
      this.INDEX_INSIDE_CROSS = -1;
      this.INDEX_OUTSIDE_OFFSET = 2;
      this.INDEX_OUTSIDE_POS_X = Jb(a.INDEX_OUTSIDE_POS_X) ? a.INDEX_OUTSIDE_POS_X : 0;
      this.INDEX_OUTSIDE_NEG_X = Jb(a.INDEX_OUTSIDE_NEG_X) ? a.INDEX_OUTSIDE_NEG_X : 1;
      this.INDEX_OUTSIDE_POS_Y = Jb(a.INDEX_OUTSIDE_POS_Y) ? a.INDEX_OUTSIDE_POS_Y : 2;
      this.INDEX_OUTSIDE_NEG_Y = Jb(a.INDEX_OUTSIDE_NEG_Y) ? a.INDEX_OUTSIDE_NEG_Y : 3;
      this.INDEX_OUTSIDE_POS_Z = Jb(a.INDEX_OUTSIDE_POS_Z) ? a.INDEX_OUTSIDE_POS_Z : 4;
      this.INDEX_OUTSIDE_NEG_Z = Jb(a.INDEX_OUTSIDE_NEG_Z) ? a.INDEX_OUTSIDE_NEG_Z : 5;
      this.INDEX_OUTSIDE_MAP = [];
      this.INDEX_OUTSIDE_MAP[this.INDEX_OUTSIDE_POS_X] = { index: this.INDEX_OUTSIDE_POS_X, count: 0, x: 1, y: 0, z: 0 };
      this.INDEX_OUTSIDE_MAP[this.INDEX_OUTSIDE_NEG_X] = { index: this.INDEX_OUTSIDE_NEG_X, count: 0, x: -1, y: 0, z: 0 };
      this.INDEX_OUTSIDE_MAP[this.INDEX_OUTSIDE_POS_Y] = { index: this.INDEX_OUTSIDE_POS_Y, count: 0, x: 0, y: 1, z: 0 };
      this.INDEX_OUTSIDE_MAP[this.INDEX_OUTSIDE_NEG_Y] = { index: this.INDEX_OUTSIDE_NEG_Y, count: 0, x: 0, y: -1, z: 0 };
      this.INDEX_OUTSIDE_MAP[this.INDEX_OUTSIDE_POS_Z] = { index: this.INDEX_OUTSIDE_POS_Z, count: 0, x: 0, y: 0, z: 1 };
      this.INDEX_OUTSIDE_MAP[this.INDEX_OUTSIDE_NEG_Z] = { index: this.INDEX_OUTSIDE_NEG_Z, count: 0, x: 0, y: 0, z: -1 };
      this.FLAG_POS_X = 1 << (this.INDEX_OUTSIDE_POS_X + 1);
      this.FLAG_NEG_X = 1 << (this.INDEX_OUTSIDE_NEG_X + 1);
      this.FLAG_POS_Y = 1 << (this.INDEX_OUTSIDE_POS_Y + 1);
      this.FLAG_NEG_Y = 1 << (this.INDEX_OUTSIDE_NEG_Y + 1);
      this.FLAG_POS_Z = 1 << (this.INDEX_OUTSIDE_POS_Z + 1);
      this.FLAG_NEG_Z = 1 << (this.INDEX_OUTSIDE_NEG_Z + 1);
      this.utilVec31Search = new THREE.Vector3();
      this.utilVec32Search = new THREE.Vector3();
      if ((this.scene = a.scene)) (this.visualGeometry = new THREE.BoxBufferGeometry(1, 1, 1)), this.visualGeometry.addTriangleOrderAttribute(), (this.visualMaterial = new WALK.WireframeMaterial(new THREE.Color(65280)));
      this.depthMax = Jb(a.depthMax) ? a.depthMax : Infinity;
      this.objectsThreshold = Jb(a.objectsThreshold) ? a.objectsThreshold : 8;
      this.overlapPct = Jb(a.overlapPct) ? a.overlapPct : 0.15;
      this.root = new THREE.OctreeNode({ tree: this, parent: null, position: new THREE.Vector3() });
  };
  THREE.Octree.prototype = {
      add: function (a, b, c) {
          b || ((b = a.geometry.boundingSphere.center), (c = a.geometry.boundingSphere.radius));
          0 !== c && this.root.addObject(new THREE.OctreeObjectData(a, b, c));
      },
      search: function (a, b, c) {
          var d,
              e = [];
          this.root.appendObjectsFromNode(e);
          0 < b || (b = Number.MAX_VALUE);
          if (c instanceof THREE.Vector3) {
              c = this.utilVec31Search.copy(c).normalize();
              var f = this.utilVec32Search.set(1, 1, 1).divide(c);
          }
          var g = 0;
          for (d = this.root.nodesIndices.length; g < d; g++) {
              var h = this.root.nodesByIndex[this.root.nodesIndices[g]];
              h.search(a, b, c, f, e);
          }
          return e;
      },
      setRoot: function (a) {
          a instanceof THREE.OctreeNode && ((this.root = a), this.root.updateProperties());
      },
      getDepthEnd: function () {
          return this.root.getDepthEnd();
      },
      getNodeCountEnd: function () {
          return this.root.getNodeCountEnd();
      },
      getObjectCountEnd: function () {
          return this.root.getObjectCountEnd();
      },
      toConsole: function () {
          this.root.toConsole();
      },
  };
  THREE.OctreeObjectData = function (a, b, c) {
      this.object = a;
      this.radius = c;
      this.position = b;
  };
  var Lb = new THREE.Vector3(),
      Mb = new THREE.Vector3();
  new THREE.Vector3();
  THREE.OctreeNode = function (a) {
      this.tree = a.tree;
      this.id = this.tree.nodeCount++;
      this.position = a.position;
      this.radius = 0 < a.radius ? a.radius : 1;
      this.indexOctant = a.indexOctant;
      this.depth = 0;
      this.reset();
      this.setParent(a.parent);
      this.overlap = this.radius * this.tree.overlapPct;
      this.radiusOverlap = this.radius + this.overlap;
      this.left = this.position.x - this.radiusOverlap;
      this.right = this.position.x + this.radiusOverlap;
      this.bottom = this.position.y - this.radiusOverlap;
      this.top = this.position.y + this.radiusOverlap;
      this.back = this.position.z - this.radiusOverlap;
      this.front = this.position.z + this.radiusOverlap;
      this.tree.scene &&
          ((this.visual = new THREE.Mesh(this.tree.visualGeometry, this.tree.visualMaterial)),
          this.visual.scale.set(2 * this.radiusOverlap, 2 * this.radiusOverlap, 2 * this.radiusOverlap),
          this.visual.position.copy(this.position),
          this.tree.scene.add(this.visual),
          this.tree.scene.updateMatrixWorld());
  };
  THREE.OctreeNode.prototype = {
      setParent: function (a) {
          a !== this && this.parent !== a && ((this.parent = a), this.updateProperties());
      },
      updateProperties: function () {
          var a;
          this.parent instanceof THREE.OctreeNode ? ((this.tree = this.parent.tree), (this.depth = this.parent.depth + 1)) : (this.depth = 0);
          var b = 0;
          for (a = this.nodesIndices.length; b < a; b++) this.nodesByIndex[this.nodesIndices[b]].updateProperties();
      },
      reset: function (a, b) {
          var c,
              d = this.nodesIndices || [],
              e = this.nodesByIndex;
          this.objects = [];
          this.nodesIndices = [];
          this.nodesByIndex = {};
          var f = 0;
          for (c = d.length; f < c; f++) {
              var g = e[d[f]];
              g.setParent(void 0);
              !0 === a && g.reset(a, b);
          }
          !0 === b && this.visual && this.visual.parent && this.visual.parent.remove(this.visual);
      },
      addNode: function (a, b) {
          a.indexOctant = b;
          -1 === Kb(this.nodesIndices, b) && this.nodesIndices.push(b);
          this.nodesByIndex[b] = a;
          a.parent !== this && a.setParent(this);
      },
      removeNode: function (a) {
          var b = Kb(this.nodesIndices, a);
          this.nodesIndices.splice(b, 1);
          var c = c || this.nodesByIndex[a];
          delete this.nodesByIndex[a];
          c.parent === this && c.setParent(void 0);
      },
      addObject: function (a) {
          var b = this.getOctantIndex(a);
          -1 < b && 0 < this.nodesIndices.length
              ? ((b = this.branch(b)), b.addObject(a))
              : -1 > b && this.parent instanceof THREE.OctreeNode
              ? this.parent.addObject(a)
              : ((b = Kb(this.objects, a)), -1 === b && this.objects.push(a), (a.node = this), this.checkGrow());
      },
      addObjectWithoutCheck: function (a) {
          var b;
          var c = 0;
          for (b = a.length; c < b; c++) {
              var d = a[c];
              this.objects.push(d);
              d.node = this;
          }
      },
      checkGrow: function () {
          this.objects.length > this.tree.objectsThreshold && 0 < this.tree.objectsThreshold && this.grow();
      },
      grow: function () {
          var a = [],
              b = [],
              c = [],
              d = [],
              e = [],
              f;
          var g = 0;
          for (f = this.objects.length; g < f; g++) {
              var h = this.objects[g];
              var l = this.getOctantIndex(h);
              -1 < l ? (c.push(h), d.push(l)) : -1 > l ? (a.push(h), b.push(l)) : e.push(h);
          }
          0 < c.length && (e = e.concat(this.split(c, d)));
          0 < a.length && (e = e.concat(this.expand(a, b)));
          this.objects = e;
          this.checkMerge();
      },
      split: function (a, b) {
          var c;
          if (this.depth < this.tree.depthMax) {
              a = a || this.objects;
              b = b || [];
              var d = [];
              var e = 0;
              for (c = a.length; e < c; e++) {
                  var f = a[e];
                  var g = b[e];
                  -1 < g ? ((g = this.branch(g)), g.addObject(f)) : d.push(f);
              }
              a === this.objects && (this.objects = d);
          } else d = this.objects;
          return d;
      },
      branch: function (a) {
          if (this.nodesByIndex[a] instanceof THREE.OctreeNode) var b = this.nodesByIndex[a];
          else {
              b = 0.5 * this.radiusOverlap;
              var c = b * this.tree.overlapPct;
              c = b - c;
              c = Lb.set(a & 1 ? c : -c, a & 2 ? c : -c, a & 4 ? c : -c);
              c = new THREE.Vector3().addVectors(this.position, c);
              b = new THREE.OctreeNode({ tree: this.tree, parent: this, position: c, radius: b, indexOctant: a });
              this.addNode(b, a);
          }
          return b;
      },
      expand: function (a, b) {
          var c,
              d = this.tree.INDEX_OUTSIDE_MAP;
          if (this.tree.root.getDepthEnd() < this.tree.depthMax) {
              a = a || this.objects;
              b = b || [];
              var e = [];
              var f = [];
              var g = 0;
              for (c = d.length; g < c; g++) d[g].count = 0;
              g = 0;
              for (c = a.length; g < c; g++) {
                  var h = a[g];
                  var l = b[g];
                  -1 > l
                      ? ((l = -l - this.tree.INDEX_OUTSIDE_OFFSET),
                        l & this.tree.FLAG_POS_X ? d[this.tree.INDEX_OUTSIDE_POS_X].count++ : l & this.tree.FLAG_NEG_X && d[this.tree.INDEX_OUTSIDE_NEG_X].count++,
                        l & this.tree.FLAG_POS_Y ? d[this.tree.INDEX_OUTSIDE_POS_Y].count++ : l & this.tree.FLAG_NEG_Y && d[this.tree.INDEX_OUTSIDE_NEG_Y].count++,
                        l & this.tree.FLAG_POS_Z ? d[this.tree.INDEX_OUTSIDE_POS_Z].count++ : l & this.tree.FLAG_NEG_Z && d[this.tree.INDEX_OUTSIDE_NEG_Z].count++,
                        f.push(h))
                      : e.push(h);
              }
              if (0 < f.length) {
                  var m = d.slice(0);
                  m.sort(function (a, b) {
                      return b.count - a.count;
                  });
                  l = m[0];
                  g = l.index | 1;
                  h = m[1];
                  d = m[2];
                  b = (h.index | 1) !== g ? h : d;
                  c = b.index | 1;
                  h = m[2];
                  d = m[3];
                  m = m[4];
                  var n = h.index | 1;
                  var p = d.index | 1;
                  h = n !== g && n !== c ? h : p !== g && p !== c ? d : m;
                  g = l.x + b.x + h.x;
                  c = l.y + b.y + h.y;
                  b = l.z + b.z + h.z;
                  l = this.getOctantIndexFromPosition(g, c, b);
                  b = this.getOctantIndexFromPosition(-g, -c, -b);
                  c = this.overlap;
                  h = this.radius;
                  g = 0 < this.tree.overlapPct ? c / (0.5 * this.tree.overlapPct * (1 + this.tree.overlapPct)) : 2 * h;
                  d = g * this.tree.overlapPct;
                  c = g + d - (h + c);
                  Mb.set(l & 1 ? c : -c, l & 2 ? c : -c, l & 4 ? c : -c);
                  l = new THREE.Vector3().addVectors(this.position, Mb);
                  l = new THREE.OctreeNode({ tree: this.tree, position: l, radius: g });
                  l.addNode(this, b);
                  this.tree.setRoot(l);
                  g = 0;
                  for (c = f.length; g < c; g++) this.tree.root.addObject(f[g]);
              }
              a === this.objects && (this.objects = e);
          } else e = a;
          return e;
      },
      shrink: function () {
          this.checkMerge();
          this.tree.root.checkContract();
      },
      checkMerge: function () {
          for (var a = this, b; a.parent instanceof THREE.OctreeNode && a.getObjectCountEnd() < this.tree.objectsThreshold; ) (b = a), (a = a.parent);
          a !== this && a.merge(b);
      },
      merge: function (a) {
          var b;
          a = a ? (("[object Array]" === Object.prototype.toString.call(a)) !== !0 ? [a] : a) : [];
          var c = 0;
          for (b = a.length; c < b; c++) {
              var d = a[c];
              this.addObjectWithoutCheck(d.getObjectsEnd());
              d.reset(!0, !0);
              this.removeNode(d.indexOctant, d);
          }
          this.checkMerge();
      },
      checkContract: function () {
          var a;
          if (0 < this.nodesIndices.length) {
              var b = 0;
              var c = this.objects.length;
              var d = 0;
              for (a = this.nodesIndices.length; d < a; d++) {
                  var e = this.nodesByIndex[this.nodesIndices[d]];
                  var f = e.getObjectCountEnd();
                  c += f;
                  if (!1 === g instanceof THREE.OctreeNode || f > b) {
                      var g = e;
                      b = f;
                  }
              }
              c - b < this.tree.objectsThreshold && g instanceof THREE.OctreeNode && this.contract(g);
          }
      },
      contract: function (a) {
          var b;
          var c = 0;
          for (b = this.nodesIndices.length; c < b; c++) {
              var d = this.nodesByIndex[this.nodesIndices[c]];
              d !== a && (a.addObjectWithoutCheck(d.getObjectsEnd()), d.reset(!0, !0));
          }
          a.addObjectWithoutCheck(this.objects);
          this.reset(!1, !0);
          this.tree.setRoot(a);
          a.checkContract();
      },
      getOctantIndex: function (a) {
          var b = this.position,
              c = this.radiusOverlap,
              d = this.overlap,
              e = 0;
          if (a instanceof THREE.OctreeObjectData) {
              var f = a.radius;
              var g = a.position;
          } else a instanceof THREE.OctreeNode && ((g = a.position), (f = 0));
          var h = g.x - b.x;
          var l = g.y - b.y;
          g = g.z - b.z;
          b = Math.abs(h);
          var m = Math.abs(l);
          var n = Math.abs(g);
          if (Math.max(b, m, n) + f > c)
              return (
                  b + f > c && (e ^= 0 < h ? this.tree.FLAG_POS_X : this.tree.FLAG_NEG_X),
                  m + f > c && (e ^= 0 < l ? this.tree.FLAG_POS_Y : this.tree.FLAG_NEG_Y),
                  n + f > c && (e ^= 0 < g ? this.tree.FLAG_POS_Z : this.tree.FLAG_NEG_Z),
                  (a.indexOctant = -e - this.tree.INDEX_OUTSIDE_OFFSET),
                  a.indexOctant
              );
          if (h - f > -d) e |= 1;
          else if (!(h + f < d)) return (a.indexOctant = this.tree.INDEX_INSIDE_CROSS), a.indexOctant;
          if (l - f > -d) e |= 2;
          else if (!(l + f < d)) return (a.indexOctant = this.tree.INDEX_INSIDE_CROSS), a.indexOctant;
          if (g - f > -d) e |= 4;
          else if (!(g + f < d)) return (a.indexOctant = this.tree.INDEX_INSIDE_CROSS), a.indexOctant;
          a.indexOctant = e;
          return a.indexOctant;
      },
      getOctantIndexFromPosition: function (a, b, c) {
          var d = 0;
          0 < a && (d |= 1);
          0 < b && (d |= 2);
          0 < c && (d |= 4);
          return d;
      },
      appendObjectsFromNode: function (a) {
          var b,
              c = this.objects;
          var d = 0;
          for (b = c.length; d < b; d += 1) a.push(c[d].object);
      },
      search: function (a, b, c, d, e) {
          var f;
          if (!0 === this.intersectRay(a, c, b, d)) {
              this.appendObjectsFromNode(e);
              var g = 0;
              for (f = this.nodesIndices.length; g < f; g++) {
                  var h = this.nodesByIndex[this.nodesIndices[g]];
                  h.search(a, b, c, d, e);
              }
          }
      },
      intersectRay: function (a, b, c, d) {
          b = (this.left - a.x) * d.x;
          var e = (this.right - a.x) * d.x,
              f = (this.bottom - a.y) * d.y,
              g = (this.top - a.y) * d.y,
              h = (this.back - a.z) * d.z;
          d = (this.front - a.z) * d.z;
          a = Math.min(Math.min(Math.max(b, e), Math.max(f, g)), Math.max(h, d));
          if (0 > a) return !1;
          b = Math.max(Math.max(Math.min(b, e), Math.min(f, g)), Math.min(h, d));
          return b > a || b > c ? !1 : !0;
      },
      getDepthEnd: function (a) {
          var b;
          if (0 < this.nodesIndices.length) {
              var c = 0;
              for (b = this.nodesIndices.length; c < b; c++) {
                  var d = this.nodesByIndex[this.nodesIndices[c]];
                  a = d.getDepthEnd(a);
              }
          } else a = !a || this.depth > a ? this.depth : a;
          return a;
      },
      getNodeCountEnd: function () {
          return this.tree.root.getNodeCountRecursive() + 1;
      },
      getNodeCountRecursive: function () {
          var a,
              b = this.nodesIndices.length;
          var c = 0;
          for (a = this.nodesIndices.length; c < a; c++) b += this.nodesByIndex[this.nodesIndices[c]].getNodeCountRecursive();
          return b;
      },
      getObjectsEnd: function (a) {
          var b;
          a = (a || []).concat(this.objects);
          var c = 0;
          for (b = this.nodesIndices.length; c < b; c++) {
              var d = this.nodesByIndex[this.nodesIndices[c]];
              a = d.getObjectsEnd(a);
          }
          return a;
      },
      getObjectCountEnd: function () {
          var a,
              b = this.objects.length;
          var c = 0;
          for (a = this.nodesIndices.length; c < a; c++) b += this.nodesByIndex[this.nodesIndices[c]].getObjectCountEnd();
          return b;
      },
      getObjectCountStart: function () {
          for (var a = this.objects.length, b = this.parent; b instanceof THREE.OctreeNode; ) (a += b.objects.length), (b = b.parent);
          return a;
      },
      toConsole: function (a) {
          var b;
          a = "string" === typeof a ? a : "   ";
          console.log(
              this.parent ? a + " octree NODE > " : " octree ROOT > ",
              this,
              " // id: ",
              this.id,
              " // indexOctant: ",
              this.indexOctant,
              " // position: ",
              this.position.x,
              this.position.y,
              this.position.z,
              " // radius: ",
              this.radius,
              " // depth: ",
              this.depth
          );
          console.log(this.parent ? a + " " : " ", "+ objects ( ", this.objects.length, " ) ", this.objects);
          console.log(this.parent ? a + " " : " ", "+ children ( ", this.nodesIndices.length, " )", this.nodesIndices, this.nodesByIndex);
          var c = 0;
          for (b = this.nodesIndices.length; c < b; c++) {
              var d = this.nodesByIndex[this.nodesIndices[c]];
              d.toConsole(a + "   ");
          }
      },
  };
  THREE.PolyhedronBufferGeometry = function (a, b, c, d) {
      function e(a) {
          h.push(a.x, a.y, a.z);
      }
      function f(b, c) {
          b *= 3;
          c.x = a[b + 0];
          c.y = a[b + 1];
          c.z = a[b + 2];
      }
      function g(a, b, c, d) {
          0 > d && 1 === a.x && (l[b] = a.x - 1);
          0 === c.x && 0 === c.z && (l[b] = d / 2 / Math.PI + 0.5);
      }
      THREE.BufferGeometry.call(this);
      this.type = "PolyhedronBufferGeometry";
      this.parameters = { vertices: a, indices: b, radius: c, detail: d };
      c = c || 1;
      d = d || 0;
      var h = [],
          l = [];
      (function (a) {
          for (var c = new THREE.Vector3(), d = new THREE.Vector3(), g = new THREE.Vector3(), h = 0; h < b.length; h += 3) {
              f(b[h + 0], c);
              f(b[h + 1], d);
              f(b[h + 2], g);
              var l,
                  m,
                  w = c,
                  y = d,
                  z = g,
                  x = Math.pow(2, a),
                  A = [];
              for (m = 0; m <= x; m++) {
                  A[m] = [];
                  var B = w.clone().lerp(z, m / x),
                      L = y.clone().lerp(z, m / x),
                      C = x - m;
                  for (l = 0; l <= C; l++) A[m][l] = 0 === l && m === x ? B : B.clone().lerp(L, l / C);
              }
              for (m = 0; m < x; m++) for (l = 0; l < 2 * (x - m) - 1; l++) (w = Math.floor(l / 2)), 0 === l % 2 ? (e(A[m][w + 1]), e(A[m + 1][w]), e(A[m][w])) : (e(A[m][w + 1]), e(A[m + 1][w + 1]), e(A[m + 1][w]));
          }
      })(d);
      (function (a) {
          for (var b = new THREE.Vector3(), c = 0; c < h.length; c += 3) (b.x = h[c + 0]), (b.y = h[c + 1]), (b.z = h[c + 2]), b.normalize().multiplyScalar(a), (h[c + 0] = b.x), (h[c + 1] = b.y), (h[c + 2] = b.z);
      })(c);
      (function () {
          for (var a = new THREE.Vector3(), b = 0; b < h.length; b += 3)
              (a.x = h[b + 0]), (a.y = h[b + 1]), (a.z = h[b + 2]), l.push(Math.atan2(a.z, -a.x) / 2 / Math.PI + 0.5, 1 - (Math.atan2(-a.y, Math.sqrt(a.x * a.x + a.z * a.z)) / Math.PI + 0.5));
          a = new THREE.Vector3();
          b = new THREE.Vector3();
          for (var c = new THREE.Vector3(), d = new THREE.Vector3(), e = new THREE.Vector2(), f = new THREE.Vector2(), v = new THREE.Vector2(), w = 0, y = 0; w < h.length; w += 9, y += 6) {
              a.set(h[w + 0], h[w + 1], h[w + 2]);
              b.set(h[w + 3], h[w + 4], h[w + 5]);
              c.set(h[w + 6], h[w + 7], h[w + 8]);
              e.set(l[y + 0], l[y + 1]);
              f.set(l[y + 2], l[y + 3]);
              v.set(l[y + 4], l[y + 5]);
              d.copy(a).add(b).add(c).divideScalar(3);
              var z = Math.atan2(d.z, -d.x);
              g(e, y + 0, a, z);
              g(f, y + 2, b, z);
              g(v, y + 4, c, z);
          }
          for (a = 0; a < l.length; a += 6)
              (b = l[a + 0]), (c = l[a + 2]), (d = l[a + 4]), (e = Math.min(b, c, d)), 0.9 < Math.max(b, c, d) && 0.1 > e && (0.2 > b && (l[a + 0] += 1), 0.2 > c && (l[a + 2] += 1), 0.2 > d && (l[a + 4] += 1));
      })();
      this.addAttribute("position", new THREE.BufferAttribute(new Float32Array(h), 3));
      this.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(h.slice()), 3));
      this.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(l), 2));
      0 === d ? this.computeVertexNormals() : this.normalizeNormals();
  };
  THREE.PolyhedronBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  THREE.PolyhedronBufferGeometry.prototype.constructor = THREE.PolyhedronBufferGeometry;
  THREE.IcosahedronBufferGeometry = function (a, b) {
      var c = (1 + Math.sqrt(5)) / 2;
      THREE.PolyhedronBufferGeometry.call(
          this,
          [-1, c, 0, 1, c, 0, -1, -c, 0, 1, -c, 0, 0, -1, c, 0, 1, c, 0, -1, -c, 0, 1, -c, c, 0, -1, c, 0, 1, -c, 0, -1, -c, 0, 1],
          [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1],
          a,
          b
      );
      this.type = "IcosahedronBufferGeometry";
      this.parameters = { radius: a, detail: b };
  };
  THREE.IcosahedronBufferGeometry.prototype = Object.create(THREE.PolyhedronBufferGeometry.prototype);
  THREE.IcosahedronBufferGeometry.prototype.constructor = THREE.IcosahedronBufferGeometry;
  var Pb = Math,
      Qb = Pb.abs,
      Rb = Pb.cos,
      Sb = Pb.sin,
      Tb = Pb.acos,
      Vb = Pb.atan2,
      Yb = Pb.sqrt,
      Zb = Pb.pow;
  function $b(a) {
      return 0 > a ? -Zb(-a, 1 / 3) : Zb(a, 1 / 3);
  }
  var ac = Math.PI,
  bc = 2 * ac,
  cc = ac / 2,
  dc = Number.MAX_SAFE_INTEGER || 9007199254740991,
  ec = Number.MIN_SAFE_INTEGER || -9007199254740991,
  fc = { x: 0, y: 0, z: 0 },
  PolygonUtils = {
      Tvalues: [
          -0.06405689286260563,
          0.06405689286260563,
          -0.1911188674736163,
          0.1911188674736163,
          -0.3150426796961634,
          0.3150426796961634,
          -0.4337935076260451,
          0.4337935076260451,
          -0.5454214713888396,
          0.5454214713888396,
          -0.6480936519369755,
          0.6480936519369755,
          -0.7401241915785544,
          0.7401241915785544,
          -0.820001985973903,
          0.820001985973903,
          -0.8864155270044011,
          0.8864155270044011,
          -0.9382745520027328,
          0.9382745520027328,
          -0.9747285559713095,
          0.9747285559713095,
          -0.9951872199970213,
          0.9951872199970213,
      ],
      Cvalues: [
          0.12793819534675216,
          0.12793819534675216,
          0.1258374563468283,
          0.1258374563468283,
          0.12167047292780339,
          0.12167047292780339,
          0.1155056680537256,
          0.1155056680537256,
          0.10744427011596563,
          0.10744427011596563,
          0.09761865210411388,
          0.09761865210411388,
          0.08619016153195327,
          0.08619016153195327,
          0.0733464814110803,
          0.0733464814110803,
          0.05929858491543678,
          0.05929858491543678,
          0.04427743881741981,
          0.04427743881741981,
          0.028531388628933663,
          0.028531388628933663,
          0.0123412297999872,
          0.0123412297999872,
      ],
      arcfn: function (a, b) {
          a = b(a);
          b = a.x * a.x + a.y * a.y;
          "undefined" !== typeof a.z && (b += a.z * a.z);
          return Yb(b);
      },
      compute: function (a, b, c) {
          if (0 === a) return (b[0].t = 0), b[0];
          var d = b.length - 1;
          if (1 === a) return (b[d].t = 1), b[d];
          var e = 1 - a,
              f = b;
          if (0 === d) return (b[0].t = a), b[0];
          if (1 === d) {
              var g = { x: e * f[0].x + a * f[1].x, y: e * f[0].y + a * f[1].y, t: a };
              c && (g.z = e * f[0].z + a * f[1].z);
              return g;
          }
          if (4 > d) {
              var h = e * e,
                  l = a * a;
              b = 0;
              if (2 === d) {
                  f = [f[0], f[1], f[2], fc];
                  g = h;
                  var m = e * a * 2;
                  var n = l;
              } else 3 === d && ((g = h * e), (m = h * a * 3), (n = e * l * 3), (b = a * l));
              a = { x: g * f[0].x + m * f[1].x + n * f[2].x + b * f[3].x, y: g * f[0].y + m * f[1].y + n * f[2].y + b * f[3].y, t: a };
              c && (a.z = g * f[0].z + m * f[1].z + n * f[2].z + b * f[3].z);
              return a;
          }
          for (c = JSON.parse(JSON.stringify(b)); 1 < c.length; ) {
              for (f = 0; f < c.length - 1; f++) (c[f] = { x: c[f].x + (c[f + 1].x - c[f].x) * a, y: c[f].y + (c[f + 1].y - c[f].y) * a }), "undefined" !== typeof c[f].z && (c[f] = c[f].z + (c[f + 1].z - c[f].z) * a);
              c.splice(c.length - 1, 1);
          }
          c[0].t = a;
          return c[0];
      },
      computeWithRatios: function (a, b, c, d) {
          var e = 1 - a,
              f = c[0],
              g = c[1],
              h = c[2];
          c = c[3];
          f *= e;
          g *= a;
          if (2 === b.length) return (e = f + g), { x: (f * b[0].x + g * b[1].x) / e, y: (f * b[0].y + g * b[1].y) / e, z: d ? (f * b[0].z + g * b[1].z) / e : !1, t: a };
          f *= e;
          g *= 2 * e;
          h *= a * a;
          if (3 === b.length) return (e = f + g + h), { x: (f * b[0].x + g * b[1].x + h * b[2].x) / e, y: (f * b[0].y + g * b[1].y + h * b[2].y) / e, z: d ? (f * b[0].z + g * b[1].z + h * b[2].z) / e : !1, t: a };
          f *= e;
          g *= 1.5 * e;
          h *= 3 * e;
          c *= a * a * a;
          if (4 === b.length)
              return (
                  (e = f + g + h + c),
                  { x: (f * b[0].x + g * b[1].x + h * b[2].x + c * b[3].x) / e, y: (f * b[0].y + g * b[1].y + h * b[2].y + c * b[3].y) / e, z: d ? (f * b[0].z + g * b[1].z + h * b[2].z + c * b[3].z) / e : !1, t: a }
              );
      },
      derive: function (a, b) {
          for (var c = [], d = a.length, e = d - 1; 1 < d; d--, e--) {
              for (var f = [], g = 0, h; g < e; g++) (h = { x: e * (a[g + 1].x - a[g].x), y: e * (a[g + 1].y - a[g].y) }), b && (h.z = e * (a[g + 1].z - a[g].z)), f.push(h);
              c.push(f);
              a = f;
          }
          return c;
      },
      between: function (a, b, c) {
          return (b <= a && a <= c) || PolygonUtils.approximately(a, b) || PolygonUtils.approximately(a, c);
      },
      approximately: function (a, b, c) {
          return Qb(a - b) <= (c || 1e-6);
      },
      length: function (a) {
          for (var b = PolygonUtils.Tvalues.length, c = 0, d = 0, e; d < b; d++) (e = 0.5 * PolygonUtils.Tvalues[d] + 0.5), (c += PolygonUtils.Cvalues[d] * PolygonUtils.arcfn(e, a));
          return 0.5 * c;
      },
      map: function (a, b, c, d, e) {
          return d + ((a - b) / (c - b)) * (e - d);
      },
      lerp: function (a, b, c) {
          var d = { x: b.x + a * (c.x - b.x), y: b.y + a * (c.y - b.y) };
          void 0 !== b.z && void 0 !== c.z && (d.z = b.z + a * (c.z - b.z));
          return d;
      },
      pointToString: function (a) {
          var b = a.x + "/" + a.y;
          "undefined" !== typeof a.z && (b += "/" + a.z);
          return b;
      },
      pointsToString: function (a) {
          return "[" + a.map(PolygonUtils.pointToString).join(", ") + "]";
      },
      copy: function (a) {
          return JSON.parse(JSON.stringify(a));
      },
      angle: function (a, b, c) {
          var d = b.x - a.x;
          b = b.y - a.y;
          var e = c.x - a.x;
          a = c.y - a.y;
          return Vb(d * a - b * e, d * e + b * a);
      },
      round: function (a, b) {
          a = "" + a;
          var c = a.indexOf(".");
          return parseFloat(a.substring(0, c + 1 + b));
      },
      dist: function (a, b) {
          var c = a.x - b.x;
          a = a.y - b.y;
          return Yb(c * c + a * a);
      },
      closest: function (a, b) {
          var c = Zb(2, 63),
              d,
              e;
          a.forEach(function (a, g) {
              e = PolygonUtils.dist(b, a);
              e < c && ((c = e), (d = g));
          });
          return { mdist: c, mpos: d };
      },
      abcratio: function (a, b) {
          if (2 !== b && 3 !== b) return !1;
          if ("undefined" === typeof a) a = 0.5;
          else if (0 === a || 1 === a) return a;
          a = Zb(a, b) + Zb(1 - a, b);
          return Qb((a - 1) / a);
      },
      projectionratio: function (a, b) {
          if (2 !== b && 3 !== b) return !1;
          if ("undefined" === typeof a) a = 0.5;
          else if (0 === a || 1 === a) return a;
          var c = Zb(1 - a, b);
          a = Zb(a, b) + c;
          return c / a;
      },
      lli8: function (a, b, c, d, e, f, g, h) {
          var l = (a - c) * (f - h) - (b - d) * (e - g);
          return 0 == l ? !1 : { x: ((a * d - b * c) * (e - g) - (a - c) * (e * h - f * g)) / l, y: ((a * d - b * c) * (f - h) - (b - d) * (e * h - f * g)) / l };
      },
      lli4: function (a, b, c, d) {
          return PolygonUtils.lli8(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
      },
      lli: function (a, b) {
          return PolygonUtils.lli4(a, a.c, b, b.c);
      },
      makeline: function (a, b) {
          return new Polygon(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2, b.x, b.y);
      },
      findbbox: function (a) {
          var b = dc,
              c = dc,
              d = ec,
              e = ec;
          a.forEach(function (a) {
              a = a.bbox();
              b > a.x.min && (b = a.x.min);
              c > a.y.min && (c = a.y.min);
              d < a.x.max && (d = a.x.max);
              e < a.y.max && (e = a.y.max);
          });
          return { x: { min: b, mid: (b + d) / 2, max: d, size: d - b }, y: { min: c, mid: (c + e) / 2, max: e, size: e - c } };
      },
      shapeintersections: function (a, b, c, d, e) {
          if (!PolygonUtils.bboxoverlap(b, d)) return [];
          var f = [],
              g = [c.startcap, c.forward, c.back, c.endcap];
          [a.startcap, a.forward, a.back, a.endcap].forEach(function (b) {
              b.virtual ||
                  g.forEach(function (d) {
                      if (!d.virtual) {
                          var g = b.intersects(d, e);
                          0 < g.length && ((g.c1 = b), (g.c2 = d), (g.s1 = a), (g.s2 = c), f.push(g));
                      }
                  });
          });
          return f;
      },
      makeshape: function (a, b, c) {
          var d = a.points.length,
              e = PolygonUtils.makeline(b.points[b.points.length - 1], a.points[0]);
          d = PolygonUtils.makeline(a.points[d - 1], b.points[0]);
          var f = {
              startcap: e,
              forward: a,
              back: b,
              endcap: d,
              bbox: PolygonUtils.findbbox([e, a, b, d]),
              intersections: function (a) {
                  return PolygonUtils.shapeintersections(f, f.bbox, a, a.bbox, c);
              },
          };
          return f;
      },
      getminmax: function (a, b, c) {
          if (!c) return { min: 0, max: 0 };
          var d = dc,
              e = ec;
          -1 === c.indexOf(0) && (c = [0].concat(c));
          -1 === c.indexOf(1) && c.push(1);
          for (var f = 0, g = c.length; f < g; f++) {
              var h = c[f];
              h = a.get(h);
              h[b] < d && (d = h[b]);
              h[b] > e && (e = h[b]);
          }
          return { min: d, mid: (d + e) / 2, max: e, size: e - d };
      },
      align: function (a, b) {
          var c = b.p1.x,
              d = b.p1.y,
              e = -Vb(b.p2.y - d, b.p2.x - c);
          return a.map(function (a) {
              return { x: (a.x - c) * Rb(e) - (a.y - d) * Sb(e), y: (a.x - c) * Sb(e) + (a.y - d) * Rb(e) };
          });
      },
      roots: function (a, b) {
          function c(a) {
              return 0 <= a && 1 >= a;
          }
          b = b || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
          var d = a.length - 1;
          a = PolygonUtils.align(a, b);
          if (2 === d) {
              d = a[0].y;
              b = a[1].y;
              var e = a[2].y;
              a = d - 2 * b + e;
              return 0 !== a ? ((e = -Yb(b * b - d * e)), (d = -d + b), [-(e + d) / a, -(-e + d) / a].filter(c)) : b !== e && 0 === a ? [(2 * b - e) / (2 * b - 2 * e)].filter(c) : [];
          }
          d = a[0].y;
          b = a[1].y;
          var f = a[2].y;
          e = -d + 3 * b - 3 * f + a[3].y;
          a = 3 * d - 6 * b + 3 * f;
          f = -3 * d + 3 * b;
          if (PolygonUtils.approximately(e, 0)) {
              if (PolygonUtils.approximately(a, 0)) return PolygonUtils.approximately(f, 0) ? [] : [-d / f].filter(c);
              d = Yb(f * f - 4 * a * d);
              a *= 2;
              return [(d - f) / a, (-f - d) / a].filter(c);
          }
          a /= e;
          f /= e;
          b = (3 * f - a * a) / 3;
          var g = b / 3;
          d = (2 * a * a * a - 9 * a * f + (d / e) * 27) / 27;
          e = d / 2;
          f = e * e + g * g * g;
          if (0 > f)
              return (
                  (b = -b / 3),
                  (b = Yb(b * b * b)),
                  (d = -d / (2 * b)),
                  (e = Tb(-1 > d ? -1 : 1 < d ? 1 : d)),
                  (f = 2 * $b(b)),
                  (d = f * Rb(e / 3) - a / 3),
                  (b = f * Rb((e + bc) / 3) - a / 3),
                  (a = f * Rb((e + 2 * bc) / 3) - a / 3),
                  [d, b, a].filter(c)
              );
          if (0 === f) return (d = 0 > e ? $b(-e) : -$b(e)), [2 * d - a / 3, -d - a / 3].filter(c);
          b = Yb(f);
          d = $b(-e + b);
          b = $b(e + b);
          return [d - b - a / 3].filter(c);
      },
      droots: function (a) {
          if (3 === a.length) {
              var b = a[0],
                  c = a[1],
                  d = a[2];
              a = b - 2 * c + d;
              return 0 !== a ? ((d = -Yb(c * c - b * d)), (b = -b + c), [-(d + b) / a, -(-d + b) / a]) : c !== d && 0 === a ? [(2 * c - d) / (2 * (c - d))] : [];
          }
          return 2 === a.length && ((b = a[0]), (c = a[1]), b !== c) ? [b / (b - c)] : [];
      },
      curvature: function (a, b, c, d, e) {
          var f = PolygonUtils.compute(a, b);
          var g = PolygonUtils.compute(a, c);
          var h = f.x * f.x + f.y * f.y;
          d ? ((g = Yb(Zb(f.y * g.z - g.y * f.z, 2) + Zb(f.z * g.x - g.z * f.x, 2) + Zb(f.x * g.y - g.x * f.y, 2))), (h = Zb(h + f.z * f.z, 1.5))) : ((g = f.x * g.y - f.y * g.x), (h = Zb(h, 1.5)));
          if (0 === g || 0 === h) return { k: 0, r: 0 };
          f = g / h;
          g = h / g;
          if (!e) {
              e = PolygonUtils.curvature(a - 0.001, b, c, d, !0).k;
              a = PolygonUtils.curvature(a + 0.001, b, c, d, !0).k;
              var l = (a - f + (f - e)) / 2;
              var m = (Qb(a - f) + Qb(f - e)) / 2;
          }
          return { k: f, r: g, dk: l, adk: m };
      },
      inflections: function (a) {
          if (4 > a.length) return [];
          a = PolygonUtils.align(a, { p1: a[0], p2: a.slice(-1)[0] });
          var b = a[2].x * a[1].y,
              c = a[3].x * a[1].y,
              d = a[1].x * a[2].y;
          a = 18 * (-3 * b + 2 * c + 3 * d - a[3].x * a[2].y);
          c = 18 * (3 * b - c - 3 * d);
          b = 18 * (d - b);
          if (PolygonUtils.approximately(a, 0)) return !PolygonUtils.approximately(c, 0) && ((a = -b / c), 0 <= a && 1 >= a) ? [a] : [];
          b = Math.sqrt(c * c - 4 * a * b);
          a *= 2;
          return PolygonUtils.approximately(a, 0)
              ? []
              : [(b - c) / a, -(c + b) / a].filter(function (a) {
                    return 0 <= a && 1 >= a;
                });
      },
      bboxoverlap: function (a, b) {
          for (var c = ["x", "y"], d = c.length, e = 0, f, g, h; e < d; e++) if (((f = c[e]), (g = a[f].mid), (h = b[f].mid), (f = (a[f].size + b[f].size) / 2), Qb(g - h) >= f)) return !1;
          return !0;
      },
      expandbox: function (a, b) {
          b.x.min < a.x.min && (a.x.min = b.x.min);
          b.y.min < a.y.min && (a.y.min = b.y.min);
          b.z && b.z.min < a.z.min && (a.z.min = b.z.min);
          b.x.max > a.x.max && (a.x.max = b.x.max);
          b.y.max > a.y.max && (a.y.max = b.y.max);
          b.z && b.z.max > a.z.max && (a.z.max = b.z.max);
          a.x.mid = (a.x.min + a.x.max) / 2;
          a.y.mid = (a.y.min + a.y.max) / 2;
          a.z && (a.z.mid = (a.z.min + a.z.max) / 2);
          a.x.size = a.x.max - a.x.min;
          a.y.size = a.y.max - a.y.min;
          a.z && (a.z.size = a.z.max - a.z.min);
      },
      pairiteration: function (a, b, c) {
          var d = a.bbox(),
              e = b.bbox(),
              f = c || 0.5;
          if (d.x.size + d.y.size < f && e.x.size + e.y.size < f) return [(((1e5 * (a._t1 + a._t2)) / 2) | 0) / 1e5 + "/" + (((1e5 * (b._t1 + b._t2)) / 2) | 0) / 1e5];
          a = a.split(0.5);
          b = b.split(0.5);
          b = [
              { left: a.left, right: b.left },
              { left: a.left, right: b.right },
              { left: a.right, right: b.right },
              { left: a.right, right: b.left },
          ];
          b = b.filter(function (a) {
              return PolygonUtils.bboxoverlap(a.left.bbox(), a.right.bbox());
          });
          var g = [];
          if (0 === b.length) return g;
          b.forEach(function (a) {
              g = g.concat(PolygonUtils.pairiteration(a.left, a.right, f));
          });
          return (g = g.filter(function (a, b) {
              return g.indexOf(a) === b;
          }));
      },
      getccenter: function (a, b, c) {
          var d = b.x - a.x,
              e = b.y - a.y,
              f = c.x - b.x,
              g = c.y - b.y,
              h = d * Rb(cc) - e * Sb(cc);
          d = d * Sb(cc) + e * Rb(cc);
          e = f * Rb(cc) - g * Sb(cc);
          f = f * Sb(cc) + g * Rb(cc);
          g = (a.x + b.x) / 2;
          var l = (a.y + b.y) / 2,
              m = (b.x + c.x) / 2,
              n = (b.y + c.y) / 2;
          h = PolygonUtils.lli8(g, l, g + h, l + d, m, n, m + e, n + f);
          d = PolygonUtils.dist(h, a);
          a = Vb(a.y - h.y, a.x - h.x);
          b = Vb(b.y - h.y, b.x - h.x);
          c = Vb(c.y - h.y, c.x - h.x);
          if (a < c) {
              if (a > b || b > c) a += bc;
              a > c && ((b = c), (c = a), (a = b));
          } else c < b && b < a ? ((b = c), (c = a), (a = b)) : (c += bc);
          h.s = a;
          h.e = c;
          h.r = d;
          return h;
      },
      numberSort: function (a, b) {
          return a - b;
      },
  };
  function gc(a) {
      this.curves = [];
      this._3d = !1;
      a && ((this.curves = a), (this._3d = this.curves[0]._3d));
  }
  gc.prototype.valueOf = function () {
      return this.toString();
  };
  gc.prototype.toString = function () {
      return (
          "[" +
          this.curves
              .map(function (a) {
                  return PolygonUtils.pointsToString(a.points);
              })
              .join(", ") +
          "]"
      );
  };
  gc.prototype.addCurve = function (a) {
      this.curves.push(a);
      this._3d = this._3d || a._3d;
  };
  gc.prototype.length = function () {
      return this.curves
          .map(function (a) {
              return a.length();
          })
          .reduce(function (a, b) {
              return a + b;
          });
  };
  gc.prototype.curve = function (a) {
      return this.curves[a];
  };
  gc.prototype.bbox = function () {
      for (var a = this.curves, b = a[0].bbox(), c = 1; c < a.length; c++) PolygonUtils.expandbox(b, a[c].bbox());
      return b;
  };
  gc.prototype.offset = function (a) {
      var b = [];
      this.curves.forEach(function (c) {
          b.push.apply(b, _.arrayFromIterable(c.offset(a)));
      });
      return new gc(b);
  };
  var hc = Math,
      ic = hc.abs,
      jc = hc.min,
      lc = hc.max,
      mc = hc.cos,
      nc = hc.sin,
      oc = hc.acos,
      pc = hc.sqrt,
      qc = Math.PI;
  function Polygon(a) {
      var b = a && a.forEach ? a : Array.from(arguments).slice(), c = !1;
      if ("object" === typeof b[0]) {
          c = b.length;
          var d = [];
          b.forEach(function (a) {
              ["x", "y", "z"].forEach(function (b) {
                  "undefined" !== typeof a[b] && d.push(a[b]);
              });
          });
          b = d;
      }
      var e = !1,
          f = b.length;
      if (c) {
          if (4 < c) {
              if (1 !== arguments.length) throw Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
              e = !0;
          }
      } else if (6 !== f && 8 !== f && 9 !== f && 12 !== f && 1 !== arguments.length) throw Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
      e = this._3d = (!e && (9 === f || 12 === f)) || (a && a[0] && "undefined" !== typeof a[0].z);
      c = this.points = [];
      for (var g = 0, h = e ? 3 : 2; g < f; g += h) {
          var l = { x: b[g], y: b[g + 1] };
          e && (l.z = b[g + 2]);
          c.push(l);
      }
      b = this.order = c.length - 1;
      f = this.dims = ["x", "y"];
      e && f.push("z");
      this.dimlen = f.length;
      f = PolygonUtils.align(c, { p1: c[0], p2: c[b] });
      c = PolygonUtils.dist(c[0], c[b]);
      this._linear =
          f.reduce(function (a, b) {
              return a + ic(b.y);
          }, 0) <
          c / 50;
      this._lut = [];
      this._t1 = 0;
      this._t2 = 1;
      this.update();
  }
  Polygon.quadraticFromPoints = function (a, b, c, d) {
      "undefined" === typeof d && (d = 0.5);
      if (0 === d) return new Polygon(b, b, c);
      if (1 === d) return new Polygon(a, b, b);
      b = Polygon.getABC(2, a, b, c, d);
      return new Polygon(a, b.A, c);
  };
  Polygon.cubicFromPoints = function (a, b, c, d, e) {
      "undefined" === typeof d && (d = 0.5);
      var f = Polygon.getABC(3, a, b, c, d);
      "undefined" === typeof e && (e = PolygonUtils.dist(b, f.C));
      var g = (e * (1 - d)) / d,
          h = PolygonUtils.dist(a, c),
          l = (c.x - a.x) / h;
      h = (c.y - a.y) / h;
      f = f.A;
      return new Polygon(
          a,
          { x: a.x + (f.x + (b.x - e * l - f.x) / (1 - d) - a.x) / d, y: a.y + (f.y + (b.y - e * h - f.y) / (1 - d) - a.y) / d },
          { x: c.x + (f.x + (b.x + g * l - f.x) / d - c.x) / (1 - d), y: c.y + (f.y + (b.y + g * h - f.y) / d - c.y) / (1 - d) },
          c
      );
  };
  Polygon.getUtils = function () {
      return PolygonUtils;
  };
  Polygon.prototype.getUtils = function () {
      return Polygon.getUtils();
  };
  Polygon.prototype.valueOf = function () {
      return this.toString();
  };
  Polygon.prototype.toString = function () {
      return PolygonUtils.pointsToString(this.points);
  };
  Polygon.prototype.toSVG = function () {
      if (this._3d) return !1;
      for (var a = this.points, b = ["M", a[0].x, a[0].y, 2 === this.order ? "Q" : "C"], c = 1, d = a.length; c < d; c++) b.push(a[c].x), b.push(a[c].y);
      return b.join(" ");
  };
  Polygon.prototype.setRatios = function (a) {
      if (a.length !== this.points.length) throw Error("incorrect number of ratio values");
      this.ratios = a;
      this._lut = [];
  };
  Polygon.prototype.verify = function () {
      var a = this.coordDigest();
      a !== this._print && ((this._print = a), this.update());
  };
  Polygon.prototype.coordDigest = function () {
      return this.points
          .map(function (a, b) {
              return "" + b + a.x + a.y + (a.z ? a.z : 0);
          })
          .join("");
  };
  Polygon.prototype.update = function () {
      this._lut = [];
      this.dpoints = PolygonUtils.derive(this.points, this._3d);
      this.computedirection();
  };
  Polygon.prototype.computedirection = function () {
      var a = this.points;
      this.clockwise = 0 < PolygonUtils.angle(a[0], a[this.order], a[1]);
  };
  Polygon.prototype.length = function () {
      return PolygonUtils.length(this.derivative.bind(this));
  };
  Polygon.getABC = function (a, b, c, d, e) {
      a = void 0 === a ? 2 : a;
      e = void 0 === e ? 0.5 : e;
      var f = PolygonUtils.projectionratio(e, a),
          g = 1 - f;
      f = { x: f * b.x + g * d.x, y: f * b.y + g * d.y };
      a = PolygonUtils.abcratio(e, a);
      return { A: { x: c.x + (c.x - f.x) / a, y: c.y + (c.y - f.y) / a }, B: c, C: f, S: b, E: d };
  };
  Polygon.prototype.getABC = function (a, b) {
      b = b || this.get(a);
      return Polygon.getABC(this.order, this.points[0], b, this.points[this.order], a);
  };
  Polygon.prototype.getLUT = function (a) {
      this.verify();
      a = a || 100;
      if (this._lut.length === a) return this._lut;
      a++;
      this._lut = [];
      for (var b = 0, c, d; b < a; b++) (d = b / (a - 1)), (c = this.compute(d)), (c.t = d), this._lut.push(c);
      return this._lut;
  };
  Polygon.prototype.on = function (a, b) {
      b = b || 5;
      for (var c = this.getLUT(), d = [], e = 0, f; e < c.length; e++) (f = c[e]), PolygonUtils.dist(f, a) < b && d.push(f);
      return d.length ? NaN / d.length : !1;
  };
  Polygon.prototype.project = function (a) {
      var b = this.getLUT(),
          c = b.length - 1,
          d = PolygonUtils.closest(b, a),
          e = d.mpos;
      b = (e + 1) / c;
      var f = 0.1 / c;
      d = d.mdist;
      e = c = (e - 1) / c;
      for (d += 1; c < b + f; c += f) {
          var g = this.compute(c);
          g = PolygonUtils.dist(a, g);
          g < d && ((d = g), (e = c));
      }
      e = 0 > e ? 0 : 1 < e ? 1 : e;
      g = this.compute(e);
      g.t = e;
      g.d = d;
      return g;
  };
  Polygon.prototype.get = function (a) {
      return this.compute(a);
  };
  Polygon.prototype.point = function (a) {
      return this.points[a];
  };
  Polygon.prototype.compute = function (a) {
      return this.ratios ? PolygonUtils.computeWithRatios(a, this.points, this.ratios, this._3d) : PolygonUtils.compute(a, this.points, this._3d, this.ratios);
  };
  Polygon.prototype.raise = function () {
      for (var a = this.points, b = [a[0]], c = a.length, d = 1, e, f; d < c; d++) (e = a[d]), (f = a[d - 1]), (b[d] = { x: ((c - d) / c) * e.x + (d / c) * f.x, y: ((c - d) / c) * e.y + (d / c) * f.y });
      b[c] = a[c - 1];
      return new Polygon(b);
  };
  Polygon.prototype.derivative = function (a) {
      return PolygonUtils.compute(a, this.dpoints[0], this._3d);
  };
  Polygon.prototype.dderivative = function (a) {
      return PolygonUtils.compute(a, this.dpoints[1], this._3d);
  };
  Polygon.prototype.align = function () {
      var a = this.points;
      return new Polygon(PolygonUtils.align(a, { p1: a[0], p2: a[a.length - 1] }));
  };
  Polygon.prototype.curvature = function (a) {
      return PolygonUtils.curvature(a, this.dpoints[0], this.dpoints[1], this._3d);
  };
  Polygon.prototype.inflections = function () {
      return PolygonUtils.inflections(this.points);
  };
  Polygon.prototype.normal = function (a) {
      return this._3d ? this.__normal3(a) : this.__normal2(a);
  };
  Polygon.prototype.__normal2 = function (a) {
      a = this.derivative(a);
      var b = pc(a.x * a.x + a.y * a.y);
      return { x: -a.y / b, y: a.x / b };
  };
  Polygon.prototype.__normal3 = function (a) {
      var b = this.derivative(a);
      a = this.derivative(a + 0.01);
      var c = pc(b.x * b.x + b.y * b.y + b.z * b.z),
          d = pc(a.x * a.x + a.y * a.y + a.z * a.z);
      b.x /= c;
      b.y /= c;
      b.z /= c;
      a.x /= d;
      a.y /= d;
      a.z /= d;
      c = a.y * b.z - a.z * b.y;
      d = a.z * b.x - a.x * b.z;
      a = a.x * b.y - a.y * b.x;
      var e = pc(c * c + d * d + a * a);
      c /= e;
      d /= e;
      a /= e;
      a = [c * c, c * d - a, c * a + d, c * d + a, d * d, d * a - c, c * a - d, d * a + c, a * a];
      return { x: a[0] * b.x + a[1] * b.y + a[2] * b.z, y: a[3] * b.x + a[4] * b.y + a[5] * b.z, z: a[6] * b.x + a[7] * b.y + a[8] * b.z };
  };
  Polygon.prototype.hull = function (a) {
      var b = this.points,
          c = [],
          d = 0;
      c[d++] = b[0];
      c[d++] = b[1];
      c[d++] = b[2];
      for (3 === this.order && (c[d++] = b[3]); 1 < b.length; ) {
          var e = [];
          for (var f = 0, g, h = b.length - 1; f < h; f++) (g = PolygonUtils.lerp(a, b[f], b[f + 1])), (c[d++] = g), e.push(g);
          b = e;
      }
      return c;
  };
  Polygon.prototype.split = function (a, b) {
      if (0 === a && b) return this.split(b).left;
      if (1 === b) return this.split(a).right;
      var c = this.hull(a);
      c = { left: 2 === this.order ? new Polygon([c[0], c[3], c[5]]) : new Polygon([c[0], c[4], c[7], c[9]]), right: 2 === this.order ? new Polygon([c[5], c[4], c[2]]) : new Polygon([c[9], c[8], c[6], c[3]]), span: c };
      c.left._t1 = PolygonUtils.map(0, 0, 1, this._t1, this._t2);
      c.left._t2 = PolygonUtils.map(a, 0, 1, this._t1, this._t2);
      c.right._t1 = PolygonUtils.map(a, 0, 1, this._t1, this._t2);
      c.right._t2 = PolygonUtils.map(1, 0, 1, this._t1, this._t2);
      if (!b) return c;
      b = PolygonUtils.map(b, a, 1, 0, 1);
      return c.right.split(b).left;
  };
  Polygon.prototype.extrema = function () {
      var a = {},
          b = [];
      this.dims.forEach(
          function (c) {
              function d(a) {
                  return a[c];
              }
              var e = this.dpoints[0].map(d);
              a[c] = PolygonUtils.droots(e);
              3 === this.order && ((e = this.dpoints[1].map(d)), (a[c] = a[c].concat(PolygonUtils.droots(e))));
              a[c] = a[c].filter(function (a) {
                  return 0 <= a && 1 >= a;
              });
              b = b.concat(a[c].sort(PolygonUtils.numberSort));
          }.bind(this)
      );
      a.values = b.sort(PolygonUtils.numberSort).filter(function (a, d) {
          return b.indexOf(a) === d;
      });
      return a;
  };
  Polygon.prototype.bbox = function () {
      var a = this.extrema(),
          b = {};
      this.dims.forEach(
          function (c) {
              b[c] = PolygonUtils.getminmax(this, c, a[c]);
          }.bind(this)
      );
      return b;
  };
  Polygon.prototype.overlaps = function (a) {
      var b = this.bbox();
      a = a.bbox();
      return PolygonUtils.bboxoverlap(b, a);
  };
  Polygon.prototype.offset = function (a, b) {
      if ("undefined" !== typeof b) {
          var c = this.get(a),
              d = this.normal(a),
              e = { c: c, n: d, x: c.x + d.x * b, y: c.y + d.y * b };
          this._3d && (e.z = c.z + d.z * b);
          return e;
      }
      if (this._linear) {
          var f = this.normal(0);
          b = this.points.map(function (b) {
              var c = { x: b.x + a * f.x, y: b.y + a * f.y };
              b.z && f.z && (c.z = b.z + a * f.z);
              return c;
          });
          return [new Polygon(b)];
      }
      return this.reduce().map(function (b) {
          return b._linear ? b.offset(a)[0] : b.scale(a);
      });
  };
  Polygon.prototype.simple = function () {
      if (3 === this.order) {
          var a = PolygonUtils.angle(this.points[0], this.points[3], this.points[1]),
              b = PolygonUtils.angle(this.points[0], this.points[3], this.points[2]);
          if ((0 < a && 0 > b) || (0 > a && 0 < b)) return !1;
      }
      a = this.normal(0);
      b = this.normal(1);
      var c = a.x * b.x + a.y * b.y;
      this._3d && (c += a.z * b.z);
      return ic(oc(c)) < qc / 3;
  };
  Polygon.prototype.reduce = function () {
      var a,
          b = 0,
          c = 0,
          d = [],
          e = [],
          f = this.extrema().values;
      -1 === f.indexOf(0) && (f = [0].concat(f));
      -1 === f.indexOf(1) && f.push(1);
      b = f[0];
      for (a = 1; a < f.length; a++) {
          c = f[a];
          var g = this.split(b, c);
          g._t1 = b;
          g._t2 = c;
          d.push(g);
          b = c;
      }
      d.forEach(function (a) {
          for (c = b = 0; 1 >= c; )
              for (c = b + 0.01; 1.01 >= c; c += 0.01)
                  if (((g = a.split(b, c)), !g.simple())) {
                      c -= 0.01;
                      if (0.01 > ic(b - c)) return [];
                      g = a.split(b, c);
                      g._t1 = PolygonUtils.map(b, 0, 1, a._t1, a._t2);
                      g._t2 = PolygonUtils.map(c, 0, 1, a._t1, a._t2);
                      e.push(g);
                      b = c;
                      break;
                  }
          1 > b && ((g = a.split(b, 1)), (g._t1 = PolygonUtils.map(b, 0, 1, a._t1, a._t2)), (g._t2 = a._t2), e.push(g));
      });
      return e;
  };
  Polygon.prototype.translate = function (a, b, c) {
      c = "number" === typeof c ? c : b;
      var d = this.order,
          e = this.points.map(function (a, e) {
              return (1 - e / d) * b + (e / d) * c;
          });
      return new Polygon(
          this.points.map(function (b, c) {
              return { x: b.x + a.x * e[c], y: b.y + a.y * e[c] };
          })
      );
  };
  Polygon.prototype.scale = function (a) {
      var b = this,
          c = this.order,
          d = !1;
      "function" === typeof a && (d = a);
      if (d && 2 === c) return this.raise().scale(d);
      var e = this.clockwise,
          f = this.points;
      if (this._linear) return this.translate(this.normal(0), d ? d(0) : a, d ? d(1) : a);
      var g = d ? d(0) : a,
          h = d ? d(1) : a,
          l = [this.offset(0, 10), this.offset(1, 10)],
          m = [],
          n = PolygonUtils.lli4(l[0], l[0].c, l[1], l[1].c);
      if (!n) throw Error("cannot scale this curve. Try reducing it first.");
      [0, 1].forEach(function (a) {
          var b = (m[a * c] = PolygonUtils.copy(f[a * c]));
          b.x += (a ? h : g) * l[a].n.x;
          b.y += (a ? h : g) * l[a].n.y;
      });
      if (!d)
          return (
              [0, 1].forEach(function (a) {
                  if (2 !== c || !a) {
                      var d = m[a * c],
                          e = b.derivative(a);
                      m[a + 1] = PolygonUtils.lli4(d, { x: d.x + e.x, y: d.y + e.y }, n, f[a + 1]);
                  }
              }),
              new Polygon(m)
          );
      [0, 1].forEach(function (b) {
          if (2 !== c || !b) {
              var g = f[b + 1],
                  h = g.x - n.x,
                  l = g.y - n.y,
                  p = d ? d((b + 1) / c) : a;
              d && !e && (p = -p);
              var w = pc(h * h + l * l);
              m[b + 1] = { x: g.x + (h / w) * p, y: g.y + (l / w) * p };
          }
      });
      return new Polygon(m);
  };
  Polygon.prototype.outline = function (a, b, c, d) {
      function e(a, b, c, d, e) {
          return function (f) {
              var g = b - a;
              return PolygonUtils.map(f, 0, 1, a + (d / c) * g, a + ((d + e) / c) * g);
          };
      }
      b = void 0 === b ? a : b;
      if (this._linear) {
          var f = this.normal(0),
              g = this.points[0],
              h = this.points[this.points.length - 1];
          void 0 === c && ((c = a), (d = b));
          var l = { x: g.x + f.x * a, y: g.y + f.y * a };
          var m = { x: h.x + f.x * c, y: h.y + f.y * c };
          var n = { x: (l.x + m.x) / 2, y: (l.y + m.y) / 2 };
          var p = [l, n, m];
          l = { x: g.x - f.x * b, y: g.y - f.y * b };
          m = { x: h.x - f.x * d, y: h.y - f.y * d };
          n = { x: (l.x + m.x) / 2, y: (l.y + m.y) / 2 };
          f = [m, n, l];
          g = PolygonUtils.makeline(f[2], p[0]);
          h = PolygonUtils.makeline(p[2], f[0]);
          p = [g, new Polygon(p), h, new Polygon(f)];
          return new gc(p);
      }
      f = this.reduce();
      p = f.length;
      var r = [],
          q = [],
          u,
          v = 0,
          w = this.length(),
          y = "undefined" !== typeof c && "undefined" !== typeof d;
      f.forEach(function (f) {
          var g = f.length();
          y ? (r.push(f.scale(e(a, c, w, v, g))), q.push(f.scale(e(-b, -d, w, v, g)))) : (r.push(f.scale(a)), q.push(f.scale(-b)));
          v += g;
      });
      q = q
          .map(function (a) {
              u = a.points;
              a.points = u[3] ? [u[3], u[2], u[1], u[0]] : [u[2], u[1], u[0]];
              return a;
          })
          .reverse();
      f = r[p - 1].points[r[p - 1].points.length - 1];
      g = q[0].points[0];
      p = PolygonUtils.makeline(q[p - 1].points[q[p - 1].points.length - 1], r[0].points[0]);
      f = PolygonUtils.makeline(f, g);
      p = [p].concat(r).concat([f]).concat(q);
      return new gc(p);
  };
  Polygon.prototype.outlineshapes = function (a, b, c) {
      a = this.outline(a, b || a).curves;
      b = [];
      for (var d = 1, e = a.length; d < e / 2; d++) {
          var f = PolygonUtils.makeshape(a[d], a[e - d], c);
          f.startcap.virtual = 1 < d;
          f.endcap.virtual = d < e / 2 - 1;
          b.push(f);
      }
      return b;
  };
  Polygon.prototype.intersects = function (a, b) {
      if (!a) return this.selfintersects(b);
      if (a.p1 && a.p2) return this.lineIntersects(a);
      a instanceof Polygon && (a = a.reduce());
      return this.curveintersects(this.reduce(), a, b);
  };
  Polygon.prototype.lineIntersects = function (a) {
      var b = this,
          c = jc(a.p1.x, a.p2.x),
          d = jc(a.p1.y, a.p2.y),
          e = lc(a.p1.x, a.p2.x),
          f = lc(a.p1.y, a.p2.y);
      return PolygonUtils.roots(this.points, a).filter(function (a) {
          a = b.get(a);
          return PolygonUtils.between(a.x, c, e) && PolygonUtils.between(a.y, d, f);
      });
  };
  Polygon.prototype.selfintersects = function (a) {
      for (var b = this.reduce(), c = b.length - 2, d = [], e = 0, f, g; e < c; e++) (f = b.slice(e, e + 1)), (g = b.slice(e + 2)), (f = this.curveintersects(f, g, a)), d.push.apply(d, _.arrayFromIterable(f));
      return d;
  };
  Polygon.prototype.curveintersects = function (a, b, c) {
      var d = [];
      a.forEach(function (a) {
          b.forEach(function (b) {
              a.overlaps(b) && d.push({ left: a, right: b });
          });
      });
      var e = [];
      d.forEach(function (a) {
          a = PolygonUtils.pairiteration(a.left, a.right, c);
          0 < a.length && (e = e.concat(a));
      });
      return e;
  };
  Polygon.prototype.arcs = function (a) {
      return this._iterate(a || 0.5, []);
  };
  Polygon.prototype._error = function (a, b, c, d) {
      var e = (d - c) / 4;
      c = this.get(c + e);
      d = this.get(d - e);
      b = PolygonUtils.dist(a, b);
      c = PolygonUtils.dist(a, c);
      a = PolygonUtils.dist(a, d);
      return ic(c - b) + ic(a - b);
  };
  Polygon.prototype._iterate = function (a, b) {
      var c = 0;
      do {
          var d = 0;
          var e = 1;
          var f = this.get(c);
          var g = void 0;
          var h = !1;
          var l = 1;
          do {
              var m = h;
              var n = g;
              var p = (c + e) / 2;
              g = this.get(p);
              h = this.get(e);
              g = PolygonUtils.getccenter(f, g, h);
              g.interval = { start: c, end: e };
              h = this._error(g, f, c, e) <= a;
              (m = m && !h) || (l = e);
              if (h) {
                  if (1 <= e) {
                      g.interval.end = l = 1;
                      n = g;
                      1 < e && ((c = { x: g.x + g.r * mc(g.e), y: g.y + g.r * nc(g.e) }), (g.e += PolygonUtils.angle({ x: g.x, y: g.y }, c, this.get(1))));
                      break;
                  }
                  e += (e - c) / 2;
              } else e = p;
          } while (!m && 100 > d++);
          if (100 <= d) break;
          n = n ? n : g;
          b.push(n);
          c = l;
      } while (1 > e);
      return b;
  };
  _.global.Object.defineProperties(Polygon, {
      PolyBezier: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return gc;
          },
      },
  });
  WALK.ColorUtils = {
      linearToGamma: function (a) {
          return 0.0031308 >= a ? 12.92 * a : 1.055 * Math.pow(a, 1 / 2.4) - 0.055;
      },
      gammaToLinear: function (a) {
          return 0.04045 >= a ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
      },
      hdrEncode: function (a, b) {
          var c = Math.sqrt(a.r) / 2.82842712,
              d = Math.sqrt(a.g) / 2.82842712;
          a = Math.sqrt(a.b) / 2.82842712;
          var e = Math.max(Math.max(c, d), a);
          e = THREE.Math.clamp(e, 1 / 255, 1);
          e = Math.ceil(255 * e) / 255;
          b.setRGB(c / e, d / e, a / e);
          return 1 - e;
      },
  };
  THREE.Color.prototype.copyGammaToLinear = void 0;
  THREE.Color.prototype.copyLinearToGamma = void 0;
  THREE.Color.prototype.convertLinearToGamma = void 0;
  THREE.Color.prototype.convertGammaToLinear = function () {
      this.r = WALK.ColorUtils.gammaToLinear(this.r);
      this.g = WALK.ColorUtils.gammaToLinear(this.g);
      this.b = WALK.ColorUtils.gammaToLinear(this.b);
  };
  THREE.Color.prototype.roundChannels = function () {
      this.r = WALK.round(this.r, 3);
      this.g = WALK.round(this.g, 3);
      this.b = WALK.round(this.b, 3);
      return this;
  };
  WALK.Euler = function (a, b, c) {
      THREE.Euler.call(this, b, c, a, "ZXY");
  };
  WALK.Euler.prototype = Object.create(THREE.Euler.prototype);
  WALK.Euler.prototype.constructor = WALK.Euler;
  Object.defineProperty(WALK.Euler.prototype, "yaw", {
      get: function () {
          return this.z;
      },
      set: function (a) {
          this.z = a;
      },
  });
  Object.defineProperty(WALK.Euler.prototype, "pitch", {
      get: function () {
          return this.x;
      },
      set: function (a) {
          this.x = a;
      },
  });
  Object.defineProperty(WALK.Euler.prototype, "roll", {
      get: function () {
          return this.y;
      },
      set: function (a) {
          this.y = a;
      },
  });
  Object.defineProperty(WALK.Euler.prototype, "yawDeg", {
      get: function () {
          return THREE.Math.radToDeg(this.yaw);
      },
      set: function (a) {
          this.yaw = THREE.Math.degToRad(a);
      },
  });
  Object.defineProperty(WALK.Euler.prototype, "pitchDeg", {
      get: function () {
          return THREE.Math.radToDeg(this.pitch);
      },
      set: function (a) {
          this.pitch = THREE.Math.degToRad(a);
      },
  });
  Object.defineProperty(WALK.Euler.prototype, "rollDeg", {
      get: function () {
          return THREE.Math.radToDeg(this.roll);
      },
      set: function (a) {
          this.roll = THREE.Math.degToRad(a);
      },
  });
  WALK.Euler.prototype.setFromDegTriple = function (a) {
      var b = THREE.Math.degToRad(a[0]),
          c = THREE.Math.degToRad(a[1]);
      a = THREE.Math.degToRad(a[2]);
      this.set(c, a, b);
      return this;
  };
  WALK.Euler.prototype.toDegTriple = function () {
      return [this.yawDeg, this.pitchDeg, this.rollDeg];
  };
  WALK.Euler.prototype.setFromDirection = function (a) {
      this.set(Math.asin(a.z), 0, Math.atan2(-a.x, a.y));
      return this;
  };
  WALK.Euler.prototype.toQuaternion = function () {
      var a = new THREE.Quaternion();
      a.setFromEuler(this);
      return a;
  };
  WALK.Euler.prototype.toRotationMatrix = function () {
      var a = new THREE.Matrix4();
      a.makeRotationFromEuler(this);
      return a;
  };
  var rc = new THREE.Sphere();
  WALK.Frustum = function () {
      this.planes = [new THREE.Plane(), new THREE.Plane(), new THREE.Plane(), new THREE.Plane(), new THREE.Plane(), new THREE.Plane()];
  };
  WALK.Frustum.prototype = {
      constructor: WALK.Frustum,
      setFromMatrix: function (a) {
          var b = this.planes,
              c = a.elements;
          a = c[0];
          var d = c[1],
              e = c[2],
              f = c[3],
              g = c[4],
              h = c[5],
              l = c[6],
              m = c[7],
              n = c[8],
              p = c[9],
              r = c[10],
              q = c[11],
              u = c[12],
              v = c[13],
              w = c[14];
          c = c[15];
          b[0].setComponents(f - a, m - g, q - n, c - u).normalize();
          b[1].setComponents(f + a, m + g, q + n, c + u).normalize();
          b[2].setComponents(f + d, m + h, q + p, c + v).normalize();
          b[3].setComponents(f - d, m - h, q - p, c - v).normalize();
          b[4].setComponents(f - e, m - l, q - r, c - w).normalize();
          b[5].setComponents(f + e, m + l, q + r, c + w).normalize();
          return this;
      },
      intersectsObject: function (a) {
          var b = a.geometry;
          null === b.boundingSphere && b.computeBoundingSphere();
          a.matrixWorld ? (rc.copy(b.boundingSphere), rc.applyMatrix4(a.matrixWorld), (a = rc)) : (a = b.boundingSphere);
          return this.intersectsSphere(a);
      },
      nearPlaneDistanceToCenter: function (a) {
          var b = a.geometry,
              c = this.planes[5];
          a.matrixWorld ? (rc.copy(b.boundingSphere), rc.applyMatrix4(a.matrixWorld), (a = rc)) : (a = b.boundingSphere);
          return c.distanceToPoint(a.center);
      },
      intersectsSphere: function (a) {
          var b = this.planes,
              c = a.center;
          a = -a.radius;
          for (var d = 0; 6 > d; d += 1) if (b[d].distanceToPoint(c) < a) return !1;
          return !0;
      },
      intersectsBox: (function () {
          var a = new THREE.Vector3(),
              b = new THREE.Vector3();
          return function (c) {
              for (var d = this.planes, e = 0; 6 > e; e += 1) {
                  var f = d[e];
                  a.x = 0 < f.normal.x ? c.min.x : c.max.x;
                  b.x = 0 < f.normal.x ? c.max.x : c.min.x;
                  a.y = 0 < f.normal.y ? c.min.y : c.max.y;
                  b.y = 0 < f.normal.y ? c.max.y : c.min.y;
                  a.z = 0 < f.normal.z ? c.min.z : c.max.z;
                  b.z = 0 < f.normal.z ? c.max.z : c.min.z;
                  var g = f.distanceToPoint(a);
                  f = f.distanceToPoint(b);
                  if (0 > g && 0 > f) return !1;
              }
              return !0;
          };
      })(),
      containsPoint: function (a) {
          for (var b = this.planes, c = 0; 6 > c; c += 1) if (0 > b[c].distanceToPoint(a)) return !1;
          return !0;
      },
  };
  var sc = new THREE.Vector3();
  WALK.Math = {
      toSnorm8: function (a) {
          return Math.round(127 * THREE.Math.clamp(a, -1, 1));
      },
      minBytesToHold: function (a) {
          return 127 >= a ? 1 : 32767 >= a ? 2 : 4;
      },
      anyPositiveRootOfQuadraticEquation: function (a, b, c) {
          c = b * b - 4 * a * c;
          if (0 > c) return null;
          c = Math.sqrt(c);
          var d = (-b - c) / (2 * a);
          if (0 < d) return d;
          a = (-b + c) / (2 * a);
          return 0 < a ? a : null;
      },
      spheresUnion: function (a, b) {
          if (b.empty()) b.copy(a);
          else {
              var c = b.center.distanceTo(a.center);
              if (a.radius > b.radius) {
                  var d = a;
                  a = b;
              } else d = b;
              var e = (d.radius + a.radius + c) / 2;
              e <= d.radius ? b.copy(d) : ((c = (e - d.radius) / c), console.assert(0 < c), sc.copy(a.center).sub(d.center).multiplyScalar(c), b.center.copy(d.center).add(sc), (b.radius = e));
          }
      },
  };
  WALK.DETECTOR = new (function () {
      function a(a) {
          function b(b) {
              var c = d[b];
              if (void 0 !== c) return c;
              switch (b) {
                  case "EXT_texture_filter_anisotropic":
                      c = a.getExtension("EXT_texture_filter_anisotropic") || a.getExtension("MOZ_EXT_texture_filter_anisotropic") || a.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
                      break;
                  case "WEBGL_compressed_texture_s3tc":
                      c = a.getExtension("WEBGL_compressed_texture_s3tc") || a.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
                      break;
                  case "WEBGL_compressed_texture_pvrtc":
                      c = a.getExtension("WEBGL_compressed_texture_pvrtc") || a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
                      break;
                  case "WEBGL_compressed_texture_etc1":
                      c = a.getExtension("WEBGL_compressed_texture_etc1");
                      break;
                  default:
                      c = a.getExtension(b);
              }
              return (d[b] = c);
          }
          function c() {
              var a = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
              return a ? parseInt(a[2], 10) : !1;
          }
          var d = {};
          this.extension = b;
          this.webgl2 = "undefined" !== typeof WebGL2RenderingContext && a instanceof WebGL2RenderingContext;
          this.antialiasNative = a.getContextAttributes().antialias && 1 < a.getParameter(a.SAMPLES);
          this.antialiasSamples = a.getParameter(a.SAMPLES);
          this.antialiasPostprocess = !g.mobile;
          this.floatTextures = this.webgl2 || b("OES_texture_float");
          this.standardDerivatives = this.webgl2 || b("OES_standard_derivatives");
          this.maxAnisotropy = (function () {
              var c = b("EXT_texture_filter_anisotropic");
              return null !== c ? a.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
          })();
          this.indexUint = this.webgl2 || b("OES_element_index_uint");
          this.instances = this.webgl2 || b("ANGLE_instanced_arrays");
          this.fragmentPrecision =
              void 0 === a.getShaderPrecisionFormat || 0 < a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_FLOAT).precision ? "highp" : 0 < a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.MEDIUM_FLOAT).precision ? "mediump" : "lowp";
          var e = 4096 > a.getParameter(a.MAX_TEXTURE_SIZE) ? "Your graphics card does not have sufficient capabilities, texture sizes 4096x4096 need to be supported." : null;
          this.missingCapabilities = e;
          this.maxRenderBufferSize = a.getParameter(a.MAX_RENDERBUFFER_SIZE);
          this.dxtTextures = (function () {
              try {
                  if (WALK.urlHashContains("nodxt")) return !1;
                  for (var c = b("WEBGL_compressed_texture_s3tc"), d = a.getParameter(a.COMPRESSED_TEXTURE_FORMATS), e = !1, f = !1, g = 0; g < d.length; g += 1)
                      (e = e || d[g] === c.COMPRESSED_RGB_S3TC_DXT1_EXT), (f = f || d[g] === c.COMPRESSED_RGBA_S3TC_DXT5_EXT);
                  return e && f;
              } catch (x) {}
              return !1;
          })();
          e = WALK.urlHashContains("nopvr") ? !1 : b("WEBGL_compressed_texture_pvrtc");
          this.pvrtcTextures = e;
          e = WALK.urlHashContains("noetc1") ? !1 : b("WEBGL_compressed_texture_etc1") && g.mobile;
          this.etc1Textures = e;
          this.astcTextures = !1;
          this.textureLod = this.webgl2 || (b("EXT_shader_texture_lod") && (!g.firefox || !g.android));
          this.mirrorCubeMaps = !g.mobile || WALK.MOBILE_HI;
          this.disableTextureSlotReuse = g.mac || 83 === c();
          this.reportToConsole = function () {
              WALK.log("WebGL" + (this.webgl2 ? "2" : "") + "; " + this.fragmentPrecision + " fragment precision.");
              this.dxtTextures || WALK.log("DXT textures not supported.");
              this.textureLod || WALK.log("Texture fetch level of detail not supported.");
              this.floatTextures || WALK.log("Float textures not supported.");
              this.antialiasNative ? WALK.log("Native anti-aliasing supported with " + this.antialiasSamples + " samples.") : WALK.log("Native anti-aliasing not supported");
              this.disableTextureSlotReuse && WALK.log("WebGL texture slot reuse disabled.");
              this.indexUint || WALK.log("Uint index not supported");
              this.instances || WALK.log("Instanced geometry not supported");
          };
      }
      function b(a) {
          var b = document.createElement("a");
          b.href = a;
          return b.protocol + "//" + b.host;
      }
      function c(a, b) {
          a = a.toLowerCase();
          b = b.toLowerCase();
          return -1 !== a.indexOf(b);
      }
      function d(a) {
          return navigator && navigator.userAgent ? c(navigator.userAgent, a) : !1;
      }
      function e(a, b) {
          console.assert(void 0 === g[a]);
          g[a] = b;
          void 0 !== g.webp &&
              (l.forEach(function (a) {
                  return a();
              }),
              (l.length = 0));
      }
      function f() {
          var a = new Image();
          a.onload = function () {
              e("webp", 0 < a.width && 0 < a.height);
          };
          a.onerror = function () {
              e("webp", !1);
          };
          a.src = "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==";
      }
      var g = this;
      this.https = "https:" === window.location.protocol;
      this.localhost = "localhost" === window.location.hostname || "127.0.0.1" === window.location.hostname;
      this.canForceBrotliBuffers = !1;
      this.ipad = /iPad/.test(navigator.userAgent) || ("MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints);
      this.mobile = /mobile|ip(hone|od)|android|silk/i.test(navigator.userAgent) || this.ipad || WALK.urlHashContains("mobile");
      this.ios = (/iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || this.ipad;
      this.android = /Android/.test(navigator.userAgent);
      this.facebookApp = /FBAN|FBAV/.test(navigator.userAgent);
      this.whatsApp = /WhatsApp/.test(navigator.userAgent);
      this.inCrossOriginIframe = (function () {
          var a = window.self !== window.top,
              c = b(document.referrer),
              d = b(window.location.href);
          return a && c !== d;
      })();
      this.firefox = d("firefox");
      this.opera = d("opera") || d("OPR/");
      var h;
      (h = d("msie")) || (h = navigator && navigator.appVersion ? c(navigator.appVersion, "trident/") : !1);
      this.ie = h;
      this.edge = d("edge/");
      this.safari = d("safari/") && !(d("chrome/") || d("chromium/"));
      this.mac = d("macintosh") && !this.ipad;
      this.BASIS_DECODE_WORKERS = this.safari || this.ios ? 0 : Math.min(4, navigator.hardwareConcurrency || 4);
      this.gl = null;
      this.resetGlDetector = function (b) {
          this.gl = new a(b);
      };
      this.webp = void 0;
      var l = [];
      WALK.NO_WEBP ? (this.webp = !1) : f();
      this.onAsyncPropertiesDetected = function (a) {
          void 0 !== g.webp ? a() : l.push(a);
      };
  })();
  function tc(a, b) {
      function c() {
          return !1;
      }
      function d(a, b) {
          var c = g.callbacks.onPointerDown(a, b);
          h = !0;
          l = a;
          m = b;
          return c;
      }
      function e(a, b, d) {
          var e = g.callbacks.onPointerUp(a, b);
          if (h) {
              var f = Date.now();
              e = null !== r && 0.03 >= Math.abs(n - l) && 0.03 >= Math.abs(p - m) && 500 >= Math.abs(r - f) && g.callbacks.onDoubleClick !== c ? g.callbacks.onDoubleClick(a, b) || e : g.callbacks.onClick(a, b, d) || e;
              r = f;
              n = a;
              p = b;
          }
          return e;
      }
      function f(a, b) {
          var c = g.callbacks.onPointerMove(a, b);
          !h || (0.03 >= Math.abs(a - l) && 0.03 >= Math.abs(b - m)) || ((h = !1), (r = null));
          return c;
      }
      var g = this,
          h = !1,
          l = null,
          m = null,
          n = null,
          p = null,
          r = null;
      this.callbacks = { onClick: c, onDoubleClick: c, onPointerDown: c, onPointerUp: c, onPointerMove: c };
      var q = !1;
      this.isEnabled = function () {
          return q;
      };
      this.enable = function () {
          q || (a.addPointerDownListener(d, b), a.addPointerUpListener(e, b), a.addPointerMoveListener(f, b), (q = !0));
      };
      this.disable = function () {
          q && (a.removePointerDownListener(d), a.removePointerUpListener(e), a.removePointerMoveListener(f), (q = !1));
      };
      this.enable();
  }
  function uc(a) {
      var b, c, d, e;
      this.set = function (f, g, h) {
          console.assert(void 0 === b && void 0 === c && void 0 === d && void 0 === e);
          b = a.autoClear;
          c = a.autoClearColor;
          d = a.autoClearDepth;
          e = a.autoClearStencil;
          a.autoClear = f || g || h;
          a.autoClearColor = f;
          a.autoClearDepth = g;
          a.autoClearStencil = h;
      };
      this.restore = function () {
          console.assert(void 0 !== b && void 0 !== c && void 0 !== d && void 0 !== e);
          a.autoClear = b;
          a.autoClearColor = c;
          a.autoClearDepth = d;
          a.autoClearStencil = e;
          e = d = c = b = void 0;
      };
  }
  function vc(a) {
      var b = new THREE.Color(),
          c = null,
          d = !1;
      this.set = function (e, f) {
          console.assert(!d);
          d = !0;
          b.copy(a.getClearColor());
          c = a.getClearAlpha();
          a.setClearColor(e, f);
      };
      this.restore = function () {
          console.assert(d);
          d = !1;
          a.setClearColor(b, c);
      };
  }
  function wc(a, b, c) {
      this.ray = new THREE.Ray(a, b);
      this.far = c || Infinity;
      this.ignoreVisibility = this.onlyGroundCollisions = this.respectColliderSettings = !1;
  }
  function xc() {
      this.distance = Infinity;
      this.point = new THREE.Vector3();
      this.object = null;
  }
  function yc(a, b) {
      function c(a, b) {
          if (!b.ignoreVisibility && !a.visible) return !1;
          var c = a.node || n;
          if ((c.disableCollisions && b.respectColliderSettings) || (!c.ground && b.onlyGroundCollisions)) return !1;
          c = b.ray;
          if (a.matrixWorld) return !0;
          var d = a.geometry.boundingSphere;
          if (d.distanceToPoint(c.origin) > b.far || !1 === c.isIntersectionSphere(d)) return !1;
          a = a.geometry.boundingBox;
          return a.distanceToPoint(c.origin) > b.far || !c.isIntersectionBox(a) ? !1 : !0;
      }
      var d = a.createRenderTarget(1, 1, { format: GLC.RGBA, magFilter: GLC.NEAREST, minFilter: GLC.NEAREST, stencilBuffer: !1, depthBuffer: !0, generateMipmaps: !1 }),
          e = new Uint8Array(4),
          f = new uc(a),
          g = new vc(a),
          h = new THREE.Color(16777215),
          l = new WALK.ObjectDistanceMaterial(!1),
          m = new THREE.PerspectiveCamera(1, 1, b.near, b.far),
          n = { disableCollisions: !1, ground: !1 };
      this.closestIntersection = function (b, n, q) {
          for (var p = [], v = 0; v < b.length; v += 1) {
              var r = b[v];
              console.assert(null === r.visibilityId);
              c(r, n) && ((r.visibilityId = p.length), p.push(r));
          }
          if (0 === p.length) return !1;
          m.position.set(0, 0, 0);
          m.lookAt(n.ray.direction);
          m.position.copy(n.ray.origin);
          m.updateMatrixWorld();
          f.set(!0, !0, !1);
          g.set(h);
          b = a.sortObjects;
          a.sortObjects = !1;
          a.renderMeshes(p, l, m, d, !1, n.ignoreVisibility);
          a.sortObjects = b;
          g.restore();
          f.restore();
          a.readPixels(1, 1, e);
          a.setRenderTarget(null);
          b = 256 * e[0] + e[1];
          v = e[2] + e[3] / 255;
          for (r = 0; r < p.length; r += 1) p[r].visibilityId = null;
          if (65535 === b || v > n.far) return !1;
          console.assert(b < p.length);
          q.object = p[b];
          q.distance = v;
          q.point.copy(n.ray.direction).multiplyScalar(v).add(n.ray.origin);
          return !0;
      };
  }

  function elementById(id) {
      return document.getElementById(id);
  }
  function focusWalkCanvas() {
      WALK.DETECTOR.ios || elementById("walk-canvas").focus();
  }
  function walkFocusAbstractHandler(callback) {
      return function (evt) {
          evt.stopPropagation();
          callback();
          focusWalkCanvas();
      };
  }
  function addClickHandler(dispatcher, handler) {
      dispatcher.addEventListener("click", walkFocusAbstractHandler(handler));
  }
  function addClickHandlerById(id, handler) {
      addClickHandler(elementById(id), handler);
  }
  function addClickHandlerFocusWalkCanvas(dispatcher) {
      dispatcher.addEventListener("click", function (a) {
          a.stopPropagation();
          a.target instanceof HTMLInputElement || a.target instanceof HTMLSelectElement || a.target instanceof HTMLTextAreaElement || focusWalkCanvas();
      });
  }
  var Kc = null;
  function Lc(a, b, c) {
      var d = !1,
          e = document.getElementById("ext-html-label"),
          f = e.querySelector("#ext-html-label-content");
      this.close = function (a) {
          d
              ? (e.classList.add("ui-out"),
                focusWalkCanvas(),
                window.setTimeout(function () {
                    e.classList.remove("ext-html-label-topleft");
                    e.classList.remove("ext-html-label-horizontal-center");
                    e.classList.remove("ext-html-label-vertical-center");
                    e.classList.remove("ext-html-label-center");
                    e.classList.remove("ui-out");
                    f.innerHTML = "";
                    e.style.display = "none";
                    c && c();
                    a && a();
                    d = !1;
                }, 400))
              : a();
      };
      this.open = function () {
          var c = this;
          if (!d) {
              if (a instanceof Node) f.appendChild(a);
              else {
                  var h = WALK.getExtraAssetUrl("").slice(0, -1);
                  h = a.replace(/\$EXTRA_ASSETS/g, h);
                  f.innerHTML = h;
              }
              f.style.padding = b.padding || void 0 === b.padding ? "" : 0;
              e.style.display = "";
              b.centerVertically
                  ? b.centerHorizontally
                      ? e.classList.add("ext-html-label-center")
                      : e.classList.add("ext-html-label-vertical-center")
                  : b.centerHorizontally
                  ? e.classList.add("ext-html-label-horizontal-center")
                  : e.classList.add("ext-html-label-topleft");
              e.classList.add("ui-out");
              e.classList.remove("ext-html-label-animated");
              WALK.preventClosureCompilerDeadCodeRemoval(e.offsetHeight);
              e.classList.add("ext-html-label-animated");
              e.classList.remove("ui-out");
              e.querySelector("#ext-html-label-close").onclick = function () {
                  c.close();
              };
              d = !0;
          }
      };
  }
  function Mc(a, b, c) {
      var d = new Lc(a, b, c);
      null !== Kc
          ? Kc.close(function () {
                return d.open();
            })
          : d.open();
      return (Kc = d);
  }
  WALK.Viewer = function (a, b, c) {
      function d() {
          return null;
      }
      function e(a) {
          c.isMaterialEditable(a) || console.assert(!1, "Can't access material, call ViewerApi.setMaterialEditable('" + a + "') before the scene is loaded.");
      }
      function f() {
          for (var a = [], b = _.makeIterator(D.materials), d = b.next(); !d.done; d = b.next()) (d = d.value), c.isMaterialEditable(d.name) && a.push(d);
          return a;
      }
      function g() {
          for (var a = [], b = _.makeIterator(D.nodeConfigs), d = b.next(); !d.done; d = b.next()) (d = d.value), c.isNodeTypeEditable(d.name) && a.push(d.name);
          return a;
      }
      function h(a) {
          e(a);
          for (var b = _.makeIterator(D.materials), c = b.next(); !c.done; c = b.next()) if (((c = c.value), c.name === a)) return c;
          return null;
      }
      function l() {
          jb.copy(E.cameraWorldPosition());
          return jb;
      }
      function m() {
          Oa.yaw = E.getYawAngle();
          Oa.pitch = E.getPitchAngle();
          Oa.roll = 0;
          return Oa;
      }
      function n() {
          return D.boundingBox;
      }
      function p(a) {
          var b = [];
          e(a);
          for (var c = _.makeIterator(D.gpuMeshes), d = c.next(); !d.done; d = c.next()) (d = d.value), d.material.name === a && b.push(d);
          return b;
      }
      function r(a) {
          return (a = D.findNodeConfig(a)) ? a.nodes.slice(0) : [];
      }
      function q(a, b) {
          b.geometry.isUvs0Repeating && a.ensureTexturesRepeatable && a.ensureTexturesRepeatable();
          b.material = a;
          fa.requestFrame();
      }
      function u(a, b) {
          console.warn("setMaterialForNode() is deprecated, use setMaterialForMesh() instead");
          q(a, b);
      }
      function v(a, b, c) {
          var d;
          (d = "string" === typeof a ? D.findViewByName(a) : a)
              ? (!0 === b ? (b = 0) : !1 === b && (b = void 0), Z.isRunning() && ((b = 0), Z.stop()), c ? (S.activateSky(d), S.updateHiddenMeshes(d)) : S.switchToView(d, b))
              : console.error("Unknown view: " + a);
      }
      function w(a) {
          a = void 0 === a ? {} : a;
          var b = a.isPanorama || !1,
              c = a.width || (b ? 4e3 : window.innerWidth),
              d = a.height || (b ? 2e3 : window.innerHeight);
          if (a.toDataUrl) return ca.monoScreenToDataUrl(b, c, d);
          ca.monoScreenToLocalImage(b, c, d);
      }
      function y(a) {
          D.addAuxiliaryObject(a);
          a !== a.colliderMesh && G.uploadNewBuffers(a.colliderMesh);
          Q.addDynamicObstacle(a.colliderMesh);
      }
      function z(a, b) {
          for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];
          try {
              return a.apply(null, _.arrayFromIterable(c));
          } catch (pa) {
              console.error(pa);
          }
          return !1;
      }
      function x(a, b) {
          for (var c = [], d = 1; d < arguments.length; ++d) c[d - 1] = arguments[d];
          if (a) {
              d = _.makeIterator(a);
              for (var e = d.next(); !e.done; e = d.next()) z.apply(null, [e.value].concat(_.arrayFromIterable(c)));
          }
      }
      function A() {
          x(W.nextPageInteraction);
          W.nextPageInteraction.length = 0;
      }
      function B(a, b) {
          a = new WALK.Anchor(D, a);
          Ga.push(a);
          sa && y(a);
          W.anchorClicked[a.colliderMesh.id] = b;
          oa = !0;
          fa.requestFrame();
          return a;
      }
      function L(a) {
          delete W.anchorClicked[a.colliderMesh.id];
          sa && (D.removeAuxiliaryObject(a), Q.removeDynamicObstacle(a.colliderMesh));
          WALK.removeFromArray(a, Ga);
          a.dispose();
          fa.requestFrame();
      }
      function C(a, b) {
          a = new WALK.Avatar(D, a, b);
          Fa.push(a);
          D.addAuxiliaryObject(a, !0);
          b = _.makeIterator(a.colliders);
          for (var c = b.next(); !c.done; c = b.next()) Q.addDynamicObstacle(c.value);
          x(W.avatarListChanged);
          return a;
      }
      function J(a) {
          for (var b = _.makeIterator(a.colliders), c = b.next(); !c.done; c = b.next()) Q.removeDynamicObstacle(c.value);
          D.removeAuxiliaryObject(a);
          WALK.removeFromArray(a, Fa);
          a.dispose();
          x(W.avatarListChanged);
      }
      function F(a) {
          return WALK.find(Fa, function (b) {
              return b.uuid === a;
          });
      }
      function I() {
          for (var a = _.makeIterator(D.getAnimatedMaterials()), b = a.next(); !b.done; b = a.next()) b.value.sleepAnimation();
      }
      function H() {
          for (var a = _.makeIterator(D.getAnimatedMaterials()), b = a.next(); !b.done; b = a.next()) b.value.wakeAnimation();
          fa.requestFrame();
      }
      function M(a, b) {
          return Y.getExtension(a, b);
      }
      function N(a, b) {
          var c = a[b];
          if (c) return c;
          c = [];
          return (a[b] = c);
      }
      var G,
          D = null,
          E,
          S,
          Z,
          Q,
          ca,
          ha,
          fa,
          Y,
          O,
          U,
          aa,
          V,
          oa = !1,
          ka = !1,
          ma = null,
          ia = null,
          W = {
              nextPageInteraction: [],
              viewerConfigLoaded: [],
              sceneReadyToDisplay: [],
              sceneLoadComplete: [],
              anchorClicked: {},
              materialPickerClicked: {},
              materialPickerClosed: null,
              nodeTypeClicked: {},
              anyNodeTypeClicked: [],
              materialClicked: {},
              nodeTypeHoverChanged: {},
              materialHoverChanged: {},
              viewSwitchStarted: [],
              viewSwitchDone: [],
              vrChange: [],
              beforeRender: [],
              anchorsVisibilityChanged: [],
              apiUserStateChanged: {},
              anyApiUserStateChanged: [],
              meetingJoined: [],
              avatarListChanged: [],
          },
          Ga = [],
          Fa = [],
          jb = new THREE.Vector3(),
          Oa = new WALK.Euler();
      document.addEventListener("keydown", A);
      document.addEventListener("mousedown", A);
      WALK.DETECTOR.ios ? document.addEventListener("touchstart", A) : document.addEventListener("touchend", A);
      var sa = !0;
      Object.defineProperty(this, "anchorsVisible", {
          get: function () {
              return sa;
          },
          set: function (a) {
              a !== sa &&
                  ((sa = a)
                      ? Ga.forEach(function (a) {
                            return y(a);
                        })
                      : Ga.forEach(function (a) {
                            D.removeAuxiliaryObject(a);
                            Q.removeDynamicObstacle(a.colliderMesh);
                        }),
                  this.requestFrame(),
                  x(W.anchorsVisibilityChanged, sa));
          },
      });
      var Db = (function () {
          function a(a, b, d) {
              c.set(a.x, a.y, h.z).sub(h);
              a = c.length();
              a > b && (c.normalize().multiplyScalar(a - b), d.add(c));
          }
          var b = new THREE.Vector3(),
              c = new THREE.Vector3(),
              d = new THREE.Vector3(),
              e = new THREE.Sphere(),
              f = new THREE.Vector3(),
              g = new WALK.Euler(),
              h;
          return function (c) {
              h = E.cameraWorldPosition();
              f.copy(h);
              c instanceof WALK.LightInstance && "sun" === c.light.type
                  ? (WALK.sunRotationToPosition(D, c.rotation, b), (c = b))
                  : c instanceof WALK.Node
                  ? (WALK.computeNodeBoundingSphere(c, e), (c = e.center), a(c, 1 + e.radius, f))
                  : ((c = c.position), a(c, 1, f));
              d.copy(c).sub(f).normalize();
              g.setFromDirection(d);
              S.switchToPoint(f, g);
          };
      })();
      this.openMaterialPicker = function (a, b, c, d, e) {
          console.assert(!ma, "Only one material picker can be opened");
          ma = new WALK.MaterialPicker(a, d, e, D, E, ha, aa);
          ma.meshes.forEach(function (a) {
              D.addAuxiliaryObject(a);
              Q.addDynamicObstacle(a);
              W.materialPickerClicked[a.id] = b;
          });
          W.materialPickerClosed = c;
      };
      this.closeMaterialPicker = function () {
          ma &&
              (ma.meshes.forEach(function (a) {
                  D.removeAuxiliaryObject(a);
                  Q.removeDynamicObstacle(a);
                  delete W.materialPickerClicked[a.id];
              }),
              ma.dispose(),
              (ma = null),
              W.materialPickerClosed && (W.materialPickerClosed(), (W.materialPickerClosed = null)));
      };
      window.addEventListener("resize", this.closeMaterialPicker.bind(this));
      this._vrChange = function (a) {
          x(W.vrChange, a);
      };
      this._update = function (a) {
          x(W.beforeRender, a);
      };
      this._clickListener = function (a, b, c) {
          function d(a, d) {
              if (a) {
                  a = _.makeIterator(a);
                  for (var e = a.next(); !e.done; e = a.next()) if (z(e.value, d, b, c)) return !0;
              }
              return !1;
          }
          if (!oa) return !1;
          if (ma) {
              var e = W.materialPickerClicked[a.id];
              if (e) return z(e, a.material, ma.meshes.indexOf(a)), !0;
              this.closeMaterialPicker();
              return !0;
          }
          if ((e = W.anchorClicked[a.id])) return z(e, a.anchor, b, c), !0;
          for (e = a.node; e; e = e.parent) if (d(W.nodeTypeClicked[e.type], a.node)) return !0;
          return a.node && d(W.anyNodeTypeClicked, a.node) ? !0 : a.material ? d(W.materialClicked[a.material.name], a.material) : !1;
      };
      this._createHoverListener = function () {
          var a = W.nodeTypeHoverChanged,
              b = W.materialHoverChanged,
              c = [];
          return 0 === Object.keys(a).length && 0 === Object.keys(b).length
              ? null
              : function (d, e) {
                    for (var f = d.node; f; f = f.parent) for (var g = _.makeIterator(a[f.type] || c), h = g.next(); !h.done; h = g.next()) if (z(h.value, f, e)) return !0;
                    if (d.material) for (f = _.makeIterator(b[d.material.name] || c), h = f.next(); !h.done; h = f.next()) if (z(h.value, d.material, e)) return !0;
                    return !1;
                };
      };
      this._teleportStarted = function (a) {
          a = a.view;
          null !== a && x(W.viewSwitchStarted, a.name, a);
      };
      this._teleportDone = function (a) {
          a = a.view;
          null !== a && x(W.viewSwitchDone, a.name, a);
      };
      this._viewerConfigLoaded = function (a) {
          O = a;
          x(W.viewerConfigLoaded, O);
          W.viewerConfigLoaded = [];
      };
      this._sceneReadyToDisplay = function (a, b, c, d, e, y, z, A, O, ia, ka, ma, oa) {
          G = a;
          D = b;
          E = c;
          S = d;
          Z = e;
          Q = y;
          ca = z;
          ha = A;
          U = O;
          aa = ia;
          V = ka;
          fa = ma;
          Y = oa;
          this.getEditableMaterials = f;
          this.getEditableNodeTypes = g;
          this.findMaterial = h;
          this.findMeshesWithMaterial = p;
          this.findNodesOfType = r;
          this.getCameraPosition = l;
          this.getCameraRotation = m;
          this.getSceneBoundingBox = n;
          this.setMaterialForNode = u;
          this.setMaterialForMesh = q;
          this.switchToView = v;
          this.captureImage = w;
          this.addAnchor = B;
          this.removeAnchor = L;
          this.addAvatar = C;
          this.removeAvatar = J;
          this.findAvatar = F;
          this.seeItem = Db;
          this.sleepAnimatedMaterials = I;
          this.wakeAnimatedMaterials = H;
          this.getExtension = M;
          x(W.sceneReadyToDisplay, D);
          W.sceneReadyToDisplay = [];
          S.addEventListener("teleportStarted", this._teleportStarted.bind(this));
          S.addEventListener("teleportDone", this._teleportDone.bind(this));
      };
      this._contextLost = function () {
          ka = !1;
          O = D = S = Z = Q = ca = V = fa = null;
          this.getExtension = this.wakeAnimatedMaterials = this.sleepAnimatedMaterials = this.findAvatar = this.removeAnchor = this.addAvatar = this.addAnchor = this.captureImage = this.switchToView = this.setMaterialForMesh = this.setMaterialForNode = this.findNodesOfType = this.findMeshesWithMaterial = this.findMaterial = this.getEditableNodeTypes = this.getEditableMaterials = d;
      };
      this._sceneLoadComplete = function () {
          x(W.sceneLoadComplete);
          W.sceneLoadComplete = [];
          ka = !0;
          for (var a = _.makeIterator(Ga), b = a.next(); !b.done; b = a.next()) b.value.enableLightProbe();
      };
      this.openUrl = function (b, c) {
          if (c || a) return window.open(b);
          window.location.href = b;
      };
      this.onNextPageInteraction = function (a) {
          W.nextPageInteraction.push(a);
      };
      this.onViewerConfigLoaded = function (a) {
          O ? a(O) : W.viewerConfigLoaded.push(a);
      };
      this.isSceneReadyToDisplay = function () {
          return null !== D;
      };
      this.onSceneReadyToDisplay = function (a) {
          D ? a(D) : W.sceneReadyToDisplay.push(a);
      };
      this.onSceneLoadComplete = function (a) {
          ka ? a(D) : W.sceneLoadComplete.push(a);
      };
      this.requestFrame = function () {
          fa && fa.requestFrame();
      };
      this.setNodeTypeEditable = function (a) {
          console.assert(null === D, "setNodeTypeEditable must be called before the scene is loaded");
          c.setNodeTypeEditable(a);
      };
      this.setMaterialEditable = function (a) {
          console.assert(null === D, "setMaterialEditable must be called before the scene is loaded");
          c.setMaterialEditable(a);
      };
      this.setAllMaterialsEditable = function () {
          console.assert(null === D, "setAllMaterialsEditable must be called before the scene is loaded");
          c.setAllMaterialsEditable();
      };
      this.onNodeTypeClicked = function (a, b) {
          "function" === typeof a ? W.anyNodeTypeClicked.push(a) : N(W.nodeTypeClicked, a).push(b);
          oa = !0;
      };
      this.removeOnNodeTypeClicked = function (a, b) {
          "function" === typeof a ? WALK.removeFromArray(a, W.anyNodeTypeClicked) : WALK.removeFromArray(b, W.nodeTypeClicked[a]);
      };
      this.onMaterialClicked = function (a, b) {
          this.setMaterialEditable(a);
          N(W.materialClicked, a).push(b);
          oa = !0;
      };
      this.onNodeTypeHoverChanged = function (a, b) {
          this.setNodeTypeEditable(a);
          N(W.nodeTypeHoverChanged, a).push(b);
      };
      this.onMaterialHoverChanged = function (a, b) {
          this.setMaterialEditable(a);
          N(W.materialHoverChanged, a).push(b);
      };
      this.onViewSwitchStarted = function (a) {
          W.viewSwitchStarted.push(a);
      };
      this.onViewSwitchDone = function (a) {
          W.viewSwitchDone.push(a);
      };
      this.onVrChange = function (a) {
          W.vrChange.push(a);
      };
      this.onBeforeRender = function (a) {
          W.beforeRender.push(a);
      };
      this.createTextureFromHtmlImage = function (a, b) {
          function c() {
              e.needsUpdate = !0;
              e.width = a.naturalWidth;
              e.height = a.naturalHeight;
              (THREE.Math.isPowerOfTwo(e.width) && THREE.Math.isPowerOfTwo(e.height)) || (e.minFilter = GLC.LINEAR);
              e.notifyLoaded();
          }
          function d() {
              c();
              f && f();
              a.onload = f;
          }
          b = void 0 === b ? !1 : b;
          var e = new ob();
          e.image = a;
          e.wrapS = e.wrapT = GLC.REPEAT;
          e.minFilter = GLC.LINEAR_MIPMAP_LINEAR;
          e.anisotropy = WALK.DEFAULT_ANISOTROPY;
          e.format = b ? GLC.RGBA : GLC.RGB;
          e.hasAlpha = b;
          var f = null;
          a.complete && 0 !== a.naturalHeight ? c() : ((f = a.onload), (a.onload = d));
          return e;
      };
      this.createTextureFromHtmlVideo = function (a) {
          var b = new rb();
          b.video = a;
          b.minFilter = GLC.LINEAR;
          b.anisotropy = WALK.DEFAULT_ANISOTROPY;
          b.format = GLC.RGB;
          b.generateMipmaps = !1;
          a.setAttribute("playsinline", "");
          a.setAttribute("webkit-playsinline", "");
          a.crossOrigin = "anonymous";
          WALK.onVideoDataReady(a, function (a) {
              b.width = a.videoWidth;
              b.height = a.videoHeight;
              THREE.Math.isPowerOfTwo(b.width) && THREE.Math.isPowerOfTwo(b.height) ? ((b.wrapS = GLC.REPEAT), (b.wrapT = GLC.REPEAT)) : ((b.wrapS = GLC.CLAMP_TO_EDGE), (b.wrapT = GLC.CLAMP_TO_EDGE));
              b.notifyLoaded();
          });
          return b;
      };
      this.createStreamTextureFromHtmlVideo = function (a) {
          a = this.createTextureFromHtmlVideo(a);
          a._interruptible = !1;
          return a;
      };
      this.addAnchor = function () {
          console.assert(!1, "Can't add anchors until the scene is ready to display");
      };
      this.removeAnchor = function () {
          console.assert(!1, "Can't remove anchors until the scene is ready to display");
      };
      this.addAvatar = function () {
          console.assert(!1, "Can't add avatars until the scene is ready to display");
      };
      this.removeAvatar = function () {
          console.assert(!1, "Can't remove avatars until the scene is ready to display");
      };
      this.findAvatar = function () {
          console.assert(!1, "Can't find avatars until the scene is ready to display");
      };
      this.sleepAnimatedMaterials = function () {
          console.assert(!1, "Can't sleep animated materials until the scene is ready to display");
      };
      this.wakeAnimatedMaterials = function () {
          console.assert(!1, "Can't wake animated materials until the scene is ready to display");
      };
      this.getExtension = function () {
          console.assert(!1, "Can't get extension until the scene is ready to display");
      };
      this.onAnchorsVisibilityChanged = function (a) {
          W.anchorsVisibilityChanged.push(a);
      };
      this.removeAnchorsVisibilityChangedListener = function (a) {
          W.anchorsVisibilityChanged = W.anchorsVisibilityChanged.filter(function (b) {
              return b !== a;
          });
      };
      this.seeItem = this.captureImage = this.switchToView = this.setMaterialForNode = this.getSceneBoundingBox = this.getCameraRotation = this.getCameraPosition = this.findNodesOfType = this.findMeshesWithMaterial = this.findMaterial = this.getEditableNodeTypes = this.getEditableMaterials = d;
      this.getViewerAssetUrl = function (a) {
          return WALK.getViewerAssetUrl(a);
      };
      this.addMenuButton = function (a) {
          return b.addExtraButton(a);
      };
      this.removeMenuButton = function (a) {
          b.removeExtraButton(a);
      };
      this.getMenuButtonIcon = function (a) {
          return b.getExtraButonIcon(a);
      };
      Object.defineProperty(this, "menuVisible", {
          get: function () {
              return b.visible;
          },
          set: function (a) {
              b.visible = a;
          },
      });
      this.onMenuVisibilityChanged = function (a) {
          b.addEventListener("visibilityChanged", function () {
              a();
          });
      };
      Object.defineProperty(this, "helpVisible", {
          get: function () {
              return b.helpVisible;
          },
          set: function (a) {
              b.helpVisible = a;
          },
      });
      this.play = function () {
          WALK.play();
      };
      var Ra = {};
      this.apiUserChangeState = function (a, b) {
          WALK.deepEqual(Ra[a], b) || ((Ra[a] = WALK.readOnlyCopy(b)), (b = WALK.cloneObject(b)), x(W.apiUserStateChanged[a], a, b), x(W.anyApiUserStateChanged, a, b));
      };
      this.onApiUserStateChanged = function (a, b) {
          "function" === typeof a ? W.anyApiUserStateChanged.push(a) : N(W.apiUserStateChanged, a).push(b);
      };
      this.removeOnApiUserStateChanged = function (a, b) {
          "function" === typeof a ? WALK.removeFromArray(a, W.anyApiUserStateChanged) : WALK.removeFromArray(b, W.apiUserStateChanged[a]);
      };
      this.getApiUserState = function (a) {
          if (void 0 === a) return WALK.cloneObject(Ra);
          a = Ra[a];
          return void 0 === a ? void 0 : WALK.cloneObject(a);
      };
      this._meetingJoined = function (a) {
          console.assert(null === ia);
          ia = a;
          x(W.meetingJoined, ia);
      };
      this._isMeeting = function () {
          return WALK.urlHashContains("meeting-key") || WALK.urlHashContains("meeting");
      };
      this._onMeetingJoined = function (a) {
          W.meetingJoined.push(a);
          null !== ia && a(ia);
      };
      this._removeOnMeetingJoined = function (a) {
          WALK.removeFromArray(a, W.meetingJoined);
      };
      this._onAvatarListChanged = function (a) {
          W.avatarListChanged.push(a);
      };
      this._removeOnAvatarListChanged = function (a) {
          WALK.removeFromArray(a, W.avatarListChanged);
      };
      this._createPointerEventHelper = function (a) {
          return new tc(V, a);
      };
      this._disableControls = function () {
          E.disable();
      };
      this._enableControls = function () {
          E.enable();
      };
      var vb = new xc();
      this._findIntersectionAtPosition = function (a, b) {
          Q.findIntersectionAtPosition(a, b, !0, vb);
          return vb;
      };
      this.getWalkMaxSpeed = function () {
          console.assert(D, "getWalkMaxSpeed must be called after the scene is loaded");
          return D.camera.moveMaxSpeed;
      };
      this.setWalkMaxSpeed = function (a) {
          console.assert(D, "setWalkMaxSpeed must be called after the scene is loaded");
          D.camera.moveMaxSpeed = a;
      };
      this.openPopup = function (a, b, c) {
          b = void 0 === b ? {} : b;
          return Mc(a, b, c);
      };
      this.enableMinimap = function () {
          console.assert(D, "enableMinimap must be called after the scene is loaded");
          D.minimapConfig.enabled = !0;
      };
      this.disableMinimap = function () {
          console.assert(D, "disableMinimap must be called after the scene is loaded");
          D.minimapConfig.enabled = !1;
      };
      this.isMinimapEnabled = function () {
          console.assert(D, "isMinimapEnabled must be called after the scene is loaded");
          return D.minimapConfig.enabled;
      };
      this.vrEnabled = function () {
          console.assert(D, "vrEnabled must be called after the scene is loaded");
          return U.vrEnabled();
      };
      this.enableVr = function () {
          console.assert(D, "enableVr must be called after the scene is loaded");
          U.vrEnabled() || U.enableVr(G.context);
      };
      this.disableVr = function () {
          console.assert(D, "disableVr must be called after the scene is loaded");
          U.vrEnabled() && U.disableVr();
      };
  };
  function Nc(a) {
      a = void 0 === a ? {} : a;
      THREE.EventDispatcher.call(this);
      var b = this;
      this._distanceEnabled = a.distanceEnabled || !1;
      this._distanceDensity = a.distanceDensity || 0.01;
      this._distanceStart = a.distanceStart || 0;
      this._heightEnabled = a.heightEnabled || !1;
      this._heightDensity = a.heightDensity || 0.01;
      this._heightStart = a.heightStart || 0;
      this._color = new THREE.Color().fromArray(a.color || [0.5, 0.5, 0.5]);
      this._updated = function () {
          return b.dispatchEvent({ type: "updated", target: b });
      };
  }
  _.inherits(Nc, THREE.EventDispatcher);
  Nc.prototype.enabled = function () {
      return this._distanceEnabled || this.heightEnabled;
  };
  Nc.prototype.serialize = function () {
      return {
          distanceEnabled: this._distanceEnabled,
          distanceDensity: this._distanceDensity,
          distanceStart: this._distanceStart,
          heightEnabled: this._heightEnabled,
          heightDensity: this._heightDensity,
          heightStart: this._heightStart,
          color: this._color.toArray(),
      };
  };
  _.global.Object.defineProperties(Nc.prototype, {
      distanceEnabled: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._distanceEnabled;
          },
          set: function (a) {
              this._distanceEnabled = a;
              this._updated();
          },
      },
      distanceDensity: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._distanceDensity;
          },
          set: function (a) {
              this._distanceDensity = a;
              this._updated();
          },
      },
      distanceStart: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._distanceStart;
          },
          set: function (a) {
              this._distanceStart = a;
              this._updated();
          },
      },
      heightEnabled: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._heightEnabled;
          },
          set: function (a) {
              this._heightEnabled = a;
              this._updated();
          },
      },
      heightDensity: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._heightDensity;
          },
          set: function (a) {
              this._heightDensity = a;
              this._updated();
          },
      },
      heightStart: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._heightStart;
          },
          set: function (a) {
              this._heightStart = a;
              this._updated();
          },
      },
      color: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._color;
          },
          set: function (a) {
              this._color.fromArray(a);
              this._updated();
          },
      },
  });
  function Oc(a) {
      function b(a, b, c) {
          var d = new THREE.SphereBufferGeometry(1, 64, 64);
          return new WALK.SkyMesh(a, d, b, c);
      }
      function c(a) {
          var c = new WALK.ProceduralSkyMaterial();
          return b(a.name, c, a.center);
      }
      this.loadSkyTexture = function (b, c) {
          b.material.map && b.material.map.dispose();
          b.material.map = a.load(WALK.LOAD_PRIORITY.SKY, c, !1, !1, WALK.NO_ANISOTROPY);
          b.yawRotationDeg = 0;
      };
      this.loadSingleSky = function (d, e, f) {
          if ("procedural" === d.type || void 0 === d.type) d = c(d);
          else if ("equirect" === d.type) {
              var g = new WALK.EquirectSkyMaterial();
              g.map = a.load(WALK.LOAD_PRIORITY.SKY, d.texture, !1, !1, WALK.NO_ANISOTROPY);
              g = b(d.name, g, d.center);
              g.geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
              g.rotation.x = Math.PI / 2;
              g.yawRotationDeg = d.yawRotation || 0;
              d = g;
          } else console.warn("Unknown sky type: ", d.type), (d = c(d));
          d.fog = f;
          e.addSkyMesh(d);
      };
      this.load = function (a, b) {
          var c = new Nc(a[0].fog);
          b.addFog(c);
          this.loadSingleSky({ name: WALK.DEFAULT_SKY_NAME, type: "procedural" }, b, c);
          for (var d = 0; d < a.length; d += 1) this.loadSingleSky(a[d], b, c);
      };
  }
  var Pc = (function () {
      function a(a, c) {
          return { formatIdx: a, gpuFormat: c };
      }
      return {
          ETC1: a(0, GLC.COMPRESSED_RGB_ETC1_WEBGL),
          BC1: a(2, GLC.COMPRESSED_RGB_S3TC_DXT1_EXT),
          BC3: a(3, GLC.COMPRESSED_RGBA_S3TC_DXT5_EXT),
          PVRTC1_4_RGB: a(8, GLC.COMPRESSED_RGB_PVRTC_4BPPV1_IMG),
          PVRTC1_4_RGBA: a(9, GLC.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG),
          ASTC_4x4: a(10, GLC.COMPRESSED_RGBA_ASTC_4x4_KHR),
          RGBA32: a(13, GLC.RGBA),
      };
  })();
  function Qc(a, b, c, d, e) {
      a({ wasmBinary: b }).then(function (a) {
          function b(a, b, e) {
              var f = 0 === Math.log2(b) % 1 && 0 === Math.log2(e) % 1;
              return d.dxtTextures ? (a ? c.BC3 : c.BC1) : d.pvrtcTextures && b === e && f ? (a ? c.PVRTC1_4_RGBA : c.PVRTC1_4_RGB) : d.etc1Textures && !a ? c.ETC1 : d.astcTextures ? c.ASTC_4x4 : c.RGBA32;
          }
          a.initializeBasis();
          e(function (c) {
              function d(a) {
                  e.close();
                  e.delete();
                  throw a;
              }
              var e = new a.BasisFile(new self.Uint8Array(c));
              c = e.getHasAlpha();
              var f = e.getNumImages(),
                  g = e.getNumLevels(0),
                  h = e.getImageWidth(0, 0),
                  q = e.getImageHeight(0, 0);
              (0 !== h && 0 !== q && 0 !== f && 0 !== g) || d("Invalid .basis file");
              1 < f && d("Missing multiple images handling");
              f = b(c, h, q);
              h = f.formatIdx;
              e.startTranscoding() || d("startTranscoding failed");
              q = [];
              for (var u = 0; u < g; ++u) {
                  var v = e.getImageWidth(0, u),
                      w = e.getImageHeight(0, u),
                      y = e.getImageTranscodedSizeInBytes(0, u, h);
                  y = new self.Uint8Array(new self.ArrayBuffer(y));
                  e.transcodeImage(y, 0, u, h, 0, c) || d(".transcodeImage failed");
                  q.push({ data: y, width: v, height: w });
              }
              e.close();
              e.delete();
              return { gpuFormat: f.gpuFormat, mipmaps: q };
          });
      });
  }
  function Rc(a, b, c, d) {
      function e() {
          g.removeEventListener("error", f);
          g.removeEventListener("message", e);
          g.addEventListener("error", function (a) {
              a = "Worker error @L" + a.lineno + ": " + a.message;
              h && (h.onError(a), (h = null));
          });
          g.addEventListener("message", function (a) {
              console.assert(h);
              h.onSuccess(a.data);
              h = null;
              d(l);
          });
          c();
          d(l);
      }
      function f(a) {
          throw "Worker error @L" + a.lineno + ": " + a.message;
      }
      var g = new window.Worker(a),
          h = null,
          l = {
              processItem: function (a) {
                  console.assert(!h);
                  h = a;
                  g.postMessage(a.texBuffer, [a.texBuffer]);
              },
              terminate: function () {
                  console.assert(!h);
                  g.terminate();
              },
          };
      g.addEventListener("error", f);
      g.addEventListener("message", e);
      g.postMessage(b);
  }
  function Sc(a, b, c, d) {
      function e() {
          n.deferRun();
          0 !== m.length &&
              (0 < l.length
                  ? (l.pop().processItem(m.pop()), e())
                  : h < d &&
                    !g &&
                    (h++,
                    (g = !0),
                    Rc(
                        f,
                        c,
                        function () {
                            g = !1;
                        },
                        function (a) {
                            l.push(a);
                            e();
                        }
                    )));
      }
      a =
          "\nself.importScripts(" +
          JSON.stringify(a) +
          ");\nconst initBasis = " +
          Qc.toString() +
          ";\nconst basisFormats = " +
          JSON.stringify(Pc) +
          ";\nconst glDetector = " +
          JSON.stringify({ astcTextures: b.gl.astcTextures, dxtTextures: b.gl.dxtTextures, etc1Textures: b.gl.etc1Textures, pvrtcTextures: b.gl.pvrtcTextures }) +
          ";\n\nfunction initHandler(evt) {\n  self.removeEventListener('message', initHandler);\n\n  const wasmBinary = evt.data;\n  initBasis(BASIS, wasmBinary, basisFormats, glDetector,\n            decodeTexBuffer => {\n    self.addEventListener('message', function(evt) {\n        const texBuffer = evt.data;\n        const texDatas = decodeTexBuffer(texBuffer);\n        // second argument to transfer ownership to the main thread\n        self.postMessage(texDatas, texDatas.mipmaps.map(t => t.data.buffer));\n    });\n    self.postMessage({}); // communicate end of init\n  });\n}\n\nself.addEventListener('message', initHandler);\n";
      var f = window.URL.createObjectURL(new window.Blob([a])),
          g = !1,
          h = 0,
          l = [],
          m = [],
          n = new WALK.DeferringExecutorOnce(function () {
              for (var a = _.makeIterator(l), b = a.next(); !b.done; b = a.next()) b.value.terminate();
              h -= l.length;
              l.length = 0;
          }, 5e3);
      return function (a, b, c) {
          m.push({ texBuffer: a, onSuccess: b, onError: c });
          e();
      };
  }
  function Tc(a, b) {
      WALK.ajaxGet(
          WALK.getViewerAssetUrl("lib/basis/basis_transcoder.wasm"),
          !0,
          function (c) {
              var d = WALK.getViewerAssetUrl("lib/basis/basis_transcoder.js"),
                  e = a.BASIS_DECODE_WORKERS;
              if (0 >= e) {
                  var f = window.document.createElement("script");
                  f.addEventListener("load", function h() {
                      f.removeEventListener("load", h);
                      Qc(window.BASIS, c, Pc, a.gl, function (a) {
                          b(function (b, c, d) {
                              try {
                                  c(a(b));
                              } catch (r) {
                                  d(r);
                              }
                          });
                      });
                  });
                  f.src = d;
                  window.document.head.appendChild(f);
              } else b(Sc(d, a, c, e));
          },
          function (a) {
              throw a;
          }
      );
  }
  function Uc(a) {
      function b(a) {
          for (var b = [], c = 0; c < arguments.length; ++c) b[c - 0] = arguments[c];
          d.push(b);
      }
      function c(a) {
          b = a;
          d.forEach(function (a) {
              return b.apply(null, _.arrayFromIterable(a));
          });
          d.length = 0;
      }
      if (!window.WebAssembly || !(a.gl.pvrtcTextures || a.gl.etc1Textures || a.gl.dxtTextures || a.gl.astcTextures)) return null;
      var d = [],
          e = !1;
      return {
          load: function (d, g, h) {
              var f = new pb();
              e || ((e = !0), Tc(a, c));
              d(function (a) {
                  b(
                      a,
                      function (a) {
                          f.format = a.gpuFormat;
                          a = a.mipmaps;
                          f.mipmaps = a;
                          f.width = a[0].width;
                          f.height = a[0].height;
                          f.generateMipmaps = !1;
                          f.minFilter = 1 === a.length ? GLC.LINEAR : GLC.LINEAR_MIPMAP_LINEAR;
                          f.flipY = !1;
                          f.needsUpdate = !0;
                          g(f);
                      },
                      h
                  );
              }, h);
              return f;
          },
      };
  }
  var Vc = !1;
  function Wc(a, b, c) {
      function d() {
          Vc = !0;
          var d = CryptoJS.lib.WordArray.create(a),
              f = d.clone();
          f.sigBytes = 16;
          f.clamp();
          d.words.splice(0, 4);
          d.sigBytes -= 16;
          var g = CryptoJS.enc.Base64.parse(b);
          f = CryptoJS.AES.decrypt({ ciphertext: d }, g, { iv: f, mode: CryptoJS.mode.CFB });
          d = f.sigBytes;
          f = f.words;
          g = new Uint8Array(d);
          for (var h = 0, l = 0; h !== d; ) {
              var m = f[l++];
              g[h++] = (m & 4278190080) >>> 24;
              if (h === d) break;
              g[h++] = (m & 16711680) >>> 16;
              if (h === d) break;
              g[h++] = (m & 65280) >>> 8;
              if (h === d) break;
              g[h++] = m & 255;
          }
          c(g.buffer);
      }
      Vc
          ? d()
          : WALK.loadScriptAndExecute(WALK.getViewerAssetUrl("lib/crypto-js.min.js"), d, function () {
                return za.error("Cannot load required library");
            });
  }
  function Xc() {
      this.load = function (a, b, c, d) {
          var e = [],
              f = new pb();
          f.image = e;
          WALK.queueAjaxGet(
              a,
              b,
              !0,
              function (a) {
                  var b = [],
                      d = new Int32Array(a, 0, 16);
                  67305985 === d[3] && console.assert("Big endian machines not supported");
                  console.assert(0 === d[4]);
                  console.assert(1 === d[5]);
                  console.assert(0 === d[6]);
                  if (35842 === d[7]) {
                      console.assert(6408 === d[8]);
                      var g = GLC.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                  } else
                      36196 === d[7]
                          ? (console.assert(6407 === d[8]), (g = GLC.COMPRESSED_RGB_ETC1_WEBGL))
                          : 33776 === d[7]
                          ? (console.assert(6407 === d[8]), (g = GLC.COMPRESSED_RGB_S3TC_DXT1_EXT))
                          : 33779 === d[7]
                          ? (console.assert(6408 === d[8]), (g = GLC.COMPRESSED_RGBA_S3TC_DXT5_EXT))
                          : console.error("Unknown KTX glInternalFormat: " + d[7]);
                  var n = d[9],
                      p = d[10];
                  console.assert(0 === (n & (n - 1)));
                  console.assert(0 === (p & (p - 1)));
                  console.assert(0 === d[11]);
                  console.assert(0 === d[12]);
                  console.assert(1 === d[13]);
                  var r = d[14];
                  d = d[15];
                  console.assert(0 === d % 4);
                  d = 64 + d;
                  for (var q = new DataView(a, 0), u = n, v = p, w = 0; w < r; ++w) {
                      var y = q.getUint32(d, !0);
                      d += 4;
                      var z = new Uint8Array(a, d, y);
                      b.push({ data: z, width: u, height: v });
                      d += y + (3 - ((y + 3) % 4));
                      u = Math.max(u / 2, 1);
                      v = Math.max(v / 2, 1);
                  }
                  console.assert(d === a.byteLength);
                  a = { format: g, width: n, height: p, mipmapCount: r, mipmaps: b };
                  if (a.isCubemap)
                      for (b = a.mipmaps.length / a.mipmapCount, g = 0; g < b; g += 1)
                          for (e[g] = { mipmaps: [] }, n = 0; n < a.mipmapCount; n += 1) e[g].mipmaps.push(a.mipmaps[g * a.mipmapCount + n]), (e[g].format = a.format), (e[g].width = a.width), (e[g].height = a.height);
                  else (f.image.width = a.width), (f.image.height = a.height), (f.mipmaps = a.mipmaps);
                  1 === a.mipmapCount && (f.minFilter = GLC.LINEAR);
                  f.format = a.format;
                  f.width = a.width;
                  f.height = a.height;
                  c && c(f);
              },
              d
          );
          return f;
      };
  }
  function Yc() {
      var a = {};
      this.cacheKey = function (a, c, d, e, f) {
          return a + "@" + c + "@" + d + "@" + e + "@" + f;
      };
      this.get = function (b) {
          return a[b];
      };
      this.insert = function (b, c) {
          a[b] = c;
      };
  }
  function Zc(a, b) {
      return function (c, d) {
          WALK.queueAjaxGet(a, b, !0, c, d);
      };
  }
  function $c(a, b, c) {
      return function (d, e) {
          Zc(a, b)(function (a) {
              Wc(a, c, d, e);
          }, e);
      };
  }
  function ad(a, b, c, d, e, f) {
      function g(a) {
          h.image = a;
          h.width = a.width;
          h.height = a.height;
          e(h);
      }
      var h = new ob();
      h.format = c;
      void 0 !== d
          ? $c(
                a,
                b,
                d
            )(function (a) {
                a = new Uint8Array(a);
                var c = b.endsWith("png") ? "image/png" : "image/jpeg";
                a = new Blob([a], { type: c });
                a = (window.URL || window.webkitURL).createObjectURL(a);
                var d = new Image();
                d.onload = function () {
                    g(d);
                };
                d.src = a;
            }, f)
          : WALK.queueImageGet(a, b, g, f);
      return h;
  }
  function bd(a, b, c, d, e, f) {
      var g = new rb();
      g.format = c;
      WALK.queueVideoGet(
          a,
          b,
          function (a) {
              g.video = a;
              g.width = a.videoWidth;
              g.height = a.videoHeight;
              a = THREE.Math.isPowerOfTwo(g.width) && THREE.Math.isPowerOfTwo(g.height);
              g.wrapS = a ? GLC.REPEAT : GLC.CLAMP_TO_EDGE;
              g.wrapT = a ? GLC.REPEAT : GLC.CLAMP_TO_EDGE;
              e(g);
              d && g.pause();
          },
          f
      );
      return g;
  }
  function cd(a, b) {
      !1 === a.importGpuCompress && (b.importGpuCompress = !1);
      !1 === a.importAutoScale && (b.importAutoScale = !1);
  }
  function dd(a, b, c, d, e, f, g) {
      function h(c) {
          var d = c.id,
              e = c.webFormats;
          console.assert(e && 0 < e.length, "No web format for texture: " + c.id + "." + c.rawExt);
          if (c.video) return a + "video/" + e[0] + "/" + d + "." + c.stdExt;
          var f = a + "img/",
              g = b.ios && c.rgbm;
          if (v && !g) {
              if (!b.mobile && -1 < e.indexOf("large/basis")) return f + "large/basis/" + d + ".basis";
              if (-1 < e.indexOf("small/basis")) return f + "small/basis/" + d + ".basis";
          }
          if (b.gl.pvrtcTextures && !g && -1 < e.indexOf("small/pvr")) return f + "small/pvr/" + d + ".ktx";
          if (b.gl.etc1Textures && -1 < e.indexOf("small/etc1")) return f + "small/etc1/" + d + ".ktx";
          if (b.gl.dxtTextures && -1 < e.indexOf("large/dxt")) return f + "large/dxt/" + d + ".ktx";
          g = -1 < e.indexOf("small/std");
          return !(-1 < e.indexOf("large/std")) || (b.mobile && g) ? f + "small/std/" + d + "." + c.stdExt : f + "large/std/" + d + "." + c.stdExt;
      }
      function l(a) {
          --r.texturesToLoad;
          a.needsUpdate = !0;
          c(a);
          a.notifyLoaded();
      }
      function m() {
          --r.texturesToLoad;
          d();
      }
      function n() {
          --r.texturesToLoad;
          e();
      }
      function p(a, b, c, d, e) {
          var f = new qb();
          WALK.queueAjaxGet(
              a,
              b,
              !0,
              function (a) {
                  a = new Uint8Array(a, 0, a.byteLength);
                  var b = a[1];
                  f.image.width = Math.pow(2, a[0]);
                  f.image.height = Math.pow(2, b);
                  f.format = c;
                  f.type = GLC.UNSIGNED_BYTE;
                  f.image.data = a.subarray(2);
                  d && d(f);
                  f = null;
              },
              e
          );
          return f;
      }
      var r = this,
          q = new Yc(),
          u = new Xc(),
          v = !WALK.NO_BASIS && Uc(b);
      f && (q.insert = function () {});
      this.texturesToLoad = 0;
      this.clearCache = function () {
          q = null;
      };
      this.load = function (a, b, c, d, e) {
          var f = b.alpha ? GLC.RGBA : GLC.RGB,
              w = h(b),
              y = /\.basis$/.test(w),
              z = /\.ktx$/.test(w),
              x = /\.buf$/.test(w),
              A = b.video,
              H = !(z || x || A),
              M = b.passphrase,
              N = q.cacheKey(w, c, d, e, f),
              G = q.get(N);
          if (G) return cd(b, G), G;
          r.texturesToLoad += 1;
          x
              ? (G = p(a, w, f, l, m))
              : y
              ? ((a = void 0 === M ? Zc(a, w) : $c(a, w, M)), (G = v.load(a, l, m)))
              : z
              ? (G = u.load(a, w, l, m))
              : H
              ? (G = ad(a, w, f, M, l, m))
              : (console.assert(A), (G = bd(WALK.LOAD_PRIORITY.VIDEO, w, f, g, l, n)));
          G.hasAlpha = !!b.alpha;
          G.isRgbm = !!b.rgbm;
          c && ((G.wrapS = GLC.REPEAT), (G.wrapT = GLC.REPEAT));
          d && !A ? ((G.minFilter = GLC.LINEAR_MIPMAP_LINEAR), (G.generateMipmaps = !z)) : ((G.minFilter = GLC.LINEAR), (G.generateMipmaps = !1));
          e && (G.anisotropy = e);
          q.insert(N, G);
          G.id = b.id;
          G.name = b.name;
          G.webFormats = b.webFormats;
          b.passphrase && (G.passphrase = b.passphrase);
          cd(b, G);
          b.rawExt && (G.rawExt = b.rawExt);
          G.stdExt = b.stdExt;
          return G;
      };
  }
  function ed(a) {
      for (var b = 0, c = 0; c < a.length; c += 1) a[c].id >= b && (b = a[c].id + 1);
      return b;
  }
  function fd(a, b) {
      for (var c = 0; c < a.length; c += 1) if (a[c].name === b) return !1;
      return !0;
  }
  function gd(a, b) {
      for (var c = a, d = 2; !fd(b, c); d += 1) c = a + d.toString();
      return c;
  }
  WALK.EditorHooks = function (a, b, c, d, e, f, g, h, l, m) {
      function n() {
          za.info("Failed to load texture");
      }
      var p = {
              geometryFacesCnt: a.nodes.reduce(function (a, b) {
                  return a + b.facesInSubtree();
              }, 0),
              objectsCnt: (function () {
                  var b = 0;
                  a.visitAllNodes(function (a) {
                      a.mesh && b++;
                  });
                  return b;
              })(),
              lightMapsCnt: (function () {
                  var b = -1;
                  a.visitAllNodes(function (a) {
                      a.mesh && a.mesh.lightMapIdx > b && (b = a.mesh.lightMapIdx);
                  });
                  return b + 1;
              })(),
          },
          r = new dd(
              WALK.ASSETS_URL,
              WALK.DETECTOR,
              function (a) {
                  null === a.isCutout && m.isCutoutTexture(a);
                  h.requestFrame();
              },
              n,
              n,
              !0,
              !1
          ),
          q = new Oc(r),
          u = e.transformControls;
      this.getExtensionManager = function () {
          return f;
      };
      this.getCameraPosition = function () {
          var a = c.cameraWorldPosition();
          return [a.x, a.y, a.z];
      };
      this.getCameraRotation = function () {
          return [THREE.Math.radToDeg(c.getYawAngle()), THREE.Math.radToDeg(c.getPitchAngle())];
      };
      this.getCamera = function () {
          return a.camera;
      };
      this.getSceneStats = function () {
          return p;
      };
      this.getMaterials = function () {
          return a.sortedMaterials();
      };
      this.getLights = function () {
          return a.lights;
      };
      this.getLightProbes = function () {
          return a.lightProbes;
      };
      this.getCameraVolumes = function () {
          return a.cameraVolumes;
      };
      this.getNodes = function () {
          return a.nodes;
      };
      this.getMinimap = function () {
          return l;
      };
      this.getMinimapConfig = function () {
          return a.minimapConfig;
      };
      this.setLevelSelectedCallback = function (a) {
          l.addEventListener("minimapLevelSelected", function (b) {
              null !== b.level && a(b.level);
          });
      };
      this.getBoundingBox = function () {
          return a.boundingBox;
      };
      this.addLight = function (b, c, d) {
          b = new WALK.Light({ name: gd(b, a.lights), type: c, doNotImport: !0 });
          b.addInstance(d);
          a.addLight(b);
      };
      this.removeLight = function (b) {
          a.removeLight(b);
      };
      this.renameLight = function (b, c) {
          c = c.trim() || "light";
          b.name = "";
          b.name = gd(c, a.lights);
      };
      this.addLightInstance = function (a, b, c) {
          a.addInstance(b, c);
      };
      this.removeLightInstance = function (a, b) {
          a.removeInstance(b);
      };
      this.addLightProbe = function (b) {
          var c = ed(a.lightProbes);
          b = new WALK.LightProbe({ id: c, position: b });
          b.enableBoundingBox();
          a.addLightProbe(b);
          1 === a.lightProbes.length && a.enableLightProbesForMaterials();
      };
      this.removeLightProbe = function (b) {
          a.removeLightProbe(b);
          0 === a.lightProbes.length && a.disableLightProbesForMaterials();
      };
      this.getCameraVolumeTypes = function () {
          return WALK.CameraVolume.CameraVolumeTypes;
      };
      this.addCameraVolume = function (b, c) {
          var d = new THREE.Vector3().fromArray(this.getCameraPosition()),
              e = this.getCameraRotation();
          e = new THREE.Vector3(0, 3, 0).applyEuler(new WALK.Euler((e[0] / 180) * Math.PI, (e[1] / 180) * Math.PI, 0));
          var f = ed(a.cameraVolumes);
          a.addCameraVolume(new WALK.CameraVolume({ id: f, name: c || b + f, type: b, position: d.add(e).toArray(), rotation: [0, 0, 0], scale: [1, 1, 1], exposure: a.camera.defaultExposure, gamma: a.camera.defaultGamma }));
      };
      this.removeCameraVolume = function (b) {
          a.removeCameraVolume(b);
      };
      this.shiftCameraVolume = function (b, c) {
          a.shiftCameraVolume(b, c);
      };
      this.getViews = function () {
          return a.views.filter(function (a) {
              return !a.internal;
          });
      };
      this.markScreenshotArea = function (a) {
          g.markArea(a);
      };
      this.unmarkScreenshotArea = function () {
          g.unmarkArea();
      };
      this.monoScreenToBuffer = function (a, b, c) {
          return g.monoScreenToBuffer(a, b, c);
      };
      this.stereoPanoramaToBuffer = function (a, b, c, d) {
          return g.stereoPanoramaToBuffer(a, b, c, d);
      };
      this.addViewFromCamera = function (b, d) {
          var e = [];
          console.assert("fps" === d || "top" === d || "orbit" === d);
          var f = c.cameraWorldPosition(),
              g = c.orbit;
          e[0] = THREE.Math.radToDeg(c.getYawAngle());
          e[1] = THREE.Math.radToDeg(c.getPitchAngle());
          b = { id: ed(a.views), name: gd(b.trim() || "view", a.views), rotation: e };
          "fps" === d
              ? ((b.mode = "fps"), (b.sky = WALK.EDITOR_CONTROLLED_SKY_NAME), (b.position = f.toArray()))
              : "top" === d
              ? ((b.mode = "orbit"),
                (b.sky = WALK.DEFAULT_SKY_NAME),
                (b.panPrimary = !0),
                (b.noPitchRotate = !0),
                (b.rotation[1] = -90),
                (b.minUpAngle = 0),
                (b.maxUpAngle = Math.PI / 2),
                g.isEnabled()
                    ? ((b.target = [g.target.x, g.target.y, a.boundingBox.min.z]), (b.distance = g.getCameraDistance()), (b.minDistance = g.getMinDistance()), (b.maxDistance = g.getMaxDistance()))
                    : ((b.target = [f.x, f.y, a.boundingBox.min.z]), (b.distance = Math.max(f.z - a.boundingBox.min.z, 1))))
              : ((b.mode = "orbit"),
                (b.sky = WALK.DEFAULT_SKY_NAME),
                (b.panPrimary = !1),
                (b.noPitchRotate = !1),
                g.isEnabled()
                    ? ((b.target = g.target.toArray()),
                      (b.distance = g.getCameraDistance()),
                      (b.minDistance = g.getMinDistance()),
                      (b.maxDistance = g.getMaxDistance()),
                      (b.minUpAngle = -g.getMaxPitchAngle()),
                      (b.maxUpAngle = -g.getMinPitchAngle()),
                      (b.noPan = g.getNoPan()))
                    : ((b.minUpAngle = 0),
                      (b.maxUpAngle = Math.PI / 2),
                      (d = a.boundingBox.center()),
                      (b.target = d.toArray()),
                      d.sub(f),
                      (b.distance = d.length()),
                      d.normalize(),
                      (b.rotation = [THREE.Math.radToDeg(Math.atan2(-d.x, d.y)), THREE.Math.radToDeg(Math.asin(d.z))]),
                      (b.rotation[1] = THREE.Math.clamp(b.rotation[1], -b.maxUpAngle, b.minUpAngle))));
          f = new WALK.View(b);
          a.addView(f);
          return f;
      };
      this.cloneView = function (b) {
          var c = [THREE.Math.radToDeg(b.rotation.yaw), THREE.Math.radToDeg(b.rotation.pitch)],
              d = b.serialize();
          d.id = ed(a.views);
          d.name = gd(b.name.trim() || "view", a.views);
          d.rotation = c;
          "fps" === b.mode ? (d.position = b.position.toArray()) : (d.target = b.target.toArray());
          var e = new WALK.View(d);
          a.addView(e);
          a.nodeConfigs.forEach(function (a) {
              a.hideInViews && a.isOnHideInViews(b.id) && a.addToHideInViews(e.id);
          });
          return e;
      };
      this.resetViewFromCamera = function (a) {
          var b = c.cameraWorldPosition();
          "fps" === a.mode ? a.position.copy(b) : (a.target.copy(c.orbit.target), (a.distance = b.distanceTo(a.target)));
          ("fps" !== a.mode && a.isTop()) || (a.rotation.pitch = c.getPitchAngle());
          a.setYaw(c.getYawAngle());
      };
      this.removeView = function (b) {
          a.removeView(b);
      };
      this.shiftView = function (b, c) {
          a.shiftView(b, c);
      };
      this.activateSkyForView = function (a) {
          d.activateSky(a);
      };
      this.switchToView = function (a) {
          d.switchToView(a);
          focusWalkCanvas();
      };
      this.renameView = function (b, c) {
          c = c.trim() || "view";
          b.name = "";
          b.setName(gd(c, a.views));
      };
      this.updateHiddenMeshes = function (a) {
          d.updateHiddenMeshes(a);
      };
      this.getSky = function () {
          return a.findSkyMesh(WALK.EDITOR_CONTROLLED_SKY_NAME);
      };
      this.loadTexture = function (a, b) {
          a = r.load(WALK.LOAD_PRIORITY.CORE_RESOURCE, a, !0, !0, WALK.DEFAULT_ANISOTROPY);
          "baseColorTexture" === b && (a.isCutout = null);
          return a;
      };
      this.materialTextureUpdated = function (b, c) {
          var d = new Set(),
              e = "";
          b.textureNeedsUv0(c) &&
              a.visitMeshesWithMaterial(b, function (a) {
                  0 === a.geometry.vertexCnt || a.uv0InBuffers() || d.has(a.node.type) || (d.add(a.node.type), 5 < d.size || ("" !== e && (e += ", "), (e += "'" + a.node.type + "'")));
              });
          return 0 < d.size && "Texture " + c + " won't be correctly mapped. The following objects lack base color UV mapping coming from the 3D modeling tool: " + e + (5 < d.size ? " (plus " + (d.size - 5) + " more)." : ".");
      };
      this.changeSkyTexture = function (b) {
          var c = a.findSkyMesh(WALK.EDITOR_CONTROLLED_SKY_NAME);
          c.isEquirect ? q.loadSkyTexture(c, b) : (a.removeSkyMesh(c), q.loadSingleSky({ name: WALK.EDITOR_CONTROLLED_SKY_NAME, type: "equirect", texture: b }, a, a.sharedMaterialState.fog));
          a.adjustSkiesAndCameraFarToSpanWholeScene();
      };
      this.removeSkyTexture = function () {
          var b = a.findSkyMesh(WALK.EDITOR_CONTROLLED_SKY_NAME);
          b.isEquirect && (a.removeSkyMesh(b), q.loadSingleSky({ name: WALK.EDITOR_CONTROLLED_SKY_NAME, type: "procedural" }, a, a.sharedMaterialState.fog));
          a.adjustSkiesAndCameraFarToSpanWholeScene();
      };
      this.getColorMapName = function () {
          return a.camera.colorMap ? a.camera.colorMap.name : null;
      };
      this.loadColorMap = function (a) {
          a = r.load(WALK.LOAD_PRIORITY.CORE_RESOURCE, a, !1, !1, WALK.NO_ANISOTROPY);
          a.flipY = !1;
          return a;
      };
      this.getSceneJson = function () {
          return a.serialize();
      };
      this.getCoverJson = function () {
          var a = b.cover;
          a.extensions = f.getConfig();
          return a;
      };
      this.disableSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.OFF);
      };
      this.enableMaterialSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.MATERIAL);
      };
      this.enableLightSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.LIGHT);
      };
      this.enableLightProbeSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.LIGHT_PROBE);
      };
      this.enableExtensionSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.EXTENSION);
      };
      this.enablePositionSelection = function (a) {
          e.setDistanceToObject(a);
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.POSITION);
      };
      this.enableNodeSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.NODE);
      };
      this.enableCameraVolumeSelection = function () {
          e.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.CAMERA_VOLUME);
      };
      this.selectMaterial = function (a) {
          e.selectMaterial(a);
      };
      this.replaceMaterial = function (b, c) {
          b = a.replaceMaterial(b, c);
          b.isAnimated && b.play();
          return b;
      };
      this.selectLights = function (a, b) {
          e.selectLights(a, b);
      };
      this.selectLightInstances = function (a, b, c) {
          e.selectLightInstances(a, b, c);
      };
      this.selectLightProbe = function (a) {
          e.selectLightProbe(a, !1);
      };
      this.selectCameraVolume = function (a) {
          e.selectEditorCameraVolume(a);
      };
      this.selectExtension = function (a) {
          e.selectExtension(a, !1);
      };
      this.selectNodes = function (a, b, c, d, f) {
          e.selectNodes(a, b, c, d, f);
      };
      this.setMaterialClickedCallback = function (a) {
          e.setMaterialClickedCallback(a);
      };
      this.setLightInstanceClickedCallback = function (a) {
          e.setLightInstanceClickedCallback(a);
      };
      this.setLightProbeClickedCallback = function (a) {
          e.setLightProbeClickedCallback(a);
      };
      this.setNodeClickedCallback = function (a) {
          e.setNodeClickedCallback(a);
      };
      this.setExtensionClickedCallback = function (a) {
          e.setExtensionClickedCallback(a);
      };
      this.setPositionClickedCallback = function (a) {
          e.setPositionClickedCallback(a);
      };
      this.setItemModifiedCallback = function (a) {
          u.setItemModifiedCallback(a);
      };
      this.setViewSelectedCallback = function (a) {
          d.addEventListener("teleportStarted", function (b) {
              null !== b.view && a(b.view);
          });
      };
      this.coverModified = function (a) {
          b.updateCover(a);
      };
      this.autoTourModified = function () {
          b.refresh();
      };
      this.hasLightMap = function () {
          return a.hasLightMap();
      };
      this.getAutoTour = function () {
          return a.autoTour;
      };
      this.getDisableProgressiveLoader = function () {
          return a.disableProgressiveLoader;
      };
      this.setDisableProgressiveLoader = function (b) {
          a.disableProgressiveLoader = b;
      };
      this.getInteractionPrompt = function () {
          return a.interactionPrompt;
      };
      this.setInteractionPrompt = function (b) {
          a.interactionPrompt = b;
      };
      this.getSceneScaleHtmlWarning = function () {
          var b = a.boundingBox;
          return !b.empty() && ((b = b.size()), 200 < b.x || 200 < b.y || 200 < b.z)
              ? "The scene has unusually large dimensions: <strong>" +
                    Math.round(b.x) +
                    "m x " +
                    Math.round(b.y) +
                    "m x " +
                    Math.round(b.z) +
                    'm</strong>.</br></br>Actif3D assumes real-world scale, 1 meter in the scene should correspond to 1 meter in the real world. If the scale of the scene is invalid, either re-scale the model or change the scale in the import dialog, otherwise you can disable this message.</br></br>For more information consult <a href="/assets/help.html#importing-the-scene">Importing the scene</a> section of the help.'
              : null;
      };
      this.getTransformMode = function () {
          return u.mode;
      };
      this.setTransformMode = function (a) {
          u.setTransformMode(a);
      };
      this.getSupportedTransformModes = function () {
          return u.supportedModes;
      };
      this.seeItem = function (a) {
          WALK.getViewer().seeItem(a);
      };
  };
  WALK.SceneLoadConfig = function () {
      this.onSceneLoaded = null;
      this.enableCollisions = !0;
      this.forcedInitialCameraRotation = this.forcedInitialCameraPosition = null;
      this.sendCoverToServer = !1;
  };
  function hd() {
      var a = new THREE.BufferGeometry(),
          b = new Float32Array(288);
      a.addAttribute("position", new THREE.BufferAttribute(b, 3));
      var c = 0;
      [
          [
              [-1, -1, -1],
              [-1, -0.6, -1],
              [-0.6, -1, -1],
          ],
          [
              [-1, -1, -1],
              [-1, -1, -0.6],
              [-1, -0.6, -1],
          ],
          [
              [-1, -1, -1],
              [-0.6, -1, -1],
              [-1, -1, -0.6],
          ],
          [
              [-0.6, -1, -1],
              [-1, -0.6, -1],
              [-1, -1, -0.6],
          ],
          [
              [-1, -1, 1],
              [-0.6, -1, 1],
              [-1, -0.6, 1],
          ],
          [
              [-1, -1, 1],
              [-1, -0.6, 1],
              [-1, -1, 0.6],
          ],
          [
              [-1, -1, 1],
              [-1, -1, 0.6],
              [-0.6, -1, 1],
          ],
          [
              [-0.6, -1, 1],
              [-1, -1, 0.6],
              [-1, -0.6, 1],
          ],
          [
              [1, -1, -1],
              [0.6, -1, -1],
              [1, -0.6, -1],
          ],
          [
              [1, -1, -1],
              [1, -0.6, -1],
              [1, -1, -0.6],
          ],
          [
              [1, -1, -1],
              [1, -1, -0.6],
              [0.6, -1, -1],
          ],
          [
              [0.6, -1, -1],
              [1, -1, -0.6],
              [1, -0.6, -1],
          ],
          [
              [-1, 1, -1],
              [-0.6, 1, -1],
              [-1, 0.6, -1],
          ],
          [
              [-1, 1, -1],
              [-1, 0.6, -1],
              [-1, 1, -0.6],
          ],
          [
              [-1, 1, -1],
              [-1, 1, -0.6],
              [-0.6, 1, -1],
          ],
          [
              [-0.6, 1, -1],
              [-1, 1, -0.6],
              [-1, 0.6, -1],
          ],
          [
              [1, 1, 1],
              [0.6, 1, 1],
              [1, 0.6, 1],
          ],
          [
              [1, 1, 1],
              [1, 0.6, 1],
              [1, 1, 0.6],
          ],
          [
              [1, 1, 1],
              [1, 1, 0.6],
              [0.6, 1, 1],
          ],
          [
              [0.6, 1, 1],
              [1, 1, 0.6],
              [1, 0.6, 1],
          ],
          [
              [1, -1, 1],
              [1, -0.6, 1],
              [0.6, -1, 1],
          ],
          [
              [1, -1, 1],
              [1, -1, 0.6],
              [1, -0.6, 1],
          ],
          [
              [1, -1, 1],
              [0.6, -1, 1],
              [1, -1, 0.6],
          ],
          [
              [0.6, -1, 1],
              [1, -0.6, 1],
              [1, -1, 0.6],
          ],
          [
              [1, 1, -1],
              [1, 0.6, -1],
              [0.6, 1, -1],
          ],
          [
              [1, 1, -1],
              [1, 1, -0.6],
              [1, 0.6, -1],
          ],
          [
              [1, 1, -1],
              [0.6, 1, -1],
              [1, 1, -0.6],
          ],
          [
              [0.6, 1, -1],
              [1, 0.6, -1],
              [1, 1, -0.6],
          ],
          [
              [-1, 1, 1],
              [-1, 0.6, 1],
              [-0.6, 1, 1],
          ],
          [
              [-1, 1, 1],
              [-1, 1, 0.6],
              [-1, 0.6, 1],
          ],
          [
              [-1, 1, 1],
              [-0.6, 1, 1],
              [-1, 1, 0.6],
          ],
          [
              [-0.6, 1, 1],
              [-1, 0.6, 1],
              [-1, 1, 0.6],
          ],
      ].forEach(function (a) {
          for (var d = 0; 3 > d; d += 1) for (var f = 0; 3 > f; f += 1) (b[c] = a[d][f]), (c += 1);
      });
      a.computeVertexNormals();
      a.convertNormalsToSpherical();
      return a;
  }
  function id() {
      var a = new WALK.StandardMaterial();
      a.disableLightProbe = !0;
      a.headLight = !0;
      a.baseColor = WALK.EDITOR_SELECTION_COLOR;
      a.setUniforms();
      return a;
  }
  function jd() {
      function a(a, b) {
          g.push([
              [a.x, a.y, a.z],
              [b.x, a.y, a.z],
              [a.x, b.y, a.z],
          ]);
          g.push([
              [a.x, b.y, a.z],
              [b.x, a.y, a.z],
              [b.x, b.y, a.z],
          ]);
      }
      function b(a, b) {
          g.push([
              [a.x, a.y, a.z],
              [a.x, b.y, a.z],
              [a.x, a.y, b.z],
          ]);
          g.push([
              [a.x, a.y, b.z],
              [a.x, b.y, a.z],
              [a.x, b.y, b.z],
          ]);
      }
      function c(a, b) {
          g.push([
              [a.x, a.y, a.z],
              [b.x, a.y, a.z],
              [a.x, a.y, b.z],
          ]);
          g.push([
              [a.x, a.y, b.z],
              [b.x, a.y, a.z],
              [b.x, a.y, b.z],
          ]);
      }
      function d(d, e, f) {
          var g = Math.min(d.x, e.x),
              h = Math.min(d.y, e.y),
              l = Math.min(d.z, e.z),
              m = Math.max(d.x, e.x),
              n = Math.max(d.y, e.y);
          d = Math.max(d.z, e.z);
          "XY" !== f && (a({ x: m, y: h, z: l }, { x: g, y: n, z: l }), a({ x: g, y: h, z: d }, { x: m, y: n, z: d }));
          "YZ" !== f && (b({ x: g, y: n, z: l }, { x: g, y: h, z: d }), b({ x: m, y: h, z: l }, { x: m, y: n, z: d }));
          "XZ" !== f && (c({ x: m, y: n, z: l }, { x: g, y: n, z: d }), c({ x: g, y: h, z: l }, { x: m, y: h, z: d }));
      }
      var e = new THREE.BufferGeometry(),
          f = new Float32Array(864);
      e.addAttribute("position", new THREE.BufferAttribute(f, 3));
      var g = [];
      d({ x: -0.876, y: 0.876, z: 0.876 }, { x: 0.876, y: 0.866, z: 0.866 }, "YZ");
      d({ x: -0.876, y: 0.876, z: -0.866 }, { x: 0.876, y: 0.866, z: -0.876 }, "YZ");
      d({ x: -0.876, y: -0.876, z: -0.876 }, { x: 0.876, y: -0.866, z: -0.866 }, "YZ");
      d({ x: -0.876, y: -0.876, z: 0.876 }, { x: 0.876, y: -0.866, z: 0.866 }, "YZ");
      d({ x: 0.876, y: 0.876, z: 0.876 }, { x: 0.866, y: -0.876, z: 0.866 }, "XZ");
      d({ x: 0.876, y: 0.876, z: -0.876 }, { x: 0.866, y: -0.876, z: -0.866 }, "XZ");
      d({ x: -0.876, y: 0.876, z: -0.876 }, { x: -0.866, y: -0.876, z: -0.866 }, "XZ");
      d({ x: -0.876, y: 0.876, z: 0.876 }, { x: -0.866, y: -0.876, z: 0.866 }, "XZ");
      d({ x: 0.876, y: 0.876, z: 0.876 }, { x: 0.866, y: 0.866, z: -0.876 }, "XY");
      d({ x: 0.876, y: -0.876, z: 0.876 }, { x: 0.866, y: -0.866, z: -0.876 }, "XY");
      d({ x: -0.876, y: 0.876, z: 0.876 }, { x: -0.866, y: 0.866, z: -0.876 }, "XY");
      d({ x: -0.876, y: -0.876, z: 0.876 }, { x: -0.866, y: -0.866, z: -0.876 }, "XY");
      var h = 0;
      g.forEach(function (a) {
          for (var b = 0; 3 > b; b += 1) for (var c = 0; 3 > c; c += 1) (f[h] = a[b][c]), (h += 1);
      });
      e.computeVertexNormals();
      e.convertNormalsToSpherical();
      return e;
  }
  WALK.LightControls = function (a, b) {
      function c(a) {
          if ("spot" === a.type) {
              var b = THREE.Math.degToRad(a.angle);
              a = 1 * Math.cos(b / 2);
              b = new THREE.CylinderBufferGeometry(0, 1 * Math.sin(b / 2), a, 32, 1);
              u.makeTranslation(0, -a / 2, 0);
              q.makeRotationZ(Math.PI);
              v.multiplyMatrices(q, u);
              b.applyMatrix(v);
              b.convertNormalsToSpherical();
          } else b = "area" === a.type ? y : w;
          return b;
      }
      function d(b, c, d) {
          var e = new WALK.LightMaterial(b);
          d = new THREE.Mesh(d, e);
          d.visibilityId = null;
          var f = new THREE.Mesh(z, A);
          d.add(f);
          var g = new THREE.Mesh(x, A);
          c === p.selectedLightInstance || p.subSelectedLightInstances.includes(c) || (g.visible = !1);
          d.add(g);
          if ("sun" !== b.type) {
              var h = c.rotation.toQuaternion().multiply(d.quaternion);
              d.setRotationFromQuaternion(h);
              d.position.copy(c.position);
              "area" === b.type
                  ? ((e.side = THREE.DoubleSide), d.scale.set(b.width, 1, b.height), (e = Math.max(b.width, b.height) / 2), f.scale.set(e / b.width, e, e / b.height), g.scale.set(e / b.width, e, e / b.height))
                  : d.scale.set(b.size, b.size, b.size);
          } else (b = a.findSkyMesh(WALK.EDITOR_CONTROLLED_SKY_NAME).radius), (b = (1 * Math.PI * b * 1.5) / 360), WALK.sunRotationToPosition(a, c.rotation, d.position), d.scale.set(b, b, b);
          d.userData.lightInstance = c;
          d.updateMatrixWorld();
          p.lightInstanceMeshes.push(d);
          r && a.addAuxiliaryObject(d);
      }
      function e(a) {
          var b = c(a);
          a.forEachLightInstance(function (c) {
              d(a, c, b);
          });
      }
      function f(a) {
          for (var b = 0; b < p.lightInstanceMeshes.length; b += 1) {
              var c = p.lightInstanceMeshes[b];
              if (c.userData.lightInstance === a) return c;
          }
          return null;
      }
      function g(b) {
          for (var c = [], d = 0; d < p.lightInstanceMeshes.length; d += 1) {
              var e = p.lightInstanceMeshes[d];
              e.userData.lightInstance.light === b ? (r && a.removeAuxiliaryObject(e), e.geometry !== w && e.geometry !== y && e.geometry.dispose(), e.material.dispose()) : c.push(e);
          }
          p.lightInstanceMeshes = c;
      }
      function h(a) {
          a = a.target;
          g(a);
          e(a);
      }
      function l(a) {
          a = a.instance;
          var e = a.light;
          var g = e.instances[0] !== a ? f(e.instances[0]).geometry : c(e);
          d(e, a, g);
          b.requestFrame();
      }
      function m(a) {
          a = a.instance.light;
          g(a);
          e(a);
          b.requestFrame();
      }
      function n(a) {
          e(a);
          a.addEventListener("updated", h);
          a.addEventListener("instanceAdded", l);
          a.addEventListener("instanceRemoved", m);
      }
      var p = this,
          r = !1,
          q = new THREE.Matrix4(),
          u = new THREE.Matrix4(),
          v = new THREE.Matrix4(),
          w = new THREE.SphereBufferGeometry(1, 32, 16);
      w.convertNormalsToSpherical();
      var y = new THREE.PlaneBufferGeometry(1, 1);
      q.makeRotationX(-Math.PI / 2);
      y.applyMatrix(q);
      y.convertNormalsToSpherical();
      var z = hd(),
          x = jd(),
          A = id();
      this.selectedLightInstance = null;
      this.subSelectedLightInstances = [];
      this.lightInstanceMeshes = [];
      this.getLightInstanceMaterial = function (a) {
          return f(a).material;
      };
      this.showLights = function () {
          if (!r) {
              r = !0;
              for (var b = 0; b < this.lightInstanceMeshes.length; b += 1) a.addAuxiliaryObject(this.lightInstanceMeshes[b]);
          }
      };
      this.showSelectionMesh = function (a, b) {
          this.lightInstanceMeshes.forEach(function (c) {
              c.children[0].visible = c.userData.lightInstance.light === a || b.includes(c.userData.lightInstance.light);
          });
      };
      this.showInstancesSelectionMesh = function (a, b) {
          this.selectedLightInstance = a;
          this.subSelectedLightInstances = b;
          this.lightInstanceMeshes.forEach(function (c) {
              c.children[1].visible = c.userData.lightInstance === a || b.includes(c.userData.lightInstance);
          });
      };
      this.hideLights = function () {
          if (r) {
              r = !1;
              for (var b = 0; b < this.lightInstanceMeshes.length; b += 1) a.removeAuxiliaryObject(this.lightInstanceMeshes[b]);
          }
      };
      a.lights.forEach(n);
      a.addEventListener("lightAdded", function (a) {
          n(a.light);
          b.requestFrame();
      });
      a.addEventListener("lightRemoved", function (a) {
          g(a.light);
          b.requestFrame();
      });
  };
  WALK.LightProbeControls = function (a, b) {
      function c(a, b) {
          b.position.addVectors(a.boxMin, a.boxMax).multiplyScalar(0.5).sub(a.position);
          b.scale.subVectors(a.boxMax, a.boxMin);
          b.scale.subScalar(0.005);
      }
      function d(b) {
          var d = new WALK.StandardMaterial();
          d.hideFromLightProbes = !0;
          d.disableLightProbe = !1;
          d.highlight = WALK.EDITOR_SELECTION_COLOR;
          d.metallic = 1;
          d.roughness = 0;
          d.setUniforms();
          d = new THREE.Mesh(r, d);
          d.visibilityId = null;
          d.lightProbe = b;
          d.position.copy(b.position);
          var e = new THREE.Mesh(u, q);
          e.visible = !1;
          d.add(e);
          b.isBoundingBoxEnabled() && c(b, e);
          d.updateMatrixWorld(!0);
          d.visible = n;
          m.lightProbeMeshes.push(d);
          a.addAuxiliaryObject(d);
      }
      function e(a) {
          for (var b = 0; b < m.lightProbeMeshes.length; b += 1) if (m.lightProbeMeshes[b].lightProbe === a) return b;
          console.assert(!1);
          return null;
      }
      function f(a) {
          a = a.target;
          var b = m.lightProbeMeshes[e(a)];
          b.position.copy(a.position);
          var d = b.children[0];
          a.isBoundingBoxEnabled() ? (c(a, d), (d.visible = !0)) : (d.visible = !1);
          b.updateMatrixWorld();
      }
      function g(a) {
          a = a.lightProbe;
          d(a);
          a.addEventListener("positionUpdated", f);
          a.addEventListener("boundsUpdated", f);
      }
      function h(b) {
          b = e(b.lightProbe);
          var c = m.lightProbeMeshes[b];
          a.removeAuxiliaryObject(c);
          c.material.dispose();
          m.lightProbeMeshes.splice(b, 1);
      }
      function l(a) {
          for (var b = 0; b < m.lightProbeMeshes.length; b += 1) {
              var c = m.lightProbeMeshes[b];
              if (c.lightProbe === a) return c;
          }
          return null;
      }
      var m = this,
          n = !1,
          p = null;
      this.lightProbeMeshes = [];
      var r = new THREE.SphereBufferGeometry(0.2, 32, 16);
      r.convertNormalsToSpherical();
      var q = WALK.createBoundingBoxMaterial(),
          u = new THREE.BoxBufferGeometry(1, 1, 1);
      u.addTriangleOrderAttribute();
      u.convertNormalsToSpherical();
      this.getLightProbeMaterial = function (a) {
          return (a = l(a)) ? a.material : null;
      };
      this.showLightProbeBoundingBox = function (a) {
          p && ((p.visible = !1), (p = null));
          a.isBoundingBoxEnabled() && ((p = l(a).children[0]), (p.visible = !0));
      };
      this.showLightProbes = function () {
          if (!n) {
              n = !0;
              for (var a = 0; a < this.lightProbeMeshes.length; a += 1) this.lightProbeMeshes[a].visible = !0;
          }
          b.requestFrame();
      };
      this.hideLightProbes = function () {
          if (n) {
              n = !1;
              for (var a = 0; a < this.lightProbeMeshes.length; a += 1) this.lightProbeMeshes[a].visible = !1;
          }
          b.requestFrame();
      };
      (function () {
          for (var b = 0; b < a.lightProbes.length; b += 1) {
              var c = a.lightProbes[b];
              d(c);
              c.addEventListener("positionUpdated", f);
              c.addEventListener("boundsUpdated", f);
          }
          a.addEventListener("lightProbeAdded", g);
          a.addEventListener("lightProbeRemoved", h);
      })();
  };
  WALK.CameraVolumeControls = function (a, b) {
      function c() {}
      function d(a) {
          function b() {
              d.position.copy(a.position);
              d.rotation.copy(a.rotation);
              d.scale.copy(a.scale);
              d.updateMatrixWorld();
          }
          var c = WALK.createBoundingBoxMaterial(),
              d = new THREE.Mesh(a.getVolumeGeometry(), c);
          d.visible = !1;
          d.visibilityId = null;
          f.add(d);
          e.set(a, d);
          b(a);
          a.addEventListener("updated", b);
      }
      var e = new Map(),
          f = new THREE.Object3D();
      f.visible = !1;
      a.addAuxiliaryObject(f);
      this.setHighlightedCameraVolume = function (a) {
          c();
          var b = e.get(a);
          b.visible = !0;
          c = function () {
              return (b.visible = !1);
          };
          return b.material;
      };
      this.setControlsVisible = function (a) {
          f.visible = a;
          b.requestFrame();
      };
      a.addEventListener("cameraVolumeAdded", function (a) {
          d(a.cameraVolume);
          b.requestFrame();
      });
      a.addEventListener("cameraVolumeRemoved", function (a) {
          a = a.cameraVolume;
          var c = e.get(a);
          f.remove(c);
          c.material.dispose();
          e.delete(a);
          b.requestFrame();
      });
      for (var g = 0; g < a.cameraVolumes.length; g += 1) d(a.cameraVolumes[g]);
  }; /*
Copyright (C) 2019-present Actif3D
*/
  WALK.sunRotationToPosition = function (a, b, c) {
      a = a.findSkyMesh(WALK.EDITOR_CONTROLLED_SKY_NAME);
      c.set(0, -a.radius, 0);
      c.applyEuler(b);
      c.add(a.position);
  };
  WALK.computeNodeBoundingSphere = function (a, b) {
      b.radius = 0;
      a.visitSubtree(function (a) {
          a.mesh && WALK.Math.spheresUnion(a.mesh.geometry.boundingSphere, b);
      });
  };
  var kd = { MAIN: 0, AUXILIARY: 1, SECONDARY: 2, NONE: -1 },
      ld = { SHIFT: 1, CTRL_EQUIVALENT: 2, ALT_EQUIVALENT: 4 };
  WALK.hasShiftKeyModifier = function (a) {
      return a & ld.SHIFT;
  };
  WALK.hasCtrlEquivalentKeyModifier = function (a) {
      return a & ld.CTRL_EQUIVALENT;
  };
  WALK.hasAltEquivalentModifier = function (a) {
      return a & ld.ALT_EQUIVALENT;
  };
  function md(a, b) {
      function c(a) {
          if (void 0 === a.button) return kd.MAIN;
          switch (a.button) {
              case 0:
                  return kd.MAIN;
              case 1:
                  return kd.AUXILIARY;
              case 2:
                  return kd.SECONDARY;
          }
          return kd.NONE;
      }
      function getTouchById(touchEvent, id, b) {
          if (!b)
              for (var i = 0; i < touchEvent.changedTouches.length; i++) {
                  var tch = touchEvent.changedTouches[i];
                  if (tch.identifier === id) return tch;
              }
          for (i = 0; i < touchEvent.touches.length; i++) if (((tch = touchEvent.touches[i]), tch.identifier === id)) return tch;
          return null;
      }
      function e(a, touchEvent) {
          if (0 !== a.length) {
              var c = void 0 !== touchEvent.touches;
              if (!c && (document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement)) (clip.clipX = 0), (clip.clipY = 0);
              else {
                  if (c) {
                      var tch = getTouchById(touchEvent, q);
                      console.assert(null !== tch);
                      c = tch.clientX;
                  } else (c = touchEvent.clientX);
                  var n = touchEvent.clientY;
                  clip.clipX = (c / window.innerWidth) * 2 - 1;
                  clip.clipY = 2 * -(n / window.innerHeight) + 1;
              }
              c = clip;
              for (n = 0; n < a.length; n++) {
                  var f = a[n].callback,
                      g = c.clipX,
                      h = c.clipY,
                      l = 0;
                  if ((touchEvent.ctrlKey && !WALK.DETECTOR.mac) || (touchEvent.metaKey && WALK.DETECTOR.mac)) l |= ld.CTRL_EQUIVALENT;
                  touchEvent.altKey && (l |= ld.ALT_EQUIVALENT);
                  touchEvent.shiftKey && (l |= ld.SHIFT);
                  if (f(g, h, l)) break;
              }
          }
      }
      function f(a) {
          c(a) !== kd.MAIN || r || ((r = !0), void 0 !== a.touches && (console.assert(0 < a.changedTouches.length), (q = a.changedTouches[0].identifier)), e(m, a));
      }
      function g(a) {
          if (c(a) === kd.MAIN) {
              var b = void 0 !== a.touches;
              (b && getTouchById(a, q, !0)) || !r || ((r = !1), e(n, a), b && (q = -1));
          }
      }
      function h(a) {
          (void 0 !== a.touches && -1 === q) || e(p, a);
      }
      function l(a, b, c) {
          var d = a.filter(function (a) {
              return a.callback === b;
          });
          console.assert(0 === d.length, "Do not add the same callback twice!");
          c = { callback: b, priority: c };
          for (d = d = 0; d < a.length; d += 1) {
              var e = a[d];
              if (c.priority <= e.priority) {
                  if (c.priority === e.priority) {
                      console.error("Adding two listeners with the same priority is not allowed!");
                      return;
                  }
                  break;
              }
          }
          a.splice(d, 0, c);
      }
      var m = [],
      n = [],
      p = [],
      r = !1,
      q = -1,
      clip = { clipX: 0, clipY: 0 };

      this.addPointerDownListener = function (a, b) {
          l(m, a, b);
      };
      this.removePointerDownListener = function (a) {
          m = m.filter(function (b) {
              return b.callback !== a;
          });
      };
      this.addPointerUpListener = function (a, b) {
          l(n, a, b);
      };
      this.removePointerUpListener = function (a) {
          n = n.filter(function (b) {
              return b.callback !== a;
          });
      };
      this.addPointerMoveListener = function (a, b) {
          l(p, a, b);
      };
      this.removePointerMoveListener = function (a) {
          p = p.filter(function (b) {
              return b.callback !== a;
          });
      };
      var v = !1;
      this.isEnabled = function () {
          return v;
      };
      this.enable = function () {
          v ||
              (a.addEventListener("mousedown", f, !1),
              a.addEventListener("touchstart", f, !1),
              a.addEventListener("mouseup", g, !1),
              a.addEventListener("touchend", g, !1),
              a.addEventListener("mousemove", h, !1),
              a.addEventListener("touchmove", h, !1),
              window.addEventListener("mouseup", g, !1),
              b && window.top.addEventListener("mouseup", g, !1),
              (v = !0));
      };
      this.disable = function () {
          v &&
              (a.removeEventListener("mousedown", f, !1),
              a.removeEventListener("touchstart", f, !1),
              a.removeEventListener("mouseup", g, !1),
              a.removeEventListener("touchend", g, !1),
              a.removeEventListener("mousemove", h, !1),
              a.removeEventListener("touchmove", h, !1),
              window.removeEventListener("mouseup", g, !1),
              b && window.top.removeEventListener("mouseup", g, !1),
              (v = !1));
      };
      this.enable();
  }
  WALK.TRANSFORM_MODE = { TRANSLATE: 0, ROTATE: 1, SCALE: 2 };

  var nd = new THREE.Color(16777215),
  rd = new THREE.Color(16711680),
  sd = new THREE.Color(65280),
  td = new THREE.Color(255),
  X = { NONE: 0, X: 1, Y: 2, Z: 4, ALL: 7 },
  ud = new THREE.Vector3(0, 0, 1),
  vd = new THREE.Vector3(1, 0, 0),
  wd = new THREE.Vector3(0, 1, 0);

  function xd(a) {
      var b = new THREE.Box3();
      a instanceof THREE.Object3D &&
          a.traverse(function (a) {
              a instanceof THREE.Mesh && (a.geometry.boundingBox || a.geometry.computeBoundingBox(), b.union(a.geometry.boundingBox));
          });
      return b;
  }
  function yd(a, b) {
      var c = xd(a);
      a = c.size();
      a = new THREE.BoxBufferGeometry(a.x, a.y, a.z);
      c = c.center();
      var d = new THREE.Matrix4();
      d.makeTranslation(c.x, c.y, c.z);
      a.applyMatrix(d);
      a.computeBoundingBox();
      b = new THREE.Mesh(a, b);
      b.visible = !1;
      b.visibilityId = null;
      return b;
  }
  function zd(a, b) {
      var c = new WALK.StandardMaterial();
      c.hideFromLightProbes = !0;
      c.baseColor.copy(a);
      c.opacity = b;
      c.specularOff = 1;
      c.depthTest = !1;
      c.depthWrite = !1;
      return c;
  }
  function Ad(a, b, c) {
      THREE.Object3D.call(this);
      this.add(a);
      this.add(b);
      this.material = c;
      this.collider = b;
      this.defaultOpacity = c.opacity;
      this.hoveredOpacity = 0.99;
      this.notUsedOpacity = 0.3;
      this.usedAxes = X.NONE;
  }
  Ad.prototype = Object.create(THREE.Object3D.prototype);
  Ad.prototype.constructor = Ad;
  function Bd(a) {
      for (var b = [], c = 0; c < arguments.length; ++c) b[c - 0] = arguments[c];
      console.assert(0 < b.length, "Part must have at least one element!");
      var d = new THREE.Object3D();
      b.forEach(function (a) {
          return d.add(a);
      });
      b = yd(d, zd(nd, 0.6));
      return new Ad(d, b, d.children[0].material);
  }
  function Cd() {
      function a(a) {
          a = zd(a, 0.6);
          a.depthTest = !0;
          return new THREE.Mesh(b, a);
      }
      THREE.Object3D.call(this);
      var b = new THREE.CylinderBufferGeometry(0.005, 0.005, 1e3, 4, 1, !1),
          c = a(rd);
      c.rotation.set(0, 0, Math.PI / 2);
      var d = a(sd),
          e = a(td);
      e.rotation.set(Math.PI / 2, 0, 0);
      this.add(c);
      this.add(d);
      this.add(e);
      var f = [!1, !1, !1];
      this.show = function (a) {
          f[0] = (X.X & a) === X.X;
          f[1] = (X.Y & a) === X.Y;
          f[2] = (X.Z & a) === X.Z;
          c.visible = f[0];
          d.visible = f[1];
          e.visible = f[2];
      };
      var g = new THREE.Vector3();
      this.update = function (a) {
          g.copy(a);
          g.sub(this.position);
          g.normalize();
          c.visible = f[0] && 0.998 > Math.abs(vd.dot(g));
          d.visible = f[1] && 0.998 > Math.abs(wd.dot(g));
          e.visible = f[2] && 0.998 > Math.abs(ud.dot(g));
      };
  }
  Cd.prototype = Object.create(THREE.Object3D.prototype);
  Cd.prototype.constructor = Cd;
  function Dd() {
      function a() {
          var a = zd(nd, 0.99);
          return new THREE.Mesh(b, a);
      }
      THREE.Object3D.call(this);
      var b = new THREE.SphereBufferGeometry(0.012, 10, 10),
          c = a(),
          d = a(),
          e = a();
      this.add(c);
      this.add(d);
      this.add(e);
      this.show = function (a) {
          c.visible = (X.X & a) === X.X;
          d.visible = (X.Y & a) === X.Y;
          e.visible = (X.Z & a) === X.Z;
      };
      this.update = function (a) {
          c.position.set(a.x, 0, 0);
          c.updateMatrixWorld();
          d.position.set(0, a.y, 0);
          d.updateMatrixWorld();
          e.position.set(0, 0, a.z);
          e.updateMatrixWorld();
      };
  }
  Dd.prototype = Object.create(THREE.Object3D.prototype);
  Dd.prototype.constructor = Dd;
  function Ed() {
      function a(a) {
          a = zd(a, 0.2);
          a.depthTest = !0;
          a.side = THREE.DoubleSide;
          return Bd(new THREE.Mesh(b, a));
      }
      THREE.Object3D.call(this);
      var b = new THREE.PlaneBufferGeometry(1e3, 1e3, 1, 1),
          c = a(nd);
      this.add(c);
      var d = new THREE.Object3D();
      this.add(d);
      var e = a(td);
      e.rotation.set(0, 0, 0);
      var f = a(sd);
      f.rotation.set(Math.PI / 2, 0, 0);
      var g = a(rd);
      g.rotation.set(0, Math.PI / 2, 0);
      d.add(e);
      d.add(f);
      d.add(g);
      this.setLocalRotation = function (a) {
          a ? d.rotation.copy(a) : d.rotation.set(0, 0, 0);
      };
      this.update = function (a) {
          c.rotation.setFromRotationMatrix(a.matrixWorld);
          c.updateMatrixWorld();
      };
      this.cameraPlane = c;
      this.findPlaneIntersectionPoint = (function () {
          function a(a) {
              switch (a) {
                  case X.X:
                      return g;
                  case X.Y:
                      return f;
                  case X.Z:
                      return e;
                  case X.X | X.Y:
                      return e;
                  case X.X | X.Z:
                      return f;
                  case X.Y | X.Z:
                      return g;
                  case X.ALL:
                      return c;
                  default:
                      throw "Impossible";
              }
          }
          var b = new THREE.Vector3(),
              d = new THREE.Vector3();
          return function (c, e, f, g) {
              var h = a(c);
              h.getWorldPosition(b).sub(e);
              h.getWorldDirection(d);
              if (c === X.X || c === X.Y || c === X.Z) {
                  c = d.dot(d);
                  h = d.dot(f);
                  var l = f.dot(f),
                      m = d.dot(b),
                      q = f.dot(b);
                  l = c * l - h * h;
                  c = 1e-5 > Math.abs(l) ? Infinity : (c * q - h * m) / l;
              } else (c = d.dot(f)), (c = 1e-5 > Math.abs(c) ? Infinity : d.dot(b) / c);
              if (Infinity === c) return !1;
              g.copy(f).multiplyScalar(c).add(e);
              return !0;
          };
      })();
      this.show = function (a) {
          c.visible = a === X.ALL ? !0 : !1;
          e.visible = (X.X | X.Y) === a;
          f.visible = (X.X | X.Z) === a;
          g.visible = (X.Y | X.Z) === a;
      };
  }
  Ed.prototype = Object.create(THREE.Object3D.prototype);
  Ed.prototype.constructor = Ed;
  function Fd(a, b, c) {
      var d = a.material;
      d.opacity = b === a.collider ? a.hoveredOpacity : c && null !== b ? a.notUsedOpacity : a.defaultOpacity;
      d.setUniforms();
  }
  function Gd() {
      function a(a) {
          for (var b = new Uint8Array(4096), c = Math.floor(255 * a.r), e = Math.floor(255 * a.g), f = Math.floor(255 * a.b), g = 0, h = 0; 32 > h; h++)
              for (var l = 0; 32 > l; l++) (b[g] = c), (b[g + 1] = e), (b[g + 2] = f), (b[g + 3] = 0 === h || 0 === l || 31 === h || 31 === l ? 220 : 150), (g += 4);
          b = new qb(b, 32, 32, THREE.RGBAFormat);
          b.hasAlpha = !0;
          b.needsUpdate = !0;
          b.loaded = !0;
          c = new WALK.StandardMaterial();
          c.hideFromLightProbes = !0;
          c.specularOff = 1;
          c.disableLightProbe = !0;
          c.depthTest = !1;
          c.depthWrite = !1;
          c.transparent = !0;
          c.baseColor = a;
          c.side = THREE.DoubleSide;
          c.baseColorTexture = b;
          c.opacity = 0.6;
          c.configureTransparency();
          c.setUniforms();
          return Bd(new THREE.Mesh(d.squareGeometry, c));
      }
      function b(a) {
          a = zd(a, 0.6);
          return Bd(new THREE.Mesh(d.lineGeometry, a), new THREE.Mesh(d.arrowHeadGeometry, a));
      }
      var c = this;
      THREE.Object3D.call(this);
      var d = (function () {
              var a = new THREE.Matrix4(),
                  b = new THREE.SphereBufferGeometry(0.1, 16, 16),
                  c = new THREE.PlaneBufferGeometry(0.23, 0.23, 1, 1);
              a.makeTranslation(0.45, 0.45, 0);
              c.applyMatrix(a);
              c.addTriangleOrderAttribute();
              var d = new THREE.CylinderBufferGeometry(0.015, 0.015, 1, 4, 1, !1);
              a.makeTranslation(0, 0.65, 0);
              d.applyMatrix(a);
              var e = new THREE.CylinderBufferGeometry(0, 0.05, 0.2, 10, 1, !1);
              a.makeTranslation(0, 1.25, 0);
              e.applyMatrix(a);
              return { pickerGeometry: b, squareGeometry: c, lineGeometry: d, arrowHeadGeometry: e };
          })(),
          e = (function () {
              var a = zd(nd, 0.6);
              return Bd(new THREE.Mesh(d.pickerGeometry, a));
          })(),
          f = b(rd);
      f.rotation.set(0, 0, -Math.PI / 2);
      var g = b(sd),
          h = b(td);
      h.rotation.set(Math.PI / 2, 0, 0);
      var l = a(td),
          m = a(sd);
      m.rotation.set(Math.PI / 2, 0, 0);
      var n = a(rd);
      n.rotation.set(0, -Math.PI / 2, 0);
      e.usedAxes = X.ALL;
      f.usedAxes = X.X;
      g.usedAxes = X.Y;
      h.usedAxes = X.Z;
      l.usedAxes = X.X | X.Y;
      m.usedAxes = X.X | X.Z;
      n.usedAxes = X.Y | X.Z;
      var p = [e, f, g, h, l, m, n];
      p.forEach(function (a) {
          return c.add(a);
      });
      var r = new Map(
          p.map(function (a) {
              return [a.collider, a];
          })
      );
      this.colliders = [].concat(_.arrayFromIterable(r.keys()));
      this.highlight = function (a, b) {
          p.forEach(function (c) {
              return Fd(c, a, b);
          });
      };
      this.usedAxes = function (a) {
          return r.get(a).usedAxes;
      };
  }
  Gd.prototype = Object.create(THREE.Object3D.prototype);
  Gd.prototype.constructor = Gd;
  function Hd() {
      function a(a) {
          var b = new THREE.TorusBufferGeometry(a, 0.012, 6, 64);
          a = new THREE.TorusBufferGeometry(a, 0.038, 6, 64);
          return { torusGeometry: b, colliderGeometry: a };
      }
      function b(a, b) {
          a = new WALK.RotateGizmoMaterial(a, 0.6);
          var c = new THREE.Object3D();
          c.add(new THREE.Mesh(b.torusGeometry, a));
          b = new THREE.Mesh(b.colliderGeometry, a);
          b.visible = !1;
          b.visibilityId = null;
          return new Ad(c, b, a);
      }
      var c = this;
      THREE.Object3D.call(this);
      var d = a(0.9),
          e = b(rd, d);
      e.rotation.set(0, Math.PI / 2, 0);
      var f = b(sd, d);
      f.rotation.set(Math.PI / 2, 0, 0);
      d = b(td, d);
      var g = a(1.12),
          h = b(nd, g),
          l = (function (a, b) {
              a = zd(a, 0);
              var c = new THREE.SphereBufferGeometry(b, 32, 32);
              b = new THREE.Object3D();
              b.add(new THREE.Mesh(c, a));
              c = new THREE.Mesh(c, a);
              c.visible = !1;
              c.visibilityId = null;
              a = new Ad(b, c, a);
              a.defaultOpacity = 0;
              a.hoveredOpacity = 0.2;
              a.notUsedOpacity = 0;
              return a;
          })(nd, 0.848),
          m = [e, f, d, h, l];
      m.forEach(function (a) {
          return c.add(a);
      });
      var n = new Map(
          m.map(function (a) {
              return [a.collider, a];
          })
      );
      this.colliders = [].concat(_.arrayFromIterable(n.keys()));
      this.update = function (a) {
          var b = this;
          m.filter(function (a) {
              return a !== l;
          }).forEach(function (a) {
              a = a.material;
              a.gizmoPosition.copy(b.position);
              a.sphereRadius = 0.86 * b.scale.x;
          });
          h.rotation.setFromRotationMatrix(a.matrixWorld);
          h.updateMatrixWorld();
      };
      e.usedAxes = X.X;
      f.usedAxes = X.Y;
      d.usedAxes = X.Z;
      h.usedAxes = X.ALL;
      l.usedAxes = X.NONE;
      this.highlight = function (a, b) {
          m.forEach(function (c) {
              return Fd(c, a, b);
          });
      };
      this.usedAxes = function (a) {
          return n.get(a).usedAxes;
      };
  }
  Hd.prototype = Object.create(THREE.Object3D.prototype);
  Hd.prototype.constructor = Hd;
  function Id() {
      function a(a) {
          for (var b = new Uint8Array(4096), c = Math.floor(255 * a.r), e = Math.floor(255 * a.g), f = Math.floor(255 * a.b), g = 0, h = 0; 32 > h; h++)
              for (var l = 0; 32 > l; l++) (b[g] = c), (b[g + 1] = e), (b[g + 2] = f), (b[g + 3] = 0 === h || 0 === l || 31 === h || 31 === l ? 220 : 150), (g += 4);
          b = new qb(b, 32, 32, THREE.RGBAFormat);
          b.hasAlpha = !0;
          b.needsUpdate = !0;
          b.loaded = !0;
          c = new WALK.StandardMaterial();
          c.hideFromLightProbes = !0;
          c.specularOff = 1;
          c.disableLightProbe = !0;
          c.depthTest = !1;
          c.depthWrite = !1;
          c.transparent = !0;
          c.baseColor = a;
          c.side = THREE.DoubleSide;
          c.baseColorTexture = b;
          c.opacity = 0.6;
          c.configureTransparency();
          c.setUniforms();
          return Bd(new THREE.Mesh(d.squareGeometry, c));
      }
      function b(a) {
          a = zd(a, 0.6);
          return Bd(new THREE.Mesh(d.lineGeometry, a), new THREE.Mesh(d.cubeGeometry, a));
      }
      var c = this;
      THREE.Object3D.call(this);
      var d = (function () {
              var a = new THREE.Matrix4(),
                  b = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3),
                  c = new THREE.PlaneBufferGeometry(0.23, 0.23, 1, 1);
              a.makeTranslation(0.45, 0.45, 0);
              c.applyMatrix(a);
              c.addTriangleOrderAttribute();
              var d = new THREE.CylinderBufferGeometry(0.015, 0.015, 1, 4, 1, !1);
              a.makeTranslation(0, 0.65, 0);
              d.applyMatrix(a);
              var e = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
              a.makeTranslation(0, 1.1, 0);
              e.applyMatrix(a);
              return { pickerGeometry: b, squareGeometry: c, lineGeometry: d, cubeGeometry: e };
          })(),
          e = (function () {
              var a = zd(nd, 0.6);
              return Bd(new THREE.Mesh(d.pickerGeometry, a));
          })(),
          f = b(rd);
      f.rotation.set(0, 0, -Math.PI / 2);
      var g = b(sd),
          h = b(td);
      h.rotation.set(Math.PI / 2, 0, 0);
      var l = a(td),
          m = a(sd);
      m.rotation.set(Math.PI / 2, 0, 0);
      var n = a(rd);
      n.rotation.set(0, -Math.PI / 2, 0);
      e.usedAxes = X.ALL;
      f.usedAxes = X.X;
      g.usedAxes = X.Y;
      h.usedAxes = X.Z;
      l.usedAxes = X.X | X.Y;
      m.usedAxes = X.X | X.Z;
      n.usedAxes = X.Y | X.Z;
      var p = [e, f, g, h, l, m, n];
      p.forEach(function (a) {
          return c.add(a);
      });
      var r = new Map(
          p.map(function (a) {
              return [a.collider, a];
          })
      );
      this.colliders = [].concat(_.arrayFromIterable(r.keys()));
      this.highlight = function (a, b) {
          p.forEach(function (c) {
              return Fd(c, a, b);
          });
      };
      this.usedAxes = function (a) {
          return r.get(a).usedAxes;
      };
  }
  Id.prototype = Object.create(THREE.Object3D.prototype);
  Id.prototype.constructor = Id;
  WALK.TransformGizmo = function (a, b, c, d) {
      function e(a) {
          h.oldPosition.copy(a);
          h.newPosition.copy(a);
          l.position.copy(a);
          m.position.copy(a);
          n.position.copy(a);
          p.position.copy(a);
          r.position.copy(a);
          q.position.copy(a);
      }
      function f(a) {
          h.oldRotation.copy(a);
          h.newRotation.copy(a);
          z === WALK.TRANSFORM_MODE.SCALE ? (l.rotation.copy(a), m.setLocalRotation(a), q.rotation.copy(h.oldRotation)) : (l.rotation.set(0, 0, 0), m.setLocalRotation(null));
      }
      function g() {
          x
              ? z === WALK.TRANSFORM_MODE.TRANSLATE
                  ? (a.addAuxiliaryObject(l), a.addAuxiliaryObject(m), a.addAuxiliaryObject(n), a.addAuxiliaryObject(p), a.removeAuxiliaryObject(r), a.removeAuxiliaryObject(q))
                  : z === WALK.TRANSFORM_MODE.ROTATE
                  ? (a.addAuxiliaryObject(l), a.removeAuxiliaryObject(p), a.addAuxiliaryObject(r), a.removeAuxiliaryObject(q))
                  : (a.addAuxiliaryObject(l), a.addAuxiliaryObject(m), a.removeAuxiliaryObject(p), a.removeAuxiliaryObject(r), a.addAuxiliaryObject(q))
              : (a.removeAuxiliaryObject(l), a.removeAuxiliaryObject(m), a.removeAuxiliaryObject(n), a.removeAuxiliaryObject(p), a.removeAuxiliaryObject(r), a.removeAuxiliaryObject(q));
      }
      var h = this;
      this.subTargetsInfo = this.target = null;
      var l = new Cd();
      l.show(X.ALL);
      var m = new Ed();
      m.show(X.NONE);
      var n = new Dd();
      n.show(X.NONE);
      var p = new Gd(),
          r = new Hd(),
          q = new Id(),
          u = !1;
      Object.defineProperty(this, "transforming", {
          get: function () {
              return u;
          },
      });
      var v = new THREE.Vector3(0, 0, 0),
          w = 0,
          y = new THREE.Vector3();
      this.oldPosition = new THREE.Vector3(0, 0, 0);
      this.newPosition = new THREE.Vector3(0, 0, 0);
      this.oldRotation = new THREE.Euler(0, 0, 0);
      this.newRotation = new THREE.Euler(0, 0, 0);
      this.oldScale = new THREE.Vector3(1, 1, 1);
      this.newScale = new THREE.Vector3(1, 1, 1);
      Object.defineProperty(this, "position", {
          get: function () {
              return l.position;
          },
      });
      Object.defineProperty(this, "rotation", {
          get: function () {
              return h.oldRotation;
          },
      });
      var z = !1;
      Object.defineProperty(this, "scale", {
          get: function () {
              return h.oldScale;
          },
      });
      var x = !1;
      Object.defineProperty(this, "mode", {
          get: function () {
              return z;
          },
          set: function (a) {
              z !== a && ((z = a), g(), d.requestFrame());
          },
      });
      Object.defineProperty(this, "visible", {
          get: function () {
              return x;
          },
          set: function (a) {
              x !== a && ((x = a), g());
          },
      });
      this.mode = WALK.TRANSFORM_MODE.TRANSLATE;
      var A = Infinity,
          B = Infinity,
          L = new THREE.Vector3(0, 0, 0),
          C = null,
          J = !1,
          F = X.ALL,
          I = (function () {
              var b = new THREE.Vector3(),
                  d = new THREE.Vector3(),
                  e = new THREE.Quaternion();
              return function (f, g, h) {
                  b.set(g, h, 1).unproject(a.camera);
                  b.sub(c).normalize();
                  if (!m.findPlaneIntersectionPoint(f, c, b, d)) return null;
                  d.sub(l.position);
                  d.applyQuaternion(e.setFromEuler(l.rotation).inverse());
                  f & X.X || (d.x = 0);
                  f & X.Y || (d.y = 0);
                  f & X.Z || (d.z = 0);
                  return d;
              };
          })(),
          H = (function () {
              var a = new THREE.Vector3(),
                  b = new THREE.Vector3(),
                  c = new THREE.Vector3();
              return function (d, e) {
                  var f = m.cameraPlane;
                  a.set(0, 0, -1);
                  a.transformDirection(f.matrixWorld);
                  b.set(-1, 0, 0);
                  b.transformDirection(f.matrixWorld);
                  d = I(X.ALL, d, e).normalize();
                  c.copy(b).cross(d);
                  return Math.sign(a.dot(c)) * Math.acos(b.dot(d));
              };
          })(),
          M = new THREE.Vector3();
      this.rotationSpeed = 5;
      var N = (function () {
              var a = new THREE.Vector2(0, 0),
                  b = new THREE.Quaternion(),
                  c = new THREE.Euler(),
                  d = new THREE.Quaternion(),
                  e = new THREE.Quaternion(),
                  f = new THREE.Vector3(),
                  g = new THREE.Vector3(),
                  l = new THREE.Vector3();
              return function (n, q) {
                  b.setFromEuler(h.oldRotation);
                  b.normalize();
                  a.set(A - n, B - q);
                  a.multiplyScalar(h.rotationSpeed);
                  if (F === X.NONE)
                      return (
                          (n = m.cameraPlane),
                          f.copy(vd),
                          f.transformDirection(n.matrixWorld),
                          g.set(0, 1, 0),
                          g.transformDirection(n.matrixWorld),
                          e.setFromAxisAngle(f, a.y),
                          d.setFromAxisAngle(g, -a.x),
                          d.multiply(e),
                          d.multiply(b),
                          d.normalize(),
                          c.setFromQuaternion(d, "ZXY"),
                          c
                      );
                  if (F === X.ALL) {
                      var p = m.cameraPlane;
                      l.set(0, 0, -1);
                      l.transformDirection(p.matrixWorld);
                      p = l;
                      n = H(n, q);
                      n -= w;
                  } else {
                      F !== X.Z && a.multiplyScalar((F === X.X ? -1 : 1) * Math.sign((F === X.X ? wd : vd).dot(M)));
                      a: {
                          switch (F) {
                              case X.X:
                                  p = vd;
                                  break a;
                              case X.Y:
                                  p = wd;
                                  break a;
                              case X.Z:
                                  p = ud;
                                  break a;
                          }
                          console.error("Unable to get direction for this value!");
                          p = void 0;
                      }
                      n = F === X.Z ? -a.x : a.y;
                  }
                  d.setFromAxisAngle(p, n);
                  d.multiply(b);
                  d.normalize();
                  c.setFromQuaternion(d, "ZXY");
                  return c;
              };
          })(),
          G = (function () {
              var a = { hoveredCollider: null, hasAnythingChanged: !1 };
              return function (c, d, e) {
                  var f = z === WALK.TRANSFORM_MODE.TRANSLATE ? p : z === WALK.TRANSFORM_MODE.ROTATE ? r : q;
                  c = b.findMeshFromListAtPosition(f.colliders, c, d, !0);
                  d = !1;
                  if (c !== C || J !== e) (C = c), f.highlight(c, e), (d = !0);
                  a.hoveredCollider = c;
                  a.hasAnythingChanged = d;
                  return a;
              };
          })();
      this.onCanvasPointerMove = function (a, b) {
          if (this.transforming) {
              if (this.mode === WALK.TRANSFORM_MODE.TRANSLATE) {
                  var c = I(F, a, b);
                  c && this.newPosition.copy(c.sub(v).add(l.position));
                  L.copy(this.newPosition);
                  L.sub(l.position);
                  L.divide(l.scale);
                  n.update(L);
                  if (a !== A || b !== B) (p.visible = !1), n.show(F), l.show(F);
              } else if (this.mode === WALK.TRANSFORM_MODE.ROTATE) {
                  if ((l.show(F), this.newRotation.copy(N(a, b)), a !== A || b !== B)) r.visible = !1;
              } else {
                  l.show(F);
                  if ((c = I(F, a, b))) c.addScalar(1).divide(y), this.newScale.copy(c);
                  if (a !== A || b !== B) q.visible = !1;
              }
              d.requestFrame();
              return !0;
          }
          G(a, b, J).hasAnythingChanged && d.requestFrame();
          return !1;
      };
      this.onCanvasPointerDown = function (a, b) {
          var c = G(a, b, !0);
          J = !0;
          if (null !== c.hoveredCollider)
              return (
                  (u = !0),
                  (F = (z === WALK.TRANSFORM_MODE.TRANSLATE ? p : z === WALK.TRANSFORM_MODE.ROTATE ? r : q).usedAxes(c.hoveredCollider)),
                  (A = a),
                  (B = b),
                  this.mode === WALK.TRANSFORM_MODE.TRANSLATE
                      ? (m.show(F), this.newPosition.copy(this.oldPosition), v.copy(I(F, a, b)))
                      : this.mode === WALK.TRANSFORM_MODE.ROTATE
                      ? F === X.ALL && (this.newRotation.copy(this.oldRotation), (w = H(a, b)))
                      : (m.show(F === X.ALL ? X.NONE : F), this.newScale.copy(this.oldScale), (a = I(F, a, b)), y.copy(a).addScalar(1).divide(this.oldScale)),
                  !0
              );
          F = X.ALL;
          u = !1;
          c.hasAnythingChanged && d.requestFrame();
          return !1;
      };
      this.onCanvasPointerUp = function (a, b) {
          if (this.transforming) {
              e(this.newPosition);
              f(this.newRotation);
              var c = this.newScale;
              h.oldScale.copy(c);
              h.newScale.copy(c);
              m.show(X.NONE);
              n.show(X.NONE);
              F = X.ALL;
              l.show(F);
              this.mode === WALK.TRANSFORM_MODE.TRANSLATE ? (p.visible = !0) : this.mode === WALK.TRANSFORM_MODE.ROTATE ? (r.visible = !0) : (q.visible = !0);
          }
          c = this.transforming;
          u = !1;
          this.update();
          G(a, b, !1).hasAnythingChanged && d.requestFrame();
          J = !1;
          return c;
      };
      this.update = function () {
          if (!this.transforming && (void 0 !== this.target.position && e(this.target.position), void 0 !== this.target.rotation && f(this.target.rotation), void 0 !== this.target.scale)) {
              var b = this.target.scale;
              h.oldScale.copy(b);
              h.newScale.copy(b);
          }
          M.copy(c);
          M.sub(l.position);
          M.normalize();
          b = (0.18 * l.position.distanceTo(c) * a.camera.fov) / 90;
          l.scale.set(b, b, b);
          m.scale.set(b, b, b);
          n.scale.set(b, b, b);
          p.scale.set(b, b, b);
          r.scale.set(b, b, b);
          q.scale.set(b, b, b);
          r.update(a.camera);
          m.update(a.camera);
          l.update(c);
          l.updateMatrixWorld();
          m.updateMatrixWorld();
          n.updateMatrixWorld();
          p.updateMatrixWorld();
          r.updateMatrixWorld();
          q.updateMatrixWorld();
      };
  };
  WALK.SubTargetData = function (a, b) {
      this.isSupported = function (a) {
          return b[a];
      };
      this.offsetPosition = function (b) {
          b = a.position.clone().add(b);
          a.setPosition(b.x, b.y, b.z);
      };
      this.offsetRotation = function (b) {
          a.setRotation(a.rotation.z + b.z, a.rotation.x + b.x, a.rotation.y + b.y);
      };
      this.offsetScale = function (b) {
          b = a.scale.clone().add(b);
          a.setScale(b.x, b.y, b.z);
      };
      Object.defineProperty(this, "target", {
          get: function () {
              return a;
          },
      });
  };
  WALK.TransformControls = function (a, b, c, d, e) {
      function f() {}
      function g(a) {
          e.isEnabled() !== a && (a ? e.enable() : e.disable());
      }
      var h = this,
          l = !1,
          m = new WALK.TransformGizmo(c, d, e.cameraWorldPosition(), b);
      m.mode = WALK.TRANSFORM_MODE.TRANSLATE;
      var n = { itemModified: f },
          p = [];
      Object.defineProperty(this, "supportedModes", {
          get: function () {
              return p;
          },
      });
      Object.defineProperty(this, "mode", {
          get: function () {
              return m.mode;
          },
      });
      this.setItemModifiedCallback = function (a) {
          console.assert(n.itemModified === f);
          n.itemModified = a;
      };
      var r = new tc(a, WALK.POINTER_PRIORITY.TRANSFORM_CONTROLS);
      r.callbacks.onPointerDown = function (a, b) {
          a = m.onCanvasPointerDown(a, b);
          g(!m.transforming);
          return a;
      };
      r.callbacks.onPointerUp = function (a, b) {
          a = m.onCanvasPointerUp(a, b);
          g(!m.transforming);
          return a;
      };
      r.callbacks.onPointerMove = function (a, b) {
          a = m.onCanvasPointerMove(a, b);
          if (m.transforming)
              if (m.mode === WALK.TRANSFORM_MODE.TRANSLATE) {
                  b = m.newPosition;
                  var c = b.clone().sub(h.target.position);
                  h.target.setPosition(b.x, b.y, b.z);
                  n.itemModified(h.target);
                  h.subTargetsData &&
                      h.subTargetsData.forEach(function (a) {
                          a.isSupported(m.mode) && (a.offsetPosition(c), n.itemModified(a.target));
                      });
              } else if (m.mode === WALK.TRANSFORM_MODE.ROTATE) {
                  b = m.newRotation;
                  var d = { x: b.x - h.target.rotation.x, y: b.y - h.target.rotation.y, z: b.z - h.target.rotation.z };
                  h.target.setRotation(h.target.rotation.z + d.z, h.target.rotation.x + d.x, h.target.rotation.y + d.y);
                  n.itemModified(h.target);
                  h.subTargetsData &&
                      h.subTargetsData.forEach(function (a) {
                          a.isSupported(m.mode) && (a.offsetRotation(d), n.itemModified(a.target));
                      });
              } else {
                  b = m.newScale;
                  var e = b.clone().sub(h.target.scale);
                  h.target.setScale(b.x, b.y, b.z);
                  n.itemModified(h.target);
                  h.subTargetsData &&
                      h.subTargetsData.forEach(function (a) {
                          a.isSupported(m.mode) && (a.offsetScale(e), n.itemModified(a.target));
                      });
              }
          return a;
      };
      r.disable();
      Object.defineProperty(this, "target", {
          get: function () {
              return m.target;
          },
      });
      Object.defineProperty(this, "subTargetsData", {
          get: function () {
              return m.subTargetsData;
          },
      });
      this.setTransformMode = function (a) {
          m.mode = a;
      };
      this.update = function () {
          l && m.update();
      };
      this.enable = function (a, b, c) {
          l = !0;
          m.target = a;
          m.subTargetsData = c;
          null !== a && (m.update(), (m.visible = !0));
          p = b;
          -1 === b.indexOf(m.mode) && (m.mode = b[0]);
          r.enable();
      };
      this.disable = function () {
          l = !1;
          p = [];
          m.visible = !1;
          r.disable();
      };
  };
  function Jd(a, b) {
      this._nodesPrimary = a;
      this._nodesSecondary = b;
  }
  Jd.prototype.constructor = Jd;
  Object.defineProperty(Jd.prototype, "highlightMix", {
      set: function (a) {
          this._nodesPrimary.forEach(function (b) {
              b.highlightMix = a;
          });
          this._nodesSecondary.forEach(function (b) {
              b.highlightMix = a;
          });
      },
  });
  Object.defineProperty(Jd.prototype, "selected", {
      set: function (a) {
          this._nodesPrimary.forEach(function (b) {
              b.selected = a;
          });
          this._nodesSecondary.forEach(function (b) {
              b.selectedSecondary = a;
          });
      },
  });
  WALK.EditorSelector = function (a, b, c, d, e, f, g, h, l) {
      function m() {}
      function n() {
          y.highlightMix = 0.8 * Math.pow(z / w.selectionTimeSec, 2);
      }
      function p(a) {
          null !== y && (y.highlightMix = 0);
          null !== a && ((y = a), (z = w.selectionTimeSec), n());
          h.requestFrame();
      }
      function r(a) {
          var b = a.geometry;
          b && void 0 === b.getAttribute("order") && a.visible && ((a.visible = !1), N.push(a));
      }
      function q() {
          for (var a = _.makeIterator(N), b = a.next(); !b.done; b = a.next()) b.value.visible = !0;
      }
      function u() {
          J.set(!0, !1, !1);
          F.set(I);
          b.gpuMeshes.forEach(function (a) {
              a.geometry.addTriangleOrderAttribute();
              a.highlightMix = 0;
              a.selected = !1;
              c.uploadNewBuffers(a);
          });
          N.length = 0;
          b.threeScene.traverse(r);
          b.threeScene.overrideMaterial = H;
          b.skyMeshes.forEach(function (a) {
              a.visible = !1;
          });
      }
      function v() {
          J.restore();
          F.restore();
          q();
          b.threeScene.overrideMaterial = null;
          b.gpuMeshes.forEach(function (a) {
              a.highlightMix = null;
              a.selected = null;
              a.selectedSecondary = !1;
          });
          x = null;
          b.skyMeshes.forEach(function (a) {
              a.visible = !0;
          });
      }
      var w = this,
          y = null,
          z = 0,
          x = null,
          A = 0,
          B = new xc(),
          L = new WALK.TransformControls(a, h, b, d, l),
          C = { materialClicked: m, lightInstanceClicked: m, lightProbeClicked: m, nodeClicked: m, extensionClicked: m, positionClicked: m },
          J = new uc(c),
          F = new vc(c),
          I = new THREE.Color(16777215),
          H = new WALK.WireframeMaterial(new THREE.Color(0));
      H.highlight = H.meshSelectedLineColor;
      var M;
      this.selectionTimeSec = 1;
      this.selectMaterial = function (a) {
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.MATERIAL);
          p(a);
      };
      this.selectLights = function (a, b) {
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.LIGHT);
          e.showSelectionMesh(a, b);
          h.requestFrame();
      };
      this.selectLightInstances = function (a, b, c) {
          function d(a) {
              return a.map(function (a) {
                  var b = WALK.SubTargetData,
                      c = [];
                  switch (a.light.type) {
                      case "point":
                          c[WALK.TRANSFORM_MODE.TRANSLATE] = !0;
                          break;
                      case "sun":
                          c[WALK.TRANSFORM_MODE.ROTATE] = !0;
                          break;
                      default:
                          (c[WALK.TRANSFORM_MODE.TRANSLATE] = !0), (c[WALK.TRANSFORM_MODE.ROTATE] = !0);
                  }
                  return new b(a, c);
              });
          }
          e.showInstancesSelectionMesh(a, b);
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.LIGHT);
          if (a) {
              var f = a.light.type;
              L.enable(a, "point" === f ? [WALK.TRANSFORM_MODE.TRANSLATE] : "sun" === f ? [WALK.TRANSFORM_MODE.ROTATE] : [WALK.TRANSFORM_MODE.TRANSLATE, WALK.TRANSFORM_MODE.ROTATE], d(b));
          } else L.disable();
          c ? ((a = e.getLightInstanceMaterial(c)), p(a)) : h.requestFrame();
      };
      this.selectLightProbe = function (a) {
          var b = null;
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.LIGHT_PROBE);
          a ? (f.showLightProbeBoundingBox(a), (b = f.getLightProbeMaterial(a)), L.enable(a, [WALK.TRANSFORM_MODE.TRANSLATE])) : L.disable();
          p(b);
      };
      this.selectEditorCameraVolume = function (a) {
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.CAMERA_VOLUME);
          a ? (p(g.setHighlightedCameraVolume(a)), L.enable(a, [WALK.TRANSFORM_MODE.TRANSLATE, WALK.TRANSFORM_MODE.ROTATE, WALK.TRANSFORM_MODE.SCALE])) : (p(null), L.disable());
      };
      this.selectExtension = function (a) {
          var b = null;
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.EXTENSION);
          a && 0 < a.triggers.length && (a = a.triggers[0].mesh) && (b = a.material);
          p(b);
      };
      this.selectNodes = function (a, b, c, d, e) {
          console.assert(M === WALK.EditorSelector.SELECTION_MODE.NODE);
          x && (x.selected = !1);
          a || b.length ? ((a = [a].concat(c)), (b = b.concat(d)), (x = new Jd(a, b)), (x.selected = !0)) : (x = null);
          e && ((e = new Jd([e], e.config.nodes)), p(e));
      };
      this.update = function (a) {
          L.update();
          null !== y && ((z -= a), 0 < z ? n() : ((y.highlightMix = 0), (y = null)), h.requestFrame());
      };
      var N = [];
      this.setDistanceToObject = function (a) {
          A = a;
      };
      this.setSelectionMode = function (a) {
          if (a !== M) {
              M === WALK.EditorSelector.SELECTION_MODE.NODE && v();
              M === WALK.EditorSelector.SELECTION_MODE.CAMERA_VOLUME && g.setControlsVisible(!1);
              switch (a) {
                  case WALK.EditorSelector.SELECTION_MODE.OFF:
                  case WALK.EditorSelector.SELECTION_MODE.MATERIAL:
                  case WALK.EditorSelector.SELECTION_MODE.EXTENSION:
                  case WALK.EditorSelector.SELECTION_MODE.POSITION:
                  case WALK.EditorSelector.SELECTION_MODE.CAMERA_VOLUME:
                      e.hideLights();
                      f.hideLightProbes();
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.LIGHT:
                      e.showLights();
                      f.hideLightProbes();
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.LIGHT_PROBE:
                      e.hideLights();
                      f.showLightProbes();
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.NODE:
                      e.hideLights(), f.hideLightProbes(), u();
              }
              a === WALK.EditorSelector.SELECTION_MODE.CAMERA_VOLUME && g.setControlsVisible(!0);
              L.disable();
              if (a === WALK.EditorSelector.SELECTION_MODE.MATERIAL || a === WALK.EditorSelector.SELECTION_MODE.EXTENSION) for (var c = _.makeIterator(b.getAnimatedMaterials()), d = c.next(); !d.done; d = c.next()) d.value.play();
              else for (c = _.makeIterator(b.getAnimatedMaterials()), d = c.next(); !d.done; d = c.next()) d.value.pause();
              M = a;
          }
      };
      this.setMaterialClickedCallback = function (a) {
          console.assert(C.materialClicked === m);
          C.materialClicked = a;
      };
      this.setLightInstanceClickedCallback = function (a) {
          console.assert(C.lightInstanceClicked === m);
          C.lightInstanceClicked = a;
      };
      this.setLightProbeClickedCallback = function (a) {
          console.assert(C.lightProbeClicked === m);
          C.lightProbeClicked = a;
      };
      this.setNodeClickedCallback = function (a) {
          console.assert(C.nodeClicked === m);
          C.nodeClicked = a;
      };
      this.setExtensionClickedCallback = function (a) {
          console.assert(C.extensionClicked === m);
          C.extensionClicked = a;
      };
      this.setPositionClickedCallback = function (a) {
          console.assert(C.positionClicked === m);
          C.positionClicked = a;
      };
      (function () {
          var b = new tc(a, WALK.POINTER_PRIORITY.EDITOR_SELECTOR);
          b.callbacks.onClick = function (a, b, c) {
              if (M === WALK.EditorSelector.SELECTION_MODE.OFF) return !1;
              var g = !1;
              switch (M) {
                  case WALK.EditorSelector.SELECTION_MODE.MATERIAL:
                      a = d.findObstacleMeshAtPosition(a, b, !1);
                      a = null !== a ? a.material : null;
                      null !== a && (g = C.materialClicked(a, c));
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.LIGHT:
                      a = d.findMeshFromListAtPosition(e.lightInstanceMeshes, a, b);
                      a = null !== a ? a.userData.lightInstance : null;
                      null !== a && (g = C.lightInstanceClicked(a, c));
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.LIGHT_PROBE:
                      a = d.findMeshFromListAtPosition(f.lightProbeMeshes, a, b);
                      a = null !== a ? a.lightProbe : null;
                      null !== a && (g = C.lightProbeClicked(a, c));
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.NODE:
                      a = d.findObstacleMeshAtPosition(a, b, !1);
                      (a = null !== a ? a.node : null) && (g = C.nodeClicked(a, c));
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.EXTENSION:
                      a = d.findIntersectionAtPosition(a, b, !1, B) ? B.object.anchor || null : null;
                      a && a.extension && (g = C.extensionClicked(a.extension, a, c));
                      break;
                  case WALK.EditorSelector.SELECTION_MODE.POSITION:
                      (a = d.findIntersectionAtPosition(a, b, !1, B) && !B.object.anchor ? d.movePointTowardsTheCamera(B.point, A) : null), a && (g = C.positionClicked(a, c));
              }
              return g;
          };
          b.callbacks.onDoubleClick = function () {
              return !1;
          };
      })();
      Object.defineProperty(this, "transformControls", {
          get: function () {
              return L;
          },
      });
      this.setSelectionMode(WALK.EditorSelector.SELECTION_MODE.OFF);
  };
  WALK.EditorSelector.SELECTION_MODE = { OFF: 0, MATERIAL: 1, LIGHT: 2, LIGHT_PROBE: 3, NODE: 4, EXTENSION: 6, POSITION: 7, CAMERA_VOLUME: 8 };
  function Kd() {
      var a = { uniforms: { inputBuffer: { type: "t", value: null }, weight: { type: "f", value: 1 } }, vertexShader: WALK.getShader("accumulate_vertex.glsl"), fragmentShader: WALK.getShader("accumulate_fragment.glsl") };
      THREE.ShaderPass.call(this, a, "inputBuffer");
      this.material.depthTest = !1;
      this.material.depthWrite = !1;
      this.material.blending = THREE.CustomBlending;
      this.material.blendEquation = GLC.FUNC_ADD;
      this.material.blendDst = GLC.ONE_MINUS_SRC_ALPHA;
      this.material.blendSrc = GLC.SRC_ALPHA;
  }
  Kd.prototype = Object.create(THREE.ShaderPass.prototype);
  Kd.prototype.constructor = WALK.AccumulatePass;
  function Ld(a, b, c, d, e) {
      var f = a / b,
          g = Math.tan(0.5 * THREE.Math.degToRad(e.fov));
      g = (e.near * g) / e.zoom;
      var h = -g,
          l = h * f;
      f *= g;
      a = (f - l) / a;
      b = (g - h) / b;
      e.projectionMatrix.makeFrustum(l - c * a, f - c * a, h - d * b, g - d * b, e.near, e.far);
  }
  function Md(a, b, c, d, e) {
      var f = e.top,
          g = e.bottom,
          h = e.left,
          l = e.right;
      a = (l - h) / a;
      b = (g - f) / b;
      e.projectionMatrix.makeOrthographic(h - c * a, l - c * a, f - d * b, g - d * b, e.near, e.far);
  }
  function Nd() {
      var a = { uniforms: { tDiffuse: { type: "t", value: null } }, vertexShader: WALK.getShader("copy_opaque_vertex.glsl"), fragmentShader: WALK.getShader("copy_opaque_fragment.glsl") };
      a = new THREE.ShaderPass(a);
      a.renderToScreen = !0;
      return a;
  }
  function Od(a, b, c) {
      void 0 === c && (c = b.camera);
      var d,
          e,
          f = 0,
          g = [
              [0.375, 0.4375],
              [0.625, 0.0625],
              [0.875, 0.1875],
              [0.125, 0.0625],
              [0.375, 0.6875],
              [0.875, 0.4375],
              [0.625, 0.5625],
              [0.375, 0.9375],
              [0.625, 0.3125],
              [0.125, 0.5625],
              [0.125, 0.8125],
              [0.375, 0.1875],
              [0.875, 0.9375],
              [0.875, 0.6875],
              [0.125, 0.3125],
              [0.625, 0.8125],
          ],
          h = new Kd(),
          l = Nd(),
          m = new uc(a);
      if (c instanceof THREE.PerspectiveCamera) var n = Ld;
      else c instanceof THREE.OrthographicCamera ? (n = Md) : (console.error("Unsupported camera type"), (n = void 0));
      var p = n;
      this.reset = function () {
          f = 0;
      };
      this.renderSample = function (l, n) {
          console.assert(f < g.length);
          m.set(!0, !0, !1);
          p(e.width, e.height, g[f][0] - 0.5, g[f][1] - 0.5, c);
          l ? a.renderMeshes(l, n, c, d, !0) : (console.assert(!1 === (void 0 !== n && void 0 === l), "Passing overrideMaterial without passing meshes is not implemented"), a.render(b.threeScene, c, d, !0));
          m.restore();
          m.set(!1, !1, !1);
          h.uniforms.weight.value = 1 / (f + 1);
          h.render(a, e, d);
          m.restore();
          c.updateProjectionMatrix();
          f += 1;
      };
      this.renderedSamplesCount = function () {
          return f;
      };
      this.allSamplesRendered = function () {
          return f === g.length;
      };
      this.renderAllSamples = function (a, b) {
          for (; !this.allSamplesRendered(); ) this.renderSample(a, b);
      };
      this.renderAccumulatedSamplesToScreen = function () {
          m.set(!0, !0, !1);
          l.render(a, void 0, e);
          m.restore();
      };
      this.copyAccumulatedSamplesToBuffer = function () {
          var b = e.width,
              c = e.height,
              d = new Uint8Array(b * c * 4);
          a.readPixels(b, c, d);
          return d;
      };
      this.setTargets = function (a, b) {
          console.assert(a.width === b.width && a.height === b.height);
          d = a;
          e = b;
      };
      this.dispose = function () {
          h.material.dispose();
      };
  }
  function Pd(a) {
      return a
          .split("\n")
          .map(function (a, c) {
              return c + 1 + ": " + a;
          })
          .join("\n");
  }
  function Qd(a, b, c) {
      b = a.createShader(b);
      a.shaderSource(b, c);
      a.compileShader(b);
      var d = !1 === a.getShaderParameter(b, a.COMPILE_STATUS);
      d && console.error("Shader failed to compile.");
      if (d || WALK.LOG_INFO) (a = a.getShaderInfoLog(b)), "" !== a && console.warn("Shader info log: ", a, Pd(c));
      return b;
  }
  var Rd = "viewMatrix modelViewMatrix projectionMatrix normalMatrix modelMatrix cameraPosition".split(" "),
      Sd = 0;
  function Td(a, b) {
      var c = b.index0AttributeName,
          d = a.createProgram(),
          e = Qd(a, a.VERTEX_SHADER, b.generateVertexShader()),
          f = Qd(a, a.FRAGMENT_SHADER, b.generateFragmentShader());
      a.attachShader(d, e);
      a.attachShader(d, f);
      void 0 !== c && a.bindAttribLocation(d, 0, c);
      a.linkProgram(d);
      c = a.getProgramInfoLog(d).trim();
      !1 === a.getProgramParameter(d, a.LINK_STATUS) && console.error("Shader link error: " + a.getError(), "validate status: ", a.getProgramParameter(d, a.VALIDATE_STATUS));
      "" !== c && "\x00" !== c && console.warn("program info log: " + c);
      a.deleteShader(e);
      a.deleteShader(f);
      e = {};
      f = 0;
      for (c = Rd.length; f < c; f++) {
          var g = Rd[f];
          e[g] = a.getUniformLocation(d, g);
      }
      this.transformUniformCache = e;
      e = b.uniforms;
      f = { i: [], f: [], v2: [], v3: [], c: [], v4: [], m4: [], t: [] };
      var h;
      for (l in e)
          e.hasOwnProperty(l) &&
              (c = a.getUniformLocation(d, l)) &&
              ((g = e[l].type),
              console.assert(f.hasOwnProperty(g)),
              "i" === g || "f" === g || "t" === g
                  ? (h = null)
                  : "v2" === g
                  ? (h = [null, null])
                  : "v3" === g || "c" === g
                  ? (h = [null, null, null])
                  : "v4" === g
                  ? (h = [null, null, null, null])
                  : "m4" === g
                  ? (h = null)
                  : console.assert(!1),
              f[g].push({ id: l, value: h, location: c }));
      this.materialUniformCache = f;
      b = b.attributes;
      h = {};
      var l = 0;
      for (e = b.length; l < e; l++) (f = b[l]), (h[f] = a.getAttribLocation(d, f));
      this.attributes = h;
      this.attributesKeys = Object.keys(this.attributes);
      this.id = Sd++;
      this.usedTimes = 1;
      this.program = d;
      return this;
  }
  function Ud(a) {
      var b = new Map();
      this.assignProgramToMaterial = function (c) {
          console.assert(c instanceof WALK.BaseMaterial);
          var d = c.generateProgramId(),
              e = b[d];
          e ? e.usedTimes++ : ((e = new Td(a, c)), (b[d] = e));
          c.program && this.resetProgramAssignment(c);
          c.program = e;
      };
      this.resetProgramAssignment = function (c) {
          var d = c.program;
          c.program = null;
          --d.usedTimes;
          if (0 === d.usedTimes) {
              for (var e in b)
                  if (b.hasOwnProperty(e) && b[e] === d) {
                      delete b[e];
                      break;
                  }
              a.deleteProgram(d.program);
          }
      };
  }
  function Vd(a) {
      var b = Array(16).fill(0),
          c = Array(16).fill(null),
          d = b.map(function () {
              return 0;
          }),
          e = null,
          f = null,
          g = null,
          h = null,
          l = null,
          m = null,
          n = null,
          p = null,
          r = null,
          q = null,
          u = null,
          v = null,
          w = null,
          y = null,
          z = null,
          x = null;
      this.resetAttributeStates = function () {
          for (var a = 0, c = b.length; a < c; a++) b[a] = 0;
      };
      this.disableAttributeStates = function () {
          for (var c = 0, d = b.length; c < d; c++) a.disableVertexAttribArray(c), (b[c] = 0);
      };
      this.enableAttributeArray = function (c) {
          2 !== b[c] && (a.enableVertexAttribArray(c), (b[c] = 2));
      };
      this.disableAttributeArray = function (d, e) {
          1 !== b[d] && (a.disableVertexAttribArray(d), (b[d] = 1));
          c[d] !== e && (2 === e.length ? a.vertexAttrib2fv(d, e) : 3 === e.length ? a.vertexAttrib3fv(d, e) : 4 === e.length && a.vertexAttrib4fv(d, e), (c[d] = e));
      };
      this.resetAttributeDivisors = function () {
          for (var b = 0, c = d.length; b < c; b++) d[b] && (a.vertexAttribDivisor(b, 0), (d[b] = 0));
      };
      this.setAttributeDivisor = function (b, c) {
          a.vertexAttribDivisor(b, c);
          d[b] = c;
      };
      this.setBlending = function (b) {
          var c = b.blending;
          c !== e &&
              (c === THREE.NoBlending
                  ? a.disable(a.BLEND)
                  : c === THREE.AdditiveBlending
                  ? (a.enable(a.BLEND), a.blendEquation(a.FUNC_ADD), a.blendFunc(a.SRC_ALPHA, a.ONE))
                  : c === THREE.SubtractiveBlending
                  ? (a.enable(a.BLEND), a.blendEquation(a.FUNC_ADD), a.blendFunc(a.ZERO, a.ONE_MINUS_SRC_COLOR))
                  : c === THREE.MultiplyBlending
                  ? (a.enable(a.BLEND), a.blendEquation(a.FUNC_ADD), a.blendFunc(a.ZERO, a.SRC_COLOR))
                  : c === THREE.CustomBlending
                  ? a.enable(a.BLEND)
                  : (a.enable(a.BLEND), a.blendEquationSeparate(a.FUNC_ADD, a.FUNC_ADD), a.blendFuncSeparate(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA, a.ONE, a.ONE_MINUS_SRC_ALPHA)),
              (e = c));
          if (c === THREE.CustomBlending) {
              c = b.blendEquation;
              var d = b.blendEquationAlpha || c,
                  p = b.blendSrc,
                  q = b.blendDst,
                  r = b.blendSrcAlpha || p;
              b = b.blendDstAlpha || q;
              if (c !== f || d !== l) a.blendEquationSeparate(c, d), (f = c), (l = d);
              if (p !== g || q !== h || r !== m || b !== n) a.blendFuncSeparate(p, q, r, b), (g = p), (h = q), (m = r), (n = b);
          } else n = m = l = h = g = f = null;
      };
      this.setDepthTest = function (b) {
          p !== b && (b ? a.enable(a.DEPTH_TEST) : a.disable(a.DEPTH_TEST), (p = b));
      };
      this.setDepthWrite = function (b) {
          r !== b && (a.depthMask(b), (r = b));
      };
      this.setColorWrite = function (b) {
          q !== b && (a.colorMask(b, b, b, b), (q = b));
      };
      this.setDoubleSided = function (b) {
          u !== b && (b ? a.disable(a.CULL_FACE) : a.enable(a.CULL_FACE), (u = b));
      };
      this.setFlipSided = function (b) {
          v !== b && (b ? a.frontFace(a.CW) : a.frontFace(a.CCW), (v = b));
      };
      this.setViewport = function (b, c, d, e) {
          if (w !== b || y !== c || z !== d || x !== e) a.viewport(b, c, d, e), (w = b), (y = c), (z = d), (x = e);
      };
  }
  function Wd() {
      this.texture = null;
      this.locked = !1;
      this.usedCount = 0;
  }
  function Xd(a) {
      for (var b = [], c = 0; c < a; c += 1) b[c] = new Wd();
      return b;
  }
  function Yd(a) {
      var b = a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),
          c = Xd(b);
      this.setSlot = function (a, e) {
          var d = a.__webglSlot;
          if (null !== d) {
              var g = c[d];
              g.usedCount += 1;
              g.locked = g.locked || e;
              return !1;
          }
          for (var h = Infinity, l = 0; l < b; l += 1) (g = c[l]), !g.locked && g.usedCount < h && ((h = g.usedCount), (d = l));
          null === d && (console.warn("Not enough texture units"), (d = 0));
          g = c[d];
          g.texture && (g.texture.__webglSlot = null);
          g.texture = a;
          g.usedCount = 1;
          g.locked = e;
          a.__webglSlot = d;
          return !0;
      };
      this.unlockAllSlots = function () {
          for (var a = 0; a < b; a += 1) c[a].locked = !1;
      };
      this.freeSlot = function (a) {
          if (null !== a.__webglSlot) {
              var b = c[a.__webglSlot];
              a.__webglSlot = null;
              b.texture = null;
              b.locked = !1;
              b.usedCount = 0;
          }
      };
  }
  function Zd(a) {
      var b = a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),
          c = 0;
      this.setSlot = function (a, e) {
          c === b && (console.warn("Not enough texture units"), (c = 0));
          a.__webglSlot = c;
          e && (c += 1);
          return !0;
      };
      this.unlockAllSlots = function () {
          c = 0;
      };
      this.freeSlot = function (a) {
          a.__webglSlot = null;
      };
  }
  function $d(a, b) {
      a.drawArraysInstanced = function (a) {
          for (var c = [], e = 0; e < arguments.length; ++e) c[e - 0] = arguments[e];
          return b.drawArraysInstancedANGLE.apply(b, _.arrayFromIterable(c));
      };
      a.drawElementsInstanced = function (a) {
          for (var c = [], e = 0; e < arguments.length; ++e) c[e - 0] = arguments[e];
          return b.drawElementsInstancedANGLE.apply(b, _.arrayFromIterable(c));
      };
      a.vertexAttribDivisor = function (a) {
          for (var c = [], e = 0; e < arguments.length; ++e) c[e - 0] = arguments[e];
          return b.vertexAttribDivisorANGLE.apply(b, _.arrayFromIterable(c));
      };
  }
  function ae(a, b) {
      for (
          var c = {
                  HALF_FLOAT_OES: "OES_texture_half_float",
                  COMPRESSED_RGB_S3TC_DXT1_EXT: "WEBGL_compressed_texture_s3tc",
                  COMPRESSED_RGBA_S3TC_DXT1_EXT: "WEBGL_compressed_texture_s3tc",
                  COMPRESSED_RGBA_S3TC_DXT3_EXT: "WEBGL_compressed_texture_s3tc",
                  COMPRESSED_RGBA_S3TC_DXT5_EXT: "WEBGL_compressed_texture_s3tc",
                  COMPRESSED_RGB_PVRTC_4BPPV1_IMG: "WEBGL_compressed_texture_pvrtc",
                  COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: "WEBGL_compressed_texture_pvrtc",
                  COMPRESSED_RGB_PVRTC_2BPPV1_IMG: "WEBGL_compressed_texture_pvrtc",
                  COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: "WEBGL_compressed_texture_pvrtc",
                  COMPRESSED_RGB_ETC1_WEBGL: "WEBGL_compressed_texture_etc1",
                  COMPRESSED_RGBA_ASTC_4x4_KHR: "WEBGL_compressed_texture_astc",
              },
              d = _.makeIterator(Object.entries(GLC)),
              e = d.next();
          !e.done;
          e = d.next()
      ) {
          var f = _.makeIterator(e.value);
          e = f.next().value;
          f = f.next().value;
          var g = c[e];
          void 0 !== g ? (g = b.gl.extension(g)) && console.assert(g[e] === f) : console.assert(a[e] === f);
      }
  }
  function be(a) {
      return WALK.DETECTOR.gl.disableTextureSlotReuse ? new Zd(a) : new Yd(a);
  }
  function ce(a, b) {
      function c(a, c) {
          if (!WALK.DETECTOR.gl.webgl2) return a;
          if (c === GLC.FLOAT) {
              if (a === GLC.RGB) return b.RGB32F;
              console.assert("Missing mapping");
          }
          return a;
      }
      function d() {
          N = !!WALK.DETECTOR.gl.instances;
          F = J = null;
          I = -1;
          M = H = null;
          !WALK.DETECTOR.gl.webgl2 && N && $d(b, WALK.DETECTOR.gl.instances);
          G = new Vd(b);
          D = new Ud(b);
          b.clearColor(0, 0, 0, 1);
          b.clearDepth(1);
          b.clearStencil(0);
          b.enable(b.DEPTH_TEST);
          b.depthFunc(b.LEQUAL);
          b.frontFace(b.CCW);
          b.cullFace(b.BACK);
          b.enable(b.CULL_FACE);
          b.enable(b.BLEND);
          b.blendEquation(b.FUNC_ADD);
          b.blendFunc(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA);
          G.setViewport(0, 0, a.width, a.height);
          b.clearColor(x.r, x.g, x.b, A);
          WALK.DETECTOR.ie || b.pixelStorei(b.UNPACK_COLORSPACE_CONVERSION_WEBGL, b.NONE);
      }
      function e(a) {
          a = a.target;
          a.removeEventListener("dispose", e);
          delete a.__webglInit;
          a = a.attributes;
          for (var c in a)
              if (a.hasOwnProperty(c)) {
                  var d = a[c];
                  void 0 !== d.buffer && (b.deleteBuffer(d.buffer), delete d.buffer);
              }
          G.disableAttributeStates();
          H = null;
      }
      function f(a) {
          a = a.target;
          a.removeEventListener("dispose", f);
          Q.freeSlot(a);
          a.__webglTexture && (b.deleteTexture(a.__webglTexture), (a.__webglTexture = null));
      }
      function g(a) {
          a = a.target;
          a.removeEventListener("dispose", g);
          Q.freeSlot(a);
          b.deleteTexture(a.__webglTexture);
          a.__webglTexture = null;
          a.__webglFramebuffer && C.deallocateRenderTargetRenderingBuffers(a);
      }
      function h(a) {
          a = a.target;
          a.removeEventListener("dispose", h);
          D.resetProgramAssignment(a);
      }
      function l(a, c, d) {
          var e = d.attributes,
              f = c.attributes;
          c = c.attributesKeys;
          d = 16 * (d.instanceId || 0);
          for (var g = 0, h = c.length; g < h; g++) {
              var l = c[g],
                  m = f[l];
              if (0 <= m) {
                  var n = e[l];
                  if (void 0 !== n) {
                      l = n.itemSize;
                      var p = n.glType;
                      b.bindBuffer(b.ARRAY_BUFFER, n.buffer);
                      n = n.divisor || 0;
                      G.enableAttributeArray(m);
                      b.vertexAttribPointer(m, l, p, !1, 0, d * n);
                      N && G.setAttributeDivisor(m, n);
                  } else G.disableAttributeArray(m, a.defaultAttributeValues[l]);
              }
          }
      }
      function m(a, c) {
          var d = WALK.DETECTOR;
          b.texParameteri(a, b.TEXTURE_WRAP_S, c.wrapS);
          b.texParameteri(a, b.TEXTURE_WRAP_T, c.wrapT);
          b.texParameteri(a, b.TEXTURE_MAG_FILTER, c.magFilter);
          b.texParameteri(a, b.TEXTURE_MIN_FILTER, c.minFilter);
          var e = d.gl.extension("EXT_texture_filter_anisotropic");
          e && 1 < c.anisotropy && b.texParameterf(a, e.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(c.anisotropy, d.gl.maxAnisotropy));
      }
      function n(a, b) {
          var c = a.material,
              d = b.material,
              e = c.program,
              f = d.program;
          return e && f && e.id !== f.id ? e.id - f.id : c.id - d.id || a.id - b.id;
      }
      function p(a, b) {
          var c = a.material.transparentRenderOrder - b.material.transparentRenderOrder;
          return c ? c : b.cameraDistance - a.cameraDistance || a.id - b.id;
      }
      function r(a, b, c) {
          if (c || !1 !== a.visible) {
              a instanceof THREE.Mesh && (!1 === a.frustumCulled || !0 === E.intersectsObject(a)) && ((b || a.material).transparent ? (!0 === C.sortObjects && (a.cameraDistance = E.nearPlaneDistanceToCenter(a)), L.push(a)) : B.push(a));
              for (var d = 0, e = a.children.length; d < e; d++) r(a.children[d], b, c);
          }
      }
      function q(a) {
          G.setDoubleSided(a.side === THREE.DoubleSide);
          G.setFlipSided(a.side === THREE.BackSide);
      }
      function u(a) {
          a.__webglTexture || (a.addEventListener("dispose", f), (a.__webglTexture = b.createTexture()));
          b.activeTexture(b.TEXTURE0 + a.__webglSlot);
          b.bindTexture(b.TEXTURE_2D, a.__webglTexture);
          b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, a.flipY);
          b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a.premultiplyAlpha);
          b.pixelStorei(b.UNPACK_ALIGNMENT, a.unpackAlignment);
          var d = a.image,
              e = THREE.Math.isPowerOfTwo(d.width) && THREE.Math.isPowerOfTwo(d.height),
              g = a.format,
              h = a.type,
              l = c(g, h);
          m(b.TEXTURE_2D, a);
          var n = a.mipmaps;
          if (a instanceof qb)
              if (0 < n.length && e) {
                  for (var p = 0, q = n.length; p < q; p++) (d = n[p]), b.texImage2D(b.TEXTURE_2D, p, l, d.width, d.height, 0, g, h, d.data), a.releaseOnLoadedToGpu && (d.data = null);
                  a.generateMipmaps = !1;
              } else b.texImage2D(b.TEXTURE_2D, 0, l, d.width, d.height, 0, g, h, d.data), a.releaseOnLoadedToGpu && (d.data = null);
          else if (a instanceof pb)
              for (p = 0, q = n.length; p < q; p++)
                  (d = n[p]),
                      a.format !== GLC.RGBA && a.format !== GLC.RGB ? b.compressedTexImage2D(b.TEXTURE_2D, p, l, d.width, d.height, 0, d.data) : b.texImage2D(b.TEXTURE_2D, p, l, d.width, d.height, 0, g, h, d.data),
                      a.releaseOnLoadedToGpu && (d.data = null);
          else if (0 < n.length && e) {
              p = 0;
              for (q = n.length; p < q; p++) (d = n[p]), b.texImage2D(b.TEXTURE_2D, p, l, g, h, d);
              a.releaseOnLoadedToGpu && (a.mipmaps = null);
              a.generateMipmaps = !1;
          } else b.texImage2D(b.TEXTURE_2D, 0, l, g, h, a.image), a.releaseOnLoadedToGpu && (a.image = null);
          a.generateMipmaps && e && b.generateMipmap(b.TEXTURE_2D);
          a.needsUpdate = !1;
      }
      function v(a) {
          G.setBlending(a);
          G.setDepthTest(a.depthTest);
          G.setDepthWrite(a.depthWrite);
          G.setColorWrite(a.colorWrite);
      }
      function w(a, d, e) {
          if (e) {
              var f = e;
              v(f);
              q(f);
          }
          for (var g = 0, n = a.length; g < n; g += 1) {
              var p = a[g],
                  r = p.geometry,
                  w = p.material;
              try {
                  e ? e.doNotOverrideSide && w && q(w) : ((f = w), v(f), q(f));
                  var y = (w = void 0),
                      z = void 0,
                      x = void 0,
                      C = void 0,
                      A = f;
                  if (!1 !== A.visible && 0 !== r.vertexCnt) {
                      var B = d,
                          O = A;
                      console.assert(O instanceof WALK.BaseMaterial);
                      O.programNeedsUpdate && (D.assignProgramToMaterial(O), O.addEventListener("dispose", h), (O.programNeedsUpdate = !1));
                      console.assert(!O.morphTargets);
                      var E = !1,
                          S = !1,
                          Y = O.program,
                          F = Y.transformUniformCache,
                          L = O.uniforms;
                      Y.id !== J && (b.useProgram(Y.program), (J = Y.id), (S = E = !0));
                      O.id !== I && ((I = O.id), (S = !0));
                      E &&
                          (b.uniformMatrix4fv(F.projectionMatrix, !1, B.projectionMatrix.elements),
                          null !== F.cameraPosition && (Z.setFromMatrixPosition(B.matrixWorld), b.uniform3f(F.cameraPosition, Z.x, Z.y, Z.z)),
                          null !== F.viewMatrix && b.uniformMatrix4fv(F.viewMatrix, !1, B.matrixWorldInverse.elements));
                      if (E || p.matrixWorld !== M) {
                          M = p.matrixWorld;
                          E = void 0;
                          var U = F;
                          p.matrixWorld ? (ha.multiplyMatrices(B.matrixWorldInverse, p.matrixWorld), (E = ha)) : (E = B.matrixWorldInverse);
                          b.uniformMatrix4fv(U.modelViewMatrix, !1, E.elements);
                          U.normalMatrix && (fa.getNormalMatrix(E), b.uniformMatrix3fv(U.normalMatrix, !1, fa.elements));
                          null !== U.modelMatrix && (p.matrixWorld ? b.uniformMatrix4fv(U.modelMatrix, !1, p.matrixWorld.elements) : b.uniformMatrix4fv(U.modelMatrix, !1, ca));
                      }
                      O.refreshPerObjectUniforms && O.refreshPerObjectUniforms(p, L) && (S = !0);
                      if (S) {
                          var pa = (U = B = E = S = O = void 0),
                              wa = void 0,
                              va = void 0,
                              ra = void 0,
                              qa = void 0,
                              Da = void 0,
                              P = void 0,
                              ea = void 0,
                              Ma = Y,
                              Xa = L;
                          ea = Ma.materialUniformCache.i;
                          B = 0;
                          for (E = ea.length; B < E; B += 1) (P = ea[B]), (Da = P.id), (qa = Xa[Da].value), P.value !== qa && (b.uniform1i(P.location, qa), (P.value = qa));
                          ea = Ma.materialUniformCache.f;
                          B = 0;
                          for (E = ea.length; B < E; B += 1) (P = ea[B]), (Da = P.id), (qa = Xa[Da].value), P.value !== qa && (b.uniform1f(P.location, qa), (P.value = qa));
                          ea = Ma.materialUniformCache.v2;
                          B = 0;
                          for (E = ea.length; B < E; B += 1)
                              if (((P = ea[B]), (Da = P.id), (qa = Xa[Da].value), (ra = qa.x), (va = qa.y), P.value[0] !== ra || P.value[1] !== va)) b.uniform2f(P.location, ra, va), (P.value[0] = ra), (P.value[1] = va);
                          ea = Ma.materialUniformCache.v3;
                          B = 0;
                          for (E = ea.length; B < E; B += 1)
                              if (((P = ea[B]), (Da = P.id), (qa = Xa[Da].value), (ra = qa.x), (va = qa.y), (wa = qa.z), P.value[0] !== ra || P.value[1] !== va || P.value[2] !== wa))
                                  b.uniform3f(P.location, ra, va, wa), (P.value[0] = ra), (P.value[1] = va), (P.value[2] = wa);
                          ea = Ma.materialUniformCache.c;
                          B = 0;
                          for (E = ea.length; B < E; B += 1)
                              if (((P = ea[B]), (Da = P.id), (qa = Xa[Da].value), (ra = qa.r), (va = qa.g), (wa = qa.b), P.value[0] !== ra || P.value[1] !== va || P.value[2] !== wa))
                                  b.uniform3f(P.location, ra, va, wa), (P.value[0] = ra), (P.value[1] = va), (P.value[2] = wa);
                          ea = Ma.materialUniformCache.v4;
                          B = 0;
                          for (E = ea.length; B < E; B += 1)
                              if (((P = ea[B]), (Da = P.id), (qa = Xa[Da].value), (ra = qa.x), (va = qa.y), (wa = qa.z), (pa = qa.w), P.value[0] !== ra || P.value[1] !== va || P.value[2] !== wa || P.value[3] !== pa))
                                  b.uniform4f(P.location, ra, va, wa, pa), (P.value[0] = ra), (P.value[1] = va), (P.value[2] = wa), (P.value[3] = pa);
                          ea = Ma.materialUniformCache.m4;
                          B = 0;
                          for (E = ea.length; B < E; B += 1) (P = ea[B]), (Da = P.id), b.uniformMatrix4fv(location, !1, Xa[Da].value.elements);
                          ea = Ma.materialUniformCache.t;
                          B = 0;
                          for (E = ea.length; B < E; B += 1)
                              if (((P = ea[B]), (Da = P.id), (U = Xa[Da].value), (S = Q.setSlot(U, !0)), (O = U.__webglSlot), P.value !== O && (b.uniform1i(P.location, O), (P.value = O)), S || U.needsUpdate))
                                  if (U.isCube) {
                                      if (((pa = U), b.activeTexture(b.TEXTURE0 + pa.__webglSlot), b.bindTexture(b.TEXTURE_CUBE_MAP, pa.__webglTexture), pa.needsUpdate)) {
                                          b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, pa.flipY);
                                          var Na = pa instanceof pb,
                                              Ec = pa.image,
                                              Fc = pa.format,
                                              Gc = pa.type,
                                              kc = c(Fc, Gc);
                                          m(b.TEXTURE_CUBE_MAP, pa);
                                          for (wa = 0; 6 > wa; wa++)
                                              if (Na) {
                                                  var Hc = Ec[wa].mipmaps;
                                                  va = 0;
                                                  for (var Ic = Hc.length; va < Ic; va++) {
                                                      var ib = Hc[va];
                                                      pa.format !== GLC.RGBA && pa.format !== GLC.RGB
                                                          ? b.compressedTexImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X + wa, va, kc, ib.width, ib.height, 0, ib.data)
                                                          : b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X + wa, va, kc, ib.width, ib.height, 0, Fc, Gc, ib.data);
                                                      pa.releaseOnLoadedToGpu && (ib.data = null);
                                                  }
                                              } else b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X + wa, 0, kc, Fc, Gc, Ec[wa]), pa.releaseOnLoadedToGpu && (Ec[wa] = null);
                                          pa.generateMipmaps && b.generateMipmap(b.TEXTURE_CUBE_MAP);
                                          pa.needsUpdate = !1;
                                      }
                                  } else (pa = U), pa.needsUpdate ? u(pa) : (b.activeTexture(b.TEXTURE0 + pa.__webglSlot), b.bindTexture(b.TEXTURE_2D, pa.__webglTexture));
                          Q.unlockAllSlots();
                      }
                      var Cb = Y;
                      O = !1;
                      if (r.id !== H || Cb.id !== J) (H = r.id), (O = !0);
                      console.assert(p instanceof THREE.Mesh);
                      var Ub = b.TRIANGLES,
                          Ya = r.attributes.index;
                      if (Ya) {
                          var Ea = Ya.glType;
                          C = r.indexUint ? 4 : 2;
                          O && (l(A, Cb, r), b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, Ya.buffer));
                          void 0 !== r.indexOffset ? ((x = r.indexCnt), (z = C * r.indexOffset)) : ((x = Ya.length), (z = 0));
                          r.isInstanced ? b.drawElementsInstanced(Ub, x, Ea, z, r.instanceCount) : b.drawElements(Ub, x, Ea, z);
                      } else {
                          O && l(A, Cb, r);
                          var od = r.attributes.position;
                          void 0 !== r.vertexOffset ? ((y = r.vertexCnt), (w = r.vertexOffset)) : ((y = od.length / od.itemSize), (w = 0));
                          r.isInstanced ? b.drawArraysInstanced(Ub, w, y, r.instanceCount) : b.drawArrays(Ub, w, y);
                      }
                      N && G.resetAttributeDivisors();
                  }
              } catch (Xb) {
                  console.error("Failed to render material " + (f ? f.name : "null") + ": " + Xb.stack);
              }
          }
      }
      function y(a, c) {
          b.bindRenderbuffer(b.RENDERBUFFER, a);
          c.depthBuffer
              ? (b.renderbufferStorage(b.RENDERBUFFER, b.DEPTH_STENCIL, c.width, c.height), b.framebufferRenderbuffer(b.FRAMEBUFFER, b.DEPTH_STENCIL_ATTACHMENT, b.RENDERBUFFER, a))
              : b.renderbufferStorage(b.RENDERBUFFER, b.RGBA4, c.width, c.height);
      }
      function z(a, d) {
          d.addEventListener("dispose", g);
          d.__webglTexture = b.createTexture();
          var e = d.format,
              f = d.type,
              h = c(e, f);
          Q.setSlot(d, !1);
          b.activeTexture(b.TEXTURE0 + d.__webglSlot);
          if (a) {
              b.bindTexture(b.TEXTURE_CUBE_MAP, d.__webglTexture);
              m(b.TEXTURE_CUBE_MAP, d);
              for (a = 0; 6 > a; a++) {
                  d.__webglFramebuffer[a] = b.createFramebuffer();
                  d.__webglRenderbuffer[a] = b.createRenderbuffer();
                  b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X + a, 0, h, d.width, d.height, 0, e, f, null);
                  var l = b.TEXTURE_CUBE_MAP_POSITIVE_X + a,
                      n = d.__webglTexture;
                  b.bindFramebuffer(b.FRAMEBUFFER, d.__webglFramebuffer[a]);
                  b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, l, n, 0);
                  y(d.__webglRenderbuffer[a], d);
              }
              d.generateMipmaps && b.generateMipmap(b.TEXTURE_CUBE_MAP);
          } else
              (d.__webglFramebuffer = b.createFramebuffer()),
                  (d.__webglRenderbuffer = d.shareDepthFrom ? d.shareDepthFrom.__webglRenderbuffer : b.createRenderbuffer()),
                  b.bindTexture(b.TEXTURE_2D, d.__webglTexture),
                  m(b.TEXTURE_2D, d),
                  b.texImage2D(b.TEXTURE_2D, 0, h, d.width, d.height, 0, e, f, null),
                  (e = b.TEXTURE_2D),
                  (f = d.__webglTexture),
                  b.bindFramebuffer(b.FRAMEBUFFER, d.__webglFramebuffer),
                  b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, e, f, 0),
                  d.shareDepthFrom ? d.depthBuffer && b.framebufferRenderbuffer(b.FRAMEBUFFER, b.DEPTH_STENCIL_ATTACHMENT, b.RENDERBUFFER, d.__webglRenderbuffer) : y(d.__webglRenderbuffer, d),
                  d.generateMipmaps && b.generateMipmap(b.TEXTURE_2D);
          b.bindRenderbuffer(b.RENDERBUFFER, null);
          b.bindFramebuffer(b.FRAMEBUFFER, null);
      }
      var x = new THREE.Color(0),
          A = 0,
          B = [],
          L = [];
      this.domElement = a;
      this.sortObjects = this.autoClearStencil = this.autoClearDepth = this.autoClearColor = this.autoClear = !0;
      var C = this,
          J,
          F,
          I,
          H,
          M,
          N,
          G,
          D,
          E = new WALK.Frustum(),
          S = new THREE.Matrix4(),
          Z = new THREE.Vector3();
      d();
      ae(b, WALK.DETECTOR);
      this.webGLContextRestored = function () {
          d();
      };
      this.context = b;
      this.state = G;
      var Q = be(b),
          ca = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      this.setCanvasSize = function (b, c) {
          a.width = b;
          a.height = c;
          null === F && this.setViewport(0, 0, b, c);
      };
      this.setViewport = function (a, b, c, d) {
          G.setViewport(a, b, c, d);
      };
      this.setScissor = function (a, c, d, e) {
          b.scissor(a, c, d, e);
      };
      this.enableScissorTest = function (a) {
          a ? b.enable(b.SCISSOR_TEST) : b.disable(b.SCISSOR_TEST);
      };
      this.setClearColor = function (a, c) {
          x.copy(a);
          A = void 0 !== c ? c : 1;
          b.clearColor(x.r, x.g, x.b, A);
      };
      this.getClearColor = function () {
          return x;
      };
      this.getClearAlpha = function () {
          return A;
      };
      this.clear = function (a, c, d) {
          var e = 0;
          a && (e |= b.COLOR_BUFFER_BIT);
          c && (e |= b.DEPTH_BUFFER_BIT);
          d && (e |= b.STENCIL_BUFFER_BIT);
          b.clear(e);
      };
      this.clearColor = function () {
          b.clear(b.COLOR_BUFFER_BIT);
      };
      this.clearDepth = function () {
          b.clear(b.DEPTH_BUFFER_BIT);
      };
      this.clearStencil = function () {
          b.clear(b.STENCIL_BUFFER_BIT);
      };
      this.deallocateRenderTargetRenderingBuffers = function (a) {
          if (a.isCube) for (var c = 0; 6 > c; c++) b.deleteFramebuffer(a.__webglFramebuffer[c]), b.deleteRenderbuffer(a.__webglRenderbuffer[c]);
          else b.deleteFramebuffer(a.__webglFramebuffer), b.deleteRenderbuffer(a.__webglRenderbuffer);
          a.__webglFramebuffer = null;
          a.__webglRenderbuffer = null;
      };
      var ha = new THREE.Matrix4(),
          fa = new THREE.Matrix3();
      this.setRenderTarget = function (c) {
          if (c) {
              var d = c.isCube ? c.__webglFramebuffer[c.activeCubeFace] : c.__webglFramebuffer;
              var e = c.x;
              var f = c.y;
              var g = c.width;
              c = c.height;
          } else (d = null), (f = e = 0), (g = a.width), (c = a.height);
          d !== F && (b.bindFramebuffer(b.FRAMEBUFFER, d), (F = d));
          G.setViewport(e, f, g, c);
      };
      this.render = function (a, b, c, d) {
          this.renderMeshes(a.children, a.overrideMaterial, b, c, d);
      };
      this.renderMeshes = function (a, c, d, e, f, g) {
          H = null;
          I = -1;
          M = J = null;
          d.matrixWorldInverse.getInverse(d.matrixWorld);
          S.multiplyMatrices(d.projectionMatrix, d.matrixWorldInverse);
          E.setFromMatrix(S);
          B.length = 0;
          L.length = 0;
          g = void 0 === g ? !1 : g;
          for (var h = 0; h < a.length; h += 1) r(a[h], c, g);
          !0 === C.sortObjects && (B.sort(n), L.sort(p));
          this.setRenderTarget(e);
          (this.autoClear || f) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
          w(B, d, c);
          w(L, d, c);
          e &&
              e.generateMipmaps &&
              ((a = Q.setSlot(e, !1)),
              b.activeTexture(b.TEXTURE0 + e.__webglSlot),
              e.isCube ? (a && b.bindTexture(b.TEXTURE_CUBE_MAP, e.__webglTexture), b.generateMipmap(b.TEXTURE_CUBE_MAP)) : (a && b.bindTexture(b.TEXTURE_2D, e.__webglTexture), b.generateMipmap(b.TEXTURE_2D)));
          G.setDepthTest(!0);
          G.setDepthWrite(!0);
          G.setColorWrite(!0);
          G.resetAttributeStates();
      };
      this.uploadNewBuffers = function (a) {
          var c = a.geometry;
          a = c.attributes;
          var d = c.attributesKeys;
          void 0 === c.__webglInit && ((c.__webglInit = !0), c.addEventListener("dispose", e));
          console.assert(c instanceof THREE.BufferGeometry);
          c = 0;
          for (var f = d.length; c < f; c += 1) {
              var g = d[c],
                  h = a[g];
              g = "index" === g ? b.ELEMENT_ARRAY_BUFFER : b.ARRAY_BUFFER;
              if (h.buffer) !0 === h.needsUpdate && console.assert(!1);
              else {
                  h.buffer = b.createBuffer();
                  b.bindBuffer(g, h.buffer);
                  var l = h.array;
                  WALK.DETECTOR.ios && g === b.ARRAY_BUFFER && console.assert(0 === (h.itemSize * l.BYTES_PER_ELEMENT) % 4);
                  b.bufferData(g, l, b.STATIC_DRAW);
                  l instanceof Float32Array
                      ? (h.glType = b.FLOAT)
                      : l instanceof Int8Array
                      ? (h.glType = b.BYTE)
                      : l instanceof Int16Array
                      ? (h.glType = b.SHORT)
                      : l instanceof Uint16Array
                      ? (h.glType = b.UNSIGNED_SHORT)
                      : l instanceof Uint32Array
                      ? (h.glType = b.UNSIGNED_INT)
                      : console.assert(!1);
                  h.releaseOnLoadedToGpu && (h.array = null);
                  h.needsUpdate = !1;
              }
          }
      };
      this.uploadTexture = function (a) {
          Q.setSlot(a, !1);
          u(a);
      };
      this.copyBufferToCubeFaceMip = function (a, c, d, e, f) {
          Q.setSlot(f, !1);
          b.activeTexture(b.TEXTURE0 + f.__webglSlot);
          b.bindTexture(b.TEXTURE_CUBE_MAP, f.__webglTexture);
          b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X + d, a, b.RGBA, c, c, 0, b.RGBA, b.UNSIGNED_BYTE, e);
      };
      this.createCubeTexture = function (a, c) {
          var d = new ob();
          d.isCube = !0;
          d.minFilter = c ? GLC.LINEAR_MIPMAP_NEAREST : GLC.LINEAR;
          d.generateMipmaps = !1;
          d.needsUpdate = !1;
          d.addEventListener("dispose", f);
          d.__webglTexture = b.createTexture();
          Q.setSlot(d, !1);
          b.activeTexture(b.TEXTURE0 + d.__webglSlot);
          b.bindTexture(b.TEXTURE_CUBE_MAP, d.__webglTexture);
          b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, !1);
          b.texParameteri(b.TEXTURE_CUBE_MAP, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
          b.texParameteri(b.TEXTURE_CUBE_MAP, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
          b.texParameteri(b.TEXTURE_CUBE_MAP, b.TEXTURE_MAG_FILTER, b.LINEAR);
          c ? b.texParameteri(b.TEXTURE_CUBE_MAP, b.TEXTURE_MIN_FILTER, b.LINEAR_MIPMAP_NEAREST) : b.texParameteri(b.TEXTURE_CUBE_MAP, b.TEXTURE_MIN_FILTER, b.LINEAR);
          for (var e = 0; 6 > e; e += 1) b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, b.RGBA, a, a, 0, b.RGBA, b.UNSIGNED_BYTE, null);
          c && b.generateMipmap(b.TEXTURE_CUBE_MAP);
          return d;
      };
      this.createFrameBufferRenderTarget = function (a) {
          return new tb(a);
      };
      this.createRenderTarget = function (a, b, c) {
          a = new sb(a, b, c);
          z(!1, a);
          return a;
      };
      this.createRenderTargetCube = function (a, b, c) {
          a = new ub(a, b, c);
          z(!0, a);
          return a;
      };
      this.readPixels = function (a, c, d) {
          b.readPixels(0, 0, a, c, b.RGBA, b.UNSIGNED_BYTE, d);
      };
  }
  var de = { minFilter: GLC.LINEAR, magFilter: GLC.LINEAR, format: GLC.RGBA, stencilBuffer: !1, generateMipmaps: !1 };
  function ee(a, b) {
      void 0 === b.alpha && (b.alpha = !0);
      void 0 === b.depth && (b.depth = !0);
      void 0 === b.stencil && (b.stencil = !1);
      void 0 === b.premultipliedAlpha && (b.premultipliedAlpha = !0);
      void 0 === b.antialias && (b.antialias = !0);
      void 0 === b.preserveDrawingBuffer && (b.preserveDrawingBuffer = !1);
      try {
          var c = (WALK.FORCE_WEBGL1 ? null : a.getContext("webgl2", b)) || a.getContext("webgl", b) || a.getContext("experimental-webgl", b);
      } catch (d) {
          c = null;
      }
      b = c;
      if (!b) return null;
      WALK.DETECTOR.resetGlDetector(b);
      WALK.DETECTOR.gl.reportToConsole();
      return new ce(a, b);
  }
  function fe(a) {
      if ((a = ee(a, { antialias: !WALK.FORCE_FXAA }))) (a.autoClear = !0), (a.autoClearColor = !1), (a.autoClearDepth = !0), (a.autoClearStencil = !1), (a.sortObjects = !0);
      return a;
  }
  function ge(a, b, c, d) {
      var e = null,
          f,
          g,
          h = c.camera,
          l = c.threeScene,
          m = (function () {
              var b = new WALK.Frustum(),
                  d = new THREE.Matrix4();
              return function (e) {
                  if (0 !== c.mirrors.length) {
                      e.matrixWorldInverse.getInverse(e.matrixWorld);
                      d.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse);
                      b.setFromMatrix(d);
                      for (var f = 0; f < c.mirrors.length; f += 1) {
                          var g = c.mirrors[f];
                          g.updateCameraPosition(e, b);
                          g.inFrustum() && g.render(a);
                      }
                  }
              };
          })();
      this.resize = function (b) {
          if (!b) {
              var d = window.innerWidth;
              var l = window.innerHeight;
              var m = d * window.devicePixelRatio;
              var n = l * window.devicePixelRatio;
              h.aspect = m / n;
              h.updateProjectionMatrix();
              a.setCanvasSize(m, n);
              a.domElement.style.width = d + "px";
              a.domElement.style.height = l + "px";
              f && (f.configureTarget(m, n, de), g.setTargets(f.renderTarget1, f.renderTarget2));
              e && e.uniforms.resolution.value.set(1 / m, 1 / n);
          }
          d = n;
          b ? ((b = m / 2), (m = 70)) : ((b = m), (m = h.fov));
          l = b / d;
          for (n = 0; n < c.mirrors.length; n += 1) c.mirrors[n].configure(b, d, l, m);
      };
      this.renderIdle = function (a, b) {
          0 === b && (d.adaptExposure(), g && g.reset());
          if (d.exposureNeedsUpdate()) return this.renderToScreen(a, !1), !0;
          if (!g) return !1;
          g.renderSample();
          4 <= g.renderedSamplesCount() && g.renderAccumulatedSamplesToScreen();
          return !g.allSamplesRendered();
      };
      this.renderToScreen = function (c, g) {
          d.update(c);
          g ? b.render(l, h.matrixWorld, m) : (m(h), e ? f.render(c) : a.render(l, h));
      };
      this.enableAutoExposure = function () {
          d.enableAutoExposure();
      };
      this.disableAutoExposure = function () {
          d.disableAutoExposure();
      };
      (function () {
          if (WALK.DETECTOR.gl.antialiasPostprocess) {
              f = new THREE.EffectComposer(a);
              if (!WALK.DETECTOR.gl.antialiasNative) {
                  WALK.log("using FXAA");
                  a.autoClear = !1;
                  e = new THREE.ShaderPass(THREE.FXAAShader);
                  e.clear = !1;
                  e.renderToScreen = !0;
                  e.material.depthTest = !1;
                  e.material.depthWrite = !1;
                  e.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight);
                  var b = new THREE.RenderPass(l, h);
                  f.addPass(b);
                  f.addPass(e);
              }
              g = new Od(a, c);
          }
      })();
  }
  function he() {
      WALK.BaseMaterial.call(this, WALK.getShader("static_render_vertex.glsl"), WALK.getShader("static_render_fragment.glsl"));
      this.uniforms = { staticRender: { type: "t", value: null }, sizeInv: { type: "v2", value: new THREE.Vector2() } };
  }
  he.prototype = Object.create(WALK.BaseMaterial.prototype);
  he.prototype.constructor = he;
  function ie(a) {
      a = ee(a, { antialias: !1 });
      a.autoClear = !1;
      a.autoUpdateObjects = !1;
      a.sortObjects = !1;
      return a;
  }
  WALK.StaticRenderViewer = function (a) {
      var b = ie(a),
          c = new he(),
          d = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
          e = new THREE.Scene();
      a = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), c);
      b.uploadNewBuffers(a);
      e.add(a);
      this.update = function (a) {
          var f = new Float32Array(a, 0, a.byteLength / 4);
          a = f[0];
          var h = f[1];
          f = f.subarray(2);
          console.assert(a * h === f.length / 3);
          f = new qb(f, a, h, GLC.RGB, GLC.FLOAT);
          f.minFilter = GLC.NEAREST;
          f.magFilter = GLC.NEAREST;
          f.generateMipmaps = !1;
          f.flipY = !1;
          f.needsUpdate = !0;
          c.uniforms.staticRender.value = f;
          c.uniforms.sizeInv.value.set(1 / a, 1 / h);
          b.setCanvasSize(a, h);
          b.render(e, d);
          f.dispose();
      };
  };
  function pe(a, b, c, d, e, f, g) {
      function h() {
          return WALK.DETECTOR.ios && void 0 !== DeviceMotionEvent && "function" === typeof DeviceMotionEvent.requestPermission && void 0 !== DeviceOrientationEvent && "function" === typeof DeviceOrientationEvent.requestPermission
              ? new Promise(function (a, b) {
                    Promise.all([DeviceMotionEvent.requestPermission(), DeviceOrientationEvent.requestPermission()]).then(
                        function (c) {
                            "granted" === c[0] && "granted" === c[1] ? a() : b();
                        },
                        function () {
                            b();
                        }
                    );
                })
              : Promise.resolve();
      }
      function l() {
          r = null;
          A.dispose();
          u = q = w = A = null;
          b.removeAllXrGamepads();
          g(!1);
          if (x) {
              var a = x;
              x = null;
              a();
          }
      }
      function m(a) {
          for (var c = _.makeIterator(a.removed), d = c.next(); !d.done; d = c.next()) (d = d.value), d.gamepad && b.removeXrGamepad(d.gamepad);
          a = _.makeIterator(a.added);
          for (d = a.next(); !d.done; d = a.next()) (c = d.value), c.gamepad && b.addXrGamepad(c.gamepad, c.handedness);
      }
      var n = navigator.xr,
          p = c ? !c.nativeWebXR : !1,
          r,
          q,
          u,
          v = !1,
          w,
          y,
          z,
          x = null,
          A,
          B = new THREE.Matrix4(),
          L = WALK.CAMERA_MIN_FAR;
      this.setCameraFar = function (a) {
          L = a;
          r && ((w.depthFar = L), r.updateRenderState(w));
      };
      this.render = function (b, c, d) {
          z.set(!1, !0, !1);
          y.matrixWorld = c;
          c = y.projectionMatrix;
          for (var e = u.views, f = 0; f < e.length; ++f) {
              var g = e[f];
              B.fromArray(g.transform.inverse.matrix);
              c.fromArray(u.transform.matrix);
              B.multiply(c);
              c.fromArray(g.projectionMatrix);
              c.multiply(B);
              d(y);
              a.enableScissorTest(!0);
              g = w.baseLayer.getViewport(g);
              a.setScissor(g.x, g.y, g.width, g.height);
              A.x = g.x;
              A.y = g.y;
              A.width = g.width;
              A.height = g.height;
              a.render(b, y, A);
              a.enableScissorTest(!1);
          }
          z.restore();
      };
      this.enableVr = function (b) {
          n
              ? v
                  ? (f(!0),
                    h()
                        .then(function () {
                            return b
                                .makeXRCompatible()
                                .then(function () {
                                    return navigator.xr.requestSession("immersive-vr", { requiredFeatures: ["local-floor"] });
                                })
                                .then(function (a) {
                                    r = a;
                                    return r.requestReferenceSpace("local-floor");
                                })
                                .then(function (c) {
                                    q = c;
                                    c = new XRWebGLLayer(r, b);
                                    A = a.createFrameBufferRenderTarget(c.framebuffer);
                                    w = { baseLayer: c };
                                    y || ((y = new THREE.PerspectiveCamera()), (z = new uc(a)));
                                    w.depthNear = WALK.CAMERA_WALK_NEAR;
                                    w.depthFar = L;
                                    r.updateRenderState(w);
                                    r.addEventListener("end", l);
                                    p || r.addEventListener("inputsourceschange", m);
                                    f(!1);
                                    g(!0);
                                })
                                .catch(function () {
                                    f(!1);
                                    za.info("Failed to enable VR mode");
                                });
                        })
                        .catch(function () {
                            f(!1);
                            za.info("Permissions necessary for VR mode not granted");
                        }))
                  : za.info("VR device not connected")
              : za.info('You need a <a href="https://mozvr.com/#start" target="_blank">VR ready browser</a>.');
      };
      this.disableVr = function () {
          r.end().then(
              function () {
                  za.hideInfo();
              },
              function () {
                  za.info("Failed to exit VR mode");
              }
          );
      };
      this.vrEnabled = function () {
          return !!q;
      };
      this.requestAnimationFrame = (function () {
          function a(a, b) {
              u = b.getViewerPose(q);
              x && ((b = x), (x = null), b(a));
          }
          return function (b) {
              x = b;
              r.requestAnimationFrame(a);
          };
      })();
      this.update = (function () {
          var a = new WALK.Euler(),
              b = new THREE.Vector3();
          return function () {
              if (u) {
                  var c = u.transform;
                  if (null !== c.orientation) {
                      a.setFromQuaternion(c.orientation, "YXZ");
                      var d = a.y;
                      a.y = -a.z;
                      a.z = d;
                      c = c.position;
                      e(a, c && b.set(c.x, -c.z, c.y, c.w));
                  }
              }
          };
      })();
      (WALK.DETECTOR.https || WALK.DETECTOR.localhost) && n
          ? ((c = function () {
                navigator.xr.isSessionSupported("immersive-vr").then(function (a) {
                    v = a;
                    d(a);
                });
            }),
            c(),
            navigator.xr.addEventListener("devicechange", c, !1))
          : d(!1);
  }
  var qe = (function () {
      var a = new THREE.Vector3();
      return function (b, c, d) {
          a.copy(b);
          a.sub(c).normalize();
          a.multiplyScalar(d);
          return b.sub(a);
      };
  })();
  function re(a, b, c) {
      var d = this,
          e = new THREE.Octree({ scene: null, depthMax: Infinity, objectsThreshold: 8, overlapPct: 0.15 }),
          f = c.cameraWorldPosition(),
          g = b.camera,
          h = [];
      this.addStaticObstacle = function (a, b, c) {
          e.add(a, b, c);
      };
      this.addDynamicObstacle = function (a) {
          h.push(a);
      };
      this.removeDynamicObstacle = function (a) {
          WALK.removeFromArray(a, h);
      };
      var l = (function () {
              var b = new yc(a, g);
              return function (a, c) {
                  for (var d = e.search(a.ray.origin, a.far, a.ray.direction), f = 0; f < h.length; f += 1) d.push(h[f]);
                  return b.closestIntersection(d, a, c) ? !0 : !1;
              };
          })(),
          m = (function () {
              var a = new xc();
              return function (b) {
                  return l(b, a) ? a.distance : Infinity;
              };
          })(),
          n = (function () {
              var a = new wc();
              a.ray.direction.set(0, 0, -1);
              a.respectColliderSettings = !0;
              a.onlyGroundCollisions = g.autoClimb;
              return function (b, c) {
                  a.ray.origin.copy(b);
                  a.far = c;
                  b = m(a);
                  return g.autoClimb || 1 <= b ? b : Infinity;
              };
          })();
      this.distanceToGround = function (a) {
          return n(f, a);
      };
      this.findIntersectionBelow = (function () {
          var a = new wc();
          a.ray.direction.set(0, 0, -1);
          a.respectColliderSettings = !1;
          return function (b, c, d) {
              a.ray.origin.copy(b);
              a.far = c;
              return l(a, d);
          };
      })();
      this.distanceToCeiling = (function () {
          var a = new wc(f);
          a.ray.direction.set(0, 0, 1);
          a.respectColliderSettings = !0;
          return function (b) {
              a.far = b;
              return m(a);
          };
      })();
      this.distanceToCeilingFrom = (function () {
          var a = new wc();
          a.ray.direction.set(0, 0, 1);
          a.respectColliderSettings = !0;
          return function (b, c) {
              a.ray.origin.copy(b);
              a.far = c;
              return m(a);
          };
      })();
      this.cameraHeightFromPoint = function (a) {
          a = n(a, WALK.MAX_GROUND_SEARCH_DEPTH);
          return Infinity === a ? null : a;
      };
      this.adjustPointToMatchCameraHeight = function (a) {
          var b = g.fixedHeight || WALK.CAMERA_FIXED_HEIGHT || c.cameraHeight;
          if (null === b) return !1;
          var d = n(a, WALK.MAX_GROUND_SEARCH_DEPTH);
          if (Infinity === d) return !1;
          b -= d;
          if (0.01 > Math.abs(b) || (0 < b && Infinity !== this.distanceToCeilingFrom(a, b + WALK.MIN_DISTANCE_TO_CEILING))) return !1;
          a.z += b;
          return !0;
      };
      this.findIntersectionAtPosition = (function () {
          var a = new wc(f),
              b = a.ray.direction;
          return function (d, e, g, h) {
              b.set(d, e, 1).unproject(c.camera());
              b.sub(f).normalize();
              a.respectColliderSettings = g;
              return l(a, h);
          };
      })();
      this.findObstacleMeshAtPosition = (function () {
          var a = new xc();
          return function (b, c, d) {
              return this.findIntersectionAtPosition(b, c, d, a) ? a.object : null;
          };
      })();
      this.findMeshFromListAtPosition = (function () {
          var b = new wc(f),
              c = new xc(),
              d = new yc(a, g),
              e = b.ray.direction;
          return function (a, h, l, m, n) {
              b.ignoreVisibility = void 0 === m ? !1 : m;
              m = void 0 === n ? c : n;
              e.set(h, l, 1).unproject(g);
              e.sub(f).normalize();
              return d.closestIntersection(a, b, m) ? m.object : null;
          };
      })();
      this.clickedPointToMoveTarget = (function () {
          function a(f) {
              var m = c.x - h.x;
              var n = c.y - h.y;
              m = Math.sqrt(m * m + n * n);
              b.far = m + WALK.CLICK_MOVE_MIN_DISTANCE_TO_OBSTACLE;
              e.x = h.x - c.x;
              e.y = h.y - c.y;
              if (!(0.01 > Math.abs(e.x) && 0.01 > Math.abs(e.y)))
                  if (((e.z = 0), e.normalize(), l(b, g))) {
                      if (
                          ((n = g.distance - WALK.CLICK_MOVE_MIN_DISTANCE_TO_OBSTACLE),
                          0 < n && ((f.x = c.x + e.x * n), (f.y = c.y + e.y * n), (f.z = c.z)),
                          (n = Math.min(g.distance - 0.01, m)),
                          (c.x += e.x * n),
                          (c.y += e.y * n),
                          d.adjustPointToMatchCameraHeight(c))
                      )
                          return a(f);
                  } else (f.x = h.x), (f.y = h.y), (f.z = c.z);
          }
          var b = new wc();
          b.respectColliderSettings = !0;
          var c = b.ray.origin,
              e = b.ray.direction,
              g = new xc(),
              h = new THREE.Vector3();
          return function (b) {
              c.copy(f);
              h.copy(b);
              b.copy(f);
              a(b);
              d.adjustPointToMatchCameraHeight(b);
          };
      })();
      this.movePointTowardsTheCamera = function (a, b) {
          return qe(a, f, b);
      };
      this.handleCollisions = (function () {
          function a(a) {
              c.applyCameraYaw(d);
              d.normalize();
              var l = e.start.distanceTo(f),
                  n = e.end.distanceTo(f);
              if (h - 0.02 < l + n && l + n < h + 0.02 && n >= a && g.equals(d)) return !1;
              l = m(b);
              Infinity === l && (l = b.far);
              g.copy(d);
              e.start.copy(f);
              e.end.copy(d).multiplyScalar(l).add(f);
              h = e.distance();
              return l < a;
          }
          var b = new wc(f),
              d = b.ray.direction,
              e = new THREE.Line3(),
              g = new THREE.Vector3(),
              h = 0;
          b.respectColliderSettings = !0;
          b.far = 5;
          console.assert(b.far > WALK.CAMERA_MAX_PER_FRAME_LINEAR_DISTANCE);
          return function (b) {
              b = c.maxFrameMoveLinearDistance(b) + WALK.KEY_MOVE_MIN_DISTANCE_TO_OBSTACLE;
              c.movesForward() && (d.set(0, 1, 0), a(b) && c.stopForward());
              c.movesBackward() && (d.set(0, -1, 0), a(b) && c.stopBackward());
              c.movesLeft() && (d.set(-1, 0, 0), a(b) && c.stopLeft());
              c.movesRight() && (d.set(1, 0, 0), a(b) && c.stopRight());
              c.movesDown() && (d.set(0, 0, -1), a(b) && c.stopDown());
              c.movesUp() && (d.set(0, 0, 1), a(b) && c.stopUp());
          };
      })();
  }
  function se(a, b, c, d) {
      function e(a, b) {
          q.collider && q.mouseZoomToPointer && q.collider.findIntersectionAtPosition((a / window.innerWidth) * 2 - 1, 2 * -(b / window.innerHeight) + 1, !0, v) ? I.copy(v.point) : I.copy(q.target);
      }
      function f() {
          var c = b.getYawAngle(),
              e = b.getPitchAngle(),
              f = b.cameraWorldPosition();
          q.autoRotate && U === O.NONE && q.rotateLeft(((2 * Math.PI) / 60 / 60) * q.autoRotateSpeed);
          var g = q.getMinYawAngle(),
              h = q.getMaxYawAngle();
          Math.abs(h - g) >= 2 * Math.PI - 1e-6 ? (c += G) : g === h ? (c = g) : (g > h && ((h += 2 * Math.PI), c < g && (c += 2 * Math.PI)), (c = 0 > G ? Math.min(Math.max(c + G, g), h) : Math.max(Math.min(c + G, h), g)));
          e = THREE.Math.clamp(e + D, q.getMinPitchAngle(), q.getMaxPitchAngle());
          H.copy(q.target).sub(f);
          h = H.length();
          g = THREE.Math.clamp(h * E, q.getMinDistance(), q.getMaxDistance());
          h = g / h;
          M.copy(I).sub(f);
          N.copy(I)
              .sub(q.target)
              .multiplyScalar(1 - h);
          q.target.add(N);
          q.target.add(S);
          se.computeCameraPosition(f, q.target, c, e, g);
          b.cameraPositionUpdated();
          b.setYawAngle(c);
          b.setPitchAngle(e);
          c = se.computeCameraNear(g);
          1e-6 < Math.abs(c - a.near) && ((a.near = c), a.updateProjectionMatrix());
          D = G = 0;
          E = 1;
          S.set(0, 0, 0);
          d.requestFrame();
      }
      function g() {
          fa = Y = ca = ha = Q = 0;
          aa && (aa(), (aa = !1));
      }
      function h(a) {
          if (!1 !== u) {
              a.preventDefault();
              var b = c === document ? c.body : c;
              if (U === O.ROTATE) {
                  if (!0 === q.noRotate) return;
                  y.set(a.clientX, a.clientY);
                  z.subVectors(y, w);
                  q.rotateLeft((z.x / b.clientWidth) * q.mouseRotateSpeed);
                  !1 === q.noPitchRotate && q.rotateUp((z.y / b.clientHeight) * q.mouseRotateSpeed);
                  w.copy(y);
              } else if (U === O.DOLLY) {
                  if (!0 === q.noZoom) return;
                  J.set(a.clientX, a.clientY);
                  F.subVectors(J, C);
                  0 < F.y ? q.dollyIn() : 0 > F.y && q.dollyOut();
                  C.copy(J);
              } else if (U === O.PAN) {
                  if (!0 === q.getNoPan()) return;
                  A.set(a.clientX, a.clientY);
                  B.subVectors(A, x);
                  q.pan(B.x / b.clientHeight, B.y / b.clientWidth);
                  x.copy(A);
              }
              U !== O.NONE && f();
          }
      }
      function l() {
          !1 !== u && aa && (aa(), (aa = !1));
      }
      function m(a) {
          if (!1 !== u && !0 !== q.noZoom && U === O.NONE) {
              a.preventDefault();
              var b = 0;
              void 0 !== a.wheelDelta ? (b = a.wheelDelta) : void 0 !== a.detail && (b = -a.detail);
              e(a.clientX, a.clientY);
              0 < b ? q.dollyOut() : 0 > b && q.dollyIn();
              f();
          }
      }
      function n(a, b, c) {
          return !0 === c ? b : a === b ? 0 : a;
      }
      function p(a, b) {
          var c = !1,
              e = a.keyCode;
          if (!1 !== u) {
              if (!0 === Z && !1 === q.getNoPan())
                  if (38 === e || 87 === e) (Y = n(Y, 1, b)), (c = !0);
                  else if (40 === e || 83 === e) (Y = n(Y, -1, b)), (c = !0);
                  else if (37 === e || 65 === e) (fa = n(fa, 1, b)), (c = !0);
                  else {
                      if (39 === e || 68 === e) (fa = n(fa, -1, b)), (c = !0);
                  }
              else if (!1 === Z && !1 === q.noRotate)
                  if ((38 === e || 87 === e) && !1 === q.noPitchRotate) (ha = n(ha, 1, b)), (c = !0);
                  else if ((40 === e || 83 === e) && !1 === q.noPitchRotate) (ha = n(ha, -1, b)), (c = !0);
                  else if (37 === e || 65 === e) (ca = n(ca, 1, b)), (c = !0);
                  else if (39 === e || 68 === e) (ca = n(ca, -1, b)), (c = !0);
              switch (e) {
                  case q.dollyKeys.IN1:
                  case q.dollyKeys.IN2:
                  case q.dollyKeys.IN3:
                      !1 === q.noZoom && ((Q = n(Q, 1, b)), (c = !0));
                      break;
                  case q.dollyKeys.OUT1:
                  case q.dollyKeys.OUT2:
                  case q.dollyKeys.OUT3:
                      !1 === q.noZoom && ((Q = n(Q, -1, b)), (c = !0));
              }
              c && (a.preventDefault(), d.requestFrame());
          }
      }
      function r(a) {
          return q.getNoPan() ? !1 : Z && 1 === a.length ? !0 : Z || 2 !== a.length ? !1 : Math.abs(a[0].clientY - a[1].clientY) <= WALK.MAX_TWO_POINTERS_IN_LINE_DIFF;
      }
      this.collider = null;
      this.target = new THREE.Vector3();
      this.noZoom = !1;
      this.mouseZoomToPointer = !0;
      this.mouseZoomSpeed = 0.97;
      this.keyZoomSpeed = 0.7;
      this.minZoom = 0;
      this.maxZoom = Infinity;
      this.noPitchRotate = this.noRotate = !1;
      this.mouseRotateSpeed = 2 * Math.PI;
      this.keyYawRotateSpeed = WALK.CAMERA_ARROWS_TURN_SPEED;
      this.keyPitchRotateSpeed = WALK.CAMERA_ARROWS_TURN_SPEED / 2;
      this.autoRotate = !1;
      this.autoRotateSpeed = 2;
      this.getMinPitchAngle = function () {
          return -Math.PI / 2;
      };
      this.getMaxPitchAngle = function () {
          return Math.PI / 2;
      };
      this.getMinYawAngle = function () {
          return -Math.PI;
      };
      this.getMaxYawAngle = function () {
          return Math.PI;
      };
      this.getMinDistance = function () {
          return 0;
      };
      this.getMaxDistance = function () {
          return Infinity;
      };
      this.getNoPan = function () {
          return !1;
      };
      this.keyPanSpeed = 0.25;
      this.dollyKeys = { IN1: 61, IN2: 187, IN3: 69, OUT1: 173, OUT2: 189, OUT3: 81 };
      this.primaryMouseButton = THREE.MOUSE.LEFT;
      this.secondaryMouseButton = THREE.MOUSE.RIGHT;
      this.mouseButtons = { ROTATE: this.primaryMouseButton, ZOOM: THREE.MOUSE.MIDDLE, PAN: this.secondaryMouseButton };
      var q = this,
          u = !1,
          v = new xc(),
          w = new THREE.Vector2(),
          y = new THREE.Vector2(),
          z = new THREE.Vector2(),
          x = new THREE.Vector2(),
          A = new THREE.Vector2(),
          B = new THREE.Vector2(),
          L = new THREE.Vector3(),
          C = new THREE.Vector2(),
          J = new THREE.Vector2(),
          F = new THREE.Vector2(),
          I = new THREE.Vector3(),
          H = new THREE.Vector3(),
          M = new THREE.Vector3(),
          N = new THREE.Vector3(),
          G = 0,
          D = 0,
          E = 1,
          S = new THREE.Vector3(),
          Z = !1,
          Q = 0,
          ca = 0,
          ha = 0,
          fa = 0,
          Y = 0,
          O = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 },
          U = O.NONE,
          aa = !1;
      this.enable = function () {
          u = !0;
          f();
      };
      this.disable = function () {
          u = !1;
          g();
      };
      this.isEnabled = function () {
          return u;
      };
      this.setPanPrimary = function (a) {
          Z = a;
          !0 === Z
              ? ((this.mouseButtons.PAN = this.primaryMouseButton), (this.mouseButtons.ROTATE = this.secondaryMouseButton))
              : ((this.mouseButtons.ROTATE = this.primaryMouseButton), (this.mouseButtons.PAN = this.secondaryMouseButton));
      };
      this.getCameraDistance = (function () {
          var a = new THREE.Vector3();
          return function () {
              a.copy(b.cameraWorldPosition()).sub(this.target);
              return a.length();
          };
      })();
      this.rotateLeft = function (a) {
          void 0 === a && (a = ((2 * Math.PI) / 60 / 60) * q.autoRotateSpeed);
          G -= a;
      };
      this.rotateUp = function (a) {
          void 0 === a && (a = ((2 * Math.PI) / 60 / 60) * q.autoRotateSpeed);
          D -= a;
      };
      this.panLeft = function (b) {
          var c = a.matrixWorld.elements;
          L.set(c[0], c[1], c[2]);
          L.multiplyScalar(-b);
          S.add(L);
      };
      this.panUp = function (b) {
          var c = a.matrixWorld.elements;
          L.set(c[4], c[5], c[6]);
          L.multiplyScalar(b);
          S.add(L);
      };
      this.pan = function (c, d) {
          if (a instanceof THREE.PerspectiveCamera) {
              var e = b.cameraWorldPosition().clone().sub(q.target).length();
              e *= Math.tan(((a.fov / 2) * Math.PI) / 180);
              q.panLeft(2 * c * e);
              q.panUp(2 * d * e);
          } else a instanceof THREE.OrthographicCamera && (q.panLeft(c * (a.right - a.left)), q.panUp(d * (a.top - a.bottom)));
      };
      this.dollyIn = function (b) {
          void 0 === b && (b = this.mouseZoomSpeed);
          a instanceof THREE.PerspectiveCamera ? (E /= b) : a instanceof THREE.OrthographicCamera && ((a.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, a.zoom * b))), a.updateProjectionMatrix());
      };
      this.dollyOut = function (b) {
          void 0 === b && (b = this.mouseZoomSpeed);
          a instanceof THREE.PerspectiveCamera ? (E *= b) : a instanceof THREE.OrthographicCamera && ((a.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, a.zoom / b))), a.updateProjectionMatrix());
      };
      this.update = function (a) {
          if (u && a) {
              var b = !1;
              0 !== ca && (q.rotateLeft(ca * q.keyYawRotateSpeed * a), (b = !0));
              0 !== ha && (q.rotateUp(ha * q.keyPitchRotateSpeed * a), (b = !0));
              if (0 !== fa || 0 !== Y) q.pan(fa * q.keyPanSpeed * a, Y * q.keyPanSpeed * a), (b = !0);
              0 !== Q && ((a = Math.pow(q.keyZoomSpeed, a)), -1 === Q ? q.dollyIn(a) : q.dollyOut(a), (b = !0));
              b && f();
          }
      };
      c.addEventListener(
          "mousedown",
          function (a) {
              if (!1 !== u) {
                  c.focus();
                  a.preventDefault();
                  if (a.button === q.mouseButtons.ROTATE) {
                      if (!0 === q.noRotate) return;
                      U = O.ROTATE;
                      w.set(a.clientX, a.clientY);
                  } else if (a.button === q.mouseButtons.ZOOM) {
                      if (!0 === q.noZoom) return;
                      U = O.DOLLY;
                      C.set(a.clientX, a.clientY);
                      e(a.clientX, a.clientY);
                  } else if (a.button === q.mouseButtons.PAN) {
                      if (!0 === q.getNoPan()) return;
                      U = O.PAN;
                      x.set(a.clientX, a.clientY);
                  }
                  U !== O.NONE &&
                      (document.addEventListener("mousemove", h, !1),
                      document.addEventListener("mouseup", l, !1),
                      (aa = function () {
                          document.removeEventListener("mousemove", h, !1);
                          document.removeEventListener("mouseup", l, !1);
                          U = O.NONE;
                      }));
              }
          },
          !1
      );
      c.addEventListener("mousewheel", m, !1);
      c.addEventListener("DOMMouseScroll", m, !1);
      c.addEventListener(
          "touchstart",
          function (a) {
              if (!1 !== u) {
                  var b = a.touches.length;
                  a.preventDefault();
                  if (r(a.touches)) (U = O.TOUCH_PAN), x.set(a.touches[0].clientX, a.touches[0].clientY);
                  else if (q.noRotate || Z || 1 !== b)
                      if (q.noZoom || 2 !== b) U = O.NONE;
                      else {
                          U = O.TOUCH_DOLLY;
                          b = a.touches[0].clientX - a.touches[1].clientX;
                          var c = a.touches[0].clientY - a.touches[1].clientY;
                          C.set(0, Math.sqrt(b * b + c * c));
                          e(a.touches[0].clientX - b / 2, a.touches[0].clientY - c / 2);
                      }
                  else (U = O.TOUCH_ROTATE), w.set(a.touches[0].clientX, a.touches[0].clientY);
              }
          },
          !1
      );
      c.addEventListener(
          "touchend",
          function () {
              !1 !== u && (U = O.NONE);
          },
          !1
      );
      c.addEventListener(
          "touchmove",
          function (a) {
              if (!1 !== u) {
                  var b = a.touches.length;
                  a.preventDefault();
                  var d = c === document ? c.body : c;
                  r(a.touches) && U === O.TOUCH_PAN
                      ? (A.set(a.touches[0].clientX, a.touches[0].clientY), B.subVectors(A, x), q.pan(B.x / d.clientHeight, B.y / d.clientWidth), x.copy(A), f())
                      : q.noRotate || Z || 1 !== b || U !== O.TOUCH_ROTATE
                      ? q.noZoom || 2 !== b || U !== O.TOUCH_DOLLY
                          ? (U = O.NONE)
                          : ((b = a.touches[0].clientX - a.touches[1].clientX),
                            (a = a.touches[0].clientY - a.touches[1].clientY),
                            J.set(0, Math.sqrt(b * b + a * a)),
                            F.subVectors(J, C),
                            0 < F.y ? q.dollyOut() : 0 > F.y && q.dollyIn(),
                            C.copy(J),
                            f())
                      : (y.set(a.touches[0].clientX, a.touches[0].clientY), z.subVectors(y, w), q.rotateLeft((z.x / d.clientWidth) * q.mouseRotateSpeed), q.rotateUp((z.y / d.clientHeight) * q.mouseRotateSpeed), w.copy(y), f());
              }
          },
          !1
      );
      c.addEventListener(
          "blur",
          function () {
              g();
          },
          !1
      );
      c.addEventListener(
          "keydown",
          function (a) {
              WALK.isModifierPressed(a) || p(a, !0);
          },
          !1
      );
      c.addEventListener(
          "keyup",
          function (a) {
              p(a, !1);
          },
          !1
      );
      a instanceof THREE.PerspectiveCamera || a instanceof THREE.OrthographicCamera || console.warn("WARNING: OrbitControls.js requires perspective or orthographic camers");
  }
  se.prototype.constructor = se;
  se.computeCameraPosition = (function () {
      var a = new THREE.Vector3();
      return function (b, c, d, e, f) {
          d -= Math.PI / 2;
          e += Math.PI / 2;
          a.x = f * Math.sin(e) * Math.cos(d);
          a.y = f * Math.sin(e) * Math.sin(d);
          a.z = f * Math.cos(e);
          b.copy(c).add(a);
      };
  })();
  se.computeCameraNear = function (a) {
      return a * WALK.CAMERA_ORBIT_NEAR_FROM_1M;
  };
  function te(a, b, c, d) {
      function e(a) {
          this.activeDirection = 0;
          this.activeSource = y;
          this.speed = 0;
          this.moves = function () {
              return this.activeDirection || this.speed;
          };
          this.movesInDirection = function (a) {
              return this.activeDirection === a || Math.sign(this.speed) === a;
          };
          this.activateDirectionFromSource = function (a, b) {
              this.activeDirection = a;
              this.activeSource = b;
          };
          this.deactivateDirectionFromSource = function (a, b) {
              this.activeDirection === a && this.activeSource === b && ((this.activeDirection = 0), (this.activeSource = b));
          };
          this.deactivateSource = function (a) {
              this.activeSource === a && ((this.activeDirection = 0), (this.activeSource = y));
          };
          this.stopInDirection = function (a) {
              this.activeDirection === a && ((this.activeDirection = 0), (this.activeSource = y));
              Math.sign(this.speed) === a && (this.speed = 0);
          };
          this.update = function (b, c) {
              if (!this.moves()) return 0;
              var d = Math.sign(this.speed),
                  e = this.activeDirection || -d;
              e = c * e * (d === e ? b / WALK.CAMERA_FULL_ACCELERATION_TIME : b / WALK.CAMERA_FULL_DECELERATION_TIME);
              c *= this.speed + e / 2;
              this.speed = THREE.Math.clamp(this.speed + e, -b, b);
              this.activeDirection || Math.sign(this.speed) === d || (this.speed = 0);
              return THREE.Math.clamp(c, -a, a);
          };
      }
      function f() {
          O.rotation.z = WALK.normalizeRotation(V.z + aa.z);
      }
      function g() {
          f();
          Y.rotation.x = WALK.normalizeRotation(V.x + aa.x);
          fa.rotation.y = V.y;
          O.updateMatrixWorld(!0);
      }
      function h(a) {
          return Math.abs(a[0].y - a[1].y) <= WALK.MAX_TWO_POINTERS_IN_LINE_DIFF;
      }
      function l(a) {
          H[0].copy(I[0]);
          H[1].copy(I[1]);
          a.touches ? (I[0].set(a.touches[0].clientX, a.touches[0].clientY), 2 === a.touches.length ? I[1].set(a.touches[1].clientX, a.touches[1].clientY) : I[1].set(0, 0)) : (I[0].set(a.clientX, a.clientY), I[1].set(0, 0));
      }
      function m(a) {
          if (v)
              if ((a.preventDefault(), l(a), S)) {
                  if (S !== E) {
                      if (S === N) {
                          var b = Z[0].distanceTo(Z[1]);
                          a = I[0].distanceTo(I[1]);
                          10 <= Math.abs(a - b) ? ((S = G), (b = !0)) : h(I) && h(Z) && 10 <= Math.abs(I[0].y - Z[0].y) ? ((S = D), (b = !0)) : (b = !1);
                          if (!b) return;
                      }
                      S === G
                          ? ((b = H[1].distanceTo(H[0])), (b = I[1].distanceTo(I[0]) - b), 0 < Math.abs(b) && ((Q = Date.now()), C.activateDirectionFromSource(Math.sign(b), x)), d.requestFrame())
                          : S === D && h(I) && ((b = I[0].y - H[0].y), 0 < Math.abs(b) && ((ca = Date.now()), J.activateDirectionFromSource(Math.sign(b), x)), d.requestFrame());
                  }
              } else if (!u.mousePressLook || ha || (!S && a.touches)) {
                  b = a.movementX || a.mozMovementX || a.webkitMovementX;
                  void 0 === b && (b = I[0].x - H[0].x);
                  var c = a.movementY || a.mozMovementY || a.webkitMovementY;
                  void 0 === c && (c = I[0].y - H[0].y);
                  a = u.flipMouseLook || (!S && a.touches) ? 1 : -1;
                  ma.x += a * b * WALK.CAMERA_LOOK_SPEED;
                  u.mouseControlsPitch && (ma.y += a * c * WALK.CAMERA_LOOK_SPEED);
                  d.requestFrame();
              }
      }
      function n(a) {
          v && (b.focus(), a.preventDefault(), l(a), (ha = !0), d.requestFrame());
      }
      function p(a) {
          v && (a.preventDefault(), (ha = !1));
      }
      function r(a) {
          var c = 0,
              e;
          (e = !v) || ((e = void 0 !== document.hasFocus ? document.hasFocus() : document.activeElement === b), (e = !e));
          e ||
              (a || (a = window.event),
              a.preventDefault(),
              a.wheelDelta ? (c = a.wheelDelta / 120) : a.detail && (c = -a.detail / 3),
              (M += c * WALK.CAMERA_SCROLL_SPEED),
              (M = 0 <= M ? Math.min(M, 0.5) : Math.max(M, -0.5)),
              d.requestFrame());
      }
      function q() {
          u.stopForward();
          u.stopBackward();
          u.stopLeft();
          u.stopRight();
          u.stopUp();
          u.stopDown();
          F.stopInDirection(1);
          F.stopInDirection(-1);
      }
      var u = this,
          v = !0,
          w = Math.PI / 12;
      _.initSymbol();
      var y = Symbol("MOVE_SOURCE_NONE");
      _.initSymbol();
      var z = Symbol("MOVE_SOURCE_KEY");
      _.initSymbol();
      var x = Symbol("MOVE_SOURCE_GESTURE");
      _.initSymbol();
      var A = Symbol("MOVE_SOURCE_GAMEPAD"),
          B = 1,
          L = new e(WALK.CAMERA_MAX_PER_FRAME_LINEAR_DISTANCE),
          C = new e(WALK.CAMERA_MAX_PER_FRAME_LINEAR_DISTANCE),
          J = new e(WALK.CAMERA_MAX_PER_FRAME_LINEAR_DISTANCE),
          F = new e(w),
          I = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)],
          H = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)],
          M = 0;
      _.initSymbol();
      var N = Symbol("GESTURE_RECOGNITION");
      _.initSymbol();
      var G = Symbol("GESTURE_PINCH");
      _.initSymbol();
      var D = Symbol("GESTURE_TWO_POINTER_DRAG");
      _.initSymbol();
      var E = Symbol("GESTURE_IGNORE"),
          S = null,
          Z = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)],
          Q = 0,
          ca = 0,
          ha = !1,
          fa = new THREE.Object3D(),
          Y = new THREE.Object3D(),
          O = new THREE.Object3D(),
          U = !1,
          aa = new THREE.Vector3(0, 0, 0),
          V = new THREE.Euler(0, 0, 0),
          oa = new THREE.Vector2(),
          ka = new THREE.Vector2(),
          ma = new THREE.Vector2();
      fa.add(a);
      Y.add(fa);
      O.add(Y);
      this.flipMouseLook = this.mousePressLook = !1;
      this.restrictVerticalAngle = this.mouseControlsPitch = !0;
      this.verticalAngleMin = -Math.PI / 2;
      this.verticalAngleMax = Math.PI / 3;
      this.arrowsTurn = !0;
      this.orbit = new se(a, this, b, d);
      this.cameraHeight = null;
      this.isFpsEnabled = function () {
          return v;
      };
      this.isOrbitEnabled = function () {
          return this.orbit.isEnabled();
      };
      this.orbitModeEnable = function () {
          v = !1;
          this.orbit.enable();
      };
      this.camera = function () {
          return a;
      };
      this.applyCameraYaw = function (a) {
          a.applyEuler(O.rotation);
      };
      this.cameraWorldPosition = function () {
          return O.position;
      };
      this.cameraPositionUpdated = (function () {
          var b = { type: "positionChanged", target: null },
              c = null,
              d = null,
              e = null;
          return function () {
              O.updateMatrixWorld(!0);
              var f = O.position;
              if (c !== f.x || d !== f.y || e !== f.z) (c = f.x), (d = f.y), (e = f.z), a.dispatchEvent(b);
          };
      })();
      this.resetRollAngle = function () {
          0 !== fa.rotation.y && ((V.y = 0), g());
      };
      this.getPitchAngle = function () {
          return Y.rotation.x;
      };
      this.setPitchAngle = function (a) {
          a !== Y.rotation.x && ((aa.x = a), (V.x = 0), g());
      };
      this.resetPitchAngle = function () {
          this.setPitchAngle(0);
      };
      this.getYawAngle = function () {
          return O.rotation.z;
      };
      this.setYawAngle = function (a) {
          a !== O.rotation.z && ((aa.z = a), (V.z = 0), g());
      };
      this.resetYawAngle = function () {
          this.setYawAngle(0);
      };
      this.isHandlingGesture = function () {
          return null !== S;
      };
      this.hmdReset = function () {
          U = !0;
          this.resetPitchAngle();
      };
      this.onHmdUpdate = (function () {
          var a = new THREE.Vector3(),
              b = new THREE.Vector3(),
              c = new THREE.Vector3(),
              d = new THREE.Vector3(),
              e = new THREE.Vector3();
          return function (f, h) {
              v &&
                  (V.copy(f),
                  U
                      ? (aa.z -= V.z)
                      : h && (d.subVectors(h, c), a.set(Math.cos(aa.z), Math.sin(aa.z), 0), b.set(-Math.sin(aa.z), Math.cos(aa.z), 0), e.copy(a.multiplyScalar(d.x)), e.add(b.multiplyScalar(d.y)), (e.z = d.z), O.position.add(e)),
                  h && c.copy(h),
                  (U = !1),
                  g());
          };
      })();
      this.maxFrameMoveLinearDistance = function (b) {
          return Math.min(b * a.moveMaxSpeed * B, WALK.CAMERA_MAX_PER_FRAME_LINEAR_DISTANCE);
      };
      this.movesForward = function () {
          return C.movesInDirection(1) || 0 < M;
      };
      this.stopForward = function () {
          0 < M && (M = 0);
          C.stopInDirection(1);
      };
      this.movesBackward = function () {
          return C.movesInDirection(-1) || 0 > M;
      };
      this.stopBackward = function () {
          0 > M && (M = 0);
          C.stopInDirection(-1);
      };
      this.movesLeft = function () {
          return L.movesInDirection(-1);
      };
      this.stopLeft = function () {
          L.stopInDirection(-1);
      };
      this.movesRight = function () {
          return L.movesInDirection(1);
      };
      this.stopRight = function () {
          L.stopInDirection(1);
      };
      this.movesUp = function () {
          return J.movesInDirection(1);
      };
      this.stopUp = function () {
          J.stopInDirection(1);
      };
      this.movesDown = function () {
          return J.movesInDirection(-1);
      };
      this.stopDown = function () {
          J.stopInDirection(-1);
      };
      this.enable = function () {
          this.orbit.disable();
          v = !0;
          ha = 0;
      };
      this.disable = function () {
          this.orbit.disable();
          v = !1;
          q();
      };
      this.update = function (b) {
          if (v) {
              1e-4 < ka.distanceTo(ma)
                  ? (ka.lerp(ma, Math.min(b / WALK.CAMERA_LOOK_SMOOTHING, 1)),
                    (aa.z += ka.x - oa.x),
                    (aa.x += ka.y - oa.y),
                    u.restrictVerticalAngle && (aa.x > u.verticalAngleMax ? (aa.x = u.verticalAngleMax) : aa.x < u.verticalAngleMin && (aa.x = u.verticalAngleMin)),
                    g(),
                    oa.copy(ka),
                    d.requestFrame())
                  : (oa.set(0, 0), ka.set(0, 0), ma.set(0, 0));
              C.activeSource === x && 100 < Date.now() - Q && C.deactivateSource(x);
              J.activeSource === x && 100 < Date.now() - ca && J.deactivateSource(x);
              var c = L.update(a.moveMaxSpeed * B, b),
                  e = C.update(a.moveMaxSpeed * B, b),
                  h = J.update(a.moveMaxSpeed * B, b);
              var l = 0;
              e ? (M = 0) : (M && ((e = u.maxFrameMoveLinearDistance(b)), (l = THREE.Math.clamp(M, -e, e)), (M -= l)), (e = l));
              O.translateX(c);
              O.translateY(e);
              O.translateZ(h);
              b = F.update(WALK.CAMERA_ARROWS_TURN_SPEED, b);
              aa.z += b;
              f();
              (L.moves() || C.moves() || J.moves() || F.moves() || M) && d.requestFrame();
              this.cameraPositionUpdated();
          } else this.orbit.update(b);
      };
      a.rotation.set(0, 0, 0);
      a.up.set(0, 0, 1);
      a.lookAt(new THREE.Vector3(0, 1, 0));
      b.setAttribute("tabindex", -1);
      b.addEventListener(
          "contextmenu",
          function (a) {
              a.preventDefault();
          },
          !1
      );
      b.addEventListener("mousedown", n, !1);
      b.addEventListener(
          "touchstart",
          function (a) {
              v && (a.preventDefault(), l(a), 2 === a.touches.length ? ((S = N), Z[0].copy(I[0]), Z[1].copy(I[1])) : 2 < a.touches.length && (S = E));
          },
          !1
      );
      b.addEventListener("mousemove", m, !1);
      b.addEventListener("touchmove", m, !1);
      b.addEventListener("mouseup", p, !1);
      b.addEventListener(
          "touchend",
          function (a) {
              v && (a.preventDefault(), (S = 0 === a.touches.length ? null : E));
          },
          !1
      );
      b.addEventListener(
          "keydown",
          function (a) {
              var b = !0;
              if (v && !WALK.isModifierPressed(a)) {
                  B = a.shiftKey ? WALK.CAMERA_MOVE_MAX_SPEED_SHIFT_FACTOR : 1;
                  switch (a.keyCode) {
                      case 38:
                      case 32:
                      case 87:
                          C.activateDirectionFromSource(1, z);
                          break;
                      case 37:
                          u.arrowsTurn ? F.activateDirectionFromSource(1, z) : L.activateDirectionFromSource(-1, z);
                          break;
                      case 65:
                          L.activateDirectionFromSource(-1, z);
                          break;
                      case 40:
                      case 83:
                          C.activateDirectionFromSource(-1, z);
                          break;
                      case 39:
                          u.arrowsTurn ? F.activateDirectionFromSource(-1, z) : L.activateDirectionFromSource(1, z);
                          break;
                      case 68:
                          L.activateDirectionFromSource(1, z);
                          break;
                      case 33:
                      case 69:
                          J.activateDirectionFromSource(1, z);
                          break;
                      case 34:
                      case 81:
                          J.activateDirectionFromSource(-1, z);
                          break;
                      default:
                          b = !1;
                  }
                  b && (a.preventDefault(), d.requestFrame());
              }
          },
          !1
      );
      b.addEventListener(
          "keyup",
          function (a) {
              var b = !0;
              if (v) {
                  B = a.shiftKey ? WALK.CAMERA_MOVE_MAX_SPEED_SHIFT_FACTOR : 1;
                  switch (a.keyCode) {
                      case 38:
                      case 32:
                      case 87:
                          C.deactivateDirectionFromSource(1, z);
                          break;
                      case 37:
                      case 65:
                          F.deactivateDirectionFromSource(1, z);
                          L.deactivateDirectionFromSource(-1, z);
                          break;
                      case 40:
                      case 83:
                          C.deactivateDirectionFromSource(-1, z);
                          break;
                      case 39:
                      case 68:
                          F.deactivateDirectionFromSource(-1, z);
                          L.deactivateDirectionFromSource(1, z);
                          break;
                      case 33:
                      case 69:
                          J.deactivateDirectionFromSource(1, z);
                          break;
                      case 34:
                      case 81:
                          J.deactivateDirectionFromSource(-1, z);
                          break;
                      default:
                          b = !1;
                  }
                  b && a.preventDefault();
              }
          },
          !1
      );
      b.addEventListener(
          "mouseout",
          function (a) {
              p(a);
          },
          !1
      );
      b.addEventListener(
          "mouseenter",
          function (a) {
              0 < a.buttons && n(a);
          },
          !1
      );
      b.addEventListener("DOMMouseScroll", r, !1);
      b.addEventListener("mousewheel", r, !1);
      b.addEventListener(
          "blur",
          function () {
              q();
          },
          !1
      );
      c.addEventListener("actionActivated", function (a) {
          if (v)
              switch (a.action) {
                  case WALK.GAMEPAD_ACTION.BACKWARD:
                      C.activateDirectionFromSource(-1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.FORWARD:
                      C.activateDirectionFromSource(1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.LEFT:
                      u.arrowsTurn ? F.activateDirectionFromSource(1, A) : L.activateDirectionFromSource(-1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.RIGHT:
                      u.arrowsTurn ? F.activateDirectionFromSource(-1, A) : L.activateDirectionFromSource(1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.DOWN:
                      J.activateDirectionFromSource(-1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.UP:
                      J.activateDirectionFromSource(1, A);
              }
      });
      c.addEventListener("actionDeactivated", function (a) {
          if (v)
              switch (a.action) {
                  case WALK.GAMEPAD_ACTION.BACKWARD:
                      C.deactivateDirectionFromSource(-1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.FORWARD:
                      C.deactivateDirectionFromSource(1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.LEFT:
                      L.deactivateDirectionFromSource(-1, A);
                      F.deactivateDirectionFromSource(1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.RIGHT:
                      L.deactivateDirectionFromSource(1, A);
                      F.deactivateDirectionFromSource(-1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.DOWN:
                      J.deactivateDirectionFromSource(-1, A);
                      break;
                  case WALK.GAMEPAD_ACTION.UP:
                      J.deactivateDirectionFromSource(1, A);
              }
      });
      this.isEnabled = function () {
          return v;
      };
  }
  function createPointerMaterial() {
      var a = new WALK.StandardMaterial();
      a.baseColor.setRGB(0.749, 0.937, 0.792);
      a.highlight = new THREE.Color().setRGB(0.749, 0.937, 0.792);
      a.setUniforms();
      return a;
  }
  function createPointerObject(mtl) {
      var b = new THREE.CylinderBufferGeometry(0.05, 0.05, 0.011, 32),
          //c = new t.CylinderBufferGeometry(0.05, 0.03, 0.011, 32, 1, !1),
          d = new THREE.CylinderBufferGeometry(0, 0.05, 0.2, 32, 1, !0);
      WALK.EDIT_MODE && (b.addTriangleOrderAttribute(), d.addTriangleOrderAttribute());
      var e = new THREE.Matrix4();
      e.makeRotationX(Math.PI / 2);
      b.applyMatrix(e);
      b.convertNormalsToSpherical();
      b = new THREE.Mesh(b, mtl);
      b.position.z += 0.0055;
      //e.makeTranslation(0, -(0.1 + 0.0055), 0);
      //c.applyMatrix(e);
      //c.convertNormalsToSpherical();
      //c = new t.Mesh(c, mtl);
      d.convertNormalsToSpherical();
      //a = new t.Mesh(d, a);
      //a.add(c);
      //a.rotateX(-Math.PI / 2);
      //a.position.z = 0.158;
      d = new THREE.Object3D();
      d.add(b);
      //d.add(a);
      return d;
  }
  function we(a) {
      var b = createPointerMaterial(),
          c = createPointerObject(b),
          d = c.children[0],
          e = !1,
          f = 1;
      this.hide = function () {
          e && (a.removeAuxiliaryObject(c), (e = !1));
      };
      this.isVisible = function () {
          return e;
      };
      this.showTargetAtPosition = function (b, f, l, m) {
          e || (a.addAuxiliaryObject(c), (e = !0));
          d.visible = m;
          c.position.set(b, f, l);
          c.updateMatrixWorld();
      };
      this.update = function (a) {
          b.highlightMix += a * f;
          1 <= b.highlightMix && ((b.highlightMix = 1), (f = -1));
          0 >= b.highlightMix && ((b.highlightMix = 0), (f = 1));
      };
  }
  function xe(a, b, c, d) {
      function e() {
          d.teleportingToPoint && d.cancelSwitchToPoint();
      }
      function f() {
          !c.mousePressLook && d.teleportingToPoint && d.cancelSwitchToPoint();
      }
      var g = new we(a),
          h = new xc();
      d.addEventListener("teleportDone", function () {
          g.hide();
      });
      this.onMeshClicked = function (a, e) {
          if (!c.isOrbitEnabled() && !c.isHandlingGesture() && 0 !== c.camera().moveMaxSpeed) {
              b.clickedPointToMoveTarget(e);
              a = e.x;
              var f = e.y,
                  l = e.z,
                  m = !1;
              if (b.findIntersectionBelow(e, 4, h)) {
                  l = h.point.z;
                  var q = h.object.geometry.boundingBox;
                  q && l > q.max.z - 0.01 && (m = !0);
              } else l -= c.cameraHeight || 1.6;
              WALK.CLICK_MOVE_SHOW_TARGET_INDICATOR && g.showTargetAtPosition(a, f, l, m);
              d.switchToPoint(e);
          }
      };
      this.update = function (a) {
          g.isVisible() && g.update(a);
      };
      this.dispose = function () {
          document.removeEventListener("keydown", e, !1);
          document.removeEventListener("mousedown", e, !1);
          document.removeEventListener("mousemove", f, !1);
          document.removeEventListener("touchstart", e, !1);
          document.removeEventListener("DOMMouseScroll", e, !1);
          document.removeEventListener("mousewheel", e, !1);
      };
      document.addEventListener("keydown", e, !1);
      document.addEventListener("mousedown", e, !1);
      document.addEventListener("mousemove", f, !1);
      document.addEventListener("touchstart", e, !1);
      document.addEventListener("DOMMouseScroll", e, !1);
      document.addEventListener("mousewheel", e, !1);
  }
  function ye(a, b, c) {
      var d,
          e,
          f = b.cameraWorldPosition(),
          g = new THREE.Vector3();
      this.updateCameraHeight = function (h) {
          if (d) {
              var l = f.z - g.z;
              null !== b.cameraHeight && (b.cameraHeight += l);
              f.x !== g.x || f.y !== g.y ? (e = a.distanceToGround(WALK.MAX_GROUND_SEARCH_DEPTH)) : Infinity !== e && (e += l);
              Infinity !== e &&
                  (null === b.cameraHeight && (b.cameraHeight = e), (l = b.cameraHeight), e < l - 0.005 || e > l + 0.005) &&
                  ((l = b.cameraHeight),
                  (h = Math.min(Math.max((Math.sqrt(Math.pow(f.x - g.x, 2) + Math.pow(f.y - g.y, 2)) / h) * 1.5, WALK.CAMERA_DEFAULT_MOVE_MAX_SPEED) * h, Math.abs(e - l))),
                  e > l && (h = -h),
                  0 > h || Infinity === a.distanceToCeiling(h + WALK.MIN_DISTANCE_TO_CEILING)) &&
                  ((f.z += h), (e += h), c.requestFrame());
              g.copy(f);
          }
      };
      this.enable = function () {
          d = !0;
          e = a.distanceToGround(WALK.MAX_GROUND_SEARCH_DEPTH);
          b.cameraHeight = Infinity !== e ? e : null;
          g.copy(f);
      };
      this.disable = function () {
          d = !1;
      };
      this.isEnabled = function () {
          return d;
      };
      this.enable();
  }
  function ze(a, b) {
      var c = a.cameraWorldPosition(),
          d,
          e,
          f;
      this.onHmdPositionUpdate = function (g) {
          d && !f && 1 < g.z && ((a.cameraHeight = g.z), b.adjustPointToMatchCameraHeight(c), a.cameraPositionUpdated(), (e = c.z), (f = !0));
      };
      this.onTeleportDone = function () {
          d && (e = c.z);
      };
      this.updateCameraHeight = function () {
          d && ((a.cameraHeight += c.z - e), (e = c.z));
      };
      this.enable = function () {
          d = !0;
          a.cameraHeight = b.cameraHeightFromPoint(c);
          null === a.cameraHeight && (a.cameraHeight = WALK.FALLBACK_CAMERA_HEIGHT);
          e = c.z;
          f = !1;
      };
      this.disable = function () {
          d = !1;
          a.cameraHeight = null;
      };
  }
  function Ae(a, b) {
      function c(a) {
          var b = [];
          this.start = function () {
              var a = performance.now();
              b.push({ start: a, end: a, delta: 0 });
          };
          this.end = function () {
              var a = performance.now();
              void 0 !== b[b.length - 1] && ((b[b.length - 1].end = a), (b[b.length - 1].delta = b[b.length - 1].end - b[b.length - 1].start));
          };
          this.stats = function () {
              var c = b[b.length - 1].delta,
                  f = b.reduce(function (a, b) {
                      return a.delta < b.delta ? a : b;
                  }).delta,
                  g = b.reduce(function (a, b) {
                      return a.delta > b.delta ? a : b;
                  }).delta,
                  h = e(b, "delta") / b.length;
              return { name: a, last: d(c), best: d(f), worst: d(g), average: d(h) };
          };
      }
      function d(a) {
          return parseFloat(a.toFixed(4));
      }
      function e(a, b) {
          return a.reduce(function (a, c) {
              return a + c[b];
          }, 0);
      }
      function f(a, b, c, d) {
          var e = 2 * a.x;
          a = 2 * a.y;
          d = 2 * (void 0 === d ? 1 : d);
          n.lineWidth = 2 * (void 0 === c ? 1 : c);
          n.strokeStyle = void 0 === b ? "black" : b;
          n.beginPath();
          n.arc(e, a, d, 0, 2 * Math.PI);
          n.stroke();
      }
      function g(a) {
          a.forEach(function (a) {
              var b = 255 * a.distanceToObstacle;
              b = 0 === a.distanceToObstacle ? "black" : "rgb(255," + b + "," + b + ")";
              var c = 0,
                  d = !0;
              b = void 0 === b ? "black" : b;
              d = void 0 === d ? !1 : d;
              var e = 2 * a.x - 1;
              a = 2 * a.y - 1;
              n.lineWidth = 2 * (void 0 === c ? 1 : c);
              n.strokeStyle = b;
              n.fillStyle = b;
              n.beginPath();
              n.rect(e, a, 2, 2);
              n.stroke();
              d && n.fill();
          });
      }
      function h(a) {
          a.forEach(function (a) {
              a = new THREE.Vector2(a.x, a.y);
              f(a, "green", 0.5, 0.5);
          });
      }
      function l(a) {
          a.forEach(function (b, c) {
              b = new THREE.Vector2(b.x, b.y);
              if (0 < c) {
                  c = new THREE.Vector2(a[c - 1].x, a[c - 1].y);
                  var d = "blue",
                      e = 1;
                  n.lineWidth = 2 * (void 0 === e ? 1 : e);
                  n.strokeStyle = void 0 === d ? "black" : d;
                  n.beginPath();
                  n.moveTo(2 * c.x, 2 * c.y);
                  n.lineTo(2 * b.x, 2 * b.y);
                  n.stroke();
              }
              f(b, "blue", 1, 1);
          });
      }
      console.warn("Camera path debug mode");
      var m = document.createElement("canvas"),
          n = m.getContext("2d");
      m.width = 2 * a;
      m.height = 2 * b;
      m.style.position = "absolute";
      m.style.left = "0";
      m.style.top = "0";
      m.style.maxWidth = "100%";
      document.body.appendChild(m);
      var p = {};
      this.render = function (c, d, e) {
          n.clearRect(0, 0, 2 * a, 2 * b);
          g(c);
          h(d);
          l(e);
      };
      this.timeStart = function (a) {
          void 0 === p[a] && (p[a] = new c(a));
          p[a].start();
      };
      this.timeEnd = function (a) {
          void 0 !== p[a] && p[a].end();
      };
      this.logTime = function () {
          var a = [];
          Object.values(p).forEach(function (b) {
              a.push(b.stats());
          });
          var b = { name: "TOTAL", last: d(e(a, "last")), best: d(e(a, "best")), worst: d(e(a, "worst")), average: d(e(a, "average")) };
          a.push(b);
          console.table(a);
      };
  }
  function Be(a) {
      function b(b) {
          for (var c = d[b]; 0 < b; ) {
              var e = Math.floor((b - 1) / 2),
                  h = d[e];
              if (c[a] <= h[a]) (d[e] = c), (d[b] = h), (b = e);
              else break;
          }
      }
      function c(b) {
          for (var c = d[b]; ; ) {
              var e = 2 * b + 1,
                  h = 2 * b + 2,
                  l = void 0,
                  m = null;
              e < d.length && ((l = d[e]), c[a] > l[a] && (m = e));
              h < d.length && ((e = d[h]), (null === m && c[a] > e[a]) || (null !== m && l[a] > e[a])) && (m = h);
              if (null !== m) (d[b] = d[m]), (d[m] = c), (b = m);
              else break;
          }
      }
      a = void 0 === a ? "score" : a;
      var d = [];
      this.extract = function () {
          var a = d[0],
              b = d.pop();
          0 < d.length && ((d[0] = b), c(0));
          return a;
      };
      this.insert = function (a) {
          d.push(a);
          b(d.length - 1);
      };
      this.update = function (e) {
          var f = d.indexOf(e);
          0 !== f && (e[a] < d[Math.floor((f - 1) / 2)] ? b(f) : c(f));
      };
      this.size = function () {
          return d.length;
      };
  }
  function Ce(a, b, c, d) {
      this.id = a;
      this.x = b;
      this.y = c;
      this.distanceToObstacle = d;
      this.parent = null;
      this.score = 0;
  }
  Ce.prototype = {
      distanceTo: function (a) {
          return Math.sqrt(Math.pow(this.x - a.x, 2) + Math.pow(this.y - a.y, 2));
      },
      distanceMeasured: function () {
          return void 0 !== this.distanceToObstacle;
      },
      isObstacle: function () {
          return 0 === this.distanceToObstacle;
      },
      visited: function () {
          return null !== this.parent;
      },
      visit: function (a, b) {
          this.parent = a;
          this.score = b;
      },
  };
  function De(a, b, c, d) {
      var e = [-1, 1, -b, b],
          f = a.canvasRange,
          g = a.collisionRange,
          h = [];
      (function (a) {
          for (var c = new Be("distanceToObstacle"), f = 0; f <= a.data.length; f += 4) {
              var g = 255 === a.data[f - 1],
                  l = Math.floor(f / (4 * b));
              l = new Ce(f / 4, f / 4 - l * b, l, g ? 0 : void 0);
              h.push(l);
              g && c.insert(l);
          }
          for (a = {}; 0 < c.size(); )
              (a.$jscomp$loop$prop$current$178 = c.extract()),
                  e.forEach(
                      (function (a) {
                          return function (b) {
                              b = a.$jscomp$loop$prop$current$178.id + b;
                              1 > a.$jscomp$loop$prop$current$178.distanceToObstacle &&
                                  void 0 !== h[b] &&
                                  !1 === h[b].distanceMeasured() &&
                                  ((h[b].distanceToObstacle = Math.min(1, a.$jscomp$loop$prop$current$178.distanceToObstacle + 1 / d)), c.insert(h[b]));
                          };
                      })(a)
                  ),
                  (a = { $jscomp$loop$prop$current$178: a.$jscomp$loop$prop$current$178 });
      })(a.collisionImageData);
      this.forEachNeighbour = function (a, c) {
          var d = a.x + a.y * b;
          e.forEach(function (e) {
              var f;
              if ((f = void 0 !== h[d + e]))
                  if (((f = h[d + e]), 0 !== a.x && a.x !== b - 1)) f = !0;
                  else {
                      var g = a.x + f.x !== b - 2;
                      f = 1 === a.x + f.x && !g;
                  }
              f && c(h[d + e]);
          });
      };
      this.hasObstacleAt = function (a, c) {
          return h[Math.round(a) + Math.round(c) * b].isObstacle();
      };
      this.getNodeAtScenePosition = function (a) {
          var c = Math.round(THREE.Math.mapLinear(a.position.x, g.x.min, g.x.max, f.x.min, f.x.max));
          a = Math.round(THREE.Math.mapLinear(a.position.y, g.y.min, g.y.max, f.y.min, f.y.max));
          return h[c + a * b];
      };
      this.getScenePointFromNode = function (a) {
          var b = THREE.Math.mapLinear(a.x, f.x.min, f.x.max, g.x.min, g.x.max);
          a = THREE.Math.mapLinear(a.y, f.y.min, f.y.max, g.y.min, g.y.max);
          return new THREE.Vector2(b, a);
      };
      this.resetNodeMap = function () {
          h.forEach(function (a) {
              a.parent = null;
              a.score = 0;
          });
      };
      this.getNodeMap = function () {
          return h;
      };
  }
  function Ee(a, b) {
      function c(a, b) {
          var c = h.getNodeAtScenePosition(a);
          b = h.getNodeAtScenePosition(b);
          if (!c || !b) return [];
          var d = new Be();
          d.insert(c);
          a = [];
          for (var e = {}; 0 < d.size(); ) {
              e.$jscomp$loop$prop$current$180 = d.extract();
              if (e.$jscomp$loop$prop$current$180 === b) {
                  for (b = e.$jscomp$loop$prop$current$180; b; b = b.parent) b && a.push(b);
                  a.reverse();
                  break;
              }
              h.forEachNeighbour(
                  e.$jscomp$loop$prop$current$180,
                  (function (a) {
                      return function (b) {
                          if (!b.isObstacle()) {
                              var e = a.$jscomp$loop$prop$current$180.score + 1 / (b.distanceToObstacle ? b.distanceToObstacle : 1),
                                  f = b.visited() || b === c;
                              if (!f || e < b.score) b.visit(a.$jscomp$loop$prop$current$180, e), f ? d.update(b) : d.insert(b);
                          }
                      };
                  })(e)
              );
              e = { $jscomp$loop$prop$current$180: e.$jscomp$loop$prop$current$180 };
          }
          return a;
      }
      function d(a, b, c, e) {
          var f;
          a: {
              for (f = a + 1; f < b.length; f++) {
                  b: {
                      var g = b[a],
                          l = b[f],
                          m = g.x < l.x ? g : l,
                          n = g.x < l.x ? l : g,
                          p = g.y < l.y ? g : l,
                          q = g.y < l.y ? l : g;
                      var r = m.x === n.x ? null : (n.y - m.y) / (n.x - m.x);
                      var u = null === r ? m.x : m.y - r * m.x;
                      if (Math.abs(g.y - l.y) > Math.abs(g.x - l.x))
                          for (m = p.y; m <= q.y; m += 0.2) {
                              if (h.hasObstacleAt(null === r ? p.x : (m - u) / r, m)) {
                                  r = !0;
                                  break b;
                              }
                          }
                      else
                          for (p = m.x; p <= n.x; p += 0.2)
                              if (h.hasObstacleAt(p, null === r ? m.y : r * p + u)) {
                                  r = !0;
                                  break b;
                              }
                      r = !1;
                  }
                  if (r) break a;
              }
              f = -1;
          }
          -1 === f ? c.push(b[b.length - 1]) : ((a = f - a), (a = a > e ? f - e : f - Math.floor(a / 2)), c.push(b[a]), d(a, b, c, e));
      }
      function e(a) {
          var b = [a[0]];
          d(0, a, b, 5);
          return b;
      }
      function f(a, b, c) {
          var d = [];
          d.push(new THREE.Vector2(b.position.x, b.position.y));
          for (b = 1; b < a.length - 1; b++) d.push(h.getScenePointFromNode(a[b]));
          d.push(new THREE.Vector2(c.position.x, c.position.y));
          return d;
      }
      var g = null,
          h = null;
      a = b.calculateRenderSize(200, a.collisionBoundingBox);
      var l = a.width,
          m = a.height,
          n = WALK.DEBUG_CAMERA_PATH ? new Ae(l, m) : null;
      this.findPath = function (a, d) {
          n && n.timeStart("Graph");
          var p = d.position.z.toFixed(4);
          if (p !== g) {
              var r = { outlineThickness: 2, outlineColor: new THREE.Color(0, 0, 0), slicePlaneHeight: d.position.z };
              r = b.getCollisionData(r, l, m);
              h = new De(r, l, m, 7);
              g = p;
          } else h.resetNodeMap();
          n && n.timeEnd("Graph");
          n && n.timeStart("Raw path");
          p = c(a, d);
          n && n.timeEnd("Raw path");
          r = [];
          var v = [];
          2 <= p.length &&
              (n && n.timeStart("Refine path"),
              r.push.apply(r, _.arrayFromIterable(e(p))),
              n && n.timeEnd("Refine path"),
              n && n.timeStart("Calculate points"),
              v.push.apply(v, _.arrayFromIterable(f(r, a, d))),
              n && n.timeEnd("Calculate points"));
          n && (n.render(h.getNodeMap(), p, r), n.logTime());
          return v;
      };
  }
  var Fe = Math.PI / 3,
      Ge = 2 * WALK.CAMERA_DEFAULT_MOVE_MAX_SPEED;
  function He(a) {
      return -(Math.cos(Math.PI * a) - 1) / 2;
  }
  function Ie(a) {
      this.distance = a;
      this.time = this.velocity = 0;
      this.setVelocityFromCornerAngle = function (a) {
          this.velocity = THREE.Math.mapLinear(Math.max(Fe, a), Fe, Math.PI, 1, Ge);
      };
  }
  function Je(a, b, c) {
      this.endTime = function () {
          return b.time;
      };
      this.getDistance = function (b) {
          b -= a.time;
          return a.distance + (a.velocity * b + 0.5 * c * Math.pow(b, 2));
      };
      this.isTimeWithinEquation = function (c) {
          return c >= a.time && c <= b.time;
      };
  }
  function Ke(a, b, c, d, e, f) {
      this.endTime = function () {
          return b.time;
      };
      this.getDistance = function (b) {
          b -= a.time;
          return b < d ? a.distance + (a.velocity * b + 0.5 * f * Math.pow(b, 2)) : a.distance + e + (c * (b - d) - 0.5 * f * Math.pow(b - d, 2));
      };
      this.isTimeWithinEquation = function (c) {
          return c >= a.time && c <= b.time;
      };
  }
  function Le(a, b, c) {
      this.endDistance = b;
      this.getPoint = function (d) {
          d = THREE.Math.mapLinear(d, a, b, 0, 1);
          return c.get(d);
      };
      this.getRotation = function (d) {
          d = THREE.Math.mapLinear(d, a, b, 0, 1);
          d = c.normal(d);
          return Math.atan2(d.y, d.x) - Math.PI;
      };
      this.isDistanceWithinCurve = function (c) {
          return c >= a && c <= b;
      };
  }
  function Me(a, b, c) {
      var d = a.velocity,
          e = b.velocity,
          f = b.distance - a.distance,
          g = Math.sqrt(0.5 * Math.pow(d, 2) + 0.5 * Math.pow(e, 2) + f * c);
      if (g > d && g > e) {
          var h = (0.5 * (Math.pow(g, 2) - Math.pow(d, 2))) / c;
          console.assert(0.001 > Math.abs(f - h - (0.5 * (Math.pow(g, 2) - Math.pow(e, 2))) / c));
          d = (g - d) / c;
          b.time = a.time + d + (g - e) / c;
          return new Ke(a, b, g, d, h, c);
      }
      if (g <= e) return (e = Math.sqrt(Math.pow(d, 2) + 2 * f * c)), console.assert(0.001 > Math.abs(f - (0.5 * (Math.pow(e, 2) - Math.pow(d, 2))) / c)), (b.time = a.time + (e - d) / c), (b.velocity = e), new Je(a, b, c);
      c = (2 * f) / (d + e);
      console.assert(0.001 > Math.abs(f - (d * c + 0.5 * (e - d) * c)));
      b.time = a.time + c;
      return new Je(a, b, (e - d) / c);
  }
  var Ne = (function () {
      var a = new THREE.Vector2(),
          b = new THREE.Vector2();
      return function (c, d, e) {
          a.subVectors(d, c);
          b.subVectors(e, d);
          return Math.asin((a.x * b.y - a.y * b.x) / (a.length() * b.length()));
      };
  })();
  function Oe(a) {
      return new THREE.Vector2(a.x, a.y);
  }
  function Pe(a, b) {
      return new Polygon([a, a.clone().lerp(b, 1 / 3), a.clone().lerp(b, 2 / 3), b]);
  }
  function Qe(a, b, c, d) {
      var e = b.distanceTo(a),
          f = b.distanceTo(c),
          g = Math.min(f, e);
      e = g / e;
      f = g / f;
      g = 0.5 > d / g ? d / g : 0.5;
      d = b.clone().lerp(a, g * e);
      a = b.clone().lerp(a, (g / 3) * e);
      e = b.clone().lerp(c, (g / 3) * f);
      b = b.clone().lerp(c, g * f);
      return new Polygon([d, a, e, b]);
  }
  function Re(a, b, c, d, e, f, g, h, l, m, n, p) {
      function r(a) {
          return G.find(function (b) {
              return b.isDistanceWithinCurve(a);
          });
      }
      function q() {
          for (var a = [], b = 1; b < c.length - 1; b++) {
              var d = c[b - 1],
                  e = c[b],
                  f = c[b + 1],
                  g = Ne(d, e, f),
                  h = THREE.Math.mapLinear(Math.max(Fe, g), Fe, Math.PI, 2, 6);
              d = Qe(d, e, f, h);
              a.push({ bezier: d, angle: g });
          }
          b = [];
          b.push(new Ie(0));
          d = c[0];
          for (e = g = 0; e < a.length; e++) {
              var l = a[e - 1];
              f = a[e];
              h = a[e + 1];
              void 0 !== l && (d = Oe(l.bezier.points[3]));
              l = Oe(f.bezier.points[0]);
              l = Pe(d, l);
              if (0 < l.length()) {
                  var p = g,
                      q = g + l.length();
                  p = new Le(p, q, l);
                  G.push(p);
                  g += l.length();
              }
              l = f.bezier.length() / 2;
              p = new Le(g, g + 2 * l, f.bezier);
              G.push(p);
              g += l;
              p = Math.abs(f.angle);
              p > Fe && ((q = new Ie(g)), q.setVelocityFromCornerAngle(p), b.push(q));
              g += l;
              void 0 === h && (d = Oe(f.bezier.points[3]));
          }
          a = Pe(d, c[c.length - 1]);
          d = g + a.length();
          d = new Le(g, d, a);
          G.push(d);
          g += a.length();
          b.push(new Ie(g));
          for (a = 1; a < b.length; a++) (d = Me(b[a - 1], b[a], n)), D.push(d);
          F = function (a) {
              return C.getPoint(a);
          };
          C = G[0];
          J = D[0];
          B = g;
          a = D[D.length - 1].endTime();
          A = Math.max(1.5, Math.min(a, m));
          L = D[D.length - 1].endTime() / A;
      }
      function u() {
          if (5 < B) {
              var a = r(1.25),
                  b = WALK.normalizeRotation(a.getRotation(1.25) - e.x),
                  c = B - 3.75;
              a = r(c);
              var d = WALK.normalizeRotation(h.x - a.getRotation(c));
              H = function (a) {
                  return 1.25 > a ? ((a = He(a / 1.25)), e.x + a * b) : a > c ? ((a = 1 - He((a - c) / (B - c))), h.x - a * d) : C.getRotation(a);
              };
          } else {
              var f = WALK.normalizeRotation(h.x - e.x);
              H = function (a) {
                  a = He(a / B);
                  return e.x + a * f;
              };
          }
          if (5 < B) {
              var g = WALK.normalizeRotation(0 - e.y),
                  l = B - 3.25,
                  m = WALK.normalizeRotation(h.y);
              M = function (a) {
                  return 1.75 > a ? ((a = He(a / 1.75)), e.y + a * g) : a > l ? He((a - l) / (B - l)) * m : 0;
              };
          } else {
              var n = WALK.normalizeRotation(h.y - e.y);
              M = function (a) {
                  a = He(a / B);
                  return e.y + a * n;
              };
          }
      }
      function v() {
          var a = WALK.normalizeRotation(h.x - e.x);
          H = function (b) {
              return e.x + He(b / A) * a;
          };
          var b = WALK.normalizeRotation(h.y - e.y);
          M = function (a) {
              return e.y + He(a / A) * b;
          };
      }
      function w() {
          var a = 3 < B ? 3 : B;
          I = function (b) {
              return b < a ? ((b = He(b / a)), THREE.Math.mapLinear(b, 0, 1, d, g)) : g;
          };
      }
      function y() {
          I = function (a) {
              a = He(a / A);
              return THREE.Math.mapLinear(a, 0, 1, d, g);
          };
      }
      function z() {
          var a = x * L;
          a > J.endTime() &&
              (J = D.find(function (b) {
                  return b.isTimeWithinEquation(a);
              }));
          return J.getDistance(a);
      }
      var x = 0,
          A = 1.5,
          B = 0,
          L = 1,
          C = null,
          J = null,
          F = null,
          I = null,
          H = null,
          M = null,
          N = null,
          G = [],
          D = [],
          E = 0.001 < c[0].distanceTo(c[c.length - 1]);
      E && q();
      p && E ? (u(), w()) : (v(), void 0 !== g && (!E && 0.001 < Math.abs(g - d) && ((B = Math.abs(g - d)), (A = Math.max(1.5, Math.min(Math.sqrt(B / n), m)))), y()), v());
      void 0 !== l &&
          (N = function (a) {
              a = He(a / A);
              return THREE.Math.mapLinear(a, 0, 1, f, l);
          });
      this.update = function (c, d) {
          x += c;
          if (x < A) {
              p && E ? ((c = z()), c > C.endDistance && (C = r(c))) : (c = x);
              if (F) {
                  var e = F(z());
                  d.setX(e.x);
                  d.setY(e.y);
              }
              I && ((e = I(c)), d.setZ(e));
              N && ((a.fov = N(x)), a.updateProjectionMatrix());
              b.setYawAngle(H(c));
              b.setPitchAngle(M(c));
              b.cameraPositionUpdated();
              return !0;
          }
          return !1;
      };
  }
  var Se = 1 / 180;
  function SkyActivator(scene) {
      var auxObj = null;
      this.activateSky = function (mp) {
          if (auxObj) {
              if (auxObj.name === mp) return;
              scene.removeAuxiliaryObject(auxObj);
          }
          var m = scene.findSkyMesh(mp);
          (mp = m.material.map) && !mp.loaded
              ? (this.activateSky(WALK.DEFAULT_SKY_NAME),
                (auxObj = m),
                mp.addLoadedListener(function () {
                    auxObj === m && (scene.addAuxiliaryObject(m), m.updateMatrixWorld(!0));
                }))
              : (scene.addAuxiliaryObject(m), m.updateMatrixWorld(!0), (auxObj = m));
      };
      this.activeSkyName = function () {
          return auxObj.name;
      };
  }
  function Ue(a, b, c) {
      this.position = a || new THREE.Vector3();
      this.rotation = b || new THREE.Vector2();
      this.fov = c || 0;
  }
  function ViewList(scene, b, c, d, e) {
      function checkHideInViews() {
          viewId2HideMeshes = [];
          for (var i = 0; i < scene.views.length; i += 1) viewId2HideMeshes[scene.views[i].id] = [];
          for (i = 0; i < scene.gpuMeshes.length; i += 1) {
              var meshes = scene.gpuMeshes[i],
                  hideList = meshes.hideInViews;
              if (hideList) for (var j = 0; j < hideList.length; j += 1)
                  viewId2HideMeshes[hideList[j]] ? viewId2HideMeshes[hideList[j]].push(meshes) : console.warn("Invalid view id in hideInViews list: '" + hideList[i] + "'");
          }
      }
      function _hideMeshes(meshes) {
          for (var i = 0; i < meshes.length; i += 1) {
              var m = meshes[i];
              m.visible = !1;
              hiddenMeshes.push(m);
          }
      }
      function unhideMeshes() {
          for (var i = 0; i < hiddenMeshes.length; i += 1) hiddenMeshes[i].visible = !0;
          hiddenMeshes.length = 0;
      }
      function hideMeshes(meshes) {
          unhideMeshes();
          _hideMeshes(meshes);
      }
      function m() {
          u.fov = x.fov;
          q.copy(x.position);
          b.setYawAngle(x.rotation.x);
          b.setPitchAngle(x.rotation.y);
          b.cameraPositionUpdated();
          z = null;
      }
      function n() {
          return [new THREE.Vector2(G().position.x, G().position.y), new THREE.Vector2(x.position.x, x.position.y)];
      }
      var p = this,
          skyActivator = new SkyActivator(scene),
          q = b.cameraWorldPosition(),
          u = scene.camera,
          viewId2HideMeshes,
          hiddenMeshes = [],
          y = new Ee(scene, e),
          z = null,
          x = new Ue(),
          A = new THREE.Vector3(),
          B,
          L,
          currentView,
          J = !1,
          teleStartEvent = { type: "teleportStarted", target: this, view: null },
          teleDoneEvent = { type: "teleportDone", target: this, view: null },
          H = null;
      this.lastDestinationView = null;
      var M = (this.teleportingToPoint = this.teleportingToView = !1),
          N = !1,
          G = (function () {
              var a = new Ue(b.cameraWorldPosition());
              return function () {
                  a.rotation.set(WALK.normalizeRotation(b.getYawAngle()), WALK.normalizeRotation(b.getPitchAngle()));
                  a.fov = u.fov;
                  return a;
              };
          })();
      this.update = function (a) {
          if (p.teleportingToView || p.teleportingToPoint) {
              a = Math.min(a, 0.067);
              a = Math.max(a, Se);
              var c = !0;
              null !== z && (this.teleportingToPoint && (x.position.z = q.z), z.update(a, q) ? (c = !1) : m());
              c &&
                  (this.teleportingToView &&
                      ("orbit" !== currentView.mode || J
                          ? ((a = b.camera()), (a.near = WALK.CAMERA_WALK_NEAR), a.updateProjectionMatrix(), b.enable())
                          : ((b.orbit.minDistance = B),
                            (b.orbit.maxDistance = L),
                            b.orbit.setPanPrimary(currentView.panPrimary || !1),
                            (b.orbit.noRotate = currentView.noRotate || !1),
                            (b.orbit.noPitchRotate = currentView.noPitchRotate || !1),
                            (b.orbit.getNoPan = function () {
                                return currentView.noPan;
                            }),
                            (b.orbit.getMinPitchAngle = function () {
                                return -currentView.maxUpAngle;
                            }),
                            (b.orbit.getMaxPitchAngle = function () {
                                return -currentView.minUpAngle;
                            }),
                            (b.orbit.getMinYawAngle = function () {
                                return currentView.minSideAngle;
                            }),
                            (b.orbit.getMaxYawAngle = function () {
                                return currentView.maxSideAngle;
                            }),
                            (b.orbit.getMinDistance = function () {
                                return currentView.minDistance;
                            }),
                            (b.orbit.getMaxDistance = function () {
                                return currentView.maxDistance;
                            }),
                            b.orbit.target.copy(A),
                            b.orbitModeEnable()),
                      skyActivator.activateSky(currentView.sky),
                      hideMeshes(viewId2HideMeshes[currentView.id] || [])),
                  (this.teleportingToView = this.teleportingToPoint = !1),
                  (teleDoneEvent.view = currentView),
                  this.dispatchEvent(teleDoneEvent));
              d.requestFrame();
          }
      };
      this.cancelSwitchToPoint = function () {
          console.assert(this.teleportingToPoint);
          this.teleportingToPoint = !1;
          teleDoneEvent.view = null;
          this.dispatchEvent(teleDoneEvent);
      };
      this.switchToPoint = function (a, c) {
          var e;
          if ((e = a.x === q.x && a.y === q.y)) (e = void 0 === c) || (e = WALK.normalizeRotation(c.yaw) === G().rotation.x && WALK.normalizeRotation(c.pitch) === G().rotation.y);
          e ||
              ((currentView = null),
              (this.teleportingToPoint = !0),
              (this.teleportingToView = !1),
              (teleStartEvent.view = null),
              this.dispatchEvent(teleStartEvent),
              M ? x.position.set(a.x, a.y, a.z) : x.position.set(a.x, a.y, q.z),
              c ? x.rotation.set(WALK.normalizeRotation(c.yaw), WALK.normalizeRotation(c.pitch)) : ((a = WALK.yawRotationToPoint(q, a)), (a = WALK.normalizeRotation(a)), x.rotation.set(a, 0)),
              (x.fov = u.defaultFov),
              M ? (m(), this.update(Se)) : ((z = new Re(u, b, n(), G().position.z, G().rotation, u.fov, void 0, x.rotation, x.fov, WALK.TELEPORT_TO_POINT_MAX_TIME, WALK.TELEPORT_TO_POINT_ACCELERATION, !1)), d.requestFrame()));
      };
      this.switchToView = function (a, e) {
          var f = "orbit" !== a.mode;
          var h = p.lastDestinationView ? "orbit" !== p.lastDestinationView.mode : !0;
          f = u.autoPath && f && h;
          a.hideFromMenu || (H = a);
          this.lastDestinationView = currentView = a;
          this.teleportingToView = !0;
          this.teleportingToPoint = !1;
          teleStartEvent.view = currentView;
          this.dispatchEvent(teleStartEvent);
          b.disable();
          b.resetRollAngle();
          _hideMeshes(viewId2HideMeshes[currentView.id] || []);
          void 0 !== currentView.rotation ? x.rotation.set(currentView.rotation.yaw, currentView.rotation.pitch) : x.rotation.set(0, 0);
          x.fov = currentView.fov || u.defaultFov;
          "orbit" === currentView.mode
              ? (void 0 !== currentView.target ? A.set(currentView.target.x, currentView.target.y, currentView.target.z) : A.set(0, 0, 0),
                (B = currentView.minDistance),
                (L = currentView.maxDistance),
                (a = THREE.Math.clamp(currentView.distance || 10, B, L)),
                se.computeCameraPosition(x.position, A, x.rotation.x, x.rotation.y, a),
                (u.near = se.computeCameraNear(a)),
                u.updateProjectionMatrix())
              : void 0 !== currentView.position
              ? (x.position.set(currentView.position.x, currentView.position.y, currentView.position.z), (N || null !== u.fixedHeight || null !== WALK.CAMERA_FIXED_HEIGHT) && c.adjustPointToMatchCameraHeight(x.position))
              : x.position.set(0, 0, 0);
          if ((void 0 === e && 0 === WALK.TELEPORT_TO_VIEW_MAX_TIME) || 0 === e || M) m(), this.update(Se);
          else {
              currentView.sky !== skyActivator.activeSkyName() && skyActivator.activateSky(WALK.DEFAULT_SKY_NAME);
              a = f ? y.findPath(G(), x) : [];
              h = 0 < a.length;
              a = (f = f && h) ? a : n();
              h = f ? WALK.TELEPORT_PATH_ACCELERATION : WALK.TELEPORT_TO_VIEW_ACCELERATION;
              void 0 === e && (e = f ? WALK.TELEPORT_PATH_MAX_TIME : WALK.TELEPORT_TO_VIEW_MAX_TIME);
              if (void 0 === currentView.rotation) {
                  var l = WALK.yawRotationToPoint(a[a.length - 2], a[a.length - 1]);
                  l = WALK.normalizeRotation(l);
                  x.rotation.set(l, 0);
              }
              z = new Re(u, b, a, G().position.z, G().rotation, u.fov, x.position.z, x.rotation, x.fov, e, h, f);
              d.requestFrame();
          }
      };
      this._switchToAdjacentVisibleView = function (b, c) {
          var d = scene.visibleViews();
          if (0 !== d.length)
              if (null === H) this.switchToView(d[0], c);
              else {
                  var e = d.indexOf(H);
                  -1 === e && this.switchToView(d[0], c);
                  this.switchToView(d[(e + d.length + b) % d.length], c);
              }
      };
      this.switchToPreviousVisibleView = function (a) {
          this._switchToAdjacentVisibleView(-1, a);
      };
      this.switchToNextVisibleView = function (a) {
          this._switchToAdjacentVisibleView(1, a);
      };
      this.updateHiddenMeshes = function (a) {
          checkHideInViews();
          a ? hideMeshes(viewId2HideMeshes[a.id] || []) : unhideMeshes();
          d.requestFrame();
      };
      this.activateSky = function (a) {
          skyActivator.activateSky(a.sky);
          d.requestFrame();
      };
      this.executeWithViewVisibilitySettings = function (a, b) {
          var ms = hiddenMeshes.slice();
          hideMeshes(viewId2HideMeshes[a.id] || []);
          skyActivator.activateSky(a.sky);
          b();
          skyActivator.activateSky(this.lastDestinationView.sky);
          hideMeshes(ms);
      };
      this.onVrChange = function (a) {
          N = M = J = a;
          this.lastDestinationView && "orbit" === this.lastDestinationView.mode && this.switchToView(this.lastDestinationView, 0);
      };
      checkHideInViews();
      scene.addEventListener("viewAdded", checkHideInViews);
      scene.addEventListener("viewRemoved", checkHideInViews);
      scene.addEventListener("skyMeshAdded", function (a) {
          skyActivator.activateSky(a.skyMesh.name);
          d.requestFrame();
      });
      scene.addEventListener("skyMeshRemoved", function (a) {
          skyActivator.activeSkyName() === a.skyMesh.name && (skyActivator.activateSky(WALK.DEFAULT_SKY_NAME), d.requestFrame());
      });
  }
  THREE.EventDispatcher.prototype.apply(ViewList.prototype);
  function LocalTeleport(a, viewList) {
      function nextView() {
          _running && viewList.switchToNextVisibleView(4);
      }
      var _running = !1,
          e = { type: "tourStarted" },
          f = { type: "tourStopped" };
      viewList.addEventListener("teleportDone", function () {
          _running && setTimeout(nextView, WALK.AUTO_TOUR_IN_VIEW_STILL_TIME_MS);
      });
      this.isRunning = function () {
          return _running;
      };
      this.start = function () {
          console.assert(!_running);
          _running = !0;
          this.dispatchEvent(e);
          nextView();
      };
      this.stop = function () {
          console.assert(_running);
          _running = !1;
          viewList.switchToView(viewList.lastDestinationView, 0);
          this.dispatchEvent(f);
      };
  }
  THREE.EventDispatcher.prototype.apply(LocalTeleport.prototype);
  WALK.GAMEPAD_ACTION = { TRIGGER: 0, BACKWARD: 1, FORWARD: 2, LEFT: 3, RIGHT: 4, DOWN: 5, UP: 6, PREVIOUS: 7, NEXT: 8 };
  var Xe = [
          {
              gamepadIdPattern: /^Spatial Controller \(Spatial Interaction Source\).*$/,
              axisMapping: new Map([
                  [2, [WALK.GAMEPAD_ACTION.PREVIOUS, WALK.GAMEPAD_ACTION.NEXT]],
                  [3, [WALK.GAMEPAD_ACTION.UP, WALK.GAMEPAD_ACTION.DOWN]],
                  [0, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
                  [1, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
              ]),
              buttonMapping: new Map([[1, WALK.GAMEPAD_ACTION.TRIGGER]]),
          },
          {
              gamepadIdPattern: /Oculus Touch \(Left\)/,
              axisMapping: new Map([
                  [0, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
                  [1, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
              ]),
              buttonMapping: new Map([
                  [1, WALK.GAMEPAD_ACTION.TRIGGER],
                  [3, WALK.GAMEPAD_ACTION.DOWN],
                  [4, WALK.GAMEPAD_ACTION.UP],
              ]),
          },
          {
              gamepadIdPattern: /Oculus Touch \(Right\)/,
              axisMapping: new Map([
                  [0, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
                  [1, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
              ]),
              buttonMapping: new Map([
                  [1, WALK.GAMEPAD_ACTION.TRIGGER],
                  [3, WALK.GAMEPAD_ACTION.NEXT],
                  [4, WALK.GAMEPAD_ACTION.PREVIOUS],
              ]),
          },
          {
              gamepadIdPattern: /OpenVR (Gamepad|Controller)/,
              axisMapping: new Map([
                  [0, [WALK.GAMEPAD_ACTION.PREVIOUS, WALK.GAMEPAD_ACTION.NEXT]],
                  [1, [WALK.GAMEPAD_ACTION.DOWN, WALK.GAMEPAD_ACTION.UP]],
              ]),
              buttonMapping: new Map([[1, WALK.GAMEPAD_ACTION.TRIGGER]]),
          },
          {
              gamepadIdPattern: /.*/,
              gamepadLayoutMappingId: "standard",
              axisMapping: new Map([
                  [0, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
                  [1, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
                  [2, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
                  [3, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
              ]),
              buttonMapping: new Map([
                  [0, WALK.GAMEPAD_ACTION.DOWN],
                  [1, WALK.GAMEPAD_ACTION.NEXT],
                  [2, WALK.GAMEPAD_ACTION.PREVIOUS],
                  [3, WALK.GAMEPAD_ACTION.UP],
                  [4, WALK.GAMEPAD_ACTION.TRIGGER],
                  [5, WALK.GAMEPAD_ACTION.TRIGGER],
              ]),
          },
          {
              gamepadIdPattern: /.*/,
              axisMapping: new Map([
                  [0, [WALK.GAMEPAD_ACTION.PREVIOUS, WALK.GAMEPAD_ACTION.NEXT]],
                  [1, [WALK.GAMEPAD_ACTION.UP, WALK.GAMEPAD_ACTION.DOWN]],
              ]),
              buttonMapping: new Map([
                  [0, WALK.GAMEPAD_ACTION.TRIGGER],
                  [1, WALK.GAMEPAD_ACTION.TRIGGER],
                  [2, WALK.GAMEPAD_ACTION.TRIGGER],
                  [3, WALK.GAMEPAD_ACTION.TRIGGER],
              ]),
          },
      ],
      Ye = {
          axisMapping: new Map([
              [2, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
              [3, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
          ]),
          buttonMapping: new Map([
              [0, WALK.GAMEPAD_ACTION.TRIGGER],
              [4, WALK.GAMEPAD_ACTION.DOWN],
              [5, WALK.GAMEPAD_ACTION.UP],
          ]),
      },
      Ze = {
          axisMapping: new Map([
              [2, [WALK.GAMEPAD_ACTION.LEFT, WALK.GAMEPAD_ACTION.RIGHT]],
              [3, [WALK.GAMEPAD_ACTION.FORWARD, WALK.GAMEPAD_ACTION.BACKWARD]],
          ]),
          buttonMapping: new Map([
              [0, WALK.GAMEPAD_ACTION.TRIGGER],
              [4, WALK.GAMEPAD_ACTION.NEXT],
              [5, WALK.GAMEPAD_ACTION.PREVIOUS],
          ]),
      };
  function $e(a) {
      return -0.7 >= a ? 0 : 0.7 <= a ? 1 : -1;
  }
  function af(a, b) {
      if ("xr-standard" === a.mapping) return "left" === (a.hand ? a.hand : b) ? Ye : Ze;
      b = _.makeIterator(Xe);
      for (var c = b.next(); !c.done; c = b.next()) {
          c = c.value;
          var d = a;
          var e = c;
          d = e.gamepadIdPattern.test(d.id) ? (void 0 !== e.gamepadLayoutMappingId ? d.mapping === e.gamepadLayoutMappingId : !0) : !1;
          if (d) return c;
      }
      console.error("No matching action mapping for gamepad found", a.id);
      return null;
  }
  function bf(a, b) {
      b = af(a, b);
      this.axisMapping = b.axisMapping;
      this.buttonMapping = b.buttonMapping;
      this.axisPosition = a.axes.map($e);
      this.buttonPressed = a.buttons.map(function (a) {
          return a.pressed;
      });
  }
  function cf() {
      function a(a) {
          var b = a.gamepad;
          a = new bf(a.gamepad);
          c.set(b.index, a);
      }
      function b(a) {
          c.delete(a.gamepad.index);
      }
      var c = new Map(),
          d = new Map(),
          e = new Set(),
          f = new Set(),
          g = { type: "actionActivated", action: null },
          h = { type: "actionDeactivated", action: null };
      this.hasGamepads = function () {
          return 0 < c.size || 0 < d.size;
      };
      this.update = function () {
          function a(a, b) {
              for (var c = 0; c < b.axes.length; ++c) {
                  var d = $e(b.axes[c]),
                      g = a.axisPosition[c];
                  if (d !== g) {
                      var h = a.axisMapping.get(c);
                      void 0 !== h && (-1 !== g && f.add(h[g]), -1 !== d && e.add(h[d]));
                  }
                  a.axisPosition[c] = d;
              }
              for (c = 0; c < b.buttons.length; ++c) (d = b.buttons[c].pressed), (g = a.buttonPressed[c]), d !== g && ((h = a.buttonMapping.get(c)), void 0 !== h && (g ? f.add(h) : e.add(h))), (a.buttonPressed[c] = d);
          }
          if (this.hasGamepads()) {
              e.clear();
              f.clear();
              var b = navigator.getGamepads ? navigator.getGamepads() : [];
              b = _.makeIterator(b);
              for (var n = b.next(); !n.done; n = b.next())
                  if ((n = n.value)) {
                      var p = c.get(n.index);
                      a(p, n);
                  }
              b = _.makeIterator(d);
              for (n = b.next(); !n.done; n = b.next()) (p = _.makeIterator(n.value)), (n = p.next().value), (p = p.next().value), a(p, n);
              n = _.makeIterator(f);
              for (b = n.next(); !b.done; b = n.next()) (h.action = b.value), this.dispatchEvent(h);
              n = _.makeIterator(e);
              for (b = n.next(); !b.done; b = n.next()) (g.action = b.value), this.dispatchEvent(g);
          }
      };
      this.addXrGamepad = function (a, b) {
          b = new bf(a, b);
          d.set(a, b);
      };
      this.removeXrGamepad = function (a) {
          d.delete(a);
      };
      this.removeAllXrGamepads = function () {
          d.clear();
      };
      (function () {
          if (navigator.getGamepads) {
              window.addEventListener("gamepadconnected", a);
              window.addEventListener("gamepaddisconnected", b);
              for (var d = _.makeIterator(navigator.getGamepads()), e = d.next(); !e.done; e = d.next())
                  if ((e = e.value)) {
                      var f = new bf(e);
                      c.set(e.index, f);
                  }
          }
      })();
  }
  THREE.EventDispatcher.prototype.apply(cf.prototype); /*
Copyright (C) 2020-present Actif3D
*/
  function df() {
      var a = this,
          b = !1,
          c = { type: "modeDisabled" },
          d = { type: "modeEnabled" };
      this.enableMode = function () {
          b = !0;
          a.dispatchEvent(d);
      };
      this.disableMode = function () {
          b = !1;
          a.dispatchEvent(c);
      };
      this.modeIsEnabled = function () {
          return b;
      };
  }
  THREE.EventDispatcher.prototype.apply(df.prototype); /*
Copyright (C) 2017-present Actif3D
*/
  console.assert(WALK.GAZE_POINTER_SHOW_LOADING_AFTER_S <= WALK.GAZE_POINTER_ACTIVATE_AFTER_S);
  var ef = Math.PI / 60;
  function ff() {
      var a = new THREE.BufferGeometry(),
          b = new Float32Array(18);
      a.addAttribute("position", new THREE.BufferAttribute(b, 3));
      b[0] = 0.05;
      b[1] = -0.05;
      b[2] = -2;
      b[3] = 0.05;
      b[4] = 0.05;
      b[5] = -2;
      b[6] = -0.05;
      b[7] = -0.05;
      b[8] = -2;
      b[9] = 0.05;
      b[10] = 0.05;
      b[11] = -2;
      b[12] = -0.05;
      b[13] = 0.05;
      b[14] = -2;
      b[15] = -0.05;
      b[16] = -0.05;
      b[17] = -2;
      a.computeBoundingSphere();
      return a;
  }
  function qf(a, b, c, d) {
      function e() {
          if (!g) f();
          else if (!p) {
              var d = new WALK.GazePointerMaterial(),
                  e = new THREE.Mesh(ff(), d);
              a.addAuxiliaryObject(e);
              e.frustumCulled = !1;
              e.matrixWorld = b.camera().matrixWorld;
              p = {
                  setVisible: function (a) {
                      e.visible = a;
                      c();
                  },
                  setCircleSpan: function (a) {
                      d.circleSpan = a;
                      c();
                  },
              };
              f();
          }
          p && p.setVisible(g);
      }
      function f() {
          h = l = null;
          m = 0;
          n = !1;
          p && p.setCircleSpan(0);
      }
      var g = d.modeIsEnabled(),
          h,
          l,
          m,
          n,
          p = null,
          r = null,
          q = null;
      this.setGazeHandlers = function (a, b) {
          r = a;
          q = b;
      };
      d.addEventListener("modeDisabled", function () {
          g = !1;
          e();
      });
      d.addEventListener("modeEnabled", function () {
          g = !0;
          e();
      });
      this.reset = function () {
          null !== h && f();
      };
      this.update = function (a) {
          if (g) {
              var c = b.getPitchAngle(),
                  d = b.getYawAngle();
              null === h
                  ? ((h = c), (l = d))
                  : Math.abs(h - c) > ef || Math.abs(l - d) > ef
                  ? f()
                  : ((m += a),
                    m >= WALK.GAZE_POINTER_SHOW_LOADING_AFTER_S &&
                        (n
                            ? (p.setCircleSpan(Math.min((m - WALK.GAZE_POINTER_SHOW_LOADING_AFTER_S) / (WALK.GAZE_POINTER_ACTIVATE_AFTER_S - WALK.GAZE_POINTER_SHOW_LOADING_AFTER_S), 1)),
                              m >= WALK.GAZE_POINTER_ACTIVATE_AFTER_S && (q && q(), f()))
                            : r && r()
                            ? (n = !0)
                            : f()));
          }
      };
      e();
  } /*
Copyright (C) 2018-present Actif3D
*/
  function HashchangeHandler(scene, viewList) {
      function onHashchange() {
          var a = WALK.urlHashGetArgument("view");
          a && (a = scene.findViewByName(a)) && (viewList.switchToView(a), (window.location.hash = WALK.urlHashRemoveArgument("view")));
      }
      window.addEventListener("hashchange", onHashchange, !1);
      this.dispose = function () {
          window.removeEventListener("hashchange", onHashchange, !1);
      };
  }
  var stdMtlVtx = WALK.getShader("standard_material_vertex.glsl"),
      stdMtlFrg = WALK.getShader("standard_material_fragment.glsl"),
      uf = new WALK.InlineShader("vec3 addSpecularHook(in vec3 baseColor, in vec3 totalIntensity,\n                     inout float opacity) {\n  return addSpecular(baseColor, totalIntensity, opacity);\n}"),
      vf = new THREE.Color(),
      wf = new THREE.Vector3(0, 0, 0),
      xf = new THREE.Vector4(0, 0, 1, 1);
  WALK.ParallaxModes = { basic: "USE_BASIC_PARALLAX", steep: "USE_STEEP_PARALLAX", occlusion: "USE_OCLUSION_PARALLAX", relief: "USE_RELIEF_PARALLAX" };
  WALK.StandardMaterial = function () {
      WALK.BaseMaterial.call(this, stdMtlVtx, stdMtlFrg, this.fragmentShaderHooks());
      this.type = "standard";
      this.merged = !1;
      this._opacity = 1;
      Object.defineProperty(this, "opacity", {
          get: function () {
              return this._opacity;
          },
          set: function (a) {
              this._opacity = 0.99 < a ? 1 : a;
              this.configureTransparency();
              this.setUniforms();
              this._updated();
          },
      });
      this.baseColor = new THREE.Color(16777215);
      this._baseColorTexture = null;
      this._baseColorTextureCorrection = this.planarReflector = !1;
      this._baseColorTextureContrast = 0;
      this.baseColorTextureHslOffset = { h: 0, s: 0, l: 0 };
      this._baseColorCorrectionUniform = new THREE.Vector4();
      this.lightMapped = !1;
      this._lightMapSize = new THREE.Vector2();
      this._emissive = !1;
      this._roughness = this._emissionStrength = 1;
      this._metallic = 0;
      this._lastUsedLightProbeId = this.cubeCameraIndex = null;
      this._haveTextureLod = WALK.DETECTOR.gl.textureLod;
      this._mipLevel1 = this._mipLevel0 = null;
      this.disableLightProbeTmp = this.disableLightProbe = !1;
      this._envMapProject = !0;
      this._bumpScale = 0.001;
      this.parallaxCorrection = !1;
      this.parallaxMode = "basic";
      this.parallaxScale = -0.03;
      this.parallaxMinLayers = 10;
      this.parallaxMaxLayers = 15;
      this.headLight = !1;
      this._uvOffsetScale = null;
      this._repeatableTexturesRequired = !1;
      this.highlight = WALK.EDIT_MODE ? WALK.EDITOR_SELECTION_COLOR : null;
      this._specularOff = this._highlightMix = 0;
      this.doNotImport = { baseColor: !1, opacity: !1 };
      this._alphaInLowerHalf = !1;
      this._chromaKeyEnabled = void 0;
      this.chromaKeyColor = new THREE.Color().setRGB(0, 0.94, 0);
      this._chromaKeyDelta = new THREE.Vector3(0.1, 0.1, 0.1);
      this._chromaKeyDeltaCoeff = new THREE.Vector3();
      this.exposureAndGammaSupported = this.colorMapSupported = this.hdrOutputSupported = this.fogSupported = !0;
  };
  WALK.StandardMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.StandardMaterial.prototype.constructor = WALK.StandardMaterial;
  WALK.StandardMaterial.prototype.addTextureProperty = function (a) {
      var b = "_" + a;
      Object.defineProperty(this, a, {
          get: function () {
              return this[b] || null;
          },
          set: function (a) {
              var c = this;
              (this[b] = a)
                  ? a.addLoadedListener(function () {
                        c.setUniforms();
                        c._updated();
                        c = a = null;
                    })
                  : (c.setUniforms(), c._updated());
          },
      });
  };
  WALK.StandardMaterial.prototype.addTextureProperty("roughnessTexture");
  WALK.StandardMaterial.prototype.addTextureProperty("metallicTexture");
  WALK.StandardMaterial.prototype.addTextureProperty("bumpTexture");
  WALK.StandardMaterial.prototype.fragmentShaderHooks = function () {
      return uf;
  };
  WALK.StandardMaterial.prototype._useChromaKey = function () {
      return !(!this.isAnimated || !this.chromaKeyEnabled);
  };
  WALK.StandardMaterial.prototype._useAlphaInLowerHalf = function () {
      return !(!this.isAnimated || !this.alphaInLowerHalf);
  };
  WALK.StandardMaterial.prototype._useBaseColorTextureAsCutout = function () {
      var a = this._baseColorTexture;
      return 1 === this.opacity && ((a && a.isCutout) || this._useAlphaInLowerHalf() || this._useChromaKey());
  };
  WALK.StandardMaterial.prototype.configureTransparency = function () {
      var a = this._baseColorTexture;
      a = a && (a.hasAlpha || this._useAlphaInLowerHalf() || this._useChromaKey());
      this.transparent = 1 > this.opacity || a;
      a = this._useBaseColorTextureAsCutout();
      this.transparent ? ((this.blending = THREE.NormalBlending), (this.transparentRenderOrder = a ? 0 : 1)) : (this.blending = THREE.NoBlending);
      this.depthWrite = !this.transparent || a;
  };
  Object.defineProperty(WALK.StandardMaterial.prototype, "alphaInLowerHalf", {
      get: function () {
          return this._alphaInLowerHalf;
      },
      set: function (a) {
          this._alphaInLowerHalf = a;
          this.configureTransparency();
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "chromaKeyEnabled", {
      get: function () {
          return !!this._chromaKeyEnabled;
      },
      set: function (a) {
          this._chromaKeyEnabled = !!a;
          this.configureTransparency();
          this.setUniforms();
          this._updated();
      },
  });
  WALK.StandardMaterial.prototype.setChromaKeyColorRGB = function (a, b, c) {
      this.chromaKeyColor.setRGB(a, b, c);
      this.setUniforms();
      this._updated();
  };
  WALK.StandardMaterial.prototype.getChromaKeyDeltaComponent = function (a) {
      return this._chromaKeyDelta.getComponent(a);
  };
  WALK.StandardMaterial.prototype.setChromaKeyDeltaComponent = function (a, b) {
      this._chromaKeyDelta.setComponent(a, b);
      this.setUniforms();
      this._updated();
  };
  Object.defineProperty(WALK.StandardMaterial.prototype, "isAnimated", {
      get: function () {
          var a = this.baseColorTexture;
          return a && a.isAnimated;
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "isPlaying", {
      get: function () {
          var a = this.baseColorTexture;
          return a && a.isAnimated && a.isPlaying;
      },
  });
  WALK.StandardMaterial.prototype.rewind = function () {
      this.baseColorTexture.rewind();
  };
  WALK.StandardMaterial.prototype.play = function () {
      console.assert(this.isAnimated);
      var a = this.baseColorTexture.isPlaying;
      this.baseColorTexture.play();
      this.baseColorTexture.isPlaying !== a && this._updated();
  };
  WALK.StandardMaterial.prototype.pause = function () {
      console.assert(this.isAnimated);
      var a = this.baseColorTexture.isPlaying;
      this.baseColorTexture.pause();
      this.baseColorTexture.isPlaying !== a && this._updated();
  };
  WALK.StandardMaterial.prototype.sleepAnimation = function () {
      console.assert(this.isAnimated);
      this.baseColorTexture.sleepAnimation();
  };
  WALK.StandardMaterial.prototype.wakeAnimation = function () {
      console.assert(this.isAnimated);
      this.baseColorTexture.wakeAnimation();
  };
  Object.defineProperty(WALK.StandardMaterial.prototype, "doubleSided", {
      get: function () {
          return this.side === THREE.DoubleSide;
      },
      set: function (a) {
          this.side = a ? THREE.DoubleSide : THREE.FrontSide;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "envMapMirror", {
      get: function () {
          return 0 === this.roughness && !this.roughnessTexture;
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "specularOff", {
      get: function () {
          return this._specularOff;
      },
      set: function (a) {
          a !== this._specularOff && ((this._specularOff = a), this.setUniforms());
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "highlightMix", {
      get: function () {
          return this._highlightMix;
      },
      set: function (a) {
          a !== this._highlightMix && ((this._highlightMix = a), (this.uniforms.highlightMix.value = a));
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "baseColorTexture", {
      get: function () {
          return this._baseColorTexture;
      },
      set: function (a) {
          var b = this;
          (this._baseColorTexture = a)
              ? a.addLoadedListener(function () {
                    b.configureTransparency();
                    b._repeatableTexturesRequired && b.ensureTexturesRepeatable();
                    b.setUniforms();
                    b._updated();
                    b = a = null;
                })
              : (b.setUniforms(), b._updated());
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "baseColorTextureCorrection", {
      get: function () {
          return this._baseColorTextureCorrection;
      },
      set: function (a) {
          this._baseColorTextureCorrection = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "baseColorTextureContrast", {
      get: function () {
          return this._baseColorTextureContrast;
      },
      set: function (a) {
          this._baseColorTextureContrast = a;
          this.setUniforms();
          this._updated();
      },
  });
  WALK.StandardMaterial.prototype.setBaseColorTextureHslOffset = function (a, b, c) {
      this.baseColorTextureHslOffset.h = a;
      this.baseColorTextureHslOffset.s = b;
      this.baseColorTextureHslOffset.l = c;
      this.setUniforms();
      this._updated();
  };
  Object.defineProperty(WALK.StandardMaterial.prototype, "emissive", {
      get: function () {
          return this._emissive;
      },
      set: function (a) {
          this._emissive = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "emissionStrength", {
      get: function () {
          return this._emissionStrength;
      },
      set: function (a) {
          this._emissionStrength = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "roughness", {
      get: function () {
          return this._roughness;
      },
      set: function (a) {
          this._roughness = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "metallic", {
      get: function () {
          return this._metallic;
      },
      set: function (a) {
          this._metallic = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "envMapProject", {
      get: function () {
          return this._envMapProject;
      },
      set: function (a) {
          this._envMapProject = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "bumpScale", {
      get: function () {
          return this._bumpScale;
      },
      set: function (a) {
          this._bumpScale = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterial.prototype, "uvOffsetAndScaleEnabled", {
      get: function () {
          return null !== this._uvOffsetScale;
      },
      set: function (a) {
          a ? this.setUvOffsetAndScale(xf) : ((this._uvOffsetScale = null), this.setUniforms(), this._updated());
      },
  });
  WALK.StandardMaterial.prototype.setDoNotImport = function (a, b) {
      this.doNotImport[a] = b;
      this.setUniforms();
      this._updated();
  };
  WALK.StandardMaterial.prototype.isLightProbeDisabled = function () {
      return this.disableLightProbe || this.disableLightProbeTmp || this.specularOff || (1 === this.roughness && !this._roughnessTexture) || (this.transparent && this.doubleSided);
  };
  WALK.StandardMaterial.prototype._setLightProbeUniforms = function () {
      this.setUniform("envMap", "t", null);
      if (!this.condDefine(this._haveTextureLod, "HAVE_TEXTURE_LOD")) {
          var a = WALK.LIGHT_PROBE_MIPS_COUNT - 1;
          this._mipLevel0 = Math.floor(this.roughness * a);
          this._mipLevel1 = Math.min(this._mipLevel0 + 1, a);
          this.setUniform("envMap2", "t", null);
      }
      this.envMapMirror ? this.setUniform("envMipsCount", "f", 1) : this.setUniform("envMipsCount", "f", 0);
      this.condDefine(this.envMapProject, "USE_ENVMAP_PROJECT") && (this.setUniform("envMapPosW", "v3", wf), this.setUniform("envBoxMin", "v3", wf), this.setUniform("envBoxMax", "v3", wf));
      this._lastUsedLightProbeId = null;
  };
  WALK.StandardMaterial.prototype.getUvOffsetAndScale = function (a) {
      return a.copy(this._uvOffsetScale || xf);
  };
  WALK.StandardMaterial.prototype._uvOffsetAndScaleModified = function () {
      this.ensureTexturesRepeatable();
      this._updated();
  };
  WALK.StandardMaterial.prototype.setUvOffsetAndScale = function (a, b, c, d) {
      this._uvOffsetScale || ((this._uvOffsetScale = new THREE.Vector4()), this.setUniforms());
      a instanceof THREE.Vector4 ? this._uvOffsetScale.copy(a) : this._uvOffsetScale.set(a, b, c, d);
      this._uvOffsetAndScaleModified();
  };
  WALK.StandardMaterial.prototype.getUvOffsetAndScaleByProperty = function (a) {
      return this._uvOffsetScale[a];
  };
  WALK.StandardMaterial.prototype.setUvOffsetAndScaleByProperty = function (a, b) {
      switch (a) {
          case "x":
              this._uvOffsetScale.setX(b);
              break;
          case "y":
              this._uvOffsetScale.setY(b);
              break;
          case "z":
              this._uvOffsetScale.setZ(b);
              break;
          case "w":
              this._uvOffsetScale.setW(b);
      }
      this._uvOffsetAndScaleModified();
  };
  WALK.StandardMaterial.prototype.ensureTexturesRepeatable = function () {
      this._repeatableTexturesRequired = !0;
      var a = this.baseColorTexture;
      a &&
          a.parentTexture &&
          a.parentTexture.loaded &&
          (this._haveTextureLod && WALK.DETECTOR.gl.standardDerivatives
              ? (this.enableStandardDerivativesExtension(), this.enableTextureLodExtension(), this.addDefine("USE_BASE_COLOR_TEXTURE_ATLAS_REPEAT"))
              : this._baseColorTexture.extractedTexture || (a.extractTexture(), this.setUniforms()));
  };
  WALK.StandardMaterial.prototype.setUniforms = function () {
      this.setUniform("opacity", "f", this.opacity);
      var a = !this.isLightProbeDisabled(),
          b = !1,
          c = this.roughnessTexture;
      this.condDefine(c && c.loaded && a, "USE_ROUGHNESS_TEXTURE") ? (this.setUniform("roughnessTexture", "t", c), (b = !0)) : this.setUniform("roughness", "f", this.roughness);
      c = this.metallicTexture;
      this.condDefine(c && c.loaded && a, "USE_METALLIC_TEXTURE") ? (this.setUniform("metallicTexture", "t", c), (b = !0)) : this.setUniform("metallic", "f", this.metallic);
      this.setUniform("emissionStrength", "f", this.emissive ? this.emissionStrength : 0);
      this._baseColorTexture && this.baseColorTextureCorrection
          ? (vf.set(this.baseColor),
            vf.offsetHSL(this.baseColorTextureHslOffset.h, this.baseColorTextureHslOffset.s, this.baseColorTextureHslOffset.l),
            (c = Math.max(1 + this.baseColorTextureContrast, 0)),
            this._baseColorCorrectionUniform.set(c * (vf.r - this.baseColor.r - 0.5) + 0.5, c * (vf.g - this.baseColor.g - 0.5) + 0.5, c * (vf.b - this.baseColor.b - 0.5) + 0.5, c))
          : this._baseColorCorrectionUniform.set(0, 0, 0, 1);
      this.setUniform("baseColorCorrection", "v4", this._baseColorCorrectionUniform);
      c = null;
      if (this._baseColorTexture)
          if (this._baseColorTexture.parentTexture && !this._baseColorTexture.extractedTexture) {
              c = this._baseColorTexture.parentTexture;
              var d = this._baseColorTexture.uvOffsetScale;
          } else (c = this._baseColorTexture.extractedTexture || this._baseColorTexture), (d = xf);
      this.condDefine(c && c.loaded, "USE_BASE_COLOR_TEXTURE")
          ? (this.setUniform("baseColorTexture", "t", c),
            (b = !0),
            this.setUniform("baseColorAtlasUvMod", "v4", d),
            this._useBaseColorTextureAsCutout() ? this.setUniform("alphaDiscardThreshold", "f", 0.25) : this.setUniform("alphaDiscardThreshold", "f", 0))
          : this.setUniform("baseColor", "c", this.baseColor);
      this.condDefine(this._useAlphaInLowerHalf(), "USE_ALPHA_IN_LOWER_HALF");
      this.condDefine(this._useChromaKey(), "USE_CHROMA_KEY") &&
          (this.setUniform("chromaKeyColor", "c", this.chromaKeyColor),
          (d = this._chromaKeyDelta),
          (this._chromaKeyDeltaCoeff.x = 1 / (1.22 * d.x)),
          (this._chromaKeyDeltaCoeff.y = 1 / (1.22 * d.y)),
          (this._chromaKeyDeltaCoeff.z = 1 / (1.22 * d.z)),
          this.setUniform("chromaKeyDeltaCoeff", "v3", this._chromaKeyDeltaCoeff));
      c = this.bumpTexture;
      this.condDefine(c && c.loaded && a, "USE_BUMP_TEXTURE") &&
          (this.enableStandardDerivativesExtension(),
          this.setUniform("bumpTexture", "t", c),
          (b = !0),
          this.setUniform("bumpScale", "f", this.bumpScale),
          this.condDefine(this.parallaxCorrection, "USE_PARALLAX_CORRECTION") &&
              (this.addDefine(WALK.ParallaxModes[this.parallaxMode]),
              this.setUniform("parallaxScale", "f", this.parallaxScale),
              this.setUniform("parallaxMinLayers", "f", this.parallaxMinLayers),
              this.setUniform("parallaxMaxLayers", "f", this.parallaxMaxLayers)));
      b && this.setUniform("uvMod", "v4", this._uvOffsetScale || xf);
      this.condDefine(this.lightMapped, "USE_LIGHTMAP") && (this.setUniform("lightMap", "t", null), this.setUniform("lightMapSize", "v2", this._lightMapSize));
      this.condDefine(a, "USE_ENVMAP") && (this._haveTextureLod && this.enableTextureLodExtension(), this._setLightProbeUniforms());
      this.condDefine(this.highlight, "USE_HIGHLIGTH") && (this.setUniform("highlight", "c", this.highlight), this.setUniform("highlightMix", "f", this.highlightMix));
      this.condDefine((this.headLight || !this.lightMapped) && !this.specularOff, "USE_HEADLIGHT");
  };
  WALK.StandardMaterial.prototype.forceObjectUniformsRefresh = function () {
      this._lastUsedLightProbeId = null;
  };
  WALK.StandardMaterial.prototype.textureNeedsUv0 = function () {
      return !0;
  };
  WALK.StandardMaterial.prototype.hash = function () {
      return this.baseColorTexture ? "standard" + this.baseColorTexture.name : "standard#" + this.baseColor.r + ":" + this.baseColor.g + ":" + this.baseColor.b;
  };
  WALK.StandardMaterial.prototype.canMerge = function (a) {
      if (this.type !== a.type || this.opacity !== a.opacity) return !1;
      if (this._baseColorTexture || a._baseColorTexture) {
          if (
              this._baseColorTexture !== a._baseColorTexture ||
              this.baseColorTextureCorrection !== a.baseColorTextureCorrection ||
              this.baseColorTextureContrast !== a.baseColorTextureContrast ||
              this.baseColorTextureHslOffset.h !== a.baseColorTextureHslOffset.h ||
              this.baseColorTextureHslOffset.s !== a.baseColorTextureHslOffset.s ||
              this.baseColorTextureHslOffset.l !== a.baseColorTextureHslOffset.l ||
              this._useAlphaInLowerHalf() !== a._useAlphaInLowerHalf() ||
              (this._useChromaKey() ? !(a._useChromaKey() && this.chromaKeyColor.equals(a.chromaKeyColor) && this._chromaKeyDelta.equals(a._chromaKeyDelta)) : a._useChromaKey())
          )
              return !1;
      } else if (!this.baseColor.equals(a.baseColor)) return !1;
      if (this.emissive || a.emissive) if (this.emissive !== a.emissive || this.emissionStrength !== a.emissionStrength) return !1;
      if (this.roughnessTexture || a.roughnessTexture) {
          if (this.roughnessTexture !== a.roughnessTexture) return !1;
      } else if (this.roughness !== a.roughness) return !1;
      if (this.metallicTexture || a.metallicTexture) {
          if (this.metallicTexture !== a.metallicTexture) return !1;
      } else if (this.metallic !== a.metallic) return !1;
      return ((this.bumpTexture || a.bumpTexture) && (this.bumpTexture !== a.bumpTexture || this.bumpScale !== a.bumpScale)) ||
          this.envMapProject !== a.envMapProject ||
          this.doubleSided !== a.doubleSided ||
          this.parallaxCorrection ||
          a.parallaxCorrection
          ? !1
          : !0;
  };
  WALK.StandardMaterial.prototype.refreshPerObjectUniforms = function (a, b) {
      var c = !1;
      if (!this.isLightProbeDisabled()) {
          var d = a.lightProbe;
          if (this._lastUsedLightProbeId !== d.id) {
              c = !0;
              this._lastUsedLightProbeId = d.id;
              var e = this.envMapMirror ? d.getMirrorTexture() : this._haveTextureLod ? d.getFilteredTexture() : d.getFilteredTextureNoLod(this._mipLevel0);
              b.envMap.value = e;
              this._haveTextureLod || (b.envMap2.value = d.getFilteredTextureNoLod(this._mipLevel1));
              this.envMapMirror || (b.envMipsCount.value = WALK.LIGHT_PROBE_MIPS_COUNT);
              this.envMapProject && (d.isBoundingBoxEnabled() ? ((b.envMapPosW.value = d.position), (b.envBoxMin.value = d.boxMin), (b.envBoxMax.value = d.boxMax)) : ((b.envBoxMin.value = wf), (b.envBoxMax.value = wf)));
          }
      }
      a = a.lightMap;
      this.lightMapped && b.lightMap.value !== a && ((c = !0), (b.lightMap.value = a), (b.lightMapSize.value.x = a.width), (b.lightMapSize.value.y = a.height));
      return c;
  };
  WALK.StandardMaterial.prototype.setBaseColorRGB = function (a, b, c) {
      this.baseColor.setRGB(a, b, c);
      this.setUniforms();
      this._updated();
  };
  WALK.StandardMaterial.prototype.setTexture = function (a, b) {
      if (b) {
          var c = this.baseColorTexture;
          c && ((b.wrapS = c.wrapS), (b.wrapT = c.wrapT), (b.anisotropy = c.anisotropy));
      }
      this[a] = b || null;
      "baseColorTexture" === a
          ? ((this._baseColorTextureCorrection = !1), (this._baseColorTextureContrast = 0), (this.baseColorTextureHslOffset.h = 0), (this.baseColorTextureHslOffset.s = 0), (this.baseColorTextureHslOffset.l = 0))
          : "bumpTexture" === a && (this._bumpScale = 0.001);
  };
  WALK.StandardMaterial.prototype.serialize = function () {
      function a(a) {
          var c = b[a];
          d[a] = c ? c.serialize() : null;
      }
      var b = this,
          c = null;
      console.assert(!this.merged);
      this.baseColorTextureCorrection && (c = { contrast: this.baseColorTextureContrast, hslOffset: [this.baseColorTextureHslOffset.h, this.baseColorTextureHslOffset.s, this.baseColorTextureHslOffset.l] });
      var d = {
          name: this.name,
          type: this.type,
          baseColor: this.baseColor.roundChannels().toArray(),
          baseColorTextureCorrection: c,
          alphaInLowerHalf: this.alphaInLowerHalf,
          opacity: this.opacity,
          emissive: this.emissive,
          emissionStrength: this.emissionStrength,
          roughness: this.roughness,
          metallic: this.metallic,
          envMapProject: this.envMapProject,
          bumpScale: this.bumpScale,
          doubleSided: this.doubleSided,
          doNotImport: this.doNotImport,
      };
      void 0 !== this._chromaKeyEnabled && ((d.chromaKeyEnabled = this.chromaKeyEnabled), (d.chromaKeyColor = this.chromaKeyColor.roundChannels().toArray()), (d.chromaKeyDelta = this._chromaKeyDelta.toArray()));
      d.uvOffsetScale = this.uvOffsetAndScaleEnabled ? this._uvOffsetScale.toArray() : null;
      a("baseColorTexture");
      a("roughnessTexture");
      a("metallicTexture");
      a("bumpTexture");
      return d;
  };
  WALK.StandardMaterialWater = function () {
      WALK.StandardMaterial.call(this);
      this.type = "water";
      this._isPlaying = !0;
      this._isSleeping = !1;
      this.setUniform("time", "f", 0);
      this._roughness = 0;
      this.baseColor = new THREE.Color(0);
      this._wavesScale = this._wavesSpeed = 1;
      this._refractionFactor = 0;
      this.opacity = 0.2;
      this.doNotImport = { baseColor: !0, baseColorTexture: !0, opacity: !0 };
  };
  WALK.StandardMaterialWater.prototype = Object.create(WALK.StandardMaterial.prototype);
  WALK.StandardMaterialWater.prototype.constructor = WALK.StandardMaterialWater;
  WALK.StandardMaterialWater.prototype.addTextureProperty("normalTexture");
  WALK.StandardMaterialWater.prototype.textureNeedsUv0 = function () {
      return !1;
  };
  WALK.StandardMaterialWater.prototype.hash = function () {
      return "water";
  };
  WALK.StandardMaterialWater.prototype.canMerge = function (a) {
      return (
          this.type === a.type &&
          this.opacity === a.opacity &&
          this.baseColor.equals(a.baseColor) &&
          this.normalTexture === a.normalTexture &&
          this.wavesSpeed === a.wavesSpeed &&
          this.wavesScale === a.wavesScale &&
          this.refractionFactor === a.refractionFactor
      );
  };
  WALK.StandardMaterialWater.prototype.setUniforms = function () {
      WALK.StandardMaterial.prototype.setUniforms.call(this);
      var a = this.normalTexture;
      this.condDefine(a && a.loaded && !this.isLightProbeDisabled(), "USE_NORMAL_TEXTURE") &&
          (this.setUniform("normalTexture", "t", a), this.setUniform("wavesScale", "f", this.wavesScale), 1 !== this.opacity ? this.setUniform("refractionFactor", "f", this.refractionFactor) : this.setUniform("refractionFactor", "f", 0));
  };
  WALK.StandardMaterialWater.prototype.fragmentShaderHooks = function () {
      return WALK.getShader("water.glsl");
  };
  Object.defineProperty(WALK.StandardMaterialWater.prototype, "refractionFactor", {
      get: function () {
          return this._refractionFactor;
      },
      set: function (a) {
          this._refractionFactor = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterialWater.prototype, "wavesSpeed", {
      get: function () {
          return this._wavesSpeed;
      },
      set: function (a) {
          this._wavesSpeed = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterialWater.prototype, "wavesScale", {
      get: function () {
          return this._wavesScale;
      },
      set: function (a) {
          this._wavesScale = a;
          this.setUniforms();
          this._updated();
      },
  });
  Object.defineProperty(WALK.StandardMaterialWater.prototype, "hideFromLightProbes", {
      get: function () {
          return 1 !== this.opacity && 0 !== this.refractionFactor;
      },
  });
  Object.defineProperty(WALK.StandardMaterialWater.prototype, "isAnimated", {
      get: function () {
          return !0;
      },
  });
  Object.defineProperty(WALK.StandardMaterialWater.prototype, "isPlaying", {
      get: function () {
          return !this._isSleeping && this._isPlaying && 0 < this.wavesSpeed;
      },
  });
  WALK.StandardMaterialWater.prototype.play = function () {
      this._isPlaying = !0;
  };
  WALK.StandardMaterialWater.prototype.pause = function () {
      this._isPlaying = !1;
  };
  WALK.StandardMaterialWater.prototype.sleepAnimation = function () {
      this._isSleeping = !0;
  };
  WALK.StandardMaterialWater.prototype.wakeAnimation = function () {
      this._isSleeping = !1;
  };
  WALK.StandardMaterialWater.prototype.update = function (a) {
      this.uniforms.time.value += a * this.wavesSpeed * 0.1;
  };
  WALK.StandardMaterialWater.prototype.serialize = function () {
      return {
          name: this.name,
          type: this.type,
          baseColor: this.baseColor.roundChannels().toArray(),
          baseColorTexture: null,
          opacity: this.opacity,
          normalTexture: this.normalTexture ? this.normalTexture.serialize() : null,
          wavesSpeed: this.wavesSpeed,
          wavesScale: this.wavesScale,
          refractionFactor: this.refractionFactor,
          doNotImport: this.doNotImport,
      };
  };
  var yf = WALK.getShader("standard_material_vertex.glsl"),
      zf = WALK.getShader("luma_fragment.glsl"),
      Af = new THREE.Color(16777215);
  WALK.LumaMaterial = function (a) {
      WALK.BaseMaterial.call(this, yf, zf);
      this.computeIncidentLuma = a;
      this.setUniform("lightMap", "t", null);
      this.setUniform("lightMapSize", "v2", new THREE.Vector2());
      this.color = new THREE.Color(Af);
      this.setUniform("color", "c", this.color);
      this.addDefine("USE_LIGHTMAP");
  };
  WALK.LumaMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.LumaMaterial.prototype.constructor = WALK.LumaMaterial;
  WALK.LumaMaterial.prototype.refreshPerObjectUniforms = function (a, b) {
      var c = a.lightMap,
          d = !1;
      b.lightMap.value !== c && ((b.lightMap.value = c), (b.lightMapSize.value.x = c.width), (b.lightMapSize.value.y = c.height), (d = !0));
      a = this.computeIncidentLuma ? Af : a.material.baseColor;
      a.equals(this.color) || (this.color.copy(a), (d = !0));
      return d;
  };
  WALK.DebugMaterial = function () {
      WALK.StandardMaterial.call(this);
      this.noSharedBuffers = new THREE.Color(16777215);
      this.sharedBuffersMaster = new THREE.Color(255);
      this.sharedBuffersCopy = new THREE.Color(65280);
      this.headLight = !0;
      this.setUniforms();
      this.defaultAttributeValues = Object.assign({}, this.defaultAttributeValues);
      this.defaultAttributeValues.sphericalNormal = [0, 0];
  };
  WALK.DebugMaterial.prototype = Object.create(WALK.StandardMaterial.prototype);
  WALK.DebugMaterial.prototype.refreshPerObjectUniforms = function (a, b) {
      b.baseColor.value = 0 === a.sharedBuffersDebug ? this.noSharedBuffers : 1 === a.sharedBuffersDebug ? this.sharedBuffersMaster : this.sharedBuffersCopy;
      return !0;
  };
  var Bf = WALK.getShader("equirect_sky_vertex.glsl"),
      Cf = WALK.getShader("equirect_sky_fragment.glsl");
  WALK.EquirectSkyMaterial = function () {
      WALK.BaseMaterial.call(this, Bf, Cf);
      this.depthWrite = !1;
      this.side = THREE.FrontSide;
      this.uniforms = { map: { type: "t", value: null } };
      this.exposureAndGammaSupported = this.colorMapSupported = this.hdrOutputSupported = this.fogSupported = !0;
  };
  WALK.EquirectSkyMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.EquirectSkyMaterial.prototype.constructor = WALK.EquirectSkyMaterial;
  Object.defineProperty(WALK.EquirectSkyMaterial.prototype, "map", {
      get: function () {
          return this.uniforms.map.value;
      },
      set: function (a) {
          this.uniforms.map.value = a;
          this.condDefine(this.map.isRgbm, "USE_RGBM_MAP");
      },
  });
  WALK.ProceduralSkyMaterial = function () {
      WALK.BaseMaterial.call(this, WALK.getShader("procedural_sky_vertex.glsl"), WALK.getShader("procedural_sky_fragment.glsl"));
      this.depthWrite = !1;
      this.side = THREE.BackSide;
      this.uniforms = {
          topColor: { type: "c", value: new THREE.Color(15135487) },
          bottomColor: { type: "c", value: new THREE.Color(16777215) },
          sinBottomAngle: { type: "f", value: Math.sin(THREE.Math.degToRad(-30)) },
          exponent: { type: "f", value: 0.9 },
      };
      this.exposureAndGammaSupported = this.colorMapSupported = this.hdrOutputSupported = this.fogSupported = !0;
  };
  WALK.ProceduralSkyMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.ProceduralSkyMaterial.prototype.constructor = WALK.ProceduralSkyMaterial;
  var Df = WALK.getShader("object_distance_vertex.glsl"),
      Ef = WALK.getShader("object_id_fragment.glsl"),
      Ff = WALK.getShader("object_id_distance_fragment.glsl");
  WALK.ObjectDistanceMaterial = function (a) {
      WALK.BaseMaterial.call(this, Df, a ? Ef : Ff);
      this.doNotOverrideSide = !0;
      this.uniforms = { objectId: { type: "i", value: null } };
  };
  WALK.ObjectDistanceMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.ObjectDistanceMaterial.prototype.constructor = WALK.ObjectDistanceMaterial;
  WALK.ObjectDistanceMaterial.prototype.refreshPerObjectUniforms = function (a, b) {
      b.objectId.value = a.visibilityId;
      return !0;
  };
  var Gf = WALK.getShader("wireframe_vertex.glsl"),
      Hf = WALK.getShader("wireframe_fragment.glsl");
  WALK.WireframeMaterial = function (a) {
      WALK.BaseMaterial.call(this, Gf, Hf);
      this.lineColor = a;
      this.setUniform("lineColor", "c", a);
      this.setUniform("lineMaxAlpha", "f", 0.65);
      this.setUniform("highlight", "c", WALK.EDITOR_SELECTION_COLOR);
      this.setUniform("highlightMix", "f", 0);
      this.customLightmapResolutionLineColor = new THREE.Color(170);
      this.autoLightmapResolutionLineColor = new THREE.Color(43690);
      this.meshSelectedLineColor = new THREE.Color(47872);
      this.meshSelectedSecondaryLineColor = new THREE.Color(13404160);
      this.transparent = !0;
      this.blending = THREE.NormalBlending;
      this.depthWrite = this.depthTest = !1;
      this.attributes = this.attributes.concat(["order"]);
      this.enableStandardDerivativesExtension();
  };
  WALK.WireframeMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.WireframeMaterial.prototype.constructor = WALK.WireframeMaterial;
  WALK.WireframeMaterial.prototype.propertyFromUniform("lineMaxAlpha");
  WALK.WireframeMaterial.prototype.propertyFromUniform("highlight");
  WALK.WireframeMaterial.prototype.propertyFromUniform("highlightMix");
  WALK.WireframeMaterial.prototype.refreshPerObjectUniforms = function (a, b) {
      var c = !1;
      null !== a.highlightMix && void 0 !== a.highlightMix && a.highlightMix !== b.highlightMix.value && ((b.highlightMix.value = a.highlightMix), (c = !0));
      return null !== a.selected &&
          void 0 !== a.selected &&
          ((a =
              !0 === a.selected
                  ? this.meshSelectedLineColor
                  : !0 === a.selectedSecondary
                  ? this.meshSelectedSecondaryLineColor
                  : null !== a.node.lightmapResolution
                  ? this.customLightmapResolutionLineColor
                  : 0 <= a.autoLightmapResolution
                  ? this.autoLightmapResolutionLineColor
                  : this.lineColor),
          b.lineColor.value !== a)
          ? ((b.lineColor.value = a), !0)
          : c;
  };
  var If = new THREE.Vector3();
  function Jf(a, b, c, d) {
      for (var e = [], f = 0; 6 > f; f += 1) {
          var g = d ? new THREE.OrthographicCamera(-1, 1, 1, -1, a, b) : new THREE.PerspectiveCamera(90, 1, a, b);
          c.add(g);
          e.push(g);
      }
      e[0].up.set(0, -1, 0);
      If.set(1, 0, 0);
      e[0].lookAt(If);
      e[1].up.set(0, -1, 0);
      If.set(-1, 0, 0);
      e[1].lookAt(If);
      e[2].up.set(0, 0, 1);
      If.set(0, 1, 0);
      e[2].lookAt(If);
      e[3].up.set(0, 0, -1);
      If.set(0, -1, 0);
      e[3].lookAt(If);
      e[4].up.set(0, -1, 0);
      If.set(0, 0, 1);
      e[4].lookAt(If);
      e[5].up.set(0, -1, 0);
      If.set(0, 0, -1);
      e[5].lookAt(If);
      return e;
  }
  function Kf(a, b) {
      THREE.Object3D.call(this);
      this.sideCameras = Jf(a, b, this, !1);
  }
  Kf.prototype = Object.create(THREE.Object3D.prototype);
  Kf.prototype.constructor = Kf;
  function Lf(a, b) {
      THREE.Object3D.call(this);
      this.sideCameras = Jf(a, b, this, !0);
  }
  Lf.prototype = Object.create(THREE.Object3D.prototype);
  Lf.prototype.constructor = Lf;
  function Mf(a, b, c) {
      var d = new WALK.ObjectDistanceMaterial(!0),
          e = new Kf(WALK.CAMERA_WALK_NEAR, c),
          f = WALK.OBJECT_VISIBILITY_TARGET_SIZE,
          g = a.createRenderTarget(f, f, { format: GLC.RGBA, magFilter: GLC.NEAREST, minFilter: GLC.NEAREST, depthBuffer: !0, stencilBuffer: !1, generateMipmaps: !1 }),
          h = new Uint8Array(4 * f * f),
          l = new uc(a),
          m = new vc(a),
          n = new THREE.Color(16777215);
      this.findVisibleObjects = function (c) {
          var p = new Set(),
              q = [];
          e.position.copy(c);
          e.updateMatrixWorld();
          for (c = 0; c < b.length; c += 1) {
              var u = b[c];
              console.assert(!u.visibilityId);
              u.visibilityId = c;
              q.push(u);
          }
          l.set(!0, !0, !1);
          m.set(n);
          for (c = 0; 6 > c; c += 1) {
              a.renderMeshes(q, d, e.sideCameras[c], g);
              a.readPixels(f, f, h);
              u = h;
              for (var v = u.length, w = 0; w < v; w += 4) {
                  var y = Math.round(65536 * u[w] + 256 * u[w + 1] + u[w + 2]);
                  16777215 !== y && p.add(y);
              }
          }
          m.restore();
          l.restore();
          q = [];
          p = _.makeIterator(p);
          for (c = p.next(); !c.done; c = p.next()) q.push(b[c.value]);
          for (p = 0; p < b.length; p += 1) b[p].visibilityId = null;
          return q;
      };
      this.dispose = function () {
          d.dispose();
          g.dispose();
          h = g = null;
      };
  }
  var Nf = WALK.getShader("aabb_query_vertex.glsl"),
      Of = WALK.getShader("aabb_query_fragment.glsl");
  WALK.AabbQueryMaterial = function () {
      WALK.BaseMaterial.call(this, Nf, Of);
      this.side = THREE.DoubleSide;
      this.uniforms = { axis: { type: "i", value: 0 } };
  };
  WALK.AabbQueryMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.AabbQueryMaterial.prototype.constructor = WALK.AabbQueryMaterial;
  Object.defineProperty(WALK.AabbQueryMaterial.prototype, "axis", {
      get: function () {
          return this.uniforms.axis.value;
      },
      set: function (a) {
          console.assert(0 === a || 1 === a || 2 === a);
          this.uniforms.axis.value = a;
      },
  });
  var Pf = WALK.getShader("gaze_pointer_vertex.glsl"),
      Qf = WALK.getShader("gaze_pointer_fragment.glsl");
  WALK.GazePointerMaterial = function () {
      WALK.BaseMaterial.call(this, Pf, Qf);
      this.blending = THREE.NormalBlending;
      this.transparent = !0;
      this.transparentRenderOrder = 2;
      this.setUniform("circleSpan", "f", 0);
  };
  WALK.GazePointerMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.GazePointerMaterial.prototype.constructor = WALK.GazePointerMaterial;
  Object.defineProperty(WALK.GazePointerMaterial.prototype, "circleSpan", {
      set: function (a) {
          console.assert(1 >= a);
          this.uniforms.circleSpan.value = 2 * Math.PI * a - Math.PI;
      },
  });
  var Rf = WALK.getShader("editor_light_vertex.glsl"),
      Sf = WALK.getShader("editor_light_fragment.glsl");
  WALK.LightMaterial = function (a) {
      WALK.BaseMaterial.call(this, Rf, Sf);
      this.setUniform("color", "c", a.color);
      this.setUniform("highlight", "c", WALK.EDITOR_SELECTION_COLOR);
      this.setUniform("highlightMix", "f", 0);
  };
  WALK.LightMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.LightMaterial.prototype.propertyFromUniform("highlightMix");
  WALK.MirrorMaterial = function (a, b) {
      WALK.BaseMaterial.call(this, WALK.getShader("mirror_vertex.glsl"), WALK.getShader("mirror_fragment.glsl"));
      this.hideFromLightProbes = !0;
      this.uniforms = { mirrorColor: { type: "c", value: a }, mirrorSampler: { type: "t", value: null }, textureMatrix: { type: "m4", value: b } };
      this.hdrOutputSupported = !0;
  };
  WALK.MirrorMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.MirrorMaterial.prototype.constructor = WALK.MirrorMaterial;
  Object.defineProperty(WALK.MirrorMaterial.prototype, "mirrorSampler", {
      get: function () {
          return this.uniforms.mirrorSampler.value;
      },
      set: function (a) {
          this.uniforms.mirrorSampler.value = a;
      },
  });
  var Tf = WALK.getShader("cap_vertex.glsl"),
      Uf = WALK.getShader("cap_fragment.glsl");
  WALK.CapMaterial = function (a) {
      WALK.BaseMaterial.call(this, Tf, Uf);
      this.side = THREE.DoubleSide;
      this.uniforms = { color: { type: "c", value: a } };
  };
  WALK.CapMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.CapMaterial.prototype.constructor = WALK.CapMaterial;
  var Vf = WALK.getShader("outline_vertex.glsl"),
      Wf = WALK.getShader("outline_fragment.glsl");
  WALK.OutlineMaterial = function (a, b) {
      WALK.BaseMaterial.call(this, Vf, Wf);
      this.side = THREE.DoubleSide;
      this.uniforms = { color: { type: "c", value: a }, thickness: { type: "f", value: b } };
  };
  WALK.OutlineMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.OutlineMaterial.prototype.constructor = WALK.OutlineMaterial;
  WALK.createBoundingBoxMaterial = function () {
      var a = new WALK.WireframeMaterial(WALK.EDITOR_SELECTION_COLOR);
      a.depthTest = !0;
      a.depthWrite = !1;
      a.side = THREE.DoubleSide;
      a.hideFromLightProbes = !0;
      return a;
  };
  var Xf = WALK.getShader("anchor_vertex.glsl");
  WALK.AnchorMaterial = function () {
      WALK.StandardMaterial.call(this);
      this._vertexShaderBody = Xf;
      this._metallic = 0.1;
      this._roughness = 0.5;
      this._bumpScale = 0.01;
      this.hideFromLightProbes = !0;
  };
  WALK.AnchorMaterial.prototype = Object.create(WALK.StandardMaterial.prototype);
  var Yf = WALK.getShader("sprite_vertex.glsl");
  WALK.SpriteMaterial = function () {
      WALK.StandardMaterial.call(this);
      this._vertexShaderBody = Yf;
      this.hideFromLightProbes = !0;
      this.setUniform("offset", "v3", new THREE.Vector3(0, 0, 0));
  };
  WALK.SpriteMaterial.prototype = Object.create(WALK.StandardMaterial.prototype);
  Object.defineProperty(WALK.SpriteMaterial.prototype, "offset", {
      set: function (a) {
          this.uniforms.offset.value = a;
      },
  });
  var Zf = WALK.getShader("rotate_gizmo_material_vertex.glsl"),
      $f = WALK.getShader("rotate_gizmo_material_fragment.glsl");
  WALK.RotateGizmoMaterial = function (a, b) {
      WALK.BaseMaterial.call(this, Zf, $f);
      this.blending = THREE.NormalBlending;
      this.depthWrite = this.depthTest = !1;
      this.transparent = !0;
      this.transparentRenderOrder = 1e3;
      this.hideFromLightProbes = !0;
      this.uniforms = { opacity: { type: "f", value: 1 }, color: { type: "c", value: a }, gizmoPosition: { type: "v3", value: new THREE.Vector3(0, 0, 0) }, sphereRadius: { type: "f", value: 1 } };
      Object.defineProperty(this, "color", {
          get: function () {
              return this.uniforms.color.value;
          },
      });
      Object.defineProperty(this, "opacity", {
          get: function () {
              return this.uniforms.opacity.value;
          },
          set: function (a) {
              this.uniforms.opacity.value = a;
          },
      });
      Object.defineProperty(this, "gizmoPosition", {
          get: function () {
              return this.uniforms.gizmoPosition.value;
          },
      });
      Object.defineProperty(this, "sphereRadius", {
          get: function () {
              return this.uniforms.sphereRadius.value;
          },
          set: function (a) {
              this.uniforms.sphereRadius.value = a;
          },
      });
      this.opacity = b;
      this.setUniforms = function () {};
  };
  WALK.RotateGizmoMaterial.prototype = Object.create(WALK.BaseMaterial.prototype);
  WALK.RotateGizmoMaterial.prototype.constructor = WALK.RotatoGizmoMaterial;
  WALK.Camera = function () {
      var a = this;
      THREE.PerspectiveCamera.call(this, WALK.CAMERA_DEFAULT_FOV, 1, WALK.CAMERA_WALK_NEAR, WALK.CAMERA_MIN_FAR);
      this._defaultFov = this.fov;
      this._exposure = this._defaultExposure = 0;
      this._gamma = this._defaultGamma = 1;
      this._autoExposure = !1;
      this._autoExposureDarkness = 0.3;
      this._moveMaxSpeed = WALK.CAMERA_DEFAULT_MOVE_MAX_SPEED;
      this._autoClimb = this._autoPath = !1;
      this._colorMap = this._fixedHeight = null;
      this._exposureUpdatedEvent = { type: "exposureUpdated", target: null };
      this._gammaUpdatedEvent = { type: "gammaUpdated", target: null };
      this._colorMapUpdated = { type: "colorMapUpdated", target: null };
      var b = { type: "updated", target: this };
      this._updated = function () {
          return a.dispatchEvent(b);
      };
  };
  WALK.Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
  WALK.Camera.prototype.constructor = WALK.Camera;
  Object.defineProperty(WALK.Camera.prototype, "defaultFov", {
      get: function () {
          return this._defaultFov;
      },
      set: function (a) {
          this.fov = this._defaultFov = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "colorMap", {
      get: function () {
          return this._colorMap;
      },
      set: function (a) {
          var b = this;
          this._colorMap && this._colorMap.dispose();
          (this._colorMap = a) &&
              !a.loaded &&
              a.addLoadedListener(function () {
                  return b.dispatchEvent(b._colorMapUpdated);
              });
          this.dispatchEvent(this._colorMapUpdated);
      },
  });
  WALK.Camera.prototype.colorMapReady = function () {
      return this._colorMap && this._colorMap.loaded;
  };
  Object.defineProperty(WALK.Camera.prototype, "defaultExposure", {
      get: function () {
          return this._defaultExposure;
      },
      set: function (a) {
          this._defaultExposure = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "exposure", {
      get: function () {
          return this._exposure;
      },
      set: function (a) {
          a !== this._exposure && ((this._exposure = a), this.dispatchEvent(this._exposureUpdatedEvent));
      },
  });
  WALK.Camera.prototype.setExposureController = function (a) {
      this.exposureController = a;
  };
  WALK.Camera.prototype.setExposure = function (a) {
      this.exposureController ? this.exposureController.setTargetExposure(a) : (this.exposure = a);
  };
  Object.defineProperty(WALK.Camera.prototype, "defaultGamma", {
      get: function () {
          return this._defaultGamma;
      },
      set: function (a) {
          this._defaultGamma = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "gamma", {
      get: function () {
          return this._gamma;
      },
      set: function (a) {
          a !== this._gamma && ((this._gamma = a), this.dispatchEvent(this._gammaUpdatedEvent));
      },
  });
  WALK.Camera.prototype.setGamma = function (a) {
      this.gamma = a;
  };
  Object.defineProperty(WALK.Camera.prototype, "autoExposure", {
      get: function () {
          return this._autoExposure;
      },
      set: function (a) {
          a !== this._autoExposure && ((this._autoExposure = a), (this._exposure = this._defaultExposure), this._updated());
      },
  });
  WALK.Camera.prototype.setFar = function (a) {
      this.far = a;
      this.updateProjectionMatrix();
      this._updated();
  };
  Object.defineProperty(WALK.Camera.prototype, "moveMaxSpeed", {
      get: function () {
          return this._moveMaxSpeed;
      },
      set: function (a) {
          this._moveMaxSpeed = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "autoPath", {
      get: function () {
          return this._autoPath;
      },
      set: function (a) {
          this._autoPath = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "autoClimb", {
      get: function () {
          return this._autoClimb;
      },
      set: function (a) {
          this._autoClimb = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "autoExposureDarkness", {
      get: function () {
          return this._autoExposureDarkness;
      },
      set: function (a) {
          this._autoExposureDarkness = a;
          this._updated();
      },
  });
  Object.defineProperty(WALK.Camera.prototype, "fixedHeight", {
      get: function () {
          return this._fixedHeight || WALK.CAMERA_FIXED_HEIGHT;
      },
      set: function (a) {
          this._fixedHeight = a;
          this._updated();
      },
  });
  WALK.Camera.prototype.serialize = function () {
      return {
          fov: this.defaultFov,
          exposure: this.defaultExposure,
          gamma: this.defaultGamma,
          lutTexture: this.colorMap ? this.colorMap.serialize() : null,
          autoPath: this.autoPath,
          autoClimb: this.autoClimb,
          moveMaxSpeed: this.moveMaxSpeed,
          fixedHeight: this._fixedHeight,
      };
  };
  THREE.EventDispatcher.prototype.apply(WALK.Camera.prototype);
  WALK.LightInstance = function (a, b, c) {
      this.light = a;
      this.position = b;
      this.rotation = c;
      this._directionW = new THREE.Vector3();
  };
  WALK.LightInstance.prototype = {
      constructor: WALK.LightInstance,
      directionW: function () {
          this._directionW.set(0, 1, 0);
          this._directionW.applyEuler(this.rotation);
          return this._directionW;
      },
      get index() {
          var a = this.light.instances.indexOf(this);
          console.assert(-1 !== a, "Light instance not found");
          return a;
      },
      setPosition: function (a, b, c) {
          this.position.set(a, b, c);
          this.light._updated();
      },
      setRotation: function (a, b, c) {
          this.rotation.yaw = WALK.normalizeRotation(a);
          this.rotation.pitch = WALK.normalizeRotation(b);
          this.rotation.roll = WALK.normalizeRotation(c);
          this.light._updated();
      },
      setRotationDeg: function (a, b, c) {
          a = THREE.Math.degToRad(a);
          b = THREE.Math.degToRad(b);
          c = void 0 === c ? this.rotation.roll : THREE.Math.degToRad(c);
          this.setRotation(a, b, c);
      },
      serialize: function () {
          return { position: this.position.toArray(), rotation: this.rotation.toDegTriple() };
      },
  };
  var ag = "angle color height photometricProfile strength size type width".split(" ");
  WALK.Light = function (a) {
      this._name = a.name;
      this._type = a.type || "spot";
      if (void 0 !== a.strength) var b = a.strength;
      else
          a: {
              switch (this._type) {
                  case "point":
                  case "spot":
                  case "area":
                      b = 25;
                      break a;
                  case "sun":
                      b = 8;
                      break a;
                  default:
                      console.assert(!1);
              }
              b = void 0;
          }
      this._strength = b;
      if (void 0 !== a.color) b = new THREE.Color().fromArray(a.color);
      else
          a: {
              switch (this._type) {
                  case "point":
                  case "spot":
                  case "area":
                      b = new THREE.Color(1, 0.88, 0.799);
                      break a;
                  case "sun":
                      b = new THREE.Color(1, 0.8, 0.638);
                      break a;
                  default:
                      console.assert(!1);
              }
              b = void 0;
          }
      this._color = b;
      if (void 0 !== a.size) b = a.size;
      else
          a: {
              switch (this._type) {
                  case "point":
                  case "spot":
                  case "area":
                      b = 0.1;
                      break a;
                  case "sun":
                      b = 0.02;
                      break a;
                  default:
                      console.assert(!1);
              }
              b = void 0;
          }
      this._size = b;
      this._width = void 0 !== a.width ? a.width : 0.2;
      this._height = void 0 !== a.height ? a.height : 0.2;
      this._angle = void 0 !== a.angle ? a.angle : 140;
      this._photometricProfile = void 0 !== a.photometricProfile ? a.photometricProfile : null;
      !0 === a.doNotImport ? (this.doNotImport = !0) : ((this.doNotImport = {}), a.doNotImport && WALK.copyProperties(a.doNotImport, ag, this.doNotImport));
      this.instances = [];
  };
  WALK.Light.prototype = {
      constructor: WALK.Light,
      forEachLightInstance: function (a) {
          for (var b = 0; b < this.instances.length; b += 1) a(this.instances[b]);
      },
      get name() {
          return this._name;
      },
      set name(a) {
          this._name = a;
          this._updated();
      },
      get type() {
          return this._type;
      },
      set type(a) {
          this._type = a;
          this._updated();
      },
      get size() {
          return this._size;
      },
      set size(a) {
          this._size = a;
          this._updated();
      },
      get width() {
          return this._width;
      },
      set width(a) {
          this._width = a;
          this._updated();
      },
      get height() {
          return this._height;
      },
      set height(a) {
          this._height = a;
          this._updated();
      },
      get angle() {
          return this._angle;
      },
      set angle(a) {
          this._angle = a;
          this._updated();
      },
      get color() {
          return this._color;
      },
      setColorRGB: function (a, b, c) {
          this._color.setRGB(a, b, c);
          this._updated();
      },
      get strength() {
          return this._strength;
      },
      set strength(a) {
          this._strength = a;
          this._updated();
      },
      get photometricProfile() {
          return this._photometricProfile;
      },
      set photometricProfile(a) {
          this._photometricProfile = a;
          this._updated();
      },
      setDoNotImport: function (a, b) {
          this.doNotImport[a] = b;
          this._updated();
      },
      addInstance: function (a, b) {
          b = void 0 === b ? [0, -90, 0] : b;
          a = new THREE.Vector3().fromArray(a);
          b = new WALK.Euler().setFromDegTriple(b);
          b = new WALK.LightInstance(this, a, b);
          this.instances.push(b);
          this.dispatchEvent({ type: "instanceAdded", instance: b, target: this });
      },
      removeInstance: function (a) {
          WALK.removeFromArray(a, this.instances);
          this.dispatchEvent({ type: "instanceRemoved", instance: a, target: this });
      },
      serialize: function () {
          return {
              name: this.name,
              type: this.type,
              angle: this.angle,
              strength: this.strength,
              photometricProfile: this.photometricProfile,
              size: this.size,
              width: this.width,
              height: this.height,
              color: this.color.roundChannels().toArray(),
              doNotImport: this.doNotImport,
              instances: this.instances.map(function (a) {
                  return a.serialize();
              }),
          };
      },
      _updated: function () {
          this.dispatchEvent({ type: "updated", target: this });
      },
  };
  THREE.EventDispatcher.prototype.apply(WALK.Light.prototype);
  WALK.Light.iterateLightInstances = function (a, b) {
      for (var c = 1, d = 0; d < a.length; d += 1) for (var e = a[d], f = 0; f < e.instances.length; f += 1, c += 1) b(e, e.instances[f], c);
  };
  WALK.LightProbe = function (a) {
      this.id = a.id;
      this.position = new THREE.Vector3();
      a.position && this.position.fromArray(a.position);
      this._filteredCubeTexture = null;
      this._filteredCubeTextureNoLod = {};
      this._mirrorCubeTexture = null;
      this._boxEnabled = a.box ? !("enabled" in a.box) || a.box.enabled : !1;
      this.boxMin = new THREE.Vector3();
      this.boxMax = new THREE.Vector3();
      a.box && (this.boxMin.fromArray(a.box.min), this._setClampedBoxMax(a.box.max[0], a.box.max[1], a.box.max[2]));
  };
  WALK.LightProbe.prototype = {
      constructor: WALK.LightProbe,
      setFilteredTexture: function (a) {
          this._filteredCubeTexture && this._filteredCubeTexture.dispose();
          this._filteredCubeTexture = a;
      },
      setFilteredTextureNoLod: function (a, b) {
          this._filteredCubeTextureNoLod[b] && this._filteredCubeTextureNoLod[b].dispose();
          this._filteredCubeTextureNoLod[b] = a;
      },
      isBoundingBoxInitialized: function () {
          return !this.boxMin.equals(this.boxMax);
      },
      resetBoundingBox: function () {
          this.boxMin.set(0, 0, 0);
          this.boxMax.set(0, 0, 0);
      },
      isBoundingBoxEnabled: function () {
          return this._boxEnabled;
      },
      disableBoundingBox: function () {
          this._boxEnabled = !1;
          this.dispatchEvent({ type: "boundsUpdated", target: this });
      },
      enableBoundingBox: function () {
          this._boxEnabled = !0;
          this.isBoundingBoxInitialized() || this.dispatchEvent({ type: "boundsInit", target: this });
          this.dispatchEvent({ type: "boundsUpdated", target: this });
      },
      getFilteredTexture: function () {
          return this._filteredCubeTexture;
      },
      getFilteredTextureNoLod: function (a) {
          return this._filteredCubeTextureNoLod[a];
      },
      setMirrorTexture: function (a) {
          this._mirrorCubeTexture && this._mirrorCubeTexture.dispose();
          this._mirrorCubeTexture = a;
      },
      setPosition: function (a, b, c) {
          this.position.set(a, b, c);
          this.dispatchEvent({ type: "positionUpdated", target: this });
      },
      texturesReady: function () {
          return this._mirrorCubeTexture || this._filteredCubeTexture || this._filteredCubeTextureNoLod[0];
      },
      getMirrorTexture: function () {
          return this._mirrorCubeTexture || this._filteredCubeTexture || this._filteredCubeTextureNoLod[0];
      },
      _setClampedBoxMin: function (a, b, c) {
          a > this.boxMax.x - 0.1 && (a = this.boxMax.x - 0.1);
          b > this.boxMax.y - 0.1 && (b = this.boxMax.y - 0.1);
          c > this.boxMax.z - 0.1 && (c = this.boxMax.z - 0.1);
          this.boxMin.set(a, b, c);
      },
      setBoxMin: function (a, b, c) {
          this._setClampedBoxMin(a, b, c);
          this.dispatchEvent({ type: "boundsUpdated", target: this });
      },
      _setClampedBoxMax: function (a, b, c) {
          a < this.boxMin.x + 0.1 && (a = this.boxMin.x + 0.1);
          b < this.boxMin.y + 0.1 && (b = this.boxMin.y + 0.1);
          c < this.boxMin.z + 0.1 && (c = this.boxMin.z + 0.1);
          this.boxMax.set(a, b, c);
      },
      setBoxMax: function (a, b, c) {
          this._setClampedBoxMax(a, b, c);
          this.dispatchEvent({ type: "boundsUpdated", target: this });
      },
      serialize: function () {
          var a = { id: this.id, position: this.position.toArray() };
          this.isBoundingBoxInitialized() && (a.box = { enabled: this._boxEnabled, min: this.boxMin.toArray(), max: this.boxMax.toArray() });
          return a;
      },
      dispose: function () {
          this._filteredCubeTexture && (this._filteredCubeTexture.dispose(), (this._filteredCubeTexture = null));
          for (var a in this._filteredCubeTextureNoLod) this._filteredCubeTextureNoLod.hasOwnProperty(a) && this._filteredCubeTextureNoLod[a].dispose();
          this._filteredCubeTextureNoLod = {};
          this._mirrorCubeTexture && (this._mirrorCubeTexture.dispose(), (this._mirrorCubeTexture = null));
      },
  };
  THREE.EventDispatcher.prototype.apply(WALK.LightProbe.prototype);
  function bg(a) {
      return null !== a && void 0 !== a;
  }
  WALK.NodeConfig = function (a) {
      var b = this;
      this.name = a.name;
      this._editable = a.editable || !1;
      this._setsDisableCollisions = bg(a.disableCollisions);
      this._disableCollisions = a.disableCollisions || !1;
      this._setsHideInViews = bg(a.hideInViews);
      this.hideInViews = null;
      a.hideInViews && ((this.hideInViews = a.hideInViews), this.hideInViews.sort());
      this._lightmapResolution = (this._setsLightmapResolution = bg(a.lightmapResolution)) ? a.lightmapResolution : null;
      this._ground = bg(a.ground) ? a.ground : !1;
      this._faceCamera = a.faceCamera || null;
      this._rotate = a.rotate || !1;
      this._rotationSpeed = a.rotationSpeed || 0.1;
      this._isolateShadows = bg(a.isolateShadows) ? a.isolateShadows : !1;
      this.nodes = [];
      var c = { type: "updated", target: this };
      this._updated = function () {
          return b.dispatchEvent(c);
      };
  };
  WALK.NodeConfig.prototype.constructor = WALK.NodeConfig;
  THREE.EventDispatcher.prototype.apply(WALK.NodeConfig.prototype);
  function cg(a) {
      a.configure();
  }
  function dg(a) {
      a.visitSubtree(cg);
  }
  WALK.NodeConfig.prototype._configUpdated = function () {
      this.nodes.forEach(dg);
      this._updated();
  };
  WALK.NodeConfig.prototype.addNode = function (a) {
      this.nodes.push(a);
  };
  WALK.NodeConfig.prototype.isOnHideInViews = function (a) {
      return -1 !== this.hideInViews.indexOf(a);
  };
  WALK.NodeConfig.prototype.addToHideInViews = function (a) {
      for (var b = [], c = 0; c < arguments.length; ++c) b[c - 0] = arguments[c];
      console.assert(this.setsHideInViews);
      b = _.makeIterator(b);
      for (c = b.next(); !c.done; c = b.next()) (c = c.value), console.assert(!this.isOnHideInViews(c)), this.hideInViews.push(c);
      this._updated();
  };
  WALK.NodeConfig.prototype.removeFromHideInViews = function (a) {
      if (this.hideInViews) for (var b = 0; b < this.hideInViews.length; ) this.hideInViews[b] === a ? this.hideInViews.splice(b, 1) : (b += 1);
      this._updated();
  };
  WALK.NodeConfig.prototype.serialize = function () {
      return {
          name: this.name,
          disableCollisions: this.setsDisableCollisions ? this.disableCollisions : null,
          hideInViews: this.setsHideInViews ? this.hideInViews : null,
          lightmapResolution: this.setsLightmapResolution ? this.lightmapResolution : null,
          ground: this.ground ? !0 : null,
          faceCamera: this.faceCamera,
          rotate: this.rotate ? !0 : null,
          rotationSpeed: this.rotate ? this.rotationSpeed : null,
          isolateShadows: this.isolateShadows ? !0 : null,
      };
  };
  Object.defineProperty(WALK.NodeConfig.prototype, "setsDisableCollisions", {
      get: function () {
          return this._setsDisableCollisions;
      },
      set: function (a) {
          this._setsDisableCollisions = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "disableCollisions", {
      get: function () {
          return this._disableCollisions;
      },
      set: function (a) {
          console.assert(this._setsDisableCollisions);
          this._disableCollisions = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "editable", {
      get: function () {
          return this._editable || this.faceCamera || this.rotate;
      },
      set: function (a) {
          this._editable = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "ground", {
      get: function () {
          return this._ground;
      },
      set: function (a) {
          this._ground = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "faceCamera", {
      get: function () {
          return this._faceCamera;
      },
      set: function (a) {
          this._faceCamera = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "rotate", {
      get: function () {
          return this._rotate;
      },
      set: function (a) {
          this._rotate = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "rotationSpeed", {
      get: function () {
          return this._rotationSpeed;
      },
      set: function (a) {
          0 === a && (a = 0.01);
          this._rotationSpeed = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "setsLightmapResolution", {
      get: function () {
          return this._setsLightmapResolution;
      },
      set: function (a) {
          this._setsLightmapResolution = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "lightmapResolution", {
      get: function () {
          return this._lightmapResolution;
      },
      set: function (a) {
          console.assert(this._setsLightmapResolution);
          this._lightmapResolution = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "isolateShadows", {
      get: function () {
          return this._isolateShadows;
      },
      set: function (a) {
          this._isolateShadows = a;
          this._configUpdated();
      },
  });
  Object.defineProperty(WALK.NodeConfig.prototype, "setsHideInViews", {
      get: function () {
          return this._setsHideInViews;
      },
      set: function (a) {
          this._setsHideInViews = a;
          null === this.hideInViews && (this.hideInViews = []);
          this._configUpdated();
      },
  });
  function eg(a) {
      function b() {
          e = new THREE.Vector3();
          var b = new THREE.Box3();
          a.visitSubtree(function (a) {
              (a = a.mesh) && b.union(a.geometry.boundingBox);
          });
          b.center(e);
          d.elements[12] = -e.x;
          d.elements[13] = -e.y;
          d.elements[14] = -e.z;
      }
      var c = new THREE.Matrix4(),
          d = new THREE.Matrix4(),
          e,
          f = new THREE.Vector3(),
          g = new WALK.Euler();
      return function (h, l) {
          e || b();
          if (a.config.faceCamera)
              return f.copy(l).sub(e).normalize(), g.setFromDirection(f), "yaw" === a.config.faceCamera && (g.pitch = 0), c.makeRotationFromEuler(g), a.animationMatrix.identity().setPosition(e).multiply(c).multiply(d), !1;
          console.assert(a.config.rotate);
          g.yaw = WALK.normalizeRotation(g.yaw + 2 * Math.PI * a.config.rotationSpeed * h);
          c.makeRotationFromEuler(g);
          a.animationMatrix.identity().setPosition(e).multiply(c).multiply(d);
          return !0;
      };
  }
  WALK.Node = function (a, b, c) {
      this.id = c.id;
      this.initialLightProbeId = void 0 === c.lightProbeId ? null : c.lightProbeId;
      this.parent = a;
      this.config = b;
      this.children = [];
      this.shadowsIsolatedWithin = this.lightmapResolution = this.hideInViews = this.animationMatrix = this.ground = this.disableCollisions = this._facesCnt = this.mesh = null;
      this.editable = !1;
      this.editableRoot = null;
      b.addNode(this);
      this.configure();
  };
  WALK.Node.prototype.constructor = WALK.Node;
  WALK.Node.prototype.configure = function () {
      this.ground = (this.disableCollisions = this.config.setsDisableCollisions ? this.config.disableCollisions : this.parent ? this.parent.disableCollisions : !1) ? !1 : this.config.ground;
      this.isAnimatedRoot ? ((this.animationMatrix = new THREE.Matrix4()), (this.update = eg(this))) : (this.animationMatrix = this.parent ? this.parent.animationMatrix : null);
      this.hideInViews = this.config.setsHideInViews ? this.config.hideInViews : this.parent ? this.parent.hideInViews : null;
      this.lightmapResolution = this.config.setsLightmapResolution ? this.config.lightmapResolution : this.parent ? this.parent.lightmapResolution : null;
      this.shadowsIsolatedWithin = this.config.isolateShadows ? this.config.name : this.parent && this.parent.shadowsIsolatedWithin ? this.parent.shadowsIsolatedWithin : null;
      this.editableRoot = (this.editable = this.config.editable) ? this : this.parent ? this.parent.editableRoot : null;
  };
  WALK.Node.prototype.visitSubtree = function (a) {
      a(this);
      var b = this.children;
      if (b) for (var c = 0; c < b.length; c += 1) b[c].visitSubtree(a);
  };
  WALK.Node.prototype.facesInSubtree = function () {
      var a = this;
      null === a._facesCnt &&
          ((a._facesCnt = 0),
          a.visitSubtree(function (b) {
              b.mesh && (a._facesCnt += b.mesh.geometry.vertexCnt / 3);
          }));
      return a._facesCnt;
  };
  WALK.Node.prototype.hide = function () {
      this.visitSubtree(function (a) {
          a.mesh && (a.mesh.visible = !1);
      });
  };
  WALK.Node.prototype.show = function () {
      this.visitSubtree(function (a) {
          a.mesh && (a.mesh.visible = !0);
      });
  };
  Object.defineProperty(WALK.Node.prototype, "isAnimatedRoot", {
      get: function () {
          return this.config.faceCamera || this.config.rotate;
      },
  });
  WALK.Node.prototype.serialize = function () {
      var a = {
              id: this.id,
              children: this.children.map(function (a) {
                  return a.serialize();
              }),
          },
          b = this.mesh;
      b && ((a.lightProbeId = b.lightProbe ? b.lightProbe.id : null), (a.mesh = !0));
      return a;
  };
  Object.defineProperty(WALK.Node.prototype, "type", {
      get: function () {
          return this.config.name;
      },
  });
  Object.defineProperty(WALK.Node.prototype, "highlightMix", {
      set: function (a) {
          this.visitSubtree(function (b) {
              b.mesh && (b.mesh.highlightMix = a);
          });
      },
  });
  Object.defineProperty(WALK.Node.prototype, "selected", {
      set: function (a) {
          this.visitSubtree(function (b) {
              b.mesh && (b.mesh.selected = a);
          });
      },
  });
  Object.defineProperty(WALK.Node.prototype, "selectedSecondary", {
      set: function (a) {
          this.visitSubtree(function (b) {
              b.mesh && (b.mesh.selectedSecondary = a);
          });
      },
  });
  WALK.Mesh = function (a, b, c) {
      this._visible = !0;
      THREE.Mesh.call(this, b, c);
      this.node = a;
      this.useFaces16 = !1;
      this.quantUv0Max = this.quantUv0Range = this.quantVertexMax = this.quantVertexRange = this.transformByteOffset = this.uv1CoordVOffset = this.uv1CoordUOffset = this.uv1CoordVScale = this.uv1CoordUScale = this.lightMapIdx = this.uv1ByteOffset = this.uv0ByteOffset = this.normalByteOffset = this.vertexCnt = this.vertexByteOffset = this.faceCnt = this.faceByteOffset = 0;
      this.lightMap = null;
      this.autoLightmapResolution = -1;
      this.lightProbe = null;
      this.matrixAutoUpdate = this.rotationAutoUpdate = !1;
      this.selected = this.highlightMix = null;
      this.selectedSecondary = !1;
      this.visibilityId = null;
      this.cameraDistance = 0;
      var d = (this.matrix = this.matrixWorld = null);
      Object.defineProperty(this, "matrixWorld", {
          get: function () {
              return d || this.node.animationMatrix;
          },
          set: function (a) {
              d = a;
          },
      });
      this.sharedBuffersDebug = 0;
      this._mergedMesh = null;
  };
  WALK.Mesh.prototype = Object.create(THREE.Mesh.prototype);
  WALK.Mesh.prototype.constructor = WALK.Mesh;
  WALK.Mesh.prototype.clone = void 0;
  WALK.Mesh.prototype.updateMatrixWorld = function () {};
  WALK.Mesh.prototype.uv0InBuffers = function () {
      return -1 !== this.uv0ByteOffset;
  };
  WALK.Mesh.prototype.uv1InBuffers = function () {
      return -1 !== this.uv1ByteOffset;
  };
  WALK.Mesh.prototype.quantVertexFactor = function () {
      return this.quantVertexRange / this.quantVertexMax;
  };
  WALK.Mesh.prototype.quantUv0Disabled = function () {
      return 0 === this.quantUv0Max;
  };
  WALK.Mesh.prototype.quantUv0Factor = function () {
      return this.quantUv0Range / this.quantUv0Max;
  };
  Object.defineProperty(WALK.Mesh.prototype, "hideInViews", {
      get: function () {
          return this.node.hideInViews;
      },
      set: function () {
          console.assert(!1);
      },
  });
  Object.defineProperty(WALK.Mesh.prototype, "visible", {
      get: function () {
          return this._visible;
      },
      set: function (a) {
          a !== this._visible && ((this._visible = a), this._mergedMesh && !WALK.EDIT_MODE && (this._mergedMesh.visible = a));
      },
  });
  WALK.MergedMesh = function (a, b) {
      this._visible = !0;
      THREE.Mesh.call(this, a, b);
      this.anyLogicalMeshHasUvs = !1;
      this.lightProbe = this.lightMap = null;
      this.matrixAutoUpdate = this.rotationAutoUpdate = !1;
      this.hideInViews = null;
      this.matrixAutoUpdate = this.rotationAutoUpdate = !1;
      this.center = null;
      this.cameraDistance = 0;
      this.editableRootNode = this.matrix = this.matrixWorld = null;
      Object.defineProperty(this, "matrixWorld", {
          get: function () {
              return this.editableRootNode ? (this.editableRootNode.mesh ? this.editableRootNode.mesh.matrixWorld : this.editableRootNode.animationMatrix) : null;
          },
          set: function () {
              console.assert("Cannot set matrixWorld for a merged mesh. The mesh needs to be marked as editable to prevent merging.");
          },
      });
      this.logicalMeshes = [];
  };
  WALK.MergedMesh.prototype = Object.create(THREE.Mesh.prototype);
  WALK.MergedMesh.prototype.constructor = WALK.MergedMesh;
  WALK.MergedMesh.prototype.clone = void 0;
  WALK.MergedMesh.prototype.updateMatrixWorld = function () {};
  WALK.MergedMesh.prototype.addLogicalMesh = function (a) {
      this.logicalMeshes.push(a);
      a._mergedMesh = this;
  };
  Object.defineProperty(WALK.MergedMesh.prototype, "visible", {
      get: function () {
          return this._visible;
      },
      set: function (a) {
          if (a !== this._visible) {
              this._visible = a;
              for (var b = 0; b < this.logicalMeshes.length; b += 1) this.logicalMeshes[b]._visible = a;
          }
      },
  });
  WALK.SkyMesh = function (a, b, c, d) {
      var e = this;
      THREE.Mesh.call(this, b, c);
      d && this.position.fromArray(d);
      this.autoPosition = !d;
      this.name = a;
      this.fog = null;
      var f = { type: "updated", target: this };
      this._updated = function () {
          return e.dispatchEvent(f);
      };
  };
  WALK.SkyMesh.prototype = Object.create(THREE.Mesh.prototype);
  WALK.SkyMesh.prototype.constructor = WALK.SkyMesh;
  WALK.SkyMesh.prototype.clone = void 0;
  WALK.SkyMesh.prototype.serialize = function () {
      var a = { name: this.name };
      this.autoPosition || (a.center = this.position.toArray());
      this.isEquirect ? ((a.type = "equirect"), (a.yawRotation = this.yawRotationDeg), (a.texture = this.material.map ? this.material.map.serialize() : null)) : (a.type = "procedural");
      this.fog.enabled() && (a.fog = this.fog.serialize());
      return a;
  };
  Object.defineProperty(WALK.SkyMesh.prototype, "yawRotationDeg", {
      get: function () {
          return THREE.Math.radToDeg(this.rotation.y);
      },
      set: function (a) {
          a = THREE.Math.degToRad(a);
          this.rotation.y = a;
          this.updateMatrixWorld();
          this._updated();
      },
  });
  Object.defineProperty(WALK.SkyMesh.prototype, "isEquirect", {
      get: function () {
          return this.material instanceof WALK.EquirectSkyMaterial;
      },
  });
  Object.defineProperty(WALK.SkyMesh.prototype, "radius", {
      get: function () {
          return this.scale.x;
      },
      set: function (a) {
          this.scale.set(a, a, a);
          this.updateMatrixWorld(!0);
          this._updated();
      },
  });
  var fg = 1e3,
      gg = { internal: !1, position: [0, 0, 0], rotation: [0, 0], hideFromMenu: !0, sky: WALK.EDITOR_CONTROLLED_SKY_NAME };
  WALK.View = function (a) {
      var b = this;
      void 0 === a && (a = gg);
      this.id = void 0 !== a.id ? a.id : fg++;
      this.name = a.name || "view" + this.id;
      this.internal = a.internal || !1;
      a.position && (this.position = new THREE.Vector3(a.position[0], a.position[1], a.position[2]));
      a.rotation && (this.rotation = new WALK.Euler(WALK.normalizeRotation(THREE.Math.degToRad(a.rotation[0])), WALK.normalizeRotation(THREE.Math.degToRad(a.rotation[1])), 0));
      this.hideFromMenu = a.hideFromMenu || !1;
      this.sky = a.sky || WALK.EDITOR_CONTROLLED_SKY_NAME;
      this.mode = a.mode || "fps";
      this.distance = a.distance;
      this.panPrimary = a.panPrimary;
      this.noRotate = a.noRotate;
      this.noPitchRotate = a.noPitchRotate;
      this.noPan = void 0 === a.noPan ? !1 : a.noPan;
      this.minDistance = void 0 === a.minDistance ? 1 : a.minDistance;
      this.maxDistance = void 0 === a.maxDistance ? 100 : a.maxDistance;
      this.minUpAngle = void 0 === a.minUpAngle ? -Math.PI / 2 : a.minUpAngle;
      this.maxUpAngle = void 0 === a.maxUpAngle ? Math.PI / 2 : a.maxUpAngle;
      this.minSideAngle = void 0 === a.minSideAngle ? -Math.PI : a.minSideAngle;
      this.maxSideAngle = void 0 === a.maxSideAngle ? Math.PI : a.maxSideAngle;
      a.target && (this.target = new THREE.Vector3(a.target[0], a.target[1], a.target[2]));
      this.fov = a.fov;
      var c = { type: "updated", target: this };
      this._updated = function () {
          return b.dispatchEvent(c);
      };
  };
  WALK.View.prototype = {
      constructor: WALK.View,
      isTop: function () {
          return "orbit" === this.mode && this.panPrimary && this.noPitchRotate;
      },
      isOrbit: function () {
          return "orbit" === this.mode && !this.isTop();
      },
      usesDefaultSky: function () {
          return this.sky === WALK.DEFAULT_SKY_NAME;
      },
      switchSky: function () {
          this.usesDefaultSky() ? (this.sky = WALK.EDITOR_CONTROLLED_SKY_NAME) : (this.sky = WALK.DEFAULT_SKY_NAME);
          this._updated();
      },
      setName: function (a) {
          this.name = a;
          this._updated();
      },
      setYaw: function (a) {
          this.rotation.yaw = a;
          this._updated();
      },
      setMinUpAngle: function (a) {
          a !== this.minUpAngle && ((this.minUpAngle = a), this._updated());
      },
      setMaxUpAngle: function (a) {
          a !== this.maxUpAngle && ((this.maxUpAngle = a), this._updated());
      },
      setMinSideAngle: function (a) {
          a !== this.minSideAngle && ((this.minSideAngle = a), this._updated());
      },
      setMaxSideAngle: function (a) {
          a !== this.maxSideAngle && ((this.maxSideAngle = a), this._updated());
      },
      setHideFromMenu: function (a) {
          a !== this.hideFromMenu && ((this.hideFromMenu = a), this._updated());
      },
      setMinDistance: function (a) {
          a !== this.minDistance && ((this.minDistance = a), this._updated());
      },
      setMaxDistance: function (a) {
          a !== this.maxDistance && ((this.maxDistance = a), this._updated());
      },
      setNoPan: function (a) {
          a !== this.noPan && ((this.noPan = a), this._updated());
      },
      serialize: function () {
          var a = this,
              b = { id: this.id, name: this.name, mode: this.mode, rotation: this.rotation.toDegTriple().slice(0, 2), hideFromMenu: this.hideFromMenu || !1, sky: this.sky };
          this.position && (b.position = this.position.toArray());
          this.target && (b.target = this.target.toArray());
          -Infinity !== this.minSideAngle && (b.minSideAngle = this.minSideAngle);
          Infinity !== this.maxSideAngle && (b.maxSideAngle = this.maxSideAngle);
          "distance minDistance maxDistance panPrimary noPan noRotate noPitchRotate minUpAngle maxUpAngle fov".split(" ").forEach(function (c) {
              void 0 !== a[c] && (b[c] = a[c]);
          });
          return b;
      },
  };
  THREE.EventDispatcher.prototype.apply(WALK.View.prototype);
  WALK.Mirror = function (a, b, c) {
      THREE.Object3D.call(this);
      this.name = "mirror_" + this.id;
      this.scene = a;
      this.mirrorCamera = b.clone();
      this.renderTargetParams = { minFilter: GLC.LINEAR, magFilter: GLC.LINEAR, format: GLC.RGBA, stencilBuffer: !1, generateMipmaps: !0 };
      this.texture = null;
      c = c || {};
      this.matrixNeedsUpdate = !0;
      this.clipBias = void 0 !== c.clipBias ? c.clipBias : 0;
      a = void 0 !== c.color ? new THREE.Color(c.color) : new THREE.Color(8355711);
      this.textureMatrix = new THREE.Matrix4();
      this.mirrorWorldPosition = new THREE.Vector3();
      this.mirrorRotationMatrix = new THREE.Matrix4();
      this.mirrorNormal = new THREE.Vector3();
      this.cameraWorldPosition = new THREE.Vector3();
      this.cameraRotationMatrix = new THREE.Matrix4();
      this.mirrorToCamera = new THREE.Vector3();
      this.cameraFrustum = null;
      this.material = new WALK.MirrorMaterial(a, this.textureMatrix);
  };
  WALK.Mirror.prototype = Object.create(THREE.Object3D.prototype);
  WALK.Mirror.prototype.renderWithMirror = function (a) {
      this.updateTextureMatrix();
      this.matrixNeedsUpdate = !1;
      var b = a.camera;
      a.camera = this.mirrorCamera;
      a.renderTemp();
      a.material.uniforms.mirrorSampler.value = a.tempTexture;
      this.render();
      this.matrixNeedsUpdate = !0;
      a.material.uniforms.mirrorSampler.value = a.texture;
      a.camera = b;
      a.updateTextureMatrix();
  };
  WALK.Mirror.prototype.updateMatrixWorld = function (a) {
      THREE.Object3D.prototype.updateMatrixWorld.call(this, a);
      this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld);
      this.mirrorRotationMatrix.extractRotation(this.matrixWorld);
      this.mirrorNormal.set(0, 0, 1);
      this.mirrorNormal.applyMatrix4(this.mirrorRotationMatrix);
  };
  WALK.Mirror.prototype.updateCameraPosition = function (a, b) {
      this.cameraWorldPosition.setFromMatrixPosition(a.matrixWorld);
      this.cameraRotationMatrix.extractRotation(a.matrixWorld);
      this.matrixNeedsUpdate = !0;
      this.cameraFrustum = b;
  };
  WALK.Mirror.prototype.inFrustum = function () {
      this.mirrorToCamera.subVectors(this.cameraWorldPosition, this.mirrorWorldPosition);
      return this.mirrorToCamera.angleTo(this.mirrorNormal) < Math.PI / 2 && this.cameraFrustum.intersectsBox(this.parent.geometry.boundingBox);
  };
  WALK.Mirror.prototype.updateTextureMatrix = (function () {
      var a = new THREE.Vector3(),
          b = new THREE.Vector3(),
          c = new THREE.Vector3(),
          d = new THREE.Vector4(),
          e = new THREE.Plane(),
          f = new THREE.Vector4();
      return function () {
          a.copy(this.mirrorWorldPosition).sub(this.cameraWorldPosition).reflect(this.mirrorNormal).negate().add(this.mirrorWorldPosition);
          c.set(0, 0, -1);
          c.applyMatrix4(this.cameraRotationMatrix);
          c.add(this.cameraWorldPosition);
          b.copy(this.mirrorWorldPosition).sub(c).reflect(this.mirrorNormal).negate().add(this.mirrorWorldPosition);
          this.up.set(0, -1, 0);
          this.up.applyMatrix4(this.cameraRotationMatrix);
          this.up.reflect(this.mirrorNormal).negate();
          this.mirrorCamera.position.copy(a);
          this.mirrorCamera.up = this.up;
          this.mirrorCamera.lookAt(b);
          this.mirrorCamera.updateProjectionMatrix();
          this.mirrorCamera.updateMatrixWorld();
          this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld);
          this.textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
          this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
          this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);
          e.setFromNormalAndCoplanarPoint(this.mirrorNormal, this.mirrorWorldPosition);
          e.applyMatrix4(this.mirrorCamera.matrixWorldInverse);
          d.set(e.normal.x, e.normal.y, e.normal.z, e.constant);
          var g = this.mirrorCamera.projectionMatrix;
          f.x = (Math.sign(d.x) + g.elements[8]) / g.elements[0];
          f.y = (Math.sign(d.y) + g.elements[9]) / g.elements[5];
          f.z = -1;
          f.w = (1 + g.elements[10]) / g.elements[14];
          d.multiplyScalar(2 / d.dot(f));
          g.elements[2] = d.x;
          g.elements[6] = d.y;
          g.elements[10] = d.z + 1 - this.clipBias;
          g.elements[14] = d.w;
      };
  })();
  WALK.Mirror.prototype.configure = function (a, b, c, d) {
      this.mirrorCamera.aspect = c;
      this.mirrorCamera.fov = d;
      this.mirrorCamera.updateProjectionMatrix();
      null !== this.texture && this.texture.dispose();
      this.material.mirrorSampler = this.texture;
  };
  WALK.Mirror.prototype.render = function (a) {
      this.material.visible && (this.matrixNeedsUpdate && (this.updateTextureMatrix(), (this.matrixNeedsUpdate = !1)), (this.material.visible = !1), a.render(this.scene, this.mirrorCamera, this.texture, !0), (this.material.visible = !0));
  };
  WALK.Mirror.prototype.renderTemp = function (a) {
      this.matrixNeedsUpdate && this.updateTextureMatrix();
      a.render(this.scene, this.mirrorCamera, this.tempTexture, !0);
  };
  function hg(a) {
      THREE.EventDispatcher.call(this);
      var b = this;
      this._fog = null;
      this._hdrOutput = !1;
      this._camera = a;
      this._updated = function () {
          return b.dispatchEvent({ type: "updated", target: b });
      };
      a.addEventListener("colorMapUpdated", this._updated);
      a.addEventListener("exposureUpdated", this._updated);
      a.addEventListener("gammaUpdated", this._updated);
  }
  _.inherits(hg, THREE.EventDispatcher);
  _.global.Object.defineProperties(hg.prototype, {
      fog: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._fog;
          },
          set: function (a) {
              this._fog = a;
              this._fog.addEventListener("updated", this._updated);
              this._updated();
          },
      },
      hdrOutput: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._hdrOutput;
          },
          set: function (a) {
              this._hdrOutput != a && ((this._hdrOutput = a), this._updated());
          },
      },
      colorMap: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._camera.colorMapReady() ? this._camera.colorMap : null;
          },
      },
      cameraExposure: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._camera.exposure;
          },
      },
      cameraGamma: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._camera.gamma;
          },
      },
  });
  var ig = 0;
  function jg(a, b, c) {
      a = new WALK.Mirror(a, b, { clipBias: 0, color: 8355711, debugMode: !1 });
      a.material.name = c.material.name;
      c = c.geometry;
      console.assert(c.boundingBox);
      b = c.boundingBox;
      var d = Math.sqrt(Math.pow(b.max.x - b.min.x, 2) + Math.pow(b.max.z - b.min.z, 2)),
          e = b.max.y - b.min.y;
      d && e
          ? ((d = new THREE.Mesh(new THREE.PlaneBufferGeometry(d, e), a.material)), (d.rotation.y = Math.atan2(c.normals[0], c.normals[2])), b.center(d.position), (d.geometry.boundingBox = b), d.add(a), (a = d))
          : (WALK.log("mirror with 0 dimension"), (a = null));
      return a;
  }
  function kg(a, b, c) {
      c = c || "id";
      for (var d = 0; d < a.length; d += 1) if (a[d].hasOwnProperty(c) && a[d][c] === b) return !1;
      return !0;
  }
  function lg(a, b, c) {
      c = c || "id";
      for (var d = 0; d < a.length; d += 1) if (a[d][c] === b) return a[d];
      return null;
  }
  function mg(a, b) {
      a = a.name.toUpperCase();
      b = b.name.toUpperCase();
      return a < b ? -1 : a > b ? 1 : 0;
  }
  WALK.Scene = function (camera) {
      function onUpdated() {
          thisScene.dispatchEvent(updatedEvent);
      }
      function onAnyViewUpdated() {
          thisScene.dispatchEvent(anyViewUpdatedEvent);
          onUpdated();
      }
      function onMaterialUpdated(a) {
          a = a.target;
          var b = thisScene._mainAnimatedMaterials.has(a);
          a.isAnimated && !b ? thisScene._mainAnimatedMaterials.add(a) : !a.isAnimated && b && thisScene._mainAnimatedMaterials.delete(a);
          onUpdated();
      }
      function onNodeConfigUpdated() {
          thisScene._animatedRootNodes.length = 0;
          thisScene.visitAllNodes(function (a) {
              a.isAnimatedRoot && thisScene._animatedRootNodes.push(a);
          });
          onUpdated();
      }
      var thisScene = this, updatedEvent = { type: "updated", target: this }, anyViewUpdatedEvent = { type: "anyViewUpdated", target: this };
      this.id = ig++;
      this._headLight = !1;
      this.threeScene = new THREE.Scene();
      this.autoAddLightProbes = !0;
      this.autoTour = { disabled: !1, startOnLoad: !1 };
      this.canStartAutoTour = function () {
          return !this.autoTour.disabled && 1 < this.visibleViews().length;
      };
      this.startAutoTourOnLoad = function () {
          return this.canStartAutoTour() && this.autoTour.startOnLoad;
      };
      this.interactionPrompt = this.disableProgressiveLoader = !1;
      this.camera = camera;
      this.materials = [];
      this._mainAnimatedMaterials = new Set();
      this._disabledMaterials = [];
      this._sortedMaterials = null;
      this.nodeConfigs = [];
      this._nodeConfigsLookup = {};
      this.nodes = [];
      this._animatedRootNodes = [];
      this._nodeLookup = {};
      this.gpuMeshes = [];
      this.mirrors = [];
      this._animatableAuxiliaryObjects = new Set();
      this.boundingBox = new THREE.Box3();
      this.collisionBoundingBox = new THREE.Box3();
      this._sumLogicalMeshCenter = new THREE.Vector3();
      this._logicalNonemptyMeshCount = 0;
      this._center = new THREE.Vector3();
      this.skyMeshes = [];
      this.hideViewsMenu = !1;
      this.views = [];
      this.lights = [];
      this.lightProbes = [];
      this.cameraVolumes = [];
      this.minimapConfig = null;
      this.sharedMaterialState = new hg(camera);
      this.serialize = function () {
          return {
              disableProgressiveLoader: this.disableProgressiveLoader,
              interactionPrompt: this.interactionPrompt,
              autoTour: this.autoTour,
              camera: this.camera.serialize(),
              materials: this.materials.map(function (a) {
                  return a.serialize();
              }),
              nodeConfigs: this.nodeConfigs.map(function (a) {
                  return a.serialize();
              }),
              nodes: this.nodes.map(function (a) {
                  return a.serialize();
              }),
              lights: this.lights.map(function (a) {
                  return a.serialize();
              }),
              lightProbes: this.lightProbes.map(function (a) {
                  return a.serialize();
              }),
              cameraVolumes: this.cameraVolumes.map(function (a) {
                  return a.serialize();
              }),
              autoAddLightProbes: !1,
              views: this.views
                  .filter(function (a) {
                      return !a.internal;
                  })
                  .map(function (a) {
                      return a.serialize();
                  }),
              skies: this.skyMeshes
                  .filter(function (a) {
                      return a.name !== WALK.DEFAULT_SKY_NAME;
                  })
                  .map(function (a) {
                      return a.serialize();
                  }),
              minimap: this.minimapConfig.serialize(),
          };
      };
      this.addMaterial = function (m) {
          this.materials.push(m);
          m.addEventListener("updated", onMaterialUpdated);
          m.sharedMaterialState = this.sharedMaterialState;
          m.isAnimated && this._mainAnimatedMaterials.add(m);
          void 0 !== m.headLight && (m.headLight = this.headLight);
      };
      this.replaceMaterial = function (mt, rpl) {
          var idx = this.materials.indexOf(mt);
          void 0 === this._disabledMaterials[idx] && (this._disabledMaterials[idx] = new Map());
          this._disabledMaterials[idx].set(mt.type, mt);
          var mtl = this._disabledMaterials[idx].get(rpl);
          mtl || ((mtl = WALK.createMaterialOfType(rpl)), mtl.addEventListener("updated", onMaterialUpdated), (mtl.name = mt.name), 0 === this.lightProbes.length && (mtl.disableLightProbeTmp = !0));
          this.materials[idx] = mtl;
          onUpdated();
          for (var i = 0; i < this.gpuMeshes.length; i += 1) this.gpuMeshes[i].material === mt && (this.gpuMeshes[i].material = mtl);
          mt.isAnimated && this._mainAnimatedMaterials.delete(mt);
          mtl.isAnimated && this._mainAnimatedMaterials.add(mtl);
          this._sortedMaterials = null;
          mtl.setUniforms();
          return mtl;
      };
      this.addNodeConfig = function (nc) {
          this.nodeConfigs.push(nc);
          this._nodeConfigsLookup[nc.name] = nc;
          nc.addEventListener("updated", onNodeConfigUpdated);
      };
      this.findNodeConfig = function (name) {
          return this._nodeConfigsLookup.hasOwnProperty(name) ? this._nodeConfigsLookup[name] : null;
      };
      this.addNode = function (node) {
          var t = this;
          this.nodes.push(node);
          node.visitSubtree(function (n) {
              t._nodeLookup[n.id] = n;
              n.isAnimatedRoot && t._animatedRootNodes.push(n);
          });
      };
      this.findNode = function (a) {
          return this._nodeLookup[a];
      };
      this.visitAllNodes = function (a) {
          for (var b = 0; b < this.nodes.length; b += 1) this.nodes[b].visitSubtree(a);
      };
      this.visitMeshesWithMaterial = function (a, b) {
          this.visitAllNodes(function (c) {
              (c = c.mesh) && c.material === a && b(c);
          });
      };
      this.sortedMaterials = function () {
          null === this._sortedMaterials && (this._sortedMaterials = this.materials.slice(0).sort(mg));
          return this._sortedMaterials;
      };
      this._updateSceneCenterWithGpuMesh = (function () {
          var a = new THREE.Vector3();
          return function (b) {
              if (b.logicalMeshes)
                  for (var c = 0; c < b.logicalMeshes.length; c += 1) {
                      var d = b.logicalMeshes[c].geometry.boundingBox;
                      d.empty() || (d.center(a), this._sumLogicalMeshCenter.add(a), ++this._logicalNonemptyMeshCount);
                  }
              else (b = b.geometry.boundingBox), b.empty() || (b.center(a), this._sumLogicalMeshCenter.add(a), ++this._logicalNonemptyMeshCount);
              this._logicalNonemptyMeshCount && this._center.copy(this._sumLogicalMeshCenter).divideScalar(this._logicalNonemptyMeshCount);
          };
      })();
      this.addGpuMesh = function (a) {
          var b = this;
          if (a.material.planarReflector) {
              var c = jg(this.threeScene, this.camera, a);
              this.mirrors.push(c.children[0]);
              this.addAuxiliaryObject(c);
          } else this.addAuxiliaryObject(a);
          this.gpuMeshes.push(a);
          this.boundingBox.union(a.geometry.boundingBox);
          (a.logicalMeshes || [a]).forEach(function (a) {
              a.node.disableCollisions || b.collisionBoundingBox.union(a.geometry.boundingBox);
          });
          this._updateSceneCenterWithGpuMesh(a);
      };
      this.addAuxiliaryObject = function (a, c) {
          var d = this;
          c = void 0 === c ? !1 : c;
          this.threeScene.add(a);
          a.traverse(function (a) {
              (a = a.material) && null === a.sharedMaterialState && (a.sharedMaterialState = d.sharedMaterialState);
          });
          c && this._animatableAuxiliaryObjects.add(a);
          onUpdated();
      };
      this.removeAuxiliaryObject = function (a) {
          this.threeScene.remove(a);
          this._animatableAuxiliaryObjects.delete(a);
          onUpdated();
      };
      this.addFog = function (a) {
          console.assert(null === this.sharedMaterialState.fog);
          this.sharedMaterialState.fog = a;
      };
      this.addSkyMesh = function (a) {
          this.skyMeshes.push(a);
          a.addEventListener("updated", onUpdated);
          this.dispatchEvent({ type: "skyMeshAdded", skyMesh: a, target: this });
      };
      this.removeSkyMesh = function (a) {
          WALK.removeFromArray(a, this.skyMeshes);
          this.dispatchEvent({ type: "skyMeshRemoved", skyMesh: a, target: this });
          a.geometry.dispose();
          a.material.map && a.material.map.dispose();
          a.material.dispose();
      };
      this.findSkyMesh = function (a) {
          return lg(this.skyMeshes, a, "name");
      };
      this.addLight = function (a) {
          console.assert(kg(this.lights, a.name, "name"));
          this.lights.push(a);
          a.addEventListener("updated", onUpdated);
          a.addEventListener("instanceAdded", onUpdated);
          a.addEventListener("instanceRemoved", onUpdated);
          onUpdated();
          this.dispatchEvent({ type: "lightAdded", light: a, target: this });
      };
      this.removeLight = function (a) {
          WALK.removeFromArray(a, this.lights);
          onUpdated();
          this.dispatchEvent({ type: "lightRemoved", light: a, target: this });
      };
      this.addLightProbe = function (a) {
          console.assert(kg(this.lightProbes, a.id));
          this.lightProbes.push(a);
          a.addEventListener("positionUpdated", onUpdated);
          a.addEventListener("boundsUpdated", onUpdated);
          onUpdated();
          this.dispatchEvent({ type: "lightProbeAdded", lightProbe: a, target: this });
      };
      this.removeLightProbe = function (a) {
          WALK.removeFromArray(a, this.lightProbes);
          for (var c = 0; c < this.gpuMeshes.length; c += 1) this.gpuMeshes[c].lightProbe === a && (this.gpuMeshes[c].lightProbe = null);
          onUpdated();
          this.dispatchEvent({ type: "lightProbeRemoved", lightProbe: a, target: this });
          a.dispose();
      };
      this.findLightProbe = function (a) {
          return lg(this.lightProbes, a);
      };
      this.closestLightProbe = function (a) {
          for (var b = null, c = Infinity, d = _.makeIterator(this.lightProbes), e = d.next(); !e.done; e = d.next()) {
              e = e.value;
              var f = a.distanceTo(e.position);
              f < c && ((c = f), (b = e));
          }
          return b;
      };
      this.addCameraVolume = function (a) {
          console.assert(kg(this.cameraVolumes, a.id));
          this.cameraVolumes.push(a);
          a.addEventListener("updated", onUpdated);
          onUpdated();
          this.dispatchEvent({ type: "cameraVolumeAdded", cameraVolume: a, target: this });
      };
      this.removeCameraVolume = function (a) {
          WALK.removeFromArray(a, this.cameraVolumes);
          onUpdated();
          this.dispatchEvent({ type: "cameraVolumeRemoved", cameraVolume: a, target: this });
          a.dispose();
      };
      this.findCameraVolume = function (a) {
          return lg(this.cameraVolumes, a);
      };
      this.shiftCameraVolume = function (a, b) {
          WALK.shiftItem(this.cameraVolumes, a, b);
          this.dispatchEvent({ type: "cameraVolumeShifted", cameraVolume: a, target: this });
      };
      this.findView = function (a) {
          return lg(this.views, a);
      };
      this.findViewByName = function (a) {
          return lg(this.views, a, "name");
      };
      this.visibleViews = function () {
          return WALK.filter(this.views, function (a) {
              return !a.hideFromMenu;
          });
      };
      this.addView = function (a) {
          console.assert(kg(this.views, a.id));
          this.views.push(a);
          a.addEventListener("updated", onAnyViewUpdated);
          onUpdated();
          this.dispatchEvent({ type: "viewAdded", view: a, target: this });
      };
      this.removeView = function (a) {
          WALK.removeFromArray(a, this.views);
          this.nodeConfigs.forEach(function (b) {
              b.removeFromHideInViews(a.id);
          });
          onUpdated();
          this.dispatchEvent({ type: "viewRemoved", view: a, target: this });
      };
      this.shiftView = function (a, b) {
          WALK.shiftItem(this.views, a, b);
          this.dispatchEvent({ type: "viewShifted", view: a, target: this });
      };
      this.hasLightMap = function () {
          return (
              void 0 !==
              WALK.find(this.materials, function (a) {
                  return a.lightMapped;
              })
          );
      };
      this.adjustSkiesAndCameraFarToSpanWholeScene = function () {
          function a(a, b) {
              var c = 0;
              a.forEach(function (a) {
                  if ("orbit" === a.mode) {
                      var d = void 0 === a.maxDistance ? a.distance : a.maxDistance;
                      d = a.target && d ? a.target.distanceTo(b) + d : void 0;
                  } else "fps" === a.mode && (d = a.position ? a.position.distanceTo(b) : void 0);
                  d && d > c && (c = d);
              });
              return c;
          }
          function b(a, b) {
              var c = Math.max(Math.abs(a.min.x - b.x), Math.abs(a.max.x - b.x)),
                  d = Math.max(Math.abs(a.min.y - b.y), Math.abs(a.max.y - b.y));
              a = Math.max(Math.abs(a.min.z - b.z), Math.abs(a.max.z - b.z));
              return Math.sqrt(c * c + d * d + a * a);
          }
          for (var c = 0, d = 0; d < this.skyMeshes.length; d += 1) {
              var e = this.skyMeshes[d];
              e.autoPosition && e.position.copy(this.center);
              var f = void 0;
              if (this.boundingBox.empty()) f = 0;
              else {
                  f = b(this.boundingBox, e.position);
                  var g = a(this.views, e.position);
                  f = Math.max(f, g);
              }
              f += WALK.SKY_DISTANCE_TO_SCENE;
              e.radius = f;
              c = Math.max(c, f);
          }
          this.camera.setFar(Math.max(this.camera.far, 2 * c));
          WALK.log("Camera far set to " + this.camera.far);
      };
      camera.addEventListener("updated", onUpdated);
      this.disableLightProbesForMaterials = function () {
          for (var a = 0; a < this.materials.length; a += 1) (this.materials[a].disableLightProbeTmp = !0), this.materials[a].setUniforms();
      };
      this.enableLightProbesForMaterials = function () {
          for (var a = 0; a < this.materials.length; a += 1) (this.materials[a].disableLightProbeTmp = !1), this.materials[a].setUniforms();
      };
      this.getAnimatedMaterials = (function () {
          var a = !1,
              b = new Map();
          return function () {
              function c(a) {
                  a instanceof THREE.Mesh && a.material.isAnimated && b.set(a.material, d);
              }
              for (var d = !a, e = _.makeIterator(thisScene._mainAnimatedMaterials), g = e.next(); !g.done; g = e.next()) b.set(g.value, d);
              e = _.makeIterator(thisScene._animatableAuxiliaryObjects);
              for (g = e.next(); !g.done; g = e.next()) g.value.traverse(c);
              e = _.makeIterator(b);
              for (g = e.next(); !g.done; g = e.next()) {
                  g = _.makeIterator(g.value);
                  var h = g.next().value;
                  g.next().value === a && b.delete(h);
              }
              a = d;
              return b.keys();
          };
      })();
      this.getAnimatedRootNodes = function () {
          return this._animatedRootNodes;
      };
  };
  WALK.Scene.prototype = {
      constructor: WALK.Scene,
      get center() {
          return this._center;
      },
      get headLight() {
          return this._headLight;
      },
      set headLight(a) {
          a !== this._headLight &&
              ((this._headLight = a),
              this.materials.forEach(function (b) {
                  b.headLight = a;
                  b.setUniforms();
              }));
      },
  };
  THREE.EventDispatcher.prototype.apply(WALK.Scene.prototype);
  WALK.createMaterialOfType = function (a) {
      return "water" === a ? new WALK.StandardMaterialWater() : new WALK.StandardMaterial();
  };
  function ng(a, b) {
      b = void 0 === b ? !1 : b;
      new THREE.Object3D();
      for (var c = 0; c < a.gpuMeshes.length; c += 1) {
          var d = a.gpuMeshes[c];
          if (d instanceof THREE.Mesh && (!b || d.material.transparent)) {
              d = d.geometry;
              d.boundingBox || d.computeBoundingBox();
              d = d.boundingBox;
              var e = new WALK.WireframeMaterial(new THREE.Color(16777215 * Math.random())),
                  f = new THREE.BoxBufferGeometry(d.max.x - d.min.x, d.max.y - d.min.y, d.max.z - d.min.z);
              f.addTriangleOrderAttribute();
              e = new THREE.Mesh(f, e);
              d.center(e.position);
              e.updateMatrixWorld();
              a.addAuxiliaryObject(e);
          }
      }
  }
  WALK.BufferAttribute = function (a, b, c) {
      THREE.BufferAttribute.call(this, a, b);
      this._length = a.length;
      this.releaseOnLoadedToGpu = !0;
      this.divisor = c || 0;
      this.glType = this.buffer = null;
  };
  WALK.BufferAttribute.prototype = {
      constructor: WALK.BufferAttribute,
      get length() {
          return this._length;
      },
  };
  THREE.BufferGeometry.prototype.addTriangleOrderAttribute = function () {
      if (void 0 === this.getAttribute("order")) {
          for (var a = this.getAttribute("position").length / 3, b = new Float32Array(a), c = 0; c < a; c += 1) b[c] = c % 3;
          this.addAttribute("order", new WALK.BufferAttribute(b, 1));
      }
  };
  THREE.BufferGeometry.prototype.convertNormalsToSpherical = function () {
      console.assert(void 0 === this.getAttribute("sphericalNormal"));
      var a = this.getAttribute("normal");
      console.assert(!a.buffer);
      a = a.array;
      for (var b = a.length / 3, c = WALK.DETECTOR.ios ? new Int16Array(2 * b) : new Int8Array(2 * b), d = 0; d < b; d += 1) {
          var e = 3 * d,
              f = 2 * d,
              g = Math.atan2(a[e + 1], a[e]) / Math.PI;
          c[f] = WALK.Math.toSnorm8(2 * (Math.acos(a[e + 2]) / Math.PI - 0.5));
          c[f + 1] = WALK.Math.toSnorm8(g);
      }
      delete this.attributes.normal;
      this.addAttribute("sphericalNormal", new WALK.BufferAttribute(c, 2));
  };
  THREE.BufferGeometry.prototype.changePosition = function (a) {
      var b = this.getAttribute("position"),
          c = b.length / 3;
      b = b.array;
      for (var d = 0; d < 3 * c; d += 3) (b[d] += a.x), (b[d + 1] += a.y), (b[d + 2] += a.z);
  };
  THREE.BufferGeometry.prototype.clone = function () {
      console.error("WALK.BufferGeometry cloning not supported");
  };
  function og(a, b, c, d, e) {
      c = new WALK.BufferAttribute(c, d, e || 0);
      a.addAttribute(b, c);
  }
  WALK.Geometry = function () {
      THREE.BufferGeometry.call(this);
      this.isInstanced = !1;
      this.instanceCount = 0;
      this.index = null;
      this.indexUint = !0;
      this.uvs0 = this.normals = this.vertices = null;
      this.isUvs0Repeating = !1;
      this.uvs1 = null;
      this.vertexOffset = this.vertexCnt = this.indexOffset = this.indexCnt = 0;
      this.boundingBox = new THREE.Box3();
      this.boundingSphere = new THREE.Sphere();
      this.gpuSize = 0;
  };
  WALK.Geometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  WALK.Geometry.prototype.constructor = WALK.Geometry;
  WALK.Geometry.prototype.allocateCoreBuffers = function (a) {
      console.assert(!this.vertices);
      a &&
          (65536 >= this.vertexCnt
              ? ((this.indexUint = !1), (this.index = new Uint16Array(this.indexCnt)), (this.gpuSize += 2 * this.indexCnt))
              : ((this.indexUint = !0), (this.index = new Uint32Array(this.indexCnt)), (this.gpuSize += 4 * this.indexCnt)));
      this.vertices = new Float32Array(3 * this.vertexCnt);
      this.gpuSize += 12 * this.vertexCnt;
      this.normals = WALK.DETECTOR.ios ? new Int16Array(2 * this.vertexCnt) : new Int8Array(2 * this.vertexCnt);
      this.gpuSize += 2 * this.vertexCnt;
  };
  WALK.Geometry.prototype.addCoreAttributes = function () {
      this.index && (og(this, "index", this.index, 1), (this.index = null));
      og(this, "position", this.vertices, 3);
      this.vertices = null;
      og(this, "sphericalNormal", this.normals, 2);
      this.normals = null;
  };
  WALK.Geometry.prototype.allocateUv0 = function () {
      console.assert(!this.uvs0);
      this.uvs0 = new Float32Array(2 * this.vertexCnt);
      this.gpuSize += 8 * this.vertexCnt;
  };
  WALK.Geometry.prototype.addUv0Attribute = function () {
      og(this, "uv", this.uvs0, 2);
      this.uvs0 = null;
  };
  WALK.Geometry.prototype.allocateUv1 = function () {
      console.assert(!this.uvs1);
      this.uvs1 = new Uint16Array(2 * this.vertexCnt);
      this.gpuSize += 4 * this.vertexCnt;
  };
  WALK.Geometry.prototype.addUv1Attribute = function () {
      og(this, "uv2", this.uvs1, 2);
      this.uvs1 = null;
  };
  WALK.Geometry.prototype.computeBoundingBox = void 0;
  WALK.Geometry.prototype.computeBoundingSphere = void 0;
  WALK.InstancedGeometry = function (a, b) {
      THREE.BufferGeometry.call(this);
      this.parent = a;
      this.ownsGpuBuffers = b;
      this.isInstanced = !0;
      this.instanceCount = 0;
      this.transforms2 = this.transforms1 = this.transforms0 = this.uvs1Mod = null;
      this.vertexOffset = this.indexOffset = 0;
      this.boundingBox = new THREE.Box3();
      this.boundingSphere = new THREE.Sphere();
      this._gpuSize = 0;
  };
  WALK.InstancedGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  WALK.InstancedGeometry.prototype.constructor = WALK.InstancedGeometry;
  WALK.InstancedGeometry.prototype.allocateCoreBuffers = function (a) {
      console.assert(!this.transforms0);
      this.parent.vertices || this.parent.allocateCoreBuffers(a);
      a = 4 * this.instanceCount;
      this.transforms0 = new Float32Array(a);
      this.transforms1 = new Float32Array(a);
      this.transforms2 = new Float32Array(a);
      this._gpuSize += 12 * a;
  };
  WALK.InstancedGeometry.prototype.addCoreAttributes = function () {
      this.parent.attributes.position || this.parent.addCoreAttributes();
      for (var a = _.makeIterator(Object.keys(this.parent.attributes)), b = a.next(); !b.done; b = a.next()) (b = b.value), this.addAttribute(b, this.parent.attributes[b]);
      og(this, "t0", this.transforms0, 4, 1);
      og(this, "t1", this.transforms1, 4, 1);
      og(this, "t2", this.transforms2, 4, 1);
      this.transforms2 = this.transforms1 = this.transforms0 = null;
  };
  WALK.InstancedGeometry.prototype.allocateUv0 = function () {
      this.parent.uvs0 || this.parent.allocateUv0();
  };
  WALK.InstancedGeometry.prototype.addUv0Attribute = function () {
      this.parent.attributes.uv || this.parent.addUv0Attribute();
      this.addAttribute("uv", this.parent.attributes.uv);
  };
  WALK.InstancedGeometry.prototype.allocateUv1 = function () {
      console.assert(!this.uvs1Mod);
      this.parent.uvs1 || this.parent.allocateUv1();
      this.uvs1Mod = new Float32Array(4 * this.instanceCount);
      this._gpuSize += 16 * this.instanceCount;
  };
  WALK.InstancedGeometry.prototype.addUv1Attribute = function () {
      this.parent.attributes.uv2 || this.parent.addUv1Attribute();
      this.addAttribute("uv2", this.parent.attributes.uv2);
      og(this, "uv2Mod", this.uvs1Mod, 4, 1);
      this.uvs1Mod = null;
  };
  WALK.InstancedGeometry.prototype.computeBoundingBox = void 0;
  WALK.InstancedGeometry.prototype.computeBoundingSphere = void 0;
  Object.defineProperty(WALK.InstancedGeometry.prototype, "index", {
      get: function () {
          return this.parent.index;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "vertices", {
      get: function () {
          return this.parent.vertices;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "normals", {
      get: function () {
          return this.parent.normals;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "uvs0", {
      get: function () {
          return this.parent.uvs0;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "uvs1", {
      get: function () {
          return this.parent.uvs1;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "indexUint", {
      get: function () {
          return this.parent.indexUint;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "vertexCnt", {
      get: function () {
          return this.parent.vertexCnt;
      },
      set: function (a) {
          this.parent.vertexCnt = a;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "indexCnt", {
      get: function () {
          return this.parent.indexCnt;
      },
      set: function (a) {
          this.parent.indexCnt = a;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "gpuSize", {
      get: function () {
          return this.ownsGpuBuffers ? this._gpuSize + this.parent.gpuSize : this._gpuSize;
      },
  });
  Object.defineProperty(WALK.InstancedGeometry.prototype, "isUvs0Repeating", {
      get: function () {
          return this.parent.isUvs0Repeating;
      },
      set: function (a) {
          this.parent.isUvs0Repeating = a;
      },
  });
  WALK.SubGeometry = function (a, b, c, d, e, f, g) {
      THREE.BufferGeometry.call(this);
      this.indexCnt = a;
      this.vertexCnt = b;
      this.parent = c;
      this.vertexOffset = e;
      this.indexOffset = d;
      this.boundingBox = f;
      this.boundingSphere = g;
      this.isInstanced = c.isInstanced;
      this.instanceId = 0;
      this.instanceCount = 1;
  };
  WALK.SubGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  WALK.SubGeometry.prototype.constructor = WALK.SubGeometry;
  Object.defineProperty(WALK.SubGeometry.prototype, "attributes", {
      get: function () {
          return this.parent.attributes;
      },
  });
  Object.defineProperty(WALK.SubGeometry.prototype, "attributesKeys", {
      get: function () {
          return this.parent.attributesKeys;
      },
  });
  Object.defineProperty(WALK.SubGeometry.prototype, "indexUint", {
      get: function () {
          return this.parent.indexUint;
      },
  });
  Object.defineProperty(WALK.SubGeometry.prototype, "isUvs0Repeating", {
      get: function () {
          return this.parent.isUvs0Repeating;
      },
  });
  WALK.SubGeometry.prototype.computeBoundingBox = void 0;
  WALK.SubGeometry.prototype.computeBoundingSphere = void 0;
  WALK.SubGeometry.prototype.addTriangleOrderAttribute = function () {
      this.parent.addTriangleOrderAttribute();
  };
  var pg = null,
      qg = null,
      rg = new THREE.Vector3(),
      sg = new THREE.Quaternion();
  WALK.CameraVolume = function (a) {
      this.id = a.id;
      this.name = a.name;
      this._type = a.type;
      console.assert(0 <= WALK.CameraVolume.CameraVolumeTypes.indexOf(this._type));
      this.position = new THREE.Vector3().fromArray(a.position);
      this.rotation = new WALK.Euler().setFromDegTriple(a.rotation);
      this.scale = new THREE.Vector3().fromArray(a.scale);
      this.exposure = a.exposure;
      this.gamma = a.gamma;
      this._inverse = new THREE.Matrix4();
      this._inverseDirty = !0;
  };
  function tg(a) {
      a.dispatchEvent({ type: "updated", target: a });
  }
  WALK.CameraVolume.CameraVolumeTypes = ["cube", "sphere"];
  WALK.CameraVolume.prototype = {
      constructor: WALK.CameraVolume,
      getVolumeGeometry: function () {
          pg || ((pg = new THREE.BoxBufferGeometry(2, 2, 2)), pg.addTriangleOrderAttribute(), pg.convertNormalsToSpherical(), (qg = new THREE.IcosahedronBufferGeometry(1, 2)), qg.addTriangleOrderAttribute(), qg.convertNormalsToSpherical());
          return "sphere" === this._type ? qg : pg;
      },
      setName: function (a) {
          this.name = a;
          tg(this);
      },
      setPosition: function (a, b, c) {
          this.position.set(a, b, c);
          this._inverseDirty = !0;
          tg(this);
      },
      setRotation: function (a, b, c) {
          this.rotation.yaw = WALK.normalizeRotation(a);
          this.rotation.pitch = WALK.normalizeRotation(b);
          this.rotation.roll = WALK.normalizeRotation(c);
          this._inverseDirty = !0;
          tg(this);
      },
      setRotationDeg: function (a, b, c) {
          a = THREE.Math.degToRad(a);
          b = THREE.Math.degToRad(b);
          c = THREE.Math.degToRad(c);
          this.setRotation(a, b, c);
      },
      setScale: function (a, b, c) {
          this.scale.set(a, b, c);
          this._inverseDirty = !0;
          tg(this);
      },
      setExposure: function (a) {
          this.exposure = a;
          tg(this);
      },
      setGamma: function (a) {
          this.gamma = a;
          tg(this);
      },
      worldCoordinatesInside: function (a) {
          this._inverseDirty && ((this._inverseDirty = !1), this._inverse.compose(this.position, sg.setFromEuler(this.rotation), this.scale), this._inverse.getInverse(this._inverse));
          rg.copy(a).applyMatrix4(this._inverse);
          return "sphere" === this._type ? 1 >= rg.lengthSq() : 1 >= Math.abs(rg.x) && 1 >= Math.abs(rg.y) && 1 >= Math.abs(rg.z);
      },
      serialize: function () {
          return { id: this.id, name: this.name, type: this._type, position: this.position.toArray(), rotation: this.rotation.toDegTriple(), scale: this.scale.toArray(), exposure: this.exposure, gamma: this.gamma };
      },
      dispose: function () {},
  };
  THREE.EventDispatcher.prototype.apply(WALK.CameraVolume.prototype);
  var ug = 512 - 2 * Math.floor(512 * (0.5 - 0.5 * Math.sin(((70 / 180) * Math.PI) / 2))),
      vg = null,
      wg,
      xg,
      yg = null,
      zg;
  function Ag(a) {
      (vg && yg === a.id) ||
          ((vg = new THREE.SphereBufferGeometry(1, 32, 16)),
          vg.convertNormalsToSpherical(),
          (wg = new THREE.PlaneBufferGeometry(1, 1)),
          wg.convertNormalsToSpherical(),
          (xg = new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 16, 1)),
          zg || ((zg = new THREE.Matrix4()), zg.makeRotationX(Math.PI / 2)),
          xg.applyMatrix(zg),
          xg.convertNormalsToSpherical(),
          (yg = a.id));
  }
  var Bg = new THREE.Color();
  function Cg(a, b, c, d) {
      var e = WALK.SPRITE_ANCHOR_FONT_SIZE,
          f = a.getContext("2d");
      f.font = "400 " + e + "px " + c;
      for (var g = b, h = b.length - 1, l; ; ) {
          l = f.measureText(g).width;
          l += 2 * d;
          if (2048 >= l) break;
          g = b.substring(0, h) + "...";
          --h;
      }
      a.width = l;
      a.height = 1.5 * e;
      f = a.getContext("2d");
      f.font = "400 " + e + "px " + c;
      return [f, g];
  }
  function Dg(a, b, c) {
      var d = a.getContext("2d");
      d.fillStyle = b;
      c
          ? ((b = a.width),
            (a = a.height),
            (c = 0.5 * c * Math.min(b, a)),
            d.beginPath(),
            d.moveTo(0 + c, 0),
            d.lineTo(0 + b - c, 0),
            d.quadraticCurveTo(0 + b, 0, 0 + b, 0 + c),
            d.lineTo(0 + b, 0 + a - c),
            d.quadraticCurveTo(0 + b, 0 + a, 0 + b - c, 0 + a),
            d.lineTo(0 + c, 0 + a),
            d.quadraticCurveTo(0, 0 + a, 0, 0 + a - c),
            d.lineTo(0, 0 + c),
            d.quadraticCurveTo(0, 0, 0 + c, 0),
            d.closePath(),
            d.fill())
          : d.fillRect(0, 0, a.width, a.height);
  }
  function Eg(a, b, c, d, e) {
      function f(a) {
          var b = d ? 512 : 2048,
              c = a.naturalWidth;
          a = a.naturalHeight;
          c >= a && c > b ? ((a = (a / c) * b), (c = b)) : a > c && a > b && ((c = (c / a) * b), (a = b));
          return [Math.round(c), Math.round(a)];
      }
      var g = this;
      ob.call(this);
      this.hasAlpha = e;
      WALK.queueImageGet(
          WALK.LOAD_PRIORITY.CORE_RESOURCE,
          a,
          function (a) {
              var d = _.makeIterator(f(a));
              g.width = d.next().value;
              g.height = d.next().value;
              (THREE.Math.isPowerOfTwo(g.width) && THREE.Math.isPowerOfTwo(g.height)) || (g.minFilter = GLC.LINEAR);
              d = g.width;
              var e = g.height,
                  h = document.createElement("canvas");
              h.width = d;
              h.height = e;
              Dg(h, b, c);
              h.getContext("2d").drawImage(a, 0, 0, d, e);
              g.image = h;
              g.needsUpdate = !0;
              g.notifyLoaded();
          },
          function () {
              console.log("Failed to load trigger image: " + a);
          }
      );
  }
  Eg.prototype = Object.create(ob.prototype);
  Eg.prototype.constructor = Eg;
  Eg.prototype.serialize = function () {
      console.assert("Anchor texture serialize is not suported");
  };
  Eg.prototype.clone = function () {
      console.assert("Anchor texture clone is not supported");
  };
  var Fg = new Map();
  function Gg(a) {
      var b = a.icon && WALK.ICONS[a.icon],
          c = b ? b.value : a.text,
          d = a.image || "",
          e = b ? b.fontFamily : "Open Sans",
          f = a.color || "#4c9ed9";
      var g = a.opacity;
      void 0 === g || 1 <= g ? (g = f) : (Bg.setStyle(f), (g = "rgba(" + ((255 * Bg.r) | 0) + "," + ((255 * Bg.g) | 0) + "," + ((255 * Bg.b) | 0) + "," + g + ")"));
      var h = g;
      g = a.textColor || "#ffffff";
      var l = void 0 !== a.opacity && 1 > a.opacity,
          m = "sphere" === a.type;
      b = [b || "", c || "", d, e, h, g, m, 20, a.borderRadius || 0, l].join("_");
      var n = Fg.get(b);
      if (n) return n.usedTimes++, [f, g, b, n.texture];
      d
          ? (l = new Eg(a.image, h, a.borderRadius, m, l))
          : ((d = a.borderRadius),
            (a = document.createElement("canvas")),
            m
                ? ((n = c),
                  (a.width = 512),
                  (a.height = 512),
                  (m = a.getContext("2d")),
                  (m.font = "400 128px " + e),
                  (n = m.measureText(n).width),
                  (n = Math.floor((ug / n) * 128)),
                  (n = Math.min(n, ug)),
                  (m.font = "400 " + n + "px " + e),
                  (e = m))
                : ((c = _.makeIterator(Cg(a, c, e, 20))), (e = c.next().value), (c = c.next().value)),
            Dg(a, h, d),
            (e.fillStyle = g),
            (e.textAlign = "center"),
            (e.textBaseline = "middle"),
            (e.shadowColor = "black"),
            (e.shadowBlur = 16),
            e.fillText(c, a.width / 2, a.height / 2),
            (e = new ob(a)),
            (e.width = a.width),
            (e.height = a.height),
            (e.hasAlpha = l),
            (e.minFilter = GLC.LINEAR),
            (e.loaded = !0),
            (e.needsUpdate = !0),
            (l = e));
      Fg.set(b, { usedTimes: 1, texture: l });
      return [f, g, b, l];
  }
  WALK.Anchor = function (a, b) {
      var c = this;
      Ag(a);
      var d = new THREE.Vector3();
      d.fromArray(b.position);
      var e = _.makeIterator(Gg(b)),
          f = e.next().value,
          g = e.next().value,
          h = e.next().value;
      e = e.next().value;
      this._textureSignature = h;
      var l = new THREE.Color();
      l.setStyle(f);
      l.convertGammaToLinear();
      Object.defineProperty(this, "color", {
          get: function () {
              return l;
          },
      });
      var m = new THREE.Color();
      m.setStyle(g);
      m.convertGammaToLinear();
      Object.defineProperty(this, "textColor", {
          get: function () {
              return m;
          },
      });
      var n;
      if ("sphere" === b.type) {
          f = vg;
          var p = new WALK.AnchorMaterial();
          a = a.closestLightProbe(d);
          b.image || (p.bumpTexture = e);
          p.disableLightProbe = null === a || !a.texturesReady();
          p.headLight = !0;
      } else {
          f = wg;
          p = new WALK.SpriteMaterial();
          a = null;
          p.disableLightProbe = !0;
          p.headLight = !1;
          p.specularOff = 1;
          var r = new THREE.Mesh(xg, null);
      }
      p.baseColor = l;
      p.baseColorTexture = e;
      p.configureTransparency();
      p.setUniforms();
      THREE.Mesh.call(this, f, p);
      this.visible = !1;
      this.position.copy(d);
      this.lightProbe = a;
      r ? (r.position.copy(d), (this.colliderMesh = r), (this.colliderMesh.visible = !1)) : (this.colliderMesh = this);
      this.colliderMesh.visibilityId = null;
      this.colliderMesh.anchor = this;
      e.addLoadedListener(function () {
          n = "sphere" === b.type ? [b.radius, b.radius, b.radius] : [(p.baseColorTexture.width / p.baseColorTexture.height) * b.height, b.height, 1];
          c.scale.fromArray(n);
          c.updateMatrixWorld(!0);
          if (r) {
              var a = Math.max(n[0], n[1]);
              r.scale.fromArray([a, a, b.height]);
              r.updateMatrixWorld(!0);
              r.visible = !0;
          }
          c.visible = !0;
          WALK.getViewer().requestFrame();
      });
      this.extension = null;
  };
  WALK.Anchor.prototype = Object.create(THREE.Mesh.prototype);
  WALK.Anchor.prototype.dispose = function () {
      var a = this.material;
      a.dispose();
      var b = this._textureSignature,
          c = Fg.get(b),
          d = c.texture;
      console.assert(a.baseColorTexture === d);
      setTimeout(function () {
          c.usedTimes--;
          0 === c.usedTimes && (d.dispose(), Fg.delete(b));
      }, 5e3);
  };
  WALK.Anchor.prototype.enableLightProbe = function () {
      if (this.lightProbe) {
          console.assert(this.lightProbe.texturesReady());
          var a = this.material;
          a.disableLightProbe = !1;
          a.setUniforms();
      }
  };
  var Hg = null,
      Ig = !1,
      Jg = [
          { name: "mainMaterial", baseColor: [0.5, 0.5, 0.5], roughness: 0.7, metallic: 1 },
          { name: "displayMaterial", baseColor: [0, 0, 0], roughness: 0.001, metallic: 0 },
      ],
      Kg = { sphere: null, cylinder: null, head: [], torso: [], displayPortrait: [], displayLandscape: [] },
      Lg = {};
  function Mg(a) {
      (Kg.plane && Hg === a.id) ||
          ((Kg.sphere = new THREE.SphereBufferGeometry(0.08, 32, 16)), Kg.sphere.convertNormalsToSpherical(), (Kg.cylinder = new THREE.CylinderBufferGeometry(0.005, 0.005, 1, 3)), Kg.cylinder.convertNormalsToSpherical(), (Hg = a.id));
  }
  function Ng(a, b, c) {
      var d = new THREE.Box3();
      Kg.head.forEach(function (a) {
          d.union(a.geometry.boundingBox);
      });
      return new WALK.Anchor(a, { type: "sprite", position: [0, 0, 0.1 + (d.max.z - d.min.z) / 2], height: 0.1, text: b, textColor: c, opacity: 0 });
  }
  function Og(a) {
      a = new THREE.Mesh(Kg.sphere, a);
      a.scale.set(0.4, 0.4, 0.4);
      a.visible = !1;
      return a;
  }
  function Pg(a) {
      var b = new WALK.StandardMaterial();
      b.headLight = !1;
      b.baseColor.setStyle(a).convertGammaToLinear();
      b.transparent = !0;
      b.opacity = 0.5;
      b.emissive = !0;
      b.disableLightProbe = !0;
      b.setUniforms();
      a = new THREE.Mesh(Kg.cylinder, b);
      a.visible = !1;
      return a;
  }
  function Qg(a) {
      var b = new WALK.StandardMaterial();
      b.baseColor.fromArray(a.baseColor);
      b.roughness = a.roughness || 1;
      b.metallic = a.metallic || 0;
      b.opacity = a.opacity || 1;
      b.highlight = new THREE.Color(16777215);
      b.highlightMix = 0;
      b.baseColorTexture = a.baseColorTexture || null;
      b.disableLightProbe = a.disableLightProbe || !1;
      b.headLight = a.headLight || !1;
      b.setUniforms();
      return b;
  }
  function Rg(a, b) {
      a && Jg.push.apply(Jg, _.arrayFromIterable(a));
      Jg.forEach(function (a) {
          if (a.baseColorTexture) {
              var c = new Image();
              c.src = b + a.baseColorTexture.file;
              a.baseColorTexture = WALK.getViewer().createTextureFromHtmlImage(c);
          }
          Lg[a.name] = Qg(a);
      });
  }
  WALK.setAvatarModel = function (a, b, c) {
      Ig = b.displayLookAtCamera || !1;
      var d = b.meshes;
      d.length !== c.size && console.warn("Mismatch between avatar meshes count and geometries map size");
      d = _.makeIterator(d);
      for (var e = d.next(); !e.done; e = d.next()) {
          e = e.value;
          c.has(e.geometryName) || console.assert(!1, 'Avatar "' + e.geometryName + '" mesh is missing');
          var f = { materialName: e.materialName ? e.materialName : "mainMaterial", geometry: c.get(e.geometryName) };
          Kg[e.group].push(f);
      }
      Rg(b.materials, a);
  };
  WALK.Avatar = function (a, b, c) {
      function d(a, b) {
          Kg[b].forEach(function (b) {
              a: {
                  var c = b.materialName;
                  switch (c) {
                      case "mainMaterial":
                          c = e.mainMaterial;
                          break a;
                      case "displayMaterial":
                          c = e.displayMaterial;
                          break a;
                      default:
                          c = Lg[c];
                  }
              }
              b = new THREE.Mesh(b.geometry, c);
              a.add(b);
              b.visibilityId = null;
              e.colliders.push(b);
          });
      }
      var e = this;
      THREE.Object3D.call(this);
      this.uuid = b;
      this.displayName = c.displayName;
      this._scene = a;
      this._lastLightProbeCheckPosition = new THREE.Vector3(0, 0, 0);
      this.colliders = [];
      Mg(a);
      this._haveLightProbe = 0 < this._scene.lightProbes.length;
      b = _.makeIterator(Object.values(Lg));
      for (var f = b.next(); !f.done; f = b.next()) (f = f.value), (f.disableLightProbe = !this._haveLightProbe), (f.headLight = this._haveLightProbe), f.setUniforms();
      this.mainMaterial = Qg(Lg.mainMaterial);
      Ig ? ((this.displayMaterial = new WALK.SpriteMaterial()), (this.displayMaterial.specularOff = 1)) : (this.displayMaterial = Qg(Lg.displayMaterial));
      this.mainMaterial.baseColor.setStyle(c.color).convertGammaToLinear();
      this._body = new THREE.Object3D();
      this._head = new THREE.Object3D();
      this._head.rotation.order = "ZXY";
      this._torso = new THREE.Object3D();
      this._displayLandscape = new THREE.Object3D();
      this._displayPortrait = new THREE.Object3D();
      d(this._head, "head");
      d(this._torso, "torso");
      d(this._displayLandscape, "displayLandscape");
      d(this._displayPortrait, "displayPortrait");
      this._pointer = Og(this.mainMaterial);
      this._pointerLeaderStartOffset = new THREE.Vector3(0, 0.3, -0.35);
      this._pointerLeader = Pg(c.color);
      this._displayNameAnchor = Ng(a, c.displayName, c.color);
      this._body.add(this._torso);
      this._body.add(this._head);
      Ig ? (this.add(this._displayLandscape), this.add(this._displayPortrait)) : (this._head.add(this._displayLandscape), this._head.add(this._displayPortrait));
      this.add(this._body);
      this.add(this._displayNameAnchor);
      this.add(this._pointerLeader);
      this.add(this._pointer);
      c.position && this.position.fromArray(c.position);
      this.updateMatrixWorld(!0);
      this._setClosestLightProbe();
      if (Ig) {
          var g = new THREE.Box3();
          this._displayLandscape.children.forEach(function (a) {
              g.union(a.geometry.boundingBox);
          });
          this.displayMaterial.offset = g.center();
      }
      this._videoTexture1 = this._videoTexture0 = null;
      this._landscape = !0;
      this._displayLandscape.visible = !Ig;
      this._displayPortrait.visible = !1;
      this._soundThreshold = 140;
      this._maxHighlight = 0.5;
      this._highlightStepDown = 0.05;
  };
  WALK.Avatar.prototype = Object.create(THREE.Object3D.prototype);
  WALK.Avatar.prototype.constructor = WALK.Avatar;
  WALK.Avatar.prototype.switchToPortrait = function () {
      this._landscape && ((this._landscape = !1), (this._displayLandscape.visible = !1), (this._displayPortrait.visible = !0), Ig || ((this._head.rotation.y = Math.PI / 2), (this._torso.position.z -= 0.05)));
  };
  WALK.Avatar.prototype.switchToLandscape = function () {
      this._landscape || ((this._landscape = !0), (this._displayLandscape.visible = !0), (this._displayPortrait.visible = !1), Ig || ((this._head.rotation.y = 0), (this._torso.position.z += 0.05)));
  };
  WALK.Avatar.prototype.hideBody = function () {
      this.traverse(function (a) {
          return (a.visible = !1);
      });
      this.visible = !0;
      this._pointer.visible = !0;
      this._pointerLeader.visible = !0;
  };
  WALK.Avatar.prototype._updated = function () {
      this.dispatchEvent({ type: "avatarUpdated", target: this });
  };
  WALK.Avatar.prototype.rotate = function (a, b) {
      this._body.rotation.z = a;
      this._head.rotation.x = b;
  };
  WALK.Avatar.prototype.setOrientation = function () {
      this._videoTexture0.width < this._videoTexture0.height ? this.switchToPortrait() : this.switchToLandscape();
  };
  WALK.Avatar.prototype.onVideoStreamStart = function () {
      Ig && ((this._displayLandscape.visible = !0), (this._displayPortrait.visible = !1));
  };
  WALK.Avatar.prototype.onVideoStreamStop = function () {
      Ig ? ((this._displayLandscape.visible = !1), (this._displayPortrait.visible = !1)) : this.switchToLandscape();
  };
  WALK.Avatar.prototype.setVideoTexture0 = function (a) {
      var b = this;
      this._videoTexture0 && (this._videoTexture0.dispose(), (this._videoTexture0 = null));
      this._haveLightProbe && (this.displayMaterial.disableLightProbe = !1);
      this.displayMaterial.baseColorTexture = null;
      this._updated();
      a
          ? (this.onVideoStreamStart(),
            a.addLoadedListener(function () {
                b._videoTexture0 = a;
                b.setOrientation();
                b.displayMaterial.disableLightProbe = !0;
                b.displayMaterial.baseColorTexture = a;
                a.addResizedListener(function () {
                    b.setOrientation();
                    b._updated();
                });
                b._updated();
            }))
          : (this.onVideoStreamStop(), this._updated());
  };
  WALK.Avatar.prototype.getVideoTexture0 = function () {
      return this._videoTexture0;
  };
  WALK.Avatar.prototype.setVideoTexture1 = function (a) {
      var b = this;
      this._videoTexture1 && (this._videoTexture1.dispose(), (this._videoTexture1 = null), this._updated());
      a &&
          a.addLoadedListener(function () {
              b._videoTexture1 = a;
              b._updated();
          });
  };
  WALK.Avatar.prototype.getVideoTexture1 = function () {
      return this._videoTexture1;
  };
  WALK.Avatar.prototype.getMainMaterial = function () {
      return this.mainMaterial;
  };
  WALK.Avatar.prototype._setClosestLightProbe = function () {
      var a = this._scene.closestLightProbe(this.position);
      if (a !== this._head.children[0].lightProbe) {
          for (var b = _.makeIterator([this._head, this._torso, this._displayPortrait, this._displayLandscape]), c = b.next(); !c.done; c = b.next())
              c.value.children.forEach(function (b) {
                  b.lightProbe = a;
              });
          this._pointer.lightProbe = a;
          this._pointerLeader.lightProbe = a;
      }
  };
  WALK.Avatar.prototype.setPositionFromArray = function (a) {
      this.position.fromArray(a);
      0.5 < this._lastLightProbeCheckPosition.distanceTo(this.position) && (this._lastLightProbeCheckPosition.copy(this.position), this._setClosestLightProbe(this.position));
  };
  WALK.Avatar.prototype.placePointer = (function () {
      var a = new THREE.Matrix4(),
          b = new THREE.Vector3(),
          c = new THREE.Vector3(),
          d = new THREE.Vector3(),
          e = new THREE.Vector3(),
          f = new THREE.Matrix4(),
          g = new THREE.Matrix4();
      g.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
      var h = new THREE.Matrix4();
      return function (l, m, n) {
          this._pointer.position.set(l - this.position.x, m - this.position.y, n - this.position.z);
          this._pointer.visible = !0;
          a.makeRotationZ(this._body.rotation.z);
          b.set(this._pointerLeaderStartOffset.x, this._pointerLeaderStartOffset.y, this._pointerLeaderStartOffset.z);
          b.applyMatrix4(a);
          c.set(this.position.x, this.position.y, this.position.z).add(b);
          d.set(l, m, n);
          e.set(l, m, n).sub(c);
          h.makeScale(1, e.length(), 1);
          f.lookAt(c, d, THREE.Object3D.DefaultUp);
          f.multiply(g);
          h.multiplyMatrices(f, h);
          e.divideScalar(2).add(b);
          h.setPosition(e);
          this._pointerLeader.matrix.identity();
          this._pointerLeader.applyMatrix(h);
          this._pointerLeader.visible = !0;
      };
  })();
  WALK.Avatar.prototype.hidePointer = function () {
      this._pointerLeader.visible = !1;
      this._pointer.visible = !1;
  };
  WALK.Avatar.prototype.onSoundVolumeUpdated = function (a) {
      null !== a && ((a = this._computeHighlighMix(a)), this.getMainMaterial().highlightMix !== a && ((this.getMainMaterial().highlightMix = a), WALK.getViewer().requestFrame()));
  };
  WALK.Avatar.prototype.onSoundSwitchedOff = function () {
      0 < this.getMainMaterial().highlightMix && ((this.getMainMaterial().highlightMix = 0), WALK.getViewer().requestFrame());
  };
  WALK.Avatar.prototype._computeHighlighMix = function (a) {
      var b = this.getMainMaterial().highlightMix;
      if (a < this._soundThreshold) return 0 < b ? Math.max(0, b - this._highlightStepDown) : 0;
      a = ((a - this._soundThreshold) / (255 - this._soundThreshold)) * this._maxHighlight;
      return a > b ? a : Math.max(a, b - this._highlightStepDown);
  };
  WALK.Avatar.prototype.dispose = function () {
      this.mainMaterial.dispose();
      this.displayMaterial.dispose();
      this._videoTexture0 && this._videoTexture0.dispose();
      this._videoTexture1 && this._videoTexture1.dispose();
      this._displayNameAnchor.dispose();
      this.dispatchEvent({ type: "dispose" });
  };
  var Sg, Tg, Ug, Vg;
  function Wg(a, b, c, d, e) {
      c = new THREE.SphereBufferGeometry(c, 32, 16);
      c.changePosition(d);
      c.computeBoundingSphere();
      c.convertNormalsToSpherical();
      d = new WALK.Mesh(null, c, b);
      b.lightMapped && (d.lightMap = e);
      a.camera.getWorldPosition(Vg);
      d.lightProbe = a.closestLightProbe(Vg);
      d.frustumCulled = !1;
      d.userData.hideFromLightProbes = !0;
      return d;
  }
  var Xg = new THREE.Matrix4(),
      jh = new THREE.Vector2();
  function kh(a) {
      Sg.setRGB(a, a, a);
      a = WALK.ColorUtils.hdrEncode(Sg, Tg);
      var b = new Uint8Array(4);
      b[0] = Math.round(255 * Tg.r);
      b[1] = Math.round(255 * Tg.g);
      b[2] = Math.round(255 * Tg.b);
      b[3] = Math.round(255 * a);
      a = new qb(b, 1, 1);
      a.magFilter = GLC.NEAREST;
      a.minFilter = GLC.NEAREST;
      a.anisotropy = WALK.NO_ANISOTROPY;
      a.hasAlpha = !0;
      a.isRgbm = !0;
      a.loaded = !0;
      a.needsUpdate = !0;
      return a;
  }
  WALK.MaterialPicker = function (a, b, c, d, e, f, g) {
      function h() {
          return m(!1);
      }
      function l() {
          return m(!0);
      }
      function m(a) {
          p.forEach(function (b) {
              return b(a);
          });
      }
      var n = this;
      this.lightMap = null;
      this.meshes = [];
      var p = [],
          r = Math.max(2 * d.camera.near, 0.1);
      Sg || ((Sg = new THREE.Color()), (Tg = new THREE.Color()), (Vg = new THREE.Vector3()), (Ug = new THREE.Vector3()), (Vg = new THREE.Vector3()));
      var q = d.camera.aspect,
          u = Math.tan(THREE.Math.degToRad(d.camera.fov / 2)) * r,
          v = -u;
      q = Math.abs(q * u - q * v);
      u = Math.abs(u - v);
      var w = 0.01 * q,
          y = (q - a.length * w - w) / (2 * a.length);
      y = Math.min(y, (WALK.MATERIAL_PICKER_BALL_MAX_SIZE / 2) * q);
      var z = (a.length / 2) * -(2 * y + w) + y + w;
      v = document.getElementById("menu-bar").getBoundingClientRect().top;
      var x = -u / 2 + ((window.innerHeight - v) / window.innerHeight) * u + y + w;
      a.some(function (a) {
          return a.lightMapped;
      }) && ((f = f.measureIncidentLuma()), 0 > f && (f = 1), (this.lightMap = kh(f)));
      a.forEach(function (a, f) {
          if (a) {
              Ug.set(z, x, -r);
              var g = Wg(d, a, y, Ug, n.lightMap);
              z += 2 * y + w;
              var h = null;
              b &&
                  ((h = new THREE.Matrix4()),
                  h.multiply(Xg.makeTranslation(b.x, b.y, b.z)),
                  (a = e.cameraWorldPosition()),
                  (jh.x = a.x - b.x),
                  (jh.y = a.y - b.y),
                  h.multiply(Xg.makeRotationZ(Math.abs(jh.y) > Math.abs(jh.x) ? (0 < jh.x ? 0 : -Math.PI) : 0 < jh.y ? Math.PI / 2 : -Math.PI / 2)),
                  h.multiply(Xg.makeRotationX(-Math.PI / 2)),
                  h.multiply(Xg.makeScale(c, c, c)),
                  h.multiply(Xg.makeTranslation(2.1 * (f + 1), 0, 0)),
                  h.multiply(Xg.makeScale(1 / y, 1 / y, 1 / y)),
                  h.multiply(Xg.makeTranslation(-Ug.x, -Ug.y, -Ug.z)));
              n.meshes.push(g);
              p.push(function (a) {
                  a && h ? ((g.matrix = h), (g.matrixWorld = h)) : ((g.matrix = d.camera.matrix), (g.matrixWorld = d.camera.matrixWorld));
              });
          }
      });
      g.addEventListener("modeEnabled", l);
      g.addEventListener("modeDisabled", h);
      this.dispose = function () {
          p.length = 0;
          g.removeEventListener("modeEnabled", l);
          g.removeEventListener("modeDisabled", h);
          this.meshes.forEach(function (a) {
              return a.geometry.dispose();
          });
          this.meshes = null;
          this.lightMap && (this.lightMap.dispose(), (this.lightMap = null));
      };
      m(g.modeIsEnabled());
  };
  function lh(a, b, c) {
      function d() {
          p.set({ x: b.min.x, y: b.min.y }, { x: b.max.x, y: b.max.y });
      }
      function e() {
          var a = p.center(),
              b = Math.abs(Math.sin(m)),
              c = Math.abs(Math.cos(m)),
              d = Math.abs(p.max.x - p.min.x),
              e = Math.abs(p.max.y - p.min.y),
              f = d * c + e * b;
          b = d * b + e * c;
          q.set({ x: a.x - f / 2, y: a.y + b / 2 }, { x: a.x + f / 2, y: a.y - b / 2 });
      }
      function f() {
          var a = Math.abs(b.min.x - b.max.x),
              c = Math.abs(b.min.y - b.max.y);
          a = p.size().x / a;
          c = p.size().y / c;
          a > c ? r.set(1, c / a) : r.set(a / c, 1);
      }
      var g = a.name || "level",
          h = a.slicePlaneHeight,
          l = a.farPlaneHeight,
          m = a.rotation || 0,
          n = !!a.cropRange,
          p = a.cropRange ? new THREE.Box2(new THREE.Vector2().fromArray(a.cropRange.min), new THREE.Vector2().fromArray(a.cropRange.max)) : new THREE.Box2(),
          r = new THREE.Vector2(1, 1),
          q = new THREE.Box2();
      n && f();
      this.setRange = function (a, b, d) {
          a > p.max[d] && (a = p.max[d]);
          b < p.min[d] && (b = p.min[d]);
          p.min[d] = a;
          p.max[d] = b;
          e();
          f();
          c();
      };
      this.serialize = function () {
          var a = n ? { min: p.min.toArray(), max: p.max.toArray() } : null;
          return { name: g, slicePlaneHeight: h, farPlaneHeight: l, cropRange: a, rotation: m };
      };
      Object.defineProperty(this, "name", {
          get: function () {
              return g;
          },
          set: function (a) {
              g = a ? a.trim() || "level" : "level";
              c();
          },
      });
      Object.defineProperty(this, "slicePlaneHeight", {
          get: function () {
              return h;
          },
          set: function (a) {
              a >= l && ((h = a), c());
          },
      });
      Object.defineProperty(this, "farPlaneHeight", {
          get: function () {
              return l;
          },
          set: function (a) {
              a <= h && ((l = a), c());
          },
      });
      Object.defineProperty(this, "crop", {
          get: function () {
              return n;
          },
          set: function (a) {
              (n = a) || d();
              e();
              f();
              c();
          },
      });
      Object.defineProperty(this, "cropRange", {
          get: function () {
              p.empty() && d();
              return p;
          },
      });
      Object.defineProperty(this, "visibleRange", {
          get: function () {
              q.empty() && e();
              return q;
          },
      });
      Object.defineProperty(this, "ratio", {
          get: function () {
              (0 !== r.x && 0 !== r.y && isNaN(r.x) && isNaN(r.y)) || f();
              return r;
          },
      });
      Object.defineProperty(this, "rotation", {
          get: function () {
              return m;
          },
          set: function (a) {
              m = a;
              n || d();
              e();
              f();
              c();
          },
      });
      Object.defineProperty(this, "rotationDeg", {
          get: function () {
              return THREE.Math.radToDeg(this.rotation);
          },
          set: function (a) {
              this.rotation = THREE.Math.degToRad(a);
          },
      });
  }
  WALK.MinimapConfig = function (a, b, c) {
      function d() {
          return h.dispatchEvent(l);
      }
      function e() {
          return new lh({ name: "level0", slicePlaneHeight: c ? c : b.min.z + WALK.FALLBACK_CAMERA_HEIGHT, farPlaneHeight: b.min.z }, b, d);
      }
      function f(a, c) {
          var e = "level" + a,
              f = q[a - 1];
          a = f.slicePlaneHeight + (b.max.z - f.slicePlaneHeight) / 2;
          var g = f.farPlaneHeight;
          f = f.rotation;
          c = c.crop ? { min: c.cropRange.min.toArray(), max: c.cropRange.max.toArray() } : null;
          return new lh({ name: e, slicePlaneHeight: a, farPlaneHeight: g, cropRange: c, rotation: f }, b, d);
      }
      function g() {
          return q.map(function (a) {
              return a.serialize();
          });
      }
      var h = this;
      a = void 0 !== a ? a : { enabled: !1, outlineColor: [0, 0, 0], outlineThickness: 1, fillEnabled: !0, levels: [] };
      var l = { type: "updated", target: this },
          m = a.enabled,
          n = new THREE.Color().fromArray(a.outlineColor),
          p = a.outlineThickness,
          r = a.fillEnabled,
          q = a.levels.map(function (a) {
              return new lh(a, b, d);
          });
      this.addLevel = function (a) {
          var b = q.length;
          0 === b ? q.push(e()) : q.push(f(b, a));
          d();
      };
      this.removeLevel = function (a) {
          WALK.removeFromArray(a, q);
          0 === q.length && q.push(e());
          d();
      };
      this.shiftLevel = function (a, b) {
          WALK.shiftItem(q, a, b);
          d();
      };
      this.setOutlineColorRGB = function (a, b, c) {
          n.setRGB(a, b, c);
          d();
      };
      this.serialize = function () {
          return { enabled: this.enabled, outlineColor: this.outlineColor.toArray(), outlineThickness: this.outlineThickness, fillEnabled: this.fillEnabled, levels: g() };
      };
      Object.defineProperty(this, "enabled", {
          get: function () {
              return m;
          },
          set: function (a) {
              a && 0 === q.length && this.addLevel();
              m = a;
              d();
          },
      });
      Object.defineProperty(this, "outlineColor", {
          get: function () {
              return n;
          },
      });
      Object.defineProperty(this, "outlineThickness", {
          get: function () {
              return p;
          },
          set: function (a) {
              p = a;
              d();
          },
      });
      Object.defineProperty(this, "fillEnabled", {
          get: function () {
              return r;
          },
          set: function (a) {
              r = a;
              d();
          },
      });
      Object.defineProperty(this, "levels", {
          get: function () {
              return q;
          },
      });
  };
  THREE.EventDispatcher.prototype.apply(WALK.MinimapConfig.prototype);
  function mh() {
      var a = new Set(),
          b = [];
      this.add = function (c) {
          c instanceof RegExp ? b.push(c) : a.add(c);
      };
      this.matchesAny = function (c) {
          return a.has(c)
              ? !0
              : b.some(function (a) {
                    return a.test(c);
                });
      };
  }
  function nh() {
      function a(a, b, c) {
          return (0 <= a ? a - 1 : a + b / c) * c;
      }
      var b = this,
          c = new THREE.Vector3(),
          d = new THREE.Vector3(),
          e = new THREE.Vector3(),
          f = new THREE.Vector3(),
          g = new THREE.Vector3();
      this.objects = [];
      var h = null;
      this.vertices = [];
      this.normals = [];
      this.uvs = [];
      this.startObject = function (a) {
          h = { name: a || "", vertices: [], normals: [], uvs: [], hasUvs: !1 };
          this.objects.push(h);
      };
      this.addFace = function (l, m, n, p, r, q, u, v, w) {
          var y = this.vertices.length;
          l = a(l, y, 3);
          m = a(m, y, 3);
          n = a(n, y, 3);
          y = b.vertices;
          var z = h.vertices;
          z.push(y[l + 0], y[l + 1], y[l + 2]);
          z.push(y[m + 0], y[m + 1], y[m + 2]);
          z.push(y[n + 0], y[n + 1], y[n + 2]);
          void 0 !== u
              ? ((l = this.normals.length),
                (u = a(u, l, 3)),
                (v = a(v, l, 3)),
                (w = a(w, l, 3)),
                (l = b.normals),
                (m = h.normals),
                m.push(l[u + 0], l[u + 1], l[u + 2]),
                m.push(l[v + 0], l[v + 1], l[v + 2]),
                m.push(l[w + 0], l[w + 1], l[w + 2]))
              : ((w = b.vertices),
                (v = h.normals),
                c.fromArray(w, l),
                d.fromArray(w, m),
                e.fromArray(w, n),
                g.subVectors(e, d),
                f.subVectors(c, d),
                g.cross(f),
                g.normalize(),
                v.push(g.x, g.y, g.z),
                v.push(g.x, g.y, g.z),
                v.push(g.x, g.y, g.z));
          void 0 !== p
              ? ((w = this.uvs.length), (p = a(p, w, 2)), (r = a(r, w, 2)), (q = a(q, w, 2)), (w = b.uvs), (v = h.uvs), v.push(w[p + 0], w[p + 1]), v.push(w[r + 0], w[r + 1]), v.push(w[q + 0], w[q + 1]), (h.hasUvs = !0))
              : ((q = h.uvs), q.push(0, 0), q.push(0, 0), q.push(0, 0));
      };
  }
  function oh(a) {
      if (void 0 !== a && "" !== a) return parseInt(a, 10);
  }
  var ph = "doubleSided name opacity parallaxCorrection parallaxMode parallaxScale parallaxMinLayers parallaxMaxLayers planarReflector".split(" "),
      qh = "bumpScale emissive emissionStrength envMapProject metallic roughness alphaInLowerHalf chromaKeyEnabled".split(" "),
      rh = "baseColor bumpScale bumpTexture doubleSided emissive metallic opacity roughness".split(" ");
  function sh(a, b, c) {
      for (var d = 0; d < b.length; d += 1) {
          var e = b[d],
              f = a[e];
          void 0 !== f && (c["_" + e] = f);
      }
  }
  function th(a, b, c) {
      var d = WALK.DETECTOR;
      this.load = function (e, f) {
          for (var g = new Map(), h = 0, l = 0; l < e.length; l += 1) {
              var m,
                  n = e[l];
              var p = WALK.createMaterialOfType(n.type);
              if ("water" === p.type)
                  (p.name = n.name),
                      n.normalTexture && (p.normalTexture = a.load(WALK.LOAD_PRIORITY.SPECULARITY, n.normalTexture, !0, !1, WALK.DEFAULT_ANISOTROPY)),
                      n.baseColor && p.baseColor.fromArray(n.baseColor),
                      void 0 !== n.opacity && (p.opacity = n.opacity),
                      sh(n, ["wavesSpeed", "wavesScale", "refractionFactor"], p),
                      p.setUniforms();
              else {
                  WALK.copyProperties(n, ph, p);
                  sh(n, qh, p);
                  n.baseColor && (p.baseColor.fromArray(n.baseColor), p.baseColor.roundChannels());
                  if ((m = n.baseColorTextureCorrection))
                      (p._baseColorTextureCorrection = !0),
                          void 0 !== m.contrast && (p._baseColorTextureContrast = m.contrast),
                          (p.baseColorTextureHslOffset.h = m.hslOffset[0]),
                          (p.baseColorTextureHslOffset.s = m.hslOffset[1]),
                          (p.baseColorTextureHslOffset.l = m.hslOffset[2]);
                  if ((m = n.baseColorTexture)) {
                      if (m.atlasId) {
                          var r = b[m.atlasId].getAtlasEntry(m.id, m.name, m.atlasOffset[0], m.atlasOffset[1], m.atlasScale[0], m.atlasScale[1]);
                          null !== r.rawExt && r.rawExt !== m.rawExt && console.warn("Atlas entries with not matching rawExt " + m.name);
                          r.rawExt = m.rawExt;
                          null !== r.stdExt && r.stdExt !== m.stdExt && console.warn("Atlas entries with not matching stdExt " + m.name);
                          r.stdExt = m.stdExt;
                          !1 === m.importGpuCompress && (r.importGpuCompress = !1);
                          !1 === m.importAutoScale && (r.importAutoScale = !1);
                          m = r;
                      } else m = a.load(WALK.LOAD_PRIORITY.DIFFUSE, m, !0, !0, WALK.DEFAULT_ANISOTROPY);
                      m.isCutout = null;
                      p.baseColorTexture = m;
                  }
                  n.roughnessTexture && (p.roughnessTexture = a.load(WALK.LOAD_PRIORITY.SPECULARITY, n.roughnessTexture, !0, !0, WALK.DEFAULT_ANISOTROPY));
                  n.metallicTexture && (p.metallicTexture = a.load(WALK.LOAD_PRIORITY.SPECULARITY, n.metallicTexture, !0, !0, WALK.DEFAULT_ANISOTROPY));
                  n.bumpTexture && d.gl.standardDerivatives && (p.bumpTexture = a.load(WALK.LOAD_PRIORITY.SPECULARITY, n.bumpTexture, !0, !0, WALK.DEFAULT_ANISOTROPY));
                  n.doNotImport && WALK.copyProperties(n.doNotImport, rh, p.doNotImport);
                  n.chromaKeyColor && (p.chromaKeyColor.fromArray(n.chromaKeyColor), p.chromaKeyColor.roundChannels());
                  n.chromaKeyDelta && p._chromaKeyDelta.fromArray(n.chromaKeyDelta);
                  n.uvOffsetScale && ((n = n.uvOffsetScale), p.setUvOffsetAndScale(n[0], n[1], n[2], n[3]));
              }
              if (!c.isMaterialEditable(p.name)) {
                  n = p.hash();
                  m = g.get(n) || [];
                  r = _.makeIterator(m);
                  for (var q = r.next(); !q.done; q = r.next())
                      if (((q = q.value), q.canMerge(p))) {
                          h += 1;
                          q.merged = !0;
                          p = q;
                          break;
                      }
                  p.merged || (m.push(p), g.set(n, m));
              }
              f.addMaterial(p);
              p.merged || p.setUniforms();
          }
          WALK.log("Have " + e.length + " materials and " + (e.length - h) + " merged materials.");
      };
  }
  function uh(a, b, c) {
      function d() {
          --f;
          if (0 === f) e.onComplete();
      }
      var e = this,
          f = b;
      this.lightmaps = [];
      this.onComplete = null;
      this.load = function () {
          var e;
          if ((e = WALK.DETECTOR.webp)) e = void 0 !== c && void 0 !== c.formats ? 0 <= c.formats.indexOf("webp") : !1;
          e = { id: null, name: null, stdExt: e ? "webp" : "png", webFormats: ["large/std"], alpha: !0, rgbm: !0 };
          for (var f = 0; f < b; f += 1) {
              e.id = e.name = "lightmap-rgbm" + f;
              var l = a.load(WALK.LOAD_PRIORITY.LIGHTMAP, e, !1, !1, WALK.NO_ANISOTROPY);
              l.magFilter = GLC.NEAREST;
              l.minFilter = GLC.NEAREST;
              l.addLoadedListener(d);
              this.lightmaps.push(l);
          }
      };
  }
  function vh(a, b) {
      this.atlases = {};
      this.load = function (c) {
          for (var d = 0; d < c.length; ++d) {
              var e = a.load(WALK.LOAD_PRIORITY.DIFFUSE, c[d], !1, !0, WALK.DEFAULT_ANISOTROPY);
              e.flipY = !1;
              e.enableAtlas(b);
              this.atlases[c[d].id] = e;
          }
      };
  }
  function wh(a, b) {
      var c = {};
      this.onHaveBuffer = this.onFailure = this.onProgress = null;
      this._buffersDone = {};
      this.buffers = { meshes: null, transforms: null, bounds: null, faces16: null, faces: null, vertices: null, normals: null, uvs0: null, uvs1: null };
      this.haveAllBuffers = function () {
          for (var a in this.buffers) if (this.buffers.hasOwnProperty(a) && null === this.buffers[a]) return !1;
          return !0;
      };
      this.haveCoreBuffers = function () {
          var a = this.buffers;
          return a.faces16 && a.faces && a.vertices && a.normals && a.transforms;
      };
      this.releaseCoreBuffers = function () {
          var a = this.buffers;
          a.faces16 = a.faces = a.vertices = a.normals = null;
      };
      this.load = function () {
          function d(a) {
              return function (b) {
                  f.buffers[a] = b;
                  f.onHaveBuffer();
              };
          }
          function e(a) {
              return function (b) {
                  c[a] = b.loaded;
                  f.onProgress();
              };
          }
          var f = this,
              g = WALK.LOAD_PRIORITY.CORE_RESOURCE,
              h = { meshes: g, transforms: g, bounds: g, faces16: g, faces: g, vertices: g, normals: g, uvs0: b ? g : WALK.LOAD_PRIORITY.UV0, uvs1: b ? g : WALK.LOAD_PRIORITY.LIGHTMAP };
          (function () {
              for (var b in f.buffers)
                  if (f.buffers.hasOwnProperty(b)) {
                      var c = h[b];
                      console.assert(void 0 !== c);
                      WALK.queueAjaxGet(c, a + b + ".buf", !0, d(b), f.onFailure, e(b), !0);
                  }
          })();
      };
      this.totalDone = function () {
          var a = 0,
              b;
          for (b in c) c.hasOwnProperty(b) && (a += c[b]);
          return a;
      };
  }
  function xh(a, b, c, d, e, f) {
      this.meshPropsSet = new Set();
      this.meshPropsSet.add(a);
      this.material = b;
      this.lightMap = c;
      this.lightProbe = d;
      this.hideInViews = e;
      this.editableRootNode = f;
      this.anyLogicalMeshHasUvs = -1 !== a.uv0ByteOffset;
      this.sharedGeometryId = a.useInstances ? a.vertexByteOffset : null;
  }
  xh.prototype.canUseLightMap = function (a) {
      return null === this.lightMap || null === a || this.lightMap === a;
  };
  function yh(a, b, c) {
      var d = new Int32Array(a);
      a = new Float32Array(a);
      var e = new Float32Array(b),
          f = {},
          g = d[0],
          h = d[1],
          l = 2;
      for (b = 0; l < d.length; ) {
          var m = {
              nodeId: d[l],
              materialIdx: d[l + 1],
              useFaces16: 1 === d[l + 2],
              faceByteOffset: d[l + 3],
              faceCnt: d[l + 4],
              vertexByteOffset: d[l + 5],
              vertexCnt: d[l + 6],
              normalByteOffset: d[l + 7],
              uv0ByteOffset: d[l + 8],
              uv1ByteOffset: d[l + 9],
              lightMapIdx: d[l + 10],
              uv1CoordUScale: a[l + 11],
              uv1CoordVScale: a[l + 12],
              uv1CoordUOffset: d[l + 13],
              uv1CoordVOffset: d[l + 14],
              transformByteOffset: d[l + 15],
              boundsByteOffset: d[l + 16],
              quantVertexRange: a[l + 17],
              quantVertexMax: d[l + 18],
              quantUv0Range: a[l + 19],
              quantUv0Max: d[l + 20],
              autoLightmapResolution: 2 <= g ? d[l + 21] : -1,
              useInstances: !1,
              hasCopies: !1,
              isMasterCopy: !1,
          };
          m.boundingBox = new THREE.Box3();
          m.boundingSphere = new THREE.Sphere();
          a: {
              for (var n = m.boundingBox, p = m.boundingSphere, r = m.boundsByteOffset / 4, q = 0; 6 > q; ++q) if (!isFinite(e[r + q])) break a;
              n.max.x = e[r];
              n.max.y = e[r + 1];
              n.max.z = e[r + 2];
              n.min.x = e[r + 3];
              n.min.y = e[r + 4];
              n.min.z = e[r + 5];
              n.center(p.center);
              p.radius = e[r + 6];
          }
          b = Math.max(b, m.lightMapIdx + 1);
          WALK.DETECTOR.gl.instances && ((n = m.vertexByteOffset), f.hasOwnProperty(n) ? ((n = f[n]), (p = n[0]), (p.isMasterCopy = !0), (p.hasCopies = !0), (m.hasCopies = !0), n.push(m)) : (f[n] = [m]));
          c.push(m);
          l += h;
      }
      c = _.makeIterator(Object.values(f));
      for (d = c.next(); !d.done; d = c.next()) if (((d = d.value), (a = d.length), 1 < a && 500 < a * d[0].faceCnt)) for (d = _.makeIterator(d), a = d.next(); !a.done; a = d.next()) a.value.useInstances = !0;
      return b;
  }
  function zh(a, b, c, d) {
      function e(b) {
          var c = [],
              d = new Map();
          g.forEach(function (e) {
              var f = a.findNode(e.nodeId),
                  g = a.materials[e.materialIdx],
                  h = null;
              null !== f.initialLightProbeId && (h = a.findLightProbe(f.initialLightProbeId));
              var l = null;
              -1 !== e.lightMapIdx && (l = b[e.lightMapIdx]);
              var m = f.hideInViews || [],
                  n = f.editableRoot;
              if (f.editable || 1 !== g.opacity) c.push(new xh(e, g, l, h, m, n));
              else {
                  var p = e.useInstances ? e.vertexByteOffset : null;
                  f = d.get(g) || [];
                  for (var q = _.makeIterator(f), r = q.next(); !r.done; r = q.next()) {
                      r = r.value;
                      var u;
                      if ((u = r.lightProbe === h && r.editableRootNode === n && r.canUseLightMap(l) && r.sharedGeometryId === p))
                          a: if (((u = r.hideInViews), u.length !== m.length)) u = !1;
                          else {
                              for (var F = 0; F < u.length; F += 1)
                                  if (u[F] !== m[F]) {
                                      u = !1;
                                      break a;
                                  }
                              u = !0;
                          }
                      if (u) {
                          null !== l && (r.lightMap = l);
                          r.anyLogicalMeshHasUvs = r.anyLogicalMeshHasUvs || -1 !== e.uv0ByteOffset;
                          r.meshPropsSet.add(e);
                          return;
                      }
                  }
                  e = new xh(e, g, l, h, m, n);
                  f.push(e);
                  d.set(g, f);
                  c.push(e);
              }
          });
          return c;
      }
      var f = this,
          g = [],
          h = b.byteLength,
          l = 0,
          m = 0,
          n = 0;
      this.mergedMeshes = [];
      this.lightmapCount = this.geometryDownloadSize = this.coreGeometryDownloadSize = 0;
      this.createMeshes = function (b) {
          var c = b ? b[0] : null,
              f = e(b);
          b = {};
          f = _.makeIterator(f);
          for (var g = f.next(); !g.done; g = f.next()) {
              var h = g.value;
              g = h.sharedGeometryId;
              if (null !== g) {
                  var m = b[g],
                      n = !1;
                  m || ((m = new WALK.Geometry()), (n = !0), (b[g] = m));
                  g = new WALK.InstancedGeometry(m, n);
              } else g = new WALK.Geometry();
              m = new WALK.MergedMesh(g, h.material);
              m.lightProbe = h.lightProbe;
              m.lightMap = h.lightMap || c;
              m.hideInViews = h.hideInViews;
              m.anyLogicalMeshHasUvs = h.anyLogicalMeshHasUvs;
              m.editableRootNode = h.editableRootNode;
              this.mergedMeshes.push(m);
              h = _.makeIterator(h.meshPropsSet);
              for (n = h.next(); !n.done; n = h.next()) {
                  n = n.value;
                  var p,
                      x = g;
                  if (d) {
                      var A = 3 * n.faceCnt;
                      var B = n.vertexCnt;
                  } else (A = 0), (B = 3 * n.faceCnt);
                  if (x.isInstanced) var L = (p = 0);
                  else (p = x.indexCnt), (L = x.vertexCnt);
                  L = new WALK.SubGeometry(A, B, x, p, L, n.boundingBox, n.boundingSphere);
                  x.boundingBox.union(n.boundingBox);
                  WALK.Math.spheresUnion(n.boundingSphere, x.boundingSphere);
                  x.isInstanced ? ((L.instanceId = x.instanceCount), (x.instanceCount += 1), (x.indexCnt = A), (x.vertexCnt = B)) : ((x.indexCnt += A), (x.vertexCnt += B));
                  A = L;
                  B = a.findNode(n.nodeId);
                  A = new WALK.Mesh(B, A, m.material);
                  A.lightMap = m.lightMap;
                  A.lightProbe = m.lightProbe;
                  A.autoLightmapResolution = n.autoLightmapResolution;
                  A.useFaces16 = n.useFaces16;
                  A.faceByteOffset = n.faceByteOffset;
                  A.faceCnt = n.faceCnt;
                  A.vertexByteOffset = n.vertexByteOffset;
                  A.vertexCnt = n.vertexCnt;
                  A.normalByteOffset = n.normalByteOffset;
                  A.uv0ByteOffset = n.uv0ByteOffset;
                  A.uv1ByteOffset = n.uv1ByteOffset;
                  A.lightMapIdx = n.lightMapIdx;
                  A.uv1CoordUScale = n.uv1CoordUScale;
                  A.uv1CoordVScale = n.uv1CoordVScale;
                  A.uv1CoordUOffset = n.uv1CoordUOffset;
                  A.uv1CoordVOffset = n.uv1CoordVOffset;
                  A.transformByteOffset = n.transformByteOffset;
                  A.quantVertexRange = n.quantVertexRange;
                  A.quantVertexMax = n.quantVertexMax;
                  A.quantUv0Range = n.quantUv0Range;
                  A.quantUv0Max = n.quantUv0Max;
                  n.hasCopies && (A.sharedBuffersDebug = n.isMasterCopy ? 1 : 2);
                  l += 1;
                  m.addLogicalMesh(A);
                  B.mesh = A;
              }
          }
          WALK.log("Have " + l + " meshes and " + this.mergedMeshes.length + " merged meshes.");
      };
      this.lightmapCount = yh(b, c, g);
      b = c = null;
      (function () {
          for (var a = 0, b = 0, c = 0, d = 0, e = 0, l = 0, y = 0, z = _.makeIterator(g), x = z.next(); !x.done; x = z.next()) {
              x = x.value;
              var A = x.vertexCnt;
              m += A;
              n += x.faceCnt;
              a = Math.max(a, x.faceByteOffset + 3 * x.faceCnt * (x.useFaces16 ? 2 : 4));
              b = Math.max(b, (x.vertexByteOffset + 3 * A * WALK.Math.minBytesToHold(x.quantVertexMax) + 3) & -4);
              c = Math.max(c, x.normalByteOffset + 2 * A);
              d = Math.max(d, x.transformByteOffset + 64);
              e = Math.max(e, x.boundsByteOffset + 28);
              -1 !== x.uv0ByteOffset && (l = Math.max(l, (x.uv0ByteOffset + 2 * A * WALK.Math.minBytesToHold(x.quantVertexMax) + 3) & -4));
              -1 !== x.uv1ByteOffset && (y = Math.max(y, x.uv1ByteOffset + 4 * A));
          }
          f.coreGeometryDownloadSize = h + a + b + c + d + e;
          f.geometryDownloadSize += f.coreGeometryDownloadSize + l + y;
      })();
      WALK.log("Have " + m + " vertices, " + n + " faces and " + this.lightmapCount + " lightmaps.");
  }
  var Ah = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]);
  function Bh(a) {
      this.minVerticesUntilTimeCall = a;
      this.verticesCount = 0;
      this.timer = new WALK.Timer();
  }
  Bh.prototype.shouldInterrupt = function (a) {
      this.verticesCount += a;
      return this.verticesCount > this.minVerticesUntilTimeCall && 10 < this.timer.elapsedMSec() ? ((this.verticesCount = 0), this.timer.reset(), !0) : !1;
  };
  function Ch(a, b, c, d, e, f, g) {
      var h = 0;
      for (c *= 3; h < c; h += 3) {
          var l = a[h + b] * e,
              m = a[h + b + 1] * e,
              n = a[h + b + 2] * e;
          f[g + h] = d[0] * l + d[1] * m + d[2] * n + d[3];
          f[g + h + 1] = d[4] * l + d[5] * m + d[6] * n + d[7];
          f[g + h + 2] = d[8] * l + d[9] * m + d[10] * n + d[11];
      }
  }
  function Dh(a, b, c, d, e, f) {
      var g = 0;
      for (c *= 2; g < c; g += 2) {
          var h = (a[g + b] / 254 + 0.5) * Math.PI,
              l = (Math.PI / 127) * a[g + b + 1],
              m = Math.sin(h),
              n = m * Math.cos(l);
          l = m * Math.sin(l);
          h = Math.cos(h);
          m = d[0] * n + d[1] * l + d[2] * h;
          var p = d[4] * n + d[5] * l + d[6] * h;
          h = 2 * (Math.acos(d[8] * n + d[9] * l + d[10] * h) / Math.PI - 0.5);
          l = Math.atan2(p, m) / Math.PI;
          e[f + g] = WALK.Math.toSnorm8(h);
          e[f + g + 1] = WALK.Math.toSnorm8(l);
      }
  }
  function Eh(a) {
      return 0 !== a.instanceId || !1 === a.parent.ownsGpuBuffers;
  }
  function Fh(a, b, c, d, e, f) {
      var g = !1,
          h = 0;
      for (c *= 2; h < c; h += 1) {
          var l = a[h + b] * d;
          e[f + h] = l;
          if (0 > l || 1 < l) g = !0;
      }
      return g;
  }
  function Gh(a, b, c, d, e) {
      var f = !1,
          g = 0;
      for (c *= 2; g < c; g += 1) {
          var h = a[g + b];
          d[e + g] = h;
          if (0 > h || 1 < h) f = !0;
      }
      return f;
  }
  function Hh(a, b, c, d, e, f, g, h, l) {
      var m = 0;
      for (c *= 2; m < c; m += 2) {
          var n = a[m + b],
              p = a[m + b + 1];
          0 !== n || 0 !== p ? ((h[l + m] = Math.round(n * d) + f), (h[l + m + 1] = Math.round(p * e) + g)) : ((h[l + m] = 0), (h[l + m + 1] = 0));
      }
  }
  function Ih(a, b, c, d, e) {
      function f() {
          for (; h < a.length; ) {
              var m = a[h];
              if (0 !== l || b(m)) {
                  for (; l < m.logicalMeshes.length; ) {
                      var n = m.logicalMeshes[l];
                      c(n);
                      l += 1;
                      if (g.shouldInterrupt(n.vertexCnt)) {
                          setTimeout(f, 0);
                          return;
                      }
                  }
                  d(m);
                  h += 1;
                  l = 0;
              } else h += 1;
          }
          e();
      }
      var g = new Bh(5e4),
          h = 0,
          l = 0;
      f();
  }
  function Jh(a, b) {
      b.geometry.allocateCoreBuffers(a);
      return !0;
  }
  function Kh(a) {
      return a.anyLogicalMeshHasUvs ? (a.geometry.allocateUv0(), !0) : !1;
  }
  function Lh(a) {
      return a.lightMap ? (a.geometry.allocateUv1(), !0) : !1;
  }
  function Mh(a, b, c, d) {
      var e = new Uint16Array(a),
          f = new Float32Array(a);
      Ih(
          b,
          Kh,
          function (a) {
              if (a.uv0InBuffers()) {
                  var b = a.geometry;
                  if (!Eh(b)) {
                      var c = b.vertexOffset;
                      b = b.parent;
                      if (a.quantUv0Disabled() ? Gh(f, a.uv0ByteOffset / 4, a.vertexCnt, b.uvs0, 2 * c) : Fh(e, a.uv0ByteOffset / 2, a.vertexCnt, a.quantUv0Factor(), b.uvs0, 2 * c)) b.isUvs0Repeating = !0;
                  }
              }
          },
          c,
          d
      );
  }
  function Nh(a, b, c, d, e) {
      var f = 4 * e.instanceId;
      e = e.parent.uvs1Mod;
      e[f] = c / 65535;
      e[f + 1] = d / 65535;
      e[f + 2] = a / 65535;
      e[f + 3] = b / 65535;
  }
  function Oh(a, b, c, d) {
      var e = new Uint16Array(a);
      Ih(
          b,
          Lh,
          function (a) {
              if (a.uv1InBuffers()) {
                  var b = a.uv1CoordUScale,
                      c = a.uv1CoordVScale,
                      d = a.uv1CoordUOffset,
                      f = a.uv1CoordVOffset,
                      n = a.geometry;
                  if (n.isInstanced) {
                      Nh(b, c, d, f, n);
                      if (Eh(n)) return;
                      b = c = 1;
                      d = f = 0;
                  }
                  Hh(e, a.uv1ByteOffset / 2, a.vertexCnt, b, c, d, f, n.parent.uvs1, 2 * n.vertexOffset);
              }
          },
          c,
          d
      );
  }
  function Ph(a, b) {
      var c = b.parent;
      b = 4 * b.instanceId;
      var d = c.transforms0;
      d[b] = a[0];
      d[b + 1] = a[1];
      d[b + 2] = a[2];
      d[b + 3] = a[3];
      d = c.transforms1;
      d[b] = a[4];
      d[b + 1] = a[5];
      d[b + 2] = a[6];
      d[b + 3] = a[7];
      c = c.transforms2;
      c[b] = a[8];
      c[b + 1] = a[9];
      c[b + 2] = a[10];
      c[b + 3] = a[11];
  }
  function Qh(a, b, c, d) {
      var e = a.faces16 ? new Uint16Array(a.faces16) : null,
          f = a.faces ? new Uint32Array(a.faces) : null,
          g = new Int8Array(a.vertices),
          h = new Int16Array(a.vertices),
          l = new Int32Array(a.vertices),
          m = new Int8Array(a.normals);
      Ih(
          b,
          Jh.bind(null, !0),
          function (b) {
              var c = b.geometry,
                  d = c.parent,
                  n = new Float32Array(a.transforms, b.transformByteOffset, 16);
              if (c.isInstanced) {
                  Ph(n, c);
                  if (Eh(c)) return;
                  n = Ah;
              }
              switch (WALK.Math.minBytesToHold(b.quantVertexMax)) {
                  case 1:
                      var u = g;
                      var v = b.vertexByteOffset;
                      break;
                  case 2:
                      u = h;
                      v = b.vertexByteOffset / 2;
                      break;
                  case 4:
                      (u = l), (v = b.vertexByteOffset / 4);
              }
              var w = c.vertexOffset;
              Ch(u, v, b.vertexCnt, n, b.quantVertexFactor(), d.vertices, 3 * w);
              Dh(m, b.normalByteOffset, b.vertexCnt, n, d.normals, 2 * w);
              d = d.index;
              c = c.indexOffset;
              b.useFaces16 ? ((v = b.faceByteOffset / 2), (n = e)) : ((v = b.faceByteOffset / 4), (n = f));
              u = v;
              for (b = v + 3 * b.faceCnt; u < b; u += 1, c += 1) d[c] = n[u] + w;
          },
          c,
          d
      );
  }
  function Rh(a, b, c, d) {
      var e = a.faces16 ? new Uint16Array(a.faces16) : null,
          f = a.faces ? new Uint32Array(a.faces) : null,
          g = new Int8Array(a.vertices),
          h = new Int16Array(a.vertices),
          l = new Int32Array(a.vertices),
          m = new Int8Array(a.normals),
          n = new Uint16Array(a.uvs0),
          p = new Float32Array(a.uvs0),
          r = a.uvs1 ? new Uint16Array(a.uvs1) : null;
      Ih(
          b,
          function (a) {
              Jh(!1, a);
              Kh(a);
              Lh(a);
              return !0;
          },
          function (b) {
              var c = b.geometry,
                  d = b.geometry.parent,
                  q = new Float32Array(a.transforms, b.transformByteOffset, 16);
              if (b.uv0InBuffers() && d.uvs0) var y = d.uvs0;
              if (b.uv1InBuffers() && d.uvs1) {
                  var z = d.uvs1;
                  var x = b.uv1CoordUScale;
                  var A = b.uv1CoordVScale;
                  var B = b.uv1CoordUOffset;
                  var L = b.uv1CoordVOffset;
              }
              if (c.isInstanced) {
                  Ph(q, c);
                  z && Nh(x, A, B, L, c);
                  if (Eh(c)) return;
                  q = Ah;
                  x = A = 1;
                  B = L = 0;
              }
              if (b.useFaces16) {
                  c = e;
                  var C = b.faceByteOffset / 2;
              } else (c = f), (C = b.faceByteOffset / 4);
              switch (WALK.Math.minBytesToHold(b.quantVertexMax)) {
                  case 1:
                      var J = g;
                      var F = b.vertexByteOffset;
                      break;
                  case 2:
                      J = h;
                      F = b.vertexByteOffset / 2;
                      break;
                  case 4:
                      (J = l), (F = b.vertexByteOffset / 4);
              }
              var I = b.quantUv0Disabled();
              if (I) var H = b.uv0ByteOffset / 4;
              else {
                  var M = b.quantUv0Factor();
                  H = b.uv0ByteOffset / 2;
              }
              var N = 3 * b.geometry.vertexOffset,
                  G = 2 * b.geometry.vertexOffset,
                  D = b.quantVertexFactor(),
                  E = d.vertices,
                  S = d.normals,
                  Z = b.normalByteOffset,
                  Q = b.uv1ByteOffset / 2,
                  ca = C;
              for (b = C + 3 * b.faceCnt; ca < b; ca += 1, N += 3, G += 2) {
                  C = c[ca];
                  Ch(J, F + 3 * C, 1, q, D, E, N);
                  Dh(m, Z + 2 * C, 1, q, S, G);
                  if (y) {
                      var ha = H + 2 * C;
                      if (I ? Gh(p, ha, 1, y, G) : Fh(n, ha, 1, M, y, G)) d.isUvs0Repeating = !0;
                  }
                  z && Hh(r, Q + 2 * C, 1, x, A, B, L, z, G);
              }
          },
          c,
          d
      );
  }
  function Sh(a, b) {
      a.forEach(function (a) {
          b.addView(new WALK.View(a));
      });
  }
  function Th(a) {
      if (0 !== a.length && a[0].position) return a[0].position[2];
  }
  function Uh(a, b, c) {
      a.forEach(function (a) {
          c.isNodeTypeEditable(a.name) && (a.editable = !0);
          b.addNodeConfig(new WALK.NodeConfig(a));
      });
  }
  function Vh(a, b) {
      a.forEach(function (a) {
          var c = new WALK.Light(a);
          a = a.instances;
          for (var e = 0; e < a.length; e += 1) {
              var f = a[e];
              c.addInstance(f.position, f.rotation);
          }
          b.addLight(c);
      });
  }
  function Wh(a, b) {
      a.forEach(function (a) {
          b.addLightProbe(new WALK.LightProbe(a));
      });
  }
  function Xh(a, b, c) {
      c = c.camera;
      a &&
          (a.fov && (c.defaultFov = a.fov),
          a.exposure && (c.defaultExposure = a.exposure),
          a.gamma && (c.defaultGamma = a.gamma),
          a.lutTexture && ((b = b.load(WALK.LOAD_PRIORITY.COLORMAP, a.lutTexture, !1, !1, WALK.NO_ANISOTROPY)), (b.flipY = !1), (c.colorMap = b)),
          (c.autoPath = !!a.autoPath),
          (c.autoClimb = !!a.autoClimb),
          (c.autoExposure = !!a.autoExposure),
          (c.fixedHeight = a.fixedHeight),
          void 0 !== a.autoExposureDarkness && (c.autoExposureDarkness = a.autoExposureDarkness),
          void 0 !== a.moveMaxSpeed && (c.moveMaxSpeed = a.moveMaxSpeed),
          c.updateProjectionMatrix());
  }
  function Yh(a, b) {
      function c(a, e) {
          var d = b.findNodeConfig(e.config),
              g = new WALK.Node(a, d, e);
          void 0 !== e.children &&
              (g.children = e.children.map(function (a) {
                  return c(g, a);
              }));
          return g;
      }
      a.forEach(function (a) {
          b.addNode(c(null, a));
      });
  }
  function Zh() {
      var a = null;
      WALK.DETECTOR.whatsApp ? (a = "WhatsApp") : WALK.DETECTOR.facebookApp && (a = "Facebook app");
      null === a
          ? za.error("Scene failed to load. Reload the page to retry.")
          : za.error(
                "Scene failed to load. Open the scene outside of " +
                    a +
                    ' by copying the link to the native web browser: <div class="message-scrollable-line"><a href="' +
                    (window.location + '" taget="_blank">' + window.location + "</a></div>")
            );
  }
  function $h(a, b, c, d, e) {
      var f = !c && WALK.DETECTOR.gl.indexUint,
          g = !c && !WALK.DEBUG_SHARED_BUFFERS,
          h = new WALK.Timer();
      this.onComplete = this.onReadyToDisplay = this.onTextureLoaded = this.onMeshBuffersLoaded = this.onProgress = null;
      this.panoramas = [];
      this.load = function () {
          function l() {
              if (void 0 !== Z.total) C.onProgress(Z);
          }
          function m() {
              M || ((M = !0), C.onReadyToDisplay(a));
          }
          function n(a) {
              0 === a.name.indexOf("lightmap-rgbm") ? (Z.texturesDone += 12582912) : (Z.texturesDone += 524288);
              l();
              C.onTextureLoaded(a);
              Q();
          }
          function p() {
              console.warn("Failed to load video texture");
              Q();
          }
          function r() {
              if (0 === J.texturesToLoad && G) {
                  J.clearCache();
                  for (var b = 0, c = _.makeIterator(I.mergedMeshes), d = c.next(); !d.done; d = c.next()) b += d.value.geometry.gpuSize;
                  WALK.log("Total GPU geometry buffers size " + b + " bytes");
                  J = F = I = null;
                  WALK.defer(function () {
                      m();
                      C.onComplete(a);
                  });
              }
          }
          function q() {
              D &&
                  N &&
                  H &&
                  ((Q = r),
                  S &&
                      a.materials.forEach(function (a) {
                          a.lightMapped || ((a.lightMapped = !0), a.setUniforms());
                      }),
                  Q());
          }
          function u(a) {
              a.geometry.addUv1Attribute();
              C.onMeshBuffersLoaded(a);
          }
          function v() {
              F.buffers.uvs1 &&
                  ((Q = q),
                  Oh(F.buffers.uvs1, I.mergedMeshes, u, function () {
                      F.buffers.uvs1 = null;
                      D = !0;
                      Q();
                  }));
          }
          function w(a) {
              a.geometry.isUvs0Repeating && a.material.ensureTexturesRepeatable();
              a.geometry.addUv0Attribute();
              C.onMeshBuffersLoaded(a);
          }
          function y() {
              F.buffers.uvs0 &&
                  ((Q = v),
                  Mh(F.buffers.uvs0, I.mergedMeshes, w, function () {
                      F.buffers.uvs0 = null;
                      G = !0;
                      Q();
                  }));
          }
          function z() {
              H = !0;
              0 === a.views.length && a.addView(new WALK.View({ id: 0, name: "Start place", hideFromMenu: !0, position: a.center.toArray(), rotation: [0, 0], internal: !0, sky: WALK.EDITOR_CONTROLLED_SKY_NAME }));
              if (!c && !a.disableProgressiveLoader) {
                  var b = 1e3 * WALK.PROGRESSIVE_LOADER_AFTER_SEC - h.elapsedMSec();
                  0 >= b ? m() : setTimeout(m, b);
              }
              Q();
          }
          function x(b) {
              a.addGpuMesh(b);
          }
          function A(a) {
              a.geometry.addCoreAttributes();
              var b = a.logicalMeshes;
              console.assert(!b[0].node.editable || 1 === b.length);
              b[0].node.editable || !g ? b.forEach(x) : x(a);
              C.onMeshBuffersLoaded(a);
          }
          function B(a) {
              a.geometry.isUvs0Repeating && a.material.ensureTexturesRepeatable();
              a.geometry.uvs0 && a.geometry.addUv0Attribute();
              a.geometry.uvs1 && a.geometry.addUv1Attribute();
              A(a);
          }
          function L() {
              if (f) {
                  if (!F.haveCoreBuffers()) return;
                  WALK.log("Using indexed geometry");
                  Q = y;
                  Qh(F.buffers, I.mergedMeshes, A, z);
              } else {
                  if (!F.haveAllBuffers()) return;
                  Q = q;
                  Rh(F.buffers, I.mergedMeshes, B, function () {
                      D = G = !0;
                      z();
                  });
              }
              F && F.releaseCoreBuffers();
          }
          var C = this,
              J = null,
              F = null,
              I = null,
              H = !1,
              M = !1,
              N = !1,
              G = !1,
              D = !1,
              E = null,
              S = !1,
              Z = {
                  total: void 0,
                  texturesDone: 0,
                  totalDone: function () {
                      return this.texturesDone + F.totalDone();
                  },
              };
          h.reset();
          var Q = function () {
              if (E && F.buffers.meshes && F.buffers.bounds) {
                  Q = L;
                  void 0 !== E.autoAddLightProbes && (a.autoAddLightProbes = E.autoAddLightProbes);
                  a.disableProgressiveLoader = E.disableProgressiveLoader || !1;
                  E.interactionPrompt && (a.interactionPrompt = E.interactionPrompt);
                  void 0 !== E.autoTour && ((a.autoTour.disabled = E.autoTour.disabled || !1), (a.autoTour.startOnLoad = E.autoTour.startOnLoad || !1));
                  Vh(E.lights, a);
                  Wh(E.lightProbes || [], a);
                  E.cameraVolumes &&
                      E.cameraVolumes.forEach(function (b) {
                          return a.addCameraVolume(new WALK.CameraVolume(b));
                      });
                  J = new dd(b, WALK.DETECTOR, n, Zh, p, !1, !0);
                  Xh(E.camera, J, a);
                  var c = new vh(J, e);
                  c.load(E.atlases || []);
                  new th(J, c.atlases, d).load(E.materials || [], a);
                  new Oc(J).load(E.skies || [], a);
                  null === a.findSkyMesh(WALK.EDITOR_CONTROLLED_SKY_NAME) && console.error("A sky with name " + WALK.EDITOR_CONTROLLED_SKY_NAME + " is missing.");
                  Sh(E.views || [], a);
                  E.hideViewsMenu && (a.hideViewsMenu = !0);
                  Uh(E.nodeConfigs, a, d);
                  Yh(E.nodes, a);
                  I = new zh(a, F.buffers.meshes, F.buffers.bounds, f);
                  c = null;
                  if (0 !== I.lightmapCount) {
                      S = !0;
                      var g = new uh(J, I.lightmapCount, E.lightmap);
                      g.onComplete = function () {
                          N = !0;
                          Q();
                      };
                      g.load();
                      c = g.lightmaps;
                      g = null;
                  } else N = !0;
                  I.createMeshes(c);
                  Z.total = I.geometryDownloadSize + 524288 * (J.texturesToLoad - I.lightmapCount) + 12582912 * I.lightmapCount;
                  E.panoramas && (C.panoramas = E.panoramas);
                  a.minimapConfig = new WALK.MinimapConfig(E.minimap, a.boundingBox, Th(E.views || []));
                  E = null;
                  Q();
              }
          };
          WALK.queueAjaxGet(
              WALK.LOAD_PRIORITY.CORE_RESOURCE,
              b + "scene.json",
              !1,
              function (a) {
                  E = a;
                  Q();
              },
              Zh
          );
          F = new wh(b, !f);
          F.onProgress = l;
          F.onFailure = Zh;
          F.onHaveBuffer = function () {
              Q();
          };
          F.load();
      };
      this.elapsedLoadTimeSec = function () {
          return h.elapsedSec();
      };
  } /*
Copyright (C) 2015-present Actif3D
*/
  var ai = {
      uniforms: { gloss: { type: "f", value: 0.9 }, face: { type: "f", value: 0 }, mipSize: { type: "f", value: 128 }, envMap: { type: "t", value: null } },
      vertexShader: WALK.getShader("cubemap_filter_vertex.glsl"),
      fragmentShader: WALK.getShader("cubemap_filter_fragment.glsl"),
  };
  function bi(a, b, c) {
      for (var d = !0; d; ) {
          a.readPixels(b, b, c);
          for (var e = 0; e < b * b * 4; e += 4)
              if (0 !== c[e] || 0 !== c[e + 1] || 0 !== c[e + 2]) {
                  d = !1;
                  break;
              }
          if (d) {
              console.warn("Cube face has all pixels black.");
              break;
          }
      }
  }
  var ci = (function () {
      var a = null;
      return function (b, c) {
          var d = null,
              e = 0;
          c *= c;
          console.assert(c < Math.pow(2, 16));
          null === a && (a = new Uint16Array(65536));
          for (var f = 0; f < 4 * c; f += 4) a[256 * b[f] + b[f + 1]] += 1;
          a[0] > 0.7 * c && (e = a[0]);
          a[0] = 0;
          for (b = 1; b < a.length; b += 1) a[b] > e && ((e = a[b]), (d = Math.floor(b / 256) + (b % 256) / 255)), (a[b] = 0);
          return d;
      };
  })();
  function di(a, b) {
      var c = new Set();
      a.sharedMaterialState.hdrOutput = !0;
      a.threeScene.traverse(function (a) {
          if (a instanceof THREE.Mesh && a.visible) {
              var d = a.material;
              a.userData.hideFromLightProbes || d.hideFromLightProbes
                  ? (b.add(a), (a.visible = !1))
                  : c.has(d) || (c.add(d), d.configureTransparency && ((d.transparent = !1), (d.blending = THREE.NoBlending), (d.depthWrite = !0)), void 0 !== d.specularOff && (d.specularOff += 1));
          }
      });
      c = null;
  }
  function ei(a, b) {
      var c = new Set();
      a.sharedMaterialState.hdrOutput = !1;
      a.threeScene.traverse(function (a) {
          if (a instanceof THREE.Mesh) {
              var d = a.material;
              d.forceObjectUniformsRefresh && d.forceObjectUniformsRefresh();
              a.visible ? c.has(d) || (c.add(d), d.configureTransparency && d.configureTransparency(), void 0 !== d.specularOff && --d.specularOff) : b.has(a) && (a.visible = !0);
          }
      });
      c = null;
  }
  var fi = (function () {
      var a = null;
      return function (b, c, d) {
          var e = b.renderer,
              f = b.aabbQueryMaterial,
              g = b.pixelBuf,
              h = b.targetCubeRaw;
          null === a && (a = new Lf(0.01, 255));
          a.position.copy(c.position);
          a.updateMatrixWorld();
          var l;
          for (l = 0; 6 > l; l += 1) {
              h.activeCubeFace = l;
              f.axis = Math.floor(l / 2);
              e.renderMeshes(b.scene.gpuMeshes, f, a.sideCameras[l], h);
              bi(e, h.width, g);
              var m = ci(g, h.width);
              if (null === m) {
                  WALK.log("failed to find light probe bound");
                  break;
              }
              switch (l) {
                  case 0:
                      d.boxMax.x = c.position.x + m;
                      break;
                  case 1:
                      d.boxMin.x = c.position.x - m;
                      break;
                  case 2:
                      d.boxMax.y = c.position.y + m;
                      break;
                  case 3:
                      d.boxMin.y = c.position.y - m;
                      break;
                  case 4:
                      d.boxMax.z = c.position.z + m;
                      break;
                  case 5:
                      d.boxMin.z = c.position.z - m;
              }
          }
          6 !== l &&
              (WALK.log("Light probe bounds: X[" + d.boxMin.x.toFixed(2) + ":" + d.boxMax.x.toFixed(2) + "] Y[" + d.boxMin.y.toFixed(2) + ":" + d.boxMax.y.toFixed(2) + "] Z[" + d.boxMin.z.toFixed(2) + ":" + d.boxMax.z.toFixed(2) + "]"),
              d.resetBoundingBox());
      };
  })();
  function gi(a, b) {
      var c = { format: GLC.RGBA, magFilter: GLC.LINEAR, minFilter: GLC.LINEAR, stencilBuffer: !1, generateMipmaps: !1 };
      this.renderer = a;
      this.scene = b;
      this.threeScene = b.threeScene;
      this.aabbQueryMaterial = new WALK.AabbQueryMaterial();
      this.filterPass = new THREE.ShaderPass(ai, "envMap");
      b = WALK.LIGHT_PROBE_MAX_MIP_SIZE;
      this.pixelBuf = new Uint8Array(b * b * 4);
      this.targetCubeRaw = a.createRenderTargetCube(b, b, c);
      c.depthBuffer = !1;
      this.targetFiltered = a.createRenderTarget(b, b, c);
      this.autoClearAlter = new uc(a);
      this.dispose = function () {
          this.targetCubeRaw.dispose();
          this.targetFiltered.dispose();
          this.aabbQueryMaterial.dispose();
          this.filterPass.material.dispose();
          this.pixelBuf = null;
      };
  }
  gi.prototype.constructor = gi;
  function hi(a, b) {
      var c = b.geometry.boundingSphere.center;
      if (null === b.lightProbe || c.distanceTo(a.position) < c.distanceTo(b.lightProbe.position)) b.lightProbe = a;
  }
  function ii(a, b) {
      for (var c = 0; c < b.length; c += 1) hi(a, b[c]);
  }
  function ji(a, b) {
      WALK.log("No visible light probe found for " + b.length + " objects. Assigning the closest ones.");
      for (var c = 0; c < b.length; c += 1) for (var d = 0; d < a.length; d += 1) hi(a[d], b[c]);
  }
  function ki(a, b, c, d, e) {
      function f(b, f) {
          m.position.copy(b.position);
          m.updateMatrixWorld();
          var g;
          if ((g = d) && !(g = e))
              a: {
                  g = a.gpuMeshes;
                  for (var n = 0; n < g.length; n += 1) {
                      var p = g[n];
                      if (p.lightProbe === b && p.material.envMapMirror) {
                          g = !0;
                          break a;
                      }
                  }
                  g = !1;
              }
          (n = g) && WALK.log("Mirror texture needed for the light probe.");
          l.reset();
          g = h.renderer;
          h.autoClearAlter.set(!0, !0, !1);
          if (n) {
              var v = h.renderer;
              n = WALK.LIGHT_PROBE_MIRROR_SIZE;
              n = v.createRenderTargetCube(n, n, { format: GLC.RGBA, magFilter: GLC.LINEAR, minFilter: GLC.LINEAR, stencilBuffer: !1, generateMipmaps: !1 });
              for (p = 0; 6 > p; p += 1) (n.activeCubeFace = p), v.render(h.threeScene, m.sideCameras[p], n);
              v.deallocateRenderTargetRenderingBuffers(n);
              v = n;
              b.setMirrorTexture(v);
          }
          f && fi(h, m, b);
          f = h.renderer;
          n = h.targetCubeRaw;
          for (p = 0; 6 > p; p += 1) (n.activeCubeFace = p), f.render(h.threeScene, m.sideCameras[p], n);
          h.autoClearAlter.restore();
          g.enableScissorTest(!0);
          h.autoClearAlter.set(!1, !1, !1);
          c && ((v = g.createCubeTexture(h.targetFiltered.width, !0)), b.setFilteredTexture(v));
          for (f = 0; f < WALK.LIGHT_PROBE_MIPS_COUNT; f += 1) {
              n = f;
              n = Math.pow(2, WALK.log2(h.targetFiltered.width) - n);
              g.setScissor(0, 0, n, n);
              h.filterPass.uniforms.mipSize.value = n;
              h.filterPass.uniforms.gloss.value = WALK.LIGHT_PROBE_GLOSS_FOR_MIP[f];
              c || ((v = g.createCubeTexture(n, !1)), b.setFilteredTextureNoLod(v, f));
              p = h.filterPass;
              var w = h.targetCubeRaw,
                  y = h.targetFiltered,
                  z = h.pixelBuf,
                  x = c ? f : 0,
                  A = v;
              if (WALK.DEBUG_LIGHT_PROBE_MIPS) for (var B = z, L = (255 * x) / WALK.LIGHT_PROBE_MIPS_COUNT, C = 0; C < 4 * n * n; C += 4) (B[C] = L), (B[C + 1] = L), (B[C + 2] = L), (B[C + 3] = 31.875);
              for (B = 0; 6 > B; B += 1) WALK.DEBUG_LIGHT_PROBE_MIPS || ((p.uniforms.face.value = B), p.render(g, y, w), bi(g, n, z)), g.copyBufferToCubeFaceMip(x, n, B, z, A);
          }
          g.enableScissorTest(!1);
          h.autoClearAlter.restore();
          WALK.log("Cube generation time " + l.elapsedSec());
      }
      var g,
          h = new gi(b, a),
          l = new WALK.Timer(),
          m = new Kf(0.15, a.camera.far);
      this.assignLightProbesToObjects = function () {
          l.reset();
          void 0 === g && (g = new Mf(b, a.gpuMeshes, a.camera.far));
          for (var c = 0; c < a.gpuMeshes.length; c += 1) a.gpuMeshes[c].lightProbe = null;
          for (c = 0; c < a.lightProbes.length; c += 1) {
              var d = a.lightProbes[c],
                  e = g.findVisibleObjects(d.position);
              WALK.log("Have visible objects " + e.length);
              ii(d, e);
          }
          WALK.log("Light probe assigment time " + l.elapsedSec());
          ji(
              a.lightProbes,
              WALK.filter(a.gpuMeshes, function (a) {
                  return null === a.lightProbe;
              })
          );
      };
      this.findBounds = function (a) {
          m.position.copy(a.position);
          m.updateMatrixWorld();
          h.autoClearAlter.set(!0, !0, !1);
          fi(h, m, a);
          h.autoClearAlter.restore();
      };
      this.createLightProbeTexture = function (b, c) {
          var d = new Set();
          di(a, d);
          f(b, c);
          ei(a, d);
      };
      this.createAllLightProbeTextures = function () {
          var b = new Set();
          di(a, b);
          for (var c = 0; c < a.lightProbes.length; c += 1) f(a.lightProbes[c], !1);
          ei(a, b);
      };
      this.dispose = function () {
          h.dispose();
          g && g.dispose();
      };
  }
  var li;
  function mi(a) {
      if (a.empty()) return 0;
      a.size(li);
      return li.x * li.y * li.z;
  }
  function ni(a) {
      if (a.empty()) return 0;
      a.size(li);
      a = li.x * li.y;
      return 1 > li.x || 1 > li.y || 1.9 > li.z || 1.5 > a ? 0 : a * li.z;
  }
  function oi(a) {
      var b = [],
          c = [];
      b.push(a);
      this.addFilledBox = function (a) {
          c.push(a);
      };
      this.findBestFilledBoxes = function () {
          function a(a) {
              return a[1];
          }
          function b(a) {
              a = a[0];
              a = a.max.x < m.min.x + 0.2 || a.min.x > m.max.x - 0.2 || a.max.y < m.min.y + 0.2 || a.min.y > m.max.y - 0.2 || a.max.z < m.min.z + 0.2 || a.min.z > m.max.z - 0.2 ? !1 : !0;
              return !a;
          }
          var d = [],
              h = [];
          for (
              c.forEach(function (a) {
                  h.push([a, mi(a)]);
              });
              0 < h.length && 10 > d.length;

          ) {
              var l = WALK.indexOfMax(h, a);
              var m = h[l][0];
              d.push(m);
              h = h.filter(b);
          }
          return d;
      };
      this.isEnclosedInFilledBox = function (a) {
          return WALK.any(c, function (b) {
              b = b.min.x - 0.1 <= a.min.x && a.max.x <= b.max.x + 0.1 && b.min.y - 0.1 <= a.min.y && a.max.y <= b.max.y + 0.1 && b.min.z - 0.1 <= a.min.z && a.max.z <= b.max.z + 0.1 ? !0 : !1;
              return b;
          });
      };
      this.findLargestEmptyBox = function () {
          var a = WALK.indexOfMax(b, mi);
          return null !== a ? b[a] : null;
      };
      var d = (function () {
          var a = [];
          a[0] = new THREE.Box3();
          a[1] = new THREE.Box3();
          a[2] = new THREE.Box3();
          a[3] = new THREE.Box3();
          a[4] = new THREE.Box3();
          a[5] = new THREE.Box3();
          return function (b, c, e) {
              a[0].max.copy(b.max);
              a[0].min.copy(b.min);
              a[0].min.z = c.max.z;
              a[1].max.copy(b.max);
              a[1].max.z = c.min.z;
              a[1].min.copy(b.min);
              a[2].max.copy(b.max);
              a[2].min.copy(b.min);
              a[2].min.x = c.max.x;
              a[3].max.copy(b.max);
              a[3].max.x = c.min.x;
              a[3].min.copy(b.min);
              a[4].max.copy(b.max);
              a[4].min.copy(b.min);
              a[4].min.y = c.max.y;
              a[5].max.copy(b.max);
              a[5].max.y = c.min.y;
              a[5].min.copy(b.min);
              var f = WALK.indexOfMax(a, ni);
              0 !== ni(a[f]) &&
                  (e.push(a[f].clone()),
                  0 === f ? (b.max.z = c.max.z) : 1 === f ? (b.min.z = c.min.z) : 2 === f ? (b.max.x = c.max.x) : 3 === f ? (b.min.x = c.min.x) : 4 === f ? (b.max.y = c.max.y) : 5 === f && (b.min.y = c.min.y),
                  d(b, c, e));
          };
      })();
      this.split = function (a) {
          for (var c = [], e = 0; e < b.length; e += 1) {
              var h = b[e];
              h.isIntersectionBox(a) ? d(h, a, c) : c.push(h);
          }
          b = c;
      };
  }
  function pi(a, b, c) {
      function d(b) {
          var c = new WALK.LightProbe({ id: a.lightProbes.length });
          b.center(c.position);
          c.position.z = b.min.z + 1.3;
          c.enableBoundingBox();
          c.boxMin.copy(b.min);
          c.boxMax.copy(b.max);
          a.lightProbes.push(c);
      }
      var e = new oi(a.boundingBox.clone()),
          f = new THREE.Box3(),
          g = new THREE.Box3(),
          h = new THREE.Vector3(),
          l = new WALK.Timer();
      li = new THREE.Vector3();
      for (var m = new WALK.LightProbe({ id: 0 }), n = 0; 200 > n; n += 1) {
          var p = e.findLargestEmptyBox();
          if (null === p) break;
          p.center(m.position);
          m.position.z = p.min.z + 1.3;
          m.enableBoundingBox();
          g.makeEmpty();
          for (var r = 0; 5 > r; r += 1) {
              b.findBounds(m);
              if (!m.isBoundingBoxInitialized()) break;
              f.set(m.boxMin, m.boxMax);
              var q = ni(f);
              if (0 === q) break;
              if (e.isEnclosedInFilledBox(f)) break;
              f.center(h);
              h.z = f.min.z + 1.3;
              var u = m.position.distanceToSquared(h);
              mi(g) < q && 0.25 > u && g.set(f.min, f.max);
              if (0.04 > u) break;
              m.position.copy(h);
          }
          g.empty() ? (p.center(f.min), p.center(f.max), e.split(f)) : (e.addFilledBox(g.clone()), e.split(g));
      }
      WALK.log("Light probes arrangement time " + l.elapsedSec());
      b = e.findBestFilledBoxes();
      (b.reduce(function (a, b) {
          return a + mi(b);
      }, 0) >
          0.2 * mi(a.boundingBox) ||
          c) &&
          b.forEach(d);
      0 === a.lightProbes.length && c && d(a.boundingBox);
  }
  function qi() {
      var a = this;
      WALK.loadScriptAndExecute(WALK.getViewerAssetUrl("lib/stats.min.js"), function () {
          var b = new Stats(),
              c = new WALK.Perf();
          c.log = !0;
          b.showPanel(0);
          var d = b.addPanel(new Stats.Panel("MS95pc", "#ff8", "#221"));
          document.body.appendChild(b.dom);
          a.begin = function () {
              c.begin();
              b.begin();
          };
          a.end = function () {
              c.end();
              b.end();
              d.update(1e3 * c.percentile95, 1e3 * c.max);
          };
      });
      this.begin = this.end = function () {};
  }
  function ri(a, b) {
      a = document.getElementsByClassName(a);
      for (var c = 0; c < a.length; c += 1) b(a[c]);
  }
  function si(a) {
      var b = [];
      ri(a, function (a) {
          b.push(a);
      });
      for (var c = 0; c < b.length; c += 1) b[c].classList.remove(a);
  }
  function ti(a, b) {
      a.style.display = b ? "" : "none";
  }
  function ui(a, b) {
      ti(elementById(a), b);
  }
  function vi(a, b) {
      ri(a, function (a) {
          ti(a, b);
      });
  }
  function wi(a) {
      ti(a, !0);
      a.style.opacity = 0;
      WALK.defer(function () {
          a.style.opacity = 1;
      });
  }
  function xi() {
      var a = document.getElementById("qr-code-canvas");
      a ? a.remove() : ((a = document.createElement("canvas")), a.setAttribute("id", "qr-code-canvas"), document.body.appendChild(a), QRCode.toCanvas(a, window.location.toString()));
  }
  function yi(a) {
      a.style.opacity = 0;
      var b = window.getComputedStyle(a).transitionDuration;
      if (b) {
          var c = parseFloat(b);
          -1 === b.indexOf("ms") && (c *= 1e3);
          setTimeout(function () {
              ti(a, !1);
              a.style.opacity = 1;
          }, c);
      } else ti(a, !1), (a.style.opacity = 1);
  }
  function zi(a, b, c, d, e) {
      function f(a) {
          if (a) {
              var b = null === D ? [] : D.visibleViews(),
                  c;
              for (c = 0; c < b.length && b[c] !== a; c += 1);
              a = elementById("view-list-items").children;
              if (c < a.length) return a[c];
          }
          return null;
      }
      function g(a) {
          return function () {
              a.classList.remove("active-view");
              a.classList.remove("next-active-view");
          };
      }
      function h() {
          for (var a = elementById("view-list-items").children, b = 0; b < a.length; b += 1) a[b].classList.remove("active-view"), a[b].classList.remove("next-active-view");
      }
      function l() {
          elementById("tour-button").classList.add("tour-on");
      }
      function m() {
          elementById("tour-button").classList.remove("tour-on");
          h();
      }
      function n() {
          S.isRunning() ? S.stop() : S.start();
      }
      function p() {
          return S.isRunning() ? (S.stop(), !0) : !1;
      }
      function r(a) {
          h();
          (a = f(a.view)) && a.classList.add("next-active-view");
      }
      function q(a) {
          if ((a = f(a.view))) a.classList.remove("next-active-view"), a.classList.add("active-view"), setTimeout(g(a), WALK.AUTO_TOUR_IN_VIEW_STILL_TIME_MS);
      }
      function u(a) {
          return walkFocusAbstractHandler(function () {
              var b = p();
              E.switchToView(a, b ? 0 : void 0);
          });
      }
      function v() {
          var a = elementById("info-bar"),
              b = elementById("info-bar-slide"),
              c = elementById("view-list"),
              d = elementById("view-list-slide"),
              e = elementById("menu-bar"),
              f = elementById("menu-bar-slide"),
              h = elementById("menu-bar-folder");
          ti(h, D && !fa);
          if (N.visible) {
              a.style.pointerEvents = null;
              b.style.left = 0;
              c.style.pointerEvents = null;
              d.style.top = 0;
              e.style.pointerEvents = null;
              f.style.right = 0;
              h.style.pointerEvents = null;
              h.children[0].style.transform = "";
              if (null !== N.cover) {
                  e = N.cover.title;
                  d = N.cover.author;
                  f = N.cover.authorHref;
                  c = N.cover.engineLogoOn;
                  a = N.cover.engineLogoText;
                  b = N.cover.engineLogoUrl;
                  h = N.cover.authorLogoUrl;
                  N.cover.authorLogo && (h = WALK.getExtraAssetUrl(N.cover.authorLogo.path));
                  var l = elementById("author-logo"),
                      m = l.firstElementChild;
                  h ? (f && (l.href = f), (m.src = h)) : (ti(l, !1), m.removeAttribute("src"));
                  h = null === D || null !== V;
                  ui("info-text", h && (e || d));
                  h && (WALK.setTextContent(elementById("info-title"), e), WALK.setTextContent(elementById("info-author"), d), f && (elementById("info-author").href = f));
                  e = e ? e : "3D scene";
                  d && (e += " by " + d);
                  document.title = e;
                  d = elementById("engine-logo");
                  ti(d, c);
                  c && (a && ((c = elementById("engine-logo-text")), ti(c, !0), WALK.setTextContent(c, a)), b && (d.href = b));
              }
              a = null === D ? [] : D.visibleViews();
              b = elementById("view-list-items");
              ui("view-list", 0 < a.length && !fa);
              if (0 < a.length) {
                  c = b.children[0];
                  for (g(c)(); 1 !== b.children.length; ) b.removeChild(b.children[b.children.length - 1]);
                  for (d = 0; d < a.length; d += 1) (e = a[d]), e.hideFromMenu || (WALK.setTextContent(c, e.name), (c.onclick = u(e)), b.appendChild(c), (c = c.cloneNode(!0)));
              }
              ui("menu-buttons", D && !fa);
              D && D.canStartAutoTour() && !Y ? ui("tour-button", !0) : (S && S.isRunning() && S.stop(), ui("tour-button", !1));
          } else
              (l = elementById("menu-bar-content")),
                  (a.style.pointerEvents = "none"),
                  (b.style.left = -b.offsetWidth + "px"),
                  (c.style.pointerEvents = "none"),
                  (d.style.top = -d.offsetHeight + "px"),
                  (e.style.pointerEvents = "none"),
                  (h.style.pointerEvents = "auto"),
                  (f.style.right = -l.offsetWidth + "px"),
                  (h.children[0].style.transform = "rotate(180deg)");
          a = N.helpVisible;
          WALK.DETECTOR.mobile
              ? ui("mobile-help", a)
              : (ui("desktop-help", a),
                a &&
                    ((a = elementById("desktop-help-switch")),
                    (b = elementById("desktop-help-content")),
                    (c = aa ? 1 : 0),
                    a.children[c].classList.add("selected"),
                    ti(b.children[c], !0),
                    a.children[1 - c].classList.remove("selected"),
                    ti(b.children[1 - c], !1)));
      }
      function w() {
          N.visible = !O;
      }
      function y() {
          N.helpVisible = !U;
      }
      function z() {
          aa = !1;
          v();
      }
      function x() {
          aa = !0;
          v();
      }
      function A() {
          var a = p();
          E.switchToPreviousVisibleView(a ? 0 : void 0);
      }
      function B() {
          var a = p();
          E.switchToNextVisibleView(a ? 0 : void 0);
      }
      function L() {
          var a = elementById("interaction-prompt");
          a && ((oa = !0), wi(a));
      }
      function C() {
          oa && ((oa = !1), yi(elementById("interaction-prompt")));
      }
      function J(a) {
          C();
          if (!(a.ctrlKey || a.altKey || a.metaKey)) {
              var b = a.target || a.srcElement;
              b = b.nodeType === Node.ELEMENT_NODE ? b.nodeName.toUpperCase() : "";
              if (!/INPUT|SELECT|TEXTAREA/.test(b))
                  if (67 === a.keyCode && WALK.DEBUG) a.shiftKey ? WALK.DETECTOR.gl.extension("WEBGL_lose_context").restoreContext() : WALK.DETECTOR.gl.extension("WEBGL_lose_context").loseContext();
                  else if (null !== D) {
                      switch (a.keyCode) {
                          case 27:
                              p();
                              break;
                          case 70:
                              ca && d();
                              break;
                          case 76:
                              ha && e();
                              break;
                          case 72:
                              y();
                              break;
                          case 77:
                              w();
                              break;
                          case 86:
                              Q && c();
                              break;
                          case 80:
                              WALK.NO_SCREENSHOTS || (a.shiftKey ? Z.monoScreenToLocalImage(!0, 4e3, 2e3) : Z.monoScreenToLocalImage(!1, window.innerWidth, window.innerHeight));
                              break;
                          case 85:
                              WALK.loadScriptAndExecute(WALK.getViewerAssetUrl("lib/qrcode.js"), xi);
                              break;
                          case 219:
                              A();
                              break;
                          case 221:
                              B();
                      }
                      b = a.keyCode - 48;
                      if (1 <= b && 9 >= b) {
                          --b;
                          var f = null === D ? [] : D.visibleViews();
                          b = f.length > b ? f[b] : null;
                          null !== b && u(b)(a);
                      }
                  }
          }
      }
      function F() {
          C();
      }
      function I() {
          C();
      }
      function H() {
          C();
      }
      function M(a) {
          C();
          switch (a.action) {
              case WALK.GAMEPAD_ACTION.PREVIOUS:
                  A();
                  break;
              case WALK.GAMEPAD_ACTION.NEXT:
                  B();
          }
      }
      var N = this,
          G = { type: "visibilityChanged" },
          D = null,
          E = null,
          S = null,
          Z = null,
          Q = !1,
          ca = !1,
          ha = !1,
          fa = !1,
          Y = !1,
          O = !0,
          U = !1,
          aa = !1,
          V = null,
          oa = !1;
      this.cover = null;
      Object.defineProperty(this, "visible", {
          get: function () {
              var a = Y && WALK.DETECTOR.mobile;
              return O && !a;
          },
          set: function (a) {
              var b = this.visible;
              O = a;
              b !== this.visible && this.dispatchEvent(G);
              v();
          },
      });
      Object.defineProperty(this, "helpVisible", {
          get: function () {
              var a = Y && WALK.DETECTOR.mobile;
              return U && !a && !fa;
          },
          set: function (a) {
              U = a;
              v();
          },
      });
      this.updateCover = function (a) {
          this.cover = a;
          null !== V && clearTimeout(V);
          V = setTimeout(function () {
              V = null;
              v();
          }, 5e3);
          v();
      };
      this.refresh = function () {
          v();
      };
      this.onFullScreenChange = function () {};
      this.onPointerLockChange = function (a) {
          fa = a;
          v();
      };
      this.onVrChange = function (a) {
          var b = this.visible;
          Y = a;
          b !== this.visible && this.dispatchEvent(G);
          v();
      };
      this.onResize = function () {
          if (!this.visible) {
              var a = elementById("info-bar-slide"),
                  b = elementById("menu-bar-slide"),
                  c = elementById("view-list-slide");
              a.style.transition = "none";
              b.style.transition = "none";
              c.style.transition = "none";
              v();
              a.style.transition = "";
              b.style.transition = "";
              c.style.transition = "";
          }
      };
      this.enablePlayButton = function (a) {
          var b = elementById("play-button");
          b.addEventListener("click", a);
          ti(b, !0);
      };
      this.setVrSupported = function (a) {
          Q = a;
          vi("vr-specific", a);
      };
      this.setFullScreenSupported = function () {
          (ca = !a) && vi("fullscreen-specific", !0);
      };
      this.setPointerLockSupported = function () {
          ha = !a;
      };
      this.addExtraButton = function (a) {
          var b = elementById("tour-button"),
              c = document.createElement("img");
          c.src = a;
          a = document.createElement("div");
          a.className = "menu-button menu-item ui-hoverable ui-panel";
          a.appendChild(c);
          b.parentNode.insertBefore(a, b);
          return a;
      };
      this.removeExtraButton = function (a) {
          a.remove();
      };
      this.getExtraButonIcon = function (a) {
          return a.firstElementChild;
      };
      this.sceneLoadStarted = function () {
          ui("play-button", !1);
          ui("primary-progress", !0);
      };
      this.loadProgress = function (a) {
          a = a.totalDone() / a.total;
          if (null === D) {
              var b = Math.max(314.159 * (1 - a), 0);
              elementById("primary-progress-done").style.strokeDashoffset = b;
          }
          a = Math.floor(100 * a);
          elementById("secondary-progress-done").style.width = a + "%";
      };
      this.sceneReadyToDisplay = function (a, b, c, d) {
          D = a;
          E = b;
          E.addEventListener("teleportStarted", r);
          E.addEventListener("teleportDone", q);
          S = c;
          S.addEventListener("tourStarted", l);
          S.addEventListener("tourStopped", m);
          Z = d;
          yi(elementById("cover-image"));
          yi(elementById("primary-progress"));
          wi(elementById("secondary-progress"));
          a = WALK.getViewer();
          !D.interactionPrompt ||
              U ||
              WALK.EDIT_MODE ||
              (a._isMeeting()
                  ? a._onMeetingJoined(function () {
                        return L();
                    })
                  : L());
          D.addEventListener("viewAdded", v);
          D.addEventListener("viewRemoved", v);
          D.addEventListener("viewShifted", v);
          document.body.style.backgroundImage = "none";
          document.body.style.backgroundColor = "#000";
          v();
      };
      this.sceneLoadComplete = function () {
          ui("secondary-progress", !1);
      };
      this.init = function () {
          a && (vi("viewer-specific", !1), vi("editor-specific", !0));
          ri("ui-panel", function (a) {
              addClickHandlerFocusWalkCanvas(a);
          });
          WALK.DETECTOR.mobile && si("ui-hoverable");
          var e = elementById("author-logo"),
              f = e.firstElementChild;
          f.onload = function () {
              ti(e, !0);
          };
          f.onerror = function () {
              ti(e, !1);
          };
          document.addEventListener("keydown", J, !1);
          document.addEventListener("mousedown", F, !1);
          document.addEventListener("wheel", I, !1);
          document.addEventListener("touchstart", H, !1);
          addClickHandlerById("help-button", y);
          addClickHandlerById("fullscreen-button", d);
          addClickHandlerById("vr-button", c);
          addClickHandlerById("tour-button", n);
          addClickHandlerById("menu-bar-folder", w);
          addClickHandlerById("view-list-folder", w);
          addClickHandlerById("basic-desktop-help-option", z);
          addClickHandlerById("advanced-desktop-help-option", x);
          addClickHandlerById("close-desktop-help-button", y);
          addClickHandlerById("close-mobile-help-button", y);
          b.addEventListener("actionActivated", M);
          v();
      };
      this.contextLost = function () {
          D = E = S = Z = null;
          v();
      };
  }
  THREE.EventDispatcher.prototype.apply(zi.prototype);
  function Ai(a, b) {
      return Math.abs(a.x - b.x) < Number.EPSILON && Math.abs(a.y - b.y) < Number.EPSILON && Math.abs(a.z - b.z) < Number.EPSILON;
  }
  function Bi(a, b, c) {
      var d = Math.sin(b);
      b = Math.cos(b);
      a.set((a.x - c.x) * b - (a.y - c.y) * d + c.x, (a.x - c.x) * d + (a.y - c.y) * b + c.y, a.z);
  }
  function MinimapCamera(a) {
      var b = document.createElement("canvas");
      b.width = a;
      b.height = a;
      var c = (60 * Math.PI) / 180,
          d = -c / 2 - Math.PI / 2;
      c = c / 2 - Math.PI / 2;
      var e = b.getContext("2d");
      e.beginPath();
      e.arc(a / 2, a / 2, 4, 0, 2 * Math.PI);
      e.fillStyle = "rgb(101,224,128)";
      e.fill();
      e.moveTo(a / 2, a / 2);
      e.arc(a / 2, a / 2, 12, d, c, !0);
      e.lineTo(a / 2, a / 2);
      e.arc(a / 2, a / 2, 90, d, c);
      e.lineTo(a / 2, a / 2);
      e.fillStyle = "rgba(191,239,202, 0.5)";
      e.fill();
      return b;
  }
  function createMinimapCamera(a, b) {
      var c = document.createElement("div"),
          d = MinimapCamera(200);
      c.style.width = "200px";
      c.style.height = "200px";
      c.style.position = "absolute";
      c.style.pointerEvents = "none";
      c.style.zIndex = "2";
      c.style.opacity = "1";
      c.style.transition = "opacity 0.5s";
      c.id = "minimap-camera";
      c.appendChild(d);
      this.update = function (d, f) {
          c.style.left = (d.x / a) * 100 + "%";
          c.style.top = (d.y / b) * 100 + "%";
          c.style.transform = "translate(-100px, -100px) rotate(" + f + "rad)";
      };
      this.show = function () {
          c.style.opacity = "1";
      };
      this.hide = function () {
          c.style.opacity = "0";
      };
      this.getContainer = function () {
          return c;
      };
  }
  function Ei(a, b) {
      function c() {
          e = !0;
          var a = d.width,
              m = d.height;
          g !== a || h !== m ? ((g = a), (h = m), b(), window.requestAnimationFrame(c)) : 0 < f ? (--f, window.requestAnimationFrame(c)) : (e = !1);
      }
      if ("ResizeObserver" in window) new ResizeObserver(b).observe(a);
      else {
          var d = window.getComputedStyle(a),
              e,
              f,
              g,
              h;
          new MutationObserver(function () {
              f = 60;
              e || c();
          }).observe(a, { attributes: !0 });
          window.addEventListener("resize", function () {
              f = 60;
              e || c();
          });
      }
  }
  function Fi(a, b, c, d) {
      function e() {
          l.style.transform = "translate(" + g.x + "," + g.y + ")";
      }
      function f() {
          l.style.width = m.width;
          l.style.height = m.height;
      }
      var g = { x: 0, y: 0 },
          h = document.createElement("canvas");
      h.width = 3 * a;
      h.height = 3 * b;
      h.style.position = "absolute";
      h.style.maxWidth = "100%";
      h.style.maxHeight = "100%";
      var l = document.createElement("div");
      l.classList.add("minimap-content-controller");
      var m = window.getComputedStyle(h);
      d.appendChild(h);
      d.appendChild(l);
      Ei(c, f);
      this.add = function (a) {
          l.appendChild(a);
      };
      this.clear = function () {
          l.innerHTML = "";
      };
      this.updateOffset = function (c) {
          g.x = 50 - (c.x / a) * 100 + "%";
          g.y = 50 - (c.y / b) * 100 + "%";
          e();
      };
      this.addOffset = function () {
          e();
      };
      this.removeOffset = function () {
          l.style.transform = "";
      };
      this.updateRatio = function (c) {
          window.requestAnimationFrame(function () {
              var d = Math.abs(Math.sin(c.rotation)),
                  e = Math.abs(Math.cos(c.rotation));
              h.width = 3 * (a * c.ratio.x * e + b * c.ratio.y * d);
              h.height = 3 * (a * c.ratio.x * d + b * c.ratio.y * e);
              f();
          });
      };
  }
  function Gi(a, b, c, d) {
      function e() {
          G = b.minimapConfig.levels.map(function (a) {
              return { level: a, canvas: null, tab: null };
          });
      }
      function f() {
          G.forEach(function (a) {
              a.tab = document.createElement("div");
              a.tab.classList.add("minimap-tab");
              a.tab.innerText = a.level.name;
              a.tab.addEventListener("click", function () {
                  C.selectLevel(a.level);
                  focusWalkCanvas();
              });
              oa.appendChild(a.tab);
          });
      }
      function g(a) {
          N = a;
          H.show();
          G.forEach(function (b) {
              b.level === a ? b.tab.classList.add("minimap-tab-current") : b.tab.classList.remove("minimap-tab-current");
          });
      }
      function h(a) {
          G.forEach(function (b) {
              b.canvas && ((b.canvas.style.opacity = b.level === a ? "1" : "0"), (b.canvas.style.zIndex = b.level === a ? "1" : "0"));
              b.level === a ? b.tab.classList.add("minimap-tab-active") : b.tab.classList.remove("minimap-tab-active");
          });
      }
      function l() {
          var a = G.find(function (a) {
              return a.level === N;
          })
              ? N
              : G[G.length - 1].level;
          C.selectLevel(a, !0);
      }
      function m(a) {
          var b = G.filter(function (b) {
                  return b.level.slicePlaneHeight < a.slicePlaneHeight;
              }).sort(function (a, b) {
                  return b.level.slicePlaneHeight - a.level.slicePlaneHeight;
              })[0],
              c = G.filter(function (b) {
                  return b.level.slicePlaneHeight > a.slicePlaneHeight;
              }).sort(function (a, b) {
                  return a.level.slicePlaneHeight - b.level.slicePlaneHeight;
              })[0];
          E = b ? a.slicePlaneHeight - (a.slicePlaneHeight - b.level.slicePlaneHeight) / 2 : -Infinity;
          S = c ? a.slicePlaneHeight - (a.slicePlaneHeight - c.level.slicePlaneHeight) / 2 : Infinity;
      }
      function n(a) {
          return G.reduce(function (b, c) {
              return Math.abs(c.level.slicePlaneHeight - a.z) < Math.abs(b.level.slicePlaneHeight - a.z) ? c : b;
          }).level;
      }
      function p(a, b) {
          N &&
              (a || b || ((a = d.getCameraPosition()), (b = d.getCameraRotation())),
              ia.set(a.x, a.y),
              Bi(ia, N.rotation, N.cropRange.center()),
              W.set(THREE.Math.mapLinear(ia.x, N.visibleRange.max.x, N.visibleRange.min.x, Ga.max, Ga.min), THREE.Math.mapLinear(ia.y, N.visibleRange.max.y, N.visibleRange.min.y, Fa.max, Fa.min)),
              H.update(W, -1 * b.z + -1 * N.rotation),
              I && M.updateOffset(W));
      }
      function r() {
          I = !0;
          U.classList.add("minimap-container-minimized");
          aa.classList.add("minimap-wrapper-minimized");
          M.addOffset();
          p();
      }
      function q() {
          I = !1;
          U.classList.remove("minimap-container-minimized");
          aa.classList.remove("minimap-wrapper-minimized");
          M.removeOffset();
      }
      function u() {
          J = !0;
          aa.style.transform = "translate(-101%, 0)";
      }
      function v() {
          d.menuVisible ? (I && (640 > window.innerWidth || 640 > window.innerHeight) ? (q(), (J = !1), (aa.style.transform = "")) : J ? ((J = !1), (aa.style.transform = "")) : u()) : u();
      }
      function w() {
          (J && d.menuVisible && (640 > window.innerWidth || 640 > window.innerHeight)) || v();
      }
      function y(a, b, d) {
          var e = new THREE.Vector3();
          b.addEventListener("click", function (f) {
              var h = b.getBoundingClientRect(),
                  l = (f.clientX - h.left) / h.width;
              f = (f.clientY - h.top) / h.height;
              0 !== a.data[4 * (Math.round(l * Q) + Math.round(f * ca) * Q) + 3] &&
                  (e.set(THREE.Math.mapLinear(l, 0, 1, d.visibleRange.min.x, d.visibleRange.max.x), THREE.Math.mapLinear(f, 0, 1, d.visibleRange.min.y, d.visibleRange.max.y), d.slicePlaneHeight),
                  Bi(e, -1 * d.rotation, d.cropRange.center()),
                  (l = new WALK.View({ position: [e.x, e.y, e.z] })),
                  c.switchToView(l),
                  d !== N && g(d));
              focusWalkCanvas();
          });
      }
      function z() {
          M.add(H.getContainer());
          O.style.display = "";
          U.style.display = "";
          1 < G.length && ((oa.style.display = ""), aa.classList.add("minimap-wrapper-tabs"));
      }
      function x() {
          M.clear();
          oa.innerHTML = "";
          oa.style.display = "none";
          U.style.display = "none";
          O.style.display = "none";
          aa.classList.remove("minimap-wrapper-tabs");
      }
      function A(c) {
          var d = document.createElement("canvas");
          d.width = Q;
          d.height = ca;
          d.style.transition = "opacity 0.5s";
          var e = a.createMinimapImageDataComponents(b.minimapConfig, c, Q, ca),
              f = e.minimapImageData;
          e = e.walkableImageData;
          d.getContext("2d").putImageData(f, 0, 0);
          y(e, d, c);
          M.add(d);
          return d;
      }
      function B() {
          if (!(ha && fa && Y && O && U && aa && V)) return !0;
      }
      function L() {
          B() || ((M = new Fi(Q, ca, aa, V)), (H = new createMinimapCamera(Q, ca)), 640 > window.innerWidth || 640 > window.innerHeight ? u() : r(), addClickHandler(ha, r), addClickHandler(fa, q), addClickHandler(Y, u), addClickHandler(O, v), d.onMenuVisibilityChanged(w), (F = !0), e(), f(), l(), z());
      }
      var C = this,
          J = !1,
          F = !1,
          I = !1,
          H = null,
          M = null,
          N = null,
          G = [],
          D = !1,
          E = -Infinity,
          S = Infinity;
      d.onViewSwitchStarted(function () {
          return (D = !0);
      });
      d.onViewSwitchDone(function () {
          return (D = !1);
      });
      var Z = a.calculateRenderSize(700, b.boundingBox),
          Q = Z.width,
          ca = Z.height,
          ha = document.getElementById("minimap-button-minimize"),
          fa = document.getElementById("minimap-button-maximize"),
          Y = document.getElementById("minimap-button-close"),
          O = document.getElementById("minimap-button-toggle"),
          U = document.getElementById("minimap-container"),
          aa = document.getElementById("minimap-wrapper"),
          V = document.getElementById("minimap-content"),
          oa = document.getElementById("minimap-tabs"),
          ka = new THREE.Vector3(0, 0, 0),
          ma = new THREE.Vector3(0, 0, 0),
          ia = new THREE.Vector2(),
          W = new THREE.Vector2(),
          Ga = { min: 0, max: Q },
          Fa = { min: 0, max: ca },
          jb = { type: "minimapLevelSelected", target: this, level: null };
      THREE.EventDispatcher.prototype.apply(Gi.prototype);
      this.selectLevel = function (a, b) {
          b = void 0 === b ? !1 : b;
          var c = G.filter(function (b) {
              return b.level === a;
          })[0];
          b && g(a);
          c.canvas || (c.canvas = A(a));
          a === N ? H.show() : H.hide();
          h(a);
          m(a);
          p();
          M.updateRatio(a);
          jb.level = a;
          this.dispatchEvent(jb);
      };
      this.update = function () {
          if (!B()) {
              var a = d.getCameraPosition(),
                  b = d.getCameraRotation();
              if (!1 === Ai(ka, a) || !1 === Ai(ma, b)) {
                  p(a, b);
                  if (!D && (a.z > S || a.z < E)) {
                      var c = n(a);
                      m(c);
                      C.selectLevel(c, !0);
                  }
                  ka.set(a.x, a.y, a.z);
                  ma.set(b.x, b.y, b.z);
              }
          }
      };
      b.minimapConfig.enabled && L();
      b.minimapConfig.addEventListener("updated", function () {
          F ? (b.minimapConfig.enabled ? (x(), e(), f(), l(), z()) : x()) : L();
      });
      d._onMeetingJoined(u);
  }
  WALK.Timer = function () {
      this.clock = performance || Date;
      this.reset();
  };
  WALK.Timer.prototype = {
      constructor: WALK.Timer,
      reset: function () {
          this.startMS = this.clock.now();
      },
      elapsedMSec: function () {
          return this.clock.now() - this.startMS;
      },
      elapsedSec: function () {
          return 0.001 * this.elapsedMSec();
      },
  };
  WALK.Timeout = function (a, b) {
      var c = null;
      this.start = function () {
          null !== c && clearTimeout(c);
          c = setTimeout(function () {
              c = null;
              b && b();
          }, a);
      };
      this.isRunning = function () {
          return null !== c;
      };
  };
  WALK.Perf = function () {
      var a = new WALK.Timer(),
          b = [];
      this.percentile95 = this.median = this.max = this.last = 0;
      this.log = !1;
      this.begin = function () {
          a.reset();
      };
      this.end = function () {
          this.last = a.elapsedSec();
          this.last > this.max && (this.max = this.last);
          b.push(this.last);
          if (0 === b.length % 100) {
              var c = Array.from(b);
              c.sort();
              this.median = c[Math.floor(0.5 * c.length)];
              this.percentile95 = c[Math.floor(0.95 * c.length)];
              this.log && console.log("Median " + this.median + " 95 " + this.percentile95);
              3600 < b.length && b.splice(0, 100);
          }
      };
  };
  WALK.DeferringExecutorOnce = function (a, b) {
      function c() {
          d = null;
          a();
      }
      var d = null;
      this.deferRun = function () {
          null !== d && clearTimeout(d);
          d = setTimeout(c, b);
      };
  };
  WALK.DeferringExecutorInterval = function (a, b) {
      function c() {
          a();
      }
      var d = null;
      this.deferRun = function () {
          null !== d && clearInterval(d);
          d = setInterval(c, b);
      };
  };
  WALK.AnimationController = function (a, b, c) {
      function d() {
          m || (l || h.getDelta(), (m = !0), a.vrEnabled() ? a.requestAnimationFrame(e) : requestAnimationFrame(f));
      }
      function e() {
          q(a.vrEnabled());
      }
      function f() {
          q(!1);
      }
      var g = this,
          h = new THREE.Clock(),
          l = !1,
          m = !1,
          n = !1,
          p = 0,
          r = !1;
      var q = function (a) {
          r && ((m = !1), n ? (console.assert(!a), c(h.getDelta(), p) ? ((p += 1), d()) : (n = !1)) : ((l = !0), b(h.getDelta(), a), WALK.ALWAYS_RENDER && g.requestFrame(), (l = !1), m || ((n = !0), (p = 0), d())));
      };
      this.requestFrame = function () {
          r && ((n = !1), d());
      };
      this.disable = function () {
          r = !1;
      };
      this.enable = function () {
          r = !0;
          m = !1;
          this.requestFrame();
      };
      this.isEnabled = function () {
          return r;
      };
  };
  function Hi(a, b, c) {
      function d(a) {
          m = a;
          g = a - e.exposure;
          l = Math.sign(g);
          g = Math.abs(g);
          h = g / 1;
      }
      var e = a.camera,
          f = !1,
          g = 0,
          h,
          l,
          m,
          n = new WALK.Timer();
      this.adaptExposure = function () {
          if (f && e.autoExposure) {
              n.reset();
              var a = c.measureReflectedLuma();
              0 > a ? (g = 0) : (d(Math.log2(e.autoExposureDarkness / a)), 0.3 > g && (g = 0));
          }
      };
      this.exposureNeedsUpdate = function () {
          return 0 < g;
      };
      var p = new THREE.Vector3(Infinity, Infinity, Infinity),
          r = (function () {
              return function () {
                  if (!f || !e.autoExposure) {
                      for (var b = a.cameraVolumes.length - 1; 0 <= b; --b) {
                          var c = a.cameraVolumes[b];
                          if (c.worldCoordinatesInside(p)) {
                              d(c.exposure);
                              e.setGamma(c.gamma);
                              return;
                          }
                      }
                      d(e.defaultExposure);
                      e.setGamma(e.defaultGamma);
                  }
              };
          })();
      a.addEventListener("cameraVolumeAdded", function (a) {
          a.cameraVolume.addEventListener("updated", r);
          r();
      });
      a.addEventListener("cameraVolumeShifted", r);
      a.addEventListener("cameraVolumeRemoved", function (a) {
          a.cameraVolume.removeEventListener("cameraVolumeUpdated", r);
          r();
      });
      e.addEventListener("updated", r);
      this.update = function (a) {
          var c = b.cameraWorldPosition();
          p.equals(c) || (p.copy(c), r());
          this.exposureNeedsUpdate() && ((a = Math.min(h * a, g)), (g -= a), 1e-5 > g ? ((g = 0), (e.exposure = m)) : (e.exposure += a * l));
      };
      this.updateWithoutDelay = function () {
          this.update(1);
      };
      this.enableAutoExposure = function () {
          f = !0;
          g = 0;
      };
      this.disableAutoExposure = function () {
          f = !1;
          r();
      };
  }
  function Ii(a, b) {
      for (var c = 0, d = 0, e = 0; 65536 > e; ++e) {
          var f = 4 * e;
          f = a[f] + 255 * a[f + 1];
          0 !== f && ((d += 1), (b[f] += 1), (c = Math.max(c, f)));
      }
      if (256 > d) return -1;
      e = a = 0;
      for (f = 1; f <= c; ++f)
          if (b[f] + a < 0.3 * d) (a += b[f]), (b[f] = 0);
          else break;
      for (f = c; 0 <= f; --f)
          if (b[f] + e < 0.1 * d) (e += b[f]), (b[f] = 0);
          else break;
      f = 0;
      for (var g = 1; g <= c; ++g) (f += b[g] * Math.log(g / 255)), (b[g] = 0);
      return Math.exp(f / (d - a - e));
  }
  function Ji(a, b) {
      function c(c) {
          e ||
              (console.assert(!e),
              (e = a.createRenderTarget(256, 256, { minFilter: GLC.NEAREST, magFilter: GLC.NEAREST, format: GLC.RGBA, stencilBuffer: !1, generateMipmaps: !1 })),
              (f = new uc(a)),
              (g = new Uint8Array(262144)),
              (h = new Uint32Array(65280)),
              (l = new WALK.LumaMaterial(!0)),
              (m = new WALK.LumaMaterial(!1)));
          c = c ? l : m;
          f.set(!0, !0, !1);
          var n = b.gpuMeshes.filter(function (a) {
              return !a.material.transparent;
          });
          a.renderMeshes(n, c, d, e);
          a.readPixels(256, 256, g);
          a.setRenderTarget(null);
          f.restore();
          return Ii(g, h);
      }
      var d = b.camera,
          e,
          f,
          g,
          h,
          l,
          m;
      this.measureIncidentLuma = function () {
          return c(!0);
      };
      this.measureReflectedLuma = function () {
          return c(!1);
      };
  }
  function Ki(a, b, c, d, e) {
      return a.createRenderTarget(b, c, { format: GLC.RGBA, magFilter: d, minFilter: d, depthBuffer: e, stencilBuffer: !1, generateMipmaps: !1 });
  }
  function Li(a, b, c) {
      var d = [],
          e = [],
          f = [
              { totalFovFraction: 0.25, count: 2 },
              { totalFovFraction: 0.25, count: 16 },
              { totalFovFraction: 0.375, count: 48 },
              { totalFovFraction: 0.125, count: 8 },
          ];
      (function () {
          for (var g = 0, h = 0, l = 0, m = 0; m < f.length; m++) {
              var n = f[m],
                  p = (n.totalFovFraction * a) / n.count;
              console.assert(p === Math.floor(p), "Height (" + p + ")must be an integer");
              var r = (n.totalFovFraction * Math.PI) / 2 / n.count,
                  q = Ki(c, 4 * b, 4 * p, GLC.LINEAR, !0);
              e.push(q);
              for (var u = 0; u < n.count; u++) d.push({ fov: r, fovOffset: g + (u + 0.5) * r, height: p, yOffset: h + u * p, renderTarget: q });
              g += n.count * r;
              h += n.count * p;
              l += n.totalFovFraction;
          }
          console.assert(1 === l, "Invalid fractions sum");
          console.assert(g === Math.PI / 2, "Invalid fov definition for rectangles");
          console.assert(h === a, "Invalid rectangles height");
      })();
      this.getRectangleHeight = function (a) {
          return d[a].height;
      };
      this.getRectangleOffset = function (a) {
          return d[a].yOffset;
      };
      this.getRectangleFov = function (a) {
          return d[a].fov;
      };
      this.getRectangleFovOffset = function (a) {
          return d[a].fovOffset;
      };
      this.getRectangleRenderTarget = function (a) {
          return d[a].renderTarget;
      };
      this.dispose = function () {
          e.forEach(function (a) {
              a.dispose();
          });
          d.length = 0;
          e.length = 0;
      };
      this.getRectangleCount = function () {
          return d.length;
      };
  }
  function Mi(a, b, c) {
      function d() {
          var a = (document.body.offsetWidth - document.body.offsetHeight * l) / 2,
              b = a + "px";
          a = Math.max(a, 0) + "px";
          m.style.width = a;
          n.style.width = a;
          p.style.left = b;
          p.style.right = b;
      }
      function e(c, d, e, f, g, h) {
          function l(c, d) {
              for (var g = oa[c].hemisphere, q = oa[c].eyeOffset, r = oa[c].parallaxOffset, w = oa[c].targetYOffset, v = 0; v < ha; v++) {
                  p(g, d, v, q);
                  var z = ca.getRectangleRenderTarget(v);
                  a.render(b.threeScene, Q, z);
                  var x = ca.getRectangleHeight(v),
                      B = ca.getRectangleOffset(v);
                  aa.y = g === E ? w + H + B : w + H - B - x;
                  aa.x = (d * y + r + e) % e;
                  aa.height = x;
                  V.render(a, aa, z);
              }
              h()
                  ? n(null)
                  : ((g = _.makeIterator(m(c, d))),
                    (c = g.next().value),
                    (d = g.next().value),
                    -1 === c
                        ? ((g = new Uint8Array(2 * e * u * 4)), a.readPixels(e, 2 * u, g), n(g))
                        : (0 === d % ma && f({ done: 512 * c + d, total: ka }),
                          setTimeout(function () {
                              return l(c, d);
                          }, 0)));
          }
          function m(a, b) {
              b++;
              if (512 === b) {
                  a++;
                  if (a === oa.length) return [-1, -1];
                  b = 0;
              }
              return [a, b];
          }
          function n(a) {
              aa.dispose();
              ca.dispose();
              V.dispose();
              g(a);
          }
          function p(a, b, d, e) {
              b = -(b * v - S);
              a = a === E ? -ca.getRectangleFovOffset(d) : ca.getRectangleFovOffset(d);
              fa.set(e, 0, 0).applyMatrix4(U.makeRotationZ(b));
              Q.position.copy(c).add(fa);
              Y.copy(w).applyMatrix4(U.makeRotationX(a)).applyMatrix4(U.makeRotationZ(b));
              O.copy(Q.position).add(Y);
              Q.lookAt(O);
              d = q * Math.tan(ca.getRectangleFov(d) / 2);
              e = Z * Math.cos(a);
              Q.projectionMatrix.makeFrustum(-e, e, -d, d, q, r);
              Q.updateMatrix();
              Q.updateMatrixWorld();
          }
          var q = b.camera.near,
              r = b.camera.far;
          console.assert(0 === e % 512, "Invalid width for stereo panorama");
          var u = e / 2,
              w = new THREE.Vector3(0, -1, 0),
              H = u / 2,
              v = (2 * Math.PI) / 512,
              y = e / 512,
              z = -y;
          _.initSymbol();
          _.initSymbol();
          var D = Symbol("Bottom"),
              E = Symbol("Top"),
              S = Math.floor(d / v) * v,
              Z = q * Math.tan(v / 2),
              Q = new THREE.PerspectiveCamera();
          Q.up.set(0, 0, 1);
          var ca = new Li(H, y, a),
              ha = ca.getRectangleCount(),
              fa = new THREE.Vector3(),
              Y = new THREE.Vector3(),
              O = new THREE.Vector3(),
              U = new THREE.Matrix4(),
              aa = Ki(a, e, 2 * u, GLC.NEAREST, !1);
          aa.width = y;
          var V = new Kd(),
              oa = [
                  { hemisphere: E, eyeOffset: 0.03, parallaxOffset: z, targetYOffset: u },
                  { hemisphere: D, eyeOffset: 0.03, parallaxOffset: z, targetYOffset: u },
                  { hemisphere: E, eyeOffset: -0.03, parallaxOffset: y, targetYOffset: 0 },
                  { hemisphere: D, eyeOffset: -0.03, parallaxOffset: y, targetYOffset: 0 },
              ],
              ka = 512 * oa.length,
              ma = Math.ceil(ka / 100);
          l(0, 0);
      }
      function f(c, d, e, f) {
          var g = new Kf(b.camera.near, b.camera.far);
          g.rotateZ(d);
          g.position.copy(c);
          g.updateMatrixWorld();
          c = a.createRenderTargetCube(4096, 4096, { format: GLC.RGBA, magFilter: GLC.LINEAR, minFilter: GLC.LINEAR, stencilBuffer: !1, generateMipmaps: !1 });
          for (d = 0; 6 > d; d += 1) (c.activeCubeFace = d), a.render(b.threeScene, g.sideCameras[d], c);
          g = Ki(a, e, f, GLC.NEAREST, !0);
          d = { uniforms: { panoramaCube: { type: "t", value: null } }, vertexShader: WALK.getShader("cube_to_equirect_vertex.glsl"), fragmentShader: WALK.getShader("cube_to_equirect_fragment.glsl") };
          d = new THREE.ShaderPass(d, "panoramaCube");
          d.render(a, g, c);
          d.dispose();
          c.dispose();
          c = new Uint8Array(e * f * 4);
          a.readPixels(e, f, c);
          g.dispose();
          return c;
      }
      function g(c, d) {
          var e = Ki(a, c, d, GLC.NEAREST, !0);
          c = Ki(a, c, d, GLC.NEAREST, !1);
          d = new Od(a, b);
          d.setTargets(e, c);
          d.renderAllSamples();
          var f = d.copyAccumulatedSamplesToBuffer();
          e.dispose();
          c.dispose();
          d.dispose();
          return f;
      }
      function h(a, b) {
          var c = Math.min(WALK.MAX_PANORAMA_SIZE, WALK.DETECTOR.gl.maxRenderBufferSize);
          if (a <= c && b <= c) return [a, b];
          var d = a / b;
          return a > b ? [c, Math.floor(c / d)] : [Math.floor(c * d), c];
      }
      var l = null,
          m = null,
          n = null,
          p = null,
          r = new THREE.Vector3();
      this.markArea = function (a) {
          function b(a, b) {
              a.style.zIndex = 1;
              a.style.pointerEvents = "none";
              a.style.position = "absolute";
              a.style.top = 0;
              a.style.bottom = 0;
              a.style[b] = 0;
              a.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          }
          function c(a) {
              a.style.zIndex = 1;
              a.style.pointerEvents = "none";
              a.style.position = "absolute";
              a.style.boxSizing = "border-box";
              a.style.top = 0;
              a.style.bottom = 0;
              a.style.border = "4px solid rgba(35, 181, 233, 0.5)";
          }
          p ||
              ((m = document.createElement("div")),
              b(m, "left"),
              (n = document.createElement("div")),
              b(n, "right"),
              (p = document.createElement("div")),
              c(p),
              document.body.appendChild(m),
              document.body.appendChild(n),
              document.body.appendChild(p),
              window.addEventListener("resize", d));
          l = a;
          d();
      };
      this.unmarkArea = function () {
          p && (m.remove(), n.remove(), p.remove(), window.removeEventListener("resize", d), (p = n = m = l = null));
      };
      this.monoScreenToBuffer = function (a, b, d) {
          return a ? f(c.cameraWorldPosition(), c.getYawAngle(), b, d) : g(b, d);
      };
      this.stereoPanoramaToBuffer = function (a, b, d, f) {
          e(c.cameraWorldPosition(), c.getYawAngle(), a, b, d, f);
      };
      this.monoScreenToDataUrl = function (a, b, c) {
          a = this.monoScreenToBuffer(a, b, c);
          for (var d = 0; d < c; ++d)
              for (var e = 0; e < b; ++e) {
                  var f = 4 * (d * b + e);
                  if (d < c / 2)
                      for (var g = 4 * ((c - d - 1) * b + e), h = 0; 3 > h; ++h) {
                          var l = a[f + h];
                          a[f + h] = a[g + h];
                          a[g + h] = l;
                      }
                  a[f + 3] = 255;
              }
          a = new Uint8ClampedArray(a);
          a = new ImageData(a, b, c);
          d = document.createElement("canvas");
          d.width = b;
          d.height = c;
          d.getContext("2d").putImageData(a, 0, 0);
          return d.toDataURL("image/jpeg");
      };
      this.monoScreenToLocalImage = function (a, b, c) {
          a = this.monoScreenToDataUrl(a, b, c);
          navigator.msSaveOrOpenBlob
              ? fetch(a)
                    .then(function (a) {
                        return a.blob();
                    })
                    .then(function (a) {
                        return navigator.msSaveOrOpenBlob(a, "screen.jpg");
                    })
              : ((b = document.createElement("a")), document.body.appendChild(b), (b.style.cssText = "display: none"), (b.href = a), (b.download = "screenshot"), b.click(), window.URL.revokeObjectURL(a), b.parentNode.removeChild(b));
      };
      this.coverToServer = function (a, b) {
          var c = g(a, b);
          WALK.ajaxPost("screenshot?width=" + a + "&height=" + b, "application/binary", c);
      };
      this.monoPanoramaToServer = function (a, b) {
          a.position ? r.fromArray(a.position) : r.copy(c.cameraWorldPosition());
          var d = void 0 !== a.width ? a.width : 8e3,
              e = void 0 !== a.height ? a.height : 4e3;
          e = _.makeIterator(h(d, e));
          d = e.next().value;
          e = e.next().value;
          var g = void 0 !== a.rotation ? THREE.Math.degToRad(a.rotation) : 0;
          g = f(r, g, d, e);
          WALK.ajaxPost("panorama?width=" + d + "&height=" + e + "&name=" + a.name, "application/binary", g, b, b);
      };
  }
  function Ni(a) {
      var b = new WALK.OutlineMaterial(new THREE.Color(0, 0, 0), 1),
          c = new WALK.StandardMaterial();
      a.hasLightMap() ? (c.lightMapped = !0) : (c.specularOff = !0);
      c.setUniforms();
      return { outlineMaterial: b, planMaterial: c };
  }
  function Oi(a, b, c) {
      for (var d = 0; d < c; ++d)
          for (var e = 0; e < b; ++e) {
              var f = 4 * (d * b + e);
              if (d < c / 2)
                  for (var g = 4 * ((c - d - 1) * b + e), h = 0; 4 > h; ++h) {
                      var l = a[f + h];
                      a[f + h] = a[g + h];
                      a[g + h] = l;
                  }
          }
  }
  function Pi(a, b) {
      console.assert(0 === b % 4, "id passed does not point to alpha channel");
      return 0 !== a[b + 3];
  }
  function Qi(a, b) {
      console.assert(0 === b % 4, "id passed does not point to alpha channel");
      return 255 > a[b + 3];
  }
  function Ri(a, b, c) {
      return 255 > a[c + 3] && a[c + 3] >= a[b + 3];
  }
  function Si(a, b, c) {
      return a.createRenderTarget(b, c, { format: GLC.RGBA, magFilter: GLC.NEAREST, minFilter: GLC.NEAREST, stencilBuffer: !1, generateMipmaps: !1 });
  }
  function Ti(a, b) {
      var c = {
          uniforms: { tColor: { type: "t", value: null }, tAlpha: { type: "t", value: null }, colorFill: { type: "c", value: null } },
          vertexShader: WALK.getShader("minimap_add_alpha_vertex.glsl"),
          fragmentShader: WALK.getShader("minimap_add_alpha_fragment.glsl"),
      };
      c = new THREE.ShaderPass(c, "tColor");
      c.uniforms.tAlpha.value = a;
      b && (c.material.condDefine(!0, "USE_ALPHA_FROM_COLOR"), (c.uniforms.colorFill.value = b));
      return c;
  }
  function Ui(a, b) {
      function c(c, d, e, f, n, p, r) {
          var g = new Uint8Array(d.width * d.height * 4),
              h = new uc(a);
          h.set(!0, !0, !1);
          var l = [];
          b.gpuMeshes.forEach(function (a) {
              (a.logicalMeshes || [a]).forEach(function (a) {
                  var b = n ? !a.node.disableCollisions : !0;
                  (f ? !a.material.transparent : 1) && b && l.push(a);
              });
          });
          if (p) {
              p = Si(a, d.width, d.height);
              var m = Si(a, d.width, d.height);
              c = new Od(a, b, c);
              c.setTargets(p, m);
              c.renderAllSamples(l, e);
              e = Ti(p, r);
              h.restore();
              h.set(!0, !0, !1);
              e.render(a, d, m);
              h.restore();
              a.readPixels(d.width, d.height, g);
              p.dispose();
              m.dispose();
              c.dispose();
          } else a.renderMeshes(l, e, c, d), h.restore(), a.readPixels(d.width, d.height, g);
          Oi(g, d.width, d.height);
          return g;
      }
      function d(a, b, c, d, e) {
          d = Math.max(d, e);
          c = Math.max(c.size().x, c.size().y);
          f.outlineMaterial.setUniform("thickness", "f", a / ((d / c) * 0.1));
          f.outlineMaterial.setUniform("color", "c", b);
      }
      var e = new THREE.Color(1, 1, 1),
          f = Ni(b);
      this.createMinimapImageDataComponents = function (g, h, l, m) {
          d(g.outlineThickness, e, b.boundingBox, l, m);
          var n = h.cropRange.center(),
              p = Si(a, l, m),
              r = new THREE.OrthographicCamera(h.visibleRange.min.x - n.x, h.visibleRange.max.x - n.x, h.visibleRange.min.y - n.y, h.visibleRange.max.y - n.y, 0, 10);
          r.rotation.set(0, 0, -1 * h.rotation);
          r.position.set(n.x, n.y, h.slicePlaneHeight);
          r.updateMatrixWorld(!0);
          h = h.slicePlaneHeight - h.farPlaneHeight;
          r.near = 0;
          r.far = h;
          r.updateProjectionMatrix();
          h = c(r, p, f.planMaterial, !0, !0, !0);
          if (0 < b.minimapConfig.outlineThickness) {
              r.near = 0;
              r.far = 0.1;
              r.updateProjectionMatrix();
              var q = c(r, p, f.outlineMaterial, !0, !0, !0, g.outlineColor);
              if (b.minimapConfig.fillEnabled) {
                  r = q;
                  g = g.outlineColor;
                  var u = void 0;
                  u = void 0 === u ? 0.02 : u;
                  n = new Uint8Array(r.length);
                  u *= r.length / 4;
                  for (var v = [-4, 4, 4 * -l, 4 * l], w = 0; w < r.length; w += 4)
                      if (0 === n[w] && Qi(r, w)) {
                          var y = r,
                              z = [],
                              x = [],
                              A = w,
                              B = x;
                          n[A] = 1;
                          for (B.push(A); x.length; ) {
                              A = x.pop();
                              z.push(A);
                              B = y;
                              for (var L = x, C = 0; C < v.length; ++C) {
                                  var J = A + v[C];
                                  if ((J = 0 === n[J] && Ri(B, A, J))) {
                                      J = A + v[C];
                                      var F = L;
                                      n[J] = 1;
                                      F.push(J);
                                  }
                              }
                          }
                          y = z;
                          if (y.length < u) for (z = g, x = r, A = 0; A < y.length; ++A) (x[y[A]] = 255 * z.r), (x[y[A] + 1] = 255 * z.g), (x[y[A] + 2] = 255 * z.b), (x[y[A] + 3] = 255);
                      }
              }
              r = q;
              for (g = 0; g < h.length; g += 4)
                  if (Pi(r, g)) {
                      n = r[g + 3] / 255;
                      for (u = 0; 3 > u; ++u) h[g + u] = h[g + u] * (1 - n) + r[g + u] * n;
                      h[g + 3] = 255;
                  }
          }
          p.dispose();
          p = new Uint8Array(h.length);
          for (r = 0; r < h.length; r += 4) if (Pi(h, r) && (!q || Qi(q, r))) for (g = 0; 4 > g; ++g) p[r + g] = 255;
          h = new Uint8ClampedArray(h.buffer);
          h = new ImageData(h, l, m);
          p = new Uint8ClampedArray(p.buffer);
          l = new ImageData(p, l, m);
          return { minimapImageData: h, walkableImageData: l };
      };
      this.getCollisionData = function (e, h, l) {
          var g = { x: { min: 0, max: h }, y: { min: 0, max: l } },
              n = { x: { min: b.collisionBoundingBox.min.x, max: b.collisionBoundingBox.max.x }, y: { min: b.collisionBoundingBox.max.y, max: b.collisionBoundingBox.min.y } };
          d(e.outlineThickness, e.outlineColor, b.collisionBoundingBox, h, l);
          var p = a.createRenderTarget(h, l, { format: GLC.RGBA, magFilter: GLC.NEAREST, minFilter: GLC.NEAREST, stencilBuffer: !1, generateMipmaps: !1 }),
              r = new THREE.OrthographicCamera(b.collisionBoundingBox.min.x, b.collisionBoundingBox.max.x, b.collisionBoundingBox.max.y, b.collisionBoundingBox.min.y, 0, 10);
          r.position.set(0, 0, e.slicePlaneHeight);
          r.updateMatrixWorld(!0);
          r.near = 0;
          r.far = 0.1;
          r.updateProjectionMatrix();
          e = c(r, p, f.outlineMaterial, !1, !0);
          p.dispose();
          p = new Uint8ClampedArray(e.buffer);
          return { collisionImageData: new ImageData(p, h, l), canvasRange: g, collisionRange: n };
      };
      this.calculateRenderSize = function (a, b) {
          b = b.size().y / b.size().x;
          return { width: 1 > b ? a : Math.round((1 / b) * a), height: 1 > b ? Math.round(a * b) : a };
      };
  }
  function Vi(a, b, c, d, e, f, g, h) {
      function l(a, b) {
          a = a ? e : d;
          for (var c = 0; c < a.length; c += 1) if (a[c](b.object, b.point, b.distance)) return !0;
          return !1;
      }
      function m() {
          return b.findIntersectionAtPosition(0, 0, !0, v);
      }
      function n() {
          l(!1, v);
      }
      function p(a, c, d) {
          h && h.reset();
          return b.findIntersectionAtPosition(a, c, !0, z) ? l(d, z) : !1;
      }
      function r(a) {
          h && h.reset();
          a.action === WALK.GAMEPAD_ACTION.TRIGGER && p(0, 0, !1);
      }
      function q(a, b) {
          for (var c = 0; c < f.length && !f[c](a, b); c += 1);
      }
      var u = !1,
          v = new xc(),
          w = null;
      h && h.setGazeHandlers(m, n);
      var y = new tc(a, WALK.POINTER_PRIORITY.INTERACTION_DISPATCHER);
      a = y.callbacks;
      var z = new xc(),
          x = null,
          A = null;
      a.onPointerMove = function (a, b) {
          console.assert(u);
          0 !== f.length && ((x = a), (A = b), c());
          return !1;
      };
      a.onClick = function (a, b) {
          return p(a, b, !1);
      };
      a.onDoubleClick = function (a, b) {
          return p(a, b, !0);
      };
      g.addEventListener("actionActivated", r);
      this.handleHover = function () {
          if (u && 0 !== f.length) {
              var a = b.findObstacleMeshAtPosition(x, A, !0);
              null === a ? w && (q(w, !1), (w = null)) : a !== w && (w && q(w, !1), q(a, !0), (w = a));
          }
      };
      this.enable = function () {
          u = !0;
          y.enable();
          console.assert(null === w);
      };
      this.disable = function () {
          u = !1;
          null !== w && (q(w, !1), (w = null));
          y.disable();
      };
      this.dispose = function () {
          this.disable();
          g.removeEventListener("actionActivated", r);
      };
      this.enable();
  }
  var Wi = document.getElementById("walk-canvas"),
      Xi = WALK.EDIT_MODE,
      Yi,
      Zi,
      $i,
      aj,
      bj,
      cj,
      dj,
      ej,
      fj,
      gj,
      hj,
      ij,
      jj,
      kj,
      currentScene,
      mj,
      nj,
      oj,
      pj,
      qj,
      rj,
      viewList,
      tj,
      hashchangeHandler,
      localTeleport,
      wj,
      xj = null,
      yj = null,
      zj = null,
      Aj,
      Bj,
      Cj,
      Dj = 0,
      Ej = !1,
      Fj = !1,
      Gj,
      Hj = new df();
  function Ij(a, b) {
      return mj.renderIdle(a, b);
  }
  function Jj(a, b) {
      yj && yj.begin();
      b && ej.update();
      viewList.update(a);
      Bj && currentScene.minimapConfig.enabled && Bj.update();
      gj.enableCollisions && !b && nj.handleCollisions(a);
      qj && qj.handleHover();
      rj.update(a);
      dj.update(a);
      oj && oj.updateCameraHeight(a);
      pj && pj.updateCameraHeight();
      b && !viewList.teleportingToPoint && (Zi.update(), fj.requestFrame());
      tj && (b && !ej.hasGamepads() ? tj.update(a) : tj.reset());
      for (var c = !1, d = _.makeIterator(currentScene.getAnimatedRootNodes()), e = d.next(); !e.done; e = d.next()) e.value.update(a, dj.cameraWorldPosition()) && (c = !0);
      d = _.makeIterator(currentScene.getAnimatedMaterials());
      for (e = d.next(); !e.done; e = d.next()) (e = e.value), e.isPlaying && (e.update(a), (c = !0));
      c && fj.requestFrame();
      wj && wj.update(a);
      bj._update(a);
      mj.renderToScreen(a, b);
      yj && yj.end();
  }
  function Kj(a) {
      a.view && (oj && oj.disable(), qj && qj.disable());
  }
  function Lj(a) {
      !oj || oj.isEnabled() || Zi.vrEnabled() || oj.enable();
      if (pj && Zi.vrEnabled()) pj.onTeleportDone();
      a.view && qj && qj.enable();
      Zi.vrEnabled() && dj.hmdReset();
  }
  function Mj() {
      if ("hidden" === document.visibilityState) {
          if (currentScene) for (var a = _.makeIterator(currentScene.getAnimatedMaterials()), b = a.next(); !b.done; b = a.next()) b.value.sleepAnimation();
      } else if ("visible" === document.visibilityState && currentScene) {
          a = _.makeIterator(currentScene.getAnimatedMaterials());
          for (b = a.next(); !b.done; b = a.next()) b.value.wakeAnimation();
          fj.requestFrame();
      }
  }
  function Nj() {
      WALK.DETECTOR.ios && ((document.documentElement.style.height = window.innerHeight + "px"), 0 !== document.body.scrollTop && window.scrollTo(0, 0));
      mj.resize(Zi.vrEnabled());
      fj.requestFrame();
      $i.onResize();
  }
  function Oj() {
      return document.pointerLockElement === Wi || document.mozPointerLockElement === Wi || document.webkitPointerLockElement === Wi;
  }
  function Pj() {
      return document.fullscreenElement || document.mozFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
  }
  function Qj() {
      if (Oj()) {
          dj.mousePressLook = !1;
          $i.onPointerLockChange(!0);
          var a = WALK.GAZE_IN_POINTER_LOCK;
          a ? Hj.enableMode() : Hj.disableMode();
          bj.anchorsVisible = a;
      } else (dj.mousePressLook = !0), $i.onPointerLockChange(!1), Hj.disableMode(), (bj.anchorsVisible = !0);
  }
  function Rj() {
      if (Pj()) $i.onFullScreenChange(!0), screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape-primary");
      else $i.onFullScreenChange(!1);
  }
  function Sj() {
      var a = document.body;
      return void 0 !== document.fullscreenEnabled || void 0 !== document.webkitFullscreenEnabled || void 0 !== document.mozFullScreenEnabled || void 0 !== document.msFullscreenEnabled
          ? !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
          : void 0 !== a.mozRequestFullScreen || void 0 !== a.webkitRequestFullscreen || void 0 !== a.msRequestFullscreen || void 0 !== a.requestFullscreen;
  }
  function Tj(a) {
      Yi.uploadNewBuffers(a);
      fj && fj.requestFrame();
  }
  function Uj(a) {
      Yi.uploadTexture(a);
      a.isAtlas()
          ? a.forEachAtlasEntry(function (a) {
                console.assert(null === a.isCutout);
                zj.isCutoutTexture(a);
            })
          : null === a.isCutout && zj.isCutoutTexture(a);
      fj && fj.requestFrame();
  }
  function Vj() {
      var a = [],
          b = [],
          c = [];
      a.push(bj._clickListener.bind(bj));
      var d = bj._createHoverListener();
      d && c.push(d);
      rj = new xe(currentScene, nj, dj, viewList);
      b.push(rj.onMeshClicked);
      Xi || a.push(rj.onMeshClicked);
      qj = new Vi(
          hj,
          nj,
          function () {
              fj.requestFrame();
          },
          a,
          b,
          c,
          ej,
          tj
      );
  }
  function Wj() {
      oj && oj.disable();
      pj && pj.enable();
      dj.mouseControlsPitch = !1;
      dj.hmdReset();
      viewList.onVrChange(!0);
      Hj.enableMode();
      $i.onVrChange(!0);
      bj._vrChange(!0);
      Nj();
  }
  function Xj(a) {
      fj.isEnabled() &&
          (a
              ? Wj()
              : (dj.resetRollAngle(),
                dj.resetPitchAngle(),
                (dj.mouseControlsPitch = !0),
                console.assert(!Zi.vrEnabled()),
                pj && pj.disable(),
                oj && oj.enable(),
                viewList.onVrChange(!1),
                Hj.disableMode(),
                $i.onVrChange(!1),
                bj._vrChange(!1),
                Nj(),
                setTimeout(Nj, 1e3)));
  }
  function Yj(a) {
      Xi || (WALK.DETECTOR.mobile && !WALK.ALLOW_MOBILE_VR) || ((WALK.DETECTOR.ios || (WALK.DETECTOR.mobile && WALK.DETECTOR.firefox)) && WALK.DETECTOR.inCrossOriginIframe) || $i.setVrSupported(a);
  }
  function Zj(a, b) {
      if (pj && null !== b) pj.onHmdPositionUpdate(b);
      dj.onHmdUpdate(a, b);
  }
  function ak(a, b) {
      a && dj.cameraWorldPosition().set(a[0], a[1], a[2]);
      b && ((a = new WALK.Euler()), a.setFromDegTriple(b), dj.setYawAngle(a.yaw), dj.setPitchAngle(a.pitch));
  }
  function bk(a) {
      for (var b = 0; b < a.length; b += 1) if (!a[b].lightProbe) return !1;
      return !0;
  }
  function ck(a, b, c) {
      nj = new re(a, b, c);
      b.visitAllNodes(function (a) {
          a.mesh && nj.addStaticObstacle(a.mesh);
      });
  }
  function dk() {
      var a = THREE.Scene.prototype.add;
      THREE.Object3D.prototype.add = function (b) {
          b instanceof THREE.Mesh && Yi.uploadNewBuffers(b);
          a.call(this, b);
      };
  }
  function ek(a) {
      var b = WALK.urlHashGetArgument("view"),
          c = null;
      b && (c = a.findViewByName(b));
      return c || a.views[0];
  }
  function fk(a) {
      function b() {
          fj.requestFrame();
      }
      currentScene = a;
      currentScene.adjustSkiesAndCameraFarToSpanWholeScene();
      currentScene.headLight = WALK.HEAD_LIGHT;
      currentScene.addEventListener("updated", function () {
          return fj.requestFrame();
      });
      currentScene.addEventListener("anyViewUpdated", function () {
          return $i.refresh();
      });
      currentScene.disableLightProbesForMaterials();
      dj.enable();
      currentScene.threeScene.updateMatrixWorld(!0);
      Zi.setCameraFar(currentScene.camera.far);
      mj = new ge(Yi, Zi, currentScene, jj);
      Cj = new Ui(Yi, currentScene);
      hj = new md(Yi.domElement, Xi);
      if ((a = gj.enableCollisions) || Xi) ck(Yi, currentScene, dj), (dj.orbit.collider = nj);
      viewList = new ViewList(currentScene, dj, nj, fj, Cj);
      viewList.addEventListener("teleportStarted", Kj);
      viewList.addEventListener("teleportDone", Lj);
      localTeleport = new LocalTeleport(currentScene, viewList);
      a && currentScene.camera.autoClimb && (oj = new ye(nj, dj, fj));
      a && (pj = new ze(dj, nj));
      viewList.switchToView(ek(currentScene), 0);
      jj.updateWithoutDelay();
      hashchangeHandler = new HashchangeHandler(currentScene, viewList);
      Aj = new Mi(Yi, currentScene, dj);
      a && !0 !== WALK.NO_GAZE_TELEPORT && (tj = new qf(currentScene, dj, b, Hj));
      bj._sceneReadyToDisplay(Yi, currentScene, dj, viewList, localTeleport, nj, Aj, ij, Zi, Hj, hj, fj, cj);
      Vj(a);
      document.addEventListener("visibilitychange", Mj);
      window.addEventListener(
          "resize",
          function () {
              WALK.DETECTOR.ios ? setTimeout(Nj, 1e3) : Nj();
          },
          !1
      );
      Sj() && $i.setFullScreenSupported();
      WALK.DETECTOR.mobile || WALK.DETECTOR.opera || (void 0 === document.pointerLockElement && void 0 === document.mozPointerLockElement && void 0 === document.webkitPointerLockElement) || $i.setPointerLockSupported();
      $i.sceneReadyToDisplay(currentScene, viewList, localTeleport, Aj);
      Nj();
      WALK.DEBUG && (yj = new qi());
      focusWalkCanvas();
      WALK.DEBUG_SHARED_BUFFERS && (currentScene.threeScene.overrideMaterial = new WALK.DebugMaterial());
      WALK.DEBUG_GEOMETRY_MERGING && ng(currentScene, !1);
      currentScene.startAutoTourOnLoad() && localTeleport.start();
      fj.enable();
      Zi.vrEnabled() && Wj();
      Gj = xj.elapsedLoadTimeSec();
  }
  function gk(a) {
      Xi || WALK.urlHashContains("nostats") || 0 !== Dj || ($i.cover.sendStats && WALK.ajaxPost("./stats/" + a, null, null));
  }
  function hk(a, b) {
      function c(c) {
          function d() {
              f.delete(e);
              null !== a.findLightProbe(e.id) && (b.assignLightProbesToObjects(), b.createLightProbeTexture(e, !1), fj.requestFrame());
          }
          var e = c.target;
          c = f.get(e);
          void 0 === c && ((c = new WALK.DeferringExecutorOnce(d, 1e3)), f.set(e, c));
          c.deferRun();
      }
      function d(a) {
          a = a.target;
          b.createLightProbeTexture(a, !0);
          if (!a.isBoundingBoxInitialized()) {
              var c = a.boxMax;
              a.boxMin.copy(a.position).addScalar(-1);
              c.copy(a.position).addScalar(1);
              a.enableBoundingBox();
          }
      }
      function e() {
          for (var b = 0; b < a.materials.length; b += 1) a.materials[b].forceObjectUniformsRefresh();
      }
      var f = new Map();
      a.addEventListener("lightProbeAdded", function (a) {
          a = a.lightProbe;
          b.assignLightProbesToObjects();
          b.createLightProbeTexture(a, !0);
          a.isBoundingBoxInitialized() || a.disableBoundingBox();
          a.addEventListener("boundsInit", d);
          a.addEventListener("positionUpdated", c);
          a.addEventListener("boundsUpdated", e);
      });
      a.addEventListener("lightProbeRemoved", function () {
          b.assignLightProbesToObjects();
      });
      for (var g = 0; g < a.lightProbes.length; g += 1) a.lightProbes[g].addEventListener("positionUpdated", c), a.lightProbes[g].addEventListener("boundsInit", d), a.lightProbes[g].addEventListener("boundsUpdated", e);
  }
  function ik(a, b, c) {
      function d(f) {
          if (f === a.length) c();
          else {
              var g = a[f],
                  h = g.name;
              e.has(h)
                  ? d(f + 1)
                  : (e.add(h),
                    b.monoPanoramaToServer(g, function () {
                        return d(f + 1);
                    }));
          }
      }
      var e = new Set();
      d(0);
  }
  function jk(a) {
      function b() {
          if (gj.onSceneLoaded) gj.onSceneLoaded(new WALK.EditorHooks(a, $i, dj, viewList, wj, cj, Aj, fj, Bj, zj));
          $i.sceneLoadComplete();
          for (var b = _.makeIterator(a.getAnimatedMaterials()), c = b.next(); !c.done; c = b.next()) c.value.play();
          bj._sceneLoadComplete();
          fj.requestFrame();
          b = xj.elapsedLoadTimeSec();
          gk("loaded?readyToDisplayTime=" + Gj.toFixed(1) + "&loadTime=" + b.toFixed(1));
          xj = null;
      }
      var c = WALK.urlHashContains("headless");
      null === gj.onSceneLoaded && zj.dispose();
      if (0 < a.lightProbes.length || Xi) {
          var d = new ki(a, Yi, WALK.DETECTOR.gl.textureLod, WALK.DETECTOR.gl.mirrorCubeMaps, Xi);
          0 === a.lightProbes.length && Xi && a.autoAddLightProbes && pi(a, d, c);
          if (0 < a.lightProbes.length) {
              bk(a.gpuMeshes) || (console.warn("Some objects do not have light probes assigned, this is not optimal."), d.assignLightProbesToObjects());
              var e;
              for (e = 0; e < a.views.length && "orbit" === a.views[e].mode; e += 1);
              e === a.views.length && (e = 0);
              viewList.executeWithViewVisibilitySettings(a.views[e], function () {
                  d.createAllLightProbeTextures();
              });
              a.enableLightProbesForMaterials();
          }
      }
      a.hasLightMap() && mj.enableAutoExposure();
      if (Xi) {
          d ? hk(a, d) : console.warn("Cube maps support is required in the edit mode");
          e = new WALK.LightControls(a, fj);
          var f = new WALK.LightProbeControls(a, fj),
              g = new WALK.CameraVolumeControls(a, fj);
          wj = new WALK.EditorSelector(hj, a, Yi, nj, e, f, g, fj, dj);
          gj.sendCoverToServer && Aj.coverToServer(WALK.EDITOR_COVER_WIDTH, WALK.EDITOR_COVER_HEIGHT);
          ak(gj.forcedInitialCameraPosition, gj.forcedInitialCameraRotation);
      } else d && (d.dispose(), (d = null));
      Bj = new Gi(Cj, a, viewList, bj);
      Xi && c ? ik(xj.panoramas, Aj, b) : b();
  }
  function kk() {
      Ej && ((Ej = !1), xj.load(), $i.sceneLoadStarted(), WALK.SHOW_HELP_ON_LOAD && ($i.helpVisible = !0), gk("play"));
  }
  function lk(a) {
      $i.updateCover(a);
      cj.updateConfig(a.extensions || []);
      WALK.DETECTOR.canForceBrotliBuffers = !0 === a.canForceBrotliBuffers;
      1 === a.webwalkLogMode ? (WALK.logInfoMessages(), WALK.initLoggingToServer(!0)) : 2 === a.webwalkLogMode && WALK.initLoggingToServer(!1);
      Xi || cj.startExtensions();
      bj._viewerConfigLoaded(a);
      if (a.language) {
          var b = WALK.STRINGS[a.language];
          b ? WALK.updateViewerStrings(b) : console.log("Unknown language: " + a.language);
      }
      zj = new yb(Yi);
      kj = new zb(Yi);
      Ej = !0;
      a = new WALK.Scene(dj.camera());
      void 0 !== gj.assetsUrl && null !== gj.assetsUrl && (WALK.ASSETS_URL = gj.assetsUrl);
      xj = new $h(a, WALK.ASSETS_URL, Xi, aj, kj);
      ij = new Ji(Yi, a);
      jj = new Hi(a, dj, ij);
      xj.onProgress = $i.loadProgress;
      xj.onTextureLoaded = Uj;
      xj.onMeshBuffersLoaded = Tj;
      xj.onReadyToDisplay = fk;
      xj.onComplete = jk;
      WALK.AUTO_PLAY || Fj || 0 < Dj ? kk() : WALK.HIDE_PLAY || $i.enablePlayButton(kk);
  }
  function mk(a) {
      a.preventDefault();
      Dj += 1;
      fj.disable();
      !Xi && null === xj && Dj <= WALK.CONTEXT_LOST_RESTORE_LIMIT
          ? (cj.stopExtensions(), bj._contextLost(), hashchangeHandler.dispose(), (hashchangeHandler = null), qj.dispose(), (qj = null), rj && (rj.dispose(), (rj = null)), $i.contextLost())
          : za.error("Graphics context lost, reload to retry.");
  }
  function nk(a) {
      a.preventDefault();
      !Xi &&
          null === xj &&
          Dj <= WALK.CONTEXT_LOST_RESTORE_LIMIT &&
          (za.info("Graphics context switched, reloading the scene to use the new context.", 5e3), WALK.DETECTOR.resetGlDetector(Yi.context), WALK.DETECTOR.gl.reportToConsole(), Yi.webGLContextRestored(), lk($i.cover));
  }
  function ok() {
      WALK.ajaxGet(
          WALK.COVER_JSON_URL,
          !1,
          function (a) {
              WALK.DETECTOR.onAsyncPropertiesDetected(function () {
                  lk(a);
              });
          },
          function (a, b) {
              var c = "Failed to initialize the scene.";
              401 == a && void 0 !== b && (c = b);
              za.error(c);
          }
      );
  }
  function pk(a) {
      dk();
      gj = a;
      if ((Yi = fe(Wi)))
          if (WALK.DETECTOR.gl.missingCapabilities) za.error(WALK.DETECTOR.gl.missingCapabilities);
          else {
              Wi.addEventListener("webglcontextlost", mk, !1);
              Wi.addEventListener("webglcontextrestored", nk, !1);
              $i.init();
              cj = new WALK.ExtensionManager();
              a = null;
              try {
                  WALK.VR_LO ? (WebXRConfig.cardboardConfig.BUFFER_SCALE *= 0.5) : WALK.VR_HI && (WebXRConfig.cardboardConfig.BUFFER_SCALE *= 1.5), (a = new WebXRPolyfill(WebXRConfig));
              } catch (b) {
                  WALK.log("Failed to initialize WebXR polyfill");
              }
              Zi = new pe(
                  Yi,
                  ej,
                  a,
                  Yj,
                  Zj,
                  function (a) {
                      a ? fj.disable() : fj.enable();
                  },
                  Xj
              );
              fj = new WALK.AnimationController(Zi, Jj, Ij);
              fj.disable();
              a = new WALK.Camera();
              dj = new te(a, Wi, ej, fj);
              dj.mousePressLook = !0;
              WALK.FLIP_MOUSE && (dj.flipMouseLook = !0);
              dj.disable();
              ok();
              WALK.getExtraAssetUrl = function (a) {
                  return a.startsWith("extra-assets/") ? WALK.ASSETS_URL + a : WALK.ASSETS_URL + "extra-assets/" + a;
              };
          }
      else
          za.error(
              window.WebGLRenderingContext
                  ? 'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" target="_blank">WebGL</a> or your browser has WebGL disabled.<br/><a href="http://get.webgl.org/" target="_blank">Find out how to get it.</a>'
                  : 'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" target="_blank">WebGL</a>.<br/><a href="http://get.webgl.org/" target="_blank">Find out how to get it.</a>'
          );
  }
  ej = new cf();
  $i = new zi(
      Xi,
      ej,
      function () {
          Zi.vrEnabled() ? Zi.disableVr() : (localTeleport.isRunning() && localTeleport.stop(), Zi.enableVr(Yi.context));
      },
      function () {
          if (Pj()) Pj() && ((document.exitFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitExitFullscreen), document.exitFullScreen && document.exitFullScreen());
          else {
              var a = document.body;
              (a.mozRequestFullScreen || a.webkitRequestFullscreen || a.msRequestFullscreen || a.requestFullscreen).call(a);
              document.addEventListener("fullscreenchange", Rj, !1);
              document.addEventListener("mozfullscreenchange", Rj, !1);
              document.addEventListener("webkitfullscreenchange", Rj, !1);
              document.addEventListener("MSFullscreenChange", Rj, !1);
          }
      },
      function () {
          Oj()
              ? Oj() && ((document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock), document.exitPointerLock && document.exitPointerLock())
              : ((Wi.requestPointerLock = Wi.requestPointerLock || Wi.mozRequestPointerLock || Wi.webkitRequestPointerLock),
                Wi.requestPointerLock(),
                document.addEventListener("pointerlockchange", Qj, !1),
                document.addEventListener("mozpointerlockchange", Qj, !1),
                document.addEventListener("webkitpointerlockchange", Qj, !1));
      }
  );
  aj = new (function () {
      this._editableNodeTypes = new mh();
      this._editableMaterialNames = new mh();
      this._allMaterialsEditable = !1;
      this.setNodeTypeEditable = function (a) {
          this._editableNodeTypes.add(a);
      };
      this.setMaterialEditable = function (a) {
          this._editableMaterialNames.add(a);
      };
      this.setAllMaterialsEditable = function () {
          this._allMaterialsEditable = !0;
      };
      this.isMaterialEditable = function (a) {
          return this._allMaterialsEditable || this._editableMaterialNames.matchesAny(a);
      };
      this.isNodeTypeEditable = function (a) {
          return this._editableNodeTypes.matchesAny(a);
      };
  })();
  Xi && aj.setAllMaterialsEditable();
  bj = new WALK.Viewer(Xi, $i, aj);
  var IconFonts = { FontAwesomeSolid: "\uf2b9", FontAwesomeRegular: "\uf2b9", FontAwesomeBrands: "\uf293" };
  WALK.loadFontFamilies = function (a, b, c) {
      function d(d) {
          d ? ++f : ++g;
          f + g === a.length && (0 === g ? b() : c && c());
      }
      if (0 === a.length) b();
      else {
          var e = {};
          a.forEach(function (a) {
              console.assert(IconFonts[a], "Font " + JSON.stringify(a) + " is not supported.");
              e[a] = IconFonts[a];
          });
          var f = 0,
              g = 0;
          WebFont.load({
              custom: { families: a, testStrings: e },
              timeout: 1e4,
              fontactive: function () {
                  d(!0);
              },
              fontinactive: function (a) {
                  console.error("Cannot load font: " + a);
                  d(!1);
              },
          });
      }
  };
  WALK.getViewerAssetUrl = (function () {
      var a = (function () {
          for (var a = document.getElementsByTagName("script"), c = 0; c < a.length; ++c) {
              var d = a[c].src.match(/^(.*\/)a3dcanvas(\.min)?\.js$/);
              if (d) return d[1];
          }
          console.error("Actic3D Canvas url not found.");
          return "/webwalk/";
      })();
      return function (b) {
          return a + b;
      };
  })();
  WALK.initEditMode = function (a) {
      var b = document.createElement("base");
      b.target = "_blank";
      document.head.appendChild(b);
      WALK.loadFontFamilies(Object.keys(IconFonts), function () {
          pk(a);
      });
  };
  WALK.init = function (a) {
      Xi || pk(a);
  };
  WALK.play = function () {
      Ej ? kk() : (Fj = !0);
  };
  WALK.getViewer = function () {
      return bj;
  };
  WALK.Extensions = {};
  WALK.STRINGS.English = {
      help: {
          basic: "BASIC",
          advanced: "ADVANCED",
          mouse: "Mouse",
          or: "or",
          keyboard: "Keyboard",
          vrTeleport: "Local teleport",
          holdLeftButton: "Hold the left button",
          clickLeftButton: "Click the left button",
          lookAround: "Look around",
          walkToClickedPlace: "Walk to the clicked place",
          selectMaterialLightObject: "Select material, light, object",
          scroll: "Scroll",
          walkStraight: "Walk straight",
          walkStraightAndLookAround: "Walk straight and look around",
          walkStraightAndSideways: "Walk straight and sideways",
          changeHeight: "Change height",
          switchView: "Switch view",
          screenshot: "Screenshot",
          illuminationPreview: "Illumination preview",
          hideShowMenu: "Hide/show menu",
          hideShowMousePointer: "Hide/show mouse pointer",
          vrMode: "VR Mode",
          gazeAtFixedPlace: "Gaze at a fixed place",
          clickControllerButton: "Click a controller button",
          teleport: "Teleport",
          touch: "Touch",
          interactiveDesktop: "Click and drag to look around",
          interactiveMobile: "Drag to look around",
      },
  };
  WALK.STRINGS.Chinese = {
      help: {
          basic: "\u57fa\u672c",
          advanced: "\u9ad8\u7ea7",
          mouse: "\u6ed1\u9f20",
          or: "\u6216",
          keyboard: "\u952e\u76d8",
          vrTeleport: "VR \u4f20\u9001",
          holdLeftButton: "\u6309\u4f4f\u5de6\u952e",
          clickLeftButton: "\u5355\u6309\u5de6\u952e",
          lookAround: "\u8c03\u6574\u89c6\u89d2",
          walkToClickedPlace: "\u8d70\u53bb\u6307\u5b9a\u5730\u70b9",
          selectMaterialLightObject: "\u9009\u62e9\u6750\u8d28\uff0c\u706f\u5149\uff0c\u7269\u4f53",
          scroll: "\u6ed1\u8f6e",
          walkStraight: "\u76f4\u8d70",
          walkStraightAndLookAround: "\u8c03\u6574\u89c6\u89d2",
          walkStraightAndSideways: "\u79fb\u52a8",
          changeHeight: "\u8c03\u6574\u9ad8\u5ea6",
          switchView: "\u79fb\u52a8\u81f3\u6307\u5b9a\u89c6\u89d2",
          screenshot: "\u622a\u56fe",
          illuminationPreview: "\u7167\u660e\u9884\u89c8",
          hideShowMenu: "\u9690\u85cf/\u663e\u793a\u83dc\u5355",
          hideShowMousePointer: "\u9690\u85cf/\u663e\u793a\u9f20\u6807",
          vrMode: "VR \u6a21\u5f0f",
          gazeAtFixedPlace: "\u51dd\u89c6\u4e00\u4e2a\u56fa\u5b9a\u7684\u5730\u65b9",
          clickControllerButton: "\u5355\u51fb\u63a7\u5236\u5668\u6309\u94ae",
          teleport: "\u4f20\u9001",
          touch: "\u89e6\u78b0",
      },
  };
  WALK.STRINGS.French = {
      help: {
          basic: "BASIQUES",
          advanced: "AVANC\u00c9S",
          mouse: "Souris",
          or: "ou",
          keyboard: "Clavier",
          vrTeleport: "T\u00e9l\u00e9portation VR",
          holdLeftButton: "Maintenez le bouton gauche",
          clickLeftButton: "Cliquez sur le bouton gauche",
          lookAround: "Regardez autour",
          walkToClickedPlace: "D\u00e9placez-vous jusqu\u2019\u00e0 l\u2019endroit cliqu\u00e9",
          selectMaterialLightObject: "S\u00e9lectionnez le mat\u00e9riel, la lumi\u00e8re, l\u2019objet",
          scroll: "D\u00e9filement",
          walkStraight: "Allez tout droit",
          walkStraightAndLookAround: "Allez tout droit et regardez autour",
          walkStraightAndSideways: "Allez tout droit et de c\u00f4t\u00e9",
          changeHeight: "Changez la hauteur",
          switchView: "Changez de vue",
          screenshot: "Capture d\u2019\u00e9cran",
          illuminationPreview: "Aper\u00e7u de l\u2019\u00e9clairage",
          hideShowMenu: "Masquer / Afficher le menu",
          hideShowMousePointer: "Masquer / Afficher le pointeur de la souris",
          vrMode: "Mode RV",
          gazeAtFixedPlace: "Fixez un endroit pr\u00e9cis",
          clickControllerButton: "Appuyez sur un bouton du contr\u00f4leur",
          teleport: "T\u00e9l\u00e9portation",
          touch: "Touchez",
      },
  };
  WALK.STRINGS.German = {
      help: {
          basic: "GRUNDLAGEN",
          advanced: "ERWEITERT",
          mouse: "Maus",
          or: "oder",
          keyboard: "Tastatur",
          vrTeleport: "VR-Teleport",
          holdLeftButton: "Linke Maustaste gedr\u00fcckt halten",
          clickLeftButton: "Klick auf die linke Maustaste",
          lookAround: "Umschauen",
          walkToClickedPlace: "Zum angeklickten Punkt bewegen",
          selectMaterialLightObject: "Material, Licht, Objekt ausw\u00e4hlen",
          scroll: "Mausrad",
          walkStraight: "Geradeaus gehen",
          walkStraightAndLookAround: "Geradeaus gehen und umsehen",
          walkStraightAndSideways: "Geradeaus und seitw\u00e4rts gehen",
          changeHeight: "H\u00f6he \u00e4ndern",
          switchView: "Ansicht wechseln",
          screenshot: "Bildschirmfoto",
          illuminationPreview: "Beleuchtungsvorschau",
          hideShowMenu: "Men\u00fc aus- / einblenden",
          hideShowMousePointer: "Mauszeiger aus-/einblenden",
          vrMode: "VR-Modus",
          gazeAtFixedPlace: "Blick auf einem Punkt fixieren",
          clickControllerButton: "Controller Taste dr\u00fccken",
          teleport: "Teleportieren",
          touch: "Tippen",
      },
  };
  WALK.STRINGS.Spanish = {
      help: {
          basic: "B\u00c1SICO",
          advanced: "AVANZADO",
          mouse: "Rat\u00f3n",
          or: "o",
          keyboard: "Teclado",
          vrTeleport: "Teletransporte VR",
          holdLeftButton: "Mant\u00e9n presionado el bot\u00f3n izquierdo",
          clickLeftButton: "Haz clic en el bot\u00f3n izquierdo",
          lookAround: "Mira a tu alrededor",
          walkToClickedPlace: "Camina hasta el lugar donde hiciste clic",
          selectMaterialLightObject: "Selecciona material, luz, objeto",
          scroll: "Despl\u00e1zate",
          walkStraight: "Camina en l\u00ednea recta",
          walkStraightAndLookAround: "Camina en l\u00ednea recta y mira a tu alrededor",
          walkStraightAndSideways: "Camina recto y de lado",
          changeHeight: "Cambiar altura",
          switchView: "Cambiar vista",
          screenshot: "Captura de pantalla",
          illuminationPreview: "Vista previa de iluminaci\u00f3n",
          hideShowMenu: "Ocultar / mostrar men\u00fa",
          hideShowMousePointer: "Ocultar / mostrar el puntero del rat\u00f3n",
          vrMode: "Modo VR",
          gazeAtFixedPlace: "Mira a un punto fijo",
          clickControllerButton: "Pulsa un bot\u00f3n del mando",
          teleport: "Teletransporte",
          touch: "Tocar",
      },
  };
  WALK.STRINGS.Korean = {
      help: {
          basic: "\uae30\ubcf8 \uc870\uc791\ubc95",
          advanced: "\uc0c1\uc138 \uc870\uc791\ubc95",
          mouse: "\ub9c8\uc6b0\uc2a4",
          or: "\ud639\uc740",
          keyboard: "\ud0a4\ubcf4\ub4dc",
          vrTeleport: "VR \uc774\ub3d9",
          holdLeftButton: "\uc88c\uce21 \ubc84\ud2bc \ub4dc\ub798\uadf8",
          clickLeftButton: "\uc88c\uce21 \ubc84\ud2bc \ud074\ub9ad",
          lookAround: "\uc8fc\ubcc0 \ub458\ub7ec\ubcf4\uae30",
          walkToClickedPlace: "\ud074\ub9ad\ud55c \uacf3\uc73c\ub85c \uc774\ub3d9",
          selectMaterialLightObject: "\uc7ac\uc9c8, \uc870\uba85, \uc0ac\ubb3c \uc120\ud0dd",
          scroll: "\uc2a4\ud06c\ub864",
          walkStraight: "\uc9c1\uc9c4 \uc774\ub3d9",
          walkStraightAndLookAround: "\uc9c1\uc9c4 \uc774\ub3d9 / \uc8fc\ubcc0 \ub458\ub7ec\ubcf4\uae30",
          walkStraightAndSideways: "\uc9c1\uc9c4 \uc774\ub3d9 / \uc606\uc73c\ub85c \uc774\ub3d9",
          changeHeight: "\ub192\uc774 \uc870\uc808",
          switchView: "\ubdf0 \uc120\ud0dd",
          screenshot: "\uc2a4\ud06c\ub9b0\uc0f7",
          illuminationPreview: "\uc77c\ub8e8\ubbf8\ub124\uc774\uc158 \ud504\ub9ac\ubdf0",
          hideShowMenu: "\uba54\ub274 On/Off",
          hideShowMousePointer: "\ub9c8\uc6b0\uc2a4 \ud3ec\uc778\ud130 On/Off",
          vrMode: "VR \ubaa8\ub4dc",
          gazeAtFixedPlace: "\ud2b9\uc815 \uc7a5\uc18c \ubc14\ub77c\ubcf4\uae30",
          clickControllerButton: "\ucee8\ud2b8\ub864\ub7ec \ubc84\ud2bc \ud074\ub9ad",
          teleport: "\ud154\ub808\ud3ec\ud2b8",
          touch: "\ud130\uce58",
      },
  };
  WALK.STRINGS.Polish = {
      help: {
          basic: "PODSTAWOWE",
          advanced: "ZAAWANSOWANE",
          mouse: "Myszka",
          or: "lub",
          keyboard: "Klawiatura",
          vrTeleport: "Teleportacja VR",
          holdLeftButton: "Przytrzymaj lewy przycisk",
          clickLeftButton: "Naci\u015bnij lewy przycisk",
          lookAround: "Rozgl\u0105daj si\u0119",
          walkToClickedPlace: "Id\u017a do naci\u015bni\u0119tego miejsca",
          selectMaterialLightObject: "Wybierz materia\u0142, \u015bwiat\u0142o, obiekt",
          scroll: "Przewi\u0144",
          walkStraight: "Id\u017a prosto",
          walkStraightAndLookAround: "Id\u017a prosto i rozgl\u0105daj si\u0119",
          walkStraightAndSideways: "Id\u017a prosto i na boki",
          changeHeight: "Zmie\u0144 wysoko\u015b\u0107",
          switchView: "Zmie\u0144 widok",
          screenshot: "Zrzut ekranu",
          illuminationPreview: "Podgl\u0105d o\u015bwietlenia",
          hideShowMenu: "Schowaj/poka\u017c menu",
          hideShowMousePointer: "Schowaj/poka\u017c kursor myszki",
          vrMode: "Tryb VR",
          gazeAtFixedPlace: "Patrz w ustalone miejsce",
          clickControllerButton: "Naci\u015bnij przycisk kontrolera",
          teleport: "Teleportacja",
          touch: "Dotyk",
          interactiveDesktop: "Klikaj i przeci\u0105gaj, aby si\u0119 rozgl\u0105da\u0107",
          interactiveMobile: "Przeci\u0105gaj, aby si\u0119 rozgl\u0105da\u0107",
      },
  };
  WALK.STRINGS.Portuguese = {
      help: {
          basic: "B\u00c1SICO",
          advanced: "AVAN\u00c7ADO",
          mouse: "Mouse",
          or: "ou",
          keyboard: "Teclado",
          vrTeleport: "Teletransporte VR",
          holdLeftButton: "Mantenha pressionado o bot\u00e3o esquerdo",
          clickLeftButton: "Clique com o bot\u00e3o esquerdo",
          lookAround: "Olhe ao redor",
          walkToClickedPlace: "Ande at\u00e9 o lugar que foi clicado",
          selectMaterialLightObject: "Selecione material, luz, objeto",
          scroll: "Rolagem",
          walkStraight: "Ande em frente",
          walkStraightAndLookAround: "Ande em frente e olhe ao redor",
          walkStraightAndSideways: "Ande em frente e para os lados",
          changeHeight: "Variar altura",
          switchView: "Alternar entre cenas",
          screenshot: "Captura de imagem",
          illuminationPreview: "Visualiza\u00e7\u00e3o de ilumina\u00e7\u00e3o",
          hideShowMenu: "Ocultar/mostrar menu",
          hideShowMousePointer: "Ocultar/mostrar a seta do mouse",
          vrMode: "Modo VR",
          gazeAtFixedPlace: "Olhe para um lugar fixo",
          clickControllerButton: "Clique num bot\u00e3o controlador",
          teleport: "Teletransporte",
          touch: "Toque",
          interactiveDesktop: "Clique e arraste para olhar ao redor",
          interactiveMobile: "Arraste para olhar ao redor",
      },
  };
  WALK.STRINGS.Turkish = {
      help: {
          basic: "Basit",
          advanced: "\u0130leri D\u00fczey",
          mouse: "Fare",
          or: "veya",
          keyboard: "Klavye",
          vrTeleport: "VR I\u015f\u0131nlanma",
          holdLeftButton: "Sol tu\u015fa bas\u0131l\u0131 tut",
          clickLeftButton: "Sol tu\u015fa t\u0131kla",
          lookAround: "\u00c7evrene bak",
          walkToClickedPlace: "T\u0131klad\u0131\u011f\u0131n alana y\u00fcr\u00fc",
          selectMaterialLightObject: "Materyal, \u0131\u015f\u0131k veya obje se\u00e7",
          scroll: "A\u015fa\u011f\u0131 kayd\u0131r",
          walkStraight: "D\u00fcz y\u00fcr\u00fc",
          walkStraightAndLookAround: "D\u00fcz y\u00fcr\u00fc ve \u00e7evrene bak\u0131n",
          walkStraightAndSideways: "D\u00fcz ve yanlana do\u011fru y\u00fcr\u00fc",
          changeHeight: "Y\u00fckseklik de\u011fi\u015ftir",
          switchView: "G\u00f6r\u00fcn\u00fcm de\u011fi\u015ftir",
          screenshot: "Ekran G\u00f6r\u00fcnt\u00fcs\u00fc",
          illuminationPreview: "Ayd\u0131nlatma \u00f6nizlemesi",
          hideShowMenu: "Men\u00fcy\u00fc g\u00f6ster/gizle",
          hideShowMousePointer: "\u0130mleci g\u00f6ster/gizle",
          vrMode: "VR Modu",
          gazeAtFixedPlace: "Bir noktaya kitlenerek bak",
          clickControllerButton: "Kumanda butonuna t\u0131kla",
          teleport: "I\u015f\u0131nlan",
          touch: "Dokun",
      },
  };
  WALK.STRINGS.Japanese = {
      help: {
          basic: "\u57fa\u672c\u64cd\u4f5c",
          advanced: "\u8a73\u7d30\u64cd\u4f5c",
          mouse: "\u30de\u30a6\u30b9",
          or: "or",
          keyboard: "\u30ad\u30fc\u30dc\u30fc\u30c9",
          vrTeleport: "VR \u30c6\u30ec\u30dd\u30fc\u30c8",
          holdLeftButton: "\u5de6\u30dc\u30bf\u30f3\u3092\u9577\u62bc\u3057",
          lookAround: "\u898b\u56de\u3059",
          clickLeftButton: "\u5de6\u30dc\u30bf\u30f3",
          walkToClickedPlace: "\u30af\u30ea\u30c3\u30af\u3057\u305f\u5834\u6240\u306b\u79fb\u52d5\u3059\u308b",
          selectMaterialLightObject: "\u30de\u30c6\u30ea\u30a2\u30eb\u3001\u30e9\u30a4\u30c8\u3001\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u3092\u9078\u629e",
          scroll: "\u30b9\u30af\u30ed\u30fc\u30eb",
          walkStraight: "\u524d\u5f8c\u79fb\u52d5",
          walkStraightAndLookAround: "\u524d\u5f8c\u79fb\u52d5\u3057\u3066\u898b\u56de\u3059",
          walkStraightAndSideways: "\u524d\u5f8c\u5de6\u53f3\u79fb\u52d5",
          changeHeight: "\u9ad8\u3055\u8abf\u6574",
          switchView: "\u30d3\u30e5\u30fc\u5207\u308a\u66ff\u3048",
          screenshot: "\u30b9\u30af\u30ea\u30fc\u30f3\u30b7\u30e7\u30c3\u30c8",
          illuminationPreview: "\u30a4\u30eb\u30df\u30cd\u30fc\u30b7\u30e7\u30f3\u30d7\u30ec\u30d3\u30e5\u30fc",
          hideShowMenu: "\u30e1\u30cb\u30e5\u30fc \u8868\u793a/\u975e\u8868\u793a",
          hideShowMousePointer: "\u30de\u30a6\u30b9\u30ab\u30fc\u30bd\u30eb \u8868\u793a/\u975e\u8868\u793a",
          vrMode: "VR \u30e2\u30fc\u30c9",
          gazeAtFixedPlace: "\u7279\u5b9a\u306e\u5834\u6240\u3092\u898b\u308b",
          clickControllerButton: "\u30b3\u30f3\u30c8\u30ed\u30fc\u30e9\u30fc\u30dc\u30bf\u30f3\u3092\u30af\u30ea\u30c3\u30af\u3059\u308b",
          teleport: "\u30c6\u30ec\u30dd\u30fc\u30c8",
          touch: "\u89e6\u308b",
          interactiveDesktop: "\u30af\u30ea\u30c3\u30af\uff06\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u898b\u56de\u3059",
          interactiveMobile: "\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u898b\u56de\u3059",
      },
  };
  var rk = WALK.cloneObject(WALK.STRINGS[WALK.DEFAULT_LANGUAGE]);
  function sk() {
      for (var a = document.querySelectorAll("[data-strings]"), b = 0; b < a.length; ++b) {
          var c = a.item(b);
          a: {
              var d = c.getAttribute("data-strings").split(".");
              for (var e = rk, f = 0; f < d.length; f++)
                  if (((e = e[d[f]]), !e)) {
                      d = null;
                      break a;
                  }
              d = "string" === typeof e ? e : null;
          }
          c.textContent = d;
      }
  }
  WALK.updateViewerStrings = function (a) {
      function b(a, d, e) {
          Object.keys(d).forEach(function (c) {
              var f = "" === e ? c : e + "." + c;
              if (void 0 === a[c]) console.warn("Viewer string " + f + " doesn\u2019t exist");
              else if (typeof a[c] !== typeof d[c]) console.error(f + " should be " + typeof a[c]);
              else
                  switch (typeof d[c]) {
                      case "string":
                          a[c] = d[c];
                          break;
                      case "object":
                          b(a[c], d[c], f);
                  }
          });
      }
      b(rk, a, "");
      sk();
  };
  WALK.getViewerStrings = function () {
      return WALK.readOnlyCopy(rk);
  };
  sk();
  WALK.ExtensionManager = function () {
      this.extensionTypes = WALK.Extensions;
  };
  WALK.ExtensionManager.getExtensionDefinition = function (a) {
      return WALK.Extensions[a].definition;
  };
  WALK.ExtensionManager.prototype = {
      constructor: WALK.ExtensionManager,
      updateConfig: function (a) {
          this.extensions = [];
          a = _.makeIterator(a);
          for (var b = a.next(); !b.done; b = a.next()) this._createExtensionFromConfig(b.value);
      },
      _createExtensionFromConfig: function (a) {
          function b(b, c) {
              return b.some(function (b) {
                  return b.name === c && b.config.type === a.type;
              });
          }
          var c = this;
          a.name = a.name.toString();
          for (var d = a.name, e = 2; b(this.extensions, a.name); ) (a.name = d + e.toString()), (e += 1);
          var f = new this.extensionTypes[a.type](a);
          if (f.isTriggerExclusive()) {
              console.assert(f.isTriggerable());
              var g = f.trigger;
              f.trigger = function (a) {
                  !1 !== a &&
                      c.extensions.forEach(function (a) {
                          a !== f && a.isTriggerExclusive() && a.trigger(!1);
                      });
                  g.call(f, a);
              };
          }
          this.extensions.push(f);
          return f;
      },
      startExtensions: function () {
          var a = this;
          this._loadFontAwesomeIfNeeded(function () {
              for (var b = 0; b < a.extensions.length; b += 1) a.extensions[b].start();
          });
      },
      _loadFontAwesomeIfNeeded: function (a) {
          var b = this,
              c = this.extensions
                  .map(function (a) {
                      return b._getFonts(a.config);
                  })
                  .concat(WALK.FONT_FAMILIES_TO_LOAD)
                  .reduce(function (a, b) {
                      return a.concat(b);
                  }, [])
                  .filter(function (a, b, c) {
                      return b === c.indexOf(a);
                  });
          0 < c.length && !WALK.EDIT_MODE ? WALK.loadFontFamilies(c, a, a) : a();
      },
      _getFonts: function (a) {
          for (var b = [], c = _.makeIterator(this.extensionTypes[a.type].definition.properties), d = c.next(); !d.done; d = c.next())
              if (((d = d.value), "trigger" === d.type && a[d.id])) (d = a[d.id]), (d = d.icon && WALK.ICONS[d.icon].fontFamily) && b.push(d);
              else if ("list" === d.type && "trigger" === d.elementType && a[d.id]) {
                  d = _.makeIterator(a[d.id]);
                  for (var e = d.next(); !e.done; e = d.next()) (e = e.value), (e = e.icon && WALK.ICONS[e.icon].fontFamily) && b.push(e);
              }
          return b;
      },
      stopExtensions: function () {
          for (var a = 0; a < this.extensions.length; a += 1) this.extensions[a].stop();
      },
      getEditableExtensionDefinitions: function () {
          for (var a = [], b = _.makeIterator(Object.entries(this.extensionTypes || {})), c = b.next(); !c.done; c = b.next()) {
              var d = _.makeIterator(c.value);
              c = d.next().value;
              d = d.next().value;
              d.definition.hideFromEditor || a.push({ type: c, definition: d.definition });
          }
          return a;
      },
      getEditableExtensions: function () {
          for (var a = [], b = _.makeIterator(this.extensions), c = b.next(); !c.done; c = b.next()) (c = c.value), c.definition.hideFromEditor || a.push(c);
          return a;
      },
      getEditableTriggerImagePaths: function () {
          function a(a) {
              return a.properties
                  .filter(function (a) {
                      return "trigger" === a.type;
                  })
                  .map(function (a) {
                      return a.id;
                  });
          }
          for (var b = new Set(), c = {}, d = _.makeIterator(this.getEditableExtensions()), e = d.next(); !e.done; c = { $jscomp$loop$prop$extension$182: c.$jscomp$loop$prop$extension$182 }, e = d.next())
              (c.$jscomp$loop$prop$extension$182 = e.value),
                  a(c.$jscomp$loop$prop$extension$182.definition).forEach(
                      (function (a) {
                          return function (c) {
                              a.$jscomp$loop$prop$extension$182.config[c] && a.$jscomp$loop$prop$extension$182.config[c].image && b.add(a.$jscomp$loop$prop$extension$182.config[c].image);
                          };
                      })(c)
                  );
          return Array.from(b);
      },
      addExtension: function (a) {
          a = this._createExtensionFromConfig(a);
          a.start();
          return a;
      },
      removeExtension: function (a) {
          a.stop();
          for (var b = 0; b < this.extensions.length; b += 1)
              if (this.extensions[b] === a) {
                  this.extensions.splice(b, 1);
                  break;
              }
      },
      getConfig: function () {
          return this.extensions.map(function (a) {
              return a.config;
          });
      },
      getExtension: function (a, b) {
          for (var c = _.makeIterator(this.extensions), d = c.next(); !d.done; d = c.next()) if (((d = d.value), d.type === a && d.name === b)) return d;
          console.error("Unrecognized extension " + a + " " + b + ", supported types: " + Object.keys(this.extensionTypes));
      },
  };
  var tk = WALK.EDIT_MODE;
  function uk() {}
  var vk = {
      "\uf2b9": "address-book",
      "\uf2bb": "address-card",
      "\uf1fe": "area-chart",
      "\uf047": "arrows",
      "\uf062": "arrow-up",
      "\uf063": "arrow-down",
      "\uf2a2": "assistive-listening-systems",
      "\uf069": "asterisk",
      "\uf29e": "audio-description",
      "\uf1fa": "at",
      "\uf0c9": "bars",
      "\uf0f3": "bell",
      "\uf02d": "book",
      "\uf02e": "bookmark",
      "\uf0a1": "bullhorn",
      "\uf1ec": "calculator",
      "\uf030": "camera",
      "\uf080": "chart-bar",
      "\uf200": "chart-pie",
      "\uf0c2": "cloud",
      "\uf013": "cog",
      "\uf075": "comment",
      "\uf14e": "compass",
      "\uf09d": "credit-card",
      "\uf05b": "crosshairs",
      "\uf019": "download",
      "\uf0e0": "envelope",
      "\uf08e": "external-link",
      "\uf06e": "eye",
      "\uf1fb": "eye-dropper",
      "\uf008": "film",
      "\uf024": "flag",
      "\uf07b": "folder",
      "\uf06b": "gift",
      "\uf025": "headphones",
      "\uf015": "home",
      "\uf03e": "image",
      "\uf090": "sign-in",
      "\uf129": "info",
      "\uf0eb": "lightbulb",
      "\uf0d0": "magic",
      "\uf076": "magnet",
      "\uf041": "map-marker",
      "\uf276": "map-pin",
      "\uf277": "map-signs",
      "\uf1fc": "paint-brush",
      "\uf040": "pencil",
      "\uf095": "phone",
      "\uf128": "question",
      "\uf064": "share",
      "\uf1e0": "share-alt",
      "\uf07a": "shopping-cart",
      "\uf1de": "sliders",
      "\uf005": "star",
      "\uf0e4": "tachometer",
      "\uf02b": "tag",
      "\uf03d": "video",
      "\uf0ad": "wrench",
      "\uf04b": "play",
      "\uf16a": "youtube",
      "\uf27d": "vimeo",
      "\uf09a": "facebook",
      "\uf099": "twitter",
      "\uf16d": "instagram",
  };
  function wk() {
      console.error("This extension cannot be triggered on/off");
  }
  var xk = new (function () {
      var a = new Map();
      this.onNodeTypeClicked = function (b, c) {
          function d(b) {
              return function (c, d, e) {
                  var f = a.get(b);
                  console.assert(f, "listenerMulti not found for " + b);
                  f.listeners.forEach(function (a) {
                      try {
                          a(c, d, e);
                      } catch (p) {
                          console.error(p);
                      }
                  });
                  return !0;
              };
          }
          var e = a.get(b);
          e ? e.listeners.push(c) : ((e = d(b)), a.set(b, { listenerMulti: e, listeners: [c] }), WALK.getViewer().onNodeTypeClicked(b, e));
      };
      this.removeOnNodeTypeClicked = function (b, c) {
          var d = a.get(b);
          console.assert(d, "listenerMulti not registered for " + b);
          c = d.listeners.indexOf(c);
          console.assert(0 <= c, "listener not registered for " + b);
          d.listeners.splice(c, 1);
          0 === d.listeners.length && (WALK.getViewer().removeOnNodeTypeClicked(b, d.listenerMulti), a.delete(b));
      };
  })();
  WALK.Extension = function (a) {
      function b(a) {
          return c.definition.properties.some(function (b) {
              return b.id === a;
          });
      }
      var c = this;
      this.triggers = [];
      var d = [];
      this.definition = this.constructor.definition;
      this.viewerApi = WALK.getViewer();
      this.running = !1;
      var e = [];
      this.config = WALK.readOnlyCopy(
          (function (a) {
              a = WALK.cloneObject(a);
              if (void 0 !== a.anchor && void 0 === a.trigger && !b("anchor") && b("trigger")) {
                  var d = a.anchor;
                  d.icon && d.icon.font && (d.icon = vk[d.icon.value]);
                  a.trigger = d;
                  a.anchor = void 0;
              }
              d = _.makeIterator(c.definition.properties);
              for (var e = d.next(); !e.done; e = d.next()) (e = e.value), void 0 === a[e.id] && void 0 !== e.defaultValue && (a[e.id] = e.defaultValue);
              return a;
          })(a)
      );
      Object.defineProperty(this, "name", {
          get: function () {
              return this.config.name;
          },
      });
      Object.defineProperty(this, "type", {
          get: function () {
              return this.config.type;
          },
      });
      Object.defineProperty(this, "vrCompatible", {
          get: function () {
              return this.definition.vrCompatible;
          },
          configurable: !0,
      });
      this.cloneConfig = function () {
          return WALK.cloneObject(this.config);
      };
      this.updateConfig = function (a) {
          this.stop();
          this.config = WALK.readOnlyCopy(a);
          this.start();
      };
      this.doStop = this.doStart = uk;
      this.trigger = wk;
      this.start = function () {
          this.running || (this.doStart(), (this.running = !0));
      };
      this.stop = function () {
          if (this.running) {
              this.doStop();
              for (var a = _.makeIterator(d), b = a.next(); !b.done; b = a.next()) this.viewerApi.removeAnchor(b.value);
              a = _.makeIterator(e);
              for (b = a.next(); !b.done; b = a.next()) (b = b.value), xk.removeOnNodeTypeClicked(b[0], b[1]);
              e.length = 0;
              this.triggers.length = 0;
              d.length = 0;
              this.running = !1;
          }
      };
      this._vrChanged = function (a) {
          a && !this.vrCompatible ? this.stop() : a || this.vrCompatible || this.start();
      };
      this.addTrigger = function (a, b) {
          "node" === a.type
              ? ((a = a.nodeType), e.push([a, b]), xk.onNodeTypeClicked(a, b), this.triggers.push.apply(this.triggers, _.arrayFromIterable(this.viewerApi.findNodesOfType(a))))
              : ((b = this.viewerApi.addAnchor(a, b)), (b.extension = this), d.push(b), this.triggers.push(b));
      };
      this.isTriggerable = function () {
          return this.trigger !== wk;
      };
      this.isTriggerExclusive = function () {
          return !!this.config.triggerExclusive;
      };
      this.viewerApi.onVrChange(this._vrChanged.bind(this));
  };
  WALK.Extensions.HtmlLabel = function (a) {
      function b() {
          f = null;
          WALK.Extensions.HtmlLabel._activeLabel === e && ((WALK.Extensions.HtmlLabel._activeLabel = null), d());
      }
      function c(a) {
          if (a instanceof HTMLVideoElement || a instanceof HTMLIFrameElement) return !0;
          a = _.makeIterator(a.children);
          for (var b = a.next(); !b.done; b = a.next()) if (c(b.value)) return !0;
          return !1;
      }
      function d() {
          WALK.Extensions.HtmlLabel._animatedMaterialsAreSleeping && (e.viewerApi.wakeAnimatedMaterials(), (WALK.Extensions.HtmlLabel._animatedMaterialsAreSleeping = !1));
      }
      var e = this;
      WALK.Extension.call(this, a);
      var f = null;
      this.trigger = function (a) {
          var g = WALK.Extensions.HtmlLabel._activeLabel === this;
          (!0 === a && g) ||
              (!1 === a && !g) ||
              (g
                  ? (console.assert(null !== f), f.close())
                  : ((WALK.Extensions.HtmlLabel._activeLabel = this),
                    (f = this.viewerApi.openPopup(this.config.content, this.config, b)),
                    (a = document.createElement("div")),
                    (a.innerHTML = this.config.content),
                    c(a) ? WALK.Extensions.HtmlLabel._animatedMaterialsAreSleeping || (e.viewerApi.sleepAnimatedMaterials(), (WALK.Extensions.HtmlLabel._animatedMaterialsAreSleeping = !0)) : d()));
      };
      this.doStart = function () {
          var a = this;
          a.viewerApi.onSceneReadyToDisplay(function () {
              a.config.trigger &&
                  a.addTrigger(a.config.trigger, function () {
                      return a.trigger();
                  });
          });
      };
      this.doStop = function () {
          null !== f && f.close();
      };
  };
  WALK.Extensions.HtmlLabel.definition = {
      name: "HTML label",
      properties: [
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
          { id: "content", type: "textArea", label: "Content", optional: !0, defaultValue: "Content to display..." },
          { id: "centerHorizontally", type: "bool", label: "Center horizontally", defaultValue: !1 },
          { id: "centerVertically", type: "bool", label: "Center vertically", defaultValue: !1 },
          { id: "padding", type: "bool", label: "Padding", defaultValue: !0 },
      ],
      vrCompatible: !1,
  };
  WALK.Extensions.HtmlLabel._activeLabel = null;
  WALK.Extensions.HtmlLabel._animatedMaterialsAreSleeping = !1;
  WALK.Extensions.Audio = function (a) {
      function b() {
          d.trigger();
      }
      function c() {
          var a = d.config;
          a.trigger && d.addTrigger(a.trigger, b);
          a.menuButton && ((l = e.addMenuButton(g.src)), l.addEventListener("click", b), (m = e.getMenuButtonIcon(l)));
          if (a.autoplay)
              d.viewerApi.onNextPageInteraction(function () {
                  b();
              });
      }
      a.url && !a.file && ((a.file = { file: a.url.split("/").pop(), url: a.url }), delete a.url);
      a.file.path && a.file.url && delete a.file.url;
      WALK.Extension.call(this, a);
      var d = this,
          e = this.viewerApi,
          f = null,
          g = null,
          h = null,
          l = null,
          m = null,
          n = !1;
      this.trigger = function (a) {
          (!0 === a && n) || (!1 === a && !n) || (n ? h.pause() : (d.config.playRewinds && (h.currentTime = 0), h.play()));
      };
      this.doStart = function () {
          WALK.log("Audio start");
          this.config.menuButton && !f && ((f = WALK.preloadImage(e.getViewerAssetUrl("img/audio-on.svg"))), (g = WALK.preloadImage(e.getViewerAssetUrl("img/audio-off.svg"))));
          h = document.createElement("audio");
          this.config.file && (this.config.file.path ? (h.src = WALK.getExtraAssetUrl(this.config.file.path)) : this.config.file.url && (h.src = this.config.file.url));
          h.src &&
              ((h.loop = this.config.loop),
              h.addEventListener("play", function () {
                  n = !0;
                  m && (m.src = f.src);
              }),
              h.addEventListener("pause", function () {
                  n = !1;
                  m && (m.src = g.src);
              }),
              document.body.appendChild(h),
              e.onSceneReadyToDisplay(c));
      };
      this.doStop = function () {
          WALK.log("Audio stop");
          n = !1;
          l && (this.viewerApi.removeMenuButton(l), (m = l = null));
          h.pause();
          h.remove();
          h = null;
      };
  };
  WALK.Extensions.Audio.definition = {
      name: "Audio",
      properties: [
          { id: "file", type: "file", label: "File", fileType: "audio" },
          { id: "autoplay", type: "bool", label: "Autoplay", defaultValue: !1 },
          { id: "triggerExclusive", type: "bool", label: "Exclusive", defaultValue: !1 },
          { id: "playRewinds", type: "bool", label: "Play rewinds", defaultValue: !1 },
          { id: "loop", type: "bool", label: "Loop", defaultValue: !0 },
          { id: "menuButton", type: "bool", label: "Show menu button", defaultValue: !0 },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
      ],
      vrCompatible: !0,
  };
  function yk(a, b) {
      var c = new THREE.Vector3(),
          d = new THREE.Vector3();
      if (b && "node" !== b.type) {
          c.fromArray(b.position);
          var e = b.radius;
      } else e = WALK.Extensions.MaterialPicker.VR_RADIUS;
      this.getPosition = function (f) {
          (b && "node" !== b.type) || (d.copy(a.getCameraPosition()), d.sub(f), d.normalize().multiplyScalar(e), c.copy(f).add(d));
          return c;
      };
      this.getRadius = function () {
          return e;
      };
  }
  WALK.Extensions.MaterialPicker = function (a) {
      function b() {
          return (h.config.toReplace ? [h.config.toReplace] : []).concat(h.config.toPick || []);
      }
      function c() {
          return b().map(function (a) {
              return h.viewerApi.findMaterial(a);
          });
      }
      function d(a) {
          h.viewerApi.apiUserChangeState(n, a.name);
      }
      function e(a, b) {
          console.assert(a === n);
          if ((a = h.viewerApi.findMaterial(b))) for (b = 0; b < l.length; b += 1) h.viewerApi.setMaterialForMesh(a, l[b]);
      }
      function f(a, b) {
          h.triggerAtPosition(void 0, b);
      }
      function g() {
          h.config.trigger && h.addTrigger(h.config.trigger, f);
          l = h.viewerApi.findMeshesWithMaterial(h.config.toReplace || []);
      }
      WALK.Extension.call(this, a);
      var h = this,
          l = [],
          m = new yk(h.viewerApi, h.config.trigger),
          n = "MaterialPicker:" + this.name;
      this.config.materials && ((a = WALK.cloneObject(this.config)), 0 < a.materials.length && ((a.toReplace = a.materials[0]), (a.toPick = a.materials.slice(1))), (a.materials = void 0), (this.config = WALK.readOnlyCopy(a)));
      h.viewerApi.isSceneReadyToDisplay() ||
          b().map(function (a) {
              h.viewerApi.setMaterialEditable(a);
          });
      this.trigger = function (a) {
          !1 !== a && h.viewerApi.openMaterialPicker(c(), d);
      };
      this.triggerAtPosition = function (a, b) {
          !1 !== a && h.viewerApi.openMaterialPicker(c(), d, null, m.getPosition(b), m.getRadius());
      };
      this.doStart = function () {
          this.viewerApi.onSceneReadyToDisplay(g);
          this.viewerApi.onApiUserStateChanged(n, e);
      };
      this.doStop = function () {
          var a = h.viewerApi.findMaterial(h.config.toReplace);
          a && d(a);
          this.viewerApi.removeOnApiUserStateChanged(n, e);
      };
  };
  WALK.Extensions.MaterialPicker.VR_RADIUS = 0.07;
  WALK.Extensions.MaterialPicker.definition = {
      name: "Material picker",
      properties: [
          { id: "toReplace", type: "material", label: "Material to replace" },
          { id: "toPick", type: "list", elementType: "material", label: "Materials to pick" },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.MaterialComboPicker = function (a) {
      function b() {
          for (var a = new Set(), b = _.makeIterator(x), c = b.next(); !c.done; c = b.next()) {
              c = _.makeIterator(c.value);
              for (var d = c.next(); !d.done; d = c.next()) (d = d.value), a.add(d.toReplace), a.add(d.toUse);
          }
          return a;
      }
      function c() {
          for (var a = [x[0][0].toReplace], b = _.makeIterator(x), c = b.next(); !c.done; c = b.next()) a.push(c.value[0].toUse);
          return a;
      }
      function d() {
          return c().map(function (a) {
              return z.findMaterial(a);
          });
      }
      function e() {
          if (-1 !== A)
              for (var a = 0; a < x[A].length; ++a) {
                  var b = x[A][a],
                      c = z.findMaterial(b.toUse);
                  b = z.findMaterial(b.toReplace);
                  c.setUvOffsetAndScale(v[c]);
                  c.setUniforms();
                  c = _.makeIterator(q[A][a]);
                  for (var d = c.next(); !d.done; d = c.next()) z.setMaterialForMesh(b, d.value);
              }
      }
      function f(a, b) {
          z.apiUserChangeState(y, b);
      }
      function g(a, b) {
          console.assert(a === y);
          e();
          if (0 !== b)
              for (A = b - 1, a = 0; a < x[A].length; ++a) {
                  var c = x[A][a];
                  b = z.findMaterial(c.toUse);
                  var d = v[b];
                  b.setUvOffsetAndScale(d.x, d.y, d.z * (c.uvScale ? c.uvScale[0] : u[0]), d.w * (c.uvScale ? c.uvScale[1] : u[1]));
                  b.setUniforms();
                  c = _.makeIterator(q[A][a]);
                  for (d = c.next(); !d.done; d = c.next()) z.setMaterialForMesh(b, d.value);
              }
      }
      function h() {
          WALK.Extensions.MaterialComboPicker._menuPopup.close();
          WALK.Extensions.MaterialComboPicker._menuPopup = null;
      }
      function l() {
          WALK.Extensions.MaterialComboPicker._pickerOpened = !1;
      }
      function m(a, b) {
          WALK.Extensions.MaterialComboPicker._menuPopup && h();
          a = d();
          z.openMaterialPicker(a, f, l, w.getPosition(b), w.getRadius());
          WALK.Extensions.MaterialComboPicker._pickerOpened = !0;
      }
      function n() {
          for (var a = _.makeIterator(r.config.triggers), b = a.next(); !b.done; b = a.next()) r.addTrigger(b.value, m);
          for (a = 0; a < x.length; ++a) {
              q[a] = [];
              b = _.makeIterator(x[a]);
              for (var c = b.next(); !c.done; c = b.next()) {
                  c = c.value;
                  var d = c.toUse;
                  q[a].push(z.findMeshesWithMaterial(c.toReplace));
                  c = z.findMaterial(d);
                  v.has(c) || ((d = new THREE.Vector4()), (v[c] = c.getUvOffsetAndScale(d)));
              }
          }
      }
      function p() {
          var a = WALK.Extensions.MaterialComboPicker._startedPickers;
          console.assert(0 < a.length);
          WALK.Extensions.MaterialComboPicker._pickerOpened && z.closeMaterialPicker();
          if (WALK.Extensions.MaterialComboPicker._menuPopup) h();
          else {
              var b = document.createElement("div");
              b.innerHTML =
                  '\n        <div class="ext-material-combo-picker-menu-title">\n          <img src="' +
                  z.getViewerAssetUrl("img/sliders-horizontal.svg") +
                  '">\n        </div>\n        <ul class="ext-material-combo-picker-menu-list">\n          <li class="ext-material-combo-picker-menu-item"></li>\n        </ul>';
              for (
                  var c = b.getElementsByClassName("ext-material-combo-picker-menu-list")[0], d = c.getElementsByClassName("ext-material-combo-picker-menu-item")[0], e = {}, f = 0;
                  f < a.length;
                  e = { $jscomp$loop$prop$picker$184: e.$jscomp$loop$prop$picker$184 }, ++f
              )
                  0 < f && ((d = d.cloneNode(!0)), c.appendChild(d)),
                      (e.$jscomp$loop$prop$picker$184 = a[f]),
                      WALK.setTextContent(d, e.$jscomp$loop$prop$picker$184.name),
                      d.addEventListener(
                          "click",
                          (function (a) {
                              return function () {
                                  a.$jscomp$loop$prop$picker$184._openFromMenu();
                              };
                          })(e)
                      );
              WALK.Extensions.MaterialComboPicker._menuPopup = z.openPopup(b, { centerHorizontally: !0, centerVertically: !0 }, function () {
                  WALK.Extensions.MaterialComboPicker._menuPopup = null;
              });
          }
      }
      WALK.Extension.call(this, a);
      var r = this,
          q = [],
          u = [1, 1],
          v = new Map(),
          w = new yk(r.viewerApi),
          y = "MaterialComboPicker:" + this.name,
          z = this.viewerApi,
          x = r.config.options,
          A = -1;
      z.isSceneReadyToDisplay() ||
          b().forEach(function (a) {
              z.setMaterialEditable(a);
          });
      this._openFromMenu = function () {
          h();
          var a = d();
          z.openMaterialPicker(a, f);
          WALK.Extensions.MaterialComboPicker._pickerOpened = !0;
      };
      this.doStart = function () {
          z.onSceneReadyToDisplay(n);
          z.onApiUserStateChanged(y, g);
          var a = WALK.Extensions.MaterialComboPicker._startedPickers;
          a.push(this);
          1 === a.length && ((a = z.addMenuButton(z.getViewerAssetUrl("img/sliders-horizontal.svg"))), a.addEventListener("click", p), (WALK.Extensions.MaterialComboPicker._menuButton = a));
      };
      this.doStop = function () {
          e();
          this.viewerApi.removeOnApiUserStateChanged(y, g);
          var a = WALK.Extensions.MaterialComboPicker._startedPickers;
          a.splice(a.indexOf(this), 1);
          0 === a.length && (z.removeMenuButton(WALK.Extensions.MaterialComboPicker._menuButton), (WALK.Extensions.MaterialComboPicker._menuButton = null));
      };
  };
  WALK.Extensions.MaterialComboPicker.definition = {
      name: "Material combo picker",
      hideFromEditor: !0,
      properties: [
          { id: "triggers", type: "list", label: "Triggers", elementType: "trigger" },
          {
              id: "options",
              type: "list",
              label: "Options",
              elementType: {
                  type: "list",
                  label: "option",
                  elementType: [
                      { id: "toReplace", type: "material", label: "Material to replace" },
                      { id: "toUse", type: "material", label: "Material to use" },
                      { id: "uvScale", type: "list", label: "UV Scale", elementType: "float" },
                  ],
              },
          },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.MaterialComboPicker._startedPickers = [];
  WALK.Extensions.MaterialComboPicker._menuButton = null;
  WALK.Extensions.MaterialComboPicker._menuPopup = null;
  WALK.Extensions.MaterialComboPicker._pickerOpened = !1;
  WALK.Extensions.VideoTextureControl = function (a) {
      function b() {
          var a = e.baseColorTexture,
              b = d.config;
          a.loop = b.loop;
          if (!b.autoplay) e.pause(), (a.muted = b.muted);
          else if (!b.muted)
              d.viewerApi.onNextPageInteraction(function () {
                  a.muted = !1;
              });
          b.trigger &&
              d.addTrigger(b.trigger, function () {
                  return d.trigger();
              });
      }
      function c() {
          var a = d.config;
          (e = d.viewerApi.findMaterial(a.material))
              ? e.baseColorTexture && void 0 !== e.baseColorTexture.video
                  ? e.baseColorTexture.addLoadedListener(b)
                  : (console.error("Material '" + a.material + "' for video texture control '" + (a.name + "' does not have a video texture")), (e = null))
              : console.error("Material '" + a.material + "' for video texture control '" + (a.name + "' does not exist"));
      }
      WALK.Extension.call(this, a);
      var d = this,
          e = null;
      this.viewerApi.isSceneReadyToDisplay() || this.viewerApi.setMaterialEditable(this.config.material);
      this.trigger = function (a) {
          (!0 === a && e.isPlaying) || (!1 === a && !e.isPlaying) || (e.isPlaying ? e.pause() : (d.config.playRewinds && e.rewind(), e.play()));
      };
      this.doStart = function () {
          this.viewerApi.onSceneLoadComplete(c);
      };
      this.doStop = function () {
          e && ((e.baseColorTexture.muted = !0), e.pause(), (e = null));
      };
  };
  WALK.Extensions.VideoTextureControl.definition = {
      name: "Video texture control",
      properties: [
          { id: "material", type: "material", label: "Material with video" },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
          { id: "autoplay", type: "bool", label: "Autoplay", defaultValue: !0 },
          { id: "triggerExclusive", type: "bool", label: "Exclusive", defaultValue: !1 },
          { id: "playRewinds", type: "bool", label: "Play rewinds", defaultValue: !1 },
          { id: "loop", type: "bool", label: "Loop", defaultValue: !0 },
          { id: "muted", type: "bool", label: "Muted", defaultValue: !0 },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.OpenWebsite = function (a) {
      WALK.Extension.call(this, a);
      var b = this;
      this.trigger = function () {
          b.viewerApi.openUrl(b.config.url, b.config.newWindow);
      };
      this.doStart = function () {
          this.viewerApi.onSceneReadyToDisplay(function () {
              b.config.trigger &&
                  b.addTrigger(b.config.trigger, function () {
                      return b.trigger();
                  });
          });
      };
  };
  WALK.Extensions.OpenWebsite.definition = {
      name: "Open URL",
      properties: [
          { id: "url", type: "text", label: "URL" },
          { id: "newWindow", type: "bool", label: "New window", defaultValue: !0 },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.ChangeView = function (a) {
      WALK.Extension.call(this, a);
      var b = this,
          c = 0;
      this.trigger = function () {
          b.viewerApi.switchToView(b.config.views[c], void 0, b.config.doNotMoveCamera);
          c = (c + 1) % b.config.views.length;
      };
      this.doStart = function () {
          var a = this.viewerApi;
          c = 0;
          a.onSceneReadyToDisplay(function () {
              b.config.trigger &&
                  b.addTrigger(b.config.trigger, function () {
                      return b.trigger();
                  });
          });
      };
  };
  WALK.Extensions.ChangeView.definition = {
      name: "Change view",
      properties: [
          { id: "views", type: "list", elementType: "view", label: "Views to toggle" },
          { id: "doNotMoveCamera", type: "bool", label: "Do not move camera", defaultValue: !1 },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.HideAnchors = function (a) {
      function b(a) {
          h.src = a ? e.src : f.src;
      }
      WALK.Extension.call(this, a);
      var c = this,
          d = c.viewerApi,
          e = WALK.preloadImage(d.getViewerAssetUrl("img/anchors-on.svg")),
          f = WALK.preloadImage(d.getViewerAssetUrl("img/anchors-off.svg")),
          g = null,
          h = null;
      this.trigger = function (a) {
          (!0 === a && d.anchorsVisible) || (!1 === a && !d.anchorsVisible) || (d.anchorsVisible = !d.anchorsVisible);
      };
      this.doStart = function () {
          d = c.viewerApi;
          d.onAnchorsVisibilityChanged(b);
          g = d.addMenuButton(e.src);
          h = d.getMenuButtonIcon(g);
          g.addEventListener("click", function () {
              return c.trigger();
          });
          var a = c.config;
          d.onSceneReadyToDisplay(function () {
              return (d.anchorsVisible = a.visibleOnStart);
          });
      };
      this.doStop = function () {
          d.removeAnchorsVisibilityChangedListener(b);
          d.removeMenuButton(g);
          h = g = null;
          d.anchorsVisible = !0;
      };
  };
  WALK.Extensions.HideAnchors.definition = { name: "Hide triggers", properties: [{ id: "visibleOnStart", type: "bool", label: "Visible on start", defaultValue: !0 }], vrCompatible: !0 };
  WALK.Extensions.Script = function (a) {
      function b() {
          c.trigger();
      }
      WALK.Extension.call(this, a);
      var c = this;
      this.trigger = function () {
          try {
              new Function('"use strict"; ' + c.config.code)();
          } catch (d) {
              console.error("Script extension error: " + d);
          }
      };
      this.doStart = function () {
          var a = this;
          if (this.config.trigger)
              this.viewerApi.onSceneReadyToDisplay(function () {
                  return a.addTrigger(a.config.trigger, b);
              });
          else b();
      };
  };
  WALK.Extensions.Script.definition = {
      name: "Script",
      properties: [
          {
              id: "code",
              type: "textArea",
              label: "Code",
              defaultValue: "\x3c!-- Put your JavaScript code here. If a trigger is set, the code is executed when the trigger is clicked. Otherwise the code is executed when a page is loaded --\x3e",
          },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.ProjectionScreen = function (a) {
      function b() {
          return "node" === n.config.trigger.type;
      }
      function c() {
          console.assert(!b());
          return n.triggers[0].material;
      }
      function d() {
          var a = v.getVideoTexture1();
          q.baseColorTexture = a ? a : u;
      }
      function e() {
          WALK.log("Presentation stop");
          v && (v.uuid === r.myUuid && r.stopShareScreen(), v.removeEventListener("dispose", e), v.removeEventListener("avatarUpdated", d));
          v = null;
          q.baseColorTexture = u;
          b() || (c().highlightMix = 0);
      }
      function f() {
          w
              ? w.close()
              : (w = n.viewerApi.openPopup(
                    "In a 3D meeting this trigger will start a screen sharing on the " + (n.config.material + " material. Outside of a 3D meeting the trigger will be hidden."),
                    { padding: !0, centerVertically: !0, centerHorizontally: !0 },
                    function () {
                        w = null;
                    }
                ));
      }
      function g() {
          var a = r.myUuid;
          v && v.getVideoTexture1()
              ? v.uuid === a && (WALK.log("Requesting presentation stop"), n.viewerApi.apiUserChangeState(p, null))
              : (WALK.log("Requesting screen share " + a),
                r.startShareScreen(
                    function () {
                        n.viewerApi.apiUserChangeState(p, a);
                    },
                    function () {
                        n.viewerApi.apiUserChangeState(p, null);
                    },
                    function () {}
                ));
      }
      function h(a, f) {
          console.assert(a === p);
          f
              ? (v && v.uuid !== f && (WALK.log("Changing presenting user"), e()),
                v ||
                    (WALK.log("New presenting user " + f),
                    (v = n.viewerApi.findAvatar(f) || null)
                        ? (v.addEventListener("dispose", e), v.addEventListener("avatarUpdated", d), b() || ((a = c()), (a.highlight = v.getMainMaterial().baseColor), a.setUniforms(), (a.highlightMix = 0.7)), d())
                        : console.log("Cannot attach presentation stream of a user " + f + " The user was not found.")))
              : e();
      }
      function l() {
          h(p, n.viewerApi.getApiUserState(p));
      }
      function m(a) {
          var b = n.config;
          (q = n.viewerApi.findMaterial(b.material))
              ? ((r = a), (u = q.baseColorTexture), n.addTrigger(b.trigger, g), n.viewerApi.onApiUserStateChanged(p, h), n.viewerApi._onAvatarListChanged(l))
              : (console.error("Material for a projection screen is missing"), (q = null));
      }
      WALK.Extension.call(this, a);
      var n = this,
          p = "ProjectionScreen:" + this.name,
          r = null,
          q = null,
          u = null,
          v = null,
          w = null;
      this.viewerApi.isSceneReadyToDisplay() || this.viewerApi.setMaterialEditable(this.config.material);
      this.doStart = function () {
          tk ? n.addTrigger(n.config.trigger, f) : this.viewerApi._onMeetingJoined(m);
      };
      this.doStop = function () {
          tk || (this.viewerApi._removeOnMeetingJoined(m), r && (this.viewerApi.removeOnApiUserStateChanged(p, h), this.viewerApi._removeOnAvatarListChanged(l)), (q = r = null));
      };
  };
  WALK.Extensions.ProjectionScreen.definition = {
      name: "Meeting projection screen",
      properties: [
          { id: "material", type: "material", label: "Material to project on" },
          { id: "trigger", type: "trigger", label: "Trigger" },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.SwitchObjects = function (a) {
      function b() {
          h.forEach(function (a) {
              return a.hide();
          });
          -1 === g
              ? (h.length = 0)
              : ((h = e.findNodesOfType(d.config.nodeTypes[g])),
                h.forEach(function (a) {
                    return a.show();
                }));
          e.requestFrame();
      }
      function c(a, c) {
          console.assert(a === f);
          g = c;
          b();
      }
      WALK.Extension.call(this, a);
      var d = this,
          e = this.viewerApi,
          f = "SwitchObjects:" + this.name,
          g,
          h = [];
      if (!e.isSceneReadyToDisplay()) {
          a = _.makeIterator(this.config.nodeTypes);
          for (var l = a.next(); !l.done; l = a.next()) e.setNodeTypeEditable(l.value);
      }
      this.trigger = function () {
          0 !== d.config.nodeTypes.length && ((g += 1), g === d.config.nodeTypes.length && (g = d.config.hideAllAfterLast ? -1 : 0), e.apiUserChangeState(f, g));
      };
      this.doStart = function () {
          var a = this;
          e.onSceneReadyToDisplay(function () {
              for (var c = 0; c < a.config.nodeTypes.length; ++c)
                  if (0 < c || a.config.hideAllOnStart) {
                      var f = e.findNodesOfType(a.config.nodeTypes[c]);
                      f = _.makeIterator(f);
                      for (var h = f.next(); !h.done; h = f.next()) h.value.hide();
                  }
              g = 0 < a.config.nodeTypes.length && !a.config.hideAllOnStart ? 0 : -1;
              b();
              a.config.trigger &&
                  a.addTrigger(a.config.trigger, function () {
                      return d.trigger();
                  });
          });
          this.viewerApi.onApiUserStateChanged(f, c);
      };
      this.doStop = function () {
          for (var a = 0; a < this.config.nodeTypes.length; ++a)
              if (a !== g) {
                  var b = e.findNodesOfType(this.config.nodeTypes[a]);
                  b = _.makeIterator(b);
                  for (var c = b.next(); !c.done; c = b.next()) c.value.show();
              }
          e.requestFrame();
      };
  };
  WALK.Extensions.SwitchObjects.definition = {
      name: "Switch objects",
      properties: [
          { id: "nodeTypes", type: "list", elementType: "nodeType", label: "Objects to switch" },
          { id: "trigger", type: "trigger", label: "Trigger", optional: !0 },
          { id: "hideAllOnStart", type: "bool", label: "Hide all on start", defaultValue: !1 },
          { id: "hideAllAfterLast", type: "bool", label: " Hide all after last", defaultValue: !1 },
      ],
      vrCompatible: !0,
  };
  WALK.Extensions.VideoStream = function (a) {
      function b() {
          function a(a) {
              var b = document.createElement("video");
              b.classList.add("video-js");
              b.autoplay = !0;
              b.muted = !0;
              b.type = "application/x-mpegURL";
              if (Hls.isSupported()) {
                  var c = new Hls();
                  c.loadSource(a);
                  c.attachMedia(b);
              } else b.canPlayType("application/vnd.apple.mpegurl") ? (b.src = a) : console.log("No Hls support");
              return h.createStreamTextureFromHtmlVideo(b);
          }
          (function () {
              var b = a(l.config.streamUrl);
              b.addLoadedListener(function () {
                  g = !1;
                  l.running &&
                      (console.log(b),
                      (d = e.baseColorTexture),
                      (e.baseColorTexture = b),
                      l.viewerApi.onNextPageInteraction(function () {
                          b.muted = !1;
                      }),
                      (f = !0));
              });
              g = !0;
              b.play();
              return !0;
          })();
      }
      function c() {
          var a = l.config;
          (e = h.findMaterial(a.material))
              ? e.baseColorTexture
                  ? WALK.loadScriptAndExecute(
                        WALK.getViewerAssetUrl("lib/Hls.js"),
                        function () {
                            a.trigger &&
                                l.addTrigger(a.trigger, function () {
                                    return l.trigger();
                                });
                            (!a.autoplay && a.trigger) || l.trigger();
                        },
                        function () {
                            return za.error("Cannot load required library");
                        }
                    )
                  : (console.error("Material '" + a.material + "' for stream texture control '" + (a.name + "' does not have a stream texture")), (e = null))
              : console.error("Material '" + a.material + "' for stream texture control '" + (a.name + "' does not exist"));
      }
      WALK.Extension.call(this, a);
      var d = null,
          e = null,
          f = !1,
          g = !1,
          h = WALK.getViewer(),
          l = this;
      this.viewerApi.isSceneReadyToDisplay() || this.viewerApi.setMaterialEditable(this.config.material);
      this.trigger = function (a) {
          g || (f || g ? (!0 === a && e.isPlaying) || (!1 === a && !e.isPlaying) || (e.isPlaying ? e.pause() : (l.config.playRewinds && e.rewind(), e.play())) : !1 !== a && b());
      };
      this.doStart = function () {
          this.viewerApi.onSceneLoadComplete(c);
      };
      this.doStop = function () {
          if (e) {
              if (f) {
                  f = !1;
                  var a = e.baseColorTexture;
                  e.baseColorTexture = d;
                  a.dispose();
                  d = null;
              }
              e = null;
          }
      };
  };
  WALK.Extensions.VideoStream.definition = {
      name: "Video Stream",
      properties: [
          { id: "material", type: "material", label: "Material with stream" },
          { id: "streamUrl", type: "text", label: "Stream URL" },
          { id: "trigger", type: "trigger", label: "Trigger", defaultValue: !1, optional: !0 },
          { id: "autoplay", type: "bool", label: "Autoplay", defaultValue: !0 },
          { id: "triggerExclusive", type: "bool", label: "Exclusive", defaultValue: !1 },
          { id: "playRewinds", type: "bool", label: "Play rewinds", defaultValue: !1 },
      ],
      vrCompatible: !0,
  };
  function zk(a) {
      var b = _.makeIterator(a.split(":"));
      a = b.next().value;
      b = b.next().value;
      return [a, b];
  }
  WALK.Extensions.MultiTrigger = function (a) {
      function b() {
          return e.config.extensions
              .map(function (a) {
                  var b = _.makeIterator(zk(a));
                  a = b.next().value;
                  b = b.next().value;
                  return f.getExtension(a, b);
              })
              .filter(function (a) {
                  return a;
              });
      }
      function c(a, c) {
          a = _.makeIterator(b());
          for (var d = a.next(); !d.done; d = a.next()) {
              d = d.value;
              try {
                  d.triggerAtPosition ? d.triggerAtPosition(g, c) : d.trigger(g);
              } catch (n) {
                  console.error("Failed to trigger an extension " + n);
              }
          }
          g = !g;
      }
      function d() {
          var a = e.config;
          a.trigger && e.addTrigger(a.trigger, c);
      }
      WALK.Extension.call(this, a);
      var e = this,
          f = this.viewerApi,
          g = !0;
      Object.defineProperty(this, "vrCompatible", {
          get: function () {
              for (var a = _.makeIterator(b()), c = a.next(); !c.done; c = a.next()) if (!c.value.vrCompatible) return !1;
              return !0;
          },
      });
      this.doStart = function () {
          f.onSceneReadyToDisplay(d);
          g = !0;
      };
  };
  WALK.Extensions.MultiTrigger.definition = {
      name: "Multi trigger",
      getListElementsToAdd: function (a, b, c) {
          console.assert("extensions" === a);
          var d = new Set(
              b.map(function (a) {
                  return zk(a)[0];
              })
          );
          return c
              .getEditableExtensions()
              .filter(function (a) {
                  return a.isTriggerable() && ("VideoTextureControl" === a.type || "SwitchObjects" === a.type || !d.has(a.type));
              })
              .map(function (a) {
                  return a.type + ":" + a.name;
              });
      },
      formatListElement: function (a) {
          var b = _.makeIterator(zk(a));
          a = b.next().value;
          b = b.next().value;
          return WALK.ExtensionManager.getExtensionDefinition(a).name + ": " + b;
      },
      properties: [
          { id: "extensions", type: "list", elementType: "string", label: "Extensions to trigger", elementLabel: "extension" },
          { id: "trigger", type: "trigger", label: "Trigger", defaultValue: !1, optional: !0 },
      ],
  };
  var Ak = {};
  function Bk(a) {
      a.style.display = "";
  }
  function Ck(a) {
      a.style.display = "none";
  }
  function Dk(a) {
      var b = null,
          c = null;
      this.showDismiss = !0;
      this.onDismiss = this.onClose = null;
      this.position = Dk.DEFAULT;
      this.modal = this.foremost = !1;
      this.open = function () {
          null === c &&
              (this.modal
                  ? ((b = document.createElement("div")), (b.className = "modal-backdrop"), document.body.appendChild(b), (c = document.createElement("div")), b.appendChild(c))
                  : ((c = document.createElement("div")), document.body.appendChild(c)),
              this.update(a));
      };
      this.hide = function () {
          b ? Ck(b) : Ck(c);
      };
      this.unhide = function () {
          b ? Bk(b) : Bk(c);
      };
      this.update = function (a) {
          var b = this,
              d = this.showDismiss ? '<div class="ext-popup-close-button-panel ui-close-hoverable">\n           <div class="ext-popup-close-button"></div>\n         </div>' : "",
              g = (function () {
                  switch (b.position) {
                      case Dk.TOP:
                          return "ui-top ui-center";
                      case Dk.DEFAULT:
                          return "ui-upper-half-center";
                      case Dk.CENTER:
                          return "ui-all-center";
                      default:
                          return console.log("Invalid popup position: " + b.position), "ui-all-center";
                  }
              })();
          c.innerHTML = '\n       <div class="ext-popup ' + g + " " + (this.foremost ? "ui-foremost" : "") + '">\n         <div class="ext-popup-content">\n           ' + a + "\n         </div>" + d + "\n       </div>";
          addClickHandlerFocusWalkCanvas(c);
          this.showDismiss &&
              ((a = c.getElementsByClassName("ext-popup-close-button-panel")[0]),
              addClickHandler(a, function () {
                  return b.dismiss();
              }));
      };
      this.getElementsByClassName = function (a) {
          return c.getElementsByClassName(a);
      };
      this.dismiss = function () {
          if (null !== c && (this.close(), this.onDismiss)) this.onDismiss();
      };
      this.close = function () {
          if (null !== c && (this.modal ? (document.body.removeChild(b), (b = null)) : document.body.removeChild(c), (c = null), this.onClose)) this.onClose();
      };
  }
  Dk.CENTER = "center";
  Dk.DEFAULT = "default";
  Dk.TOP = "top";
  Ak = {
      removeChildren: function (a) {
          for (; a.firstChild; ) a.removeChild(a.firstChild);
      },
      addChangeHandler: function (a, b) {
          document.getElementById(a).onchange = b;
      },
      show: Bk,
      hide: Ck,
      setVisibility: function (a, b) {
          b ? Bk(a) : Ck(a);
      },
      setButtonHighlight: function (a, b) {
          b ? a.classList.add("ext-meeting-button-highlight") : a.classList.remove("ext-meeting-button-highlight");
      },
      highlightInput: function (a) {
          a.classList.add("ext-meeting-input-missing");
          window.setTimeout(function () {
              a.classList.remove("ext-meeting-input-missing");
          }, 200);
      },
      highlightText: function (a) {
          a.classList.add("ext-meeting-text-highlighted");
          window.setTimeout(function () {
              a.classList.remove("ext-meeting-text-highlighted");
          }, 200);
      },
      UiPopup: Dk,
      showMessage: function (a, b) {
          var c = "";
          b && (c = '<h3 class="ext-meeting-dialog-title">' + b + "</h3>");
          var d = new Dk(
              c +
                  ('\n      <div class="ext-meeting-dialog-message">\n        ' +
                      a +
                      '\n      </div>\n      <div class="ext-meeting-dialog-buttons">\n        <button class="ext-meeting-button">\n          Close\n        </button>\n      </div>\n    ')
          );
          d.showDismiss = !1;
          d.foremost = !0;
          d.modal = !0;
          d.open();
          d.getElementsByClassName("ext-meeting-button")[0].onclick = function () {
              d.close();
          };
      },
      showIframePopup: function (a, b, c) {
          var d = new Dk(
              '\n      <div class="ext-meeting-dialog-iframe-container">\n        <h3 class="ext-meeting-dialog-title">' +
                  a +
                  '</h3>\n        <iframe src="' +
                  b +
                  '" class="ext-meeting-dialog-iframe">\n        </iframe>\n        <div>\n          <div class="ext-meeting-dialog-buttons">\n            <button class="ext-meeting-button">\n              Close\n            </button>\n          </div>\n        </div>\n      <div>\n    '
          );
          d.showDismiss = !1;
          d.position = Dk.CENTER;
          d.onClose = c;
          d.open();
          var e = d.getElementsByClassName("ext-meeting-dialog-iframe")[0];
          e.style.visibility = "hidden";
          e.onload = function () {
              e.style.visibility = "visible";
          };
          d.getElementsByClassName("ext-meeting-button")[0].onclick = function () {
              return d.close();
          };
      },
  };
  var Ek = {},
      Fk = null;
  function Gk() {
      null === Fk && (Fk = new (window.AudioContext || window.webkitAudioContext)());
      return Fk;
  }
  function Hk(a, b, c) {
      this._frequencyDiv = b;
      this._noSoundThreshold = c;
      this._maxFrequencyIndex = this._minFrequencyIndex = -1;
      this._noSoundCalls = 0;
      this._source = null;
      this._analyser = Gk().createAnalyser();
      this._analyser.fftSize = 2 * this._frequencyDiv;
      this._analyser.smoothingTimeConstant = 0.5;
      a = new MediaStream([a.mediaStreamTrack]);
      this._source = Gk().createMediaStreamSource(a);
      this._source.connect(this._analyser);
      a = Gk().sampleRate / this._frequencyDiv;
      this._minFrequencyIndex = Math.floor(Hk._minVoiceFrequency / a);
      this._maxFrequencyIndex = Math.floor(Hk._maxVoiceFrequency / a);
      this._dataArray = new Uint8Array(this._maxFrequencyIndex + 1);
  }
  Hk.prototype.measureSoundVolume = function () {
      var a = this._getOverallSoundVolume();
      return this._shouldSkipNoSoundNotification(a) ? null : a;
  };
  Hk.prototype.dispose = function () {
      null !== this._source && (this._source.disconnect(), (this._source = null));
  };
  Hk.prototype._getOverallSoundVolume = function () {
      this._analyser.getByteFrequencyData(this._dataArray);
      for (var a = 0, b = this._minFrequencyIndex; b <= this._maxFrequencyIndex; b++) this._dataArray[b] > a && (a = this._dataArray[b]);
      return a;
  };
  Hk.prototype._shouldSkipNoSoundNotification = function (a) {
      if (a < this._noSoundThreshold) return this._noSoundCalls++, this._noSoundCalls < Hk._skippedNoSoundCalls;
      this._noSoundCalls = 0;
      return !1;
  };
  Hk._minVoiceFrequency = 85;
  Hk._maxVoiceFrequency = 350;
  Hk._skippedNoSoundCalls = 3;
  function Ik(a, b, c, d) {
      this._width = a;
      this._height = b;
      this._bottomMargin = void 0 !== d ? d : 0;
      this._volumeRect = null;
      this._rectId = Ik._baseRectId + Ik._counter;
      Ik._counter++;
      this._noSoundThreshold = c;
      this._lengthCoef = a / (255 - this._noSoundThreshold);
  }
  Ik.prototype.getHTML = function () {
      this._volumeRect = null;
      return (
          '\n        <svg style="filter: drop-shadow(0px 0px 1px black);\n                    margin-bottom: ' +
          this._bottomMargin.toString() +
          'px;"\n             width="' +
          this._width.toString() +
          'px"\n             height="' +
          this._height.toString() +
          'px">\n          <rect id="' +
          this._rectId +
          '"\n                x = "' +
          (this._width / 2 - 1).toString() +
          '" y = "0"\n                width="' +
          (1).toString() +
          '"\n                height="' +
          this._height.toString() +
          '"\n                fill="red"/>\n        </svg>\n      '
      );
  };
  Ik.prototype.getEmptyHTML = function () {
      return '\n        <svg width="' + this._width.toString() + 'px"\n             height="' + this._height.toString() + 'px">\n        </svg>\n      ';
  };
  Ik.prototype.update = function (a) {
      null === this._volumeRect && (this._volumeRect = document.getElementById(this._rectId));
      console.assert(null !== this._volumeRect, "Volume visualizer HTML not attached to any element");
      if (null !== a) {
          var b = this._getColor(a),
              c = Math.max(Ik._minimalDisplayedValue, Math.max(a, this._noSoundThreshold) - this._noSoundThreshold);
          a = this._width / 2 - (c * this._lengthCoef) / 2;
          c *= this._lengthCoef;
          this._volumeRect.setAttribute("fill", b);
          this._volumeRect.setAttribute("x", a.toString());
          this._volumeRect.setAttribute("width", c.toString());
      }
  };
  Ik.prototype._getColor = function (a) {
      return a < this._noSoundThreshold ? "red" : a < Ik._lowSoundThreshold ? "orange" : "green";
  };
  Ik._counter = 0;
  Ik._baseRectId = "ext-meeting-mic-bar-";
  Ik._lowSoundThreshold = 180;
  Ik._minimalDisplayedValue = 20;
  Ek = { VolumeMeter: Hk, VolumeVisualizer: Ik };
  var Jk,
      Kk = { name: "mic" },
      Lk = { name: "camera", facingMode: "user", width: 480, height: 360, frameRate: 24 };
  function Mk(a, b) {
      return a ? b[0].toUpperCase() + b.slice(1) : b[0].toLowerCase() + b.slice(1);
  }
  function Nk(a, b) {
      var c = void 0 !== b;
      c = Mk(!0, a.name) + (c ? " and " + Mk(!1, b.name) : "");
      a = a.error.name;
      console.assert(void 0 === b || b.error.name === a);
      return "NotFoundError" === a ? c + " not found" : "NotAllowedError" === a ? c + " blocked" : "Error" === a ? "Error" : c + " not available";
  }
  function Ok(a, b) {
      var c = void 0 !== b,
          d = c ? "they are" : "it is",
          e = c ? "them" : "it",
          f = a.error.name;
      return "NotFoundError" === f
          ? "Check if your " + (Mk(!1, a.name) + (c ? " and " + Mk(!1, b.name) : "")) + " " + (c ? "are" : "is") + " properly connected."
          : "NotAllowedError" === f
          ? WALK.DETECTOR.mobile
              ? WALK.DETECTOR.ios
                  ? "Unblock " + e + " by clicking " + (c ? a.unblockIcon + " and " + b.unblockIcon : "the " + a.unblockIcon) + " " + (c ? "buttons" : "button") + "."
                  : "Unblock " + e + " in the browser settings for this webpage."
              : "Unblock " + e + " by clicking the " + (c ? b.unblockIcon : a.unblockIcon) + " button in the browser\u2019s address bar and refresh the webpage."
          : "Error" === f
          ? "Your browser doesn't support video meetings. Open the meeting link in another browser."
          : "If " + d + " connected, close all other applications using " + (e + " and refresh the webpage.");
  }
  function Pk(a, b, c, d) {
      this._firstErrorDiv = document.getElementById(a);
      this._secondErrorDiv = document.getElementById(b);
      this._devicePreview1 = c;
      this._devicePreview2 = d;
  }
  Pk.prototype._reset = function () {
      this._devicePreview1.setErrorDiv(null);
      this._devicePreview2.setErrorDiv(null);
      Ak.removeChildren(this._firstErrorDiv);
      Ak.removeChildren(this._secondErrorDiv);
  };
  Pk.prototype._displayAndLogErrorMessage = function (a, b, c) {
      function d(a) {
          if (void 0 !== a) return a.device;
      }
      var e = Nk(b.device, d(c)),
          f = Ok(b.device, d(c));
      a.innerHTML = '\n        <div class="ext-meeting-join-error-title">' + e + '</div>\n        <div class="ext-meeting-join-error-description">' + f + "</div>\n      ";
      b.setErrorDiv(a);
      b.device.logError();
      void 0 !== c && (c.setErrorDiv(a), c.device.logError());
  };
  Pk.prototype.update = function () {
      this._reset();
      var a = this._devicePreview1.device.error,
          b = this._devicePreview2.device.error;
      if (null !== a || null !== b)
          null !== a && null !== b
              ? a.name === b.name
                  ? this._displayAndLogErrorMessage(this._firstErrorDiv, this._devicePreview1, this._devicePreview2)
                  : (this._displayAndLogErrorMessage(this._firstErrorDiv, this._devicePreview1), this._displayAndLogErrorMessage(this._secondErrorDiv, this._devicePreview2))
              : null !== a
              ? this._displayAndLogErrorMessage(this._firstErrorDiv, this._devicePreview1)
              : this._displayAndLogErrorMessage(this._firstErrorDiv, this._devicePreview2);
  };
  function Qk(a, b) {
      this._name = a;
      this._active = !1;
      this._unblockIcon = b;
      this._error = this._track = this._trackOptions = null;
  }
  Qk.prototype.logError = function () {
      null !== this._error && WALK.log("Can't create local " + this.name + " track : " + (this._error.name + ", " + this._error.message));
  };
  Qk.prototype._getLabel = function () {
      return this._track ? this._track.mediaStreamTrack.label : null;
  };
  Qk.prototype.getId = function () {
      return this._trackOptions && this._trackOptions.deviceId ? this._trackOptions.deviceId.exact : null;
  };
  Qk.prototype.getErrorMessageInfo = function () {
      if (null === this._error) return null;
      var a = Nk(this),
          b = Ok(this);
      return { title: a, description: b };
  };
  _.global.Object.defineProperties(Qk.prototype, {
      name: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._name;
          },
      },
      track: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._track;
          },
          set: function (a) {
              this._track = a;
          },
      },
      active: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._active;
          },
          set: function (a) {
              this._active = a;
          },
      },
      unblockIcon: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._unblockIcon;
          },
      },
      error: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._error;
          },
          set: function (a) {
              this._error = a;
          },
      },
      trackOptions: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._trackOptions;
          },
          set: function (a) {
              this._trackOptions = a;
          },
      },
  });
  function Rk(a, b, c, d, e, f, g) {
      this._device = new Qk(a, g);
      this._width = c;
      this._height = d;
      this._toggleButton = document.getElementById(e);
      this._previewContainer = document.getElementById(f);
      this._errorDiv = null;
      this._meetingStarter = b;
      addClickHandlerById(this._toggleButton.id, this._onToggleButtonClicked.bind(this));
      this._onStoppedBound = this._onStopped.bind(this);
      this._twilioCreateTrackFunction = null;
  }
  Rk.prototype.isAvailable = function () {
      return null !== this._device.track;
  };
  Rk.prototype.dispose = function () {
      null !== this._device.track && this._device.track.removeListener("stopped", this._onStoppedBound);
      this._close();
  };
  Rk.prototype._pauseMonitoringTrackBeforeReset = function () {
      this._device.track.removeListener("stopped", this._onStoppedBound);
  };
  Rk.prototype._resumeMonitoringTrackAfterReset = function () {
      this._device.track.addListener("stopped", this._onStoppedBound);
  };
  Rk.prototype.setErrorDiv = function (a) {
      this._errorDiv = a;
  };
  Rk.prototype.showInTestNeededMode = function () {
      this.setError({ name: "Test needed" });
  };
  Rk.prototype.showInPreviewMode = function () {
      this.setError({ name: "Initializing" });
      this.setToggleButtonVisibility(!0);
  };
  Rk.prototype.createTrack = function (a) {
      var b = this;
      return new Promise(function (c) {
          var d = a ? a : b._device.trackOptions;
          b._twilioCreateTrackFunction(WALK.cloneObject(d))
              .then(function (a) {
                  b.setTrack(a, d);
              })
              .catch(function (a) {
                  b.setTrack(null, d, a);
              })
              .finally(function () {
                  b._toggleButton.disabled = !1;
                  c();
              });
      });
  };
  Rk.prototype.updateTrackDeviceId = function (a) {
      function b(a, b) {
          return (a = a.find(function (a) {
              return a.label === b;
          }))
              ? a.deviceId
              : null;
      }
      if (this._device.track && !this._device.trackOptions.deviceId) {
          var c = this._device._getLabel();
          a = b(a, c);
          console.assert(null !== a, "deviceId not found");
          this._device.trackOptions = { name: this._device.trackOptions.name, deviceId: { exact: a } };
      }
  };
  Rk.prototype.setTrack = function (a, b, c) {
      b && (this._device.trackOptions = b);
      null !== a && void 0 !== c ? console.assert("Invalid setTrack parameters : track and error set") : null === a && void 0 === c && console.assert("Invalid setTrack parameters : track and error not set");
      this._disposeTrack();
      this._device.track = a;
      null !== this._device.track ? (this._device.track.on("stopped", this._onStoppedBound), (this._device.active = !0), this._showTrack(), this.setError(null)) : ((this._device.active = !1), this._hideTrack(), this.setError(c));
      this._meetingStarter.updateErrorMessage();
      this._updateToggleButtonState();
  };
  Rk.prototype.setError = function (a) {
      this._device.error = a;
  };
  Rk.prototype.restartTrack = function (a) {
      var b = this;
      this._toggleButton.disabled = !0;
      this.isAvailable()
          ? (this._pauseMonitoringTrackBeforeReset(),
            (this._device.trackOptions = a),
            this._device.track
                .restart(WALK.cloneObject(a))
                .then(function () {
                    b._resumeMonitoringTrackAfterReset();
                    b._meetingStarter.updateErrorMessage();
                    b._toggleButton.disabled = !1;
                })
                .catch(function () {
                    WALK.log("Second attempt to create track,device: " + b._device.name);
                    window.setTimeout(function () {
                        return b.createTrack(a);
                    }, 1e3);
                }))
          : this.createTrack(a);
  };
  Rk.prototype.setToggleButtonVisibility = function (a) {
      Ak.setVisibility(this._toggleButton, a);
  };
  Rk.prototype._updateToggleButtonState = function () {
      this._device.active
          ? (Ak.setButtonHighlight(this._toggleButton, !1), Ak.setVisibility(this._toggleButton.children[0], !0), Ak.setVisibility(this._toggleButton.children[1], !1))
          : (Ak.setButtonHighlight(this._toggleButton, !0), Ak.setVisibility(this._toggleButton.children[0], !1), Ak.setVisibility(this._toggleButton.children[1], !0));
  };
  Rk.prototype._disposeTrack = function () {
      if (null !== this._device.track) {
          var a = this._device.track;
          a.removeListener("stopped", this._onStoppedBound);
          a.detach();
          a.stop();
      }
      this._device.track = null;
  };
  Rk.prototype._onStopped = function () {
      null !== this._device.track && this.setTrack(null, null, { name: "NotReadableError", message: "Stopped" });
  };
  Rk.prototype._close = function () {
      Ak.removeChildren(this._previewContainer);
  };
  Rk.prototype._setPreviewInnerHTML = function (a) {
      this._close();
      this._previewContainer.innerHTML = a;
      Ak.show(this._previewContainer);
  };
  Rk.prototype._setPreviewElement = function (a) {
      this._close();
      null !== a && ((a.style.width = this._width.toString() + "px"), (a.style.height = this._height.toString() + "px"), this._previewContainer.appendChild(a), Ak.show(this._previewContainer));
  };
  Rk.prototype._showTrack = function () {
      this._device.active = !0;
      this._device.track.enable();
  };
  Rk.prototype._hideTrack = function () {
      this._device.active = !1;
  };
  Rk.prototype._onToggleButtonClicked = function () {
      var a = this;
      this.isAvailable()
          ? (this._device.active ? this._onSwitchOff() : this._onSwitchOn(), this._updateToggleButtonState())
          : this.createTrack().then(function () {
                a._device.error && Ak.highlightText(a._errorDiv);
            });
  };
  Rk.prototype._onSwitchOff = function () {
      this._hideTrack();
      this._device.track.disable();
  };
  Rk.prototype._onSwitchOn = function () {
      this._showTrack();
      this._device.track.enable();
  };
  _.global.Object.defineProperties(Rk.prototype, {
      device: {
          configurable: !0,
          enumerable: !0,
          get: function () {
              return this._device;
          },
      },
  });
  function Sk(a, b, c, d, e) {
      Rk.call(this, "Camera", a, b, c, d, e, '<span class="fa-video-slash"></span>');
      this._twilioCreateTrackFunction = Twilio.Video.createLocalVideoTrack;
      this._device.trackOptions = Lk;
  }
  _.inherits(Sk, Rk);
  Sk.prototype.showInTestNeededMode = function () {
      Rk.prototype.showInTestNeededMode.call(this);
      this._showPlaceholder();
  };
  Sk.prototype.showInPreviewMode = function () {
      Rk.prototype.showInPreviewMode.call(this);
      this._showPlaceholder();
  };
  Sk.prototype._showPlaceholder = function () {
      this._setPreviewInnerHTML('\n        <div class="ext-meeting-join-camera-preview-placeholder">\n          <span class="fa-video absolute-center"></span>\n        </div>\n      ');
  };
  Sk.prototype._hideTrack = function () {
      Rk.prototype._hideTrack.call(this);
      this._showPlaceholder();
  };
  Sk.prototype._showTrack = function () {
      Rk.prototype._showTrack.call(this);
      this._setPreviewElement(this._device.track.attach());
  };
  Sk.prototype._onSwitchOff = function () {
      Rk.prototype._onSwitchOff.call(this);
      this.setTrack(null, null, null);
  };
  function Tk(a, b, c, d, e) {
      Rk.call(this, "Microphone", a, b, c, d, e, '<span class="fa-microphone-slash"></span>');
      this._noSoundThreshold = 80;
      this._volumeVisualizer = new Ek.VolumeVisualizer(b, c, this._noSoundThreshold);
      this._measurementIntervalId = this._volumeMeter = null;
      this._twilioCreateTrackFunction = Twilio.Video.createLocalAudioTrack;
      this._device.trackOptions = Kk;
  }
  _.inherits(Tk, Rk);
  Tk.prototype.showInTestNeededMode = function () {
      Rk.prototype.showInTestNeededMode.call(this);
      this._setPreviewElement(null);
  };
  Tk.prototype.showInPreviewMode = function () {
      Rk.prototype.showInPreviewMode.call(this);
      this._setPreviewElement(null);
  };
  Tk.prototype.dispose = function () {
      this._isMeasurementActive() && this._stopMeasurement();
      Rk.prototype.dispose.call(this);
  };
  Tk.prototype._measure = function () {
      this._volumeVisualizer.update(this._volumeMeter.measureSoundVolume());
  };
  Tk.prototype._hideTrack = function () {
      Rk.prototype._hideTrack.call(this);
      this._isMeasurementActive() && this._stopMeasurement();
      this._setPreviewElement(null);
  };
  Tk.prototype._showTrack = function () {
      Rk.prototype._showTrack.call(this);
      this._setPreviewInnerHTML(this._volumeVisualizer.getHTML());
      this._startMeasurement();
  };
  Tk.prototype._startMeasurement = function () {
      var a = this;
      this._volumeMeter = new Ek.VolumeMeter(this._device.track, 512, this._noSoundThreshold);
      this._measurementIntervalId = setInterval(function () {
          return a._measure();
      });
  };
  Tk.prototype._stopMeasurement = function () {
      clearInterval(this._measurementIntervalId);
      this._measurementIntervalId = null;
      this._volumeMeter.dispose();
      this._volumeMeter = null;
  };
  Tk.prototype._isMeasurementActive = function () {
      return null !== this._measurementIntervalId;
  };
  Tk.prototype._pauseMonitoringTrackBeforeReset = function () {
      Rk.prototype._pauseMonitoringTrackBeforeReset.call(this);
      this._isMeasurementActive() && this._stopMeasurement();
  };
  Tk.prototype._resumeMonitoringTrackAfterReset = function () {
      Rk.prototype._resumeMonitoringTrackAfterReset.call(this);
      this._startMeasurement();
  };
  Tk.prototype._disposeTrack = function () {
      this._isMeasurementActive() && this._stopMeasurement();
      Rk.prototype._disposeTrack.call(this);
  };
  Jk = function (a, b) {
      this._onJoinCallback = a;
      this._joinMode = !1;
      this._dialog = null;
      this._mediaInitialized = this._preflightTestDone = !1;
      this._micVolumePreview = this._cameraPreview = null;
      this._cameraPreviewHeight = 198;
      this._cameraPreviewWidth = 264;
      this._micVolumePreviewHeight = 4;
      this._micVolumePreviewWidth = 40;
      this._onDevicesChangedBound = this._onDevicesChanged.bind(this);
      this._errorMessageActive = !0;
      this._runPrefilghtTest(b);
  };
  Jk.prototype.show = function () {
      var a = this;
      this._blurHelp();
      this._createDialog();
      this._cameraPreview = new Sk(this, this._cameraPreviewWidth, this._cameraPreviewHeight, "ext-meeting-join-camera-toggle", "ext-meeting-join-camera-preview-container");
      this._micVolumePreview = new Tk(this, this._micVolumePreviewWidth, this._micVolumePreviewHeight, "ext-meeting-join-mic-toggle", "ext-meeting-join-mic-volume-container");
      this._errorMessageGenerator = new Pk("ext-meeting-join-first-error", "ext-meeting-join-second-error", this._micVolumePreview, this._cameraPreview);
      this._setupDevicesSelection();
      this._checkPermissions()
          .then(function () {
              a._runPreviewMode(!1);
              a._createMediaTracksSeparately(Lk, Kk, function () {
                  return a._onMediaInitialized();
              });
          })
          .catch(function (b) {
              void 0 !== b && WALK.log("Error checking audio/video devices permissions: " + b.name + ": " + b.message);
              a._runTestNeededMode();
          });
  };
  Jk.prototype._checkPermissions = function () {
      return new Promise(function (a, b) {
          return navigator.mediaDevices
              .enumerateDevices()
              .then(function (c) {
                  var d = c.filter(function (a) {
                      return "audioinput" === a.kind && "" !== a.deviceId && "" !== a.label;
                  });
                  c = c.filter(function (a) {
                      return "videoinput" === a.kind && "" !== a.deviceId && "" !== a.label;
                  });
                  0 < d.length || 0 < c.length ? a() : b();
              })
              .catch(function (a) {
                  b(a);
              });
      });
  };
  Jk.prototype._setupDevicesSelection = function () {
      var a = this;
      Ak.addChangeHandler("ext-meeting-join-select-camera", function (b) {
          a._cameraPreview.restartTrack({ name: "camera", deviceId: { exact: b.currentTarget.value } });
      });
      Ak.addChangeHandler("ext-meeting-join-select-microphone", function (b) {
          a._micVolumePreview.restartTrack({ name: "mic", deviceId: { exact: b.currentTarget.value } });
      });
      navigator.mediaDevices.addEventListener("devicechange", this._onDevicesChangedBound);
  };
  Jk.prototype._onDevicesChanged = function () {
      if (this._joinMode) {
          var a = this._cameraPreview.device.error,
              b = this._micVolumePreview.device.error;
          a || b ? this._createMediaTracksSeparately(a ? Lk : null, b ? Kk : null) : this._fillDevicesSelectControls();
      }
  };
  Jk.prototype._fillDevicesSelectControls = function () {
      var a = this;
      navigator.mediaDevices.enumerateDevices().then(function (b) {
          a._cameraPreview.updateTrackDeviceId(b);
          a._micVolumePreview.updateTrackDeviceId(b);
          var c = b.filter(function (a) {
              return "audioinput" === a.kind;
          });
          a._fillDevicesSelectControl(c, "ext-meeting-join-select-microphone-container", "ext-meeting-join-select-microphone", a._micVolumePreview.device.getId());
          b = b.filter(function (a) {
              return "videoinput" === a.kind;
          });
          a._fillDevicesSelectControl(b, "ext-meeting-join-select-camera-container", "ext-meeting-join-select-camera", a._cameraPreview.device.getId());
      });
  };
  Jk.prototype._fillDevicesSelectControl = function (a, b, c, d) {
      b = document.getElementById(b);
      var e = document.getElementById(c);
      Ak.setVisibility(b, 1 < a.length);
      Ak.removeChildren(e);
      1 < a.length &&
          (a.forEach(function (a) {
              var b = document.createElement("option");
              b.value = "" + a.deviceId;
              WALK.setTextContent(b, "" + a.label);
              e.appendChild(b);
          }),
          (e.value = d));
  };
  Jk.prototype._createDialog = function () {
      var a = this;
      this._dialog = new Ak.UiPopup(
          '\n        <h3 class="ext-meeting-dialog-title">Join 3D meeting</h3>\n        <div class="ext-meeting-join-row">\n          <div id="ext-meeting-join-name-label">\n            Name:\n          </div>\n          <input type="text" id="ext-meeting-join-name"\n                 class="ext-meeting-join-input"\n                 autocomplete="off">\n          </input>\n        </div>\n        <div class="ext-meeting-join-row">\n          <div class="ext-meeting-join-main-container">\n            <div id="ext-meeting-join-error-container"\n                 class="absolute-vertical-center">\n              <div id="ext-meeting-join-first-error"></div>\n              <div id="ext-meeting-join-second-error"></div>\n            </div>\n            <div id="ext-meeting-join-camera-preview-container"></div>\n            <div id="ext-meeting-join-mic-volume-container"></div>\n            <div id="ext-meeting-join-preview-toggle-container"\n                 class="absolute-horizontal-center">\n              <button id="ext-meeting-join-mic-toggle" style="display: none"\n                      class="ext-meeting-button ext-meeting-button-highlight\n                            ext-meeting-join-device-button">\n                <span class="fa-microphone" style="display: none"></span>\n                <span class="fa-microphone-slash"></span>\n              </button>\n              <button id="ext-meeting-join-camera-toggle" style="display: none"\n                      class="ext-meeting-button ext-meeting-button-highlight\n                            ext-meeting-join-device-button">\n                <span class="fa-video" style="display: none"></span>\n                <span class="fa-video-slash"></span>\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class="ext-meeting-join-row">\n          <div id="ext-meeting-join-select-camera-container"\n               style="display: none">\n            Camera:\n            <select id="ext-meeting-join-select-camera"\n                    class="ext-meeting-join-input">\n            </select>\n          </div>\n          <div id="ext-meeting-join-select-microphone-container"\n               style="display: none">\n            Microphone:\n            <select id="ext-meeting-join-select-microphone"\n                    class="ext-meeting-join-input">\n            </select>\n          </div>\n        </div>\n        <div id="ext-meeting-join-network-error-container" style="display: none">\n          <div>Network issues detected.</div>\n          <div>\n            <a href="https://networktest.twilio.com/" style="color: white" target="_blank">\n              Diagnose your connection.\n            </a>\n          </div>\n        </div>\n        <div id="ext-meeting-join-button-container"\n             class="ext-meeting-join-row">\n          <button id="ext-meeting-join-button"\n                  class="ext-meeting-button ext-meeting-dialog-buttons">\n                  Join\n          </button>\n        </div>\n        <div class="ext-meeting-join-footer">\n          By joining, you agree to the\n          <span id="terms-of-service-link" class="ext-meeting-terms-link"><u>\n            Terms of Service </u></span> and\n          <span id="privacy-policy-link" class="ext-meeting-terms-link"><u>\n            Privacy Policy</u></span>.\n        </div>\n      '
      );
      this._dialog.showDismiss = !1;
      this._dialog.foremost = !0;
      this._dialog.open();
      document.getElementById("terms-of-service-link").onclick = function () {
          a._dialog.hide();
          Ak.showIframePopup("The 3D meeting infrastructure is provided by Actif3D under the following Terms of Service", "https://www.shapespark.com/terms#in-viewer", function () {
              return a._dialog.unhide();
          });
      };
      document.getElementById("privacy-policy-link").onclick = function () {
          a._dialog.hide();
          Ak.showIframePopup("The 3D meeting infrastructure is provided by Actif3D under the following Privacy Policy", "https://www.shapespark.com/privacy#in-viewer", function () {
              return a._dialog.unhide();
          });
      };
      this._initializeDisplayName();
  };
  Jk.prototype._createMediaTracksSeparately = function (a, b, c) {
      function d() {
          e._fillDevicesSelectControls();
          e._errorMessageActive = !0;
          e.updateErrorMessage();
          c && c();
      }
      var e = this;
      this._errorMessageActive = !1;
      a && b
          ? this._cameraPreview
                .createTrack(a)
                .then(function () {
                    return e._micVolumePreview.createTrack(b);
                })
                .then(function () {
                    d();
                })
          : a
          ? this._cameraPreview.createTrack(a).then(function () {
                d();
            })
          : this._micVolumePreview.createTrack(b).then(function () {
                d();
            });
  };
  Jk.prototype._runTestNeededMode = function () {
      this._setTestNeededMode();
      this._cameraPreview.showInTestNeededMode();
      this._micVolumePreview.showInTestNeededMode();
  };
  Jk.prototype._runPreviewMode = function (a) {
      this._setPreviewMode(a);
      a ? (this._cameraPreview.setToggleButtonVisibility(!0), this._micVolumePreview.setToggleButtonVisibility(!0)) : (this._cameraPreview.showInPreviewMode(), this._micVolumePreview.showInPreviewMode());
  };
  Jk.prototype._onCreateMediaTracks = function (a, b, c) {
      var d = a.filter(function (a) {
          return "audio" === a.kind;
      });
      a = a.filter(function (a) {
          return "video" === a.kind;
      });
      this._errorMessageActive = !1;
      0 < d.length ? this._micVolumePreview.setTrack(d[0], b) : this._micVolumePreview.setTrack(null, b, { name: "Unknown error", message: "" });
      0 < a.length ? this._cameraPreview.setTrack(a[0], c) : this._cameraPreview.setTrack(null, c, { name: "Unknown error", message: "" });
      this._errorMessageActive = !0;
      this.updateErrorMessage();
      this._fillDevicesSelectControls();
      this._runPreviewMode(!0);
  };
  Jk.prototype._testCamera = function () {
      var a = this,
          b = { audio: WALK.cloneObject(Kk), video: WALK.cloneObject(Lk) };
      Twilio.Video.createLocalTracks(b)
          .then(function (b) {
              a._onCreateMediaTracks(b);
          })
          .catch(function () {
              a._createMediaTracksSeparately(Lk, Kk, function () {
                  return a._runPreviewMode(!0);
              });
          });
  };
  Jk.prototype._setTestNeededMode = function () {
      var a = this;
      this._joinMode = !1;
      var b = document.getElementById("ext-meeting-join-button-container");
      Ak.removeChildren(b);
      b.innerHTML = '\n        <button class="ext-meeting-button ext-meeting-dialog-buttons"\n                id="ext-meeting-test-button">\n          Test camera\n        </button>\n      ';
      addClickHandlerById("ext-meeting-test-button", function () {
          return a._testCamera();
      });
  };
  Jk.prototype._setPreviewMode = function (a) {
      var b = this;
      if (!this._joinMode) {
          this._joinMode = !0;
          var c = document.getElementById("ext-meeting-join-button-container");
          Ak.removeChildren(c);
          c.innerHTML = '\n        <button class="ext-meeting-button ext-meeting-dialog-buttons"\n                id="ext-meeting-join-button">\n          Join\n        </button>\n      ';
          this._mediaInitialized = !0;
          this._updateJoinButtonState();
          addClickHandlerById("ext-meeting-join-button", function () {
              return b._joinMeeting();
          });
          a || this._setMediaInitialized(!1);
      }
  };
  Jk.prototype._onMediaInitialized = function () {
      this._setMediaInitialized(!0);
  };
  Jk.prototype._updateJoinButtonState = function () {
      var a = document.getElementById("ext-meeting-join-button");
      a && (a.disabled = !(this._preflightTestDone && this._mediaInitialized));
  };
  Jk.prototype._setMediaInitialized = function (a) {
      this._mediaInitialized = a;
      this._updateJoinButtonState();
  };
  Jk.prototype._setPreflightTestDone = function () {
      this._preflightTestDone = !0;
      this._updateJoinButtonState();
  };
  Jk.prototype._initializeDisplayName = function () {
      var a = document.getElementById("ext-meeting-join-name"),
          b = localStorage.getItem("extMtgDisplayName");
      b && (a.value = b);
      a.focus();
      a.select();
  };
  Jk.prototype._checkDisplayName = function () {
      var a = document.getElementById("ext-meeting-join-name"),
          b = a.value.trim();
      if (b) return b;
      Ak.highlightInput(a);
  };
  Jk.prototype._blurHelp = function () {
      document.getElementById("help-and-primary-progress").classList.add("ui-blur");
  };
  Jk.prototype._unblurHelp = function () {
      var a = document.getElementById("help-and-primary-progress");
      a.classList.remove("ui-blur");
      a.classList.add("ui-unblur");
  };
  Jk.prototype._runPrefilghtTest = function (a) {
      var b = this;
      a = Twilio.Video.runPreflight(a, { duration: 2e3 });
      a.on("failed", function (a) {
          console.error("Twilio test error:", a);
          a = document.getElementById("ext-meeting-join-network-error-container");
          Ak.show(a);
          b._setPreflightTestDone();
      });
      a.on("completed", function () {
          b._setPreflightTestDone();
      });
  };
  Jk.prototype._joinMeeting = function () {
      var a = this._checkDisplayName();
      if (void 0 !== a) {
          localStorage.setItem("extMtgDisplayName", a);
          var b = this._micVolumePreview.device,
              c = this._cameraPreview.device;
          this._dispose();
          this._onJoinCallback(a, b, c);
      }
  };
  Jk.prototype.updateErrorMessage = function () {
      this._errorMessageActive && this._errorMessageGenerator.update();
  };
  Jk.prototype._dispose = function () {
      this._dialog.close();
      this._unblurHelp();
      navigator.mediaDevices.removeEventListener("devicechange", this._onDevicesChangedBound);
      this._cameraPreview.dispose();
      this._micVolumePreview.dispose();
      this._micVolumePreview = this._cameraPreview = this._dialog = null;
  };
  function Uk() {
      this._room = null;
      this._bars = [];
      this._crossLines = [];
      this._crossIsVisible = !1;
      this._updateBind = this._update.bind(this);
      this._qualityToBarIndex = [-1, 0, 0, 1, 2, 2];
      this._create();
  }
  Uk.prototype._create = function () {
      var a = document.getElementById("ext-meeting-quality-indicator-container");
      console.assert(null !== a, "Quality indicator container not found");
      var b = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      b.setAttribute("width", 13);
      b.setAttribute("height", 15);
      a.appendChild(b);
      for (a = 0; 3 > a; a++) {
          var c = 5 * (a + 1);
          this._addBar(b, 5 * a, 15 - c, 3, c);
      }
      this._addCrossLine(b, 2, 3, 11, 12);
      this._addCrossLine(b, 2, 12, 11, 3);
  };
  Uk.prototype._addBar = function (a, b, c, d, e) {
      var f = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      f.setAttribute("x", b);
      f.setAttribute("y", c);
      f.setAttribute("width", d);
      f.setAttribute("height", e);
      f.setAttribute("display", "none");
      a.appendChild(f);
      this._bars.push(f);
  };
  Uk.prototype._addCrossLine = function (a, b, c, d, e) {
      var f = document.createElementNS("http://www.w3.org/2000/svg", "line");
      f.setAttribute("x1", b);
      f.setAttribute("y1", c);
      f.setAttribute("x2", d);
      f.setAttribute("y2", e);
      f.setAttribute("stroke", "red");
      f.setAttribute("stroke-width", 2);
      f.setAttribute("display", "none");
      a.appendChild(f);
      this._crossLines.push(f);
  };
  Uk.prototype._hideBars = function () {
      this._bars.forEach(function (a) {
          a.setAttribute("display", "none");
      });
  };
  Uk.prototype._hideCross = function () {
      this._crossIsVisible &&
          (this._crossLines.forEach(function (a) {
              a.setAttribute("display", "none");
          }),
          (this._crossIsVisible = !1));
  };
  Uk.prototype._showBars = function () {
      this._bars.forEach(function (a) {
          a.setAttribute("display", "block");
      });
  };
  Uk.prototype._showCross = function () {
      this._crossIsVisible ||
          (this._crossLines.forEach(function (a) {
              a.setAttribute("display", "block");
          }),
          (this._crossIsVisible = !0));
  };
  Uk.prototype.onConnect = function (a) {
      console.assert(null === this._room);
      this._room = a;
      this._showBars();
      this._update(this._room.localParticipant.networkQualityLevel);
      a.localParticipant.on("networkQualityLevelChanged", this._updateBind);
  };
  Uk.prototype.onDisconnect = function () {
      console.assert(this._room);
      this._room.localParticipant.removeListener("networkQualityLevelChanged", this._updateBind);
      this._room = null;
      this._hideBars();
      this._hideCross();
  };
  Uk.prototype._getColor = function (a, b) {
      return a <= this._qualityToBarIndex[b] ? "white" : "dimgray";
  };
  Uk.prototype._update = function (a) {
      if (null !== a) {
          for (var b = 0; 3 > b; b++) {
              var c = this._getColor(b, a);
              this._bars[b].setAttribute("fill", c);
              this._bars[b].setAttribute("stroke", c);
          }
          0 === a ? this._showCross() : this._hideCross();
      }
  };
  function Vk() {
      function a() {
          var a = this;
          this._users = new Set();
          this._maxIntervalBetweenUpdates = 100;
          this._idleCallback = new WALK.DeferringExecutorInterval(function () {
              return a._execute();
          }, this._maxIntervalBetweenUpdates);
          WALK.getViewer().onBeforeRender(function () {
              return a._onBeforeRender();
          });
      }
      function b() {
          var a = window.location.hostname;
          return a.endsWith(".shapespark.com") ? "https://cloud" + a.substr(a.indexOf(".")) : a.endsWith(".shapespark.com.cn") ? "https://cloud.shapespark.com.cn" : WALK.DEVEL_MEETING_CLOUD_URL || "https://cloud.shapespark.com";
      }
      function c(a) {
          a = new Date(a);
          var b = new Date();
          return b.getDate() === a.getDate() && b.getMonth() === a.getMonth() && b.getFullYear() === a.getFullYear() ? a.toLocaleTimeString() : a.toLocaleDateString() + " " + a.toLocaleTimeString();
      }
      function d(a, b, c, d) {
          var e = document.createElement("li");
          e.classList.add("ext-meeting-list-entry");
          var f = e.appendChild(document.createElement("span"));
          f.classList.add("ext-meeting-list-name");
          f.innerText = a;
          f.style.color = c;
          d && (addClickHandler(e, d), (e.style.cursor = "pointer"));
          b && (e.appendChild(document.createElement("br")), (a = e.appendChild(document.createElement("small"))), (a.innerText = b), (a.style.color = "white"));
          return e;
      }
      function e(a, b, c) {
          return { color: "#0775e8", icon: "edit", opacity: 1, position: [a, b, c], radius: 0.07, type: "sphere" };
      }
      function f(a, b, c, d) {
          d = void 0 === d ? !0 : d;
          var e = new Ak.UiPopup(
              "<div>\n         " +
                  a +
                  "\n       </div>\n       <div class ='ext-meeting-dialog-buttons'>\n         <button class='ext-meeting-dialog-ok ext-meeting-button'>\n           " +
                  b +
                  "\n         </button>\n         " +
                  (d ? "<button class='ext-meeting-dialog-cancel ext-meeting-button'>\n         Cancel\n        </button>" : "") +
                  "\n       </div>"
          );
          e.showDismiss = !1;
          e.open();
          d &&
              (e.getElementsByClassName("ext-meeting-dialog-cancel")[0].onclick = function () {
                  return e.dismiss();
              });
          e.getElementsByClassName("ext-meeting-dialog-ok")[0].onclick = function () {
              e.close();
              c();
          };
      }
      function g(a, b) {
          b = b.attach();
          a = a.createTextureFromHtmlVideo(b);
          a.play();
          return a;
      }
      function h(a) {
          a.detach().forEach(function (a) {
              return a.remove();
          });
      }
      function l(a) {
          return a && a.isStarted && a.isEnabled && !a.isStopped;
      }
      function m(a, b, c) {
          this._viewer = a;
          this._uuid = b;
          a = parseInt(b.substring(2));
          this._color = WALK.AVATAR_COLORS[a % WALK.AVATAR_COLORS.length];
          this._twilioParticipant = this._avatar = this._displayName = null;
          this._lastRenderedPosition = [];
          this._lastRenderedPositionLength = 0;
          this._audioTrack = this._screenTrack = this._cameraTrack = this._micTrack = this._dataTrack = null;
          this._noSoundThreshold = 80;
          this._soundVolumeUpdatesScheduler = c;
          this._volumeVisualizer = new Ek.VolumeVisualizer(20, 3, this._noSoundThreshold, 3);
          this._volumeMeter = null;
      }
      function n(a, b, c, d, e, f) {
          m.call(this, a, b, d, !0);
          this._displayName = c;
          this._setUpAvatar();
          this._avatar.hideBody();
          this._isPublishingTracksDuringConnecting = !1;
          this._dataTrack = new Twilio.Video.LocalDataTrack({ name: "data", maxPacketLifeTime: 1e3 });
          this._isCreatingCameraTrack = this._isCreatingMicTrack = !1;
          this._micDevice = e;
          this._cameraDevice = f;
          this._micTrack = this._micDevice.track;
          null !== this._micTrack && this._subscribeToMicEvents();
          this._updateSoundMeasurementState();
          this._cameraTrack = this._cameraDevice.track;
          null !== this._cameraTrack && (console.assert(this._cameraDevice.active, "Got inactive camera track from MeetingStarter"), this._subscribeToCameraEvents());
          this._lastPosition = null;
          this._positionMessage = [b, c, null];
          this._onCameraTrackStateChanged = this._onMicTrackStateChanged = this._resendInterval = null;
      }
      function p(a, b, c, d) {
          m.call(this, a, b, c, !1);
          this._onUiRefreshNeeded = d;
          this._cameraTrackDisabledBound = this._cameraTrackEnabledBound = this._micTrackStateChangedBound = null;
          this._trackSubscribedBound = this._trackSubscribed.bind(this);
          this._trackUnsubscribedBound = this._trackUnsubscribed.bind(this);
          this._disposed = !1;
      }
      function r(a, b, c, d, e, f) {
          var g = new PubNub({ publishKey: b.publishKey, subscribeKey: b.subscribeKey, authKey: b.authKey, uuid: a.uuid, ssl: !0 }),
              h = b.channel;
          g.subscribe({ channels: [h], withPresence: !0 });
          g.addListener({
              message: function (a) {
                  WALK.log("listener received message", a);
                  "SceneState" === a.message.type && e(a.message.state);
              },
              presence: function (b) {
                  b.uuid !== a.uuid && (WALK.log("listener presence event", b), "join" === b.action ? c(b.uuid) : "leave" === b.action && d(b.uuid));
              },
              status: function (a) {
                  ("PNAccessDeniedCategory" !== a.category && "PNNetworkIssuesCategory" !== a.category && "PNNetworkDownCategory" !== a.category && "PNTimeoutCategory" !== a.category) || f(a.category);
              },
          });
          g.hereNow({ channels: [h], includeUUIDs: !0, includeState: !0 }, function (b, d) {
              WALK.log("herenow", b, d);
              d.channels[h].occupants.forEach(function (b) {
                  b.uuid !== a.uuid && c(b.uuid);
              });
          });
          this.dispose = function () {
              g.unsubscribeAll();
          };
      }
      function q(a, b, c, d, e, f, g, h, l, m) {
          function n(a) {
              var b = a.identity.match(/^u-\d+/);
              b = b && b[0];
              return b ? b : (WALK.warn("Unknown participant", a.identity), null);
          }
          function p(a) {
              WALK.log('Participant "%s" connected', a.identity);
              var b = n(a);
              b && c(b, a);
          }
          function q(a) {
              WALK.log('Participant "%s" disconnected', a.identity);
              var b = n(a);
              b && d(b, a);
          }
          function r(a) {
              a = null !== a ? n(a) : null;
              m(a);
          }
          var u = b.avToken,
              v = b.channel,
              w = ["NotAllowedError", "NotFoundError", "NotReadableError", "OverconstrainedError", "TypeError"],
              H = null,
              x = !1,
              y = 0,
              z = WALK.urlHashContains("av-turn");
          this.isConnected = function () {
              return x;
          };
          this.disconnect = function () {
              x = !1;
              H && (H.disconnect(), l(), (H = null));
              a.disconnectedFromTwilio();
          };
          this.dispose = function () {
              this.disconnect();
          };
          this.connect = function () {
              console.assert(!x);
              x = !0;
              a.startedConnectingToTwilio();
              WALK.log('Connecting to room "%s"', v);
              Twilio.Video.connect(u, { name: v, tracks: a.getAllTracks(), preferredVideoCodecs: "auto", iceTransportPolicy: z ? "relay" : "all", region: I || "gll", networkQuality: { local: 1, remote: 1 }, dominantSpeaker: !0 })
                  .then(function (b) {
                      H = b;
                      WALK.log("Connected to room");
                      H.participants.forEach(p);
                      H.on("participantConnected", p);
                      H.on("participantDisconnected", q);
                      H.on("dominantSpeakerChanged", r);
                      H.on("reconnecting", function () {
                          y += 1;
                      });
                      H.on("reconnected", function () {
                          y = 0;
                      });
                      H.once("disconnected", function (b) {
                          x && (l(), H.participants.forEach(q), a.disconnectedFromTwilio(), 0 < y ? f("TReconnectionDisconnected" + (b.code ? " " + b.code : "")) : g());
                      });
                      a.connectedToTwilio(H.localParticipant);
                      h(H);
                  })
                  .catch(function (b) {
                      a.failedToConnectToTwilio();
                      w.includes(b.name) ? e(b) : f("T" + b.code);
                  });
          };
      }
      function u(a) {
          function b(a, b) {
              var c = document.createElement("span");
              c.classList.add("ext-meeting-who-list-name");
              c.innerText = a;
              c.style.color = b;
              return c;
          }
          function c(a) {
              var b = document.createElement("span");
              b.classList.add("ext-meeting-who-list-mic-indicator");
              a ? b.classList.add("fa-microphone") : b.classList.add("fa-microphone-slash");
              return b;
          }
          function d() {
              var a = document.createElement("span");
              a.classList.add("ext-meeting-who-list-mic-indicator");
              a.classList.add("fa-file-audio-o");
              return a;
          }
          function e(a) {
              console.assert(null !== a.volumeVisualizer, "volumeVisualizer not initialized");
              var b = document.createElement("span");
              a.isSoundMeasurementActive() ? (b.innerHTML = a.volumeVisualizer.getHTML()) : (b.innerHTML = a.volumeVisualizer.getEmptyHTML());
              return b;
          }
          function f() {
              var f = document.createElement("li");
              f.classList.add("ext-meeting-who-list-entry");
              f.appendChild(e(a));
              f.appendChild(b(a.displayName + " (me)", a.color));
              var g = l(a.micTrack);
              f.appendChild(c(g));
              a.audioTrack && f.appendChild(d(g));
              return f;
          }
          var g = document.getElementById("ext-meeting-who-list-folder"),
              h = document.getElementById("ext-meeting-status");
          addClickHandlerFocusWalkCanvas(h);
          var m = document.getElementById("ext-meeting-who-list"),
              n = new WALK.Timeout(1e3),
              p = new WALK.Timeout(3e3),
              q = new WALK.Timeout(1e3, function () {
                  m.style.overflowY = "auto";
              });
          m.addEventListener("scroll", function () {
              n.isRunning() || p.start();
          });
          var r = !0;
          addClickHandler(g, function () {
              q.isRunning() ||
                  (r
                      ? ((r = !1), (m.style.maxHeight = 0), (m.style.margin = 0), (m.style.overflowY = "hidden"), (g.children[0].style.transform = "rotate(180deg)"))
                      : ((g.children[0].style.transform = ""), (m.style.maxHeight = ""), (m.style.margin = ""), q.start(), (r = !0)));
          });
          WALK.DETECTOR.firefox && (m.style.paddingRight = "16px");
          var u = null,
              v = new Map();
          this.onDominantSpeakerChanged = function (a) {
              u && a !== u && (u = null);
              if (!p.isRunning() && null !== a) {
                  var b = v.get(a);
                  b ? (b.scrollIntoView({ behavior: "smooth", block: "nearest" }), n.start()) : (u = a);
              }
          };
          this.update = function (a) {
              v.clear();
              Ak.removeChildren(m);
              m.appendChild(f());
              a = _.makeIterator(Object.values(a));
              for (var g = a.next(); !g.done; g = a.next())
                  if (((g = g.value), g.hasDisplayName)) {
                      var h = g,
                          l = document.createElement("li");
                      l.classList.add("ext-meeting-who-list-entry");
                      l.appendChild(e(h));
                      var n = b(h.displayName, h.color);
                      n.style.cursor = "pointer";
                      l.appendChild(n);
                      var p = h.micTrack && h.micTrack.isEnabled;
                      l.appendChild(c(p));
                      h.audioTrack && l.appendChild(d(p));
                      addClickHandler(n, h.seeAvatar.bind(h));
                      h = l;
                      m.appendChild(h);
                      v.set(g, h);
                  }
              u && v.has(u) && (this.onDominantSpeakerChanged(u), (u = null));
          };
          this.show = function () {
              Ak.show(h);
          };
          this.hide = function () {
              Ak.hide(h);
          };
          this.update([]);
          this.show();
      }
      function v(a) {
          return (
              "\n      <div>\n        <textarea id='ext-meeting-note-text'\n          class='ext-meeeting-note-edit'\n          placeholder='" +
              a +
              "'></textarea>\n      </div>\n      <button id='ext-meeting-note-publish'\n        class='ext-meeting-button ext-meeting-dialog-buttons'>\n        Publish\n      </button>\n    "
          );
      }
      function w(a, b) {
          function c(a) {
              var b = d;
              null !== a.location && (b += ":" + a.location.join(":"));
              return b;
          }
          var d = "extMtg:" + a + ":" + b + ":";
          this.getTimeStampOfLastReadNoteAtLocation = function (a) {
              return localStorage.getItem(c(a)) || -1;
          };
          this.isNoteRead = function (a) {
              return a.ts <= this.getTimeStampOfLastReadNoteAtLocation(a) || a.author === b;
          };
          this.markAllNotesAtLocationAsRead = function (a) {
              localStorage.setItem(c(a), a.ts);
          };
      }
      function y(a, b, f, g, h, l) {
          function m(a) {
              if (a === b.displayName) return b.color;
              for (var c = _.makeIterator(Object.values(f)), d = c.next(); !d.done; d = c.next()) if (((d = d.value), d.displayName === a)) return d.color;
              return "#ffffff";
          }
          function n() {
              w = !1;
              g.show();
              F.style.cursor = "default";
              H.dismiss();
              x.close();
          }
          function p(a) {
              return u.filter(function (b) {
                  b = b.location;
                  var c = a.location;
                  b = null === b || null === c ? !1 : WALK.deepEqual(b, c);
                  return b;
              });
          }
          function q(f, g) {
              function n(d, e) {
                  if (!w) {
                      H.classList.remove("ext-meeting-note-list-unread");
                      H.classList.add("ext-meeting-note-list-selected");
                      e && H.scrollIntoView();
                      d.material.highlightMix = 0.7;
                      a.requestFrame();
                      var g = "";
                      e = new Map();
                      for (var n = h.getTimeStampOfLastReadNoteAtLocation(f), q = null, r = _.makeIterator(p(f)), u = r.next(); !u.done; u = r.next()) {
                          q = u.value;
                          u = "ext-meeting-note-text" + q.id;
                          var x = "ext-meeting-note-author" + q.id,
                              A = "ext-meeting-note-entry";
                          q.ts > n && q.author !== b.displayName && (A += " ext-meeting-note-unread");
                          g +=
                              "<div class='" +
                              A +
                              "'>\n               <strong id='" +
                              x +
                              "'\n                   style='color: " +
                              m(q.author) +
                              "'>\n               </strong> <span>" +
                              c(q.ts) +
                              "</span>\n               <div id='" +
                              u +
                              "'>\n               </div>\n             </div>";
                          e.set(u, q.text);
                          e.set(x, q.author);
                      }
                      g += v("Type your response");
                      y
                          ? y.update(g)
                          : ((y = new Ak.UiPopup(g)),
                            (y.position = Ak.UiPopup.TOP),
                            (y.onClose = function () {
                                H.classList.remove("ext-meeting-note-list-selected");
                                d.material.highlightMix = 0;
                                a.requestFrame();
                                y = null;
                            }));
                      h.markAllNotesAtLocationAsRead(q);
                      z = f.location;
                      y.open();
                      e.forEach(function (a, b) {
                          document.getElementById(b).innerText = a;
                      });
                      addClickHandlerById("ext-meeting-note-publish", function () {
                          var a = document.getElementById("ext-meeting-note-text"),
                              b = a.value.trim();
                          if (b) {
                              var c = d.position;
                              l(b, [c.x, c.y, c.z]);
                              a.value = "";
                          } else Ak.highlightInput(a);
                      });
                  }
              }
              var q = a.addAnchor(e(f.location[0], f.location[1], f.location[2], "#0775e8"), function (a) {
                  return n(a, !0);
              });
              q.material.highlight = J;
              q.material.setUniforms();
              r.push(q);
              var u = f.author;
              var H = d(u, c(f.ts), m(u), function () {
                  a.seeItem(q);
                  n(q, !1);
              });
              h.isNoteRead(f) || H.classList.add("ext-meeting-note-list-unread");
              g.appendChild(H);
              null !== y && WALK.deepEqual(z, f.location) && n(q, !0);
          }
          var r = [],
              u = [],
              w = !1,
              H = new Ak.UiPopup("\n      <h2>\n        Click a place to leave a note there.\n      </h2>");
          H.position = Ak.UiPopup.TOP;
          var x = new Ak.UiPopup(v("Type your note"));
          x.position = Ak.UiPopup.TOP;
          var y = null,
              z = null;
          addClickHandlerById("ext-meeting-add-note", function () {
              w = !0;
              g.hide();
              F.style.cursor = "pointer";
              y && y.close();
              a.onNodeTypeClicked(D);
              H.onDismiss = function () {
                  a.removeOnNodeTypeClicked(D);
                  n();
              };
              H.open();
          });
          var A = new THREE.Vector3();
          var D = function (b, c) {
              F.style.cursor = "default";
              A.copy(c);
              qe(A, a.getCameraPosition(), 0.1);
              a.removeOnNodeTypeClicked(D);
              var d = a.addAnchor(e(A.x, A.y, A.z));
              d.material.highlight = J;
              d.material.setUniforms();
              d.material.highlightMix = 0.7;
              H.close();
              x.onClose = function () {
                  a.removeAnchor(d);
                  n();
              };
              x.open();
              addClickHandlerById("ext-meeting-note-publish", function () {
                  var a = document.getElementById("ext-meeting-note-text"),
                      b = a.value.trim();
                  b ? l(b, [A.x, A.y, A.z]) : Ak.highlightInput(a);
              });
              return !0;
          };
          a.onApiUserStateChanged("MeetingNotes", function (b, c) {
              console.assert("MeetingNotes" === b);
              u = c.sort(function (a, b) {
                  var c = h.isNoteRead(a),
                      d = h.isNoteRead(b);
                  return c !== d ? (c ? -1 : 1) : a.ts - b.ts;
              });
              n();
              b = _.makeIterator(r);
              for (c = b.next(); !c.done; c = b.next()) a.removeAnchor(c.value);
              r.length = 0;
              b = document.getElementById("ext-meeting-note-list");
              Ak.removeChildren(b);
              c = new Map();
              for (var d = u.length - 1; 0 <= d; d--) {
                  var e = u[d];
                  if (null !== e.location) {
                      var f = e.location.join("/");
                      c.has(f) || (c.set(f, d), q(e, b), b.lastChild.scrollIntoView());
                  }
              }
          });
      }
      function z(a, b) {
          function c() {
              h = g = null;
              f.pointerX = null;
              f.pointerY = null;
              f.pointerZ = null;
              a._enableControls();
          }
          function d() {
              f.isEnabled() ? ((F.style.cursor = "default"), c(), m.disable(), l.close(), b.show()) : ((F.style.cursor = "pointer"), l.open(), m.enable(), (l.onDismiss = d), b.hide());
          }
          var e = this,
              f = this,
              g = null,
              h = null,
              l = new Ak.UiPopup("\n      <h2>\n        Point a place by clicking.\n      </h2>");
          l.position = Ak.UiPopup.TOP;
          var m = a._createPointerEventHelper(0);
          m.disable();
          this.pointerZ = this.pointerY = this.pointerX = null;
          this.isEnabled = function () {
              return m.isEnabled();
          };
          this.showPointer = function () {
              return null !== this.pointerX;
          };
          a.onBeforeRender(function () {
              if (null !== g) {
                  var b = a._findIntersectionAtPosition(g, h);
                  Infinity !== b.distance && ((e.pointerX = b.point.x), (e.pointerY = b.point.y), (e.pointerZ = b.point.z));
              }
          });
          m.callbacks.onPointerDown = function (b, c) {
              g = b;
              h = c;
              a._disableControls();
              a.requestFrame();
              return !0;
          };
          m.callbacks.onPointerMove = function (b, c) {
              if (null === g) return !1;
              g = b;
              h = c;
              a.requestFrame();
              return !0;
          };
          m.callbacks.onPointerUp = function () {
              c();
              a.requestFrame();
              return !0;
          };
          addClickHandlerById("ext-meeting-pointer", function () {
              d();
          });
      }
      function x() {
          var a = [0, 0, 0, 0, 0],
              b = [0, 0, 0, 0, 0, 0, 0, 0],
              c = null,
              d = !1;
          this.newUpdateWithPointer = function () {
              d = !1;
              c !== b && ((d = !0), (c = b));
          };
          this.newUpdateNoPointer = function () {
              d = !1;
              c !== a && ((d = !0), (c = a));
          };
          this.set = function (a, b) {
              c[a] !== b && ((c[a] = b), (d = !0));
          };
          this.getFilledArray = function () {
              return d ? c : null;
          };
      }
      function A() {
          function a(a) {
              Ak.setVisibility(a.children[0], !0);
              Ak.setVisibility(a.children[1], !1);
          }
          function b(a) {
              Ak.setVisibility(a.children[0], !1);
              Ak.setVisibility(a.children[1], !0);
          }
          var c = document.getElementById("ext-meeting-mic-toggle"),
              d = document.getElementById("ext-meeting-camera-toggle"),
              e = document.getElementById("ext-meeting-camera-preview");
          addClickHandlerFocusWalkCanvas(e);
          var f = null;
          this.refreshMicControls = function (d) {
              l(d) ? (Ak.setButtonHighlight(c, !1), a(c)) : (Ak.setButtonHighlight(c, !0), b(c));
          };
          this.refreshCameraControls = function (c) {
              l(c) ? (f || ((f = c.attach()), e.appendChild(f)), Ak.show(e), Ak.setButtonHighlight(d, !1), a(d)) : (f && (c.detach(), f.remove(), (f = null)), Ak.hide(e), Ak.setButtonHighlight(d, !0), b(d));
          };
          this.setToggleButtonHandlers = function (a, b) {
              addClickHandler(c, a);
              addClickHandler(d, b);
          };
      }
      function B(c, d, e, g) {
          function h(a) {
              za.error("Connection lost. Reload the page to rejoin the meeting.<br/>(Code:" + a + ")");
          }
          function l(a, d) {
              a = { meetingKey: W, author: c, text: a, location: d };
              WALK.ajaxPost(
                  b() + "/meetings/" + ia + "/notes",
                  "application/json",
                  JSON.stringify(a),
                  function () {
                      return WALK.log("Note added.");
                  },
                  function () {
                      return WALK.log("Failed to add note");
                  }
              );
          }
          function m() {
              ka.update(I);
          }
          function v(a) {
              var b = I[a];
              b || ((b = new p(F, a, L, m)), (I[a] = b));
              return b;
          }
          function H(a) {
              a in I && (I[a].dispose(), delete I[a], ka.update(I), Oa.isConnected() && 0 === Object.keys(I).length && Oa.disconnect());
          }
          function B(a) {
              Ga = a;
              for (var b = _.makeIterator(Object.keys(a)), c = b.next(); !c.done; c = b.next()) (c = c.value), F.apiUserChangeState(c, a[c]);
          }
          function C() {
              J.dispose();
              Oa.dispose();
              jb.dispose();
              for (var a in I) I.hasOwnProperty(a) && I[a].dispose();
              L.dispose();
          }
          function M() {
              Fa.showPointer() ? (N.newUpdateWithPointer(), N.set(5, WALK.round(Fa.pointerX, 3)), N.set(6, WALK.round(Fa.pointerY, 3)), N.set(7, WALK.round(Fa.pointerZ, 3))) : N.newUpdateNoPointer();
              var a = F.getCameraPosition(),
                  b = F.getCameraRotation();
              N.set(0, WALK.round(a.x, 3));
              N.set(1, WALK.round(a.y, 3));
              N.set(2, WALK.round(a.z, 3));
              N.set(3, WALK.round(b.yaw, 1));
              N.set(4, WALK.round(b.pitch, 1));
              (a = N.getFilledArray()) && J.updatePosition(a);
          }
          function G() {
              za.error("The meeting has ended. Maximum duration of meeting reached.)");
              C();
              ka.update({});
          }
          var F = WALK.getViewer(),
              N = new x(),
              L = new a();
          this.myUuid = g.uuid;
          var J = new n(F, this.myUuid, c, L, d, e),
              I = {},
              ka = new u(J, F),
              ma = new A(),
              ia = g.id,
              W = g.meetingKey,
              Ga;
          ma.setToggleButtonHandlers(
              function () {
                  J.toggleMic();
              },
              function () {
                  J.toggleCamera();
              }
          );
          J.setAvTracksStateHandlers(
              function (a) {
                  ma.refreshMicControls(a);
                  ka.update(I);
              },
              function (a) {
                  ma.refreshCameraControls(a);
              }
          );
          ma.refreshMicControls(J.micTrack);
          ma.refreshCameraControls(J.cameraTrack);
          var Fa = new z(F, ka);
          WALK.urlHashContains("meeting-notes") && (Ak.show(document.getElementById("ext-meeting-notes-preview")), y(F, J, I, ka, new w(ia, c), l));
          null !== g.sceneState && B(g.sceneState);
          var jb = new r(
              J,
              g,
              function (a) {
                  v(a);
                  Oa.isConnected() || Oa.connect();
              },
              H,
              B,
              h
          );
          d = new Uk();
          var Oa = new q(
              J,
              g,
              function (a, b) {
                  v(a).connectedToTwilio(b);
              },
              function (a) {
                  H(a);
              },
              function (a) {
                  za.info("Failed to acquire media.<br/>" + a.message, 6e3);
              },
              h,
              function () {
                  za.error("The meeting has been ended.");
              },
              d.onConnect.bind(d),
              d.onDisconnect.bind(d),
              function (a) {
                  ka.onDominantSpeakerChanged(a in I ? I[a] : null);
              }
          );
          addClickHandlerById("ext-meeting-leave", function () {
              f("Do you want to leave this meeting?", "Leave meeting", function () {
                  C();
                  document.body.innerHTML = '<div id="cover-image"></div>';
                  f(
                      "You have left the meeting.",
                      "Join again",
                      function () {
                          location.reload();
                      },
                      !1
                  );
              });
          });
          F.onBeforeRender(M);
          M();
          F.onApiUserStateChanged(function (a, c) {
              (Ga && WALK.deepEqual(c, Ga[a])) ||
                  ((a = { meetingKey: W, key: a, state: c }),
                  WALK.ajaxPost(
                      b() + "/meetings/" + ia + "/scene-state",
                      "application/json",
                      JSON.stringify(a),
                      function () {
                          return WALK.log("State updated.");
                      },
                      function () {
                          return WALK.log("Failed to update state.");
                      }
                  ));
          });
          this.startShareScreen = function (a, b, c) {
              WALK.log("Screen share start requested");
              J.startShareScreen(a, b, c, function () {
                  return ka.update(I);
              });
          };
          this.stopShareScreen = function () {
              WALK.log("Screen share stop requested");
              J.stopShareScreen();
          };
          null !== g.remainingTimeSeconds && setTimeout(G, 1e3 * (g.remainingTimeSeconds + 5));
      }
      function L(a) {
          new Jk(function (b, c, d) {
              b = new B(b, c, d, a);
              WALK.getViewer()._meetingJoined(b);
          }, a.avToken).show();
      }
      function C(a, b) {
          function c() {
              var b = a.split("/").slice(0, -1).join("/") + "/";
              fetch(a)
                  .then(function (a) {
                      return a.json();
                  })
                  .then(function (a) {
                      d(b, a);
                  })
                  .catch(function () {
                      return za.error("Failed to load the meeting");
                  });
          }
          function d(a, c) {
              fetch(a + c.model)
                  .then(function (a) {
                      return a.text();
                  })
                  .then(function (d) {
                      var e = d,
                          f = /^[og]\s*(.+)?/,
                          g = /^mtllib /,
                          h = /^usemtl /,
                          l = /^usemap /;
                      d = new nh();
                      -1 !== e.indexOf("\r\n") && (e = e.replace(/\r\n/g, "\n"));
                      -1 !== e.indexOf("\\\n") && (e = e.replace(/\\\n/g, ""));
                      e = e.split("\n");
                      var m;
                      e = _.makeIterator(e);
                      for (m = e.next(); !m.done; m = e.next()) {
                          var n = m.value;
                          if (0 !== n.length && "\x00" !== n) {
                              var p = n.charAt(0);
                              if ("#" !== p)
                                  if ("v" === p)
                                      switch (((m = n.split(/\s+/)), m[0])) {
                                          case "v":
                                              d.vertices.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
                                              7 <= m.length && console.assert(!1, "obj with vertex colors is not supported");
                                              break;
                                          case "vn":
                                              d.normals.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
                                              break;
                                          case "vt":
                                              d.uvs.push(parseFloat(m[1]), parseFloat(m[2]));
                                      }
                                  else if ("f" === p) {
                                      n = n.substr(1).trim().split(/\s+/);
                                      m = [];
                                      n = _.makeIterator(n);
                                      for (p = n.next(); !p.done; p = n.next()) (p = p.value), 0 < p.length && ((p = p.split("/")), m.push(p));
                                      n = m[0];
                                      p = 1;
                                      for (var q = m.length - 1; p < q; p++) {
                                          var r = m[p],
                                              u = m[p + 1];
                                          d.addFace(oh(n[0]), oh(r[0]), oh(u[0]), oh(n[1]), oh(r[1]), oh(u[1]), oh(n[2]), oh(r[2]), oh(u[2]));
                                      }
                                  } else
                                      "l" === p
                                          ? console.assert(!1, "line geometry is not supported")
                                          : "p" === p
                                          ? console.assert(!1, "obj point geometry not supported")
                                          : null !== (m = f.exec(n))
                                          ? ((m = (" " + m[0].substr(1).trim()).substr(1)), d.startObject(m))
                                          : h.test(n) || g.test(n) || l.test(n) || ("s" !== p && console.warn('OBJLoader: Unexpected line: "' + n + '"'));
                          }
                      }
                      f = new Map();
                      d = _.makeIterator(d.objects);
                      for (g = d.next(); !g.done; g = d.next())
                          (g = g.value),
                              0 !== g.vertices.length &&
                                  ((h = new THREE.BufferGeometry()),
                                  h.addAttribute("position", new WALK.BufferAttribute(new Float32Array(g.vertices), 3)),
                                  0 < g.normals.length && h.addAttribute("normal", new WALK.BufferAttribute(new Float32Array(g.normals), 3)),
                                  !0 === g.hasUvs && h.addAttribute("uv", new WALK.BufferAttribute(new Float32Array(g.uvs), 2)),
                                  h.convertNormalsToSpherical(),
                                  h.computeBoundingBox(),
                                  h.computeBoundingSphere(),
                                  f.set(g.name, h));
                      WALK.setAvatarModel(a, c, f);
                      b();
                  })
                  .catch(function () {
                      return za.error("Failed to load the meeting");
                  });
          }
          WALK.getViewer().onSceneLoadComplete(function () {
              void 0 === a && (a = WALK.getViewerAssetUrl("3dassets/avatar.json"));
              WALK.AVATAR_JSON_URL_OVERRIDE && (a = WALK.AVATAR_JSON_URL_OVERRIDE);
              c();
          });
      }
      WALK.FONT_FAMILIES_TO_LOAD.push("FontAwesomeSolid");
      WALK.FONT_FAMILIES_TO_LOAD.push("FontAwesomeRegular");
      var J = new THREE.Color(0, 1, 0),
          F = document.getElementById("walk-canvas"),
          I = WALK.urlHashGetArgument("av-region");
      m.prototype = {
          constructor: m,
          _setUpAvatar: function () {
              console.assert(this._displayName, "Display name must be known to set up the avatar");
              WALK.log("Setting up avatar for %s:%s", this._uuid, this._displayName);
              this._avatar = this._viewer.addAvatar(this._uuid, { displayName: this._displayName, color: this._color });
          },
          get uuid() {
              return this._uuid;
          },
          get color() {
              return this._color;
          },
          get displayName() {
              return this._displayName;
          },
          get hasDisplayName() {
              return null !== this._displayName;
          },
          _positionChanged: function (a) {
              if (this._lastRenderedPositionLength !== a.length) return !0;
              for (var b = 0; b < a.length; b++) if (1e-5 < Math.abs(this._lastRenderedPosition[b] - a[b])) return !0;
              return !1;
          },
          _setLastRenderedPosition: function (a) {
              this._lastRenderedPositionLength = a.length;
              for (var b = 0; b < a.length; b++) this._lastRenderedPosition[b] = a[b];
          },
          get volumeVisualizer() {
              return this._volumeVisualizer;
          },
          updatePosition: function (a) {
              if (this.hasDisplayName && this._positionChanged(a)) {
                  this._setLastRenderedPosition(a);
                  var b = this._avatar;
                  b.setPositionFromArray(a);
                  b.rotate(a[3], a[4]);
                  6 <= a.length ? b.placePointer(a[5], a[6], a[7]) : b.hidePointer();
                  b.visible && (b.updateMatrixWorld(!0), this._viewer.requestFrame());
              }
          },
          updateSoundVolumeVisualization: function () {
              console.assert(null !== this._volumeMeter, "this._voulmeMeter not created");
              var a = this._volumeMeter.measureSoundVolume();
              this._onSoundVolumeUpdated(a);
          },
          _onSoundVolumeUpdated: function (a) {
              this._volumeVisualizer.update(a);
          },
          dispose: function () {
              this.isSoundMeasurementActive() && this._stopSoundMeasurement();
              this._avatar && (this._viewer.removeAvatar(this._avatar), (this._avatar = null), this._viewer.requestFrame());
          },
          _updateSoundMeasurementState: function () {
              null !== this._micTrack && this._micTrack.isEnabled ? this._startSoundMeasurement() : this._stopSoundMeasurement();
          },
          isSoundMeasurementActive: function () {
              return null !== this._volumeMeter;
          },
          _startSoundMeasurement: function () {
              this.isSoundMeasurementActive() || ((this._volumeMeter = new Ek.VolumeMeter(this._micTrack, 512, this._noSoundThreshold)), this._soundVolumeUpdatesScheduler.registerUser(this));
          },
          _stopSoundMeasurement: function () {
              this.isSoundMeasurementActive() && (this._soundVolumeUpdatesScheduler.unregisterUser(this), this._volumeMeter.dispose(), (this._volumeMeter = null), this._avatar.onSoundSwitchedOff());
          },
      };
      Object.defineProperty(m.prototype, "micTrack", {
          get: function () {
              return this._micTrack;
          },
      });
      Object.defineProperty(m.prototype, "cameraTrack", {
          get: function () {
              return this._cameraTrack;
          },
      });
      Object.defineProperty(m.prototype, "audioTrack", {
          get: function () {
              return this._audioTrack;
          },
      });
      n.prototype = Object.create(m.prototype);
      n.prototype.constructor = n;
      Object.defineProperty(n.prototype, "dataTrack", {
          get: function () {
              return this._dataTrack;
          },
      });
      Object.defineProperty(n.prototype, "screenTrack", {
          get: function () {
              return this._screenTrack;
          },
      });
      n.prototype.getAllTracks = function () {
          var a = [this._dataTrack];
          this._micTrack && a.push(this._micTrack);
          this._cameraTrack && a.push(this._cameraTrack);
          this._screenTrack && a.push(this._screenTrack);
          this._audioTrack && a.push(this._audioTrack);
          return a;
      };
      n.prototype._sendPosition = function (a) {
          this._positionMessage[2] = a;
          this._dataTrack.send(JSON.stringify(this._positionMessage));
      };
      n.prototype._resendLastPosition = function () {
          null !== this._lastPosition && this._sendPosition(this._lastPosition);
      };
      n.prototype.startedConnectingToTwilio = function () {
          this._isPublishingTracksDuringConnecting = !0;
      };
      n.prototype.failedToConnectToTwilio = function () {
          this._isPublishingTracksDuringConnecting = !1;
      };
      n.prototype.connectedToTwilio = function (a) {
          var b = this;
          this._twilioParticipant = a;
          a.publishTracks(this.getAllTracks()).finally(function () {
              b._isPublishingTracksDuringConnecting = !1;
          });
          this._resendLastPosition();
          this._resendInterval = setInterval(function () {
              return b._resendLastPosition();
          }, 1e3);
      };
      n.prototype.disconnectedFromTwilio = function () {
          this._twilioParticipant = null;
          clearInterval(this._resendInterval);
          this._resendInterval = null;
      };
      Object.defineProperty(n.prototype, "isConnectedToTwilio", {
          get: function () {
              return null !== this._twilioParticipant;
          },
      });
      n.prototype.updatePosition = function (a) {
          m.prototype.updatePosition.call(this, a);
          this._lastPosition = a;
          this.isConnectedToTwilio && this._sendPosition(a);
      };
      n.prototype.setAvTracksStateHandlers = function (a, b) {
          this._onMicTrackStateChanged = a;
          this._onCameraTrackStateChanged = b;
      };
      n.prototype._removeStoppedMicTrack = function () {
          console.assert(this._micTrack && this._micTrack.isStopped);
          WALK.log("Removing stopped local mic track");
          this._twilioParticipant && (WALK.log("Unpublishing stopped local mic track"), this._twilioParticipant.unpublishTrack(this._micTrack));
          this._micTrack = null;
      };
      n.prototype._subscribeToMicEvents = function () {
          function a() {
              b._updateSoundMeasurementState();
              b._onMicTrackStateChanged && b._onMicTrackStateChanged(b._micTrack);
          }
          var b = this;
          this._micTrack.on("started", a);
          this._micTrack.on("enabled", a);
          this._micTrack.on("disabled", a);
          this._micTrack.on("stopped", function () {
              a();
              b._removeStoppedMicTrack();
          });
      };
      n.prototype._createMicTrack = function () {
          var a = this;
          WALK.log("Creating local mic track");
          if (this._isCreatingMicTrack) WALK.log("Local mic track is already being created");
          else {
              this._isCreatingMicTrack = !0;
              var b = null;
              Twilio.Video.createLocalAudioTrack(this._micDevice.trackOptions)
                  .then(function (c) {
                      b = c;
                      if (a.isConnectedToTwilio) return WALK.log("Publishing local mic track"), a._twilioParticipant.publishTrack(b);
                  })
                  .then(function (c) {
                      c ? WALK.log("Local mic track created and published") : WALK.log("Local mic track created but not yet published");
                      a._micTrack = b;
                      a._subscribeToMicEvents();
                      a._onMicTrackStateChanged && a._onMicTrackStateChanged(a._micTrack);
                      a._isCreatingMicTrack = !1;
                  })
                  .catch(function (c) {
                      b && b.stop();
                      a._micDevice.error = c;
                      a._showCreateTrackError(a._micDevice);
                      a._isCreatingMicTrack = !1;
                  });
          }
      };
      n.prototype.toggleMic = function () {
          this._micTrack ? (this._micTrack.isEnabled ? (WALK.log("Disabling local mic track"), this._micTrack.disable()) : (WALK.log("Enabling local mic track"), this._micTrack.enable())) : this._createMicTrack();
      };
      n.prototype._removeStoppedCameraTrack = function () {
          console.assert(this._cameraTrack && this._cameraTrack.isStopped);
          WALK.log("Removing stopped local camera track");
          this._twilioParticipant && (WALK.log("Unpublishing stopped local camera track"), this._twilioParticipant.unpublishTrack(this._cameraTrack));
          this._cameraTrack = null;
      };
      n.prototype._subscribeToCameraEvents = function () {
          function a() {
              b._onCameraTrackStateChanged && b._onCameraTrackStateChanged(b._cameraTrack);
          }
          var b = this;
          this._cameraTrack.on("started", a);
          this._cameraTrack.on("enabled", a);
          this._cameraTrack.on("disabled", a);
          this._cameraTrack.on("stopped", function () {
              a();
              b._removeStoppedCameraTrack();
          });
      };
      n.prototype._createCameraTrack = function () {
          var a = this;
          WALK.log("Creating local camera track");
          if (this._isCreatingCameraTrack) WALK.log("Local camera track is already being created");
          else {
              this._isCreatingCameraTrack = !0;
              var b = null;
              Twilio.Video.createLocalVideoTrack(this._cameraDevice.trackOptions)
                  .then(function (c) {
                      b = c;
                      if (a.isConnectedToTwilio) return WALK.log("Publishing local camera track"), a._twilioParticipant.publishTrack(b);
                  })
                  .then(function (c) {
                      c ? WALK.log("Local camera track created and published") : WALK.log("Local camera track created but not yet published");
                      a._cameraTrack = b;
                      a._subscribeToCameraEvents();
                      a._onCameraTrackStateChanged && a._onCameraTrackStateChanged(a._cameraTrack);
                      a._isCreatingCameraTrack = !1;
                  })
                  .catch(function (c) {
                      b && b.stop();
                      a._cameraDevice.error = c;
                      a._showCreateTrackError(a._cameraDevice);
                      a._isCreatingCameraTrack = !1;
                  });
          }
      };
      n.prototype._showCreateTrackError = function (a) {
          a = a.getErrorMessageInfo();
          Ak.showMessage(a.description, a.title);
      };
      n.prototype.toggleCamera = function () {
          this._cameraTrack ? (this._isPublishingTracksDuringConnecting ? WALK.log("Cannot disable the camera track during connection process") : this._cameraTrack.stop()) : this._createCameraTrack();
      };
      n.prototype.startShareScreen = function (a, b, c, d) {
          var e = this;
          null !== this._screenTrack
              ? a()
              : (WALK.log("Share screen start"),
                navigator.mediaDevices
                    .getDisplayMedia({ video: !0, audio: !0 })
                    .then(function (c) {
                        WALK.log("share screen - stream:", c);
                        var f = new Twilio.Video.LocalVideoTrack(c.getVideoTracks()[0], { name: "screen" });
                        e._screenTrack = f;
                        c = c.getAudioTracks();
                        var l = null;
                        0 < c.length ? ((l = new Twilio.Video.LocalAudioTrack(c[0], { name: "audio" })), (e._audioTrack = l), d()) : console.log("Audio track not available for sharing");
                        c = g(e._viewer, f);
                        e._avatar.setVideoTexture1(c);
                        e._viewer.requestFrame();
                        e.isConnectedToTwilio && (e._twilioParticipant.publishTrack(f), l && e._twilioParticipant.publishTrack(l));
                        a();
                        f.once("stopped", function () {
                            WALK.log("Screen track stopped");
                            e.isConnectedToTwilio && (e._twilioParticipant.unpublishTrack(f), null !== l && e._twilioParticipant.unpublishTrack(l));
                            e._avatar.setVideoTexture1(null);
                            h(f);
                            null !== l && h(l);
                            e._screenTrack = null;
                            e._audioTrack && ((e._audioTrack = null), d());
                            e._viewer.requestFrame();
                            b();
                        });
                    })
                    .catch(function () {
                        c();
                    }));
      };
      n.prototype.stopShareScreen = function () {
          null !== this._screenTrack && (WALK.log("Share screen stop"), this._screenTrack.stop());
      };
      n.prototype.dispose = function () {
          this._micTrack && this._micTrack.stop();
          this._cameraTrack && this._cameraTrack.stop();
          this._screenTrack && this._screenTrack.stop();
          m.prototype.dispose.call(this);
      };
      p.prototype = Object.create(m.prototype);
      p.prototype.constructor = p;
      p.prototype._refreshUi = function () {
          this._onUiRefreshNeeded && this._onUiRefreshNeeded(this);
      };
      p.prototype._setUpMicTrack = function () {
          var a = this;
          WALK.log("Setting up remote mic track for %s:%s", this._uuid, this._displayName);
          this._micTrackStateChangedBound = function () {
              a._updateSoundMeasurementState();
              a._refreshUi();
          };
          this._micTrack.on("enabled", this._micTrackStateChangedBound);
          this._micTrack.on("disabled", this._micTrackStateChangedBound);
          this._updateSoundMeasurementState();
          this._micTrack.attach();
      };
      p.prototype._tearDownMicTrack = function () {
          WALK.log("Tearing down remote mic track for %s:%s", this._uuid, this._displayName);
          h(this._micTrack);
          this._micTrack.removeListener("enabled", this._micTrackStateChangedBound);
          this._micTrack.removeListener("disabled", this._micTrackStateChangedBound);
          this._micTrackStateChangedBound = null;
      };
      p.prototype._setUpAudioTrack = function () {
          WALK.log("Setting up remote audio track for %s:%s", this._uuid, this._displayName);
          this._audioTrack.attach();
      };
      p.prototype._tearDownAudioTrack = function () {
          WALK.log("Tearing down remote audio track for %s:%s", this._uuid, this._displayName);
          h(this._audioTrack);
      };
      p.prototype._setUpCameraTrack = function () {
          var a = this;
          WALK.log("Setting up remote camera track for %s:%s", this._uuid, this._displayName);
          var b = g(this._viewer, this._cameraTrack);
          this._cameraTrackEnabledBound = function () {
              a._avatar.setVideoTexture0(b);
          };
          this._cameraTrackDisabledBound = function () {
              a._avatar.setVideoTexture0(null);
          };
          this._cameraTrack.on("enabled", this._cameraTrackEnabledBound);
          this._cameraTrack.on("disabled", this._cameraTrackDisabledBound);
          this._avatar.setVideoTexture0(b);
      };
      p.prototype._tearDownCameraTrack = function () {
          WALK.log("Tearing down remote camera track for %s:%s", this._uuid, this._displayName);
          this._avatar.setVideoTexture0(null);
          h(this._cameraTrack);
          this._cameraTrack.removeListener("enabled", this._cameraTrackEnabledBound);
          this._cameraTrack.removeListener("disabled", this._cameraTrackDisabledBound);
          this._cameraTrackDisabledBound = this._cameraTrackEnabledBound = null;
      };
      p.prototype._setUpScreenTrack = function () {
          WALK.log("Setting up remote screen track for %s:%s", this._uuid, this._displayName);
          var a = g(this._viewer, this._screenTrack);
          this._avatar.setVideoTexture1(a);
      };
      p.prototype._tearDownScreenTrack = function () {
          WALK.log("Tearing down remote screen track for %s:%s", this._uuid, this._displayName);
          this._avatar.setVideoTexture1(null);
          h(this._screenTrack);
      };
      p.prototype._setDisplayName = function (a) {
          WALK.log("Remote display name known for %s:%s", this._uuid, a);
          this._displayName = a;
          this._setUpAvatar();
          this._micTrack && this._setUpMicTrack();
          this._cameraTrack && this._setUpCameraTrack();
          this._screenTrack && this._setUpScreenTrack();
          this._audioTrack && this._setUpAudioTrack();
          this._refreshUi();
      };
      p.prototype._trackSubscribed = function (a) {
          var b = this;
          WALK.log("Remote %s:%s track subscribed for %s:%s", a.kind, a.name, this._uuid, this._displayName);
          this._disposed ||
              ("data" === a.kind && "data" === a.name
                  ? this._dataTrack
                      ? WALK.log("Ignoring duplicate data track")
                      : ((this._dataTrack = a),
                        a.on("message", function (a) {
                            a = JSON.parse(a);
                            var c = a[1];
                            a = a[2];
                            b.hasDisplayName || b._setDisplayName(c);
                            b.updatePosition(a);
                        }))
                  : "audio" === a.kind && "mic" === a.name
                  ? this._micTrack
                      ? WALK.log("Ignoring duplicate mic track")
                      : ((this._micTrack = a), this.hasDisplayName && (this._setUpMicTrack(), this._refreshUi()))
                  : "video" === a.kind
                  ? "camera" === a.name
                      ? this._cameraTrack
                          ? WALK.log("Ignoring duplicate camera track")
                          : ((this._cameraTrack = a), this._avatar && (this._setUpCameraTrack(), this._viewer.requestFrame()))
                      : "screen" === a.name && (this._screenTrack ? WALK.log("Ignoring duplicate screen track") : ((this._screenTrack = a), this._avatar && (this._setUpScreenTrack(), this._viewer.requestFrame())))
                  : "audio" === a.kind && "audio" === a.name && (this._audioTrack ? WALK.log("Ignoring duplicate audio track") : ((this._audioTrack = a), this.hasDisplayName && (this._setUpAudioTrack(), this._refreshUi()))));
      };
      p.prototype._trackUnsubscribed = function (a) {
          WALK.log("Remote %s:%s track unsubscribed for %s:%s", a.kind, a.name, this._uuid, this._displayName);
          this._disposed ||
              (a === this._dataTrack
                  ? (this._dataTrack = null)
                  : a === this._micTrack
                  ? (this.hasDisplayName && this._tearDownMicTrack(), (this._micTrack = null), this._refreshUi())
                  : a === this._cameraTrack
                  ? (this._avatar && (this._tearDownCameraTrack(), this._viewer.requestFrame()), (this._cameraTrack = null))
                  : a === this._screenTrack
                  ? (this._avatar && (this._tearDownScreenTrack(), this._viewer.requestFrame()), (this._screenTrack = null))
                  : a === this._audioTrack && (this.hasDisplayName && this._tearDownAudioTrack(), (this._audioTrack = null), this._refreshUi()));
      };
      p.prototype.connectedToTwilio = function (a) {
          var b = this;
          this._twilioParticipant = a;
          a.on("trackSubscribed", this._trackSubscribedBound);
          a.on("trackUnsubscribed", this._trackUnsubscribedBound);
          a.tracks.forEach(function (a) {
              a.isSubscribed && b._trackSubscribed(a.track);
          });
      };
      p.prototype.seeAvatar = function () {
          this._avatar && this._viewer.seeItem(this._avatar);
      };
      p.prototype._onSoundVolumeUpdated = function (a) {
          m.prototype._onSoundVolumeUpdated.call(this, a);
          this._avatar.onSoundVolumeUpdated(a);
      };
      p.prototype.dispose = function () {
          this._onUiRefreshNeeded = null;
          this._micTrack && this._trackUnsubscribed(this._micTrack);
          this._cameraTrack && this._trackUnsubscribed(this._cameraTrack);
          this._screenTrack && this._trackUnsubscribed(this._screenTrack);
          this._audioTrack && this._trackUnsubscribed(this._audioTrack);
          this.isConnectedToTwilio &&
              (this._twilioParticipant.removeListener("trackSubscribed", this._trackSubscribedBound), this._twilioParticipant.removeListener("trackUnsubscribed", this._trackUnsubscribedBound), (this._twilioParticipant = null));
          m.prototype.dispose.call(this);
          this._disposed = !0;
      };
      a.prototype.registerUser = function (a) {
          this._users.add(a);
      };
      a.prototype.unregisterUser = function (a) {
          this._users.delete(a);
      };
      a.prototype.dispose = function () {
          this._users.clear();
      };
      a.prototype._onBeforeRender = function () {
          this._execute();
          this._idleCallback.deferRun();
      };
      a.prototype._execute = function () {
          this._users.forEach(function (a) {
              return a.updateSoundVolumeVisualization();
          });
      };
      WALK.loadScriptsUrlAndExecute(
          [WALK.getViewerAssetUrl("lib/pubnub.min.js"), WALK.getViewerAssetUrl("lib/twilio-video.min.js")],
          function () {
              var a = WALK.urlHashGetArgument("meeting"),
                  c = WALK.urlHashGetArgument("meeting-key"),
                  d = WALK.urlHashGetArgument("av-mode"),
                  e = { url: WALK.DEVEL_MEETING_SCENE_URL || window.location.href };
              a && (e.meetingName = a);
              c && (e.meetingKey = c);
              d && (e.avMode = d);
              I && (e.avRegion = I);
              WALK.ajaxPost(
                  b() + "/meetings/join",
                  "application/json",
                  JSON.stringify(e),
                  function (a) {
                      return C(a.avatarJsonUrl, function () {
                          return L(a);
                      });
                  },
                  function (a, b) {
                      void 0 !== b ? za.error(b) : za.error("Failed to join the meeting. Is your link valid?");
                  }
              );
          },
          function () {
              return za.error("Cannot load required library");
          }
      );
      WALK.play();
  }
  WALK.getViewer()._isMeeting() && Vk();
}.call(this));