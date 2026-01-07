import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestBluetoothPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    if (Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        granted['android.permission.BLUETOOTH_SCAN'] === 'granted' &&
        granted['android.permission.BLUETOOTH_CONNECT'] === 'granted'
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH
      );
      return granted === 'granted';
    }
  } catch (err) {
    Alert.alert('Permission Error', 'Bluetooth permission failed');
    return false;
  }
};
