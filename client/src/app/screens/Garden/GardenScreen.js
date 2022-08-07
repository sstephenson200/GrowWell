import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { unescape } from 'underscore';

import Header from '../../components/Header';
import Dropdown from "../../components/Dropdown";
import GardenGrid from '../../components/Garden/GardenGrid';
import { CancelNotification } from '../../notifications/PushNotification';

const GardenScreen = (props) => {

    const [gardens, setGardens] = useState([]);
    const [selectedGarden, setSelectedGarden] = useState(null);
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [deletedGarden, setDeletedGarden] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    async function getGardens() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/garden/getAllGardens", { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                let userGardens = response.data.gardens;
                let gardenLabels = [];

                if (userGardens !== null) {
                    userGardens.forEach((garden) => {
                        let name = garden.name;
                        name = unescape(name);
                        let garden_id = garden._id;
                        let entry = { label: name, value: garden_id };
                        gardenLabels.push(entry);
                    });
                }
                setGardens(gardenLabels);
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteGarden() {
        try {
            const response = await axios.delete("https://grow-well-server.herokuapp.com/garden/deleteGarden", {
                data: {
                    "garden_id": selectedGarden,
                    "password": password
                }
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    if (response.data.alarms !== undefined && response.data.alarms.length !== 0) {
                        for (let i = 0; i < response.data.alarms.length; i++) {
                            let id = response.data.alarms[i].notification_id;
                            await CancelNotification(id);
                        }
                    }
                    setModalVisible(false);
                    setPassword("");
                    setDeletedGarden(!deletedGarden);
                    setSelectedGarden(null);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGardens();
    }, [deletedGarden, props]);

    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }}>

                <Modal
                    isVisible={modalVisible}
                    backdropOpacity={0.5}
                    onBackdropPress={toggleModal}
                    style={styles.modal}
                >
                    <View>

                        <Text style={styles.warning}>You are about to delete this garden.</Text>
                        <Text style={styles.subwarning}>Are you sure? This will remove all related notes and alarms.</Text>

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

                            <TouchableOpacity style={styles.cancelButton} onPress={deleteGarden}>
                                <Text style={styles.buttonText}>DELETE</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

                <Text style={styles.title}>Your Garden</Text>

                <Dropdown gardens={gardens} selected={[selectedGarden, setSelectedGarden]} placeholder="Select Garden" styling="largeDropdown" />

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("StackNavigator", { screen: "CreateGarden" })}>
                    <Text style={styles.buttonText}>ADD NEW GARDEN</Text>
                </TouchableOpacity>

                {
                    selectedGarden !== null ?

                        <View style={styles.grid}>
                            <ScrollView horizontal={true}>
                                {
                                    props.route.params !== undefined && props.route.params.updatePlot !== undefined ?
                                        <GardenGrid garden_id={selectedGarden} navigation={props.navigation} updated={props.route.params.updatePlot}></GardenGrid>
                                        :
                                        <GardenGrid garden_id={selectedGarden} navigation={props.navigation}></GardenGrid>
                                }
                            </ScrollView>

                            <View>
                                <TouchableOpacity style={styles.deleteButton} onPress={toggleModal}>
                                    <Text style={styles.buttonText}>DELETE GARDEN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        : <Text style={styles.text}>Garden not selected</Text>
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        marginTop: 10
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
    navigationButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginTop: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 15
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat"
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
        alignSelf: "center",
        marginBottom: 20
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 200,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18
    },
    grid: {
        alignItems: "center",
        marginBottom: 85
    },
    deleteButton: {
        backgroundColor: "red",
        height: 40,
        width: 200,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 15
    },
    text: {
        textAlign: "center",
        fontSize: 20
    }
});

export default GardenScreen;