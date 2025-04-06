import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toDoItemType } from '@/data/todos';
import { data } from '@/data/todos';

const useFetchStoreData = (toDoList: toDoItemType[], setToDo: (toDo: toDoItemType[]) => void) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('TodoApp');
                const storageData = jsonValue != null ? JSON.parse(jsonValue) : null;

                if (storageData && storageData.length) {
                    setToDo(storageData);
                } else {
                    setToDo(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [data]);

    useEffect(() => {
        const storeData = async () => {
            try {
                const jsonValue = JSON.stringify(toDoList);
                await AsyncStorage.setItem('TodoApp', jsonValue);
            } catch (error) {
                console.error("Error storing data:", error);
            }
        };

        storeData();
    }, [toDoList]);
}

export default useFetchStoreData;