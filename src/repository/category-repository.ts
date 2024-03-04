import { AddItemInput, CategoryInput } from '../dto/category-input';
import { CategoryDoc, categories } from '../models';

export class CategoryRepository {
  constructor() {}

  async createCategory({ name, parentId, imageUrl }: CategoryInput) {
    const newCategory = await categories.create({
      name,
      parentId,
      //
      subCategories: [],
      products: [],
      imageUrl,
    });

    // if there is a parent id (not always the case)
    if (parentId) {
      const parentCategory = (await categories.findById(
        parentId
      )) as CategoryDoc;

      // add the newly created (sub)category to the array of subcategories of the parent
      parentCategory.subCategories = [
        ...parentCategory.subCategories,
        newCategory,
      ];
      await parentCategory.save();
    }
    // return newly created category
    return newCategory;
  }

  async getAllCategories(offset = 0, perPage?: number) {
    return await categories
      .find({ parentId: null })
      .populate({
        path: 'subCategories',
        model: 'categories',
        populate: {
          path: 'subCategories',
          model: 'categories',
        },
      })
      .skip(offset)
      .limit(perPage ? perPage : 100);
  }

  async getTopCategories() {
    return await categories
      .find(
        { parentId: { $ne: null } },
        {
          products: { $slice: 10 },
        }
      )
      .populate({
        path: 'products',
        model: 'products',
      })
      .sort({ displayOrder: 'descending' })
      .limit(10);
  }

  async getCategoryById(id: string, offset = 0, perPage?: number) {
    return await categories
      .findById(id, {
        products: { $slice: [offset, perPage ? perPage : 100] },
      })
      .populate({
        path: 'products',
        model: 'products',
      });
  }

  async updateCategory({ id, name, displayOrder, imageUrl }: CategoryInput) {
    let category = (await categories.findById(id)) as CategoryDoc;
    category.name = name;
    category.displayOrder = displayOrder;
    category.imageUrl = imageUrl;
    return category.save();
  }

  async deleteCategory(id: string) {
    return await categories.deleteOne({ _id: id });
  }

  // When creating a new product: add this newly created product to the array of products that already belong to this category
  async addItem({ id, products }: AddItemInput) {
    let category = (await categories.findById(id)) as CategoryDoc;
    category.products = [...category.products, ...products];
    return category.save();
  }

  // When deleting a product: remove this product from the array of products that belong to this category
  async removeItem({ id, products }: AddItemInput) {
    let category = (await categories.findById(id)) as CategoryDoc;

    // create new array without the specific product
    const excludeProducts = category.products.filter(
      (item: any) => !products.includes(item)
    );
    category.products = excludeProducts;
    return category.save();
  }
}
