import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'
import PhoneNumberField from '../../components/form-controls/PhoneNumberField';
import InputTextField from '../../components/form-controls/InputTextField';
import { Button,Box, Grid, Card,CardHeader,CardContent, Table, TableRow, TableCell} from '@mui/material';
import {useForm, Controller} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import callAPI from '../../api/callAPI';
import userAPI from '../../api/userApi';
import * as mqtt from 'mqtt'
import {formatDate} from '../../utils/util'
import CallAdapter from '../../utils/CallAdapter';




CallCenterS1.propTypes = {
   
};

function CallCenterS1(props) {
    const vehicle_options = [
        { value: '0', label: 'Xe hơi 4 chỗ' },
        { value: '1', label: 'Xe hơi 7 chỗ' },
        { value: '2', label: 'Xe máy' },
        
      ]
    const schema = yup
    .object().shape({
        phone_number: yup.string().required('Phone number is required')
        .matches(/^(?:\+?84|0)(?:1\d{9}|3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/, 'Invalid phone number'),
        name:  yup.string().required('Customer name is required').min(4, "At least 4 character"),
        pickup_address:  yup.string().required('Pickup Address is required').min(4, "At least 4 character"),
        dropoff_address:  yup.string().required('Dropoff Address is required').min(4, "At least 4 character"),
        car_type: yup.object({
            value: yup.string().required("Please select a vehicle"),
         }),
        
    
    })
    const form=useForm({
        defaultValues:{
            phone_number:"",
            name:"",
            pickup_address:"",
            dropoff_address:"",
            car_type:"",

        },
        resolver:yupResolver(schema)
    })
    const { register, handleSubmit, watch, formState: { errors,touchedFields } ,control,reset} = form;
   
    //connect mqtt broker
    const [client, setClient] = useState(null)
    
    useEffect(() => {
      const mqttOptions = {
        clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
        // ws -> 8083; wss -> 8084
        
        /**
         * By default, EMQX allows clients to connect without authentication.
         * https://docs.emqx.com/en/enterprise/v4.4/advanced/auth.html#anonymous-login
         */
        username: 'emqx_test',
        password: 'emqx_test',
        clean: true,
        reconnectPeriod: 1000, // ms
        connectTimeout: 30 * 1000, // ms
      };
  
      const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', mqttOptions);
  
      mqttClient.on('connect', () => {
        console.log('S1 connected to MQTT');
        mqttClient.subscribe('callcenter/exactAddress', { qos: 0 });
      });
  
      mqttClient.on('message', (topic, message) => {
        console.log(`Received message in S2 from topic ${topic}: ${message.toString()}`);
      });
  
      setClient(mqttClient);
  
      return () => {
        mqttClient.end();
      };
    }, []);
     
      
     
      
      
      const mqttPublish = (context) => {
        
        if (client) {
          const { topic, qos, payload } = context;
          client.publish(topic, payload, { qos }, error => {
            if (error) {
              console.log('Publish error: ', error);
            }
          });
        }
      }
    
      const onSubmit = async (data) =>{ 
        
        const car_type=data.car_type
        data.car_type=car_type.value      
        const curDate=new Date()
        data.time=formatDate(curDate)
        data.isComplete=false
        data.lat=0
        data.lng=0
        console.log(data);
        
        
        const result=await callAPI.isAddressExist(data.phone_number,data.pickup_address, data.dropoff_address)
        
        console.log(result);
        if(!result.data){
          console.log('not exist');
          
          
            const publishContent={
              topic:'callcenter/checkingAddress',
              qos:0,
              payload: JSON.stringify({
                phone_number:data.phone_number,
                pickup_address:data.pickup_address,
                dropoff_address:data.dropoff_address
              })
            }
          setTimeout(mqttPublish, 500,publishContent);
        }
        else{
           //gan lai is Complete de khong vao 
           console.log('exist');
           data.isComplete=true
           const result=await callAPI.findGeocode(data.phone_number,data.pickup_address)
          
           console.log("result",result);
           const lat=parseFloat(result.data.lat)
           const lng=parseFloat(result.data.lng)
           console.log(typeof(lat));
           data.lat=lat
           data.lng=lng
           console.log(data);
           const updateUserInformation= await userAPI.update({
            id:"guest75963396",
            nickName: data.phone_number,
            phoneNumber: data.phone_number,
            email: data.phone_number,
            address:data.pickup_address,
            latitude:data.lat,
            longitude:data.lng
           })
           const callAdapter=new CallAdapter(data)
           const bookingData=callAdapter.convertToBooking()
           console.log("Boooking",bookingData);
           
           const context={
            topic:'KTPM/MQTT_SENDING_BOOKING_TOPIC',
            payload:JSON.stringify(bookingData),
            qos:0
           }
           mqttPublish(context)
        }
        callAPI.add(data)
        
        reset( {
          phone_number:"",
          name:"",
          pickup_address:"",
          dropoff_address:"",
          car_type:"",

      })
    }
    let SelectHasError=errors['car_type'] && touchedFields['car_type']
    return (
      <Box>
          <Grid container spacing={2}>
          <Grid item xs={12} >
          
              <Table>
                <TableRow>
                  <TableCell align='center'>
                  <Card sx={{height:500}}>
                  <CardHeader title='Book car'>
                    
                  </CardHeader>
                  <CardContent align='center'>

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
                        <InputTextField {...register("dropoff_address")} label="Địa chỉ đến" form={form}></InputTextField>
                        <Controller
                            {...register("car_type")}
                            control={control}
                            render={({ field }) => <Select
                            errors={SelectHasError}dasadaadsdasd
                            helpertext={errors['car_type']?.message}
                            
                            {...field} 
                            options={vehicle_options}
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
                    </CardContent>
                    </Card>
                  </TableCell>
                </TableRow>
              </Table>             
         
          </Grid>
        </Grid>
      </Box>
       
        
        
    );
}

export default CallCenterS1;