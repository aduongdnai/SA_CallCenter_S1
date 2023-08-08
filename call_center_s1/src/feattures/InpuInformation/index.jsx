import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import Select from 'react-select'
import PhoneNumberField from '../../components/form-controls/PhoneNumberField';
import InputTextField from '../../components/form-controls/InputTextField';
import { Box, Button, MenuItem,InputLabel, FormControl} from '@mui/material';
import {useForm, Controller} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import callAPI from '../../api/callAPI';


class CallDTO  {
    constructor(name,phone_number,address,car_type,time){
        this.name=name;
        this.phone_number=phone_number;
        this.pickup_address=address;
        this.car_type=car_type;
        this.time=time;
    }
}

InputInformation.propTypes = {
   
};

function InputInformation(props) {
    const options = [
        { value: '1', label: 'Xe hơi' },
        { value: '2', label: 'Xe máy' },
        
      ]
    const schema = yup
    .object().shape({
        phone_number: yup.string().required('Phone number is required')
        .matches(/^(?:\+?84|0)(?:1\d{9}|3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/, 'Invalid phone number'),
        name:  yup.string().required('Customer name is required').min(4, "At least 4 character"),
        pickup_address:  yup.string().required('Address is required').min(4, "At least 4 character"),
    
    })
    const form=useForm({
        defaultValues:{
            phone_number:"0100000000",
            name:"",
            pickup_address:"",

        },
        resolver:yupResolver(schema)
    })
    const { register, handleSubmit, watch, formState: { errors } ,control} = form;
    const onSubmit = (data) =>{ 
        const car_type=data.car_type
        data.car_type=car_type.value
        const curDate=new Date()
        data.time=curDate.toISOString()
        console.log(data);
        
        const call=new CallDTO(data.name,data.phone_number,data.pickup_address,data.car_type,data.time)
        callAPI.add(call)
    }
    
    return (
       
        <div>
        <form style={{marginTop: '10px', width:'400px'}} onSubmit={handleSubmit(onSubmit)}> 
            <PhoneNumberField  {...register("phone_number")}  label="Số Điện Thoại" form={form}></PhoneNumberField>
            <InputTextField {...register("name")}  label="Tên Khách Hàng" form={form}></InputTextField>
            <InputTextField {...register("pickup_address")}  label="Địa chỉ đón" form={form}></InputTextField>
            
            <Controller
                {...register("car_type")}
                control={control}
                render={({ field }) => <Select 
                {...field} 
                options={options}
                styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      marginTop:'10px'
                    }),
                  }} 
                />}
            />
                
                
           
            <Button type='submit' variant="outlined" style={{marginTop:'10px'}}>Submit</Button>
        </form>
       {/* <TextField  id="outlined-basic" label="Số Điện Thoại" variant="outlined">  </TextField><br/>
       <TextField  id="outlined-basic" label="Tên Khách Hàng" variant="outlined"></TextField><br/>
       <TextField  id="outlined-basic" label="Địa chỉ đón" variant="outlined"></TextField><br/>
       <TextField  id="outlined-basic" label="Địa chỉ đến" variant="outlined"></TextField> */}
       </div>
        
        
    );
}

export default InputInformation;