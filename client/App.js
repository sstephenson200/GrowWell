import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Header from './src/app/containers/Header';
import Footer from './src/app/containers/Footer';
import PlantList from './src/app/screens/PlantList';

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between"
  },
  screen: {
    backgroundColor: "#EFF5E4",
    paddingTop: 20,
    paddingHorizontal: 20
  }
})

class App extends Component {

  render() {
    return (
      <View stlye={styles.container}>
        <Header></Header>
        <View style={styles.screen}>
          <Text>Plants</Text>
          <PlantList></PlantList>
        </View>
        <Footer></Footer>
      </View>
    )
  }
}

export default App;