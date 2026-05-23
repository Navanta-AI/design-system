import React, { useState } from "react";
import styles from '../../styles/inputs.module.css';
import { FiPhone } from 'react-icons/fi';

const PhoneInput = (data) =>{

    const inputField = data.inputState || 'inputField';
    const helperText = data.helperState || 'helper_text';
    const disableStatus = data.disable;
    const labelText = data.label;

    const helperTextCopy = data.helperTextContent;

    const [cancelIconState, setCancelIconState] = useState({
            state: false,
            text:""
        });

    const checkTextInput = (input) =>{
        if (input.length <= 1){
            setCancelIconState(update =>{
                return{
                    ...update,
                    state: false,
                    text:input
                }
            });
        }else{
            setCancelIconState(update =>{
                return{
                    ...update,
                    state: true,
                    text:input
                }
            });
        }
    }

    const clearText = () =>{
        setCancelIconState(update =>{
            return{
                ...update,
                text: "",
                state:false
            }
        });
    }

    return(
    <div className={styles.text_default_input}>
    {labelText && <label className={styles[disableStatus ? 'input_label_disable' : 'input_label']}>{labelText}</label>}
    <div className={styles.text_input_container} style={{position:"relative"}}>

        <span style={{position:"absolute", marginLeft:"12px", display:"flex", justifyContent:"space-between", gap:"8px", alignItems:"center"}}><FiPhone style={{width:"18px", height:"18px"}} aria-hidden="true" /> +91 </span>
        {/* Input Field */}
        <input type="tel" value={cancelIconState.text} onChange={(event)=> checkTextInput(event.target.value)} onInput={(event) => event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')}
        name="name" style={{paddingLeft:"72px"}} maxLength="10" pattern="[0-9]" className={`${styles[`${inputField}`]} ${styles[`phoneField`]}`} disabled={disableStatus ? "disabled": ""} placeholder='Phone Number'/>
        
    </div>
    {helperTextCopy && <span className={`${styles[`${helperText}`]}`}>{helperTextCopy}</span>}
  </div>
    )
}

export default PhoneInput;
