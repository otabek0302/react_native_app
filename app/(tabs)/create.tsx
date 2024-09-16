import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import * as DocumentPicker from "expo-document-picker";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { createVideoPost } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

// Use the type directly from expo-document-picker
type DocumentPickerAsset = DocumentPicker.DocumentPickerAsset;

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null as DocumentPickerAsset | null,
    thumbnail: null as DocumentPickerAsset | null,
    prompt: "",
  });

  const openPicker = async (selectType: "image" | "video") => {
    console.log(selectType);

    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/PNG", "image/JPEG", "image/JPG"]
          : ["video/MP4", "video/GIF"],
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0] as DocumentPickerAsset, // Type assertion
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0] as DocumentPickerAsset, // Type assertion
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (!form.title || !form.thumbnail || !form.video || !form.prompt) {
      return Alert.alert(
        "Missing Fields",
        "Please provide all required fields."
      );
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Failed to create video post");
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-3">
        <Text className="text-2xl text-white font-psemibold">Video Title</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title."
          handleChangeText={(e: string) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 flex items-center justify-center bg-black-100 rounded-2xl">
                <View className="w-14 h-14 flex items-center justify-center border border-dashed border-secondary-100">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Thumbnail image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 flex items-center justify-center bg-black-100 border-2 rounded-2xl">
                <Image
                  source={icons.upload}
                  className="w-1/2 h-1/2"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e: string) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;