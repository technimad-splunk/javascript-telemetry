"use strict";
(() => {
  // node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationTemporality.js
  var AggregationTemporality;
  (function(AggregationTemporality2) {
    AggregationTemporality2[AggregationTemporality2["DELTA"] = 0] = "DELTA";
    AggregationTemporality2[AggregationTemporality2["CUMULATIVE"] = 1] = "CUMULATIVE";
  })(AggregationTemporality || (AggregationTemporality = {}));

  // node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricData.js
  var DataPointType;
  (function(DataPointType2) {
    DataPointType2[DataPointType2["HISTOGRAM"] = 0] = "HISTOGRAM";
    DataPointType2[DataPointType2["EXPONENTIAL_HISTOGRAM"] = 1] = "EXPONENTIAL_HISTOGRAM";
    DataPointType2[DataPointType2["GAUGE"] = 2] = "GAUGE";
    DataPointType2[DataPointType2["SUM"] = 3] = "SUM";
  })(DataPointType || (DataPointType = {}));

  // node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
  var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/api/build/esm/version.js
  var VERSION = "1.9.0";

  // node_modules/@opentelemetry/api/build/esm/internal/semver.js
  var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
    var rejectedVersions = /* @__PURE__ */ new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
      return function() {
        return false;
      };
    }
    var ownVersionParsed = {
      major: +myVersionMatch[1],
      minor: +myVersionMatch[2],
      patch: +myVersionMatch[3],
      prerelease: myVersionMatch[4]
    };
    if (ownVersionParsed.prerelease != null) {
      return function isExactmatch(globalVersion) {
        return globalVersion === ownVersion;
      };
    }
    function _reject(v) {
      rejectedVersions.add(v);
      return false;
    }
    function _accept(v) {
      acceptedVersions.add(v);
      return true;
    }
    return function isCompatible2(globalVersion) {
      if (acceptedVersions.has(globalVersion)) {
        return true;
      }
      if (rejectedVersions.has(globalVersion)) {
        return false;
      }
      var globalVersionMatch = globalVersion.match(re);
      if (!globalVersionMatch) {
        return _reject(globalVersion);
      }
      var globalVersionParsed = {
        major: +globalVersionMatch[1],
        minor: +globalVersionMatch[2],
        patch: +globalVersionMatch[3],
        prerelease: globalVersionMatch[4]
      };
      if (globalVersionParsed.prerelease != null) {
        return _reject(globalVersion);
      }
      if (ownVersionParsed.major !== globalVersionParsed.major) {
        return _reject(globalVersion);
      }
      if (ownVersionParsed.major === 0) {
        if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
          return _accept(globalVersion);
        }
        return _reject(globalVersion);
      }
      if (ownVersionParsed.minor <= globalVersionParsed.minor) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    };
  }
  var isCompatible = _makeCompatibilityCheck(VERSION);

  // node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
  var major = VERSION.split(".")[0];
  var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
  var _global = _globalThis;
  function registerGlobal(type, instance, diag2, allowOverride) {
    var _a2;
    if (allowOverride === void 0) {
      allowOverride = false;
    }
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a2 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a2 !== void 0 ? _a2 : {
      version: VERSION
    };
    if (!allowOverride && api[type]) {
      var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
      diag2.error(err.stack || err.message);
      return false;
    }
    if (api.version !== VERSION) {
      var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
      diag2.error(err.stack || err.message);
      return false;
    }
    api[type] = instance;
    diag2.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
    return true;
  }
  function getGlobal(type) {
    var _a2, _b;
    var globalVersion = (_a2 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a2 === void 0 ? void 0 : _a2.version;
    if (!globalVersion || !isCompatible(globalVersion)) {
      return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
  }
  function unregisterGlobal(type, diag2) {
    diag2.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
      delete api[type];
    }
  }

  // node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
  var __read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var DiagComponentLogger = (
    /** @class */
    function() {
      function DiagComponentLogger2(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      DiagComponentLogger2.prototype.debug = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("debug", this._namespace, args);
      };
      DiagComponentLogger2.prototype.error = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("error", this._namespace, args);
      };
      DiagComponentLogger2.prototype.info = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("info", this._namespace, args);
      };
      DiagComponentLogger2.prototype.warn = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("warn", this._namespace, args);
      };
      DiagComponentLogger2.prototype.verbose = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("verbose", this._namespace, args);
      };
      return DiagComponentLogger2;
    }()
  );
  function logProxy(funcName, namespace, args) {
    var logger = getGlobal("diag");
    if (!logger) {
      return;
    }
    args.unshift(namespace);
    return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
  }

  // node_modules/@opentelemetry/api/build/esm/diag/types.js
  var DiagLogLevel;
  (function(DiagLogLevel2) {
    DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
    DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
    DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
    DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
    DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
    DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
    DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
  })(DiagLogLevel || (DiagLogLevel = {}));

  // node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
  function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < DiagLogLevel.NONE) {
      maxLevel = DiagLogLevel.NONE;
    } else if (maxLevel > DiagLogLevel.ALL) {
      maxLevel = DiagLogLevel.ALL;
    }
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
      var theFunc = logger[funcName];
      if (typeof theFunc === "function" && maxLevel >= theLevel) {
        return theFunc.bind(logger);
      }
      return function() {
      };
    }
    return {
      error: _filterFunc("error", DiagLogLevel.ERROR),
      warn: _filterFunc("warn", DiagLogLevel.WARN),
      info: _filterFunc("info", DiagLogLevel.INFO),
      debug: _filterFunc("debug", DiagLogLevel.DEBUG),
      verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
    };
  }

  // node_modules/@opentelemetry/api/build/esm/api/diag.js
  var __read2 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME = "diag";
  var DiagAPI = (
    /** @class */
    function() {
      function DiagAPI2() {
        function _logProxy(funcName) {
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var logger = getGlobal("diag");
            if (!logger)
              return;
            return logger[funcName].apply(logger, __spreadArray2([], __read2(args), false));
          };
        }
        var self2 = this;
        var setLogger = function(logger, optionsOrLogLevel) {
          var _a2, _b, _c;
          if (optionsOrLogLevel === void 0) {
            optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
          }
          if (logger === self2) {
            var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a2 = err.stack) !== null && _a2 !== void 0 ? _a2 : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          var oldLogger = getGlobal("diag");
          var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn("Current logger will be overwritten from " + stack);
            newLogger.warn("Current logger will overwrite one already registered from " + stack);
          }
          return registerGlobal("diag", newLogger, self2, true);
        };
        self2.setLogger = setLogger;
        self2.disable = function() {
          unregisterGlobal(API_NAME, self2);
        };
        self2.createComponentLogger = function(options) {
          return new DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
      DiagAPI2.instance = function() {
        if (!this._instance) {
          this._instance = new DiagAPI2();
        }
        return this._instance;
      };
      return DiagAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/context/context.js
  function createContextKey(description) {
    return Symbol.for(description);
  }
  var BaseContext = (
    /** @class */
    /* @__PURE__ */ function() {
      function BaseContext2(parentContext) {
        var self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = function(key) {
          return self2._currentContext.get(key);
        };
        self2.setValue = function(key, value) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.set(key, value);
          return context2;
        };
        self2.deleteValue = function(key) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.delete(key);
          return context2;
        };
      }
      return BaseContext2;
    }()
  );
  var ROOT_CONTEXT = new BaseContext();

  // node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js
  var __extends = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var NoopMeter = (
    /** @class */
    function() {
      function NoopMeter2() {
      }
      NoopMeter2.prototype.createGauge = function(_name, _options) {
        return NOOP_GAUGE_METRIC;
      };
      NoopMeter2.prototype.createHistogram = function(_name, _options) {
        return NOOP_HISTOGRAM_METRIC;
      };
      NoopMeter2.prototype.createCounter = function(_name, _options) {
        return NOOP_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createUpDownCounter = function(_name, _options) {
        return NOOP_UP_DOWN_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createObservableGauge = function(_name, _options) {
        return NOOP_OBSERVABLE_GAUGE_METRIC;
      };
      NoopMeter2.prototype.createObservableCounter = function(_name, _options) {
        return NOOP_OBSERVABLE_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createObservableUpDownCounter = function(_name, _options) {
        return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      };
      NoopMeter2.prototype.addBatchObservableCallback = function(_callback, _observables) {
      };
      NoopMeter2.prototype.removeBatchObservableCallback = function(_callback) {
      };
      return NoopMeter2;
    }()
  );
  var NoopMetric = (
    /** @class */
    /* @__PURE__ */ function() {
      function NoopMetric2() {
      }
      return NoopMetric2;
    }()
  );
  var NoopCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopCounterMetric2, _super);
      function NoopCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopCounterMetric2.prototype.add = function(_value, _attributes) {
      };
      return NoopCounterMetric2;
    }(NoopMetric)
  );
  var NoopUpDownCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopUpDownCounterMetric2, _super);
      function NoopUpDownCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopUpDownCounterMetric2.prototype.add = function(_value, _attributes) {
      };
      return NoopUpDownCounterMetric2;
    }(NoopMetric)
  );
  var NoopGaugeMetric = (
    /** @class */
    function(_super) {
      __extends(NoopGaugeMetric2, _super);
      function NoopGaugeMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopGaugeMetric2.prototype.record = function(_value, _attributes) {
      };
      return NoopGaugeMetric2;
    }(NoopMetric)
  );
  var NoopHistogramMetric = (
    /** @class */
    function(_super) {
      __extends(NoopHistogramMetric2, _super);
      function NoopHistogramMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopHistogramMetric2.prototype.record = function(_value, _attributes) {
      };
      return NoopHistogramMetric2;
    }(NoopMetric)
  );
  var NoopObservableMetric = (
    /** @class */
    function() {
      function NoopObservableMetric2() {
      }
      NoopObservableMetric2.prototype.addCallback = function(_callback) {
      };
      NoopObservableMetric2.prototype.removeCallback = function(_callback) {
      };
      return NoopObservableMetric2;
    }()
  );
  var NoopObservableCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopObservableCounterMetric2, _super);
      function NoopObservableCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableCounterMetric2;
    }(NoopObservableMetric)
  );
  var NoopObservableGaugeMetric = (
    /** @class */
    function(_super) {
      __extends(NoopObservableGaugeMetric2, _super);
      function NoopObservableGaugeMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableGaugeMetric2;
    }(NoopObservableMetric)
  );
  var NoopObservableUpDownCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopObservableUpDownCounterMetric2, _super);
      function NoopObservableUpDownCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableUpDownCounterMetric2;
    }(NoopObservableMetric)
  );
  var NOOP_METER = new NoopMeter();
  var NOOP_COUNTER_METRIC = new NoopCounterMetric();
  var NOOP_GAUGE_METRIC = new NoopGaugeMetric();
  var NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
  var NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
  var NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
  var NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
  var NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
  function createNoopMeter() {
    return NOOP_METER;
  }

  // node_modules/@opentelemetry/api/build/esm/metrics/Metric.js
  var ValueType;
  (function(ValueType2) {
    ValueType2[ValueType2["INT"] = 0] = "INT";
    ValueType2[ValueType2["DOUBLE"] = 1] = "DOUBLE";
  })(ValueType || (ValueType = {}));

  // node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
  var __read3 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray3 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var NoopContextManager = (
    /** @class */
    function() {
      function NoopContextManager2() {
      }
      NoopContextManager2.prototype.active = function() {
        return ROOT_CONTEXT;
      };
      NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray3([thisArg], __read3(args), false));
      };
      NoopContextManager2.prototype.bind = function(_context, target) {
        return target;
      };
      NoopContextManager2.prototype.enable = function() {
        return this;
      };
      NoopContextManager2.prototype.disable = function() {
        return this;
      };
      return NoopContextManager2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/api/context.js
  var __read4 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray4 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME2 = "context";
  var NOOP_CONTEXT_MANAGER = new NoopContextManager();
  var ContextAPI = (
    /** @class */
    function() {
      function ContextAPI2() {
      }
      ContextAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new ContextAPI2();
        }
        return this._instance;
      };
      ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
        return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
      };
      ContextAPI2.prototype.active = function() {
        return this._getContextManager().active();
      };
      ContextAPI2.prototype.with = function(context2, fn, thisArg) {
        var _a2;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return (_a2 = this._getContextManager()).with.apply(_a2, __spreadArray4([context2, fn, thisArg], __read4(args), false));
      };
      ContextAPI2.prototype.bind = function(context2, target) {
        return this._getContextManager().bind(context2, target);
      };
      ContextAPI2.prototype._getContextManager = function() {
        return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
      };
      ContextAPI2.prototype.disable = function() {
        this._getContextManager().disable();
        unregisterGlobal(API_NAME2, DiagAPI.instance());
      };
      return ContextAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/context-api.js
  var context = ContextAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/diag-api.js
  var diag = DiagAPI.instance();

  // node_modules/@opentelemetry/sdk-metrics/build/esm/utils.js
  var __extends2 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read5 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray5 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var __values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function isNotNullish(item) {
    return item !== void 0 && item !== null;
  }
  function hashAttributes(attributes) {
    var keys = Object.keys(attributes);
    if (keys.length === 0)
      return "";
    keys = keys.sort();
    return JSON.stringify(keys.map(function(key) {
      return [key, attributes[key]];
    }));
  }
  function instrumentationScopeId(instrumentationScope) {
    var _a2, _b;
    return instrumentationScope.name + ":" + ((_a2 = instrumentationScope.version) !== null && _a2 !== void 0 ? _a2 : "") + ":" + ((_b = instrumentationScope.schemaUrl) !== null && _b !== void 0 ? _b : "");
  }
  var TimeoutError = (
    /** @class */
    function(_super) {
      __extends2(TimeoutError2, _super);
      function TimeoutError2(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, TimeoutError2.prototype);
        return _this;
      }
      return TimeoutError2;
    }(Error)
  );
  function callWithTimeout(promise, timeout) {
    var timeoutHandle;
    var timeoutPromise = new Promise(function timeoutFunction(_resolve, reject) {
      timeoutHandle = setTimeout(function timeoutHandler() {
        reject(new TimeoutError("Operation timed out."));
      }, timeout);
    });
    return Promise.race([promise, timeoutPromise]).then(function(result) {
      clearTimeout(timeoutHandle);
      return result;
    }, function(reason) {
      clearTimeout(timeoutHandle);
      throw reason;
    });
  }
  function PromiseAllSettled(promises) {
    return __awaiter(this, void 0, void 0, function() {
      var _this = this;
      return __generator(this, function(_a2) {
        return [2, Promise.all(promises.map(function(p) {
          return __awaiter(_this, void 0, void 0, function() {
            var ret, e_1;
            return __generator(this, function(_a3) {
              switch (_a3.label) {
                case 0:
                  _a3.trys.push([0, 2, , 3]);
                  return [4, p];
                case 1:
                  ret = _a3.sent();
                  return [2, {
                    status: "fulfilled",
                    value: ret
                  }];
                case 2:
                  e_1 = _a3.sent();
                  return [2, {
                    status: "rejected",
                    reason: e_1
                  }];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        }))];
      });
    });
  }
  function isPromiseAllSettledRejectionResult(it) {
    return it.status === "rejected";
  }
  function FlatMap(arr, fn) {
    var result = [];
    arr.forEach(function(it) {
      result.push.apply(result, __spreadArray5([], __read5(fn(it)), false));
    });
    return result;
  }
  function setEquals(lhs, rhs) {
    var e_2, _a2;
    if (lhs.size !== rhs.size) {
      return false;
    }
    try {
      for (var lhs_1 = __values(lhs), lhs_1_1 = lhs_1.next(); !lhs_1_1.done; lhs_1_1 = lhs_1.next()) {
        var item = lhs_1_1.value;
        if (!rhs.has(item)) {
          return false;
        }
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (lhs_1_1 && !lhs_1_1.done && (_a2 = lhs_1.return))
          _a2.call(lhs_1);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
    return true;
  }
  function binarySearchUB(arr, value) {
    var lo = 0;
    var hi = arr.length - 1;
    var ret = arr.length;
    while (hi >= lo) {
      var mid = lo + Math.trunc((hi - lo) / 2);
      if (arr[mid] < value) {
        lo = mid + 1;
      } else {
        ret = mid;
        hi = mid - 1;
      }
    }
    return ret;
  }
  function equalsCaseInsensitive(lhs, rhs) {
    return lhs.toLowerCase() === rhs.toLowerCase();
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/types.js
  var AggregatorKind;
  (function(AggregatorKind2) {
    AggregatorKind2[AggregatorKind2["DROP"] = 0] = "DROP";
    AggregatorKind2[AggregatorKind2["SUM"] = 1] = "SUM";
    AggregatorKind2[AggregatorKind2["LAST_VALUE"] = 2] = "LAST_VALUE";
    AggregatorKind2[AggregatorKind2["HISTOGRAM"] = 3] = "HISTOGRAM";
    AggregatorKind2[AggregatorKind2["EXPONENTIAL_HISTOGRAM"] = 4] = "EXPONENTIAL_HISTOGRAM";
  })(AggregatorKind || (AggregatorKind = {}));

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Drop.js
  var DropAggregator = (
    /** @class */
    function() {
      function DropAggregator2() {
        this.kind = AggregatorKind.DROP;
      }
      DropAggregator2.prototype.createAccumulation = function() {
        return void 0;
      };
      DropAggregator2.prototype.merge = function(_previous, _delta) {
        return void 0;
      };
      DropAggregator2.prototype.diff = function(_previous, _current) {
        return void 0;
      };
      DropAggregator2.prototype.toMetricData = function(_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {
        return void 0;
      };
      return DropAggregator2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/InstrumentDescriptor.js
  var InstrumentType;
  (function(InstrumentType2) {
    InstrumentType2["COUNTER"] = "COUNTER";
    InstrumentType2["GAUGE"] = "GAUGE";
    InstrumentType2["HISTOGRAM"] = "HISTOGRAM";
    InstrumentType2["UP_DOWN_COUNTER"] = "UP_DOWN_COUNTER";
    InstrumentType2["OBSERVABLE_COUNTER"] = "OBSERVABLE_COUNTER";
    InstrumentType2["OBSERVABLE_GAUGE"] = "OBSERVABLE_GAUGE";
    InstrumentType2["OBSERVABLE_UP_DOWN_COUNTER"] = "OBSERVABLE_UP_DOWN_COUNTER";
  })(InstrumentType || (InstrumentType = {}));
  function createInstrumentDescriptor(name, type, options) {
    var _a2, _b, _c, _d;
    if (!isValidName(name)) {
      diag.warn('Invalid metric name: "' + name + '". The metric name should be a ASCII string with a length no greater than 255 characters.');
    }
    return {
      name,
      type,
      description: (_a2 = options === null || options === void 0 ? void 0 : options.description) !== null && _a2 !== void 0 ? _a2 : "",
      unit: (_b = options === null || options === void 0 ? void 0 : options.unit) !== null && _b !== void 0 ? _b : "",
      valueType: (_c = options === null || options === void 0 ? void 0 : options.valueType) !== null && _c !== void 0 ? _c : ValueType.DOUBLE,
      advice: (_d = options === null || options === void 0 ? void 0 : options.advice) !== null && _d !== void 0 ? _d : {}
    };
  }
  function createInstrumentDescriptorWithView(view, instrument) {
    var _a2, _b;
    return {
      name: (_a2 = view.name) !== null && _a2 !== void 0 ? _a2 : instrument.name,
      description: (_b = view.description) !== null && _b !== void 0 ? _b : instrument.description,
      type: instrument.type,
      unit: instrument.unit,
      valueType: instrument.valueType,
      advice: instrument.advice
    };
  }
  function isDescriptorCompatibleWith(descriptor, otherDescriptor) {
    return equalsCaseInsensitive(descriptor.name, otherDescriptor.name) && descriptor.unit === otherDescriptor.unit && descriptor.type === otherDescriptor.type && descriptor.valueType === otherDescriptor.valueType;
  }
  var NAME_REGEXP = /^[a-z][a-z0-9_.\-/]{0,254}$/i;
  function isValidName(name) {
    return name.match(NAME_REGEXP) != null;
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Histogram.js
  var __read6 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  function createNewEmptyCheckpoint(boundaries) {
    var counts = boundaries.map(function() {
      return 0;
    });
    counts.push(0);
    return {
      buckets: {
        boundaries,
        counts
      },
      sum: 0,
      count: 0,
      hasMinMax: false,
      min: Infinity,
      max: -Infinity
    };
  }
  var HistogramAccumulation = (
    /** @class */
    function() {
      function HistogramAccumulation2(startTime, _boundaries, _recordMinMax, _current) {
        if (_recordMinMax === void 0) {
          _recordMinMax = true;
        }
        if (_current === void 0) {
          _current = createNewEmptyCheckpoint(_boundaries);
        }
        this.startTime = startTime;
        this._boundaries = _boundaries;
        this._recordMinMax = _recordMinMax;
        this._current = _current;
      }
      HistogramAccumulation2.prototype.record = function(value) {
        if (Number.isNaN(value)) {
          return;
        }
        this._current.count += 1;
        this._current.sum += value;
        if (this._recordMinMax) {
          this._current.min = Math.min(value, this._current.min);
          this._current.max = Math.max(value, this._current.max);
          this._current.hasMinMax = true;
        }
        var idx = binarySearchUB(this._boundaries, value);
        this._current.buckets.counts[idx] += 1;
      };
      HistogramAccumulation2.prototype.setStartTime = function(startTime) {
        this.startTime = startTime;
      };
      HistogramAccumulation2.prototype.toPointValue = function() {
        return this._current;
      };
      return HistogramAccumulation2;
    }()
  );
  var HistogramAggregator = (
    /** @class */
    function() {
      function HistogramAggregator2(_boundaries, _recordMinMax) {
        this._boundaries = _boundaries;
        this._recordMinMax = _recordMinMax;
        this.kind = AggregatorKind.HISTOGRAM;
      }
      HistogramAggregator2.prototype.createAccumulation = function(startTime) {
        return new HistogramAccumulation(startTime, this._boundaries, this._recordMinMax);
      };
      HistogramAggregator2.prototype.merge = function(previous, delta) {
        var previousValue = previous.toPointValue();
        var deltaValue = delta.toPointValue();
        var previousCounts = previousValue.buckets.counts;
        var deltaCounts = deltaValue.buckets.counts;
        var mergedCounts = new Array(previousCounts.length);
        for (var idx = 0; idx < previousCounts.length; idx++) {
          mergedCounts[idx] = previousCounts[idx] + deltaCounts[idx];
        }
        var min = Infinity;
        var max = -Infinity;
        if (this._recordMinMax) {
          if (previousValue.hasMinMax && deltaValue.hasMinMax) {
            min = Math.min(previousValue.min, deltaValue.min);
            max = Math.max(previousValue.max, deltaValue.max);
          } else if (previousValue.hasMinMax) {
            min = previousValue.min;
            max = previousValue.max;
          } else if (deltaValue.hasMinMax) {
            min = deltaValue.min;
            max = deltaValue.max;
          }
        }
        return new HistogramAccumulation(previous.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
          buckets: {
            boundaries: previousValue.buckets.boundaries,
            counts: mergedCounts
          },
          count: previousValue.count + deltaValue.count,
          sum: previousValue.sum + deltaValue.sum,
          hasMinMax: this._recordMinMax && (previousValue.hasMinMax || deltaValue.hasMinMax),
          min,
          max
        });
      };
      HistogramAggregator2.prototype.diff = function(previous, current) {
        var previousValue = previous.toPointValue();
        var currentValue = current.toPointValue();
        var previousCounts = previousValue.buckets.counts;
        var currentCounts = currentValue.buckets.counts;
        var diffedCounts = new Array(previousCounts.length);
        for (var idx = 0; idx < previousCounts.length; idx++) {
          diffedCounts[idx] = currentCounts[idx] - previousCounts[idx];
        }
        return new HistogramAccumulation(current.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
          buckets: {
            boundaries: previousValue.buckets.boundaries,
            counts: diffedCounts
          },
          count: currentValue.count - previousValue.count,
          sum: currentValue.sum - previousValue.sum,
          hasMinMax: false,
          min: Infinity,
          max: -Infinity
        });
      };
      HistogramAggregator2.prototype.toMetricData = function(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
          descriptor,
          aggregationTemporality,
          dataPointType: DataPointType.HISTOGRAM,
          dataPoints: accumulationByAttributes.map(function(_a2) {
            var _b = __read6(_a2, 2), attributes = _b[0], accumulation = _b[1];
            var pointValue = accumulation.toPointValue();
            var allowsNegativeValues = descriptor.type === InstrumentType.GAUGE || descriptor.type === InstrumentType.UP_DOWN_COUNTER || descriptor.type === InstrumentType.OBSERVABLE_GAUGE || descriptor.type === InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
            return {
              attributes,
              startTime: accumulation.startTime,
              endTime,
              value: {
                min: pointValue.hasMinMax ? pointValue.min : void 0,
                max: pointValue.hasMinMax ? pointValue.max : void 0,
                sum: !allowsNegativeValues ? pointValue.sum : void 0,
                buckets: pointValue.buckets,
                count: pointValue.count
              }
            };
          })
        };
      };
      return HistogramAggregator2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/Buckets.js
  var __read7 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray6 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var Buckets = (
    /** @class */
    function() {
      function Buckets2(backing, indexBase, indexStart, indexEnd) {
        if (backing === void 0) {
          backing = new BucketsBacking();
        }
        if (indexBase === void 0) {
          indexBase = 0;
        }
        if (indexStart === void 0) {
          indexStart = 0;
        }
        if (indexEnd === void 0) {
          indexEnd = 0;
        }
        this.backing = backing;
        this.indexBase = indexBase;
        this.indexStart = indexStart;
        this.indexEnd = indexEnd;
      }
      Object.defineProperty(Buckets2.prototype, "offset", {
        /**
         * Offset is the bucket index of the smallest entry in the counts array
         * @returns {number}
         */
        get: function() {
          return this.indexStart;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Buckets2.prototype, "length", {
        /**
         * Buckets is a view into the backing array.
         * @returns {number}
         */
        get: function() {
          if (this.backing.length === 0) {
            return 0;
          }
          if (this.indexEnd === this.indexStart && this.at(0) === 0) {
            return 0;
          }
          return this.indexEnd - this.indexStart + 1;
        },
        enumerable: false,
        configurable: true
      });
      Buckets2.prototype.counts = function() {
        var _this = this;
        return Array.from({ length: this.length }, function(_, i) {
          return _this.at(i);
        });
      };
      Buckets2.prototype.at = function(position) {
        var bias = this.indexBase - this.indexStart;
        if (position < bias) {
          position += this.backing.length;
        }
        position -= bias;
        return this.backing.countAt(position);
      };
      Buckets2.prototype.incrementBucket = function(bucketIndex, increment) {
        this.backing.increment(bucketIndex, increment);
      };
      Buckets2.prototype.decrementBucket = function(bucketIndex, decrement) {
        this.backing.decrement(bucketIndex, decrement);
      };
      Buckets2.prototype.trim = function() {
        for (var i = 0; i < this.length; i++) {
          if (this.at(i) !== 0) {
            this.indexStart += i;
            break;
          } else if (i === this.length - 1) {
            this.indexStart = this.indexEnd = this.indexBase = 0;
            return;
          }
        }
        for (var i = this.length - 1; i >= 0; i--) {
          if (this.at(i) !== 0) {
            this.indexEnd -= this.length - i - 1;
            break;
          }
        }
        this._rotate();
      };
      Buckets2.prototype.downscale = function(by) {
        this._rotate();
        var size = 1 + this.indexEnd - this.indexStart;
        var each = 1 << by;
        var inpos = 0;
        var outpos = 0;
        for (var pos = this.indexStart; pos <= this.indexEnd; ) {
          var mod = pos % each;
          if (mod < 0) {
            mod += each;
          }
          for (var i = mod; i < each && inpos < size; i++) {
            this._relocateBucket(outpos, inpos);
            inpos++;
            pos++;
          }
          outpos++;
        }
        this.indexStart >>= by;
        this.indexEnd >>= by;
        this.indexBase = this.indexStart;
      };
      Buckets2.prototype.clone = function() {
        return new Buckets2(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd);
      };
      Buckets2.prototype._rotate = function() {
        var bias = this.indexBase - this.indexStart;
        if (bias === 0) {
          return;
        } else if (bias > 0) {
          this.backing.reverse(0, this.backing.length);
          this.backing.reverse(0, bias);
          this.backing.reverse(bias, this.backing.length);
        } else {
          this.backing.reverse(0, this.backing.length);
          this.backing.reverse(0, this.backing.length + bias);
        }
        this.indexBase = this.indexStart;
      };
      Buckets2.prototype._relocateBucket = function(dest, src) {
        if (dest === src) {
          return;
        }
        this.incrementBucket(dest, this.backing.emptyBucket(src));
      };
      return Buckets2;
    }()
  );
  var BucketsBacking = (
    /** @class */
    function() {
      function BucketsBacking2(_counts) {
        if (_counts === void 0) {
          _counts = [0];
        }
        this._counts = _counts;
      }
      Object.defineProperty(BucketsBacking2.prototype, "length", {
        /**
         * length returns the physical size of the backing array, which
         * is >= buckets.length()
         */
        get: function() {
          return this._counts.length;
        },
        enumerable: false,
        configurable: true
      });
      BucketsBacking2.prototype.countAt = function(pos) {
        return this._counts[pos];
      };
      BucketsBacking2.prototype.growTo = function(newSize, oldPositiveLimit, newPositiveLimit) {
        var tmp = new Array(newSize).fill(0);
        tmp.splice.apply(tmp, __spreadArray6([
          newPositiveLimit,
          this._counts.length - oldPositiveLimit
        ], __read7(this._counts.slice(oldPositiveLimit)), false));
        tmp.splice.apply(tmp, __spreadArray6([0, oldPositiveLimit], __read7(this._counts.slice(0, oldPositiveLimit)), false));
        this._counts = tmp;
      };
      BucketsBacking2.prototype.reverse = function(from, limit) {
        var num = Math.floor((from + limit) / 2) - from;
        for (var i = 0; i < num; i++) {
          var tmp = this._counts[from + i];
          this._counts[from + i] = this._counts[limit - i - 1];
          this._counts[limit - i - 1] = tmp;
        }
      };
      BucketsBacking2.prototype.emptyBucket = function(src) {
        var tmp = this._counts[src];
        this._counts[src] = 0;
        return tmp;
      };
      BucketsBacking2.prototype.increment = function(bucketIndex, increment) {
        this._counts[bucketIndex] += increment;
      };
      BucketsBacking2.prototype.decrement = function(bucketIndex, decrement) {
        if (this._counts[bucketIndex] >= decrement) {
          this._counts[bucketIndex] -= decrement;
        } else {
          this._counts[bucketIndex] = 0;
        }
      };
      BucketsBacking2.prototype.clone = function() {
        return new BucketsBacking2(__spreadArray6([], __read7(this._counts), false));
      };
      return BucketsBacking2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ieee754.js
  var SIGNIFICAND_WIDTH = 52;
  var EXPONENT_MASK = 2146435072;
  var SIGNIFICAND_MASK = 1048575;
  var EXPONENT_BIAS = 1023;
  var MIN_NORMAL_EXPONENT = -EXPONENT_BIAS + 1;
  var MAX_NORMAL_EXPONENT = EXPONENT_BIAS;
  var MIN_VALUE = Math.pow(2, -1022);
  function getNormalBase2(value) {
    var dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, value);
    var hiBits = dv.getUint32(0);
    var expBits = (hiBits & EXPONENT_MASK) >> 20;
    return expBits - EXPONENT_BIAS;
  }
  function getSignificand(value) {
    var dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, value);
    var hiBits = dv.getUint32(0);
    var loBits = dv.getUint32(4);
    var significandHiBits = (hiBits & SIGNIFICAND_MASK) * Math.pow(2, 32);
    return significandHiBits + loBits;
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/util.js
  function ldexp(frac, exp) {
    if (frac === 0 || frac === Number.POSITIVE_INFINITY || frac === Number.NEGATIVE_INFINITY || Number.isNaN(frac)) {
      return frac;
    }
    return frac * Math.pow(2, exp);
  }
  function nextGreaterSquare(v) {
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/types.js
  var __extends3 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var MappingError = (
    /** @class */
    function(_super) {
      __extends3(MappingError2, _super);
      function MappingError2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return MappingError2;
    }(Error)
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/ExponentMapping.js
  var ExponentMapping = (
    /** @class */
    function() {
      function ExponentMapping2(scale) {
        this._shift = -scale;
      }
      ExponentMapping2.prototype.mapToIndex = function(value) {
        if (value < MIN_VALUE) {
          return this._minNormalLowerBoundaryIndex();
        }
        var exp = getNormalBase2(value);
        var correction = this._rightShift(getSignificand(value) - 1, SIGNIFICAND_WIDTH);
        return exp + correction >> this._shift;
      };
      ExponentMapping2.prototype.lowerBoundary = function(index) {
        var minIndex = this._minNormalLowerBoundaryIndex();
        if (index < minIndex) {
          throw new MappingError("underflow: " + index + " is < minimum lower boundary: " + minIndex);
        }
        var maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index > maxIndex) {
          throw new MappingError("overflow: " + index + " is > maximum lower boundary: " + maxIndex);
        }
        return ldexp(1, index << this._shift);
      };
      Object.defineProperty(ExponentMapping2.prototype, "scale", {
        /**
         * The scale used by this mapping
         * @returns {number}
         */
        get: function() {
          if (this._shift === 0) {
            return 0;
          }
          return -this._shift;
        },
        enumerable: false,
        configurable: true
      });
      ExponentMapping2.prototype._minNormalLowerBoundaryIndex = function() {
        var index = MIN_NORMAL_EXPONENT >> this._shift;
        if (this._shift < 2) {
          index--;
        }
        return index;
      };
      ExponentMapping2.prototype._maxNormalLowerBoundaryIndex = function() {
        return MAX_NORMAL_EXPONENT >> this._shift;
      };
      ExponentMapping2.prototype._rightShift = function(value, shift) {
        return Math.floor(value * Math.pow(2, -shift));
      };
      return ExponentMapping2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/LogarithmMapping.js
  var LogarithmMapping = (
    /** @class */
    function() {
      function LogarithmMapping2(scale) {
        this._scale = scale;
        this._scaleFactor = ldexp(Math.LOG2E, scale);
        this._inverseFactor = ldexp(Math.LN2, -scale);
      }
      LogarithmMapping2.prototype.mapToIndex = function(value) {
        if (value <= MIN_VALUE) {
          return this._minNormalLowerBoundaryIndex() - 1;
        }
        if (getSignificand(value) === 0) {
          var exp = getNormalBase2(value);
          return (exp << this._scale) - 1;
        }
        var index = Math.floor(Math.log(value) * this._scaleFactor);
        var maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index >= maxIndex) {
          return maxIndex;
        }
        return index;
      };
      LogarithmMapping2.prototype.lowerBoundary = function(index) {
        var maxIndex = this._maxNormalLowerBoundaryIndex();
        if (index >= maxIndex) {
          if (index === maxIndex) {
            return 2 * Math.exp((index - (1 << this._scale)) / this._scaleFactor);
          }
          throw new MappingError("overflow: " + index + " is > maximum lower boundary: " + maxIndex);
        }
        var minIndex = this._minNormalLowerBoundaryIndex();
        if (index <= minIndex) {
          if (index === minIndex) {
            return MIN_VALUE;
          } else if (index === minIndex - 1) {
            return Math.exp((index + (1 << this._scale)) / this._scaleFactor) / 2;
          }
          throw new MappingError("overflow: " + index + " is < minimum lower boundary: " + minIndex);
        }
        return Math.exp(index * this._inverseFactor);
      };
      Object.defineProperty(LogarithmMapping2.prototype, "scale", {
        /**
         * The scale used by this mapping
         * @returns {number}
         */
        get: function() {
          return this._scale;
        },
        enumerable: false,
        configurable: true
      });
      LogarithmMapping2.prototype._minNormalLowerBoundaryIndex = function() {
        return MIN_NORMAL_EXPONENT << this._scale;
      };
      LogarithmMapping2.prototype._maxNormalLowerBoundaryIndex = function() {
        return (MAX_NORMAL_EXPONENT + 1 << this._scale) - 1;
      };
      return LogarithmMapping2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/exponential-histogram/mapping/getMapping.js
  var MIN_SCALE = -10;
  var MAX_SCALE = 20;
  var PREBUILT_MAPPINGS = Array.from({ length: 31 }, function(_, i) {
    if (i > 10) {
      return new LogarithmMapping(i - 10);
    }
    return new ExponentMapping(i - 10);
  });
  function getMapping(scale) {
    if (scale > MAX_SCALE || scale < MIN_SCALE) {
      throw new MappingError("expected scale >= " + MIN_SCALE + " && <= " + MAX_SCALE + ", got: " + scale);
    }
    return PREBUILT_MAPPINGS[scale + 10];
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/ExponentialHistogram.js
  var __read8 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var HighLow = (
    /** @class */
    function() {
      function HighLow2(low, high) {
        this.low = low;
        this.high = high;
      }
      HighLow2.combine = function(h1, h2) {
        return new HighLow2(Math.min(h1.low, h2.low), Math.max(h1.high, h2.high));
      };
      return HighLow2;
    }()
  );
  var MAX_SCALE2 = 20;
  var DEFAULT_MAX_SIZE = 160;
  var MIN_MAX_SIZE = 2;
  var ExponentialHistogramAccumulation = (
    /** @class */
    function() {
      function ExponentialHistogramAccumulation2(startTime, _maxSize, _recordMinMax, _sum, _count, _zeroCount, _min, _max, _positive, _negative, _mapping) {
        if (startTime === void 0) {
          startTime = startTime;
        }
        if (_maxSize === void 0) {
          _maxSize = DEFAULT_MAX_SIZE;
        }
        if (_recordMinMax === void 0) {
          _recordMinMax = true;
        }
        if (_sum === void 0) {
          _sum = 0;
        }
        if (_count === void 0) {
          _count = 0;
        }
        if (_zeroCount === void 0) {
          _zeroCount = 0;
        }
        if (_min === void 0) {
          _min = Number.POSITIVE_INFINITY;
        }
        if (_max === void 0) {
          _max = Number.NEGATIVE_INFINITY;
        }
        if (_positive === void 0) {
          _positive = new Buckets();
        }
        if (_negative === void 0) {
          _negative = new Buckets();
        }
        if (_mapping === void 0) {
          _mapping = getMapping(MAX_SCALE2);
        }
        this.startTime = startTime;
        this._maxSize = _maxSize;
        this._recordMinMax = _recordMinMax;
        this._sum = _sum;
        this._count = _count;
        this._zeroCount = _zeroCount;
        this._min = _min;
        this._max = _max;
        this._positive = _positive;
        this._negative = _negative;
        this._mapping = _mapping;
        if (this._maxSize < MIN_MAX_SIZE) {
          diag.warn("Exponential Histogram Max Size set to " + this._maxSize + ",                 changing to the minimum size of: " + MIN_MAX_SIZE);
          this._maxSize = MIN_MAX_SIZE;
        }
      }
      ExponentialHistogramAccumulation2.prototype.record = function(value) {
        this.updateByIncrement(value, 1);
      };
      ExponentialHistogramAccumulation2.prototype.setStartTime = function(startTime) {
        this.startTime = startTime;
      };
      ExponentialHistogramAccumulation2.prototype.toPointValue = function() {
        return {
          hasMinMax: this._recordMinMax,
          min: this.min,
          max: this.max,
          sum: this.sum,
          positive: {
            offset: this.positive.offset,
            bucketCounts: this.positive.counts()
          },
          negative: {
            offset: this.negative.offset,
            bucketCounts: this.negative.counts()
          },
          count: this.count,
          scale: this.scale,
          zeroCount: this.zeroCount
        };
      };
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "sum", {
        /**
         * @returns {Number} The sum of values recorded by this accumulation
         */
        get: function() {
          return this._sum;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "min", {
        /**
         * @returns {Number} The minimum value recorded by this accumulation
         */
        get: function() {
          return this._min;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "max", {
        /**
         * @returns {Number} The maximum value recorded by this accumulation
         */
        get: function() {
          return this._max;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "count", {
        /**
         * @returns {Number} The count of values recorded by this accumulation
         */
        get: function() {
          return this._count;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "zeroCount", {
        /**
         * @returns {Number} The number of 0 values recorded by this accumulation
         */
        get: function() {
          return this._zeroCount;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "scale", {
        /**
         * @returns {Number} The scale used by this accumulation
         */
        get: function() {
          if (this._count === this._zeroCount) {
            return 0;
          }
          return this._mapping.scale;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "positive", {
        /**
         * positive holds the positive values
         * @returns {Buckets}
         */
        get: function() {
          return this._positive;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ExponentialHistogramAccumulation2.prototype, "negative", {
        /**
         * negative holds the negative values by their absolute value
         * @returns {Buckets}
         */
        get: function() {
          return this._negative;
        },
        enumerable: false,
        configurable: true
      });
      ExponentialHistogramAccumulation2.prototype.updateByIncrement = function(value, increment) {
        if (Number.isNaN(value)) {
          return;
        }
        if (value > this._max) {
          this._max = value;
        }
        if (value < this._min) {
          this._min = value;
        }
        this._count += increment;
        if (value === 0) {
          this._zeroCount += increment;
          return;
        }
        this._sum += value * increment;
        if (value > 0) {
          this._updateBuckets(this._positive, value, increment);
        } else {
          this._updateBuckets(this._negative, -value, increment);
        }
      };
      ExponentialHistogramAccumulation2.prototype.merge = function(previous) {
        if (this._count === 0) {
          this._min = previous.min;
          this._max = previous.max;
        } else if (previous.count !== 0) {
          if (previous.min < this.min) {
            this._min = previous.min;
          }
          if (previous.max > this.max) {
            this._max = previous.max;
          }
        }
        this.startTime = previous.startTime;
        this._sum += previous.sum;
        this._count += previous.count;
        this._zeroCount += previous.zeroCount;
        var minScale = this._minScale(previous);
        this._downscale(this.scale - minScale);
        this._mergeBuckets(this.positive, previous, previous.positive, minScale);
        this._mergeBuckets(this.negative, previous, previous.negative, minScale);
      };
      ExponentialHistogramAccumulation2.prototype.diff = function(other) {
        this._min = Infinity;
        this._max = -Infinity;
        this._sum -= other.sum;
        this._count -= other.count;
        this._zeroCount -= other.zeroCount;
        var minScale = this._minScale(other);
        this._downscale(this.scale - minScale);
        this._diffBuckets(this.positive, other, other.positive, minScale);
        this._diffBuckets(this.negative, other, other.negative, minScale);
      };
      ExponentialHistogramAccumulation2.prototype.clone = function() {
        return new ExponentialHistogramAccumulation2(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping);
      };
      ExponentialHistogramAccumulation2.prototype._updateBuckets = function(buckets, value, increment) {
        var index = this._mapping.mapToIndex(value);
        var rescalingNeeded = false;
        var high = 0;
        var low = 0;
        if (buckets.length === 0) {
          buckets.indexStart = index;
          buckets.indexEnd = buckets.indexStart;
          buckets.indexBase = buckets.indexStart;
        } else if (index < buckets.indexStart && buckets.indexEnd - index >= this._maxSize) {
          rescalingNeeded = true;
          low = index;
          high = buckets.indexEnd;
        } else if (index > buckets.indexEnd && index - buckets.indexStart >= this._maxSize) {
          rescalingNeeded = true;
          low = buckets.indexStart;
          high = index;
        }
        if (rescalingNeeded) {
          var change = this._changeScale(high, low);
          this._downscale(change);
          index = this._mapping.mapToIndex(value);
        }
        this._incrementIndexBy(buckets, index, increment);
      };
      ExponentialHistogramAccumulation2.prototype._incrementIndexBy = function(buckets, index, increment) {
        if (increment === 0) {
          return;
        }
        if (buckets.length === 0) {
          buckets.indexStart = buckets.indexEnd = buckets.indexBase = index;
        }
        if (index < buckets.indexStart) {
          var span = buckets.indexEnd - index;
          if (span >= buckets.backing.length) {
            this._grow(buckets, span + 1);
          }
          buckets.indexStart = index;
        } else if (index > buckets.indexEnd) {
          var span = index - buckets.indexStart;
          if (span >= buckets.backing.length) {
            this._grow(buckets, span + 1);
          }
          buckets.indexEnd = index;
        }
        var bucketIndex = index - buckets.indexBase;
        if (bucketIndex < 0) {
          bucketIndex += buckets.backing.length;
        }
        buckets.incrementBucket(bucketIndex, increment);
      };
      ExponentialHistogramAccumulation2.prototype._grow = function(buckets, needed) {
        var size = buckets.backing.length;
        var bias = buckets.indexBase - buckets.indexStart;
        var oldPositiveLimit = size - bias;
        var newSize = nextGreaterSquare(needed);
        if (newSize > this._maxSize) {
          newSize = this._maxSize;
        }
        var newPositiveLimit = newSize - bias;
        buckets.backing.growTo(newSize, oldPositiveLimit, newPositiveLimit);
      };
      ExponentialHistogramAccumulation2.prototype._changeScale = function(high, low) {
        var change = 0;
        while (high - low >= this._maxSize) {
          high >>= 1;
          low >>= 1;
          change++;
        }
        return change;
      };
      ExponentialHistogramAccumulation2.prototype._downscale = function(change) {
        if (change === 0) {
          return;
        }
        if (change < 0) {
          throw new Error("impossible change of scale: " + this.scale);
        }
        var newScale = this._mapping.scale - change;
        this._positive.downscale(change);
        this._negative.downscale(change);
        this._mapping = getMapping(newScale);
      };
      ExponentialHistogramAccumulation2.prototype._minScale = function(other) {
        var minScale = Math.min(this.scale, other.scale);
        var highLowPos = HighLow.combine(this._highLowAtScale(this.positive, this.scale, minScale), this._highLowAtScale(other.positive, other.scale, minScale));
        var highLowNeg = HighLow.combine(this._highLowAtScale(this.negative, this.scale, minScale), this._highLowAtScale(other.negative, other.scale, minScale));
        return Math.min(minScale - this._changeScale(highLowPos.high, highLowPos.low), minScale - this._changeScale(highLowNeg.high, highLowNeg.low));
      };
      ExponentialHistogramAccumulation2.prototype._highLowAtScale = function(buckets, currentScale, newScale) {
        if (buckets.length === 0) {
          return new HighLow(0, -1);
        }
        var shift = currentScale - newScale;
        return new HighLow(buckets.indexStart >> shift, buckets.indexEnd >> shift);
      };
      ExponentialHistogramAccumulation2.prototype._mergeBuckets = function(ours, other, theirs, scale) {
        var theirOffset = theirs.offset;
        var theirChange = other.scale - scale;
        for (var i = 0; i < theirs.length; i++) {
          this._incrementIndexBy(ours, theirOffset + i >> theirChange, theirs.at(i));
        }
      };
      ExponentialHistogramAccumulation2.prototype._diffBuckets = function(ours, other, theirs, scale) {
        var theirOffset = theirs.offset;
        var theirChange = other.scale - scale;
        for (var i = 0; i < theirs.length; i++) {
          var ourIndex = theirOffset + i >> theirChange;
          var bucketIndex = ourIndex - ours.indexBase;
          if (bucketIndex < 0) {
            bucketIndex += ours.backing.length;
          }
          ours.decrementBucket(bucketIndex, theirs.at(i));
        }
        ours.trim();
      };
      return ExponentialHistogramAccumulation2;
    }()
  );
  var ExponentialHistogramAggregator = (
    /** @class */
    function() {
      function ExponentialHistogramAggregator2(_maxSize, _recordMinMax) {
        this._maxSize = _maxSize;
        this._recordMinMax = _recordMinMax;
        this.kind = AggregatorKind.EXPONENTIAL_HISTOGRAM;
      }
      ExponentialHistogramAggregator2.prototype.createAccumulation = function(startTime) {
        return new ExponentialHistogramAccumulation(startTime, this._maxSize, this._recordMinMax);
      };
      ExponentialHistogramAggregator2.prototype.merge = function(previous, delta) {
        var result = delta.clone();
        result.merge(previous);
        return result;
      };
      ExponentialHistogramAggregator2.prototype.diff = function(previous, current) {
        var result = current.clone();
        result.diff(previous);
        return result;
      };
      ExponentialHistogramAggregator2.prototype.toMetricData = function(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
          descriptor,
          aggregationTemporality,
          dataPointType: DataPointType.EXPONENTIAL_HISTOGRAM,
          dataPoints: accumulationByAttributes.map(function(_a2) {
            var _b = __read8(_a2, 2), attributes = _b[0], accumulation = _b[1];
            var pointValue = accumulation.toPointValue();
            var allowsNegativeValues = descriptor.type === InstrumentType.GAUGE || descriptor.type === InstrumentType.UP_DOWN_COUNTER || descriptor.type === InstrumentType.OBSERVABLE_GAUGE || descriptor.type === InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
            return {
              attributes,
              startTime: accumulation.startTime,
              endTime,
              value: {
                min: pointValue.hasMinMax ? pointValue.min : void 0,
                max: pointValue.hasMinMax ? pointValue.max : void 0,
                sum: !allowsNegativeValues ? pointValue.sum : void 0,
                positive: {
                  offset: pointValue.positive.offset,
                  bucketCounts: pointValue.positive.bucketCounts
                },
                negative: {
                  offset: pointValue.negative.offset,
                  bucketCounts: pointValue.negative.bucketCounts
                },
                count: pointValue.count,
                scale: pointValue.scale,
                zeroCount: pointValue.zeroCount
              }
            };
          })
        };
      };
      return ExponentialHistogramAggregator2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js
  var SUPPRESS_TRACING_KEY = createContextKey("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
  function suppressTracing(context2) {
    return context2.setValue(SUPPRESS_TRACING_KEY, true);
  }

  // node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js
  function loggingErrorHandler() {
    return function(ex) {
      diag.error(stringifyException(ex));
    };
  }
  function stringifyException(ex) {
    if (typeof ex === "string") {
      return ex;
    } else {
      return JSON.stringify(flattenException(ex));
    }
  }
  function flattenException(ex) {
    var result = {};
    var current = ex;
    while (current !== null) {
      Object.getOwnPropertyNames(current).forEach(function(propertyName) {
        if (result[propertyName])
          return;
        var value = current[propertyName];
        if (value) {
          result[propertyName] = String(value);
        }
      });
      current = Object.getPrototypeOf(current);
    }
    return result;
  }

  // node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js
  var delegateHandler = loggingErrorHandler();
  function globalErrorHandler(ex) {
    try {
      delegateHandler(ex);
    } catch (_a2) {
    }
  }

  // node_modules/@opentelemetry/core/build/esm/utils/sampling.js
  var TracesSamplerValues;
  (function(TracesSamplerValues2) {
    TracesSamplerValues2["AlwaysOff"] = "always_off";
    TracesSamplerValues2["AlwaysOn"] = "always_on";
    TracesSamplerValues2["ParentBasedAlwaysOff"] = "parentbased_always_off";
    TracesSamplerValues2["ParentBasedAlwaysOn"] = "parentbased_always_on";
    TracesSamplerValues2["ParentBasedTraceIdRatio"] = "parentbased_traceidratio";
    TracesSamplerValues2["TraceIdRatio"] = "traceidratio";
  })(TracesSamplerValues || (TracesSamplerValues = {}));

  // node_modules/@opentelemetry/core/build/esm/utils/environment.js
  var DEFAULT_LIST_SEPARATOR = ",";
  var ENVIRONMENT_BOOLEAN_KEYS = ["OTEL_SDK_DISABLED"];
  function isEnvVarABoolean(key) {
    return ENVIRONMENT_BOOLEAN_KEYS.indexOf(key) > -1;
  }
  var ENVIRONMENT_NUMBERS_KEYS = [
    "OTEL_BSP_EXPORT_TIMEOUT",
    "OTEL_BSP_MAX_EXPORT_BATCH_SIZE",
    "OTEL_BSP_MAX_QUEUE_SIZE",
    "OTEL_BSP_SCHEDULE_DELAY",
    "OTEL_BLRP_EXPORT_TIMEOUT",
    "OTEL_BLRP_MAX_EXPORT_BATCH_SIZE",
    "OTEL_BLRP_MAX_QUEUE_SIZE",
    "OTEL_BLRP_SCHEDULE_DELAY",
    "OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT",
    "OTEL_ATTRIBUTE_COUNT_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT",
    "OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT",
    "OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT",
    "OTEL_SPAN_EVENT_COUNT_LIMIT",
    "OTEL_SPAN_LINK_COUNT_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT",
    "OTEL_EXPORTER_OTLP_TIMEOUT",
    "OTEL_EXPORTER_OTLP_TRACES_TIMEOUT",
    "OTEL_EXPORTER_OTLP_METRICS_TIMEOUT",
    "OTEL_EXPORTER_OTLP_LOGS_TIMEOUT",
    "OTEL_EXPORTER_JAEGER_AGENT_PORT"
  ];
  function isEnvVarANumber(key) {
    return ENVIRONMENT_NUMBERS_KEYS.indexOf(key) > -1;
  }
  var ENVIRONMENT_LISTS_KEYS = [
    "OTEL_NO_PATCH_MODULES",
    "OTEL_PROPAGATORS",
    "OTEL_SEMCONV_STABILITY_OPT_IN"
  ];
  function isEnvVarAList(key) {
    return ENVIRONMENT_LISTS_KEYS.indexOf(key) > -1;
  }
  var DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
  var DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  var DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT = 128;
  var DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT = 128;
  var DEFAULT_ENVIRONMENT = {
    OTEL_SDK_DISABLED: false,
    CONTAINER_NAME: "",
    ECS_CONTAINER_METADATA_URI_V4: "",
    ECS_CONTAINER_METADATA_URI: "",
    HOSTNAME: "",
    KUBERNETES_SERVICE_HOST: "",
    NAMESPACE: "",
    OTEL_BSP_EXPORT_TIMEOUT: 3e4,
    OTEL_BSP_MAX_EXPORT_BATCH_SIZE: 512,
    OTEL_BSP_MAX_QUEUE_SIZE: 2048,
    OTEL_BSP_SCHEDULE_DELAY: 5e3,
    OTEL_BLRP_EXPORT_TIMEOUT: 3e4,
    OTEL_BLRP_MAX_EXPORT_BATCH_SIZE: 512,
    OTEL_BLRP_MAX_QUEUE_SIZE: 2048,
    OTEL_BLRP_SCHEDULE_DELAY: 5e3,
    OTEL_EXPORTER_JAEGER_AGENT_HOST: "",
    OTEL_EXPORTER_JAEGER_AGENT_PORT: 6832,
    OTEL_EXPORTER_JAEGER_ENDPOINT: "",
    OTEL_EXPORTER_JAEGER_PASSWORD: "",
    OTEL_EXPORTER_JAEGER_USER: "",
    OTEL_EXPORTER_OTLP_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_HEADERS: "",
    OTEL_EXPORTER_OTLP_TRACES_HEADERS: "",
    OTEL_EXPORTER_OTLP_METRICS_HEADERS: "",
    OTEL_EXPORTER_OTLP_LOGS_HEADERS: "",
    OTEL_EXPORTER_OTLP_TIMEOUT: 1e4,
    OTEL_EXPORTER_OTLP_TRACES_TIMEOUT: 1e4,
    OTEL_EXPORTER_OTLP_METRICS_TIMEOUT: 1e4,
    OTEL_EXPORTER_OTLP_LOGS_TIMEOUT: 1e4,
    OTEL_EXPORTER_ZIPKIN_ENDPOINT: "http://localhost:9411/api/v2/spans",
    OTEL_LOG_LEVEL: DiagLogLevel.INFO,
    OTEL_NO_PATCH_MODULES: [],
    OTEL_PROPAGATORS: ["tracecontext", "baggage"],
    OTEL_RESOURCE_ATTRIBUTES: "",
    OTEL_SERVICE_NAME: "",
    OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_SPAN_EVENT_COUNT_LIMIT: 128,
    OTEL_SPAN_LINK_COUNT_LIMIT: 128,
    OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT: DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
    OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT: DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT,
    OTEL_TRACES_EXPORTER: "",
    OTEL_TRACES_SAMPLER: TracesSamplerValues.ParentBasedAlwaysOn,
    OTEL_TRACES_SAMPLER_ARG: "",
    OTEL_LOGS_EXPORTER: "",
    OTEL_EXPORTER_OTLP_INSECURE: "",
    OTEL_EXPORTER_OTLP_TRACES_INSECURE: "",
    OTEL_EXPORTER_OTLP_METRICS_INSECURE: "",
    OTEL_EXPORTER_OTLP_LOGS_INSECURE: "",
    OTEL_EXPORTER_OTLP_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_TRACES_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_METRICS_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_LOGS_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_METRICS_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_LOGS_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: "cumulative",
    OTEL_SEMCONV_STABILITY_OPT_IN: []
  };
  function parseBoolean(key, environment, values) {
    if (typeof values[key] === "undefined") {
      return;
    }
    var value = String(values[key]);
    environment[key] = value.toLowerCase() === "true";
  }
  function parseNumber(name, environment, values, min, max) {
    if (min === void 0) {
      min = -Infinity;
    }
    if (max === void 0) {
      max = Infinity;
    }
    if (typeof values[name] !== "undefined") {
      var value = Number(values[name]);
      if (!isNaN(value)) {
        if (value < min) {
          environment[name] = min;
        } else if (value > max) {
          environment[name] = max;
        } else {
          environment[name] = value;
        }
      }
    }
  }
  function parseStringList(name, output, input, separator) {
    if (separator === void 0) {
      separator = DEFAULT_LIST_SEPARATOR;
    }
    var givenValue = input[name];
    if (typeof givenValue === "string") {
      output[name] = givenValue.split(separator).map(function(v) {
        return v.trim();
      });
    }
  }
  var logLevelMap = {
    ALL: DiagLogLevel.ALL,
    VERBOSE: DiagLogLevel.VERBOSE,
    DEBUG: DiagLogLevel.DEBUG,
    INFO: DiagLogLevel.INFO,
    WARN: DiagLogLevel.WARN,
    ERROR: DiagLogLevel.ERROR,
    NONE: DiagLogLevel.NONE
  };
  function setLogLevelFromEnv(key, environment, values) {
    var value = values[key];
    if (typeof value === "string") {
      var theLevel = logLevelMap[value.toUpperCase()];
      if (theLevel != null) {
        environment[key] = theLevel;
      }
    }
  }
  function parseEnvironment(values) {
    var environment = {};
    for (var env in DEFAULT_ENVIRONMENT) {
      var key = env;
      switch (key) {
        case "OTEL_LOG_LEVEL":
          setLogLevelFromEnv(key, environment, values);
          break;
        default:
          if (isEnvVarABoolean(key)) {
            parseBoolean(key, environment, values);
          } else if (isEnvVarANumber(key)) {
            parseNumber(key, environment, values);
          } else if (isEnvVarAList(key)) {
            parseStringList(key, environment, values);
          } else {
            var value = values[key];
            if (typeof value !== "undefined" && value !== null) {
              environment[key] = String(value);
            }
          }
      }
    }
    return environment;
  }

  // node_modules/@opentelemetry/core/build/esm/platform/browser/globalThis.js
  var _globalThis2 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/core/build/esm/platform/browser/environment.js
  function getEnv() {
    var globalEnv = parseEnvironment(_globalThis2);
    return Object.assign({}, DEFAULT_ENVIRONMENT, globalEnv);
  }

  // node_modules/@opentelemetry/core/build/esm/common/hex-to-binary.js
  function intValue(charCode) {
    if (charCode >= 48 && charCode <= 57) {
      return charCode - 48;
    }
    if (charCode >= 97 && charCode <= 102) {
      return charCode - 87;
    }
    return charCode - 55;
  }
  function hexToBinary(hexStr) {
    var buf = new Uint8Array(hexStr.length / 2);
    var offset = 0;
    for (var i = 0; i < hexStr.length; i += 2) {
      var hi = intValue(hexStr.charCodeAt(i));
      var lo = intValue(hexStr.charCodeAt(i + 1));
      buf[offset++] = hi << 4 | lo;
    }
    return buf;
  }

  // node_modules/@opentelemetry/core/build/esm/version.js
  var VERSION2 = "1.30.1";

  // node_modules/@opentelemetry/semantic-conventions/build/esm/resource/SemanticResourceAttributes.js
  var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
  var TMP_SERVICE_NAME = "service.name";
  var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
  var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
  var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
  var SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
  var SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
  var SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
  var SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
  var SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
  var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
  var TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;

  // node_modules/@opentelemetry/core/build/esm/platform/browser/sdk-info.js
  var _a;
  var SDK_INFO = (_a = {}, _a[SEMRESATTRS_TELEMETRY_SDK_NAME] = "opentelemetry", _a[SEMRESATTRS_PROCESS_RUNTIME_NAME] = "browser", _a[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE] = TELEMETRYSDKLANGUAGEVALUES_WEBJS, _a[SEMRESATTRS_TELEMETRY_SDK_VERSION] = VERSION2, _a);

  // node_modules/@opentelemetry/core/build/esm/platform/browser/timer-util.js
  function unrefTimer(_timer) {
  }

  // node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS = 9;
  var NANOSECOND_DIGITS_IN_MILLIS = 6;
  var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
  var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
  function millisToHrTime(epochMillis) {
    var epochSeconds = epochMillis / 1e3;
    var seconds = Math.trunc(epochSeconds);
    var nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS);
    return [seconds, nanos];
  }
  function hrTimeToNanoseconds(time) {
    return time[0] * SECOND_TO_NANOSECONDS + time[1];
  }
  function hrTimeToMicroseconds(time) {
    return time[0] * 1e6 + time[1] / 1e3;
  }

  // node_modules/@opentelemetry/core/build/esm/ExportResult.js
  var ExportResultCode;
  (function(ExportResultCode2) {
    ExportResultCode2[ExportResultCode2["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode2[ExportResultCode2["FAILED"] = 1] = "FAILED";
  })(ExportResultCode || (ExportResultCode = {}));

  // node_modules/@opentelemetry/core/build/esm/internal/exporter.js
  function _export(exporter, arg) {
    return new Promise(function(resolve) {
      context.with(suppressTracing(context.active()), function() {
        exporter.export(arg, function(result) {
          resolve(result);
        });
      });
    });
  }

  // node_modules/@opentelemetry/core/build/esm/index.js
  var internal = {
    _export
  };

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/LastValue.js
  var __read9 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var LastValueAccumulation = (
    /** @class */
    function() {
      function LastValueAccumulation2(startTime, _current, sampleTime) {
        if (_current === void 0) {
          _current = 0;
        }
        if (sampleTime === void 0) {
          sampleTime = [0, 0];
        }
        this.startTime = startTime;
        this._current = _current;
        this.sampleTime = sampleTime;
      }
      LastValueAccumulation2.prototype.record = function(value) {
        this._current = value;
        this.sampleTime = millisToHrTime(Date.now());
      };
      LastValueAccumulation2.prototype.setStartTime = function(startTime) {
        this.startTime = startTime;
      };
      LastValueAccumulation2.prototype.toPointValue = function() {
        return this._current;
      };
      return LastValueAccumulation2;
    }()
  );
  var LastValueAggregator = (
    /** @class */
    function() {
      function LastValueAggregator2() {
        this.kind = AggregatorKind.LAST_VALUE;
      }
      LastValueAggregator2.prototype.createAccumulation = function(startTime) {
        return new LastValueAccumulation(startTime);
      };
      LastValueAggregator2.prototype.merge = function(previous, delta) {
        var latestAccumulation = hrTimeToMicroseconds(delta.sampleTime) >= hrTimeToMicroseconds(previous.sampleTime) ? delta : previous;
        return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
      };
      LastValueAggregator2.prototype.diff = function(previous, current) {
        var latestAccumulation = hrTimeToMicroseconds(current.sampleTime) >= hrTimeToMicroseconds(previous.sampleTime) ? current : previous;
        return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
      };
      LastValueAggregator2.prototype.toMetricData = function(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
          descriptor,
          aggregationTemporality,
          dataPointType: DataPointType.GAUGE,
          dataPoints: accumulationByAttributes.map(function(_a2) {
            var _b = __read9(_a2, 2), attributes = _b[0], accumulation = _b[1];
            return {
              attributes,
              startTime: accumulation.startTime,
              endTime,
              value: accumulation.toPointValue()
            };
          })
        };
      };
      return LastValueAggregator2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/aggregator/Sum.js
  var __read10 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var SumAccumulation = (
    /** @class */
    function() {
      function SumAccumulation2(startTime, monotonic, _current, reset) {
        if (_current === void 0) {
          _current = 0;
        }
        if (reset === void 0) {
          reset = false;
        }
        this.startTime = startTime;
        this.monotonic = monotonic;
        this._current = _current;
        this.reset = reset;
      }
      SumAccumulation2.prototype.record = function(value) {
        if (this.monotonic && value < 0) {
          return;
        }
        this._current += value;
      };
      SumAccumulation2.prototype.setStartTime = function(startTime) {
        this.startTime = startTime;
      };
      SumAccumulation2.prototype.toPointValue = function() {
        return this._current;
      };
      return SumAccumulation2;
    }()
  );
  var SumAggregator = (
    /** @class */
    function() {
      function SumAggregator2(monotonic) {
        this.monotonic = monotonic;
        this.kind = AggregatorKind.SUM;
      }
      SumAggregator2.prototype.createAccumulation = function(startTime) {
        return new SumAccumulation(startTime, this.monotonic);
      };
      SumAggregator2.prototype.merge = function(previous, delta) {
        var prevPv = previous.toPointValue();
        var deltaPv = delta.toPointValue();
        if (delta.reset) {
          return new SumAccumulation(delta.startTime, this.monotonic, deltaPv, delta.reset);
        }
        return new SumAccumulation(previous.startTime, this.monotonic, prevPv + deltaPv);
      };
      SumAggregator2.prototype.diff = function(previous, current) {
        var prevPv = previous.toPointValue();
        var currPv = current.toPointValue();
        if (this.monotonic && prevPv > currPv) {
          return new SumAccumulation(current.startTime, this.monotonic, currPv, true);
        }
        return new SumAccumulation(current.startTime, this.monotonic, currPv - prevPv);
      };
      SumAggregator2.prototype.toMetricData = function(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
          descriptor,
          aggregationTemporality,
          dataPointType: DataPointType.SUM,
          dataPoints: accumulationByAttributes.map(function(_a2) {
            var _b = __read10(_a2, 2), attributes = _b[0], accumulation = _b[1];
            return {
              attributes,
              startTime: accumulation.startTime,
              endTime,
              value: accumulation.toPointValue()
            };
          }),
          isMonotonic: this.monotonic
        };
      };
      return SumAggregator2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/view/Aggregation.js
  var __extends4 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var Aggregation = (
    /** @class */
    function() {
      function Aggregation2() {
      }
      Aggregation2.Drop = function() {
        return DROP_AGGREGATION;
      };
      Aggregation2.Sum = function() {
        return SUM_AGGREGATION;
      };
      Aggregation2.LastValue = function() {
        return LAST_VALUE_AGGREGATION;
      };
      Aggregation2.Histogram = function() {
        return HISTOGRAM_AGGREGATION;
      };
      Aggregation2.ExponentialHistogram = function() {
        return EXPONENTIAL_HISTOGRAM_AGGREGATION;
      };
      Aggregation2.Default = function() {
        return DEFAULT_AGGREGATION;
      };
      return Aggregation2;
    }()
  );
  var DropAggregation = (
    /** @class */
    function(_super) {
      __extends4(DropAggregation2, _super);
      function DropAggregation2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      DropAggregation2.prototype.createAggregator = function(_instrument) {
        return DropAggregation2.DEFAULT_INSTANCE;
      };
      DropAggregation2.DEFAULT_INSTANCE = new DropAggregator();
      return DropAggregation2;
    }(Aggregation)
  );
  var SumAggregation = (
    /** @class */
    function(_super) {
      __extends4(SumAggregation2, _super);
      function SumAggregation2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      SumAggregation2.prototype.createAggregator = function(instrument) {
        switch (instrument.type) {
          case InstrumentType.COUNTER:
          case InstrumentType.OBSERVABLE_COUNTER:
          case InstrumentType.HISTOGRAM: {
            return SumAggregation2.MONOTONIC_INSTANCE;
          }
          default: {
            return SumAggregation2.NON_MONOTONIC_INSTANCE;
          }
        }
      };
      SumAggregation2.MONOTONIC_INSTANCE = new SumAggregator(true);
      SumAggregation2.NON_MONOTONIC_INSTANCE = new SumAggregator(false);
      return SumAggregation2;
    }(Aggregation)
  );
  var LastValueAggregation = (
    /** @class */
    function(_super) {
      __extends4(LastValueAggregation2, _super);
      function LastValueAggregation2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      LastValueAggregation2.prototype.createAggregator = function(_instrument) {
        return LastValueAggregation2.DEFAULT_INSTANCE;
      };
      LastValueAggregation2.DEFAULT_INSTANCE = new LastValueAggregator();
      return LastValueAggregation2;
    }(Aggregation)
  );
  var HistogramAggregation = (
    /** @class */
    function(_super) {
      __extends4(HistogramAggregation2, _super);
      function HistogramAggregation2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      HistogramAggregation2.prototype.createAggregator = function(_instrument) {
        return HistogramAggregation2.DEFAULT_INSTANCE;
      };
      HistogramAggregation2.DEFAULT_INSTANCE = new HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1e3, 2500, 5e3, 7500, 1e4], true);
      return HistogramAggregation2;
    }(Aggregation)
  );
  var ExplicitBucketHistogramAggregation = (
    /** @class */
    function(_super) {
      __extends4(ExplicitBucketHistogramAggregation2, _super);
      function ExplicitBucketHistogramAggregation2(boundaries, _recordMinMax) {
        if (_recordMinMax === void 0) {
          _recordMinMax = true;
        }
        var _this = _super.call(this) || this;
        _this._recordMinMax = _recordMinMax;
        if (boundaries == null) {
          throw new Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
        }
        boundaries = boundaries.concat();
        boundaries = boundaries.sort(function(a, b) {
          return a - b;
        });
        var minusInfinityIndex = boundaries.lastIndexOf(-Infinity);
        var infinityIndex = boundaries.indexOf(Infinity);
        if (infinityIndex === -1) {
          infinityIndex = void 0;
        }
        _this._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex);
        return _this;
      }
      ExplicitBucketHistogramAggregation2.prototype.createAggregator = function(_instrument) {
        return new HistogramAggregator(this._boundaries, this._recordMinMax);
      };
      return ExplicitBucketHistogramAggregation2;
    }(Aggregation)
  );
  var ExponentialHistogramAggregation = (
    /** @class */
    function(_super) {
      __extends4(ExponentialHistogramAggregation2, _super);
      function ExponentialHistogramAggregation2(_maxSize, _recordMinMax) {
        if (_maxSize === void 0) {
          _maxSize = 160;
        }
        if (_recordMinMax === void 0) {
          _recordMinMax = true;
        }
        var _this = _super.call(this) || this;
        _this._maxSize = _maxSize;
        _this._recordMinMax = _recordMinMax;
        return _this;
      }
      ExponentialHistogramAggregation2.prototype.createAggregator = function(_instrument) {
        return new ExponentialHistogramAggregator(this._maxSize, this._recordMinMax);
      };
      return ExponentialHistogramAggregation2;
    }(Aggregation)
  );
  var DefaultAggregation = (
    /** @class */
    function(_super) {
      __extends4(DefaultAggregation2, _super);
      function DefaultAggregation2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      DefaultAggregation2.prototype._resolve = function(instrument) {
        switch (instrument.type) {
          case InstrumentType.COUNTER:
          case InstrumentType.UP_DOWN_COUNTER:
          case InstrumentType.OBSERVABLE_COUNTER:
          case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER: {
            return SUM_AGGREGATION;
          }
          case InstrumentType.GAUGE:
          case InstrumentType.OBSERVABLE_GAUGE: {
            return LAST_VALUE_AGGREGATION;
          }
          case InstrumentType.HISTOGRAM: {
            if (instrument.advice.explicitBucketBoundaries) {
              return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
            }
            return HISTOGRAM_AGGREGATION;
          }
        }
        diag.warn("Unable to recognize instrument type: " + instrument.type);
        return DROP_AGGREGATION;
      };
      DefaultAggregation2.prototype.createAggregator = function(instrument) {
        return this._resolve(instrument).createAggregator(instrument);
      };
      return DefaultAggregation2;
    }(Aggregation)
  );
  var DROP_AGGREGATION = new DropAggregation();
  var SUM_AGGREGATION = new SumAggregation();
  var LAST_VALUE_AGGREGATION = new LastValueAggregation();
  var HISTOGRAM_AGGREGATION = new HistogramAggregation();
  var EXPONENTIAL_HISTOGRAM_AGGREGATION = new ExponentialHistogramAggregation();
  var DEFAULT_AGGREGATION = new DefaultAggregation();

  // node_modules/@opentelemetry/sdk-metrics/build/esm/export/AggregationSelector.js
  var DEFAULT_AGGREGATION_SELECTOR = function(_instrumentType) {
    return Aggregation.Default();
  };
  var DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = function(_instrumentType) {
    return AggregationTemporality.CUMULATIVE;
  };

  // node_modules/@opentelemetry/sdk-metrics/build/esm/export/MetricReader.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator2 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read11 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray7 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var MetricReader = (
    /** @class */
    function() {
      function MetricReader2(options) {
        var _a2, _b, _c;
        this._shutdown = false;
        this._aggregationSelector = (_a2 = options === null || options === void 0 ? void 0 : options.aggregationSelector) !== null && _a2 !== void 0 ? _a2 : DEFAULT_AGGREGATION_SELECTOR;
        this._aggregationTemporalitySelector = (_b = options === null || options === void 0 ? void 0 : options.aggregationTemporalitySelector) !== null && _b !== void 0 ? _b : DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
        this._metricProducers = (_c = options === null || options === void 0 ? void 0 : options.metricProducers) !== null && _c !== void 0 ? _c : [];
        this._cardinalitySelector = options === null || options === void 0 ? void 0 : options.cardinalitySelector;
      }
      MetricReader2.prototype.setMetricProducer = function(metricProducer) {
        if (this._sdkMetricProducer) {
          throw new Error("MetricReader can not be bound to a MeterProvider again.");
        }
        this._sdkMetricProducer = metricProducer;
        this.onInitialized();
      };
      MetricReader2.prototype.selectAggregation = function(instrumentType) {
        return this._aggregationSelector(instrumentType);
      };
      MetricReader2.prototype.selectAggregationTemporality = function(instrumentType) {
        return this._aggregationTemporalitySelector(instrumentType);
      };
      MetricReader2.prototype.selectCardinalityLimit = function(instrumentType) {
        return this._cardinalitySelector ? this._cardinalitySelector(instrumentType) : 2e3;
      };
      MetricReader2.prototype.onInitialized = function() {
      };
      MetricReader2.prototype.collect = function(options) {
        return __awaiter2(this, void 0, void 0, function() {
          var _a2, sdkCollectionResults, additionalCollectionResults, errors, resource, scopeMetrics;
          return __generator2(this, function(_b) {
            switch (_b.label) {
              case 0:
                if (this._sdkMetricProducer === void 0) {
                  throw new Error("MetricReader is not bound to a MetricProducer");
                }
                if (this._shutdown) {
                  throw new Error("MetricReader is shutdown");
                }
                return [4, Promise.all(__spreadArray7([
                  this._sdkMetricProducer.collect({
                    timeoutMillis: options === null || options === void 0 ? void 0 : options.timeoutMillis
                  })
                ], __read11(this._metricProducers.map(function(producer) {
                  return producer.collect({
                    timeoutMillis: options === null || options === void 0 ? void 0 : options.timeoutMillis
                  });
                })), false))];
              case 1:
                _a2 = __read11.apply(void 0, [_b.sent()]), sdkCollectionResults = _a2[0], additionalCollectionResults = _a2.slice(1);
                errors = sdkCollectionResults.errors.concat(FlatMap(additionalCollectionResults, function(result) {
                  return result.errors;
                }));
                resource = sdkCollectionResults.resourceMetrics.resource;
                scopeMetrics = sdkCollectionResults.resourceMetrics.scopeMetrics.concat(FlatMap(additionalCollectionResults, function(result) {
                  return result.resourceMetrics.scopeMetrics;
                }));
                return [2, {
                  resourceMetrics: {
                    resource,
                    scopeMetrics
                  },
                  errors
                }];
            }
          });
        });
      };
      MetricReader2.prototype.shutdown = function(options) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (this._shutdown) {
                  diag.error("Cannot call shutdown twice.");
                  return [
                    2
                    /*return*/
                  ];
                }
                if (!((options === null || options === void 0 ? void 0 : options.timeoutMillis) == null))
                  return [3, 2];
                return [4, this.onShutdown()];
              case 1:
                _a2.sent();
                return [3, 4];
              case 2:
                return [4, callWithTimeout(this.onShutdown(), options.timeoutMillis)];
              case 3:
                _a2.sent();
                _a2.label = 4;
              case 4:
                this._shutdown = true;
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      MetricReader2.prototype.forceFlush = function(options) {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (this._shutdown) {
                  diag.warn("Cannot forceFlush on already shutdown MetricReader.");
                  return [
                    2
                    /*return*/
                  ];
                }
                if (!((options === null || options === void 0 ? void 0 : options.timeoutMillis) == null))
                  return [3, 2];
                return [4, this.onForceFlush()];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
              case 2:
                return [4, callWithTimeout(this.onForceFlush(), options.timeoutMillis)];
              case 3:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return MetricReader2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/export/PeriodicExportingMetricReader.js
  var __extends5 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator3 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read12 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray8 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var PeriodicExportingMetricReader = (
    /** @class */
    function(_super) {
      __extends5(PeriodicExportingMetricReader2, _super);
      function PeriodicExportingMetricReader2(options) {
        var _a2, _b, _c, _d;
        var _this = _super.call(this, {
          aggregationSelector: (_a2 = options.exporter.selectAggregation) === null || _a2 === void 0 ? void 0 : _a2.bind(options.exporter),
          aggregationTemporalitySelector: (_b = options.exporter.selectAggregationTemporality) === null || _b === void 0 ? void 0 : _b.bind(options.exporter),
          metricProducers: options.metricProducers
        }) || this;
        if (options.exportIntervalMillis !== void 0 && options.exportIntervalMillis <= 0) {
          throw Error("exportIntervalMillis must be greater than 0");
        }
        if (options.exportTimeoutMillis !== void 0 && options.exportTimeoutMillis <= 0) {
          throw Error("exportTimeoutMillis must be greater than 0");
        }
        if (options.exportTimeoutMillis !== void 0 && options.exportIntervalMillis !== void 0 && options.exportIntervalMillis < options.exportTimeoutMillis) {
          throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
        }
        _this._exportInterval = (_c = options.exportIntervalMillis) !== null && _c !== void 0 ? _c : 6e4;
        _this._exportTimeout = (_d = options.exportTimeoutMillis) !== null && _d !== void 0 ? _d : 3e4;
        _this._exporter = options.exporter;
        return _this;
      }
      PeriodicExportingMetricReader2.prototype._runOnce = function() {
        return __awaiter3(this, void 0, void 0, function() {
          var err_1;
          return __generator3(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                _a2.trys.push([0, 2, , 3]);
                return [4, callWithTimeout(this._doRun(), this._exportTimeout)];
              case 1:
                _a2.sent();
                return [3, 3];
              case 2:
                err_1 = _a2.sent();
                if (err_1 instanceof TimeoutError) {
                  diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
                  return [
                    2
                    /*return*/
                  ];
                }
                globalErrorHandler(err_1);
                return [3, 3];
              case 3:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      PeriodicExportingMetricReader2.prototype._doRun = function() {
        var _a2, _b;
        return __awaiter3(this, void 0, void 0, function() {
          var _c, resourceMetrics, errors, e_1, result;
          var _d;
          return __generator3(this, function(_e) {
            switch (_e.label) {
              case 0:
                return [4, this.collect({
                  timeoutMillis: this._exportTimeout
                })];
              case 1:
                _c = _e.sent(), resourceMetrics = _c.resourceMetrics, errors = _c.errors;
                if (errors.length > 0) {
                  (_d = diag).error.apply(_d, __spreadArray8(["PeriodicExportingMetricReader: metrics collection errors"], __read12(errors), false));
                }
                if (!resourceMetrics.resource.asyncAttributesPending)
                  return [3, 5];
                _e.label = 2;
              case 2:
                _e.trys.push([2, 4, , 5]);
                return [4, (_b = (_a2 = resourceMetrics.resource).waitForAsyncAttributes) === null || _b === void 0 ? void 0 : _b.call(_a2)];
              case 3:
                _e.sent();
                return [3, 5];
              case 4:
                e_1 = _e.sent();
                diag.debug("Error while resolving async portion of resource: ", e_1);
                globalErrorHandler(e_1);
                return [3, 5];
              case 5:
                if (resourceMetrics.scopeMetrics.length === 0) {
                  return [
                    2
                    /*return*/
                  ];
                }
                return [4, internal._export(this._exporter, resourceMetrics)];
              case 6:
                result = _e.sent();
                if (result.code !== ExportResultCode.SUCCESS) {
                  throw new Error("PeriodicExportingMetricReader: metrics export failed (error " + result.error + ")");
                }
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      PeriodicExportingMetricReader2.prototype.onInitialized = function() {
        var _this = this;
        this._interval = setInterval(function() {
          void _this._runOnce();
        }, this._exportInterval);
        unrefTimer(this._interval);
      };
      PeriodicExportingMetricReader2.prototype.onForceFlush = function() {
        return __awaiter3(this, void 0, void 0, function() {
          return __generator3(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                return [4, this._runOnce()];
              case 1:
                _a2.sent();
                return [4, this._exporter.forceFlush()];
              case 2:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      PeriodicExportingMetricReader2.prototype.onShutdown = function() {
        return __awaiter3(this, void 0, void 0, function() {
          return __generator3(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (this._interval) {
                  clearInterval(this._interval);
                }
                return [4, this.onForceFlush()];
              case 1:
                _a2.sent();
                return [4, this._exporter.shutdown()];
              case 2:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return PeriodicExportingMetricReader2;
    }(MetricReader)
  );

  // node_modules/@opentelemetry/resources/build/esm/platform/browser/default-service-name.js
  function defaultServiceName() {
    return "unknown_service";
  }

  // node_modules/@opentelemetry/resources/build/esm/Resource.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __awaiter4 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator4 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read13 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var Resource = (
    /** @class */
    function() {
      function Resource2(attributes, asyncAttributesPromise) {
        var _this = this;
        var _a2;
        this._attributes = attributes;
        this.asyncAttributesPending = asyncAttributesPromise != null;
        this._syncAttributes = (_a2 = this._attributes) !== null && _a2 !== void 0 ? _a2 : {};
        this._asyncAttributesPromise = asyncAttributesPromise === null || asyncAttributesPromise === void 0 ? void 0 : asyncAttributesPromise.then(function(asyncAttributes) {
          _this._attributes = Object.assign({}, _this._attributes, asyncAttributes);
          _this.asyncAttributesPending = false;
          return asyncAttributes;
        }, function(err) {
          diag.debug("a resource's async attributes promise rejected: %s", err);
          _this.asyncAttributesPending = false;
          return {};
        });
      }
      Resource2.empty = function() {
        return Resource2.EMPTY;
      };
      Resource2.default = function() {
        var _a2;
        return new Resource2((_a2 = {}, _a2[SEMRESATTRS_SERVICE_NAME] = defaultServiceName(), _a2[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE], _a2[SEMRESATTRS_TELEMETRY_SDK_NAME] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_NAME], _a2[SEMRESATTRS_TELEMETRY_SDK_VERSION] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_VERSION], _a2));
      };
      Object.defineProperty(Resource2.prototype, "attributes", {
        get: function() {
          var _a2;
          if (this.asyncAttributesPending) {
            diag.error("Accessing resource attributes before async attributes settled");
          }
          return (_a2 = this._attributes) !== null && _a2 !== void 0 ? _a2 : {};
        },
        enumerable: false,
        configurable: true
      });
      Resource2.prototype.waitForAsyncAttributes = function() {
        return __awaiter4(this, void 0, void 0, function() {
          return __generator4(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (!this.asyncAttributesPending)
                  return [3, 2];
                return [4, this._asyncAttributesPromise];
              case 1:
                _a2.sent();
                _a2.label = 2;
              case 2:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Resource2.prototype.merge = function(other) {
        var _this = this;
        var _a2;
        if (!other)
          return this;
        var mergedSyncAttributes = __assign(__assign({}, this._syncAttributes), (_a2 = other._syncAttributes) !== null && _a2 !== void 0 ? _a2 : other.attributes);
        if (!this._asyncAttributesPromise && !other._asyncAttributesPromise) {
          return new Resource2(mergedSyncAttributes);
        }
        var mergedAttributesPromise = Promise.all([
          this._asyncAttributesPromise,
          other._asyncAttributesPromise
        ]).then(function(_a3) {
          var _b;
          var _c = __read13(_a3, 2), thisAsyncAttributes = _c[0], otherAsyncAttributes = _c[1];
          return __assign(__assign(__assign(__assign({}, _this._syncAttributes), thisAsyncAttributes), (_b = other._syncAttributes) !== null && _b !== void 0 ? _b : other.attributes), otherAsyncAttributes);
        });
        return new Resource2(mergedSyncAttributes, mergedAttributesPromise);
      };
      Resource2.EMPTY = new Resource2({});
      return Resource2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/view/ViewRegistry.js
  var ViewRegistry = (
    /** @class */
    function() {
      function ViewRegistry2() {
        this._registeredViews = [];
      }
      ViewRegistry2.prototype.addView = function(view) {
        this._registeredViews.push(view);
      };
      ViewRegistry2.prototype.findViews = function(instrument, meter2) {
        var _this = this;
        var views = this._registeredViews.filter(function(registeredView) {
          return _this._matchInstrument(registeredView.instrumentSelector, instrument) && _this._matchMeter(registeredView.meterSelector, meter2);
        });
        return views;
      };
      ViewRegistry2.prototype._matchInstrument = function(selector, instrument) {
        return (selector.getType() === void 0 || instrument.type === selector.getType()) && selector.getNameFilter().match(instrument.name) && selector.getUnitFilter().match(instrument.unit);
      };
      ViewRegistry2.prototype._matchMeter = function(selector, meter2) {
        return selector.getNameFilter().match(meter2.name) && (meter2.version === void 0 || selector.getVersionFilter().match(meter2.version)) && (meter2.schemaUrl === void 0 || selector.getSchemaUrlFilter().match(meter2.schemaUrl));
      };
      return ViewRegistry2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/Instruments.js
  var __extends6 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var SyncInstrument = (
    /** @class */
    function() {
      function SyncInstrument2(_writableMetricStorage, _descriptor) {
        this._writableMetricStorage = _writableMetricStorage;
        this._descriptor = _descriptor;
      }
      SyncInstrument2.prototype._record = function(value, attributes, context2) {
        if (attributes === void 0) {
          attributes = {};
        }
        if (context2 === void 0) {
          context2 = context.active();
        }
        if (typeof value !== "number") {
          diag.warn("non-number value provided to metric " + this._descriptor.name + ": " + value);
          return;
        }
        if (this._descriptor.valueType === ValueType.INT && !Number.isInteger(value)) {
          diag.warn("INT value type cannot accept a floating-point value for " + this._descriptor.name + ", ignoring the fractional digits.");
          value = Math.trunc(value);
          if (!Number.isInteger(value)) {
            return;
          }
        }
        this._writableMetricStorage.record(value, attributes, context2, millisToHrTime(Date.now()));
      };
      return SyncInstrument2;
    }()
  );
  var UpDownCounterInstrument = (
    /** @class */
    function(_super) {
      __extends6(UpDownCounterInstrument2, _super);
      function UpDownCounterInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      UpDownCounterInstrument2.prototype.add = function(value, attributes, ctx) {
        this._record(value, attributes, ctx);
      };
      return UpDownCounterInstrument2;
    }(SyncInstrument)
  );
  var CounterInstrument = (
    /** @class */
    function(_super) {
      __extends6(CounterInstrument2, _super);
      function CounterInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      CounterInstrument2.prototype.add = function(value, attributes, ctx) {
        if (value < 0) {
          diag.warn("negative value provided to counter " + this._descriptor.name + ": " + value);
          return;
        }
        this._record(value, attributes, ctx);
      };
      return CounterInstrument2;
    }(SyncInstrument)
  );
  var GaugeInstrument = (
    /** @class */
    function(_super) {
      __extends6(GaugeInstrument2, _super);
      function GaugeInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      GaugeInstrument2.prototype.record = function(value, attributes, ctx) {
        this._record(value, attributes, ctx);
      };
      return GaugeInstrument2;
    }(SyncInstrument)
  );
  var HistogramInstrument = (
    /** @class */
    function(_super) {
      __extends6(HistogramInstrument2, _super);
      function HistogramInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      HistogramInstrument2.prototype.record = function(value, attributes, ctx) {
        if (value < 0) {
          diag.warn("negative value provided to histogram " + this._descriptor.name + ": " + value);
          return;
        }
        this._record(value, attributes, ctx);
      };
      return HistogramInstrument2;
    }(SyncInstrument)
  );
  var ObservableInstrument = (
    /** @class */
    function() {
      function ObservableInstrument2(descriptor, metricStorages, _observableRegistry) {
        this._observableRegistry = _observableRegistry;
        this._descriptor = descriptor;
        this._metricStorages = metricStorages;
      }
      ObservableInstrument2.prototype.addCallback = function(callback) {
        this._observableRegistry.addCallback(callback, this);
      };
      ObservableInstrument2.prototype.removeCallback = function(callback) {
        this._observableRegistry.removeCallback(callback, this);
      };
      return ObservableInstrument2;
    }()
  );
  var ObservableCounterInstrument = (
    /** @class */
    function(_super) {
      __extends6(ObservableCounterInstrument2, _super);
      function ObservableCounterInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return ObservableCounterInstrument2;
    }(ObservableInstrument)
  );
  var ObservableGaugeInstrument = (
    /** @class */
    function(_super) {
      __extends6(ObservableGaugeInstrument2, _super);
      function ObservableGaugeInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return ObservableGaugeInstrument2;
    }(ObservableInstrument)
  );
  var ObservableUpDownCounterInstrument = (
    /** @class */
    function(_super) {
      __extends6(ObservableUpDownCounterInstrument2, _super);
      function ObservableUpDownCounterInstrument2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return ObservableUpDownCounterInstrument2;
    }(ObservableInstrument)
  );
  function isObservableInstrument(it) {
    return it instanceof ObservableInstrument;
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/Meter.js
  var Meter = (
    /** @class */
    function() {
      function Meter2(_meterSharedState) {
        this._meterSharedState = _meterSharedState;
      }
      Meter2.prototype.createGauge = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.GAUGE, options);
        var storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new GaugeInstrument(storage, descriptor);
      };
      Meter2.prototype.createHistogram = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.HISTOGRAM, options);
        var storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new HistogramInstrument(storage, descriptor);
      };
      Meter2.prototype.createCounter = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.COUNTER, options);
        var storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new CounterInstrument(storage, descriptor);
      };
      Meter2.prototype.createUpDownCounter = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.UP_DOWN_COUNTER, options);
        var storage = this._meterSharedState.registerMetricStorage(descriptor);
        return new UpDownCounterInstrument(storage, descriptor);
      };
      Meter2.prototype.createObservableGauge = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.OBSERVABLE_GAUGE, options);
        var storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
        return new ObservableGaugeInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
      };
      Meter2.prototype.createObservableCounter = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.OBSERVABLE_COUNTER, options);
        var storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
        return new ObservableCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
      };
      Meter2.prototype.createObservableUpDownCounter = function(name, options) {
        var descriptor = createInstrumentDescriptor(name, InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, options);
        var storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
        return new ObservableUpDownCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
      };
      Meter2.prototype.addBatchObservableCallback = function(callback, observables) {
        this._meterSharedState.observableRegistry.addBatchCallback(callback, observables);
      };
      Meter2.prototype.removeBatchObservableCallback = function(callback, observables) {
        this._meterSharedState.observableRegistry.removeBatchCallback(callback, observables);
      };
      return Meter2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorage.js
  var MetricStorage = (
    /** @class */
    function() {
      function MetricStorage2(_instrumentDescriptor) {
        this._instrumentDescriptor = _instrumentDescriptor;
      }
      MetricStorage2.prototype.getInstrumentDescriptor = function() {
        return this._instrumentDescriptor;
      };
      MetricStorage2.prototype.updateDescription = function(description) {
        this._instrumentDescriptor = createInstrumentDescriptor(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
          description,
          valueType: this._instrumentDescriptor.valueType,
          unit: this._instrumentDescriptor.unit,
          advice: this._instrumentDescriptor.advice
        });
      };
      return MetricStorage2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/HashMap.js
  var __extends7 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __generator5 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var HashMap = (
    /** @class */
    function() {
      function HashMap2(_hash) {
        this._hash = _hash;
        this._valueMap = /* @__PURE__ */ new Map();
        this._keyMap = /* @__PURE__ */ new Map();
      }
      HashMap2.prototype.get = function(key, hashCode) {
        hashCode !== null && hashCode !== void 0 ? hashCode : hashCode = this._hash(key);
        return this._valueMap.get(hashCode);
      };
      HashMap2.prototype.getOrDefault = function(key, defaultFactory) {
        var hash = this._hash(key);
        if (this._valueMap.has(hash)) {
          return this._valueMap.get(hash);
        }
        var val = defaultFactory();
        if (!this._keyMap.has(hash)) {
          this._keyMap.set(hash, key);
        }
        this._valueMap.set(hash, val);
        return val;
      };
      HashMap2.prototype.set = function(key, value, hashCode) {
        hashCode !== null && hashCode !== void 0 ? hashCode : hashCode = this._hash(key);
        if (!this._keyMap.has(hashCode)) {
          this._keyMap.set(hashCode, key);
        }
        this._valueMap.set(hashCode, value);
      };
      HashMap2.prototype.has = function(key, hashCode) {
        hashCode !== null && hashCode !== void 0 ? hashCode : hashCode = this._hash(key);
        return this._valueMap.has(hashCode);
      };
      HashMap2.prototype.keys = function() {
        var keyIterator, next;
        return __generator5(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              keyIterator = this._keyMap.entries();
              next = keyIterator.next();
              _a2.label = 1;
            case 1:
              if (!(next.done !== true))
                return [3, 3];
              return [4, [next.value[1], next.value[0]]];
            case 2:
              _a2.sent();
              next = keyIterator.next();
              return [3, 1];
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      };
      HashMap2.prototype.entries = function() {
        var valueIterator, next;
        return __generator5(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              valueIterator = this._valueMap.entries();
              next = valueIterator.next();
              _a2.label = 1;
            case 1:
              if (!(next.done !== true))
                return [3, 3];
              return [4, [this._keyMap.get(next.value[0]), next.value[1], next.value[0]]];
            case 2:
              _a2.sent();
              next = valueIterator.next();
              return [3, 1];
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      };
      Object.defineProperty(HashMap2.prototype, "size", {
        get: function() {
          return this._valueMap.size;
        },
        enumerable: false,
        configurable: true
      });
      return HashMap2;
    }()
  );
  var AttributeHashMap = (
    /** @class */
    function(_super) {
      __extends7(AttributeHashMap2, _super);
      function AttributeHashMap2() {
        return _super.call(this, hashAttributes) || this;
      }
      return AttributeHashMap2;
    }(HashMap)
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/DeltaMetricProcessor.js
  var __read14 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var DeltaMetricProcessor = (
    /** @class */
    function() {
      function DeltaMetricProcessor2(_aggregator, aggregationCardinalityLimit) {
        this._aggregator = _aggregator;
        this._activeCollectionStorage = new AttributeHashMap();
        this._cumulativeMemoStorage = new AttributeHashMap();
        this._overflowAttributes = { "otel.metric.overflow": true };
        this._cardinalityLimit = (aggregationCardinalityLimit !== null && aggregationCardinalityLimit !== void 0 ? aggregationCardinalityLimit : 2e3) - 1;
        this._overflowHashCode = hashAttributes(this._overflowAttributes);
      }
      DeltaMetricProcessor2.prototype.record = function(value, attributes, _context, collectionTime) {
        var _this = this;
        var accumulation = this._activeCollectionStorage.get(attributes);
        if (!accumulation) {
          if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
            var overflowAccumulation = this._activeCollectionStorage.getOrDefault(this._overflowAttributes, function() {
              return _this._aggregator.createAccumulation(collectionTime);
            });
            overflowAccumulation === null || overflowAccumulation === void 0 ? void 0 : overflowAccumulation.record(value);
            return;
          }
          accumulation = this._aggregator.createAccumulation(collectionTime);
          this._activeCollectionStorage.set(attributes, accumulation);
        }
        accumulation === null || accumulation === void 0 ? void 0 : accumulation.record(value);
      };
      DeltaMetricProcessor2.prototype.batchCumulate = function(measurements, collectionTime) {
        var _this = this;
        Array.from(measurements.entries()).forEach(function(_a2) {
          var _b = __read14(_a2, 3), attributes = _b[0], value = _b[1], hashCode = _b[2];
          var accumulation = _this._aggregator.createAccumulation(collectionTime);
          accumulation === null || accumulation === void 0 ? void 0 : accumulation.record(value);
          var delta = accumulation;
          if (_this._cumulativeMemoStorage.has(attributes, hashCode)) {
            var previous = _this._cumulativeMemoStorage.get(attributes, hashCode);
            delta = _this._aggregator.diff(previous, accumulation);
          } else {
            if (_this._cumulativeMemoStorage.size >= _this._cardinalityLimit) {
              attributes = _this._overflowAttributes;
              hashCode = _this._overflowHashCode;
              if (_this._cumulativeMemoStorage.has(attributes, hashCode)) {
                var previous = _this._cumulativeMemoStorage.get(attributes, hashCode);
                delta = _this._aggregator.diff(previous, accumulation);
              }
            }
          }
          if (_this._activeCollectionStorage.has(attributes, hashCode)) {
            var active = _this._activeCollectionStorage.get(attributes, hashCode);
            delta = _this._aggregator.merge(active, delta);
          }
          _this._cumulativeMemoStorage.set(attributes, accumulation, hashCode);
          _this._activeCollectionStorage.set(attributes, delta, hashCode);
        });
      };
      DeltaMetricProcessor2.prototype.collect = function() {
        var unreportedDelta = this._activeCollectionStorage;
        this._activeCollectionStorage = new AttributeHashMap();
        return unreportedDelta;
      };
      return DeltaMetricProcessor2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/TemporalMetricProcessor.js
  var __values2 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read15 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var TemporalMetricProcessor = (
    /** @class */
    function() {
      function TemporalMetricProcessor2(_aggregator, collectorHandles) {
        var _this = this;
        this._aggregator = _aggregator;
        this._unreportedAccumulations = /* @__PURE__ */ new Map();
        this._reportHistory = /* @__PURE__ */ new Map();
        collectorHandles.forEach(function(handle) {
          _this._unreportedAccumulations.set(handle, []);
        });
      }
      TemporalMetricProcessor2.prototype.buildMetrics = function(collector, instrumentDescriptor, currentAccumulations, collectionTime) {
        this._stashAccumulations(currentAccumulations);
        var unreportedAccumulations = this._getMergedUnreportedAccumulations(collector);
        var result = unreportedAccumulations;
        var aggregationTemporality;
        if (this._reportHistory.has(collector)) {
          var last = this._reportHistory.get(collector);
          var lastCollectionTime = last.collectionTime;
          aggregationTemporality = last.aggregationTemporality;
          if (aggregationTemporality === AggregationTemporality.CUMULATIVE) {
            result = TemporalMetricProcessor2.merge(last.accumulations, unreportedAccumulations, this._aggregator);
          } else {
            result = TemporalMetricProcessor2.calibrateStartTime(last.accumulations, unreportedAccumulations, lastCollectionTime);
          }
        } else {
          aggregationTemporality = collector.selectAggregationTemporality(instrumentDescriptor.type);
        }
        this._reportHistory.set(collector, {
          accumulations: result,
          collectionTime,
          aggregationTemporality
        });
        var accumulationRecords = AttributesMapToAccumulationRecords(result);
        if (accumulationRecords.length === 0) {
          return void 0;
        }
        return this._aggregator.toMetricData(
          instrumentDescriptor,
          aggregationTemporality,
          accumulationRecords,
          /* endTime */
          collectionTime
        );
      };
      TemporalMetricProcessor2.prototype._stashAccumulations = function(currentAccumulation) {
        var e_1, _a2;
        var registeredCollectors = this._unreportedAccumulations.keys();
        try {
          for (var registeredCollectors_1 = __values2(registeredCollectors), registeredCollectors_1_1 = registeredCollectors_1.next(); !registeredCollectors_1_1.done; registeredCollectors_1_1 = registeredCollectors_1.next()) {
            var collector = registeredCollectors_1_1.value;
            var stash = this._unreportedAccumulations.get(collector);
            if (stash === void 0) {
              stash = [];
              this._unreportedAccumulations.set(collector, stash);
            }
            stash.push(currentAccumulation);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (registeredCollectors_1_1 && !registeredCollectors_1_1.done && (_a2 = registeredCollectors_1.return))
              _a2.call(registeredCollectors_1);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      };
      TemporalMetricProcessor2.prototype._getMergedUnreportedAccumulations = function(collector) {
        var e_2, _a2;
        var result = new AttributeHashMap();
        var unreportedList = this._unreportedAccumulations.get(collector);
        this._unreportedAccumulations.set(collector, []);
        if (unreportedList === void 0) {
          return result;
        }
        try {
          for (var unreportedList_1 = __values2(unreportedList), unreportedList_1_1 = unreportedList_1.next(); !unreportedList_1_1.done; unreportedList_1_1 = unreportedList_1.next()) {
            var it_1 = unreportedList_1_1.value;
            result = TemporalMetricProcessor2.merge(result, it_1, this._aggregator);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (unreportedList_1_1 && !unreportedList_1_1.done && (_a2 = unreportedList_1.return))
              _a2.call(unreportedList_1);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
        return result;
      };
      TemporalMetricProcessor2.merge = function(last, current, aggregator) {
        var result = last;
        var iterator = current.entries();
        var next = iterator.next();
        while (next.done !== true) {
          var _a2 = __read15(next.value, 3), key = _a2[0], record = _a2[1], hash = _a2[2];
          if (last.has(key, hash)) {
            var lastAccumulation = last.get(key, hash);
            var accumulation = aggregator.merge(lastAccumulation, record);
            result.set(key, accumulation, hash);
          } else {
            result.set(key, record, hash);
          }
          next = iterator.next();
        }
        return result;
      };
      TemporalMetricProcessor2.calibrateStartTime = function(last, current, lastCollectionTime) {
        var e_3, _a2;
        try {
          for (var _b = __values2(last.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read15(_c.value, 2), key = _d[0], hash = _d[1];
            var currentAccumulation = current.get(key, hash);
            currentAccumulation === null || currentAccumulation === void 0 ? void 0 : currentAccumulation.setStartTime(lastCollectionTime);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a2 = _b.return))
              _a2.call(_b);
          } finally {
            if (e_3)
              throw e_3.error;
          }
        }
        return current;
      };
      return TemporalMetricProcessor2;
    }()
  );
  function AttributesMapToAccumulationRecords(map) {
    return Array.from(map.entries());
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/AsyncMetricStorage.js
  var __extends8 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __read16 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var AsyncMetricStorage = (
    /** @class */
    function(_super) {
      __extends8(AsyncMetricStorage2, _super);
      function AsyncMetricStorage2(_instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles, _aggregationCardinalityLimit) {
        var _this = _super.call(this, _instrumentDescriptor) || this;
        _this._attributesProcessor = _attributesProcessor;
        _this._aggregationCardinalityLimit = _aggregationCardinalityLimit;
        _this._deltaMetricStorage = new DeltaMetricProcessor(aggregator, _this._aggregationCardinalityLimit);
        _this._temporalMetricStorage = new TemporalMetricProcessor(aggregator, collectorHandles);
        return _this;
      }
      AsyncMetricStorage2.prototype.record = function(measurements, observationTime) {
        var _this = this;
        var processed = new AttributeHashMap();
        Array.from(measurements.entries()).forEach(function(_a2) {
          var _b = __read16(_a2, 2), attributes = _b[0], value = _b[1];
          processed.set(_this._attributesProcessor.process(attributes), value);
        });
        this._deltaMetricStorage.batchCumulate(processed, observationTime);
      };
      AsyncMetricStorage2.prototype.collect = function(collector, collectionTime) {
        var accumulations = this._deltaMetricStorage.collect();
        return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
      };
      return AsyncMetricStorage2;
    }(MetricStorage)
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/view/RegistrationConflicts.js
  function getIncompatibilityDetails(existing, otherDescriptor) {
    var incompatibility = "";
    if (existing.unit !== otherDescriptor.unit) {
      incompatibility += "	- Unit '" + existing.unit + "' does not match '" + otherDescriptor.unit + "'\n";
    }
    if (existing.type !== otherDescriptor.type) {
      incompatibility += "	- Type '" + existing.type + "' does not match '" + otherDescriptor.type + "'\n";
    }
    if (existing.valueType !== otherDescriptor.valueType) {
      incompatibility += "	- Value Type '" + existing.valueType + "' does not match '" + otherDescriptor.valueType + "'\n";
    }
    if (existing.description !== otherDescriptor.description) {
      incompatibility += "	- Description '" + existing.description + "' does not match '" + otherDescriptor.description + "'\n";
    }
    return incompatibility;
  }
  function getValueTypeConflictResolutionRecipe(existing, otherDescriptor) {
    return "	- use valueType '" + existing.valueType + "' on instrument creation or use an instrument name other than '" + otherDescriptor.name + "'";
  }
  function getUnitConflictResolutionRecipe(existing, otherDescriptor) {
    return "	- use unit '" + existing.unit + "' on instrument creation or use an instrument name other than '" + otherDescriptor.name + "'";
  }
  function getTypeConflictResolutionRecipe(existing, otherDescriptor) {
    var selector = {
      name: otherDescriptor.name,
      type: otherDescriptor.type,
      unit: otherDescriptor.unit
    };
    var selectorString = JSON.stringify(selector);
    return "	- create a new view with a name other than '" + existing.name + "' and InstrumentSelector '" + selectorString + "'";
  }
  function getDescriptionResolutionRecipe(existing, otherDescriptor) {
    var selector = {
      name: otherDescriptor.name,
      type: otherDescriptor.type,
      unit: otherDescriptor.unit
    };
    var selectorString = JSON.stringify(selector);
    return "	- create a new view with a name other than '" + existing.name + "' and InstrumentSelector '" + selectorString + "'\n    	- OR - create a new view with the name " + existing.name + " and description '" + existing.description + "' and InstrumentSelector " + selectorString + "\n    	- OR - create a new view with the name " + otherDescriptor.name + " and description '" + existing.description + "' and InstrumentSelector " + selectorString;
  }
  function getConflictResolutionRecipe(existing, otherDescriptor) {
    if (existing.valueType !== otherDescriptor.valueType) {
      return getValueTypeConflictResolutionRecipe(existing, otherDescriptor);
    }
    if (existing.unit !== otherDescriptor.unit) {
      return getUnitConflictResolutionRecipe(existing, otherDescriptor);
    }
    if (existing.type !== otherDescriptor.type) {
      return getTypeConflictResolutionRecipe(existing, otherDescriptor);
    }
    if (existing.description !== otherDescriptor.description) {
      return getDescriptionResolutionRecipe(existing, otherDescriptor);
    }
    return "";
  }

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricStorageRegistry.js
  var __values3 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var MetricStorageRegistry = (
    /** @class */
    function() {
      function MetricStorageRegistry2() {
        this._sharedRegistry = /* @__PURE__ */ new Map();
        this._perCollectorRegistry = /* @__PURE__ */ new Map();
      }
      MetricStorageRegistry2.create = function() {
        return new MetricStorageRegistry2();
      };
      MetricStorageRegistry2.prototype.getStorages = function(collector) {
        var e_1, _a2, e_2, _b;
        var storages = [];
        try {
          for (var _c = __values3(this._sharedRegistry.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var metricStorages = _d.value;
            storages = storages.concat(metricStorages);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a2 = _c.return))
              _a2.call(_c);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        var perCollectorStorages = this._perCollectorRegistry.get(collector);
        if (perCollectorStorages != null) {
          try {
            for (var _e = __values3(perCollectorStorages.values()), _f = _e.next(); !_f.done; _f = _e.next()) {
              var metricStorages = _f.value;
              storages = storages.concat(metricStorages);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_f && !_f.done && (_b = _e.return))
                _b.call(_e);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
        return storages;
      };
      MetricStorageRegistry2.prototype.register = function(storage) {
        this._registerStorage(storage, this._sharedRegistry);
      };
      MetricStorageRegistry2.prototype.registerForCollector = function(collector, storage) {
        var storageMap = this._perCollectorRegistry.get(collector);
        if (storageMap == null) {
          storageMap = /* @__PURE__ */ new Map();
          this._perCollectorRegistry.set(collector, storageMap);
        }
        this._registerStorage(storage, storageMap);
      };
      MetricStorageRegistry2.prototype.findOrUpdateCompatibleStorage = function(expectedDescriptor) {
        var storages = this._sharedRegistry.get(expectedDescriptor.name);
        if (storages === void 0) {
          return null;
        }
        return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
      };
      MetricStorageRegistry2.prototype.findOrUpdateCompatibleCollectorStorage = function(collector, expectedDescriptor) {
        var storageMap = this._perCollectorRegistry.get(collector);
        if (storageMap === void 0) {
          return null;
        }
        var storages = storageMap.get(expectedDescriptor.name);
        if (storages === void 0) {
          return null;
        }
        return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
      };
      MetricStorageRegistry2.prototype._registerStorage = function(storage, storageMap) {
        var descriptor = storage.getInstrumentDescriptor();
        var storages = storageMap.get(descriptor.name);
        if (storages === void 0) {
          storageMap.set(descriptor.name, [storage]);
          return;
        }
        storages.push(storage);
      };
      MetricStorageRegistry2.prototype._findOrUpdateCompatibleStorage = function(expectedDescriptor, existingStorages) {
        var e_3, _a2;
        var compatibleStorage = null;
        try {
          for (var existingStorages_1 = __values3(existingStorages), existingStorages_1_1 = existingStorages_1.next(); !existingStorages_1_1.done; existingStorages_1_1 = existingStorages_1.next()) {
            var existingStorage = existingStorages_1_1.value;
            var existingDescriptor = existingStorage.getInstrumentDescriptor();
            if (isDescriptorCompatibleWith(existingDescriptor, expectedDescriptor)) {
              if (existingDescriptor.description !== expectedDescriptor.description) {
                if (expectedDescriptor.description.length > existingDescriptor.description.length) {
                  existingStorage.updateDescription(expectedDescriptor.description);
                }
                diag.warn("A view or instrument with the name ", expectedDescriptor.name, " has already been registered, but has a different description and is incompatible with another registered view.\n", "Details:\n", getIncompatibilityDetails(existingDescriptor, expectedDescriptor), "The longer description will be used.\nTo resolve the conflict:", getConflictResolutionRecipe(existingDescriptor, expectedDescriptor));
              }
              compatibleStorage = existingStorage;
            } else {
              diag.warn("A view or instrument with the name ", expectedDescriptor.name, " has already been registered and is incompatible with another registered view.\n", "Details:\n", getIncompatibilityDetails(existingDescriptor, expectedDescriptor), "To resolve the conflict:\n", getConflictResolutionRecipe(existingDescriptor, expectedDescriptor));
            }
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (existingStorages_1_1 && !existingStorages_1_1.done && (_a2 = existingStorages_1.return))
              _a2.call(existingStorages_1);
          } finally {
            if (e_3)
              throw e_3.error;
          }
        }
        return compatibleStorage;
      };
      return MetricStorageRegistry2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/MultiWritableMetricStorage.js
  var MultiMetricStorage = (
    /** @class */
    function() {
      function MultiMetricStorage2(_backingStorages) {
        this._backingStorages = _backingStorages;
      }
      MultiMetricStorage2.prototype.record = function(value, attributes, context2, recordTime) {
        this._backingStorages.forEach(function(it) {
          it.record(value, attributes, context2, recordTime);
        });
      };
      return MultiMetricStorage2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/ObservableResult.js
  var ObservableResultImpl = (
    /** @class */
    function() {
      function ObservableResultImpl2(_instrumentName, _valueType) {
        this._instrumentName = _instrumentName;
        this._valueType = _valueType;
        this._buffer = new AttributeHashMap();
      }
      ObservableResultImpl2.prototype.observe = function(value, attributes) {
        if (attributes === void 0) {
          attributes = {};
        }
        if (typeof value !== "number") {
          diag.warn("non-number value provided to metric " + this._instrumentName + ": " + value);
          return;
        }
        if (this._valueType === ValueType.INT && !Number.isInteger(value)) {
          diag.warn("INT value type cannot accept a floating-point value for " + this._instrumentName + ", ignoring the fractional digits.");
          value = Math.trunc(value);
          if (!Number.isInteger(value)) {
            return;
          }
        }
        this._buffer.set(attributes, value);
      };
      return ObservableResultImpl2;
    }()
  );
  var BatchObservableResultImpl = (
    /** @class */
    function() {
      function BatchObservableResultImpl2() {
        this._buffer = /* @__PURE__ */ new Map();
      }
      BatchObservableResultImpl2.prototype.observe = function(metric, value, attributes) {
        if (attributes === void 0) {
          attributes = {};
        }
        if (!isObservableInstrument(metric)) {
          return;
        }
        var map = this._buffer.get(metric);
        if (map == null) {
          map = new AttributeHashMap();
          this._buffer.set(metric, map);
        }
        if (typeof value !== "number") {
          diag.warn("non-number value provided to metric " + metric._descriptor.name + ": " + value);
          return;
        }
        if (metric._descriptor.valueType === ValueType.INT && !Number.isInteger(value)) {
          diag.warn("INT value type cannot accept a floating-point value for " + metric._descriptor.name + ", ignoring the fractional digits.");
          value = Math.trunc(value);
          if (!Number.isInteger(value)) {
            return;
          }
        }
        map.set(attributes, value);
      };
      return BatchObservableResultImpl2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/ObservableRegistry.js
  var __awaiter5 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator6 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read17 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray9 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var ObservableRegistry = (
    /** @class */
    function() {
      function ObservableRegistry2() {
        this._callbacks = [];
        this._batchCallbacks = [];
      }
      ObservableRegistry2.prototype.addCallback = function(callback, instrument) {
        var idx = this._findCallback(callback, instrument);
        if (idx >= 0) {
          return;
        }
        this._callbacks.push({ callback, instrument });
      };
      ObservableRegistry2.prototype.removeCallback = function(callback, instrument) {
        var idx = this._findCallback(callback, instrument);
        if (idx < 0) {
          return;
        }
        this._callbacks.splice(idx, 1);
      };
      ObservableRegistry2.prototype.addBatchCallback = function(callback, instruments) {
        var observableInstruments = new Set(instruments.filter(isObservableInstrument));
        if (observableInstruments.size === 0) {
          diag.error("BatchObservableCallback is not associated with valid instruments", instruments);
          return;
        }
        var idx = this._findBatchCallback(callback, observableInstruments);
        if (idx >= 0) {
          return;
        }
        this._batchCallbacks.push({ callback, instruments: observableInstruments });
      };
      ObservableRegistry2.prototype.removeBatchCallback = function(callback, instruments) {
        var observableInstruments = new Set(instruments.filter(isObservableInstrument));
        var idx = this._findBatchCallback(callback, observableInstruments);
        if (idx < 0) {
          return;
        }
        this._batchCallbacks.splice(idx, 1);
      };
      ObservableRegistry2.prototype.observe = function(collectionTime, timeoutMillis) {
        return __awaiter5(this, void 0, void 0, function() {
          var callbackFutures, batchCallbackFutures, results, rejections;
          return __generator6(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                callbackFutures = this._observeCallbacks(collectionTime, timeoutMillis);
                batchCallbackFutures = this._observeBatchCallbacks(collectionTime, timeoutMillis);
                return [4, PromiseAllSettled(__spreadArray9(__spreadArray9([], __read17(callbackFutures), false), __read17(batchCallbackFutures), false))];
              case 1:
                results = _a2.sent();
                rejections = results.filter(isPromiseAllSettledRejectionResult).map(function(it) {
                  return it.reason;
                });
                return [2, rejections];
            }
          });
        });
      };
      ObservableRegistry2.prototype._observeCallbacks = function(observationTime, timeoutMillis) {
        var _this = this;
        return this._callbacks.map(function(_a2) {
          var callback = _a2.callback, instrument = _a2.instrument;
          return __awaiter5(_this, void 0, void 0, function() {
            var observableResult, callPromise;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  observableResult = new ObservableResultImpl(instrument._descriptor.name, instrument._descriptor.valueType);
                  callPromise = Promise.resolve(callback(observableResult));
                  if (timeoutMillis != null) {
                    callPromise = callWithTimeout(callPromise, timeoutMillis);
                  }
                  return [4, callPromise];
                case 1:
                  _b.sent();
                  instrument._metricStorages.forEach(function(metricStorage) {
                    metricStorage.record(observableResult._buffer, observationTime);
                  });
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        });
      };
      ObservableRegistry2.prototype._observeBatchCallbacks = function(observationTime, timeoutMillis) {
        var _this = this;
        return this._batchCallbacks.map(function(_a2) {
          var callback = _a2.callback, instruments = _a2.instruments;
          return __awaiter5(_this, void 0, void 0, function() {
            var observableResult, callPromise;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  observableResult = new BatchObservableResultImpl();
                  callPromise = Promise.resolve(callback(observableResult));
                  if (timeoutMillis != null) {
                    callPromise = callWithTimeout(callPromise, timeoutMillis);
                  }
                  return [4, callPromise];
                case 1:
                  _b.sent();
                  instruments.forEach(function(instrument) {
                    var buffer = observableResult._buffer.get(instrument);
                    if (buffer == null) {
                      return;
                    }
                    instrument._metricStorages.forEach(function(metricStorage) {
                      metricStorage.record(buffer, observationTime);
                    });
                  });
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        });
      };
      ObservableRegistry2.prototype._findCallback = function(callback, instrument) {
        return this._callbacks.findIndex(function(record) {
          return record.callback === callback && record.instrument === instrument;
        });
      };
      ObservableRegistry2.prototype._findBatchCallback = function(callback, instruments) {
        return this._batchCallbacks.findIndex(function(record) {
          return record.callback === callback && setEquals(record.instruments, instruments);
        });
      };
      return ObservableRegistry2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/SyncMetricStorage.js
  var __extends9 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var SyncMetricStorage = (
    /** @class */
    function(_super) {
      __extends9(SyncMetricStorage2, _super);
      function SyncMetricStorage2(instrumentDescriptor, aggregator, _attributesProcessor, collectorHandles, _aggregationCardinalityLimit) {
        var _this = _super.call(this, instrumentDescriptor) || this;
        _this._attributesProcessor = _attributesProcessor;
        _this._aggregationCardinalityLimit = _aggregationCardinalityLimit;
        _this._deltaMetricStorage = new DeltaMetricProcessor(aggregator, _this._aggregationCardinalityLimit);
        _this._temporalMetricStorage = new TemporalMetricProcessor(aggregator, collectorHandles);
        return _this;
      }
      SyncMetricStorage2.prototype.record = function(value, attributes, context2, recordTime) {
        attributes = this._attributesProcessor.process(attributes, context2);
        this._deltaMetricStorage.record(value, attributes, context2, recordTime);
      };
      SyncMetricStorage2.prototype.collect = function(collector, collectionTime) {
        var accumulations = this._deltaMetricStorage.collect();
        return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
      };
      return SyncMetricStorage2;
    }(MetricStorage)
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/view/AttributesProcessor.js
  var __extends10 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var AttributesProcessor = (
    /** @class */
    function() {
      function AttributesProcessor2() {
      }
      AttributesProcessor2.Noop = function() {
        return NOOP;
      };
      return AttributesProcessor2;
    }()
  );
  var NoopAttributesProcessor = (
    /** @class */
    function(_super) {
      __extends10(NoopAttributesProcessor2, _super);
      function NoopAttributesProcessor2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopAttributesProcessor2.prototype.process = function(incoming, _context) {
        return incoming;
      };
      return NoopAttributesProcessor2;
    }(AttributesProcessor)
  );
  var FilteringAttributesProcessor = (
    /** @class */
    function(_super) {
      __extends10(FilteringAttributesProcessor2, _super);
      function FilteringAttributesProcessor2(_allowedAttributeNames) {
        var _this = _super.call(this) || this;
        _this._allowedAttributeNames = _allowedAttributeNames;
        return _this;
      }
      FilteringAttributesProcessor2.prototype.process = function(incoming, _context) {
        var _this = this;
        var filteredAttributes = {};
        Object.keys(incoming).filter(function(attributeName) {
          return _this._allowedAttributeNames.includes(attributeName);
        }).forEach(function(attributeName) {
          return filteredAttributes[attributeName] = incoming[attributeName];
        });
        return filteredAttributes;
      };
      return FilteringAttributesProcessor2;
    }(AttributesProcessor)
  );
  var NOOP = new NoopAttributesProcessor();

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/MeterSharedState.js
  var __awaiter6 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator7 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read18 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var MeterSharedState = (
    /** @class */
    function() {
      function MeterSharedState2(_meterProviderSharedState, _instrumentationScope) {
        this._meterProviderSharedState = _meterProviderSharedState;
        this._instrumentationScope = _instrumentationScope;
        this.metricStorageRegistry = new MetricStorageRegistry();
        this.observableRegistry = new ObservableRegistry();
        this.meter = new Meter(this);
      }
      MeterSharedState2.prototype.registerMetricStorage = function(descriptor) {
        var storages = this._registerMetricStorage(descriptor, SyncMetricStorage);
        if (storages.length === 1) {
          return storages[0];
        }
        return new MultiMetricStorage(storages);
      };
      MeterSharedState2.prototype.registerAsyncMetricStorage = function(descriptor) {
        var storages = this._registerMetricStorage(descriptor, AsyncMetricStorage);
        return storages;
      };
      MeterSharedState2.prototype.collect = function(collector, collectionTime, options) {
        return __awaiter6(this, void 0, void 0, function() {
          var errors, storages, metricDataList;
          return __generator7(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                return [4, this.observableRegistry.observe(collectionTime, options === null || options === void 0 ? void 0 : options.timeoutMillis)];
              case 1:
                errors = _a2.sent();
                storages = this.metricStorageRegistry.getStorages(collector);
                if (storages.length === 0) {
                  return [2, null];
                }
                metricDataList = storages.map(function(metricStorage) {
                  return metricStorage.collect(collector, collectionTime);
                }).filter(isNotNullish);
                if (metricDataList.length === 0) {
                  return [2, { errors }];
                }
                return [2, {
                  scopeMetrics: {
                    scope: this._instrumentationScope,
                    metrics: metricDataList
                  },
                  errors
                }];
            }
          });
        });
      };
      MeterSharedState2.prototype._registerMetricStorage = function(descriptor, MetricStorageType) {
        var _this = this;
        var views = this._meterProviderSharedState.viewRegistry.findViews(descriptor, this._instrumentationScope);
        var storages = views.map(function(view) {
          var viewDescriptor = createInstrumentDescriptorWithView(view, descriptor);
          var compatibleStorage = _this.metricStorageRegistry.findOrUpdateCompatibleStorage(viewDescriptor);
          if (compatibleStorage != null) {
            return compatibleStorage;
          }
          var aggregator = view.aggregation.createAggregator(viewDescriptor);
          var viewStorage = new MetricStorageType(viewDescriptor, aggregator, view.attributesProcessor, _this._meterProviderSharedState.metricCollectors, view.aggregationCardinalityLimit);
          _this.metricStorageRegistry.register(viewStorage);
          return viewStorage;
        });
        if (storages.length === 0) {
          var perCollectorAggregations = this._meterProviderSharedState.selectAggregations(descriptor.type);
          var collectorStorages = perCollectorAggregations.map(function(_a2) {
            var _b = __read18(_a2, 2), collector = _b[0], aggregation = _b[1];
            var compatibleStorage = _this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(collector, descriptor);
            if (compatibleStorage != null) {
              return compatibleStorage;
            }
            var aggregator = aggregation.createAggregator(descriptor);
            var cardinalityLimit = collector.selectCardinalityLimit(descriptor.type);
            var storage = new MetricStorageType(descriptor, aggregator, AttributesProcessor.Noop(), [collector], cardinalityLimit);
            _this.metricStorageRegistry.registerForCollector(collector, storage);
            return storage;
          });
          storages = storages.concat(collectorStorages);
        }
        return storages;
      };
      return MeterSharedState2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/MeterProviderSharedState.js
  var __values4 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var MeterProviderSharedState = (
    /** @class */
    function() {
      function MeterProviderSharedState2(resource) {
        this.resource = resource;
        this.viewRegistry = new ViewRegistry();
        this.metricCollectors = [];
        this.meterSharedStates = /* @__PURE__ */ new Map();
      }
      MeterProviderSharedState2.prototype.getMeterSharedState = function(instrumentationScope) {
        var id = instrumentationScopeId(instrumentationScope);
        var meterSharedState = this.meterSharedStates.get(id);
        if (meterSharedState == null) {
          meterSharedState = new MeterSharedState(this, instrumentationScope);
          this.meterSharedStates.set(id, meterSharedState);
        }
        return meterSharedState;
      };
      MeterProviderSharedState2.prototype.selectAggregations = function(instrumentType) {
        var e_1, _a2;
        var result = [];
        try {
          for (var _b = __values4(this.metricCollectors), _c = _b.next(); !_c.done; _c = _b.next()) {
            var collector = _c.value;
            result.push([collector, collector.selectAggregation(instrumentType)]);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a2 = _b.return))
              _a2.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return result;
      };
      return MeterProviderSharedState2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/state/MetricCollector.js
  var __awaiter7 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator8 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read19 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray10 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var MetricCollector = (
    /** @class */
    function() {
      function MetricCollector2(_sharedState, _metricReader) {
        this._sharedState = _sharedState;
        this._metricReader = _metricReader;
      }
      MetricCollector2.prototype.collect = function(options) {
        return __awaiter7(this, void 0, void 0, function() {
          var collectionTime, scopeMetrics, errors, meterCollectionPromises;
          var _this = this;
          return __generator8(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                collectionTime = millisToHrTime(Date.now());
                scopeMetrics = [];
                errors = [];
                meterCollectionPromises = Array.from(this._sharedState.meterSharedStates.values()).map(function(meterSharedState) {
                  return __awaiter7(_this, void 0, void 0, function() {
                    var current;
                    return __generator8(this, function(_a3) {
                      switch (_a3.label) {
                        case 0:
                          return [4, meterSharedState.collect(this, collectionTime, options)];
                        case 1:
                          current = _a3.sent();
                          if ((current === null || current === void 0 ? void 0 : current.scopeMetrics) != null) {
                            scopeMetrics.push(current.scopeMetrics);
                          }
                          if ((current === null || current === void 0 ? void 0 : current.errors) != null) {
                            errors.push.apply(errors, __spreadArray10([], __read19(current.errors), false));
                          }
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                });
                return [4, Promise.all(meterCollectionPromises)];
              case 1:
                _a2.sent();
                return [2, {
                  resourceMetrics: {
                    resource: this._sharedState.resource,
                    scopeMetrics
                  },
                  errors
                }];
            }
          });
        });
      };
      MetricCollector2.prototype.forceFlush = function(options) {
        return __awaiter7(this, void 0, void 0, function() {
          return __generator8(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                return [4, this._metricReader.forceFlush(options)];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      MetricCollector2.prototype.shutdown = function(options) {
        return __awaiter7(this, void 0, void 0, function() {
          return __generator8(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                return [4, this._metricReader.shutdown(options)];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      MetricCollector2.prototype.selectAggregationTemporality = function(instrumentType) {
        return this._metricReader.selectAggregationTemporality(instrumentType);
      };
      MetricCollector2.prototype.selectAggregation = function(instrumentType) {
        return this._metricReader.selectAggregation(instrumentType);
      };
      MetricCollector2.prototype.selectCardinalityLimit = function(instrumentType) {
        var _a2, _b, _c;
        return (_c = (_b = (_a2 = this._metricReader).selectCardinalityLimit) === null || _b === void 0 ? void 0 : _b.call(_a2, instrumentType)) !== null && _c !== void 0 ? _c : 2e3;
      };
      return MetricCollector2;
    }()
  );

  // node_modules/@opentelemetry/sdk-metrics/build/esm/MeterProvider.js
  var __awaiter8 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator9 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values5 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function prepareResource(mergeWithDefaults, providedResource) {
    var resource = providedResource !== null && providedResource !== void 0 ? providedResource : Resource.empty();
    if (mergeWithDefaults) {
      return Resource.default().merge(resource);
    }
    return resource;
  }
  var MeterProvider = (
    /** @class */
    function() {
      function MeterProvider2(options) {
        var e_1, _a2, e_2, _b;
        var _c;
        this._shutdown = false;
        this._sharedState = new MeterProviderSharedState(prepareResource((_c = options === null || options === void 0 ? void 0 : options.mergeResourceWithDefaults) !== null && _c !== void 0 ? _c : true, options === null || options === void 0 ? void 0 : options.resource));
        if ((options === null || options === void 0 ? void 0 : options.views) != null && options.views.length > 0) {
          try {
            for (var _d = __values5(options.views), _e = _d.next(); !_e.done; _e = _d.next()) {
              var view = _e.value;
              this._sharedState.viewRegistry.addView(view);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_e && !_e.done && (_a2 = _d.return))
                _a2.call(_d);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        }
        if ((options === null || options === void 0 ? void 0 : options.readers) != null && options.readers.length > 0) {
          try {
            for (var _f = __values5(options.readers), _g = _f.next(); !_g.done; _g = _f.next()) {
              var metricReader = _g.value;
              this.addMetricReader(metricReader);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_g && !_g.done && (_b = _f.return))
                _b.call(_f);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
      }
      MeterProvider2.prototype.getMeter = function(name, version, options) {
        if (version === void 0) {
          version = "";
        }
        if (options === void 0) {
          options = {};
        }
        if (this._shutdown) {
          diag.warn("A shutdown MeterProvider cannot provide a Meter");
          return createNoopMeter();
        }
        return this._sharedState.getMeterSharedState({
          name,
          version,
          schemaUrl: options.schemaUrl
        }).meter;
      };
      MeterProvider2.prototype.addMetricReader = function(metricReader) {
        var collector = new MetricCollector(this._sharedState, metricReader);
        metricReader.setMetricProducer(collector);
        this._sharedState.metricCollectors.push(collector);
      };
      MeterProvider2.prototype.shutdown = function(options) {
        return __awaiter8(this, void 0, void 0, function() {
          return __generator9(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (this._shutdown) {
                  diag.warn("shutdown may only be called once per MeterProvider");
                  return [
                    2
                    /*return*/
                  ];
                }
                this._shutdown = true;
                return [4, Promise.all(this._sharedState.metricCollectors.map(function(collector) {
                  return collector.shutdown(options);
                }))];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      MeterProvider2.prototype.forceFlush = function(options) {
        return __awaiter8(this, void 0, void 0, function() {
          return __generator9(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (this._shutdown) {
                  diag.warn("invalid attempt to force flush after MeterProvider shutdown");
                  return [
                    2
                    /*return*/
                  ];
                }
                return [4, Promise.all(this._sharedState.metricCollectors.map(function(collector) {
                  return collector.forceFlush(options);
                }))];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return MeterProvider2;
    }()
  );

  // node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterOptions.js
  var AggregationTemporalityPreference;
  (function(AggregationTemporalityPreference2) {
    AggregationTemporalityPreference2[AggregationTemporalityPreference2["DELTA"] = 0] = "DELTA";
    AggregationTemporalityPreference2[AggregationTemporalityPreference2["CUMULATIVE"] = 1] = "CUMULATIVE";
    AggregationTemporalityPreference2[AggregationTemporalityPreference2["LOWMEMORY"] = 2] = "LOWMEMORY";
  })(AggregationTemporalityPreference || (AggregationTemporalityPreference = {}));

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js
  var OTLPExporterBase = (
    /** @class */
    function() {
      function OTLPExporterBase2(_delegate) {
        this._delegate = _delegate;
      }
      OTLPExporterBase2.prototype.export = function(items, resultCallback) {
        this._delegate.export(items, resultCallback);
      };
      OTLPExporterBase2.prototype.forceFlush = function() {
        return this._delegate.forceFlush();
      };
      OTLPExporterBase2.prototype.shutdown = function() {
        return this._delegate.shutdown();
      };
      return OTLPExporterBase2;
    }()
  );

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js
  var __extends11 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var OTLPExporterError = (
    /** @class */
    function(_super) {
      __extends11(OTLPExporterError2, _super);
      function OTLPExporterError2(message, code, data) {
        var _this = _super.call(this, message) || this;
        _this.name = "OTLPExporterError";
        _this.data = data;
        _this.code = code;
        return _this;
      }
      return OTLPExporterError2;
    }(Error)
  );

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js
  function validateTimeoutMillis(timeoutMillis) {
    if (!Number.isNaN(timeoutMillis) && Number.isFinite(timeoutMillis) && timeoutMillis > 0) {
      return timeoutMillis;
    }
    throw new Error("Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '" + timeoutMillis + "')");
  }
  function wrapStaticHeadersInFunction(headers) {
    if (headers == null) {
      return void 0;
    }
    return function() {
      return headers;
    };
  }
  function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    var _a2, _b, _c, _d, _e, _f;
    return {
      timeoutMillis: validateTimeoutMillis((_b = (_a2 = userProvidedConfiguration.timeoutMillis) !== null && _a2 !== void 0 ? _a2 : fallbackConfiguration.timeoutMillis) !== null && _b !== void 0 ? _b : defaultConfiguration.timeoutMillis),
      concurrencyLimit: (_d = (_c = userProvidedConfiguration.concurrencyLimit) !== null && _c !== void 0 ? _c : fallbackConfiguration.concurrencyLimit) !== null && _d !== void 0 ? _d : defaultConfiguration.concurrencyLimit,
      compression: (_f = (_e = userProvidedConfiguration.compression) !== null && _e !== void 0 ? _e : fallbackConfiguration.compression) !== null && _f !== void 0 ? _f : defaultConfiguration.compression
    };
  }
  function getSharedConfigurationDefaults() {
    return {
      timeoutMillis: 1e4,
      concurrencyLimit: 30,
      compression: "none"
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js
  var __awaiter9 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator10 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var BoundedQueueExportPromiseHandler = (
    /** @class */
    function() {
      function BoundedQueueExportPromiseHandler2(concurrencyLimit) {
        this._sendingPromises = [];
        this._concurrencyLimit = concurrencyLimit;
      }
      BoundedQueueExportPromiseHandler2.prototype.pushPromise = function(promise) {
        var _this = this;
        if (this.hasReachedLimit()) {
          throw new Error("Concurrency Limit reached");
        }
        this._sendingPromises.push(promise);
        var popPromise = function() {
          var index = _this._sendingPromises.indexOf(promise);
          _this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
      };
      BoundedQueueExportPromiseHandler2.prototype.hasReachedLimit = function() {
        return this._sendingPromises.length >= this._concurrencyLimit;
      };
      BoundedQueueExportPromiseHandler2.prototype.awaitAll = function() {
        return __awaiter9(this, void 0, void 0, function() {
          return __generator10(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                return [4, Promise.all(this._sendingPromises)];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return BoundedQueueExportPromiseHandler2;
    }()
  );
  function createBoundedQueueExportPromiseHandler(options) {
    return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/logging-response-handler.js
  function isPartialSuccessResponse(response) {
    return Object.prototype.hasOwnProperty.call(response, "partialSuccess");
  }
  function createLoggingPartialSuccessResponseHandler() {
    return {
      handleResponse: function(response) {
        if (response == null || !isPartialSuccessResponse(response) || response.partialSuccess == null || Object.keys(response.partialSuccess).length === 0) {
          return;
        }
        diag.warn("Received Partial Success response:", JSON.stringify(response.partialSuccess));
      }
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js
  var __awaiter10 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator11 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var OTLPExportDelegate = (
    /** @class */
    function() {
      function OTLPExportDelegate2(_transport, _serializer, _responseHandler, _promiseQueue, _timeout) {
        this._transport = _transport;
        this._serializer = _serializer;
        this._responseHandler = _responseHandler;
        this._promiseQueue = _promiseQueue;
        this._timeout = _timeout;
        this._diagLogger = diag.createComponentLogger({
          namespace: "OTLPExportDelegate"
        });
      }
      OTLPExportDelegate2.prototype.export = function(internalRepresentation, resultCallback) {
        var _this = this;
        this._diagLogger.debug("items to be sent", internalRepresentation);
        if (this._promiseQueue.hasReachedLimit()) {
          resultCallback({
            code: ExportResultCode.FAILED,
            error: new Error("Concurrent export limit reached")
          });
          return;
        }
        var serializedRequest = this._serializer.serializeRequest(internalRepresentation);
        if (serializedRequest == null) {
          resultCallback({
            code: ExportResultCode.FAILED,
            error: new Error("Nothing to send")
          });
          return;
        }
        this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then(function(response) {
          if (response.status === "success") {
            if (response.data != null) {
              try {
                _this._responseHandler.handleResponse(_this._serializer.deserializeResponse(response.data));
              } catch (e) {
                _this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e, response.data);
              }
            }
            resultCallback({
              code: ExportResultCode.SUCCESS
            });
            return;
          } else if (response.status === "failure" && response.error) {
            resultCallback({
              code: ExportResultCode.FAILED,
              error: response.error
            });
            return;
          } else if (response.status === "retryable") {
            resultCallback({
              code: ExportResultCode.FAILED,
              error: new OTLPExporterError("Export failed with retryable status")
            });
          } else {
            resultCallback({
              code: ExportResultCode.FAILED,
              error: new OTLPExporterError("Export failed with unknown error")
            });
          }
        }, function(reason) {
          return resultCallback({
            code: ExportResultCode.FAILED,
            error: reason
          });
        }));
      };
      OTLPExportDelegate2.prototype.forceFlush = function() {
        return this._promiseQueue.awaitAll();
      };
      OTLPExportDelegate2.prototype.shutdown = function() {
        return __awaiter10(this, void 0, void 0, function() {
          return __generator11(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                this._diagLogger.debug("shutdown started");
                return [4, this.forceFlush()];
              case 1:
                _a2.sent();
                this._transport.shutdown();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return OTLPExportDelegate2;
    }()
  );
  function createOtlpExportDelegate(components, settings) {
    return new OTLPExportDelegate(components.transport, components.serializer, createLoggingPartialSuccessResponseHandler(), components.promiseHandler, settings.timeout);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-network-export-delegate.js
  function createOtlpNetworkExportDelegate(options, serializer, transport) {
    return createOtlpExportDelegate({
      transport,
      serializer,
      promiseHandler: createBoundedQueueExportPromiseHandler(options)
    }, { timeout: options.timeoutMillis });
  }

  // node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/OTLPMetricExporterBase.js
  var __extends12 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var CumulativeTemporalitySelector = function() {
    return AggregationTemporality.CUMULATIVE;
  };
  var DeltaTemporalitySelector = function(instrumentType) {
    switch (instrumentType) {
      case InstrumentType.COUNTER:
      case InstrumentType.OBSERVABLE_COUNTER:
      case InstrumentType.GAUGE:
      case InstrumentType.HISTOGRAM:
      case InstrumentType.OBSERVABLE_GAUGE:
        return AggregationTemporality.DELTA;
      case InstrumentType.UP_DOWN_COUNTER:
      case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
        return AggregationTemporality.CUMULATIVE;
    }
  };
  var LowMemoryTemporalitySelector = function(instrumentType) {
    switch (instrumentType) {
      case InstrumentType.COUNTER:
      case InstrumentType.HISTOGRAM:
        return AggregationTemporality.DELTA;
      case InstrumentType.GAUGE:
      case InstrumentType.UP_DOWN_COUNTER:
      case InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
      case InstrumentType.OBSERVABLE_COUNTER:
      case InstrumentType.OBSERVABLE_GAUGE:
        return AggregationTemporality.CUMULATIVE;
    }
  };
  function chooseTemporalitySelectorFromEnvironment() {
    var env = getEnv();
    var configuredTemporality = env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE.trim().toLowerCase();
    if (configuredTemporality === "cumulative") {
      return CumulativeTemporalitySelector;
    }
    if (configuredTemporality === "delta") {
      return DeltaTemporalitySelector;
    }
    if (configuredTemporality === "lowmemory") {
      return LowMemoryTemporalitySelector;
    }
    diag.warn("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '" + env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE + "', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.");
    return CumulativeTemporalitySelector;
  }
  function chooseTemporalitySelector(temporalityPreference) {
    if (temporalityPreference != null) {
      if (temporalityPreference === AggregationTemporalityPreference.DELTA) {
        return DeltaTemporalitySelector;
      } else if (temporalityPreference === AggregationTemporalityPreference.LOWMEMORY) {
        return LowMemoryTemporalitySelector;
      }
      return CumulativeTemporalitySelector;
    }
    return chooseTemporalitySelectorFromEnvironment();
  }
  function chooseAggregationSelector(config) {
    if (config === null || config === void 0 ? void 0 : config.aggregationPreference) {
      return config.aggregationPreference;
    } else {
      return function(_instrumentType) {
        return Aggregation.Default();
      };
    }
  }
  var OTLPMetricExporterBase = (
    /** @class */
    function(_super) {
      __extends12(OTLPMetricExporterBase2, _super);
      function OTLPMetricExporterBase2(delegate, config) {
        var _this = _super.call(this, delegate) || this;
        _this._aggregationSelector = chooseAggregationSelector(config);
        _this._aggregationTemporalitySelector = chooseTemporalitySelector(config === null || config === void 0 ? void 0 : config.temporalityPreference);
        return _this;
      }
      OTLPMetricExporterBase2.prototype.selectAggregation = function(instrumentType) {
        return this._aggregationSelector(instrumentType);
      };
      OTLPMetricExporterBase2.prototype.selectAggregationTemporality = function(instrumentType) {
        return this._aggregationTemporalitySelector(instrumentType);
      };
      return OTLPMetricExporterBase2;
    }(OTLPExporterBase)
  );

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/utils.js
  function hrTimeToNanos(hrTime2) {
    var NANOSECONDS = BigInt(1e9);
    return BigInt(hrTime2[0]) * NANOSECONDS + BigInt(hrTime2[1]);
  }
  function toLongBits(value) {
    var low = Number(BigInt.asUintN(32, value));
    var high = Number(BigInt.asUintN(32, value >> BigInt(32)));
    return { low, high };
  }
  function encodeAsLongBits(hrTime2) {
    var nanos = hrTimeToNanos(hrTime2);
    return toLongBits(nanos);
  }
  function encodeAsString(hrTime2) {
    var nanos = hrTimeToNanos(hrTime2);
    return nanos.toString();
  }
  var encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : hrTimeToNanoseconds;
  function identity(value) {
    return value;
  }
  function optionalHexToBinary(str) {
    if (str === void 0)
      return void 0;
    return hexToBinary(str);
  }
  var DEFAULT_ENCODER = {
    encodeHrTime: encodeAsLongBits,
    encodeSpanContext: hexToBinary,
    encodeOptionalSpanContext: optionalHexToBinary
  };
  function getOtlpEncoder(options) {
    var _a2, _b;
    if (options === void 0) {
      return DEFAULT_ENCODER;
    }
    var useLongBits = (_a2 = options.useLongBits) !== null && _a2 !== void 0 ? _a2 : true;
    var useHex = (_b = options.useHex) !== null && _b !== void 0 ? _b : false;
    return {
      encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
      encodeSpanContext: useHex ? identity : hexToBinary,
      encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
    };
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js
  var __read20 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  function createResource(resource) {
    return {
      attributes: toAttributes(resource.attributes),
      droppedAttributesCount: 0
    };
  }
  function createInstrumentationScope(scope) {
    return {
      name: scope.name,
      version: scope.version
    };
  }
  function toAttributes(attributes) {
    return Object.keys(attributes).map(function(key) {
      return toKeyValue(key, attributes[key]);
    });
  }
  function toKeyValue(key, value) {
    return {
      key,
      value: toAnyValue(value)
    };
  }
  function toAnyValue(value) {
    var t = typeof value;
    if (t === "string")
      return { stringValue: value };
    if (t === "number") {
      if (!Number.isInteger(value))
        return { doubleValue: value };
      return { intValue: value };
    }
    if (t === "boolean")
      return { boolValue: value };
    if (value instanceof Uint8Array)
      return { bytesValue: value };
    if (Array.isArray(value))
      return { arrayValue: { values: value.map(toAnyValue) } };
    if (t === "object" && value != null)
      return {
        kvlistValue: {
          values: Object.entries(value).map(function(_a2) {
            var _b = __read20(_a2, 2), k = _b[0], v = _b[1];
            return toKeyValue(k, v);
          })
        }
      };
    return {};
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/internal.js
  function toResourceMetrics(resourceMetrics, options) {
    var encoder = getOtlpEncoder(options);
    return {
      resource: createResource(resourceMetrics.resource),
      schemaUrl: void 0,
      scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder)
    };
  }
  function toScopeMetrics(scopeMetrics, encoder) {
    return Array.from(scopeMetrics.map(function(metrics) {
      return {
        scope: createInstrumentationScope(metrics.scope),
        metrics: metrics.metrics.map(function(metricData) {
          return toMetric(metricData, encoder);
        }),
        schemaUrl: metrics.scope.schemaUrl
      };
    }));
  }
  function toMetric(metricData, encoder) {
    var out = {
      name: metricData.descriptor.name,
      description: metricData.descriptor.description,
      unit: metricData.descriptor.unit
    };
    var aggregationTemporality = toAggregationTemporality(metricData.aggregationTemporality);
    switch (metricData.dataPointType) {
      case DataPointType.SUM:
        out.sum = {
          aggregationTemporality,
          isMonotonic: metricData.isMonotonic,
          dataPoints: toSingularDataPoints(metricData, encoder)
        };
        break;
      case DataPointType.GAUGE:
        out.gauge = {
          dataPoints: toSingularDataPoints(metricData, encoder)
        };
        break;
      case DataPointType.HISTOGRAM:
        out.histogram = {
          aggregationTemporality,
          dataPoints: toHistogramDataPoints(metricData, encoder)
        };
        break;
      case DataPointType.EXPONENTIAL_HISTOGRAM:
        out.exponentialHistogram = {
          aggregationTemporality,
          dataPoints: toExponentialHistogramDataPoints(metricData, encoder)
        };
        break;
    }
    return out;
  }
  function toSingularDataPoint(dataPoint, valueType, encoder) {
    var out = {
      attributes: toAttributes(dataPoint.attributes),
      startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
      timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
    };
    switch (valueType) {
      case ValueType.INT:
        out.asInt = dataPoint.value;
        break;
      case ValueType.DOUBLE:
        out.asDouble = dataPoint.value;
        break;
    }
    return out;
  }
  function toSingularDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(function(dataPoint) {
      return toSingularDataPoint(dataPoint, metricData.descriptor.valueType, encoder);
    });
  }
  function toHistogramDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(function(dataPoint) {
      var histogram = dataPoint.value;
      return {
        attributes: toAttributes(dataPoint.attributes),
        bucketCounts: histogram.buckets.counts,
        explicitBounds: histogram.buckets.boundaries,
        count: histogram.count,
        sum: histogram.sum,
        min: histogram.min,
        max: histogram.max,
        startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
        timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
      };
    });
  }
  function toExponentialHistogramDataPoints(metricData, encoder) {
    return metricData.dataPoints.map(function(dataPoint) {
      var histogram = dataPoint.value;
      return {
        attributes: toAttributes(dataPoint.attributes),
        count: histogram.count,
        min: histogram.min,
        max: histogram.max,
        sum: histogram.sum,
        positive: {
          offset: histogram.positive.offset,
          bucketCounts: histogram.positive.bucketCounts
        },
        negative: {
          offset: histogram.negative.offset,
          bucketCounts: histogram.negative.bucketCounts
        },
        scale: histogram.scale,
        zeroCount: histogram.zeroCount,
        startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
        timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
      };
    });
  }
  function toAggregationTemporality(temporality) {
    switch (temporality) {
      case AggregationTemporality.DELTA:
        return 1;
      case AggregationTemporality.CUMULATIVE:
        return 2;
    }
  }
  function createExportMetricsServiceRequest(resourceMetrics, options) {
    return {
      resourceMetrics: resourceMetrics.map(function(metrics) {
        return toResourceMetrics(metrics, options);
      })
    };
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/metrics/json/metrics.js
  var JsonMetricsSerializer = {
    serializeRequest: function(arg) {
      var request = createExportMetricsServiceRequest([arg], {
        useLongBits: false
      });
      var encoder = new TextEncoder();
      return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: function(arg) {
      var decoder = new TextDecoder();
      return JSON.parse(decoder.decode(arg));
    }
  };

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/retrying-transport.js
  var __awaiter11 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator12 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var MAX_ATTEMPTS = 5;
  var INITIAL_BACKOFF = 1e3;
  var MAX_BACKOFF = 5e3;
  var BACKOFF_MULTIPLIER = 1.5;
  var JITTER = 0.2;
  function getJitter() {
    return Math.random() * (2 * JITTER) - JITTER;
  }
  var RetryingTransport = (
    /** @class */
    function() {
      function RetryingTransport2(_transport) {
        this._transport = _transport;
      }
      RetryingTransport2.prototype.retry = function(data, timeoutMillis, inMillis) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            _this._transport.send(data, timeoutMillis).then(resolve, reject);
          }, inMillis);
        });
      };
      RetryingTransport2.prototype.send = function(data, timeoutMillis) {
        var _a2;
        return __awaiter11(this, void 0, void 0, function() {
          var deadline, result, attempts, nextBackoff, backoff, retryInMillis, remainingTimeoutMillis;
          return __generator12(this, function(_b) {
            switch (_b.label) {
              case 0:
                deadline = Date.now() + timeoutMillis;
                return [4, this._transport.send(data, timeoutMillis)];
              case 1:
                result = _b.sent();
                attempts = MAX_ATTEMPTS;
                nextBackoff = INITIAL_BACKOFF;
                _b.label = 2;
              case 2:
                if (!(result.status === "retryable" && attempts > 0))
                  return [3, 4];
                attempts--;
                backoff = Math.max(Math.min(nextBackoff, MAX_BACKOFF) + getJitter(), 0);
                nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
                retryInMillis = (_a2 = result.retryInMillis) !== null && _a2 !== void 0 ? _a2 : backoff;
                remainingTimeoutMillis = deadline - Date.now();
                if (retryInMillis > remainingTimeoutMillis) {
                  return [2, result];
                }
                return [4, this.retry(data, remainingTimeoutMillis, retryInMillis)];
              case 3:
                result = _b.sent();
                return [3, 2];
              case 4:
                return [2, result];
            }
          });
        });
      };
      RetryingTransport2.prototype.shutdown = function() {
        return this._transport.shutdown();
      };
      return RetryingTransport2;
    }()
  );
  function createRetryingTransport(options) {
    return new RetryingTransport(options.transport);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/is-export-retryable.js
  function isExportRetryable(statusCode) {
    var retryCodes = [429, 502, 503, 504];
    return retryCodes.includes(statusCode);
  }
  function parseRetryAfterToMills(retryAfter) {
    if (retryAfter == null) {
      return void 0;
    }
    var seconds = Number.parseInt(retryAfter, 10);
    if (Number.isInteger(seconds)) {
      return seconds > 0 ? seconds * 1e3 : -1;
    }
    var delay = new Date(retryAfter).getTime() - Date.now();
    if (delay >= 0) {
      return delay;
    }
    return 0;
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/xhr-transport.js
  var __read21 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var XhrTransport = (
    /** @class */
    function() {
      function XhrTransport2(_parameters) {
        this._parameters = _parameters;
      }
      XhrTransport2.prototype.send = function(data, timeoutMillis) {
        var _this = this;
        return new Promise(function(resolve) {
          var xhr = new XMLHttpRequest();
          xhr.timeout = timeoutMillis;
          xhr.open("POST", _this._parameters.url);
          var headers = _this._parameters.headers();
          Object.entries(headers).forEach(function(_a2) {
            var _b = __read21(_a2, 2), k = _b[0], v = _b[1];
            xhr.setRequestHeader(k, v);
          });
          xhr.ontimeout = function(_) {
            resolve({
              status: "failure",
              error: new Error("XHR request timed out")
            });
          };
          xhr.onreadystatechange = function() {
            if (xhr.status >= 200 && xhr.status <= 299) {
              diag.debug("XHR success");
              resolve({
                status: "success"
              });
            } else if (xhr.status && isExportRetryable(xhr.status)) {
              resolve({
                status: "retryable",
                retryInMillis: parseRetryAfterToMills(xhr.getResponseHeader("Retry-After"))
              });
            } else if (xhr.status !== 0) {
              resolve({
                status: "failure",
                error: new Error("XHR request failed with non-retryable status")
              });
            }
          };
          xhr.onabort = function() {
            resolve({
              status: "failure",
              error: new Error("XHR request aborted")
            });
          };
          xhr.onerror = function() {
            resolve({
              status: "failure",
              error: new Error("XHR request errored")
            });
          };
          xhr.send(data);
        });
      };
      XhrTransport2.prototype.shutdown = function() {
      };
      return XhrTransport2;
    }()
  );
  function createXhrTransport(parameters) {
    return new XhrTransport(parameters);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/send-beacon-transport.js
  var SendBeaconTransport = (
    /** @class */
    function() {
      function SendBeaconTransport2(_params) {
        this._params = _params;
      }
      SendBeaconTransport2.prototype.send = function(data) {
        var _this = this;
        return new Promise(function(resolve) {
          if (navigator.sendBeacon(_this._params.url, new Blob([data], { type: _this._params.blobType }))) {
            diag.debug("SendBeacon success");
            resolve({
              status: "success"
            });
          } else {
            resolve({
              status: "failure",
              error: new Error("SendBeacon failed")
            });
          }
        });
      };
      SendBeaconTransport2.prototype.shutdown = function() {
      };
      return SendBeaconTransport2;
    }()
  );
  function createSendBeaconTransport(parameters) {
    return new SendBeaconTransport(parameters);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-browser-http-export-delegate.js
  function createOtlpXhrExportDelegate(options, serializer) {
    return createOtlpNetworkExportDelegate(options, serializer, createRetryingTransport({
      transport: createXhrTransport(options)
    }));
  }
  function createOtlpSendBeaconExportDelegate(options, serializer) {
    return createOtlpNetworkExportDelegate(options, serializer, createRetryingTransport({
      transport: createSendBeaconTransport({
        url: options.url,
        blobType: options.headers()["Content-Type"]
      })
    }));
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/util.js
  var __read22 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  function validateAndNormalizeHeaders(partialHeaders) {
    return function() {
      var _a2;
      var headers = {};
      Object.entries((_a2 = partialHeaders === null || partialHeaders === void 0 ? void 0 : partialHeaders()) !== null && _a2 !== void 0 ? _a2 : {}).forEach(function(_a3) {
        var _b = __read22(_a3, 2), key = _b[0], value = _b[1];
        if (typeof value !== "undefined") {
          headers[key] = String(value);
        } else {
          diag.warn('Header "' + key + '" has invalid value (' + value + ") and will be ignored");
        }
      });
      return headers;
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-http-configuration.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
    var requiredHeaders = __assign2({}, defaultHeaders());
    var headers = {};
    return function() {
      if (fallbackHeaders != null) {
        Object.assign(headers, fallbackHeaders());
      }
      if (userProvidedHeaders != null) {
        Object.assign(headers, userProvidedHeaders());
      }
      return Object.assign(headers, requiredHeaders);
    };
  }
  function validateUserProvidedUrl(url) {
    if (url == null) {
      return void 0;
    }
    try {
      new URL(url);
      return url;
    } catch (e) {
      throw new Error("Configuration: Could not parse user-provided export URL: '" + url + "'");
    }
  }
  function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    var _a2, _b, _c, _d;
    return __assign2(__assign2({}, mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration)), { headers: mergeHeaders(validateAndNormalizeHeaders(userProvidedConfiguration.headers), fallbackConfiguration.headers, defaultConfiguration.headers), url: (_b = (_a2 = validateUserProvidedUrl(userProvidedConfiguration.url)) !== null && _a2 !== void 0 ? _a2 : fallbackConfiguration.url) !== null && _b !== void 0 ? _b : defaultConfiguration.url, agentOptions: (_d = (_c = userProvidedConfiguration.agentOptions) !== null && _c !== void 0 ? _c : fallbackConfiguration.agentOptions) !== null && _d !== void 0 ? _d : defaultConfiguration.agentOptions });
  }
  function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return __assign2(__assign2({}, getSharedConfigurationDefaults()), { headers: function() {
      return requiredHeaders;
    }, url: "http://localhost:4318/" + signalResourcePath, agentOptions: { keepAlive: true } });
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-browser-http-options.js
  function convertLegacyBrowserHttpOptions(config, signalResourcePath, requiredHeaders) {
    return mergeOtlpHttpConfigurationWithDefaults(
      {
        url: config.url,
        timeoutMillis: config.timeoutMillis,
        headers: wrapStaticHeadersInFunction(config.headers),
        concurrencyLimit: config.concurrencyLimit
      },
      {},
      // no fallback for browser case
      getHttpConfigurationDefaults(requiredHeaders, signalResourcePath)
    );
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/create-legacy-browser-delegate.js
  function createLegacyOtlpBrowserExportDelegate(config, serializer, signalResourcePath, requiredHeaders) {
    var useXhr = !!config.headers || typeof navigator.sendBeacon !== "function";
    var options = convertLegacyBrowserHttpOptions(config, signalResourcePath, requiredHeaders);
    if (useXhr) {
      return createOtlpXhrExportDelegate(options, serializer);
    } else {
      return createOtlpSendBeaconExportDelegate(options, serializer);
    }
  }

  // node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/browser/OTLPMetricExporter.js
  var __extends13 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var OTLPMetricExporter = (
    /** @class */
    function(_super) {
      __extends13(OTLPMetricExporter2, _super);
      function OTLPMetricExporter2(config) {
        return _super.call(this, createLegacyOtlpBrowserExportDelegate(config !== null && config !== void 0 ? config : {}, JsonMetricsSerializer, "v1/metrics", { "Content-Type": "application/json" }), config) || this;
      }
      return OTLPMetricExporter2;
    }(OTLPMetricExporterBase)
  );

  // motion_capture.ts
  var tokenInput = document.getElementById("token");
  var intervalInput = document.getElementById("interval");
  var accelDisplay = document.getElementById("accel");
  var gyroDisplay = document.getElementById("gyro");
  var gpsDisplay = document.getElementById("gps");
  var telemetryInterval = 1e3;
  var trackingActive = false;
  var motionInterval;
  var orientationInterval;
  var gpsInterval;
  function getToken() {
    return tokenInput.value;
  }
  function createExporter() {
    const exporter = new OTLPMetricExporter({
      url: "https://everyorigin.jwvbremen.nl/get?url=https://ingest.eu0.signalfx.com/v2/datapoint/otlp",
      headers: {
        "Content-Type": "application/x-protobuf",
        "X-SF-Token": getToken()
      }
    });
    return new PeriodicExportingMetricReader({ exporter });
  }
  var meterProvider = new MeterProvider();
  meterProvider.addMetricReader(createExporter());
  var meter = meterProvider.getMeter("motion-sensor");
  var accelXMetric = meter.createObservableGauge("accelerometer_x");
  var accelYMetric = meter.createObservableGauge("accelerometer_y");
  var accelZMetric = meter.createObservableGauge("accelerometer_z");
  var gyroAlphaMetric = meter.createObservableGauge("gyroscope_alpha");
  var gyroBetaMetric = meter.createObservableGauge("gyroscope_beta");
  var gyroGammaMetric = meter.createObservableGauge("gyroscope_gamma");
  var gpsLatMetric = meter.createObservableGauge("gps_latitude");
  var gpsLonMetric = meter.createObservableGauge("gps_longitude");
  document.getElementById("requestPermission")?.addEventListener("click", () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then((permissionState) => {
        if (permissionState === "granted") {
          startTracking();
        } else {
          alert("Motion permission denied");
        }
      }).catch(console.error);
    } else {
      startTracking();
    }
  });
  document.getElementById("interval")?.addEventListener("change", (event) => {
    telemetryInterval = parseInt(event.target.value) || 1e3;
    if (trackingActive) {
      stopTracking();
      startTracking();
    }
  });
  document.getElementById("pauseTracking")?.addEventListener("click", () => {
    if (trackingActive) {
      stopTracking();
      document.getElementById("pauseTracking").textContent = "Resume Sensors";
    } else {
      startTracking();
      document.getElementById("pauseTracking").textContent = "Pause Sensors";
    }
  });
  function startTracking() {
    trackingActive = true;
    if (window.DeviceMotionEvent) {
      motionInterval = window.setInterval(() => {
        window.addEventListener("devicemotion", (event) => {
          let accel = event.accelerationIncludingGravity;
          if (accelDisplay) {
            accelDisplay.textContent = `X: ${accel.x?.toFixed(2)}, Y: ${accel.y?.toFixed(2)}, Z: ${accel.z?.toFixed(2)}`;
          }
          accelXMetric.addCallback((observer) => observer.observe(accel.x || 0));
          accelYMetric.addCallback((observer) => observer.observe(accel.y || 0));
          accelZMetric.addCallback((observer) => observer.observe(accel.z || 0));
        }, { once: true });
      }, telemetryInterval);
    }
    if (window.DeviceOrientationEvent) {
      orientationInterval = window.setInterval(() => {
        window.addEventListener("deviceorientation", (event) => {
          if (gyroDisplay) {
            gyroDisplay.textContent = `Alpha: ${event.alpha?.toFixed(2)}, Beta: ${event.beta?.toFixed(2)}, Gamma: ${event.gamma?.toFixed(2)}`;
          }
          gyroAlphaMetric.addCallback((observer) => observer.observe(event.alpha || 0));
          gyroBetaMetric.addCallback((observer) => observer.observe(event.beta || 0));
          gyroGammaMetric.addCallback((observer) => observer.observe(event.gamma || 0));
        }, { once: true });
      }, telemetryInterval);
    }
    if (navigator.geolocation) {
      gpsInterval = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          if (gpsDisplay) {
            gpsDisplay.textContent = `Lat: ${position.coords.latitude.toFixed(6)}, Lon: ${position.coords.longitude.toFixed(6)}`;
          }
          gpsLatMetric.addCallback((observer) => observer.observe(position.coords.latitude));
          gpsLonMetric.addCallback((observer) => observer.observe(position.coords.longitude));
        }, (error) => {
          if (gpsDisplay) {
            gpsDisplay.textContent = `GPS Error: ${error.message}`;
          }
        });
      }, telemetryInterval);
    }
  }
  function stopTracking() {
    trackingActive = false;
    clearInterval(motionInterval);
    clearInterval(orientationInterval);
    clearInterval(gpsInterval);
  }
})();
