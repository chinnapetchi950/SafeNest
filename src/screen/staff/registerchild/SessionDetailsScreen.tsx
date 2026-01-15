import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState ,useEffect,useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Modal,
  Image
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
import Storage from '../../../utils/storage';
import { useTranslation } from 'react-i18next';
// import {
//   BLEPrinter,
// } from 'react-native-thermal-receipt-printer-image-qr';
import {requestBluetoothPermission} from '../../../utils/bluetoothPermission';
// import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { 
   BluetoothEscposPrinter,
   BluetoothManager 
 } from 'react-native-bluetooth-escpos-printer';
 
import { PermissionsAndroid, Alert } from 'react-native';
import QRCodeSVG from '../../components/SvgXml';
import SvgToPng from '../../components/svgtoPng';
const PAPER_58 = 32;
const PAPER_80 = 48;
const line = (width) => '-'.repeat(width);

const center = (text, width) => {
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(pad) + text;
};

const row = (label, value, width) => {
  const space = width - label.length - value.length;
  return label + ' '.repeat(Math.max(1, space)) + value;
};
const USE_MOCK_PRINTER = true; // 🔥 METHOD-1 ENABLED
const PAPER_58_WIDTH = 384; // 58mm

const SessionDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const viewModel = useFilterBottomSheetViewModel();
  const options = ['45 min', '30 min', '15 min'];
  const [selected, setSelected] = useState('');
  const [showPrinterModal, setShowPrinterModal] = useState(false);

//   const [printerConnected, setPrinterConnected] = useState(false);
// const [printerMac, setPrinterMac] = useState(null);

      const [role, setRole] = useState(null);
  const svgToPngRef = useRef();

const dispatch = useDispatch();

const buildReceiptText = (paperWidth = PAPER_58) => {
  return `
${center('CHILD REGISTRATION', paperWidth)}
${line(paperWidth)}

${row('Child', childData?.data?.name || '-', paperWidth)}
${row('Guardian', childData?.data?.guardian_name || '-', paperWidth)}
${row('Phone', childData?.data?.phone || '-', paperWidth)}

${line(paperWidth)}
${row('Session', childData?.data?.play_to || '-', paperWidth)}
${row('Price', `${viewModel?.childform?.price}`, paperWidth)}

${line(paperWidth)}
${center('Thank You', paperWidth)}

`;
};
const connectingRef = useRef(false);

const buildQRData = () => {
  return JSON.stringify({
    child: childData?.data?.name,
    guardian: childData?.data?.guardian_name,
    phone: childData?.data?.phone,
    session: childData?.data?.play_to,
  });
};

const [printerConnected, setPrinterConnected] = useState(false);
const [printerMac, setPrinterMac] = useState(null);
const [printers, setPrinters] = useState([]);
const [connectingPrinter, setConnectingPrinter] = useState(false);
const safeParse = (value) => {
  console.log(value);

  if (!value) return [];

  // ✅ already parsed (Android newer versions)
  if (Array.isArray(value)) return value;

  // ✅ string case (older versions)
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return [];
};
const filterPrinters = (devices = []) => {
  return devices.filter(d =>
    d.name 
  );
};
// && (
//       d.name.toLowerCase().includes('zeb') ||
//       d.name.toLowerCase().includes('sg') ||
//       d.name.toLowerCase().includes('printer')
//     )
const safeDisconnect = async () => {
  try {
    await BluetoothManager.disconnect();
  } catch {}
};


const combineDevices = (paired = [], found = []) => {
  const map = new Map();

  [...paired, ...found].forEach(device => {
    if (device?.address) {
      map.set(device.address, device);
    }
  });

  return Array.from(map.values());
};

const fetchPairedPrinters = async () => {
  try {
    const ready = await ensureBluetoothReady();
    if (!ready) return;

    const result = await BluetoothManager.scanDevices();
    console.log(result);
    
    const pairedDevices = normalizeScanResult(result);
    const allDevices = combineDevices(
  pairedDevices?.paired,
  pairedDevices?.found
);

console.log('All Devices:', allDevices);

const printerList = filterPrinters(allDevices);

console.log('Filtered Printers:', printerList);

    if (printerList.length === 0) {
      Alert.alert('Printer', 'No paired printers found');
      return;
    }

    setPrinters(printerList);
    setShowPrinterModal(true);
  } catch (e) {
    console.log('Fetch printers error:', e);
    Alert.alert('Printer', 'Failed to scan printers');
  }
};



