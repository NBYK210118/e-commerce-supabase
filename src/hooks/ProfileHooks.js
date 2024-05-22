import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabase';
import { updateProfile } from '../features/auth/auth_thunk';

export const useProfileHooks = () => {
  const { user, token, profile } = useSelector((state) => state.userAuth);
  const [selectedImg, setSelectedImg] = useState('');
  const [company, setCompany] = useState('');
  const [nickname, setNickName] = useState('');
  const [registeredAddress, setRegisteredAddress] = useState([]);
  const [address, setAddress] = useState([]);
  const [phone, setPhone] = useState('');
  const [currentWilling, setCurrentWilling] = useState(false);
  const [personalOrCompany, setPersonalOrCompany] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        alert('로그인이 필요합니다');
        navigation.navigate('Login');
      }
    }, [token, navigation])
  );

  useEffect(() => {
    if (token && user) {
      const fetchProfileImg = async () => {
        const filePath = profile?.profileImg.split('"')[3];
        const { data, error } = await supabase.storage.from('UserProfile').download(filePath);
        if (error) {
          console.log('error: ', error);
          return;
        }
        if (data) {
          const image = URL.createObjectURL(data);
          setSelectedImg(image);
        }
      };
      fetchProfileImg();
      setNickName(profile?.nickname);
      setCurrentWilling(profile?.seller);
      if (profile?.address?.length > 0) {
        setRegisteredAddress(() => [...profile.address]);
      }

      if (user?.store) {
        setPersonalOrCompany(false);
        setCompany(user?.store?.name);
      }
      if (profile?.phone) {
        setPhone(profile?.phone);
      }
      if (profile?.setByUser) {
        console.log('profile.setByUser: ', profile.setByUser);
        setSelectedAddress(profile?.setByUser);
      }
    }
  }, []);

  const handleProfileChange = () => {
    if (token) {
      const data = {
        imgUrl: selectedImg,
        store: company,
        nickname,
        address: registeredAddress,
        phone,
        seller: currentWilling,
        isPersonal: personalOrCompany,
        currentAddr: selectedAddress,
      };
      dispatch(updateProfile({ user, data, navigation }));
    }
  };

  const addToList = (index) => {
    setRegisteredAddress((prevState) => {
      if (prevState.length < 6) {
        const newAddresses = address.filter((val, idx) => !prevState.includes(val) && val != '' && idx === index);
        return [...prevState].concat(newAddresses);
      } else {
        console.log('등록된 주소가 5개입니다');
      }
    });
    setAddress([]);
  };

  const removeInList = (index) => {
    setAddress((prevState) => prevState.filter((val, idx) => idx !== index));
  };

  const handleSelectAddress = useCallback(
    (val) => {
      if (val !== selectedAddress) {
        setSelectedAddress(val);
      }
    },
    [selectedAddress]
  );

  const createAddressBlank = useCallback(() => {
    setAddress([...address, '']);
  }, [address]);

  const removeRegisteredAddress = (index) => {
    setRegisteredAddress((prevState) => prevState.filter((val, idx) => idx != selectedAddress));
  };

  const updateInput = (text, index) => {
    const newInputs = address.slice();
    newInputs[index] = text;
    setAddress(newInputs);
  };
  return {
    user,
    selectedAddress,
    selectedImg,
    personalOrCompany,
    setAddress,
    setCompany,
    setCurrentWilling,
    setNickName,
    setPersonalOrCompany,
    setPhone,
    setSelectedImg,
    handleProfileChange,
    handleSelectAddress,
    addToList,
    createAddressBlank,
    removeInList,
    removeRegisteredAddress,
    updateInput,
    nickname,
    phone,
    registeredAddress,
    address,
    currentWilling,
  };
};
