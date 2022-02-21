import { Button, Grid, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Table from '../Table';
import _ from 'lodash';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import moment from 'moment';

let SubmissionList = (props) => {
    let [survey, setSurvey] = useState({});
    let [data, setData] = useState({});
    let [redirectTo, setRedirectTo] = useState('');

    let { token } = useContext(AuthContext);

    let { id } = useParams();

    useEffect(() => {
        axios
            .get(`/api/survey/${id}/submissions/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                let processedData = [];
                _.values(response.data[id].submissions).map(
                    (submission, index) => {
                        processedData.push({
                            sl: index + 1,
                            user: submission.full_name,
                            time: moment(submission.submission_time).format(
                                'DD MMM YYYY'
                            ),
                            action: (
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setRedirectTo(
                                            `/submission/${submission.submission_id}/`
                                        )
                                    }
                                >
                                    View
                                </Button>
                            ),
                        });
                    }
                );
                setSurvey(response.data);
                setData(processedData);
            })
            .catch((err) => {
                console.error(err);
                setRedirectTo('/');
            });
    }, []);

    if (_.isEmpty(data)) return null;

    if (redirectTo !== '') {
        return <Navigate to={redirectTo} />;
    }

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center',
                padding: '10px',
                margin: '10px',
            }}
        >
            <Grid container spacing={0} sx={{ width: '100%' }}>
                <Grid item xs={12}>
                    <Typography variant="h4">{survey.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {survey.description}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ width: '100%' }}>
                        <Table
                            loading={data.length <= 0}
                            data={data}
                            columns={[
                                { title: '#', field: 'sl' },
                                { title: 'User', field: 'user' },
                                { title: 'Time', field: 'time' },
                                { title: 'Action', field: 'action' },
                            ]}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SubmissionList;
