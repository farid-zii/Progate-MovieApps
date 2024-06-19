import { API_ACCESS_TOKEN, API_URL } from '@env'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { ImageBackground, Text, StyleSheet, View,  FlatList } from 'react-native'
import MovieItem from '../components/movies/MovieItem'
import { FontAwesome } from '@expo/vector-icons'
import type { MovieListProps, Movie } from '../types/app'

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
}

const MovieDetail = ({ route }: any): any => {
  
  const {data} = route.params
  const movies= data.movie
  const size= data.size
  const coverType= data.coverType

  const [recommend,setRecommend]=useState()

  useEffect(() => {
    getMovieList()
  }, [])
  
  const getMovieList = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${movies.id}/recommendations
`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setRecommend(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  console.log(recommend)


  return (
    <View>
      <ImageBackground
        resizeMode="stretch"
        style={[styles.w_full, styles.backgroundImage]}
        imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${
            coverType === 'backdrop' ? movies.backdrop_path : movies.poster_path
          }`,
        }}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <Text style={styles.movieTitle}>{movies.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{movies.vote_average.toFixed(1)}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
      
      <Text style={{ fontSize:13,paddingHorizontal:20,marginTop:20,textAlign:'justify' }}>{movies.overview}</Text>
      
      <View style={{ flexDirection:'row',paddingHorizontal:20,marginTop:10}}>
        <View  >
          <Text style={{ fontWeight:'bold' }}>Original Language</Text>
          <Text >{movies.original_language}</Text>
          <Text style={{ fontWeight:'bold' }}>Release Date</Text>
          <Text >{movies.release_date}</Text>
        </View>
        <View  style={{ marginLeft:100 }}>
          <Text style={{ fontWeight:'bold' }}>Popularity</Text>
          <Text >{movies.popularity}</Text>
          <Text style={{ fontWeight:'bold' }}>Vote Count</Text>
          <Text >{movies.vote_count}</Text>
        </View>
      </View>

      <View style={styles.header}>
        <View style={styles.purpleLabel}>
        </View>
        <Text style={styles.title}>Recommend</Text>
      </View>
      
      
      <FlatList
        style={{
          ...styles.movieList,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={recommend}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            size={coverImageSize.poster}
            coverType={coverType}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      
        
    </View>
  )
}



const styles = StyleSheet.create({
  header: {
    
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:20
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
  w_full:{
    width :'100%',
    height:200,
  },
  backgroundImage: {
    marginRight: 4,
  },
  backgroundImageStyle: {
    borderRadius: 0,
  },
  movieTitle: {
    color: 'white',
    fontSize:20,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
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
})


export default MovieDetail