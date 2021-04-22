const Config = require('../lib/config');
const program = require('commander');
const log = require('../lib/logger');
const fs = require('fs');

const Audit = require('../lib/audit');

program
  .version('0.0.1')
  .option('-w, --wallet <wallet_hash>', 'hash of the payment wallet whose nodes to be audited')
  .option('-n, --nodeId <node_id>', 'id of the node to be audited')
  .option('-h, --shardHash <node_id>', 'id of the shard to be audited')
  .option('-f, --fileId <file_id>', 'id of the file whose shards are going to be audited')
  .option('-c, --config <path_to_config_file>', 'path to the config file')
  .option('-a, --attempts <attempts_to_retry>', 'number of attempts to audit the shard (sometimes nodes fail to send the shard)')
  .parse(process.argv);


/* SETUP */
const config = new Config(process.env.NODE_ENV || 'develop', program.config, program.datadir);

function startMonitor() {
  const audit = new Audit(config, program.attempts);
  audit.init();

  // Audit a wallet
  if(program.wallet) {
    audit.wallet(program.wallet)
      .then((response) => {
        log.info('generating report');
        fs.writeFile(`./report_${program.wallet}.json`, JSON.stringify(response.nodesAudited) , 'utf-8');
        log.info(`Finished. Overall health for nodes related to this wallet ${response.overallHealth}`);
        process.exit(0);
      })
      .catch(log.warn);
    return;
  }

  if(program.fileId) {
    audit.file(program.fileId, 3)
      .then((response) =>{
        log.info('generating report');
        fs.writeFile(`./report_file_${program.fileId}.json`, JSON.stringify(response) , 'utf-8');
        log.info(`Finished. Overall health for nodes related to this wallet ${response.overallHealth}`);
        process.exit(0);
      })
      .catch(log.warn);
    return;
  }

  if(program.nodeId) {
    const attempts = program.attempts && !isNaN(program.attempts) ? program.attempts : 1;

    if(program.shardHash) {
      audit.shardInNode(program.shardHash, program.nodeId, attempts)
        .then(() => process.exit(0))
        .catch((err) => {
          log.error('Unexpected error during audit');
          console.error(err);
        });
      return;
    } else {
      audit.node(program.nodeId)
        .then(() => process.exit(0))
        .catch((err) => {
          log.error('Unexpected error during audit');
          console.error(err);
        });
      return;
    }
  }
  
  // Audit only a shard
  if (program.shardHash) {
    audit.shard(program.shardHash, 3).catch(console.error);
  } else {
    log.error('please provide a valid option');
  }
}

startMonitor();