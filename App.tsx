import './global.css';
import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import HomePage from './components/HomePage';
import AskMora from './components/AskMora';
import Questionnaire from './components/Questionnaire';
import ViewHistory from './components/ViewHistory';
import UserProfile from './components/UserProfile';
import Onboarding from './components/Onboarding';
import BreastScan from './components/BreastScan';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'askMora' | 'questionnaire' | 'viewHistory' | 'userProfile' | 'onboarding' | 'breastScan' | 'scanReport'
  >('home');
  const [scanId, setScanId] = useState<string>('');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#f471b5').catch(() => {});
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
    }
  }, []);

  const handleNavigateToAskMora = () => {
    setCurrentScreen('askMora');
  };

  const handleNavigateToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToHistory = () => {
    setCurrentScreen('viewHistory');
  };

  const handleStartScan = () => {
    setCurrentScreen('questionnaire');
  };

  const handleStartBreastScan = () => {
    setCurrentScreen('breastScan');
  };

  const handleLogout = () => {
    // Reset to home screen - the AuthContext will handle showing login
    setCurrentScreen('home');
  };

  const handleShowOnboarding = () => {
    setCurrentScreen('onboarding');
  };

  const handleNavigateToUserProfile = () => {
    setCurrentScreen('userProfile');
  };

  const handleNavigateToReport = (id: string) => {
    setScanId(id);
    setCurrentScreen('scanReport');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <View className="text-center">
          <Text className="mb-2 text-2xl font-bold text-[#E7B8FF]">Loading...</Text>
        </View>
      </View>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return <Login onShowProfileForm={handleShowOnboarding} />;
  }

  // Show main app if user is authenticated
  return (
    <>
      {currentScreen === 'home' && (
        <HomePage
          onNavigateToAskMora={handleNavigateToAskMora}
          onNavigateToHistory={handleNavigateToHistory}
          onStartScan={handleStartScan}
          onStartBreastScan={handleStartBreastScan}
          onLogout={handleLogout}
          onNavigateToUserProfile={handleNavigateToUserProfile}
        />
      )}
      {currentScreen === 'askMora' && (
        <AskMora onNavigateToHome={handleNavigateToHome} onNavigateToUserProfile={handleNavigateToUserProfile} />
      )}
      {currentScreen === 'questionnaire' && (
        <Questionnaire onNavigateToHome={handleNavigateToHome} onNavigateToUserProfile={handleNavigateToUserProfile} />
      )}
      {currentScreen === 'viewHistory' && (
        <ViewHistory onNavigateToHome={handleNavigateToHome} onNavigateToUserProfile={handleNavigateToUserProfile} />
      )}
      {currentScreen === 'userProfile' && <UserProfile onNavigateToHome={handleNavigateToHome} />}
      {currentScreen === 'onboarding' && <Onboarding onComplete={handleNavigateToHome} onBackToHome={handleNavigateToHome} />}
      {currentScreen === 'breastScan' && (
        <BreastScan 
          onNavigateToHome={handleNavigateToHome} 
          onNavigateToReport={handleNavigateToReport} 
        />
      )}
      
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
