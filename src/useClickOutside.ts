import React from "react";
import { type View } from "react-native";

import { useListenerGlobalClick } from "./useListenerGlobalClick";

type MeasurableRef = React.RefObject<View>;

export function useClickOutside(
  ref: MeasurableRef,
  callback: (info: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void
) {
  useListenerGlobalClick((info) => {
    if (!ref.current) {
      return;
    }

    ref.current.measureInWindow((x, y, width, height) => {
      if (
        info.x < x ||
        info.x > x + width ||
        info.y < y ||
        info.y > y + height
      ) {
        callback?.(info);
      }
    });
  });
}
