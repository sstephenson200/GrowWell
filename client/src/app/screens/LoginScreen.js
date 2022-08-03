import React, { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

import AuthContext from "../context/AuthContext";

const LoginScreen = (props) => {

    const { checkLoggedIn } = useContext(AuthContext);

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

    //Function to create a new user
    async function login(props) {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/user/login", {
                "email": email,
                "password": password
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    await checkLoggedIn();
                    props.navigation.navigate("Garden");
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <View style={styles.screen}>

            <View style={styles.appTitle}>
                <Text style={styles.appMainTitle}>Grow Well</Text>
                <Text style={styles.appSubtitle}>GARDEN MANAGER</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Login</Text>

                <View style={styles.signUpOption}>
                    <Text style={styles.signUpText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "SignUp" })}>
                        <Text style={styles.signUpLink}>Sign Up</Text>
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
                    keyboardType='email-address'
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
                    <TouchableOpacity style={styles.button} onPress={async () => await login(props)}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.signUpOption}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "PasswordReset" })}>
                        <Text style={styles.signUpLink}>Forgot your password?</Text>
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
        height: 450,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#EFF5E4",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "grey"
    },
    signUpOption: {
        paddingTop: 5,
        alignSelf: "center"
    },
    signUpText: {
        paddingHorizontal: 2.5,
        fontSize: 15,
        textAlign: "center"
    },
    signUpLink: {
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
        marginVertical: 35
    }
});

export default LoginScreen;