import React from 'react';
import { View, Text, FlatList, ListRenderItem, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/context/useAppwrite';
import EmptyState from '@/components/EmptyState';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getSavedPosts } from '@/lib/appwrite';

// Props interface
interface Item {
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

const Bookmark: React.FC = () => {
  const { user } = useGlobalContext();
  const { data: savedVideoIds = [], loading, error, refetch } = useAppwrite(() => getSavedPosts(user?.$id || ""));

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <VideoCard
      title={item.title}
      thumbnail={item.thumbnail}
      video={item.video}
      username={item.users?.username}
      avatar={item.users?.avatar}
      videoId={item.$id}
      userId={item.users.$id}
    />
  );

  const renderHeader = () => (
    <View className="my-4 px-4">
      <Text className="text-gray-400 text-sm font-medium">Saved Posts</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <EmptyState title="No Video Found" subtitle="No videos found!" link="/home" buttonTitle="Save first video" />
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={savedVideoIds} // Ensure the `savedVideoIds` is a list of video IDs.
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default Bookmark;