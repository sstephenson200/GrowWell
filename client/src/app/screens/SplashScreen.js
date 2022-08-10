import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const SplashScreen = () => {

    useEffect(() => {
        //Set timer to allow auth methods time to complete before app render
        const timer = setTimeout(() => { }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (

        <View style={styles.screen}>
            <Image style={styles.logo} source={require("../assets/images/logo.png")} />
        </View >
    )
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#81BF63",
        justifyContent: "center"
    },
    logo: {
        alignSelf: "center",
        width: 150,
        height: 150
    }
});

export default SplashScreen;