useEffect(() => {
  const autoConnectLastPrinter = async () => {
    try {
      const savedMac = await Storage.getItem('LAST_PRINTER_KEY');
      if (!savedMac) return;

      const enabled = await BluetoothManager.isBluetoothEnabled();
      if (!enabled) return;

      await BluetoothManager.connect(savedMac);
      setPrinterMac(savedMac);
      setPrinterConnected(true);

      console.log('Auto-connected printer:', savedMac);
    } catch (e) {
      console.log('Auto-connect failed:', e);
    }
  };

  autoConnectLastPrinter();
}, []);

// Ensure Bluetooth is ON
const ensureBluetoothReady = async () => {
  try {
    const enabled = await BluetoothManager.isBluetoothEnabled();
    if (!enabled) {
      await BluetoothManager.enableBluetooth();
      await new Promise(res => setTimeout(res, 1000)); // wait 1 second
    }
    return true;
  } catch (e) {
    console.log('Bluetooth check error', e);
    return false;
  }
};




const normalizeScanResult = (result) => {
  if (!result) return { paired: [], found: [] };

  if (typeof result === 'string') {
    try {
      return JSON.parse(result);
    } catch {
      return { paired: [], found: [] };
    }
  }

  return result;
};
const connectPrinter = async (printer) => {
  setConnectingPrinter(true)
  if (!printer?.address) {
    Alert.alert('Printer', 'Invalid printer selected');
    return false;
  }

  // if (connectingRef.current) {
  //   console.log('Printer: already connecting');
  //   return false;
  // }

  // connectingRef.current = true;

  try {
    console.log('Requesting Bluetooth permissions...');
    const granted = await requestBluetoothPermission();
    if (!granted) {
      Alert.alert('Printer', 'Bluetooth & Location permissions are required');
      return false;
    }

    // -----------------------------
    // ENSURE BLUETOOTH IS READY
    // -----------------------------
    let btEnabled = await BluetoothManager.isBluetoothEnabled();
    if (!btEnabled) {
      console.log('Bluetooth not enabled, enabling...');
      await BluetoothManager.enableBluetooth();
    }

    // poll until BT is fully ready (max 8 seconds)
    let timeout = 0;
    while (!(btEnabled = await BluetoothManager.isBluetoothEnabled()) && timeout < 8000) {
      console.log('Waiting for Bluetooth stack to be ready...');
      await new Promise(r => setTimeout(r, 500));
      timeout += 500;
    }
    if (!btEnabled) {
      Alert.alert('Printer', 'Bluetooth could not be enabled. Please enable manually.');
      return false;
    }

    // -----------------------------
    // GET PAIRED DEVICES
    // -----------------------------
    console.log('Scanning devices...');
    const pairedDevices = await BluetoothManager.scanDevices();
    const devices = normalizeScanResult(pairedDevices);
     const allDevices = combineDevices(
  devices?.paired,
  devices?.found
);

console.log('All Devices:', allDevices);
    const matchedDevice = allDevices?.find(d => d.address === printer.address);

    if (!matchedDevice) {
      Alert.alert('Printer', `Printer ${printer.name} is not paired. Pair it in system settings first.`);
      return false;
    }

    // -----------------------------
    // DISCONNECT PREVIOUS PRINTER
    // -----------------------------
    // try {
    //   console.log('Disconnecting any previous printer...');
    //   await BluetoothManager.disableBluetooth();
    //   await new Promise(r => setTimeout(r, 500));
    // } catch (err) {
    //   console.log('No previous printer to disconnect or disconnect failed', err);
    // }

    // -----------------------------
    // CONNECT
    // -----------------------------
    console.log('Connecting to printer:', printer.name, printer.address);
    try {
      await BluetoothManager.connect(printer.address);
    } catch (err) {
      console.log('Initial connect failed, retrying once...', err);
      await new Promise(r => setTimeout(r, 1000));
      await BluetoothManager.connect(printer.address);
    }

    console.log('Printer connected successfully:', printer.name);
    await Storage.setItem('LAST_PRINTER_KEY', printer.address);
    setPrinterConnected(true)
    Alert.alert('Printer', `Connected to ${printer.name} successfully!`);
setConnectingPrinter(false)
    return true;
  } catch (err) {
    setConnectingPrinter(false)
    console.log('Printer connection error:', err);
    Alert.alert('Printer', `Unable to connect: ${err.message || err}`);
    return false;
  } finally {
    connectingRef.current = false;
  }
};



