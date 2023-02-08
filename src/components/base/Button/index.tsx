import styles from './button.module.scss';

interface IButton {
    children: JSX.Element;
    size: 'lg' | 'md';
    bg?: 'none' | undefined;
    onClick?: () => void | undefined;
}

const Button = ({ children, size, onClick, bg }: any) => {
    return (
        <button
            onClick={onClick !== undefined ? () => onClick() : undefined}
            className={`${styles.button}
            ${size === 'lg' ? styles.lg__button : styles.md_button}
            ${bg === 'none' ? styles.bg__none__button : styles.bg__normal__button}
            `}
        >
            {children}
        </button>
    );
};

export default Button;
