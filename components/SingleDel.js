import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native"
import React, { useEffect, useState } from "react"
import {
	ChevronRightIcon,
	HomeModernIcon,
	MapPinIcon,
	PhoneIcon,
} from "react-native-heroicons/solid"
import firestore from "@react-native-firebase/firestore"
import Toast from "react-native-root-toast"
import { firebase } from "@react-native-firebase/auth"

const SingleDel = ({ data, cartData, navigation }) => {
	const [modalVisible, setModalVisible] = useState(false)
	const user = firebase.auth().currentUser
	const [isdeliveryAvailable, setisdeliveryAvailable] = useState(false)
	const contractRef = firestore().collection("ContractDetails").doc("active")
	const cartRef = firestore().collection("CartDetails").doc(user.uid)
	useEffect(() => {
		contractRef.onSnapshot(async (doc) => {
			let available = true
			if (doc?.exists) {
				const active = await doc?.data()?.active
				active?.forEach((item) => {
					if (
						item.owner_info.admission_no ===
						user.email.split("@")[0]
					) {
						available = false
					}
				})
				setisdeliveryAvailable(available)
			} else {
				setisdeliveryAvailable(true)
			}
		})
	}, [])
	const onPress = () => {
		contractRef.get().then((doc) => {
			if (doc?.exists) {
				contractRef
					.update({
						active: firestore.FieldValue.arrayUnion({
							id:
								firebase.auth().currentUser.uid +
								new Date().getTime(),
							owner_info: data,
							order_data: cartData,
							timeAdded: new Date().getTime(),
						}),
					})
					.then(() => {
						navigation.setParams({
							cartData: null,
						})
						cartRef.delete()
						showDoneToast(`Your Delivery Contract is Live!`)
						navigation.navigate("DelScreen", {
							screen: "My Orders",
						})
					})
			} else {
				contractRef
					.set({
						active: [
							{
								id:
									firebase.auth().currentUser.uid +
									new Date().getTime(),
								owner_info: data,
								order_data: cartData,
								timeAdded: new Date().getTime(),
							},
						],
					})
					.then(() => {
						navigation.setParams({
							cartData: null,
						})
						cartRef.delete()
						showDoneToast(`Your Delivery Contract is Live!`)
						navigation.navigate("DelScreen", {
							screen: "My Orders",
						})
					})
			}
		})
	}
	const showDoneToast = (mess) => {
		Toast.show(mess, {
			position: 100,
			backgroundColor: "black",
			textColor: "white",
			opacity: 1,
			duration: 2000,
		})
	}
	return (
		<>
			<TouchableOpacity
				onPress={() => {
					if (cartData) {
						if (isdeliveryAvailable) {
							setModalVisible(true)
						} else {
							showDoneToast(
								"Cannot Order! Other Order Contract Already Live !"
							)
						}
					} else {
						showDoneToast("Cart Empty !")
					}
				}}
				style={{ width: 175 }}
				className='flex-row py-3 mb-2 mr-2 pl-2 justify-between border-[0.5px] border-gray-300 bg-gray-200 rounded-lg'
			>
				<View className=' flex-row items-center'>
					<View className='gap-2'>
						<View>
							<Text className='font-bold text-gray-700'>
								{data?.name}
							</Text>
						</View>
						<View className='flex-row gap-x-1 items-center'>
							<View className='bg-gray-300 p-1 rounded-full'>
								<HomeModernIcon size={10} color='black' />
							</View>

							<Text className='text-xs font-bold text-gray-500'>
								{data?.room}
							</Text>
						</View>
						<View className='flex-row gap-x-1 items-center'>
							<View className='bg-gray-300 p-1 rounded-full'>
								<MapPinIcon size={10} color='black' />
							</View>

							<Text
								className={`${
									data?.hostel.split(" ")[0] === "Swami"
										? "text-[10px]"
										: "text-xs"
								} font-bold text-gray-500`}
							>
								{data?.hostel}
							</Text>
						</View>
						<View className='flex-row gap-x-1 items-center'>
							<View className='bg-gray-300 p-1 rounded-full'>
								<PhoneIcon size={10} color='black' />
							</View>

							<Text className='text-xs font-bold text-gray-500'>
								{data?.phn}
							</Text>
						</View>
					</View>
				</View>
				<View className='justify-center'>
					<ChevronRightIcon size={20} color='black' />
				</View>
			</TouchableOpacity>
			{modalVisible && (
				<Modal
					animationType='slide'
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible)
					}}
					className='relative'
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
						<View
							className={`w-80 justify-center p-5 bg-orange-50 rounded-3xl`}
						>
							<View>
								<Text className='text-xl text-center font-bold'>
									Confirm Order ?
								</Text>
							</View>

							<View className='flex-row gap-1 mt-3 items-center'>
								<Pressable
									onPress={() => {
										setModalVisible(false)
									}}
									className='flex-row flex-1 justify-center items-center gap-x-1  p-4 border-[0.5px] border-gray-800 rounded-lg'
								>
									<Text className='text-gray-800 text-center font-bold'>
										&lt; Back
									</Text>
								</Pressable>
								<Pressable
									onPress={onPress}
									className='flex-row flex-1 justify-center items-center gap-x-1 p-4 bg-gray-800 rounded-lg'
								>
									<Text className='text-gray-50 text-center font-bold'>
										Proceed &gt;
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			)}
		</>
	)
}

export default SingleDel
