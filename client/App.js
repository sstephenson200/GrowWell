import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Tabs from './src/app/navigation/tabs';
import Notification from './src/app/notifications/PushNotification';

const App = () => {

  return (
    <NavigationContainer>
      <Notification />
      <Tabs />
    </NavigationContainer>

  );
}

export default App;