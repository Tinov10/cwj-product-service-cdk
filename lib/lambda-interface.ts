import { IFunction } from 'aws-cdk-lib/aws-lambda';

export interface ServiceInterface {
  // product
  readonly createProduct: IFunction;
  readonly getProduct: IFunction; // customer service // seller
  readonly getProducts: IFunction; // customer service
  readonly getSellerProducts: IFunction;
  readonly editProduct: IFunction;
  readonly deleteProduct: IFunction;
  // category
  readonly createCategory: IFunction;
  readonly getCategory: IFunction;
  readonly getCategories: IFunction;
  readonly editCategory: IFunction;
  readonly deleteCategory: IFunction;
  // message-queue
  readonly messageQueueHandler: IFunction;
  // image
  readonly imageUploader: IFunction;
}
