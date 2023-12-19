import {collection, doc, deleteDoc, getFirestore,getDocs} from "firebase/firestore"
import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import app from "../FirebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/quizDelete.module.css'
import {useRouter} from "next/router";
import {getAuth, onAuthStateChanged} from "firebase/auth";


const firestore = getFirestore(app)
const auth = getAuth(app)


Modal.setAppElement('#__next');

const DeleteDataPage = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizList, setQuizList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const router = useRouter();

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
        return () => unsubscribe();
    }, []);

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

    //一覧表示
    useEffect(() => {
        fetchData();
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
        setModalOpen(false)
        fetchData();
    };


    const MyModal = ({ isOpen, onClose, children }) => {
        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="My Dialog"
            >
                {children}
                <h2 style={{color: "black"}}>消去しますがよろしいですか？</h2>
                <div>
                    <button onClick={handleDelete}> 消去</button>
                    <button onClick={onClose}>閉じる</button>
                </div>
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
                        <MyModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}/>
                    </li>
                </div>
            )
        }else {
            return <div key={quiz.id}></div>
        }

    }


    const onModal = (selectTitle) => {
        setQuizTitle(selectTitle);
        setModalOpen(true)
    }

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
                </ul>
        </div>
    );
};

export default DeleteDataPage;