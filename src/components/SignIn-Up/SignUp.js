import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Stepper } from '../MyPage/manage/Stepper';
import { useSignUpState } from '../../hooks/useSignUpState';
import { FirstStep } from './first_step';
import { MidStep } from './mid_step';
import { FinalStep } from './final_step';

export const SignUp = () => {
  const {
    email,
    firstName,
    lastName,
    password,
    nickname,
    gender,
    setGender,
    setNickname,
    setEmail,
    setFirstName,
    setLastName,
    setPassword,
    loading,
    error,
    active,
    navigation,
    handleBeforeBtn,
    handleNextBtn,
    handleSubmit,
  } = useSignUpState();

  const content = [
    <FirstStep
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      nickname={nickname}
      setNickname={setNickname}
      gender={gender}
      setGender={setGender}
    />,
    <MidStep email={email} setEmail={setEmail} />,
    <FinalStep password={password} setPassword={setPassword} />,
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            padding: 40,
            alignItems: 'center',
          }}
        >
          <ScrollView>
            <Stepper
              content={content}
              active={active}
              buttonContainer={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              buttonTextStyle={styles.buttonTextStyle}
              onNext={handleNextBtn}
              onBack={handleBeforeBtn}
              onFinish={handleSubmit}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.before_btn}>
        <Text style={styles.before_btn_text}>홈으로</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  before_btn: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 18,
    width: '100%',
    backgroundColor: 'black',
  },
  before_btn_text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  labelInput_txt: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: 250,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginBottom: 10,
  },
  buttonStyle: { backgroundColor: '#38aeea', width: 100, paddingVertical: 10, borderRadius: 5 },
  buttonTextStyle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
