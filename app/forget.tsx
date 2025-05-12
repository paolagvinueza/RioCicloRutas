import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import { Text, TextInput, Image, View, Keyboard, TouchableWithoutFeedback, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import FlashMessage, {showMessage, hideMessage} from "react-native-flash-message";


// imagens
import backgroundImage from '../assets/images/bg.jpg';
import logoImage from '../assets/images/logoescura.png';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    // Implemente a lógica de redefinição de senha aqui
    console.log('Password reset request for:', email);
  };

  const lembrar = async () => { 

    showMessage({
      message: "Enviando dados",
      description: "Conectando no servidor...",
      type: "info",
    });
  
  const formData = new FormData();

  formData.append('email', email);
  try {
  const res = await axios.post('https://www.riobambaciclorutas.com/api/forgetapp.json',formData,
  {
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
      description: "E-mail não encontrado",
      type: "danger",
    });
  }
  if (dt.return == 1) {
    showMessage({
      message: "Sucesso!",
      description: "Uma nova senha foi enviada para o seu e-mail.",
      type: "success",
    });
    router.replace('/');
    
  }
} catch(error) {
  console.log(error)
}
  }

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View className="flex-1 items-center justify-center">
    
    <View className="h-[50vh] w-[40vh] p-[15] m-[10] rounded-[20px] bg-white shadow">
    <Image source={logoImage} className="mb-6 w-[200px] h-[100px] self-center" />
        <Text className="text-2xl text-center font-[Raleway] mb-6">Esqueceu a senha</Text>

        <TextInput
          className="border-2 border-gray-200 p-4 rounded-lg mb-4"
          placeholder="DIGITE SEU E-MAIL"
          placeholderTextColor="#888"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
        />

        <TouchableOpacity
          className="bg-yellow-500 p-4 rounded-lg mb-4"
          onPress={lembrar}
        >
          <Text className="text-white text-center font-bold font-[Raleway]">LEMBRAR SENHA</Text>
        </TouchableOpacity>

        <Link href="./" className="p-4">
          <Text className="text-blue-500 text-center font-[Raleway]">Tela de login</Text>
        </Link>
      </View>
    </View>
    </TouchableWithoutFeedback>
    </ImageBackground>
  );
}