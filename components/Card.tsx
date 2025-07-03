import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface CardProps extends ViewProps {
  variant?: 'default' | 'score' | 'rules' | 'result' | 'summary';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'default',
  children,
  className,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return 'bg-[#16213e] rounded-2xl p-5';
      case 'score':
        return 'bg-[#16213e] rounded-3xl p-5 items-center flex-1 mx-1';
      case 'rules':
        return 'bg-[#16213e] rounded-2xl p-5';
      case 'result':
        return 'bg-[#16213e] rounded-2xl p-5 mt-5';
      case 'summary':
        return 'bg-[#16213e] rounded-3xl p-5 mb-10';
      default:
        return 'bg-[#16213e] rounded-2xl p-5';
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

export default Card;