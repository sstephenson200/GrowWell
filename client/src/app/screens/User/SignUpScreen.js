import React, { useState, useContext } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import axios from "axios";

import AuthContext from "../../context/AuthContext";

const SignUpScreen = (props) => {

    const { checkLoggedIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
        setErrorMessage("");
    }

    //Function to create a new user and automatically log them into their account
    async function createUser(props) {
        try {
            const response = await axios.post("/user/createUser", {
                "email": email,
                "password": password,
                "passwordVerify": passwordConfirmation
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    await checkLoggedIn();
                    props.navigation.navigate("StackNavigator", { screen: "CreateGarden" });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                    keyboardType="email-address"
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

                <Text style={styles.subtitle}>Confirm Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                />

                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={styles.button} onPress={async () => await createUser(props)}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <Image style={styles.logo} source={require("../../assets/images/logo.png")} />

        </ScrollView>
    );
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
        height: 500,
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