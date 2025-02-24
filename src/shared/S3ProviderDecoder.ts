import S3Endpoint from './S3Endpoint';
import S3Provider from './S3Provider';

function decodeEndpoint(json: any, templ: string): S3Endpoint {
  const endpoint: S3Endpoint = {
    region: String(json.Region),
    regionID: String(json.RegionID),
    url: templ.replace('%REGION%', String(json.RegionID)),
  };
  return endpoint;
}

export default function decodeS3Provider(json: any): S3Provider {
  const provider: S3Provider = {
    name: String(json.Name),
    useVirtualHostingPath: Boolean(json.VirtualHostingPath),
    useTLS: Boolean(json.SSL),
    defaultRegion: String(json.DefaultRegion),
    endpointTemplate: String(json.EndpointTemplate),
    endpoints: json.Endpoints.map((endpoint: any) =>
      decodeEndpoint(endpoint, String(json.EndpointTemplate)),
    ),
  };

  return provider;
}
