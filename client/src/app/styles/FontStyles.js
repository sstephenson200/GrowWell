import { StyleSheet } from "react-native";

const FontStyles = StyleSheet.create({
    //Screen titles
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
    subtitleStyled: {
        fontSize: 25,
        fontFamily: "Montserrat",
        marginLeft: "5%"
    },
    subtitleStyledCenter: {
        fontSize: 25,
        fontFamily: "Montserrat",
        textAlign: "center",
        marginVertical: 5
    },
    //Centered text
    textCenter: {
        textAlign: "center"
    },
    largeTextCenter: {
        textAlign: "center",
        fontSize: 20
    },
    //Errors
    errorMessage: {
        color: "red",
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold"
    },
    modalWarning: {
        color: "red",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default FontStyles;