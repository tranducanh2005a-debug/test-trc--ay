import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTab from "./BottomTab";
import CustomDrawer from "../components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeDrawer" component={BottomTab} />
    </Drawer.Navigator>
  );
}