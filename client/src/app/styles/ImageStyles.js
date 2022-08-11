import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const ImageStyles = StyleSheet.create({
    icon: {
        height: hp("5%"),
        width: hp("5%")
    },
    largeIcon: {
        height: hp("6%"),
        width: hp("6%")
    },
    loginLogo: {
        height: hp("12%"),
        width: hp("12%"),
        marginVertical: 10
    }
});

export default ImageStyles;