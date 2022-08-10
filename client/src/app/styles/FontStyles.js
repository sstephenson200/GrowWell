import { StyleSheet } from "react-native";

const FontStyles = StyleSheet.create({
    pageTitle: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat"
    },
    subtitle: {
        fontSize: 22,
        marginVertical: 5,
        marginLeft: "5%"
    },
    errorMessage: {
        color: "red",
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold"
    }
});

export default FontStyles;