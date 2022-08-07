import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

const CreateGardenScreen = (props) => {

    const [name, setName] = useState("");
    const [length, setLength] = useState(null);
    const [width, setWidth] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    //Function to reset state when leaving the page
    function clearState() {
        setName("");
        setWidth(null);
        setLength(null);
        setErrorMessage("");
    }

    async function createGarden(props, gardenName, length, width) {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/garden/createGarden", {
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

        <View style={styles.screen}>

            <View style={styles.form}>
                <Text style={styles.title}>Create Garden</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Text style={styles.subtitle}>Garden Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Your Garden"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.subtitle}>Width</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Width (m)"
                    keyboardType="numeric"
                    value={width}
                    onChangeText={setWidth}
                />

                <Text style={styles.subtitle}>Length</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Length (m)"
                    keyboardType="numeric"
                    value={length}
                    onChangeText={setLength}
                />

                <View style={styles.navigationButtons}>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        clearState()
                        props.navigation.navigate("Garden")
                    }}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={async () => await createGarden(props, name, length, width)}>
                        <Text style={styles.buttonText}>CREATE</Text>
                    </TouchableOpacity>

                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#81BF63",
        justifyContent: "center"
    },
    form: {
        height: 450,
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#EFF5E4",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "grey"
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
        marginTop: 10
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default CreateGardenScreen;