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
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';

let AdminDashboard = (props) => {
    let [tab, setTab] = useState('surveys-all');
    let { token, userInfo } = useContext(AuthContext);
    let [data, setData] = useState([]);

    let getAction = () => {
        return (
            <>
                {userInfo.is_superuser ? (
                    <Tooltip title="Edit">
                        <IconButton variant="contained">
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <></>
                )}
                <Tooltip title="Participate">
                    <IconButton variant="contained">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                {userInfo.is_superuser ? (
                    <Tooltip title="Submissions">
                        <IconButton variant="contained">
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <></>
                )}
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
                        action: getAction(),
                    });
                });
                setData(processedData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [tab]);

    let onFilterChange = (newTab) => {};
    return (
        <Container fluid={true}>
            <Paper sx={{ width: '100%', padding: '20px' }}>
                <Grid container spacing={0}>
                    <Grid item xs={6} sx={{ marginTop: '10px' }}>
                        <Filter onChange={onFilterChange} />
                    </Grid>
                    <Grid item xs={6}></Grid>
                </Grid>
            </Paper>

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
