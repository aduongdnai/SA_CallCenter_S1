import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {TextField} from '@mui/material'
import { Controller } from 'react-hook-form';
InputTextField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValues: PropTypes.string
};

function InputTextField(props) {
    const {form,name,label,disabled,defaultValues}=props
    // const [value,setValue]=useState()
    const { formState}=form;
    
    let hasError=formState.errors[name] && formState.touchedFields[name]
    // const handleInputChange = (event) => {
    //     setValue(event.target.value);
    //   };
    return (
        <Controller 
        name={name}
         control={form.control} 
         
         render = {({ field})=> (
            <TextField
                style={{marginTop: '10px'}}
                error={hasError}
                label={label} 
                
                helperText={formState.errors[name]?.message}
                fullWidth
                variant='outlined'
                size="small"
                {...field}
                
                
               
                
                
            />
        )}
          
         />
            
       
    );
}

export default InputTextField;