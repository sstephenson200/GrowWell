import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ButtonStyles = StyleSheet.create({
    //Button text
    buttonText: {
        color: "white",
        fontSize: wp("5%"),
        textAlign: "center"
    },
    //Navigation button containers
    buttonContainer: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginVertical: 10,
        paddingBottom: 20
    },
    modalButtonContainer: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        paddingBottom: hp("10%")
    },
    //Standard navigation buttons
    largeButton: {
        backgroundColor: "#9477B4",
        height: hp("7%"),
        width: wp("50%"),
        borderRadius: 10,
        alignSelf: "center",
        justifyContent: "center",
        margin: 10
    },
    smallButton: {
        backgroundColor: "#9477B4",
        height: hp("7%"),
        width: wp("30%"),
        borderRadius: 10,
        justifyContent: "center",
        margin: 10
    },
    //Red warning buttons
    smallWarningButton: {
        backgroundColor: "red",
        height: hp("7%"),
        width: wp("30%"),
        borderRadius: 10,
        justifyContent: "center",
        margin: 10
    },
    largeWarningButton: {
        backgroundColor: "red",
        height: hp("7%"),
        width: wp("50%"),
        borderRadius: 10,
        alignSelf: "center",
        justifyContent: "center",
        margin: 10
    }
});

export default ButtonStyles;