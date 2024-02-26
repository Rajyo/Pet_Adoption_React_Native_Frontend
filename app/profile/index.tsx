import { Text, View } from '@/components/Themed'
import { MyContext } from '@/providers/storageProvider';
import React, { useContext, useState } from 'react'
import { ActivityIndicator, Alert, Image, StyleSheet, TextInput } from 'react-native';
import { useEffect } from 'react';
import axios from 'axios';
import idToken from '@/components/getIdToken';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';


const Profile = () => {
  const { storeToken, storeId } = useContext(MyContext);
  const [isAdmin, setIsAdmin] = useState()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [updatedUsername, setUpdatedUsername] = useState('')
  const [updatedPassword, setUpdatedPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [updatedLoading, setUpdatedLoading] = useState(false)

  // console.log("storeToken", storeToken);
  // console.log("storeId", storeId);

  const token = storeToken == 'No Token' ? idToken().storeToken : storeToken

  loading && <ActivityIndicator />

  useEffect(() => {
    // @refresh reset
    const user = async () => {
      await axios.get('http://10.0.0.58:8000/api/user/', {
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
          setEmail(res.data.email)
          setUsername(res.data.username)
          setUpdatedUsername(res.data.username)
          setLoading(false)
        })
        .catch((error: any) => {
          console.log(error)
          setLoading(false)
        })
    }
    user()

  }, [token])



  const updateInfo = async () => {
    setLoading(true)

    type user = {
      username: string
      password: string
    }

    const updatedUser: user = { username, password: updatedPassword }

    if (updatedUsername == '') {
      Alert.alert("Username cannot be empty")
      setLoading(false)
      return
    }

    if (updatedUsername !== username) {
      updatedUser['username'] = updatedUsername
    }

    if (updatedPassword !== null && updatedPassword !== '') {
      if (updatedPassword.length < 6) {
        Alert.alert("Password must be more than 6 characters")
        setLoading(false)
        return
      }
      updatedUser["password"] = updatedPassword
    }

    const size = Object.keys(updatedUser).length
    // console.log(updatedUser);

    size > 0 && await axios.put('http://10.0.0.58:8000/api/user/', updatedUser, {
      headers: {
        Authorization: token
          ? "Bearer " + token
          : null,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })
      .then(res => {
        setUsername('')
        setUpdatedPassword('')
        // console.log(res.data)
        Alert.alert("User Updated")
        setUsername(res.data.username)
        setLoading(false)
      })
      .catch((error: any) => {
        console.log(error)
        setLoading(false)
      })
  }


  return (
    <View style={styles.container}>

      <View style={{ display: "flex", alignItems: "center", marginVertical: 10 }}>
        <Image source={require('../../assets/images/user.jpg')} style={styles.img} alt='cover'></Image>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
          {
            isAdmin ?
              <>
                <Text style={styles.isuser}>User</Text>
                <Text style={styles.isadmin}>Admin</Text>
              </>
              :
              <>
                <Text style={styles.isadmin}>User</Text>
                <Text style={styles.isuser}>Admin</Text>
              </>

          }
        </View>
      </View>

      <View>

      </View>
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        aria-disabled
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={updatedUsername}
        onChangeText={setUpdatedUsername}
        onChange={() => setUpdatedLoading(true)}
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={updatedPassword}
        onChangeText={setUpdatedPassword}
        onChange={() => setUpdatedLoading(true)}
        style={styles.input}
        secureTextEntry
      />

      <Button
        onPress={updateInfo}
        disabled={!updatedLoading}
        text={loading ? 'Updating info...' : 'Update info'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight: "100%"
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 170,
  },
  isuser: {
    backgroundColor: "blue",
    padding: 10,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    verticalAlign: "middle",
    opacity: 0.5
  },
  isadmin: {
    backgroundColor: "red",
    padding: 10,
    color: "white",
    fontSize: 18,
    textAlign: "center",
    verticalAlign: "middle",
    fontWeight: "800"
  },
  label: {
    color: 'gray',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 30,
    fontSize: 16
  },
});

export default Profile
