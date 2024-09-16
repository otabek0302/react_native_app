import React, { useEffect } from "react";
import { View, Text, FlatList, ListRenderItem, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/context/useAppwrite";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";

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

const Search = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const { data: posts = [], loading, error, refetch } = useAppwrite(searchPosts, query);

  console.log(posts);
  

  useEffect(() => {
    refetch();
  }, [query]);

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <VideoCard
      title={item.title}
      thumbnail={item.thumbnail}
      video={item.video}
      username={item.users?.username}
      avatar={item.users?.avatar}
    />
  );

  const renderHeader = () => (
    <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
      <Text style={{ color: '#e0e0e0', fontSize: 14, fontWeight: '500' }}>Search results</Text>
      <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '500' }}>{query}</Text>
      <View style={{ marginVertical: 16 }}>
        <SearchInput initialQuery={query} />
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <EmptyState
      buttonTitle="Create your first post"
      link="/create"
      title="No Video Found"
      subtitle="No videos found!"
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ffffff' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default Search;