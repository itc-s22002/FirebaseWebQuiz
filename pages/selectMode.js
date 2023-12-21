import {useRouter} from 'next/router';
import styles from "../styles/selectMode.module.css"



const selectMode = () => {
    const router = useRouter();
    //クイズ作成ページび遷移する
    const routersCreatePage = () => {
        router.push("/quizUpPage").then(r => true)
    }
    //クイズ消去ページに遷移する
    const routersDeletePage = () => {
        router.push("/quizDeletePage").then(r => true)
    }
    //スタートにページに遷移する
    const routersStartPage = () => {
        router.push("/startPage").then(r => true)
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
                    <button onClick={routersStartPage} className={styles.button}>スタートに戻る</button>
                </div>
            </div>
        </div>
    )
}

export default selectMode