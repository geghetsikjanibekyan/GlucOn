import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { getRecipes, API_BASE } from "../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

type Recipe = {
  id: number;
  title: string;
  content: string;
  image: string;
};

export default function Diets() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Recipe | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getRecipes();
      setRecipes(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <Text>Loading…</Text>;
  }

  return (
    <SafeAreaView>
      <FlatList
        data={recipes}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => setSelected(item)}>
            <Image
              source={{ uri: `${API_BASE}/images/${item.image}` }}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
      />
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {selected && (
              <ScrollView>
                <Image
                  source={{
                    uri: `${API_BASE}/images/${selected.image}`,
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <Text style={styles.modalContent}>{selected.content}</Text>

                <Pressable
                  style={styles.close}
                  onPress={() => setSelected(null)}
                >
                  <Text style={{ color: "white" }}>Close</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 140,
  },
  title: {
    padding: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    maxHeight: "85%",
  },
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    padding: 12,
  },
  modalContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    lineHeight: 20,
  },
  close: {
    margin: 12,
    padding: 12,
    backgroundColor: "black",
    alignItems: "center",
    borderRadius: 8,
  },
});
