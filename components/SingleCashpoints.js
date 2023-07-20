import { View, Text, TouchableOpacity } from "react-native"
import React, { useState } from "react"
import {
	InformationCircleIcon,
	MinusCircleIcon,
	PlusCircleIcon,
} from "react-native-heroicons/solid"
import { BanknotesIcon } from "react-native-heroicons/outline"
import moment from "moment/moment"

const SingleCashpoints = ({ item }) => {
	const [open, setopen] = useState(false)
	return (
		<View
			style={{
				shadowColor: "#000000",
				shadowOffset: {
					width: 0,
					height: 1,
				},
				shadowOpacity: 0.16,
				shadowRadius: 1.51,
				elevation: 2,
			}}
			className='px-5 mx-1 py-2 border-[0.8px] items-center border-gray-200 bg-gray-100 rounded-2xl flex-row justify-between'
		>
			<View className='flex-row items-center gap-x-3'>
				{item.action === "add" ? (
					<View className='bg-green-100 rounded-full p-1'>
						<PlusCircleIcon size={25} color='green' />
					</View>
				) : (
					<View className='bg-red-100 rounded-full p-1'>
						<MinusCircleIcon size={25} color='red' />
					</View>
				)}
				<View>
					<View className='flex-row items-center gap-x-1'>
						<Text className='text-sm text-gray-700 font-bold '>
							{item.title}
						</Text>
					</View>

					<View className='flex-row items-center'>
						{item?.id && (
							<TouchableOpacity
								onPress={() => {
									setopen((prev) => !prev)
								}}
								className='flex-row'
							>
								<InformationCircleIcon
									size={13}
									color='black'
								/>
								<Text className='text-xs'> </Text>
								{open && (
									<View className='absolute top-4 left-[2.5px] px-2 bg-white border-[0.8px] border-gray-300'>
										<Text className='text-[10px] font-bold text-gray-400'>
											Order Id : {item?.id}
										</Text>
										<View className='absolute -top-1 w-0 h-0 border-b-4 border-b-black border-r-4 border-r-transparent border-l-4 border-l-transparent' />
									</View>
								)}
							</TouchableOpacity>
						)}
						<Text className='text-[10px] font-bold text-gray-400'>
							{item?.type + " "}
							&#11825; {moment(item.date).format(
								"DD MMM YYYY"
							)}{" "}
							&#11825; {moment(item.date).format("h:mm A")}
						</Text>
					</View>
				</View>
			</View>
			<View className='items-center flex-row rounded-lg justify-center'>
				<Text className='text-gray-600 font-black'>
					{item.action === "add" ? "+" : "-"} {item.amount}{" "}
				</Text>
				<BanknotesIcon size={15} color='green' />
			</View>
		</View>
	)
}

export default SingleCashpoints
