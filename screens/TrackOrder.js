import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	Linking,
	Platform,
} from "react-native"
import React, { useEffect, useState } from "react"
import firestore from "@react-native-firebase/firestore"
import { firebase } from "@react-native-firebase/auth"
import {
	ChatBubbleOvalLeftEllipsisIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ClockIcon,
	MapPinIcon,
	PhoneIcon,
	StarIcon,
} from "react-native-heroicons/solid"
import SingleItem from "../components/SingleItem"
const TrackOrder = ({ route }) => {
	const [order, setorder] = useState(null)
	const [status, setstatus] = useState(null)
	const [displaySummary, setdisplaySummary] = useState(false)
	const [displayDetails, setdisplayDetails] = useState(false)
	const orderRef = firestore()
		.collection("OrderDetails")
		.doc(firebase.auth().currentUser.uid)
	useEffect(() => {
		orderRef.onSnapshot((doc) => {
			if (doc?.exists) {
				const orders = doc.data().orders
				setorder(
					orders.filter((item) => {
						return item.id === route?.params.id
					})[0]
				)
			}
		})
	}, [])
	useEffect(() => {
		setstatus(
			status_images.filter((item) => {
				return item.id === order?.status
			})[0]
		)
	}, [order])
	const status_images = [
		{
			id: "Ongoing",
			imageUrl: require("../assets/order_ongoing.png"),
			mess: "Your order is in queue and waiting to be accepted by the canteen. We're in touch with them and will notify you as soon as they confirm your order. Thank you for your patience!",
		},
		{
			id: "Accepted",
			imageUrl: require("../assets/order_accepted.png"),
			mess: "Good news! The canteen has accepted your order and is now preparing it with care. They are dedicated to making sure your meal is delicious and satisfying",
		},
		{
			id: "Preparing",
			imageUrl: require("../assets/order_preparing.png"),
			mess: "Your meal is currently being prepared with care and expertise. We're working hard to make sure it's cooked to perfection just for you.",
		},
		{
			id: "Ready",
			imageUrl: require("../assets/order_ready.png"),
			mess: "Exciting news! Your food is now ready and waiting to be delivered. Get ready to indulge in a delightful culinary experience.",
		},
		{
			id: "Taken",
			imageUrl: require("../assets/order_taken.png"),
			mess: "Success! You've picked up your order. We hope you enjoy every bite of your meal. Thank you for choosing our canteen!",
		},
		{
			id: "Out For Delivery",
			imageUrl: require("../assets/order_ofd.png"),
			mess: "Your order is on its way! Our delivery partner is now en route to your location, bringing your hot and tasty meal straight to your doorstep.",
		},
		{
			id: "Delivered",
			imageUrl: require("../assets/order_delivered.png"),
			mess: "Enjoy your meal! Your order has been successfully delivered. We hope you relish every bite and have a fantastic dining experience. Thank you for choosing our food delivery service!",
		},
		{
			id: "Cancelled",
			imageUrl: require("../assets/order_cancel.png"),
			mess: "We regret to inform you that the canteen has cancelled your order. We apologize for any inconvenience caused. We appreciate your understanding and look forward to serving you in the future !",
		},
	]
	const dialCall = (number) => {
		let phoneNumber = ""
		if (Platform.OS === "android") {
			phoneNumber = `tel:${number}`
		} else {
			phoneNumber = `telprompt:${number}`
		}
		Linking.openURL(phoneNumber)
	}
	return (
		<View
			className={`flex-1 ${
				order?.status === "Out For Delivery" ? "pb-64" : "pb-20"
			}`}
		>
			<ScrollView className='px-2'>
				{status && (
					<Image
						source={status?.imageUrl}
						style={{ width: 400, height: 400 }}
					/>
				)}
				<View
					className='bg-gray-50 border-[0.5px] border-gray-300 mx-3 px-2 py-7 rounded-xl'
					style={{ justifyContent: "center" }}
				>
					<Text className='text-center font-black text-gray-600 text-2xl'>
						{order?.status} !
					</Text>
					<Text className='text-xs px-6 py-2 text-center text-gray-400'>
						{status?.mess}
					</Text>
				</View>
				<View className='px-3 py-5 gap-y-5'>
					<View className='py-3 px-4 rounded-xl border-[0.5px] border-gray-300 bg-gray-50'>
						<TouchableOpacity
							onPress={() => {
								setdisplaySummary((prev) => !prev)
							}}
							className=' flex-row py-2 justify-between'
						>
							<View>
								<Text>Order Summary</Text>
							</View>
							<View>
								{displaySummary ? (
									<ChevronUpIcon size={20} color='grey' />
								) : (
									<ChevronDownIcon size={20} color='grey' />
								)}
							</View>
						</TouchableOpacity>
						{displaySummary && (
							<View>
								<View className='border-dashed border-y-[0.8px] border-gray-300 px-2 py-3'>
									{order?.items.map((item, idx) => (
										<SingleItem key={idx} data={item} />
									))}
								</View>
								<View className='flex-row px-2 pt-2  justify-between'>
									<Text className='text-gray-500'>
										Item-Total :
									</Text>
									<Text className='text-gray-500'>
										₹{order?.itemTotal}
									</Text>
								</View>
								<View
									className={`flex-row px-2 justify-between ${
										order?.mode === "del" ? "" : "pb-2"
									}`}
								>
									<Text className='text-gray-500'>
										Convenience Fee :
									</Text>
									<Text className='text-gray-500'>
										₹{(0.05 * order?.itemTotal)?.toFixed(2)}
									</Text>
								</View>
								{order?.mode === "del" && (
									<View className='flex-row px-2 pb-2 justify-between'>
										<Text className='text-gray-500'>
											Delivery Fee :
										</Text>
										<Text className='text-gray-500'>
											₹
											{(0.15 * order?.itemTotal)?.toFixed(
												0
											)}
										</Text>
									</View>
								)}
								<View className='flex-row p-2 justify-between border-dashed border-t-[0.8px] border-gray-300'>
									<Text className='text-lg text-gray-600'>
										Grand Total :
									</Text>
									<Text className='text-lg text-gray-600'>
										₹{order?.total}
									</Text>
								</View>
							</View>
						)}
					</View>
					<View className='py-3 px-4 rounded-xl border-[0.5px] border-gray-300 bg-gray-50'>
						<TouchableOpacity
							onPress={() => {
								setdisplayDetails((prev) => !prev)
							}}
							className=' flex-row py-2 justify-between'
						>
							<View>
								<Text>Order Details</Text>
							</View>
							<View>
								{displayDetails ? (
									<ChevronUpIcon size={20} color='grey' />
								) : (
									<ChevronDownIcon size={20} color='grey' />
								)}
							</View>
						</TouchableOpacity>
						{displayDetails && (
							<View className='gap-y-2 py-2'>
								<View className='px-1 pt-3 border-dashed border-t-[0.8px] border-gray-300 justify-between'>
									<Text className='text-xs text-gray-400'>
										Order Number :
									</Text>
									<Text className='text-gray-500 text-sm font-bold'>
										{order?.id}
									</Text>
								</View>
								<View className='px-1 justify-between'>
									<Text className='text-xs text-gray-400'>
										Mode :
									</Text>
									<Text className='text-gray-500 text-sm font-bold'>
										{order?.mode === "del"
											? "Delivery"
											: "Takeaway"}
									</Text>
								</View>
								<View className='px-1 justify-between'>
									<Text className='text-xs text-gray-400'>
										Date :
									</Text>
									<Text className='text-gray-500 text-sm font-bold'>
										{order?.orderDate}
									</Text>
								</View>
								{order?.mode === "del" && (
									<View>
										<View className='px-1 pb-2 justify-between'>
											<Text className='text-xs text-gray-400'>
												Delivery Partner :
											</Text>
											<Text className='text-gray-500 text-sm font-bold'>
												{order?.deliveryInfo?.name} ({" "}
												{order?.deliveryInfo?.admission_no.toUpperCase()}{" "}
												)
											</Text>
										</View>
										<View className='px-1 pb-2 justify-between'>
											<Text className='text-xs text-gray-400'>
												Delivery Address :
											</Text>
											<Text className='text-gray-500 text-sm font-bold'>
												{order?.deliveryInfo?.room},{" "}
												{order?.deliveryInfo?.hostel}
											</Text>
										</View>
									</View>
								)}
							</View>
						)}
					</View>
				</View>
			</ScrollView>
			{order?.status === "Out For Delivery" && (
				<View
					style={{
						shadowColor: "#000000",
						shadowOffset: {
							width: 0,
							height: 7,
						},
						shadowOpacity: 0.21,
						shadowRadius: 7.68,
						elevation: 10,
					}}
					className='px-5 w-full absolute bottom-0 pb-20 bg-orange-50 rounded-t-3xl'
				>
					<View>
						<View className='flex-row px-2 border-b-[1px] border-gray-200 pt-5 pb-2 rounded-t-3xl justify-between'>
							<View className='flex-row p-2 items-center'>
								<View>
									<Image
										source={{
											uri: order?.deliveryInfo?.photoUrl,
										}}
										className='w-12 h-12 rounded-full'
									/>
								</View>

								<View className='px-3'>
									<View className=''>
										<Text
											style={{ lineHeight: 18 }}
											className='font-black w-44 text-gray-600 text-lg'
										>
											{order?.deliveryInfo?.name}
										</Text>
									</View>
									<View className='flex-row justify-between'>
										<View>
											<Text className='font-bold  text-gray-400 text-xs'>
												Delivery Partner
											</Text>
										</View>
										<View>
											<Text className='text-gray-400 text-xs'>
												(
												{order?.deliveryInfo?.admission_no.toUpperCase()}
												)
											</Text>
										</View>
									</View>
								</View>
							</View>

							<View className='flex-row p-2 gap-x-2 items-center'>
								<TouchableOpacity
									onPress={() => {
										dialCall(order?.deliveryInfo?.phn)
									}}
									className='bg-gray-700 p-2 rounded-full'
								>
									<PhoneIcon color='white' size={20} />
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										Linking.openURL(
											`whatsapp://send?phone=${order?.deliveryInfo?.phn}`
										)
									}}
									className='bg-gray-700 p-2 rounded-full'
								>
									<ChatBubbleOvalLeftEllipsisIcon
										color='white'
										size={20}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					<View className='flex-row p-3 justify-between'>
						<View className='flex-row py-2 items-center'>
							<View className='bg-orange-100 p-2 rounded-full'>
								<MapPinIcon color='orange' size={30} />
							</View>
							<View className='px-1'>
								<View>
									<Text className='font-black text-gray-500'>
										On the Way
									</Text>
								</View>
								<View>
									<Text className='font-bold text-xs text-gray-400'>
										{order?.deliveryInfo?.room},{" "}
										{order?.deliveryInfo?.hostel}
									</Text>
								</View>
							</View>
						</View>
						<View className='flex-row p-2 items-center'>
							<View className='bg-orange-100 p-2 rounded-full'>
								<ClockIcon color='orange' size={30} />
							</View>
							<View className='px-1'>
								<View>
									<Text className='font-black text-gray-500'>
										Estimated Time
									</Text>
								</View>
								<View>
									<Text className='font-bold text-xs text-gray-400'>
										15 min
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			)}
		</View>
	)
}

export default TrackOrder
