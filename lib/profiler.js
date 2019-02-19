#!/usr/bin/env node
"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _clear = _interopRequireDefault(require("clear"));

var _commander = _interopRequireDefault(require("commander"));

var _figlet = _interopRequireDefault(require("figlet"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _clear.default)();
console.log(_chalk.default.bold.blue(_figlet.default.textSync('profiler-cli', {
  font: 'AMC 3 Line',
  horizontalLayout: 'full'
})));

function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i');

  if (!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

function isNumber(n) {
  if (typeof n === 'string') {
    return !isNaN(parseFloat(n)) && !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
  } else {
    return isFinite(n);
  }
}

async function processUrl(url) {
  const options = {
    runs: 1,
    wait: 1000,
    view: 'both',
    verbose: true
  };

  if (!url) {
    return console.log('You must specify a url');
  } else if (!validURL(url)) {
    return console.log('Please enter a valid url');
  }

  if (_commander.default.view && /^(mobile|desktop|both)/.test(_commander.default.view)) {
    options.view = _commander.default.view;
  }

  if (_commander.default.runs && isNumber(_commander.default.runs) && _commander.default.runs > 0) {
    options.runs = _commander.default.runs;
  }

  if (_commander.default.api && !isNumber(_commander.default.api)) {
    options.api = _commander.default.api;
  }

  await (0, _index.default)(options, url);
}

_commander.default.version('0.1.0').command('<url>', 'URL to benchmark on').option('-a --api <key>', 'Google API key').option('-v --view [view]', 'Which view to test', /^(mobile|desktop|both)$/i, 'both').option('-r --runs <number>', 'How many times to run profiler on URL').action(processUrl);

_commander.default.parse(process.argv);