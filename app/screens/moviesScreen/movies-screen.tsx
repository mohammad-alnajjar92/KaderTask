import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, Dimensions, FlatList, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { color, typography } from "../../theme"
import { useStores } from "../../models"
import moment from 'moment';



export const MoviesScreen = observer(function MoviesScreen() {
  const navigation = useNavigation()
  const nextScreen = () => navigation.navigate("movieDetails")
  const { moviesStore } = useStores();

  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    const HomeScreenSetup = async () => {
      try {
        setRefreshing(true);
        await moviesStore.getGenres();
        await moviesStore.syncMovies();
        setRefreshing(false);
      }
      catch (error) {
        console.log(error)
      }

    }
    HomeScreenSetup();
  }, []);

  const _renderTopView = () => {
    return (
      <View style={styles.typeView}>
        <TouchableOpacity
          onPress={async () => {
            setRefreshing(true),
              await moviesStore.syncMovies(),
              setSelected(1),
              setRefreshing(false);
          }}
          style={selected === 1 ? styles.selectedButton : styles.disabledButton}>
          <Text style={[{ color: selected === 1 ? 'white' : 'black' }, styles.typeText]}>{'Upcoming'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setRefreshing(true),
              await moviesStore.popularMovies(),
              setSelected(2)
            setRefreshing(false);
          }}
          style={selected === 2 ? styles.selectedButton : styles.disabledButton}>
          <Text style={[{ color: selected === 2 ? 'white' : 'black' }, styles.typeText]}>{'Popular'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setRefreshing(true),
              await moviesStore.topMovies(),
              setSelected(3),
              setRefreshing(false);

          }}
          style={selected === 3 ? styles.selectedButton : styles.disabledButton}>
          <Text style={[{ color: selected === 3 ? 'white' : 'black' }, styles.typeText]}>{'Top Rating'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const _renderListOfMovies = (refreshing) => {
    const { moviesStore } = useStores();
    const { movies } = moviesStore;
    if (refreshing) return <View style={styles.loading}><ActivityIndicator size="large" /></View>
    else return (
      <FlatList
        key={'home'}
        data={movies}
        scrollsToTop={false}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        style={{ marginTop: '5%', width: '100%' }}
        removeClippedSubviews={true}
        renderItem={({ item }: { item }) => (_renderMovie(item))}
        keyExtractor={(item, index) => `${'$movie' + index}`}
      />

    )
  };

  const _renderMovie = (item) => {

    let path = "https://image.tmdb.org/t/p/w500" + item.poster_path + "?api_key=eb0c6b282ef3a0a21c8bfc85c5ec8323";
    return (
      <TouchableOpacity
        onPress={async () => { await moviesStore.movieDetails(item.id), nextScreen() }}
        style={styles.movieCard}>
        <Image source={{ uri: path }} style={styles.imageStyle} />
        <View style={styles.innerMovieCard}>
          <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.dateText}>{moment(item.release_date).format('MMMM DD, YYYY')}</Text>
          {_renderGenre(item.genre_ids)}
        </View>
        <View>
          <Text style={styles.ratingText}>{parseInt(item.vote_average * 10) + "%"}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const _renderGenre = (genre_ids) => {
    let genreNames = [];
    moviesStore.genres.forEach(element => {
      genre_ids.forEach(id => {
        if (id == element.id) genreNames.push(element.name)
      })
    });
    if (genreNames.length === 0) return null;
    return (
      <Text style={styles.textMargin} numberOfLines={2}>
        {genreNames.map((ele,key) => {
          return <View key={key} style={styles.paddingView}><View
            style={styles.genreView}>
            <Text style={styles.textBlack}>{ele}</Text>
          </View></View>
        })}
      </Text>
    )
  }

  return (
    <View testID="MoviesScreen" style={styles.flex}>
      <Screen style={styles.container} backgroundColor={color.transparent}>
        <Text style={styles.title}> {"Movies"}</Text>
        {_renderTopView()}
        {_renderListOfMovies(refreshing)}
      </Screen>
    </View>
  )
})

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

  flex: {
    flex: 1
  },
  title: {
    fontSize: 28,
    lineHeight: 38,
    textAlign: "left",
    marginTop: '5%', fontWeight: "bold",
    color: color.palette.black,
    fontFamily: typography.primary,
  },
  container: {
    backgroundColor: color.palette.white,
    flex: 1
  },
  typeView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%'
  },
  selectedButton: {
    borderRadius: 30,
    justifyContent: 'center',
    width: width / 4,
    height: 30,
    backgroundColor: "#44bd32",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  disabledButton: {
    borderRadius: 30,
    justifyContent: 'center',
    width: width / 4,
    height: 30,
    backgroundColor: '#dcdde1'
  },
  typeText: {
    fontWeight: "600",
    textAlign: 'center'
  },
  movieCard: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    elevation: 2,
    marginTop: '5%',
    alignSelf: 'center',
    shadowColor: "#000",
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    flexDirection: 'row',
    paddingLeft: '5%'
  },
  imageStyle: {
    height: 170,
    width: '30%',
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center'
  },
  innerMovieCard: {
    alignItems: 'flex-start',
    width: '65%',
    marginLeft: '3%',
    marginTop: '5%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#555555'
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginTop: '5%'
  },
  ratingText: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    color: "#44bd32",
    fontWeight: '700',
    fontSize: 20
  },
  paddingView: {
    paddingRight: 7,
    paddingTop: 7
  },
  genreView: {
    backgroundColor: '#dcdde1',
    height: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMargin: { marginTop: '5%' },
  textBlack: { color: "black" },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})