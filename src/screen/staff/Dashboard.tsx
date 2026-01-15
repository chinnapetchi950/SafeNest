import React, { useEffect,useCallback, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  Alert,
  Linking,
  BackHandler,

} from 'react-native';
import globalstyles from '../../styles/globalstyles';
import { string } from '../../utils/String';
import { colors } from '../../styles/colors';
import SearchBar from '../components/Searchcomponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardViewModel } from '../../viewmodels/useDashboardViewModel';
import FilterBottomSheet from '../components/FilterModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomTextField from '../components/TextFieldComponent';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import ChildHandoverConfirmation from './ChildHandoverConfirmation';
import { setLoading } from '../../features/auth/loadingSlice.tsx/loadingSlices';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'; 
import { requestBluetoothPermission } from '../../utils/bluetoothPermission';
import { 
   BluetoothEscposPrinter,
   BluetoothManager 
 } from 'react-native-bluetooth-escpos-printer';
 import { useFocusEffect } from '@react-navigation/native';

export default function Dashboard({navigation,route}) {
  const viewModel = useDashboardViewModel();
  const { t } = useTranslation();
const dispatch=useDispatch()
  // modal visible state
  const [visible, setVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openHour, setOpenHour] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);

  const [openMinute, setOpenMinute] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState(null);

  const [items, setItems] = useState([]);
  const [timers, setTimers] = useState({}); // timer per child
  const [firstUsername, setFirstUsername] = useState('');
const [showModal, setShowModal] = useState(false);
const [scannedData, setScannedData] = useState(null);
const [refreshing, setRefreshing] = useState(false);
const [activeLimit, setActiveLimit] = useState(4);
const [expiredLimit, setExpiredLimit] = useState(4);
 const [reloadFlag, setReloadFlag] = useState(false);

useEffect(() => {
  if (route?.params?.showHandoverModal) {
    // console.log(route?.params?.showHandoverModal,'route?.params?.showHandoverModal');
    
    setScannedData(route?.params?.scannedBarcode);
    viewModel?.setShowModal(true);
  }
}, [route?.params]);
  //  const [picker, setPicker] = useState({
  //   show: false,
  //   mode: "time",
  //   field: "",
  // });

  // Hours & Minutes arrays
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));
  // load API on mount
  // useEffect(() => {
  //   viewModel?.loadChildren();
  // }, []);
  useFocusEffect(
  useCallback(() => {
    viewModel.loadChildren();
  }, [])
);
  useEffect(() => {
    setItems([
      
    ]);
  }, []);
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(
  //       'Exit App',
  //       'Are you sure you want to exit?',
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         { text: 'Yes', onPress: () => BackHandler.exitApp() },
  //       ],
  //       { cancelable: true }
  //     );
  //     return true; // Prevent default back behavior
  //   };

  //   if (Platform.OS === 'android') {
  //     BackHandler.addEventListener('hardwareBackPress', backAction);
  //   }

  //   return () => {
  //     if (Platform.OS === 'android') {
  //       BackHandler.removeEventListener('hardwareBackPress', backAction);
  //     }
  //   };
  // }, []);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const updatedTimers = {};
  //     const getFullName = child => {
  //       if (!child) return '';
  //       return [
  //         child?.firstname,
  //         child?.secondname,
  //         child?.thirdname,
  //         child?.fourthname,
  //       ]
  //         .filter(Boolean)
  //         .join(' ');
  //     };
  //           let shouldReload = false;

  //     if (viewModel?.childList?.active_children?.length > 0) {
  //       const fullName = getFullName(
  //         viewModel?.childList?.active_children[0].user,
  //       );

  //       setFirstUsername(fullName);
  //     }
  //     // or get from expired children
  //     else if (viewModel?.childList?.expired_children?.length > 0) {
  //       const fullName = getFullName(
  //         viewModel?.childList.expired_children[0].user,
  //       );

  //       setFirstUsername(fullName);
  //     }
  //     viewModel?.childList?.active_children?.forEach(child => {
  //       const now = moment();
  //       const sessionDate = moment(child.session_date, 'YYYY-MM-DD');
  //       const playToTime = moment(
  //         `${child.session_date} ${child.play_to}`,
  //         'YYYY-MM-DD HH:mm:ss',
  //       );

  //       if (
  //         child?.session_status === 'active' &&
  //         sessionDate.isSame(now, 'day')
  //       ) {
  //         const duration = moment.duration(playToTime.diff(now)); // play_to_time - current_time
  //         if (duration.asMilliseconds() > 0) {
  //           const hours = Math.floor(duration.asHours());
  //           const minutes = duration.minutes();
  //           const seconds = duration.seconds();
  //           updatedTimers[child.id] = `${hours}:${minutes
  //             .toString()
  //             .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  //         } else {
  //           updatedTimers[child.id] = '0:00:00';
  //           shouldReload = true;
  //         }
  //       } else {
  //         updatedTimers[child.id] = '0:00:00';
  //       }
  //     });

  //     setTimers(updatedTimers);

  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [viewModel?.childList]);
