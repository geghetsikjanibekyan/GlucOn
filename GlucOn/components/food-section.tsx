import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getDB, initDB } from "../services/db";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  date: string;
}

interface FoodSectionProps {
  date?: Date;
}

export default function FoodSection({ date }: FoodSectionProps) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");

  useEffect(() => {
    if (date) {
      loadFoods();
    }
  }, [date]);

  const loadFoods = async () => {
    if (!date) return;
    const db = await initDB();
    const dateString = date.toISOString().split("T")[0];
    const results = await db.getAllAsync<FoodItem>(
      "SELECT * FROM foods WHERE date = ? ORDER BY name",
      [dateString]
    );
    setFoods(results);
  };

  const handleAddFood = async () => {
    if (!foodName || !date) {
      Alert.alert("Error", "Please enter a food name");
      return;
    }

    const dateString = date.toISOString().split("T")[0];

    if (editingFood) {
      const db = await getDB();
      await db.runAsync(
        "UPDATE foods SET name = ?, calories = ?, carbs = ?, protein = ?, fat = ? WHERE id = ?",
        [
          foodName,
          Number(calories) || 0,
          Number(carbs) || 0,
          Number(protein) || 0,
          Number(fat) || 0,
          editingFood.id,
        ]
      );
    } else {
      const db = await getDB();
      const newFood: FoodItem = {
        id: Date.now().toString(),
        name: foodName,
        calories: Number(calories) || 0,
        carbs: Number(carbs) || 0,
        protein: Number(protein) || 0,
        fat: Number(fat) || 0,
        date: dateString,
      };
      await db.runAsync(
        "INSERT INTO foods (id, name, calories, carbs, protein, fat, date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          newFood.id,
          newFood.name,
          newFood.calories,
          newFood.carbs,
          newFood.protein,
          newFood.fat,
          newFood.date,
        ]
      );
    }

    setFoodName("");
    setCalories("");
    setCarbs("");
    setProtein("");
    setFat("");
    setEditingFood(null);
    setModalVisible(false);
    loadFoods();
  };

  const handleEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setCarbs(food.carbs.toString());
    setProtein(food.protein.toString());
    setFat(food.fat.toString());
    setModalVisible(true);
  };

  const handleDeleteFood = (id: string) => {
    Alert.alert(
      "Delete Food",
      "Are you sure you want to delete this food item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const db = await getDB();
            await db.runAsync("DELETE FROM foods WHERE id = ?", [id]);
            loadFoods();
          },
        },
      ]
    );
  };

  const openAddModal = () => {
    setEditingFood(null);
    setFoodName("");
    setCalories("");
    setCarbs("");
    setProtein("");
    setFat("");
    setModalVisible(true);
  };

  if (!date) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDateText}>Please select a date</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ Add Food</Text>
      </TouchableOpacity>

      <ScrollView style={styles.foodsList}>
        {foods.length === 0 ? (
          <Text style={styles.noFoodsText}>No foods for this date</Text>
        ) : (
          foods.map((food) => (
            <View key={food.id} style={styles.foodCard}>
              <Text style={styles.foodName}>{food.name}</Text>
              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.calories}</Text>
                  <Text style={styles.macroLabel}>kcal</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.carbs}g</Text>
                  <Text style={styles.macroLabel}>carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.protein}g</Text>
                  <Text style={styles.macroLabel}>protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.fat}g</Text>
                  <Text style={styles.macroLabel}>fat</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditFood(food)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteFood(food.id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingFood ? "Edit Food" : "Add Food"}
            </Text>

            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={styles.input}
              value={foodName}
              onChangeText={setFoodName}
              placeholder="Enter food name"
            />

            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              placeholder="0"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              value={carbs}
              onChangeText={setCarbs}
              placeholder="0"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              value={protein}
              onChangeText={setProtein}
              placeholder="0"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              value={fat}
              onChangeText={setFat}
              placeholder="0"
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingFood(null);
                  setFoodName("");
                  setCalories("");
                  setCarbs("");
                  setProtein("");
                  setFat("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddFood}
              >
                <Text style={styles.saveButtonText}>
                  {editingFood ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  noDateText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#412ea0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  foodsList: {},
  noFoodsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 20,
  },
  foodCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#412ea0",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  macroLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#412ea0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#412ea0",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
