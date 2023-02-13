import * as yup from 'yup';

export const schemaLogin = yup
    .object({
        email: yup.string().email().required('Campo Obrigatório!'),
        password: yup.string().required('Campo Obrigatório!'),
    })
    .required();
