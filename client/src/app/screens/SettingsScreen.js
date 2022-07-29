import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import Header from '../components/Header';

const SettingsScreen = (props) => {
    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Text>Settings Screen</Text>

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("StackNavigator", { screen: "Login" })}>
                    <Text style={styles.buttonText}>LOGIN</Text>
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
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 200,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18
    }
});

export default SettingsScreen;