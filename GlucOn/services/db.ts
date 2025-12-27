import * as SQLite from "expo-sqlite";

export const getDB = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("diary.db");
    return db;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
};

export const initDB = async () => {
  try {
    const db = await getDB();
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS foods (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        calories REAL,
        carbs REAL,
        protein REAL,
        fat REAL,
        date TEXT
      );`
    );
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS blood_sugar (
        id TEXT PRIMARY KEY NOT NULL,
        level REAL NOT NULL,
        time TEXT NOT NULL,
        notes TEXT,
        date TEXT NOT NULL
      );`
    );
    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Blood Sugar functions
export interface BloodSugarReading {
  id: string;
  level: number;
  time: string;
  notes?: string;
  date: string;
}

export const addBloodSugarReading = async (reading: BloodSugarReading) => {
  try {
    const db = await getDB();
    await db.runAsync(
      "INSERT INTO blood_sugar (id, level, time, notes, date) VALUES (?, ?, ?, ?, ?)",
      [
        reading.id,
        reading.level,
        reading.time,
        reading.notes || null,
        reading.date,
      ]
    );
  } catch (error) {
    console.error("Failed to add blood sugar reading:", error);
    throw error;
  }
};

export const getBloodSugarReadingsByDate = async (
  date: string
): Promise<BloodSugarReading[]> => {
  try {
    const db = await getDB();
    const readings = await db.getAllAsync(
      "SELECT * FROM blood_sugar WHERE date = ? ORDER BY time ASC",
      [date]
    );
    return readings as BloodSugarReading[];
  } catch (error) {
    console.error("Failed to get blood sugar readings:", error);
    return [];
  }
};

export const deleteBloodSugarReading = async (id: string) => {
  try {
    const db = await getDB();
    await db.runAsync("DELETE FROM blood_sugar WHERE id = ?", [id]);
  } catch (error) {
    console.error("Failed to delete blood sugar reading:", error);
    throw error;
  }
};

export const updateBloodSugarReading = async (reading: BloodSugarReading) => {
  try {
    const db = await getDB();
    await db.runAsync(
      "UPDATE blood_sugar SET level = ?, time = ?, notes = ? WHERE id = ?",
      [reading.level, reading.time, reading.notes || null, reading.id]
    );
  } catch (error) {
    console.error("Failed to update blood sugar reading:", error);
    throw error;
  }
};
