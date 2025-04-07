# expo-click-outside

A React Native Expo module for detecting clicks outside of specified components. Perfect for implementing dropdown menus, modals, and other interactive UI elements that need to respond to outside clicks.

[简体中文文档](./README_CN.md)

## Installation

```bash
npx expo install expo-click-outside
```

## Features

- 🎯 Detect clicks outside specific components with native precision
- 📱 Cross-platform support (Android & iOS)
- 🔄 Real-time layout updates and dynamic component resizing
- 📍 Precise click coordinates using native touch event handling
- 🎨 Flexible API options (hooks and component-based approaches)
- 💪 Full TypeScript support with type definitions

## How It Works

This module uses native code to listen for global touch events across the entire screen. When a touch event occurs, the module:

1. Captures the precise coordinates using platform-specific native methods
2. Compares these coordinates against the measured bounds of your component
3. Triggers callbacks only when clicks occur outside the specified component boundaries

This approach is more reliable than JavaScript-only solutions and handles edge cases like clicks on native UI elements or status bars.

## API

### `useClickOutside`

A hook that detects clicks outside a specific component.

```typescript
function useClickOutside(
  ref: React.RefObject<View>,
  callback: (info: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void
): void
```

#### Example

```typescript
import { useClickOutside } from 'expo-click-outside';

function MyComponent() {
  const ref = useRef<View>(null);
  
  useClickOutside(ref, (info) => {
    console.log('Clicked outside!', info);
  });

  return <View ref={ref}>...</View>;
}
```

### `ClickOutsideView`

A component wrapper that provides outside click detection.

```typescript
type ClickOutsideViewProps = ViewProps & {
  onOutsideClick?: (info: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void;
};
```

#### Example

```typescript
import { ClickOutsideView } from 'expo-click-outside';

function MyComponent() {
  return (
    <ClickOutsideView
      onOutsideClick={(info) => {
        console.log('Clicked outside!', info);
      }}
    >
      <View>...</View>
    </ClickOutsideView>
  );
}
```

### `useListenerGlobalClick`

A hook that listens to all clicks in the app across the entire screen.

```typescript
function useListenerGlobalClick(
  callback: (info: {
    x: number;
    y: number;
    targetIsTextInput: boolean;
    target: string;
  }) => void
): void
```

#### Example

```typescript
import { useListenerGlobalClick } from 'expo-click-outside';

function MyComponent() {
  useListenerGlobalClick((info) => {
    console.log('Click detected:', info);
  });

  return <View>...</View>;
}
```

## Click Info Object

All callbacks receive a click info object with the following properties:

- `x: number` - The X coordinate of the click (in dp/pt units)
- `y: number` - The Y coordinate of the click (in dp/pt units)
- `targetIsTextInput: boolean` - Whether the click target was a text input
- `target: string` - The identifier of the clicked element

## Common Use Cases

1. **Dropdown Menus & Select Components**
   ```typescript
   function Dropdown() {
     const [isOpen, setIsOpen] = useState(false);
     
     return (
       <ClickOutsideView
         onOutsideClick={() => setIsOpen(false)}
       >
         <View>
           <Button onPress={() => setIsOpen(!isOpen)} title="Toggle" />
           {isOpen && <View>Dropdown content...</View>}
         </View>
       </ClickOutsideView>
     );
   }
   ```

2. **Modal Dialogs & Popups**
   ```typescript
   function Modal() {
     const modalRef = useRef(null);
     const [visible, setVisible] = useState(true);
     
     useClickOutside(modalRef, () => {
       setVisible(false);
     });

     return visible ? (
       <View style={styles.overlay}>
         <View ref={modalRef} style={styles.modal}>
           Modal content...
         </View>
       </View>
     ) : null;
   }
   ```

3. **Context Menus**
   ```typescript
   function ContextMenu() {
     const [position, setPosition] = useState({ x: 0, y: 0 });
     const [visible, setVisible] = useState(false);
     const menuRef = useRef(null);
     
     useClickOutside(menuRef, () => setVisible(false));
     
     const handleLongPress = (event) => {
       setPosition({
         x: event.nativeEvent.locationX,
         y: event.nativeEvent.locationY
       });
       setVisible(true);
     };
     
     return (
       <View onLongPress={handleLongPress} style={styles.container}>
         {visible && (
           <View 
             ref={menuRef}
             style={[styles.menu, { left: position.x, top: position.y }]}
           >
             Context menu items...
           </View>
         )}
       </View>
     );
   }
   ```

4. **Tooltip Dismissal**
   ```typescript
   function Tooltip() {
     const [showTooltip, setShowTooltip] = useState(false);
     const tooltipRef = useRef(null);
     
     useClickOutside(tooltipRef, () => setShowTooltip(false));
     
     return (
       <View>
         <Button onPress={() => setShowTooltip(true)} title="Show Info" />
         {showTooltip && (
           <View ref={tooltipRef} style={styles.tooltip}>
             Helpful information...
           </View>
         )}
       </View>
     );
   }
   ```

5. **Form Dismissal on Outside Click**
   ```typescript
   function SearchForm() {
     const [expanded, setExpanded] = useState(false);
     const formRef = useRef(null);
     
     useClickOutside(formRef, () => {
       setExpanded(false);
     });
     
     return (
       <View ref={formRef} style={expanded ? styles.expandedForm : styles.collapsedForm}>
         <TextInput 
           placeholder="Search..." 
           onFocus={() => setExpanded(true)}
         />
         {expanded && (
           <View style={styles.searchSuggestions}>
             Search suggestions and filters...
           </View>
         )}
       </View>
     );
   }
   ```

## Technical Notes

- The module uses platform-specific native code to capture touch events:
  - On Android: Window.Callback for global touch event interception
  - On iOS: UITapGestureRecognizer for screen-wide tap detection
- Coordinates are normalized to device-independent pixels (dp on Android, points on iOS)
- Status bar height is automatically accounted for in coordinate calculations
- Components using `ClickOutsideView` are set to `collapsable={false}` to ensure accurate measurement
- The module respects component layout changes through UIManager's measurement API
- Low performance overhead by utilizing native event handlers instead of JS-only solutions

## Platform-Specific Behavior

### Android
- Uses native Window.Callback to intercept all touch events
- Automatically adjusts for status bar height
- Provides target view information when available

### iOS
- Uses UITapGestureRecognizer for global tap detection
- Handles safe area insets automatically
- Optimized for various screen sizes and orientations

## License

MIT
