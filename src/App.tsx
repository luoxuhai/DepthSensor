import './locales';

import React, { useEffect, useState, PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  NativeModules,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import { t } from './locales';
import { EventTracking } from './common/EventTracking';
import { Device } from './common/Device';
import { Application } from './common/Application';

const DepthCameraInfo = NativeModules.RNDepthCameraInfo;

interface DepthCameraMetadata {
  width: number;
  height: number;
  formats: ('DEPTH16' | 'DEPTH_POINT_CLOUD' | 'DEPTH_JPEG')[];
  position: 'back' | 'front';
  horizontalFoV: number;
  verticalFoV: number;
}

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section(props: SectionProps): JSX.Element {
  return (
    <View style={$section}>
      <Text style={$sectionTitle}>{props.title}</Text>
      <View style={$sectionBody}>{props.children}</View>
    </View>
  );
}

type CellProps = PropsWithChildren<{
  title: string;
  content: string;
}>;

function Cell({ title, content }: CellProps): JSX.Element {
  return (
    <View style={$cell}>
      <Text style={$cellTitle}>{`${title} :`}</Text>
      <Text style={$cellContent} selectable>
        {content}
      </Text>
    </View>
  );
}

function App() {
  const [infos, setInfos] = useState<DepthCameraMetadata[]>();

  useEffect(() => {
    DepthCameraInfo.getInfo().then((result: DepthCameraMetadata[]) => {
      setInfos(result);
      EventTracking.shared.track('depth_sensor_info', {
        is_supported: result.length > 0,
        sensor_info: result,
      });
      EventTracking.shared.forceReport();

      if (result.length > 0) {
        AccessibilityInfo.announceForAccessibility(t('app.support'));
      } else {
        AccessibilityInfo.announceForAccessibility(t('app.notSupport'));
      }
    });
  }, []);

  if (!infos) {
    return <ActivityIndicator style={$activityIndicator} size="large" />;
  }

  return (
    <SafeAreaView style={$container}>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'transparent'} />
      <Text style={$appName}>{t('common.appName')}</Text>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={$device}>
          <Cell
            title={t('app.device')}
            content={`${Device.brand.toUpperCase()} ${Device.modelName}`}
          />
        </View>

        {infos.length === 0 ? (
          <Text style={$notSupport}>{t('app.notSupport')}</Text>
        ) : (
          infos.map((info, index) => (
            <Section
              key={info.position}
              title={`${t('app.number')} ${infos.length > 1 ? index + 1 : ''}`}
            >
              <Cell title={t('app.position.title')} content={t(`app.position.${info?.position}`)} />
              <Cell title={t('app.resolution')} content={`${info.width} x ${info.height}`} />
              <Cell title={t('app.fov.horizontal')} content={`${info.horizontalFoV.toFixed(2)}°`} />
              <Cell title={t('app.fov.vertical')} content={`${info.verticalFoV.toFixed(2)}°`} />
              <Cell title={t('app.format')} content={`${info.formats.join(' ')}`} />
            </Section>
          ))
        )}

        <Text style={$version}>v{Application.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const $container: ViewStyle = {
  flex: 1,
  padding: 26,
  backgroundColor: '#f5f5f5',
};

const $section: ViewStyle = {
  borderRadius: 10,
  marginBottom: 26,
};

const $sectionBody: ViewStyle = {
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 10,
  rowGap: 8,
};

const $sectionTitle: TextStyle = {
  fontSize: 16,
  marginBottom: 10,
};

const $appName: TextStyle = {
  fontSize: 26,
  fontWeight: '700',
  marginTop: 26,
  marginBottom: 36,
};

const $cell: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: 8,
};

const $activityIndicator: ViewStyle = {
  marginTop: '50%',
};

const $cellTitle: TextStyle = {
  fontSize: 18,
  fontWeight: '600',
};

const $cellContent: TextStyle = {
  fontSize: 18,
};

const $notSupport: TextStyle = {
  fontSize: 24,
  fontWeight: '600',
  color: 'red',
  textAlign: 'center',
  marginVertical: 50,
};

const $version: TextStyle = {
  fontSize: 16,
  textAlign: 'center',
};

const $device: ViewStyle = {
  marginBottom: 26,
  flexDirection: 'row',
  alignItems: 'center',
};

export default App;
