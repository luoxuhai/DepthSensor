import DeviceInfo from 'react-native-device-info';

export const Device = {
  modelName: DeviceInfo.getModel(),
  brand: DeviceInfo.getBrand(),
};
