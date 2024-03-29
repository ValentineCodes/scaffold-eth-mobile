import axios from "axios";

class TransactionsAPI {
    async getTransactions(domain: string, apiKey: string, address: string, page: number) {
        const endpoint = `${domain}/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}&page=${page}&offset=20`

        const {data: transactions} = await axios.get(endpoint)

        return transactions.result
    }
}

export default new TransactionsAPI