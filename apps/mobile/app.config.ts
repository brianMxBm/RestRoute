/*@SEE: When we're ready to deploy via EAS and setup several vital properties we can set this up properly.
For now we're just setting up enviornment variables.
Refer here: https://docs.expo.dev/workflow/configuration/
*/
import { type ConfigContext, type ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    extra: {
      eas: {
        projectId: 'addOneHere',
      },
    },
    name: 'RestRoute',
    slug: 'RestRoute',
  };
};
