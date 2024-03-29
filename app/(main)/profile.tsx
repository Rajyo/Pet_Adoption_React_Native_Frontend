import { ActivityIndicator, FlatList, Image, Pressable } from 'react-native'
import { Text, View } from '@/components/Themed'
import React, { useContext, useState, useEffect } from 'react'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { profileData } from '@/lib/profileData'
import { FontAwesome } from '@expo/vector-icons'
import { Link } from 'expo-router'
import RenderProfileData from '@/app/(components)/(profile)/RenderProfileData'
import idToken from '@/components/getIdToken'
import { MyContext } from '@/providers/storageProvider'
import axios from 'axios'
import {BACKEND_URL} from '@env'
import { Icon } from './explore'


const Profile = () => {
  const colorScheme = useColorScheme()

  const { storeToken, storeId } = useContext(MyContext);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [updatedName, setUpdatedName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // console.log("storeToken", storeToken);
  // console.log("storeId", storeId);
  //console.log(Dimensions.get('window').width);

  const token = storeToken == 'No Token' ? idToken().storeToken : storeToken

  loading && <ActivityIndicator />

  useEffect(() => {
    // @refresh reset
    setLoading(true)
    const user = async () => {
      await axios.get(`${BACKEND_URL}/user/`, {
        headers: {
          Authorization: token
            ? "Bearer " + token
            : null,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
        .then(res => {
          // console.log(res.data);
          setIsAdmin(res.data.isAdmin)
          setUsername(res.data.username)
          setName(res.data.name)
          setEmail(res.data.email)
          setUpdatedName(res.data.name)
          setLoading(false)
        })
        .catch((error: any) => {
          console.log(error)
          setLoading(false)
        })
    }
    user()

  }, [token])


  return (
    <View style={{ minHeight: "100%" }}>

      <View style={{ display: "flex", flexDirection: "row", paddingVertical: 20, paddingHorizontal: 20, justifyContent: "space-between" }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image source={require('../../assets/images/user.jpg')} style={{ width: 70, height: 70, borderRadius: 50 }} />
          <View style={{ marginVertical: "auto", marginLeft: 20, gap: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>{name}</Text>
            <Text style={{ fontSize: 17, opacity: 0.5, fontWeight: "700" }}>@{username}</Text>
          </View>
        </View>
        <View style={{ marginVertical: 10 }} >
          <Link href={{ pathname: '/(components)/(profile)/editProfile', params: { iA: isAdmin.toString(), un: username, eM: email, nm: name, uN: updatedName } }} >
            <Icon name='edit' color="#fdaa48" size={30} />
          </Link>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: Colors[colorScheme ?? 'light'].text,
          borderBottomWidth: 0.2,
          margin: 20
        }}
      />

      <FlatList
        data={profileData}
        renderItem={({ item }) => <RenderProfileData data={item} />}
        contentContainerStyle={{ gap: 45, marginTop: 10, paddingHorizontal: 20 }}
      />


    </View>
  )
}

export default Profile
