import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';
import { AntDesign } from '@expo/vector-icons';
import { primary_gray } from '../../../styles/common/colors';
import IconButton from '../buttons/IconButton';
import AddressItem from './AddressItem';
import { useProfileHooks } from '../../../hooks/ProfileHooks';
import { ImmutableLabel } from './ImmutableLabel';
import MutableLabel from './MutableLabel';

export const MyProfile = ({ onChange }) => {
  const {
    addToList,
    createAddressBlank,
    handleSelectAddress,
    handleProfileChange,
    removeInList,
    removeRegisteredAddress,
    selectedAddress,
    selectedImg,
    setAddress,
    setCompany,
    setCurrentWilling,
    setNickName,
    setPersonalOrCompany,
    setPhone,
    setSelectedImg,
    updateInput,
    user,
    nickname,
    phone,
    personalOrCompany,
    registeredAddress,
    address,
    currentWilling,
  } = useProfileHooks();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={60}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container_scroll}>
        <View style={{ marginVertical: 10 }}>
          <TouchableOpacity style={styles.profile} onPress={() => onChange({ setSelectedImg })}>
            <Image
              style={styles.profile_img}
              source={{ uri: selectedImg ? selectedImg : 'https://via.placeholder.com/120' }}
            />
          </TouchableOpacity>
        </View>
        <>
          <ImmutableLabel
            label={'성'}
            detail={user ? user.user_metadata.firstname : '유저 정보를 불러오지 못함'}
            containerStyle={styles.item_mb}
            labelStyle={styles.label}
            detailStyle={styles.detail}
          />
          <ImmutableLabel
            label={'이름'}
            detail={user ? user.user_metadata.lastname : '유저 정보를 불러오지 못함'}
            containerStyle={styles.item_mb}
            labelStyle={styles.label}
            detailStyle={styles.detail}
          />
          <ImmutableLabel
            label={'Email'}
            detail={user ? user.user_metadata.email : '유저 정보를 불러오지 못함'}
            containerStyle={styles.item_mb}
            labelStyle={styles.label}
            detailStyle={styles.detail}
          />
          <MutableLabel
            label={'닉네임'}
            value={nickname}
            onChangeText={setNickName}
            containerStyle={styles.item_mb}
            labelStyle={styles.label}
            inputStyle={styles.input}
          />
        </>
        <View style={styles.item_mb}>
          <View style={{ flexDirection: 'row', position: 'relative' }}>
            <Text style={styles.label}>
              주소(최대 5개 등록 가능) <Text style={{ color: 'green', fontSize: 9 }}>사용할 주소를 터치해주세요</Text>
            </Text>
            <TouchableOpacity style={{ position: 'absolute', right: 35, bottom: 2 }} onPress={removeRegisteredAddress}>
              <AntDesign name="delete" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: 2 }} onPress={createAddressBlank}>
              <AntDesign name="pluscircleo" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <View id="address_list">
            <AddressItem
              items={registeredAddress}
              selectedAddress={selectedAddress}
              onPress={handleSelectAddress}
              style={styles.address_items}
            />
            {address.length > 0 &&
              address.map((input, index) => (
                <View key={index} style={{ position: 'relative' }}>
                  <TextInput
                    key={index}
                    onChangeText={(text) => updateInput(text, index)}
                    styles={styles.input}
                    value={input}
                  />
                  <IconButton
                    name="plus"
                    size={25}
                    color="rgba(0,50,150,1)"
                    styles={styles.add_plus}
                    onPress={() => addToList(idx)}
                  />
                  <IconButton
                    name="minus"
                    size={25}
                    color="rgba(150,20,0,1)"
                    styles={styles.add_minus}
                    onPress={() => removeInList(index)}
                  />
                </View>
              ))}
          </View>
        </View>
        <MutableLabel
          label={'휴대폰 번호'}
          value={phone}
          mode={'PHONE'}
          onChangeText={setPhone}
          containerStyle={styles.item_mb}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        <View style={styles.item_mb}>
          <Text style={styles.label}>상품을 판매하실건가요?</Text>
          <RadioButtonGroup
            containerStyle={styles.company_radios}
            selected={currentWilling}
            onSelected={setCurrentWilling}
            radioBackground="rgba(10,150,240,1)"
          >
            <RadioButtonItem value={true} label="Yes" />
            <RadioButtonItem value={false} label="No" style={{ marginLeft: 10 }} />
          </RadioButtonGroup>
        </View>
        <View style={styles.item_mb}>
          <Text style={styles.company_check}>개인/기업(선택) - 개인이신가요? 비즈니스 계정이신가요?</Text>
          <RadioButtonGroup
            containerStyle={styles.company_radios}
            selected={personalOrCompany}
            onSelected={setPersonalOrCompany}
            radioBackground="rgba(10,150,240,1)"
          >
            <RadioButtonItem value={true} label="개인" />
            <RadioButtonItem value={false} label="기업" style={{ marginLeft: 10 }} />
          </RadioButtonGroup>
        </View>
        {!personalOrCompany && (
          <View style={{ marginVertical: 6, marginBottom: 15 }}>
            <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: 'bold' }}>*회사명:</Text>
            <TextInput value={company} onChangeText={setCompany} styles={styles.input} />
          </View>
        )}
        <View style={styles.apply_btn_wrapper}>
          <TouchableOpacity onPress={handleProfileChange} style={styles.apply_btn}>
            <Text style={styles.apply_btn_text}>적용하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: -80,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container_scroll: { flexDirection: 'column', marginHorizontal: 20 },
  address_items: {
    position: 'relative',
    paddingVertical: 10,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: primary_gray,
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  item_mb: { marginBottom: 12 },
  detail: {
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: primary_gray,
    borderRadius: 5,
    padding: 5,
  },
  profile: {
    width: 240,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 45,
  },
  profile_img: { width: 120, height: 120, borderWidth: 1, borderColor: primary_gray, borderRadius: 100 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: primary_gray,
    borderRadius: 5,
    padding: 5,
  },
  company_check: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  company_radios: { padding: 1, marginTop: 5, flexDirection: 'row' },
  company_input: {},
  add_plus: { position: 'absolute', top: 6, right: 34 },
  add_minus: { position: 'absolute', top: 6, right: 4 },
  apply_btn_wrapper: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  apply_btn: { width: 110, height: 60, backgroundColor: 'rgba(10,100,220,1)' },
  apply_btn_text: { color: 'white', fontWeight: 'bold', textAlign: 'center', lineHeight: 60, fontSize: 18 },
});
