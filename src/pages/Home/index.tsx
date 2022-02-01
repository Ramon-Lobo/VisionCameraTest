/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [permissions, setPermissions] = useState({
    mic: false,
    camera: false,
  });

  const isAllowed = (status: CameraPermissionStatus) => {
    switch (status) {
      case 'authorized':
        return true;
      default:
        return false;
    }
  };

  const CameraPermissions = async () => {
    const camera = await Camera.getCameraPermissionStatus();
    const mic = await Camera.getMicrophonePermissionStatus();

    setPermissions({
      camera: isAllowed(camera),
      mic: isAllowed(mic),
    });
  };

  useEffect(() => {
    CameraPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text>Permissions</Text>
      <Button
        title="Camera Permission"
        onPress={Camera.requestCameraPermission}
        disabled={permissions.camera}
      />
      <Button
        title="Microphone Permission"
        onPress={Camera.requestMicrophonePermission}
        disabled={permissions.mic}
      />
      <Button
        onPress={() => navigation.navigate('Camera')}
        disabled={!permissions.camera || !permissions.mic}
        title="Camera"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
});

export default HomeScreen;
