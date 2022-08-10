import React from "react";
import { View, Text, FlatList } from "react-native";

import Header from "../../components/Header";
import NoteCard from "../../components/Note/NoteCard";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";

const NoteScreen = (props) => {

    //Set note data passed in from Calendar Screen
    let date = props.route.params.date;
    let notes = props.route.params.notes;

    return (
        <View style={ContainerStyles.container}>
            <Header navigation={props.navigation} />
            <View style={ContainerStyles.screen}>
                <Text style={FontStyles.pageTitle}>{date}</Text>

                <FlatList
                    data={notes}
                    renderItem={({ item }) => {
                        return (
                            <NoteCard note={item} />
                        );
                    }}
                />
            </View>
        </View>
    );
}

export default NoteScreen;