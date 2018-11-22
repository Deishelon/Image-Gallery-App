import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    Button,
    View,
    ActivityIndicator,
} from 'react-native';
import {Card, CardTitle, CardContent, CardAction, CardButton, CardImage} from 'react-native-material-cards'

import * as ApiConstants from '../api/Constants';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.getGalleryFromApiAsync()
    }

    apiData = [];
    currentItemPosition = 0;


    state = {
        apiResult: ApiConstants.apiResult.PROGRESS,
    };

    getGalleryFromApiAsync() {
        return fetch(ApiConstants.GALLERY_API)
            .then((response) => response.json())
            .then((responseJson) => {
                if (Array.isArray(responseJson)) {
                    this.apiData = responseJson;
                    this.setState({apiResult: ApiConstants.apiResult.OK});
                    console.log(`API data is here. Data size: ${responseJson.length}`)
                } else {
                    console.log(`API data is not valid`)
                    this.setState({apiResult: ApiConstants.apiResult.ERR});
                }
            }).catch((error) => {
                console.error(error);
                this.setState({apiResult: ApiConstants.apiResult.ERR});
            });
    }


    render() {
        if (this.state.apiResult === ApiConstants.apiResult.ERR) {
            return this._renderError()
        } else if (this.state.apiResult === ApiConstants.apiResult.OK) {
            return this._renderData()
        } else {
            return this._renderProgress()
        }
    }

    _renderProgress() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.primaryTextStyle}>Loading Images</Text>
                        <ActivityIndicator size="large" color="#03A9F4"/>
                    </View>

                </ScrollView>
            </View>
        );
    }

    _renderData() {
        let currentImageData = this.apiData[this.currentItemPosition];

        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.primaryTextStyle}>{`Filename: ${currentImageData.filename}`}</Text>
                    <Card>
                        <CardImage
                            source={{uri: ApiConstants.constructImageURL(currentImageData.width, currentImageData.height, currentImageData.id)}}
                            resizeMode={"cover"}

                        />
                    </Card>

                    <View style={styles.containerSpaceBetween}>
                        <Button
                            onPress={() => {
                                if (this._isPreviousExists()) {
                                    this._handlePreviousPress()
                                }
                            }}
                            title="Previous"
                            color={this._isPreviousExists() ? "#2196F3" : "grey"}
                            accessibilityLabel="Previous"
                        />

                        <Button
                            onPress={() => {
                                if (this._isNextExists()) {
                                    this._handleNextPress()
                                }
                            }}
                            title="Next"
                            color={this._isNextExists() ? "#2196F3" : "grey"}
                            accessibilityLabel="Next"
                        />

                    </View>

                    <Text style={styles.primaryTextStyle}>{`Author: ${currentImageData.author}`}</Text>
                    <Text
                        style={styles.primaryTextStyle}>{`Format: ${currentImageData.format} (${currentImageData.width} x ${currentImageData.height})`}</Text>

                </ScrollView>
            </View>
        );
    }

    _renderError() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.primaryTextStyle}>There was an error loading images</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }


    _isPreviousExists() {
        return this.currentItemPosition > 0
    }

    _isNextExists() {
        return this.currentItemPosition + 1 < this.apiData.length
    }

    _handleNextPress = () => {
        this.currentItemPosition++;
        console.log(`NextPress. Data position at: ${this.currentItemPosition} / ${this.apiData.length}`)
        this.setState({isLoadingComplete: true});
    };

    _handlePreviousPress = () => {
        this.currentItemPosition--;
        console.log(`PreviousPress. Data position at: ${this.currentItemPosition} / ${this.apiData.length}`)
        this.setState({isLoadingComplete: true});
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centeredContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    primaryTextStyle: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    containerSpaceBetween: {
        paddingLeft: 15,
        paddingEnd: 15,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
