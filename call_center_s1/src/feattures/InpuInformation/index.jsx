import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'
import PhoneNumberField from '../../components/form-controls/PhoneNumberField';
import InputTextField from '../../components/form-controls/InputTextField';
import { Button} from '@mui/material';
import {useForm, Controller} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import callAPI from '../../api/callAPI';
import * as mqtt from 'mqtt'


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
        { value:'',   label:'None'}
        
      ]
    const schema = yup
    .object().shape({
        phone_number: yup.string().required('Phone number is required')
        .matches(/^(?:\+?84|0)(?:1\d{9}|3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/, 'Invalid phone number'),
        name:  yup.string().required('Customer name is required').min(4, "At least 4 character"),
        pickup_address:  yup.string().required('Address is required').min(4, "At least 4 character"),
        car_type: yup.object({
            value: yup.string().required("Please select a vehicle"),
         }),
        
    
    })
    const form=useForm({
        defaultValues:{
            phone_number:"",
            name:"",
            pickup_address:"",
            car_type:"",

        },
        resolver:yupResolver(schema)
    })
    const { register, handleSubmit, watch, formState: { errors,touchedFields } ,control,reset} = form;
   
    //connect mqtt broker
    const [client, setClient] = useState(null)
    const [isSubed, setIsSub] = useState(false)
    const [payload, setPayload] = useState({})
    const [connectStatus, setConnectStatus] = useState('Connect')
    const mqttConnect = (host, mqttOption) => {
        setConnectStatus('Connecting');
        setClient(mqtt.connect(host, mqttOption));
        
      };
      useEffect(() => {
        
        if (client) {
           
          client.on('connect', () => {
            setConnectStatus('Connected');
          });
          client.on('error', (err) => {
            console.error('Connection error: ', err);
            console.log('err');
            client.end();
          });
          client.on('reconnect', () => {
            setConnectStatus('Reconnecting');
          });
          client.on('message', (topic, message) => {
            const payload = { topic, message: message.toString() };
            setPayload(payload);
          });
        }
      }, [client]);
      const initialConnectionOptions = {
        // ws or wss
        protocol: 'ws',
        host: 'broker.emqx.io',
        clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
        // ws -> 8083; wss -> 8084
        port: 8083,
        /**
         * By default, EMQX allows clients to connect without authentication.
         * https://docs.emqx.com/en/enterprise/v4.4/advanced/auth.html#anonymous-login
         */
        username: 'emqx_test',
        password: 'emqx_test'
      }
      
      const mqttPublish = (context) => {
        if (client) {
        console.log(context);
          const { topic, qos, payload } = context;
          client.publish(topic, payload, { qos }, error => {
            if (error) {
              console.log('Publish error: ', error);
            }
          });
        }
      }
      const mqttDisconnect = () => {
        if (client) {
          client.end(() => {
            setConnectStatus('Connect');
          });
        }
      }
      const onSubmit = (data) =>{ 
        mqttConnect('ws://broker.emqx.io:8083/mqtt',initialConnectionOptions)
        const car_type=data.car_type
        data.car_type=car_type.value
        const curDate=new Date()
        data.time=curDate.toISOString()
        console.log(data);
        
        //const call=new CallDTO(data.name,data.phone_number,data.pickup_address,data.car_type,data.time)
        // callAPI.add(call)
        
        
        console.log(client);
        console.log(connectStatus);
        const publishContent={
            topic:'testtopic/react',
            qos:0,
            payload: data.phone_number
          }
          setTimeout(mqttPublish, 1500,publishContent);
          
        reset( {
          phone_number:"",
          name:"",
          pickup_address:"",
          car_type:"",

      })
    }
    let SelectHasError=errors['car_type'] && touchedFields['car_type']
    return (
       
        <div>
        <form style={{marginTop: '10px', width:'400px'}} onSubmit={handleSubmit(onSubmit)} 
        defaultValue={ {
            phone_number:"",
            name:"",
            pickup_address:"",
            car_type:"",

        }}> 
            <PhoneNumberField  {...register("phone_number")}  label="Số Điện Thoại" form={form}></PhoneNumberField>
            <InputTextField {...register("name")}  label="Tên Khách Hàng" form={form}></InputTextField>
            <InputTextField {...register("pickup_address")}  label="Địa chỉ đón" form={form}></InputTextField>
            
            <Controller
                {...register("car_type")}
                control={control}
                render={({ field }) => <Select
                errors={SelectHasError}
                helpertext={errors['car_type']?.message}
                 
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