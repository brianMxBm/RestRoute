import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import { useEffect, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { getCurrentLocation } from '../../../utils/location/location-service';
import { RestroomBottomSheet } from '../../components/bottomsheets/RestroomBottomSheet';

const accessToken =
  'pk.eyJ1IjoibXhwbyIsImEiOiJjbHppd3FxZXowa2JyMmpvYjNhcXQ1dnV2In0.eEgUIzroPPIsj8YwVzpdPA';

Mapbox.setAccessToken(accessToken);

export function MapScreen() {
  const restroomBottomSheetRef = useRef<BottomSheetModal>(null);
  const mapCameraRef = useRef<CameraRef>(null);

  // useEffect(() => {
  //  const coords =  getCurrentLocation()
  // }, []);

  const onCenterMap = async () => {
    const location = await getCurrentLocation();

    console.warn(location);

    if (!location) {
      console.warn('fuck');
      return;
    }

    mapCameraRef.current?.setCamera({
      centerCoordinate: [location?.coords.latitude, location?.coords.longitude],
    });
  };

  return (
    <View className="flex-1 items-center justify-center">
      <MapView
        // styleURL="mapbox://styles/mxpo/cm2mf1ocz000w01od2czzdvfu"
        scaleBarEnabled={false}
        zoomEnabled={true}
        logoEnabled={false}
        style={{ height: '100%', width: '100%' }}
      >
        <Camera ref={mapCameraRef} followZoomLevel={15} followUserLocation />
        <LocationPuck
          puckBearing="course"
          pulsing={{
            isEnabled: true,
          }}
        />
        <TouchableOpacity onPress={() => onCenterMap()} className="absolute top-72 left-5">
          <View className="h-10 w-10 rounded-full bg-black"></View>
        </TouchableOpacity>
      </MapView>

      <RestroomBottomSheet
        snapPoints={['20%', '40%']}
        enablePanDownToClose={true}
        index={1}
        bottomSheetRef={restroomBottomSheetRef}
      />
    </View>
  );
}
