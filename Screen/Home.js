import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = () => {

    const Flicker_Url = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s"

    const [images, setimages] = useState([])


    const offlineFetching = async () => {
        const storedimages = await AsyncStorage.getItem("Last_Fetched_Images")
        if (storedimages) {
            setimages(JSON.parse(storedimages))

        }

    }

    const fetchImages = async () => {


        try {

                const result = await fetch(Flicker_Url)
        const data = await result.json()

        const actualphotos = data.photos.photo


        const storedimages = await AsyncStorage.getItem("Last_Fetched_Images")
        const alreadystored = storedimages ? JSON.parse(storedimages) : []

        if (JSON.stringify(actualphotos) !== JSON.stringify(alreadystored)) {

            setimages(actualphotos)
            await AsyncStorage.setItem("Last_Fetched_Images", JSON.stringify(actualphotos))
        }
            
        } catch (error) {
            console.error("user is offline")
            
        }

    



    }

    useEffect(() => {
        offlineFetching()
        fetchImages()
    }, [])

    return (
        <FlatList
            data={images}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
                <Image
                    source={{ uri: item.url_s }}
                    style={{ width: "45%", height: 100, margin: "3%" }}
                ></Image>
            )}
        >

        </FlatList>
    )
}

export default Home