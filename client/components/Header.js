import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 100,
        padingTop: 40,
        backgroundColor: "#81BF63",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    logo: {
        width: 65,
        height: 65,
        marginTop: 15,
        marginBottom: 10
    }
})

const Header = () => {
    return (
        <View style={styles.header}>

            <Image style={styles.logo} source={require("../assets/logo.png")} />


        </View>
    )
}

export default Header;