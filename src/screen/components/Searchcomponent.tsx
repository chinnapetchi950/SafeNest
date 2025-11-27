import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Enable RTL text layout support
I18nManager.allowRTL(true);

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean; // optional left filter button
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSearchPress,
  onFilterPress,
  showFilter = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Left circular filter button (optional) */}
      {showFilter && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={18} color="#666" />
        </TouchableOpacity>
      )}

      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          textAlign="right"
        />

        {/* Right search icon */}
        <TouchableOpacity onPress={onSearchPress}>
          <Ionicons name="search-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    height: 45,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    marginRight:10
  },
});
