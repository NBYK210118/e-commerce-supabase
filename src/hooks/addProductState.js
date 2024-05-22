import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductApi from "../services/product_api";
import {
  addProduct,
  findProduct,
  updateProduct,
} from "../features/products/product_thunk";
import uuid from "react-native-uuid";
import { supabase } from "../supabase";

export const useAddProductState = ({ route }) => {
  const product_id = route.params?.product_id;
  const { token, user, profile } = useSelector((state) => state.userAuth);
  const { currentProduct } = useSelector((state) => state.products);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isDiscount, setIsDiscount] = useState(false);
  const [productPrice, setProductPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountRatio, setDiscountRatio] = useState("");
  const [detailImgs, setDetailImgs] = useState([]);
  const [detailFiles, setDetailFiles] = useState([]);
  const [count, setCount] = useState(0);
  const [detail, setDetail] = useState("");
  const [company, setCompany] = useState("");
  const [imgObjectToBucket, setImgObjectToBucket] = useState(null);
  const [imgType, setImgType] = useState(null);
  const [selectedItem, setSelectedItem] = useState("판매중");

  useEffect(() => {
    if (product_id) {
      dispatch(findProduct({ product_id }));
    }
  }, []);

  useEffect(() => {
    if (currentProduct) {
      const path = JSON.parse(currentProduct.imgFile).path;
      const { data: productImg } = supabase.storage
        .from("Products")
        .getPublicUrl(path);
      console.log(
        "current.description_file: ",
        currentProduct.description_file
      );
      const detailPaths = currentProduct.description_file.map((item) =>
        JSON.parse(item)
      );
      console.log("detailPaths: ", detailPaths);
      const detailFiles = detailPaths.map((val) => {
        const { data: imgs } = supabase.storage
          .from("Products")
          .getPublicUrl(val.path);
        return imgs.publicUrl;
      });
      setCategory(currentProduct?.category);
      setImage(productImg?.publicUrl);
      setIsDiscount(currentProduct?.isdiscounting);
      setName(currentProduct?.name);
      setCount(currentProduct?.inventory);
      setSelectedItem(currentProduct?.status);
      setDiscountPrice(currentProduct?.discountprice.toLocaleString("ko-kr"));
      setDiscountRatio(currentProduct?.discountratio.toLocaleString("ko-kr"));
      setCompany(currentProduct?.manufacturer);
      setProductPrice(currentProduct?.price?.toLocaleString("ko-kr"));
      setDetailImgs(detailFiles);
      setDetail(currentProduct?.description);
    }
  }, [dispatch, navigation, currentProduct]);

  const handleBeforeBtn = () => {
    setActiveStep((p) => p - 1);
  };

  const removeComma = (price) => {
    if (typeof price === "string") {
      if (price !== "") {
        const result = Number(price.replaceAll(",", ""));
        return result;
      } else return 0;
    }
  };

  const handleNextBtn = () => {
    if (!image || !name || !category) {
      alert(
        "모든 필드를 입력해야 합니다. 이미지, 상품명, 카테고리를 확인해주세요."
      );
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
        console.log("상품 추가 시작");
        const created_id = uuid.v4();
        dispatch(addProduct({ user, data, created_id }));
        navigation.navigate("My Page");
      } else {
        console.log("상품 정보 업데이트 시작");
        dispatch(
          updateProduct({
            updateInfo: data,
            id: product_id,
            seller_id: user.id,
          })
        );
        navigation.navigate("My Page");
      }
    } catch (error) {
      if (error.response !== undefined) {
        switch (error.response.status) {
          case 400:
            alert("잘못된 요청");
          case 401:
            alert("권한 없음");
          case 500:
            alert("서버 에러");
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
