import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';

import Header from './src/app/containers/Header';
import Footer from './src/app/containers/Footer';
import PlantList from './src/app/screens/PlantList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  screen: {
    height: "100%",
    backgroundColor: "#EFF5E4"
  }
})

class App extends Component {

  render() {
    return (

      <SafeAreaView stlye={styles.container}>

        <View style={styles.screen}>

          <Header></Header>

          <Text>Plants</Text>
          <PlantList></PlantList>

          <Footer></Footer>

        </View>

      </SafeAreaView>

    )
  }
}

export default App;