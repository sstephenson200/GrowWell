import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import ImageCarouselItem from './ImageCarouselItem';

const sliderWidth = Dimensions.get('window').width * 0.45;
const itemWidth = Math.round(sliderWidth) * 0.7;

const ImageCarousel = (props) => {

    let data = props.data;

    return (
        <View>
            <Carousel
                layout={"stack"}
                data={data}
                renderItem={ImageCarouselItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                useScrollView={true}
            />
        </View>
    );
}

export default ImageCarousel;