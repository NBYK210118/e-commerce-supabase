import { createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import DataService from '../../services/user_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase';
import { Alert } from 'react-native';

export const signIn = createAsyncThunk('shopping/login', async (inputs, { rejectWithValue }) => {
  try {
    const { email, password } = inputs;
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data) {
        console.log('data: ', data.session.access_token);
        const { data: getProfile, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        if (profileError) {
          console.log('Failed to load profile!');
          return;
        }
        if (getProfile) {
          console.log('Success to load profile!');
          console.log(getProfile);
          return { user: data.user, access_token: data.session.access_token, profile: getProfile };
        }
      } else {
        Alert.alert('오류', '존재하지 않는 계정이거나 잘못된 비밀번호입니다');
        console.log('error:', error);
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

export const logout = createAsyncThunk('shopping/logout', async (_, rejectWithValue) => {
  try {
    await AsyncStorage.clear();
    return {};
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

export const getUserLocation = createAsyncThunk('shopping/getUserLocation', async (user, { rejectWithValue }) => {
  try {
    // 현재 위치정보 접근권한 설정 요청
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('asdfasdfasdfasdfjiasdhjuisajfidjiS');
    console.log(status);
    // 현재 위치 정보
    const location = await Location.getCurrentPositionAsync({});

    const reversGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (reversGeocode.length > 0) {
      const addr = reversGeocode[0];
      const { data: addressList, error: addressError } = await supabase
        .from('profile')
        .select('address')
        .eq('user_id', user.id);
      if (addressError) {
        console.log('Failed to load address');
        return;
      }
      if (addressList) {
        console.log('addressList: ', ...addressList[0].address);
        const realName = `${addr.region} ${addr.city} ${addr.name}`;
        const newAddressList = Array.from(new Set([...addressList[0].address, realName]));
        const { data, error } = await supabase
          .from('profile')
          .update({ address: newAddressList })
          .eq('user_id', user.id);
        if (error) {
          console.error('Error updating address:', error);
        }
        if (data) {
          console.log(data);
        }
      }

      return addr;
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

export const verifyToken = createAsyncThunk(
  'shopping/verifyToken',
  async ({ token, navigation }, { rejectWithValue }) => {
    try {
      const response = await DataService.verifyToken(token, navigation);
      if (response.data) {
        return response.data;
      } else {
        return 'Fail';
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

export const updateProfile = createAsyncThunk(
  'shopping/updateProfile',
  async ({ data, user, navigation }, { rejectWithValue }) => {
    try {
      const { nickname, address, phone, seller, isPersonal, currentAddr } = data;
      const {
        data: updateProfile,
        status,
        error: profileUpdateErr,
      } = await supabase
        .from('profile')
        .update({ nickname, address, seller, setByUser: currentAddr, phone })
        .eq('user_id', user.id)
        .select()
        .single();
      console.log(status);
      if (profileUpdateErr) {
        console.log('error: ', profileUpdateErr);
        return;
      }
      if (status === 200) {
        console.log('success to update the detail of Profile: ', updateProfile);
        return updateProfile;
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

export const signUp = createAsyncThunk('shopping/signUp', async ({ data, navigation }, { rejectWithValue }) => {
  try {
    const response = await DataService.signUp(data);
    switch (response.status) {
      case 200:
        alert(`회원가입을 환영합니다!`);
        navigation.navigate('Home');
        return response.data;
      case 500:
        alert('서버 에러');
      case 400:
        alert('잘못된 요청입니다');
      case 409:
        console.log('signup status: ', response.status);
      default:
        console.log('signup status: ', response.status);
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
