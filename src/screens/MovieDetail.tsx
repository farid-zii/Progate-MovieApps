import { API_ACCESS_TOKEN } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import MovieItem from '../components/movies/MovieItem';
import { FontAwesome } from '@expo/vector-icons';
import { Movie } from '../types/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
};

const MovieDetail = ({ route }: any): any => {
  const { data } = route.params;
  const movies = data.movie;
  const coverType = data.coverType;

  const [recommend, setRecommend] = useState<Movie[]>([]);
  const [isFavorite, setIsFavorite] = useState<Boolean>(false);

  useEffect(() => {
    getMovieList();
    checkIsFavorite(movies.id);
  }, []);

  const getMovieList = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${movies.id}/recommendations`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setRecommend(response.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const addFavorite = async (movies: Movie): Promise<void> => {
    try {
      const initialData = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];

      if (!favMovieList.some((favMovie) => favMovie.id === movies.id)) {
        favMovieList = [...favMovieList, movies];
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
        setIsFavorite(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (initialData) {
        let favMovieList: Movie[] = JSON.parse(initialData);
        favMovieList = favMovieList.filter((movie) => movie.id !== id);
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
        setIsFavorite(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (initialData) {
        const favMovieList: Movie[] = JSON.parse(initialData);
        const isFav = favMovieList.some((movie) => movie.id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <ImageBackground
        resizeMode="stretch"
        style={[styles.w_full, styles.backgroundImage]}
        imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${coverType === 'backdrop' ? movies.backdrop_path : movies.poster_path}`,
        }}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <Text style={[styles.movieTitle, { paddingHorizontal: 10 }]}>{movies.title}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 5 }}>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={styles.rating}>{movies.vote_average.toFixed(1)}</Text>
            </View>
            <TouchableOpacity onPress={() => (isFavorite ? removeFavorite(movies.id) : addFavorite(movies))}>
              {isFavorite ? <FontAwesome name="heart" size={25} color="red" /> : <FontAwesome name="heart-o" size={25} color="white" />}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      <Text style={{ fontSize: 13, paddingHorizontal: 20, marginTop: 20, textAlign: 'justify' }}>{movies.overview}</Text>

      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 10 }}>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Original Language</Text>
          <Text>{movies.original_language}</Text>
          <Text style={{ fontWeight: 'bold' }}>Release Date</Text>
          <Text>{movies.release_date}</Text>
        </View>
        <View style={{ marginLeft: 100 }}>
          <Text style={{ fontWeight: 'bold' }}>Popularity</Text>
          <Text>{movies.popularity}</Text>
          <Text style={{ fontWeight: 'bold' }}>Vote Count</Text>
          <Text>{movies.vote_count}</Text>
        </View>
      </View>

      <View style={styles.header}>
        <View style={styles.purpleLabel}></View>
        <Text style={styles.title}>Recommend</Text>
      </View>

      <FlatList
        style={{ ...styles.movieList }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={recommend}
        renderItem={({ item }) => (
          <MovieItem movie={item} size={coverImageSize.poster} coverType={coverType} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  w_full: {
    width: '100%',
    height: 200,
  },
  backgroundImage: {
    marginRight: 4,
  },
  backgroundImageStyle: {
    borderRadius: 0,
  },
  movieTitle: {
    color: 'white',
    fontSize: 20,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
  },
  movieList: {
    paddingLeft: 4,
    marginTop: 8,
  },
});

export default MovieDetail;
