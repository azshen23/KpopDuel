import React from 'react';
import { Text, TextProps } from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);

interface TypographyProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'heading' | 'body' | 'caption' | 'button' | 'score' | 'timer';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray' | 'success' | 'error';
  weight?: 'normal' | 'bold';
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body',
  color = 'white',
  weight = 'normal',
  align = 'left',
  children,
  className,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return 'text-5xl';
      case 'subtitle':
        return 'text-lg';
      case 'heading':
        return 'text-2xl';
      case 'body':
        return 'text-base';
      case 'caption':
        return 'text-sm';
      case 'button':
        return 'text-lg';
      case 'score':
        return 'text-4xl';
      case 'timer':
        return 'text-2xl';
      default:
        return 'text-base';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'text-[#FF6B9D]';
      case 'secondary':
        return 'text-[#4ECDC4]';
      case 'accent':
        return 'text-[#FFE66D]';
      case 'white':
        return 'text-white';
      case 'gray':
        return 'text-gray-400';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const getWeightStyles = () => {
    return weight === 'bold' ? 'font-bold' : 'font-normal';
  };

  const getAlignStyles = () => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <StyledText 
      className={`${getVariantStyles()} ${getColorStyles()} ${getWeightStyles()} ${getAlignStyles()} ${className || ''}`}
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default Typography;