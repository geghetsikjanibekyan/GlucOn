import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FoodCard from "../../components/food-card";

export interface FoodSearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  pageList: number[];
  foodSearchCriteria: FoodSearchCriteria;
  foods: FoodItem[];
  aggregations: Aggregations;
}

export interface FoodSearchCriteria {
  query: string;
  generalSearchInput: string;
  pageNumber: number;
  numberOfResultsPerPage: number;
  pageSize: number;
  requireAllWords: boolean;
}

export interface Aggregations {
  dataType: DataTypeCounts;
  nutrients: Record<string, any>; // Currently empty in your example
}

export interface DataTypeCounts {
  Branded: number;
  "SR Legacy": number;
  "Survey (FNDDS)": number;
  Foundation: number;
}

export interface FoodItem {
  fdcId: number;
  description: string;
  commonNames: string;
  additionalDescriptions: string;
  dataType: string;
  foodCode: number;
  publishedDate: string;
  foodCategory: string;
  foodCategoryId: number;
  allHighlightFields: string;
  score: number;
  microbes: any[];
  foodNutrients: FoodNutrient[];
  finalFoodInputFoods: FinalFoodInputFood[];
  foodMeasures: FoodMeasure[];
  foodAttributes: FoodAttribute[];
  foodAttributeTypes: FoodAttributeType[];
  foodVersionIds: number[];
}

export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
  rank: number;
  indentLevel: number;
  foodNutrientId: number;
}

export interface FinalFoodInputFood {
  foodDescription: string;
  gramWeight: number;
  id: number;
  portionCode: string;
  portionDescription: string;
  unit: string;
  rank: number;
  retentionCode: number;
  srCode: number;
  value: number;
}

export interface FoodMeasure {
  disseminationText: string;
  gramWeight: number;
  id: number;
  modifier: string;
  rank: number;
  measureUnitAbbreviation: string;
  measureUnitName: string;
  measureUnitId: number;
}

export interface FoodAttribute {
  id: number;
  value: string;
  name?: string;
  sequenceNumber?: number;
}

export interface FoodAttributeType {
  id: number;
  name: string;
  description: string;
  foodAttributes: FoodAttribute[];
}

export default function Nutrition() {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const apiKey = "sLfkffH5hLaJdgQ5mXw8KG56OKDGoESLpXImfwJ7";
      const searchRes = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}`
      );
      const searchJson = (await searchRes.json()) as FoodSearchResponse;
      if (searchJson?.foods !== null && searchJson?.foods !== undefined) {
        setFoods(searchJson.foods);
      }
    } catch (e) {
      console.error(e);
      setFoods([]);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Nutrition Search</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for food (e.g., Apple)"
          placeholderTextColor="#888"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={searchFood}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Searching..." : "Search"}
          </Text>
        </TouchableOpacity>

        {foods && !loading && (
          <View style={styles.result}>
            {foods.map((food: FoodItem) => (
              <FoodCard item={food} key={food.fdcId} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  result: {
    marginTop: 10,
  },
});
