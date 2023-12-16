import {collection, doc, deleteDoc, getFirestore} from "firebase/firestore"
import React, {useState} from "react";
import app from "../FirebaseConfig";

const firestore = getFirestore(app)


const DeleteDataPage = () => {
    const [quizTitle, setQuizTitle] = useState('');

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
    };

    return (
        <div>
            <h1>Delete Quiz Page</h1>
            <div>
                <label>
                    Quiz ID:
                    <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
                </label>
            </div>
            <button onClick={handleDelete}>消去</button>
        </div>
    );
};

export default DeleteDataPage;