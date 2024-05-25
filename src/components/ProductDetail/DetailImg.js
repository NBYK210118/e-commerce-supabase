import { Image, StyleSheet } from 'react-native';
import { supabase } from '../../supabase';

export const DetailImg = ({ file, idx }) => {
  if (file !== undefined) {
    const path = JSON.parse(file).path;
    const { data } = supabase.storage.from('Products').getPublicUrl(path);

    return (
      <Image
        key={idx}
        source={{
          uri: data.publicUrl,
        }}
        style={styles.detail_imgs}
        resizeMode="contain"
      />
    );
  }
};

const styles = StyleSheet.create({
  detail_imgs: { width: 350, height: 340 },
});
