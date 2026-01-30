import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useCurrentUser, useSetUserName } from '@/lib/use-database';

export default function SettingsScreen() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const setUserNameMutation = useSetUserName();

  const [name, setName] = useState('');

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setUserNameMutation.mutateAsync(name.trim());
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <LinearGradient
        colors={['#18181b', '#09090b']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
              className="w-10 h-10 items-center justify-center rounded-full bg-zinc-800/50"
            >
              <ChevronLeft size={24} color="#a1a1aa" />
            </Pressable>

            <Text className="text-lg font-semibold text-white">Settings</Text>

            <Pressable
              onPress={handleSave}
              disabled={setUserNameMutation.isPending}
              className="w-10 h-10 items-center justify-center rounded-full bg-blue-600"
            >
              {setUserNameMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Check size={20} color="white" />
              )}
            </Pressable>
          </Animated.View>

          <View className="px-5 mt-4">
            {/* Name Input */}
            <Animated.View entering={FadeInUp.delay(200).springify()}>
              <View className="flex-row items-center mb-3">
                <User size={18} color="#a1a1aa" />
                <Text className="text-zinc-400 text-sm font-medium ml-2">
                  Your Name
                </Text>
              </View>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#52525b"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white text-base"
                autoFocus
              />
              <Text className="text-zinc-600 text-xs mt-2">
                This name will be shown when you respond to polls
              </Text>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
