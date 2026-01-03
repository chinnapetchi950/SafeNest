import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../../api/apiClient';
import authService from '../../features/auth/authService';
import { timeAgo } from '../../utils/dateTime';
import strings from '../../localization/en';
import { useTranslation } from '../../contexts/LanguageContext';
export default function NotificationScreen({navigation}) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const {t}=useTranslation();

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
  const fetchNotifications = async (pageNumber = 1) => {
    try {
      pageNumber === 1 ? setLoading(true) : setLoadingMore(true);
      const res = await authService.notification_List(pageNumber);
      console.log(res, 'responseList');

      // const res = await apiClient.get(
      //   `/api/user/notifications?page=${pageNumber}`
      // );

      const newData = res.data?.data || [];
      const pagination = res.data?.pagination;
console.log(pagination);

      setNotifications(prev =>
        pageNumber === 1 ? newData : [...prev, ...newData],
      );

      setPage(pagination.current_page);
      setLastPage(pagination.last_page);
    } catch (err) {
      console.log('Notification Error', err?.response?.data);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /* ---------------- DELETE NOTIFICATION ---------------- */
  const deleteNotification = async (id: number) => {
    Alert.alert(t('common.delete'), t('alerts.deleteConfirm'), [
      { text: t('common.cancel') },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await authService.deletenotification(id);
            console.log(res, 'responsedelete');
            if(res?.status){
              Alert.alert(t('alerts.success'), res.data?.message)
              setNotifications(prev => prev.filter(item => item.id !== id));
            }

          } catch (err) {
            console.log('Delete error', err?.response?.data);
          }
        },
      },
    ]);
  };

  /* ---------------- LOAD MORE ---------------- */
  const loadMore = () => {
    if (page < lastPage && !loadingMore) {
      fetchNotifications(page + 1);
    }
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
        <View>
          {/* <Ionicons name="hourglass-outline" size={18} color="#C5A8FF" /> */}
          <View>
            <Text style={styles.childName}>{item.title}</Text>
            <Text style={styles.message}>{item.body}</Text>
          </View>
          
        </View>
         <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 10,
          marginLeft:2
        }}
      >
                <Ionicons name="hourglass-outline" size={18} color="#D69E2E" />
                </View>

      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          //marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={() => deleteNotification(item.id)}>
              <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
            </TouchableOpacity>
        {/* <Text style={styles.time}>{item.time}</Text> */}
      </View>
    </TouchableOpacity>
    //     <View style={styles.card}>
    //       <View style={{flexDirection:'row',
    //     justifyContent:'space-between',
    //     alignItems:'center',}}>
    //     <View style={styles.topRow}>
    //         <Text style={styles.time}>
    //           {timeAgo(item?.created_at)}
    //           {/* {new Date(item.created_at).toLocaleString()} */}
    //         </Text>

    //         <TouchableOpacity onPress={() => deleteNotification(item.id)}>
    //           <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
    //         </TouchableOpacity>
    //       </View>
    //       <View>
    //  <Text style={styles.title}>{item.title}</Text>
    //       <Text style={styles.message}>{item.body}</Text>
    //       </View>

    // <View style={styles.bottomRow}>
    //         {/* <Ionicons
    //           name={
    //             item.is_read
    //               ? "checkmark-done-outline"
    //               : "notifications-outline"
    //           }
    //           size={18}
    //           color="#764AF1"
    //         /> */}
    //                 <Ionicons name="hourglass-outline" size={18} color="#C5A8FF" />

    //       </View>
    //       </View>

    //       {/* <Text style={styles.title}>{item.title}</Text>
    //       <Text style={styles.message}>{item.body}</Text> */}

    //     </View>
  );

  /* ---------------- FOOTER ---------------- */
  const ListFooter = () => {
    if (page >= lastPage) return null;

    return (
      <TouchableOpacity style={styles.viewAll} onPress={loadMore}>
        {loadingMore ? (
          <ActivityIndicator color="#764AF1" />
        ) : (
          <Text style={styles.viewAllText}>{t('dashboard.loadMore')}</Text>
        )}
      </TouchableOpacity>
    );
  };

  /* ---------------- LOADER ---------------- */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#764AF1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#333" />

          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Ionicons name="notifications-outline" size={22} color="#764AF1" />
        </View>

        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          style={{marginTop:5}}
          renderItem={renderNotification}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={
            <Text style={styles.empty}>No notifications found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },

  // card: {
  //   backgroundColor: "#F8F5FF",
  //   padding: 12,
  //   borderRadius: 12,
  //   marginBottom: 12,
  //   borderWidth: 1,
  //   borderColor: "#EFE6FF",

  // },

  topRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  // time: {
  //   fontSize: 11,
  //   color: "#888",
  // },

  // title: {
  //   fontSize: 14,
  //   fontWeight: "700",
  //   color: "#764AF1",
  //   marginTop: 6,
  //   textAlign: "right",
  // },

  // message: {
  //   fontSize: 13,
  //   color: "#666",
  //   marginTop: 4,
  //   textAlign: "right",
  // },

  bottomRow: {
    marginTop: 10,
    alignItems: 'flex-end',
  },

  viewAll: {
    paddingVertical: 16,
    alignItems: 'center',
  },

  viewAllText: {
    color: '#764AF1',
    fontSize: 15,
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
  card: {
    backgroundColor: '#F8F5FF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFE6FF',
  },

  time: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },

  childName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#764AF1',
    marginTop: 2,
    textAlign: 'right',
  },

  message: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
    textAlign: 'right',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },

//   loader: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//     marginTop:10,
//     elevation:3
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#333",
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#764AF1",
//     marginTop: 10,
//     marginBottom: 10,
//     textAlign:'right'
//   },

// card: {
//   backgroundColor: "#F8F5FF",
//   padding: 12,
//   borderRadius: 12,
//   marginBottom: 12,
//   borderWidth: 1,
//   borderColor: "#EFE6FF",
// },

// time: {
//   color: "#888",
//   fontSize: 12,
//   marginBottom: 4,
// },

// childName: {
//   fontSize: 14,
//   fontWeight: "700",
//   color: "#764AF1",
//   marginTop: 2,
//   textAlign:'right'
// },

// message: {
//   fontSize: 13,
//   color: "#666",
//   marginTop: 4,
//       textAlign:'right'

// },

//   viewAll: {
//     paddingVertical: 16,
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderColor: "#EEE",
//     marginTop: 10,
//   },

//   viewAllText: {
//     color: "#764AF1",
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });
