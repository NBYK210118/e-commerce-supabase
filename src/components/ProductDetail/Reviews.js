import { AntDesign } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { primary_blue, primary_gray } from '../../styles/common/colors';
import { supabase } from '../../supabase';
import { useEffect, useState } from 'react';

export const Review = ({ review, stars, txt, profile, reviewList = false, profileImg, nickname }) => {
  const [img, setImg] = useState(null);

  const fetchProfileImg = async () => {
    const filePath = profile?.profileImg.split('"')[3];
    const { data, error } = await supabase.storage.from('UserProfile').download(filePath);
    if (error) {
      console.log('error: ', error);
      return;
    }
    if (data) {
      const image = URL.createObjectURL(data);
      setImg(image);
    }
  };

  useEffect(() => {
    fetchProfileImg();
  }, []);

  if (!reviewList) {
    const wrapperStyle = {
      ...styles.wrapper,
      backgroundColor: '#e0efff',
    };

    return (
      <View style={wrapperStyle}>
        <View>
          <Image source={{ uri: img ? img : 'https://via.placeholder.com/100' }} style={styles.image} />
        </View>
        <View style={styles.box}>
          <View style={styles.name_stars}>
            <Text style={styles.nickname}>{profile?.nickname}</Text>
            <View style={styles.stars_arrange}>
              {[...Array(review?.stars)].map((_, idx) => (
                <AntDesign key={idx} name="star" size={15} color="#f4cf0f" />
              ))}
            </View>
          </View>
          <Text numberOfLines={2} style={styles.review_txt}>
            판매자는 자신의 상품에 댓글을 남길 수 없습니다
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.wrapper}>
        <View>
          <Image source={{ uri: profileImg }} style={styles.image} />
        </View>
        <View style={styles.box}>
          <View style={styles.name_stars}>
            <Text style={styles.nickname}>{nickname ? nickname : '불러오는 중...'}</Text>
            <View style={styles.stars_arrange}>
              {[...Array(stars)].map((_, idx) => (
                <AntDesign key={idx} name="star" size={15} color="#f4cf0f" />
              ))}
            </View>
          </View>
          <Text numberOfLines={1} style={styles.review_txt}>
            {txt ? txt : '리뷰 텍스트'}
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: primary_gray,
    overflow: 'hidden',
    padding: 10,
    paddingVertical: 28,
    marginBottom: 10,
  },
  image: { width: 60, height: 60, borderRadius: 100 },
  box: { marginLeft: 14, marginTop: 5 },
  name_stars: { flexDirection: 'row' },
  nickname: { marginBottom: 5, marginRight: 5, fontWeight: 'bold' },
  stars_arrange: { flexDirection: 'row', marginHorizontal: 5 },
  review_txt: { fontSize: 13, marginTop: 10, color: primary_blue, fontWeight: 'bold' },
});
