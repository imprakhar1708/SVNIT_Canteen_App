import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Platform,
	Linking,
	useWindowDimensions,
} from "react-native"
import React, { useEffect, useState } from "react"
import { BanknotesIcon, MapPinIcon } from "react-native-heroicons/outline"
import {
	ChatBubbleLeftEllipsisIcon,
	CheckBadgeIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	InformationCircleIcon,
	PhoneIcon,
} from "react-native-heroicons/solid"
import SingleItem from "./SingleItem"

const SingleDelHistory = ({ data }) => {
	const colorCodes = [
		{
			id: "Waiting",
			color: "rgb(156 163 175)",
		},
		{
			id: "Ongoing",
			color: "rgb(156 163 175)",
		},
		{
			id: "Accepted",
			color: "#00AEDB",
		},
		{
			id: "Preparing",
			color: "#FFC65D",
		},
		{
			id: "Ready",
			color: "#55D6BE",
		},
		{
			id: "Taken",
			color: "#4ADE80",
		},
		{
			id: "Out For Delivery",
			color: "#FFB366",
		},
		{
			id: "Delivered",
			color: "#4ADE80",
		},
		{
			id: "Cancelled",
			color: "rgb(248 113 113)",
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
	const [open, setopen] = useState(false)
	const { width } = useWindowDimensions()
	return (
		<>
			<View className='p-2 mb-3 rounded-xl border-[.8px] border-gray-300'>
				<View
					style={{
						width: width / 1.15,
					}}
					className='flex-row pb-2 justify-between'
				>
					<View className='flex-row items-center'>
						<View>
							<Image
								source={{ uri: data?.owner_info?.photoUrl }}
								className='w-8 h-8 rounded-full'
							/>
						</View>

						<View className='px-1'>
							<Text className='font-black text-[17px] w-40 text-gray-600'>
								{data?.owner_info?.name}
							</Text>
							<View className='flex-row'>
								<View className='flex-row items-center'>
									<MapPinIcon size={15} color='orange' />
									<View>
										<Text className='text-xs text-gray-400'>
											{data?.owner_info?.hostel} &#11825;{" "}
										</Text>
									</View>
								</View>
								<View className='flex-row items-center'>
									<BanknotesIcon size={15} color='green' />
									<Text className='text-xs text-gray-400'>
										{" "}
										{data?.order_data?.cp}
									</Text>
								</View>
							</View>
						</View>
					</View>
					<View className='items-end'>
						<View
							style={{
								backgroundColor: `${
									colorCodes.filter((item) => {
										return item.id == data?.status
									})[0].color
								}`,
							}}
							className='py-1 px-2 text-white rounded-2xl flex-row items-center'
						>
							{data?.status === "Waiting" && (
								<ActivityIndicator size={10} color='white' />
							)}
							<Text className='font-black text-xs text-white pl-1'>
								{data?.status}
							</Text>
						</View>
						<Text className='text-lg text-end font-bold text-gray-600'>
							₹{data?.order_data?.total}
						</Text>
					</View>
				</View>
				<View className='px-1 py-1 bg-gray-200 border-[.5px] border-gray-300 rounded-xl'>
					<View
						className={`flex-row w-full justify-between items-center`}
					>
						<View className='flex-row gap-x-1 items-center'>
							<InformationCircleIcon size={15} color='black' />
							<Text className='text-xs text-gray-500 font-bold'>
								{data?.status === "Waiting"
									? "Remind them to Pay for the Order !"
									: data?.status === "Delivered"
									? "CashPoints Credited to your Account !"
									: `Token No. ${data?.token}`}
							</Text>
						</View>
						<View className='flex-row gap-x-1'>
							<TouchableOpacity
								onPress={() => {
									dialCall(`${data?.owner_info?.phn}`)
								}}
								className='bg-gray-800 p-2 rounded-full'
							>
								<PhoneIcon size={20} color='white' />
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									Linking.openURL(
										`whatsapp://send?phone=${data?.owner_info?.phn}`
									)
								}}
								className='bg-gray-800 p-2 rounded-full'
							>
								<ChatBubbleLeftEllipsisIcon
									size={20}
									color='white'
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View className='px-3 py-2 mt-2 bg-gray-200 border-[.5px] border-gray-300 rounded-xl'>
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
							{data?.order_data?.order.map((item) => (
								<SingleItem key={item?.food?.id} data={item} />
							))}
						</View>
					)}
				</View>
			</View>
		</>
	)
}

export default SingleDelHistory
