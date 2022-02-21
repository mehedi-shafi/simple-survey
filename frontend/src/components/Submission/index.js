import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import _, { update } from 'lodash';
import Answer from '../Answer';

let Submission = (props) => {
    let [survey, setSurvey] = useState({});
    let { token } = useContext(AuthContext);
    let [redirectTo, setRedirectTo] = useState('');

    let { id } = useParams();

    let [answers, setAnswers] = useState({});

    let updateAnswers = (answer) => {
        setAnswers({
            ...answers,
            [answer.qid]: {
                answer: answer.answer,
                question: answer.qid,
                submission: id,
            },
        });
    };

    useEffect(() => {
        console.log('Answers updated');
        console.log(answers);
    }, [answers]);

    useEffect(() => {
        axios
            .get(`/api/survey/submission/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                setSurvey(response.data);
            })
            .catch((err) => console.error(err));
    }, []);

    let addQuestion = (qid) => {
        let updatedData = {
            ...survey,
            questions: [],
        };
        survey.questions.map((question) => {
            if (question.id == qid) {
                updatedData.questions.push({
                    ...question,
                    is_active: true,
                });
            } else {
                updatedData.questions.push(question);
            }
        });
        setSurvey(updatedData);
    };

    let submit = () => {
        console.log('submitting');
        console.log(answers);

        axios
            .all(
                _.values(answers).map((answer) => {
                    console.log(answer);
                    return axios.post(`/api/survey/answers/`, answer, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });
                })
            )
            .then(
                axios.spread((...responses) => {
                    setRedirectTo('/');
                })
            )
            .catch((err) => console.error(err));
    };

    if (_.isEmpty(survey)) {
        return null;
    }

    if (redirectTo !== '') {
        return <Navigate to={redirectTo} />;
    }

    return (
        <Paper sx={{ width: '100%' }}>
            <Grid
                sx={{ width: '100%', margin: '10px', padding: '10px' }}
                container
                spacing={0}
            >
                <Grid item xs={12}>
                    <Typography variant="h5">{survey.title}</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {survey.description}
                    </Typography>
                </Grid>

                {survey.questions.map((question) =>
                    question.is_active ? (
                        <Grid item xs={12}>
                            <Answer
                                key={question.id}
                                question={question}
                                addQuestion={addQuestion}
                                answerChange={updateAnswers}
                            />
                        </Grid>
                    ) : null
                )}

                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                    <Button variant="contained" onClick={submit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Submission;
