import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import SocketManager from "../../socket";
import { styled } from "nativewind";

// Styled components
const StyledContainer = styled(View, "flex-1 bg-[#1a1a2e] p-5");
const StyledLoadingContainer = styled(View, "flex-1 justify-center items-center");
const StyledLoadingTitle = styled(Text, "text-3xl text-[#FF6B9D] font-bold mb-5");
const StyledLoadingSubtitle = styled(Text, "text-2xl text-[#4ECDC4] mb-2");
const StyledLoadingText = styled(Text, "text-base text-gray-400");
const StyledHeader = styled(View, "mb-5");
const StyledScoreRow = styled(View, "flex-row justify-between items-center mb-2");
const StyledScoreText = styled(Text, "text-lg text-white font-bold");
const StyledVsText = styled(Text, "text-base text-[#FFE66D] font-bold");
const StyledRoundText = styled(Text, "text-base text-[#4ECDC4] text-center");
const StyledTimerContainer = styled(View, "items-center mb-8");
const StyledTimerText = styled(Text, "text-2xl text-[#FF6B9D] font-bold mb-2");
const StyledTimerBar = styled(View, "bg-gray-700 rounded overflow-hidden");
const StyledTimerProgress = styled(View, "h-full bg-[#FF6B9D]");
const StyledAudioContainer = styled(View, "items-center mb-8");
const StyledAudioText = styled(Text, "text-lg text-[#FFE66D]");
const StyledAnswerContainer = styled(View, "flex-1");
const StyledQuestionText = styled(Text, "text-xl text-white text-center mb-5 font-bold");
const StyledOptionButton = styled(TouchableOpacity, "bg-[#16213e] rounded-2xl p-5 mb-4 border-2");
const StyledOptionText = styled(Text, "text-base text-white text-center");
const StyledResultContainer = styled(View, "bg-[#16213e] rounded-2xl p-5 mt-5");
const StyledResultText = styled(Text, "text-base text-[#FFE66D] text-center font-bold");

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, "Game">;
type GameScreenRouteProp = RouteProp<RootStackParamList, "Game">;

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
      <StyledContainer>
        <StyledLoadingContainer>
          <StyledLoadingTitle>🎵 Get Ready!</StyledLoadingTitle>
          <StyledLoadingSubtitle>VS {opponent.name}</StyledLoadingSubtitle>
          <StyledLoadingText>Game starting soon...</StyledLoadingText>
        </StyledLoadingContainer>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* Header */}
      <StyledHeader>
        <StyledScoreRow>
          <StyledScoreText>
            You: {scores[Object.keys(scores)[0]] || 0}
          </StyledScoreText>
          <StyledVsText>VS</StyledVsText>
          <StyledScoreText>
            {opponent.name}: {scores[Object.keys(scores)[1]] || 0}
          </StyledScoreText>
        </StyledScoreRow>

        {currentRound && (
          <StyledRoundText>
            Round {currentRound.roundNumber}/5
          </StyledRoundText>
        )}
      </StyledHeader>

      {/* Timer */}
      <StyledTimerContainer>
        <StyledTimerText>{timeLeft}s</StyledTimerText>
        <StyledTimerBar style={{ width: width - 40, height: 8 }}>
          <StyledTimerProgress
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </StyledTimerBar>
      </StyledTimerContainer>

      {/* Audio Controls */}
      <StyledAudioContainer>
        <StyledAudioText>
          {isPlaying ? "🎵 Playing..." : "🎵 Audio snippet"}
        </StyledAudioText>
      </StyledAudioContainer>

      {/* Answer Options */}
      {currentRound && (
        <StyledAnswerContainer>
          <StyledQuestionText>Which song is this?</StyledQuestionText>
          {currentRound.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect =
              showResult && lastResult?.correctAnswer === option;
            const isWrong =
              showResult && selectedAnswer === option && !isCorrect;

            return (
              <StyledOptionButton
                key={index}
                className={`${
                  isCorrect
                    ? 'border-green-500 bg-green-500'
                    : isWrong
                    ? 'border-red-500 bg-red-500'
                    : isSelected
                    ? 'border-[#4ECDC4] bg-[#4ECDC4]'
                    : 'border-transparent'
                }`}
                onPress={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <StyledOptionText
                  className={`${
                    isSelected || isCorrect ? 'font-bold' : ''
                  }`}
                >
                  {option}
                </StyledOptionText>
              </StyledOptionButton>
            );
          })}
        </StyledAnswerContainer>
      )}

      {/* Result Display */}
      {showResult && lastResult && (
        <StyledResultContainer>
          <StyledResultText>
            Correct Answer: {lastResult.correctAnswer}
          </StyledResultText>
        </StyledResultContainer>
       )}
     </StyledContainer>
   );
};

export default GameScreen;
