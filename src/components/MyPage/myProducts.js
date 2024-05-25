import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { primary_gray } from '../../styles/common/colors';
import ProductButton from './buttons/product_button';
import ProductItem from './ProductItem';
import SearchBar from './SearchBar';
import { HorizontalCategory } from './HorizontalCategory';
import { useMyProductState } from '../../hooks/useMyProductState';

export const MyProducts = () => {
  const {
    animatedStyle,
    animatedStyle2,
    categories,
    categoryStatus,
    checkStatus,
    deleteProducts,
    handleCategoryChecked,
    handleChecked,
    handleProductStatus,
    handleUpdateBtn,
    navigation,
    sellinglist,
    scrollHandler,
    scrollY,
    searchByKeyword,
    loading,
    profile,
  } = useMyProductState();

  const LoadingSkeleton = ({ loadingStyle }) => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginLeft: 20, paddingTop: 10, paddingBottom: 30 }}>
        {[...Array(7)].map((_, idx) => (
          <Animated.View key={idx} style={[{ flexDirection: 'row', marginBottom: 10 }]}>
            <Animated.Image
              style={[{ width: 70, height: 70, marginHorizontal: 10, backgroundColor: primary_gray }, loadingStyle]}
            />
            <Animated.View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Animated.Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[loadingStyle, { width: 180, height: 25, marginBottom: 10, backgroundColor: primary_gray }]}
              />
              <Animated.Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[loadingStyle, { width: 180, height: 25, backgroundColor: primary_gray }]}
              />
            </Animated.View>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Animated.View
                style={[
                  { width: 50, height: 20, marginLeft: 5, marginBottom: 5, backgroundColor: primary_gray },
                  loadingStyle,
                ]}
              />
              <Animated.View
                style={[{ width: 50, height: 20, marginLeft: 5, backgroundColor: primary_gray }, loadingStyle]}
              />
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    );
  };

  const NoProducts = () => {
    return (
      <Animated.View
        style={[
          {
            backgroundColor: primary_gray,
            height: '79%',
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        <Animated.Text>등록하신 상품이 없습니다!</Animated.Text>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={{ position: 'relative', flexDirection: 'column', justifyContent: 'space-around', paddingBottom: 20 }}
    >
      <SearchBar onPress={searchByKeyword} />
      <HorizontalCategory categories={categories} categoryStatus={categoryStatus} onPress={handleCategoryChecked} />
      {loading ? (
        <LoadingSkeleton loadingStyle={animatedStyle} />
      ) : (
        sellinglist &&
        sellinglist.length > 0 && (
          <Animated.FlatList
            data={sellinglist}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <ProductItem
                item={item}
                index={index}
                scrollY={scrollY}
                handleProductStatus={handleProductStatus}
                handleChecked={handleChecked}
                checkStatus={checkStatus}
                handleUpdateBtn={handleUpdateBtn}
              />
            )}
            onScroll={scrollHandler}
            scrollEventThrottle={18}
            style={animatedStyle2}
          />
        )
      )}

      <ProductButton navigation={navigation} deleteProducts={deleteProducts} />
    </Animated.View>
  );
};
