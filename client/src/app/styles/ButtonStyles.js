import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
    buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center"
    },
    buttonContainer: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginVertical: 10,
        paddingBottom: 20
    },
    largeButton: {
        backgroundColor: "#9477B4",
        height: 45,
        width: 200,
        borderRadius: 10,
        alignSelf: "center",
        justifyContent: "center",
        margin: 10
    },
    smallButton: {
        backgroundColor: "#9477B4",
        height: 45,
        width: 120,
        borderRadius: 10,
        justifyContent: "center",
        margin: 10
    },
    smallWarningButton: {
        backgroundColor: "red",
        height: 45,
        width: 120,
        borderRadius: 10,
        justifyContent: "center",
        margin: 10
    }
});

export default ButtonStyles;