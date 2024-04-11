const fs = require('fs')

class TransactionAnalyzer {
    transactions = [];
    
    constructor(transactionsArray){
        this.transactions = transactionsArray;
    }

    /**
     * @param {*} transaction 
     * @returns {object} Добавляет новую транзакцию
     */
    addTransactions(transaction){
        this.transactions.push(transaction);
    }

    /**
     * @returns {object} Возвращает все транзакции из массива
     */
    getAllTransactions(){
        return this.transactions;
    }

    /**
     * @returns Добавляет функцию string к каждой транзакции
     */
    addToAllString() {
        this.transactions.forEach((item) => {
            if(!('string' in item)){
                item.string = function(){ return JSON.stringify(item) }
            }
        })
    }

    /**
     * 
     * @param {*} type 
     * @returns Возвращает уникальные транзакции заданного типа из массива
     */
    getUniqueTransactionType(type){
       const uniqueSet = new Set();

       this.transactions.forEach(item => {
        if (item.transaction_type === type) {
            uniqueSet.add(item);
        }})

       return Array.from(uniqueSet);
    }

    /**
     * @returns Возвращает общую сумму всех транзакций.
     */
    calculateTotalAmount(){
        return this.transactions.reduce((acc,val) => {
            return acc + val.transaction_amount;
        }, 0);
    }

    /**
     * @param {*} year 
     * @param {*} month 
     * @param {*} day 
     * @returns Возвращает общую сумму транзакций за указанную дату
     */
    calculateTotalAmountByDate(year, month, day) {
        return this.transactions.reduce((acc, val) => {
            const date = new Date();
            date.setFullYear(year);
            date.setMonth(month - 1); // In JS month start with 0
            date.setDate(day);
    
            const transactionDate = new Date(val.transaction_date);
    
            if (
                transactionDate.getDate() === date.getDate() &&
                transactionDate.getMonth() === date.getMonth() &&
                transactionDate.getFullYear() === date.getFullYear()
            ) {
                return acc + val.transaction_amount;
            } else {
                return acc;
            }
        }, 0);
    }

    /**
     * @param {*} type 
     * @returns Возвращает первую транзакцию заданного типа из массива
     */
    getTransactionByType(type){
        return this.transactions.find(item => item.transaction_type == type) || {};
    }

    /**
     * @param {*} startDate 
     * @param {*} endDate 
     * @returns Возвращает транзакции, совершенные в указанном диапазоне дат
     */
    getTransactionsInDateRange(startDate, endDate) {
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }

    /**
     * @param {*} merchantName 
     * @returns Возвращает транзакции, совершенные с указанным продавцом
     */
    getTransactionsByMerchant(merchantName){
        return this.transactions.reduce((acc, val) => {
            if(val.merchant_name == merchantName){
                acc.push(val);
            }
            return acc;
        }, [])
    }

    /**
     * @returns Возвращает среднюю сумму транзакции
     */
    calculateAverageTransactionAmount() {
        return this.calculateTotalAmount() / this.transactions.length;
    }

    /**
     * @param {*} minAmount 
     * @param {*} maxAmount 
     * @returns Возвращает транзакции в заданном диапазоне суммы
     */
    getTransactionsByAmountRange(minAmount, maxAmount){
        return this.transactions.reduce((acc, val) => {
            if(val.transaction_amount >= minAmount && val.transaction_amount <= maxAmount){
                acc.push(val);
            }
            return acc;
        }, [])
    }

    /**
     * @returns Возвращает общую сумму транзакций с типом "debit"
     */
    calculateTotalDebitAmount(){
        return this.transactions.reduce((acc, val) => {
            if(val.transaction_type == 'debit'){
                return acc + val.transaction_amount;
            }
            return acc;
        }, 0)
    }

    /**
     * @param {*} arr 
     * @returns Возвращает наиболее часто встречающийся месяц для транзакций
     */
    findMostTransactionsMonth(arr){
        const monthCount = {};
        if(arr == undefined){
            arr = this.transactions;
        }

        arr.forEach((item) => {
            const month = new Date(item.transaction_date).getMonth() + 1;

            if(month in monthCount){
                monthCount[month] = monthCount[month] + 1;
            }else{
                monthCount[month] = 1;
            }
        })

        let mostTransactionsMonth = [];
        let maxTransactionCount = 0;
    
        for (const month in monthCount) {
            if (monthCount[month] > maxTransactionCount) {
                maxTransactionCount = monthCount[month];
            }
        }

        for(const month in monthCount){
            if(monthCount[month] == maxTransactionCount){
                mostTransactionsMonth.push(parseInt(month))
            }
        }
    
        return mostTransactionsMonth.length == 1 ? mostTransactionsMonth[0] : mostTransactionsMonth;
    }

    /**
     * @returns Возвращает наиболее часто встречающийся месяц для транзакций типа "debit"
     */
    findMostDebitTransactionMonth(){
        return this.findMostTransactionsMonth(this.transactions.filter(item => item.transaction_type == 'debit'));
    }

    /**
     * @returns Возвращает тип транзакции (debit, credit, или equal), которых больше всего
     */
    mostTransactionTypes(){
        const debitLength = this.transactions.filter(item => item.transaction_type == 'debit').length;
        const creditLength = this.transactions.filter(item => item.transaction_type == 'credit').length;

        if(debitLength == creditLength){
            return 'equal'
        }else{
            return debitLength > creditLength ? 'debit' : 'credit';
        }
    }

    /**
     * @param {*} date 
     * @returns Возвращает транзакции, совершенные до указанной даты
     */
    getTransactionsBeforeDate(date){
        return this.transactions.filter(item => {
            return new Date(item.transaction_date) < date;
        })
    }

    /**
     * @param {*} id 
     * @returns Возвращает транзакцию с указанным идентификатором
     */
    findTransactionById(id){
        return this.transactions.find(item => item.transaction_id == id) || {};
    }

    /**
     * @returns Возвращает массив описаний всех транзакций
     */
    mapTransactionDescriptions(){
        return this.transactions.map(item => {
            return item.transaction_description;
        })
    }
}

let jsonData = [];

const data = fs.readFileSync('transaction.json', 'utf8');
jsonData = JSON.parse(data);

const analyzer = new TransactionAnalyzer(jsonData);
analyzer.addToAllString();

// console.log(analyzer.getUniqueTransactionType('debit'));
// console.log(analyzer.calculateTotalAmount());
// console.log(analyzer.calculateTotalAmountByDate(2019, 4, 30));
// console.log(analyzer.getTransactionByType('credit'));
// console.log(analyzer.getTransactionsInDateRange(new Date('2019-04-28'), new Date())) 
// console.log(analyzer.getTransactionsByMerchant('DoughnutShop789'));
// console.log(analyzer.calculateAverageTransactionAmount());
// console.log(analyzer.getTransactionsByAmountRange(80,100));
// console.log(analyzer.calculateTotalDebitAmount());
// console.log(analyzer.findMostTransactionsMonth());
// console.log(analyzer.findMostDebitTransactionMonth());
// console.log(analyzer.mostTransactionTypes());
// console.log(analyzer.getTransactionsBeforeDate(new Date('2019-01-06')))
// console.log(analyzer.findTransactionById(26))
// console.log(analyzer.mapTransactionDescriptions());
