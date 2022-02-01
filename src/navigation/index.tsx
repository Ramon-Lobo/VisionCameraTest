import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CameraView from '../pages/CameraView';
import HomeScreen from '../pages/Home';

const Stack = createNativeStackNavigator();

export const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraView} />
    </Stack.Navigator>
  );
};
