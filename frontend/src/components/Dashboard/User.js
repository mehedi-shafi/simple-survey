import { Typography, Paper, Container, Button } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from '../Table';
import { AuthContext } from '../../contexts/AuthContext';
import _ from 'lodash';
import { Navigate } from 'react-router-dom';
import moment from 'moment';

let UserDashboard = (props) => {
    let [data, setData] = useState([]);
    let { token, userInfo } = useContext(AuthContext);
    let [redirectTo, setRedirectTo] = useState('');

    let createSubmission = (survey) => {
        axios
            .post(
                `/api/survey/submission/`,
                {
                    survey,
                    user: userInfo.id,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            )
            .then((response) => {
                setRedirectTo(`/submission/${response.data.id}`);
            });
    };

    let getAction = (survey) => {
        return survey.has_submission ? (
            <Typography variant="subtitle2">Already participated.</Typography>
        ) : (
            <Button
                variant="outlined"
                onClick={() => createSubmission(survey.id)}
            >
                Participate
            </Button>
        );
    };
    useEffect(() => {
        axios
            .get('/api/survey', {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
                let processedData = [];
                response.data.map((survey, index) => {
                    console.log(survey);
                    processedData.push({
                        sl: index + 1,
                        survey_title: survey.title,
                        created_at: moment(survey.created_at).format(
                            'DD MMM YYYY'
                        ),
                        action: getAction(survey),
                    });
                });
                setData(processedData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if (_.isEmpty(data)) return null;

    if (redirectTo !== '') return <Navigate to={redirectTo} />;

    return (
        <Container fluid={true}>
            <Paper sx={{ width: '100%' }}>
                <Table
                    columns={[
                        { title: '#', field: 'sl' },
                        { title: 'Title', field: 'survey_title' },
                        { title: 'Created', field: 'created_at' },
                        { title: 'Action', field: 'action' },
                    ]}
                    loading={_.isEmpty(data)}
                    data={data}
                ></Table>
            </Paper>
        </Container>
    );
};

export default UserDashboard;
