import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, Alert, Keyboard, ScrollView, StyleSheet, TextInput, Image, TouchableWithoutFeedback } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link, router } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, MapTypes, PROVIDER_GOOGLE } from "react-native-maps";
import axios from 'axios';

import Routes from "../../../services/sqlite/Routes";

const MAP_TYPE = "standard";

export default function inicio(props) {



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
      console.log('localização -> ', location);

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

      // fetch('https://www.riobambaciclorutas.com/api/routes.json')
      // .then(response => response.json())
      // .then(data => {
      //   Alert.alert(data);
      //   setRoutes(data.routes);
      // })
      // .catch(error => Alert.alert(error));

      axios.get('https://www.riobambaciclorutas.com/api/routes.json')
        .then(response => {
          setRoutes(response.data.routes);
        })
        .catch(error => {
          Alert.alert('Erro', error.message);
        });

    })();
  }, []);

  const [routes, setRoutes] = useState([]);

  const renderMarkers = () => {
    return routes.map((route, index) => (
      <Marker
        key={index}
        icon={require("../../../assets/images/locale.png")}
        coordinate={{ latitude: parseFloat(route.lat), longitude: parseFloat(route.log) }}
        title={route.title}
        description={route.obs}
        onPress={() => { router.navigate('/(tabs)/(inicio)/detalhes?id=' + route.timestamp) }}
      />
    ));
  };


  return (

    <View className="flex-1 items-center justify-center bg-white">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <MapView
          region={region}
          provider={PROVIDER_GOOGLE}
          mapType={MAP_TYPE}
          className=' h-full w-full'
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
          {renderMarkers()}
          <Marker icon={require("../../../assets/images/locale.png")} coordinate={region} />
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

});
