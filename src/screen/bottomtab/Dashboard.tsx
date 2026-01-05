// import React from "react";
// import { View, ScrollView, StyleSheet,Text,TouchableOpacity } from "react-native";
// import DashboardCard from "../components/DashboarCard";
// import { colors } from "../../styles/colors";
// import LineChartCard from "../components/LineChart";
// import BarChartCard from "../components/BarChart";
// import { SafeAreaView } from "react-native-safe-area-context";
// import strings from "../../localization/en";
// import Icon from 'react-native-vector-icons/Feather';
// import { useTranslation } from "../../contexts/LanguageContext";


// const DashboardScreen = () => {
//   const { t } = useTranslation();
//   const lineData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//     datasets: [{ data: [600000, 700000, 800000, 650000, 720000, 780000, 950000] }],
//   };

//   const barData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//     datasets: [
//       { data: [400, 500, 450, 600, 550, 700, 650], color: () => colors.primary },
//     ],
//   };

//   return (
//     <SafeAreaView style={{flex:1}}>
//           <View style={styles.headercontainer}>
      
//       {/* Title */}
//       <Text style={styles.title}>{t('dashboard.title')}</Text>

//       {/* Notification + User */}
//       <View style={styles.row}>
//         <Icon name="bell" size={20} color="#B3B3B3" />
//         {/* <Text style={styles.userName}>Mohammed Ali</Text> */}
//       </View>

//       {/* Filters */}
//       <View style={styles.filterRow}>
        
//         <TouchableOpacity style={styles.dropdown}>
//           <Icon name="chevron-down" size={18} color="#A98BFF" />
//           <Text style={styles.dropdownText}>{t('dashboard.year')}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.dropdownRight}>
//           <Icon name="chevron-down" size={18} color="#A98BFF" />
//           <Text style={styles.dateText}>{strings.dashboard.currentDate}</Text>
//         </TouchableOpacity>

//       </View>
//     </View>
//     <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.cardRow}>
//         <DashboardCard
//           title={t('dashboard.numberOfChildrenRegisteredWeekly')}
//           subtitle={t('dashboard.childrenCount')}
//           value={t('dashboard.value')}
//           percent="-5%"
//           trend="down"
//         />
//         <DashboardCard
//           title={t('dashboard.numberOfChildrenRegisteredWeekly')}
//           subtitle={t('dashboard.childrenCount')}
//           value={t('dashboard.value')}
//           percent="+15%"
//           trend="up"
//         />
//       </View>

//       <View style={styles.cardRow}>
//         <DashboardCard
//           title={t('dashboard.numberOfChildrenRegisteredWeekly')}
//           subtitle={t('dashboard.childrenCount')}
//           value={t('dashboard.value')}
//           percent="+15%"
//           trend="up"
//         />
//         <DashboardCard
//           title={t('dashboard.numberOfChildrenRegisteredWeekly')}
//           subtitle={t('dashboard.childrenCount')}
//           value={t('dashboard.value')}
//           percent="+15%"
//           trend="up"
//         />
//       </View>

//       <LineChartCard title={t('dashboard.budget')} data={lineData} />
//       <BarChartCard title={t('dashboard.numberOfChildren')} data={barData} />
//     </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default DashboardScreen;

// const styles = StyleSheet.create({
//   container: {
//     //flex: 1,
//     backgroundColor: colors.background,
//     paddingHorizontal: 10,
//     paddingTop: 10,
//     paddingBottom:80,
//   },
//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//    headercontainer: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },

//   title: {
//     color: '#A98BFF',
//     textAlign: 'right',
//     fontSize: 18,
//     fontWeight: '600',
    
//   },

//   row: {
//     marginTop: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 10,
//   },

//   userName: {
//     color: '#B3B3B3',
//     fontSize: 16,
//     fontWeight: '500',
//   },

//   filterRow: {
//     flexDirection: 'row',
//     marginTop: 20,
//     justifyContent: 'space-between',
//   },

//   dropdown: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 15,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: '#A98BFF',
//     borderRadius: 25,
//     width: '25%',
//   },

//   dropdownRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: '#A98BFF',
//     borderRadius: 25,
//     width: '72%',
//   },

//   dropdownText: {
//     color: '#A98BFF',
//     fontSize: 14,
//   },

//   dateText: {
//     color: '#A98BFF',
//     fontSize: 14,
//   },
// });
import React, { useState,useEffect } from "react";
import { View, ScrollView, StyleSheet, Text,TouchableOpacity,FlatList  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DashboardCard from "../components/DashboarCard";
import LineChartCard from "../components/LineChart";
import BarChartCard from "../components/BarChart";

import { colors } from "../../styles/colors";
import { useTranslation } from "../../contexts/LanguageContext";
import { useDashboardViewModel } from "../../viewmodels/adminDashboard/adminDashboardViewmodal";
import Icon from "react-native-vector-icons/Feather";
import DashboardFilterModal from "../components/DashboardFiltermodal";
import Ionicons from 'react-native-vector-icons/Ionicons';
const DashboardScreen = () => {
  const { t } = useTranslation();
  const { home, loading, loadDashboard } = useDashboardViewModel();

  const [filterVisible, setFilterVisible] = useState(false);

  const applyFilter = (params) => {
    loadDashboard(params);
  };
useEffect(() => {
  loadDashboard(); // dispatch thunk on mount
}, []);
  const childrenCards = home?.children_comparison_cards || [];
  console.log(home);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.headercontainer}>
        <Text style={styles.title}>{t("dashboard.title")}</Text>

        <View style={styles.row}>
          <View style={styles.row}>
  <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={18} color="#666" />
  </TouchableOpacity>
</View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* CHILDREN COMPARISON CARDS */}
        <View style={styles.cardRow}>
         <FlatList
  data={childrenCards}
  keyExtractor={(item, index) => index.toString()}
  numColumns={2} // Display 2 columns
  columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
  renderItem={({ item }) => (
    <DashboardCard
      title={`Children ${item.period}`}   // ✅ REQUIRED
      subtitle={t("dashboard.childrenCount")}
      value={item.current_value}          // ✅ current_value
      percent={`${item.percentage}%`}     // ✅ percentage
      trend={item.trend}                  // up / down
    />
  )}
/>
        </View>

        {/* REVENUE CHART */}
        {home?.revenue_analytics && (
          <LineChartCard
            title={home.revenue_analytics.title}
            data={home.revenue_analytics.chart_data}
          />
        )}

        {/* GENDER RATIO */}
        {home?.gender_ratio && (
          <BarChartCard
            title={home.gender_ratio.title}
            data={home.gender_ratio.chart_data}
          />
        )}
      </ScrollView>
      <DashboardFilterModal
  visible={filterVisible}
  onClose={() => setFilterVisible(false)}
  onApply={applyFilter}
/>
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