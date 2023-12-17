import {useRouter} from 'next/router';
import styles from "../styles/selectMode.module.css"



const selectMode = () => {
    const router = useRouter();

    const routersCreatePage = () => {
        router.push("/quizUpPage").then(r => true)
    }

    const routersDeletePage = () => {
        router.push("/quizDeletePage").then(r => true)
    }

    const routersStartPage = () => {
        router.push("/")
    }

    return(
        <div>
            <h1 className={styles.title}>
               選んでください
            </h1>
            <div className={styles.buttons}>
                <div>
                    <button onClick={routersCreatePage} className={styles.button}>問題の作成</button>
                </div>
                <div>
                    <button onClick={routersDeletePage} className={styles.button}>問題の削除</button>
                </div>
                <div>
                    <button className={styles.button}>スタートに戻る</button>
                </div>
            </div>
        </div>
    )
}

export default selectMode