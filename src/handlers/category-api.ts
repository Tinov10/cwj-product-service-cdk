import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { CategoryRepository } from '../repository/category-repository';
import { CategoryService } from '../service/category-service';

import middy from '@middy/core';
import bodyParser from '@middy/http-json-body-parser';

// Connect MongoDB
import '../utility';

const service = new CategoryService(new CategoryRepository());

export const createCategory = middy(
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return service.createCategory(event);
  }
).use(bodyParser());

export const getCategory = middy(
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return service.getCategory(event);
  }
).use(bodyParser());

export const getCategories = middy(
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return service.getCategories(event);
  }
).use(bodyParser());

export const editCategory = middy(
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return service.editCategory(event);
  }
).use(bodyParser());

export const deleteCategory = middy(
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return service.deleteCategory(event);
  }
).use(bodyParser());
