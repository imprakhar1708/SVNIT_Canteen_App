import React, { useEffect, useState } from "react"
import {
	SafeAreaView,
	Image,
	StyleSheet,
	FlatList,
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	Dimensions,
	Modal,
	Pressable,
	ActivityIndicator,
} from "react-native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { firebase } from "../Firebase/firebaseConfig"
import {
	ArrowPathIcon,
	ExclamationCircleIcon,
	LockClosedIcon,
} from "react-native-heroicons/solid"

const LoginnSignup = ({ navigation }) => {
	let regex = new RegExp("[a-z0-9]+.svnit.ac.[a-z]{2,3}")
	const [modalVisible, setModalVisible] = useState(false)
	const [disabled, setdisabled] = useState(false)
	GoogleSignin.configure({
		webClientId:
			"376798649364-9kcrv0tdemn339q0h9t0ojhl39a8obe3.apps.googleusercontent.com",
	})
	async function onGoogleButtonPress() {
		setdisabled(true)
		if (user && regex.test(user.email)) {
			navigation.navigate("Main")
			setdisabled(false)
			return
		}
		await GoogleSignin.hasPlayServices({
			showPlayServicesUpdateDialog: true,
		})
		const { idToken } = await GoogleSignin.signIn().finally(() => {
			setdisabled(false)
		})
		const googleCredential = auth.GoogleAuthProvider.credential(idToken)
		auth().signInWithCredential(googleCredential)
	}
	const [user, setUser] = useState(null)
	async function onAuthStateChanged(user) {
		setUser(user)
		if (user) {
			if (regex.test(user.email)) {
				const userRef = firestore()
					.collection("UserDetails")
					.doc(user.uid)
				const cashPointsRef = firestore()
					.collection("CashPointDetails")
					.doc(user.uid)
				const doc = await userRef.get()
				const cpDoc = await cashPointsRef.get()
				if (!cpDoc?.exists) {
					await cashPointsRef.set({
						cashPoints: 0,
						history: [],
					})
				}
				if (!doc?.exists) {
					await userRef
						.set({
							uid: user.uid,
							displayName: user.displayName,
							email: user.email,
						})
						.then(() => {
							navigation.navigate("Main")
						})
				} else {
					navigation.navigate("Main")
				}
			} else {
				await auth().currentUser.delete()
				await GoogleSignin.revokeAccess()
				setModalVisible(true)
				setUser(null)
			}
		}
		setdisabled(false)
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
		return subscriber
	}, [])

	return (
		<SafeAreaView className='bg-orange-50' style={{ flex: 1 }}>
			<View className='items-center gap-20 justify-center flex-1'>
				<View className='items-center gap-2 justify-center'>
					<Image
						className='w-32 h-32'
						source={require("../assets/logo.png")}
					/>
					<Text className='text-center text-xl text-gray-700 font-bold'>
						Welcome To SVNIT Canteen App !
					</Text>
				</View>
				<TouchableOpacity
					disabled={disabled}
					style={{
						shadowColor: "#ffa500",
						shadowOffset: {
							width: 0,
							height: 11,
						},
						shadowOpacity: 0.23,
						shadowRadius: 11.78,
						elevation: 15,
					}}
					onPress={onGoogleButtonPress}
					className='py-5 justify-center flex-row items-center px-10 rounded-2xl bg-orange-400'
				>
					<LockClosedIcon size={15} color='white' />
					<Text className='text-white font-extrabold'>
						{" "}
						Institute Google Login
					</Text>
				</TouchableOpacity>
				{disabled && (
					<View className='self-center w-full'>
						<ActivityIndicator size={30} color='grey' />
					</View>
				)}
			</View>
			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible)
				}}
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
					<View className='items-center justify-center py-5 px-11 bg-red-500 rounded-3xl'>
						<ExclamationCircleIcon size={100} fill='white' />
						<Text className='text-center text-3xl font-extrabold text-white'>
							Error
						</Text>
						<Text className='text-center w-52 border-b-[0.8px] border-gray-400 px-3 pt-3 pb-5 my-2 font-bold text-gray-100'>
							Login Using Institute Ids are Only Allowed !
						</Text>
						<Pressable
							onPress={() => {
								setModalVisible(false)
							}}
							className='flex-row justify-center items-center gap-x-1 px-4 py-3 bg-black rounded-2xl'
						>
							<ArrowPathIcon size={15} color='white' />
							<Text className='text-center text-white font-bold'>
								Try Again
							</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

export default LoginnSignup
