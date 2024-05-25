import { Image, ScrollView } from 'react-native';
import { supabase } from '../../supabase';

export const ImageViewer = ({ item, style, resizeMode, onScroll }) => {
  if (item) {
    const path = JSON.parse(item.imgFile).path;
    const { data } = supabase.storage.from('Products').getPublicUrl(path);
    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginLeft: 5 }}
        scrollEventThrottle={16}
        onScroll={onScroll}
        pagingEnabled
      >
        <Image key={item.id} source={{ uri: data.publicUrl }} style={style} resizeMode={resizeMode} />
      </ScrollView>
    );
  }
};
