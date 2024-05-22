import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLocation } from '../features/auth/auth_thunk';

export const useHomeHooks = () => {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState('');
  const borderWidths = [...Array(7)].map(() => useSharedValue(0));
  const currentLocation = useSelector((state) => state.userAuth.currentLocation);
  const userInfo_loading = useSelector((state) => state.userAuth.loading);
  const { token, user } = useSelector((val) => val.userAuth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollY = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      if (
        (user !== undefined && user !== null && token && currentLocation === '') ||
        currentLocation === undefined ||
        currentLocation === null
      ) {
        console.log('user: ', user);
        dispatch(getUserLocation(user));
      }
    }, [user, token, currentLocation])
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const menuBarStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [30, 500], [0, 5], Extrapolation.CLAMP);

    return {
      // transform: [{ translateY }],
      position: scrollY.value > 30 ? 'absolute' : 'relative',
      top: scrollY.value > 30 ? scrollY.value : 'auto',
      left: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: 'white',
    };
  });

  const handleLogin = () => {
    if (!token) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('MyPage');
    }
  };

  return {
    token,
    active,
    setActive,
    borderWidths,
    scrollHandler,
    menuBarStyle,
    handleLogin,
    userInfo_loading,
    currentLocation,
    setSelected,
  };
};
