import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
// File Imports
import { useEffect } from 'react';
import AccountPage from './src/pages/AccountPage';
import AddGroupPage from './src/pages/AddGroupPage';
import AddMemberPage from './src/pages/AddMemberPage';
import AddTransactionPage from './src/pages/AddTransactionPage';
import CategoriesPage from './src/pages/CategoriesPage';
import ForgotPage from './src/pages/ForgotPage';
import Group from './src/pages/Group';
import GroupPage from './src/pages/GroupPage';
import HomePage from './src/pages/HomePage';
import LoginPage from './src/pages/LoginPage';
import NotificationsPage from './src/pages/NotificationsPage';
import UserPage from './src/pages/ProfilePage';
import RegisterPage from './src/pages/RegisterPage';
import ReportScreen from './src/pages/ReportPage';
import ResetPasswordPage from './src/pages/ResetPasswordPage';
import SplashScreen from './src/pages/SplashScreenPage';
import TransactionDetailsPage from './src/pages/TransactionDetailsPage';
import TransactionPage from './src/pages/TransactionPage';
import VerifyEmailPage from './src/pages/VerifyEmailPage';
import VerifyOtpPage from './src/pages/VerifyOtpPage';
import WelcomePage from "./src/pages/WelcomePage";
// File imports
import { GroupDocument, Store } from './src/store/store';
import socket from './src/utils/socket';
import AddGroupTransactionPage from './src/pages/AddGroupTransactionPage';

axios.defaults.baseURL = "http://192.168.1.3:8080";
// axios.defaults.baseURL = "https://expen-share-app-server.vercel.app";

axios.defaults.withCredentials = true;

interface SocketResponse {
  message: string
  requestId: string
  groupName: string
  groupId: string
}

export default function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();
  const store = Store()
  const email = store.userObject?.email || undefined;

  useEffect(() => {
    if (email) {
      socket.emit("login", email);
    }

    socket.on("requestReceived", (object: SocketResponse) => {
      store.showSnackbar(object.message)

      const newNotification = {
        requestId: object.requestId,
        groupId: object.groupId,
        groupName: object.groupName,
      }

      store.setNotifications([...store.notifications, newNotification]);
    })

    socket.on("updateGroup", (data: { group: GroupDocument }) => {
      const { group } = data;
      console.log(Store.getState().userObject?.userName, group.groupName);


      const oldGroups = Store.getState().groups;

      const newGroups = oldGroups.map(oldGroup => {
        if (oldGroup._id === group._id) {
          return group;
        }
        return oldGroup;
      })

      store.setGroups(newGroups);
    });

    return () => {
      socket.off("requestReceived");
      socket.off("updateGroup");
    };
  }, [socket, email])

  return (
    <SafeAreaView style={styles.main}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Splash'
          screenOptions={{ headerShown: false, presentation: "modal", animation: "fade", animationDuration: 1000 }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Notifications" component={NotificationsPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: "fade_from_bottom" }} />
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Forgot" component={ForgotPage} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpPage} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailPage} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
          <Stack.Screen name="AddTransaction" component={AddTransactionPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="Category" component={CategoriesPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="Transaction" component={TransactionPage} />
          <Stack.Screen name="AddGroup" component={AddGroupPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="GroupPage" component={GroupPage} />
          <Stack.Screen name="Group" component={Group} options={{ animation: "slide_from_right", animationDuration: 2000 }} />
          <Stack.Screen name="AddGroupTransaction" component={AddGroupTransactionPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="AddMember" component={AddMemberPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="User" component={UserPage} />
          <Stack.Screen name="Account" component={AccountPage} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="Report" component={ReportScreen} options={{ animation: "slide_from_bottom", animationDuration: 2000 }} />
          <Stack.Screen name="TransactionDetails" component={TransactionDetailsPage} options={{ animation: "slide_from_bottom", animationDuration: 1000 }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: "100%",
    backgroundColor: "#fff",
    fontFamily: "Montserrat"
  }
});
