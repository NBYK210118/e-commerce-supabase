import { Pagination } from '../../pagination';
import { CategoryLoading } from './Category_loading';
import { useCategoryHooks } from '../../../hooks/useCategoryHooks';
import Animated from 'react-native-reanimated';
import { Items } from './category';

export const Categories = () => {
  const { animatedStyle, handlePress, handleScroll, loading, pages, category_datas, currentPage } = useCategoryHooks();
  return (
    <Animated.View>
      <Animated.ScrollView
        horizontal
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      >
        {loading ? (
          <CategoryLoading animatedStyle={animatedStyle} />
        ) : (
          <Items pages={pages} handlePress={handlePress} />
        )}
        {category_datas === undefined ||
          category_datas === null ||
          (category_datas.length === 0 && <CategoryLoading animatedStyle={animatedStyle} />)}
      </Animated.ScrollView>
      <Pagination contents={pages} current={currentPage} />
    </Animated.View>
  );
};
