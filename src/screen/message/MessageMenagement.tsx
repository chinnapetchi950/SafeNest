
import React, { useState ,useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRegisterGameViewModel } from "../../viewmodels/registerNewgameViewmodal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';
import authService from "../../features/auth/authService";
import MinutePicker from "../components/MunitePicker";
import DatePickerInput from "../components/Datepicker";
import moment from "moment";
export default function MessageManagementScreen({navigation}) {
  // const [activeTab, setActiveTab] = useState("saved");
const [activeTab, setActiveTab] = useState("saved");
  const [messages, setMessages] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // 👈 selected message
const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await authService.getMessagelist();
      setMessages(res?.data?.data?.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // const onDelete = (id) => {
  //   Alert.alert(
  //     strings.messageManagement.delete,
  //     strings.messageManagement.deleteConfirm,
  //     [
  //       { text: strings.messageManagement.cancel },
  //       {
  //         text: strings.messageManagement.delete,
  //         style: "destructive",
  //         onPress: async () => {
  //           // ✅ refresh list
  //         },
  //       },
  //     ]
  //   );
  // };
  // Dummy Saved Messages
  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     type: "Alert Message",
  //     content:
  //       "Dear Guardian, (child’s name) has finished playtime. Please come for pickup.",
  //     timing: "2 minutes before the session ends",
  //   },
  //   {
  //     id: 2,
  //     type: "Reward Message",
  //     content:
  //       "The child (child_name) has spent over an hour playing! Enjoy a special discount.",
  //     timing: "Sending Time",
  //   },
  // ]);

  const deleteMessage = async(id) => {
    Alert.alert(t('userList.confirmDeleteTitle'), t('messageManagement.deleteConfirm'), [
      { text: t('common.cancel') },
      {
        text: t('common.delete'),
        style: "destructive",
       onPress: async () => {
  try {
    await authService.deleteMessage(id);
    fetchMessages(); 
    setMessages((prev) => prev.filter((item) => item.id !== id));
  } catch (error) {
    console.error(error);
  }
},
      },
    ]);
  };
const onSuccess=() => {
    setActiveTab("saved");   // 👈 switch tab
    fetchMessages();        // 👈 refresh list
  }
  const handleEdit = (item) => {
  setEditingItem(item);
  setIsEditMode(true);
  setActiveTab("create"); // 👈 move to form tab
};
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
<View style={styles.container}>
      {/* --------- Header --------- */}
<View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text style={styles.headerTitle}>{t('messageManagement.title')}</Text>

          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-forward-outline"
            size={24}
            color="#111"
            style={{ marginLeft: 6 }}
          />
        </View>
      {/* --------- Tabs --------- */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "saved" && styles.activeTabText,
            ]}
          >
            {t('messageManagement.savedMessages')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "create" && styles.activeTab]}
          onPress={() => setActiveTab("create")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "create" && styles.activeTabText,
            ]}
          >
            {isEditMode? t('messageManagement.update') : t('messageManagement.createMessage')}
            
          </Text>
        </TouchableOpacity>
      </View>

      {/* --------- Content --------- */}
      {activeTab === "saved" ? (
        <SavedMessages messages={messages} deleteMessage={deleteMessage} onEdit={handleEdit} />
      ) : (
        <CreateMessageForm editItem={editingItem}
  isEditMode={isEditMode} onSuccess={() => {
    setActiveTab("saved");   // 👈 switch tab
    fetchMessages();        // 👈 refresh list
  }}/>
      )}
    </View>
    </SafeAreaView>
    
  );
}

const SavedMessages = ({ messages, deleteMessage,onEdit  }) => {
  const { t } = useTranslation();
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      {messages.map((msg) => (
        <View key={msg.id} style={styles.card}>
          {/* Edit + Delete buttons */}
         
<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
<View style={styles.cardHeader}>
            <TouchableOpacity onPress={() => onEdit(msg)} style={styles.editBtn}>
                  <Text style={styles.editText}>{t('messageManagement.edit')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteMessage(msg.id)}
            >
              <Text style={styles.deleteText}>{t('messageManagement.delete')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardTitle}>{msg.name}</Text>
</View>
          
          <Text style={styles.cardContent}>{msg.content}</Text>
<View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
          <Text style={styles.cardTiming}>{msg.send_time} {t('messageManagement.minutesBefore')}</Text>
          <Text style={[styles.cardTitle,{fontWeight:'400'}]}> {t('messageManagement.sendDate')}</Text>
</View>
          

        </View>
      ))}
    </ScrollView>
  );
};

