import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getTransactions, deleteTransaction } from "../utils/api";
import TransactionForm from "../components/TransactionForm";
import { Link, useNavigate, useLocation } from "react-router-dom";


function Transactions() {
    const { token } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    // {transactions.map((tx) => {
    //     <div key={tx.id}>
    //         <span>{tx.description}</span>
    //         <span>₦{tx.amount}</span>

    //         <button 
    //             onClick={() => navigate(`/transactions/edit/${tx.id}`)}
    //         >
    //             Edit
    //         </button>

    //         <button onClick={() => handleData(tx.id)}>
    //             Delete
    //         </button>
    //     </div>
    // })}

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions(token);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    useEffect(() => {
        // Refetch when returning from edit page
        if (location.state?.updatedTransaction) {
            fetchTransactions();
        }
    }, [location.state?.updatedTransaction, token]);

    const handleDelete = async (id) => {
        const previous = transactions;

        //optimistic update
        setTransactions(prev => prev.filter(t => t.id !== id));
        // setTransactions(prev => prev.filter(t => t.id !== id));

        try {
            await deleteTransaction(token, id);
            
        } catch (error) {
            console.error("Failed to delete transaction:", error);
            // Rollback
            setTransactions(previous);
        }
    };

    const onOptimisticCreate = (tx, tempId = null) => {
        setTransactions(prev => {
            if (tempId) {
                // Replace temp tx with real one
                return prev.map(t => t.id === tempId ? tx: t);
            }
            //Insert new optimistic tx
            return [tx, ...prev];
        });
    };

    return(
        <div>
            <h2>Transactions (Protected)</h2>
            {/* <TransactionForm onSuccess={fetchTransactions} /> */}

            <TransactionForm onOptimisticCreate={onOptimisticCreate} />
            
            <ul>
                {transactions.map(t => (
                    <li 
                        key={t.id}
                        style={{ opacity: t.optimistic ? 0.6 : 1 }}
                    >
                            {t.transaction_type} - ₦{t.amount} ({t.description})
                            <button onClick={() => navigate(`/transactions/edit/${t.id}`)}>Edit</button>
                            <button onClick={() => handleDelete(t.id)}>Delete</button>
                    </li>
                ))}
            </ul> 

            {/* <nav><Link to="/transactions/edit">Edit Transactions</Link></nav> */}
        </div> 
    );
}

export default Transactions;