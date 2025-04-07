import React, { useRef } from "react";
import { findNodeHandle, UIManager, View, type ViewProps } from "react-native";

import { useListenerGlobalClick } from "./useListenerGlobalClick";

type ClickOutsideViewProps = ViewProps & {
  onOutsideClick?: (info: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void;
};

export function ClickOutsideView(props: ClickOutsideViewProps) {
  const { children, onOutsideClick, ...rest } = props;

  const containerRef = useRef<View>(null);

  useListenerGlobalClick((info) => {
    if (!containerRef.current) {
      return;
    }

    const handle = findNodeHandle(containerRef.current);
    if (handle) {
      UIManager.measureInWindow(handle, (x, y, width, height) => {
        if (
          info.x < x ||
          info.x > x + width ||
          info.y < y ||
          info.y > y + height
        ) {
          onOutsideClick?.(info);
        }
      });
    }
  });

  return (
    <View ref={containerRef} collapsable={false} {...rest}>
      {children}
    </View>
  );
}
