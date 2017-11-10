/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/20
 * Time: 上午9:56
 *
 */

import React, { Component, PropTypes } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native'

const defaultCount = 10

export default class Dropdown extends Component {
  static defaultProps = {
    disabled: false,
    defaultIndex: -1,
    defaultValue: 'select',
    options: null,
    animated: true,
    showsVerticalScrollIndicator: true,
    keyboardShouldPersistTaps: 'never'
  }

  constructor (props) {
    super(props)

    this._button = null
    this._buttonFrame = null
    this._listView = null
    this._nextValue = null
    this._nextIndex = null
    this._dropdownHeight = 0
    this._dropdownItemHeight = 20

    if(props.dropdownItemStyle&&props.dropdownItemStyle.height){
      this._dropdownItemHeight = props.dropdownItemStyle.height
    }

    let options = props.options
    let buttonText =(props.value||props.defaultValue).toString()
    let selectedIndex = props.index||props.defaultIndex

    //在没有传递index的情况下，通过value遍历判断位置
    if(selectedIndex>=0 && options&&buttonText){
      for (let i = 0; i < options.length; i++) {
        if(options[i] === (props.value||props.defaultValue)){
          selectedIndex = i
          break
        }
      }
    }

    this.state = {
      disabled: props.disabled,
      accessible: !!props.accessible,
      loading: props.options === null || props.options === undefined,
      showDropdown: false,
      autoScroll: false,
      buttonText,
      selectedIndex
    }
  }

  componentWillReceiveProps (nextProps) {
    let buttonText = !this._nextValue ? this.state.buttonText : this._nextValue.toString()
    let selectedIndex = !this._nextIndex ? this.state.selectedIndex : this._nextIndex
    if (selectedIndex < 0) {
      selectedIndex = nextProps.index = nextProps.defaultIndex
      if (selectedIndex < 0) {
        buttonText = (nextProps.value||nextProps.defaultValue).toString()
      }else if(selectedIndex >= 0){
        buttonText = nextProps.options[selectedIndex].toString()||buttonText
      }
      if(buttonText){
        for (let i = 0; i < nextProps.options.length; i++) {
          if(nextProps.options[i].toString() === (nextProps.value||nextProps.defaultValue)){
            selectedIndex = i
            break
          }
        }
      }
    }
    //如果value或者index不为空的话，以props中的值为准,index优先级高
    if(nextProps.index){
      selectedIndex = nextProps.index
      buttonText = nextProps.options[selectedIndex]
    }else if(nextProps.value){
      buttonText = nextProps.value.toString()
      for (let i = 0; i < nextProps.options.length; i++) {
        if(nextProps.options[i] === nextProps.value){
          selectedIndex = i
          break
        }
      }
    }
    this._nextValue = null
    this._nextIndex = null

    this.setState({
      disabled: nextProps.disabled,
      loading: !nextProps.options||nextProps.options.length===0,
      buttonText: buttonText,
      selectedIndex: selectedIndex
    })
  }

