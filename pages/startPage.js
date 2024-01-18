import styles from "../styles/startPage.module.css"
import {useRouter} from "next/router";
import Header from "@/components/header";

const StartPage = () => {
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
        <>
            <Header title={"四択クイズ"}/>
            <div className="container">
                <div className="d-grid gap-2 col-6 mx-auto">
                    <button type="button" onClick={routersQuestionModePage} className="btn btn-light" style={{margin:10,height:75,fontSize:20}}>スタート</button>
                    <button type="button" onClick={routersSelectModePage} className="btn btn-light" style={{margin:10,height:75,fontSize:20}}>問題設定</button>
                </div>
            </div>
        </>
    )
}

export default StartPage