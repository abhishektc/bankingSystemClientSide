const validator = {
    username: {
        rules: [
            {
                test: /^[a-z0-9_]+$/,
                message: 'Username must contain only alphabets-numeric lowercase characters ',
            },
            {
                test: (value) => {
                    return value.length > 4;
                },
                message: 'Username must be longer than 4 characters',
            },
        ],
        touched: false,
        errors: [],
        valid: false,
        state: '',
    },
    password: {
        rules: [
            {
                test: (value) => {
                    return value.length >= 6;
                },
                message: 'Password must be longer than 6 characters',
            },
        ],
        errors: [],
        valid: false,
        state: ''
    },
};

export default validator;