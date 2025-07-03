import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput);

interface InputProps extends TextInputProps {
  variant?: 'default' | 'rounded';
  size?: 'small' | 'medium' | 'large';
}

export const Input: React.FC<InputProps> = ({ 
  variant = 'default',
  size = 'medium',
  className,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rounded':
        return 'bg-white rounded-3xl text-center';
      case 'default':
      default:
        return 'bg-white rounded-lg';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm';
      case 'medium':
        return 'px-4 py-3 text-base';
      case 'large':
        return 'px-5 py-4 text-base';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  return (
    <StyledTextInput 
      className={`${getVariantStyles()} ${getSizeStyles()} ${className || ''}`}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

export default Input;