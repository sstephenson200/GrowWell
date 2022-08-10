import { StyleSheet } from "react-native";

const InputStyles = StyleSheet.create({
    //Text input boxes
    textInput: {
        width: "90%",
        height: 45,
        margin: 8,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    textInputLarge: {
        width: "90%",
        height: 60,
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
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 15,
        elevation: 5,
        borderColor: "#EFF5E4"
    }
});

export default InputStyles;