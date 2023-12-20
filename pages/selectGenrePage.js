
import { getFirestore, collection, getDocs} from "firebase/firestore"
import React, {useState, useEffect} from "react";
import app from '../FirebaseConfig'

const firestore = getFirestore(app)


//firebaseからデータを取得する
const GetGenre = (randomNumber) => {　// firebaseからデータを持ってくる
    const [genre, setGenre] = useState([]);
    const [selectGenre, setSelectGenre] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const booksCollection = collection(firestore, 'Genre');
            const querySnapshot = await getDocs(booksCollection);


            const bookData = [];
            querySnapshot.forEach((doc) => {
                bookData.push({ id: doc.id, ...doc.data() });
            });

            setGenre(bookData);


        };

        fetchData();
    }, []); // 最初のレンダリング時のみ実行

    return (
        <div>
            {genre.map((genre) =>(
                <div key={genre.id}>
                    <button onClick={() => setSelectGenre(genre.title)}> {genre.title} </button>
                </div>
            ))}
        </div>
    );
};

const ShowGenreList = () =>{
    return(
        <>
            <h1>
                Genre
            </h1>
            <GetGenre />
        </>
    )
}

export default ShowGenreList