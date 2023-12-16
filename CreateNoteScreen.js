import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { ref, set, push } from 'firebase/database';
import database from './firebaseConfig';
import { getDeviceId } from './getDeviceId';

function CreateNoteScreen({ route, navigation }) {
  const [note, setNote] = useState({ title: '', content: '' });
  const [noteId, setNoteId] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);

      // Hantera redigering av befintlig anteckning
      if (route.params?.noteId) {
        setNoteId(route.params.noteId);
        setNote(route.params.note);
      } else {
        // Skapa en ny anteckning
        const newNoteRef = push(ref(database, `notes/${id}`));
        setNoteId(newNoteRef.key);
      }
    })();
  }, [route.params]);

  useEffect(() => {
    if (deviceId && noteId) {
      set(ref(database, `notes/${deviceId}/${noteId}`), note);
    }
  }, [note, deviceId, noteId]);

  const handleTextChange = (text) => {
    const title = text.split('\n')[0];
    setNote({ title, content: text });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Skriv din anteckning..."
        multiline
        value={note.content}
        onChangeText={handleTextChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default CreateNoteScreen;
