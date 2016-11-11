import React, {PropTypes} from 'react';
import {checkEmail} from '../../utils/helpers'
import Icon from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Meteor from 'react-native-meteor';
import * as CONST from '../../utils/constants';

import {
  Text,
  Image,
  NavigationExperimental,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet
} from 'react-native';
const {
  PropTypes: NavigationPropTypes
} = NavigationExperimental;

const windowSize = Dimensions.get('window');

const LoginView = React.createClass({
  propTypes: {
    onUserLoginError: PropTypes.func.isRequired,
    onUserLoginSuccess: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },

  login() {
    if (!checkEmail(this.state.username)){
      console.warn("Invalid Email");
      return false;
    }
    Meteor.loginWithPassword(this.state.username,
      this.state.password,(error) => {
      if (error) {
        this.props.onUserLoginError();
        console.warn(error.reason);
      }else {
        // console.log(Meteor.authToken);
        // this.props.onUserLoginSuccess({userId:Meteor.userId()},"TODO: remove token");
        this.props.switchTab(0);
      }
    });
    return fetch(CONST.API_LOGIN, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: this.state.password,
          user: this.state.username,
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status=='success'){
            this.props.onUserLoginSuccess({userId:responseJson.data.userId},responseJson.data.authToken);
            this.props.switchTab(0);
          }else {
            this.props.onUserLoginError();
          }
        })
        .catch((error) => {
          console.error(error);
      });
  },
  onTypingUsername(username) {
    this.setState({username : username.text});
  },
  onTypingPassword(pwd) {
    this.setState({password : pwd.text});
  },
  render: function() {
    return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={styles.header}>
                <Image style={styles.mark} source={{uri: 'http://i.imgur.com/da4G0Io.png'}} />
            </View>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
                    <TextInput
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Email"
                        placeholderTextColor="#FFF"
                        autoCapitalize="none"
                        returnKeyType="next"
                        onChangeText={(text)=>(this.onTypingUsername({text}))}
                        value={this.state.username}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                    <TextInput
                        password={true}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Password"
                        placeholderTextColor="#FFF"
                        onChangeText={(text)=>(this.onTypingPassword({text}))}
                        value={this.state.password}
                        onSubmitEditing={this.login}
                    />
                </View>
                <View style={styles.forgotContainer}>
                    <Text style={styles.greyFont}>Forgot Password</Text>
                </View>
            </View>
            <TouchableOpacity onPress={this.login} style={styles.signin}>
                <Text style={styles.whiteFont}>Sign In</Text>
            </TouchableOpacity>
            <View style={styles.signup}>
                <Text style={styles.greyFont}>Don't have an account?<Text style={styles.whiteFont}>  Sign Up</Text></Text>
            </View>
            <KeyboardSpacer/>
        </View>
    );
  }
});

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .5,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center'
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21
    },
    inputUsername: {
      marginLeft: 15,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 14
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
})

export default LoginView;
