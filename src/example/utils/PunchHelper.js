/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午12:06
 *
 */
 
import { AsyncStorage } from 'react-native'
import { PunchRule, PunchTask } from '../bean'
import { copyBean } from './Utils'

const PUNCH_TASK = 'PUNCH_TASK'
const PUNCH_TASK_IDS = 'PUNCH_TASK_IDS'

export const punchHelper = {
  createNewTask: (task) => {
    return AsyncStorage.setItem(PUNCH_TASK+'_'+task.id,JSON.stringify(task))
      .then(punchHelper.getAllTaskIDS)
      .then((taskIds) => {
        for (let i = 0; i < taskIds.length; i++) {
          if(task.id === taskIds[i]) break
          if(i === taskIds.length -1){
            taskIds.push(task.id)
          }
          if(taskIds.length === 0) taskIds.push(task.id)
        }
        return punchHelper.setTaskIds(taskIds)
      })
  },

  getAllTaskIDS:() => {
    return AsyncStorage.getItem(PUNCH_TASK_IDS)
      .then((result) => JSON.parse(result)||[])
      .catch((error) => {
        console.log('suming-log',error)
        return []
      })
  },

  getAllTask: () => {
    return punchHelper.getAllTaskIDS()
      .then((taskIds) =>{
        return Promise.all(taskIds.map(punchHelper.getPunchTaskById))
      })
      .catch((error) => {
        console.log('suming-log',error)
        return []
      })
  },

  setTaskIds:(taskIds) => {
    return AsyncStorage.setItem(PUNCH_TASK_IDS, JSON.stringify(taskIds))
  },

  getPunchTaskById : (taskId) => {
    return AsyncStorage.getItem(PUNCH_TASK + '_' + taskId)
      .then((result) => {
        if(result){
          let task = JSON.parse(result)
          let rules = task.rules
          for (let i = 0; i < rules.length; i++) {
            rules[i] = copyBean(rules[i], new PunchRule())
          }
          task.createdAt = new Date(task.createdAt)
          task.punchDates = task.punchDates.map((item) => new Date(item))
          return copyBean(task, new PunchTask())
        }else {
          return null
        }
      })
  },

  deletePunchTaskById : (taskId) => {
    return punchHelper.getAllTaskIDS()
      .then((taskIds) => {
        for (let i = 0; i < taskIds.length; i++) {
          if(taskIds[i] === taskId){
            taskIds.splice(i,1)
            break
          }
        }
        return punchHelper.setTaskIds(taskIds)
      })
      .then(() =>{
        return AsyncStorage.removeItem(PUNCH_TASK + '_' + taskId)
      })
  },

  punchDate:(taskId) => {
    let selectTask = undefined
    return punchHelper.getPunchTaskById(taskId)
      .then((task) => {
        if(task){
          selectTask = task
          let result = task.punchToDate()
          if(!result){
            throw new Error('今天已经签到')
          }else {
            return AsyncStorage.setItem(PUNCH_TASK+'_'+taskId,JSON.stringify(task))
          }
        }else throw new Error('找不到此任务')
      })
      .then((result) => {
        if(!result){
          return selectTask
        }else throw new Error('签到保存本地失败')
      })
  }
}