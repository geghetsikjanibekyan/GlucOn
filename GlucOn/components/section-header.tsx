import { StyleSheet, Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  right?: React.ReactNode;
  backgroundColor?: string;
};

export function SectionHeader({
  title,
  right,
  backgroundColor,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, backgroundColor && { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
