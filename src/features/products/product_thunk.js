import { createAsyncThunk } from '@reduxjs/toolkit';
import ProductApi from '../../services/product_api';
import DataService from '../../services/user_api';
import { supabase } from '../../supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

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

export const getSellinglist = createAsyncThunk('/products/getSellingList', async ({ profile }, { rejectWithValue }) => {
  try {
    const { data: productIds, error } = await supabase
      .from('mysellinglist')
      .select('*')
      .eq('seller_id', profile.user_id);
    if (error) {
      console.log('판매 중인 상품 ID 리스트를 불러오는 중 오류: ', error);
      return rejectWithValue(error.message);
    }
    if (productIds && productIds.length > 0) {
      const ids = productIds.map((item) => item.product_id);
      const { data: products, error: NotFoundProducts } = await supabase.from('product').select('*').in('id', ids);

      if (NotFoundProducts) {
        console.log('판매 중인 상품 리스트 로드 에러: ', NotFoundProducts);
        return rejectWithValue(error.message);
      }
      if (products && products.length > 0) {
        console.log('성공적으로 상품 정보들을 로드하였습니다! ', products);
        return products;
      }
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

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.updateProductStatus(token, data);
      if (response.data) {
        return response.data.products;
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
  async ({ data }, { rejectWithValue }) => {
    try {
      console.log('data: ', data);
      const ids = [];
      Object.keys(data).forEach((key) => {
        if (data[key]) ids.push(key);
      });
      console.log('ids: ', ids);
      const {
        data: deleteResult,
        status,
        error: productDeleteError,
      } = await supabase.from('mysellinglist').delete().in('product_id', ids).select();
      console.log('deleteResult: ', deleteResult);
      console.log('status: ', status);
      if (productDeleteError) {
        console.log('판매 취소 요청 실패', productDeleteError);
      }
      if (deleteResult) {
        console.log('판매 취소 요청 성공', deleteResult);
        const { data: rows, error: getlistErr } = await supabase
          .from('mysellinglist')
          .select('*')
          .eq('seller_id', profile.user_id);
        if (getlistErr) {
          console.log('getlistErr: ', getlistErr);
          return rejectWithValue(getlistErr.message);
        }
        if (rows && rows.length > 0) {
          const productIds = rows.map((item) => item.product_id);
          const { data: products, error: getProductsErr } = await supabase
            .from('product')
            .select('*')
            .in('id', productIds);
          if (getProductsErr) {
            console.log('상품 정보 불러오기 실패: ', getProductsErr);
            return rejectWithValue(getProductsErr.message);
          }
          if (products && products.length > 0) {
            console.log('성공적으로 상품 정보 로드 완료: ', products);
            return products;
          }
        }
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

export const addProduct = createAsyncThunk('products/addProduct', async ({ data, created_id }, { rejectWithValue }) => {
  try {
    console.log('add Product Image: ', data.imgObject);
    const { data: uploadProductImg, error: uploadError } = await supabase.storage
      .from('Products')
      .upload(`${data.seller}/first/${created_id}.${data.imgType}`, decode(data.imgObject), { upsert: true });
    if (uploadError) {
      console.log('Error: ', uploadError);
      return rejectWithValue(uploadError.message);
    }
    if (uploadProductImg) {
      console.log('Success to upload Product Image!', uploadProductImg);
      const result = [];
      for (const [idx, file] of data.detailFiles.entries()) {
        try {
          const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
          const fileExtension = file.mimeType.split('/').pop();

          const { data: detailImgUpload, error: detailImgErr } = await supabase.storage
            .from('Products')
            .upload(`${data.seller}/details/${created_id}_${idx}.${fileExtension}`, decode(base64), { upsert: true });

          if (detailImgErr) {
            console.log(`Failed to upload Product Detail Img ${idx}`, detailImgErr.message);
            continue;
          }

          if (detailImgUpload) {
            console.log('상품 상세정보 이미지 업로드 완료');
            result.push(detailImgUpload);
          }
        } catch (fileError) {
          console.log(`Failed to process file ${file.uri}`, fileError.message);
        }
      }
      const { data: createProduct, error: createProductError } = await supabase
        .from('product')
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
      console.log(createProduct);
      if (createProductError) {
        console.log('Failed to create Product!', createProductError);
        return rejectWithValue(createProductError.message);
      }
      if (createProduct) {
        console.log('Success to create Product!', createProduct);
        const { data: addTolist, error: failedToAdd } = await supabase
          .from('mysellinglist')
          .insert([{ seller_id: data.seller, product_id: created_id }])
          .select();
        if (failedToAdd) {
          console.log('Failed to insert the mysellinglist row', failedToAdd);
          return rejectWithValue(failedToAdd.message);
        }
        if (addTolist) {
          console.log('You have been successfully added to our sales list!');
          const { data: findlist, error: NotFoundlist } = await supabase
            .from('mysellinglist')
            .select('*')
            .eq('seller_id', data.seller);
          if (NotFoundlist) {
            console.log('Failed to load mysellinglist', NotFoundlist);
            return rejectWithValue(NotFoundlist.message);
          }
          if (findlist && findlist.length > 0) {
            const productIds = findlist.map((item) => item.product_id);
            const { data: products, error: NotFoundSellingList } = await supabase
              .from('product')
              .select('*')
              .in('id', productIds);

            if (NotFoundSellingList) {
              console.log('판매 중인 상품 목록을 불러오지 못했습니다!: ', NotFoundSellingList);
            }
            if (products && products.length > 0) {
              console.log('판매 중인 상품 정보를 성공적으로 불러왔습니다!', products);
              return products;
            }
          }
        }
      }
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
  async ({ token, data, id }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.updateProduct(token, data, id);
      if (response.data) {
        return response.data.products;
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

export const findProductByKeyword = createAsyncThunk(
  'products/findProductByKeyWord',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.findByProductByKeyword(token, data);
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

export const findProductByCategory = createAsyncThunk(
  'products/findProductByCategory',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.categoriesItem(token, data);
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

export const findProduct = createAsyncThunk('products/findProduct', async ({ product_id }, { rejectWithValue }) => {
  try {
    const response = await ProductApi.findProduct(product_id);
    if (response.data) {
      return response.data;
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

export const updateProductLike = createAsyncThunk(
  'products/updateProductLike',
  async ({ token, likes }, { rejectWithValue }) => {
    try {
      const response = await ProductApi.updatelikeProduct(token, likes);
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
