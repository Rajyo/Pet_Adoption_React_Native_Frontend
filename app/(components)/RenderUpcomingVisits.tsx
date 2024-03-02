import { View, Text } from '@/components/Themed'
import { FontAwesome } from '@expo/vector-icons';
import React from 'react'
import { Image } from 'react-native';


function Icon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    size: number
}) {
    return <FontAwesome style={{ marginBottom: -3, }} {...props} />;
}

type renderUpcomingVisitsProps = {
    data: {
        id: number
        dateTime: string
        location: string
        name: string
        week: string
    }
}

const RenderUpcomingVisits = ({ data }: renderUpcomingVisitsProps) => {

    return (
        <View style={{ marginVertical: 20, marginRight: 12, display: "flex", width: 280, flexDirection: "row", borderRadius: 5, justifyContent: "space-between", padding: 10, shadowColor: 'gray', elevation: 10, shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.8, shadowRadius: 5, borderColor: "gray", borderWidth: 1, }}>
            <View style={{ gap: 10, marginVertical: 5 }}>
                <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <Icon name='calendar' color='gray' size={18} />
                    <Text style={{ opacity: 0.8, fontSize: 13, alignSelf: "center" }}>{data.dateTime}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <Icon name='location-arrow' color='gray' size={18} />
                    <Text style={{ opacity: 0.8, fontSize: 13, alignSelf: "center" }}>{data.location}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>{data.name}, </Text>
                    <Text style={{ fontSize: 13, fontWeight: "bold", alignSelf: "flex-end", paddingBottom: 2 }}>{data.week}</Text>
                </View>
            </View>
            <Image source={require('../../assets/images/slide1.jpg')} style={{ width: 100, height: 100 }} />
        </View>
    )
}

export default RenderUpcomingVisits