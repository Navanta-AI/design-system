import React, { useState } from "react";
import styles from '../../styles/inputs.module.css';

const ScaleInput = (data) =>{

    const inputField = data.inputState || 'inputField';
    const helperText = data.helperState || 'helper_text';
    const disableStatus = data.disable;
    const labelText = data.label;

    const helperTextCopy = data.helperTextContent;

    return(
    <div className={styles.text_default_input}>
    {labelText && <label className={styles[disableStatus ? 'input_label_disable' : 'input_label']}>{labelText}</label>}
    <div className={styles.text_input_container}>

      {/* Input Field */}
      <input type="number" onInput={(event) => event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')}
      name="name" style={{textAlign:"end", paddingRight:"42px"}} className={`${styles[`${inputField}`]}`} disabled={disableStatus ? "disabled": ""} placeholder='0'/>
      
      <span style={{position:"relative" ,right:"42px"}}>/ 100</span>

    </div>
    {helperTextCopy && <span className={`${styles[`${helperText}`]}`}>{helperTextCopy}</span>}
  </div>
    )
}

export default ScaleInput;
