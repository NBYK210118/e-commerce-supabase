import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../supabase';

export const uploadImage = async ({ uri, filePath, bucket_name }) => {
  const base64Data = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });

  const { data, error } = await supabase.storage.from(bucket_name).upload(filePath, decode(base64Data), {
    upsert: true,
  });
  if (error) {
    console.log('storage Error: ', error);
    return;
  }
  console.log(`${bucket_name}에 성공적으로 이미지 업로드 완료! 경로:${filePath}`);
  return data;
};

export const getSellinglist = async (userId) => {
  const { data: findlist, error: NotFoundlist } = await supabase
    .from('mysellinglist')
    .select('*')
    .eq('seller_id', userId);
  if (NotFoundlist) {
    console.log('Failed to load mysellinglist', NotFoundlist);
    return;
  }
  if (findlist && findlist.length > 0) {
    const productIds = findlist.map((item) => item.product_id);
    const { data: products, error: NotFoundSellingList } = await supabase
      .from('product')
      .select('*')
      .in('id', productIds);

    if (NotFoundSellingList) {
      console.log('판매 중인 상품 목록을 불러오지 못했습니다!: ', NotFoundSellingList);
      return;
    }
    if (products && products.length > 0) {
      console.log('판매 중인 상품 정보를 성공적으로 로드 완료!', products);
      return products;
    }
  }
};

export const getMyLikes = async (user_id) => {
  const { data, error } = await supabase.from('Likes').select('product_id').eq('user_id', user_id);
  if (error) {
    console.log('좋아요 상품 ID 리스트 로드 실패s: ', error);
    return;
  }
  const ids = data.map((val) => val.product_id);
  const { data: myLikes, error: failToLoad } = await supabase.from('product').select('*').in('id', ids);
  if (failToLoad) {
    console.log('좋아요 리스트 로드 실패: ', failToLoad);
    return;
  }
  console.log(myLikes);
  return myLikes;
};

export const productImagesUpsert = async ({ data, created_id }) => {
  let productId = created_id || data.id;
  if (Object.keys(data).length === 0) {
    console.log('데이터에 존재하는 값이 없습니다');
    return;
  }
  const bucket_name = 'Products';
  const fileExtension = data.image.split('.').pop();
  const filePath = `${data.seller}/first/${productId}.${fileExtension}`;
  const upload_response = await uploadImage({ uri: data.image, bucket_name, filePath });

  const result = [];

  const updateDetailImages = data.detailFiles.map(async (file, idx) => {
    try {
      const fileExtension = file.mimeType.split('/').pop();
      const filePath = `${data.seller}/details/${productId}_${idx}.${fileExtension}`;
      const detailImgUpload = await uploadImage({ uri: file.uri, bucket_name, filePath });
      result.push(detailImgUpload);
    } catch (error) {
      console.log(`Failed to process file ${file.uri}`, error);
      throw new Error(error);
    }
  });
  await Promise.all(updateDetailImages);
  return { result, uploadProductImg: upload_response };
};

export const addProductToSellingList = async ({ seller_id, product_id, take = false }) => {
  const { data: addTolist, error: failedToAdd } = await supabase
    .from('mysellinglist')
    .upsert([{ seller_id, product_id }])
    .select();
  if (failedToAdd) {
    console.log('Failed to insert the mysellinglist row');
    throw new Error(failedToAdd.message);
  }
  if (addTolist) {
    console.log('You have been successfully added to our sales list!');
    if (take) {
      const result = await getSellinglist(seller_id);
      return result;
    }
    return;
  }
};

export const findProductKeyword = async ({ keyword, user_id }) => {
  // 내 판매 리스트 로드
  const my_products = await getSellinglist(user_id);
  // 상품 ID 추출
  const ids = my_products.map((item) => item.id);
  // 추출한 ID 에 해당하는 상품(내 판매 리스트)를 로드하고 keyword와 같은 상품 찾아오기
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .in('id', ids)
    .textSearch('description', keyword, { type: 'plain' });
  if (error) {
    console.log('검색어에 해당하는 상품이 존재하지 않습니다', error);
    return;
  }
  return data;
};