// Helper: poll until Bluetooth is fully enabled
const ensureBluetoothEnabled = async (timeout = 10000) => {
  try {
    let enabled = await BluetoothManager.isBluetoothEnabled();
    if (enabled) return true;

    await BluetoothManager.enableBluetooth();

    const start = Date.now();
    while (!enabled && Date.now() - start < timeout) {
      await new Promise(r => setTimeout(r, 500));
      enabled = await BluetoothManager.isBluetoothEnabled();
    }

    return enabled;
  } catch (err) {
    console.log('Bluetooth enable error', err);
    return false;
  }
};










useEffect(() => {
  const initPrinter = async () => {
    try {
      await requestBluetoothPermission();

      const savedMac = await Storage.getItem('LAST_PRINTER_KEY');

      if (savedMac) {
        // 🔥 Auto-connect last selected printer
        await BluetoothManager.connect(savedMac);
        setPrinterMac(savedMac);
        setPrinterConnected(true);

        console.log('Auto-connected printer:', savedMac);
      } else {
        // 🔥 No saved printer → ask user
        fetchPairedPrinters();
      }
    } catch (e) {
      console.log('Printer init failed:', e);
      fetchPairedPrinters(); // fallback
    }
  };

  initPrinter();
}, []);





useEffect(() => {
  dispatch(fetchGameTypes());
}, []);
 useEffect(() => {
      const loadRole = async () => {
        const r = await Storage.getItem('admin'); // contains "admin" or "user"
        setRole(r);
      };
      loadRole();
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
const [showPrintPreview, setShowPrintPreview] = useState(false);
const [printedText, setPrintedText] = useState('');
const [printedImage, setPrintedImage] = useState(null);

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
  if(role==='admin'){
navigation.navigate("BottomTabs")
  }else{
navigation.navigate("BottomTabsStaff")
}
  }
  
const getPrintPayload = () => ({
  text: `
==============================
     CHILD REGISTRATION
==============================

Child   : ${childData?.data?.name}
Guardian: ${childData?.data?.guardian_name}
Phone   : ${childData?.data?.phone}
Session : ${childData?.data?.play_to}
Price   : ${viewModel?.childform?.price}
`,
  qr: JSON.stringify({
    id: childData?.data?.id,
    phone: childData?.data?.phone,
    child: childData?.data?.name,
    guardian: childData?.data?.guardian_name,
    session: childData?.data?.play_to,
    
  }),
});
// const onPrint = async () => {
//   try {
//     console.log(printerConnected,"");
    
//     if (!printerConnected) {
//       const connected = await connectPrinter();
//       if (!connected) return;
//     }

//     if (!childData?.data) {
//       Alert.alert('Print', 'No child data available');
//       return;
//     }
// console.log("BluetoothEscposPrinter",BluetoothEscposPrinter);

//     const payload = getPrintPayload();

//     await BluetoothEscposPrinter.printText(
//       payload.text + '\n',
//       { encoding: 'GBK', codepage: 0 }
//     );

//     if (childData?.data?.qr_code_base64) {
//       await BluetoothEscposPrinter.printPic(
//         childData.data.qr_code_base64,
//         { width: PAPER_58_WIDTH }
//       );
//     }

//     await BluetoothEscposPrinter.printText('\n\n', {});
//     Alert.alert('Print', 'Printed successfully');

//   } catch (e) {
//     console.log('Print error:', e);
//     setPrinterConnected(false);
//     Alert.alert('Print Error', e?.message || 'Unknown error');
//   }
// };


const onPrint = async () => {
  try {
    if (!printerConnected) {
      Alert.alert('Printer', 'Printer not connected');
      return;
    }

    if (!childData?.data) {
      Alert.alert('Print', 'No child data available');
      return;
    }

    // ✅ Initialize printer
    await BluetoothEscposPrinter.printerInit();

    // ✅ CENTER ALIGN
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );

    await BluetoothEscposPrinter.printText(
      'CHILD REGISTRATION\n' +
      '------------------------------\n',
      { encoding: 'GBK', codepage: 0 }
    );

    // ✅ LEFT ALIGN
    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.LEFT
    );

    await BluetoothEscposPrinter.printText(
      `Child    : ${childData.data.name}\n` +
      `Guardian : ${childData.data.guardian_name}\n` +
      `Phone    : ${childData.data.phone}\n` +
      `Session  : ${childData.data.play_to}\n` +
      `Price    : ${viewModel?.childform?.price}\n` +
      '------------------------------\n',
      { encoding: 'GBK', codepage: 0 }
    );

    // ✅ PRINT QR CODE
    if (childData?.data?.qr_code_base64) {
      await BluetoothEscposPrinter.printPic(
        childData.data.qr_code_base64,
        {
          width: BluetoothEscposPrinter.width58, // or width80
        }
      );
    }

    // ✅ FEED PAPER (CORRECT METHOD)
    await BluetoothEscposPrinter.printAndFeed(80);

    Alert.alert('Print', 'Printed successfully');
  } catch (e) {
    console.log('Print error:', e);
    Alert.alert('Print Error', e?.message || 'Unknown error');
  }
};


















