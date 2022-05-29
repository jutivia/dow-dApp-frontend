import React from "react";
import "./Connected.css";

const Connected = (props) => {
  const address = props.address;
  const DOWTokenBalance = props.DOWTokenBalance;
  const networkCoinBalance = props.networkCoinBalance;

  return (
    <ul className="connected">
      <li>{parseFloat(DOWTokenBalance).toFixed(3)} DOW</li>
      <li>{parseFloat(networkCoinBalance).toFixed(3)} BOBA</li>
      <li>
        {address.slice(0, 5)}...
        {address.slice(address.length - 4, address.length)}
      </li>
    </ul>
  );
};

export default Connected;
