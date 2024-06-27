import React, { useState } from 'react';
import { TextInput, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../../types/app';
import MovieItem from '../movies/MovieItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const searchMovies = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&page=1`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (keyword.trim() !== '') {
      searchMovies();
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter keyword"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.movieItemContainer} 
            onPress={() => navigation.navigate('MovieDetail', { data: { movie: item, coverType: 'poster' } })}
          >
            <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
          </TouchableOpacity>
        )}
        numColumns={3}
        contentContainerStyle={styles.resultsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    flex: 1,
    borderRadius: 15,
  },
  movieItemContainer: {
    margin: 10,
  },
  resultsContainer: {
    paddingHorizontal: 10,
  },
});

export default KeywordSearch;
