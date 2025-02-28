export default class S3Account {
  name: string;

  accessKey: string;

  secretKey: string;

  endpoint: string;

  region: string;

  useTls: boolean;

  useVirtualHostingPath: boolean;

  constructor() {
    this.name = '';
    this.accessKey = '';
    this.secretKey = '';
    this.endpoint = '';
    this.region = '';
    this.useTls = false;
    this.useVirtualHostingPath = false;
  }
}
