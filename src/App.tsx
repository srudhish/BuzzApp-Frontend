import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AuthProvider } from './app/context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </Provider>
  );
};

export default App;
