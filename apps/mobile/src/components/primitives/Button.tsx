import { type VariantProps, cva, cx } from 'class-variance-authority';
import type { TouchableOpacityProps } from 'react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const buttonStyles = cva('rounded-full items-center justify-center', {
  //@SEE: These presets/variants are subject to change according to design.
  variants: {
    preset: {
      slate: 'bg-slate-900',
    },
    disabled: {
      true: 'opacity-80',
    },
  },
});

export type ButtonProps = VariantProps<typeof buttonStyles> &
  TouchableOpacityProps & {
    loading?: boolean;
    buttonClassName?: string;
    contentClassName?: string;
    textClassName?: string;
    onPress: TouchableOpacityProps;
    text?: string;
  };

export const Button = ({
  className,
  contentClassName,
  disabled,
  loading,
  preset,
  text,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center"
      onPress={props.onPress}
      disabled={disabled ?? loading}
    >
      <View className={twMerge(cx(buttonStyles({ className, disabled, preset })))}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View className={twMerge(cx(contentClassName))}>
            {text && <Text className={twMerge(cx(props.textClassName))}>{text}</Text>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
