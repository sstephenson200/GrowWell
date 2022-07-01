import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.header}>

            <TouchableOpacity onPress={() => { navigation.navigate("GardenScreen") }}>
                <Image
                    style={styles.logo}
                    source={require("../assets/images/logo.png")}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { navigation.navigate("SettingsScreen") }}>
                <Ionicons name="settings-sharp" size={40} color="white" />
            </TouchableOpacity>

        </View>
    );
}

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
});

export default Header;