import { useAuth } from '@clerk/clerk-expo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, isValid } from 'date-fns';
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { z } from 'zod';

import { colors } from '../../../utils/style/colors';
import { calculateAge } from '../../../utils/time/time-service';
import { TermsAndConditionsBottomSheet } from '../../components/bottomsheets/TermsAndConditionsBottomSheet';
import { Button } from '../../components/primitives/Button';
import { Header } from '../../components/primitives/Header';
import { Input } from '../../components/primitives/Input';
import { Label } from '../../components/primitives/Label';

export default function OnboardingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const { signOut } = useAuth();

  const termsAndConditionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentYear = new Date().getFullYear();

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev); // Toggle the expanded state

    Animated.timing(slideAnim, {
      toValue: showDatePicker ? 0 : 1, // Animate to 1 if expanding, 0 if collapsing
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const datePickerHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Adjust 200 to your desired height
  });

  const formSchema = z.object({
    firstName: z
      .string()
      .min(1, { message: 'First name is required' })
      .max(25, { message: 'First name must be no longer than 25 characters' })
      .regex(/^[A-Za-z\s]+$/, { message: 'First name should contain only letters' })
      .transform((value) => value.trim().replace(/\s+/g, '')),

    lastName: z
      .string()
      .min(1, { message: 'Last name is required' })
      .max(25, { message: 'Last name must be no longer than 25 characters' })
      .regex(/^[A-Za-z\s]+$/, { message: 'Last name should contain only letters' })
      .transform((value) => value.trim().replace(/\s+/g, '')),
    birthday: z
      .string({ required_error: 'Birthday is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Enter a valid birthday' })
      .refine(
        (date) => {
          const birthDate = new Date(date);

          // Ensure the date is valid
          if (!isValid(birthDate)) {
            return false;
          }

          // Ensure the year is not before 1900
          const year = birthDate.getFullYear();
          if (year < 1900) {
            return false;
          }

          // Check if the user is at least 18 years old
          const age = calculateAge(birthDate);
          return age >= 13;
        },
        { message: 'You must be 13 years or older' }
      ),
  });

  type Form = z.infer<typeof formSchema>;

  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthday: '',
    },
  });

  const openTermsAndConditionsBottomSheet = () => {
    termsAndConditionsBottomSheetRef.current?.present();
  };

  const handleBirthDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    setBirthday(selectedDate);
  };

  const onValid = async (data: Form) => {
    try {
      console.warn(data);
    } catch (error) {
      console.error(error); //@TODO: Show some toast here.
    }
  };

  const onError = async (error: FieldErrors<Form>) => {
    //@SEE: Show a toast here.
    console.warn(error);
  };

  return (
    <>
      <SafeAreaView>
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerShown: true,
            header: () => (
              <Header
                classNameHeaderContainer="px-6"
                leftHeader={
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className=" justify-center"
                  >
                    <Icon name="xmark" size={25} />
                  </TouchableOpacity>
                }
              />
            ),
          }}
        />
      </SafeAreaView>

      <View className="px-6 pt-12">
        <View className="items-start gap-y-2">
          <Text className="text-4xl font-bold">Finish Signing Up</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 justify-start pt-3 flex-grow">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, formState }) => (
            <Input
              autoCapitalize="none"
              value={field.value}
              className="w-full self-center"
              classNameInputContainer={`mt-5 rounded-full bg-gray-50 px-4 py-5 border-1 ${formState.errors.firstName ? 'border-red-500' : 'border-gray-400'}`}
              hasError={!!formState.errors.firstName}
              errorMessage={formState.errors.firstName?.message}
              onChangeText={field.onChange}
              classNameErrorContainer={`ml-2 mt-2 ${!formState.errors.firstName && 'hidden'}`}
              placeholder="First name"
              placeholderTextColor={colors.gray[600]}
              keyboardType="email-address"
              showError
            />
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, formState }) => (
            <Input
              autoCapitalize="none"
              value={field.value}
              className="w-full self-center"
              classNameInputContainer={`mt-5 rounded-full bg-gray-50 px-4 py-5 border-1 ${formState.errors.lastName ? 'border-red-500' : 'border-gray-400'}`}
              hasError={!!formState.errors.lastName}
              errorMessage={formState.errors.lastName?.message}
              onChangeText={field.onChange}
              classNameErrorContainer={`ml-2 mt-2 ${!formState.errors.lastName && 'hidden'}`}
              placeholder="Last name"
              placeholderTextColor={colors.gray[600]}
              keyboardType="email-address"
              showError
            />
          )}
        />

        <Controller
          control={form.control}
          name="birthday"
          render={({ field, formState }) => (
            <>
              <TouchableOpacity
                onPress={toggleDatePicker}
                className={`flex flex-row justify-between items-center self-center w-full mt-5 rounded-full bg-gray-50 px-4 py-5 border-1  ${formState.errors.birthday ? 'border-red-500' : 'border-gray-400'}`}
              >
                <Text>{birthday.toLocaleDateString()}</Text>
                <View className=" mr-1">
                  <Icon name={showDatePicker ? 'angle-up' : 'angle-down'} size={16} />
                </View>
              </TouchableOpacity>

              <Animated.View style={{ height: datePickerHeight, overflow: 'hidden' }}>
                <DateTimePicker
                  maximumDate={new Date(currentYear, 11, 31)}
                  value={birthday}
                  onChange={(event, date) => {
                    if (date) {
                      handleBirthDate(event, date);
                      const formattedDate = format(date, 'yyyy-MM-dd'); //@TODO: This conversion shouldn't occur, change it so the schema accepts a date and just convert onVerify
                      field.onChange(formattedDate);
                    }
                  }}
                  mode="date"
                  display="inline" //@SEE: This should be abstracted into a primitive so we don't have to have inline jsx to handle errors.
                />
              </Animated.View>
              {formState.errors.birthday?.message && (
                <View className="ml-2 my-2">
                  <Label size={'base'} error={true}>
                    {formState.errors.birthday?.message}
                  </Label>
                </View>
              )}
            </>
          )}
        />

        <View className="pl-2 mt-1.5">
          <Text className="text-sm text-black">
            By Selecting Agree & Continue, I agree with{' '}
            <Text
              onPress={() => openTermsAndConditionsBottomSheet()}
              className="font-bold text-blue-500"
            >
              Terms and Conditions & Privacy Policy
            </Text>
          </Text>
        </View>

        <Button
          textClassName="text-md font-medium text-center text-dark-95 "
          onPress={() => form.handleSubmit(onValid, onError)()}
          text="Agree &Continue"
          className="mt-5 w-96 self-center rounded-full bg-yellow-500 px-2 py-5 border-gray-400"
        />
      </ScrollView>

      <Modal // Abstract this to a component as TODO
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        className="items-center justify-center"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          className="flex-1 items-center justify-center"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-gray-50 p-10 w-10/12 rounded-2xl border border-gray-200 shadow-lg"
          >
            <View className="items-center gap-y-5">
              <Text className="text-xl text-center font-bold text-gray-800">
                Are you sure you want to exit?
              </Text>
              <Text className="text-md font-medium text-center text-gray-600">
                If you sign out now, your onboarding progress will not be saved.
              </Text>
            </View>

            <View className="flex-row justify-center mt-6 gap-x-4">
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  signOut();
                }}
                className="bg-red-500 w-1/2 p-5 rounded-full"
              >
                <Text className="text-gray-50 text-md text-center font-bold">Exit</Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 w-1/2 p-5 rounded-full"
              >
                <Text className="text-dark-950 text-md text-center font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <TermsAndConditionsBottomSheet
        index={0}
        background
        snapPoints={['90']}
        bottomSheetRef={termsAndConditionsBottomSheetRef}
      />
    </>
  );
}
