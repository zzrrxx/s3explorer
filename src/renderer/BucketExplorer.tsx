import BucketTable from './components/buckettable/bucket-table';
import { Bucket, columns } from './components/buckettable/columns';

function getBuckets(): Bucket[] {
  // return [
  //   {
  //     id: '1',
  //     name: 'amzn-s3-demo-bucket',
  //     creationDate: '2019-12-11T23:32:47+00:00',
  //     region: 'Chengdu',
  //   },
  //   {
  //     id: '2',
  //     name: 'amzn-s3-demo-bucket-2',
  //     creationDate: '2019-12-11T23:32:47+00:00',
  //     region: 'Beijing',
  //   },
  // ];

  const buckets = [];
  for (let i = 0; i < 50; i += 1) {
    buckets.push({
      id: `${i}`,
      name: `amazn-s3-demo-bucket-${i}`,
      creationDate: '2019-12-11T23:32:47+00:00',
      region: 'Beijing',
    });
  }
  return buckets;
}

export default function BucketsExplorer() {
  const buckets = getBuckets();

  return (
    <div className="container mx-auto p-6">
      <BucketTable columns={columns} data={buckets} />
    </div>
  );
}
