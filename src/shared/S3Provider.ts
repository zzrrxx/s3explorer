import S3Endpoint from './S3Endpoint';

export default class S3Provider {
  name: string;

  useVirtualHostingPath: boolean;

  useTLS: boolean;

  defaultRegion: string;

  endpointTemplate;

  endpoints: Array<S3Endpoint>;

  constructor() {
    this.name = '';
    this.useVirtualHostingPath = true;
    this.useTLS = true;
    this.defaultRegion = '';
    this.endpointTemplate = '';
    this.endpoints = [];
  }
}
