import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

interface ContainerProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'card';
  safeArea?: boolean;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ 
  variant = 'primary', 
  safeArea = false,
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

  const Component = safeArea ? StyledSafeAreaView : StyledView;

  return (
    <Component 
      className={`${getVariantStyles()} ${className || ''}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;