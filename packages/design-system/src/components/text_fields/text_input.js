import React, { useState } from "react";
import styles from '../../styles/inputs.module.css';

const TextInput = (data) => {

    const inputField = data.inputState || 'inputField';
    const helperText = data.helperState || 'helper_text';
    const disableStatus = data.disable;
    const placeholderText = data.placeholder || 'Placeholder Text';
    const helperTextCopy = data.helperTextContent;
    const labelText = data.label;
    const isControlled = data.value !== undefined && typeof data.onChange === 'function';

    const [cancelIconState, setCancelIconState] = useState({
            state: false,
            text: ''
        });

    const displayValue = isControlled ? (data.value || '') : cancelIconState.text;

    const checkTextInput = (input) =>{
        if (isControlled) {
            data.onChange(input);
            setCancelIconState(update => ({ ...update, state: input.length > 1, text: input }));
        } else {
            if (input.length <= 1){
                setCancelIconState(update => ({ ...update, state: false, text: input }));
            } else {
                setCancelIconState(update => ({ ...update, state: true, text: input }));
            }
        }
    }

    const clearText = () =>{
        if (isControlled) {
            data.onChange('');
        }
        setCancelIconState(update => ({ ...update, text: '', state: false }));
    }

    const showClearIcon = displayValue.length > 1;

    return(
    <div className={styles.text_default_input}>
    {labelText && <label className={styles[disableStatus ? 'input_label_disable' : 'input_label']}>{labelText}</label>}
    <div className={styles.text_input_container}>

      {/* Input Field */}
      <input type="text" value={displayValue} onChange={(event)=> checkTextInput(event.target.value)} 
      name="name" className={`${styles[`${inputField}`]}`} disabled={disableStatus ? "disabled": ""} placeholder={placeholderText}/>
      
      {/* close Icon */}
      {showClearIcon ? <span className={styles.material_icons}
      onClick={()=>clearText()}
      style={{marginLeft:"-32px", color:"var(--color-text-secondary)", fontSize:"19px", cursor:"pointer"}}>cancel</span>: null}
    </div>
    {helperTextCopy && <span className={`${styles[`${helperText}`]}`}>{helperTextCopy}</span>}
  </div>
    )
}

export default TextInput;
