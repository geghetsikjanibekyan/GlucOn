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
import {
  BloodSugarReading,
  addBloodSugarReading,
  deleteBloodSugarReading,
  getBloodSugarReadingsByDate,
  updateBloodSugarReading,
} from "../services/db";

interface BloodSugarSectionProps {
  date?: Date;
}

export default function BloodSugarSection({ date }: BloodSugarSectionProps) {
  const [readings, setReadings] = useState<BloodSugarReading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReading, setEditingReading] =
    useState<BloodSugarReading | null>(null);
  const [level, setLevel] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (date) {
      loadReadings();
    }
  }, [date]);

  const loadReadings = async () => {
    if (!date) return;
    const dateString = date.toISOString().split("T")[0];
    const data = await getBloodSugarReadingsByDate(dateString);
    setReadings(data);
  };

  const handleAddReading = async () => {
    if (!level || !time || !date) {
      Alert.alert("Error", "Please fill in level and time");
      return;
    }

    const levelNum = parseFloat(level);
    if (isNaN(levelNum) || levelNum <= 0) {
      Alert.alert("Error", "Please enter a valid blood sugar level");
      return;
    }

    const dateString = date.toISOString().split("T")[0];

    if (editingReading) {
      const updated: BloodSugarReading = {
        ...editingReading,
        level: levelNum,
        time,
        notes,
      };
      await updateBloodSugarReading(updated);
    } else {
      const newReading: BloodSugarReading = {
        id: Date.now().toString(),
        level: levelNum,
        time,
        notes,
        date: dateString,
      };
      await addBloodSugarReading(newReading);
    }

    setLevel("");
    setTime("");
    setNotes("");
    setEditingReading(null);
    setModalVisible(false);
    loadReadings();
  };

  const handleEditReading = (reading: BloodSugarReading) => {
    setEditingReading(reading);
    setLevel(reading.level.toString());
    setTime(reading.time);
    setNotes(reading.notes || "");
    setModalVisible(true);
  };

  const handleDeleteReading = (id: string) => {
    Alert.alert(
      "Delete Reading",
      "Are you sure you want to delete this reading?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteBloodSugarReading(id);
            loadReadings();
          },
        },
      ]
    );
  };

  const getReadingStatus = (level: number) => {
    if (level < 70) return { text: "Low", color: "#ff4444" };
    if (level >= 70 && level <= 140)
      return { text: "Normal", color: "#00C851" };
    if (level > 140 && level <= 180) return { text: "High", color: "#ffbb33" };
    return { text: "Very High", color: "#ff4444" };
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const openAddModal = () => {
    setEditingReading(null);
    setLevel("");
    setTime(getCurrentTime());
    setNotes("");
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
        <Text style={styles.addButtonText}>+ Add Reading</Text>
      </TouchableOpacity>

      <ScrollView style={styles.readingsList}>
        {readings.length === 0 ? (
          <Text style={styles.noReadingsText}>No readings for this date</Text>
        ) : (
          readings.map((reading) => {
            const status = getReadingStatus(reading.level);
            return (
              <View key={reading.id} style={styles.readingCard}>
                <View style={styles.readingHeader}>
                  <View style={styles.readingMain}>
                    <Text style={styles.levelText}>{reading.level}</Text>
                    <Text style={styles.unitText}>mg/dL</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.color },
                    ]}
                  >
                    <Text style={styles.statusText}>{status.text}</Text>
                  </View>
                </View>
                <Text style={styles.timeText}>Time: {reading.time}</Text>
                {reading.notes && (
                  <Text style={styles.notesText}>{reading.notes}</Text>
                )}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditReading(reading)}
                  >
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteReading(reading.id)}
                  >
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
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
              {editingReading ? "Edit Reading" : "Add Blood Sugar Reading"}
            </Text>

            <Text style={styles.label}>Blood Sugar Level (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={level}
              onChangeText={setLevel}
              placeholder="Enter level"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM (e.g., 14:30)"
            />

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Before meal, after exercise, etc."
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingReading(null);
                  setLevel("");
                  setTime("");
                  setNotes("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddReading}
              >
                <Text style={styles.saveButtonText}>
                  {editingReading ? "Update" : "Save"}
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
    backgroundColor: "#7a1ba2",
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
  readingsList: {
    maxHeight: 400,
  },
  noReadingsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 20,
  },
  readingCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#7a1ba2",
  },
  readingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readingMain: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  levelText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  unitText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
    marginTop: 4,
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
  notesInput: {
    height: 80,
    textAlignVertical: "top",
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
    backgroundColor: "#7a1ba2",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
