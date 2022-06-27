import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';

import Header from './components/Header';
import PlantListItem from "./components/PlantListItem";

const styles = StyleSheet.create({
  screen: {
    paddingTop: 70,
    paddingHorizontal: 70
  },
  screenList: {
    marginLeft: 20,
    marginRight: 20
  }
})

class App extends Component {

  //get plant data

  render() {
    return (
      <View>
        <Header></Header>
        <View style={styles.screen}>
          <View style={styles.screenList}>
            <FlatList>
              <PlantListItem title="Cabbage" />
              <PlantListItem title="Tomato" />
              <PlantListItem title="Parsnip" />
            </FlatList>
          </View>
        </View>
      </View>
    )
  }
}

export default App;