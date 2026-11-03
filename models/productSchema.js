const mongoose = require('mongoose');
const { Schema } = mongoose

const productSchema = new Schema({
  tittle: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sku: {
    type: String,
    sparse: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      isMain: {
        type: Boolean,
        default: false,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pendding", "active", "inactive"],
    default: "pendding",
  },
  tags: [String],
  weight: Number,
  slug: {
    type: String,
    lowercase: true,
  },
  section: {
    type: String,
    enum: ['None', 'Flash', 'Best'],
    default: 'None'
}

}, { timestamps: true });

productSchema.index({ tittle: "text", description: "text" });
productSchema.index({ status: 1 });

module.exports = mongoose.model("Product", productSchema);