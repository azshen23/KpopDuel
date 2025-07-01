import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { SOCKET_EVENTS } from 'shared';
import { StatusBar } from 'expo-status-bar';

type LobbyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Lobby'>;

export default function LobbyScreen() {
  const navigation = useNavigation<LobbyScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { socket, isConnected } = useSocket();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.MATCH_FOUND, ({ matchId }) => {
      setIsSearching(false);
      navigation.replace('Game', { matchId });
    });

    return () => {
      socket.off(SOCKET_EVENTS.MATCH_FOUND);
    };
  }, [socket, navigation]);

  const handleFindOpponent = () => {
    if (!socket || !user) return;

    setIsSearching(true);
    socket.emit(SOCKET_EVENTS.FIND_OPPONENT, user);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    // TODO: Implement cancel search on server
  };

  if (!user) {
    navigation.replace('Login');
    return null;
  }

  return (
    <View className="flex-1 bg-background p-4">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
          <Image
            source={{ uri: user.profilePicture }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="ml-3 text-lg font-medium">{user.username}</Text>
        </View>
        <TouchableOpacity
          onPress={signOut}
          className="py-2 px-4 rounded-full bg-gray-200"
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-primary mb-2">KpopDuel</Text>
        <Text className="text-lg text-gray-600 mb-8 text-center">
          Challenge other players to K-pop music battles!
        </Text>

        {isSearching ? (
          <View className="items-center">
            <Text className="text-lg mb-4">Searching for opponent...</Text>
            <TouchableOpacity
              onPress={handleCancelSearch}
              className="bg-gray-200 rounded-full py-3 px-6"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleFindOpponent}
            disabled={!isConnected}
            className={`bg-primary rounded-full py-4 px-8 ${!isConnected ? 'opacity-50' : ''}`}
          >
            <Text className="text-white text-lg font-medium">
              Find Opponent
            </Text>
          </TouchableOpacity>
        )}

        {!isConnected && (
          <Text className="mt-4 text-red-500">
            Not connected to game server
          </Text>
        )}
      </View>
    </View>
  );
}