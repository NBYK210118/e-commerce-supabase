import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PayInfo = ({ productSummary, productCount }) => {
  if (productSummary !== undefined) {
    // originTotal, totallyDiscount, finalPay
    return (
      <View style={styles.container}>
        <Text style={styles.products}>
          결제할 상품 <Text style={{ color: 'gray', fontWeight: '600' }}>총 {productCount}개</Text>
        </Text>
        <View style={styles.products_price_wrapper}>
          <Text>상품 금액</Text>
          <Text style={styles.products_price}>{productSummary?.originTotal?.toLocaleString('ko-kr')}원</Text>
        </View>
        <View style={styles.discounted_wrapper}>
          <Text>할인된 금액</Text>
          <Text style={styles.discounted_price}>-{productSummary?.totallyDiscount?.toLocaleString('ko-kr')}원</Text>
        </View>
        <View style={styles.finalPay_wrapper}>
          <Text>결제 금액</Text>
          <Text style={styles.finalPay_price}>{productSummary?.finalPay?.toLocaleString('ko-kr')}원</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { padding: 10, paddingBottom: 60, backgroundColor: 'white' },
  products: { fontSize: 17, fontWeight: 'bold' },
  products_price_wrapper: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  products_price: { fontWeight: 'bold' },
  discounted_wrapper: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginVertical: 10 },
  discounted_price: { fontWeight: 'bold' },
  finalPay_wrapper: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginVertical: 10 },
  finalPay_price: { fontWeight: 'bold', fontSize: 24 },
});

export default React.memo(PayInfo);
