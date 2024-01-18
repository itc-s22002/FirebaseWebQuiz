import {useRouter} from 'next/router';
import styles from "../styles/selectMode.module.css"
import Header from "@/components/header";



const selectMode = () => {
    const router = useRouter();
    //クイズ作成ページび遷移する
    const routersCreatePage = () => {
        router.push("/quizCreatePage").then(r => true)
    }
    //クイズ消去ページに遷移する
    const routersDeletePage = () => {
        router.push("/quizDeletePage").then(r => true)
    }

    const routersUpdatePage = () => {
        router.push("/quizUpDatePage").then(r => true)
    }
    //スタートにページに遷移する
    const routersStartPage = () => {
        router.push("/startPage").then(r => true)
    }

    return(
        <>
            <Header title={"問題設定"}/>
            <div className="container">
                <div className="d-grid gap-2 col-6 mx-auto">
                    <button type="button" onClick={routersCreatePage} className="btn btn-light" style={{margin:10,height:75,fontSize:20}}>問題の作成</button>
                    <button type="button" onClick={routersDeletePage} className="btn btn-light" style={{margin:10,height:75,fontSize:20}}>問題の削除</button>
                    <button type="button" onClick={routersUpdatePage} className="btn btn-light" style={{margin:10,height:75,fontSize:20}}>問題の編集</button>
                    <button type="button" onClick={routersStartPage} className="btn btn-light" style={{margin:10,height:75,fontSize:20}}>スタートに戻る</button>
                </div>
            </div>
        </>
    )
}

export default selectMode