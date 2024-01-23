import {doc, getFirestore, setDoc} from "firebase/firestore"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import React, {useState, useEffect} from "react";
import app from '../FirebaseConfig'
import {useRouter} from 'next/router';
import Header from "@/components/header";


const firestore = getFirestore(app)
const auth = getAuth(app)


const AddQuiz = () => {
    const [user, setUser] = useState(null);

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
    const [errorMes, setErrorMes] = useState()

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
        //入力項目に埋まっているか確認する
        if (
            quizData.title !== "" &&
            quizData.question !== "" &&
            quizData.secAnS !== "" &&
            quizData.secF !== "" &&
            quizData.secS !== "" &&
            quizData.secT !== "" &&
            quizData.explanation !== ""
        ) {
            console.log(inputGenre)
            try {
                const docRef = doc(firestore, inputGenre, inputValue);
                await setDoc(docRef, quizData)
                setErrorMes("")
                console.log('Document written with Title: ', docRef.id);
                if (user) {
                    console.log('製作者', user.email)
                }
                setQuizData(quizTypeData);
            } catch (error) {
                console.error('Error adding document: ', error);
            }
            setInputValue('')
        } else {
            setErrorMes("入力されていない項目があります")
            console.log("全部入ってねーよバーカ")
        }
    };

    //選んだジャンルをぶち込む
    const handleSelectGenre = (e) => {
        setInputGenre(e.target.value);
    }
    //ログインしているか確認
    if (user) {
        return (
            <>
                <Header/>
                <div className="container">
                    <div className="d-grid gap-2 col-10 mx-auto">
                        <h4 className="mb-3">問題作成</h4>
                        {errorMes ? (
                            <p className="mb-3 text-danger bg-light">{errorMes}</p>)
                            : (
                                <></>
                            )
                        }
                        <div className="mb-3">
                            <label htmlFor="exampleSelect" className="form-label">Select Genre</label>
                            <select className="form-select" id="exampleSelect" value={inputGenre}
                                    onChange={handleSelectGenre}>
                                {genres.map((gen, index) =>
                                    <option key={index} value={gen}>{gen}</option>
                                )}
                            </select>
                        </div>
                        <form className="needs-validation" noValidate="">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label htmlFor="title" className="form-label">タイトル入力</label>
                                    <input type="text" className="form-control" id="title" required=""
                                           value={inputValue} onChange={handleInputChange}/>
                                    <div className="invalid-feedback">
                                        Please enter your shipping address.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="question" className="form-label">問題文入力 </label>
                                    <textarea
                                        className="form-control"
                                        placeholder="問題文を入力してください"
                                        id="question"
                                        style={{height: 100}}
                                        onChange={(e) => setQuizData({...quizData, question: e.target.value})}
                                        value={quizData.question}
                                    />
                                    <div className="invalid-feedback">
                                        Please enter a valid email address for shipping updates.
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="secAns" className="form-label">正答</label>
                                    <input type="text"
                                           className="form-control"
                                           id="secAns"
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="sec1"
                                        onChange={(e) => setQuizData({...quizData, secF: e.target.value})}
                                        value={quizData.secF}
                                    />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="sec2" className="form-label">選択肢２ </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="sec2"
                                        onChange={(e) => setQuizData({...quizData, secS: e.target.value})}
                                        value={quizData.secS}
                                    />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="sec3" className="form-label">選択肢３ </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="sec3"
                                        onChange={(e) => setQuizData({...quizData, secT: e.target.value})}
                                        value={quizData.secT}
                                    />
                                </div>

                                <div className="col-12">
                                    <label htmlFor="explanation" className="form-label">解説入力 </label>
                                    <textarea
                                        className="form-control"
                                        placeholder="解説文を入力してください"
                                        id="explanation"
                                        style={{height: 100}}
                                        onChange={(e) => setQuizData({...quizData, explanation: e.target.value})}
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
                                <button type="button" className="btn btn-light" onClick={addDocumentToFirestore}>作成
                                </button>
                                <button type="button" className="btn btn-light" onClick={routers}>完了</button>
                            </div>
                        </form>
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
            <AddQuiz/>
        </>
    )
}

export default createQuiz