import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ProductApi from '../services/product_api';
import { useCallback, useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { getLikes, updateProductLike } from '../features/products/product_thunk';

export const useLikeStates = () => {
  const [visibleOption, setVisibleOption] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [likesStatus, setLikesStatus] = useState({});
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token, profile } = useSelector((state) => state.userAuth);
  const { likes, categories, loading } = useSelector((state) => state.products);
  const borderWidths = [...Array(categories.length)].map(() => useSharedValue(0));

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        navigation.navigate('Login');
      }
    }, [token, navigation])
  );

  useFocusEffect(
    useCallback(() => {
      if (token && !visibleOption) {
        dispatch(getLikes({ user_id: profile.user_id }));
      } else {
      }
    }, [navigation, visibleOption])
  );

  useEffect(() => {
    if (likes.length > 0) {
      setLikesStatus(
        likes.reduce((acc, val) => {
          acc[val.product_id] = true;
          return acc;
        }, {})
      );
    }
  }, [likes]);

  useEffect(() => {
    if (token && selectedMenu !== undefined && selectedMenu !== '') {
      ProductApi.getUserLikesByCategory(token, selectedMenu).then((response) => {
        setDataSet(response.data);
      });
      setVisibleOption(true);
    }
  }, [selectedMenu]);

  const toggleLike = (product_id) => {
    const condition = Object.keys(likesStatus).length > 0;
    const data = {
      ...likesStatus,
      [product_id]: !likesStatus[product_id],
    };

    setLikesStatus(data);

    if (token && condition) {
      dispatch(updateProductLike({ user_id: profile.user_id, data }));
    }
  };

  const handleShowAll = () => {
    setVisibleOption(false);
    setSelectedMenu('');
    setActiveMenu(null);
  };

  return {
    activeMenu,
    setActiveMenu,
    setSelectedMenu,
    categories,
    borderWidths,
    likes,
    likesStatus,
    toggleLike,
    visibleOption,
    setVisibleOption,
    handleShowAll,
  };
};
