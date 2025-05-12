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
import Coord from "../../../services/sqlite/Coord";
import Midia from "../../../services/sqlite/Midia";
import api from "../../../services/api";
import apiup from "../../../services/apiup";

const MAP_TYPE = "standard";


export default function minhaRota(props) {

  const [captura, setCaptura] = useState(1);
  const [location, setLocation] = useState(null);
  const [loc, setLoc] = useState(null);
  const [userid, setuserid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef();
  const [rotas, setRotas] = useState([]);
  const [region, setRegion] = useState([]);
  const [lat, setLat] = useState('');
  const [log, setLog] = useState('');

  AsyncStorage.getItem('userid').then((value) => setuserid(value));


  const apagardados = async () => {
    try {
      await AsyncStorage.removeItem("foto_map_1");
      await AsyncStorage.removeItem("foto_map_2");
      await AsyncStorage.removeItem("foto_map_3");

      await AsyncStorage.removeItem("aud_map_1");
      await AsyncStorage.removeItem("aud_map_2");
      await AsyncStorage.removeItem("aud_map_3");

      await AsyncStorage.removeItem("foto_1");
      await AsyncStorage.removeItem("foto_2");
      await AsyncStorage.removeItem("foto_3");
      console.log("Variáveis removida com sucesso.");
    } catch (error) {
      console.log("Erro ao remover a variável:", error);
    }
  };

  const updateunico = (c) => {
    const dados = c;

    dados.map(function (dados, i) {
      var img = dados;
      const img1 = img.image;

      async function upload(img_1) {

        const formData1 = new FormData();
        formData1.append('file', {
          uri: Platform.OS === 'ios' ? img_1.replace('file://', '') : img_1,
          name: Platform.OS === 'ios' ? img_1.replace('file://', '') : img_1,
          type: 'image/jpeg',
        });

        //console.log('enviando imagem principal');
        const res1 = await apiup.post('upload.php', formData1, { headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data;' }, }).then((response) => {
          //console.log(JSON.stringify(response));
        });

      }
      upload(img1);
    });


    console.log("enviando:" + JSON.stringify(c));


    const censo = api.post("rotaadd.json", { c }).then((response) => {
      console.log("post:" + JSON.stringify(response.data));
      console.log("recebido -> " + response.data.recebido);

      if (response.data.recebio > 0) {
        console.log("nada a fazer questionarios");
      } else {
        //console.log("Dados up sendo atualizado");
        Routes.updateup(response.data.recebido);
        Routes.all().then((routes) => { setRotas(routes); });
      }
    });
  };
  const updateonlineA = (c) => {
    console.log("Subindo coordenadas...");
    console.log("enviando coordenadas:" + JSON.stringify(c));
    const coo = api.post("cooradd.json", { c }).then((response) => {
      console.log("coordenadas enviadas:" + JSON.stringify(response.data));
    });
  };
  const updateonlineM = (c) => {
    const dados = c;

    dados.map(function (dados, i) {
      var midia = dados;
      const fl = midia.file;
      const tp = midia.type;

      async function uploadM(fl) {

        const formData1 = new FormData();
        if (tp === 1) {
          formData1.append('file', {
            uri: Platform.OS === 'ios' ? fl.replace('file://', '') : fl,
            name: Platform.OS === 'ios' ? fl.replace('file://', '') : fl,
            type: 'image/jpeg',
          });
        } else {
          formData1.append('file', {
            uri: Platform.OS === 'ios' ? fl.replace('file://', '') : fl,
            name: Platform.OS === 'ios' ? fl.replace('file://', '') : fl,
            type: 'audio/m4a',
          });
        }


        const res1 = await apiup.post('upload.php', formData1, { headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data;' }, }).then((response) => {

        });

      }
      uploadM(fl);
    });
    //console.log("Subindo mídias...");
    //console.log("enviando midias:" + JSON.stringify(c));
    const coo = api.post("midiaadd.json", { c }).then((response) => {
      //console.log("coordenadas enviadas:" + JSON.stringify(response.data));
    });
  };

  const transmitiunico = (id) => {
    console.log("Tentando transmitir " + id);
    Routes.routesup(id).then((route) => {
      Coord.allup(id).then((coord) => updateonlineA(coord)).catch(void (0));
      Midia.allup(id).then((midia) => updateonlineM(midia)).catch(void (0));
      updateunico(route);
    }); //
  };

  const apagarrota = (id) => {
    console.log("Apagando...");
    Routes.remove(id);
    Routes.all().then((routes) => {
      setRotas(routes);
    });
  };
  const anular = (id) => {
    console.log("anulando...");
    Routes.updatenull(id);
    Routes.all().then((routes) => {
      setRotas(routes);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      Routes.all().then((routes) => {
        setRotas(routes);
        console.log('rotas --> ',routes);
      });
      apagardados();
    }, [])
  );

  useEffect(() => {
    (async () => {
      setLoc(false);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'denied') {
        Alert.alert('Serviço de localização desativado');
      }
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

      fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.coords.latitude + ',' + location.coords.longitude + '&key=AIzaSyC-qrEoo9h8c_cnZc_jlFxarUfz4ockt_s', { headers: { "content-type": "multipart/form-data" } })
        .then(response => response.json())
        .then(data => {
          const addressComponents = data.results[0].address_components;
          setLat(location.coords.latitude);
          setLog(location.coords.longitude);
        })
        .catch(error => console.log(error));

    })();
  }, []);


  const BlueDot = () => (
    <View style={styles.blueDot} />
  );
  return (

    <View className="flex-1 items-center justify-center bg-white">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
         
        <MapView
          region={region}
          mapType={MAP_TYPE}
          provider={PROVIDER_GOOGLE}
          className=' h-full w-full'
          showsUserLocation
          customMapStyle={[
            {
              featureType: 'poi.business',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'poi.attraction',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'poi.place_of_worship',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'poi.government',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'poi.medical',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'poi.school',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'poi.sports_complex',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ]}>


          {rotas.length >= 1 &&
            rotas.map(({ id, title, image, country, state, city, lat, log, up }) => (
              (id) > 0 ? (
                <Marker
                  key={id}
                  coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(log) }}
                  icon={require("../../../assets/images/locale.png")}
                  onPress={() => router.navigate('/(tabs)/(minharota)/detalhes?id=' + id)}
                />
              ) : null
            ))
          }
        </MapView>
        
      )}
    </View>

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
    padding: 20,

    borderRadius: 10,
  },
  unselectedBackground: {
    backgroundColor: '#ededed',
    padding: 20,

    borderRadius: 10,
  },
  blueDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'blue',
  },

});