export const findProductCategory = async ({ user_id, category }) => {
  const my_products = await getSellinglist(user_id);
  const ids = my_products.map((item) => item.id);
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .in('id', ids)
    .textSearch('category', category, { type: 'plain' });
  if (error) {
    console.log('선택된 카테고리에 해당하는 상품이 존재하지 않습니다', error);
    return;
  }
  return data;
};

export const getAllProducts = async () => {
  const { data, error } = await supabase.from('product').eq('status', '판매중');
  if (error) {
    console.log('전체 상품 리스트 로드 에러: ', error);
    return;
  }
  return data;
};

export const productListByCategory = async ({ category }) => {
  const { data, error } = await supabase.from('product').select('*').eq('category', category).eq('status', '판매중');
  if (error) {
    console.log('error: ', error);
    return;
  }
  return data;
};

export const getAllReviews = async ({ product_id }) => {
  const { data, error } = await supabase.from('ReviewProduct').select('review_id').eq('product_id', product_id);

  if (error) {
    console.log('리뷰 ID 로드 오류: ', error);
    return;
  }

  const ids = data.map((val) => val.review_id);
  const { data: successLoad, error: loadError } = await supabase.from('Review').select('*').in('id', ids);

  if (loadError) {
    console.log(loadError);
    return;
  }

  return successLoad;
};

