import React, { useCallback, useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { Text, TextInput, Image, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ImageBackground, TouchableOpacity } from 'react-native';
import * as regex from '../constants/regex';
import axios from 'axios';
import FlashMessage, {showMessage, hideMessage} from "react-native-flash-message";

import backgroundImage from '../assets/images/bg.jpg';
import logoImage from '../assets/images/logoescura.png';

interface IRegistration {
  name: string;
  email: string;
  password: string;
 
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;  
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    //console.log('handleSignUp', registration);
    if (!Object.values(isValid).includes(false)) {
      console.log('handleSignUp', registration);
      registrar();
    }
  }, [isValid, registration]);

  useEffect(() => {
    //console.log("Senha:" + registration.password);
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
    }));
  }, [registration, setIsValid]);

  const registrar = async () => { 

    showMessage({
      message: "Enviando dados",
      description: "Conectando no servidor...",
      type: "info",
    });
  
  const formData = new FormData();

  formData.append('name', registration.name);
  formData.append('email', registration.email);
  formData.append('password', registration.password);

  const res = await axios.post('https://www.riobambaciclorutas.com/api/useradd.json',formData,{
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  var dados = JSON.stringify(res.data);
  var dt = JSON.parse(dados);
  console.log('retorno : ' + dt.return);

  if (dt.return == 0) {
    showMessage({
      message: "Erro",
      description: "Usuário não cadastrado",
      type: "danger",
    });
  }
  if (dt.return == 1) {
    showMessage({
      message: "Registro realizado com sucesso!",
      description: "Confirme os dados no seu e-mail",
      type: "success",
    });
    router.replace('/');
  }
  
  }

  return (
    
    <ImageBackground source={backgroundImage} style={{flex: 1}}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View className="flex-1 items-center justify-center">
     <View className="h-[70vh] w-[40vh] p-[15] m-[10] rounded-[20px]  bg-white shadow">
    <Image source={logoImage} className="mb-6 w-[200px] h-[100px] self-center" />
        <Text className="text-2xl text-left font-[Raleway] mb-6">Registro</Text>

        <TextInput
          className="border-2 border-gray-200 p-4 rounded-lg mb-4" 
          placeholder="Nome completo"
          placeholderTextColor="#888"
          success={Boolean(registration.name && isValid.name)}
          danger={Boolean(registration.name && !isValid.name)}
          onChangeText={(value) => handleChange({name: value})}
        />

        <TextInput
          className="border-2 border-gray-200 p-4 rounded-lg mb-4"
          placeholder="Email"
          placeholderTextColor="#888"
          onChangeText={(value) => handleChange({email: value})}
          success={Boolean(registration.email && isValid.email)}
          danger={Boolean(registration.email && !isValid.email)}
          keyboardType="email-address"
        />

        

      

<TextInput
          className="border-2 border-gray-200 p-4 rounded-lg mb-4" 
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={(value) => handleChange({password: value})}
          success={Boolean(registration.password && isValid.password)}
          danger={Boolean(registration.password && !isValid.password)}
        />

        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg mb-4" 
          onPress={handleSignUp}
        >
          <Text className="text-white text-center font-[Raleway]">Registrar</Text>
        </TouchableOpacity>

        <Link href="./" className="p-4">
          <Text className="text-blue-500 text-center font-[Raleway]">Já tem uma conta? Entre aqui</Text>
        </Link>
      </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
}
