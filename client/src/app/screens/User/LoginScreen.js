import React, { useState, useContext } from "react";
import { Text, View, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import axios from "axios";

import AuthContext from "../../context/AuthContext";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import ImageStyles from "../../styles/ImageStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

const LoginScreen = (props) => {

    const { checkLoggedIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setEmail("");
        setPassword("");
        setErrorMessage("");
    }

    //Function to login in the user and reset JWT for auth purposes
    async function login(props) {
        try {
            const response = await axios.post("/user/login", {
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

        <ScrollView style={ContainerStyles.formScreen}>

            <View style={[ContainerStyles.centered, { paddingTop: "8%" }]}>
                <Text style={FontStyles.appTitle}>Grow Well</Text>
                <Text style={FontStyles.appSubtitle}>GARDEN MANAGER</Text>
                <Image style={ImageStyles.loginLogo} source={require("../../assets/images/logo.png")} />
            </View>

            <View style={ContainerStyles.form}>
                <Text style={FontStyles.pageTitle}>Login</Text>

                <View style={ContainerStyles.centered}>
                    <Text style={FontStyles.formText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "SignUp" })}>
                        <Text style={FontStyles.formLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                {
                    errorMessage !== "" ?
                        <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                        : null
                }

                <Text style={FontStyles.subtitle}>Email</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={FontStyles.subtitle}>Password</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <View style={ContainerStyles.centered}>
                    <TouchableOpacity style={ButtonStyles.largeButton} onPress={async () => await login(props)}>
                        <Text style={ButtonStyles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>

                <View style={ContainerStyles.centered}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "PasswordReset" })}>
                        <Text style={FontStyles.formLink}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ScrollView>
    );
}

export default LoginScreen;