import React, { useEffect, useRef, useState } from 'react';
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
export default function Dashboard() {
  const viewModel = useDashboardViewModel();

  // modal visible state
  const [visible, setVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openHour, setOpenHour] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);

  const [openMinute, setOpenMinute] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState(null);

  const [items, setItems] = useState([]);
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
  useEffect(() => {
    viewModel.loadChildren();
  }, []);
  useEffect(() => {
    setItems([
      { label: 'Football', value: 'Football' },
      { label: 'Cricket', value: 'Cricket' },
      { label: 'Badminton', value: 'Badminton' },
      { label: 'Chess', value: 'Chess' },
    ]);
  }, []);
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

  const renderItem = React.useCallback(({ item }) => {
    if (item.type === 'header') {
      return (
        <Text style={[globalstyles.semibold_black, styles.listheader]}>
          {item.title}
        </Text>
      );
    }
    return (
      <ChildSessionCard
        name={item.name}
        guardian={item.guardian_name}
        playtime={item.total_play_duration}
        timer={item.timer}
        status={item.session_status}
        onDeliver={() => {}}
        onEndSession={() => {}}
        onCall={() => {}}
        onMessage={() => {}}
      />
    );
  });

  const onClose = () => setVisible(false);

  const onApply = async () => {
    await viewModel.handleSearch();
    setVisible(false);
  };
  // console.log("childList===>",viewModel?.childList);
  const combinedData = [
    // ---- Expired Children ----
    ...(viewModel?.childList?.expired_children?.length
      ? [
          { type: 'header', title: 'Children Waiting for Handover' },
          ...viewModel.childList.expired_children.map(item => ({
            ...item,
            type: 'item',
          })),
        ]
      : []),

    // ---- Active Children ----
    ...(viewModel?.childList?.active_children?.length
      ? [
          { type: 'header', title: 'Active Children' },
          ...viewModel.childList.active_children.map(item => ({
            ...item,
            type: 'item',
          })),
        ]
      : []),
  ];

  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={globalstyles.mainbg}>
        <Text style={[globalstyles.semibold_black, styles.title]}>
          {string.game}
        </Text>

        <SearchBar
          placeholder="Search for a child"
          onChangeText={text => viewModel.handleSearchChange(text)}
          // onChangeText={text => {}}
          onSearchPress={() => viewModel.handleSearch()}
          onFilterPress={() => {viewModel.resetFilter(),setVisible(true)}}
        />

        <FlatList
          data={combinedData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Modal */}
     <FilterBottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  onApply={viewModel.handleSearch}
  viewModel={viewModel}

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
/>

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
  }) => {
    const isActive = status == 'active';
    return (
      <View style={styles.card}>
        {' '}
        {/* Top Section */}{' '}
        <View style={styles.topRow}>
          {' '}
          <View style={styles.statusContainer}>
            {' '}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? '#E9FCEB' : '#FFF8E6' },
              ]}
            >
              {' '}
              <Ionicons
                name={
                  isActive ? 'checkmark-circle-outline' : 'alert-circle-outline'
                }
                color={isActive ? '#2ECC71' : '#F4B400'}
                size={14}
              />{' '}
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? '#2ECC71' : '#F4B400' },
                ]}
              >
                {' '}
                {isActive ? 'Active Now' : 'Waiting'}{' '}
              </Text>{' '}
            </View>{' '}
            <View style={styles.timerContainer}>
              {' '}
              <Text style={styles.timerText}>{timer}</Text>{' '}
              <Ionicons
                name={isActive ? 'time-outline' : 'hourglass-outline'}
                size={18}
                color={isActive ? '#2ECC71' : '#F4B400'}
              />{' '}
            </View>{' '}
          </View>{' '}
          <View style={styles.infoContainer}>
            {' '}
            <Text style={styles.nameText}>{name}</Text>{' '}
            <Text style={[styles.guardianText]}>Guardian: {guardian}</Text>{' '}
            <Text style={styles.playtimeText}>Total Playtime: {playtime}</Text>{' '}
          </View>{' '}
        </View>{' '}
        {/* Divider */} <View style={styles.divider} />{' '}
        {/* Bottom Action Buttons */}{' '}
        <View style={styles.actionRow}>
          {' '}
          <View style={styles.buttonRow}>
            {' '}
            {isActive ? (
              <TouchableOpacity
                style={[styles.button, styles.endButton]}
                onPress={onEndSession}
              >
                {' '}
                <Text style={styles.endText}>End Session</Text>{' '}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.deliverButton]}
                onPress={onDeliver}
              >
                {' '}
                <Text style={styles.deliverText}>Deliver</Text>{' '}
              </TouchableOpacity>
            )}{' '}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: '#4CAF50' }]}
              onPress={onCall}
            >
              {' '}
              <Ionicons name="call-outline" size={18} color="#fff" />{' '}
            </TouchableOpacity>{' '}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: '#EAF4FF' }]}
              onPress={onMessage}
            >
              {' '}
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#4A90E2"
              />{' '}
            </TouchableOpacity>{' '}
          </View>{' '}
          <Text style={styles.quickActionsText}>Quick Actions</Text>{' '}
        </View>{' '}
      </View>
    );
  },
);
const styles = StyleSheet.create({
  timerow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
    verticalAlign:'auto'
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
});

// const style=StyleSheet.create({
// title:{
//     color:colors.primary,
//     alignSelf:"flex-end",
//     fontWeight:"700"

// }
// })
