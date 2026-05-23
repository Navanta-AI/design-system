import React, { useRef, useEffect } from 'react';
import styles from '../../styles/inputs.module.css';

const MIN_HEIGHT = 42;
const MAX_HEIGHT = 240;

function adjustHeight(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    textarea.style.height = `${newHeight}px`;
}

const TextArea = (data) => {
    const {
        inputState = 'textarea',
        helperState = 'helper_text',
        helperTextContent,
        placeholder = 'Placeholder',
        disable = false,
        value = '',
        onChange,
        maxLength,
        label: labelText,
    } = data;

    const textareaRef = useRef(null);
    const isControlled = value !== undefined && typeof onChange === 'function';
    const displayValue = isControlled ? (value || '') : '';

    useEffect(() => {
        adjustHeight(textareaRef.current);
    }, [displayValue]);

    const handleChange = (e) => {
        if (onChange) onChange(e.target.value);
        adjustHeight(e.target);
    };

    const fieldClass = inputState === 'inputField_error' ? styles.textarea_error
        : inputState === 'inputField_disable' ? styles.textarea_disable
        : styles.textarea;

    return (
        <div className={styles.text_default_input}>
            {labelText && <label className={styles[disable ? 'input_label_disable' : 'input_label']}>{labelText}</label>}
            <textarea
                ref={textareaRef}
                className={fieldClass}
                value={isControlled ? displayValue : undefined}
                defaultValue={isControlled ? undefined : ''}
                onChange={isControlled ? handleChange : undefined}
                onInput={!isControlled ? (e) => adjustHeight(e.target) : undefined}
                placeholder={placeholder}
                disabled={disable}
                maxLength={maxLength}
                rows={1}
                style={{ minHeight: `${MIN_HEIGHT}px`, maxHeight: `${MAX_HEIGHT}px`, padding:"10px 12px"}}
            />
            {helperTextContent && <span className={styles[helperState]}>{helperTextContent}</span>}
        </div>
    );
};

export default TextArea;
