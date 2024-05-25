import { createAsyncThunk } from '@reduxjs/toolkit';
import ProductApi from '../../services/product_api';
import { supabase } from '../../supabase';
import {
  addProductToSellingList,
  findProductCategory,
  findProductKeyword,
  getMyLikes,
  getSellinglist,
  productImagesUpsert,
  productListByCategory,
  toggleLiked,
} from '../../services/supabase_functions';
import uuid from 'react-native-uuid';

export const findProduct = createAsyncThunk('products/findProduct', async ({ product_id }, { rejectWithValue }) => {
  try {
    const { data: productInfo, error: productErr } = await supabase
      .from('product')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productErr) {
      console.log('상품 정보 불러오던 중 에러 발생: ', productErr);
      return;
    }

    if (productInfo) {
      console.log('성공적으로 상품 정보를 불러왔습니다!', productInfo);
      return productInfo;
    }
  } catch (error) {
    if (error.response) {
      return rejectWithValue({
        message: error.response.data.message || 'Unknown error occured',
        status: error.response.status,
      });
    } else {
      return rejectWithValue({
        message: error.message || 'Network error',
        status: 500,
      });
    }
  }
});

export const takeSellinglist = createAsyncThunk(
  '/products/getSellingList',
  async ({ profile }, { rejectWithValue }) => {
    try {
      console.log('판매 리스트 불러오는 중...');
      const data = await getSellinglist(profile.user_id);
      return data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const addProduct = createAsyncThunk('products/addProduct', async ({ data }, { rejectWithValue }) => {
  try {
    const id = uuid.v4();
    const { result, uploadProductImg } = await productImagesUpsert({ data, created_id: id });
    const { data: createProduct, error: createProductError } = await supabase
      .from('product')
      .insert([
        {
          id,
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
      console.log('Failed to create Product!', createProductError);
      return rejectWithValue(createProductError.message);
    }
    if (createProduct) {
      console.log('Success to create Product!', createProduct);
      const response = await addProductToSellingList({ seller_id: data.seller, product_id: id, take: true });
      return response;
    }
  } catch (error) {
    if (error.response) {
      return rejectWithValue({
        message: error.response.data.message || 'Unknown error occurred',
        status: error.response.status,
      });
    } else {
      return rejectWithValue({
        message: error.message || 'Network error',
        status: 500,
      });
    }
  }
});

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ updateInfo, product_id }, { rejectWithValue }) => {
    try {
      console.log('updateProduct 동작 시작');
      const { result, uploadProductImg } = await productImagesUpsert({ data: updateInfo });
      const { data: createProduct, error: createProductError } = await supabase
        .from('product')
        .update({
          id: product_id,
          seller_id,
          name: updateInfo.name,
          category: updateInfo.category,
          price: updateInfo.price,
          manufacturer: updateInfo.manufacturer,
          description: updateInfo.detail,
          description_file: result,
          inventory: updateInfo.inventory,
          isdiscounting: updateInfo.isdiscounting,
          discountprice: updateInfo.discountPrice,
          discountratio: updateInfo.discountRatio,
          status: updateInfo.status,
          imgFile: uploadProductImg,
        })
        .eq('seller_id', updateInfo.seller)
        .select();
      if (createProductError) {
        console.log('Failed to create Product!', createProductError);
        return rejectWithValue(createProductError.message);
      }
      if (createProduct) {
        console.log('Success to create Product!', createProduct);
        const result = await getSellinglist(seller_id);
        return result;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const deleteSellingProducts = createAsyncThunk(
  'products/deleteProductStatus',
  async ({ data, profile }, { rejectWithValue }) => {
    try {
      const ids = [];
      Object.keys(data).forEach((key) => {
        if (data[key]) ids.push(key);
      });
      const { data: deleteResult, error: productDeleteError } = await supabase
        .from('mysellinglist')
        .delete()
        .in('product_id', ids)
        .select();
      if (productDeleteError) {
        console.log('판매 취소 요청 실패', productDeleteError);
        return rejectWithValue(productDeleteError.message);
      }
      if (deleteResult) {
        console.log('판매 취소 요청 성공', deleteResult);
        const result = await getSellinglist(profile.user_id);
        return result;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

// mysellinglist 테이블 내부에서 검색
export const findProductByKeyword = createAsyncThunk(
  'products/findProductByKeyWord',
  async ({ data, user_id }, { rejectWithValue }) => {
    try {
      const selling_list = await findProductKeyword({ keyword: data, user_id });
      return selling_list;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

// myellinglist 에서 카테고리에 해당하는 상품들 검색
export const findProductByCategory = createAsyncThunk(
  'products/findProductByCategory',
  async ({ category, user_id }, { rejectWithValue }) => {
    try {
      const selling_list = await findProductCategory({ user_id, category });
      return selling_list;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const getProductListByCategory = createAsyncThunk(
  'products/getProductListByCategory',
  async ({ category }, { rejectWithValue }) => {
    try {
      const data = await productListByCategory({ category });
      return data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const getCategory = createAsyncThunk('/products/getCategory', async ({ navigate }, { rejectWithValue }) => {
  try {
    let { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.log('Failed to load categories', error);
      return;
    }
    if (data) {
      return data;
    }
  } catch (error) {
    if (error.response) {
      return rejectWithValue({
        message: error.response.data.message || 'Unknown error occurred',
        status: error.response.status,
      });
    } else {
      return rejectWithValue({
        message: error.message || 'Network error',
        status: 500,
      });
    }
  }
});

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ data, user_id }, { rejectWithValue }) => {
    try {
      const updateProductStatus = Object.keys(data).map(async (productId) => {
        try {
          await supabase
            .from('product')
            .update({
              status: data[productId] ? '보류중' : '판매중',
            })
            .eq('id', productId)
            .select();
        } catch (error) {
          console.log('상품 상태 업데이트 실패: ', error);
          return;
        }
      });
      await Promise.all(updateProductStatus);
      const result = await getSellinglist(user_id);
      return result;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

// ========================== 아직 미구현 ===========================

export const getMostViewedProducts = createAsyncThunk(
  '/products/getMostViewedProducts',
  async ({ navigation }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getMostInterested(navigation);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const getDiscountingProducts = createAsyncThunk(
  'products/getDiscountingProducts',
  async ({ navigation }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.getDiscountingProducts(navigation);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const getRecommendProduct = createAsyncThunk('products/getRecommendProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await ProductApi.getRecommendProduct();
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      return rejectWithValue({
        message: error.response.data.message || 'Unknown error occurred',
        status: error.response.status,
      });
    } else {
      return rejectWithValue({
        message: error.message || 'Network error',
        status: 500,
      });
    }
  }
});

export const getWatchedProducts = createAsyncThunk(
  'products/getWatchedProducts',
  async ({ token, navigation }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.userRecentWatched(token, navigation);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const getLikes = createAsyncThunk('products/getLikes', async ({ user_id }, { rejectWithValue }) => {
  try {
    const mylikes = await getMyLikes(user_id);
    return mylikes;
  } catch (error) {
    if (error.response) {
      return rejectWithValue({
        message: error.response.data.message || 'Unknown error occurred',
        status: error.response.status,
      });
    } else {
      return rejectWithValue({
        message: error.message || 'Network error',
        status: 500,
      });
    }
  }
});

export const updateProductLikeStatus = createAsyncThunk(
  'products/updateProductLike',
  async ({ user_id, data }, { rejectWithValue }) => {
    try {
      await Promise.all(
        Object.keys(data).map(async (product_id) => {
          if (data[product_id]) {
            await supabase.from('Likes').upsert({ user_id, product_id }).select();
          } else {
            const { data: isExist, error: Notfound } = await supabase
              .from('Likes')
              .select('*')
              .eq('user_id', user_id)
              .eq('product_id', product_id);
            if (Notfound) {
              console.log('이미 존재하지 않는 row ', Notfound);
              throw Notfound;
            }
            if (isExist) {
              await supabase.from('Likes').delete().eq('user_id', user_id).eq('product_id', product_id).single();
            }
          }
        })
      );
      const my_likes = await getMyLikes(user_id);
      return my_likes;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);

export const toggleLikedIcon = createAsyncThunk(
  'products/toggleLikedIcon',
  async ({ liked, user_id, product_id }, { rejectWithValue }) => {
    try {
      const mylikes = await toggleLiked({ liked, user_id, product_id });
      return mylikes;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Unknown error occurred',
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          message: error.message || 'Network error',
          status: 500,
        });
      }
    }
  }
);
