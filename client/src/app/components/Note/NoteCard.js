import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
const moment = require("moment");
import axios from "axios";
import { unescape } from "underscore";

import ImageCarousel from "./ImageCarousel";
import ImageSelect from "../Plant/SearchableImages";

import GetGardenByID from "../../requests/Garden/GetGardenByID";
import GetPlantByID from "../../requests/Plant/GetPlantByID";

const NoteCard = (props) => {

    const [gardenName, setGardenName] = useState(null);
    const [plantName, setPlantName] = useState(null);
    const [notePhotos, setNotePhotos] = useState([]);

    //Initialise provided data from implementing screen
    let date = moment(props.note.date).format("DD MMM YYYY");
    let title = props.note.title;
    title = unescape(title);
    let description = props.note.description;
    description = unescape(description);
    let garden_id = props.note.garden_id;
    let plot_number = props.note.plot_number;
    let plant_id = props.note.plant_id;

    useEffect(() => {
        //setNotePhotos([]);
        if (plant_id !== null) {
            getPlant();
        }
        if (garden_id !== null) {
            getGarden();
        }
        if (props.note.image.length > 0) {
            setNotePhotos([]);
            getImages();
        }
    }, [props]);

    //Function to get garden name for use in note display
    async function getGarden() {
        setGardenName(await (GetGardenByID(garden_id, "name")));
    }

    //Function to get plant name for use in title and icon selection
    async function getPlant() {
        setPlantName(await GetPlantByID(plant_id, "name"));
    }

    //Function to convert note images to base64 format for rendering
    const getImages = async () => {

        let photos = [];

        let fileReaderInstance = new FileReader();

        for (let i = 0; i < props.note.image.length; i++) {

            let id = props.note.image[i];
            let blob = await axios.post("/plant/getImageByID", {
                image_id: id
            }, { responseType: "blob" });

            let base64Image = null;
            fileReaderInstance.readAsDataURL(blob.data);
            fileReaderInstance.onload = async () => {
                base64Image = fileReaderInstance.result;
                photos.push(base64Image);
            }
        }

        fileReaderInstance.onloadend = () => {
            setNotePhotos(photos);
        }
    }

    return (
        <View style={styles.card}>

            {
                notePhotos.length == 0 ?
                    <View style={styles.cardContent}>

                        <View style={styles.cardHeader}>
                            <Text style={styles.noteTitle}>{title}</Text>
                            <Text style={styles.headerText}>{date}</Text>
                        </View>

                        {
                            garden_id !== null ?
                                <View style={styles.cardHeader}>
                                    <Text style={styles.headerText}>{gardenName}, Plot {plot_number + 1}</Text>

                                    {plantName !== null ?
                                        <View style={styles.plant}>
                                            <Text style={styles.headerText}>{plantName} </Text>
                                            <Image
                                                style={styles.icon}
                                                source={ImageSelect({ name: plantName })}
                                            />
                                        </View>
                                        : null
                                    }

                                </View>
                                : null
                        }

                        {
                            description !== null ?
                                <Text style={styles.description}>{description}</Text>
                                : null
                        }

                    </View>
                    :
                    <View>
                        <View style={styles.cardContentWithImage}>

                            <View style={styles.noteData}>
                                <Text style={styles.noteTitle}>{title}</Text>
                                <Text>{date}</Text>

                                {
                                    garden_id !== null ?
                                        <View>
                                            <Text style={styles.spacing}>{gardenName}, Plot {plot_number + 1}</Text>

                                            {plantName !== null ?
                                                <View style={[styles.plant, styles.spacing]}>
                                                    <Text>{plantName}</Text>
                                                    <Image
                                                        style={styles.icon}
                                                        source={ImageSelect({ name: plantName })}
                                                    />
                                                </View>
                                                : null
                                            }

                                        </View>
                                        : null
                                }

                            </View>

                            <ImageCarousel style={styles.carousel} data={notePhotos} />

                        </View>

                        {
                            description !== null ?
                                <View>
                                    <Text style={styles.description}>{description}</Text>
                                </View>
                                : null
                        }

                    </View>
            }

        </View>

    );
}

const styles = StyleSheet.create({
    card: {
        alignSelf: "stretch",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: "white"
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 20,
        alignItems: "center"
    },
    cardContentWithImage: {
        marginHorizontal: 18,
        marginVertical: 20,
        flexDirection: "row",
        flex: 2,
        justifyContent: "space-between"
    },
    cardHeader: {
        flexDirection: "row",
        flex: 2,
    },
    headerText: {
        marginHorizontal: 20,
        marginVertical: 2
    },
    plant: {
        flexDirection: "row",
        flex: 2
    },
    icon: {
        width: 25,
        height: 25
    },
    noteData: {
        width: "50%"
    },
    noteTitle: {
        fontSize: 15,
        fontWeight: "bold"
    },
    carousel: {
        alignContent: "flex-end"
    },
    spacing: {
        marginVertical: 2
    },
    description: {
        textAlign: "justify",
        alignSelf: "center",
        marginHorizontal: 10,
        marginBottom: 10
    }
});

export default NoteCard;