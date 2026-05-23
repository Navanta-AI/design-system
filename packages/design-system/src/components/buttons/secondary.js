import styles from '../../styles/buttons.module.css';

export default function Secondary({ disable, children }){
    return(
        <div className={!disable ? styles.button_secondary : styles.button_secondary_disable}>
            {children || 'Secondary'}
        </div>
    )
}
