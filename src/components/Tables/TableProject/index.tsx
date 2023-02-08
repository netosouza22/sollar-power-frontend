import deleteIcon from '@/assets/icons/delete.svg';
import editIcon from '@/assets/icons/edit.svg';
import Button from '@/components/base/Button';
import ModalProject from '@/components/modals/ModalProject';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import styles from './table.module.scss';

interface IGrid {
    dataGrid: [];
}

const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFuYWlzIiwiaWF0IjoxNjc1ODg2NjAxLCJleHAiOjE2NzU4OTAyMDF9.1TFilADLpJ4cA4Boj5pxjIHfPzuxbMeH6SACqdxOc6k';

const TableProject = ({ dataGrid }: IGrid) => {
    const [showModal, setShowModal] = useState(false);
    const [reload, setReload] = useState(false);

    const hideModal = () => {
        setShowModal(false);
    };

    const handleDeleteProject = async () => {
        try {
            const response = await axios.delete('http://localhost:8080/projects/2', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            console.log(response.status);
        } catch (err: any) {
            if (err.response.data.errors) {
                console.log(
                    '🚀 ~ file: index.tsx:59 ~ constonSubmit:SubmitHandler<FormDataProject>= ~ err',
                    err.response.data.errors.default,
                );
            }

            console.log(err.response.data.message);
        }
    };

    return (
        <>
            <ModalProject showModal={showModal} hideModal={hideModal} />
            <div className={styles.table__container}>
                <header className={styles.t__container__header}>
                    <div className={styles.t__container__info}>
                        <h5>Projetos</h5>
                        <span>46 projetos</span>

                        <button>filtrar</button>
                    </div>
                    <div className={styles.t__container__action}>
                        <Button onClick={() => setShowModal(true)} size="lg">
                            Novo Projeto
                        </Button>
                    </div>
                </header>
                <table className={styles.table}>
                    <tr className={styles.table__tr}>
                        <th className={styles.table__th}>Nome do Cliente</th>
                        <th className={styles.table__th}>Concessionária</th>
                        <th className={styles.table__th}>Potência do Projeto(V)</th>
                        <th className={styles.table__th}>Estado</th>
                        <th className={styles.table__th}>Cidade</th>
                        <th className={styles.table__th}>Arquivo</th>
                        <th className={styles.table__th}>Ação</th>
                    </tr>

                    {dataGrid.map((item: any) => {
                        return (
                            <tr key={item.id} className={styles.table__tr}>
                                <td className={styles.table__td}>{item.client_name}</td>
                                <td className={styles.table__td}>{item.company_distribution}</td>
                                <td className={styles.table__td}>{item.total_potency}</td>
                                <td className={styles.table__td}>{item.state}</td>
                                <td className={styles.table__td}>{item.city}</td>
                                <td className={styles.table__td}>{item.city}</td>
                                <td className={styles.table__td}>
                                    <div className={styles.td__group__button}>
                                        <Button bg="none" onClick={handleDeleteProject}>
                                            <Image
                                                src={deleteIcon}
                                                alt="delete icon"
                                                width={30}
                                                height={30}
                                            ></Image>
                                        </Button>
                                        <Button bg="none">
                                            <Image
                                                src={editIcon}
                                                alt="delete icon"
                                                width={27}
                                                height={30}
                                            ></Image>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        </>
    );
};

export default TableProject;
