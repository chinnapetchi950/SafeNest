import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../../styles/colors";

const LineChartCard = ({ title, data }) => {
  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={180}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(165, 148, 249, ${opacity})`,
          labelColor: () => colors.textLight,
          propsForDots: { r: "4", strokeWidth: "2", stroke: colors.primary },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

export default LineChartCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 6,
  },
  chart: {
    borderRadius: 16,
  },
});
