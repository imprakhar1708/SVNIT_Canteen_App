import { View, Text, Image, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import SingleItem from "./SingleItem"
import moment from "moment"
import { ChevronRightIcon } from "react-native-heroicons/solid"

const SingleOrder = ({ data, navigation }) => {
	const colorCodes = [
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

	const [status_color, setstatus_color] = useState(null)
	useEffect(() => {
		setstatus_color(
			colorCodes.filter((item) => {
				return item.id == data?.status
			})[0]?.color
		)
	})

	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate("TrackOrder", { id: data.id })
			}}
			className='mb-3 rounded-2xl border-[.8px] border-gray-300'
		>
			<View className='p-3'>
				<View className='flex-row pb-2 justify-between border-b-[.8px] border-dashed border-gray-100'>
					<View className='flex-row gap-2'>
						<Image
							source={{ uri: data?.items[0].food.foodImageUrl }}
							className='w-14 h-14 rounded-xl'
						/>
						<View>
							<Text className='text-lg'>
								{moment(data?.time).format("DD MMM 'YY")}
							</Text>
							<Text className='text-gray-700'>
								{moment(data?.time).format("h:mm a")}
							</Text>
						</View>
					</View>
					<View className='items-end'>
						<Text
							style={{ backgroundColor: status_color }}
							className='py-1 px-2 text-white rounded-2xl'
						>
							{data?.status}
						</Text>
						<Text className='text-lg font-bold'>
							₹{data?.total}
						</Text>
					</View>
				</View>
				<View className='flex-row items-center px-1 pt-2 justify-between border-t-[.8px] border-dashed border-gray-300'>
					<View>
						{data?.token && (
							<Text className='text-xs text-gray-400'>
								Token No. : {data?.token}
							</Text>
						)}
						<Text className='text-xs text-gray-400'>
							Order ID: {data.id}
						</Text>
					</View>
					<View>
						<ChevronRightIcon size={20} color='grey' />
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default SingleOrder
