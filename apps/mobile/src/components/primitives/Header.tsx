import { cx } from 'class-variance-authority';
import { SafeAreaView, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type HeaderProps = {
  title?: string;
  leftHeader?: React.ReactNode;
  rightHeader?: React.ReactNode;
  classNameHeaderContainer?: string;
};

export const Header = (props: HeaderProps) => {
  return (
    <SafeAreaView>
      <View
        className={twMerge(
          cx('flex-row items-center justify-between'),
          props.classNameHeaderContainer
        )}
      >
        {props.leftHeader}
        {props.rightHeader}
      </View>
    </SafeAreaView>
  );
};
