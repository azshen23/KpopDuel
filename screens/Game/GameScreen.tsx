import React, { useState, useEffect, useRef } from "react";
import { View, Alert, Dimensions } from "react-native";
import { Audio } from "expo-av";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AuthenticatedStackParamList } from "../navigation/AuthenticatedStack";
import SocketManager from "../../socket";
import { Container, Button, Typography, Card, Layout } from "../../components";

// No more styled components needed - using reusable components!

type GameScreenNavigationProp = StackNavigationProp<
  AuthenticatedStackParamList,
  "Game"
>;
type GameScreenRouteProp = RouteProp<AuthenticatedStackParamList, "Game">;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

interface RoundData {
  roundNumber: number;
  snippetURL: string;
  options: string[];
  timeLimit: number;
}

interface RoundResult {
  correctAnswer: string;
  scores: { [playerId: string]: number };
  playerAnswers: { [playerId: string]: string };
}

const { width } = Dimensions.get("window");

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentRound, setCurrentRound] = useState<RoundData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { matchId, opponent } = route.params;

  useEffect(() => {
    setupGameListeners();
    return () => {
      cleanup();
    };
  }, []);

  const setupGameListeners = () => {
    SocketManager.onRoundStart((roundData: RoundData) => {
      setGameStarted(true);
      setCurrentRound(roundData);
      setSelectedAnswer("");
      setShowResult(false);
      setTimeLeft(roundData.timeLimit || 15);
      playAudioSnippet(roundData.snippetURL);
      startTimer(roundData.timeLimit || 15);
    });

    SocketManager.onRoundResult((result: RoundResult) => {
      setLastResult(result);
      setScores(result.scores);
      setShowResult(true);
      stopAudio();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    });

    SocketManager.onGameOver((gameResult) => {
      cleanup();
      navigation.replace("Results", {
        finalScores: gameResult.finalScores,
        winner: gameResult.winner,
        playerName: gameResult.playerName,
      });
    });
  };

  const startTimer = (duration: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playAudioSnippet = async (url: string) => {
    try {
      await stopAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume: 1.0 }
      );

      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Audio Error", "Failed to play audio snippet");
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentRound) return;

    setSelectedAnswer(answer);
    SocketManager.submitGuess(currentRound.roundNumber, answer);
  };

  const cleanup = () => {
    stopAudio();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    SocketManager.removeAllListeners();
  };

  if (!gameStarted) {
    return (
      <Container variant="primary">
        <Layout variant="loading">
          <Typography variant="title" color="primary" align="center">
            🎵 Get Ready!
          </Typography>
          <Typography variant="heading" color="secondary" align="center">
            VS {opponent.name}
          </Typography>
          <Typography variant="body" color="gray" align="center">
            Game starting soon...
          </Typography>
        </Layout>
      </Container>
    );
  }

  return (
    <Container variant="primary">
      {/* Header */}
      <Layout variant="header" spacing="medium">
        <Layout variant="row" className="justify-between items-center mb-2">
          <Typography variant="score" color="white" weight="bold">
            You: {scores[Object.keys(scores)[0]] || 0}
          </Typography>
          <Typography variant="body" color="accent" weight="bold">
            VS
          </Typography>
          <Typography variant="score" color="white" weight="bold">
            {opponent.name}: {scores[Object.keys(scores)[1]] || 0}
          </Typography>
        </Layout>

        {currentRound && (
          <Typography variant="body" color="secondary" align="center">
            Round {currentRound.roundNumber}/5
          </Typography>
        )}
      </Layout>

      {/* Timer */}
      <Layout variant="center" spacing="large" className="mb-8">
        <Typography
          variant="timer"
          color="primary"
          weight="bold"
          className="mb-2"
        >
          {timeLeft}s
        </Typography>
        <View
          className="bg-gray-700 rounded overflow-hidden"
          style={{ width: width - 40, height: 8 }}
        >
          <View
            className="h-full bg-[#FF6B9D]"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </View>
      </Layout>

      {/* Audio Controls */}
      <Layout variant="center" spacing="large" className="mb-8">
        <Typography variant="body" color="accent">
          {isPlaying ? "🎵 Playing..." : "🎵 Audio snippet"}
        </Typography>
      </Layout>

      {/* Answer Options */}
      {currentRound && (
        <Layout spacing="medium" className="flex-1">
          <Typography
            variant="heading"
            color="white"
            align="center"
            weight="bold"
            className="mb-5"
          >
            Which song is this?
          </Typography>
          {currentRound.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect =
              showResult && lastResult?.correctAnswer === option;
            const isWrong =
              showResult && selectedAnswer === option && !isCorrect;

            return (
              <Button
                key={index}
                variant="outline"
                size="large"
                className={`${
                  isCorrect
                    ? "border-green-500 bg-green-500"
                    : isWrong
                    ? "border-red-500 bg-red-500"
                    : isSelected
                    ? "border-[#4ECDC4] bg-[#4ECDC4]"
                    : "border-transparent"
                } mb-4`}
                onPress={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <Typography
                  variant="button"
                  color="white"
                  align="center"
                  weight={isSelected || isCorrect ? "bold" : "normal"}
                >
                  {option}
                </Typography>
              </Button>
            );
          })}
        </Layout>
      )}

      {/* Result Display */}
      {showResult && lastResult && (
        <Card variant="result" className="mt-5">
          <Typography
            variant="body"
            color="accent"
            align="center"
            weight="bold"
          >
            Correct Answer: {lastResult.correctAnswer}
          </Typography>
        </Card>
      )}
    </Container>
  );
};

export default GameScreen;
