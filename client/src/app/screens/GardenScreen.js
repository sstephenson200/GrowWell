import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import Header from '../components/Header';

const GardenScreen = (props) => {
    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Text>Garden Screen</Text>
                <TouchableOpacity style={{ backgroundColor: "red" }} onPress={() => props.navigation.navigate("StackNavigator", { screen: "CreateGarden" })}>
                    <Text>CREATE GARDEN</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
    }
});

export default GardenScreen;