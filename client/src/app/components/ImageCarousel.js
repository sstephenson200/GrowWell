import React from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import ImageCarouselItem from './ImageCarouselItem';

let sliderWidth = Dimensions.get('window').width * 0.45;
let itemWidth = Math.round(sliderWidth) * 0.7;

const ImageCarousel = (props) => {

    if (props.styling !== undefined) {
        sliderWidth = Dimensions.get('window').width;
        itemWidth = Math.round(sliderWidth) * 0.7;
    }

    let data = props.data;

    return (
        <View>
            <Carousel
                layout={"default"}
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