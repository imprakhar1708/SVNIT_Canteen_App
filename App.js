import { NavigationContainer } from "@react-navigation/native"
import { Modal, View, Text, Pressable } from "react-native"
import MasterNav from "./nav/MasterNav"
import { StatusBar } from "expo-status-bar"
import { RootSiblingParent } from "react-native-root-siblings"
import { useEffect, useState } from "react"
import {
	ArrowPathIcon,
	ExclamationCircleIcon,
} from "react-native-heroicons/solid"
import NetInfo from "@react-native-community/netinfo"

export default function App() {
	const [modalVisible, setModalVisible] = useState(false)
	useEffect(() => {
		const removeNetInfo = NetInfo.addEventListener((net) => {
			const offline = !(net.isConnected && net.isInternetReachable)
			setModalVisible(offline)
		})

		return () => removeNetInfo
	}, [])

	return (
		<NavigationContainer>
			<RootSiblingParent>
				<Modal
					animationType='slide'
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible)
					}}
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
						<View className='items-center justify-center py-5 px-11 bg-red-500 rounded-3xl'>
							<ExclamationCircleIcon size={100} fill='white' />
							<Text className='text-center text-3xl font-extrabold text-white'>
								Connection Error
							</Text>
							<Text className='text-center w-52 border-b-[0.8px] border-gray-400 px-3 pt-3 pb-5 my-2 font-bold text-gray-100'>
								Opps! Looks like Your Device is Not Connected to
								the Internet.
							</Text>
							<Pressable className='flex-row justify-center items-center gap-x-1 px-4 py-3 bg-black rounded-2xl'>
								<ArrowPathIcon size={15} color='white' />
								<Text className='text-center text-white font-bold'>
									Try Again
								</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
				{!modalVisible && <MasterNav />}
				<StatusBar style='dark' />
			</RootSiblingParent>
		</NavigationContainer>
	)
}
