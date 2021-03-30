#!/usr/bin/env node
'use strict';

// usage: node storj-audit-report -o /tmp/storj -c /path/to/config.json

const program = require('commander');
const path = require('path');
const levelup = require('levelup');
const leveldown = require('leveldown');
const assert = require('assert');

// SHARD STATUS ERROR STATUS
const ERROR_SIZE = 6;
const ERROR_STREAM = 5;
const ERROR_HASH = 4;
const ERROR_TOKEN = 3;
const ERROR_CONTRACT = 2;
const ERROR_CONTACT = 1;
const SUCCESS = 0;

program
  .version('0.0.1')
  .option('-o, --outputdir <path_to_outputdir>', 'path to where shards were saved')
  .parse(process.argv);

const DOWNLOAD_DIR = program.outputdir;
assert(path.isAbsolute(DOWNLOAD_DIR), 'outputdir is expected to be absolute path');

const db = levelup(leveldown(path.resolve(DOWNLOAD_DIR, 'statedb')));

function closeProgram() {
  db.close();
}

const MIN_KEY = Buffer.from('0000000000000000000000000000000000000000', 'hex');
const MAX_KEY = Buffer.from('ffffffffffffffffffffffffffffffffffffffff', 'hex');

const stream = db.createReadStream({
  gte: MIN_KEY,
  lte: MAX_KEY
});

console.log('NodeID, Audit Success Percentage, Audit Success Shards, Audit Total Shards, Fail Stream, Fail Hash, Fail Size, Fail Token, Fail Contract, Fail Contact, Bytes Transferred');

stream.on('data', function (data) {
  const nodeID = data.key.toString('hex');
  const results = JSON.parse(data.value.toString('utf8'));

  let total = 0;
  let success = 0;
  let hash = 0;
  let size = 0;
  let token = 0;
  let contract = 0;
  let contact = 0;
  let stream = 0;

  let totalBytes = 0;

  for (var shardHash in results) {
    total++;
    const item = results[shardHash];
    switch (item.status) {
      case SUCCESS:
        totalBytes += item.contract.data_size;
        success++;
        break;
      case ERROR_HASH:
        hash++;
        break;
      case ERROR_SIZE:
        size++;
        break;
      case ERROR_TOKEN:
        token++;
        break;
      case ERROR_CONTRACT:
        contract++;
        break;
      case ERROR_CONTACT:
        contact++;
        break;
      case ERROR_STREAM:
        stream++;
        break;
    }
  }
  let percentage = 0;
  if (total > 0) {
    percentage = success / total * 100;
  }
  console.log('%s, %s, %s, %s, %s, %s, %s, %s, %s, %s', nodeID, percentage.toFixed(0), success, total, stream, hash, size, token, contract, contact, totalBytes);
});

stream.on('error', function (err) {
  console.error(err);
});

stream.on('close', function () { });
stream.on('end', function () {
  closeProgram();
});
