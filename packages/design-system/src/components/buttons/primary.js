import styles from '../../styles/buttons.module.css';

export default function Primary({ disable, children }){
    return(
        <div className={!disable ? styles.button_primary : styles.button_primary_disable}>
            {children || 'Primary'}
        </div>
    )
}
