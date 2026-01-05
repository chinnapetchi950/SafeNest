// import React from "react";
// import { View, Text, Dimensions, StyleSheet } from "react-native";
// import { BarChart } from "react-native-chart-kit";
// import { colors } from "../../styles/colors";

// const BarChartCard = ({ title, data }) => {
//   const screenWidth = Dimensions.get("window").width - 40;

//   // Ensure numeric data
//   const numericData = {
//     ...data,
//     datasets: data.datasets.map(ds => ({
//       ...ds,
//       data: ds.data.map(val => Number(val) || 0), // convert strings to numbers
//     })),
//   };
// const formattedData = {
//   labels: data.labels,
//   datasets: data.datasets.map(ds => ({
//     data: ds.data.map(v => Number(v) || 0),
//     color: (opacity = 1) => ds.color, // ✅ MUST be function
//     label: ds.label,
//   })),
// };
//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>{title}</Text>
//       <BarChart
//   data={formattedData}
//   width={screenWidth}
//   height={220}
//   fromZero
//   segments={7}
//   showValuesOnTopOfBars
//   chartConfig={{
//     backgroundGradientFrom: "#fff",
//     backgroundGradientTo: "#fff",
//     decimalPlaces: 0,

//     // 🔥 REQUIRED — prevents crash
//     color: (opacity = 1) => `rgba(165, 148, 249, ${opacity})`,

//     labelColor: () => "#9E9E9E",
//     propsForBackgroundLines: {
//       strokeDasharray: "6",
//       stroke: "#EDE7FF",
//     },
//   }}
//   style={{ borderRadius: 16 }}
// />


//     </View>
//   );
// };

// export default BarChartCard;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: colors.cardBg,
//     borderRadius: 16,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     marginVertical: 8,
//     shadowColor: colors.shadow,
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: colors.textDark,
//     marginBottom: 6,
//   },
//   chart: {
//     borderRadius: 16,
//   },
// });

//import React from "react";
// import { View, Text, Dimensions, StyleSheet } from "react-native";
// import { StackedBarChart } from "react-native-chart-kit";
// import { colors } from "../../styles/colors";

// const BarChartCard = ({ title, data }) => {
//   const screenWidth = Dimensions.get("window").width - 40;

//   // 🔥 Convert API response → StackedBarChart format
//   const stackedData = {
//     labels: data.labels,
//     legend: data.datasets.map(ds => ds.label), // ["Male", "Female"]
//     data: data.labels.map((_, index) => [
//       Number(data.datasets[0]?.data[index]) || 0, // Male
//       Number(data.datasets[1]?.data[index]) || 0, // Female
//     ]),
//     barColors: data.datasets.map(ds => ds.color), // ["#2196F3", "#E91E63"]
//   };

//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>{title}</Text>

//       <StackedBarChart
//         data={stackedData}
//         width={screenWidth}
//         height={240}
//         fromZero
//         segments={7}
//         chartConfig={{
//           backgroundGradientFrom: "#fff",
//           backgroundGradientTo: "#fff",
//           decimalPlaces: 0,
//           color: () => colors.textDark, // required internally
//           labelColor: () => colors.textLight,
//           propsForBackgroundLines: {
//             strokeDasharray: "6",
//             stroke: "#EDE7FF",
//           },
//         }}
//         style={styles.chart}
//       />
//     </View>
//   );
// };

// export default BarChartCard;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: colors.cardBg,
//     borderRadius: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     marginVertical: 8,
//     shadowColor: colors.shadow,
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: colors.textDark,
//     marginBottom: 10,
//   },
//   chart: {
//     borderRadius: 16,
//   },
// });
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { colors } from "../../styles/colors";

const GenderRatioChartCard = ({ title, data }) => {
  const screenWidth = Dimensions.get("window").width - 40;

  const stackedData = {
    labels: data.labels,
    legend: data.datasets.map(ds => ds.label),
    data: data.labels.map((_, index) => [
      Number(data.datasets[0]?.data[index]) || 0,
      Number(data.datasets[1]?.data[index]) || 0,
    ]),
    barColors: data.datasets.map(ds => ds.color),
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {/* CHART */}
      <StackedBarChart
        data={stackedData}
        width={screenWidth}
        height={260}
        fromZero
showValuesOnTopOfBars={false} // 🔥 disable default
        //segments={7}
        hideLegend={false}
         barRadius={0}
  withInnerLines={false}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: () => colors.textDark,
          labelColor: () => "#6B7280",
          propsForBackgroundLines: {
            strokeDasharray: "6",
            stroke: "#EDE7FF",
          },
        }}
        style={{ borderRadius: 16 }}
      />

      {/* CUSTOM VALUES ABOVE BARS */}
      <View style={styles.valueRow}>
        {data.labels.map((label, index) => {
          const male = Number(data.datasets[0]?.data[index]) || 0;
          const female = Number(data.datasets[1]?.data[index]) || 0;
          const total = male + female;

          if (!total) return <View key={index} style={styles.valueItem} />;

          return (
            <View key={index} style={styles.valueItem}>
              <Text style={styles.valueText}>{''}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default GenderRatioChartCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 8,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 10,
  },

  /* CUSTOM VALUE POSITIONING */
  valueRow: {
    position: "absolute",
    top: 90, // 👈 pushes numbers above bars
    left: 30,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    pointerEvents: "none",
  },
  valueItem: {
    width: 40,
    alignItems: "center",
  },
  valueText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
  },
});
