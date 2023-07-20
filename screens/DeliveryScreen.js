import { View, Text } from "react-native"
import React from "react"
import ActiveOrdersDel from "./ActiveOrdersDel"
import MyOrdersDel from "./MyOrdersDel"
import HistoryDel from "./HistoryDel"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"

const TopTab = createMaterialTopTabNavigator()

const DeliveryScreen = () => {
	return (
		<View className='p-2 flex-1'>
			<TopTab.Navigator
				screenOptions={{
					tabBarAndroidRipple: { radius: 0 },
					tabBarStyle: {
						backgroundColor: "transparent",
						elevation: 0,
					},
					tabBarIndicatorStyle: {
						backgroundColor: "#fb923c",
					},
					tabBarActiveTintColor: "#fb923c",
					tabBarInactiveTintColor: "grey",
				}}
			>
				<TopTab.Screen
					options={{
						title: ({ focused }) => (
							<Text
								className={`font-bold ${
									focused ? "text-orange-400" : ""
								}`}
							>
								Active Orders
							</Text>
						),
					}}
					name='Active Orders'
					component={ActiveOrdersDel}
				/>
				<TopTab.Screen
					options={{
						title: ({ focused }) => (
							<Text
								className={`font-bold ${
									focused ? "text-orange-400" : ""
								}`}
							>
								My Orders
							</Text>
						),
					}}
					name='My Orders'
					component={MyOrdersDel}
				/>
				<TopTab.Screen
					options={{
						title: ({ focused }) => (
							<Text
								className={`font-bold ${
									focused ? "text-orange-400" : ""
								}`}
							>
								History
							</Text>
						),
					}}
					name='History'
					component={HistoryDel}
				/>
			</TopTab.Navigator>
		</View>
	)
}

export default DeliveryScreen
