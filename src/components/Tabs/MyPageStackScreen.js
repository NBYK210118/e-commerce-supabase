import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { MyPage } from '../MyPage';
import { MyProducts } from '../MyPage/myProducts';
import { AddProduct } from '../MyPage/manage/AddProduct';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from '../common';
import { Questions } from '../MyPage/Questions/Questions';
import { MyProfile } from '../MyPage/Profile/myProfile';
import { supabase } from '../../supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export const MyPageStackScreen = () => {
  const { user } = useSelector((val) => val.userAuth);
  const navigation = useNavigation();

  const pickImageAsync = async ({ setSelectedImg }) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // base64 데이터를 추가로 가져옴
    });

    if (result.canceled) {
      alert('선택된 사진이 없습니다');
      return;
    }

    const asset = result.assets[0];
    const fileExtension = asset.uri.split('.').pop();
    const filePath = `${user.id}.${fileExtension}`;
    const fileUri = asset.uri;
    const base64Data = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
    const sample = decode(base64Data);
    // base64 데이터 확인을 위해 콘솔에 출력
    if (!['jpeg', 'jpg', 'png'].includes(fileExtension)) {
      alert('지원되지 않는 파일 형식입니다.');
      return;
    }

    setSelectedImg(fileUri);

    const { data, error } = await supabase.storage
      .from('UserProfile')
      .upload(filePath, decode(base64Data), { contentType: asset.mimeType, upsert: true });
    if (error) {
      console.log('storage Error: ', error);
      return;
    }

    if (data) {
      if (user.id) {
        console.log('Success to upload on Bucket!', data.path);
        const { status, error: profileError } = await supabase
          .from('profile')
          .update({
            profileImg: data,
          })
          .eq('user_id', user.id);
        if (profileError) {
          console.log('error: ', profileError);
        }
        if (status === 204) {
          console.log('Success to update on Profile!');
        }
      } else {
        alert('로그인이 필요합니다');
        navigation.navigate('Login');
        return;
      }
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="My Page" component={MyPage} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }}>
        {(props) => <MyProfile {...props} onChange={pickImageAsync} />}
      </Stack.Screen>
      <Stack.Screen name="My Sellings" component={MyProducts} options={{ headerShown: false }} />
      <Stack.Screen name="Manage" component={AddProduct} />
      <Stack.Screen
        name="Questions"
        component={Questions}
        options={{
          headerSearchBarOptions: true,
          headerTransparent: false,
          headerTitle: '고객센터',
        }}
      />
    </Stack.Navigator>
  );
};
