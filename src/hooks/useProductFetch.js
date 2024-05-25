import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { findProduct, toggleLikedIcon } from '../features/products/product_thunk';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import {
  addProductInMyBasket,
  alreadyReviewed,
  checkIsUsers,
  getAllReviews,
  howManyLikes,
  isLikedProduct,
  record_viewed,
} from '../services/supabase_functions';
import { supabase } from '../supabase';

export const useProductFetch = () => {
  const { selectedProductId, currentProduct, currentStars } = useSelector((state) => state.products);
  const { user, token, profile } = useSelector((state) => state.userAuth);
  const [isUsers, setIsUsers] = useState(false);
  const [userReviewed, setUserReviewed] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeMenu, setActiveMenu] = useState(0);
  const borderWidths = [...Array(3)].map(() => useSharedValue(0));
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');

  const handleHorizontalScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentPageIndex = Math.round(contentOffsetX / width);
    setCurrentPage(currentPageIndex);
  };
  const checkingIsUsers = useCallback(async () => {
    if (user !== null) {
      const isitUsers = await checkIsUsers({ user_id: user.id, product_id: selectedProductId });
      setIsUsers(isitUsers);
    }
  }, [selectedProductId]);

  const checkingIsUserReviewed = useCallback(async () => {
    if (user !== null) {
      const result = await alreadyReviewed({ user_id: user.id, product_id: selectedProductId });
      setUserReviewed(result);
    }
  }, [selectedProductId]);

  const isLikedOrNot = useCallback(async () => {
    if (user !== null) {
      const resp = await isLikedProduct({ user_id: user.id, product_id: selectedProductId });
      setIsLiked(resp);
    }
  }, [selectedProductId]);

  const countLikes = useCallback(async () => {
    const likes = await howManyLikes({ product_id: selectedProductId });
    setLikedCount(likes);
  }, [isLiked, selectedProductId]);

  const fetchEveryReview = useCallback(async () => {
    const fetchReivews = await getAllReviews({ product_id: selectedProductId });
    setReviews(fetchReivews);
  }, [selectedProductId]);

  const handlePostReview = useCallback(
    async (data) => {
      if (user !== null) {
        // 리뷰 업데이트 및 등록
        const { data: upsertReview, error } = await supabase
          .from('Review')
          .upsert([{ content: data.stars, review: data.review }])
          .select();
        if (error) {
          console.log('리뷰 업데이트 중 발생한 에러 Error: ', error);
          return;
        }
        const fetchReviews = await getAllReviews({ product_id: selectedProductId });
        setReviews(fetchReviews);
      }
    },
    [selectedProductId]
  );

  const handleAddToBasket = useCallback(async () => {
    if (token && selectedProductId) {
      addProductInMyBasket({ user_id: user.id, product_id: selectedProductId });
    } else {
      alert('로그인이 필요합니다');
      navigation.navigate('Login');
      return;
    }
  }, [token, selectedProductId]);

  const fetchProductDetail = useCallback(async () => {
    try {
      dispatch(findProduct({ product_id: selectedProductId }));
      await fetchEveryReview();
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
          case 500:
            navigation.navigate('Home');
        }
      }
    }
  }, [dispatch, selectedProductId, fetchEveryReview, navigation]);

  const fetchDetail = useCallback(() => {
    if (selectedProductId) {
      fetchProductDetail();
      if (token) {
        checkingIsUsers();
        checkingIsUserReviewed();
        isLikedOrNot();
        countLikes();
      }
    }
  }, [selectedProductId, navigation, dispatch]);

  useEffect(() => {
    fetchDetail();
    borderWidths[activeMenu].value = withTiming(3, { duration: 500 });

    navigation.setOptions({ headerShown: false });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedProductId) {
        if (token) {
          record_viewed({ user_id: user.id, product_id: selectedProductId });
        } else {
          record_viewed({ product_id: selectedProductId });
        }
      }
    }, [token, navigation, selectedProductId])
  );

  const handlePress = (index) => {
    setActiveMenu(index);
    borderWidths[index].value = withTiming(3, { duration: 500 });
  };

  const handleHeart = () => {
    setIsLiked(!isLiked);
    dispatch(toggleLikedIcon({ liked: !isLiked, user_id: user.id, product_id: selectedProductId }));
  };

  return {
    currentProduct,
    currentStars,
    currentPage,
    isLiked,
    isUsers,
    likedCount,
    borderWidths,
    activeMenu,
    navigation,
    user,
    profile,
    token,
    reviews,
    userReviewed,
    setUserReviewed,
    setReviews,
    selectedProductId,
    handlePostReview,
    handleAddToBasket,
    handleHeart,
    handleHorizontalScroll,
    handlePress,
  };
};
