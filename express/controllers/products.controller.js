const productModel = require('../models/products.model');

async function createProduct(req, res, next) {
  try {
    const createProduct = await productModel.create(req.body);
    res.status(201).json(createProduct);
  } catch (err) {
    next(err);
  }
}

async function getProducts(req, res, next) {
  try {
    const allProducts = await productModel.find();
    res.status(200).json(allProducts);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    let updateProduct = await productModel.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (updateProduct) {
      res.status(200).json(updateProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;
    let deletedProduct = await productModel.findByIdAndDelete(productId);
    if (deletedProduct) {
      res.status(200).json(deletedProduct);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
}
module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
