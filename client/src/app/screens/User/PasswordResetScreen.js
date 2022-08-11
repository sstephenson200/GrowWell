import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

import Logout from "../../requests/User/Logout";

const PasswordReset = (props) => {

    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setEmail("");
        setErrorMessage("");
    }

    //Function to reset a user's password to a randomly generated password
    //This method also triggers a password reset email being sent to the user
    async function resetPassword(props) {
        try {
            const response = await axios.put("/user/resetPassword", {
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

    //Function to log user out of account and invalidate JWT
    async function logout(props) {
        let error = (await Logout());
        if (error !== undefined) {
            setErrorMessage(error);
        } else {
            checkLoggedIn();
            props.navigation.navigate("StackNavigator", { screen: "Login" });
        }
    }

    return (

        <View style={[ContainerStyles.formScreen, { justifyContent: "center" }]}>

            <View style={ContainerStyles.form}>
                <Text style={FontStyles.pageTitle}>Password Reset</Text>

                <Text style={styles.resetInfo}>We'll email you with your new password shortly.</Text>

                {
                    errorMessage !== "" ?
                        <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                        : null
                }

                <Text style={FontStyles.subtitle}>Email</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="example@email.com"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={ContainerStyles.centered}>

                    <TouchableOpacity style={ButtonStyles.largeButton} onPress={async () => await resetPassword(props)}>
                        <Text style={ButtonStyles.buttonText}>RESET PASSWORD</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    resetInfo: {
        fontSize: hp("2%"),
        paddingVertical: 10,
        textAlign: "center",
        paddingHorizontal: 10
    }
});

export default PasswordReset;