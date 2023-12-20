import {collection, doc, deleteDoc, getFirestore,getDocs} from "firebase/firestore"
import React, {useEffect, useState} from "react";
import app from "../FirebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/quizDelete.module.css'
import {useRouter} from "next/router";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { Modal, Button } from 'react-bootstrap';





const firestore = getFirestore(app)
const auth = getAuth(app)

const DeleteDataPage = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizList, setQuizList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null);


    const routers = () => {
        router.push("/startPage").then(r => true)
    }

    //ページの表示
    const fetchData = async () => {
        const quizCollection = collection(firestore, 'quiz');
        const querySnapshot = await getDocs(quizCollection);
        const quizData = [];
        querySnapshot.forEach((doc) => {
            quizData.push({ id: doc.id, ...doc.data() });
        });
        setQuizList(quizData);
    };

    useEffect(() => {
        fetchData()
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
            // コレクション内のドキュメントを削除
            await deleteDoc(doc(collection(firestore, 'quiz'), `${quizTitle}`));
            console.log( `${quizTitle} Delete completion`)
        } catch (error) {
            console.error('Delete error:', error);
            console.log("incomplete")
        }
        setQuizTitle("")
        fetchData();
        setShowModal(false)

    };

    const SmallModal = () => {
        return (
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{color:"black"}}>削除しますか。</p>
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



    const checkUid = (quiz) =>{
        if(quiz.userId === user.uid) {
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
        }else {
            return <div key={quiz.id}></div>
        }

    }


    const onModal = (selectTitle) => {
        setQuizTitle(selectTitle);
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };
//////////////////////////////////////////////////////////////////////////////////////////////
//     const [showModal2, setShowModal2] = useState(false);
//
//     const SmallModal2 = () => {
//         return (
//             <Modal show={showModal2} onHide={handleCloseModal2} size="sm" centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>小さなモーダル</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p>これは小さなモーダルのコンテンツです。</p>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleDelete}>
//                         削除
//                     </Button>
//                     <Button variant="secondary" onClick={handleCloseModal2}>
//                         閉じる
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         );
//     };
//
//     const handleOpenModal2 = () => {
//         setShowModal2(true);
//     };
//
//     const handleCloseModal2 = () => {
//         setShowModal2(false);
//     };


    return (
        <div className={styles.parentContainer}>
            <h1 className={styles.title}>クイズの消去</h1>
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

                {/*<div>*/}
                {/*    <h1>小さなモーダル</h1>*/}
                {/*    <button onClick={handleOpenModal2}>モーダルを開く</button>*/}
                {/*    <SmallModal2 showModal2={showModal2} handleClose={handleCloseModal2}/>*/}
                {/*</div>*/}

            </ul>
        </div>
    );
};

export default DeleteDataPage;