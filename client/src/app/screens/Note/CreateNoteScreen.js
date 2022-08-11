import React, { useState, useEffect } from "react";
import { Text, ScrollView, View, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";

import Header from "../../components/Header";
import Dropdown from "../../components/Dropdown";
import ImageBrowser from "../../components/Note/ImageBrowser";
import ImageCarousel from "../../components/Note/ImageCarousel";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

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
        <SafeAreaView style={ContainerStyles.containerScroll}>
            <Header navigation={props.navigation} />
            <ScrollView style={ContainerStyles.screen}>

                <Text style={FontStyles.pageTitle}>New Note</Text>

                {
                    errorMessage !== "" ?
                        <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                        : null
                }

                <Text style={FontStyles.subtitle}>Title</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Your Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={FontStyles.subtitle}>Plot</Text>
                <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" />

                <Text style={FontStyles.subtitle}>Description</Text>
                <TextInput
                    style={[InputStyles.textInput, styles.textInputLarge]}
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Your description..."
                    value={description}
                    onChangeText={setDescription}
                />

                <TouchableOpacity style={ButtonStyles.largeButton} onPress={() => setImageBrowserOpen(true)}>
                    <Text style={ButtonStyles.buttonText}>ADD PHOTOS</Text>
                </TouchableOpacity>

                {
                    photos.length !== 0 ?
                        <ImageCarousel style={[ContainerStyles.centered, { marginVertical: 20 }]} data={photos} styling="large" />
                        : null
                }

                <View style={ButtonStyles.buttonContainer}>

                    <TouchableOpacity style={ButtonStyles.smallWarningButton} onPress={() => {
                        clearState();
                        props.navigation.navigate("Calendar");
                    }}>
                        <Text style={ButtonStyles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ButtonStyles.smallButton} onPress={async () => await createNote(props, title, description, selectedPlot)}>
                        <Text style={ButtonStyles.buttonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textInputLarge: {
        height: hp("8.5%")
    }
});

export default CreateNoteScreen;