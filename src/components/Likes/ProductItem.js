import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../../supabase';

export const LikesItem = ({ product, toggleLike, likesStatus }) => {
  if (product !== undefined) {
    const path = JSON.parse(product.imgFile).path;
    const { data } = supabase.storage.from('Products').getPublicUrl(path);

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: data.publicUrl }} style={styles.image} />
        <View style={{ flexDirection: 'column', padding: 5 }}>
          <Text numberOfLines={1} style={styles.itemName}>
            {product?.name}
          </Text>
          <Text>{product?.manufacturer}</Text>
          <Text numberOfLines={1} ellipsizeMode="head" style={{ overflow: 'hidden' }}>
            {product?.description}
          </Text>
          {product.isdiscounting && (
            <Text style={{ textDecorationLine: 'line-through', color: 'gray' }}>
              {product?.price?.toLocaleString('ko-kr')}원
            </Text>
          )}
          <Text style={[product.isDiscounting && { color: 'blue', fontWeight: 'bold' }]}>
            {product.isdiscounting
              ? product?.discountprice?.toLocaleString('ko-kr')
              : product?.price?.toLocaleString('ko-kr')}
            원
          </Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ marginBottom: 5, color: '#c8c8c8' }}>{product?.likedBy?.length}</Text>
          <TouchableOpacity onPress={() => toggleLike(product.id)}>
            <Icon name={likesStatus[product?.id] ? 'heart' : 'heart-o'} size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',

    padding: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 50,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
