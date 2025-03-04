import AppConfig from './AppConfig';
import S3Account from './S3Account';

const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');

function decodeAccount(json: any): S3Account {
  const acct: S3Account = {
    name: String(json.name),
    accessKey: String(json.accessKey),
    secretKey: String(json.secretKey),
    endpoint: String(json.endpoint),
    region: String(json.region),
    useTls: Boolean(json.useTls),
    useVirtualHostingPath: Boolean(json.useVirtualHostingPath),
  };
  return acct;
}

export function appConfigLoad(): AppConfig {
  const appConfig: AppConfig = new AppConfig();

  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf-8');
    if (configData !== '') {
      const json = JSON.parse(configData);
      appConfig.version = String(json.version);
      appConfig.accounts = json.accounts.map((acct: any) =>
        decodeAccount(acct),
      );
    }
  }

  return appConfig;
}

export function appConfigSave(appConfig: AppConfig) {
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(appConfig, null, 2), 'utf-8');
}
