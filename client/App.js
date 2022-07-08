import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from "./src/app/navigation/stackNavigator";
import Tabs from './src/app/navigation/tabs';

const App = () => {
  return (
    <NavigationContainer>
      {/* <StackNavigator /> */}
      <Tabs />
    </NavigationContainer>

  );
}

export default App;