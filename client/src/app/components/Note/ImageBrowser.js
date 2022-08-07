import React from 'react';
import { View, Text, FlatList, Dimensions, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import expoCameraroll from 'expo-cameraroll';
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import ImageTile from "./ImageTile";

const { width } = Dimensions.get("window");

export default class ImageBrowser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            selected: {},
            after: null,
            has_next_page: true
        }
    }

    async componentDidMount() {

        const { status: existingStatus } = await MediaLibrary.requestPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            alert("Notification permission is required for this feature.");
            return;
        }

        this.getPhotos();
    }

    selectImage = (index) => {
        let newSelected = { ...this.state.selected };
        if (newSelected[index]) {
            delete newSelected[index];
        } else {
            newSelected[index] = true;
        }
        if (Object.keys(newSelected).length > this.props.max) return;
        if (!newSelected) newSelected = {};
        this.setState({ selected: newSelected })
    }

    getPhotos = () => {
        let params = { first: 50, assetType: 'Photos' };
        if (this.state.after) params.after = this.state.after
        if (Platform.OS === 'ios') params.groupTypes = 'All'
        if (!this.state.has_next_page) return
        expoCameraroll
            .getPhotos(params)
            .then(this.processPhotos)
    }

    processPhotos = (r) => {
        if (this.state.after === r.page_info.end_cursor) return;
        let uris = r.edges.map(i => i.node).map(i => i.image).map(i => i.uri)
        this.setState({
            photos: [...this.state.photos, ...uris],
            after: r.page_info.end_cursor,
            has_next_page: r.page_info.has_next_page
        });
    }

    getItemLayout = (data, index) => {
        let length = width / 4;
        return { length, offset: length * index, index }
    }

    prepareCallback() {
        let { selected, photos } = this.state;
        let selectedPhotos = photos.filter((item, index) => {
            return (selected[index])
        });
        let files = selectedPhotos
            .map(i => FileSystem.getInfoAsync(i, { md5: true }))
        let callbackResult = Promise
            .all(files)
            .then(imageData => {
                return imageData.map((data, i) => {
                    return { file: selectedPhotos[i], ...data }
                })
            })
        this.props.callback(callbackResult)
    }

    renderHeader = () => {
        let selectedCount = Object.keys(this.state.selected).length;
        let headerText = selectedCount + ' Selected';
        if (selectedCount === this.props.max) headerText = headerText + ' (Max)';
        return (
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={() => this.props.callback(Promise.resolve([]))}>
                    <Text style={styles.buttonText}>EXIT</Text>
                </TouchableOpacity>

                <Text style={styles.headerText}>{headerText}</Text>

                <TouchableOpacity style={styles.button} onPress={() => this.prepareCallback()}>
                    <Text style={styles.buttonText}>DONE</Text>
                </TouchableOpacity>

            </View>
        )
    }
    renderImageTile = ({ item, index }) => {
        let selected = this.state.selected[index] ? true : false
        return (
            <ImageTile
                item={item}
                index={index}
                selected={selected}
                selectImage={this.selectImage}
            />
        )
    }
    renderImages() {
        return (
            <FlatList
                data={this.state.photos}
                numColumns={4}
                renderItem={this.renderImageTile}
                keyExtractor={(_, index) => index}
                onEndReached={() => { this.getPhotos() }}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<Text>Loading...</Text>}
                initialNumToRender={24}
                getItemLayout={this.getItemLayout}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={styles.imageContainer}>
                    {this.renderImages()}
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 180,
        backgroundColor: "#81BF63",
    },
    header: {
        height: 85,
        backgroundColor: "#81BF63",
        width: width,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: 'center',
        padding: 10,
        marginTop: 20
    },
    headerText: {
        color: "white"
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
    buttonText: {
        color: "white",
        fontSize: 16
    },
    imageContainer: {
        backgroundColor: "#EFF5E4"
    }
})



