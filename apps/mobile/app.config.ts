/*@SEE: When we're ready to deploy via EAS and setup several vital properties we can set this up properly.
For now we're just setting up enviornment variables.
Refer here: https://docs.expo.dev/workflow/configuration/
*/
import { type ConfigContext, type ExpoConfig } from '@expo/config';
import Mapbox from '@rnmapbox/maps';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

Mapbox.setAccessToken(process.env.MAPBOX_API_KEY || ''); //TODO: This is for testing. Secrets are NEVER to be stored in app bundle (.env). Binaries are easily accessible. (trust me it takes like 10 mins lol)

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_ENV = process.env.APP_ENV || '';

  if (APP_ENV === 'local') {
    config.name = config.name! + ' Local';
    config.scheme = config.scheme! + 'Local';
    config.ios!.bundleIdentifier = config.ios!.bundleIdentifier + '.Local';
  }

  if (APP_ENV === 'development') {
    config.name = config.name! + ' Dev';
    config.scheme = config.scheme! + 'Dev';
    config.ios!.bundleIdentifier = config.ios!.bundleIdentifier + '.Dev';
  }

  return {
    ...config,
    extra: {
      eas: {
        projectId: '9851ddf0-46cc-424d-8215-1c0a6231f507',
      },
    },
    plugins: [...config.plugins!],
    name: config.name!,
    slug: config.slug!,
    owner: 'mxp0',
  };
};
