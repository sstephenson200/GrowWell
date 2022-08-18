import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import axios from "axios";

import { CancelNotification } from "../../notifications/PushNotification";

import Header from "../../components/Header";
import Dropdown from "../../components/Dropdown";
import GardenGrid from "../../components/Garden/GardenGrid";

import ContainerStyles from "../../styles/ContainerStyles";
import ModalStyles from "../../styles/ModalStyles";
import FontStyles from "../../styles/FontStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

import GetAllGardens from "../../requests/Garden/GetAllGardens";

const GardenScreen = (props) => {

    const [gardens, setGardens] = useState([]);
    const [selectedGarden, setSelectedGarden] = useState(null);
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [deletedGarden, setDeletedGarden] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getGardens();
    }, [deletedGarden, props]);

    //Show/hide modal for processing garden deletion
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    //Call GetAllGardens to fill "Select Plot" dropdown
    async function getGardens() {
        setGardens(await GetAllGardens("gardenPlots"));
    }

    //Request to delete the selected garden
    async function deleteGarden() {
        try {
            const response = await axios.delete("/garden/deleteGarden", {
                data: {
                    "garden_id": selectedGarden,
                    "password": password
                }
            }, { responseType: "json" });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    if (response.data.alarms !== undefined && response.data.alarms.length !== 0) {
                        //Cancel notifications linked to deleted garden
                        for (let i = 0; i < response.data.alarms.length; i++) {
                            let id = response.data.alarms[i].notification_id;
                            await CancelNotification(id);
                        }
                    }
                    //Trigger page refresh
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

    return (
        <SafeAreaView style={ContainerStyles.containerScroll}>
            <Header navigation={props.navigation} />
            <ScrollView style={ContainerStyles.screen} contentContainerStyle={{ flexGrow: 1 }}>

                <Modal
                    isVisible={modalVisible}
                    backdropOpacity={0.5}
                    onBackdropPress={toggleModal}
                    style={ModalStyles.modal}
                >
                    <View>

                        <Text style={FontStyles.modalWarning}>You are about to delete this garden.</Text>
                        <Text style={FontStyles.textCenter}>Are you sure? This will remove all related notes and alarms.</Text>

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

                            <TouchableOpacity style={ButtonStyles.smallWarningButton} onPress={deleteGarden}>
                                <Text style={ButtonStyles.buttonText}>DELETE</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>

                <Text style={FontStyles.pageTitle}>Your Garden</Text>

                <Dropdown gardens={gardens} selected={[selectedGarden, setSelectedGarden]} placeholder="Select Garden" />

                <TouchableOpacity style={ButtonStyles.largeButton} onPress={() => props.navigation.navigate("StackNavigator", { screen: "CreateGarden" })}>
                    <Text style={ButtonStyles.buttonText}>ADD NEW GARDEN</Text>
                </TouchableOpacity>

                {
                    selectedGarden !== null ?

                        <View testID="gardenGrid" style={[ContainerStyles.centered, { marginBottom: 10 }]}>
                            <ScrollView horizontal={true}>
                                {
                                    props.route.params !== undefined && props.route.params.updatePlot !== undefined ?
                                        <GardenGrid garden_id={selectedGarden} navigation={props.navigation} updated={props.route.params.updatePlot}></GardenGrid>
                                        :
                                        <GardenGrid garden_id={selectedGarden} navigation={props.navigation}></GardenGrid>
                                }
                            </ScrollView>

                            <View>
                                <TouchableOpacity style={ButtonStyles.largeWarningButton} onPress={toggleModal}>
                                    <Text style={ButtonStyles.buttonText}>DELETE GARDEN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        : <Text testID="unselectedMessage" style={FontStyles.largeTextCenter}>Garden not selected</Text>
                }

            </ScrollView >
        </SafeAreaView >
    );
}

export default GardenScreen;