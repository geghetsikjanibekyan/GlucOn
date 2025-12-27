import { FoodItem } from "@/app/(tabs)/nutrition";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FoodCard = ({ item }: { item: FoodItem }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const getNutrient = (id: number) => item.foodNutrients.find((n) => n.nutrientId === id);
  return (
    <View style={styles.foodContainer}>
      <Text style={styles.foodTitle}>{item.description}</Text>
      <Text style={styles.category}>
        {item.foodCategory} | FDC ID: {item.fdcId}
      </Text>

      <View style={styles.divider} />

      <View style={styles.macroRow}>
        <NutrientBadge
          label="Calories"
          value={getNutrient(1008)?.value}
          unit="kcal"
          color="#e67e22"
        />
        <NutrientBadge
          label="Protein"
          value={getNutrient(1003)?.value}
          unit="g"
          color="#2ecc71"
        />
        <NutrientBadge
          label="Fat"
          value={getNutrient(1004)?.value}
          unit="g"
          color="#f1c40f"
        />
        <NutrientBadge
          label="Carbs"
          value={getNutrient(1005)?.value}
          unit="g"
          color="#3498db"
        />
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => {
            setCurrentItem(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.sectionTitle}>See All Nutrients</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.dataType}>Source: {item.dataType}</Text>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {currentItem && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{currentItem.description}</Text>
              <ScrollView>
                {currentItem.foodNutrients.map((n) => (
                  <View key={n.foodNutrientId} style={styles.nutrientRow}>
                    <Text style={styles.nutrientName}>{n.nutrientName}</Text>
                    <Text style={styles.nutrientAmount}>
                      {n.value.toFixed(2)} {n.unitName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.actionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const NutrientBadge = ({ label, value, unit, color }: any) => (
  <View style={[styles.badge, { borderColor: color }]}>
    <Text style={styles.badgeLabel}>{label}</Text>
    <Text style={styles.badgeValue}>
      {value ?? 0}
      {unit}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8f9fa" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  result: { marginTop: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#333" },

  foodContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#412ea0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodTitle: { fontSize: 17, fontWeight: "bold", color: "#2c3e50" },
  category: { fontSize: 12, color: "#7f8c8d", marginBottom: 8 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },

  closeButton: {
    height: 30,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  actionText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },

  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    minWidth: "22%",
  },
  badgeLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#7f8c8d",
    marginBottom: 2,
  },
  badgeValue: { fontSize: 13, fontWeight: "bold" },

  section: { marginTop: 10 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginBottom: 4,
  },
  measureText: { fontSize: 13, color: "#555", lineHeight: 18 },
  nutrientGrid: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  nutrientName: {
    fontSize: 12,
    color: "#444",
    flex: 0.7,
  },
  nutrientAmount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 0.3,
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxHeight: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dataType: { fontSize: 10, fontStyle: "italic", color: "#95a5a6" },
});

export default FoodCard;
