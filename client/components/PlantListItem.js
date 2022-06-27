import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        backgroundColor: "#eee",
        borderColor: "black",
        borderWidth: 1,
        Width: "60%"
    },
    screen: {
        flexDirection: "row",
        marginTop: 30,
        justifyContent: "space-between",
        width: "100%"
    },
    text: {
        color: "black"
    }
})

const PlantListItem = (props) => {
    return (
        <View style={styles.screen}>
            <View style={styles.listItem}>
                <Text style={styles.text}>{props.title}</Text>
            </View>
        </View>
    )
}

export default PlantListItem;