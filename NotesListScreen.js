import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import database from './firebaseConfig';
import { getDeviceId } from './getDeviceId';

function NotesListScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    })();


    if (deviceId) {
      const notesRef = ref(database, `notes/${deviceId}`);
      onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedNotes = [];
        for (const key in data) {
          loadedNotes.push({ id: key, ...data[key] });
        }
        setNotes(loadedNotes);
      });
    }
  }, [deviceId]);

  const handleNotePress = (noteId, note) => {
    navigation.navigate('CreateNote', { noteId, note });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {notes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.note}
            onPress={() => handleNotePress(note.id, note)}
          >
            <Text style={styles.titleText}>{note.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNote')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    titleText: {
        fontSize: 18,
      },
    container: {
      flex: 1,
      padding: 10,
    },
    note: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    noteText: {
      fontSize: 18,
    },
    fab: {
      position: 'absolute',
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
      backgroundColor: '#007bff',
      borderRadius: 28,
      elevation: 8,
    },
  });

export default NotesListScreen;
