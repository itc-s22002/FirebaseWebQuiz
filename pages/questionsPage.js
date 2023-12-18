import app from '../FirebaseConfig'
import {getFirestore, getDoc, doc, collection, getDocs} from "firebase/firestore";
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';


const firestore = getFirestore(app)

const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const HomePage = () => {
    const [randomData, setRandomData] = useState([]);
    const router = useRouter();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(firestore, 'quiz');
                const snapshot = await getDocs(collectionRef);
                const data = snapshot.docs.map((doc) => doc.data());
                const randomItems = getRandomItems(data, 3);
                setRandomData(randomItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <h1>Random Data from Firebase</h1>
            <ul>
                {randomData.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage;