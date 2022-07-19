import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ImageCarouselItem = ({ item, index }) => {

    return (
        <Image
            source={{ uri: item }}
            style={styles.image}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 125,
        height: 125,
        borderRadius: 20
    }
});

export default ImageCarouselItem;