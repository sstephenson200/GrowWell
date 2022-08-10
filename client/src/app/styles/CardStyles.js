import { StyleSheet } from "react-native";

const CardStyles = StyleSheet.create({
    card: {
        alignSelf: "stretch",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: "white"
    },
    cardContent: {
        margin: 20,
        justifyContent: "space-between"
    }
});

export default CardStyles;