# expo-click-outside

一个用于检测组件外部点击的 React Native Expo 模块。完美适用于实现下拉菜单、模态框以及其他需要响应外部点击的交互式 UI 元素。

[English Documentation](./README.md)

## 安装

```bash
npx expo install expo-click-outside
```

## 特性

- 🎯 使用原生精确度检测组件外部的点击
- 📱 跨平台支持（Android 和 iOS）
- 🔄 实时布局更新和动态组件尺寸调整
- 📍 通过原生触摸事件处理获取精确的点击坐标
- 🎨 灵活的 API 选项（Hooks 和基于组件的方法）
- 💪 完整的 TypeScript 支持和类型定义

## 工作原理

本模块使用原生代码监听整个屏幕的全局触摸事件。当触摸事件发生时，模块会：

1. 使用平台特定的原生方法捕获精确坐标
2. 将这些坐标与组件的测量边界进行比较
3. 仅在点击发生在指定组件边界外部时触发回调

这种方法比仅使用 JavaScript 的解决方案更可靠，并能处理在原生 UI 元素或状态栏上点击等边缘情况。

## API

### `useClickOutside`

用于检测特定组件外部点击的 Hook。

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

#### 示例

```typescript
import { useClickOutside } from 'expo-click-outside';

function MyComponent() {
  const ref = useRef<View>(null);
  
  useClickOutside(ref, (info) => {
    console.log('检测到外部点击！', info);
  });

  return <View ref={ref}>...</View>;
}
```

### `ClickOutsideView`

提供外部点击检测功能的组件包装器。

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

#### 示例

```typescript
import { ClickOutsideView } from 'expo-click-outside';

function MyComponent() {
  return (
    <ClickOutsideView
      onOutsideClick={(info) => {
        console.log('检测到外部点击！', info);
      }}
    >
      <View>...</View>
    </ClickOutsideView>
  );
}
```

### `useListenerGlobalClick`

监听应用内整个屏幕所有点击事件的 Hook。

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

#### 示例

```typescript
import { useListenerGlobalClick } from 'expo-click-outside';

function MyComponent() {
  useListenerGlobalClick((info) => {
    console.log('检测到点击：', info);
  });

  return <View>...</View>;
}
```

## 点击信息对象

所有回调函数都会收到一个包含以下属性的点击信息对象：

- `x: number` - 点击的 X 坐标（使用 dp/pt 单位）
- `y: number` - 点击的 Y 坐标（使用 dp/pt 单位）
- `targetIsTextInput: boolean` - 点击目标是否为文本输入框
- `target: string` - 被点击元素的标识符

## 常见使用场景

1. **下拉菜单和选择组件**
   ```typescript
   function Dropdown() {
     const [isOpen, setIsOpen] = useState(false);
     
     return (
       <ClickOutsideView
         onOutsideClick={() => setIsOpen(false)}
       >
         <View>
           <Button onPress={() => setIsOpen(!isOpen)} title="切换" />
           {isOpen && <View>下拉菜单内容...</View>}
         </View>
       </ClickOutsideView>
     );
   }
   ```

2. **模态对话框和弹出窗口**
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
           模态窗口内容...
         </View>
       </View>
     ) : null;
   }
   ```

3. **上下文菜单**
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
             上下文菜单项...
           </View>
         )}
       </View>
     );
   }
   ```

4. **工具提示的关闭**
   ```typescript
   function Tooltip() {
     const [showTooltip, setShowTooltip] = useState(false);
     const tooltipRef = useRef(null);
     
     useClickOutside(tooltipRef, () => setShowTooltip(false));
     
     return (
       <View>
         <Button onPress={() => setShowTooltip(true)} title="显示信息" />
         {showTooltip && (
           <View ref={tooltipRef} style={styles.tooltip}>
             帮助信息...
           </View>
         )}
       </View>
     );
   }
   ```

5. **点击外部时关闭表单**
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
           placeholder="搜索..." 
           onFocus={() => setExpanded(true)}
         />
         {expanded && (
           <View style={styles.searchSuggestions}>
             搜索建议和过滤器...
           </View>
         )}
       </View>
     );
   }
   ```

## 技术说明

- 本模块使用平台特定的原生代码捕获触摸事件：
  - 在 Android 上：使用 Window.Callback 拦截全局触摸事件
  - 在 iOS 上：使用 UITapGestureRecognizer 检测屏幕范围内的点击
- 坐标被标准化为设备无关像素（Android 上的 dp，iOS 上的 point）
- 在坐标计算中自动考虑状态栏高度
- 使用 `ClickOutsideView` 的组件自动设置为 `collapsable={false}` 以确保准确测量
- 本模块通过 UIManager 的测量 API 处理组件布局变化
- 利用原生事件处理程序而非仅 JS 的解决方案，实现低性能开销

## 平台特定行为

### Android
- 使用原生 Window.Callback 拦截所有触摸事件
- 自动调整状态栏高度
- 在可用时提供目标视图信息

### iOS
- 使用 UITapGestureRecognizer 进行全局点击检测
- 自动处理安全区域插入
- 针对各种屏幕尺寸和方向进行优化

## 许可证

MIT
