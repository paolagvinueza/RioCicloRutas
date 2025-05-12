import { Button, Text, TextInput, Image, View, Keyboard, TouchableWithoutFeedback, ImageBackground, TouchableOpacity, StyleSheet, Platform, } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Link, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useRef, useCallback, useState, useMemo, useEffect, } from "react";
import { useNavigation } from "@react-navigation/core";
import MapView, { Marker, MapTypes, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Audio } from 'expo-av';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import Routes from "../../../services/sqlite/Routes";
import Coord from "../../../services/sqlite/Coord";
import Midia from "../../../services/sqlite/Midia";

import api from "../../../services/api";
import apiup from "../../../services/apiup";

export default function detalhe() {
  const { id } = useLocalSearchParams();

  const [localiza, setLocaliza] = useState([]);
  const [rota, setRota] = useState(false);
  const [coord, setCoord] = useState([]);
  const [midias, setMidias] = useState([]);
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

    console.log('Mudar camera');
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

  const pegarCoordenadas = async () => {
    try {
      const routes = await Routes.find(id);
      const midias = await Midia.all(id);
      const coord = await Coord.coordrota(id);
      setRota(routes);
      setMidias(midias);
      setCoord(coord);
      //console.log(JSON.stringify(midias));

      const newRegion = {
        latitude: parseFloat(routes.lat),
        longitude: parseFloat(routes.log),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

    } catch (erro) {
      console.error(erro);
    }
  }

  useEffect(() => {
    pegarCoordenadas();
  }, []);

  useEffect(() => {
    setIsLoading(false);
    console.log('--->>>>>>>>>',coord);
  }, [coord]);





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
        router.back();
        //Routes.all().then((routes) => { setRotas(routes);  });
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
    Routes.all().then((routes) => { router.back(); });
  };

  const anular = (id) => {
    console.log("anulando...");
    Routes.updatenull(id);
    Routes.all().then((routes) => { router.back(); });
  };

  return (
    <View className="flex-1 items-center p-5">
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
        <Marker icon={require("../../../assets/images/locale.png")} coordinate={region} />
        {midias.map((coordenada, index) => (
          <Marker
            key={index} // Certifique-se de definir uma chave única para cada marcador
            onPress={() => {
              coordenada.type == 1
                ? (toggleVisibility(coordenada.file), console.log('Clicou na imagem: ', coordenada.file)) : (toggleVisibilitya(coordenada.file), setAud(coordenada.file), console.log('Clicou no audio: ', coordenada.file));
            }}
            coordinate={{
              latitude: parseFloat(coordenada.lat),
              longitude: parseFloat(coordenada.long),
            }}
            icon={
              coordenada.type == 1
                ? require("../../../assets/images/foto.png")
                : require("../../../assets/images/audio.png")
            }
          />
        ))}
        <Polyline coordinates={coord} strokeWidth={5} />



      </MapView>
      {rota.up === 0 ? (
        <View className="h-[60] w-[40vh] pt-3 pr-3 mb-[140px] rounded-[10px] bg-white shadow">
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>


            <TouchableOpacity onPress={() => apagarrota(rota.id)}>
              <View className="bg-red-500 p-2 rounded-[5px] mb-4 mr-4">
                <Text className="text-white text-center font-bold font-[Raleway]">
                  <MaterialCommunityIcons name="delete-forever-outline" size={14} /> EXCLUIR</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => transmitiunico(rota.id)}>
              <View className="bg-blue-500 p-2 rounded-[5px] mb-4">
                <Text className="text-white text-center font-bold font-[Raleway]">
                  <FontAwesome5 name="upload" size={11} /> UPLOAD
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      ) : (
        <></>
        //   <TouchableOpacity onPress={() => anular(rota.id)}>
        //   <View className="bg-green-500 p-2 rounded-[5px] mb-4 mr-4">
        //     <Text className="text-white text-center font-bold font-[Raleway]">
        //       <MaterialCommunityIcons name="delete-forever-outline" size={14} /> Anular</Text>
        //   </View>
        // </TouchableOpacity>
      )}

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