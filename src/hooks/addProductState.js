import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductApi from '../services/product_api';
import { addProduct, updateProduct } from '../features/products/product_thunk';
import uuid from 'react-native-uuid';

export const useAddProductState = ({ route }) => {
  const product_id = route.params?.product_id;
  const { token, user, profile } = useSelector((state) => state.userAuth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState(null);
  const [category, setCategory] = useState(null);
  const [isDiscount, setIsDiscount] = useState(false);
  const [productPrice, setProductPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountRatio, setDiscountRatio] = useState('');
  const [detailImgs, setDetailImgs] = useState([]);
  const [detailFiles, setDetailFiles] = useState([]);
  const [count, setCount] = useState(0);
  const [detail, setDetail] = useState('');
  const [company, setCompany] = useState('');
  const [imgObjectToBucket, setImgObjectToBucket] = useState(null);
  const [imgType, setImgType] = useState(null);
  const [selectedItem, setSelectedItem] = useState('판매중');

  useEffect(() => {
    if (product_id) {
      ProductApi.findProduct(product_id).then((response) => {
        if (response.data) {
          const data = response.data;
          setCategory(data.category_name);
          setImage(data.images[0].imgUrl);
          setIsDiscount(data.isDiscounting);
          setName(data.name);
          setCount(data.inventory);
          setDiscountPrice(data.discountPrice.toLocaleString('ko-kr'));
          setDiscountRatio(data.discountRatio.toLocaleString('ko-kr'));
          setCompany(data.manufacturer);
          setProductPrice(data.price.toLocaleString('ko-kr'));
          setDetailImgs(data.detailImgs);
          setDetail(data.description[0]);
        }
      });
    }
  }, []);

  const handleBeforeBtn = () => {
    setActiveStep((p) => p - 1);
  };

  const removeComma = (price) => {
    if (typeof price === 'string') {
      if (price !== '') {
        const result = Number(price.replaceAll(',', ''));
        return result;
      } else return 0;
    }
  };

  const handleNextBtn = () => {
    if (!image || !name || !category) {
      alert('모든 필드를 입력해야 합니다. 이미지, 상품명, 카테고리를 확인해주세요.');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleFinishBtn = () => {
    const data = {
      image,
      imgObject: imgObjectToBucket,
      imgType,
      name,
      category,
      price: removeComma(productPrice),
      manufacturer: company,
      detail,
      detailImgs,
      detailFiles,
      inventory: count,
      isDiscounting: isDiscount,
      discountPrice: removeComma(discountPrice),
      discountRatio: removeComma(discountRatio),
      status: selectedItem,
      seller: user.id,
    };
    try {
      if (!product_id) {
        const created_id = uuid.v4();
        dispatch(addProduct({ user, data, created_id }));
        navigation.navigate('My Page');
      } else {
        dispatch(updateProduct({ token, data, id: product_id }));
        navigation.navigate('My Page');
      }
    } catch (error) {
      if (error.response !== undefined) {
        switch (error.response.status) {
          case 400:
            alert('잘못된 요청');
          case 401:
            alert('권한 없음');
          case 500:
            alert('서버 에러');
        }
      }
    }
  };

  return {
    token,
    user,
    navigation,
    dispatch,
    activeStep,
    image,
    name,
    category,
    isDiscount,
    productPrice,
    discountPrice,
    discountRatio,
    detailImgs,
    count,
    detail,
    company,
    selectedItem,
    detailFiles,
    setCount,
    setImgObjectToBucket,
    setSelectedItem,
    setDetailImgs,
    setDetailFiles,
    setImgType,
    setProductPrice,
    setImage,
    setName,
    setDiscountRatio,
    setDiscountPrice,
    setCompany,
    setDetail,
    setCategory,
    setIsDiscount,
    handleBeforeBtn,
    handleNextBtn,
    handleFinishBtn,
  };
};
