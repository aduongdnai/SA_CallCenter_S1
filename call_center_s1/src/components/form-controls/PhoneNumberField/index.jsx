import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {TextField} from '@mui/material'
import { Controller } from 'react-hook-form';
PhoneNumberField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
};

function PhoneNumberField(props) {
    const {form,name,label,disabled}=props
    const {value,setValue}=useState()
    const { formState}=form;
    
    let hasError=formState.errors[name] && formState.touchedFields[name]
    const handleChange = (e) => {
        const regex = /^(?:\+?84|0)(?:1\d{9}|3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
          setValue(e.target.value);
          

        }
      };
    return (
        <Controller name={name}
         control={form.control} 
         
         render = {({ field})=> (
            <TextField
                type='number'
                error={hasError}
                label={label} 
                disabled={disabled}
                helperText={formState.errors[name]?.message}
                fullWidth
                size="small"
                onChange={handleChange}
                {...field}
                
            />
        )}
          
         />
            
       
    );
}

export default PhoneNumberField;