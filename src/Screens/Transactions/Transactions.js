import React, { useState } from 'react'
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as authActions from '../../server/Server';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import validators from './validators';
import FormHelperText from '@material-ui/core/FormHelperText';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transactions = props => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState({ amount: '', option: '' });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setSuccess(false);
    };

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

    const handleInputChange = (event, inputPropName) => {
        const newState = Object.assign({}, amount);
        newState[inputPropName] = event.target.value;
        setAmount(newState);
        updateValidators(inputPropName, event.target.value);
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

    const handleSubmit = async (e) => {
        setError(null);
        setIsLoading(true);

        let action = authActions.depositOrWithDraw(
            localStorage.getItem('userId'),
            amount.amount,
            amount.option
        );

        setError(null);

        try {
            const data = await action();
            if (data.success === 1) {
                setSuccess(true);
                setMessage(data.message);
            }
            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
            setOpen(true);
        }
    }

    return (
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                <Snackbar open={isSuccess} autoHideDuration={3000} onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Alert onClose={handleClose} severity="success">
                        {message}
                    </Alert>
                </Snackbar>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} >
                    <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="subtitle1" gutterBottom>
                        Transaction
                    </Typography>
                    <RadioGroup style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} row aria-label="position" name="mode" >
                        <FormControlLabel onChange={event => handleInputChange(event, 'option')} value="deposit" control={<Radio color="primary" />} label="Deposit" />
                        <FormControlLabel onChange={event => handleInputChange(event, 'option')} value="withdraw" control={<Radio color="primary" />} label="Withdraw" />
                    </RadioGroup>
                    <TextField style={{ marginLeft: '2%', marginTop: '2%' }} label="Amount"
                        id="amount"
                        type="amount"
                        value={amount.amount}
                        onChange={event => handleInputChange(event, 'amount')}
                    />
                    {displayValidationErrors('amount')}
                    <Button type="submit" style={{ margin: '2%' }} disabled={isFormValid() ? false : true} variant="contained" color="primary">
                        SUBMIT
                    </Button>
                </form>
            </Card>
        </Container>

    );
}

export default Transactions;
