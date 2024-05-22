import { createAsyncThunk } from "@reduxjs/toolkit";
import ProductApi from "../../services/product_api";
import { supabase } from "../../supabase";
import {
  getSellinglist,
  productImagesUpsert,
} from "../../services/supabase_functions";

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async ({ data, created_id }, { rejectWithValue }) => {
    try {
      const { result, uploadProductImg } = productImagesUpsert(
        data,
        created_id
      );
      const { data: createProduct, error: createProductError } = await supabase
        .from("product")
        .insert([
          {
            id: created_id,
            seller_id: data.seller,
            name: data.name,
            category: data.category,
            price: data.price,
            manufacturer: data.manufacturer,
            description: data.detail,
            description_file: result,
            inventory: data.inventory,
            isdiscounting: data.isDiscounting,
            discountprice: data.discountPrice,
            discountratio: data.discountRatio,
            status: data.status,
            imgFile: uploadProductImg,
          },
        ])
        .select();
      if (createProductError) {
        console.log("Failed to create Product!", createProductError);
        return rejectWithValue(createProductError.message);
      }
      if (createProduct) {
        console.log("Success to create Product!", createProduct);
        const { data: addTolist, error: failedToAdd } = await supabase
          .from("mysellinglist")
          .upsert([{ seller_id: data.seller, product_id: created_id }])
          .select();
        if (failedToAdd) {
          console.log("Failed to insert the mysellinglist row", failedToAdd);
          return rejectWithValue(failedToAdd.message);
        }
        if (addTolist) {
          console.log("You have been successfully added to our sales list!");
          const result = getSellinglist(data.seller_id);
          return result;
        }
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ updateInfo, id, seller_id }, { rejectWithValue }) => {
    try {
      const { result, uploadProductImg } = productImagesUpsert(updateInfo);
      const { data: createProduct, error: createProductError } = await supabase
        .from("product")
        .update({
          id,
          seller_id,
          name: updateInfo.name,
          category: updateInfo.category,
          price: updateInfo.price,
          manufacturer: updateInfo.manufacturer,
          description: updateInfo.detail,
          description_file: result,
          inventory: updateInfo.inventory,
          isdiscounting: updateInfo.isDiscounting,
          discountprice: updateInfo.discountPrice,
          discountratio: updateInfo.discountRatio,
          status: updateInfo.status,
          imgFile: uploadProductImg,
        })
        .select();
      if (createProductError) {
        console.log("Failed to create Product!", createProductError);
        return rejectWithValue(createProductError.message);
      }
      if (createProduct) {
        console.log("Success to create Product!", createProduct);
        const { data: addTolist, error: failedToAdd } = await supabase
          .from("mysellinglist")
          .insert([{ seller_id, product_id: created_id }])
          .select();
        if (failedToAdd) {
          console.log("Failed to insert the mysellinglist row", failedToAdd);
          return rejectWithValue(failedToAdd.message);
        }
        if (addTolist) {
          console.log("You have been successfully added to our sales list!");
          const result = getSellinglist(seller_id);
          return result;
        }
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const deleteSellingProducts = createAsyncThunk(
  "products/deleteProductStatus",
  async ({ data, profile }, { rejectWithValue }) => {
    try {
      const ids = [];
      Object.keys(data).forEach((key) => {
        if (data[key]) ids.push(key);
      });
      console.log("ids: ", ids);
      const {
        data: deleteResult,
        status,
        error: productDeleteError,
      } = await supabase
        .from("mysellinglist")
        .delete()
        .in("product_id", ids)
        .select();
      if (productDeleteError) {
        console.log("판매 취소 요청 실패", productDeleteError);
      }
      if (deleteResult) {
        console.log("판매 취소 요청 성공", deleteResult);
        const result = getSellinglist(profile.user_id);
        return result;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const takeSellinglist = createAsyncThunk(
  "/products/getSellingList",
  async ({ profile }, { rejectWithValue }) => {
    try {
      const data = getSellinglist(profile.user_id);
      return data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const getCategory = createAsyncThunk(
  "/products/getCategory",
  async ({ navigate }, { rejectWithValue }) => {
    try {
      let { data, error } = await supabase.from("category").select("*");
      if (error) {
        console.log("Failed to load categories", error);
        return;
      }
      if (data) {
        return data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const getMostViewedProducts = createAsyncThunk(
  "/products/getMostViewedProducts",
  async ({ navigation }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getMostInterested(navigation);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const getDiscountingProducts = createAsyncThunk(
  "products/getDiscountingProducts",
  async ({ navigation }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getDiscountingProducts(navigation);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const getRecommendProduct = createAsyncThunk(
  "products/getRecommendProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getRecommendProduct();
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const getWatchedProducts = createAsyncThunk(
  "products/getWatchedProducts",
  async ({ token, navigation }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.userRecentWatched(token, navigation);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  "products/updateProductStatus",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.updateProductStatus(token, data);
      if (response.data) {
        return response.data.products;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const findProductByKeyword = createAsyncThunk(
  "products/findProductByKeyWord",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.findByProductByKeyword(token, data);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const findProductByCategory = createAsyncThunk(
  "products/findProductByCategory",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.categoriesItem(token, data);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const findProduct = createAsyncThunk(
  "products/findProduct",
  async ({ product_id }, { rejectWithValue }) => {
    try {
      const { data: productInfo, error: productErr } = await supabase
        .from("product")
        .select("*")
        .eq("id", product_id)
        .single();

      if (productErr) {
        console.log("상품 정보 불러오던 중 에러 발생: ", productErr);
        return;
      }

      if (productInfo) {
        console.log("성공적으로 상품 정보를 불러왔습니다!", productInfo);
        return productInfo;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occured",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);

export const updateProductLike = createAsyncThunk(
  "products/updateProductLike",
  async ({ token, likes }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.updatelikeProduct(token, likes);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || "Unknown error occurred",
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || "Network error",
          status: 500,
        });
      }
    }
  }
);
