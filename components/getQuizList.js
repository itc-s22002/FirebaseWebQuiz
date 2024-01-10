import {collection, getDocs} from "firebase/firestore";
import {useEffect} from "react";

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
},[inputGenre])

export default