import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	Modal,
	Pressable,
	Dimensions,
	useWindowDimensions,
} from "react-native"
import React, { useState } from "react"
import {
	ChevronDownIcon,
	ChevronUpIcon,
	BanknotesIcon,
	MapPinIcon,
} from "react-native-heroicons/outline"
import SingleItem from "./SingleItem"
import {
	ArrowLeftCircleIcon,
	CheckCircleIcon,
	XCircleIcon,
} from "react-native-heroicons/solid"
import firestore from "@react-native-firebase/firestore"
import Toast from "react-native-root-toast"

const SingleActiveOrder = ({ data, mine, isacceptAvailable, acceptOrder }) => {
	const contractRef = firestore().collection("ContractDetails").doc("active")
	const [open, setopen] = useState(false)
	const [innermodal, setinnermodal] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const cancelOrder = () => {
		contractRef.get().then((doc) => {
			if (doc?.exists) {
				const active = doc.data().active
				const remainingActive = active.filter((item) => {
					return item?.id != data?.id
				})
				contractRef
					.update({
						active: remainingActive,
					})
					.then(() => {
						showDoneToast("Order Contract Cancelled !")
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
			duration: 1500,
		})
	}
	const Width = Dimensions.get("window").width
	return (
		<>
			<View className=' p-2 mb-3 rounded-xl border-[.8px] border-gray-300'>
				<TouchableOpacity
					onPress={() => {
						if (mine) {
							setopen(false)
							setinnermodal(true)
						} else {
							if (isacceptAvailable) {
								setopen(false)
								setinnermodal(true)
							} else {
								showDoneToast(
									"Can't Accept! One Delivery Already in Progress..."
								)
							}
						}
					}}
					className='flex-row pb-2 justify-between'
				>
					<View className='flex-row  items-center'>
						<View>
							<Image
								source={{ uri: data?.owner_info?.photoUrl }}
								className='w-8 h-8 rounded-full'
							/>
						</View>

						<View className='px-1'>
							<Text
								style={{
									width: useWindowDimensions().width / 1.75,
								}}
								className='font-black text-[16px] text-gray-600'
							>
								{data?.owner_info.name}
							</Text>
							<View className='flex-row'>
								<View className='flex-row items-center'>
									<MapPinIcon size={15} color='orange' />
									<View>
										<Text className='text-xs text-gray-400'>
											{data?.owner_info.hostel} &#11825;{" "}
										</Text>
									</View>
								</View>
								<View className='flex-row items-center'>
									<BanknotesIcon size={15} color='green' />
									<Text className='text-xs text-gray-400'>
										{" "}
										{data?.order_data.cp}
									</Text>
								</View>
							</View>
						</View>
					</View>
					<View className='items-end'>
						<View className='py-1 px-2 text-white bg-red-400 rounded-2xl flex-row items-center'>
							{mine ? (
								<ActivityIndicator size={10} color='white' />
							) : (
								<View className='w-2 h-2 rounded-full bg-white' />
							)}
							<Text className='font-black text-xs text-white pl-1'>
								{mine ? "Waiting" : "Live"}
							</Text>
						</View>
						<Text className='text-lg text-end font-bold text-gray-600'>
							₹{data?.order_data.total}
						</Text>
					</View>
				</TouchableOpacity>
				<View className='px-3 py-2 bg-gray-200 border-[.5px] border-gray-300 rounded-xl'>
					<TouchableOpacity
						onPress={() => {
							setopen((prev) => !prev)
						}}
						className={`flex-row w-full  ${
							open ? "justify-end" : "justify-between"
						} items-center`}
					>
						{!open && (
							<Text className='text-xs font-bold text-gray-700'>
								Order Items
							</Text>
						)}
						{!open ? (
							<ChevronDownIcon size={15} color='rgb(55 65 81)' />
						) : (
							<ChevronUpIcon size={15} color='rgb(55 65 81)' />
						)}
					</TouchableOpacity>
					{open && (
						<View className='px-3 py-1'>
							{data?.order_data.order.map((item) => (
								<SingleItem key={item?.food?.id} data={item} />
							))}
						</View>
					)}
				</View>
				{innermodal && (
					<>
						<View
							style={{ width: Width / 1.1 }}
							className='absolute rounded-xl overflow-hidden top-0 h-[107px]'
						>
							<View className='w-full h-full z-10 bg-black opacity-70' />
						</View>
						<View
							style={{ width: Width / 1.1 }}
							className='absolute top-0 gap-x-2 h-[107px] flex-row justify-center items-center'
						>
							<TouchableOpacity
								onPress={() => {
									setModalVisible(true)
								}}
								className={`${
									mine ? "bg-red-400" : "bg-green-400"
								} rounded-lg overflow-hidden px-7 py-4 items-center flex-row`}
							>
								{mine ? (
									<XCircleIcon size={20} color='black' />
								) : (
									<CheckCircleIcon size={20} color='black' />
								)}
								<Text className='text-sm font-black'>
									{mine ? "Cancel" : "Accept"}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setinnermodal(false)
								}}
								className='rounded-lg bg-gray-200 overflow-hidden px-8 py-4 items-center flex-row'
							>
								<ArrowLeftCircleIcon size={20} color='black' />
								<Text className='text-sm font-black'>Back</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
			</View>
			{modalVisible && (
				<>
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
										{mine
											? "Cancel the Delivery Contract ?"
											: "Accept the Delivery Contract !"}
									</Text>
								</View>
								<View className='flex-row gap-1 mt-3 items-center'>
									<Pressable
										onPress={() => {
											setinnermodal(false)
											setModalVisible(false)
										}}
										className='flex-row flex-1 justify-center items-center gap-x-1  p-4 border-[0.5px] border-gray-800 rounded-lg'
									>
										<ArrowLeftCircleIcon
											size={15}
											color='black'
										/>
										<Text className='text-gray-800 text-center font-black'>
											Back
										</Text>
									</Pressable>
									<Pressable
										onPress={() => {
											if (mine) {
												cancelOrder()
											} else {
												acceptOrder(data)
											}
										}}
										className={`flex-row flex-1 justify-center items-center gap-x-1 p-4 ${
											mine ? "bg-red-400" : "bg-green-400"
										} rounded-lg border-[0.5px] border-gray-800`}
									>
										{mine ? (
											<XCircleIcon
												size={15}
												color='black'
											/>
										) : (
											<CheckCircleIcon
												size={15}
												color='black'
											/>
										)}
										<Text className='text-center font-black'>
											{mine ? `Cancel` : "Accept"}
										</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</Modal>
				</>
			)}
		</>
	)
}

export default SingleActiveOrder
