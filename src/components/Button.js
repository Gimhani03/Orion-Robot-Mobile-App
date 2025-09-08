import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function Button({ title, onPress, variant = 'primary', className = '' }) {
  const baseClasses = 'w-full rounded-full py-4 items-center justify-center';
  const variantClasses = {
    primary: 'bg-black',
    secondary: 'border border-gray-300 bg-white',
  };
  
  const textClasses = {
    primary: 'text-white font-semibold text-lg',
    secondary: 'text-gray-700 font-semibold text-lg',
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onPress={onPress}
    >
      <Text className={textClasses[variant]}>{title}</Text>
    </TouchableOpacity>
  );
}
