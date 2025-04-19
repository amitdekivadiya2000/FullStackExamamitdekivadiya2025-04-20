import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  minStockLevel: number;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minStockLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
productSchema.index({ name: 'text', description: 'text' });

// Create compound index for category and price
productSchema.index({ category: 1, price: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema); 