import React, { useState, useEffect, useContext } from "react";
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Modal from "react-native-modal";
import axios from "axios";

import { CancelAllNotifications } from "../../notifications/PushNotification";

import AuthContext from "../../context/AuthContext";

import Header from "../../components/Header";

import ContainerStyles from "../../styles/ContainerStyles";
import ModalStyles from "../../styles/ModalStyles";
import FontStyles from "../../styles/FontStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

import Logout from "../../requests/User/Logout";

const SettingsScreen = (props) => {

    const { checkLoggedIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    let warning = "";
    let subwarning = "";

    //Set modal content based on login detail change type - email/password
    if (modalType == "email" || modalType == "password") {
        warning = "You are about to update your login details.";
        subwarning = "Are you sure? You will need this information to login from now on.";
    } else if (modalType == "delete") {
        warning = "You are about to delete your account.";
        subwarning = "Are you sure? You won't be able to recover your account!";
    }

    useEffect(() => {
        getUser();
    }, [props]);

    //Show/hide modal for processing user login detail changes
    const toggleModal = () => {
        setModalVisible(!modalVisible);
        //Clear password from all modals on close
        setPassword("");
        setErrorMessage("");
    }

    //Function to get user details for use in updating user login details
    async function getUser() {
        try {
            const response = await axios.post("/user/getUser");

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    setEmail(response.data.user.email);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Function to update a user's email address
    async function updateEmail() {
        try {
            const response = await axios.put("/user/updateEmail", {
                "email": email,
                "password": password
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    setModalVisible(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Function to update a user's password
    async function updatePassword() {
        try {
            const response = await axios.put("/user/updatePassword", {
                "newPassword": newPassword,
                "newPasswordVerify": newPasswordConfirm,
                "oldPassword": password
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    //Clear password modal content on close
                    setNewPassword("");
                    setNewPasswordConfirm("");
                    setModalVisible(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Function to delete a user account
    async function deleteUser(props) {
        try {
            const response = await axios.delete("/user/deleteUser", {
                data: {
                    "password": password
                }
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    setModalVisible(false);
                    CancelAllNotifications();
                    logout(props);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Function to log user out of account and invalidate JWT
    async function logout(props, reset) {
        let error = (await Logout());
        if (error !== undefined) {
            setErrorMessage(error);
        } else {
            checkLoggedIn();
            if (reset !== undefined) {
                props.navigation.navigate("StackNavigator", { screen: "PasswordReset" });
            } else {
                props.navigation.navigate("StackNavigator", { screen: "Login" });
            }
        }
    }

    return (
        <SafeAreaView style={ContainerStyles.containerScroll}>
            <Header navigation={props.navigation} />
            <ScrollView style={ContainerStyles.screen}>

                <Modal
                    isVisible={modalVisible}
                    backdropOpacity={0.5}
                    onBackdropPress={toggleModal}
                    style={ModalStyles.modal}
                >
                    <View>

                        <Text style={FontStyles.modalWarning}>{warning}</Text>
                        <Text style={FontStyles.textCenter}>{subwarning}</Text>

                        {
                            errorMessage !== "" ?
                                <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                                : null
                        }

                        <Text style={FontStyles.subtitle}>Password</Text>
                        <TextInput
                            style={InputStyles.textInput}
                            secureTextEntry={true}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <View style={ButtonStyles.modalButtonContainer}>
                            <TouchableOpacity style={ButtonStyles.smallWarningButton} onPress={toggleModal}>
                                <Text style={ButtonStyles.buttonText}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={ButtonStyles.smallWarningButton} onPress={() => {
                                if (modalType == "email") {
                                    updateEmail();
                                } else if (modalType == "password") {
                                    updatePassword();
                                } else if (modalType == "delete") {
                                    deleteUser(props);
                                }
                            }}>
                                <Text style={ButtonStyles.buttonText}>CONFIRM</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

                <Text style={FontStyles.pageTitle}>Settings</Text>

                <Text style={styles.heading}>Change Your Email</Text>
                <Text style={styles.information}>Make sure we can stay in touch.</Text>

                <Text style={FontStyles.subtitle}>Email</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity style={ButtonStyles.largeButton} onPress={() => {
                    setModalType("email");
                    setModalVisible(true);
                }} >
                    <Text style={ButtonStyles.buttonText}>SAVE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Change Your Password</Text>

                <TouchableOpacity onPress={() => logout(props, true)} >
                    <Text style={FontStyles.formLink}>Forgot your password?</Text>
                </TouchableOpacity>

                <Text style={FontStyles.subtitle}>New Password</Text>
                <TextInput
                    style={InputStyles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <Text style={FontStyles.subtitle}>Confirm Password</Text>
                <TextInput
                    style={InputStyles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={newPasswordConfirm}
                    onChangeText={setNewPasswordConfirm}
                />

                <TouchableOpacity style={ButtonStyles.largeButton} onPress={() => {
                    setModalType("password");
                    setModalVisible(true);
                }}>
                    <Text style={ButtonStyles.buttonText}>SAVE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Delete Account</Text>
                <Text style={styles.information}>We"ll be sorry to see you go.</Text>

                <TouchableOpacity style={ButtonStyles.largeWarningButton} onPress={() => {
                    setModalType("delete");
                    setModalVisible(true);
                }}>
                    <Text style={ButtonStyles.buttonText}>DELETE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Log Out</Text>
                <Text style={styles.information}>See you soon!</Text>

                <TouchableOpacity style={[ButtonStyles.largeButton, { marginBottom: 25 }]} onPress={() => logout(props)}>
                    <Text style={ButtonStyles.buttonText}>LOG OUT</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: hp("3%"),
        marginLeft: 20,
        marginVertical: 5
    },
    information: {
        marginLeft: 20,
        marginBottom: 5
    }
});

export default SettingsScreen;