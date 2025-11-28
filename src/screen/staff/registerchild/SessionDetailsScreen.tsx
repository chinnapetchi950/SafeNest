import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState ,useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Modal
} from 'react-native';
import CustomTextField, {
  CommonButton,
} from '../../components/TextFieldComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import useFilterBottomSheetViewModel from '../../../viewmodels/staff/CreatingChildViewModel';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalstyles, { height } from '../../../styles/globalstyles';
import { useDispatch,useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchGameTypes } from '../../../features/auth/staffSlice/registerNewChild/createChildSlice';
import BottomTabsStaff from '../BottomTabStaff';
const SessionDetailsScreen = ({ route, navigation }) => {
  const viewModel = useFilterBottomSheetViewModel();
  const options = ['45 min', '30 min', '15 min'];
  const [selected, setSelected] = useState('');
  
const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchGameTypes());
}, []);
// const { data, loading } = useSelector((state) => state.auth);

// const gameTypes = data?.fetchGameTypes?.data || [];

  const [picker, setPicker] = useState({
    show: false,
    mode: 'date',
    field: '',
  });
  const [open, setOpen] = useState(false);
  const [gameType, setGameType] = useState(null);
const [childData, setChildData] = useState(null);

 const [items, setItems] = useState([]);
 const[duration,setduration]=useState([])
// const wholeState = useSelector((state) => state);
// console.log("WHOLE STATE:", wholeState);

 
const gameTypesApiResponse = useSelector(
  (state) => state.gameTypes?.data
);
console.log("gameTypesApiResponse",gameTypesApiResponse);

useEffect(() => {
  if (gameTypesApiResponse && gameTypesApiResponse.length > 0) {
    const formatted = gameTypesApiResponse.map((item) => ({
      label: item.name,
      value: item.id,
      price: item.session_price,
      duration: item.sessions,
    }));

    setItems(formatted);
//     const uniqueDurations = [
//       ...new Set(gameTypesApiResponse.map(item => item.session_duration))
//     ];

//     // 🔥 format duration dropdown options
//     const durationOptions = uniqueDurations.map(d => ({
//       label: `${d} hrs`,
//       value: d,
//     }));
console.log(gameTypesApiResponse,'durationOptions');
// const durationOptions = gameTypesApiResponse?.session.map(item => ({
//   label: `${item.session_duration} min`,
//   value: item.session_duration,
// }));


//     setduration(durationOptions);
  }
}, [gameTypesApiResponse]);

  const handleSelect = item => {
    setSelected(item);
    // if (onSelect) onSelect(item);
  };
  const openPicker = (mode, field) => {
      console.log("OPEN PICKER FIELD =", field);

    setPicker({ show: true, mode, field });
  };
const closePicker = () => {
  setPicker({ ...picker, show: false });
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
  const handlePickerChange = (event, selectedValue) => {
  if (event.type === "dismissed") {
    closePicker();
    return;
  }

  closePicker();

  if (picker.mode === "date") {
    const date = new Date(selectedValue);
    const formateddate=formatDate(date)
    const formatted = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    viewModel?.handleInputChangeForm("session_date", formateddate);
  }

  if (picker.mode === "time") {
    const time = new Date(selectedValue);
    const formatted = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    viewModel?.handleInputChangeForm(picker.field, formatted);
  }
};
const { parentform } = route.params;
console.log("parentform",parentform);

 const handleAdd = async () => {
    const result = await viewModel.handleAddChild(parentform);

    if (result) {
      console.log("Screen Got Data:", result);

      // Use the API data here
      setChildData(result);
    }
  };
const closemodal=()=>{
  viewModel.setShowSuccessModal(false)
  navigation.navigate("BottomTabsStaff")
}
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Session Details</Text>
          <Ionicons name="chevron-forward" size={22} color="#000" />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrapper}>
          {/* Left Circle */}
          <View style={styles.activeCircle} />

          {/* Line */}
          <View style={styles.line} />

          {/* Right Active Circle */}
          <View style={styles.leftCircle} />
        </View>

        {/* Texts Under Progress Bar */}
        <View style={styles.labelRow}>
          <Text style={styles.inactiveLabel}></Text>
          <Text style={styles.activeLabel}>Child Details</Text>
        </View>

        <Text style={styles.sectionTitle}>Session Details</Text>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Game Type */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#333',
              marginBottom: 10,
              textAlign: 'right',
            }}
          >
            Game Type
          </Text>

          <DropDownPicker
            open={open}
            value={gameType}
            items={items}
            setOpen={setOpen}
          setValue={(callback) => {
  const val = callback(gameType);
  setGameType(val);

  const selectedItem = items.find(i => i.value === val);

  if (selectedItem) {
    viewModel?.handleInputChangeForm("game_type_id", val);
    
    // 🔥 highlight relevant duration
    // setSelected(selectedItem.duration);
    console.log(selectedItem,'selectedItem?.sessions');
    

    // 🔥 send duration to API
    // 

    setduration(selectedItem?.duration);

  }
}}
            setItems={setItems}
            placeholder="Select Game Type"
            style={{
              borderColor: '#D0D0D0',
              borderRadius: 10,
              height: 55,
            }}
            dropDownContainerStyle={{
              borderColor: '#D0D0D0',
              borderRadius: 10,
            }}
            placeholderStyle={[globalstyles.regular_FontMediumblack,{
              color: '#999',
              fontSize: 16,
              textAlign: 'right',
            }]}
            /** 🔥 Label text style */
            labelStyle={[globalstyles.regular_FontMediumblack,{
              color: '#333',
              fontSize: 18,
              textAlign: 'right',
            }]}
            /** 🔥 Move arrow to right side */
            arrowIconContainerStyle={{
              position: 'absolute',
              left: 15,
              //textAlign: "left",
            }}
            /** 🔥 Rotate arrow if needed */
            arrowIconStyle={
              {
                //transform: [{ rotate: "180deg" }],
              }
            }
          />

          {/* Time Row */}
          <View style={styles.row}>
            <TouchableOpacity
