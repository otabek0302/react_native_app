import { View, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

type SearchInputProps = {
  initialQuery?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery = '' }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      Alert.alert("Missing query", "Please input something to search.");
      return;
    }
    
    if (pathname.startsWith("/search")) {
      router.setParams({ query: trimmedQuery });
    } else {
      router.push(`/search/${trimmedQuery}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="Search for a video topic..."
        placeholderTextColor="#7B7B8B"
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

// Define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderColor: '#2D2D2D',
    borderWidth: 2,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default SearchInput;