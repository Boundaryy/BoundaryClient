import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { globalStyles } from '../../../styles/global';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const App = () => {
    const [selectedSession, situchooseetSelectedSession] = useState(null);
    const [situations, setSituations] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigation = useNavigation();


    useEffect(() => {
        const fetchSituations = async () => {
            try {
              const token = await AsyncStorage.getItem("accessToken");
              const response = await axios.get(
                `http://52.79.202.25:5001/situations`,
                {
                  headers: {
                    access_token: token,
                  },
                }
              );
              await console.log(response)
              await setSituations(response.data);
               
            } catch (error) {
              console.error(`상황 조회 실패:`, error);
            }
          };
          fetchSituations();
    }, []);

    const handleSessionPress = (index) => {
        situchooseetSelectedSession(index);
    };

    const handleNextButtonPress = async () => {
        await AsyncStorage.setItem("situationId", situations[selectedSession].situationId);
        await navigation.navigate('child/training/resolve'); 
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={[globalStyles.container, { minHeight: height }]}>
                <View style={globalStyles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('child/home') } style={styles.backButton}>
                        <Text style={styles.backText}>뒤로가기</Text>
                    </TouchableOpacity>
                    <Text style={globalStyles.subtitle}>상황 선택하기</Text>
                    <Text style={globalStyles.description}>
                        AI와 부모님이 만들어 준 상황을 선택해보세요.
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.session,
                            styles.centerButton,
                            selectedSession === 0 && styles.selectedSession
                        ]}
                        onPress={() => handleSessionPress(0)}
                    >
                        <Image
                            source={{ uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Family%20Man%2C%20Woman%2C%20Girl%2C%20Boy.png" }}
                            style={styles.buttonImage}
                        />
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonTitle} numberOfLines={1} ellipsizeMode="tail">친구들이 놀릴 때 대처하기</Text>
                            <Text style={styles.buttonExplain}>부모님픽!</Text>
                        </View>
                    </TouchableOpacity>

                    {situations.map((situation, index) => (
                        <TouchableOpacity
                            key={situation.situationId}
                            style={[
                                styles.session,
                                styles.centerButton,
                                selectedSession === index + 1 && styles.selectedSession // Update condition to match the correct index
                            ]}
                            onPress={() => handleSessionPress(index + 1)}
                        >
                            <Image
                                source={{ uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" }}
                                style={styles.buttonImage}
                            />
                            <View style={styles.buttonTextContainer}>
                                <Text style={styles.buttonTitle} numberOfLines={1} ellipsizeMode="tail">{situation.content}</Text>
                                <Text style={styles.buttonExplain}>일반 생성</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={handleNextButtonPress}>
                    <Text style={styles.nextButtonText}>선택하기</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        marginBottom: 10,
    },
    backText: {
        fontSize: 18,
        color: '#808080',
    },
    session: {
        backgroundColor: "#F3F4F6",
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'transparent',
        padding: 12,
        marginBottom: 10, // Add space between buttons
    },
    selectedSession: {
        borderColor: '#A5B3FF',
    },
    buttonContainer: {
        flexDirection: 'column',
        width: "100%",
        alignItems: 'center',
    },
    buttonImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    buttonTextContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    buttonTitle: {
        fontSize: 14,
        fontWeight: "900",
    },
    buttonExplain: {
        color: '#808080',
        fontSize: 12,
    },
    nextButton: {
        backgroundColor: '#5772FF',
        width: width * 0.85,
        height: 50,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    centerButton: {
        width: '85%', // Match the width of the next button
    },
});

export default App;
