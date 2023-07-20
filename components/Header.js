import { View, Text, TouchableOpacity, Share } from "react-native"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
	ArrowLeftIcon,
	ArrowLeftOnRectangleIcon,
	ShareIcon,
} from "react-native-heroicons/outline"
import auth from "@react-native-firebase/auth"
import Toast from "react-native-root-toast"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

const Header = ({ navigation, title, share, logout, back }) => {
	const signOut = () => {
		auth()
			.signOut()
			.then(() => {
				navigation.replace("Login&SignUp")
				Toast.show("Logged Out!", {
					position: 150,
					backgroundColor: "black",
					textColor: "white",
					opacity: 1,
					duration: 1000,
				})
			})
	}
	const onShare = async () => {
		Share.share({
			message: `Order ${title} from SVNIT Canteen App. It's Awesome !`,
		})
	}
	return (
		<SafeAreaView className={`flex-row items-center px-5 pt-3`}>
			{back && (
				<TouchableOpacity
					onPress={() => {
						navigation.goBack()
					}}
				>
					<ArrowLeftIcon size={27} color='orange' />
				</TouchableOpacity>
			)}
			<Text className='flex-1 text-lg font-bold text-center'>
				{title}
			</Text>
			{share && (
				<TouchableOpacity onPress={onShare}>
					<ShareIcon size={25} color='orange' />
				</TouchableOpacity>
			)}
			{!share && !logout && (
				<TouchableOpacity>
					<ShareIcon size={25} color='transparent' />
				</TouchableOpacity>
			)}
			{logout && (
				<TouchableOpacity
					style={{
						shadowColor: "black",
						shadowOffset: {
							width: 0,
							height: 5,
						},
						shadowOpacity: 0.2,
						shadowRadius: 5.62,
						elevation: 7,
					}}
					className='flex-row p-2 items-center bg-orange-400 rounded-xl'
					onPress={async () => {
						signOut()
						await GoogleSignin.revokeAccess()
					}}
				>
					<ArrowLeftOnRectangleIcon size={15} color='white' />
					<View>
						<Text className='text-xs font-bold text-gray-200'>
							{" "}
							LogOut
						</Text>
					</View>
				</TouchableOpacity>
			)}
		</SafeAreaView>
	)
}

export default Header
