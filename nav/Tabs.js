import { Modal, Pressable, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
	HomeIcon as HomeO,
	ShoppingCartIcon as CartO,
	UserIcon as UserO,
	TruckIcon as DelO,
} from "react-native-heroicons/outline"
import {
	HomeIcon as HomeS,
	ShoppingCartIcon as CartS,
	UserIcon as UserS,
	TruckIcon as DelS,
	CheckBadgeIcon,
	ArrowRightCircleIcon,
} from "react-native-heroicons/solid"
import Header from "../components/Header"
import HomenDetailsScreen from "../screens/Home&DetailsScreen"
import CartScreen from "../screens/CartScreen"
import { firebase } from "../Firebase/firebaseConfig"
import firestore from "@react-native-firebase/firestore"
import { firebase as firebaseAuth } from "@react-native-firebase/auth"
import UsernScreens from "../screens/User&Screens"
import DelnScreens from "../screens/DelnScreens"

const Tabs = ({ navigation }) => {
	const user = firebaseAuth.auth().currentUser
	const docRef = firestore().collection("CartDetails").doc(user?.uid)
	const [cartQty, setCartQty] = useState(null)
	const [isAccepted, setisAccepted] = useState(false)
	const [data, setdata] = useState(null)
	const acceptedContractRef = firestore()
		.collection("AcceptedContractDetails")
		.doc("active")
	useEffect(() => {
		docRef.onSnapshot((doc) => {
			if (doc?.exists && doc?.data()?.cartItems.length > 0) {
				setCartQty(doc?.data()?.cartItems.length)
			} else {
				setCartQty(null)
			}
		})

		acceptedContractRef.onSnapshot(async (doc) => {
			let accepted = false
			if (doc?.exists) {
				const accept = await doc?.data()?.active
				accept?.forEach((item) => {
					if (
						item.owner_info.admission_no ===
						user.email.split("@")[0]
					) {
						setdata(item)
						accepted = true
					}
				})
				setisAccepted(accepted)
			} else {
				setisAccepted(false)
			}
		})
	}, [])
	const Tab = createBottomTabNavigator()
	return (
		<>
			{!isAccepted && (
				<Tab.Navigator initialRouteName='HomenDetails'>
					<Tab.Screen
						options={{
							gestureEnabled: false,
							headerShown: false,
							tabBarShowLabel: false,
							tabBarStyle: {
								position: "absolute",
								shadowColor: "#7F5DF0",
								shadowOffset: {
									width: 0,
									height: 10,
								},
								shadowOpacity: 0.25,
								shadowRadius: 3.5,
								elevation: 5,
								height: 80,
								bottom: 0,
								borderTopLeftRadius: 70,
								borderTopRightRadius: 70,
							},
							tabBarIcon: ({ focused }) => (
								<View
									className={`relative ${
										focused ? "bg-orange-100" : ""
									} p-3 rounded-full`}
								>
									{focused ? (
										<HomeS size={28} color='orange' />
									) : (
										<HomeO size={28} color='orange' />
									)}
								</View>
							),
						}}
						name='HomenDetails'
						component={HomenDetailsScreen}
					/>
					<Tab.Screen
						name='Cart'
						component={CartScreen}
						options={{
							gestureEnabled: false,
							header: ({ navigation }) => (
								<Header
									navigation={navigation}
									share={false}
									title='Cart'
								/>
							),
							headerShadowVisible: false,
							tabBarShowLabel: false,
							tabBarStyle: {
								position: "absolute",
								shadowColor: "#7F5DF0",
								shadowOffset: {
									width: 0,
									height: 10,
								},
								shadowOpacity: 0.25,
								shadowRadius: 3.5,
								elevation: 5,
								height: 80,
								bottom: 0,
								borderTopLeftRadius: 70,
								borderTopRightRadius: 70,
							},
							tabBarIcon: ({ focused }) => (
								<View
									className={`relative ${
										focused ? "bg-orange-100" : ""
									} p-3 rounded-full`}
								>
									{focused ? (
										<CartS size={28} color='orange' />
									) : (
										<CartO size={28} color='orange' />
									)}
									{cartQty && (
										<View
											style={{ elevation: 4 }}
											className='bg-black justify-center items-center w-4 h-4 rounded-full absolute top-2 right-2'
										>
											<Text className='text-white text-[10px]'>
												{cartQty > 9 ? "9+" : cartQty}
											</Text>
										</View>
									)}
								</View>
							),
						}}
					/>
					<Tab.Screen
						name='Delivery'
						component={DelnScreens}
						options={{
							tabBarShowLabel: false,
							headerStyle: {
								elevation: 0,
							},
							header: ({ navigation }) => (
								<Header
									navigation={navigation}
									share={false}
									title=''
								/>
							),
							headerShadowVisible: false,
							tabBarStyle: {
								position: "absolute",
								shadowColor: "#7F5DF0",
								shadowOffset: {
									width: 0,
									height: 10,
								},
								shadowOpacity: 0.25,
								shadowRadius: 3.5,
								elevation: 5,
								height: 80,
								bottom: 0,
								borderTopLeftRadius: 70,
								borderTopRightRadius: 70,
							},
							tabBarIcon: ({ focused }) => (
								<View
									className={`relative ${
										focused ? "bg-orange-100" : ""
									} p-3 rounded-full`}
								>
									{focused ? (
										<DelS size={28} color='orange' />
									) : (
										<DelO size={28} color='orange' />
									)}
								</View>
							),
						}}
					/>
					<Tab.Screen
						options={{
							headerShown: false,
							tabBarShowLabel: false,
							tabBarStyle: {
								position: "absolute",
								shadowColor: "#7F5DF0",
								shadowOffset: {
									width: 0,
									height: 10,
								},
								shadowOpacity: 0.25,
								shadowRadius: 3.5,
								elevation: 5,
								height: 80,
								bottom: 0,
								borderTopLeftRadius: 70,
								borderTopRightRadius: 70,
							},
							tabBarIcon: ({ focused }) => (
								<View
									className={`relative ${
										focused ? "bg-orange-100" : ""
									} p-3 rounded-full`}
								>
									{focused ? (
										<UserS size={28} color='orange' />
									) : (
										<UserO size={28} color='orange' />
									)}
								</View>
							),
						}}
						name='User'
						component={UsernScreens}
					/>
				</Tab.Navigator>
			)}
			{isAccepted && (
				<Modal
					animationType='slide'
					transparent={true}
					visible={isAccepted}
				>
					<View
						style={{
							shadowColor: "#000000",
							shadowOffset: {
								width: 0,
								height: 5,
							},
							shadowOpacity: 0.2,
							shadowRadius: 5.62,
							elevation: 7,
						}}
						className='justify-center items-center flex-1'
					>
						<View
							style={{
								opacity: 0.8,
							}}
							className='absolute top-0 bg-black w-full h-full'
						/>
						<View className='items-center justify-center w-80 p-5 bg-green-500 rounded-3xl'>
							<CheckBadgeIcon size={100} fill='white' />
							<Text className='text-center text-3xl font-extrabold text-white'>
								Accepted !
							</Text>
							<Text className='text-center pt-3 px-2 pb-5 my-2 text-gray-100'>
								Your Order Delivery Contract is Accepted. Pay to
								Enjoy Your Delicious Food !
							</Text>
							<Pressable
								onPress={() => {
									setisAccepted(false)
									navigation.replace("DeliveryCart", {
										data,
									})
								}}
								className='flex-row justify-center items-center gap-x-1 px-7 py-3 bg-black rounded-2xl'
							>
								<Text className='text-center text-white font-bold'>
									Pay
								</Text>
								<ArrowRightCircleIcon size={15} color='white' />
							</Pressable>
						</View>
					</View>
				</Modal>
			)}
		</>
	)
}

export default Tabs
