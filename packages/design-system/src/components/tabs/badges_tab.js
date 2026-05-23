import { useState } from 'react';
import styles from '../../styles/tabs.module.css';

export default function BadgesTab(){
    const [tabSelection, setTabSelection] = useState("Primary");
    return(
        <div className={styles.tab_ui}>
            <div className={styles.tab_list}>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("Primary")}}>
                    <span className={tabSelection == "Primary" ? styles.tab_text_selected : styles.tab_text}>
                        Primary <span className={styles.badge_ui}>12+</span>
                    </span>
                    <span className={tabSelection == "Primary" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("Promotion")}}>
                    <span className={tabSelection == "Promotion" ? styles.tab_text_selected : styles.tab_text}>
                        Promotion <span className={styles.badge_ui}>5+</span>
                    </span>
                    <span className={tabSelection == "Promotion" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("Social")}}>
                    <span className={tabSelection == "Social" ? styles.tab_text_selected : styles.tab_text}>
                        Social <span className={styles.badge_ui}>2</span>
                    </span>
                    <span className={tabSelection == "Social" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
            </div>
            <div style={{marginTop:"24px", paddingBottom:"12px"}}>
                <p className={tabSelection == "Primary" ? styles.tab_context_heading : styles.display_none}>Tab Selected: Primary <span className={styles.badge_ui}>12+</span></p>
                <p className={tabSelection == "Promotion" ? styles.tab_context_heading : styles.display_none}>Tab Selected: Promotion <span className={styles.badge_ui}>5+</span> </p>
                <p className={tabSelection == "Social" ? styles.tab_context_heading : styles.display_none}>Tab Selected: Social <span className={styles.badge_ui}>2</span> </p>
            </div>
        </div>
    )
}
