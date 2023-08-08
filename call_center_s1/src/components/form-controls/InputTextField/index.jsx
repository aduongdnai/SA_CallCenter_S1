import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {TextField} from '@mui/material'
import { Controller } from 'react-hook-form';
InputTextField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
};

function InputTextField(props) {
    const {form,name,label,disabled}=props
    const {value,setValue}=useState()
    const { formState}=form;
    
    let hasError=formState.errors[name] && formState.touchedFields[name]
    return (
        <Controller name={name}
         control={form.control} 
         
         render = {({ field})=> (
            <TextField
                style={{marginTop: '10px'}}
                error={hasError}
                label={label} 
                disabled={disabled}
                helperText={formState.errors[name]?.message}
                fullWidth
                variant='outlined'
                size="small"
                {...field}
                value={value}
            />
        )}
          
         />
            
       
    );
}

export default InputTextField;