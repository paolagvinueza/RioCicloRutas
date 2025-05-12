import { Button, Text, TextInput, Image, View, Keyboard, TouchableWithoutFeedback, ImageBackground, TouchableOpacity, StyleSheet, Platform, } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Link, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useRef, useCallback, useState, useMemo, useEffect, } from "react";
import { useNavigation } from "@react-navigation/core";
import MapView, { Marker, MapTypes, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Audio } from 'expo-av';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function detalhe() {
  const { id } = useLocalSearchParams();
  const [localiza, setLocaliza] = useState([]);
  const [modal, setModal] = useState();
  const [modalf, setModalf] = useState();
  const [imagem, setImagem] = useState();
  const [audio, setAudio] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef();
  const [isModal, setIsModal] = useState(false);
  const [isModala, setIsModala] = useState(false);
  const [fts, setFts] = useState(0);
  const [aud, setAud] = useState(0);

  const toggleVisibility = (i) => {
    setFts(i);
    setIsModal(!isModal);
  };

  const toggleVisibilitya = (aa) => {
    console.log('play no som');
    playsound(aa);
    setIsModala(!isModala);
  };
  const toggleVisibilityastop = () => {
    console.log('fechar tela do audio');
    stop();
    setIsModala(!isModala);
  };

  const sound = new Audio.Sound();

  const playsound = async (a) => {
    console.log('dando play no audio --> ', a);
    try {

      await sound.loadAsync({ uri: a });
      await sound.playAsync({ shouldPlay: true, playsInSilentModeIOS: true });
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  const stop = async () => {
    try {
      console.log('Parando de tocar o audio');
      await sound.setStatusAsync({ shouldPlay: false });  // Pare o áudio
      console.log('Descarregando o audio');
      await sound.unloadAsync();  // Descarregue o recurso de áudio
    } catch (error) {
      console.error('Erro -> ', error);
    }
  }


  type tRegion = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  };

  const [region, setRegion] = useState<tRegion | null>(null);

  const [rota, setRota] = useState([]);
  const [coordd, setCoordd] = useState([{ "latitude": "-1.451593417739574", "longitude": "-48.46425079622263" }]);
  const [midiass, setMidiass] = useState([]);

  const pegarCoordenadas = async () => {
    try {
      console.log(rota);
      console.log(coordd);
    } catch (erro) {
      console.error(erro);
    }
  }



  useEffect(() => {
    axios.get('https://www.riobambaciclorutas.com/api/route/' + id + '.json')
      .then(response => {
        const route = response.data.routes[0]; // Acessando o primeiro objeto da array
        setRota(route);
        //console.log('Rotas -> ', response.data.routes);
      })
      .catch(error => console.log(error));

    axios.get('https://www.riobambaciclorutas.com/api/coord/' + id + '.json')
      .then(response => {
        //setCoordd('');
        const coordenadas = response.data.routescoordinates.map(coord => ({
          latitude: parseFloat(coord.latitude),
          longitude: parseFloat(coord.longitude)
        }));
        //console.log('Coordenadas dados -> ', coordenadas);
        setCoordd(coordenadas);
        //console.log('Coordenadas -> ', 'https://www.riobambaciclorutas.com/api/coord/' + id + '.json');
      })
      .catch(error => console.log(error));

    axios.get('https://www.riobambaciclorutas.com/api/midias/' + id + '.json')
      .then(response => {
        setMidiass(response.data.midia);
        //console.log('Mídias -> ', response.data.midia);
      })
      .catch(error => console.log(error));

  }, []);


  useEffect(() => {
    console.log(rota.lat + '- ' + rota.log);
    if (rota.lat) {

      const newRegion = {
        latitude: parseFloat(rota.lat),
        longitude: parseFloat(rota.log),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
    }
  }, [rota]);

  useEffect(() => {
    if (region) {
      setIsLoading(false);
    }
  }, [region]);


  //console.log('regiao 3 -> ',region);

  return (
    <View className="flex-1 items-center p-5">
      {
        isLoading ? (<><Text>Carregando</Text></>) :
          (
            <>
              <View className="h-[70] w-[40vh] p-[8] mb-[20px] rounded-[10px] bg-white shadow">
                <Text className="text-xl text-left font-[Raleway] text-lg">{rota.title} - {rota.type}</Text>
                <Text className="text-xl text-left font-[Raleway] text-xs">{rota.city} - {rota.state}, {rota.country}</Text>
              </View>

              <MapView
                region={region}
                provider={PROVIDER_GOOGLE}
                flex={1}
                height={500}
                width={"99.9%"}
              >
                {region && (
                  <Marker icon={require("../../../assets/images/locale.png")} coordinate={region} />
                )}

                {midiass.map((coordenada, index) => (
                  <Marker
                    key={index} // Certifique-se de definir uma chave única para cada marcador
                    onPress={() => {
                      coordenada.type == 1
                        ? (toggleVisibility('https://www.riobambaciclorutas.com/uploads/' + coordenada.file), console.log('Clicou na imagem: ', coordenada.file)) : (toggleVisibilitya('https://www.riobambaciclorutas.com/uploads/' + coordenada.file), setAud('https://www.riobambaciclorutas.com/uploads/' + coordenada.file), console.log('Clicou no audio: ', coordenada.file));
                    }}
                    coordinate={{
                      latitude: parseFloat(coordenada.lat),
                      longitude: parseFloat(coordenada.log),
                    }}
                    icon={
                      coordenada.type == 1
                        ? require("../../../assets/images/foto.png")
                        : require("../../../assets/images/audio.png")
                    }
                  />
                ))}

                {coordd.length > 2 && (
                  <Polyline coordinates={coordd} strokeWidth={5} />
                )}

              </MapView>


              {isModal && (
                <View style={styles.wmodal} className="shadow">
                  <Image
                    className=' w-[100%] h-[100%] '
                    source={{ uri: fts }}
                  ></Image>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      marginTop: -5, // Ajuste conforme necessário
                      marginRight: -5, // Ajuste conforme necessário
                      width: 40, // Largura do botão
                      height: 40, // Altura do botão
                      borderRadius: 20, // Raio de borda para torná-lo redondo
                      backgroundColor: '#f59e0b',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => { toggleVisibility(1); }} >
                    <Text className='text-white'>X</Text>
                  </TouchableOpacity>

                </View>
              )}
              {isModala && (
                <View style={styles.wmodal} className="shadow">
                  <View className="flex-1 items-center justify-center">
                    <View className=" bg-white w-60 h-60 rounded-full items-center justify-center">
                      <Image source={require('../../../assets/icons/audio.gif')} className=' w-40 h-40' />
                    </View>
                    <TouchableOpacity className='rounded-[5px] bg-red-600 mt-16 p-5 ' onPress={() => { toggleVisibilityastop(); }} >
                      <Text className=' text-white '> <FontAwesome name="stop-circle" size={18} className='text-white mr-5' /> Parar</Text>

                    </TouchableOpacity>

                  </View>
                </View>
              )}
            </>
          )}
    </View>
  )


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
    top: 20,
    backgroundColor: '#ededed',
    padding: 5,
    borderRadius: 5,
  },
  wmodals: {
    position: 'absolute',
    bottom: 20, // Distância do fundo da tela
    left: 20, // Distância do lado esquerdo da tela
    right: 20, // Distância do lado direito da tela
    top: 20,
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
});