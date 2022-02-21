import { makeStyles } from '@mui/styles';

let useStyles = makeStyles({
    questionContainer: {
        padding: '10px',
    },
    formControl: {
        '& .MuiInputBase-root.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.8)',
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
        },
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        padding: '10px',
    },
});

export default useStyles;
