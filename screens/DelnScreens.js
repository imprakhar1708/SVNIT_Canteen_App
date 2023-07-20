import React, { useEffect, useState } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Header from "../components/Header"
import DeliveryModal from "../components/DeliveryModal"
import DeliveryScreen from "./DeliveryScreen"
import firestore from "@react-native-firebase/firestore"
import { firebase } from "@react-native-firebase/auth"
import { View } from "react-native"
import { ActivityIndicator } from "react-native"
import { useNavigationState, useRoute } from "@react-navigation/native"

const DelnScreens = () => {
	const Stack = createNativeStackNavigator()
	const [loading, setloading] = useState(true)
	const [del, setdel] = useState(false)
	const user = firebase.auth().currentUser
	const delRef = firestore().collection("DeliveryDetails").doc(user.uid)
	useEffect(() => {
		delRef.onSnapshot((doc) => {
			setloading(true)
			if (doc?.exists) {
				setdel(true)
			} else {
				setdel(false)
			}
			setloading(false)
		})
	}, [])
	return (
		<>
			{loading && (
				<View className='flex-1 pb-32 items-center justify-center'>
					<ActivityIndicator size={25} color='orange' />
				</View>
			)}
			{!loading && (
				<Stack.Navigator
					initialRouteName={`${
						del ? "DelScreen" : "DeliveryDetails"
					}`}
				>
					{del && (
						<Stack.Screen
							options={{
								headerShown: false,
							}}
							name='DelScreen'
							component={DeliveryScreen}
						/>
					)}
					<Stack.Screen
						options={{
							headerShown: false,
						}}
						name='DeliveryDetails'
						component={DeliveryModal}
						initialParams={{ cartData: null }}
					/>
				</Stack.Navigator>
			)}
		</>
	)
}

export default DelnScreens
