import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabase';

export const useSignUpState = () => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, loading } = useSelector((state) => state.userAuth);
  const navigation = useNavigation();
  const [active, setActive] = useState(0);

  const handleNextBtn = () => {
    if (active === 0) {
      if (!firstName || !lastName || !nickname) {
        if (!firstName) alert('성은 필수 입력사항 입니다!');
        else if (!lastName) alert('이름은 필수 입력사항 입니다!');
        else if (!nickname) alert('닉네임은 필수 입력사항 입니다!');
        else alert('모두 필수 입력사항입니다');
      } else setActive((prevState) => prevState + 1);
    } else if (active === 1) {
      if (!email) alert('필수 입력사항 입니다');
      else setActive((prevState) => prevState + 1);
    } else {
      if (!password) alert('필수 입력사항 입니다');
      else setActive((prevState) => prevState + 1);
    }
  };

  const handleBeforeBtn = () => {
    setActive((prevState) => prevState - 1);
  };

  const handleSubmit = async () => {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstname: firstName,
          lastname: lastName,
          bio: gender ? '남성' : '여성',
          nickname,
        },
      },
    });

    if (signUpError) {
      console.log('signUpError: ', signUpError);
      return;
    } else {
      navigation.navigate('Home');
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    error,
    loading,
    active,
    navigation,
    nickname,
    gender,
    setGender,
    setNickname,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    handleBeforeBtn,
    handleSubmit,
    handleNextBtn,
  };
};
