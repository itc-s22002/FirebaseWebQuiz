import React, {useEffect, useState} from "react";
import app from '../FirebaseConfig'
import {collection, doc, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/router";
import styles from "@/styles/quizUpPage.module.css";

const firestore = getFirestore(app)
const auth = getAuth(app)

const UpDataQuiz = () => {
    const [user, setUser] = useState(null);

    const genres = [
        "art",
        "foodAndCooking",
        "generalKnowledge",
        "it",
        "literature",
        "quiz",
        "sports"
    ]
    //ログイン情報を持ってくる
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

    const quizTypeData = {
        title: "",
        question: "",
        secAnS: "",
        secF: "",
        secS: "",
        secT: "",
        explanation: "",
        userId: ""
    }


    const [quizData, setQuizData] = useState(quizTypeData);
    const [inputValue, setInputValue] = useState('');
    const [inputGenre, setInputGenre] = useState('art');
    const router = useRouter();

    //モード選択に戻る
    const routers = () => {
        router.push("/selectMode").then(r => true)
    }

    //入力したやつをぶち込む
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setQuizData({...quizData, title: e.target.value, userId: user.uid})
    };

    //登録
    const addDocumentToFirestore = async () => {

        console.log(inputGenre)
        try {
            const docRef = doc(firestore, inputGenre, inputValue);
            await updateDoc(docRef, quizData)
            console.log('Document written with Title: ', docRef.id);

            ////////////////////////////////////////
            // const { id, newData } = dataToUpdate;
            //
            // // Firestoreのコレクション名とドキュメントID
            // const collectionName = 'quiz';
            // const documentId = id;
            //
            // // Firestoreの参照を作成
            // const docRef = doc(firestore, collectionName, documentId);
            //
            // // ドキュメントの更新
            // await updateDoc(docRef, { fieldToUpdate: newData });
            ///////////////////////////////////////

            if (user) {
                console.log('製作者', user.email)
            }
            setQuizData(quizTypeData);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
        setInputValue('')
    };

    //選んだジャンルをぶち込む
    const handleSelectGenre = (e) => {
        setInputGenre(e.target.value);
    }
    if (user) {
        return (
            <div className={styles.parentContainer}>
                <h1 className={styles.title}>クイズ更新</h1>
                <div className={styles.items}>
                    <div className="container mt-5">
                        <label htmlFor="exampleSelect" className="form-label">Select Genre</label>
                        <select className="form-select" id="exampleSelect" value={inputGenre}
                                onChange={handleSelectGenre}>
                            {genres.map((gen, index) =>
                                <option key={index} value={gen}>{gen}</option>
                            )}
                        </select>
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            タイトル入力
                        </label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className={styles.inputForm}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            問題文入力
                        </label>
                        <textarea
                            value={quizData.question}
                            onChange={(e) => setQuizData({...quizData, question: e.target.value})}
                            placeholder="コメントを入力"
                            className={styles.textareaForm}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            正答
                        </label>
                        <input
                            type="text"
                            value={quizData.secAnS}
                            onChange={(e) => setQuizData({...quizData, secAnS: e.target.value})}
                            className={styles.inputForm}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            選択肢1
                        </label>
                        <input
                            type="text"
                            value={quizData.secF}
                            onChange={(e) => setQuizData({...quizData, secF: e.target.value})}
                            className={styles.inputForm}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            選択肢2
                        </label>
                        <input
                            type="text"
                            value={quizData.secS}
                            onChange={(e) => setQuizData({...quizData, secS: e.target.value})}
                            className={styles.inputForm}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            選択肢3
                        </label>
                        <input
                            type="text"
                            value={quizData.secT}
                            onChange={(e) => setQuizData({...quizData, secT: e.target.value})}
                            className={styles.inputForm}
                        />
                    </div>
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            解説文入力
                        </label>
                        <textarea
                            value={quizData.explanation}
                            onChange={(e) => setQuizData({...quizData, explanation: e.target.value})}
                            placeholder="コメントを入力"
                            className={styles.textareaForm}
                        />
                    </div>
                    <div className={styles.buttons}>
                        <div>
                            <button
                                onClick={addDocumentToFirestore}
                                className={styles.button}
                            >
                                作成
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={routers}
                                className={styles.button}
                            >
                                完了
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <p>Loading...</p>;
    }
}

const createQuiz = () => {
    return (
        <>
            <UpDataQuiz/>
        </>
    )
}

export default createQuiz