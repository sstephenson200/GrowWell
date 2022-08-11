import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

const Header = (props) => {
    return (
        <View style={styles.headerBar}>

            <Image style={styles.logo} source={require("../assets/images/logo.png")} />

            <TouchableOpacity
                style={styles.icon}
                onPress={() => props.navigation.navigate("StackNavigator", { screen: "Settings" })}
            >
                <Ionicons name="settings-sharp" size={hp("5.5%")} color="white" />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    headerBar: {
        width: "100%",
        height: hp("11%"),
        backgroundColor: "#81BF63",
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "nowrap",
        paddingHorizontal: 10
    },
    logo: {
        height: hp("7%"),
        width: hp("7%"),
        marginTop: hp("3.5%")
    },
    icon: {
        marginTop: hp("4%")
    }
});

export default Header;