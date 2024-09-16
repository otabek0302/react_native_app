import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";

interface Post {
  video: string;
  id: string;
  $id: string;
  thumbnail: string;
}

interface TrendingProps {
  posts: any;
}

interface TrendingItemProps {
  activeItem: string;
  item: Post;
  setActiveItem: (id: string) => void;
}

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<string>(posts[0]?.$id || "");
  
  const visibleItemsChanged = (info: any) => {
    const { viewableItems } = info;
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  const zoomIn: Animatable.CustomAnimation = {
    from: {
      scaleX: 0.9,
    },
    to: {
      scaleX: 1,
    },
  };

  const zoomOut: Animatable.CustomAnimation = {
    from: {
      scaleX: 1,
    },
    to: {
      scaleX: 0.9,
    },
  };

  const TrendingItem: React.FC<TrendingItemProps> = ({
    activeItem,
    item,
    setActiveItem,
  }) => {
    const [play, setPlay] = useState<boolean>(false);
    const video = useRef(null);
    const [status, setStatus] = useState({});
    return (
      <Animatable.View
        className="mr-5"
        animation={activeItem === item.$id ? zoomIn : zoomOut}
        duration={500}
      >
        {play ? (
          <Video
            ref={video}
            source={{ uri: item.video }}
            className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setPlay(true);
              setActiveItem(item.$id);
            }}
            className="relative flex justify-center items-center"
          >
            <ImageBackground
              source={{ uri: item.thumbnail }}
              className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
              resizeMode="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
          setActiveItem={setActiveItem}
        />
      )}
      onViewableItemsChanged={visibleItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;
