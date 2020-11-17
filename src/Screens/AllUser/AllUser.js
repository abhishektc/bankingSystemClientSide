import React, { useEffect, useCallback, useState } from 'react'
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import * as authActions from '../../server/Server';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";

const AllUsers = props => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const styles = {
        container: {
            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
        },
        card: {
            width: "60%", margin: "1%", paddingLeft: '1%', paddingRight: '1%'
        },
        userInfo: {
            display: "flex", flexDirection: 'row', justifyContent: 'space-around'
        }
    }

    const fetchUserList = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        let action = authActions.getUsersList();

        setError(null);

        try {
            const data = await action()
            setData(data.data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        let mounted = true;
        fetchUserList().then(() => {
            if (mounted) {
                setIsLoading(false)
            }
        });

        return () => mounted = false;
    }, [fetchUserList, setError, setIsLoading])

    return (
        <Container style={styles.container}>
            {isLoading ? (
                <>
                    <CircularProgress size={50} color="secondary" />
                </>
            ) : (
                    <>
                        <h4>Users List</h4>
                        {
                            data.length > 0 ? (
                                data.map((item) => {
                                    return (
                                        <Card key={item.userId} style={styles.card}>
                                            <Link to={`/particularUser/${item.userId}`} style={{ textDecoration: 'none' }}>
                                                <div style={styles.userInfo}>
                                                    <p style={{ margin: "1%" }}>Customer Name: {item.name}</p>
                                                    <p style={{ margin: "1%" }}>Total Balance: {item.totalBalance}</p>
                                                </div>
                                            </Link>
                                        </Card>
                                    )
                                })
                            ) : (
                                    <h6>User list is empty</h6>
                                )
                        }

                    </>
                )}


        </Container >
    );
}

export default AllUsers;
