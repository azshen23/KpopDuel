import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { user } = useAuth();

  // TODO: Get actual match results from navigation params or context
  const isWinner = true;
  const finalScore = 500;
  const opponentScore = 400;

  const handlePlayAgain = () => {
    navigation.replace('Lobby');
  };

  if (!user) {
    navigation.replace('Login');
    return null;
  }

  return (
    <View className="flex-1 bg-background p-4">
      <StatusBar style="dark" />

      {/* Result Banner */}
      <View 
        className={`
          items-center justify-center py-12 rounded-3xl mb-8
          ${isWinner ? 'bg-primary' : 'bg-gray-200'}
        `}
      >
        <Text className={`text-4xl font-bold ${isWinner ? 'text-white' : 'text-gray-800'}`}>
          {isWinner ? 'Victory!' : 'Good Try!'}
        </Text>
      </View>

      {/* Scores */}
      <View className="bg-white rounded-3xl p-6 mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <View className="items-center">
            <Image
              source={{ uri: user.profilePicture }}
              className="w-16 h-16 rounded-full mb-2"
            />
            <Text className="font-medium">{user.username}</Text>
            <Text className="text-2xl font-bold text-primary">{finalScore}</Text>
          </View>

          <Text className="text-2xl font-bold">VS</Text>

          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-gray-200 mb-2" />
            <Text className="font-medium">Opponent</Text>
            <Text className="text-2xl font-bold text-gray-600">{opponentScore}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-1 justify-end">
        <TouchableOpacity
          onPress={handlePlayAgain}
          className="bg-primary rounded-full py-4"
        >
          <Text className="text-white text-lg font-medium text-center">
            Play Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace('Lobby')}
          className="mt-4"
        >
          <Text className="text-gray-600 text-center">
            Back to Lobby
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}