import { AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { primary_gray } from '../../styles/common/colors';
import { supabase } from '../../supabase';
import React from 'react';

export const BasketProduct = ({
  item,
  idx,
  onCheck,
  status,
  onClose,
  handleModal,
  inventory_status,
  currentProductId,
}) => {
  if (item !== undefined) {
    const count = inventory_status[currentProductId];
    const origin_price = (item.price * count).toLocaleString('ko-kr');
    const discountedPrice = (item.discountprice * count).toLocaleString('ko-kr');
    const path = JSON.parse(item.imgFile).path;
    const { data } = supabase.storage.from('Products').getPublicUrl(path);
    return (
      <View key={idx} style={styles.wrapper}>
        <Checkbox value={status[item.id]} onValueChange={() => onCheck(item.id)} style={styles.checkbox} />
        <Image source={{ uri: data.publicUrl }} style={styles.product_img} />
        <View style={styles.info}>
          <Text style={{ fontSize: 12, marginVertical: 2 }}>{item.manufacturer}</Text>
          <Text style={{ fontWeight: 'bold', marginVertical: 2 }} numberOfLines={1} ellipsizeMode="head">
            {item.name}
          </Text>
          <Text style={{ marginVertical: 2 }}>수량 {count}개</Text>
          <TouchableOpacity style={styles.touchInventory} onPress={() => handleModal(item.id)}>
            <Text style={styles.touchInventory_txt}>수량</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.side_wrapper}>
          <TouchableOpacity style={styles.close} onPress={() => onClose(item.id)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={[item.isdiscounting && styles.ifdiscount, styles.price]}>{origin_price}원</Text>
          {item.isdiscounting && <Text style={styles.discount}>{discountedPrice}원</Text>}
        </View>
      </View>
    );
  } else return null;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: { padding: 4 },
  product_img: { width: 85, height: 85, borderRadius: 50 },
  info: { flexDirection: 'column', marginLeft: -10, marginRight: 15 },
  touchInventory: { borderWidth: 1, borderRadius: 5, borderColor: primary_gray, padding: 5 },
  touchInventory_txt: { textAlign: 'center', marginVertical: 2 },
  side_wrapper: { flexDirection: 'column', justifyContent: 'space-around', marginTop: -15 },
  close: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  ifdiscount: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'normal',
  },
  price: { fontWeight: 'bold' },
  discount: { fontWeight: 'bold' },
});
