import React, {useEffect, useState} from "react";
import app from '../FirebaseConfig'
import {collection, doc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/router";
import styles from "@/styles/quizUpPage.module.css";
import {faPen} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const firestore = getFirestore(app)
const auth = getAuth(app)

const UpDataQuiz = () => {
    const [user, setUser] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [inputGenre, setInputGenre] = useState('');
    const [inputValue, setInputValue] = useState('');

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
    const fetchData = async () => {
        try {
            if (inputGenre) {
                const quizCollection = collection(firestore, inputGenre);
                const querySnapshot = await getDocs(quizCollection);
                const quizData = [];
                querySnapshot.forEach((doc) => {
                    quizData.push({id: doc.id, ...doc.data()});
                });

                setQuizList(quizData);
                console.log(quizList)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [inputGenre]);

    const quizTypeData = {
        title: inputValue,
        question: "",
        secAnS: "",
        secF: "",
        secS: "",
        secT: "",
        explanation: "",
        userId: ""
    }


    const [quizData, setQuizData] = useState(quizTypeData);
    const router = useRouter();

    //モード選択に戻る
    const routers = () => {
        router.push("/selectMode").then(r => true)
    }
    //登録
    const udDataDocumentToFirestore = async () => {
        try {
            const docRef = doc(firestore, inputGenre, inputValue);
            await updateDoc(docRef, quizData)
            console.log('Document written with Title: ', docRef.id);


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

    const handleInputChange = (title, uid) => {
        setInputValue(title);
        setQuizData({...quizData, title: title, userId: uid})
    };

    const checkUid = (quiz) => {
        if (quiz.userId === user.uid) {
            return (
                <div key={quiz.id} className={styles.item}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        {quiz.title}
                        <FontAwesomeIcon
                            icon={faPen}
                            onClick={(e) => handleInputChange(quiz.title, user.uid)}
                        />
                        {/*<SmallModal2 showModal2={showModal2} handleClose={handleCloseModal2}/>*/}
                    </li>
                </div>
            )
        } else {
            return <div key={quiz.id}></div>
        }

    }

    if (user) {
        return (
            <div className={styles.parentContainer}>
                <h1 className={styles.title}>クイズ更新</h1>
                <div className="container mt-5">
                    <label htmlFor="exampleSelect" className="form-label">Select Genre</label>
                    <select className="form-select" id="exampleSelect" value={inputGenre}
                            onChange={handleSelectGenre}>
                        {genres.map((gen, index) =>
                            <option key={index} value={gen}>{gen}</option>
                        )}
                    </select>
                </div>
                <ul className="list-group"
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translate(-50%)"
                    }}>
                    {quizList.map((quiz) => checkUid(quiz))}
                    <div className={styles.item}>
                        <label className={styles.labelName}>
                            変更するクイズ
                        </label>
                        <h1>{inputValue}</h1>
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
                    {/*<div className={styles.item}>*/}
                    {/*    <button*/}
                    {/*        onClick={routers}*/}
                    {/*        className={styles.button}*/}
                    {/*    >*/}
                    {/*        完了*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    <div className={styles.buttons}>
                        <div>
                            <button
                                onClick={udDataDocumentToFirestore}
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
                </ul>
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