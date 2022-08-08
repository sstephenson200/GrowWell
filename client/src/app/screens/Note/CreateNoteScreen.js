import React, { useState, useEffect } from "react";
import { Text, ScrollView, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

import Header from "../../components/Header";
import Dropdown from "../../components/Dropdown";
import ImageBrowser from "../../components/Note/ImageBrowser";
import ImageCarousel from "../../components/Note/ImageCarousel";

import GetAllGardens from "../../requests/Garden/GetAllGardens";

const CreateNoteScreen = (props) => {

    const [title, setTitle] = useState("");
    const [plots, setPlots] = useState([]);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [imageBrowserOpen, setImageBrowserOpen] = useState(false);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        getPlots();
    }, []);

    //Function to reset state when leaving the page
    function clearState() {
        setTitle("");
        setDescription("");
        setErrorMessage("");
        setSelectedPlot(null);
        setPhotos([]);
    }

    //Call GetAllGardens to fill plot selection dropdown
    async function getPlots() {
        setPlots(await GetAllGardens("allPlots"));
    }

    //Function to create a new note with given form data, including images
    async function createNote(props, title, description, selectedPlot) {

        let noteDetails = {
            "title": title
        }

        //Add optional form data
        if (description !== "") {
            noteDetails.description = description;
        }

        if (selectedPlot !== null) {
            let gardenData = selectedPlot.split(":");
            let garden_id = gardenData[0];
            let plot_number = gardenData[1];
            noteDetails.garden_id = garden_id;
            noteDetails.plot_number = plot_number;
        }

        let formData = new FormData();
        formData.append("note", JSON.stringify(noteDetails));

        //Add selected images to form data
        if (photos.length !== 0) {
            for (let i = 0; i < photos.length; i++) {
                //Ensure provided images are valid
                let localUri = photos[i].uri;
                let filename = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                formData.append("file", {
                    uri: localUri,
                    name: filename,
                    type
                });
            }
        }

        try {
            const response = await axios.post("/note/createNote", formData, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    props.navigation.navigate("Calendar", { params: { updated: true } });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //On selection of images, close the image browser and set photos variable
    const imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            setImageBrowserOpen(false);
            setPhotos(photos);
        });
    }

    //Render image browser when requested 
    if (imageBrowserOpen) {
        return (
            <ImageBrowser
                max={3}
                callback={imageBrowserCallback}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.screen}>

                <Text style={styles.title}>New Note</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Text style={styles.subtitle}>Title</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Your Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.subtitle}>Plot</Text>
                <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" />

                <Text style={styles.subtitle}>Description</Text>
                <TextInput
                    style={styles.textInputLarge}
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Your description..."
                    value={description}
                    onChangeText={setDescription}
                />

                <TouchableOpacity style={styles.addPhotosButton} onPress={() => setImageBrowserOpen(true)}>
                    <Text style={styles.buttonText}>ADD PHOTOS</Text>
                </TouchableOpacity>

                {
                    photos.length !== 0 ?
                        <ImageCarousel style={styles.carousel} data={photos} styling="large" />
                        : null
                }

                <View style={styles.navigationButtons}>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        clearState();
                        props.navigation.navigate("Calendar");
                    }}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={async () => await createNote(props, title, description, selectedPlot)}>
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 85
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat",
        paddingTop: 10
    },
    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 22,
        marginLeft: 20,
        marginTop: 10
    },
    textInput: {
        width: "90%",
        height: 45,
        margin: 8,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    textInputLarge: {
        width: "90%",
        height: 60,
        margin: 8,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    addPhotosButton: {
        backgroundColor: "#9477B4",
        height: 45,
        width: 130,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 15
    },
    carousel: {
        alignItems: "center",
        marginVertical: 10,
    },
    navigationButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginVertical: 15
    },
    button: {
        backgroundColor: "#9477B4",
        height: 45,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 45,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default CreateNoteScreen;