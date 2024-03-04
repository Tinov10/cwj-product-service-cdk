import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';

import { ProductRepository } from '../repository/product-repository';
import { CategoryRepository } from '../repository/category-repository';

import { ProductInput, ServiceInput } from '../dto';

import { ErrorResponse, SucessResponse } from '../utility/response';
import { authUser } from '../utility/auth';
import { plainToClass } from 'class-transformer';
import { AppValidationError } from '../utility/errors';

export class ProductService {
  _repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async authorizedUser(userId: number, productId: string) {
    const product = await this._repository.getProductById(productId);
    if (!product) return false;
    return Number(userId) === Number(product.seller_id);
  }

  async createProduct(event: APIGatewayEvent) {
    const user = await authUser(event.headers.Authorization);
    if (!user) return ErrorResponse(403, 'Authorization failed');
    if (user.user_type.toUpperCase() !== 'SELLER') {
      return ErrorResponse(403, 'Join seller program to create product');
    }

    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct({
      ...input,
      seller_id: user.user_id,
    });

    // add product to category
    await new CategoryRepository().addItem({
      id: input.category_id,
      products: [data._id],
    });
    return SucessResponse(data);
  }

  async editProduct(event: APIGatewayEvent) {
    // user authorized? (1) --> only sellers
    const user = await authUser(event.headers.Authorization);
    if (!user) return ErrorResponse(403, 'Authorization failed');
    if (user.user_type.toUpperCase() !== 'SELLER') {
      return ErrorResponse(403, 'Join seller program to manage product');
    }

    // const input = await isValid(ProductInput, event.body);
    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, 'please provide product id');

    // user authorized? (2) --> only creator
    const isAuthorized = await this.authorizedUser(user.user_id, productId);
    if (!isAuthorized)
      return ErrorResponse(403, 'Your are not authorized to edit this product');

    input.id = productId;
    const data = await this._repository.updateProduct(input);

    return SucessResponse(data);
  }

  async getProducts() {
    const data = await this._repository.getAllProducts();
    return SucessResponse(data);
  }

  async getProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, 'please provide product id');

    const data = await this._repository.getProductById(productId);
    return SucessResponse(data);
  }

  async getSellerProducts(event: APIGatewayEvent) {
    // user authorized? (1) --> only sellers
    const user = await authUser(event.headers.Authorization);
    if (!user) return ErrorResponse(403, 'Authorization failed');
    if (user.user_type.toUpperCase() !== 'SELLER') {
      return ErrorResponse(403, 'Join seller program to manage product');
    }

    const data = await this._repository.getAllSellerProducts(user.user_id);
    return SucessResponse(data);
  }

  async deleteProduct(event: APIGatewayEvent) {
    // user authorized? (1) --> only sellers
    const user = await authUser(event.headers.Authorization);
    if (!user) return ErrorResponse(403, 'Authorization failed');
    if (user.user_type.toUpperCase() !== 'SELLER') {
      return ErrorResponse(403, 'Join seller program to manage product');
    }

    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, 'please provide product id');

    // user authorized? (2) --> only creator
    const isAuthorized = await this.authorizedUser(user.user_id, productId);
    if (!isAuthorized)
      return ErrorResponse(
        403,
        'Your are not authorized to delete this product'
      );

    const { category_id, deleteResult } = await this._repository.deleteProduct(
      productId
    );
    await new CategoryRepository().removeItem({
      id: category_id,
      products: [productId],
    });
    return SucessResponse(deleteResult);
  }

  // http calls // later stage we will convert this thing to RPC & Queue
  async handleQueueOperation(event: APIGatewayProxyEvent) {
    const input = plainToClass(ServiceInput, event.body);
    const error = await AppValidationError(input);
    if (error) return ErrorResponse(404, error);

    const { _id, name, price, image_url } =
      await this._repository.getProductById(input.productId);

    return SucessResponse({
      product_id: _id,
      name,
      price,
      image_url,
    });
  }
}
