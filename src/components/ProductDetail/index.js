import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ImageViewer } from './ImageViewer';
import Animated from 'react-native-reanimated';
import { FloatingBtns } from './FloatingBtns';
import { ProductInfo } from './ProductInfo';
import { useProductFetch } from '../../hooks/useProductFetch';
import { TouchMenu } from './touch_menu';
import { CreateReview } from './CreateReview';
import { Review } from './Reviews';
import { UsersReviews } from './UsersReviews';
import { EmptyReviewList } from './EmptyReviewList';
import { HeartBasket } from './heart_basket';
import { DetailImg } from './DetailImg';

export const ProductDetail = () => {
  const {
    currentStars,
    currentProduct,
    handleHeart,
    handleHorizontalScroll,
    isLiked,
    isUsers,
    user,
    profile,
    likedCount,
    borderWidths,
    handlePress,
    activeMenu,
    navigation,
    reviews,
    userReviewed,
    selectedProductId,
    handleAddToBasket,
    handlePostReview,
  } = useProductFetch();

  console.log('isUsers', isUsers);
  console.log('userReviewed', userReviewed);
  if (currentProduct !== undefined && currentProduct !== null) {
    return (
      <>
        <Animated.ScrollView style={styles.wrapper} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <ImageViewer item={currentProduct} style={styles.image} onScroll={handleHorizontalScroll} />
          <ProductInfo currentProduct={currentProduct} currentStars={currentStars} reviews={reviews} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.detailImgsView}>
            {currentProduct.description_file &&
              currentProduct.description_file.length > 0 &&
              currentProduct.description_file.map((file, idx) => <DetailImg key={idx} idx={idx} file={file} />)}
          </ScrollView>
          <HeartBasket
            currentProduct={currentProduct}
            isLiked={isLiked}
            onPress={handleHeart}
            onPressBasket={handleAddToBasket}
          />
          <TouchMenu
            currentProduct={currentProduct}
            borderWidths={borderWidths}
            reviews={reviews}
            onPress={handlePress}
            activeMenu={activeMenu}
          />
          <View style={{ marginLeft: 15, marginTop: 20, marginBottom: 130 }}>
            {activeMenu === 0 && (
              <View>
                <Text>상세정보 탭</Text>
              </View>
            )}
            {activeMenu === 1 && (
              <View>
                {/* 게스트 또는 로그인한 사용자가 판매 등록한 상품이 아니고, 이전에 리뷰를 등록한 적이 없는 경우 렌더링*/}
                {!isUsers && !userReviewed ? (
                  <CreateReview
                    profile={profile}
                    handlePostReview={handlePostReview}
                    navigation={navigation}
                    selectedProductId={selectedProductId}
                  />
                ) : isUsers ? (
                  <Review review={userReviewed} profile={profile} />
                ) : null}
                {reviews.length > 0 ? (
                  <UsersReviews reviews={reviews} profile={profile} reviewList={true} />
                ) : (
                  <EmptyReviewList />
                )}
              </View>
            )}
            {activeMenu === 2 && (
              <View>
                <Text>제품 문의</Text>
              </View>
            )}
          </View>
        </Animated.ScrollView>
        <FloatingBtns currentProduct={currentProduct} isLiked={isLiked} likedCount={likedCount} onPress={handleHeart} />
      </>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative', paddingRight: 10, paddingVertical: 15 },
  image: { width: Dimensions.get('window').width, height: 300 },
  detailImgsView: { marginBottom: 20 },
});
