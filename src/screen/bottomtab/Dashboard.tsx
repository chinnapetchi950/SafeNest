import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import DashboardCard from "../components/DashboarCard";
import { colors } from "../../styles/colors";
import LineChartCard from "../components/LineChart";
import BarChartCard from "../components/BarChart";
import { SafeAreaView } from "react-native-safe-area-context";


const DashboardScreen = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{ data: [600000, 700000, 800000, 650000, 720000, 780000, 950000] }],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      { data: [400, 500, 450, 600, 550, 700, 650], color: () => colors.primary },
    ],
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cardRow}>
        <DashboardCard
          title="Number of Children Registered Weekly"
          subtitle="700 Children"
          value="500,000"
          percent="-5%"
          trend="down"
        />
        <DashboardCard
          title="Number of Children Registered Weekly"
          subtitle="700 Children"
          value="500,000"
          percent="+15%"
          trend="up"
        />
      </View>

      <View style={styles.cardRow}>
        <DashboardCard
          title="Number of Children Registered Weekly"
          subtitle="700 Children"
          value="500,000"
          percent="+15%"
          trend="up"
        />
        <DashboardCard
          title="Number of Children Registered Weekly"
          subtitle="700 Children"
          value="500,000"
          percent="+15%"
          trend="up"
        />
      </View>

      <LineChartCard title="Budget" data={lineData} />
      <BarChartCard title="عدد الأطفال" data={barData} />
    </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom:80,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
