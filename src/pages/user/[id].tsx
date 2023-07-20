import { useRouter } from 'next/router';

const User = (props: any) => {
    const router = useRouter();
    console.log('🚀 ~ file: [id].tsx:5 ~ User ~ id', router);

    if (!router.query.id) {
        router.back();
    }

    return (
        <div>
            <header>Dados do Cliente</header>
            <main>
                <section>
                    <h4>Dados Pessoais</h4>
                    <div>
                        <span>Nome:</span>
                        <span>{'neto'}</span>
                    </div>
                    <div>
                        <span>CPF:</span>
                        <span>{'066.144.523-20'}</span>
                    </div>
                    <div>
                        <span>Email:</span>
                        <span>{'user5@gmail.com'}</span>
                    </div>
                    <div>
                        <span>Celular:</span>
                        <span>{'(88) 99945-5063'}</span>
                    </div>
                    <div>
                        <span>Passowrd:</span>
                        <span>{'********'}</span>
                    </div>
                </section>
                <section>
                    <h4>Dados de Endereço</h4>
                    <div>
                        <span>CEP:</span>
                        <span>{'neto'}</span>
                    </div>
                    <div>
                        <span>Estado:</span>
                        <span>{'066.144.523-20'}</span>
                    </div>
                    <div>
                        <span>Cidade:</span>
                        <span>{'user5@gmail.com'}</span>
                    </div>
                    <div>
                        <span>Bairro:</span>
                        <span>{'(88) 99945-5063'}</span>
                    </div>
                    <div>
                        <span>Rua:</span>
                        <span>{'********'}</span>
                    </div>
                    <div>
                        <span>Número:</span>
                        <span>{'********'}</span>
                    </div>
                    <div>
                        <span>Complemento:</span>
                        <span>{'********'}</span>
                    </div>
                </section>
                <section>
                    <h4>Projetos</h4>
                    <div></div>
                </section>
            </main>
        </div>
    );
};

export default User;

// export const getStaticPaths: GetStaticPaths = async () => {
//     const { auth_token } = parseCookies();
//     const response = api
//         .get('/users')
//         .then((res) => console.log(res))
//         .catch((err) => console.log(err));

//     return {
//         paths: [
//             {
//                 params: {
//                     id: '1',
//                 },
//             },
//         ], //indicates that no page needs be created at build time
//         fallback: false, //indicates the type of fallback
//     };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//     // console.log('🚀 ~ file: [id].tsx:40 ~ constgetStaticProps:GetStaticProps= ~ params', params);
//     // const { auth_token } = parseCookies();
//     // console.log('🚀 ~ file: [id].tsx:43 ~ constgetStaticProps:GetStaticProps= ~ auth_token', auth_token);

//     // // const response: any = api
//     // //     .get('/users/1')
//     // //     .then((res) => console.log(res))
//     // //     .catch((err) => console.log(err));
//     // console.log('🚀 ~ file: [id].tsx:46 ~ constgetStaticProps:GetStaticProps= ~ response', response);

//     return {
//         props: {},
//         revalidate: 60 * 60 * 1,
//     };
// };
