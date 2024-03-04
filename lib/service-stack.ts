import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { S3Bucket } from './s3bucket-construct';
import { Service } from './lambda-construct';
import { ApiGateway } from './api_gateway-construct';

export class ProductService extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { bucket } = new S3Bucket(this, 'ProductImages', {}); // no props

    const { services } = new Service(this, 'ProductService', {
      // props
      bucket: bucket.bucketName,
    });

    bucket.grantReadWrite(services.imageUploader);

    new ApiGateway(this, 'Product', {
      // props
      services,
    });
  }
}
