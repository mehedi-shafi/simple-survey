import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
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
    boxStyle: {
        display: 'flex',
        width: '100%',
        '& > :not(style)': {
            m: 1,
        },
        padding: theme.spacing(1),
    },

    surveyFormContainer: {
        width: '100%',
        margin: '20px',
        padding: '10px',
    },
}));

export default useStyles;
