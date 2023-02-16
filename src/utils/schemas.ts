import * as yup from 'yup';

export const schemaLogin = yup
    .object({
        email: yup.string().email().required('Campo Obrigatório!'),
        password: yup.string().required('Campo Obrigatório!'),
    })
    .required();

export const schemaUser = yup
    .object({
        isCreate: yup.bool(),

        cellphone: yup.string().min(15, 'Número inválido!').required('Campo Obrigatório!'),
        name: yup.string().required('Campo Obrigatório!'),
        cpf: yup.string().min(14, 'CPF inválido').max(14, 'CPF inválido').required('Campo CPF é necessário!'),
        email: yup.string().email('Email inválido').required('Campo Obrigatório!'),
        password: yup.string().when('isCreate', {
            is: true,
            then: yup.string().required('Campo Senha necessário!'),
        }),

        cep: yup.string().min(10, 'Campo CEP inválido!').required('Campo CEP é necessário!'),
        state: yup.string().required('Campo Obrigatório!'),
        city: yup.string().required('Campo Obrigatório!'),
        neighborhood: yup.string().required('Campo Obrigatório!'),
        address: yup.string().required('Campo Obrigatório!'),
        number: yup.number().typeError('Este campo deve ser um número!'),
    })
    .required();

export const schemaProject = yup
    .object({
        client_cellphone:   yup.string().min(15, 'Número inválido!').required('Campo Obrigatório!'),
        client_name: yup.string().required('Campo Obrigatório!'),
        company_distribution: yup.string().required('Campo Obrigatório!'),
        total_potency: yup.number().min(5, 'A potência deve ser maior que 5V').required('Campo Obrigatório!'),
        file: yup.mixed().test('file', 'Campo arquivo obrigatório!', (value) => {
            if (value.length > 0) {
                return true;
            }
            return false;
        }),

        cep: yup.string().min(8, 'Campo CEP inválido').required('Campo Obrigatório!'),
        state: yup.string().required('Campo Obrigatório!'),
        city: yup.string().required('Campo Obrigatório!'),
        neighborhood: yup.string().required('Campo Obrigatório!'),
        address: yup.string().required('Campo Obrigatório!'),
        number: yup.number().typeError('Este campo deve ser um número!'),
    })
    .required();
