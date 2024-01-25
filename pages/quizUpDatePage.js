import React, {useEffect, useState} from "react";
import app from '../FirebaseConfig'
import {collection, doc, getDocs, getFirestore, setDoc, updateDoc, getDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/router";
import {faPen, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Header from "@/components/header";
import {Button, Modal} from "react-bootstrap";

const firestore = getFirestore(app)
const auth = getAuth(app)

const UpDataQuiz = () => {
    const [user, setUser] = useState(null);
    const [quizList, setQuizList] = useState([]);
    const [inputGenre, setInputGenre] = useState('test');
    const [inputTitle, setInputTitle] = useState('');
    const [quizTitle, setQuizTitle] = useState(null);
    const [errorMes, setErrorMes] = useState()


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
            if (inputTitle) {
                const bookDocRef = doc(firestore, inputGenre, inputTitle);
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

    const quizTypeData = {
        title: inputTitle,
        question: "",
        secAnS: "",
        secF: "",
        secS: "",
        secT: "",
        explanation: "",
        userId: ""

    }

    useEffect(() => {
        fetchQuizData();
    }, [inputTitle]);

    useEffect(() => {
        if (quizTitle) {
            setQuizData({
                question: quizTitle.question,
                secAnS: quizTitle.secAnS,
                secF: quizTitle.secF,
                secS: quizTitle.secS,
                secT: quizTitle.secT,
                explanation: quizTitle.explanation,
            })
        }
    }, [quizTitle])


    const [quizData, setQuizData] = useState(quizTypeData);
    const router = useRouter();


    //モード選択に戻る
    const routers = () => {
        router.push("/selectMode").then(r => true)
    }
    //登録
    const udDataDocumentToFirestore = async () => {
        if (
            quizData.title !== "" &&
            quizData.question !== "" &&
            quizData.secAnS !== "" &&
            quizData.secF !== "" &&
            quizData.secS !== "" &&
            quizData.secT !== "" &&
            quizData.explanation !== ""
        ) {
            try {
                const docRef = doc(firestore, inputGenre, inputTitle);
                await updateDoc(docRef, quizData)
                setErrorMes("")
                console.log('Document written with Title: ', docRef.id);

                if (user) {
                    console.log('製作者', user.email)
                }
                setQuizData(quizTypeData);
            } catch (error) {
                console.error('Error adding document: ', error);
            }
            setInputTitle('')
        } else {
            setErrorMes("入力されていない項目があります")
        }
        handleCloseModal()
    };

    //選んだジャンルをぶち込む
    const handleSelectGenre = (e) => {
        setInputGenre(e.target.value);
    }

    const handleInputChange = (title, uid) => {
        setInputTitle(title);
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

    /// モーダル関係
    const [showModal, setShowModal] = useState(false);

    const onModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }
    const SmallModal = () => {
        const handleCloseModal = () => {
            setShowModal(false);
        };
        return (
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p style={{color: "black"}}>
                            {inputTitle}
                        </p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{color: "black"}}>編集しますか</p>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col" style={{width: 16}}>項目</th>
                            <th scope="col" style={{width: 42}}>編集前</th>
                            <th scope="col" style={{width: 42}}>編集後</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">問題文</th>
                            <td>{quizTitle.question}</td>
                            {quizTitle.question !== quizData.question ? (
                                <td style={{color: "red"}}>{quizData.question}</td>
                            ) : (<td>{quizData.question}</td>)}
                        </tr>
                        <tr>
                            <th scope="row">正答</th>
                            <td>{quizTitle.secAnS}</td>
                            {quizTitle.secAnS !== quizData.secAnS ? (
                                <td style={{color: "red"}}>{quizData.secAnS}</td>
                            ) : (<td>{quizData.secAnS}</td>)}
                        </tr>
                        <tr>
                            <th scope="row">選択肢1</th>
                            <td>{quizTitle.secF}</td>
                            {quizTitle.secF !== quizData.secF ? (
                                <td style={{color: "red"}}>{quizData.secF}</td>
                            ) : (<td>{quizData.secF}</td>)}
                        </tr>
                        <tr>
                            <th scope="row">選択肢2</th>
                            <td>{quizTitle.secS}</td>
                            {quizTitle.secS !== quizData.secS ? (
                                <td style={{color: "red"}}>{quizData.secS}</td>
                            ) : (<td>{quizData.secS}</td>)}
                        </tr>
                        <tr>
                            <th scope="row">選択肢3</th>
                            <td>{quizTitle.secT}</td>
                            {quizTitle.secT !== quizData.secT ? (
                                <td style={{color: "red"}}>{quizData.secT}</td>
                            ) : (<td>{quizData.secT}</td>)}
                        </tr>
                        <tr>
                            <th scope="row">解説</th>
                            <td>{quizTitle.explanation}</td>
                            {quizTitle.explanation !== quizData.explanation ? (
                                <td style={{color: "red"}}>{quizData.explanation}</td>
                            ) : (<td>{quizData.explanation}</td>)}
                        </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={udDataDocumentToFirestore}>
                        編集
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        閉じる
                    </Button>
                </Modal.Footer>
            </Modal>

        );
    };

    ///


    if (user) {
        return (
            <>
                <Header/>
                <div className="container">
                    <div className="d-grid gap-2 col-10 mx-auto">
                        <h4 className="mb-3">問題編集</h4>
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
                        <div>
                            <ul className="list-group">
                                {quizList.map((quiz) => checkUid(quiz))}
                            </ul>
                        </div>
                        {quizTitle ? (
                            <>
                                <form className="needs-validation" noValidate="">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">
                                                変更するクイズ
                                            </label>
                                            <h1>{inputTitle}</h1>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="question" className="form-label">問題文入力</label>
                                            <textarea
                                                className="form-control"
                                                placeholder=""
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
                                                onClick={onModal}
                                                style={{
                                                    height: 75,
                                                    margin: 10,
                                                    fontSize: 20,
                                                    marginLeft: 0,
                                                    width: 50
                                                }}>編集
                                        </button>
                                        <button type="button" className="btn btn-light" onClick={routers}
                                                style={{margin: 10, fontSize: 20, marginRight: 0, width: 50}}>問題設定へ
                                        </button>
                                        <SmallModal showModal={showModal} handleClose={handleCloseModal}/>
                                    </div>
                                </form>
                            </>
                        ) : (<p></p>)}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Header/>
                <div className="container">
                    <div className="text-center" style={{marginTop:50}}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        );
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