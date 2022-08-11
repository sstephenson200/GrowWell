import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const InputStyles = StyleSheet.create({
    //Text input boxes
    textInput: {
        width: "90%",
        height: hp("7%"),
        margin: 8,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    //Dropdown menus and search bars
    userSelect: {
        width: wp("90%"),
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 15,
        elevation: 5,
        borderColor: "#EFF5E4"
    }
});

export default InputStyles;