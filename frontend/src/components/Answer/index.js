import React, { useContext, useEffect, useState } from 'react';

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    MenuItem,
    Select,
    Paper,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import _ from 'lodash';

let Answer = (props) => {
    let { question } = props;
    let [answer, setAnswer] = useState('');
    let [options, setOptions] = useState(question.options);
    let { token } = useContext(AuthContext);
    let [subquestions, setSubQuestions] = useState([]);

    let onChange = (event) => {
        setAnswer(event.target.value);
        setTimeout(() => {
            props.answerChange({
                qid: question.id,
                answer: event.target.value,
            });
        }, 500);
    };

    useEffect(() => {
        if (!['TEXT', 'NUMERICAL'].includes(question.question_type)) {
            options.map((option) => {
                console.log(option.action, answer);
                if (
                    option.action &&
                    answer.toString().split(',').includes(option.id.toString())
                ) {
                    props.addQuestion(option.action);
                }
            });
        }
    }, [answer]);

    useEffect(() => {
        if (!['TEXT', 'NUMERICAL'].includes(question.question_type)) {
            axios
                .get(`/api/survey/question/${question.id}/options`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                .then((response) => setOptions(response.data))
                .catch((err) => console.error(err));
        }
    }, []);

    let renderTextField = () => {
        return (
            <TextField
                name="answer"
                value={answer}
                type={question.question_type == 'TEXT' ? 'text' : 'number'}
                variant="outlined"
                fullWidth
                onChange={onChange}
            />
        );
    };

    let renderDropDown = () => {
        return (
            <FormControl
                variant="outlined"
                sx={{
                    '& .MuiInputBase-root.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.8)',
                        backgroundColor: 'rgba(128, 128, 128, 0.2)',
                    },
                }}
                size="small"
                fullWidth
            >
                <Select
                    labelId="outlined-select-id"
                    value={answer === '' ? 0 : answer}
                    name="question_type"
                    onChange={onChange}
                >
                    <MenuItem value="0" key="0">
                        Select Option
                    </MenuItem>
                    {_.isEmpty(options)
                        ? null
                        : options.map((option) => (
                              <MenuItem value={option.id} key={option.id}>
                                  {option.option}
                              </MenuItem>
                          ))}
                </Select>
            </FormControl>
        );
    };

    let renderCheckBox = () => {
        let isChecked = (id) => {
            id = id.toString();
            return answer.split(',').includes(id);
        };

        let checkboxOnChange = (id, checked) => {
            id = id.toString();

            let answerSplit = answer.split(',');
            if (checked) {
                if (!answerSplit.includes(id)) {
                    answerSplit.push(id);
                }
            } else {
                if (answerSplit.includes(id)) {
                    let index = answerSplit.indexOf(id);
                    answerSplit.splice(index, 1);
                }
            }
            setAnswer(answerSplit.toString());
        };

        return (
            <>
                <FormGroup>
                    {options.map((option) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={(event) =>
                                        checkboxOnChange(
                                            option.id,
                                            event.target.checked
                                        )
                                    }
                                    checked={isChecked(option.id)}
                                />
                            }
                            key={option.id}
                            label={option.option}
                        />
                    ))}
                </FormGroup>
            </>
        );
    };

    let renderRadioButton = () => {
        return (
            <FormControl>
                <RadioGroup value={answer} onChange={onChange}>
                    {options.map((option) => (
                        <FormControlLabel
                            value={option.id}
                            control={<Radio />}
                            label={option.option}
                            key={option.id}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        );
    };

    let getInputField = () => {
        switch (question.question_type) {
            case 'TEXT':
            case 'NUMERIC':
                return renderTextField();
            case 'DROPDOWN':
                return renderDropDown();
            case 'CHECKBOX':
                return renderCheckBox();
            case 'RADIO_BUTTON':
                return renderRadioButton();
        }
    };

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: '10px',
                padding: '10px',
            }}
        >
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Typography variant="h5">{question.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">{question.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {getInputField()}
                </Grid>
            </Grid>
            {subquestions.map((question) => (
                <Answer question={question} />
            ))}
        </Paper>
    );
};

export default Answer;