const expiredSessionIdsRef = useRef(new Set());
useEffect(() => {
  const interval = setInterval(() => {
    const updatedTimers = {};
    let shouldReload = false;

    const getFullName = (child) => {
      if (!child) return '';
      return [
        child?.firstname,
        child?.secondname,
        child?.thirdname,
        child?.fourthname,
      ]
        .filter(Boolean)
        .join(' ');
    };

    // Set first username (no change)
    if (viewModel?.childList?.active_children?.length > 0) {
      setFirstUsername(
        getFullName(viewModel.childList.active_children[0].user)
      );
    } else if (viewModel?.childList?.expired_children?.length > 0) {
      setFirstUsername(
        getFullName(viewModel.childList.expired_children[0].user)
      );
    }

    viewModel?.childList?.active_children?.forEach((child) => {
      const now = moment();
      const sessionDate = moment(child.session_date, 'YYYY-MM-DD');
      // console.log(sessionDate,child.session_date,"session_date");
      
 const playToTime = moment(`${child.session_date} ${child.play_to}`, 'YYYY-MM-DD HH:mm:ss');
      // const playFromTime = moment(
      //   `${child.session_date} ${child.play_from}`,
      //   'YYYY-MM-DD HH:mm:ss'
      // );

      // // ✅ USE play_duration (more reliable)
      // const playToTime = playFromTime
      //   .clone()
      //   .add(Number(child.play_duration), 'minutes');

      if (
        child?.session_status === 'active' &&
        sessionDate.isSame(now, 'day')
      ) {
        const diffMs = playToTime.diff(now);
        // console.log(diffMs,"diffMs");
        

        if (diffMs > 0) {
          const d = moment.duration(diffMs);
          updatedTimers[child.id] =
            `${Math.floor(d.asHours())}:` +
            `${d.minutes().toString().padStart(2, '0')}:` +
            `${d.seconds().toString().padStart(2, '0')}`;
        } else {
          updatedTimers[child.id] = '0:00:00';

          // ✅ CALL API ONLY ONCE PER CHILD
          if (!expiredSessionIdsRef.current.has(child.id)) {
            expiredSessionIdsRef.current.add(child.id);
            shouldReload = true;
          }
        }
      } else {
        updatedTimers[child.id] = '0:00:00';
      }
    });

    // console.log(updatedTimers);
    setTimers(updatedTimers);

    // ✅ SINGLE API CALL (NO LOOP)
    if (shouldReload) {
      viewModel.loadChildren();
    }

  }, 1000);

  return () => clearInterval(interval);
}, [viewModel?.childList]);


//  useEffect(() => {
//   const interval = setInterval(() => {
//     const updatedTimers = {};
//     let shouldReload = false;

//     const getFullName = (child) => {
//       if (!child) return '';
//       return [child?.firstname, child?.secondname, child?.thirdname, child?.fourthname]
//         .filter(Boolean)
//         .join(' ');
//     };

//     if (viewModel?.childList?.active_children?.length > 0) {
//       setFirstUsername(getFullName(viewModel.childList.active_children[0].user));
//     } else if (viewModel?.childList?.expired_children?.length > 0) {
//       setFirstUsername(getFullName(viewModel.childList.expired_children[0].user));
//     }

//     viewModel?.childList?.active_children?.forEach((child) => {
//       const now = moment();
//       const sessionDate = moment(child.session_date, 'YYYY-MM-DD');
//       const playToTime = moment(`${child.session_date} ${child.play_to}`, 'YYYY-MM-DD HH:mm:ss');

//       if (child?.session_status === 'active' && sessionDate.isSame(now, 'day')) {
//         const duration = moment.duration(playToTime.diff(now));
//         if (duration.asMilliseconds() > 0) {
//           const hours = Math.floor(duration.asHours());
//           const minutes = duration.minutes();
//           const seconds = duration.seconds();
//           updatedTimers[child.id] = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
//             .toString()
//             .padStart(2, '0')}`;
//         } else {
//           updatedTimers[child.id] = '0:00:00';
//           shouldReload = true;
//         }
//       } else {
//         updatedTimers[child.id] = '0:00:00';
//       }
//     });
// console.log(updatedTimers);

