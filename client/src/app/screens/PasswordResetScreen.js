import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

const PasswordReset = (props) => {

    const [email, setEmail] = useState("");
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
        setErrorMessage("");
    }

    //Function to create a new user
    async function resetPassword(props) {
        try {
            const response = await axios.put("https://grow-well-server.herokuapp.com/user/resetPassword", {
                "email": email
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    logout(props);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Function to log out the user by clearing loggedIn cookies
    async function logout(props) {

        try {
            const response = await axios.get("https://grow-well-server.herokuapp.com/user/logout");

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    checkLoggedIn();
                    props.navigation.navigate("StackNavigator", { screen: "Login" });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <View style={styles.screen}>

            <View style={styles.form}>
                <Text style={styles.title}>Password Reset</Text>

                <Text style={styles.resetInfo}>We'll email you with your new password shortly.</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Text style={styles.subtitle}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="example@email.com"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={styles.navigationButtons}>

                    <TouchableOpacity style={styles.button} onPress={async () => await resetPassword(props)}>
                        <Text style={styles.buttonText}>RESET PASSWORD</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#81BF63",
        justifyContent: "center"
    },
    form: {
        height: 300,
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
    resetInfo: {
        fontSize: 15,
        paddingVertical: 10,
        textAlign: "center",
        paddingHorizontal: 10
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
        width: 150,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default PasswordReset;