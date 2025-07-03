import React from "react";
import { Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import SocketManager from "../../socket";
import { Container, Button, Typography, Card, Layout } from "../../components";

// No more styled components needed - using reusable components!

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
    <Container variant="primary">
      {/* Result Header */}
      <Layout variant="header" spacing="medium">
        <Typography variant="title" color="white" align="center">
          Game Over!
        </Typography>
        <Typography
          variant="heading"
          color={isWinner ? "success" : "error"}
          align="center"
        >
          {isWinner ? "🎉 You Won!" : "😔 You Lost!"}
        </Typography>
      </Layout>

      {/* Score Display */}
      <Layout
        variant="row"
        spacing="medium"
        className="justify-center items-center"
      >
        <Card variant="score">
          <Typography variant="caption" color="gray" align="center">
            Your Score
          </Typography>
          <Typography
            variant="score"
            color={isWinner ? "accent" : "white"}
            align="center"
          >
            {playerScore}
          </Typography>
        </Card>

        <Layout variant="center" className="mx-4">
          <Typography variant="heading" color="white">
            VS
          </Typography>
        </Layout>

        <Card variant="score">
          <Typography variant="caption" color="gray" align="center">
            Opponent
          </Typography>
          <Typography
            variant="score"
            color={!isWinner ? "accent" : "white"}
            align="center"
          >
            {opponentScore}
          </Typography>
        </Card>
      </Layout>

      {/* Performance Summary */}
      <Card variant="summary">
        <Typography
          variant="subtitle"
          color="white"
          align="center"
          className="mb-4"
        >
          Match Summary
        </Typography>
        <Layout spacing="small">
          <Typography variant="body" color="gray">
            Total Rounds: 5
          </Typography>
          <Typography variant="body" color="gray">
            Your Accuracy: {Math.round((playerScore / 5) * 100)}%
          </Typography>
          <Typography variant="body" color="gray">
            Score Difference: {Math.abs(playerScore - opponentScore)}
          </Typography>
        </Layout>
      </Card>

      {/* Action Buttons */}
      <Layout spacing="medium">
        <Button variant="primary" size="large" onPress={handlePlayAgain}>
          🎮 Play Again
        </Button>

        <Button variant="cancel" size="medium" onPress={handleExit}>
          Exit to Login
        </Button>
      </Layout>

      {/* Motivational Message */}
      <Layout variant="center" className="mt-4">
        <Typography variant="body" color="gray" align="center">
          {isWinner
            ? "🎵 Great job! You know your K-pop!"
            : "🎶 Keep practicing! You'll get them next time!"}
        </Typography>
      </Layout>
    </Container>
  );
};

export default ResultsScreen;
