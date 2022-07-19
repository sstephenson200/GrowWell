import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

import Header from '../components/Header';
import NoteCard from '../components/NoteCard';

const NoteScreen = (props) => {

    let date = props.route.params.date;
    let notes = props.route.params.notes;

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Text style={styles.title}>{date}</Text>

                <FlatList
                    data={notes}
                    renderItem={({ item }) => {
                        return (
                            <NoteCard note={item} />
                        );
                    }}
                />
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
        backgroundColor: "#EFF5E4",
        paddingBottom: 180
    },
    title: {
        textAlign: "center",
        fontSize: 35,
        fontFamily: "Montserrat",
        paddingTop: 15,
        paddingBottom: 10
    }
});

export default NoteScreen;