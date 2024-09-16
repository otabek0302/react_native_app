import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ListRenderItem,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import useAppwrite from "@/context/useAppwrite";
import { router } from "expo-router";
import { getUserPosts, signOut } from "@/lib/appwrite";

interface Item {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  users: {
    username: string;
    avatar: string;
  };
}

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts = [], error } = useAppwrite(() =>
    getUserPosts(user?.$id || "")
  );

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderHeader = () => (
    <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
      <TouchableOpacity
        onPress={logout}
        className="flex w-full items-end mb-10"
        accessibilityLabel="Logout"
      >
        <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>

      <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
        <Image
          source={{ uri: user?.avatar }}
          className="w-[90%] h-[90%] rounded-lg"
          resizeMode="cover"
        />
      </View>

      <InfoBox
        title={user?.username || "Unknown User"}
        containerStyles="mt-5"
        titleStyles="text-lg"
      />

      <View className="mt-5 flex flex-row">
        <InfoBox
          title={posts?.length || []}
          subtitle="Posts"
          titleStyles="text-xl"
          containerStyles="mr-10"
        />
        <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
      </View>
    </View>
  );

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <VideoCard
      title={item.title}
      thumbnail={item.thumbnail}
      video={item.video}
      username={item.users.username}
      avatar={item.users.avatar}
    />
  );

  if (error) {
    return (
      <SafeAreaView className="bg-primary flex items-center justify-center">
        <Text style={{ color: "#ffffff" }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <EmptyState
            buttonTitle="Create your first post"
            link="/create"
            title="No Posts Found"
            subtitle="There are no posts to display."
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
