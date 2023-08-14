import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import { Table,TableBody,TableCell,TableContainer,TableHead,TableRow, Paper } from '@mui/material';
NewAddressList.propTypes = {
    newAddressList: PropTypes.array,
    onAddressClick: PropTypes.func,

};
NewAddressList.defaultProps={
    newAddressList:[],
    onAddressClick:null

}
function NewAddressList({ newAddressList, onAddressClick }) {
    const handleAddressClick = (todo) => {
        if (!onAddressClick) return
        onAddressClick(todo)
        console.log(todo);
    }
    return (
        <div>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
           
            <TableCell align="left">Phone Number</TableCell>
            <TableCell align="left">Pickup Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newAddressList.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor:'pointer' }}
            >
              <TableCell align="left"  onClick={() => handleAddressClick(row)}>{row.phone_number}</TableCell>
              <TableCell align="left"  onClick={() => handleAddressClick(row)}>{row.pickup_address}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    );
}

export default NewAddressList;