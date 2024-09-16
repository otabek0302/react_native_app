import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link, router } from "expo-router";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { images } from "../../constants";
import { createUser } from "@/lib/appwrite";

import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill your email and password !");
    }

    setIsSubmitting(true);

    try {
      
      const result = await createUser(form);

      if (result) {
        router.replace("/home");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong !");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white font-semibold mt-10 font-psemibold">
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: any) => setForm({ ...form, username: e })}
            placeholder="Enter your username"
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            placeholder="Enter your email"
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            placeholder="Enter your password"
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sing Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already ?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
