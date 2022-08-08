import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';

import Header from '../../components/Header';
import AuthContext from "../../context/AuthContext";
import { CancelAllNotifications } from '../../notifications/PushNotification';

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

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setPassword("");
        setErrorMessage("");
    }

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

    async function getUser() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/user/getUser");

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
            const response = await axios.put("https://grow-well-server.herokuapp.com/user/updateEmail", {
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
            const response = await axios.put("https://grow-well-server.herokuapp.com/user/updatePassword", {
                "newPassword": newPassword,
                "newPasswordVerify": newPasswordConfirm,
                "oldPassword": password
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    setNewPassword("");
                    setNewPasswordConfirm("");
                    setModalVisible(false);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Function to update a user's password
    async function deleteUser(props) {
        try {
            const response = await axios.delete("https://grow-well-server.herokuapp.com/user/deleteUser", {
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
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.screen}>

                <Modal
                    isVisible={modalVisible}
                    backdropOpacity={0.5}
                    onBackdropPress={toggleModal}
                    style={styles.modal}
                >
                    <View>

                        <Text style={styles.warning}>{warning}</Text>
                        <Text style={styles.subwarning}>{subwarning}</Text>

                        {
                            errorMessage !== "" ?
                                <Text style={styles.error}>{errorMessage}</Text>
                                : null
                        }

                        <Text style={styles.subtitle}>Password</Text>
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={true}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <View style={styles.navigationButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                                <Text style={styles.buttonText}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => {
                                if (modalType == "email") {
                                    updateEmail();
                                } else if (modalType == "password") {
                                    updatePassword();
                                } else if (modalType == "delete") {
                                    deleteUser(props);
                                }
                            }}>
                                <Text style={styles.buttonText}>CONFIRM</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

                <Text style={styles.title}>Settings</Text>

                <Text style={styles.heading}>Change Your Email</Text>
                <Text style={styles.information}>Make sure we can stay in touch.</Text>

                <Text style={styles.subtitle}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="email@example.com"
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity style={styles.button} onPress={() => {
                    setModalType("email");
                    setModalVisible(true);
                }} >
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Change Your Password</Text>

                <View style={styles.signUpOption}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "PasswordReset" })}>
                        <Text style={styles.signUpLink}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>

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

                <TouchableOpacity style={styles.button} onPress={() => {
                    setModalType("password");
                    setModalVisible(true);
                }}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Delete Account</Text>
                <Text style={styles.information}>We'll be sorry to see you go.</Text>

                <TouchableOpacity style={styles.cancelButton} onPress={() => {
                    setModalType("delete");
                    setModalVisible(true);
                }}>
                    <Text style={styles.buttonText}>DELETE</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Log Out</Text>
                <Text style={styles.information}>See you soon!</Text>

                <TouchableOpacity style={styles.button} onPress={() => logout(props)}>
                    <Text style={styles.buttonText}>LOG OUT</Text>
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
    modal: {
        alignSelf: "stretch",
        flex: 0,
        justifyContent: "center",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 8,
        height: "40%",
        backgroundColor: "white"
    },
    warning: {
        textAlign: "center",
        marginHorizontal: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: "red"
    },
    subwarning: {
        textAlign: "center",
        marginHorizontal: 10,
        fontSize: 15
    },
    title: {
        textAlign: "center",
        fontSize: 35,
        fontFamily: "Montserrat",
        paddingTop: 15,
        paddingBottom: 10
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
        marginLeft: 20
    },
    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold"
    },
    heading: {
        fontSize: 28,
        marginLeft: 20,
        marginVertical: 5
    },
    information: {
        marginLeft: 20,
        marginBottom: 5
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
        marginTop: 30
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
    cancelButton: {
        backgroundColor: "red",
        height: 40,
        width: 150,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18
    }
});

export default SettingsScreen;