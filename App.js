import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesListScreen from './screens/NotesListScreen';
import CreateNoteScreen from './screens/CreateNoteScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Notezzz" component={NotesListScreen} />
        <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
