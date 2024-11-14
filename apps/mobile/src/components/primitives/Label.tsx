import { cva, VariantProps } from 'class-variance-authority';
import { TextProps, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

//TODO: A design system is needed.
const labelStyles = cva('text-black', {
  variants: {
    font: {
      VoyeMedium: 'font-voye-medium',
      SanFrancisco: 'font-sf-regular',
    },
    size: {
      '9xl': 'text-9xl',
      '8xl': 'text-8xl',
      '7xl': 'text-7xl',
      '6xl': 'text-6xl',
      '5xl': 'text-5xl',
      '4xl': 'text-4xl',
      '3xl': 'text-3xl',
      '2xl': 'text-2xl',
      xl: 'text-xl',
      lg: 'text-lg',
      base: 'text-gray',
      sm: 'text-sm',
      xs: 'text-xs',
    },
    error: {
      true: 'text-red-600',
      false: '',
    },
  },
});

export type LabelProps = VariantProps<typeof labelStyles> & TextProps & object;

export const Label = ({ className, size, error, font, ...props }: LabelProps) => {
  return <Text {...props} className={twMerge(labelStyles({ className, error, size, font }))} />;
};