  //更新位置
  _updatePosition (callback) {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = { x: px, y: py, w: width, h: height }
        callback && callback()
      })
    }
  }

  //显示列表
  show () {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true,
        autoScroll: true
      })
    })
  }

  //隐藏列表
  hide () {
    this.setState({
      showDropdown: false
    })
  }

  //按钮点击
  _onButtonPress () {
    this.show()
  }

  render () {
    return (
      <View style={styles.container}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    )
  }

  _renderButton () {
    return (
      <TouchableOpacity ref={button => this._button = button}
                        disabled={this.props.disabled}
                        accessible={this.props.accessible}
                        onPress={this._onButtonPress.bind(this)}>
        <View style={[styles.button,this.props.style]}>
          <Text style={styles.buttonText}
                numberOfLines={1}>
            {this.state.buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderItem ({ item, index }) {
    let { dropdownItemStyle, dropdownTextStyle, dropdownTextHighlightStyle } = this.props
    let highlighted = index === this.state.selectedIndex
    return <TouchableOpacity
      style={[styles.row, {height:this._dropdownItemHeight}, dropdownItemStyle]}
      onPress={() => {this._onItemPress.apply(this, [item.value, index])}}
      key={index}>
      <Text style={[
        styles.rowText,
        dropdownTextStyle,
        highlighted && styles.highlightedRowText,
        highlighted && dropdownTextHighlightStyle
      ]}>
        {item.value.toString()}
      </Text>
    </TouchableOpacity>
  }

  _onItemPress (value, index) {
    if (!this.props.onSelect || this.props.onSelect(value) !== false) {
      this._nextValue = value
      this._nextIndex = index
      this.setState({
        buttonText: value,
        selectedIndex: index
      })
    }
    this.hide()
  }

  _scrollToIndex () {
   setTimeout((() => {
     let itemCount = this.props.options.length
     let offset =0
     if( this._dropdownItemHeight * (this.state.selectedIndex) > this._dropdownItemHeight * itemCount - this._dropdownHeight){
       offset =  this._dropdownItemHeight * itemCount - this._dropdownHeight
     }else if( this.state.selectedIndex>0) {
       offset = this._dropdownItemHeight * (this.state.selectedIndex)
     }
     this._listView.scrollToOffset({
       animated: false,
       offset
     })
   }).bind(this),100)
  }

  _renderEmpty() {
    return (
     <View style={{backgroundColor:'red'}}>
       <Text>
         无选项
       </Text>
     </View>
    );
  }

  _renderDropdown () {
    let dataSource = this.props.options.map((item, index) => {
      return { key: index, value:item }
    })
    return <FlatList
      ref={(ref) => {this._listView = ref}}
      getItemLayout={(data, index) => ({
        length: 30,
        index,
      })}
      onLayout={() => this._scrollToIndex()}
      initialNumToRender={this.props.options.length}
      style={styles.list}
      automaticallyAdjustContentInsets={false}
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps='always'
      data={dataSource}
      renderItem={this._renderItem.bind(this)}
    />
  }

  _renderModal () {
    if (this.state.showDropdown && this._buttonFrame) {
      let frameStyle = this._calcPosition()
      let animationType = this.props.animated ? 'fade' : 'none'
      if(this.props.options.length < defaultCount){
        frameStyle.height = this._dropdownItemHeight * this.props.options.length
      }else {
        frameStyle.height = this._dropdownItemHeight * defaultCount
      }
      return (
        <Modal animationType={animationType}
               visible={true}
               transparent={true}
               onRequestClose={this._onModalClose.bind(this)}
               supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
          <TouchableWithoutFeedback accessible={this.props.accessible}
                                    disabled={!this.state.showDropdown}
                                    onPress={this._onModalClose.bind(this)}>
            <View style={styles.modal}>
              <View
                onLayout = {(e) => {this._dropdownHeight = e.nativeEvent.layout.height}}
                style={[styles.dropdown, this.props.dropdownStyle, frameStyle]}>
                {this.state.loading ? this._renderEmpty() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )
    }
  }

  //Modal 关闭
  _onModalClose () {
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.hide()
    }
  }

  //Modal 自动调节位置
  _calcPosition () {
    let dimensions = Dimensions.get('window');
    let windowWidth = dimensions.width;
    let windowHeight = dimensions.height;

    let dropdownHeight = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).height)||
      StyleSheet.flatten(styles.dropdown).height;

    let bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    let rightSpace = windowWidth - this._buttonFrame.x;
    let showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    let showInLeft = rightSpace >= this._buttonFrame.x;

    let style = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      style.left = this._buttonFrame.x;
    } else {
      let dropdownWidth = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).width) ||
        (this.props.style && StyleSheet.flatten(this.props.style).width) || -1;
      if (dropdownWidth !== -1) {
        style.width = dropdownWidth;
      }
      style.right = rightSpace - this._buttonFrame.w;
    }

    if (this.props.adjustFrame) {
      style = this.props.adjustFrame(style) || style;
    }

    return style;
  }
}

const styles = StyleSheet.create({
  container:{
    alignItems:'center',
    justifyContent:'center'
  },
  button: {
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 4,
    padding: 4
  },
  buttonText: {
    fontSize: 12,
    color: 'white'
  },
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loading: {
    alignSelf: 'center'
  },
  list: {
    //flexGrow: 1,
    width:'100%'
  },
  row:{
    justifyContent:'center',
    alignItems:'center',
  },
  rowText: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 11,
    backgroundColor: 'white',
    color: 'navy',
    textAlignVertical: 'center',
    textAlign:'center'
  },
  highlightedRowText: {
    color: 'green'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray'
  }
})

Dropdown.propTypes = {
  disabled: PropTypes.bool,//是否禁用
  defaultIndex: PropTypes.number,//默认选中的位置
  defaultValue: PropTypes.any,//默认选中的值
  index: PropTypes.number,//选中的位置(如果需要控制位置)
  value: PropTypes.any,//选中的值(如果需要控制值)
  options: PropTypes.array,//可选值的数组

  accessible: PropTypes.bool,//View低阶组件的属性，表示该元素是否可被访问
  animated: PropTypes.bool,//是否显示动画
  showsVerticalScrollIndicator: PropTypes.bool,//是否显示垂直滚动条
  keyboardShouldPersistTaps: PropTypes.string,//ScrollView低阶组件属性，当此属性为false的时候，在软键盘激活之后，点击焦点文本输入框以外的地方，键盘就会隐藏。

  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownItemStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

  adjustFrame: PropTypes.func,
  renderRow: PropTypes.func,
  renderSeparator: PropTypes.func,

  onDropdownWillShow: PropTypes.func,
  onDropdownWillHide: PropTypes.func,
  onSelect: PropTypes.func  //回调方法() 表示选择了新的值
}