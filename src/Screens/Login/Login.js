import React, { useState } from 'react'
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import validators from './validators';
import FormHelperText from '@material-ui/core/FormHelperText';
import * as authActions from '../../server/Server';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = props => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setIsLogin(false);
    };

    const handleInputChange = (event, inputPropName) => {
        const newState = Object.assign({}, userInfo);
        newState[inputPropName] = event.target.value;
        setUserInfo(newState);
        updateValidators(inputPropName, event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        let action = authActions.signin(
            userInfo.username,
            userInfo.password
        );

        setError(null);

        try {
            const data = await action();
            if (data.success === 1 && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('expiresIn', data.expiresIn);
                localStorage.setItem('role', data.role);
                setIsLogin(true);
                history.push('/');
                window.location.reload()
            }
            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
            setOpen(true);
        }
    }

    const updateValidators = (fieldName, value) => {
        validators[fieldName].errors = [];
        validators[fieldName].state = value;
        validators[fieldName].valid = true;
        validators[fieldName].rules.forEach((rule) => {
            if (rule.test instanceof RegExp) {
                if (!rule.test.test(value)) {
                    validators[fieldName].errors.push(rule.message);
                    validators[fieldName].valid = false;
                }
            } else if (typeof rule.test === 'function') {
                if (!rule.test(value)) {
                    validators[fieldName].errors.push(rule.message);
                    validators[fieldName].valid = false;
                }
            }
        });
    }

    const displayValidationErrors = (fieldName) => {
        const validator = validators[fieldName];
        const result = '';
        if (validator && !validator.valid) {
            const errors = validator.errors[0];
            return (
                <FormHelperText style={{ marginLeft: '2%', color: 'red' }}>{errors}</FormHelperText>
            );
        }
        return result;
    }

    const isFormValid = () => {
        let status = true;
        Object.keys(validators).forEach((field) => {
            if (!validators[field].valid) {
                status = false;
            }
        });
        return status;
    }

    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        formField: { marginLeft: '2%', marginTop: '2%', marginRight: '2%' }
    }

    return (
        <Container style={styles.container}>
            <Card style={{ padding: '5%', marginTop: '5%', marginBottom: '5%', width: '60%' }}>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Alert onClose={handleClose} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar open={isLogin} autoHideDuration={3000} onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Alert onClose={handleClose} severity="success">
                        Login Successfully
                    </Alert>
                </Snackbar>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} >
                    <Typography style={styles.container} variant="h4" component="h2">
                        Login
                    </Typography>
                    <TextField style={styles.formField} label="Username" id="username"
                        type="text"
                        value={userInfo.username}
                        onChange={event => handleInputChange(event, 'username')} />
                    {displayValidationErrors('username')}
                    <TextField style={styles.formField} label="Password"
                        id="password"
                        type="password"
                        value={userInfo.password}
                        onChange={event => handleInputChange(event, 'password')}
                    />
                    {displayValidationErrors('password')}
                    {!isLoading ? (
                        <Button type="submit" style={{ margin: '2%' }} disabled={isFormValid() ? false : true} variant="contained" color="primary">
                            Login
                        </Button>
                    ) : (
                            <Button style={{ margin: '2%' }} variant="contained" color="primary">
                                <CircularProgress size={20} color="secondary" />
                            </Button>
                        )
                    }
                </form>
            </Card>
        </Container>
    );
}

export default Login;
