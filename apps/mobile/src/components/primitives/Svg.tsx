import type { FC, SVGProps } from 'react';

const iconsConfiguration = {
  map: require('../../../assets/svg/onboarding/map.svg'),
  stars: require('../../../assets/svg/onboarding/stars.svg'),
  feedback: require('../../../assets/svg/onboarding/feedback.svg'),
  restroom: require('../../../assets/svg/onboarding/restroom.svg'),
  googleLogo: require('../../../assets/svg/Icons/google-logo.svg'),
};

export type IconName = keyof typeof iconsConfiguration;
interface IconResource {
  default?: FC<SVGProps<SVGElement>>;
}

interface IconProps {
  name: IconName;
  fill?: string;
  height?: number;
  width?: number;
  size?: number;
}

export const Svg: FC<IconProps> = ({ name, fill, ...props }) => {
  const iconType: IconResource | undefined = iconsConfiguration[name];
  const SvgIcon = iconType?.default;

  if (!SvgIcon) {
    console.error(`Icon resource import error for icon: ${name}`);
    return null;
  }

  return (
    <SvgIcon
      {...props}
      fill={fill}
      height={props.size ?? props.height}
      width={props.size ?? props.width}
    />
  );
};
