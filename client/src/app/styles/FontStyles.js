import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const FontStyles = StyleSheet.create({
    //Screen titles
    pageTitle: {
        textAlign: "center",
        fontSize: hp("6%"),
        fontFamily: "Montserrat"
    },
    subtitle: {
        fontSize: hp("3%"),
        marginVertical: 5,
        marginLeft: "5%"
    },
    subtitleStyled: {
        fontSize: hp("3.5%"),
        fontFamily: "Montserrat",
        marginLeft: "5%"
    },
    subtitleStyledCenter: {
        fontSize: hp("3.5%"),
        fontFamily: "Montserrat",
        textAlign: "center",
        marginVertical: 5
    },
    boldHeader: {
        fontSize: hp("2%"),
        fontWeight: "bold"
    },
    //App titles
    appTitle: {
        fontSize: hp("9%"),
        fontFamily: "Montserrat",
        color: "white"
    },
    appSubtitle: {
        fontSize: hp("4%"),
        fontFamily: "Montserrat",
        color: "white"
    },
    //Centered text
    textCenter: {
        textAlign: "center"
    },
    largeTextCenter: {
        textAlign: "center",
        fontSize: hp("3%"),
    },
    //Errors
    errorMessage: {
        color: "red",
        fontSize: hp("2%"),
        textAlign: "center",
        fontWeight: "bold"
    },
    modalWarning: {
        color: "red",
        fontSize: hp("3%"),
        textAlign: "center",
        fontWeight: "bold",
    },
    //Form text and links
    formText: {
        paddingHorizontal: 2.5,
        fontSize: hp("2%"),
        textAlign: "center"
    },
    formLink: {
        paddingHorizontal: 2.5,
        fontSize: hp("2%"),
        color: "#9477B4",
        textAlign: "center"
    },
});

export default FontStyles;