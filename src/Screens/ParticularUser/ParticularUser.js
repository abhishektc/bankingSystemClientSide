import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import * as authActions from '../../server/Server';
import CircularProgress from '@material-ui/core/CircularProgress';

const ParticularUser = props => {
    let params = useParams();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchTransactionList = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        let action = authActions.getTransactionList(
            params.id
        );

        setError(null);

        try {
            const data = await action()
            setData(data.data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
        }
    }, [params.id])

    useEffect(() => {
        fetchTransactionList().then(
            setIsLoading(false)
        );

    }, [fetchTransactionList, setError, setIsLoading])

    return (
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {isLoading ? (
                <>
                    <CircularProgress size={50} color="secondary" />
                </>
            ) : (
                    <>
                        <h4>Transaction List</h4>
                        {
                            data.length > 0 ? (
                                data.map((item) => {
                                    return (
                                        <Card key={item.accountId} style={{ width: "60%", margin: "1%", paddingLeft: '1%', paddingRight: '1%' }}>
                                            <div style={{ display: "flex", justifyContent: 'space-around' }}>
                                                <p style={{ margin: "1%" }}>Status: {item.mode === 'deposit' ? 'Deposited' : 'Withdraw'}</p>
                                                <span>Date: {new Date(item.date).getDate()}/ {new Date(item.date).getMonth()}/ {new Date(item.date).getFullYear()} Time- {new Date(item.date).getHours()}h:{new Date(item.date).getMinutes()}m:{new Date(item.date).getSeconds()}s</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around' }}>
                                                {item.mode === 'deposit' ? (
                                                    <p style={{ margin: "1%" }}>Amount Deposited: {item.amount}</p>

                                                ) : (
                                                        <p style={{ margin: "1%" }}>Amount Withdrawal: {item.amount}</p>
                                                    )}
                                                <p style={{ margin: "1%" }}>Total Balance: {item.totalBalance}</p>
                                            </div>
                                        </Card>
                                    )
                                })
                            ) : (
                                    <h6>Transaction list is empty</h6>
                                )
                        }

                    </>
                )}


        </Container >
    );
}

export default ParticularUser;
