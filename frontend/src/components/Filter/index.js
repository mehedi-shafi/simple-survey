import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';

let Filter = (props) => {
    let size = 4;
    let [tab, setTab] = useState(1);

    const idMap = {
        1: 'surveys-all',
        2: 'submissions-all',
        3: 'submissions-my',
    };

    let onChangeHandler = (id) => {
        setTab(id);
        props.onChange(idMap[id]);
    };

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
            <Grid item xs={size}>
                <Button
                    fullWidth
                    variant={tab === 1 ? 'contained' : 'text'}
                    onClick={() => onChangeHandler(1)}
                >
                    All
                </Button>
            </Grid>
            <Grid item xs={size}>
                <Button
                    fullWidth
                    variant={tab === 2 ? 'contained' : 'text'}
                    onClick={() => onChangeHandler(2)}
                >
                    Submissions
                </Button>
            </Grid>
            <Grid item xs={size}>
                <Button
                    fullWidth
                    variant={tab === 3 ? 'contained' : 'text'}
                    onClick={() => onChangeHandler(3)}
                >
                    My Submissions
                </Button>
            </Grid>
        </Grid>
    );
};

export default Filter;
