import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';

export function InviteFriendsScreen() {
    const dataList = [{
        name: 'stephanie',
        email: 'stephanie@liba.se'
    }, {
        name: 'Daniel',
        email: 'daniel@telia.se'
    }, {
        name: 'Criko',
        email: 'criko@liba.se'
    },{
        name: 'Rola',
        email: 'rola@liba.se'
    },{
        name: 'Salem',
        email: 'salem@liba.se'
    }];

    const [searchQuery, setSearchQuery] = useState('');
    const [friendsList, setFriendsList] = useState(dataList);

    const filteredFriends = friendsList.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedFriends = filteredFriends.sort((a, b) => a.name.localeCompare(b.name));


    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState([]);
    const [selectedFriendNames, setSelectedFriendNames] = useState([]);
  
    useEffect(() => {
      async function fetchFriends() {
        try {
          const users = await http.getUser();
          setFriends(users);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      }
  
      fetchFriends();
    }, []);
  
    const data = Object.keys(friends).map(key => ({ id: key, ...friends[key] }));
    const filteredData = data.filter(item =>
      item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Invite Friends</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search friends by name or email"
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
            />
            <FlatList
                data={sortedFriends}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.email}
                renderItem={({ item }) => (
                    <View style={styles.friendContainer}>
                        <View style={styles.friendBox}>
                      </View>
                        <Text style={styles.friendEmail}>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3EFE7',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#456268',
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    friendContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        margin: 10,
    },
    friendBox: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#456268',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        
    },
    friendName: {
        color: 'white',
        fontWeight: 'bold',
    },
    friendEmail: {
        color: '#456268',
    },
});

export default InviteFriendsScreen;
