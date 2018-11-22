import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import {AppLoading, Asset, Font, Icon, WebBrowser} from 'expo';

import {Toolbar} from 'react-native-material-ui';

import {Card, CardTitle, CardContent, CardAction, CardButton, CardImage} from 'react-native-material-cards'


export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.getGalleryFromApiAsync()

    }

    apiData = []
    currentItemPosition = 0

    state = {
        isLoadingComplete: false,
    };


    getGalleryFromApiAsync() {
        return fetch('https://picsum.photos/list')
            .then((response) => response.json())
            .then((responseJson) => {
                this.apiData = responseJson
                this.setState({isLoadingComplete: true});
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {
        if (!this.state.isLoadingComplete) {
            return (
                <View style={styles.container}>
                    <Toolbar
                        leftElement="menu"
                        centerElement="Image Gallery App"
                    />
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.getStartedText}>Loading Images</Text>
                            <ActivityIndicator size="large" color="#03A9F4"/>
                        </View>
                    </ScrollView>
                </View>
            );
        } else {
            let currentImageData = this.apiData[this.currentItemPosition];

            return (
                <View style={styles.container}>
                    <Toolbar
                        leftElement="menu"
                        centerElement="Image Gallery App"
                        rightElement={{
                            menu: {
                                icon: "more-vert",
                                labels: []
                            }
                        }}
                        onRightElementPress={(label) => {
                            console.log(label)
                        }}
                    />
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                        <Card>
                            <CardImage
                                source={{uri: this._constructImageURL(currentImageData.width, currentImageData.height, currentImageData.id)}}
                                resizeMode={"cover"}

                            />
                            <CardAction
                                separator={true}
                                inColumn={false}>
                                <CardButton
                                    onPress={() => {
                                        if (this._isPreviousExists()) {
                                            this._handlePreviousPress()
                                        }
                                    }}
                                    title="Previous"
                                    color={this._isPreviousExists() ? "blue" : "grey"}
                                />
                                <CardButton
                                    onPress={() => {
                                        if (this._isNextExists()) {
                                            this._handleNextPress()
                                        }
                                    }}
                                    title="Next"
                                    color={this._isNextExists() ? "blue" : "grey"}
                                />
                            </CardAction>

                            <CardContent text={`Author: ${currentImageData.author}`}/>
                            <CardContent
                                text={`Format: ${currentImageData.format} (${currentImageData.width} x ${currentImageData.height})`}/>
                        </Card>

                    </ScrollView>
                </View>
            );
        }

    }

    _constructImageURL(width, height, id) {
        return `https://picsum.photos/${width}/${height}?image=${id}`
    }

    _isPreviousExists() {
        return this.currentItemPosition > 0
    }

    _isNextExists() {
        return this.currentItemPosition + 1 < this.apiData.length
    }

    _handleNextPress = () => {
        this.currentItemPosition++
        this.setState({isLoadingComplete: true});
    };

    _handlePreviousPress = () => {
        this.currentItemPosition--
        this.setState({isLoadingComplete: true});
    };

    _maybeRenderDevelopmentModeWarning() {
        if (__DEV__) {
            const learnMoreButton = (
                <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
                    Learn more
                </Text>
            );

            return (
                <Text style={styles.developmentModeText}>
                    Development mode is enabled, your app will be slower but you can use useful development
                    tools. {learnMoreButton}
                </Text>
            );
        } else {
            return (
                <Text style={styles.developmentModeText}>
                    You are not in development mode, your app will run at full speed.
                </Text>
            );
        }
    }

    _handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
    };

    _handleHelpPress = () => {
        WebBrowser.openBrowserAsync(
            'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
