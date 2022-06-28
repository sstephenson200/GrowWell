import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 100,
        paddingHorizontal: 10,
        backgroundColor: "#81BF63",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "nowrap",
        paddingTop: 20,
        paddingBottom: 5
    },
    logo: {
        width: 65,
        height: 65,
        marginTop: 10,
        marginBottom: 10
    },
})

const Header = () => {
    return (
        <View style={styles.header}>
            <Image style={styles.logo} source={require("../assets/images/logo.png")} />
            <Ionicons name="settings-sharp" size={40} color="white" />
        </View>
    )
}

export default Header;