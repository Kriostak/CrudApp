import { createContext, useContext, useState } from "react";
import { Appearance } from "react-native";

import { Colors } from "@/constants/Colors";

export type ColorShemeType = "light" | "dark" | null | undefined;

interface ThemeContextType {
    colorSheme: ColorShemeType;
    setColorSheme: React.Dispatch<React.SetStateAction<ColorShemeType>>;
    theme: typeof Colors.light | typeof Colors.dark;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactElement }) => {
    const [colorSheme, setColorSheme] = useState(Appearance.getColorScheme());

    const theme = colorSheme === 'dark' ? Colors.dark : Colors.light;
    const themeContextValue: ThemeContextType = { colorSheme, setColorSheme, theme };

    return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>
}