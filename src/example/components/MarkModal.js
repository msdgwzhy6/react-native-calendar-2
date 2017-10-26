/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 上午10:33
 *
 */

import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Button,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native'
import { PAGE_WIDTH } from '../../Calendar/constants/index'

export default class MarkModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  show () {
    this.setState({
      visible: true
    })
  }

  close () {
    this.setState({
      visible: false
    })
  }

  onSubmit () {
  }

  render () {
    let { title = '备注' } = this.props
    return <Modal
      animationType={'fade'}
      transparent={true}
      visible={this.state.visible}
      onRequestClose={() => {alert('Modal has been closed.')}}
    >
      <TouchableWithoutFeedback
        onPress={() => this.close()}
        style={{ flex: 1 }}>

        <View style={styles.container}>

          <TouchableWithoutFeedback>
            <View style={styles.dialogContainer}>
              <Text style={styles.title}>{title}</Text>
              <TextInput
                multiline
                style={styles.input}
              />
              <Button
                style={styles.button}
                title='确定'
                onPress={this.onSubmit.bind(this)} />
            </View>
          </TouchableWithoutFeedback>

        </View>

      </TouchableWithoutFeedback>
    </Modal>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  dialogContainer: {
    width: PAGE_WIDTH - 48,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 16
  },
  title: {
    fontSize: 15,
    marginBottom: 4
  },
  input: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth || 1,
    borderColor: 'gray',
    padding: 4,
    fontSize: 12,
  },
  button: {}
})

MarkModal.propTypes = {}