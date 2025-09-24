import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  userColor?: string;
  isModerator?: boolean;
  isSubscriber?: boolean;
  badges?: string[];
}

interface LiveChatProps {
  messages: ChatMessage[];
  currentUser?: string;
  maxMessages?: number;
  showTimestamp?: boolean;
  compact?: boolean;
  onSendMessage?: (message: string) => void;
  onMessagePress?: (message: ChatMessage) => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  messages,
  currentUser,
  maxMessages = 100,
  showTimestamp = true,
  compact = false,
  onSendMessage,
  onMessagePress,
}) => {
  const { colors } = useTheme();
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getUsernameColor = (username: string) => {
    // Simple hash function to generate consistent colors for usernames
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const renderMessage = (message: ChatMessage) => {
    const usernameColor = message.userColor || getUsernameColor(message.username);

    return (
      <TouchableOpacity
        key={message.id}
        style={{
          flexDirection: 'row',
          paddingVertical: compact ? 4 : 8,
          paddingHorizontal: compact ? 8 : 12,
          backgroundColor: message.username === currentUser ? colors.primaryContainer : 'transparent',
          borderRadius: compact ? 8 : 12,
          marginBottom: compact ? 2 : 4,
        }}
        onPress={() => onMessagePress?.(message)}
        activeOpacity={0.7}
      >
        {/* User badges */}
        {message.badges && message.badges.length > 0 && (
          <View style={{ flexDirection: 'row', marginRight: 4 }}>
            {message.badges.map((badge, index) => (
              <View
                key={index}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: badge === 'moderator' ? '#00ff00' : '#ff6b35',
                  marginRight: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="labelSmall" color="onPrimary">
                  {badge === 'moderator' ? 'M' : 'S'}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* Username */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Typography
              variant={compact ? 'labelSmall' : 'labelMedium'}
              color={usernameColor}
              style={{ fontWeight: '600' }}
            >
              {message.username}
            </Typography>
            {message.isModerator && (
              <Icon name="security" size={12} color="#00ff00" style={{ marginLeft: 4 }} />
            )}
            {message.isSubscriber && (
              <Icon name="star" size={12} color="#ff6b35" style={{ marginLeft: 4 }} />
            )}
            {showTimestamp && (
              <Typography
                variant="labelSmall"
                color="onSurfaceVariant"
                style={{ marginLeft: 'auto' }}
              >
                {formatTimestamp(message.timestamp)}
              </Typography>
            )}
          </View>

          {/* Message text */}
          <Typography
            variant={compact ? 'bodySmall' : 'bodyMedium'}
            color="onSurface"
            style={{
              lineHeight: compact ? 16 : 20,
            }}
          >
            {message.message}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  if (compact) {
    return (
      <Card style={{ flex: 1, padding: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon name="chat" size={16} color={colors.onSurface} />
          <Typography variant="labelMedium" color="onSurface" style={{ marginLeft: 8 }}>
            Live Chat
          </Typography>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: isConnected ? '#00ff00' : '#ff0000',
              marginLeft: 'auto',
            }}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.slice(-maxMessages).map(renderMessage)}
        </ScrollView>

        {onSendMessage && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.onSurfaceVariant}
              style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
                color: colors.onSurface,
                fontSize: 14,
              }}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={{
                backgroundColor: inputMessage.trim() ? colors.primary : colors.surfaceVariant,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Icon name="play_arrow" size={16} color={inputMessage.trim() ? colors.onPrimary : colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        )}
      </Card>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ElevatedCard style={{ flex: 1, padding: 16 }}>
        {/* Chat Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="chat" size={20} color={colors.onSurface} />
            <Typography variant="titleMedium" color="onSurface" style={{ marginLeft: 8 }}>
              Live Chat
            </Typography>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {messages.length} messages
            </Typography>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isConnected ? '#00ff00' : '#ff0000',
              }}
            />
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.slice(-maxMessages).map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        {onSendMessage && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type your message..."
              placeholderTextColor={colors.onSurfaceVariant}
              style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 12,
                color: colors.onSurface,
                fontSize: 16,
              }}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={{
                backgroundColor: inputMessage.trim() ? colors.primary : colors.surfaceVariant,
                borderRadius: 24,
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name="play_arrow" size={20} color={inputMessage.trim() ? colors.onPrimary : colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        )}
      </ElevatedCard>
    </KeyboardAvoidingView>
  );
};

// Convenience components for different layouts
export const CompactLiveChat: React.FC<Omit<LiveChatProps, 'compact'>> = (props) => (
  <LiveChat compact={true} {...props} />
);

export const FullLiveChat: React.FC<Omit<LiveChatProps, 'compact'>> = (props) => (
  <LiveChat compact={false} {...props} />
);