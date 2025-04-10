import moment from 'moment';
import React from 'react';
import { Modal, View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const FullViewModal = ({ visible, onClose, subposts }: {
    visible: boolean;
    onClose: () => void;
    subposts: any[];
}) => {
    console.log(subposts);

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <AntDesign name="close" size={30} color="#fff" />
                </TouchableOpacity>

                <FlatList
                    data={subposts}
                    horizontal
                    pagingEnabled
                    keyExtractor={(item, index) => `${item.fileS3Id}-${index}`}
                    renderItem={({ item }) => (
                        <View style={styles.mediaContainer}>
                            <View style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}>
                                {item.category === 'videos' ? (
                                    <Video
                                        source={{ uri: item.imageUrl }}
                                        style={styles.media}
                                        controls
                                        resizeMode="contain"
                                    />
                                ) : ['images', 'panorama', 'renderings', 'files', 'sidebyside'].includes(item.category) ? (
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={styles.media}
                                        resizeMode="contain"
                                    />
                                ) :
                                    (<View style={{ flex: 1 }}>
                                        <Text style={styles.description}>{item.fileName}</Text>
                                    </View>)}
                            </View>
                            <View>
                                <Text style={styles.meta}>File Name : {item.fileName}</Text>
                                <Text style={styles.meta}>CreateAt  : {moment(item.createdAt).format('DD-MM-YYYY hh:mm:ss')}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
        padding: 5,
    },
    mediaContainer: {
        width: width,
        height: height
    },
    media: {
        width: width,
        height: 400,
    },
    meta: {
        color: '#000',
        fontSize: 12,
        textAlign: 'left',
        marginTop: 10,
    },
    description: { fontWeight: '500', marginTop: 5 },
});

export default FullViewModal;
