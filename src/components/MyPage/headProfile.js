import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { gray1 } from '../../styles/common/colors';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigation } from '@react-navigation/native';

export const HeadProfile = ({ onPress }) => {
  const { user, profile } = useSelector((state) => state.userAuth);
  const [profileImg, setProfileImg] = useState(null);
  const navigation = useNavigation();

  const fetchProfileImg = async () => {
    const filePath = profile?.profileImg.split('"')[3];
    const { data, error } = await supabase.storage.from('UserProfile').download(filePath);
    if (error) {
      console.log('error: ', error);
      return;
    }
    if (data) {
      const image = URL.createObjectURL(data);
      console.log('image: ', image);
      setProfileImg(image);
    }
  };

  useEffect(() => {
    fetchProfileImg();
  }, []);

  return (
    <View style={hp_style.container}>
      <TouchableOpacity onPress={onPress}>
        <Image style={hp_style.img} source={{ uri: profileImg ? profileImg : 'https://via.placeholder.com/50' }} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'column' }}>
        <View style={hp_style.user_info}>
          <Text style={hp_style.user_id}>유저 ID</Text>
          <Text style={hp_style.user_nick}>@{user ? user?.email : 'UserId'}</Text>
        </View>
        <View style={hp_style.user_info}>
          <Text style={hp_style.user_id}>닉네임</Text>
          <Text style={hp_style.user_nick}>{profile ? profile?.nickname : 'UserName'}</Text>
        </View>
      </View>
    </View>
  );
};

const hp_style = StyleSheet.create({
  container: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: { borderWidth: 1, borderColor: gray1, borderRadius: 100, width: 100, height: 100 },
  user_info: {
    marginLeft: 10,
    marginTop: 10,
  },
  user_id: {
    color: 'gray',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  user_nick: {
    fontSize: 13,
  },
});
