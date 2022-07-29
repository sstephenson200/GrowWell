import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

const SignUpScreen = (props) => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
        setName("");
        setPassword("");
        setPasswordConfirmation("");
        setErrorMessage("");
    }

    //add signup request

    return (
        <ScrollView style={styles.screen}>

            <View style={styles.appTitle}>
                <Text style={styles.appMainTitle}>Grow Well</Text>
                <Text style={styles.appSubtitle}>GARDEN MANAGER</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Sign Up</Text>

                <View style={styles.loginOption}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "Login" })}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>

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

                <Text style={styles.subtitle}>Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Your Name"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.subtitle}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.subtitle}>Confirm Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                />

                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={styles.button} onPress={async () => alert("Ready to sign up")}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <Image style={styles.logo} source={require("../assets/images/logo.png")} />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#81BF63"
    },
    appTitle: {
        paddingVertical: 25
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
        height: 600,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#EFF5E4",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "grey"
    },
    loginOption: {
        paddingTop: 5,
        alignSelf: "center"
    },
    loginText: {
        paddingHorizontal: 2.5,
        fontSize: 15,
        textAlign: "center"
    },
    loginLink: {
        paddingHorizontal: 2.5,
        fontSize: 15,
        color: "#9477B4",
        textAlign: "center"
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
        alignSelf: "center",
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
    buttonText: {
        color: "white",
        fontSize: 16
    },
    logo: {
        alignSelf: "center",
        width: 100,
        height: 100,
        marginVertical: 25
    }
});

export default SignUpScreen;