import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateTransaction, getTransactions } from "../utils/api";


function EditTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [form, setForm] = useState({
        amount: "",
        description: "",
        transaction_type: "expense",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        
        fetch(`http://localhost:8000/api/transactions/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(err => console.error("Failed to fetch transactions:", err));
    }, [id, token]);
    
    // const handleChange = (e) => {
    //     setForm({
    //         ...form,
    //         [e.target.name]: e.target.value,
    //     })
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateTransaction(token, id, form);
            navigate("/transactions", {
                state: { updatedTransaction: { ...form, id: Number(id)}}
            });
        } catch (error) {
            console.error("Failed to update transaction:", error);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div>
            <h2>Edit Transaction</h2>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                />

                <select
                    value={form.transaction_type}
                    onChange={(e) => setForm({...form, transaction_type: e.target.value})}
                    >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                />

                <button disabled={loading} type="submit">Update Transaction</button>
            </form>
        </div>
    )

}

export default EditTransaction;