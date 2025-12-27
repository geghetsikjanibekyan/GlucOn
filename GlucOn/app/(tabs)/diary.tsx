import BloodSugarSection from "@/components/blood-sugar-section";
import FoodSection from "@/components/food-section";
import { SectionHeader } from "@/components/section-header";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Diary() {
  const [date, setDate] = useState<Date>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Calendar
          onDayPress={(day) => {
            setDate(new Date(day.dateString));
          }}
          markedDates={
            date
              ? {
                  [date.toISOString().split("T")[0]]: {
                    selected: true,
                    selectedColor: "#412ea0",
                  },
                }
              : {}
          }
          theme={{
            todayTextColor: "#412ea0",
            arrowColor: "#412ea0",
          }}
        />

        <SectionHeader title="Food" backgroundColor="rgba(65, 46, 160, 0.51)" />
        <FoodSection date={date} />

        <SectionHeader
          title="Blood Sugar Level"
          backgroundColor="rgba(122, 27, 162, 0.2)"
        />
        <BloodSugarSection date={date} />
      </ScrollView>
    </SafeAreaView>
  );
}
