import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

import Header from '../components/Header';

const SettingsScreen = (props) => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [namePassword, setNamePassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getUser();
    }, [props]);

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    async function getUser() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/user/getUser", {
                "user_id": "62cec6b63dd3dfcf2a4a6185"
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    setEmail(response.data.user.email);
                    setName(response.data.user.username);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.screen}>
                <Text style={styles.title}>Settings</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Text style={styles.heading}>Change Your Email</Text>

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
                    secureTextEntry={true}
                    placeholder="Password"
                    value={emailPassword}
                    onChangeText={setEmailPassword}
                />

                <TouchableOpacity style={styles.button} onPress={() => alert("Ready to update email")}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>


                <Text style={styles.heading}>Change Your Username</Text>

                <Text style={styles.subtitle}>Username</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.subtitle}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={namePassword}
                    onChangeText={setNamePassword}
                />

                <TouchableOpacity style={styles.button} onPress={() => alert("Ready to update name")}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Change Your Password</Text>

                <Text style={styles.subtitle}>Old Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />

                <Text style={styles.subtitle}>New Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <Text style={styles.subtitle}>Confirm Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={newPasswordConfirm}
                    onChangeText={setNewPasswordConfirm}
                />

                <TouchableOpacity style={styles.button} onPress={() => alert("Ready to update password")}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("StackNavigator", { screen: "Login" })}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 85
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
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
    heading: {
        fontSize: 28,
        marginLeft: 20,
        marginVertical: 10
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
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 150,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18
    }
});

export default SettingsScreen;