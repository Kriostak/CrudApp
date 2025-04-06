import { useState, useRef, useContext } from "react";
import { Text, View, TextInput, Pressable, FlatList, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LinearTransition } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Octicons from '@expo/vector-icons/Octicons';

import { ThemeContext } from "@/context/ThemeContext";

import indexStyles from "./index.module";
import { toDoItemType } from "@/data/todos";
import useFetchStoreData from "@/hooks/useFetchStoreData";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';

export default function Index() {
  const [toDo, setToDo] = useState<toDoItemType[]>([]);
  const [text, setText] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { colorSheme = 'light', setColorSheme = () => { }, theme = { text: 'white' } } = useContext(ThemeContext) ?? {};

  const styles = indexStyles(theme, colorSheme);

  const [loaded, error] = useFonts({
    Inter_500Medium
  });

  useFetchStoreData(toDo, setToDo);

  // waiting until fonts loaded
  if (!loaded && !error) {
    return null;
  }

  const addToDo = (): void => {
    const trimedInputText = text.trim();
    if (trimedInputText) {
      const toDoObj = {
        title: trimedInputText,
        completed: false,
        id: 0,
      }
      for (let toDoId = 0; toDoId < toDo.length; toDoId++) {
        const toDoIdExist = toDo.some((toDo) => toDo.id === toDoId);

        if (!toDoIdExist) {
          toDoObj.id = toDoId;
          break;
        }
        // if all ids are exist, then add to the end of the list
        if (toDoId === toDo.length - 1) {
          toDoObj.id = toDoId + 1;
        }
      }
      setToDo((oldToDo) => [...oldToDo, toDoObj]);
      setText('');
      Keyboard.dismiss();
      flatListRef.current && flatListRef.current.scrollToEnd({ animated: true })
    }
  };

  const toggleToDo = (id: number): void => {
    setToDo(toDo.map(item => (
      item.id === id
        ? {
          ...item, completed: !item.completed
        }
        : item
    )))
  };

  const removeToDo = (id: number): void => {
    setToDo(toDo.filter(item => item.id !== id));
  }

  const navigateToDo = (id: number): void => {
    router.push({ pathname: `/todos/[id]`, params: { id: id.toString() } });
  }

  const renderItem = ({ item }: { item: toDoItemType }): React.ReactElement => {
    return (
      <View style={styles.todoItem}>
        <Pressable
          onLongPress={() => toggleToDo(item.id)}
          onPress={() => navigateToDo(item.id)}
        >
          <Text
            style={[styles.todoText, item.completed && styles.completedText]}
          >{item.title} {item.id}</Text>
        </Pressable>
        <Pressable onPress={() => removeToDo(item.id)}>
          <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable
          onPress={addToDo}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
        <Pressable
          onPress={() => setColorSheme(colorSheme === 'dark' ? 'light' : 'dark')}
          style={{ marginLeft: 10 }}
        >
          <Octicons name={colorSheme === 'dark' ? 'sun' : 'moon'} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
        </Pressable>
      </View>
      <Animated.FlatList
        data={toDo}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ref={flatListRef}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorSheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}


