import {
    Button,
    Container,
    Grid,
    IconButton,
    Paper,
    Tooltip,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Filter from '../Filter';
import Table from '../Table';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import _ from 'lodash';
import moment from 'moment';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import CreateSurveyModal from '../Survey/CreateSurveyModal';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import EditIcon from '@mui/icons-material/Edit';
import { DeleteForever } from '@mui/icons-material';
import { Navigate } from 'react-router-dom';

let AdminDashboard = (props) => {
    let { token, userInfo } = useContext(AuthContext);
    let [data, setData] = useState([]);

    let [redirect, setRedirect] = useState('');

    let deleteSurvey = (survey) => {
        axios
            .delete(`/api/survey/${survey.id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => window.location.reload());
    };

    let editSurvey = (survey) => {
        setRedirect(`/survey/${survey.id}/edit`);
    };

    let participateSurvey = (survey) => {
        axios
            .post(
                `/api/survey/submission/`,
                {
                    survey: survey.id,
                    user: userInfo.id,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            )
            .then((response) => {
                setRedirect(`/submission/${response.data.id}/`);
            })
            .catch((err) => console.error(err));
    };

    let submissions = (survey) => {
        setRedirect(`/survey/${survey.id}/submissions/`);
    };

    let getAction = (survey) => {
        return (
            <>
                <Tooltip title="Edit">
                    <IconButton
                        variant="contained"
                        onClick={() => editSurvey(survey)}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Participate">
                    <IconButton
                        variant="contained"
                        onClick={() => participateSurvey(survey)}
                    >
                        <EmojiEmotionsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Submissions">
                    <IconButton
                        variant="contained"
                        onClick={() => submissions(survey)}
                    >
                        <DescriptionIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        variant="contained"
                        onClick={() => deleteSurvey(survey)}
                    >
                        <DeleteForever />
                    </IconButton>
                </Tooltip>
            </>
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

    if (redirect !== '') {
        return <Navigate to={redirect} />;
    }

    let onFilterChange = (newTab) => {};
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

export default AdminDashboard;
