import {useRouter} from "next/router";
import Header from "@/components/header";
import React, {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../FirebaseConfig"
const auth = getAuth(app)


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

    const [user, setUser] = useState(null);

    useEffect(() => {

        // ログイン状態が変更されたときに呼ばれるコールバック
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        // コンポーネントがアンマウントされるときにunsubscribe
        return () => unsubscribe();
    }, []);

    return (
        <>
            <Header title={"四択クイズ"}/>
            <div className="container">
                <div className="d-grid gap-2 col-10 mx-auto">
                    <h4 className="mb-3">スタートページ</h4>
                    <label>
                        selectMode
                    </label>
                    <button type="button" onClick={routersQuestionModePage} className="btn btn-light"
                            style={{margin: 10, height: 75, fontSize: 20}}>スタート
                    </button>
                    {user ? (
                        <button type="button" onClick={routersSelectModePage} className="btn btn-light"
                                style={{margin: 10, height: 75, fontSize: 20}}>問題設定
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    )
}

export default StartPage