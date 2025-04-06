import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'

import { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import idStyles from "./id.module";
import { toDoItemType } from "@/data/todos";


export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const [todo, setTodo] = useState<toDoItemType>({ title: '', completed: false, id: Number(id as string) })
    const { colorSheme = 'light', setColorSheme = () => { }, theme = { text: 'white' } } = useContext(ThemeContext) ?? {};
    const router = useRouter()

    const [loaded, error] = useFonts({
        Inter_500Medium,
    })

    useEffect(() => {

        const fetchData = async (id: string) => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

                if (storageTodos && storageTodos.length) {
                    const myTodo = storageTodos.find((todo: toDoItemType) => todo.id.toString() === id)
                    setTodo(myTodo)
                }
            } catch (e) {
                console.error(e)
            }
        }

        fetchData(id as string);
    }, [id])

    if (!loaded && !error) {
        return null
    }

    const styles = idStyles(theme, colorSheme)

    const handleSave = async () => {
        try {
            const savedTodo = { ...todo, title: todo.title }

            const jsonValue = await AsyncStorage.getItem('TodoApp')
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            if (storageTodos && storageTodos.length) {
                const toDoIndex = storageTodos.findIndex((todo: toDoItemType) => todo.id === savedTodo.id)
                storageTodos[toDoIndex] = savedTodo;
                await AsyncStorage.setItem('TodoApp', JSON.stringify(storageTodos))
            } else {
                await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]))
            }

            router.push('/')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor="gray"
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }))}
                />
                <Pressable
                    onPress={() => setColorSheme(colorSheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>

                    <Octicons name={colorSheme === 'dark' ? 'sun' : 'moon'} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />

                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red' }]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorSheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}