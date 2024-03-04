import { ProductInput } from '../dto/product-input';
import { ProductDoc, products } from '../models';

// products = schema
// ProductDoc = type ProductModel & mongoose.Document

export class ProductRepository {
  constructor() {}

  async createProduct(input: ProductInput): Promise<ProductDoc> {
    return await products.create({
      ...input,
      availability: true,
    });
  }

  async updateProduct(input: ProductInput) {
    let existingProduct = (await products.findById(input.id)) as ProductDoc;

    existingProduct.name = input.name;
    existingProduct.description = input.description;
    existingProduct.price = input.price;
    existingProduct.category_id = input.category_id;
    existingProduct.image_url = input.image_url;
    existingProduct.availability = input.availability;

    return existingProduct.save();
  }

  async getProductById(id: string) {
    return (await products.findById(id)) as ProductDoc;
  }

  async deleteProduct(id: string) {
    const { category_id } = (await products.findById(id)) as ProductDoc;

    const deleteResult = await products.deleteOne({ _id: id });

    return { category_id, deleteResult };
  }

  getAllProducts(offset = 0, pages?: number) {
    return products
      .find()
      .skip(offset)
      .limit(pages ? pages : 500);
  }

  getAllSellerProducts(seller_id: number) {
    return products.find({ seller_id: seller_id });
  }
}
