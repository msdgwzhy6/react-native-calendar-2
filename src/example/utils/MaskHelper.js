/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/31
 * Time: 下午4:34
 *
 */

import { AsyncStorage } from 'react-native'

const MASK_DATE = 'MASK_DATE'
const MASK_DATE_IDS = 'MASK_DATE_IDS'

export const maskHelper = {
  getAllMaskIDS:() => {
    return AsyncStorage.getItem(MASK_DATE_IDS)
      .then((result) => JSON.parse(result)||[])
      .catch((error) => {
        console.log('suming-log',error)
        return []
      })
  },
  getAllMaskDates: () => {
    return maskHelper.getAllMaskIDS()
      .then((maskIds) =>{
        return Promise.all(maskIds.map(maskHelper.getMaskDateById))
      })
      .catch((error) => {
        console.log('suming-log',error)
        return []
      })
  },

  getMaskDateById:(dateId) => {
    return AsyncStorage.getItem(MASK_DATE + '_' + dateId)
      .then((result) => {
        if(result){
          let maskDate = JSON.parse(result)
          maskDate.date = new Date(maskDate.date)
          return maskDate
        }
      })

  },

  setMaskIds:(maskIds) => {
    return AsyncStorage.setItem(MASK_DATE_IDS, JSON.stringify(maskIds))
  },

  maskDate:(maskDate) => {
    let maskId = maskDate.date.toLocaleDateString()
    return AsyncStorage.setItem(MASK_DATE+'_'+maskId,JSON.stringify(maskDate))
      .then(maskHelper.getAllMaskIDS)
      .then((maskIds) => {
        for (let i = 0; i < maskIds.length; i++) {
          if(maskId === maskIds[i]) break
          if(i === maskIds.length -1){
            maskIds.push(maskId)
          }
        }
        if(maskIds.length === 0) maskIds.push(maskId)
        return maskHelper.setMaskIds(maskIds)
      })
  },

}