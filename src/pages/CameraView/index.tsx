import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Camera,
  CameraProps,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {scanFaces, Face} from 'vision-camera-face-detector';

const ReanimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

const CameraView: React.FC = () => {
  const devices = useCameraDevices('dual-camera');
  const device = devices.back;
  const isFocused = useIsFocused();
  const zoom = useSharedValue(0);
  const [faces, setFaces] = React.useState<Face[]>([]);
  const camera = useRef<Camera>(null);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  React.useEffect(() => {
    console.log(faces);
    if (faces.length > 0) {
      setIsActive(false);
      takeSnapshot();
    }
  }, [faces]);

  const onRandomZoomPress = useCallback(() => {
    zoom.value = withSpring(Math.random());
  }, [zoom]);

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(
    () => ({zoom: zoom.value}),
    [zoom],
  );

  const takeSnapshot = async () => {
    const snapshot = await camera.current?.takePhoto({
      qualityPrioritization: 'speed',
    });
    // console.log(
    //   '🚀 ~ file: index.tsx ~ line 58 ~ takeSnapshot ~ snapshot',
    //   snapshot,
    // );
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  if (device == null) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <ReanimatedCamera
        ref={camera}
        isActive={isActive}
        photo={true}
        device={device}
        style={StyleSheet.absoluteFill}
        animatedProps={animatedProps}
        frameProcessor={frameProcessor}
        frameProcessorFps={0.5}
      />
      {faces.length > 0 && (
        <View style={styles.recordingButton}>
          <Text>Face detected</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  recordingButton: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButtonActive: {
    backgroundColor: 'red',
  },
});

export default CameraView;
