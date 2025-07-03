import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface LayoutProps extends ViewProps {
  variant?: 'header' | 'content' | 'footer' | 'row' | 'center' | 'loading';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  variant = 'content',
  spacing = 'medium',
  children,
  className,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return 'items-center mt-5';
      case 'content':
        return 'flex-1 justify-center';
      case 'footer':
        return 'items-center mb-5';
      case 'row':
        return 'flex-row justify-between items-center';
      case 'center':
        return 'items-center justify-center';
      case 'loading':
        return 'flex-1 justify-center items-center';
      default:
        return 'flex-1';
    }
  };

  const getSpacingStyles = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'small':
        return 'mb-2';
      case 'medium':
        return 'mb-5';
      case 'large':
        return 'mb-10';
      default:
        return 'mb-5';
    }
  };

  return (
    <StyledView 
      className={`${getVariantStyles()} ${getSpacingStyles()} ${className || ''}`}
      {...props}
    >
      {children}
    </StyledView>
  );
};

export default Layout;