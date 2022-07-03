import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.screen}>
                <Text>Settings Screen</Text>
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

export default SettingsScreen;