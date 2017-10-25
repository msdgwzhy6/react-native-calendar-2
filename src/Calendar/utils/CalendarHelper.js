/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午3:35
 *
 */
 
export class CalendarManager {

  constructor(punchDates, markDates){
    this.punchDates = []
    this.markDates = []
    if(Array.isArray(punchDates)){
      for (let i = 0; i < punchDates.length; i++) {
        let date = punchDates[i] instanceof Date ? punchDates[i] :new Date(punchDates[i].toString())
        !isNaN(date.getTime())&&this.punchDates.push(date)
      }

    }
    if(Array.isArray(markDates)){
      for (let i = 0; i < markDates.length; i++) {
        let mark = markDates[i]
        let date = mark.date instanceof Date ? mark.date : new Date(mark.date.toString())
        !isNaN(date.getTime())&&this.markDates.push({
          ...mark,
          date
        })
      }
    }
  }

  // 是否已经签到
  isHasPunchByDay(){

  }

  // 是否需要签到
  isNeedPunchByDay(){

  }

  // 是否有备注
  isHasMarkByDay(){

  }

}