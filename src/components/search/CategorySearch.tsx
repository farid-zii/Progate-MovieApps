
import { API_ACCESS_TOKEN } from '@env';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const CategorySearch = () => {

    const [category,setCategory] =useState();
    const navigation = useNavigation();

    const getCategory = async (): Promise<void> => {
        try {
                const url = `https://api.themoviedb.org/3/genre/movie/list`;
                const options = {
                  method: 'GET',
                  headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                  },
                };
                const response = await fetch(url, options);
                const aa = await response.json()
                const genre = aa.genres
                console.log(genre)
                // return await response.json();

            setCategory(genre);
          
        } catch (error) {
          console.log(error);
        }
      };
    const geta = async (): Promise<void> => {
        try {
                const url = `https://api.themoviedb.org/3/list/`;
                const options = {
                  method: 'GET',
                  headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                  },
                };
                const response = await fetch(url, options);
                const aa = await response.json()
                const genre = aa.genres
                console.log(genre)
                // return await response.json();

            // setCategory(genre);
          
        } catch (error) {
          console.log(error);
        }
      };

      useFocusEffect(
        React.useCallback(() => {
            getCategory();
            geta();
        }, [])
      );
    

    return (
        <View style={{ marginVertical: 10 }}>
          <FlatList
            data={category}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                    <TouchableOpacity style={{ margin:3,backgroundColor:'#C0B4D5',padding:15,borderRadius:10,width:'50%' }} onPress={() => navigation.navigate('Genre', { data: { item } })}>
                        {/* <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" /> */}
                        <Text style={{ textAlign:'center',color:"white",fontWeight:'bold' }}>{item.name}</Text>
                    </TouchableOpacity>
            )}
            numColumns={2}
            contentContainerStyle={styles.resultsContainer}
          />
        </View>
      );
}

const styles = StyleSheet.create({
    resultsContainer: {
      paddingHorizontal: 5,
    },
  });

export default CategorySearch
