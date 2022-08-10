import { StyleSheet } from "react-native";

const ContainerStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 170
    },
    containerScroll: {
        flex: 1,
        marginBottom: 85
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        paddingVertical: 10
    },
    dualRow: {
        flexDirection: "column",
        flex: 2
    }
});

export default ContainerStyles;