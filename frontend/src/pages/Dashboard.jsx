import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getSummary } from "../utils/api"
import { Link } from "react-router-dom";


function Dashboard() {
    const { authTokens } = useContext(AuthContext);
    const [summary, setSummary] = useState({
        income: 2000,
        expenses: 0,
        balance: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSummary(authTokens.access);
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch summary:", error)
            }
        }
        fetchData();
    }, [authTokens]);

    if (!summary) {
        return <p>Loading...</p>;
    }

    return(
        <div>
            <h2>Dashboard </h2>
            
            
                <div>
                    <p><strong>Total Income:</strong> ₦{summary.total_income}</p>
                    <p><strong>Total Expenses:</strong> ₦{summary.total_expenses}</p>
                    <p><strong>Balance:</strong> ₦{summary.balance}</p>

                    <nav>
                        <Link to="/transactions">Transactions</Link>
                    </nav>
                </div>
            
        </div> 
    );
}

export default Dashboard;



// import { Link } from "react-router-dom";

// function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard</h1>

//       <nav>
//         <Link to="/transactions">Transactions</Link>
//       </nav>
//     </div>
//   );
// }

// export default Dashboard;
