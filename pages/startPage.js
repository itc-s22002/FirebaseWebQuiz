import styles from "../styles/startPage.module.css"
import {useRouter} from "next/router";
const startPage = () => {
    const router = useRouter();



    const routersSelectModePage = () => {
        router.push("/selectMode").then(r => true)
    }

    return(
        <div>
            <h1 className={styles.title}>
                選んでください
            </h1>
            <div className={styles.buttons}>
                <div>
                    <button className={styles.button}>スタート</button>
                </div>
                <div>
                    <button onClick={routersSelectModePage} className={styles.button}>問題設定</button>
                </div>
            </div>
        </div>
    )
}

export default startPage