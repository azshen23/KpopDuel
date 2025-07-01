import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, user } = useAuth();

  // Redirect to lobby if already logged in
  if (user) {
    navigation.replace('Lobby');
    return null;
  }

  return (
    <View className="flex-1 bg-background items-center justify-center p-4">
      <StatusBar style="dark" />
      
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-primary mb-2">KpopDuel</Text>
        <Text className="text-lg text-gray-600 text-center">
          Test your K-pop knowledge in real-time battles!
        </Text>
      </View>

      <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-md">
        <Text className="text-xl font-semibold text-center mb-6">
          Sign in to start playing
        </Text>

        <TouchableOpacity
          onPress={signIn}
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
        >
          <Image
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            className="w-5 h-5 mr-3"
          />
          <Text className="text-base font-medium">Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <Text className="mt-8 text-sm text-gray-500 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
}