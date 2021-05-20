import React from "react"
import { View, Image, ViewStyle, StyleSheet, TouchableOpacity, ScrollView ,Dimensions,Text} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"
const back = require("./left-chevron.png")
const unknown = require("./uknown.jpeg")
const { height } = Dimensions.get('window');


export const MovieDetailsScreen = observer(function MovieDetailsScreen() {
  const navigation = useNavigation()
  const { moviesStore } = useStores();
  const { movieDetail, cast } = moviesStore;
  return (
      <ScrollView style={styles.container}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={back} style={styles.backImage} />
        </TouchableOpacity>
        
        <Image source={{ uri: "https://image.tmdb.org/t/p/w500" + movieDetail.poster_path }} style={styles.postImage} />

        <Text style={styles.titleText}>{movieDetail.title}</Text>

        <Text style={styles.ratingText}>{parseInt(movieDetail.vote_average * 10) + "%"}</Text>

        <Text style={styles.overViewText}>{'Overview'}</Text>

        <Text style={styles.detailsText}>{movieDetail.overview}</Text>

        <Text style={styles.overViewText}>{'Genres'}</Text>

        <Text style={styles.textMargin}>
          {movieDetail.genres.map((ele,key) => {
            return <View key={key} style={styles.paddingView}><View
              style={styles.genreView}>
              <Text style={styles.textBlack}>{ele.name}</Text>
            </View></View>
          })}
        </Text>

        <Text style={styles.overViewText}>{'Criedts'}</Text>

        <ScrollView style={styles.ScrollViewStyle} horizontal>
          {cast.map((ele,key) => {
            console.log("****ele",ele)
            return <View  key={key}  style={styles.cridetView}>
              {ele.profile_path ? 
              <Image source={{ uri: "https://image.tmdb.org/t/p/w500" + ele.profile_path }}
                style={styles.cridetImage} resizeMode={'cover'} /> : 
                <Image source={unknown}
                style={styles.cridetImage} resizeMode={'cover'} /> }
              <Text style={styles.cridetText}>{ele.name}</Text>
            </View>
          })}
        </ScrollView>
      </ScrollView>
  )
})

const styles = StyleSheet.create({
  container:{
    flex: 1,
    height:height
  },
  ratingText: {
    alignSelf: 'center',
    color: "#44bd32",
    fontWeight: '700',
    fontSize: 20,
    marginTop: '5%'
  },
  textMargin: { marginTop: '2%', width: '90%', alignSelf: 'center' },
  paddingView: {
    paddingRight: 7,
    paddingTop: 7
  },
  genreView: {
    backgroundColor: '#dcdde1',
    height: 30,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlack: { color: "black", fontWeight: 'bold' },
  backButton: { marginTop: '5%', marginLeft: '5%' },
  backImage: { height: 25, width: 25 },
  postImage: {
    height: 230,
    width: '38%',
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 10
  },
  titleText: {
    marginTop: '10%',
    color: 'black',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold'
  },
  overViewText: {
    marginTop: '5%',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '3%'
  },
  detailsText: {
    width: '90%',
    alignSelf: 'center',
    textAlign: 'left',
    color: '#666666',
    marginTop: '2%',
    fontSize: 16,
    fontWeight: '600'
  },
  ScrollViewStyle: {
    height: 120,
    width: '100%',
    marginTop: '3%',
    paddingLeft: '3%',
    marginBottom: 10
  },
  cridetView: {
    minWidth: 100,
    height: 120,
    marginRight: 10,
    alignItems: 'center'
  },
  cridetText: {
    color: 'black',
    marginTop: 5,
    fontWeight: '700',
    textAlign: 'center'
  },
  cridetImage: {
    height: 70,
    width: 70,
    backgroundColor: 'black',
    borderRadius: 70 / 2
  }
})