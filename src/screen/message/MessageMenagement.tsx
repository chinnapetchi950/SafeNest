// // MessageScreens.js
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from "react-native";

// import { useFocusEffect } from "@react-navigation/native";

// // Simple small pill button
// function Pill({ children, onPress, style }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={[styles.pill, style]}>
//       <Text style={styles.pillText}>{children}</Text>
//     </TouchableOpacity>
//   );
// }

// function MessageCard({ item, onEdit }) {
//   return (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Pill style={styles.editPill} onPress={() => onEdit(item)}>
//           Edit Message
//         </Pill>
//         <Text style={styles.cardTitle}>{item.message_name}</Text>
//       </View>

//       <Text style={styles.cardBody} numberOfLines={3}>
//         {item.message_content}
//       </Text>

//       <View style={styles.cardFooter}>
//         <Text style={styles.footerText}>
//           {formatSendingText(item)}
//         </Text>
//         <Text style={styles.sendingLabel}>Sending Time</Text>
//       </View>
//     </View>
//   );
// }

// function formatSendingText(item) {
//   // Example: "2 minutes before the session ends" or absolute time
//   if (item.type === "alert") {
//     const dir = item.offset_type === "before" ? "before" : "after";
//     return `${item.offset_time} minutes ${dir} the session ends`;
//   }
//   if (item.type === "reward") {
//     return `Sent on ${item.send_date || "—"} at ${item.send_time || "—"}`;
//   }
//   if (item.type === "working_hours") {
//     return `At close ${item.when_place_closes ? "(when place closes)" : item.send_time || "—"}`;
//   }
//   return item.send_time || "—";
// }

// /* -------------------------
//    API helpers (replace URL)
//    ------------------------- */
// const API_BASE = "https://api.example.com"; // <-- replace

// async function fetchMessages() {
//   try {
//     const res = await fetch(`${API_BASE}/messages`);
//     if (!res.ok) throw new Error("Failed to load");
//     const json = await res.json();
//     return json;
//   } catch (e) {
//     console.warn("fetchMessages error", e);
//     return { data: [] };
//   }
// }

// async function createOrUpdateMessage(payload) {
//   // if payload.id exists -> PUT else POST
//   const method = payload.id ? "PUT" : "POST";
//   const url = payload.id ? `${API_BASE}/messages/${payload.id}` : `${API_BASE}/messages`;
//   const res = await fetch(url, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("save failed");
//   return await res.json();
// }

// /* -------------------------
//    Saved Messages Screen
//    ------------------------- */
// export function SavedMessagesScreen({ navigation }) {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useFocusEffect(
//     useCallback(() => {
//       let mounted = true;
//       setLoading(true);
//       fetchMessages()
//         .then((r) => {
//           if (!mounted) return;
//           // normalize into array
//           const data = r.data || [];
//           setMessages(data);
//         })
//         .finally(() => mounted && setLoading(false));
//       return () => (mounted = false);
//     }, [])
//   );

//   function onEdit(item) {
//     navigation.navigate("MessageForm", { mode: "edit", id: item.id });
//   }

//   const byCategory = messages; // assume already category sorted

//   return (
//     <View style={styles.screen}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Message Management</Text>
//       </View>

//       <View style={styles.tabRow}>
//         <Text style={[styles.tabText, styles.tabActive]}>Send Message</Text>
//         <TouchableOpacity onPress={() => navigation.navigate("CreateNew")}>
//           <Text style={styles.tabText}>Create New Message</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={byCategory}
//         keyExtractor={(i) => String(i.id)}
//         contentContainerStyle={{ padding: 20 }}
//         renderItem={({ item }) => <MessageCard item={item} onEdit={onEdit} />}
//         ListEmptyComponent={<Text style={styles.empty}>No saved messages</Text>}
//       />
//     </View>
//   );
// }

// /* -------------------------
//    Message Form Screen (Create/Edit single message)
//    ------------------------- */




// /* -------------------------
//    Message Management Screen (Create New - long scroll)
//    ------------------------- */
// export function MessageManagementScreen({ navigation }) {
//   // This screen mirrors your "Create New Message" long form where each section is independent.
//   // For brevity, we'll show a condensed version with navigation into MessageForm for each type.
//   const goCreate = (type) => {
//     navigation.navigate("MessageForm", { mode: "create", initialType: type });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.screen}>
//       <Text style={styles.headerTitle}>Message Management</Text>

//       <View style={styles.card}>
//         <Text style={styles.sectionTitle}>End of Working Hours Messages</Text>
//         <Text style={styles.cardBody}>Create messages that send at the end of service hours.</Text>
//         <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("working_hours")}>
//           <Text style={styles.smallBtnText}>Create End of Working Hours Message</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.sectionTitle}>Alert Messages</Text>
//         <Text style={styles.cardBody}>Messages sent automatically when playtime is ending.</Text>
//         <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("alert")}>
//           <Text style={styles.smallBtnText}>Create Alert Message</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.sectionTitle}>Reward Messages</Text>
//         <Text style={styles.cardBody}>Messages to motivate children or provide discounts.</Text>
//         <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("reward")}>
//           <Text style={styles.smallBtnText}>Create Reward Message</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.sectionTitle}>General Messages</Text>
//         <Text style={styles.cardBody}>Welcome messages or announcements.</Text>
//         <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("general")}>
//           <Text style={styles.smallBtnText}>Create General Message</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ height: 120 }} />
//     </ScrollView>
//   );
// }

