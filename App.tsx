import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./screens/navigation/AppNavigator";
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
