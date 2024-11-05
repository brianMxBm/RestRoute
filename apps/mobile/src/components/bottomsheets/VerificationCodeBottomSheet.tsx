import { zodResolver } from '@hookform/resolvers/zod';
import { FlashList } from '@shopify/flash-list';
import { cx } from 'class-variance-authority';
import { useForm, Controller } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

import { BottomSheet, type CustomBottomSheetProps } from './BottomSheet';
import { colors } from '../../../utils/style/colors';
import { Input } from '../primitives/Input';

export type ExerciseSearchBottomSheetProps = CustomBottomSheetProps & {
  className?: string;

  //@SEE: Callback function to maintain logic in parent?
};

//@SEE: Add timeouts to ensure verification isn't spammed
export const VerificationCodeBottomSheet = (props: ExerciseSearchBottomSheetProps) => {
  const formSchema = z.object({
    pin: z.string().refine((value) => {
      console.warn(value);
      //@TODO: Async call to verification from clerk
      return true;
    }),
  });

  const onVerifiedCode = (data: Form) => {
    console.warn('code');
  };

  type Form = z.infer<typeof formSchema>;

  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: '',
    },
  });

  return (
    <BottomSheet {...props} pressBehavior={'none'} snapPoints={props.snapPoints}>
      <View className="items-center justify-center">
        <Controller
          control={form.control}
          name="pin"
          render={({ field, formState }) => (
            <Input
              autoCapitalize={'none'}
              value={field.value}
              className="w-96 self-center"
              classNameInputContainer="mt-5 rounded-full border-gray-400 bg-gray-50 px-4 py-5 border-1"
              hasError={!!formState.errors.pin}
              errorMessage={formState.errors.pin?.message}
              onChangeText={field.onChange}
              placeholderTextColor={colors.gray[600]}
            />
          )}
        />
      </View>
    </BottomSheet>
  );
};
