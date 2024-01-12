import {collection, doc, deleteDoc, getFirestore, getDocs, updateDoc} from "firebase/firestore"
import React, {useEffect, useState} from "react";
import app from "../FirebaseConfig";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashCan} from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/quizDelete.module.css'
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
            const docRef = doc(firestore,inputGenre,quizTitle)
            await updateDoc(docRef, {deleteFlag: 1})

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
                    <Modal.Title></Modal.Title>
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
                <div key={quiz.id} className={styles.item}>
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
        <div className={styles.parentContainer}>
            <Header title={"クイズの消去"}/>
                <div className="container mt-5">
                    <label htmlFor="exampleSelect" className="form-label">Select Genre</label>
                    <select className="form-select" id="exampleSelect" value={inputGenre} onChange={handleSelectGenre}>
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
                    <div>
                        <button
                            onClick={routers}
                            className={styles.button}
                        >
                            完了
                        </button>
                    </div>
                </ul>
        </div>
    );
};

export default DeleteDataPage;