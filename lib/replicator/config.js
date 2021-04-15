const assert = require('assert');
const fs = require('fs');
const rc = require('rc');
const path = require('path');
const merge = require('merge');

const CONSTANTS = require('../constants');
const utils = require('../utils');

const DEFAULT_DB = process.env.NODE_ENV || 'develop';

const DEFAULTS = {
  storage: {
    mongoUrl: `mongodb://127.0.0.1:27017/__storj-bridge-${DEFAULT_DB}`,
    mongoOpts: {}
  },
  complex: {
    rpcUrl: 'http://localhost:8080',
    rpcUser: 'user',
    rpcPassword: 'pass'
  },
  logger: {
    level: CONSTANTS.LOG_LEVEL_INFO
  },
  application: {
    maxInterval: '10m',
    minInterval: '5m',
    queryNumber: 100,
    pingConcurrency: 10,
    timeoutRateThreshold: 0.04 // ~1 hour of downtime in 24 hours
  }
};

function getPaths(confpath) {
  var paths = {};
  assert(path.isAbsolute(confpath), 'confpath is expected to be absolute');
  paths.confdir = path.dirname(confpath);
  paths.confpath = confpath;

  return paths;
}

function setupConfig(paths) {
  if (!fs.existsSync(paths.confdir)) {
    fs.mkdirSync(paths.confdir);
  }
  if (!fs.existsSync(paths.confpath)) {
    fs.writeFileSync(paths.confpath, JSON.stringify(DEFAULTS, null, 2));
  }
}
class ReplicatorConfig {
  constructor(confpath) {

    let fileConfig = {};

    if (typeof confpath === 'string') {
      const paths = ReplicatorConfig.getPaths(confpath);
      ReplicatorConfig.setupConfig(paths);
      fileConfig = JSON.parse(fs.readFileSync(paths.confpath));
    } else if (typeof confpath === 'object') {
      fileConfig = confpath;
    }

    let config = merge.recursive(
      JSON.parse(JSON.stringify(DEFAULTS)),
      fileConfig
    );

    config = rc('storjmonitor', config);

    for (let prop in config) {
      this[prop] = utils.recursiveExpandJSON(config[prop]);
    }
  }
}

ReplicatorConfig.DEFAULTS = DEFAULTS;
ReplicatorConfig.setupConfig = setupConfig;
ReplicatorConfig.getPaths = getPaths;

module.exports = ReplicatorConfig;
