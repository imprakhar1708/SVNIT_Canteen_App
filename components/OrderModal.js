import { Text, Pressable } from "react-native"
import React from "react"
import {
	ArrowPathIcon,
	ArrowRightIcon,
	CheckBadgeIcon,
	XCircleIcon,
} from "react-native-heroicons/solid"

const OrderModal = ({ status }) => {
	const orderStatus = [
		{
			status: true,
			subtitle:
				"Your Order Was Placed Succesfully. For More details Check Order History Section Under Profile Section",
			title: "Order Placed!",
		},
		{
			status: false,
			subtitle:
				"Something went Wrong while Placing Your Order, either from Our Side or Yours. Try Again !",
			title: "Opps!",
		},
	]
	return (
		<>
			{status === true ? (
				<CheckBadgeIcon size={100} fill='white' />
			) : (
				<XCircleIcon size={100} fill='white' />
			)}
			<Text className='text-center text-3xl font-extrabold text-white'>
				{status === true ? orderStatus[0].title : orderStatus[1].title}
			</Text>
			<Text className='text-center px-16 pb-3 my-2 font-bold text-gray-100'>
				{status === true
					? orderStatus[0].subtitle
					: orderStatus[1].subtitle}
			</Text>
		</>
	)
}

export default OrderModal
