import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "@/constants";

interface FormFieldProps {
  title?: string;
  value?: string;
  handleChangeText?: any;
  placeholder?: string;
  otherStyles?: string;
  keyboardType?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  keyboardType,
}) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 flex-row items-center bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary">
        <TextInput
          className="flex-1 text-white text-base font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        
        {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>   
                <Image source={!showPassword ? icons.eye : icons.eyeHide } className="w-6 h-6" resizeMode="contain" />
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
