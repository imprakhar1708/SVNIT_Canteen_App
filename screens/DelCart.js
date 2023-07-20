import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Modal,
	Pressable,
} from "react-native"
import React, { useEffect, useState } from "react"
import CartItem from "../components/CartItem"
import { BanknotesIcon } from "react-native-heroicons/outline"
import pay from "../assets/pay"
import OrderModal from "../components/OrderModal"
import { ArrowPathIcon, ArrowRightIcon } from "react-native-heroicons/solid"
import Confetti from "../components/Confetti"
import { firebase } from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Checkbox from "expo-checkbox"
import Toast from "react-native-root-toast"

const DelCart = ({ route, navigation }) => {
	const user = firebase.auth().currentUser
	const data = route?.params?.data
	const cartDisplayData = route?.params?.data?.order_data.order
	const { cp, total, convenience, cpEarned, itemTotal } =
		route?.params?.data?.order_data
	const [status, setstatus] = useState(false)
	const [isDisabled, setisDisabled] = useState(false)
	const [cpDiscount, setcpDiscount] = useState(0)
	const [isChecked, setChecked] = useState(false)
	const [cpData, setcpData] = useState(0)
	const [amount, setamount] = useState(total)
	const [modalVisible, setModalVisible] = useState(false)
	const fnErrorMiddle = () => {
		setstatus(false)
		setModalVisible(true)
	}

	const fnError = () => {
		setstatus(false)
		setModalVisible(true)
		setisDisabled(false)
	}

	const fnSuccess = () => {
		createOrder()
		setModalVisible(true)
		setstatus(true)
		setisDisabled(false)
	}

	const onPressSuccess = () => {
		navigation.navigate("Main", {
			screen: "User",
		})
		setModalVisible(false)
	}

	useEffect(() => {
		cpRef.onSnapshot((doc) => {
			if (doc?.exists) {
				setcpData(doc?.data()?.cashPoints)
			} else {
				setcpData(0)
			}
		})
	}, [])
	const orderDocRef = firestore().collection("OrderDetails").doc(user.uid)
	const cpRef = firestore().collection("CashPointDetails").doc(user.uid)
	const acceptedContractRef = firestore()
		.collection("AcceptedContractDetails")
		.doc("active")
	const deleteFromAcceptedContract = () => {
		acceptedContractRef.get().then((doc) => {
			if (doc?.exists) {
				const accept = doc.data().active
				const remainingAccept = accept.filter((item) => {
					return item?.id != data?.id
				})
				acceptedContractRef.update({
					active: remainingAccept,
				})
			}
		})
	}
	const createOrder = () => {
		const orderId = user.uid + new Date().getTime().toString()
		orderDocRef.get().then((doc) => {
			if (doc?.exists) {
				orderDocRef.update({
					orders: firestore.FieldValue.arrayUnion({
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
						itemTotal,
						total,
						orderDate: new Date().toDateString(),
						orderTime: new Date().toLocaleTimeString(),
						time: new Date().toISOString(),
						status: "Ongoing",
						mode: "del",
						id: orderId,
						items: cartDisplayData,
						deliveryInfo: {
							contractId: data.id,
							room: data.owner_info.room,
							hostel: data.owner_info.hostel,
							...data.delivery_info,
						},
					}),
				})
			} else {
				orderDocRef.set({
					orders: [
						{
							uid: user.uid,
							email: user.email,
							displayName: user.displayName,
							itemTotal,
							total,
							orderDate: new Date().toDateString(),
							orderTime: new Date().toLocaleTimeString(),
							time: new Date().toISOString(),
							status: "Ongoing",
							mode: "del",
							id: orderId,
							items: cartDisplayData,
							deliveryInfo: {
								contractId: data.id,
								room: data.owner_info.room,
								hostel: data.owner_info.hostel,
								...data.delivery_info,
							},
						},
					],
				})
			}
		})
		cpRef.get().then((doc) => {
			if (doc?.exists) {
				cpRef
					.update({
						cashPoints:
							parseInt(doc?.data()?.cashPoints) +
							parseInt((0.01 * total).toFixed(0)),
						history: firestore.FieldValue.arrayUnion({
							action: "add",
							date: new Date().toISOString(),
							amount: parseInt((0.01 * total).toFixed(0)),
							title: "Cashpoints Added",
							id: orderId,
							type: "Order",
						}),
					})
					.then(() => {
						{
							isChecked &&
								cpRef.update({
									cashPoints:
										parseInt(doc?.data()?.cashPoints) -
										parseInt(cpDiscount),
									history: firestore.FieldValue.arrayUnion({
										action: "remove",
										date: new Date().toISOString(),
										amount: parseInt(cpDiscount),
										title: "Cashpoints Redeemed",
										id: orderId,
										type: "Order",
									}),
								})
						}
					})
			}
		})
		deleteFromAcceptedContract()
	}

	const showToast = (mess) => {
		Toast.show(mess, {
			position: 100,
			backgroundColor: "black",
			textColor: "white",
			opacity: 1,
			duration: 1000,
		})
	}

	useEffect(() => {
		setcpDiscount(
			itemTotal < 50 || !isChecked
				? 0
				: Math.min(cpData, Math.floor(0.8 * itemTotal))
		)
	}, [itemTotal, isChecked, cpData])

	useEffect(() => {
		const totalAmount = total
		setamount(
			itemTotal >= 50 && isChecked
				? totalAmount - cpDiscount
				: totalAmount
		)
	}, [itemTotal, isChecked, cpDiscount, cpData])

	return (
		<View className='flex-1 bg-gray-100 relative pb-80'>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 15,
					paddingTop: 15,
					paddingBottom: 50,
				}}
			>
				{cartDisplayData?.map((item) => (
					<CartItem
						del={true}
						key={item.food.id}
						item={item.food}
						qty={item.qty}
					/>
				))}
			</ScrollView>
			<View className='px-5 w-full absolute bottom-0 pt-7 pb-4 bg-orange-50 rounded-t-3xl'>
				<View>
					<View className='border-b-[0.5px] py-2 border-gray-300'>
						<View className='flex-row px-5  justify-between'>
							<Text className='text-gray-500'>Sub-Total :</Text>
							<Text className='text-gray-500 font-bold'>
								₹{itemTotal}
							</Text>
						</View>
						<View className='flex-row px-5 justify-between'>
							<Text className='text-gray-500'>
								Convenience Fee :
							</Text>
							<Text className='text-gray-500 font-bold'>
								₹{convenience}
							</Text>
						</View>
						<View className='flex-row px-5 justify-between'>
							<Text className='text-gray-500'>
								Delivery Fee :
							</Text>
							<Text className='text-gray-500 font-bold'>
								₹{cp}
							</Text>
						</View>
						<View className='flex-row px-5 items-center justify-between'>
							<Text className='text-gray-500'>Cash Points :</Text>
							<View className='flex-row justify-center gap-1 items-center'>
								<Text className='text-gray-500 text-lg font-bold'>
									+{cpEarned}
								</Text>
								<BanknotesIcon size={18} color='green' />
							</View>
						</View>
						<TouchableOpacity
							onPress={() => {
								cpData > 50
									? setChecked((prev) => !prev)
									: showToast(
											"⚠️Atleast 50 Cashpoints Needed to Redeem !"
									  )
							}}
							className='flex-row px-5 items-center justify-between'
						>
							<View className='flex-row items-center'>
								<Checkbox
									value={isChecked}
									disabled={isDisabled}
									onValueChange={setChecked}
									color='rgb(251 146 60)'
								/>
								<View className='p-2'>
									<View className='flex-row items-center'>
										<Text className='text-gray-500'>
											Reedem CashPoints
										</Text>
										<Text className='text-[10px] text-gray-500'>
											{" "}
											(Upto 80% Discount)
										</Text>
									</View>

									<View className='flex-row items-center'>
										<Text className='text-xs text-gray-400'>
											Balance : {cpData}
										</Text>
										<BanknotesIcon
											size={12}
											color='green'
										/>
									</View>
								</View>
							</View>
							{isChecked && (
								<Text className='text-gray-500 text-lg font-bold'>
									- ₹{cpDiscount}
								</Text>
							)}
						</TouchableOpacity>
					</View>
					<View className='flex-row p-5 justify-between'>
						<Text className='text-xl font-bold'>Total :</Text>
						<Text className='text-xl font-extrabold'>
							₹{amount}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					disabled={isDisabled}
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
					onPress={(e) => {
						pay(
							setisDisabled,
							amount * 100,
							fnErrorMiddle,
							fnSuccess,
							fnError
						)
					}}
					className='py-5 my-5 justify-center items-center px-10 rounded-2xl bg-orange-400'
				>
					{isDisabled && <ActivityIndicator size={19} color='grey' />}
					{!isDisabled && (
						<Text className='text-white font-extrabold'>
							Proceed to Pay
						</Text>
					)}
				</TouchableOpacity>
			</View>
			{modalVisible && (
				<>
					<Modal
						animationType='slide'
						transparent={true}
						visible={modalVisible}
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
								className={`items-center justify-center p-5 ${
									status ? "bg-green-500" : "bg-red-500"
								} rounded-3xl`}
							>
								<OrderModal status={status} />
								<Pressable
									onPress={() => {
										status === true
											? onPressSuccess()
											: setModalVisible(false)
									}}
									className='flex-row justify-center items-center gap-x-1 px-4 py-3 bg-black rounded-2xl'
								>
									{status === true ? null : (
										<ArrowPathIcon
											size={15}
											color='white'
										/>
									)}

									<Text className='text-center text-white font-bold'>
										{status === true
											? "Orders "
											: "Try Again "}
									</Text>

									{status === true ? (
										<ArrowRightIcon
											size={15}
											color='white'
										/>
									) : null}
								</Pressable>
							</View>
							<Confetti
								active={status}
								className='bottom-0 absolute'
							/>
						</View>
					</Modal>
				</>
			)}
		</View>
	)
}

export default DelCart
