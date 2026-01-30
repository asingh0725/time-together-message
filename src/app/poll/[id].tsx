import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Share,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Clock,
  Check,
  X,
  HelpCircle,
  Users,
  Trophy,
  Trash2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { cn } from '@/lib/cn';
import {
  usePoll,
  useCurrentUser,
  useAddResponse,
  useFinalizePoll,
  useDeletePoll,
  formatSlotTime,
  formatSlotDate,
  getSlotStats,
  rankSlots,
  type Availability,
  type TimeSlot,
  type Response,
} from '@/lib/use-database';

interface TimeSlotCardProps {
  slot: TimeSlot;
  responses: Response[];
  userResponse: Availability | null;
  onRespond: (availability: Availability) => void;
  isFinalized: boolean;
  isBestOption: boolean;
  isSelected: boolean;
  index: number;
}

function TimeSlotCard({
  slot,
  responses,
  userResponse,
  onRespond,
  isFinalized,
  isBestOption,
  isSelected,
  index,
}: TimeSlotCardProps) {
  const stats = getSlotStats(responses, slot.id);

  const handleRespond = (availability: Availability) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRespond(availability);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(100 + index * 50).springify()}
      className={cn(
        'bg-zinc-900 border rounded-2xl p-4 mb-3',
        isSelected
          ? 'border-emerald-500 bg-emerald-950/30'
          : isBestOption && !isFinalized
          ? 'border-blue-500/50'
          : 'border-zinc-800'
      )}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-white font-semibold text-base">
            {formatSlotDate(slot)}
          </Text>
          <Text className="text-zinc-400 text-sm mt-0.5">
            {formatSlotTime(slot)}
          </Text>
        </View>

        {isSelected && (
          <View className="bg-emerald-600 px-3 py-1 rounded-full flex-row items-center gap-1">
            <Check size={14} color="white" />
            <Text className="text-white text-xs font-semibold">Selected</Text>
          </View>
        )}

        {isBestOption && !isFinalized && !isSelected && (
          <View className="bg-blue-600/20 px-3 py-1 rounded-full flex-row items-center gap-1">
            <Trophy size={14} color="#60a5fa" />
            <Text className="text-blue-400 text-xs font-medium">Best</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      {stats.total > 0 && (
        <View className="flex-row items-center gap-4 mb-3">
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-zinc-400 text-xs">{stats.yes} yes</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-amber-500" />
            <Text className="text-zinc-400 text-xs">{stats.maybe} maybe</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-rose-500" />
            <Text className="text-zinc-400 text-xs">{stats.no} no</Text>
          </View>
        </View>
      )}

      {/* Response Buttons */}
      {!isFinalized && (
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => handleRespond('yes')}
            className={cn(
              'flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 border',
              userResponse === 'yes'
                ? 'bg-emerald-600 border-emerald-500'
                : 'bg-zinc-800/50 border-zinc-700'
            )}
          >
            <Check size={18} color={userResponse === 'yes' ? 'white' : '#a1a1aa'} />
            <Text
              className={cn(
                'font-medium',
                userResponse === 'yes' ? 'text-white' : 'text-zinc-400'
              )}
            >
              Yes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleRespond('maybe')}
            className={cn(
              'flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 border',
              userResponse === 'maybe'
                ? 'bg-amber-600 border-amber-500'
                : 'bg-zinc-800/50 border-zinc-700'
            )}
          >
            <HelpCircle size={18} color={userResponse === 'maybe' ? 'white' : '#a1a1aa'} />
            <Text
              className={cn(
                'font-medium',
                userResponse === 'maybe' ? 'text-white' : 'text-zinc-400'
              )}
            >
              Maybe
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleRespond('no')}
            className={cn(
              'flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 border',
              userResponse === 'no'
                ? 'bg-rose-600 border-rose-500'
                : 'bg-zinc-800/50 border-zinc-700'
            )}
          >
            <X size={18} color={userResponse === 'no' ? 'white' : '#a1a1aa'} />
            <Text
              className={cn(
                'font-medium',
                userResponse === 'no' ? 'text-white' : 'text-zinc-400'
              )}
            >
              No
            </Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

export default function PollDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: poll, isLoading: pollLoading } = usePoll(id ?? '');
  const { data: user } = useCurrentUser();
  const addResponseMutation = useAddResponse();
  const finalizePollMutation = useFinalizePoll();
  const deletePollMutation = useDeletePoll();

  const currentUserId = user?.id ?? '';
  const isCreator = poll?.creatorId === currentUserId;
  const isFinalized = poll?.status === 'finalized';

  const rankedSlots = useMemo(() => {
    if (!poll) return [];
    return rankSlots(poll.timeSlots, poll.responses);
  }, [poll]);

  const getUserResponse = useCallback(
    (slotId: string): Availability | null => {
      if (!poll) return null;
      const response = poll.responses.find(
        (r: Response) => r.participantId === currentUserId && r.slotId === slotId
      );
      return response?.availability ?? null;
    },
    [poll, currentUserId]
  );

  const respondentCount = useMemo(() => {
    if (!poll) return 0;
    const uniqueParticipants = new Set(poll.responses.map((r: Response) => r.participantId));
    return uniqueParticipants.size;
  }, [poll]);

  const handleShare = async () => {
    if (!poll) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const shareMessage = `${poll.title}\n\nHelp us find a time to meet! Respond here:\ntimetogether://poll/${poll.id}`;

    if (Platform.OS === 'web') {
      try {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert('Copied!', 'Poll link copied to clipboard');
      } catch (error) {
        console.log('Clipboard error:', error);
      }
      return;
    }

    try {
      await Share.share({
        message: shareMessage,
        title: poll.title,
      });
    } catch (error) {
      try {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert('Copied!', 'Poll link copied to clipboard');
      } catch (clipboardError) {
        console.log('Share and clipboard failed:', error, clipboardError);
      }
    }
  };

  const handleFinalize = (slotId: string) => {
    if (!poll || !isCreator) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    finalizePollMutation.mutate({ pollId: poll.id, slotId });
  };

  const handleDelete = () => {
    if (!poll || !isCreator) return;

    Alert.alert(
      'Delete Poll',
      'Are you sure you want to delete this poll? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePollMutation.mutateAsync(poll.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleRespond = (slotId: string, availability: Availability) => {
    if (!poll) return;
    addResponseMutation.mutate({ pollId: poll.id, slotId, availability });
  };

  if (pollLoading) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-zinc-400 mt-4">Loading poll...</Text>
      </View>
    );
  }

  if (!poll) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-zinc-400">Poll not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </Pressable>
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

          <View className="flex-row gap-2">
            {isCreator && !isFinalized && (
              <Pressable
                onPress={handleDelete}
                className="w-10 h-10 items-center justify-center rounded-full bg-zinc-800/50"
              >
                <Trash2 size={20} color="#f87171" />
              </Pressable>
            )}
            <Pressable
              onPress={handleShare}
              className="w-10 h-10 items-center justify-center rounded-full bg-zinc-800/50"
            >
              <Share2 size={20} color="#a1a1aa" />
            </Pressable>
          </View>
        </Animated.View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: isCreator && !isFinalized ? 120 : 40 }}
        >
          {/* Poll Info */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            className="mb-6"
          >
            <Text className="text-white text-2xl font-bold mb-2">
              {poll.title}
            </Text>

            <View className="flex-row items-center gap-4 mt-2">
              <View className="flex-row items-center gap-1.5">
                <Clock size={16} color="#a1a1aa" />
                <Text className="text-zinc-400 text-sm">
                  {poll.durationMinutes < 60
                    ? `${poll.durationMinutes} min`
                    : `${poll.durationMinutes / 60} hour${poll.durationMinutes > 60 ? 's' : ''}`}
                </Text>
              </View>

              <View className="flex-row items-center gap-1.5">
                <Users size={16} color="#a1a1aa" />
                <Text className="text-zinc-400 text-sm">
                  {respondentCount} {respondentCount === 1 ? 'response' : 'responses'}
                </Text>
              </View>
            </View>

            {isFinalized && (
              <View className="mt-4 bg-emerald-950/50 border border-emerald-800 rounded-xl p-4">
                <View className="flex-row items-center gap-2">
                  <Check size={18} color="#34d399" />
                  <Text className="text-emerald-400 font-semibold">
                    Time Finalized
                  </Text>
                </View>
                {poll.finalizedSlotId && (
                  <Text className="text-zinc-400 mt-1">
                    {formatSlotDate(
                      poll.timeSlots.find((s: TimeSlot) => s.id === poll.finalizedSlotId)!
                    )}{' '}
                    at{' '}
                    {formatSlotTime(
                      poll.timeSlots.find((s: TimeSlot) => s.id === poll.finalizedSlotId)!
                    )}
                  </Text>
                )}
              </View>
            )}
          </Animated.View>

          {/* Time Slots */}
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-zinc-400 text-sm font-medium">
                Time Slots
              </Text>
              <Text className="text-zinc-600 text-xs">
                {rankedSlots.length} options
              </Text>
            </View>

            {rankedSlots.map((slot, index) => (
              <TimeSlotCard
                key={slot.id}
                slot={slot}
                responses={poll.responses}
                userResponse={getUserResponse(slot.id)}
                onRespond={(availability) => handleRespond(slot.id, availability)}
                isFinalized={isFinalized ?? false}
                isBestOption={index === 0}
                isSelected={poll.finalizedSlotId === slot.id}
                index={index}
              />
            ))}
          </Animated.View>
        </ScrollView>

        {/* Finalize Button (Creator Only) */}
        {isCreator && !isFinalized && rankedSlots.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            className="absolute bottom-0 left-0 right-0 p-5 pb-10"
          >
            <LinearGradient
              colors={['transparent', '#09090b']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 140,
              }}
            />
            <Pressable
              onPress={() => handleFinalize(rankedSlots[0].id)}
              className="bg-emerald-600 py-4 rounded-2xl items-center active:scale-[0.98]"
            >
              <View className="flex-row items-center gap-2">
                <Check size={20} color="white" />
                <Text className="text-white font-semibold text-lg">
                  Finalize Best Time
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}
