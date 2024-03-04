import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { ServiceInterface } from './lambda-interface';

interface ServiceProps {
  bucket: string;
}

export class Service extends Construct {
  public readonly services: ServiceInterface;

  constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);

    const functionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ['aws-sdk'],
      },
      environment: {
        BUCKET_NAME: props.bucket,
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(10),
    };

    this.services = {
      // product
      createProduct: this.createHandlers(functionProps, 'createProduct'),
      getProduct: this.createHandlers(functionProps, 'getProduct'),
      getProducts: this.createHandlers(functionProps, 'getProducts'),
      getSellerProducts: this.createHandlers(
        functionProps,
        'getSellerProducts'
      ),
      editProduct: this.createHandlers(functionProps, 'editProduct'),
      deleteProduct: this.createHandlers(functionProps, 'deleteProduct'),
      // category
      createCategory: this.createHandlers(functionProps, 'createCategory'),
      getCategory: this.createHandlers(functionProps, 'getCategory'),
      getCategories: this.createHandlers(functionProps, 'getCategories'),
      editCategory: this.createHandlers(functionProps, 'editCategory'),
      deleteCategory: this.createHandlers(functionProps, 'deleteCategory'),
      // message que
      messageQueueHandler: this.createHandlers(
        functionProps,
        'messageQueueHandler'
      ),
      // image
      imageUploader: this.createHandlers(functionProps, 'imageUploader'),
    };
  }

  createHandlers(props: NodejsFunctionProps, handler: string): NodejsFunction {
    return new NodejsFunction(this, handler, {
      entry: join(__dirname, '/../src/handlers/index.ts'),
      handler: handler,
      ...props,
    });
  }
}
