import { StyleSheet } from "react-native";

const CardStyles = StyleSheet.create({
    //Alarm cards 
    card: {
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        backgroundColor: "white"
    },
    cardContent: {
        margin: 20,
        justifyContent: "space-between"
    }
});

export default CardStyles;