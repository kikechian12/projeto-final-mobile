import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('data');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveData = async () => {
    try {
      const newText = {
        id: Date.now(),
        text: inputText,
      };

      const newData = [...data, newText];
      await AsyncStorage.setItem('data', JSON.stringify(newData));
      setData(newData);

      setInputText('');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const deleteData = async (id) => {
    try {
      const newData = data.filter(item => item.id !== id);
      await AsyncStorage.setItem('data', JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const editData = async (id, newText) => {
    try {
      const newData = data.map(item => {
        if (item.id === id) {
          return { id: item.id, text: newText };
        }
        return item;
      });

      await AsyncStorage.setItem('data', JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error editing data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <TextInput
        style={{ flex: 1, marginRight: 10, borderColor: 'gray', borderWidth: 1, padding: 5 }}
        value={item.text}
        onChangeText={newText => editData(item.id, newText)}
      />
      <Button title="Deletar" onPress={() => deleteData(item.id)} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>App - Final Mobile</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        onChangeText={setInputText}
        value={inputText}
        placeholder="Insira texto"
      />
      <Button title="Salvar" onPress={saveData} />
      <FlatList
        style={{ marginTop: 20 }}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default App;