const CreateMessageForm = ({onSuccess,editItem,isEditMode}) => {
  const [messageName, setMessageName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedlabel,setselectedLabel]=useState("");
  const { t } = useTranslation();
  // const viewModel = useRegisterGameViewModel();
// const [msglist,setmsglist]=useState([{'id':1, 'name':'End of the working hours'},{'id':2, 'name':'Alert Message'},{'id':3, 'name':'Reward Message'},{'id':3, 'name':'General Message'}])
  const [selectedType, setSelectedType] = useState("");
  const MESSAGE_TYPES = {
  END_WORK: "end_work",
  ALERT: "alert",
  REWARD: "reward",
  GENERAL: "general",
};
const msglist = [
  { id: 1, type: MESSAGE_TYPES.END_WORK, label: t("messageManagement.endWork") },
  { id: 2, type: MESSAGE_TYPES.ALERT, label: t("messageManagement.alert") },
  { id: 3, type: MESSAGE_TYPES.REWARD, label: t("messageManagement.reward") },
  { id: 4, type: MESSAGE_TYPES.GENERAL, label: t("messageManagement.general") },
];
useEffect(() => {
    if (isEditMode && editItem?.type) {
      setSelectedType(editItem.type); // 🔥 store backend type directly
    }
  }, [isEditMode, editItem]);
  // const saveMessage = () => {
  //   if (!messageName || !messageContent) {
  //     Alert.alert("Error", "Please fill all fields");
  //     return;
  //   }

  //   Alert.alert("Success", "Message Saved!");
  // };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, }}>
       <Text style={styles.addMsgTitle}>{t("messageManagement.selectMessageType")}</Text>

              <TouchableOpacity  style={{marginTop:8}} onPress={() => setModalVisible(!modalVisible)}>
                <View style={styles.msgInputBox}>
                  <Ionicons
                    name={modalVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#999"
                  />
                  <Text style={{ color:selectedType?"#000": "#888" }}>
                    {selectedlabel || t("messageManagement.selectMessage")}
                  </Text>
                </View>
              </TouchableOpacity>
      
              {modalVisible && (
                <View style={styles.messageBox}>
                  {msglist.map((msg) => (
        <View key={msg.id} style={styles.msgRow}>
          <Text style={styles.msgLabel}>{msg.label}</Text> {/* use label */}
          <TouchableOpacity
            onPress={() => {
               setSelectedType(msg.type);
               setselectedLabel(msg.label);
  setModalVisible(false); // close modal on select
            }}
            style={[
              styles.checkbox,
              selectedType === msg.type && styles.checkboxChecked,
            ]}
          >
            {selectedType ===msg.type && (
               <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      ))}
      
                </View>
              )}
               {selectedType === MESSAGE_TYPES.END_WORK && <WorkingHoursForm onSuccess={onSuccess} editItem={editItem} isEditMode={isEditMode}/>}
      {selectedType === MESSAGE_TYPES.ALERT && <AlertMessageForm onSuccess={onSuccess} editItem={editItem} isEditMode={isEditMode} />}
      {selectedType === MESSAGE_TYPES.REWARD && <RewardMessageForm onSuccess={onSuccess} editItem={editItem} isEditMode={isEditMode}/>}
      {selectedType === MESSAGE_TYPES.GENERAL && <GeneralMessageForm  onSuccess={onSuccess} editItem={editItem} isEditMode={isEditMode}/>}

      <View style={{ height: 50 }} />
      
    </ScrollView>
  );
};
const WorkingHoursForm = ({onSuccess,isEditMode, editItem }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [endMinute, setEndMinute] = useState(null);
  const [sendMinute, setSendMinute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placescloses, setplaceclose] = useState(false);
    const { t } = useTranslation();

 useEffect(() => {
    if (isEditMode && editItem) {
      setName(editItem.name || "");
      setContent(editItem.content || "");
      setSendMinute(editItem.send_time);
      setplaceclose(editItem.place_closes);
      setEndMinute(editItem?.end_time)
      
    }
  }, [isEditMode, editItem]);
  const isValid =
    name.trim() &&
    content.trim() &&
    endMinute !== null &&
    sendMinute !== null;

  const handleSubmit = async () => {
    if (!isValid) return;

    const formData = {
      name,
      content,
      type: "end_work",
      end_time: endMinute,
      send_time: sendMinute,
      place_closes: placescloses===true?1:0,
       ...(isEditMode && { _method: "PUT" }),
    };
console.log('formData',formData);

    try {
      setLoading(true);
      if (isEditMode) {
        await authService.updateMessage(editItem.id, formData); // 👈 UPDATE
        Alert.alert(t("alerts.success") || 'Updated', t("messageManagement.successUpdated") || 'working hrs message updated');

      } else {
        await authService.createMessage(formData); // 👈 CREATE
        Alert.alert(t("alerts.success") || 'Success', t("messageManagement.successSaved")  || 'working hrs message created');
      }

      // const res=await authService.createMessage(formData);
      // console.log("res",res);
      
      //Alert.alert("Success", "Message created");
      onSuccess()
      setName("");
      setContent("");
      setEndMinute(null);
      setSendMinute(null);
    } catch {
      Alert.alert(t("alerts.error") || 'Error', t("messageManagement.saveFailed") || 'Failed to create message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.block}>
      <Text style={styles.sectionTitle1}>{t("messageManagement.endWork")}</Text>

      <Text style={styles.label1}>{t("messageManagement.messageName")} *</Text>
      <TextInput style={styles.input1} value={name} onChangeText={setName} />

      <Text style={styles.label1}>{t("messageManagement.messageContent")} *</Text>
      <TextInput
        style={[styles.input1, styles.textArea1]}
        multiline
        value={content}
        onChangeText={setContent}
      />

      <View style={styles.row1}>
        <View style={styles.timeBox}>
          <Text style={styles.label1}>{t("messageManagement.endOfWorkingHoursTime")}</Text>
          <MinutePicker value={endMinute} onChange={setEndMinute} />
        </View>

        <View style={[styles.timeBox]}>
          <Text style={styles.label1}>{t("messageManagement.sendingTime")}</Text>
          <View style={{marginTop:20}}></View>
          <MinutePicker value={sendMinute} onChange={setSendMinute} />
        </View>
      </View>
      <View style={{ alignSelf: "flex-end",marginTop:20 }}>

      
 <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setplaceclose(true)}
        >
          <Text style={styles.checkboxLabel}>{t("messageManagement.whenPlaceCloses")}</Text>
          <View
            style={[
              styles.checkbox1,
              placescloses === true && styles.checkboxChecked,
            ]}
          >
            {placescloses === true && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
        </View>
      <TouchableOpacity
        disabled={!isValid || loading}
        onPress={handleSubmit}
        style={[
          styles.saveBtn,
          (!isValid || loading) && styles.disabledButton,
        ]}
      >
        <Text style={styles.saveText}>
          {loading ? t("messageManagement.saving") : t("messageManagement.save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  
};

const AlertMessageForm = ({onSuccess,isEditMode, editItem }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sendMinute, setSendMinute] = useState(null);
  const [afterSession, setAfterSession] = useState(false); // null | true | false
    const [beforeSession, setBeforeSession] = useState(false); // null | true | false

  const [loading, setLoading] = useState(false);
 useEffect(() => {
    if (isEditMode && editItem) {
      setName(editItem.name || "");
      setContent(editItem.content || "");
      setSendMinute(editItem.send_time);
      setAfterSession(editItem.after_session);
      setBeforeSession(editItem.before_session);
    }
  }, [isEditMode, editItem]);
  const isValid =
    name.trim() &&
    content.trim() &&
    sendMinute !== null &&
    afterSession !== null;

  const handleSubmit = async () => {
    if (!isValid) return;

    const formData = {
      name,
      content,
      type: "alert",
      send_time: sendMinute,
      after_session: afterSession ? 1 : 0,
      before_session: beforeSession ? 1 : 0,
      ...(isEditMode && { _method: "PUT" }),
    };
console.log('formData',formData);

    try {
      setLoading(true);
      if (isEditMode) {
        await authService.updateMessage(editItem.id, formData); // 👈 UPDATE
        Alert.alert(t("alerts.success") || 'Updated', t("messageManagement.successUpdated") || 'Alert message updated');
      } else {
        await authService.createMessage(formData); // 👈 CREATE
        Alert.alert(t("alerts.success") || 'Success', t("messageManagement.successSaved") || 'Alert message created');
      }

      // reset
      onSuccess()
      setName("");
      setContent("");
      setSendMinute(null);
      setAfterSession(null);
    } catch (e) {
      console.log(e?.response);

      Alert.alert(t("alerts.error") || 'Error', t("messageManagement.saveFailed") || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <Text style={styles.sectionTitle1}>{t("messageManagement.alert")}</Text>

      {/* Message Name */}
      <Text style={styles.label1}>{t("messageManagement.messageName")} *</Text>
      <TextInput
        style={styles.input1}
        value={name}
        onChangeText={setName}
      />

      {/* Message Content */}
      <Text style={styles.label1}>{t("messageManagement.messageContent")} *</Text>
      <TextInput
        style={[styles.input1, styles.textArea1]}
        multiline
        value={content}
        onChangeText={setContent}
      />

      {/* Sending Time */}
      <Text style={styles.label1}>{t("messageManagement.sendingTime")}</Text>
      <View style={{ alignSelf: "flex-end" }}>
        <MinutePicker value={sendMinute} onChange={setSendMinute} />
      </View>

      {/* Before / After Session */}
      <View style={styles.checkboxRow}>
        {/* After Session */}
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setAfterSession(true)}
        >
          <Text style={styles.checkboxLabel}>{t("messageManagement.afterSession")}</Text>
          <View
            style={[
              styles.checkbox1,
              afterSession === true && styles.checkboxChecked,
            ]}
          >
            {afterSession === true && (
              <Ionicons name="checkmark" size={15} color="#fff" />
            )}
          </View>
        </TouchableOpacity>

        {/* Before Session */}
        <TouchableOpacity
          style={styles.checkboxItem}
          onPress={() => setBeforeSession(!beforeSession)}
        >
          <Text style={styles.checkboxLabel}>{t("messageManagement.beforeSession")}</Text>
          <View
            style={[
              styles.checkbox1,
              beforeSession === true && styles.checkboxChecked,
            ]}
          >
            {beforeSession === true && (
              <Ionicons name="checkmark" size={15} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        disabled={!isValid || loading}
        onPress={handleSubmit}
        style={[
          styles.saveBtn,
          (!isValid || loading) && styles.disabledButton,
        ]}
      >
        <Text style={styles.saveText}>
          {loading ? t("messageManagement.saving") : t("messageManagement.save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const RewardMessageForm = ({onSuccess,isEditMode, editItem }) =>{ 
    const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sendDate, setSendDate] = useState(null);
  const [sendMinute, setSendMinute] = useState(null);
  const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

 useEffect(() => {
    if (isEditMode && editItem) {
      setName(editItem.name || "");
      setContent(editItem.content || "");
      setSendMinute(editItem.send_time);
          setSendDate(editItem.send_date ? new Date(editItem.send_date) : null);

      
    }
  }, [isEditMode, editItem]);
  const isValid =
    name.trim() &&
    content.trim() &&
    sendDate instanceof Date &&
    sendMinute !== null;

  const handleSubmit = async () => {
    const formData = {
      name,
      content,
      type: "reward",
      send_time: sendMinute,
      send_date: sendDate,
      ...(isEditMode && { _method: "PUT" }),
    };
console.log('formData',formData);

    try {
      setLoading(true);
      if (isEditMode) {
        await authService.updateMessage(editItem.id, formData); // 👈 UPDATE
        Alert.alert(t("alerts.success") || 'Updated', t("messageManagement.successUpdated") || 'Reward message updated');
      } else {
        await authService.createMessage(formData); // 👈 CREATE
        Alert.alert(t("alerts.success") || 'Success', t("messageManagement.successSaved") || 'Reward message created');
      }
      // await authService.createMessage(formData);
      
      // Alert.alert("Success", "Reward message created");
      onSuccess()
    } catch {
      Alert.alert(t("alerts.error") || 'Error', t("messageManagement.saveFailed") || 'Failed to create reward');
    } finally {
      setLoading(false);
    }
  };
  return(
  <View style={styles.block}>
    <Text style={styles.sectionTitle1}>{t("messageManagement.reward")}</Text>
      <Text style={styles.helperText}>
        {t("messageManagement.rewardMessagesHelper")}
      </Text>

      <Text style={styles.label1}>{t("messageManagement.messageName")} *</Text>
      <TextInput style={styles.input1} value={name} onChangeText={setName} />

      <Text style={styles.label1}>{t("messageManagement.messageContent")} *</Text>
 <TextInput
        style={[styles.input1, styles.textArea1]}
        multiline
        value={content}
        onChangeText={setContent}
      />
            <View style={styles.row1}>
  {/* End of Working Hours */}
  <View style={styles.timeBox}>
    <Text style={styles.label}>{t("messageManagement.sendingDate")}</Text>

  </View>

  {/* Sending Time */}
  <View style={styles.timeBox}>
    <Text style={styles.label}>{t("messageManagement.sendingTime")}</Text>
    
  </View>
</View>

      <View style={styles.row1}>
         <DatePickerInput value={sendDate} onChange={setSendDate} />
        <View style={[styles.timeRow,{justifyContent:'flex-end'}]}>
      <MinutePicker value={sendMinute} onChange={setSendMinute} />
          {/* <TextInput style={styles.timeInput} placeholder="HH:MM" /> */}
        </View>
      </View>

   <TouchableOpacity
        disabled={!isValid || loading}
        onPress={handleSubmit}
        style={[
          styles.saveBtn,
          (!isValid || loading) && styles.disabledButton,
        ]}
      >
        <Text style={styles.saveText}>{t("messageManagement.saveMessage")}</Text>
      </TouchableOpacity>
  </View>
);}

const GeneralMessageForm = ({onSuccess,editItem,isEditMode}) =>{
      const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sendMinute, setSendMinute] = useState(null);
  const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

useEffect(() => {
    if (isEditMode && editItem) {
      setName(editItem.name || "");
      setContent(editItem.content || "");
      setSendMinute(editItem.send_time);
      // setSendDate(moment(editItem.send_date).format('yyyy-mm-dd'));
      
    }
  }, [isEditMode, editItem]);
  const isValid = name.trim() && content.trim() && sendMinute !== null;

  const handleSubmit = async () => {
    const formData = {
      name,
      content,
      type: "general",
      send_time: sendMinute,
       ...(isEditMode && { _method: "PUT" }),
    };
console.log('formData',formData);

    try {
      setLoading(true);
      if (isEditMode) {
        await authService.updateMessage(editItem.id, formData); // 👈 UPDATE
        Alert.alert(t("alerts.success") || 'Updated', t("messageManagement.successUpdated") || 'General message updated');
      } else {
        await authService.createMessage(formData); // 👈 CREATE
        Alert.alert(t("alerts.success") || 'Success', t("messageManagement.successSaved") || 'General message created');
      }
      // await authService.createMessage(formData);
      // Alert.alert("Success", "General message created");
      onSuccess()
    } catch {
      Alert.alert(t("alerts.error") || 'Error', t("messageManagement.saveFailed") || 'Failed to create message');
    } finally {
      setLoading(false);
    }
  };


  return (
  <View style={styles.block}>
    <Text style={styles.sectionTitle1}>{t("messageManagement.general")}</Text>
      <Text style={styles.helperText}>
        {t("messageManagement.generalMessagesHelper")}
      </Text>

      <Text style={styles.label1}>{t("messageManagement.messageName")} *</Text>
      <TextInput style={styles.input1} value={name} onChangeText={setName} />

      <Text style={styles.label1}>{t("messageManagement.messageContent")} *</Text>
      <TextInput
        style={[styles.input1, styles.textArea1]}
        multiline
        value={content}
        onChangeText={setContent}
      />
      <Text style={styles.label1}>{t("messageManagement.sendingTime")}</Text>
      <View style={[styles.timeRow,{justifyContent:'flex-end',alignSelf: "flex-end",}]}>
                      <MinutePicker value={sendMinute} onChange={setSendMinute} />


        {/* <TextInput style={styles.timeInput} placeholder="HH:MM" /> */}
      </View>
        <TouchableOpacity
        disabled={!isValid || loading}
        onPress={handleSubmit}
        style={[
          styles.saveBtn,
          (!isValid || loading) && styles.disabledButton,
        ]}
      >
        <Text style={styles.saveText}>{t("messageManagement.saveMessage")}</Text>
      </TouchableOpacity>
  </View>
);}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    fontSize: 18,
    fontWeight: "600",
    padding: 5,
    color:'#808080',
    textAlign: "right",
  },
headerTitle: {
    fontSize: 18,
    color: "#808080",
    fontWeight: "600",
    marginRight: 60,
     textAlign: "right",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginTop:20,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#A278F4",
  },

  tabText: {
    color: "#999",
    fontSize: 15,
  },

  activeTabText: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 8,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    marginTop:10
  },

  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EEE9FF",
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#808080'
  },
  editText: { color: "#808080", fontWeight: "500" },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 5,
  },
  deleteText: { color: "#FF3B30", fontWeight: "500" },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    //marginTop: 10,
    textAlign:'right'
  },

  cardContent: {
    fontSize: 14,
    color: "#666",
    //marginTop: 8,
    textAlign:'right'
  },

  cardTiming: {
    fontSize: 13,
    //marginTop: 10,
    color: "#808080",
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },

  label: { marginTop: 20, fontWeight: "600", fontSize: 14 ,textAlign:'right'},

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#fafafa",
  },

  // saveBtn: {
  //   backgroundColor: "#8B5CF6",
  //   padding: 15,
  //   borderRadius: 10,
  //   marginTop: 25,
  // },

  // saveText: {
  //   color: "#fff",
  //   textAlign: "center",
  //   fontWeight: "bold",
  // },
    addMsgTitle: { fontSize: 14, marginTop: 30, fontWeight: "600", textAlign: "right" },
  msgInputBox: {
    marginTop: 5, borderWidth: 1, borderColor: "#ddd", borderRadius: 15,
    paddingHorizontal: 14, height: 48, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between"
  },
  messageBox: {
    marginTop: 14, padding: 14, borderWidth: 1,
    borderColor: "#EAEAEA", borderRadius: 12, backgroundColor: "#FAFAFA"
  },
  msgRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginVertical: 8,
  },
  msgLabel: { fontSize: 15, color: "#444", textAlign: "right" },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: "#bbb", justifyContent: "center", alignItems: "center"
  },
  checkboxChecked: { backgroundColor: "#A259FF", borderColor: "#A259FF" },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor:  "#A278F4",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 40,
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  block: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  container1: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle1: {
    fontSize: 16,
    fontWeight: "700",
    color: "#808080",
    marginTop: 24,
    marginBottom: 8,
    textAlign:'right'
  },
  helperText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  label1: {
    fontSize: 16,
    color: "#808080",
    marginBottom: 6,
    marginTop: 12,
    textAlign:'right',
  },
  input1: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  textArea1: {
    height: 90,
    textAlignVertical: "top",
  },
  // row1: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   gap: 10,
  //   marginTop: 10,
  //   flex:1,
  //   alignItems:'center'
  // },
  // timeRow: {
  //   flexDirection: "row",
  //   gap: 8,
  //   flex:0.5
  // },
  // minuteInput: {
  //   borderWidth: 1,
  //   borderColor: "#E5E7EB",
  //   borderRadius: 20,
  //   paddingVertical: 6,
  //   paddingHorizontal: 12,
  //   fontSize: 12,
  // },
  timeInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    fontSize: 12,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
    justifyContent:'flex-end',
        marginBottom:10

  },
  checkbox1: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#808080",
    marginRight: 12,
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  timeBox: {
  flex: 1,
},
row1: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 12,
},



timeRow: {
  flexDirection: "row",
  marginTop: 6,
  width:'50%'
},

minuteInput: {
   width: 150,              // 👈 fixed pill width
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 16,
  fontSize: 12,
  color: "#6B7280",
  backgroundColor: "#FFF",
  textAlign: "center",
},

checkboxItem: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
  marginVertical: 6,
},


});
