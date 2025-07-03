import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface ContainerProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'card';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ 
  variant = 'primary', 
  children, 
  className,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'flex-1 bg-[#1a1a2e] p-5';
      case 'secondary':
        return 'flex-1 bg-[#1a1a2e] p-5 justify-center';
      case 'card':
        return 'bg-[#16213e] rounded-2xl p-5';
      default:
        return 'flex-1 bg-[#1a1a2e] p-5';
    }
  };

  return (
    <StyledView 
      className={`${getVariantStyles()} ${className || ''}`}
      {...props}
    >
      {children}
    </StyledView>
  );
};

export default Container;