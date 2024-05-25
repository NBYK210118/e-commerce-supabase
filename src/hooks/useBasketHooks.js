import { useCallback, useEffect, useState } from 'react';
import ProductApi from '../services/product_api';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { calculateBasketSummary, getShoppingBasket } from '../services/supabase_functions';
import { supabase } from '../supabase';

export const useBasketHooks = () => {
  const [products, setProducts] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(0);
  const [productSummary, setProductSummary] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [basketInfo, setBasketInfo] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [inventoryStatus, setInventoryStatus] = useState({});
  const [entireCheck, setEntireCheck] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { token, user } = useSelector((state) => state.userAuth);
  const navigation = useNavigation();
  const opacity = useSharedValue(0.5);
  const scrollY = useSharedValue(0);
  const [loading, setLoading] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    fetchInfo();
  }, [navigation]);

  useEffect(() => {
    if (!loading) {
      opacity.value = withTiming(0, { duration: 1000 });
    } else {
      opacity.value = withRepeat(withTiming(0.3, { duration: 1000 }), -1, true);
    }
  }, [loading, opacity, navigation]);

  useEffect(() => {
    if (products.length > 0 && basketInfo !== null && basketInfo.length > 0) {
      setCurrentProductId(basketInfo[0].product_id);
      statusSetting(products, basketInfo);
    }
  }, [products, productSummary]);

  const reloadData = async () => {
    const { basketInfo, myBasket, productSummary } = await calculateBasketSummary({ user_id: user.id });
    setProductSummary(productSummary);
    setProducts(myBasket);
    setBasketInfo(basketInfo);
    statusSetting(products, basketInfo);
  };

  const statusSetting = (products, basketInfo) => {
    setSelectedProducts(
      products.reduce((acc, val) => {
        acc[val.id] = true;
        return acc;
      }, {})
    );
    setInventoryStatus(
      basketInfo.reduce((acc, val) => {
        acc[val.product_id] = val.quantity;
        return acc;
      }, {})
    );
  };
  const toggleClose = async (productId) => {
    const { data, error } = await supabase
      .from('shoppingbasket')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', user.id);
    if (error) {
      console.log('장바구니에서 물품 삭제 실패!', error);
      return;
    }
    await reloadData();
  };

  const removeManyProducts = async () => {
    const keys = Object.keys(selectedProducts);
    console.log(keys);
    await Promise.all(
      keys.forEach(async (key) => {
        if (selectedProducts[key]) {
          await supabase.from('shoppingbasket').delete().eq('product_id', key).eq('user_id', user.id);
        }
      })
    );
    await reloadData();
  };

  const fetchInfo = useCallback(async () => {
    if (!token || !user) {
      alert('로그인이 필요합니다');
      navigation.navigate('Login');
    } else {
      setLoading(true);
      const { myBasket, basketInfo } = await getShoppingBasket({ user_id: user.id });
      const { productSummary } = await calculateBasketSummary({ user_id: user.id });
      setProducts(myBasket);
      setBasketInfo(basketInfo);
      setProductSummary(productSummary);
      setLoading(false);
    }
  }, [token, navigation]);

  const toggleCheckBox = (productId) => {
    const data = {
      ...selectedProducts,
      [productId]: !selectedProducts[productId],
    };
    setSelectedProducts(() => {
      const condition = Object.values(data).every((val) => val === true);
      if (condition) setEntireCheck(true);
      else setEntireCheck(false);
      return data;
    });
  };

  const checkEntire = () => {
    const keys = Object.keys(selectedProducts);
    setSelectedProducts((prevState) => {
      const newState = { ...prevState };
      for (const key of keys) {
        newState[key] = !entireCheck;
      }
      return newState;
    });
    setEntireCheck(!entireCheck);
  };

  const handleModal = (productId) => {
    setQuantity(inventoryStatus[productId]);
    setCurrentProductId(productId);
    setModalOpen(!modalOpen);
  };

  const handleInventories = (sign) => {
    if (sign === '+') {
      setQuantity(Number(quantity) + 1);
      setInventoryStatus({ ...inventoryStatus, [currentProductId]: inventoryStatus[currentProductId] + 1 });
    } else if (quantity > 0 && sign === '-') {
      setQuantity(Number(quantity) - 1);
      setInventoryStatus({ ...inventoryStatus, [currentProductId]: inventoryStatus[currentProductId] + -1 });
    }
  };

  const submitInventoryChanges = async () => {
    const count = Number(inventoryStatus[currentProductId]);
    const { data, error } = await supabase
      .from('shoppingbasket')
      .update({ quantity: count })
      .eq('user_id', user.id)
      .eq('product_id', currentProductId)
      .select();
    if (error) {
      console.log('수량 변경 에러 발생: ', error);
    }
    if (data) {
      const { basketInfo, myBasket, productSummary } = await calculateBasketSummary({ user_id: user.id });
      setProductSummary(productSummary);
      setProducts(myBasket);
      setBasketInfo(basketInfo);
      statusSetting(products, basketInfo);
    }
    setModalOpen(false);
  };

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(scrollY.value > 10 ? -105 : 0, { duration: 800 }) }],
    };
  }, [scrollY]);

  return {
    loading,
    modalOpen,
    setModalOpen,
    quantity,
    setQuantity,
    products,
    entireCheck,
    selectedProducts,
    productSummary,
    modalStyle,
    user,
    inventoryStatus,
    handleScroll,
    submitInventoryChanges,
    handleInventories,
    handleModal,
    removeManyProducts,
    toggleCheckBox,
    toggleClose,
    checkEntire,
    reloadData,
    currentProductId,
    animatedStyle,
  };
};