export const checkIsUsers = async ({ user_id, product_id }) => {
  const { data, error } = await supabase.from('product').select('*').eq('id', product_id).eq('seller_id', user_id);
  if (error) {
    console.log('현재 상품이 현재 사용자가 판매하고 있는 상품인지 확인 중 에러: ', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('fucntion checkIsUsers: ', data);
    return true;
  } else {
    console.log('fucntion checkIsUsers: ', data);
    return false;
  }
};

export const alreadyReviewed = async ({ user_id, product_id }) => {
  const { data, error } = await supabase
    .from('ReviewProduct')
    .select('*')
    .eq('product_id', product_id)
    .eq('user_id', user_id);
  if (error) {
    console.log('현재 상품에 이미 리뷰를 작성했었는지 확인 중 에러: ', error);
    return;
  }

  if (data) return true;
  else return false;
};

export const record_viewed = async ({ user_id, product_id }) => {
  const { data, error } = await supabase.from('viewedProduct').insert({ user_id, product_id }).select();
  if (error) {
    console.log('조회수 error: ', error);
    return;
  }
  if (data && data.length > 0) {
    console.log(`상품 ID ${product_id} 조회수 상승s`);
    return;
  }
};

export const isLikedProduct = async ({ user_id, product_id }) => {
  const { data, error } = await supabase
    .from('Likes')
    .select('*')
    .eq('user_id', user_id)
    .eq('product_id', product_id)
    .select();
  if (error) {
    console.log('좋아요 체크 여부 확인 중 에러: ', error);
    return;
  }
  console.log('좋아요 누름? ', data);
  if (data.length > 0) {
    console.log('좋아요 누른 상품인지: ', data);
    return true;
  } else return false;
};

export const toggleLiked = async ({ liked, user_id, product_id }) => {
  const { data: isExistProduct, error: foundErr } = await supabase
    .from('product')
    .select('*')
    .eq('id', product_id)
    .single();
  if (foundErr) {
    console.log('존재하지 않는 상품 ID: ', foundErr);
    return;
  }
  if (isExistProduct) {
    console.log('프론트상에서의 좋아요 상태: ', liked);
    if (liked) {
      const { data, error } = await supabase.from('Likes').insert([{ user_id, product_id }]).select();
      if (error) {
        console.log('좋아요 누르기 실패: ', error);
      }
    } else {
      const result = await isLikedProduct({ user_id, product_id });
      if (result) {
        const { data, error } = await supabase
          .from('Likes')
          .delete()
          .eq('user_id', user_id)
          .eq('product_id', product_id)
          .select();
        if (error) {
          console.log('좋아요 취소 실패', error);
          return;
        }
        if (data) {
          console.log('좋아요 취소 성공', data);
        }
      }
    }
  }

  const mylikes = await getMyLikes(user_id);
  return mylikes;
};

export const howManyLikes = async ({ product_id }) => {
  const { data, error } = await supabase.from('Likes').select('user_id').eq('product_id', product_id);
  if (error) {
    console.log('좋아요 갯수 로드 실패: ', error);
    return;
  }
  console.log('현재 상품 좋아요 갯수: ', data.length);
  return data.length;
};

export const getShoppingBasket = async ({ user_id }) => {
  const { data: basketInfo, error } = await supabase.from('shoppingbasket').select('*').eq('user_id', user_id);
  if (error) {
    console.log('사용자 장바구니 리스트 불러오기', error);
    return;
  }
  const ids = basketInfo.map((val) => val.product_id);
  const { data: myBasket, error: basketLoadErr } = await supabase.from('product').select('*').in('id', ids);
  if (basketLoadErr) {
    console.log('장바구니 상품 로드 실패: ', basketLoadErr);
    return;
  }
  console.log('장바구니 로드 성공!');

  return { myBasket, basketInfo };
};

export const addProductInMyBasket = async ({ user_id, product_id }) => {
  const { data, error } = await supabase.from('shoppingbasket').upsert([{ user_id, product_id }]).select();
  if (error) {
    console.log('장바구니 추가 에러: ', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('장바구니에 추가 성공!');
    await insertBasketSummary({ user_id });
  }

  const { myBasket } = await calculateBasketSummary({ user_id });
  return myBasket;
};

export const insertBasketSummary = async ({ user_id }) => {
  const { data: createBasketSummary, error: createError } = await supabase
    .from('basketsummary')
    .upsert([{ user_id }])
    .select();
  if (createError) {
    console.log('basketSummary insert 에러: ', createError);
    return;
  }

  return createBasketSummary;
};

export const calculateBasketSummary = async ({ user_id }) => {
  const { myBasket, basketInfo } = await getShoppingBasket({ user_id });

  const originTotal = myBasket.reduce((acc, item) => {
    const quantity = basketInfo.find((info) => info.product_id === item.id)?.quantity || 1;
    return acc + item.price * quantity;
  }, 0);

  const totallyDiscount = myBasket.reduce((acc, item) => {
    const quantity = basketInfo.find((info) => info.product_id === item.id)?.quantity || 1;
    if (item.isdiscounting) {
      return acc + (item.price - item.discountprice) * quantity;
    }
    return acc;
  }, 0);

  const finalPay = myBasket.reduce((acc, item) => {
    const quantity = basketInfo.find((info) => info.product_id === item.id)?.quantity || 1;
    const price = item.isdiscounting ? item.discountprice : item.price;
    return acc + price * quantity;
  }, 0);

  return { basketInfo, myBasket, productSummary: { originTotal, totallyDiscount, finalPay } };
};

export const getProductCountInBakset = async ({ user_id, product_id }) => {
  const { data, error } = await supabase
    .from('shoppingbasket')
    .select('*')
    .eq('user_id', user_id)
    .eq('product_id', product_id);
  if (error) {
    console.log('Error: ', error);
    return;
  }
  if (data) {
    if (data.length === 1) {
      return data.quantity;
    }
    return data;
  }
};

export const getAllCategoryProducts = async ({ category }) => {
  const { data, error } = await supabase.from('product').select('*').eq('status', '판매중').eq('category', category);
  if (error) {
    console.log(`<${category}> 상품 로드 에러`, error);
  }
  if (data && data.length > 0) {
    console.log(`<${category}> 상품 로드 성공`, data);
    return data;
  }
};