// /* -------------------------
//    Styles (StyleSheet)
//    ------------------------- */
// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#FAF8FF",
//   },
//   header: {
//     paddingTop: 18,
//     paddingHorizontal: 20,
//     paddingBottom: 8,
//     backgroundColor: "transparent",
//   },
//   headerSpace: { paddingVertical: 6 },
//   headerTitle: {
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#222222",
//     marginVertical: 8,
//   },

//   tabRow: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   tabText: {
//     fontSize: 14,
//     color: "#B8A9DB",
//     marginRight: 18,
//   },
//   tabActive: {
//     color: "#A67BFF",
//     textDecorationLine: "underline",
//   },

//   sectionTitle: {
//     fontSize: 13,
//     color: "#8B8796",
//     marginTop: 10,
//     marginBottom: 8,
//   },

//   input: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#EDEAF7",
//     padding: 12,
//     marginBottom: 12,
//     fontSize: 14,
//   },

//   textarea: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#EDEAF7",
//     padding: 14,
//     height: 140,
//     textAlignVertical: "top",
//     marginBottom: 12,
//     fontSize: 14,
//   },

//   helper: {
//     fontSize: 12,
//     color: "#8B8796",
//     marginBottom: 6,
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 14,
//   },

//   pill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#F6F2FF",
//     borderRadius: 20,
//     borderWidth: 0,
//     marginRight: 8,
//   },
//   pillText: { color: "#5A4B8A", fontSize: 13 },

//   pillActive: {
//     backgroundColor: "#EDE0FF",
//     borderWidth: 0,
//   },

//   smallInput: {
//     width: 80,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     borderColor: "#EDEAF7",
//     borderWidth: 1,
//     padding: 8,
//     marginLeft: 8,
//   },

//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   fakeCheckbox: {
//     marginLeft: 12,
//   },

//   cta: {
//     marginTop: 18,
//     height: 52,
//     borderRadius: 26,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#A67BFF",
//     shadowColor: "#A67BFF",
//     shadowOpacity: 0.12,
//     elevation: 2,
//   },
//   ctaDisabled: { backgroundColor: "#E6E0F7" },
//   ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },

//   card: {
//     marginHorizontal: 16,
//     marginVertical: 10,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.03,
//     elevation: 1,
//   },

//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   editPill: { backgroundColor: "#F4F0FF", paddingVertical: 6, paddingHorizontal: 8 },
//   cardTitle: { fontWeight: "700", color: "#222222", fontSize: 14 },
//   cardBody: { marginTop: 8, color: "#4A4457", fontSize: 13 },
//   cardFooter: {
//     marginTop: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   footerText: { color: "#8B8796", fontSize: 12 },
//   sendingLabel: { color: "#B8A9DB", fontSize: 12 },

//   smallBtn: {
//     marginTop: 12,
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     backgroundColor: "#F8F6FF",
//   },
//   smallBtnText: { color: "#6B4FF2", fontWeight: "600" },

//   empty: {
//     marginTop: 40,
//     textAlign: "center",
//     color: "#8B8796",
//   },
// });


import React, { useState } from "react";
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

export default function MessageManagementScreen({navigation}) {
  const [activeTab, setActiveTab] = useState("saved");

  // Dummy Saved Messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "Alert Message",
      content:
        "Dear Guardian, (child’s name) has finished playtime. Please come for pickup.",
      timing: "2 minutes before the session ends",
    },
    {
      id: 2,
      type: "Reward Message",
      content:
        "The child (child_name) has spent over an hour playing! Enjoy a special discount.",
      timing: "Sending Time",
    },
  ]);

  const deleteMessage = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setMessages((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
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
          <Text style={styles.headerTitle}>Message Management</Text>

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
            Saved Messages
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
            Create New Message
          </Text>
        </TouchableOpacity>
      </View>

      {/* --------- Content --------- */}
      {activeTab === "saved" ? (
        <SavedMessages messages={messages} deleteMessage={deleteMessage} />
      ) : (
        <CreateMessageForm />
      )}
    </View>
    </SafeAreaView>
    
  );
}

