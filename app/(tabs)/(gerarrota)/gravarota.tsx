import { Link, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity, Alert, Keyboard, ScrollView, StyleSheet, TextInput, Image, TouchableWithoutFeedback } from 'react-native';
import { Camera } from "expo-camera/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid } from "react-native";
import { watchPositionAsync } from "expo-location";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from '@expo/vector-icons';


import Routes from "../../../services/sqlite/Routes";
import Coord from "../../../services/sqlite/Coord";
import Midia from "../../../services/sqlite/Midia";


const MAP_TYPE = "standard";
const PROVIDER_GOOGLE = "google";


export default function gravarota() {

  const { id, timestamp, lati, long } = useLocalSearchParams();

  const [captura, setCaptura] = useState(true);
  const mapRef = useRef<MapView>(null);
  const p = { latitude: parseFloat(lati), longitude: parseFloat(long) };
  const [lat, setLat] = useState("");
  const [log, setLog] = useState(p);
  const [localiza, setLocaliza] = useState([p]);
  const [location, setLocation] = useState([]);
  const [loq, setLoq] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [userid, setuserid] = useState(null);
  AsyncStorage.getItem("userid").then((value) => setuserid(value));
  const [times, setTimes] = useState(timestamp);
  const [idrota, setIdrota] = useState(id);
  const [isLoading, setIsLoading] = useState(true);
  const [rota, setRota] = useState([]);
  const [coord, setCoord] = useState([]);
  const [region, setRegion] = useState([]);
  const [initialloc, setInitialloc] = useState([]);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [route, setRoute] = useState("");
  const [modal, setModal] = useState();
  const [modalf, setModalf] = useState();

  const [fts, setFts] = useState(0);
  const [aud, setAud] = useState(0);
  const [numPhotosTaken, setNumPhotosTaken] = useState(0);
  const maxPhotos = 3;

  const [foto1, setFoto1] = useState(null);
  const [foto1lat, setFoto1lat] = useState(null);
  const [foto1lgt, setFoto1lgt] = useState(null);

  const [foto2, setFoto2] = useState(null);
  const [foto2lat, setFoto2lat] = useState(null);
  const [foto2lgt, setFoto2lgt] = useState(null);

  const [foto3, setFoto3] = useState(null);
  const [foto3lat, setFoto3lat] = useState(null);
  const [foto3lgt, setFoto3lgt] = useState(null);

  const [audio1, setAudio1] = useState(null);
  const [audio1lat, setAudio1lat] = useState(null);
  const [audio1lgt, setAudio1lgt] = useState(null);

  const [audio2, setAudio2] = useState(null);
  const [audio2lat, setAudio2lat] = useState(null);
  const [audio2lgt, setAudio2lgt] = useState(null);

  const [audio3, setAudio3] = useState(null);
  const [audio3lat, setAudio3lat] = useState(null);
  const [audio3lgt, setAudio3lgt] = useState(null);

  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri_, setImageUri_] = useState(null);

  const [type, setType] = useState(Camera.Constants.Type.back);

  const [recording, setRecording] = React.useState();
  const [start, setStart] = useState(true);
  const [sound, setSound] = React.useState();
  const [sounduri, setsounduri] = React.useState();

  const [isModal, setIsModal] = useState(false);
  const [isModala, setIsModala] = useState(false);

  const toggleVisibility = (i) => {
    
    console.log('Mudar camera');
    setFts(i);
    setIsModal(!isModal);
  };

  const toggleVisibilitya = (i) => {
    console.log('Mudar mic', i);
    setAud(i);
    startRecording();
    setIsModala(!isModala);
  };

  const toggleVisibilityastop = (i) => {
    console.log('Mudar mic', i);
    setAud(i);
    stopRecording();
    setIsModala(!isModala);
  };



  const apagaData = async (dado) => {
    try {
      if (dado == 'f1') {
        setFts(fts - 1);
        const ft1 = await AsyncStorage.removeItem("foto_map_1");
        const ft1lat = await AsyncStorage.removeItem("foto_map_1_lat");
        const ft1lgt = await AsyncStorage.removeItem("foto_map_1_lng");
        setFoto1(null);
        setFoto1lat(null);
        setFoto1lgt(null);

      } if (dado == 'f2') {
        setFts(fts - 1);
        const ft2 = await AsyncStorage.removeItem("foto_map_2");
        const ft2lat = await AsyncStorage.removeItem("foto_map_2_lat");
        const ft2lgt = await AsyncStorage.removeItem("foto_map_2_lng");
        setFoto2(null);
        setFoto2lat(null);
        setFoto2lgt(null);

      } if (dado == 'f3') {
        setFts(fts - 1);
        const ft3 = await AsyncStorage.removeItem("foto_map_3");
        const ft3lat = await AsyncStorage.removeItem("foto_map_3_lat");
        const ft3lgt = await AsyncStorage.removeItem("foto_map_3_lng");
        setFoto3(null);
        setFoto3lat(null);
        setFoto3lgt(null);
      }

      if (dado == 'a1') {
        setAud(aud - 1);
        const aud1 = await AsyncStorage.removeItem("aud_map_1");
        const aud1lat = await AsyncStorage.removeItem("aud_map_1_lat");
        const aud1lgt = await AsyncStorage.removeItem("aud_map_1_lng");
        setAudio1(null);
        setAudio1lat(null);
        setAudio1lgt(null);
      } if (dado == 'a2') {
        setAud(aud - 1);
        const aud2 = await AsyncStorage.removeItem("aud_map_2");
        const aud2lat = await AsyncStorage.removeItem("aud_map_2_lat");
        const aud2lgt = await AsyncStorage.removeItem("aud_map_2_lng");
        setAudio2(null);
        setAudio2lat(null);
        setAudio2lgt(null);
      } if (dado == 'a3') {
        setAud(aud - 1);
        const aud3 = await AsyncStorage.removeItem("aud_map_3");
        const aud3lat = await AsyncStorage.removeItem("aud_map_3_lat");
        const aud3lgt = await AsyncStorage.removeItem("aud_map_3_lng");
        setAudio3(null);
        setAudio3lat(null);
        setAudio3lgt(null);
      }
    } catch (error) {
      console.log("Erro ao obter o valor:", error);
    }
  };

  const getData = async () => {
    try {
      const ft1 = await AsyncStorage.getItem("foto_map_1");
      const ft1lat = await AsyncStorage.getItem("foto_map_1_lat");
      const ft1lgt = await AsyncStorage.getItem("foto_map_1_lng");

      const ft2 = await AsyncStorage.getItem("foto_map_2");
      const ft2lat = await AsyncStorage.getItem("foto_map_2_lat");
      const ft2lgt = await AsyncStorage.getItem("foto_map_2_lng");

      const ft3 = await AsyncStorage.getItem("foto_map_3");
      const ft3lat = await AsyncStorage.getItem("foto_map_3_lat");
      const ft3lgt = await AsyncStorage.getItem("foto_map_3_lng");

      const aud1 = await AsyncStorage.getItem("aud_map_1");
      const aud1lat = await AsyncStorage.getItem("aud_map_1_lat");
      const aud1lgt = await AsyncStorage.getItem("aud_map_1_lng");

      const aud2 = await AsyncStorage.getItem("aud_map_2");
      const aud2lat = await AsyncStorage.getItem("aud_map_2_lat");
      const aud2lgt = await AsyncStorage.getItem("aud_map_2_lng");

      const aud3 = await AsyncStorage.getItem("aud_map_3");
      const aud3lat = await AsyncStorage.getItem("aud_map_3_lat");
      const aud3lgt = await AsyncStorage.getItem("aud_map_3_lng");

      if (ft1 !== null) {
        setFoto1(ft1);
        setFoto1lat(ft1lat);
        setFoto1lgt(ft1lgt);
      }

      if (ft2 !== null) {
        setFoto2(ft2);
        setFoto2lat(ft2lat);
        setFoto2lgt(ft2lgt);
      }

      if (ft3 !== null) {
        setFoto3(ft3);
        setFoto3lat(ft3lat);
        setFoto3lgt(ft3lgt);
      }

      if (aud1 !== null) {
        setAudio1(aud1);
        setAudio1lat(aud1lat);
        setAudio1lgt(aud1lgt);
      }

      if (aud2 !== null) {
        setAudio2(aud2);
        setAudio2lat(aud2lat);
        setAudio2lgt(aud2lgt);
      }

      if (aud3 !== null) {
        setAudio3(aud3);
        setAudio3lat(aud3lat);
        setAudio3lgt(aud3lgt);
      }
    } catch (error) {
      console.log("Erro ao obter o valor:", error);
    }
  };


  const permisionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === "granted");
    if (cameraPermission.status !== "granted") {
      alert("Permissão para uso da câmera é necessário");
    }
  };

  function geraStringAleatoria(tamanho) {
    let stringAleatoria = "";
    let caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < tamanho; i++) {
      stringAleatoria += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
    return stringAleatoria;
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({ quality: 0.1 });
      //const [userid, setuserid] = useState(null);
      let timestamp = new Date().getTime();
      let rand = Math.floor(Math.random() * 10) + 5;
      let namefile = geraStringAleatoria(rand) + "_" + timestamp + "_img.jpg";

      let uriArray = data.uri.split("/");
      let nameToChange = uriArray[uriArray.length - 1];
      let renamedURI = data.uri.replace(nameToChange, namefile);
      FileSystem.copyAsync({ from: data.uri, to: renamedURI });
      //console.log(renamedURI);
      FileSystem.deleteAsync(data.uri);
      if (fts == 1) {
        AsyncStorage.setItem("foto_map_1", "" + renamedURI + "");
        AsyncStorage.setItem("foto_map_1_lat", "" + log.latitude + "");
        AsyncStorage.setItem("foto_map_1_lng", "" + log.longitude + "");
      }
      if (fts == 2) {
        AsyncStorage.setItem("foto_map_2", "" + renamedURI + "");
        AsyncStorage.setItem("foto_map_2_lat", "" + log.latitude + "");
        AsyncStorage.setItem("foto_map_2_lng", "" + log.longitude + "");
      }
      if (fts == 3) {
        AsyncStorage.setItem("foto_map_3", "" + renamedURI + "");
        AsyncStorage.setItem("foto_map_3_lat", "" + log.latitude + "");
        AsyncStorage.setItem("foto_map_3_lng", "" + log.longitude + "");
      }
      //setFts(fts + 1);
      console.log('Foto tirada -> ', fts);
      toggleVisibility();
      getData();
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await 
      Location.requestForegroundPermissionsAsync();
      if (status === "denied") {
        Alert.alert("Serviço de localização desativado");
      }
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      const newRegion = {
        latitude: parseFloat(location.coords.latitude),
        longitude: parseFloat(location.coords.longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(location);
      setRegion(newRegion);
      setInitialloc(newRegion);

      newRegion ? setIsLoading(false) : console.log("dados indefinidos");
      if (captura) {
        let subscription = await Location.watchPositionAsync(
          {
            accuracy: 6,
            distanceInterval: 5, // Defina a distância mínima para 5 metros
          },
          (location) => {
            const poly = {
              latitude: parseFloat(location.coords.latitude),
              longitude: parseFloat(location.coords.longitude),
            };
            setLog(poly);
            mapRef.current?.animateCamera({
              pitch: 80,
              center: location.coords,
              zoom: 18,
            });
          }
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (captura) {
      setLocaliza([...localiza, log]);
      Coord.insert({
        user_id: userid,
        route_id: idrota,
        timestamp: times,
        lat: log.latitude,
        lgt: log.longitude,
        created: Date.now(),
      }).then((id) => {
        // console.log("dado adicionados:", id);
      });
    }
  }, [log, captura]);

  useFocusEffect(
    React.useCallback(() => {
      Routes.find(id).then((route) => {
        setRota(route);
      });
    }, [])
  );

  const startRecording = async () => {
    console.log("gravacao iniciada");
    try {
      console.log("Solicitando permissao para gravar..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Iniciando gravação!");
      setStart(false);
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.log("Falha em gravar e executar uma vez: ");
      console.error("Falha em gravar: ", err);
    }
  };

  const stopRecording = async () => {
    console.log("parando a gravaçao audio de numero -> ", aud);
    //Formacao do nome do aquivo de audio
    let timestampi = new Date().getTime();
    let rand = Math.floor(Math.random() * 10) + 5;
    let namefile = geraStringAleatoria(rand) + "__" + timestampi + "_audio.caf";

    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('uri do audio ->',uri);
    let uriArray = uri.split("/");
    let nameToChange = uriArray[uriArray.length - 1];
    let renamedURI = uri.replace(nameToChange, namefile);

    FileSystem.copyAsync({ from: uri, to: renamedURI });
    console.log(
      "Parando a gravação e renomeando o arquivo: " +
      idrota +
      " - " +
      renamedURI
    );
    setsounduri(renamedURI);
    FileSystem.deleteAsync(uri);
    if (aud == 1) {
      console.log("adicionando no storage 1 o audio");
      AsyncStorage.setItem("aud_map_1", "" + renamedURI + "");
      AsyncStorage.setItem("aud_map_1_lat", "" + log.latitude + "");
      AsyncStorage.setItem("aud_map_1_lng", "" + log.longitude + "");
    }
    if (aud == 2) {
      console.log("adicionando no storage 2 o audio");
      AsyncStorage.setItem("aud_map_2", "" + renamedURI + "");
      AsyncStorage.setItem("aud_map_2_lat", "" + log.latitude + "");
      AsyncStorage.setItem("aud_map_2_lng", "" + log.longitude + "");
    }
    if (aud == 3) {
      console.log("adicionando no storage 3 o audio");
      AsyncStorage.setItem("aud_map_3", "" + renamedURI + "");
      AsyncStorage.setItem("aud_map_3_lat", "" + log.latitude + "");
      AsyncStorage.setItem("aud_map_3_lng", "" + log.longitude + "");
    }
    getData();
    //Routes.updateaudio(idrota, renamedURI);
  };

  const final = () => {
    setCaptura(false);
    //stopRecording();

    // midia tipo 1 = foto
    // midia tipo 2 = audio
    if (foto1) {
      Midia.insert({
        route_id: idrota,
        timestamp: times,
        user_id: userid,
        type: 1,
        file: foto1,
        lat: foto1lat,
        long: foto1lgt,
        up: 0,
        created: Date.now(),
      }).then((id) => {
        console.log("dado adicionados:", id);
      });
    }
    if (foto2) {
      Midia.insert({
        route_id: idrota,
        timestamp: times,
        user_id: userid,
        type: 1,
        file: foto2,
        lat: foto2lat,
        long: foto2lgt,
        up: 0,
        created: Date.now(),
      }).then((id) => {
        console.log("dado adicionados:", id);
      });
    }
    if (foto3) {
      Midia.insert({
        route_id: idrota,
        timestamp: times,
        user_id: userid,
        type: 1,
        file: foto3,
        lat: foto3lat,
        long: foto3lgt,
        up: 0,
        created: Date.now(),
      }).then((id) => {
        console.log("dado adicionados:", id);
      });
    }

    if (audio1) {
      Midia.insert({
        route_id: idrota,
        timestamp: times,
        user_id: userid,
        type: 2,
        file: audio1,
        lat: audio1lat,
        long: audio1lgt,
        up: 0,
        created: Date.now(),
      }).then((id) => {
        console.log("dado adicionados:", id);
      });
    }
    if (audio2) {
      Midia.insert({
        route_id: idrota,
        timestamp: times,
        user_id: userid,
        type: 2,
        file: audio2,
        lat: audio2lat,
        long: audio2lgt,
        up: 0,
        created: Date.now(),
      }).then((id) => {
        console.log("dado adicionados:", id);
      });
    }
    if (audio3) {
      Midia.insert({
        route_id: idrota,
        timestamp: times,
        user_id: userid,
        type: 2,
        file: audio3,
        lat: audio3lat,
        long: audio3lgt,
        up: 0,
        created: Date.now(),
      }).then((id) => {
        console.log("dado adicionados:", id);
      });
    }
    router.replace({ pathname: '/(tabs)/(gerarrota)/inicio' });
    router.navigate({ pathname: '/(tabs)/(minharota)/inicio' });
    console.log("Fim da captura");
  };

  console.log('paramentros recebidos', timestamp, lat, log);


  return (
    <View className="flex-1 items-center justify-center bg-transparent">


      {/* <Text>{lat} - {log}</Text> */}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <MapView
          ref={mapRef}
          flex={1}
          height={300}
          width={"99.9%"}
          provider={"google"}
          initialRegion={initialloc}
          showsUserLocation
          loadingEnabled
          onRegionChangeComplete={(e) => {
            setZoomLevel(e.latitudeDelta);
          }}
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
          ]}
        >
           <Marker
            icon={require("../../../assets/images/locale.png")}
            coordinate={region}
          />
          {localiza.length > 1 && (
            <Polyline coordinates={localiza} strokeWidth={5} />
          )}
        </MapView>
      )}
      <View style={styles.floatingFoto} className="h-[6vh]  p-[15] mb-5 flex-row justify-between rounded-[5px]  bg-white  shadow">

        <Text>Fotos</Text>

        <TouchableOpacity style={styles.unselectedBackground} onPress={() => toggleVisibility(1)} >
          <Image source={require('../../../assets/icons/foto.png')} style={styles.mn} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.unselectedBackground} onPress={() => toggleVisibility(2)} >
          <Image source={require('../../../assets/icons/foto.png')} style={styles.mn} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.unselectedBackground} onPress={() => toggleVisibility(3)} >
          <Image source={require('../../../assets/icons/foto.png')} style={styles.mn} />
        </TouchableOpacity>

      </View>
      <View style={styles.floatingAudio} className="h-[6vh]  p-[15] mb-5 flex-row justify-between rounded-[5px]  bg-white  shadow">
        <Text>Áudio</Text>
        <TouchableOpacity style={styles.unselectedBackground} onPress={() => toggleVisibilitya(1)}>
          <Image source={require('../../../assets/icons/microfone.png')} style={styles.mn} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.unselectedBackground} onPress={() => toggleVisibilitya(2)}>
          <Image source={require('../../../assets/icons/microfone.png')} style={styles.mn} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.unselectedBackground} onPress={() => toggleVisibilitya(3)}>
          <Image source={require('../../../assets/icons/microfone.png')} style={styles.mn} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={() => final()}>
        <View className="bg-orange-500 p-4 rounded-[5px] mb-4 text-right">
          <Text className="text-right"> Finalizar </Text>
        </View>
      </TouchableOpacity>

      {isModal && (
        <View style={styles.wmodal} className="shadow">
          <Camera
            className=" w-full h-full "
            ref={(ref) => setCamera(ref)}
            type={type}
          >
            <View style={styles.buttonContainer}>
              
                <TouchableOpacity className=" bg-yellow-500  rounded-full w-14 h-14 mt-[650px] " style={styles.button} onPress={takePicture}>
                  <Image source={require("../../../assets/icons/foto.png")} />
                </TouchableOpacity>
              
            </View>
          </Camera>
        </View>
      )}
      {isModala && (
        <View style={styles.wmodal} className="shadow">
          <View className="flex-1 items-center justify-center">
            <View className=" bg-white w-60 h-60 rounded-full items-center justify-center">
              <Image source={require('../../../assets/icons/audio.gif')} className=' w-40 h-40' />
            </View>
            <TouchableOpacity className='rounded-[5px] bg-red-600 mt-16 p-5 ' onPress={() => {toggleVisibilityastop(1);} } >
              <Text className=' text-white '> <FontAwesome name="stop-circle" size={18} className='text-white mr-5' /> Parar gravação</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

    </View>

  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    position: 'absolute',
    bottom: 20,


  },
  wmodal: {
    position: 'absolute',
    bottom: 20, // Distância do fundo da tela
    left: 20, // Distância do lado esquerdo da tela
    right: 20, // Distância do lado direito da tela
    top: 60,
    backgroundColor: '#ededed',
    padding: 5,
    borderRadius: 5,
  },
  wmodals: {
    position: 'absolute',
    bottom: 20, // Distância do fundo da tela
    left: 20, // Distância do lado esquerdo da tela
    right: 20, // Distância do lado direito da tela
    top: 60,
    backgroundColor: '#ededed',
    padding: 5,
    borderRadius: 5,
  },
  mn: {
    marginTop: -8
  },
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
  unselectedBackground: {
    backgroundColor: '#ededed',
    padding: 15,
    borderRadius: 5,
    marginTop: -5
  },

  floatingAudio: {
    position: 'absolute',
    bottom: 135, // Distância do fundo da tela
    left: 20, // Distância do lado esquerdo da tela
    right: 20, // Distância do lado direito da tela
  },
  floatingFoto: {
    position: 'absolute',
    bottom: 75, // Distância do fundo da tela
    left: 20, // Distância do lado esquerdo da tela
    right: 20, // Distância do lado direito da tela
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20, // Distância do fundo da tela
    left: 20, // Distância do lado esquerdo da tela
    right: 20, // Distância do lado direito da tela
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },

});
function useRoute() {
  throw new Error("Function not implemented.");
}

