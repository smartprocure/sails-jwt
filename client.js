(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/fp"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/fp"], factory);
	else if(typeof exports === 'object')
		exports["sails-jwtClient"] = factory(require("lodash/fp"));
	else
		root["sails-jwtClient"] = factory(root["lodash/fp"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fp = __webpack_require__(0);

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = window.localStorage; // eslint-disable-line

// Authentication
var options = {
  reAuthStates: /^(jwt (expired|malformed)|invalid token|concurrent login)|(No Authorization header was found)$/,
  handleJWTError: _fp2.default.noop
};
options.checkError = function (result, jwr) {
  return (result.status === 'error' || jwr.error) && options.reAuthStates.test(result.message || result.error);
};

// Use local storage unless it is disabled
var token = void 0;
var setToken = function setToken(newToken) {
  storage ? storage.setItem('jwt', newToken) : token = newToken;
};
var getToken = function getToken() {
  return storage ? storage.getItem('jwt') : token;
};
var logout = function logout() {
  return setToken('');
};

// Usage:
// let addAuth = require('sp-jwt').addAuth
// let request = _.curryN(3, addAuth(transport))
var addAuth = function addAuth(f) {
  return function (method, url, params, includeJwr) {
    if (_fp2.default.isArray(params)) throw new Error('Passing an array in the services will prevent auth from being added');

    return Promise.resolve().then(function () {
      return f(method, url, _fp2.default.defaults({ token: getToken() }, params), true);
    }).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          result = _ref2[0],
          jwr = _ref2[1];

      if (options.checkError(result, jwr)) options.handleJWTError(result, jwr);
      var newToken = _fp2.default.get(['headers', 'Renewed-Token'], jwr);
      if (newToken) setToken(newToken);
      return includeJwr ? [result, jwr] : result;
    }).catch(function (e) {
      if (options.checkError(e, { error: true })) options.handleJWTError(e);
      throw e;
    });
  };
};

exports.default = {
  addAuth: addAuth,
  options: options,
  setToken: setToken,
  getToken: getToken,
  logout: logout
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=client.js.map