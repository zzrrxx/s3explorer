import S3Account from './S3Account';

export default class AppConfig {
  version: string;

  accounts: Array<S3Account>;

  constructor() {
    this.version = '1.0.0'; // first version
    this.accounts = [];
  }
}
