import { useFonts } from "expo-font";

//Function to load custom font for use throughout app
const LoadFont = async () => {
    const [loaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Medium.ttf")
    });

    if (!loaded) {
        return null;
    }
}

export default LoadFont;