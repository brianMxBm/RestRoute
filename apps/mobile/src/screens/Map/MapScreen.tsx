import Mapbox from '@rnmapbox/maps';
import { View } from 'react-native';

export function MapScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Mapbox.MapView
        scaleBarEnabled={false}
        logoEnabled={false}
        style={{ height: '100%', width: '100%' }}
      />
    </View>
  );
}
