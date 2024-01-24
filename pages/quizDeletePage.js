import {collection, doc, deleteDoc, getFirestore, getDocs, updateDoc} from "firebase/firestore"
import React, {useEffect, useState} from "react";
import app from "../FirebaseConfig";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from "next/router";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {Modal, Button} from 'react-bootstrap';
import Header from "@/components/header";


const firestore = getFirestore(app)
const auth = getAuth(app)

const DeleteDataPage = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizList, setQuizList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [inputGenre, setInputGenre] = useState('test');

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

    //ジャンル選択に戻る
    const routers = () => {
        router.push("/selectMode").then(r => true)
    }

    //クイズデータを持ってくる
    const fetchData = async () => {
        try {
            if (inputGenre) {
                console.log("get Api")
                const quizCollection = collection(firestore, inputGenre);
                const querySnapshot = await getDocs(quizCollection);
                const quizData = [];
                querySnapshot.forEach((doc) => {
                    quizData.push({id: doc.id, ...doc.data()});
                });
                setQuizList(quizData);

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //最初にページの表示
    useEffect(() => {
        fetchData()
    }, [inputGenre])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    //消去機能
    const handleDelete = async () => {
        try {
            const docRef = doc(firestore, inputGenre, quizTitle)
            await updateDoc(docRef, {deleteFlag: 1})

            await deleteDoc(doc(collection(firestore, inputGenre), quizTitle));

            console.log(`${quizTitle} Delete completion`)


        } catch (error) {
            console.error('Delete error:', error);
            console.log("incomplete")
        }
        setQuizTitle("")
        fetchData()
        setShowModal(false)

    };

    //選んだジャンルをぶち込む
    const handleSelectGenre = (e) => {
        setInputGenre(e.target.value);
    }

    //モーダル
    const SmallModal = () => {
        return (
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p style={{color: "black"}}>
                            {quizTitle}
                        </p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{color: "black"}}>削除しますか。</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDelete}>
                        削除
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        閉じる
                    </Button>
                </Modal.Footer>
            </Modal>

        );
    };


    //制作者のみ表示する
    const checkUid = (quiz) => {
        if (quiz.userId === user.uid) {
            return (
                <div key={quiz.id}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        {quiz.title}
                        <FontAwesomeIcon
                            icon={faTrashCan}
                            onClick={(e) => onModal(quiz.title)}
                        />
                        <SmallModal showModal={showModal} handleClose={handleCloseModal}/>
                        {/*<SmallModal2 showModal2={showModal2} handleClose={handleCloseModal2}/>*/}
                    </li>
                </div>
            )
        } else {
            return <div key={quiz.id}></div>
        }

    }


    //モーダルを表示し、タイトルをぶち込む
    const onModal = (selectTitle) => {
        setQuizTitle(selectTitle);
        setShowModal(true)
    }
    //モーダルをオフ
    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <>
            <Header title={"クイズの消去"}/>
            <div className="container">
                <div className="d-grid gap-2 col-10 mx-auto">
                    <h4 className="mb-3">問題消去</h4>
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
                </div>
                <div className="d-grid gap-2 col-10 mx-auto">
                    <button
                        onClick={routers}
                        className="btn btn-light"
                        type="button"
                        style={{ marginTop:25,height: 75,fontSize:20}}
                    >
                        問題設定へ
                    </button>
                </div>
            </div>
        </>
    );
};

export default DeleteDataPage;