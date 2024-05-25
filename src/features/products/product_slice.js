import { createSlice } from '@reduxjs/toolkit';
import {
  addProduct,
  deleteSellingProducts,
  findProduct,
  findProductByCategory,
  findProductByKeyword,
  getCategory,
  getDiscountingProducts,
  getLikes,
  getMostViewedProducts,
  getProductListByCategory,
  getRecommendProduct,
  getWatchedProducts,
  takeSellinglist,
  updateProduct,
  updateProductLikeStatus,
  updateProductStatus,
} from './product_thunk';

export const Products = createSlice({
  name: 'products',
  initialState: {
    currentProduct: null,
    currentStars: 5,
    categories: [],
    mostViewed: [],
    discounting: [],
    recommended: [],
    products: [],
    likes: [],
    watchedProducts: [],
    sellinglist: [],
    loading: false,
    selectedProductId: null,
    error: '',
  },
  reducers: {
    setSellinglist: (state, action) => {
      state.sellinglist = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProductId = action.payload;
    },
  },
  extraReducers: (bulider) => {
    bulider
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getLikes.pending, (state) => {
        state.loading = false;
      })
      .addCase(getLikes.fulfilled, (state, action) => {
        state.loading = true;
        state.likes = action.payload;
      })
      .addCase(getLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductLikeStatus.pending, (state) => {
        state.loading = false;
      })
      .addCase(updateProductLikeStatus.fulfilled, (state, action) => {
        state.loading = true;
        state.likes = action.payload;
      })
      .addCase(updateProductLikeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMostViewedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMostViewedProducts.fulfilled, (state, action) => {
        state.mostViewed = action.payload;
        state.loading = false;
      })
      .addCase(getMostViewedProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getDiscountingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDiscountingProducts.fulfilled, (state, action) => {
        state.discounting = action.payload;
        state.loading = false;
      })
      .addCase(getDiscountingProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getRecommendProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendProduct.fulfilled, (state, action) => {
        state.recommended = action.payload;
        state.loading = false;
      })
      .addCase(getRecommendProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getWatchedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWatchedProducts.fulfilled, (state, action) => {
        state.watchedProducts = action.payload;
        state.loading = false;
      })
      .addCase(getWatchedProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(takeSellinglist.pending, (state) => {
        state.loading = true;
      })
      .addCase(takeSellinglist.fulfilled, (state, action) => {
        state.sellinglist = action.payload;
        state.loading = false;
      })
      .addCase(takeSellinglist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.sellinglist = action.payload;
        state.loading = false;
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteSellingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSellingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.sellinglist = action.payload;
      })
      .addCase(deleteSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.sellinglist = action.payload;
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.sellinglist = action.payload;
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(findProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(findProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(findProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(findProductByKeyword.pending, (state) => {
        state.loading = true;
      })
      .addCase(findProductByKeyword.fulfilled, (state, action) => {
        state.sellinglist = action.payload;
        state.loading = false;
      })
      .addCase(findProductByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(findProductByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(findProductByCategory.fulfilled, (state, action) => {
        state.sellinglist = action.payload;
        state.loading = false;
      })
      .addCase(findProductByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductListByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductListByCategory.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(getProductListByCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});
export const { setSellinglist, setSelectedProduct } = Products.actions;
export default Products.reducer;
