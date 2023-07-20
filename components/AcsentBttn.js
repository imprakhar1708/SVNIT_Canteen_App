import { View, Text, TouchableOpacity } from "react-native"
import React from "react"

const AcsentBttn = ({ title, fn }) => {
	return (
		<TouchableOpacity
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
			onPress={fn}
			className='py-5 justify-center items-center px-10 rounded-2xl bg-orange-400'
		>
			<Text className='text-white font-extrabold'>{title}</Text>
		</TouchableOpacity>
	)
}

export default AcsentBttn
