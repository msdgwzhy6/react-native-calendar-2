/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午12:06
 *
 */
 
import { AsyncStorage } from 'react-native'

const PUNCH_TASK = 'PUNCH_TASK'

export const punchHelper = {
  createNewTask: (task) => {
    return AsyncStorage.setItem(PUNCH_TASK,JSON.stringify(task))
      .then((result) => {

      })
      .catch((error) => {

      })
  }
}