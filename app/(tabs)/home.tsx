import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";

import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "../../context/useAppwrite";
import { useState } from "react";
import { getAllPosts, getLastestPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";

interface Post {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  users: {
    username: string;
    avatar: string;
    $id: string;
  };
}

const Home: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: posts = [],
    loading: postsLoading,
    refetch: refetchPosts,
  } = useAppwrite(getAllPosts);
  const {
    data: latestPosts = [],
    loading: latestLoading,
    refetch: refetchLatestPosts,
  } = useAppwrite(getLastestPosts);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchPosts();
      await refetchLatestPosts();
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <VideoCard
      title={item.title}
      thumbnail={item.thumbnail}
      video={item.video}
      videoId={item.$id}
      username={item.users.username}
      avatar={item.users.avatar}
      userId={item.users.$id}
    />
  );

  const renderHeader = () => (
    <View className="my-6 px-4 space-y-6">
      <View className="mb-6 flex flex-row justify-between items-start">
        <View>
          <Text className="text-gray-100 text-sm font-pmedium">
            Welcome Back
          </Text>
          <Text className="text-white text-2xl font-pmedium">Otabek0302</Text>
        </View>

        <View className="mt-1.5">
          <Image
            source={images.logoSmall}
            className="w-9 h-10"
            resizeMode="contain"
          />
        </View>
      </View>

      <SearchInput />

      <View className="w-full flex-1 pt-5 pb-8">
        <Text className="mb-3 text-gray-100 text-lg font-pregular">
          Latest Videos
        </Text>
        <Trending posts={latestPosts || []} />
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <EmptyState
      link="/create"
      buttonTitle="Create a new video"
      title="No Video Found"
      subtitle="Be the first one to upload a video"
    />
  );

  if (postsLoading || latestLoading) {
    return (
      <SafeAreaView className="bg-primary h-full flex justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[...posts]}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