onPress={() => openPicker('time', 'play_to')}
              style={styles.halfField1}
            >
              <CustomTextField
                label="Play Time To"
                placeholder="HH/MM"
                value={viewModel?.childform?.play_to}
                //prefixIcon="time-outline"
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => openPicker('time', 'play_from')}

              // onPress={() => openPicker('time', 'play_from')}
              //style={styles.halfField2}
            >
              <CustomTextField
                label="Play Time From"
                placeholder="HH/MM"
                value={viewModel?.childform?.play_from}
                //prefixIcon="time-outline"
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.halfField}
              onPress={() => openPicker('date', 'session_date')}
            >
              <CustomTextField
                label="Session Date"
                placeholder="YYYY/MM/DD"
                prefixIcon="calendar-outline"
                value={viewModel?.childform?.session_date}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* Session Date */}

          {picker.show && (
            <DateTimePicker
              value={new Date()}
              mode={picker.mode}
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={(event, selectedValue) =>
      handlePickerChange(event, selectedValue)
    }
            />
          )}

          {/* Duration Buttons */}
          {duration.length!=0?
          <Text
            style={[
              styles.labelplay,
              {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                textAlign: 'right',
              },
            ]}
          >
            Play Duration
          </Text>
          :null}
          {/* <View style={styles.durationContainer}>
          {duration.map((dur) => (
            <TouchableOpacity
              key={dur}
              style={[
                styles.durationBox,
                viewModel?.childform?.duration === dur && styles.durationBoxActive,
              ]}
              onPress={() => viewModel?.handleInputChangeForm("duration", dur)}
            >
              <Text
                style={[
                  styles.durationText,
                  viewModel?.childform?.duration === dur && styles.durationTextActive,
                ]}
              >
                {dur?.duration}
              </Text>
            </TouchableOpacity>
          ))}
        </View>  */}
        {duration.length!=0?
          <View style={styles.containerslot}>
  {duration.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.item,{paddingHorizontal:duration.length===3? 35:duration.length===2?65:25
},
        selected === item.duration && 
        styles.activeItem,
      ]}
      onPress={() => {
        setSelected(item.duration);
        viewModel?.handleInputChangeForm("price", item.price);
        viewModel?.handleInputChangeForm("play_duration", item.duration);
        viewModel.handleDurationSelect(item.duration);
      }}
    >
      <Text
        style={[
          styles.text,
          selected === item.duration && styles.activeText,
        ]}
      >
        {item.duration}
      </Text>
    </TouchableOpacity>
  ))}
