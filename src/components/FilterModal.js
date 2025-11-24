import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GREEN = '#A8B84C';
const LIGHT_GRAY = '#F7F7F7';
const BORDER_GRAY = '#E8E8E8';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Dairy-free',
  'Nut-free',
  'Gluten-Free',
  'Halal',
];

export default function FilterModal({ visible, onClose, onApply }) {
  // State for filters - initialize as strings for TextInput
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minDist, setMinDist] = useState('');
  const [maxDist, setMaxDist] = useState('');
  const [selectedDietary, setSelectedDietary] = useState([]);

  const toggleDietary = (option) => {
    if (selectedDietary.includes(option)) {
      setSelectedDietary(selectedDietary.filter((item) => item !== option));
    } else {
      setSelectedDietary([...selectedDietary, option]);
    }
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinDist('');
    setMaxDist('');
    setSelectedDietary([]);
  };

  const handleApply = () => {
    onApply({
      // Convert inputs to numbers for logic, default to 0/100 if empty
      minPrice: parseInt(minPrice) || 0,
      maxPrice: parseInt(maxPrice) || 100,
      minDist: parseFloat(minDist) || 0,
      maxDist: parseFloat(maxDist) || 50,
      dietary: selectedDietary,
    });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Filters</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* Budget Section */}
              <Text style={styles.sectionTitle}>Budget</Text>
              <View style={styles.rangeRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Min</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.prefix}>$</Text>
                    <TextInput
                      style={styles.input}
                      value={minPrice}
                      onChangeText={setMinPrice}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.dash} />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Max</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.prefix}>$</Text>
                    <TextInput
                      style={styles.input}
                      value={maxPrice}
                      onChangeText={setMaxPrice}
                      placeholder="50"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Distance Section */}
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.rangeRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Min</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={minDist}
                      onChangeText={setMinDist}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                    <Text style={styles.suffix}>mi</Text>
                  </View>
                </View>

                <View style={styles.dash} />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Max</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={maxDist}
                      onChangeText={setMaxDist}
                      placeholder="5"
                      keyboardType="numeric"
                    />
                    <Text style={styles.suffix}>mi</Text>
                  </View>
                </View>
              </View>

              {/* Dietary Section */}
              <Text style={styles.sectionTitle}>Dietary Preferences</Text>
              <View style={styles.dietaryContainer}>
                {DIETARY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.checkboxRow}
                    onPress={() => toggleDietary(option)}
                  >
                    <Ionicons
                      name={selectedDietary.includes(option) ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={selectedDietary.includes(option) ? BRAND_GREEN : '#999'}
                    />
                    <Text style={styles.checkboxLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
  },
  // Range Row Styles
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align to bottom so inputs line up
    justifyContent: 'space-between',
  },
  inputGroup: {
    width: '40%',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    backgroundColor: LIGHT_GRAY,
  },
  prefix: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 4,
  },
  suffix: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  dash: {
    height: 2,
    backgroundColor: '#DDD',
    width: 15,
    marginBottom: 22, // Align with the center of the input box
  },
  // Dietary Styles
  dietaryContainer: {
    marginTop: 5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  // Footer Styles
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },
  resetButton: {
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    width: '45%',
    alignItems: 'center',
  },
  resetText: {
    color: BRAND_GREEN,
    fontWeight: 'bold',
  },
  applyButton: {
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: BRAND_GREEN,
    width: '45%',
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
  },
});