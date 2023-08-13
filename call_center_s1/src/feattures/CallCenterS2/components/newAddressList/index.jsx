import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'
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
    }
    return (
        <div>
        <ul className='addressList'>
            {newAddressList.map((call) => (
                <li
                    key={call.phone_number}
                    
                    onClick={() => handleAddressClick(call)}
                >
                    {call.pickup_address}</li>
            ))}
        </ul>
    </div>
    );
}

export default NewAddressList;