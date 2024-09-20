// File: /screens/ChatScreen.tsx

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserMessages } from '../api/messageApi'; // Import getUserMessages function

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]); // State to hold messages
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchMessages(); // Fetch messages when the component mounts
  }, []);

  const fetchMessages = async () => {
    try {
      // Replace 'user-id' with the actual user ID you want to fetch messages for
      const userId = 'user-id';
      const fetchedMessages = await getUserMessages(userId);
      setMessages(fetchedMessages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error as string);
    }
  };

  const renderMessageItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}>
      <View style={styles.messageContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.messageInfo}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageText} numberOfLines={1}>{item.message}</Text>
        </View>
        <View style={styles.messageMeta}>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00D6BE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={24} color="#00D6BE" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1f1f1f',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageInfo: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageText: {
    fontSize: 14,
    color: '#888',
  },
  messageMeta: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  unreadBadge: {
    backgroundColor: '#00D6BE',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
});

export default ChatScreen;
