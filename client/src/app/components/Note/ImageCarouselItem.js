import React from "react";
import { Image, StyleSheet } from "react-native";

const ImageCarouselItem = ({ item, index }) => {

    let uri = null;
    let file = null;

    //Image data differs from database and image browser
    if (typeof item === "object") {
        //Images from image browser
        file = item.uri;
    } else {
        //Images from database
        uri = item;
    }

    if (file !== null) {
        return (
            <Image
                source={{ uri: file }}
                style={styles.largeImage}
            />
        );
    }

    if (uri !== null) {
        return (
            <Image
                source={{ uri: uri }}
                style={styles.image}
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: 125,
        height: 125,
        borderRadius: 20
    },
    largeImage: {
        width: 200,
        height: 200,
        borderRadius: 20
    }
});

export default ImageCarouselItem;