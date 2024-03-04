import mongoose from 'mongoose';

type CategoryModel = {
  name: string;
  parentId: string;
  imageUrl: string;

  subCategories: CategoryDoc[];
  products: string[];

  displayOrder: number; // 100 - 1
};

export type CategoryDoc = mongoose.Document & CategoryModel;

const categorySchema = new mongoose.Schema(
  {
    name: String,
    parentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'categories',
    },
    imageUrl: String,

    subCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'categories',
      },
    ],
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'products',
      },
    ],

    displayOrder: { type: Number, default: 1 },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const categories =
  mongoose.models.categories ||
  mongoose.model<CategoryDoc>('categories', categorySchema);

export { categories };
