import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createTransaction } from "../utils/api";

function TransactionForm({ onOptimisticCreate }) {
    const { token } = useContext(AuthContext);

    //for testing
    // console.log("ACCESS TOKEN: ", token);
    console.log("TOKEN SENT TO API:", token, typeof token);


    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [transactionType, setTransactionType] = useState("income");


    const handleSubmit = async (e) => {
        e.preventDefault();

        // FRONTEND ONLY (optimistic)
        const optimisticTx = {
            id: Date.now(), //temporary ID
            amount,
            transaction_type: transactionType,
            description,
            optimistic: true,
        };
        // const data = {
        //     id: Date.now(), //temporary ID
        //     amount,
        //     transaction_type: transactionType,
        //     description,
        //     optimistic: true,
        // };

        //BACKEND ONLY (clean)
        const payload = {
            amount,
            transaction_type: transactionType,
            description,
        };

        //Optimistic insert (IMMEDIATELY updates UI)
        onOptimisticCreate(optimisticTx);
        // onOptimisticCreate(data);

        

        try {
            const savedTx = await createTransaction(token, payload);
            onOptimisticCreate(savedTx, optimisticTx.id); //replace temp tx with real one

            setAmount("");
            setDescription("");
        } catch (error) {
            console.error("Failed to create transaction:", error);
        }

        // try {
        //     await createTransaction(token, data);
        //     setAmount("");
        //     setDescription("");
        //     onSuccess();
        // } catch (error) {
        //     console.error("Failed to create transaction:", error);
        // }

        // console.log("SENDING TOKEN:", authTokens?.access);
        // console.log("PAYLOAD:", data);

    };

    return(
        <form onSubmit={handleSubmit}>
            <h3>Add Transaction</h3>

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button type="submit">Save</button>
        </form>
    );
}

export default TransactionForm;

// Nothing seems to be fixed yet, then again when I click delete button, it refreshes but nothing gets deleted. 
// Then again the Edit page seems to be broken, also when I go back to the transaction page it refreshes and all transactions are gone.