import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { aws_apigateway } from 'aws-cdk-lib';
import { ServiceInterface } from './lambda-interface';

interface ApiGatewayProps {
  services: ServiceInterface;
}

type MethodType = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

interface ResourceType {
  route: string;
  methods: Method[];
}

interface Method {
  methodType: MethodType;
  handler: IFunction;
}

export class ApiGateway extends Construct {
  //
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.addResource('product', props);
  }

  addResource(serviceName: string, { services }: ApiGatewayProps) {
    // create apgw
    const apgw = new aws_apigateway.RestApi(this, `${serviceName}-ApiGateway`);

    // pass in apgq
    // create productResource
    const productResource = this.createEndpoints(apgw, {
      route: 'product',
      methods: [
        { methodType: 'POST', handler: services.createProduct },
        { methodType: 'GET', handler: services.getProducts },
      ],
    });

    // in productResource
    this.addChildEndpoints(productResource, {
      route: '{id}',
      methods: [
        { methodType: 'GET', handler: services.getProduct },
        { methodType: 'PUT', handler: services.editProduct },
        { methodType: 'DELETE', handler: services.deleteProduct },
      ],
    });

    const categoryResource = this.createEndpoints(apgw, {
      route: 'category',
      methods: [
        { methodType: 'POST', handler: services.createCategory },
        { methodType: 'GET', handler: services.getCategories },
      ],
    });

    this.addChildEndpoints(categoryResource, {
      route: '{id}',
      methods: [
        { methodType: 'GET', handler: services.getCategory },
        { methodType: 'PUT', handler: services.editCategory },
        { methodType: 'DELETE', handler: services.deleteCategory },
      ],
    });

    const sellerResource = this.createEndpoints(apgw, {
      route: 'seller_products',
      methods: [{ methodType: 'GET', handler: services.getSellerProducts }],
    });

    const uploadResource = this.createEndpoints(apgw, {
      route: 'upload',
      methods: [{ methodType: 'POST', handler: services.imageUploader }],
    });

    const productQueueResource = this.createEndpoints(apgw, {
      route: 'product-queue',
      methods: [{ methodType: 'POST', handler: services.messageQueueHandler }],
    });
  }

  createEndpoints(resource: RestApi, { route, methods }: ResourceType) {
    // create rootResource
    const rootResource = resource.root.addResource(route);
    //
    methods.map((item) => {
      // get every lambda function
      const lambdaFunction = new LambdaIntegration(item.handler);

      // add method to rootResource for every lambda
      // pass in the lambda
      rootResource.addMethod(item.methodType, lambdaFunction);
    });
    return rootResource;
  }

  addChildEndpoints(
    rootResource: aws_apigateway.Resource,
    { route, methods }: ResourceType
  ) {
    const childResource = rootResource.addResource(route);
    methods.map((item) => {
      const lambdaFunction = new LambdaIntegration(item.handler);
      childResource.addMethod(item.methodType, lambdaFunction);
    });
  }
}
