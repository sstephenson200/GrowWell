import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Header from './components/Header';
import Footer from './components/Footer';

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

        </View>
        <Footer></Footer>
      </View>
    )
  }
}

export default App;