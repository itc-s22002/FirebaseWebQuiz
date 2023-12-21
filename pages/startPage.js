import styles from "../styles/startPage.module.css"
import {useRouter} from "next/router";

const startPage = () => {
    const router = useRouter();
    //出題ページに遷移する
    const routersQuestionModePage = () => {
        router.push("/questionsPage").then(r => true)
    }
    //モード選択画面に遷移する
    const routersSelectModePage = () => {
        router.push("/selectMode").then(r => true)
    }

    return (
        <div>
            <h1 className={styles.title}>
                一問一答
            </h1>
            <div className={styles.buttons}>
                <div>
                    <button onClick={routersQuestionModePage} className={styles.button}>スタート</button>
                </div>
                <div>
                    <button onClick={routersSelectModePage} className={styles.button}>問題設定</button>
                </div>
            </div>
        </div>
    )
}

export default startPage