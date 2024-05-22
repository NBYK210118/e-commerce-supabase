import React from 'react';
import { Text, TextInput, View } from 'react-native';

const MutableLabel = ({ value, label, containerStyle, labelStyle, inputStyle, onChangeText, mode }) => {
  const handlePhone = (input) => {
    let phoneNumber = input.replace(/[^\d]/g, '');
    if (phoneNumber.length >= 4 && phoneNumber.length <= 7) {
      input = phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3);
    } else if (phoneNumber.length >= 8) {
      input = phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3, 7) + '-' + phoneNumber.slice(7);
    }
    onChangeText(input);
  };

  if (mode === 'PHONE') {
    return (
      <View style={containerStyle}>
        <Text style={labelStyle}>{label}</Text>
        <TextInput value={value} onChangeText={(val) => handlePhone(val)} style={inputStyle} keyboardType="phone-pad" />
      </View>
    );
  } else {
    return (
      <View style={containerStyle}>
        <Text style={labelStyle}>{label}</Text>
        <TextInput value={value} onChangeText={onChangeText} style={inputStyle} />
      </View>
    );
  }
};

export default React.memo(MutableLabel);
