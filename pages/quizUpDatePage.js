import React, {useEffect, useState} from "react";
import app from '../FirebaseConfig'
import {collection, doc, getDocs, getFirestore, setDoc, updateDoc, getDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/router";
import styles from "../styles/quizUpPage.module.css";
import {faPen} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Header from "@/components/header";

const firestore = getFirestore(app)
const auth = getAuth(app)

const UpDataQuiz = () => {
    const [user, setUser] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [inputGenre, setInputGenre] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [listOn, setListOn] = useState("")
    const [quizTitle, setQuizTitle] = useState(null);

    const genres = [
        "test",
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

    const fetchQuizData = async () => {
        try {
            if (inputValue) {
                const bookDocRef = doc(firestore, inputGenre, inputValue);
                const querySnapshot = await getDoc(bookDocRef);

                if (querySnapshot.exists()) {
                    setQuizTitle(querySnapshot.data());
                    console.log(quizTitle)
                } else {
                    console.log('Quiz not found');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [inputGenre]);

    useEffect(() => {
        fetchQuizData();
    }, [inputValue]);

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
        setListOn("")
        setInputValue(title);
        setQuizData({...quizData, title: title, userId: uid})
    };

    const checkUid = (quiz) => {
        if (quiz.userId === user.uid) {
            return (
                <div key={quiz.id}>
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
            <>
                <Header/>
                <div className="container">
                    <div className="">
                        {quizTitle ? (
                            <h4 className="mb-3">{quizTitle.question}</h4>
                        ) : (
                            <h4 className="mb-3">no</h4>
                        )}
                        <h4 className="mb-3">問題編集</h4>
                        <div className="mb-3">
                            <label htmlFor="exampleSelect" className="form-label">Select Genre</label>
                            <select className="form-select" id="exampleSelect" value={inputGenre}
                                    onChange={handleSelectGenre}>
                                {genres.map((gen, index) =>
                                    <option key={index} value={gen}>{gen}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <ul className="list-group">
                                {quizList.map((quiz) => checkUid(quiz))}
                            </ul>
                        </div>
                        {quizTitle ? (
                            <>
                                <div className="mb-3">
                                    <label className={styles.labelName}>
                                        変更するクイズ
                                    </label>
                                    <h1>{inputValue}</h1>
                                </div>
                                <form className="needs-validation" noValidate="">
                                    <div className="row g-3">
                                        {/*<div className="col-12">*/}
                                        {/*    <label htmlFor="title" className="form-label">タイトル入力</label>*/}
                                        {/*    <input type="text" className="form-control" id="title" required=""/>*/}
                                        {/*    <div className="invalid-feedback">*/}
                                        {/*        Please enter your shipping address.*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        <div className="col-12">
                                            <label htmlFor="question" className="form-label">問題文入力</label>
                                            <textarea
                                                className="form-control"
                                                placeholder= ""
                                                id="question"
                                                style={{height: 100}}
                                                onChange={(e) => setQuizData({...quizData, question: e.target.value})}
                                                value={quizData.question}

                                            > {quizTitle.question} </textarea>
                                            <div className="invalid-feedback">
                                                Please enter a valid email address for shipping updates.
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="secAns" className="form-label">正答</label>
                                            <input type="text" className="form-control" id="secAns"
                                                   placeholder=""
                                                   required=""
                                                   onChange={(e) => setQuizData({...quizData, secAnS: e.target.value})}
                                                   value={quizData.secAnS}
                                            />
                                            <div className="invalid-feedback">
                                                Please enter your shipping address.
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="sec1" className="form-label">選択肢１ </label>
                                            <input type="text" className="form-control" id="sec1"
                                                   onChange={(e) => setQuizData({...quizData, secF: e.target.value})}
                                                   value={quizData.secF}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="sec2" className="form-label">選択肢２ </label>
                                            <input type="text" className="form-control" id="sec2"
                                                   onChange={(e) => setQuizData({...quizData, secS: e.target.value})}
                                                   value={quizData.secS}/>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="sec3" className="form-label">選択肢３ </label>
                                            <input type="text" className="form-control" id="sec3"
                                                   onChange={(e) => setQuizData({...quizData, secT: e.target.value})}
                                                   value={quizData.secT}/>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="explanation" className="form-label">解説入力 </label>
                                            <textarea
                                                className="form-control"
                                                placeholder="解説文を入力してください"
                                                id="explanation"
                                                style={{height: 100}}
                                                onChange={(e) => setQuizData({
                                                    ...quizData,
                                                    explanation: e.target.value
                                                })}
                                                value={quizData.explanation}
                                            />
                                            <div className="invalid-feedback">
                                                Please enter a valid email address for shipping updates.
                                            </div>
                                        </div>
                                    </div>


                                    <hr className="col-12"/>
                                    <div className="w-100 btn-group" role="group" aria-label="Basic outlined example"
                                         style={{marginBottom: 30}}>
                                        <button type="button" className="btn btn-light"
                                                onChange={udDataDocumentToFirestore}>編集
                                        </button>
                                        <button type="button" className="btn btn-light" onChange={routers}>完了</button>
                                    </div>
                                </form>
                            </>
                        ) : (<p></p>)}
                    </div>
                </div>
            </>
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