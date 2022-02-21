import { Grid, Paper, Typography, TextField, Container } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import useStyles from './styles';

let SurveyComponent = (props) => {
    const classes = useStyles();
    let { id } = useParams();
    let { edit } = props;
    let { token, userInfo } = useContext(AuthContext);
    let [survey, setSurvey] = useState({});

    useEffect(() => {
        axios
            .get(`/api/survey/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {});
    });

    if (edit && userInfo.is_superuser) {
        edit = true;
    } else {
        edit = false;
    }

    let inputChangeHandler = (event) => {};

    return (
        <Box className={classes.boxStyle}>
            <Paper className={classes.surveyFormContainer}>
                <Grid container spacing={0} fullWidth>
                    <Grid xs={12}>
                        <Typography variant="h6">
                            {edit ? 'Edit Survey' : 'View Survey'}
                        </Typography>
                    </Grid>
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
                </Grid>
            </Paper>
        </Box>
    );
};

export default SurveyComponent;
