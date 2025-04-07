import { findNodeHandle, UIManager, type View } from "react-native";

import { useListenerGlobalClick } from "./useListenerGlobalClick";

type MeasurableRef = React.RefObject<React.Component<any> | View>;

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

    const handle = findNodeHandle(ref.current);
    if (handle) {
      UIManager.measureInWindow(handle, (x, y, width, height) => {
        if (
          info.x < x ||
          info.x > x + width ||
          info.y < y ||
          info.y > y + height
        ) {
          callback?.(info);
        }
      });
    }
  });
}
