import React, { useState } from "react";
import styles from '../../styles/inputs.module.css';
import validator from 'validator'

const EmailInput = (data) =>{

    const inputField = data.inputState || 'inputField';
    const helperText = data.helperState || 'helper_text';
    const disableStatus = data.disable;
    const placeholderText = data.placeholder || 'Email Address';
    const helperTextCopy = data.helperTextContent;
    const labelText = data.label;
    const [validateEmail, setValidateEmail] = useState(false);
    const [validaorColor, setValidatorColor] = useState('#a6adb6');

    const checkEmailInput = (input) =>{

        if(validator.isEmail(input)){
            setValidateEmail(true)
        }else if(input.length > 1){
            setValidatorColor("#D73F3F")
        }
        else{
            setValidateEmail(false);
            setValidatorColor("#a6adb6");
        }
    };

    return(
    <div className={styles.text_default_input}>
    {labelText && <label className={styles[disableStatus ? 'input_label_disable' : 'input_label']}>{labelText}</label>}
    <div className={styles.text_input_container}>
        <input type="email" onChange={(input)=> checkEmailInput(input.target.value)} disabled={disableStatus ? "disabled": ""} 
        name="email" className={`${styles[inputField]}`} placeholder={placeholderText}/>
        {validateEmail ? <span className={styles.material_icons} style={{marginLeft:"-32px", color:"#82A874", fontSize:"20px"}}>
        check_circle
        </span> : <span className={styles.material_icons} style={{marginLeft:"-32px", color:`${validaorColor}`, fontSize:"20px"}}>
        alternate_email
        </span>}
        
    </div>
    {helperTextCopy && <span className={`${styles[helperText]}`}>{helperTextCopy}</span>}
    </div>
    )
}

export default EmailInput;
