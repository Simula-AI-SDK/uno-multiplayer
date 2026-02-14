import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GameScreen } from "./src/screens/GameScreen";
import { ResultsScreen } from "./src/screens/ResultsScreen";
import { RootState, setResultsVisible, startNewGame, store } from "./src/state/gameStore";

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game);

  if (game.resultsVisible && game.winnerId) {
    const winner = game.players.find((p) => p.id === game.winnerId);
    return (
      <ResultsScreen
        winnerName={winner?.name ?? "Unknown"}
        onRematch={() => {
          dispatch(startNewGame());
          dispatch(setResultsVisible(false));
        }}
        onHome={() => {
          dispatch(setResultsVisible(false));
          dispatch(startNewGame());
        }}
      />
    );
  }

  return <GameScreen />;
};

const App = () => (
  <Provider store={store}>
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <AppContent />
    </SafeAreaView>
  </Provider>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B1020"
  }
});

export default App;
