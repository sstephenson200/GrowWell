import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

const LoginScreen = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    //Function to reset state when leaving the page
    function clearState() {
        setEmail("");
        setPassword("");
        setErrorMessage("");
    }

    //add login request

    return (
        <View style={styles.screen}>

            <View style={styles.appTitle}>
                <Text style={styles.appMainTitle}>Grow Well</Text>
                <Text style={styles.appSubtitle}>GARDEN MANAGER</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Login</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Text style={styles.subtitle}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="email@example.com"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.subtitle}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={styles.button} onPress={async () => alert("Ready to login")}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <Image style={styles.logo} source={require("../assets/images/logo.png")} />

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#81BF63",
        justifyContent: "center"
    },
    appTitle: {
        paddingVertical: 35
    },
    appMainTitle: {
        textAlign: "center",
        fontSize: 65,
        fontFamily: "Montserrat",
        color: "white"
    },
    appSubtitle: {
        textAlign: "center",
        fontSize: 30,
        fontFamily: "Montserrat",
        color: "white"
    },
    form: {
        height: 350,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#EFF5E4",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "grey"
    },
    title: {
        textAlign: "center",
        fontSize: 35,
        fontFamily: "Montserrat",
        paddingTop: 15,
        paddingBottom: 10
    },
    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 22,
        marginLeft: 20,
        marginVertical: 10
    },
    textInput: {
        width: "90%",
        height: 45,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    navigationButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginTop: 10
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    },
    logo: {
        alignSelf: "center",
        width: 100,
        height: 100,
        marginTop: 35
    }
});

export default LoginScreen;