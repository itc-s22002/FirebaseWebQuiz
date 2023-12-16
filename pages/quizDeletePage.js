import {collection, doc, deleteDoc, getFirestore,getDocs} from "firebase/firestore"
import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import app from "../FirebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/quizDelete.module.css'


const firestore = getFirestore(app)

Modal.setAppElement('#__next');

const DeleteDataPage = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [quizList, setQuizList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

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

    const completionModal = ({ isOpen, onClose}) =>{
        return (
            <Modal isOpen={isOpen} onRequestClose={onClose}>
                消去しました
                <button onClick={onClose}>閉じる</button>
            </Modal>
        );
    }


    const MyModal = ({ isOpen, onClose, children }) => {
        return (
            <Modal isOpen={isOpen} onRequestClose={onClose}>
                {children}
                <button onClick={onClose}>閉じる</button>
            </Modal>
        );
    };

    const onModal = (selectTitle) =>{
        setQuizTitle(selectTitle);
        setModalOpen(true)
    }

    return (
                <div className={styles.parentContainer}>
                    <h1 className={styles.title}>クイズの消去</h1>
                    <ul className="list-group"
                        style={{
                            position:"absolute",
                            left: "50%",
                            transform: "translate(-50%)"
                    }}>
                        {quizList.map((quiz) =>
                            <div key={quiz.id} className={styles.item}>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    {quiz.title}
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        onClick={(e) => onModal(quiz.title)}
                                    />
                                    <MyModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                                        <h2>{quizTitle}を消去しますがよろしいですか？</h2>
                                        <button onClick={handleDelete}> 消去</button>
                                    </MyModal>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>
    );
};

export default DeleteDataPage;