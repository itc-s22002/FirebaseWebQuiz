import {useState} from "react";
import app from '../FirebaseConfig'
import {collection, doc, getFirestore, updateDoc} from "firebase/firestore";

const firestore = getFirestore(app)

const UpdateData = () => {
    const [dataToUpdate, setDataToUpdate] = useState({ title: '', secAns: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataToUpdate((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdateData = async () => {
        try {
            const { id, newData } = dataToUpdate;

            // Firestoreのコレクション名とドキュメントID
            const collectionName = 'quiz';
            const documentId = id;

            // Firestoreの参照を作成
            const db = getFirestore();
            const docRef = doc(db, collectionName, documentId);

            // ドキュメントの更新
            await updateDoc(docRef, { fieldToUpdate: newData });

            console.log('Data updated successfully!');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div>
            <label>Document ID: </label>
            <input type="text" name="id" onChange={handleInputChange} />

            <label>New Data: </label>
            <input type="text" name="newData" onChange={handleInputChange} />

            <button onClick={handleUpdateData}>Update Data</button>
        </div>
    );
};

export default UpdateData;