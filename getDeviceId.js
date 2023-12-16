import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = uuidv4(); // Generera en ny UUID
      await AsyncStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  } catch (error) {
    // Hantera eventuella fel här
    console.error(error);
  }
};
