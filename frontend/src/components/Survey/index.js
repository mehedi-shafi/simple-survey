import {
    Grid,
    Paper,
    Typography,
    TextField,
    Container,
    Button,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import useStyles from './styles';
import Question from '../Question';
import _ from 'lodash';

let SurveyComponent = (props) => {
    const classes = useStyles();
    let { id } = useParams();
    let { edit } = props;
    let { token, userInfo } = useContext(AuthContext);
    let [survey, setSurvey] = useState({});
    let [questions, setQuestions] = useState([]);
    let [enums, setEnums] = useState({});

    useEffect(() => {
        axios
            .get(`/api/survey/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                setSurvey(response.data);
                setQuestions(response.data.questions);
            });
    }, []);

    useEffect(() => {
        axios
            .get('/api/survey/enums/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                setEnums(response.data);
            })
            .catch((err) => console.error(err));
    }, []);

    if (edit && userInfo.is_superuser) {
        edit = true;
    } else {
        edit = false;
    }

    let inputChangeHandler = (event) => {};

    if (_.isEmpty(survey)) return null;

    return (
        <Box className={classes.boxStyle}>
            <Paper className={classes.surveyFormContainer}>
                <Grid container spacing={0} fullWidth>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            {edit ? 'Edit Survey' : 'View Survey'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
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
            {questions.map((question, index) => (
                <Question
                    enums={enums}
                    data={question}
                    key={`question_${index}`}
                    surveyId={id}
                />
            ))}
            <Grid container spacing={0}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            setQuestions([
                                ...questions,
                                {
                                    options: [],
                                    title: '',
                                    description: '',
                                    question_type: 'TEXT',
                                    is_required: false,
                                    is_active: true,
                                    survey: id,
                                },
                            ]);
                        }}
                    >
                        Add Question
                    </Button>
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
            {/* <Question enums={enums} surveyId={id} /> */}
        </Box>
    );
};

export default SurveyComponent;
