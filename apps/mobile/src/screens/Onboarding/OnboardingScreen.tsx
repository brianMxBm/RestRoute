import { useAuth } from '@clerk/clerk-expo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { TermsAndConditionsBottomSheet } from '../../components/bottomsheets/TermsAndConditionsBottomSheet';
import { Button } from '../../components/primitives/Button';
import { Header } from '../../components/primitives/Header';
import { Input } from '../../components/primitives/Input';

export default function OnboardingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const { signOut } = useAuth();

  const termsAndConditionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const datePickerBottomSheetRef = useRef<BottomSheetModal>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
      .max(50, { message: 'First name must be no longer than 50 characters' })
      .regex(/^[A-Za-z]+$/, { message: 'First name should contain only letters' }),

    lastName: z
      .string()
      .min(1, { message: 'Last name is required' })
      .max(50, { message: 'Last name must be no longer than 50 characters' })
      .regex(/^[A-Za-z]+$/, { message: 'Last name should contain only letters' }),

    birthday: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Enter birthday in YYYY-MM-DD format' })
      .refine(
        (date) => {
          const today = new Date();
          const birthDate = new Date(date);
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();
          return age > 0 || (age === 0 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
        },
        { message: 'Enter a valid birth date' }
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

    console.warn(selectedDate);

    setBirthday(selectedDate);
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
              classNameErrorContainer={`ml-2 my-2 ${!formState.errors.firstName && 'hidden'}`}
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
              classNameErrorContainer={`ml-2 my-2 ${!formState.errors.lastName && 'hidden'}`}
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
                className={`flex flex-row items-center self-center w-full mt-5 rounded-full bg-gray-50 px-4 py-5 border-1  ${formState.errors.lastName ? 'border-red-500' : 'border-gray-400'}`}
              >
                {/* <Text className="text-gray-600">Birthday {`(mm/dd/yyyy)`}</Text> */}
                <Text>{birthday ? birthday.toLocaleDateString() : 'Select your birthday'}</Text>
              </TouchableOpacity>

              <Animated.View style={{ height: datePickerHeight, overflow: 'hidden' }}>
                <DateTimePicker
                  value={new Date()}
                  onChange={(event, date) => {
                    handleBirthDate(event, date);
                    field.onChange(date);
                  }}
                  mode="date"
                  display="inline"
                />
              </Animated.View>
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
          onPress={() => router.navigate('/verify')}
          // onPress={() => form.handleSubmit(onValid, onError)()}
          text="Continue"
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
