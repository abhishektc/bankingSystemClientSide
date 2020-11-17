
export const signin = (username, password) => {
    return async data => {
        const response = await fetch('http://localhost:3001/api/user/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error;
            let message = 'Something went wrong!';
            if (errorId === 'INVALID') {
                message = 'Invalid username and password!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const depositOrWithDraw = (userId, amount, option) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch('http://localhost:3001/api/app/depositOrWithDraw',
            {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    amount: amount,
                    option: option
                })
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error;
            let message = 'Something went wrong!';
            if (errorId === 'INSUFICIENT') {
                message = 'Insuficient Fund!, Please Deposit';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const getTransactionList = (userId) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:3001/api/app/getTransactionList/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};


export const getUsersList = () => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:3001/api/app/getUsersList`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
            localStorage.removeItem('expiresIn');
            return {
                token: null,
                role: null
            }
        } else {
            const expirationDate = localStorage.getItem('expiresIn');
            if (expirationDate * 1000 <= new Date().getTime()) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                localStorage.removeItem('expiresIn');
                return {
                    token: null,
                    role: null
                }
            } else {
                const role = localStorage.getItem('role');
                return {
                    token: token,
                    role: role
                }
            }
        }
    };
};