import mongoose from 'mongoose';

// ts-type
type ProductModel = {
  name: string;
  description: string;
  image_url: string;
  price: number;
  availability: boolean;

  category_id: string;
  seller_id: number;
};

// exported ts-type
export type ProductDoc = mongoose.Document & ProductModel;

// create schema
const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    image_url: String,
    price: Number,
    availability: Boolean,

    category_id: String,
    seller_id: Number,
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

// exports model based on schema
const products =
  mongoose.models.products || // ??
  mongoose.model<ProductDoc>('products', productSchema);

export { products };
