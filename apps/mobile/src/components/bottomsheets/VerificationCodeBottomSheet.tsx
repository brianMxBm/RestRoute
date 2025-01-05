import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

import { BottomSheet, type CustomBottomSheetProps } from './BottomSheet';
import { colors } from '../../../utils/style/colors';

/*
@SEE: I think that adding a Zod resolver with the pin being refined with a callback function to verify
if it's the right code isn't really necessary.
*/

export type VerificationCodeBottomSheetProps = CustomBottomSheetProps & {
  className?: string;
  resendPin?: () => void;

  //@SEE: Callback function to maintain logic in parent?
};

//@SEE: Add timeouts to ensure verification isn't spammed
export const VerificationCodeBottomSheet = (props: VerificationCodeBottomSheetProps) => {
  const onVerifiedCode = (pin: string) => {};

  return (
    <BottomSheet {...props} pressBehavior={'none'} snapPoints={props.snapPoints}>
      <View className="items-center justify-center ">
        <Text>Enter Pin</Text>

        <OtpInput
          numberOfDigits={6}
          onFilled={(pin) => onVerifiedCode(pin)}
          type="numeric"
          theme={{
            containerStyle: {
              width: SCREEN_WIDTH * 0.85, //@TODO: Change this to use RN screen variable
            },
            pinCodeContainerStyle: {
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
            },
            focusedPinCodeContainerStyle: {
              borderColor: colors.yellow[500],
            },
            filledPinCodeContainerStyle: {
              borderColor: colors.dark[950],
            },
          }}
        />
      </View>
    </BottomSheet>
  );
};
