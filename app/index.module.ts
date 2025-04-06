import { ColorValue, StyleSheet } from 'react-native';
import { ColorShemeType } from '@/context/ThemeContext';

const indexStyles = (
    theme: Record<string, string | ColorValue>,
    colorSheme: ColorShemeType
) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        width: '100%',
        maxWidth: 1024,
        marginHorizontal: 'auto',
        pointerEvents: 'auto'
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontSize: 18,
        minWidth: 0,
        color: theme.text,
        fontFamily: 'Inter_500Medium'
    },
    button: {
        backgroundColor: theme.button,
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        fontSize: 18,
        color: colorSheme === 'dark' ? 'dark' : 'white',
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
        maxWidth: 1024,
        marginHorizontal: 'auto',
        pointerEvents: 'auto',
    },
    todoText: {
        color: theme.text,
        fontSize: 18,
        fontFamily: 'Inter_500Medium'
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    }
});

export default indexStyles;