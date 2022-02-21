import {
    Button,
    Modal,
    Grid,
    Paper,
    Typography,
    TextField,
    Divider,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import Snackbar from '../Snackbar';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';
import useStyles from './styles';
import { AuthContext } from '../../contexts/AuthContext';
import _ from 'lodash';
import axios from 'axios';

let CreateSurveyModal = (props) => {
    const classes = useStyles();
    let { token, userInfo } = useContext(AuthContext);

    let [open, setOpen] = useState(false);
    let [submissionStatus, setSubmissionStatus] = useState({
        show: false,
        severity: 'success',
        message: '',
    });
    let [survey, setSurvey] = useState({
        title: '',
        description: '',
        created_by: userInfo.id,
    });

    let handleClose = () => {
        setOpen(false);
        setSurvey({ ...survey, title: '', description: '' });
    };

    let handleSnackbarClose = () => {
        setSubmissionStatus({
            show: false,
            severity: 'success',
            message: '',
        });
    };

    let createSurvey = () => {
        if (_.isEmpty(survey.title)) {
            setSubmissionStatus({
                show: true,
                severity: 'warning',
                message: 'Cannot create Survey without a title!!',
            });
        } else {
            axios
                .post(
                    '/api/survey/',
                    {
                        ...survey,
                    },
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    handleClose();
                })
                .catch((err) => {
                    setSubmissionStatus({
                        show: true,
                        severity: 'error',
                        message: JSON.stringify(err),
                    });
                });
        }
    };

    let inputChangeHandler = (event) => {
        setSurvey({
            ...survey,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <>
            <Snackbar
                alert={submissionStatus}
                handleClose={handleSnackbarClose}
            />
            <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: '#219ebc' }}
                onClick={() => setOpen(true)}
                startIcon={<EditIcon />}
            >
                New
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Paper className={classes.modalContainer}>
                    <Grid container spacing={1}>
                        <Grid xs={12}>
                            <Typography variant="h6">
                                Create new survey.
                            </Typography>
                        </Grid>

                        <Divider sx={{ height: '10px' }} />

                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                variant="outlined"
                                name="title"
                                value={survey.title}
                                helperText="Give your survey a title."
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                multiline
                                name="description"
                                helperText="Add some description."
                                value={survey.description}
                                onChange={inputChangeHandler}
                            />
                        </Grid>

                        <Divider sx={{ height: '10px' }} />

                        <Grid xs={8}></Grid>
                        <Grid xs={2}>
                            <Button
                                fullWidth
                                onClick={handleClose}
                                variant="contained"
                                color="error"
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid xs={2}>
                            <Button
                                fullWidth
                                onClick={createSurvey}
                                variant="contained"
                                color="info"
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Modal>
        </>
    );
};

export default CreateSurveyModal;
