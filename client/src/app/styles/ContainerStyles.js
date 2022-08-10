import { StyleSheet } from "react-native";

const ContainerStyles = StyleSheet.create({
    //Full page containers
    container: {
        flex: 1,
        marginBottom: 170
    },
    containerScroll: {
        flex: 1,
        marginBottom: 85
    },
    //Screens - between header and tabs
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        paddingVertical: 10
    },
    formScreen: {
        height: "100%",
        backgroundColor: "#81BF63",
        paddingVertical: 10,
    },
    //Form
    form: {
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#EFF5E4",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "grey",
        paddingVertical: "5%",
        marginBottom: "10%"
    },
    //Flex box layouts
    dualRow: {
        flexDirection: "column",
        flex: 2
    },
    dualColumn: {
        flexDirection: "row",
        flex: 2
    },
    //Centered layouts
    centered: {
        alignItems: "center",
        justifyContent: "center"
    },
    //Plant types background colours
    VEG: {
        backgroundColor: "#9477B4"
    },
    FRUIT: {
        backgroundColor: "#80C1E3"
    },
    HERB: {
        backgroundColor: "#81BF63"
    }
});

export default ContainerStyles;