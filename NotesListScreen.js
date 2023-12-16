import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue,remove } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import database from './firebaseConfig';
import { getDeviceId } from './getDeviceId';
import { Alert } from 'react-native';

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

  const handleDelete = (noteId) => {
    Alert.alert(
      "Radera Anteckning",
      "Är du säker på att du vill radera denna anteckning?",
      [
        { text: "Avbryt" },
        { text: "Radera", onPress: () => deleteNote(noteId) }
      ]
    );
  };

  const deleteNote = (noteId) => {
    const noteRef = ref(database, `notes/${deviceId}/${noteId}`);
    remove(noteRef);
  };
  

  return (
    <View style={styles.container}>
      <ScrollView>
        {notes.map((note) => (
          <View key={note.id} style={styles.note}>
            <TouchableOpacity
              style={styles.noteContent}
              onPress={() => handleNotePress(note.id, note)}
            >
              <Text style={styles.titleText}>{note.title}</Text>
              <Text style={styles.dateText}>
                {note.lastEdited ? new Date(note.lastEdited).toLocaleString() : 'N/A'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(note.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>•••</Text>
            </TouchableOpacity>
          </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      },
      noteContent: {
        // Flex för att hantera titel och datum
        flex: 1,
      },
    noteText: {
      fontSize: 18,
    },
    deleteText: {
        color: 'black',
        // ... Stil för radera-knappen
      },
    dateText: {
        fontSize: 12,
        color: 'grey',
        // Lägg till ytterligare stil för datumtexten
      },
    fab: {
      position: 'absolute',
      width: 70,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 40,
      backgroundColor: '#007bff',
      borderRadius: 40,
      elevation: 8,
    },
  });

export default NotesListScreen;
