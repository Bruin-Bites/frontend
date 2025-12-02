import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import api from '../services/api';

const BRAND_GREEN = '#A8B84C';
const LIGHT_GRAY = '#F7F7F7';
const BORDER_GRAY = '#E8E8E8';
const TEXT_GRAY = '#8A8A8A';
const ERROR_RED = '#D9534F';

// --- 1. Define all available tags with color codes ---
const TAG_CATEGORIES = {
  'Deal type': [
    { name: 'Buy one get one free (BOGO)', color: '#FFD700' }, // Gold
    { name: 'First come first serve (FCFS)', color: '#FFA07A' }, // LightSalmon
    { name: 'Free item', color: '#87CEEB' }, // SkyBlue
    { name: '% off discount', color: '#90EE90' }, // LightGreen
    { name: 'Student discount', color: '#DA70D6' }, // Orchid
    { name: 'Combo deal', color: '#F0E68C' }, // Khaki
    { name: 'Rewards/points bonus', color: '#ADD8E6' }, // LightBlue
  ],
  'Food type': [
    { name: 'Meal', color: '#FFB6C1' }, // LightPink
    { name: 'Snack', color: '#FFE4E1' }, // MistyRose
    { name: 'Drink', color: '#B0E0E6' }, // PowderBlue
    { name: 'Dessert', color: '#FFDEAD' }, // NavajoWhite
  ],
  'Location type': [
    { name: 'On Campus', color: '#C0C0C0' }, // Silver
    { name: 'Westwood', color: '#D3D3D3' }, // LightGray
    { name: 'Sawtelle', color: '#A9A9A9' }, // DarkGray
    { name: 'Near Campus', color: '#E0FFFF' }, // LightCyan
  ],
  'Cuisine type': [
    { name: 'Asian', color: '#F4A460' }, // SandyBrown
    { name: 'American', color: '#E9967A' }, // DarkSalmon
    { name: 'Mexican', color: '#CD5C5C' }, // IndianRed
    { name: 'Italian', color: '#DB7093' }, // PaleVioletRed
    { name: 'Mediterranean', color: '#8B008B' }, // DarkMagenta
  ],
  Timing: [
    { name: 'Breakfast', color: '#FFEFD5' }, // PapayaWhip
    { name: 'Lunch', color: '#FFDAB9' }, // PeachPuff
    { name: 'Dinner', color: '#DDA0DD' }, // Plum
    { name: 'Late night', color: '#BA55D3' }, // MediumOrchid
    { name: 'Happy hour', color: '#EE82EE' }, // Violet
  ],
  'Dietary information': [
    { name: 'Vegetarian', color: '#8FBC8F' }, // DarkSeaGreen
    { name: 'Vegan', color: '#3CB371' }, // MediumSeaGreen
    { name: 'Gluten-free', color: '#20B2AA' }, // LightSeaGreen
    { name: 'Contains nuts', color: '#BDB76B' }, // DarkKhaki
    { name: 'Contains fish', color: '#6A5ACD' }, // SlateBlue
  ],
};

// Helper function to get a tag's color
const getTagColor = (tagName) => {
  for (const category of Object.values(TAG_CATEGORIES)) {
    const foundTag = category.find((t) => t.name === tagName);
    if (foundTag) {
      return foundTag.color;
    }
  }
  return TEXT_GRAY; // Default color if not found
};

// --- NEW: time parsing + validation helpers ---
const parseTimeToMinutes = (str) => {
  // Accept things like "1PM", "1:30PM", "01:05 pm"
  const regex = /^\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*$/i;
  const match = str.match(regex);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toUpperCase();

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return hour * 60 + minute;
};

const isValidTimeRange = (value) => {
  if (!value.trim()) return true; // empty is allowed (optional field)

  const parts = value.split('-').map((p) => p.trim());

  if (parts.length === 1) {
    // Single time like "3PM"
    const t = parseTimeToMinutes(parts[0]);
    return t !== null;
  }

  if (parts.length === 2) {
    const start = parseTimeToMinutes(parts[0]);
    const end = parseTimeToMinutes(parts[1]);
    if (start === null || end === null) return false;
    return end > start; // need a proper range
  }

  return false;
};

