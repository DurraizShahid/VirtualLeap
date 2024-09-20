import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { launchImageLibrary, launchCamera, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import axios from 'axios';

type RootStackParamList = {
  AddProperty: { userId: string };
};

const AddProperty = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [zipcode, setZipcode] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddProperty'>>();

  const userId = route.params.userId;

  const handleChooseImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setImage(selectedImage || null);
      }
    });
  };

  const handleCaptureImage = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const capturedImage = response.assets[0].uri;
        setImage(capturedImage || null);
      }
    });
  };

  const handleLocationSelection = (longitude: number, latitude: number) => {
    setLongitude(longitude.toString());
    setLatitude(latitude.toString());
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Price', price);
      formData.append('City', city);
      formData.append('Type', type);
      formData.append('Description', description);
     

      if (image) {
        const imageData = {
          uri: image,
          type: 'image/jpeg',
          name: 'property.jpg',
        };
        formData.append('Image', imageData as any);
      }
      formData.append('Zipcode', zipcode);
      formData.append('Longitude', longitude);
      formData.append('Latitude', latitude);
      formData.append('User_Id', userId);

      const response = await axios.post('https://nodejs-production-1328.up.railway.app/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Property added successfully:', response.data);
      Alert.alert('Success', 'Property added successfully!');
      (navigation as any).navigate('Mapp');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
        } else if (error.request) {
          console.error('Request Error:', error.request);
        } else {
          console.error('Axios Error:', error.message);
        }
      } else {
        console.error('Error:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} />
        <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
        <TextInput placeholder="Type" value={type} onChangeText={setType} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
        <TextInput placeholder="Zipcode" value={zipcode} onChangeText={setZipcode} style={styles.input} />
        <TextInput placeholder="Longitude" value={longitude} onChangeText={setLongitude} style={styles.input} editable={false} />
        <TextInput placeholder="Latitude" value={latitude} onChangeText={setLatitude} style={styles.input} editable={false} />
        <Button title="Choose Image from Gallery" onPress={handleChooseImage} />
        <Button title="Capture Image from Camera" onPress={handleCaptureImage} />
        <Button title="Select Location on Map" onPress={() => (navigation as any).navigate('Mapp', { onSelectLocation: handleLocationSelection })} />
        <Button title="Add Property" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AddProperty;
