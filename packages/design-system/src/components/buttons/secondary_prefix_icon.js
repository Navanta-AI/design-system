import styles from '../../styles/buttons.module.css';

export default function SecondaryPrefixIcon({ disable, children }){
    return(
        <div className={!disable ? styles.button_secondary : styles.button_secondary_disable}>
            <span className={styles.material_icons} style={{fontSize:"18px"}}>send</span>
            {children || 'Secondary'}
        </div>
    )
}
