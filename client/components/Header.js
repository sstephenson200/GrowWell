import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 85,
        paddingHorizontal: 10,
        backgroundColor: "#81BF63",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "nowrap"
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
            <Image style={styles.logo} source={require("../assets/logo.png")} />
            <Ionicons name="settings-sharp" size={40} color="white" />
        </View>
    )
}

export default Header;