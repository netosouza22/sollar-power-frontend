interface IMessageErrorInfo {
    errorMessage: string | undefined;
}

const MessageErrorInfo = ({ errorMessage }: IMessageErrorInfo) => {
    return <span style={{ color: 'red', fontSize: '11px', marginTop: '0px' }}>{errorMessage}</span>;
};

export default MessageErrorInfo;
