import { useState } from 'react';
import styles from '../../styles/tabs.module.css';

export default function DefaultTab(){
    const [tabSelection, setTabSelection] = useState("all");
    return(
        <div className={styles.tab_ui}>
            <div className={styles.tab_list}>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("all")}}>
                    <span className={tabSelection == "all" ? styles.tab_text_selected : styles.tab_text}>All</span>
                    <span className={tabSelection == "all" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("related")}}>
                    <span className={tabSelection == "related" ? styles.tab_text_selected : styles.tab_text}>Related</span>
                    <span className={tabSelection == "related" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("recently_uploaded")}}>
                    <span className={tabSelection == "recently_uploaded" ? styles.tab_text_selected : styles.tab_text}>Recently Uploaded</span>
                    <span className={tabSelection == "recently_uploaded" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
                <div className={styles.tab_default} onClick={()=>{setTabSelection("watched")}}>
                    <span className={tabSelection == "watched" ? styles.tab_text_selected : styles.tab_text}>Watched</span>
                    <span className={tabSelection == "watched" ? styles.tab_border_selected : styles.tab_border_default}></span>
                </div>
            </div>
            <div style={{marginTop:"24px", paddingBottom:"12px"}}>
                <p className={`${tabSelection}` == "all" ? styles.tab_context_heading : styles.display_none}>Tab Selected: All </p>
                <p className={`${tabSelection}` == "related" ? styles.tab_context_heading : styles.display_none}>Tab Selected: Related </p>
                <p className={`${tabSelection}` == "recently_uploaded" ? styles.tab_context_heading : styles.display_none}>Tab Selected: Recently Uploaded </p>
                <p className={`${tabSelection}` == "watched" ? styles.tab_context_heading : styles.display_none}>Tab Selected: Watched </p>
            </div>
        </div>
    )
}
