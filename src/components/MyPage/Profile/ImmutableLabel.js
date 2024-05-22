import { Text, View } from 'react-native';

export const ImmutableLabel = ({ label, detail, containerStyle, labelStyle, detailStyle }) => {
  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={detailStyle}>{detail}</Text>
    </View>
  );
};