//     setTimers(updatedTimers);

//     if (shouldReload && !reloadFlag) {
//       setReloadFlag(true); // prevent repeated API calls
//       viewModel.loadChildren().finally(() => setReloadFlag(false));
//     }
//   }, 1000);

//   return () => clearInterval(interval);
// }, [viewModel?.childList]);




useEffect(() => {
  const initBluetooth = async () => {
    try {
      const granted = await requestBluetoothPermission();

      if (!granted) {
        Alert.alert(
          t('printer.bluetooth_required'),
          t('printer.bluetooth_required_msg'),
        );
        return;
      }

      // Wait a bit to let permission take effect before checking
      setTimeout(async () => {
        const ready = await ensureBluetoothReady();
        if (!ready) {
          console.log('Bluetooth not ready');
        }
      }, 300);
    } catch (e) {
      console.log('Bluetooth init error', e);
    }
  };

  initBluetooth();
}, []);



// Check & enable Bluetooth
const ensureBluetoothReady = async () => {
  try {
    let isEnabled = false;

    try {
      isEnabled = await BluetoothManager.isBluetoothEnabled();
    } catch (e) {
      console.log('Bluetooth check error', e);
      isEnabled = false;
    }

    if (!isEnabled) {
      return new Promise((resolve) => {
        Alert.alert(
          'Bluetooth Disabled',
          'Please turn ON Bluetooth to connect printer',
          [
            {
              text: 'Cancel',
              onPress: () => resolve(false),
              style: 'cancel',
            },
            {
              text: 'Turn On',
              onPress: async () => {
                try {
                  await BluetoothManager.enableBluetooth();
                  // 🔥 wait a moment for system to enable Bluetooth
                  setTimeout(() => resolve(true), 1500);
                } catch (e) {
                  console.log('Failed to enable Bluetooth', e);
                  resolve(false);
                }
              },
            },
          ],
          { cancelable: false }
        );
      });
    }

    return true;
  } catch (e) {
    console.log('Bluetooth check error', e);
    return false;
  }
};



  const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = new Date(selectedDate);
      const formateDate = formatDate(date);
      const formatted = `${date.getFullYear()}/${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      viewModel.handleInputChange('date_of_birth', formateDate);
    }
  };
  const openPicker = (mode, field) => {
    setPicker({ show: true, mode, field });
  };
  const onCall = phone => {
    // const phone = phone?.toString().trim();

    // 🔥 1. Check if number exists

  if (!phone) {
  Alert.alert(t('alerts.error') || 'Error', t('validation.phoneRequired') || 'User phone number is missing.');
      return;
    }
    const phoneRegex = /^[+]?[\d]{6,15}$/;

    if (!phoneRegex.test(phone)) {
  Alert.alert(t('alerts.error') || 'Error', t('validation.phoneInvalid') || 'The phone number is invalid.');
      return;
    }

    const phoneNumber = `tel:${phone}`;

      Linking.openURL(phoneNumber).catch(() => {
      Alert.alert(t('alerts.error') || 'Error', t('alerts.error') || 'Unable to place the call.');
    });
  };
  

const renderItem = React.useCallback(({ item }) => {
  if (item.type === 'header') {
    return (
      <Text style={[globalstyles.semibold_black, styles.listheader]}>
        {item.title}
      </Text>
    );
  }

  if (item.type === 'loadmore') {
    return (
      <TouchableOpacity
        style={styles.loadMoreBtn}
        onPress={() => {
          if (item.section === 'active') {
            setActiveLimit(prev => prev + 4);
          } else {
            setExpiredLimit(prev => prev + 4);
          }
        }}
      >
  <Text style={styles.loadMoreText}>{t('dashboard.loadMore')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ChildSessionCard
      name={item.name}
      guardian={item.guardian_name}
      phone={item?.phone}
      playtime={item.total_play_duration}
      timer={timers[item.id] || '0:00:00'}
      status={item.session_status}
      onDeliver={() => navigation.navigate('ManualHandoverScanner',{userid:item?.id})}
      onEndSession={() => {viewModel.endChildSession(item.id)}}
      onCall={() => {
        onCall(item?.phone);
      }}
      onMessage={() => {}}
    />
  );
});


  const onClose = () => setVisible(false);
const onRefresh = async () => {
  // Start global loader
  dispatch(setLoading(true));

  try {
    await viewModel.loadChildren(); // reload API
  } catch (err) {
    console.log('Refresh error', err);
  } finally {
    // Stop global loader
    dispatch(setLoading(false));
  }
};
  const onApply = async () => {
    await viewModel.handleSearch();
    setVisible(false);
  };
  // console.log("childList===>",viewModel?.childList);
 const combinedData = [
  // ---- Children Waiting for Handover (Expired Children) ----
  ...(viewModel?.childList?.expired_children?.length
    ? [
        { type: 'header', title: 'Children Waiting for Handover' },

        ...viewModel.childList.expired_children
          .slice(0, expiredLimit)   // ⬅ ONLY show limited items
          .map(item => ({
            ...item,
            type: 'item',
            section: 'expired',
          })),

        ...(viewModel.childList.expired_children.length > expiredLimit
          ? [{ type: 'loadmore', section: 'expired' }]
          : []),
      ]
    : []),

  // ---- Active Children ----
  ...(viewModel?.childList?.active_children?.length
    ? [
        { type: 'header', title: 'Active Children' },

        ...viewModel.childList.active_children
          .slice(0, activeLimit)   // ⬅ ONLY show limited items
          .map(item => ({
            ...item,
            type: 'item',
            section: 'active',
          })),

        ...(viewModel.childList.active_children.length > activeLimit
          ? [{ type: 'loadmore', section: 'active' }]
          : []),
      ]
    : []),
];




  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={globalstyles.mainbg}>
        <Text style={[globalstyles.semibold_black, styles.title]}>
          {string.game}
        </Text>
        <View style={styles.row}>
          {/* <Icon name="bell" size={20} color="#B3B3B3" /> */}
          <Text style={styles.userName}>{firstUsername}</Text>
        </View>
        <SearchBar
          placeholder={t('common.searchForChild')}
          onChangeText={text => viewModel.handleSearchChange(text)}
          // onChangeText={text => {}}
          onSearchPress={() => viewModel.handleSearch()}
          onFilterPress={() => {
            setVisible(true);
          }}
        />

        <FlatList
          data={combinedData}
          style={{marginBottom:120}}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
    item?.id ? item.id.toString() : `header-${index}`
  }
  extraData={viewModel.childList} 
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
  onRefresh={onRefresh}
   ListEmptyComponent={() => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
      <Text style={{ fontSize: 16, color: "#888" }}>{t('common.noData')}</Text>
    </View>
  )}
        />
      </View>

      {/* Modal */}
      <FilterBottomSheet
        visible={visible}        onClose={() => setVisible(false)}
onApply={async () => {
  await viewModel.handleSearch(); // ✅ actually call the function
  setVisible(false);
}}        viewModel={viewModel}
        minutes={minutes}
        hours={hours}
        openHour={openHour}
        openMinute={openMinute}
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        setOpenHour={setOpenHour}
        setOpenMinute={setOpenMinute}
        setSelectedHour={setSelectedHour}
        setSelectedMinute={setSelectedMinute}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        handleDateChange={handleDateChange}
         onReset={async () => {
    viewModel.resetFilter(); // Reset all filter fields in the viewModel
    await viewModel.loadChildren(); // Reload home/dashboard data without filters
    setVisible(false); // Close the modal
  }}
      />
      {viewModel?.showModal && (
  <ChildHandoverConfirmation
    data={{ barcode: scannedData }}
    onClose={() => viewModel?.setShowModal(false)}
    onconfirm={()=>{viewModel.childHandoverdata(scannedData)}}
  />
)}
    </SafeAreaView>
  );
}

interface ChildSessionCardProps {
  name: string;
  guardian: string;
  playtime: string;
  timer: string;
  status: string;
  onDeliver?: () => void;
  onEndSession?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
  phone?:()=>number;
}
export const ChildSessionCard: React.FC<ChildSessionCardProps> = React.memo(
  ({
    name,
    guardian,
    playtime,
    timer,
    status,
    onDeliver,
    onEndSession,
    onCall,
    onMessage,
    phone,
  }) => {
    const isActive = status == 'active';
    const isTimerCompleted = timer === '0:00:00';

    const {t}=useTranslation()

   const openWhatsApp=(phoneNumber?: string | number)=> {
  if (!phoneNumber) {
    Alert.alert(
      t('alerts.error') || 'Error',
      t('validation.phoneRequired') || 'Phone number is missing'
    );
    return;
  }

  const cleanedNumber = phoneNumber.toString().replace(/\D/g, '');

  if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
    Alert.alert(
      t('alerts.error') || 'Invalid number',
      t('validation.phoneInvalid') || 'Please enter a valid phone number'
    );
    return;
  }

  // ✅ WhatsApp App Scheme (BEST)
  const appUrl = `whatsapp://send?phone=${cleanedNumber}`;

  // 🌐 Web fallback
  const webUrl = `https://wa.me/${cleanedNumber}`;

  Linking.canOpenURL(appUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(appUrl); // ✅ Opens WhatsApp directly
      } else {
        return Linking.openURL(webUrl); // 🌐 Opens browser
      }
    })
    .catch(() => {
      Alert.alert(
        t('alerts.error') || 'Error',
        t('settings.whatsappNotInstalled') || 'Unable to open WhatsApp'
      );
    });
}
  

    return (
      <View style={styles.card}>
                <View style={styles.topRow}>
          
          <View style={styles.statusContainer}>
            
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? '#E9FCEB' : '#FFF8E6' },
              ]}
            >
              
              <Ionicons
                name={
                  isActive ? 'checkmark-circle-outline' : 'alert-circle-outline'
                }
                color={isActive ? '#2ECC71' : '#F4B400'}
                size={14}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? '#2ECC71' : '#F4B400' },
                ]}
              >
                
                {isActive ? 'Active Now' : 'Waiting'}
              </Text>
            </View>
            <View style={styles.timerContainer}>
              
              <Text style={styles.timerText}>{timer}</Text>
              <Ionicons
                name={isActive ? 'time-outline' : 'hourglass-outline'}
                size={18}
                color={isActive ? '#2ECC71' : '#F4B400'}
              />
            </View>
          </View>
          <View style={styles.infoContainer}>
            
            <Text style={styles.nameText}>{name}</Text>
            <Text style={[styles.guardianText]}>Guardian: {guardian}</Text>
            <Text style={styles.playtimeText}>Total Playtime: {playtime}</Text>
          </View>
        </View>
        {/* Divider */} <View style={styles.divider} />
        {/* Bottom Action Buttons */}
        <View style={styles.actionRow}>
          
          <View style={styles.buttonRow}>
            
            {isActive&&!isTimerCompleted ? (
              <TouchableOpacity
                style={[styles.button, styles.endButton]}
                onPress={onEndSession}
              >

                <Text style={styles.endText}>{t('common.endSession')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.deliverButton]}
                onPress={onDeliver}
              >

                <Text style={styles.deliverText}>{t('common.deliver')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: '#4CAF50' }]}
              onPress={onCall}
            >
              
              <Ionicons name="call-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: '#EAF4FF' }]}
              onPress={()=>openWhatsApp(phone)}
              // onPress={onMessage}
            >
              
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#4A90E2"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.quickActionsText}></Text>
        </View>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  timerow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign: 'auto',
  },
  halfField: {
    flex: 0.48,
  },
  listheader: {
    textAlign: 'right',
    marginVertical: 15,
  },

  genderOption: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 8,
    //paddingHorizontal: 4,
    marginRight: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    color: '#555',
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginRight: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  guardianText: {
    fontSize: 13,
    color: '#666',
  },
  playtimeText: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    borderBottomWidth: 0.7,
    borderColor: '#eee',
    marginVertical: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 8,
  },
  deliverButton: {
    backgroundColor: '#B39DDB',
  },
  deliverText: {
    color: '#fff',
    fontWeight: '600',
  },
  endButton: {
    backgroundColor: '#FDECEC',
  },
  endText: {
    color: '#E53935',
    fontWeight: '600',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  quickActionsText: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    color: colors.primary,
    alignSelf: 'flex-end',
    fontWeight: '700',
    paddingVertical: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  bottomSheet: {
    width: '100%',
    maxHeight: '80%', // 👈 Your half screen / 80% screen
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  reset: {
    color: '#8B5CF6',
    fontWeight: '600',
  },

  label: {
    marginTop: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    textAlign: 'right',
  },

  genderRow: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  genderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  applyBtn: {
    backgroundColor: '#8B5CF6',
    padding: 14,
    borderRadius: 12,
    marginTop: 35,
    alignItems: 'center',
  },

  applyText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    //justifyContent: 'space-between',
    gap: 10,
  },

  userName: {
    color: '#B3B3B3',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  loadMoreBtn: {
  padding: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#EFEAFF',
  borderRadius: 8,
  marginBottom: 12,
},
loadMoreText: {
  color: '#6A4CE0',
  fontWeight: '600',
  fontSize: 14,
},

});

// const style=StyleSheet.create({
// title:{
//     color:colors.primary,
//     alignSelf:"flex-end",
//     fontWeight:"700"

// }
// })
