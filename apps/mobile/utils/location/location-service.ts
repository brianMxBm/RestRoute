import * as Location from 'expo-location';

export const handleLocationPermissions = async () => {
  //@SEE: As of right now I do not see a need to request background permissions. This might change when building upon notifications to let users know restrooms are nearby
  const locationPermissions = await Location.requestForegroundPermissionsAsync();

  if (locationPermissions.granted) {
    return;
  }
  if (!locationPermissions.granted) {
    await Location.requestBackgroundPermissionsAsync();
  }

  if (!locationPermissions.granted && !locationPermissions.canAskAgain) {
    alert('To utilize location, grant RestRoute access in settings ');
  }
};

export const getCurrentLocation = async () => {
  try {
    await handleLocationPermissions();
    const location = await Location.getCurrentPositionAsync();
    return location;
  } catch (error) {
    console.error('Error obtaining current location');
    console.error(error);
    return null; //@TODO: Handle better
  }
};
