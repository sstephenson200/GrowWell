import React, { useState, useContext } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import axios from "axios";

import AuthContext from "../../context/AuthContext";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import ImageStyles from "../../styles/ImageStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";


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
        <ScrollView style={ContainerStyles.formScreen}>

            <View style={[ContainerStyles.centered, { paddingTop: "8%" }]}>
                <Text style={FontStyles.appTitle}>Grow Well</Text>
                <Text style={FontStyles.appSubtitle}>GARDEN MANAGER</Text>
                <Image style={ImageStyles.loginLogo} source={require("../../assets/images/logo.png")} />
            </View>

            <View style={ContainerStyles.form}>
                <Text style={FontStyles.pageTitle}>Sign Up</Text>

                <View style={ContainerStyles.centered}>
                    <Text style={FontStyles.formText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "Login" })}>
                        <Text style={FontStyles.formLink}>Login</Text>
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

                <Text style={FontStyles.subtitle}>Confirm Password</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                />

                <View style={ContainerStyles.centered}>
                    <TouchableOpacity style={ButtonStyles.largeButton} onPress={async () => await createUser(props)}>
                        <Text style={ButtonStyles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ScrollView>
    );
}

export default SignUpScreen;