import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import SocketManager from "../../socket";
import { styled } from "nativewind";

// Styled components
const StyledContainer = styled(View, "flex-1 bg-[#1a1a2e] p-5 justify-center");
const StyledHeaderContainer = styled(View, "items-center mb-10");
const StyledGameOverText = styled(Text, "text-3xl text-white font-bold mb-2");
const StyledResultText = styled(Text, "text-3xl font-bold");
const StyledScoreContainer = styled(View, "flex-row justify-between items-center mb-10");
const StyledScoreCard = styled(View, "bg-[#16213e] rounded-3xl p-5 items-center flex-1 mx-1");
const StyledScoreLabel = styled(Text, "text-base text-gray-400 mb-2");
const StyledScoreValue = styled(Text, "text-4xl font-bold");
const StyledVsContainer = styled(View, "px-2");
const StyledVsText = styled(Text, "text-lg text-[#4ECDC4] font-bold");
const StyledSummaryContainer = styled(View, "bg-[#16213e] rounded-3xl p-5 mb-10");
const StyledSummaryTitle = styled(Text, "text-xl text-[#FFE66D] font-bold mb-4 text-center");
const StyledSummaryItem = styled(View, "mb-2");
const StyledSummaryText = styled(Text, "text-base text-white text-center");
const StyledButtonContainer = styled(View, "mb-8");
const StyledPlayAgainButton = styled(TouchableOpacity, "bg-[#FF6B9D] rounded-3xl py-4 items-center mb-4 shadow-lg");
const StyledPlayAgainText = styled(Text, "text-white text-lg font-bold");
const StyledExitButton = styled(TouchableOpacity, "bg-transparent border-2 border-gray-600 rounded-3xl py-4 items-center");
const StyledExitText = styled(Text, "text-gray-600 text-base");
const StyledMotivationalContainer = styled(View, "items-center");
const StyledMotivationalText = styled(Text, "text-base text-[#4ECDC4] text-center leading-6");

type ResultsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Results"
>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, "Results">;

interface Props {
  navigation: ResultsScreenNavigationProp;
  route: ResultsScreenRouteProp;
}

const { width } = Dimensions.get("window");

const ResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { finalScores, winner, playerName } = route.params;

  const playerIds = Object.keys(finalScores);
  const playerScore = finalScores[playerIds[0]] || 0;
  const opponentScore = finalScores[playerIds[1]] || 0;
  const isWinner = winner === playerName;

  const handlePlayAgain = () => {
    SocketManager.disconnect();
    navigation.replace("Lobby", { playerName });
  };

  const handleExit = () => {
    SocketManager.disconnect();
    navigation.replace("Login");
  };

  return (
    <StyledContainer>
      {/* Result Header */}
      <StyledHeaderContainer>
        <StyledGameOverText>Game Over!</StyledGameOverText>
        <StyledResultText
          className={`${
            isWinner ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isWinner ? "🎉 You Won!" : "😔 You Lost!"}
        </StyledResultText>
      </StyledHeaderContainer>

      {/* Score Display */}
      <StyledScoreContainer>
        <StyledScoreCard>
          <StyledScoreLabel>Your Score</StyledScoreLabel>
          <StyledScoreValue className={`${
            isWinner ? 'text-[#FFE66D]' : 'text-white'
          }`}>
            {playerScore}
          </StyledScoreValue>
        </StyledScoreCard>

        <StyledVsContainer>
          <StyledVsText>VS</StyledVsText>
        </StyledVsContainer>

        <StyledScoreCard>
          <StyledScoreLabel>Opponent</StyledScoreLabel>
          <StyledScoreValue className={`${
            !isWinner ? 'text-[#FFE66D]' : 'text-white'
          }`}>
            {opponentScore}
          </StyledScoreValue>
        </StyledScoreCard>
      </StyledScoreContainer>

      {/* Performance Summary */}
      <StyledSummaryContainer>
        <StyledSummaryTitle>Match Summary</StyledSummaryTitle>
        <StyledSummaryItem>
          <StyledSummaryText>Total Rounds: 5</StyledSummaryText>
        </StyledSummaryItem>
        <StyledSummaryItem>
          <StyledSummaryText>
            Your Accuracy: {Math.round((playerScore / 5) * 100)}%
          </StyledSummaryText>
        </StyledSummaryItem>
        <StyledSummaryItem>
          <StyledSummaryText>
            Score Difference: {Math.abs(playerScore - opponentScore)}
          </StyledSummaryText>
        </StyledSummaryItem>
      </StyledSummaryContainer>

      {/* Action Buttons */}
      <StyledButtonContainer>
        <StyledPlayAgainButton
          onPress={handlePlayAgain}
        >
          <StyledPlayAgainText>🎮 Play Again</StyledPlayAgainText>
        </StyledPlayAgainButton>

        <StyledExitButton onPress={handleExit}>
          <StyledExitText>Exit to Login</StyledExitText>
        </StyledExitButton>
      </StyledButtonContainer>

      {/* Motivational Message */}
      <StyledMotivationalContainer>
        <StyledMotivationalText>
          {isWinner
            ? "🎵 Great job! You know your K-pop!"
            : "🎶 Keep practicing! You'll get them next time!"}
        </StyledMotivationalText>
       </StyledMotivationalContainer>
     </StyledContainer>
   );
};

export default ResultsScreen;
