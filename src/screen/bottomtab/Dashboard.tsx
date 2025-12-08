import React from "react";
import { View, ScrollView, StyleSheet,Text,TouchableOpacity } from "react-native";
import DashboardCard from "../components/DashboarCard";
import { colors } from "../../styles/colors";
import LineChartCard from "../components/LineChart";
import BarChartCard from "../components/BarChart";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Feather';


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
          <View style={styles.headercontainer}>
      
      {/* Title */}
      <Text style={styles.title}>SafeNest</Text>

      {/* Notification + User */}
      <View style={styles.row}>
        <Icon name="bell" size={20} color="#B3B3B3" />
        {/* <Text style={styles.userName}>Mohammed Ali</Text> */}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        
        <TouchableOpacity style={styles.dropdown}>
          <Icon name="chevron-down" size={18} color="#A98BFF" />
          <Text style={styles.dropdownText}>Year</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdownRight}>
          <Icon name="chevron-down" size={18} color="#A98BFF" />
          <Text style={styles.dateText}>2025 April 15</Text>
        </TouchableOpacity>

      </View>
    </View>
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
   headercontainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    color: '#A98BFF',
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '600',
    
  },

  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  userName: {
    color: '#B3B3B3',
    fontSize: 16,
    fontWeight: '500',
  },

  filterRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#A98BFF',
    borderRadius: 25,
    width: '25%',
  },

  dropdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#A98BFF',
    borderRadius: 25,
    width: '72%',
  },

  dropdownText: {
    color: '#A98BFF',
    fontSize: 14,
  },

  dateText: {
    color: '#A98BFF',
    fontSize: 14,
  },
});
