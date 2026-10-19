export class DateUtils {
   public static formatDateForTransactionsTable(date:string):string|undefined {
       if(date) {
           const [year, month, day] = date.split('-');

        return `${day}.${month}.${year}`;}

    }
}