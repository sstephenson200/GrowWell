import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Header from '../components/Header';

const NewNoteScreen = () => {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.screen}>
                <Text>New Note Screen</Text>
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

export default NewNoteScreen;