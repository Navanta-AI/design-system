import React, { useState } from "react";
import styles from '../../styles/inputs.module.css';

const PassInput = (data) =>{

    const inputField = data.inputState || 'inputField';
    const helperText = data.helperState || 'helper_text';
    const disableStatus = data.disable;
    const helperTextCopy = data.helperTextContent;
    const labelText = data.label;
    const [checkVisibility, setCheckVisibility] = useState(false);
    const [passwordType, setPasswordType] = useState('password');
    const [passwordStrengthText, setPasswordStrengthText] = useState(helperTextCopy);

    const checkPassInput = (input) =>{
        setPasswordStrengthText(data.helperTextContent);
    };

    const setPasswordVisibility = () =>{
        if(checkVisibility == true){
            setPasswordType("password");
            setCheckVisibility(false)
        }else{
            setPasswordType("text");
            setCheckVisibility(true);
        }
    }

    return(
    <div className={styles.text_default_input}>
    {labelText && <label className={styles[disableStatus ? 'input_label_disable' : 'input_label']}>{labelText}</label>}
    <div className={styles.text_input_container}>
        <input type={passwordType} onChange={(input)=> checkPassInput(input.target.value)} disabled={disableStatus ? "disabled": ""} 
        name="password" className={`${styles[inputField]}`} placeholder='Password'/>
        {checkVisibility ? <span className={styles.material_icons} 
        onClick={()=> setPasswordVisibility()} style={{marginLeft:"-32px", color:"#3F3C3C", fontSize:"18px", cursor:"pointer"}}>
        visibility
        </span> : <span className={styles.material_icons} 
        onClick={()=> setPasswordVisibility()} style={{marginLeft:"-32px", color:"#3F3C3C", fontSize:"18px", cursor:"pointer"}}>
        visibility_off
        </span>}
        
    </div>
    {passwordStrengthText && <span className={`${styles[helperText]}`}>{passwordStrengthText}</span>}
    </div>
    )
}

export default PassInput;
