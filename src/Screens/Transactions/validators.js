const validator = {
    amount: {
        rules: [
            {
                test: /^([1-9]\d|[1-9]\d{2,})$/,
                message: 'Amount must contain only number',
            },
            {
                test: (value) => {
                    return value.length > 2;
                },
                message: 'Amount must be longer than 2 digits',
            },
        ],
        errors: [],
        valid: false,
        state: '',
    },
    option: {
        rules : [],
        valid: false,
        state: '',
    },
};

export default validator;