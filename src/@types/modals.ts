export type ModalProps = {
    id: number | undefined;
    accessType: string;
    showModal: boolean;
    hideModal: () => void;
    handleReload: () => void;
}
