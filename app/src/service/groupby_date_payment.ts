import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupBydate'})
export class GroupByDatePayment implements PipeTransform {
  transform(value: any, date: any){
    let payment_list = [];
    for(let i=0;i<value.length;i++){
      if(value[i].date == date){
        payment_list.push(value[i]);
      }
    }
    return payment_list;
  }
}
