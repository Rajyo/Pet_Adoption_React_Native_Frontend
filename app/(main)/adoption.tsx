import { Icon } from '@/app/(main)/explore';
import { View, Text } from '@/components/Themed'
import idToken from '@/components/getIdToken';
import { MyContext } from '@/providers/storageProvider';
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image } from 'react-native';
import {BACKEND_URL} from '@env'


const Adoption = () => {
  const [data, setData] = useState<UserType | null>(null)
  const { storeToken, storeId } = useContext(MyContext);
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const token = storeToken == 'No Token' ? idToken().storeToken : storeToken

  const adoptionStatus = async () => {
    await axios.get(`${BACKEND_URL}/user/`, {
      headers: {
        Authorization: token
          ? "Bearer " + token
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })
      .then((res: any) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  useEffect(() => {
    adoptionStatus()

  }, [token])

  const renderItem = ({item}: {item: PetAdoption}) => {
    return (
      <View key={item._id} style={{ paddingTop: 10, marginVertical: 15, borderColor: "#cccccc", borderWidth: 1, borderRadius: 10, shadowColor: "#cccccc", shadowOffset: { width: 5, height: 5 }, shadowRadius: 5, shadowOpacity: 0.8, gap: 10 }}>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingHorizontal:10,}}>
                <View style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>{item.petName}</Text>
                  <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>{item.petBreed}</Text>
                  <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>{item.petGender}</Text>
                    <Icon name='circle' color='gray' size={5}></Icon>
                    <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>{Number(item.petAgeInWeeks)} weeks old</Text>
                  </View>
                </View>
                <Image source={{ uri: item.petPic }} style={{ width: 80, height: 80, borderRadius: 10 }} />
              </View>

              <View style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", gap:10, backgroundColor:"rgb(220,220,220)", borderBottomLeftRadius:10, borderBottomRightRadius:10, padding:5}}>
                <Text style={{ color: "black", fontWeight: "600", fontSize: 13 }}>Adoption Date: </Text>
                <Text style={{ fontWeight: "bold", fontSize: 15, color:"blue" }}>{item.adoptionDate}</Text>
              </View>
            </View>
    )
  }

  const handleRefresh = () => {
    setRefreshing(true)
    adoptionStatus()
    setRefreshing(false)
  }

  return (
    <View style={{ minHeight: "100%", paddingHorizontal: 20, margin:10, }}>
      {
        data && data?.petAdoptionId.length > 0
          ? <FlatList 
              data={data.petAdoptionId}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />

          : <View style={{ display: "flex", alignItems: "center", width: "100%", gap: 50, paddingVertical: 40, }}>
            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", textTransform: 'uppercase', color: "red" }}>You are yet to make an adoption.</Text>
            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", textTransform: 'uppercase', color: "red" }}>Please choose a pet for adoption.</Text>
          </View>
      }
    </View>
  )
}

export default Adoption