// --- Re-usable component for the accordion ---
const Accordion = ({ title, options, selectedTags, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Count how many items from this category are selected
  const selectedCount = options.filter((opt) =>
    selectedTags.includes(opt.name)
  ).length;

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.categoryTitle}>
          {title}{' '}
          <Text style={styles.categoryCount}>
            ({selectedCount}/{options.length})
          </Text>
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={TEXT_GRAY}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.categoryContent}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.name}
              style={styles.checkboxRow}
              onPress={() => onSelect(option.name)}
            >
              <Ionicons
                name={
                  selectedTags.includes(option.name)
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={24}
                color={option.color} // Use specific tag color here
              />
              <Text style={styles.checkboxLabel}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// --- Error Modal Component ---
const ErrorModal = ({ visible, onClose, errors }) => {
    if (!visible) return null;
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.errorModalBackdrop}
          activeOpacity={1}
          onPressOut={onClose}
        >
          <View style={styles.errorModalContainer}>
            {errors.map((error, index) => (
              <View key={index} style={styles.errorCard}>
                <View style={styles.errorIconCircle}>
                  <Text style={styles.errorIconText}>{error.icon || '!'}</Text>
                </View>
                <View style={styles.errorTextContent}>
                  <Text style={styles.errorTitle}>{error.title}</Text>
                  {error.details && <Text style={styles.errorDetails}>{error.details}</Text>}
                </View>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

export default function AddContributionScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // Date State
  const [date, setDate] = useState(''); // Will store 'MM/DD/YYYY'
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [time, setTime] = useState('');

  const [coverImage, setCoverImage] = useState(null);

  // Tag State
  const [tags, setTags] = useState([
    '% off discount',
    'Lunch',
    'Franchise',
    'Asian',
    'Happy hour',
    'Contains fish',
  ]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState([]);
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemImage, setNewItemImage] = useState(null);
  const [modalError, setModalError] = useState('');

  const [validationErrors, setValidationErrors] = useState([]); 
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: form errors (for required fields + time)
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = [];

    if (!title.trim()) {
      errors.push({
        title: "You're missing something!",
        details: 'Missing: Title',
        icon: '!'
      });
    }
    if (!description.trim()) {
      errors.push({
        title: "You're missing something!",
        details: 'Missing: Description',
        icon: '!'
      });
    }
    if (!location.trim()) {
      errors.push({
        title: "You're missing something!",
        details: 'Missing: Location',
        icon: '!'
      });
    }
    if (!date.trim()) {
      errors.push({
        title: "You're missing something!",
        details: 'Missing: Date',
        icon: '!'
      });
    }

    // Time Validation (Format: "HH:MM AM/PM - HH:MM AM/PM")
    // Simple check: needs to look like a time range
    if (time.trim()) { 
        if (!time.includes('-')) {
           errors.push({
            title: 'Error: Invalid time format.',
            details: 'Expected format: 1:00 PM - 2:00 PM',
            icon: '!'
          });
        }
      }

    // Check for specific tag requirement
    const dealTypeTags = tags.filter(tag =>
      TAG_CATEGORIES['Deal type'].some(dealTag => dealTag.name === tag)
    );
    if (dealTypeTags.length === 0) {
      errors.push({
        title: "You're missing something!",
        details: 'Missing: Deal type tag',
        icon: '!'
      });
    }

    if (tags.length > 30) {
      errors.push({
        title: "You can't add too many tags!",
        details: 'Limit: 30',
        icon: '!'
      });
    }

    setValidationErrors(errors);
    setShowErrorModal(errors.length > 0);
    return errors.length === 0;
  };

  const handlePost = async () => {
    // 1. Run validation
    if (!validateForm()) {
      // Errors are already set and modal shown by validateForm
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert date from MM/DD/YYYY to ISO string
      const [month, day, year] = date.split('/');
      const dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      
      // Backend expects: title, description, location, date, time, tags
      await api.post('/community', {
        title: title,
        description: description,
        location: location,
        date: dateObj.toISOString(),
        time: time.trim() || undefined,
        tags: tags,
      });

      Alert.alert('Success', 'Your contribution has been posted!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error posting contribution:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details?.[0] || error.message || 'Failed to post contribution';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSelectTag = (tag) => {
    if (tags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddMenuItem = () => {
    if (!newItemTitle.trim()) {
      setModalError('Title is required.');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      image: newItemImage,
    };
    setMenuItems([...menuItems, newItem]);
    setIsMenuModalVisible(false);
    setNewItemTitle('');
    setNewItemImage(null);
    setModalError('');
  };

  const handlePickImage = () => {
    console.log('Opening image picker...');
  };

  // Handler for when a day is pressed on the calendar
  const onDayPress = (day) => {
    const [year, month, dayStr] = day.dateString.split('-');
    const formattedDate = `${month}/${dayStr}/${year}`;

    setDate(formattedDate);
    setIsCalendarVisible(false);
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  // Helper to convert our MM/DD/YYYY state back to YYYY-MM-DD for the calendar
  const getSelectedDateForCalendar = () => {
    if (!date) return '';
    const [month, day, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            {/* Cover Image */}
            <Text style={styles.label}>Cover Image</Text>
            <TouchableOpacity style={styles.imagePicker}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={50} color={BORDER_GRAY} />
              </View>
              <View style={styles.addIconCircle}>
                <Ionicons name="add" size={20} color="white" />
              </View>
            </TouchableOpacity>

            {/* Title */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.charCount}>{title.length}/500</Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                errors.title && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                placeholder="Amazing Contribution Title"
                maxLength={500}
              />
              <Ionicons name="pencil" size={20} color={TEXT_GRAY} />
            </View>
            {errors.title && (
              <Text style={styles.fieldErrorText}>{errors.title}</Text>
            )}

            {/* Description */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                styles.textAreaContainer,
                errors.description && styles.inputError,
              ]}
            >
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description) {
                    setErrors((prev) => ({
                      ...prev,
                      description: undefined,
                    }));
                  }
                }}
                placeholder="A great description for this contribution!"
                maxLength={500}
                multiline
              />
              <Ionicons
                name="pencil"
                size={20}
                color={TEXT_GRAY}
                style={{ marginTop: 12 }}
              />
            </View>
            {errors.description && (
              <Text style={styles.fieldErrorText}>{errors.description}</Text>
            )}

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <View
              style={[
                styles.inputContainer,
                errors.location && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  if (errors.location) {
                    setErrors((prev) => ({ ...prev, location: undefined }));
                  }
                }}
                placeholder="A Great Location, 123 Place Avenue, 95..."
              />
              <Ionicons name="location-outline" size={20} color={TEXT_GRAY} />
            </View>
            {errors.location && (
              <Text style={styles.fieldErrorText}>{errors.location}</Text>
            )}

            {/* Date & Time Row */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={[
                    styles.inputContainer,
                    errors.date && styles.inputError,
                  ]}
                  onPress={() => setIsCalendarVisible(true)}
                >
                  <Text
                    style={[
                      styles.input,
                      styles.dateText,
                      date ? {} : styles.placeholderText,
                    ]}
                  >
                    {date || '10/24/2025'}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={TEXT_GRAY}
                  />
                </TouchableOpacity>
                {errors.date && (
                  <Text style={styles.fieldErrorText}>{errors.date}</Text>
                )}
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>
                  Time <Text style={styles.optional}>(Optional)</Text>
                </Text>

                {/* NEW: time error bubble (like screenshot) */}
                {errors.time && (
                  <View style={styles.timeErrorContainer}>
                    <View style={styles.timeErrorBadge}>
                      <Text style={styles.timeErrorBadgeText}>1</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.timeErrorTitle}>
                        Error: Invalid time range.
                      </Text>
                      <Text style={styles.timeErrorSubtitle}>
                        Double-check your AM and PM.
                      </Text>
                    </View>
                  </View>
                )}

                <View
                  style={[
                    styles.inputContainer,
                    errors.time && styles.inputError,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    value={time}
                    onChangeText={(text) => {
                      setTime(text);
                      if (errors.time) {
                        setErrors((prev) => ({ ...prev, time: undefined }));
                      }
                    }}
                    placeholder="1:30PM - 2:30PM"
                  />
                  <Ionicons name="time-outline" size={20} color={TEXT_GRAY} />
                </View>
              </View>
            </View>

            {/* Menu Section */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Menu <Text style={styles.optional}>(Optional 3/30)</Text>
              </Text>
            </View>
            <View style={styles.menuContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {menuItems.map((item) => (
                  <View key={item.id} style={styles.menuItemCard}>
                    <View style={styles.menuItemImagePlaceholder}>
                      <Ionicons
                        name="fast-food-outline"
                        size={30}
                        color={BRAND_GREEN}
                      />
                    </View>
                    <Text style={styles.menuItemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addItemCard}
                  onPress={() => setIsMenuModalVisible(true)}
                >
                  <Ionicons name="add" size={30} color={TEXT_GRAY} />
                  <Text style={styles.addItemText}>Add Item</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Tags Section */}
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: getTagColor(tag),
                      borderColor: getTagColor(tag),
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: 'white' }]}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Ionicons name="close" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addTagButton}
                onPress={() => setIsTagModalVisible(true)}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Post Button */}
        <View style={styles.postButtonContainer}>
          <TouchableOpacity 
            style={[styles.postButton, isSubmitting && styles.postButtonDisabled]} 
            onPress={handlePost}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Add Menu Item Modal */}
      <Modal
        visible={isMenuModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.menuModalContent}>
              <Text style={styles.menuModalTitle}>Add Menu Item</Text>
              <Text style={styles.modalLabel}>Item Title (required)</Text>
              <TextInput
                style={styles.modalInput}
                value={newItemTitle}
                onChangeText={setNewItemTitle}
                placeholder="e.g., Chicken Sandwich"
              />
              <Text style={styles.modalLabel}>Image (optional)</Text>
              <TouchableOpacity
                style={styles.modalImagePicker}
                onPress={handlePickImage}
              >
                <Ionicons name="camera-outline" size={24} color={TEXT_GRAY} />
                <Text style={styles.modalImagePickerText}>Add Image</Text>
              </TouchableOpacity>
              {modalError ? (
                <Text style={styles.modalErrorText}>{modalError}</Text>
              ) : null}
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsMenuModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addButton]}
                  onPress={handleAddMenuItem}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Add Tags Modal */}
      <Modal
        visible={isTagModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsTagModalVisible(false)}
      >
        <View style={styles.tagModalBackdrop}>
          <View style={styles.tagModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsTagModalVisible(false)}>
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle_Tags}>Add tags</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView>
              {/* Selected Tags Display */}
              <View style={styles.selectedTagsContainer}>
                <Text style={styles.modalLabel}>
                  All tags ({tags.length}/30)
                </Text>
                <View style={styles.tagsContainer}>
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <View
                        key={tag}
                        style={[
                          styles.tag,
                          {
                            backgroundColor: getTagColor(tag),
                            borderColor: getTagColor(tag),
                          },
                        ]}
                      >
                        <Text style={[styles.tagText, { color: 'white' }]}>
                          {tag}
                        </Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                          <Ionicons name="close" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noTagsText}>No tags selected</Text>
                  )}
                </View>
              </View>

              {/* Accordion List */}
              {Object.keys(TAG_CATEGORIES).map((categoryName) => (
                <Accordion
                  key={categoryName}
                  title={categoryName}
                  options={TAG_CATEGORIES[categoryName]}
                  selectedTags={tags}
                  onSelect={handleSelectTag}
                />
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsTagModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.calendarBackdrop}
          activeOpacity={1}
          onPressOut={() => setIsCalendarVisible(false)} // Close on outside click
        >
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={{
                [getSelectedDateForCalendar()]: {
                  selected: true,
                  selectedColor: BRAND_GREEN,
                },
              }}
              theme={{
                todayTextColor: BRAND_GREEN,
                arrowColor: BRAND_GREEN,
                selectedDayBackgroundColor: BRAND_GREEN,
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errors={validationErrors}
      />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  optional: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: 'normal',
  },
  imagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: LIGHT_GRAY,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconCircle: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    backgroundColor: BRAND_GREEN,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  // Style for the Date <Text> field
  dateText: {
    height: 'auto',
    paddingVertical: 15,
  },
  placeholderText: {
    color: '#C7C7CD',
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  menuContainer: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  menuItemCard: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  menuItemImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontWeight: '500',
    color: '#333',
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'center',
  },
  addItemCard: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemText: {
    color: 'white',
    marginTop: 5,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
  },
  menuModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
  },
  menuModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: LIGHT_GRAY,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalImagePicker: {
    width: '100%',
    height: 100,
    backgroundColor: LIGHT_GRAY,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalImagePickerText: {
    color: TEXT_GRAY,
    marginLeft: 10,
    fontSize: 16,
  },
  modalErrorText: {
    color: ERROR_RED,
    textAlign: 'center',
    marginTop: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: LIGHT_GRAY,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: BRAND_GREEN,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '500',
    marginRight: 5,
  },
  addTagButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: TEXT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  postButtonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: BORDER_GRAY,
  },
  postButton: {
    backgroundColor: BRAND_GREEN,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  tagModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagModalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: BORDER_GRAY,
  },
  modalTitle_Tags: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTagsContainer: {
    padding: 15,
  },
  noTagsText: {
    color: TEXT_GRAY,
    fontStyle: 'italic',
  },
  categoryContainer: {
    borderBottomWidth: 1,
    borderColor: BORDER_GRAY,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: LIGHT_GRAY,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: 'normal',
    color: TEXT_GRAY,
  },
  categoryContent: {
    padding: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  doneButton: {
    backgroundColor: BRAND_GREEN,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    margin: 15,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calendarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    padding: 10,
    overflow: 'hidden',
  },

  // NEW: generic input error styles
  inputError: {
    borderColor: ERROR_RED,
  },
  fieldErrorText: {
    color: ERROR_RED,
    fontSize: 12,
    marginTop: -16,
    marginBottom: 12,
  },

  // NEW: time error bubble like screenshot
  timeErrorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FDECEA',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  timeErrorBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BRAND_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  timeErrorBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  timeErrorTitle: {
    color: ERROR_RED,
    fontWeight: '600',
    fontSize: 13,
  },
  timeErrorSubtitle: {
    color: '#555',
    fontSize: 11,
  },
});
