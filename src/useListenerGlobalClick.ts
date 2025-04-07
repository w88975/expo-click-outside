import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

import ExpoClickOutside from "./ExpoClickOutsideModule";

export function useListenerGlobalClick(
  callback: (info: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void
) {
  useEffect(() => {
    const subscription = ExpoClickOutside?.addListener("onTap", (info) => {
      const { x, y, targetIsTextInput, target } = info;
      const distY =
        Platform.OS === "android" ? y - (StatusBar.currentHeight ?? 0) : y;
      callback({
        x,
        y: distY,
        targetIsTextInput,
        target,
      });
    });
    return () => {
      subscription?.remove();
    };
  }, [callback]);
}
