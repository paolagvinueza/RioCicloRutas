import { StyleSheet, TouchableOpacity } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Camera } from 'expo-camera/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function foto() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const permisionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === 'granted');
    if (cameraPermission.status !== 'granted') {
      alert('Permissão para uso da câmera é necessário');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

function geraStringAleatoria(tamanho) {
    let stringAleatoria = '';
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({quality:0.1});
      //const [userid, setuserid] = useState(null);
    let timestamp = new Date().getTime();
    let rand = Math.floor(Math.random() * 10) + 5;  
    let namefile = geraStringAleatoria(rand)+"_"+timestamp+"_img.jpg";
      
      let uriArray = data.uri.split("/");
      let nameToChange = uriArray[uriArray.length - 1];
      let renamedURI = data.uri.replace(
        nameToChange, namefile
      );
      FileSystem.copyAsync({from: data.uri, to: renamedURI});
      console.log(renamedURI);
      FileSystem.deleteAsync(data.uri);
      AsyncStorage.setItem('foto_1', '' + renamedURI + '');
      router.navigate('/(tabs)/(gerarrota)/inicio')
      
    }
  };
  return (
    <View style={styles.container} >
      <Camera style={styles.camera} ref={(ref) => setCamera(ref)} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}> FOTO </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    
    
  },
  button: {
    flex: 0.2,
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: 'rgba(0,0,0,0.1)',
    width: 90,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom:150,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});