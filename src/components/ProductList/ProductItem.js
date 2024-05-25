import { AntDesign } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../supabase';

export const ProductItem = ({ item, addToBasket, handleButton }) => {
  if (item !== undefined) {
    const path = JSON.parse(item.imgFile).path;
    const { data } = supabase.storage.from('Products').getPublicUrl(path);
    return (
      <Pressable style={styles.container} onPress={() => handleButton(item.id)}>
        <Image source={{ uri: data.publicUrl }} style={styles.img} />
        <Text style={styles.name}>{item?.name}</Text>
        <View style={styles.price}>
          {item?.isdiscounting && <Text style={styles.ratio}>{item?.discountratio}%</Text>}
          <Text style={styles.origin_price}>{item?.price.toLocaleString('ko-kr')}원</Text>
        </View>
        <Pressable style={styles.btn} onPress={() => addToBasket(item.id)}>
          <AntDesign name="shoppingcart" size={18} color={'white'} style={{ textAlign: 'center' }} />
        </Pressable>
      </Pressable>
    );
  }
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', width: 100, height: 150, marginRight: 20, marginBottom: 80 },
  img: { width: 100, height: 120 },
  name: { fontWeight: 'bold', padding: 4 },
  price: { flexDirection: 'row' },
  ratio: { color: 'red', padding: 4 },
  origin_price: { fontWeight: '500', padding: 4 },
  btn: { backgroundColor: '#3CB371', padding: 4 },
});
