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
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.navigate('MovieDetail', { data: { movie: item, coverType: 'poster' } })}>
            <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
          </TouchableOpacity>
        )}
        numColumns={3}
        // contentContainerStyle={styles.resultsContainer}
      />
    </View>
  );
};


export default KeywordSearch;
