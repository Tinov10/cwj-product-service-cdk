import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ProductService } from '../service/product-service';
import { ProductRepository } from '../repository/product-repository';

import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';

// Connect MongoDB
import '../utility';

const service = new ProductService(new ProductRepository());

export const messageQueueHandler = middy(
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return service.handleQueueOperation(event);
  }
).use(jsonBodyParser());
