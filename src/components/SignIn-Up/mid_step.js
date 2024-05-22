import { StyleSheet, View } from 'react-native';
import LabelInput from './label-input';

export const MidStep = ({ email, setEmail }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <LabelInput
        label={'이메일'}
        value={email}
        onChangeText={setEmail}
        textStyle={styles.labelInput_txt}
        itemStyle={{ marginBottom: 20 }}
        labelStyle={{ fontSize: 16, fontWeight: '500', marginBottom: 5 }}
        placeholder={'example@gmail.com'}
      />
      <LabelInput
        label={'휴대폰 번호'}
        value={phone}
        onChangeText={setPhone}
        textStyle={styles.labelInput_txt}
        itemStyle={{ marginBottom: 20 }}
        labelStyle={{ fontSize: 16, fontWeight: '500', marginBottom: 5 }}
        placeholder={'xxx-xxxx-xxxx'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelInput_txt: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: 250,
  },
});