</View>
:null}


          {/* Add Button */}
          <View style={{ flex: 1, padding: 20 }}>
            {/* your screen content here */}
          </View>
        </ScrollView>
        {/* <View style={styles.bottomButtonWrapper}>
        <CommonButton
          title="Add"
          onPress={() => viewModel.handleadd()}
          style={{ width: "100%" ,height:50}}
        />
      </View> */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleAdd}
            style={[
              styles.button,
              viewModel.isaddButtonDisabled && styles.buttonDisabled,
            ]}
            disabled={viewModel.isaddButtonDisabled}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal transparent visible={viewModel.showSuccessModal}  animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.containermodal}>
    <TouchableOpacity onPress={()=>closemodal()} style={styles.closeBtn} >
          <Ionicons name="close-circle" size={26} color="red" />
          </TouchableOpacity>
          {/* Success Check */}
          <View style={styles.circle}>
            <Text style={styles.check}>✓</Text>
          </View>

          {/* Title */}
          <Text style={styles.titlemodal}>The child has been registered now!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            The child has been successfully registered and can now start the play session.{"\n"}
            Please print the child’s barcode.
          </Text>

          {/* Wristband style */}
          <View style={styles.bandContainer}>
            <View style={styles.bandBox}>
              <Text style={styles.bandText}>{childData?.data?.name} – Child Name</Text>
              <Text style={styles.bandText}>{childData?.data?.guardian_name} – Guardian</Text>
              <Text style={styles.bandText}>{childData?.data?.phone} – Phone Number</Text>
              <Text style={styles.bandText}>{childData?.data?.play_to} – Session End Duration</Text>
            </View>

            <View style={styles.bandDots}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>
          </View>

          {/* White Card */}
          <View style={styles.card}>
            <View style={styles.rowmodal}>
              <View style={styles.col}>
                <Text style={styles.labelmodal}>Guardian</Text>
                <Text style={styles.value}>{childData?.data?.guardian_name}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.labelmodal}>Child Name</Text>
                <Text style={styles.value}>{childData?.data?.name}</Text>
              </View>
            </View>

            <View style={styles.rowmodal}>
              <View style={styles.col}>
                <Text style={styles.labelmodal}>Session Duration</Text>
                <Text style={styles.value}>{childData?.data?.play_to} Min</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.labelmodal}>Phone Number</Text>
                <Text style={styles.value}>{childData?.data?.phone}</Text>
              </View>
            </View>

            <View style={styles.rowmodal}>
              <View style={styles.col}>
                <Text style={styles.labelmodal}>Session Price</Text>
                <Text style={styles.value}>{viewModel?.childform?.price}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.labelmodal}>Session End Duration</Text>
                <Text style={styles.value}>{childData?.data?.play_to}</Text>
              </View>
            </View>
          </View>

          {/* Print Button */}
          <TouchableOpacity style={styles.printBtn} 
          //onPress={onClose} 
          >
            <Text style={styles.printText}>Print</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginRight: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  progressActive: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#A78BFA',
  },
  progressInactive: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#E4E4E7',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#A78BFA',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  halfField: {
    flex: 0.88,
    // marginHorizontal:10,
  },
  halfField1: {
    //flex: 0.01,
    //width:110,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 16,
    marginBottom: 6,
  },
  labelplay: {
    fontSize: 14,
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationBox: {
    flex: 1,
    backgroundColor: '#EFF0F2',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  durationBoxActive: {
    backgroundColor: '#FFFFFF',
    elevation:2
  },
  durationText: {
    color: '#D9D9D9',
    fontWeight: '500',
  },
  durationTextActive: {
    color: '#000',
  },
  addBtn: {
    backgroundColor: '#A78BFA',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  addBtnDisabled: {
    backgroundColor: '#E4E4E7',
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 15,
    marginHorizontal: 50,
    marginVertical: 10,
  },

  leftCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
  },

  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 4,
  },

  activeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#A278F4',
  },

  /* labels below bar */
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },

  inactiveLabel: {
    fontSize: 11,
    color: '#C4C4C4',
  },

  activeLabel: {
    fontSize: 13,
    color: '#C4C4C4',
    fontWeight: '600',
  },
  containerslot: {
    backgroundColor: '#EDEDF0',
    padding: 5,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  activeItem: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: '#B0B0B0',
    fontWeight: '600',
  },
  activeText: {
    color: '#000',
  },
  bottomButtonWrapper: {
    //padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    //height:45,
    borderColor: '#eee',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '95%',
    backgroundColor: '#A278F4',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft:30,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    // justifyContent: "center",
    // alignItems: "center",
    justifyContent: "flex-end", 
  },
  containermodal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 30,
    alignItems: "center",
  },
closeBtn: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 8,
    zIndex: 10,
  },
  closeText: {
    fontSize: 22,
    color: "#555",
  },
  circle: {
    width: 70,
    height: 70,
    backgroundColor: "#CFF7D3",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  check: { fontSize: 40, color: "#1DB954" },

  titlemodal: {
    fontSize: 18,
    color: "#18A558",
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginBottom: 18,
  },

  bandContainer: {
    width: "90%",
    backgroundColor: "#25C14A",
    borderRadius: 10,
    padding: 4,
    height:'12%',
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bandBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    width: "70%",
  },
  bandText: {
    fontSize: 10,
    color: "#444",
  },
  bandDots: {
    flexDirection: "row",
    marginLeft: 8,
    flexWrap: "wrap",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 3,
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 25,
  },

  rowmodal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  col: {
    width: "48%",
  },

  labelmodal: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  printBtn: {
    width: "80%",
    backgroundColor: "#CFF7D3",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  printText: {
    color: "#18A558",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SessionDetailsScreen;
