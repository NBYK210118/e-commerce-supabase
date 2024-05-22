import { StyleSheet, Text, View } from 'react-native';
import LabelInput from './label-input';
import { useState } from 'react';
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';
import { primary_gray } from '../../styles/common/colors';

export const FirstStep = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nickname,
  setNickname,
  gender,
  setGender,
}) => {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.radio_label}>성별을 선택해주세요.</Text>
        <RadioButtonGroup
          containerStyle={styles.radio_row}
          selected={gender}
          onSelected={setGender}
          radioBackground="rgba(10,150,240,1)"
        >
          <RadioButtonItem value={true} label="남성" style={{ marginTop: 5 }} />
          <RadioButtonItem value={false} label="여성" style={{ marginTop: 5, marginLeft: 10 }} />
        </RadioButtonGroup>
      </View>
      <LabelInput
        label={'* 성(First Name)'}
        value={firstName}
        onChangeText={setFirstName}
        textStyle={styles.labelInput_txt}
        itemStyle={{ marginBottom: 20 }}
        labelStyle={{ fontSize: 14, fontWeight: '500', marginBottom: 5 }}
        placeholder={'Sunt cupidatat qui do anim.'}
      />

      <LabelInput
        label={'* 이름(Last Name)'}
        value={lastName}
        onChangeText={setLastName}
        textStyle={styles.labelInput_txt}
        itemStyle={{ marginBottom: 20 }}
        labelStyle={styles.labelStyle}
        placeholder={'Sunt cupidatat qui do anim.'}
      />
      <LabelInput
        label={'* 닉네임(최대 20자)'}
        value={nickname}
        onChangeText={setNickname}
        textStyle={styles.labelInput_txt}
        itemStyle={{ marginBottom: 20 }}
        labelStyle={styles.labelStyle}
        placeholder={'Sunt cupidatat qui do anim.'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  radio_label: { textAlign: 'center', marginBottom: 5, fontWeight: 'bold' },
  radio_row: { flexDirection: 'row', justifyContent: 'space-around', padding: 4 },
  labelInput_txt: {
    borderWidth: 1,
    borderColor: primary_gray,
    borderRadius: 4,
    padding: 10,
    width: 250,
  },
  labelStyle: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
});
