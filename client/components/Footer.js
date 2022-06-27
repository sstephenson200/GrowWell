import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
    footer: {
        width: "100%",
        height: 85,
        paddingHorizontal: 10,
        backgroundColor: "#81BF63",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "nowrap"
    }
})

const Footer = () => {
    return (
        <View style={styles.footer}>
            <FontAwesome name="calendar" size={40} color="white" />
            <FontAwesome name="book" size={40} color="white" />
            <FontAwesome name="home" size={40} color="white" />
            <Ionicons name="ios-alarm" size={40} color="white" />
            <Ionicons name="leaf" size={40} color="white" />
        </View>
    )
}

export default Footer;