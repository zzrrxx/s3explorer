import S3Account from './S3Account';

export default class AppConfig {
  accounts: Array<S3Account>;

  constructor() {
    this.accounts = [];
  }
}
