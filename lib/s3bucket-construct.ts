import { RemovalPolicy } from 'aws-cdk-lib';
import {
  Bucket,
  BlockPublicAccess,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface BucketProps {}

export class S3Bucket extends Construct {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props: BucketProps) {
    super(scope, id);

    this.bucket = new Bucket(scope, `${id}-Bucket`, {
      // bucketName
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      versioned: false,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
