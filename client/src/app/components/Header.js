import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = (props) => {
    return (
        <View style={styles.headerBar}>

            <Image style={styles.logo} source={require("../assets/images/logo.png")} />

            <TouchableOpacity
                style={styles.icon}
                onPress={() => props.navigation.navigate("StackNavigator", { screen: "Settings" })}
            >
                <Ionicons name="settings-sharp" size={40} color="white" />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    headerBar: {
        width: "100%",
        height: 85,
        backgroundColor: "#81BF63",
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "nowrap",
        paddingHorizontal: 10
    },
    logo: {
        width: 55,
        height: 55,
        marginTop: 25
    },
    icon: {
        marginTop: 30
    }
});

export default Header;