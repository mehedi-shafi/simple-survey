import React, { useContext, useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Switch,
    Button,
    Modal,
} from '@mui/material';
import useStyles from './styles';
import axios from 'axios';
import _ from 'lodash';
import { AuthContext } from '../../contexts/AuthContext';

let Option = (props) => {
    const classes = useStyles();
    let [option, setOption] = useState(props.data);
    let { token } = useContext(AuthContext);

    let [action, setAction] = useState({
        show: false,
        value: null,
    });

    let showModal = () => {
        console.log('OPEN THE SHIT');
        setAction({
            ...action,
            show: true,
        });
    };

    let closeModal = () => {
        setAction({
            ...action,
            show: false,
        });
    };

    let onChangeHandler = (event) => {
        setOption({
            ...option,
            [event.target.name]: event.target.value,
        });
    };

    let saveAction = (question) => {
        console.log(question);
        setOption({
            ...option,
            action: question.id,
        });
        closeModal();
    };

    useEffect(() => {
        if (option.action != null) {
            save();
        }
    }, [option.action]);

    let save = () => {
        console.log(option);
        if (option.id && option.id != null) {
            patch();
        } else {
            axios
                .post(
                    `/api/survey/options/`,
                    { ...option, question: props.qid },
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                )
                .then((response) => {
                    setOption(response.data);
                })
                .catch((err) => console.error(err));
        }
    };

    let patch = () => {
        axios
            .patch(`/api/survey/options/${option.id}/`, option, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => setOption(response.data))
            .catch((err) => console.error(err));
    };

    return (
        <>
            <Modal open={action.show} onClose={closeModal}>
                <Paper className={classes.modalContainer}>
                    <Question
                        enums={props.enums}
                        data={{
                            options: [],
                            title: '',
                            description: '',
                            question_type: 'TEXT',
                            is_required: false,
                            is_active: true,
                            survey: props.surveyId,
                        }}
                        onSave={saveAction}
                    />
                </Paper>
            </Modal>

            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <TextField
                        value={option.option}
                        label="Option"
                        onChange={onChangeHandler}
                        name="option"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    {option.action ? (
                        <Question
                            show
                            data={{
                                id: option.action,
                                options: [],
                                title: '',
                                description: '',
                                question_type: 'TEXT',
                                is_required: false,
                                is_active: true,
                                survey: props.surveyId,
                            }}
                            enums={props.enums}
                        />
                    ) : (
                        <Button
                            onClick={showModal}
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Add Action
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        onClick={save}
                        variant="contained"
                        color="info"
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

let Question = (props) => {
    const classes = useStyles();
    let { enums, surveyId } = props;
    let { token } = useContext(AuthContext);

    let [properties, setProperties] = useState(props.data);
    let [requireSave, setRequireSave] = useState(false);

    useEffect(() => {
        if (props.show && properties.id) {
            axios
                .get(`/api/survey/question/${properties.id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                .then((response) => {
                    setProperties(response.data);
                })
                .catch((err) => console.error(err));
        }
    }, []);

    let onChangeHandler = (event) => {
        setProperties({
            ...properties,
            [event.target.name]: event.target.value,
        });
        if (
            event.target.name === 'question_type' &&
            !['TEXT', 'NUMERIC'].includes(event.target.value) &&
            properties.title !== ''
        ) {
            // TODO: need to by pass empty title issue.
            setRequireSave(true);
        }
    };

    useEffect(() => {
        if (requireSave) {
            save();
        }
    }, [requireSave]);

    let save = () => {
        if (properties.hasOwnProperty('id') && properties.id != null) {
            patch();
        } else {
            axios
                .post('/api/survey/question/', properties, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                .then((response) => {
                    setProperties(response.data);
                    if (props.onSave) {
                        props.onSave(response.data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    let patch = () => {
        axios
            .patch(`/api/survey/question/${properties.id}/`, properties, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                setProperties(response.data);
                if (props.onSave) {
                    props.onSave(response.data);
                }
            })
            .catch((err) => console.error(err));
    };

    let addOption = () => {
        setProperties({
            ...properties,
            options: [...properties.options, { option: '', action: null }],
        });
    };

    let renderOptions = () => {
        if (!properties.hasOwnProperty('id') || properties.id == null) {
            return null;
        }

        return (
            <Paper>
                {properties.options.map((option) => (
                    <Option
                        enums={enums}
                        surveyId={props.surveyId}
                        data={option}
                        qid={properties.id}
                    />
                ))}
                <Button variant="contained" onClick={addOption}>
                    Add Option
                </Button>
            </Paper>
        );
    };

    return (
        <Paper className={classes.questionContainer}>
            <Grid container spacing={0}>
                <Grid item xs={12} sx={{ margin: '5px' }}>
                    <Typography variant="h5">Question</Typography>
                </Grid>
                <Grid item sx={{ margin: '5px' }} xs={12}>
                    <TextField
                        name="title"
                        value={properties.title}
                        onChange={onChangeHandler}
                        label="Title"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sx={{ margin: '5px' }}>
                    <TextField
                        name="description"
                        value={properties.description}
                        onChange={onChangeHandler}
                        label="Description"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sx={{ margin: '5px' }}>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                        size="small"
                        fullWidth
                    >
                        <Select
                            labelId="outlined-select-id"
                            value={
                                properties.question_type === ''
                                    ? 0
                                    : properties.question_type
                            }
                            name="question_type"
                            onChange={onChangeHandler}
                        >
                            <MenuItem value="0" key="0">
                                Select Type
                            </MenuItem>
                            {_.isEmpty(enums)
                                ? null
                                : Object.keys(enums.question_types).map(
                                      (id) => (
                                          <MenuItem value={id} key={id}>
                                              {enums.question_types[id]}
                                          </MenuItem>
                                      )
                                  )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={save}
                    >
                        Save
                    </Button>
                </Grid>

                {!['TEXT', 'NUMERIC'].includes(properties.question_type)
                    ? renderOptions()
                    : null}

                {/* <Grid item xs={3} sx={{ margin: '5px' }}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    name="is_required"
                                    value={properties.is_required}
                                    onChange={onChangeHandler}
                                />
                            }
                            label="Label"
                        />
                    </FormGroup>
                </Grid>
                <Grid item xs={3} sx={{ margin: '5px' }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch />}
                            label="Disabled"
                        />
                    </FormGroup>
                </Grid> */}
            </Grid>
        </Paper>
    );
};

export default Question;
