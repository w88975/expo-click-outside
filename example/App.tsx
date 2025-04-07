import {
  useListenerGlobalClick,
  ClickOutsideView,
  useClickOutside,
} from "expo-click-outside";
import { useRef, useState, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";

function DebugPanel({
  info,
  isOutside,
}: {
  info: { x: number; y: number; isTextInput: boolean; target: string } | null;
  isOutside: boolean;
}) {
  if (!info) return null;

  return (
    <View style={styles.debugPanel}>
      <Text style={styles.debugText}>
        CLICK VECTOR: ({Math.round(info.x)}, {Math.round(info.y)})
      </Text>
      <Text style={styles.debugText}>
        CLICK OUTSIDE: {isOutside ? "Yes" : "No"}
      </Text>
      <Text style={styles.debugText}>CLICK TARGET: {info.target}</Text>
    </View>
  );
}

export default function App() {
  const [debugInfo, setDebugInfo] = useState<{
    x: number;
    y: number;
    isTextInput: boolean;
    target: string;
  } | null>(null);
  const [size, setSize] = useState(200);
  const [isOutside, setIsOutside] = useState(false);
  const testRef = useRef<View>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSize((prev) => (prev === 200 ? 300 : 200));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useListenerGlobalClick((info) => {
    setDebugInfo({
      x: info.x,
      y: info.y,
      isTextInput: info.targetIsTextInput,
      target: info.target,
    });
    setIsOutside(false);
  });

  useClickOutside(testRef, (info) => {
    console.log("[useClickOutside]: click outside", info);
    setIsOutside(true);
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>

        <Group name="ClickOutsideView">
          <ClickOutsideView
            onOutsideClick={(info) => {
              setIsOutside(true);
            }}
          >
            <View ref={testRef} style={[styles.demo, { height: size }]}>
              <Text>ClickOutsideView (Size: {size}px)</Text>
              <Text>Click Outside: {isOutside ? "Yes" : "No"}</Text>
            </View>
          </ClickOutsideView>
        </Group>

        <Group name="Buttons">
          <Button
            title="Standard Button"
            onPress={() => console.log("standard button clicked")}
          />
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log("touchable clicked")}
          >
            <Text>Touchable Opacity</Text>
          </TouchableOpacity>
          <Pressable
            style={styles.pressable}
            onPress={() => console.log("pressable clicked")}
          >
            <Text>Pressable</Text>
          </Pressable>
        </Group>

        <Group name="Inputs">
          <TextInput style={styles.input} placeholder="Text Input" />
          <View style={styles.row}>
            <Text>Switch:</Text>
            <Switch
              onValueChange={(value) => console.log("switch:", value)}
              value={false}
            />
          </View>
        </Group>

        <Group name="Lists">
          <FlatList
            data={[{ key: "Item 1" }, { key: "Item 2" }, { key: "Item 3" }]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => console.log("list item clicked:", item.key)}
              >
                <Text>{item.key}</Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </Group>

        <Group name="Media">
          <Image
            source={{ uri: "https://picsum.photos/200" }}
            style={styles.image}
          />
        </Group>

        <Group name="Indicators">
          <ActivityIndicator size="large" color="#0000ff" />
        </Group>
      </ScrollView>

      <DebugPanel info={debugInfo} isOutside={isOutside} />
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  demo: {
    flex: 1,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%" as const,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  touchable: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center" as const,
  },
  pressable: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center" as const,
  },
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center" as const,
    borderRadius: 10,
  },
  list: {
    maxHeight: 200,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  debugPanel: {
    position: "absolute" as const,
    top: 100,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
    minWidth: 150,
  },
  debugText: {
    color: "white",
    fontSize: 14,
    marginVertical: 2,
  },
});