// const onPrint = async () => {
//   try {
//     const ready = await ensureBluetoothReady();
//     if (!ready) return;

//     if (!printerConnected) {
//       Alert.alert('Printer', 'Printer not connected');
//       return;
//     }
//     if (!childData?.data) {
//       Alert.alert('Print', 'No data available');
//       return;
//     }

//     const payload = getPrintPayload();

//     console.log('PRINT STARTED');

//     // 🔴 Ensure SVG ref exists
//     if (!svgToPngRef.current) {
//       Alert.alert('Print', 'QR image not ready');
//       return;
//     }

//     // 1️⃣ Convert SVG → PNG (ONLY ONCE)
//     const pngUri = await svgToPngRef.current.convertToPng();
//     console.log('PNG URI:', pngUri);

//     // ===============================
//     // 🔴 MOCK MODE (NO PRINTER)
//     // ===============================
//     // if (USE_MOCK_PRINTER) {
//     //   console.log('MOCK MODE ENABLED');

//     //   setPrintedText(payload.text);
//     //   setPrintedImage(pngUri);
//     //   setShowPrintPreview(true);
//     //   return;
//     // }

//     // ===============================
//     // 🟢 REAL PRINTER MODE
//     // ===============================

//     // ⚠️ SAFETY CHECK (avoid native crash)
//     const isConnected = await BLEPrinter.isConnected?.();
//     if (!isConnected) {
//       Alert.alert('Printer', 'Printer not connected');
//       return;
//     }

//     // 2️⃣ Print text
//     await BLEPrinter.printText(payload.text);

//     // 3️⃣ Print image / QR
//     if (pngUri) {
//       await BLEPrinter.printImage(pngUri, { width: 384 }); // 58mm
//       //setPrintedImage(pngUri);
//     } else {
//       await BLEPrinter.printQR(payload.qr);
//       //setPrintedImage(null);
//     }

//     await BLEPrinter.printText('\n\n');

//     // 4️⃣ Show preview after printing
//     // setPrintedText(payload.text);
//     // setShowPrintPreview(true);

//   } catch (e) {
//     console.log('PRINT ERROR:', e);
//     Alert.alert('Print Error', e?.message || 'Unknown error');
//   }
// };


  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('session.sessionDetails')}</Text>
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
          <Text style={styles.activeLabel}>{t('child.childDetails')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('session.sessionDetails')}</Text>

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
            {t('session.gameType')}
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
            placeholder={t('session.selectGameType')}
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
                label={t('session.playTimeTo')}
                placeholder={t('session.timePlaceholder')}
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
                label={t('session.playTimeFrom')}
                placeholder={t('session.timePlaceholder')}
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
                label={t('session.sessionDate')}
                placeholder={t('session.datePlaceholder')}
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
            {t('session.playDuration')}
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
            <Text style={styles.buttonText}>{t('buttons.add')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal transparent visible={viewModel?.showSuccessModal}  animationType="fade">
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
          <Text style={styles.titlemodal}>{t('child.childRegisteredSuccess')}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {t('child.childRegisteredMessage')}
          </Text>

          {/* Wristband style */}
          <View style={styles.bandContainer}>



            <View style={styles.bandBox}>
              <View>
<Text style={styles.bandText}>{childData?.data?.name} – {t('child.childNameLabel')}</Text>
              <Text style={styles.bandText}>{childData?.data?.guardian_name} – {t('child.guardianLabel')}</Text>
              <Text style={styles.bandText}>{childData?.data?.phone} – {t('child.phoneNumberLabel')}</Text>
              <Text style={styles.bandText}>{childData?.data?.play_to} – {t('child.sessionEndDuration')}</Text>

              </View>
                          <QRCodeSVG svgBase64={childData?.data?.qr_code_base64} />

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
                <Text style={styles.labelmodal}>{t('child.guardianLabel')}</Text>
                <Text style={styles.value}>{childData?.data?.guardian_name}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.labelmodal}>{t('child.childNameLabel')}</Text>
                <Text style={styles.value}>{childData?.data?.name}</Text>
              </View>
            </View>

            <View style={styles.rowmodal}>
              <View style={styles.col}>
                <Text style={styles.labelmodal}>{t('child.sessionDuration')}</Text>
                <Text style={styles.value}>{childData?.data?.play_to} Min</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.labelmodal}>{t('child.phoneNumberLabel')}</Text>
                <Text style={styles.value}>{childData?.data?.phone}</Text>
              </View>
            </View>

            <View style={styles.rowmodal}>
              <View style={styles.col}>
                <Text style={styles.labelmodal}>{t('child.sessionPrice')}</Text>
                <Text style={styles.value}>{viewModel?.childform?.price}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.labelmodal}>{t('child.sessionEndDurationLabel')}</Text>
                <Text style={styles.value}>{childData?.data?.play_to}</Text>
              </View>
            </View>
          </View>

          {/* Print Button */}
          <TouchableOpacity onPress={() =>  onPrint('58')} style={styles.printBtn} 
          //onPress={onClose} 
          >
            <Text style={styles.printText}>{t('buttons.print')}</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
    <Modal
  transparent
  visible={showPrinterModal}
  animationType="slide"
