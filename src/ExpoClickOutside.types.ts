export type ExpoClickOutsideModuleEvents = {
  onTap: (event: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void;
};
