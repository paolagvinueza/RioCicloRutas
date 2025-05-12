import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, Alert, Keyboard, ScrollView, StyleSheet, TextInput, Image, TouchableWithoutFeedback } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link, router } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, MapTypes, PROVIDER_GOOGLE } from "react-native-maps";

import Routes from "../../../services/sqlite/Routes";

const MAP_TYPE = "standard";

export default function gerarrota(props) {

  const [captura, setCaptura] = useState(1);
  const [location, setLocation] = useState(null);
  const [loc, setLoc] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [foto1, setfoto1] = useState(null);
  const [timestamp, settimestamp] = useState(Math.floor(Date.now() / 1000));
  const [userid, setuserid] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef();
  const [region, setRegion] = useState([]);

  const [routeid, setRouteid] = useState(null);
  const [title, setTitle] = useState('');
  const [obs, setObs] = useState('');
  const [tipo, setTipo] = useState('selecione');

  const [country, setCountry] = useState('.');
  const [state, setState] = useState('.');
  const [city, setCity] = useState('.');
  const [route, setRoute] = useState('');

  const [lat, setLat] = useState('');
  const [log, setLog] = useState('');


  AsyncStorage.getItem('userid').then((value) => setuserid(value));

  useFocusEffect(React.useCallback(() => { AsyncStorage.getItem('foto_1').then((value) => setfoto1(value)) }, []));

  useEffect(() => {
    (async () => {
      setLoc(false);
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('status: ', status);
      if (status === 'denied') {
        Alert.alert('Serviço de localização desativado');
        console.log('status dentro do status:');
      }
      console.log('Verificando prosição');
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true, });
      setLocation(location);
      setLoc(true);


      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      newRegion ? setIsLoading(false) : console.log("dados indefinidos");
      ///recolhe informações da localização
      console.log('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.coords.latitude + ',' + location.coords.longitude + '&key=AIzaSyC-qrEoo9h8c_cnZc_jlFxarUfz4ockt_s');
      fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.coords.latitude + ',' + location.coords.longitude + '&key=AIzaSyC-qrEoo9h8c_cnZc_jlFxarUfz4ockt_s', { headers: { "content-type": "multipart/form-data" } })
        .then(response => response.json())
        .then(data => {
          const addressComponents = data.results[0].address_components;
          setLat(location.coords.latitude);
          setLog(location.coords.longitude);
          setCountry(addressComponents[5].long_name);
          setState(addressComponents[4].short_name);
          setCity(addressComponents[3].short_name);
          setRoute(addressComponents[1].short_name);
        })
        .catch(error => console.log(error));

    })();
  }, []);
  const dt = Routes.datahoraatual();

  const inputRoute = () => {
    console.log("insert dados do census na tabela");
    if (title) {
      Routes.insert({ timestamp: timestamp, title: title, image: foto1, audio: '', obs: obs, country: country, state: state, city: city, lat: lat, log: log, up: 0, type: tipo, user_id: userid, created: dt })
        .then((id) => {
          setRouteid(id);
          //Apaga informações
          AsyncStorage.removeItem('foto_1');
          setTitle(null);
          setObs(null);
          setCountry(null);
          setState(null);
          setCity(null);
          setTipo(null);
          setRoute(null);
          console.log('chegou aqui');
          router.navigate({ pathname: '/(tabs)/(gerarrota)/gravarota', params: { id: id, timestamp: timestamp, lati: lat, long: log }});
          setLat(null);
          setLog(null);
                        
                          
                          
        }).catch((err) => { err; });

    } else { Alert.alert('Você precisa preencher o titulo') }

  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{flex: 1}}>
        <View className="flex-1 items-center justify-center bg-transparent pt-16">
        <View className=" w-screen items-start text-left bg-transparent">
             <Text className="text-[40px] pl-10 text-left font-[RalewayBold] mb-3 bg-transparent">GERAR ROTA</Text>
        </View>

            <View className="h-[50vh] w-[40vh] p-[15] mb-5  rounded-[20px]  bg-white  shadow">
            <Text className="text-[20px] text-left font-[Raleway] mb-6">Dados da rota</Text>
              <TextInput
                className="border-2 border-gray-200 p-4 rounded-lg mb-4"
                placeholder="Nome para rota"
                placeholderTextColor="#888"
                onChangeText={(data) => setTitle(data)}
              />
              <TextInput
                className="border-2 border-gray-200 p-4 rounded-lg mb-4"
                placeholder="Breve descrição"
                placeholderTextColor="#888"
                onChangeText={(data) => setObs(data)}
              />
              <TextInput
                className="border-2 border-gray-200 p-4 rounded-lg mb-4"
                placeholder="Localização"
                placeholderTextColor="#888"
                value={city+', '+state+' - '+country}
                editable={false}
              />
              <Text>{tipo}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>

                <TouchableOpacity  onPress={() => setTipo('Running')} 
                style={tipo === 'Running' ? styles.selectedBackground : styles.unselectedBackground }
                >
                  <Image source={require('../../../assets/icons/_run.png')} />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => setTipo('Walking')}
                style={tipo === 'Walking' ? styles.selectedBackground : styles.unselectedBackground }
                >
                  <Image source={require('../../../assets/icons/_foot.png')} />
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => setTipo('Bicycle')}
                 style={tipo === 'Bicycle' ? styles.selectedBackground : styles.unselectedBackground }
                >
                  <Image source={require('../../../assets/icons/_bicycle.png')} width={50} />
                </TouchableOpacity>

              </View>
            </View>

            <View className="h-[20vh] w-[40vh] mb-5 rounded-[20px]  bg-white  shadow">
            <TouchableOpacity onPress={() => router.navigate('/(tabs)/(gerarrota)/foto/') }>
                    { (foto1 ? 
                    <>
                      <Image className="mb-6 w-full h-[180px] self-center mb-5 rounded-[20px]"  source={{uri: foto1 }}  />
                    </>
                    :
                    <>
                    <Image className="m-16 w-[50px] h-[50px] align-middle self-center" source={require('../../../assets/icons/foto.png')}/>
                    </>
                    )}
                  </TouchableOpacity>
            </View>
            <View className="h-[40vh] w-[40vh] p-[15] mb-5  rounded-[20px]  bg-white  shadow">
            {isLoading ? (
            <ActivityIndicator />
          ) : (
            <MapView region={region} mapType={MAP_TYPE} provider={PROVIDER_GOOGLE} flex={1} height={300} width={"99.9%"}>
              <Marker icon={require("../../../assets/images/locale.png")} coordinate={region} />
            </MapView>
          )}
            </View>
            <TouchableOpacity onPress={() => inputRoute()}>
             <View className="w-[40vh] bg-blue-500 p-4 rounded-[5px] mb-4">
                <Text className="text-right"> Iniciar rota </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/(tabs)/(minharota)/inicio')}>
             <View className="w-[40vh] bg-red-500 p-4 rounded-[5px] mb-4">
                <Text className="text-left"> Voltar </Text>
              </View>
            </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  selectedBackground: {
    backgroundColor: '#c39598',
    padding:20,
    
    borderRadius: 10,
  },
  unselectedBackground: {
    backgroundColor: '#ededed',
    padding:20,
    
    borderRadius: 10,
  },
  
});
