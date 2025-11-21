import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import globalstyles from "../../styles/globalstyles";
import { string } from "../../utils/String";
import { colors } from "../../styles/colors";
import SearchBar from "../components/Searchcomponent";
import React from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Dashboard() {
    const sampleData = [
  {
    id: '1',
    name: 'Maryam Hassan Kadhem',
    guardian: 'Hassan Kadhem Abdulhussain',
    playtime: '1 hour, 45 minutes',
    timer: '0:00:00',
    status: 'waiting',
  },
  {
    id: '2',
    name: 'Maryam Hassan Kadhem',
    guardian: 'Hassan Kadhem Abdulhussain',
    playtime: '1 hour, 45 minutes',
    timer: '0:15:59',
    status: 'active',
  },
];
const renderItem = React.useCallback(({ item }) => (
    <ChildSessionCard
      name={item.name}
      guardian={item.guardian}
      playtime={item.playtime}
      timer={item.timer}
      status={item.status as 'active' | 'waiting'}
      onDeliver={() => console.log('Deliver', item.name)}
      onEndSession={() => console.log('End session', item.name)}
      onCall={() => console.log('Call', item.name)}
      onMessage={() => console.log('Message', item.name)}
    />
  ), []);
    return(
        <View style={globalstyles.mainbg}>
            <Text style={[globalstyles.semibold_black, styles.title]}>
                {string.game}
            </Text>
            <SearchBar
  placeholder="Search for a child"
  onChangeText={(text) => console.log(text)}
  onSearchPress={() => console.log('Search clicked')}
  onFilterPress={() => console.log('Filter clicked')}
/>

 <FlatList
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: 180,
          offset: 180 * index,
          index,
        })}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        initialNumToRender={3}
        windowSize={5}
      />

        </View>
    )
}



interface ChildSessionCardProps {
  name: string;
  guardian: string;
  playtime: string;
  timer: string;
  status: 'active' | 'waiting';
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
    const isActive = status === 'active';

    return (
      <View style={styles.card}>
        {/* Top Section */}
        <View style={styles.topRow}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isActive ? '#E9FCEB' : '#FFF8E6',
                },
              ]}
            >
              <Ionicons
                name={isActive ? 'checkmark-circle-outline' : 'alert-circle-outline'}
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
            <Text style={styles.playtimeText}>
              Total Playtime: {playtime}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Action Buttons */}
        <View style={styles.actionRow}>
          <View style={styles.buttonRow}>
            {isActive ? (
              <TouchableOpacity
                style={[styles.button, styles.endButton]}
                onPress={onEndSession}
              >
                <Text style={styles.endText}>End Session</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.deliverButton]}
                onPress={onDeliver}
              >
                <Text style={styles.deliverText}>Deliver</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#4CAF50' }]} onPress={onCall}>
              <Ionicons name="call-outline" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#EAF4FF' }]} onPress={onMessage}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <Text style={styles.quickActionsText}>Quick Actions</Text>
        </View>
      </View>
    );
  }
);


const styles = StyleSheet.create({
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
  title:{
    color:colors.primary,
    alignSelf:"flex-end",
    fontWeight:"700"

}
});






// const style=StyleSheet.create({
// title:{
//     color:colors.primary,
//     alignSelf:"flex-end",
//     fontWeight:"700"

// }
// })