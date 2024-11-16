import { cx } from 'class-variance-authority';
import { ScrollView, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { BottomSheet, type CustomBottomSheetProps } from './BottomSheet';

export type TermsAndConditionsBottomSheetProps = CustomBottomSheetProps & {
  className?: string;
};

//@TODO: Update with actual terms and conditions.

export const TermsAndConditionsBottomSheet = (props: TermsAndConditionsBottomSheetProps) => {
  return (
    <BottomSheet {...props} pressBehavior={'none'} snapPoints={props.snapPoints}>
      <View className={twMerge(cx('flex-1', 'p-5', 'bg-white', 'rounded-t-lg'), props.className)}>
        <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
          Terms and Conditions
        </Text>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-md text-gray-700 mb-2">
            Welcome to Restroute! By using our app, you agree to these Terms and Conditions. Please
            read them carefully. If you do not agree, please do not use our app.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            1. Acceptance of Terms
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            By accessing or using Restroute ("the App"), you agree to be bound by these Terms and
            Conditions ("Terms"). If you do not accept these Terms, you may not use the App.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">2. Use of the App</Text>
          <Text className="text-md text-gray-700 mb-2">
            Restroute provides information on restrooms available to the public, including details
            such as location, accessibility, and any associated fees. Use of the App is permitted
            for personal, non-commercial purposes only.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            3. User Responsibilities
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            You are responsible for your use of the App, including any content you share or submit.
            You agree not to:
          </Text>
          <Text className="text-md text-gray-700 ml-4">
            • Use the App for any unlawful purposes.
          </Text>
          <Text className="text-md text-gray-700 ml-4">
            • Submit any inaccurate or misleading information.
          </Text>
          <Text className="text-md text-gray-700 ml-4">
            • Violate any third-party rights or our community guidelines.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            4. Account and Security
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            To access certain features, you may be required to register and create an account. You
            are responsible for safeguarding your account and agree to notify Restroute of any
            unauthorized access. We are not liable for any loss arising from unauthorized use of
            your account.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">5. Privacy</Text>
          <Text className="text-md text-gray-700 mb-2">
            Your use of Restroute is subject to our Privacy Policy, which explains how we collect,
            use, and protect your data. By using the App, you consent to the collection and use of
            your information as described in the Privacy Policy.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            6. Intellectual Property
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            Restroute owns all rights, titles, and interests in the App and its content. You may not
            copy, modify, distribute, or otherwise exploit any part of the App without our
            permission.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            7. Disclaimer of Warranties
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            The App is provided "as is" and "as available" without warranties of any kind. Restroute
            disclaims all warranties, whether express or implied, including but not limited to
            warranties of merchantability and fitness for a particular purpose.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            8. Limitation of Liability
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            To the maximum extent permitted by law, Restroute shall not be liable for any direct,
            indirect, incidental, special, or consequential damages arising from your use of or
            inability to use the App.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
            9. Modifications to Terms
          </Text>
          <Text className="text-md text-gray-700 mb-2">
            Restroute reserves the right to modify these Terms at any time. We will notify users of
            significant changes. Continued use of the App following any changes constitutes
            acceptance of the new Terms.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">10. Termination</Text>
          <Text className="text-md text-gray-700 mb-2">
            We reserve the right to terminate or suspend your access to the App at our discretion,
            without notice, for conduct that we believe violates these Terms or is harmful to other
            users or the App.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">11. Governing Law</Text>
          <Text className="text-md text-gray-700 mb-2">
            These Terms shall be governed by and construed in accordance with the laws of [Your
            Jurisdiction], without regard to its conflict of law principles.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">12. Contact Us</Text>
          <Text className="text-md text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us at support@restroute.com.
          </Text>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};
