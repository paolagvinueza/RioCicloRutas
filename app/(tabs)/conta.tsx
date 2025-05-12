import { Button, Text, TextInput, Image, View, Keyboard, TouchableWithoutFeedback, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';


import userimg from '../../assets/images/user.png';


export default function conta() {
  const [userid, setuserid] = useState(null);
  const [name, setname] = useState(null);
  const [email, setemail] = useState(null);

  AsyncStorage.getItem('userid').then((value) => setuserid(value));
  AsyncStorage.getItem('name').then((value) => setname(value));
  AsyncStorage.getItem('email').then((value) => setemail(value));

  return (
    <View className="flex-1 items-center p-10">
       <Image source={userimg} className="-mb-[60] w-[250px] h-[250px] self-center rounded-full" />
      <View className="h-[30vh] w-[40vh] p-[15]  -mb-[20] rounded-[20px]  bg-white  shadow">
        <Text className="text-xl text-center font-bold font-[Raleway] mb-6">{name}</Text>
        <Text className='text-sm text-center  font-[Raleway] mb-6'>{email}</Text>
        
      </View>
      <TouchableOpacity onPress={() => { router.replace('/') }}>
          <View className="bg-red-500 p-4 rounded-[5px] mb-4">
            <Text className="text-white text-center font-bold font-[Raleway]">Sair</Text>
          </View>
        </TouchableOpacity>
    </View>
  )
}