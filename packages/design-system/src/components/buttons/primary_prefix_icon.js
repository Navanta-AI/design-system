import styles from '../../styles/buttons.module.css';

export default function PrimaryPrefixIcon({ disable, children }){
    return(
        <div className={!disable ? styles.button_primary : styles.button_primary_disable}>
            <span className={styles.material_icons} style={{fontSize:"18px"}}>send</span>
            {children || 'Primary'}
        </div>
    )
}
