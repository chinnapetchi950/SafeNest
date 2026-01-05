import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../../styles/colors";

const LineChartCard = ({ title, data }) => {
  const screenWidth = Dimensions.get("window").width - 40;

  const values = data.datasets[0].data.map(v => Number(v) || 0);
  const isEmpty = values.every(v => v === 0);

  if (isEmpty) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No revenue data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <LineChart
        data={{
          ...data,
          datasets: [
            {
              ...data.datasets[0],
              data: values,
            },
          ],
        }}
        width={screenWidth}
        height={220}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        yAxisLabel="₹ "
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) =>
            `rgba(165, 148, 249, ${opacity})`,
          labelColor: () => "#9E9E9E",
          fillShadowGradient: colors.primary,
          fillShadowGradientOpacity: 0.15,
          propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: colors.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: "6",
            stroke: "#EDE7FF",
          },
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
  emptyContainer: {
  height: 200,
  justifyContent: "center",
  alignItems: "center",
},
emptyText: {
  color: "#B0B0B0",
  fontSize: 14,
  fontWeight: "500",
},

});
