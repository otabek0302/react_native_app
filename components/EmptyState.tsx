import { images } from "@/constants";
import { View, Text, Image } from "react-native";

import React from "react";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

interface emptyStateProps {
  title: string;
  subtitle: string;
  link: any;
  buttonTitle: string;
}

const EmptyState: React.FC<emptyStateProps> = ({title, subtitle, link, buttonTitle}) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
        <Text className="text-gray-100 text-sm font-pmedium">{title}</Text>
        <Text className="text-white text-xl font-pmedium">{subtitle}</Text>
        <CustomButton 
            title={buttonTitle}
            handlePress={() => router.push(link)}
            containerStyles="w-full my-5"
        />
    </View>
  );
};

export default EmptyState;
