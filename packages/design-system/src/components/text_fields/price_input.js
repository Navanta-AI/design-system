import React, { useState } from "react";
import styles from '../../styles/inputs.module.css';

const PriceInput = (data) =>{

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
    <div className={styles.text_input_container}>

        <span className={styles.material_icons} style={{ color:"#3F3C3C", fontSize:"19px", cursor:"pointer", position:"absolute", marginLeft:"12px"}}>
        currency_rupee
        </span>
        
        {/* Input Field */}
        <input type="number" value={cancelIconState.text} onChange={(event)=> checkTextInput(event.target.value)} onInput={(event) => event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')}
        name="name" style={{paddingLeft:"36px"}} className={`${styles[`${inputField}`]}`} disabled={disableStatus ? "disabled": ""} placeholder='Amount'/>

    </div>
    {helperTextCopy && <span className={`${styles[`${helperText}`]}`}>{helperTextCopy}</span>}
  </div>
    )
}

export default PriceInput;
