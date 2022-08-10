import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
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

        <View style={ContainerStyles.formScreen}>

            <View style={[ContainerStyles.form, { marginTop: "15%" }]}>
                <Text style={FontStyles.pageTitle}>Create Your</Text>
                <Text style={FontStyles.pageTitle}>Garden</Text>

                {
                    errorMessage !== "" ?
                        <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
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

                <View style={styles.buttonContainer}>

                    <TouchableOpacity style={ButtonStyles.smallWarningButton} onPress={() => {
                        clearState();
                        props.navigation.navigate("Garden");
                    }}>
                        <Text style={ButtonStyles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ButtonStyles.smallButton} onPress={async () => await createGarden(props, name, length, width)}>
                        <Text style={ButtonStyles.buttonText}>CREATE</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </View >
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginVertical: 10,
        paddingBottom: 55
    }
});

export default CreateGardenScreen;