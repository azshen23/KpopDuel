import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'cancel' | 'logout';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  children,
  className,
  textClassName,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#FF6B9D] rounded-3xl shadow-lg';
      case 'secondary':
        return 'bg-[#4ECDC4] rounded-3xl shadow-lg';
      case 'outline':
        return 'bg-transparent border-2 border-gray-600 rounded-3xl';
      case 'cancel':
        return 'bg-gray-600 rounded-2xl';
      case 'logout':
        return 'bg-transparent border border-gray-600 rounded-2xl';
      default:
        return 'bg-[#FF6B9D] rounded-3xl shadow-lg';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'py-2 px-4';
      case 'medium':
        return 'py-3 px-6';
      case 'large':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'text-white font-bold';
      case 'outline':
      case 'cancel':
      case 'logout':
        return 'text-gray-600';
      default:
        return 'text-white font-bold';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <StyledTouchableOpacity 
      className={`${getVariantStyles()} ${getSizeStyles()} items-center ${className || ''}`}
      {...props}
    >
      <StyledText 
        className={`${getTextVariantStyles()} ${getTextSizeStyles()} ${textClassName || ''}`}
      >
        {children}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default Button;