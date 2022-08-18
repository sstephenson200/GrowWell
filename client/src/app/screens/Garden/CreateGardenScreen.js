import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import axios from "axios";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

const CreateGardenScreen = (props) => {

    const [name, setName] = useState("");
    const [length, setLength] = useState(null);
    const [width, setWidth] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setName("");
        setWidth(null);
        setLength(null);
        setErrorMessage("");
    }

    async function createGarden(props, gardenName, length, width) {
        try {
            const response = await axios.post("/garden/createGarden", {
                "length": length,
                "width": width,
                "name": gardenName
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    props.navigation.navigate("Garden", { created: true });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <ScrollView style={ContainerStyles.formScreen}>

            <View style={[ContainerStyles.form, { marginTop: "15%" }]}>
                <Text style={FontStyles.pageTitle}>Create Your</Text>
                <Text style={FontStyles.pageTitle}>Garden</Text>

                {
                    errorMessage !== "" ?
                        <Text testID="errorMessage" style={FontStyles.errorMessage}>{errorMessage}</Text>
                        : null
                }

                <Text style={FontStyles.subtitle}>Garden Name</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Your Garden"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={FontStyles.subtitle}>Width</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Width (m)"
                    keyboardType="numeric"
                    value={width}
                    onChangeText={setWidth}
                />

                <Text style={FontStyles.subtitle}>Length</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Length (m)"
                    keyboardType="numeric"
                    value={length}
                    onChangeText={setLength}
                />

                <View style={ButtonStyles.buttonContainer}>

                    <TouchableOpacity testID="cancelButton" style={ButtonStyles.smallWarningButton} onPress={() => {
                        clearState();
                        props.navigation.navigate("Garden");
                    }}>
                        <Text style={ButtonStyles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity testID="saveButton" style={ButtonStyles.smallButton} onPress={async () => await createGarden(props, name, length, width)}>
                        <Text style={ButtonStyles.buttonText}>CREATE</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </ScrollView >
    );
}

export default CreateGardenScreen;