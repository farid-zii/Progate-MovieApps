import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';
import Genre from '../screens/Genre';
import KeywordSearch from '../components/search/KeywordSearch';
import Search from '../screens/Search';
const SearchStackNavigation = () => {

const Stack = createNativeStackNavigator() 
return (
      <Stack.Navigator initialRouteName='KeywordSearch'>
        <Stack.Screen name='KeywordSearch' component={Search} />
        <Stack.Screen name='MovieDetail' component={MovieDetail} />
        <Stack.Screen name='Home' component={Home}  />
        <Stack.Screen name='Genre' component={Genre} />
      </Stack.Navigator>
  );
}

export default SearchStackNavigation