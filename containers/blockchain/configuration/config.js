//var readFileSync = require('fs').readFileSync;
var resolve = require('path').resolve;
var fs = require("fs");
const basePath = resolve(__dirname, './certs');
const eventName = process.env.EVENT_NAME;
const readCryptoFile = filename => fs.readFileSync(resolve(basePath, filename)).toString();
const config = {
  channelName: 'mychannel',
  channelConfig: fs.readFileSync(resolve(__dirname, 'channel.tx')),
  chaincodeId: 'bcfit',
  chaincodeVersion: '1',
  chaincodePath: 'bcfit',
  rabbitmq: 'amqps://admin:IXIHROUISBZJPEPW@portal-ssl285-31.bmix-dal-yp-70b203d2-491a-4977-a5fb-bddf83921f76.421838044.composedb.com:51900/bmix-dal-yp-70b203d2-491a-4977-a5fb-bddf83921f76',
  // redisHost: 'redis-server',
  // redisPort: 7000,
  redisUrl: 'redis://admin:KIQKOJWXUBFIXGEP@sl-us-south-1-portal.31.dblayer.com:52062',
  orderer: {
    hostname: 'orderer0' + '-' + eventName,
    url: 'grpc://orderer0' + '-' + eventName + ':7050',
    pem: readCryptoFile('ordererOrg.pem')
  },
  peers: [{
    peer: {
      hostname: 'shop-peer' + '-' + eventName,
      url: 'grpc://shop-peer' + '-' + eventName + ':7051',
      eventHubUrl: 'grpc://shop-peer' + '-' + eventName + ':7053',
      pem: readCryptoFile('shopOrg.pem'),
      userKeystoreDBName: 'seller_db' + '-' + eventName,
      userKeystoreDBUrl: 'http://ca-datastore:5984',
      stateDBName: 'member_db' + '-' + eventName,
      stateDBUrl: 'http://shop-statedb' + '-' + eventName + ':5984',
      org: 'org.ShopOrg',
      userType: 'seller'
    },
    ca: {
      hostname: 'shop-ca' + '-' + eventName,
      url: 'http://shop-ca' + '-' + eventName + ':7054',
      mspId: 'ShopOrgMSP',
      caName: 'shop-org'
    },
    admin: {
      key: readCryptoFile('Admin@shop-org-key.pem'),
      cert: readCryptoFile('Admin@shop-org-cert.pem')
    }
  }, {
    peer: {
      hostname: 'fitcoin-peer' + '-' + eventName,
      url: 'grpc://fitcoin-peer' + '-' + eventName + ':7051',
      pem: readCryptoFile('fitcoinOrg.pem'),
      userKeystoreDBName: 'user_db' + '-' + eventName,
      userKeystoreDBUrl: 'http://ca-datastore:5984',
      stateDBName: 'member_db' + '-' + eventName,
      stateDBUrl: 'http://fitcoin-statedb' + '-' + eventName + ':5984',
      eventHubUrl: 'grpc://fitcoin-peer' + '-' + eventName + ':7053',
      org: 'org.FitCoinOrg',
      userType: 'user'
    },
    ca: {
      hostname: 'fitcoin-ca' + '-' + eventName,
      url: 'http://fitcoin-ca' + '-' + eventName + ':7054',
      mspId: 'FitCoinOrgMSP',
      caName: 'fitcoin-org'
    },
    admin: {
      key: readCryptoFile('Admin@fitcoin-org-key.pem'),
      cert: readCryptoFile('Admin@fitcoin-org-cert.pem')
    }
  }]
};
if(process.env.LOCALCONFIG) {
  config.orderer.url = 'grpc://localhost:7050';
  config.peers[0].peer.url = 'grpc://localhost:7051';
  config.peers[0].peer.eventHubUrl = 'grpc://localhost:7053';
  config.peers[0].ca.url = 'https://localhost:7054';
  config.peers[0].peer.userKeystoreDBUrl = 'http://localhost:5984';
  config.peers[0].peer.stateDBUrl = 'http://localhost:9984';
  config.peers[1].peer.url = 'grpc://localhost:8051';
  config.peers[1].peer.eventHubUrl = 'grpc://localhost:8053';
  config.peers[1].ca.url = 'https://localhost:8054';
  config.peers[1].peer.userKeystoreDBUrl = 'http://localhost:5984';
  config.peers[1].peer.stateDBUrl = 'http://localhost:8984';
  config.rabbitmq = 'amqp://localhost:5672?heartbeat=60';
  config.redisHost = 'localhost';
  config.iotDashUrl = 'https://think-iot-processor.mybluemix.net/steps?message=';
}
//export default config;
fs.writeFile("./config.json", JSON.stringify(config), (err) => {
  if(err) {
    console.error(err);
    return;
  }
  console.log("File has been created");
});
