import { Mixpanel, MixpanelProperties } from 'mixpanel-react-native';
import Keys from 'react-native-keys';

export class EventTracking {
  public static shared = new EventTracking();
  private mixpanel?: Mixpanel;

  get disabled() {
    return __DEV__;
  }

  constructor() {
    if (this.disabled) {
      return;
    }

    // See: https://github.com/numandev1/react-native-keys#secure-keys
    const token = Keys.secureFor('MIXPANEL_TOKEN');
    if (!token) {
      return;
    }

    this.mixpanel = new Mixpanel(token, true);
    this.mixpanel.init();
  }

  public track(eventName: string, properties?: MixpanelProperties | undefined) {
    this.mixpanel?.track(eventName, properties);
  }

  public forceReport() {
    this.mixpanel?.flush();
  }
}
