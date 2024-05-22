import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { setAccessToGallery } from '../features/auth/auth_slice';
import { logout } from '../features/auth/auth_thunk';

export const useMainState = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const { user, token } = useSelector((state) => state.userAuth);

  const handleLogOut = async () => {
    try {
      dispatch(logout());
      Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다!');
    } catch (error) {
      Alert.alert('로그아웃', '죄송합니다. 다시 시도해주세요');
    }
  };

  if (token && status === null) {
    requestPermission();
    dispatch(setAccessToGallery(status));
  }

  return {
    dispatch,
    navigation,
    token,
    handleLogOut,
  };
};