>
  <View style={styles.overlay}>
    <View style={styles.containermodal}>
      <Text style={styles.titlemodal}>Select Printer</Text>

      <ScrollView style={{ width: '100%' }}>
        {printers.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.printerItem}
            onPress={() => connectPrinter(item)}
          >
            <Text style={styles.printerName}>
              {item.name || 'Unknown Printer'}
            </Text>
            <Text style={styles.printerMac}>
              {item.address}
            </Text>
          </TouchableOpacity>
        ))}
         
      </ScrollView>
   {connectingPrinter && (
        <Text style={{ marginTop: 10, fontWeight: '600' }}>Connecting...</Text>
      )}
      <TouchableOpacity
        style={styles.printBtn}
        onPress={() => setShowPrinterModal(false)}
      >
        <Text style={styles.printText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    <SvgToPng
  ref={svgToPngRef}
  svgBase64={childData?.data?.qr_code_base64}
/>
    {/* <Modal
  transparent
  visible={showPrintPreview}
  animationType="fade"
>
  <View style={styles.overlay}>
    <View style={styles.printPreviewContainer}>

      <Text style={styles.previewTitle}>
        Printer Payload (Final Output)
      </Text>

      <ScrollView style={styles.previewBox}>
        <Text style={styles.previewText}>
          {printedText}
        </Text>

        {printedImage && (
          <>
            <Text style={styles.previewSubtitle}>QR Code</Text>
            <Image
              source={{ uri: printedImage }}
              style={styles.qrPreview}
              resizeMode="contain"
            />
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.okButton}
        onPress={() => setShowPrintPreview(false)}
      >
        <Text style={styles.okText}>OK</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal> */}

    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  printPreviewContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  alignSelf: 'center',
  maxHeight: '80%',
},

previewTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 10,
  textAlign: 'center',
},

previewBox: {
  marginBottom: 15,
},

previewText: {
  fontSize: 12,
  fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  color: '#000',
},

previewSubtitle: {
  marginTop: 12,
  fontWeight: '600',
  textAlign: 'center',
},

qrPreview: {
  width: 180,
  height: 180,
  alignSelf: 'center',
  marginTop: 10,
},

okButton: {
  backgroundColor: '#A278F4',
  paddingVertical: 12,
  borderRadius: 20,
  alignItems: 'center',
},

okText: {
  color: '#fff',
  fontWeight: '700',
},

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
    padding: 12,
    width: "70%",
    flexDirection:'row',justifyContent:'space-between',alignItems:'center',
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
    paddingVertical: 15,
    borderRadius: 28,
    marginTop: 16,
    alignItems: "center",
  },
  printText: {
    color: "#18A558",
    fontSize: 16,
    fontWeight: "600",
  },
  printerItem: {
  padding: 15,
  borderBottomWidth: 1,
  borderColor: '#eee',
},
printerName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',
},
printerMac: {
  fontSize: 12,
  color: '#666',
  marginTop: 4,
},

});

export default SessionDetailsScreen;
