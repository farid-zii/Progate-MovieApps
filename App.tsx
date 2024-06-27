import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from './src/navigations/BottomTabNavigation'

export default function App():JSX.Element {
  return (
    <NavigationContainer>
      <BottomTabNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
