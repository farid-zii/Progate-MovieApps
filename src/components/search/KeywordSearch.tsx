import React, { useState } from 'react';
import { TextInput, View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../../types/app';
import MovieItem from '../movies/MovieItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const KeywordSearch = ({ navigation }: any) => {
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);

  const searchMovies = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/search/keyword?query=inside&page=1`;
    // https://api.themoviedb.org/3/search/keyword?query=a&page=1

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
      console.log(data.results)
      setResults(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const [favorites, setFavorites] = useState<Movie[]>([]);

  const getFavoriteMovies = async (): Promise<void> => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@FavoriteList');
      if (storedFavorites !== null) {
        const favoriteList: Movie[] = JSON.parse(storedFavorites);
        const movieDetails = await Promise.all(
          favoriteList.map(async (movie) => {
            const url = `https://api.themoviedb.org/3/movie/${movie.id}`;
            const options = {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              },
            };
            const response = await fetch(url, options);
            return await response.json();
          })
        );
        console.log(movieDetails)
        setFavorites(movieDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
        searchMovies();
        // getFavoriteMovies()
    }, [])
  );

  const handleSearch = () => {
    if (keyword.trim() !== '') {
      searchMovies();
    }
  };

  // console.log(results)

  return (
    <View style={{ marginVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, flex: 1, borderRadius: 15 }}
          placeholder="Enter keyword"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
        />
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        
        renderItem={({ item }) => (
          <TouchableOpacity style={{ margin:10 }} onPress={() => navigation.navigate('MovieDetail', { data: { movie: item, coverType: 'poster' } })}>
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
  resultsContainer: {
    paddingHorizontal: 10,
  },
});

export default KeywordSearch;
