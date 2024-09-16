import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants";
import CustomButton from "./CustomButton";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { checkForUpdates, getSavedPosts, saveVideo } from "@/lib/appwrite";

// Props interface
interface Item {
  title: string;
  thumbnail: string;
  video: string;
  username: string;
  userId?: any;
  avatar: string;
  videoId?: any;
}

const VideoCard: React.FC<Item> = ({
  title,
  thumbnail,
  video,
  username,
  avatar,
  videoId,
  userId,
}) => {
  const [play, setPlay] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const savedVideos = await getSavedPosts(userId);
        setIsSaved(savedVideos.includes(videoId));
      } catch (error) {
        console.error("Error checking if video is saved:", error);
      }
    };

    checkIfSaved();
  }, [userId, videoId]);

  const handleSave = async () => {
    try {
      await saveVideo(userId, videoId);
      await checkForUpdates(userId);
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const savedVideos = await getSavedPosts(userId);
        setIsSaved(savedVideos.includes(videoId));
      } catch (error) {
        console.error("Error checking if video is saved:", error);
      }
    };

    checkIfSaved();
  }, [userId, videoId]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-52 h-72 rounded-xl mt-3"
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      <View className="w-full flex items-end justify-center px-7">
        <View className="pt-2">
          <CustomButton
            title={
              <Image
                source={isSaved ? icons.saved : icons.save}
                className="w-7 h-7"
                resizeMode="contain"
              />
            }
            containerStyles="bg-transparent cursor-pointer"
            handlePress={handleSave}
          />
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
