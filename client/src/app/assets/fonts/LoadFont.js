import { useFonts } from 'expo-font';

const LoadFont = async () => {
    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }
}

export default LoadFont;