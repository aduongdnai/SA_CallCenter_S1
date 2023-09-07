import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import { Table,TableBody,TableCell,TableContainer,TableHead,TableRow, Paper } from '@mui/material';
DriverList.propTypes = {
    driverList: PropTypes.array,
    onDriverClick: PropTypes.func,

};
DriverList.defaultProps={
    driverList:[],
    onDriverClick:null

}
function DriverList({ driverList, onDriverClick }) {
    const handleDriverClick = (driver) => {
        onDriverClick?.(driver)

    }
    return (
        <div>
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
           
            <TableCell align="left">Driver</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {driverList.map((row) => (
            <TableRow
              key={row.nickname}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor:'pointer' }}
            >
              <TableCell align="left"  onClick={() => handleDriverClick(row)}>{row.nickName}</TableCell>
              <TableCell align="left"  onClick={() => handleDriverClick(row)}>{row.status ?? "Inactive"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    );
}

export default DriverList;