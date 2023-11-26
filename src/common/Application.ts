import DeviceInfo from 'react-native-device-info';

export const Application = {
  version: DeviceInfo.getVersion(),
  buildNumber: DeviceInfo.getBuildNumber(),
};
