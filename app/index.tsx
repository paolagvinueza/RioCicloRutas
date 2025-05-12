import React, { useCallback, useEffect, useState } from 'react';
import { Link, router, useFocusEffect } from 'expo-router';
import { Text, TextInput, Image, View, Keyboard, TouchableWithoutFeedback, ImageBackground, TouchableOpacity, Alert, AppRegistry } from 'react-native';
import axios from 'axios';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import db from '../services/SQLiteDatabse';
2617

import usuarios from '../services/axios/usuarios';
import coord from '../services/axios/coord';
import routes from '../services/axios/routes';

db;
//usuarios;
//routes;
//coord;

//image
import backgroundImage from '../assets/images/bg.jpg';
import logoImage from '../assets/images/logoescura.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ILogin {
  email: string;
  password: string;

}

interface ILoginValidation {
  email: boolean;
  password: boolean;

}


export default function index() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const [logado, setlogado] = useState(null);

  // usar para redirecionar para tela em trabalho
  useFocusEffect( React.useCallback(() => { 
    //router.push('/(tabs)/(gerarrota)/inicio'); 
  }, []));
  

  if (logado != null && logado > 0) {
    //navigation.navigate('Home');
    router.replace('/(tabs)/(inicio)/inicio');
  } else {
    console.log('Entre com seus dados para logar no sistema');
  }
  //AsyncStorage.getItem('email').then((value) => setemail(value));
  //AsyncStorage.getItem('password').then((value) => setpassword(value));
  const handleLogin = () => {
    // Implemente a lógica de login aqui
    console.log('Login attempt with:', email, password);
  };
  
  const logar = async () => {
    console.log('Logando com os dados:', email, password);
    showMessage({
      message: 'Autentificando',
      description: 'Enviando dados',
      type: "success",
    });

    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);

    // seta o email e senha tentata no storage
    AsyncStorage.setItem('email', email.toString());
    AsyncStorage.setItem('password', password.toString());

    const res = await axios.post(
      'https://www.riobambaciclorutas.com/api/loginapp.json',
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    );
    var dados = JSON.stringify(res.data);
    var dt = JSON.parse(dados);

    if (dt['return'] == 1) {
      const logado = dt['user']['id'];
      const id = dt['user']['id'];
      const name = dt['user']['title'];
      const email = dt['user']['email'];

      console.log('id: ' + id);
      console.log('nome: ' + name);

      AsyncStorage.setItem('user', JSON.stringify(dt['user']));

      AsyncStorage.setItem('userid', id.toString());
      AsyncStorage.setItem('name', name.toString());
      AsyncStorage.setItem('email', email.toString());


      router.replace('/(tabs)/(inicio)/inicio');
    } else {
      showMessage({
        message: 'Erro de autenticação',
        description: 'Existe algum erro nos dados informados.',
        type: "danger",
      });
      console.log(dt);
    }
  };


  return (
    <>
      <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 items-center justify-center">

            <View className="h-[60vh] w-[40vh] p-[15] m-[10] rounded-[20px]  bg-white  shadow">

              <Image source={logoImage} className="mb-6 w-[200px] h-[100px] self-center" />

              <Text className="text-xl text-left font-bold font-[Raleway] mb-6">ACESSAR</Text>

              <TextInput
                className="border-2 border-gray-200 p-4 rounded-lg mb-4"
                placeholder="E-mail"
                placeholderTextColor="#888"
                onChangeText={setemail}
                value={email} />

              <TextInput
                className="border-2 border-gray-200 p-4 rounded-lg mb-4"
                placeholder="Senha"
                placeholderTextColor="#888"
                secureTextEntry
                onChangeText={setpassword}
                value={password} />

                <TouchableOpacity onPress={logar}>
                  <View className="bg-yellow-500 p-4 rounded-[5px] mb-4">
                    <Text className="text-white text-center font-bold font-[Raleway]">ENTRAR</Text>
                  </View>
                </TouchableOpacity>

              <Link href="/forget" className="p-4">
                <Text className="text-blue-500 text-center mb-4 font-[Raleway]">Lembrar senha</Text>
              </Link>
              <Link href="/register" className="p-4">
                <Text className="text-blue-500 text-center mb-4 font-[Raleway]">Cadastre-se</Text>
              </Link>
              {/* <Link replace href="/(tabs)/(inicio)/inicio" className="p-4">
                <Text className="text-blue-500 text-center mb-4 font-[Raleway]">acessar</Text>
              </Link>  */}

            </View>



          </View>




        </TouchableWithoutFeedback>
      </ImageBackground></>
  );
}