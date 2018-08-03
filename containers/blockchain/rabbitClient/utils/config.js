const fs = require('fs');
const path = require('path');
const SECRETS_DIR = process.env.SECRETSDIR || '/run/secrets';
const CHANNEL_NAME_AKA_EVENT_NAME = process.env.EVENT_NAME;

function readConfig() {
  if(fs.existsSync(SECRETS_DIR)) {
    const data = JSON.parse(fs.readFileSync(path.resolve(SECRETS_DIR, 'config/config')).toString());
    data.channelName = CHANNEL_NAME_AKA_EVENT_NAME;
    // not being used?
    // data.channelConfig = fs.readFileSync(path.resolve(SECRETS_DIR, 'channel/channel'));
    return data;
  }
}
const config = readConfig();
export default config;