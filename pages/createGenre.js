import {doc, getFirestore, setDoc} from "firebase/firestore"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import React, {useState, useEffect} from "react";
import app from '../FirebaseConfig'
import styles from "../styles/quizUpPage.module.css"
import {useRouter} from 'next/router';


const firestore = getFirestore(app)
const auth = getAuth(app)

const AddQuiz = () => {
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

        // コンポーネントがアンマウントされるときにunsubscribe
        return () => unsubscribe();
    }, []);

    const quizTypeData = {
        title: "",
        userId:""
    }
    const [quizData, setQuizData] = useState(quizTypeData);
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();
    let quizTitle = ""



    const routers = () => {
        router.push("/startPage").then(r => true)
    }


    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setQuizData({...quizData, title: e.target.value, userId: user.uid})
    };


    const addDocumentToFirestore = async () => {
        if(
            quizData.title !== ""

        ) {
            quizTitle = inputValue
            try {
                const docRef = doc(firestore, "Genre", `${quizTitle}`);
                await setDoc(docRef, quizData)
                console.log('Document written with Title: ', docRef.id);
                if (user) {
                    console.log('製作者', user.email)
                }
                setQuizData(quizTypeData);
            } catch (error) {
                console.error('Error adding document: ', error);
            }
            setInputValue('')
        }else {
            console.log("全部入ってねーよバーカ")
        }
    };
    if (user) {
        return (
            <div className={styles.parentContainer}>
                <h1 className={styles.title}>クイズ作成</h1>
                <div className={styles.items}>
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
    }else {
        return <p>Loading...</p>;
    }
}

const upQuiz = () => {
    return (
        <>
            <AddQuiz/>
        </>
    )
}

export default upQuiz