const SavedMessages = ({ messages, deleteMessage }) => {
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      {messages.map((msg) => (
        <View key={msg.id} style={styles.card}>
          {/* Edit + Delete buttons */}
          <View style={styles.cardHeader}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteMessage(msg.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardTitle}>{msg.type}</Text>
          <Text style={styles.cardContent}>{msg.content}</Text>

          <Text style={styles.cardTiming}>{msg.timing}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const CreateMessageForm = () => {
  const [messageName, setMessageName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  // const viewModel = useRegisterGameViewModel();
const [msglist,setmsglist]=useState([{'id':1, 'name':'End of the working hours'},{'id':2, 'name':'Alert Message'},{'id':3, 'name':'Reward Message'},{'id':3, 'name':'General Message'}])
  const [selectedType, setSelectedType] = useState("");

  const saveMessage = () => {
    if (!messageName || !messageContent) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    Alert.alert("Success", "Message Saved!");
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, }}>
       <Text style={styles.addMsgTitle}>Select Message Type</Text>
      
              <TouchableOpacity  style={{marginTop:8}} onPress={() => setModalVisible(!modalVisible)}>
                <View style={styles.msgInputBox}>
                  <Ionicons
                    name={modalVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#999"
                  />
                  <Text style={{ color:selectedType?"#000": "#888" }}>
                    {selectedType || "Select message"}
                  </Text>
                </View>
              </TouchableOpacity>
      
              {modalVisible && (
                <View style={styles.messageBox}>
                  {msglist.map((msg) => (
        <View key={msg.id} style={styles.msgRow}>
          <Text style={styles.msgLabel}>{msg.name}</Text> {/* use name */}
          <TouchableOpacity
            onPress={() => {
              setSelectedType(msg?.name)
              //handleMessageSelect(msg);
              setModalVisible(false); // close modal on select
            }}
            style={[
              styles.checkbox,
              selectedType === msg.name && styles.checkboxChecked,
            ]}
          >
            {selectedType === <msg className="name"></msg> && (
              <Ionicons name="checkmark" size={15} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      ))}
      
                </View>
              )}
               {selectedType === "End of the working hours" && <WorkingHoursForm />}
      {selectedType === "Alert Message" && <AlertMessageForm />}
      {selectedType === "Reward Message" && <RewardMessageForm />}
      {selectedType === "General Message" && <GeneralMessageForm />}

      <View style={{ height: 50 }} />
      {/* <Text style={styles.sectionTitle}>Create New Message</Text>

      <Text style={styles.label}>Message Name</Text>
      <TextInput
        style={styles.input}
        value={messageName}
        onChangeText={setMessageName}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Message Content</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={messageContent}
        onChangeText={setMessageContent}
        placeholder="Enter content"
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveMessage}>
        <Text style={styles.saveText}>Save Message</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};
const WorkingHoursForm = () => (
  <View style={styles.block}>
    <Text style={styles.header}>End of Working Hours Messages</Text>

    <Text style={styles.label}>Message Name</Text>
    <TextInput style={styles.input} />

    <Text style={styles.label}>Message Content</Text>
    <TextInput style={styles.textArea} multiline />

    {/* Time Fields */}
    <View style={styles.row}>
      <TextInput placeholder="Minute" style={styles.smallInput} />
      <TextInput placeholder="HH:MM" style={styles.smallInput} />
    </View>

    <TouchableOpacity style={styles.saveBtn}>
      <Text style={styles.saveText}>Save Message</Text>
    </TouchableOpacity>
  </View>
);

const AlertMessageForm = () => (
  <View style={styles.block}>
    <Text style={styles.header}>Alert Messages</Text>

    <Text style={styles.label}>Message Name</Text>
    <TextInput style={styles.input} />

    <Text style={styles.label}>Message Content</Text>
    <TextInput style={styles.textArea} multiline />

    <Text style={styles.label}>Sending Time</Text>
    <TextInput placeholder="Minute" style={styles.smallInput} />

    <TouchableOpacity style={styles.saveBtn}>
      <Text style={styles.saveText}>Save Message</Text>
    </TouchableOpacity>
  </View>
);

const RewardMessageForm = () => (
  <View style={styles.block}>
    <Text style={styles.header}>Reward Messages</Text>

    <Text style={styles.label}>Message Name</Text>
    <TextInput style={styles.input} />

    <Text style={styles.label}>Message Content</Text>
    <TextInput style={styles.textArea} multiline />

    <View style={styles.row}>
      <TextInput placeholder="YYYY/MM/DD" style={styles.smallInput} />
      <TextInput placeholder="HH:MM" style={styles.smallInput} />
    </View>

    <TouchableOpacity style={styles.saveBtn}>
      <Text style={styles.saveText}>Save Message</Text>
    </TouchableOpacity>
  </View>
);

const GeneralMessageForm = () => (
  <View style={styles.block}>
    <Text style={styles.header}>General Messages</Text>

    <Text style={styles.label}>Message Name</Text>
    <TextInput style={styles.input} />

    <Text style={styles.label}>Message Content</Text>
    <TextInput style={styles.textArea} multiline />

    <TextInput placeholder="HH:MM" style={styles.smallInput} />

    <TouchableOpacity style={styles.saveBtn}>
      <Text style={styles.saveText}>Save Message</Text>
    </TouchableOpacity>
  </View>
);

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
    borderColor: "#8B5CF6",
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
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EEE9FF",
    borderRadius: 5,
  },
  editText: { color: "#6A4FF6", fontWeight: "500" },

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
    marginTop: 10,
  },

  cardContent: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },

  cardTiming: {
    fontSize: 13,
    marginTop: 10,
    color: "#6A4FF6",
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
    backgroundColor:  "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
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
});
