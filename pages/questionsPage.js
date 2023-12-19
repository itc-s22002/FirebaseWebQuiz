import app from '../FirebaseConfig'
import {getFirestore, getDoc, doc, collection, getDocs} from "firebase/firestore";
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';
import styles from "@/styles/question.module.css";


const firestore = getFirestore(app)

const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const shuffleArray = (array) => {
    // 配列をシャッフルする関数
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const QuestionsPage = () => {
    const [randomData, setRandomData] = useState([]);
    const router = useRouter();
    const [displayText, setDisplayText] = useState('');
    const [count, setCount] = useState(0)
    let choice = []


    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(firestore, 'quiz');
                const snapshot = await getDocs(collectionRef);
                const data = snapshot.docs.map((doc) => doc.data());
                const randomItems = getRandomItems(data, 10);
                setRandomData(randomItems);
                //console.log(randomItems[0].question)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const Questions = () => {
        // console.log(randomData[count])
        setCount(count + 1)

        if(count === 10){
            console.log("not data")
            router.push("/startPage").then(r => true)
        }else {
            choice = (shuffleArray([randomData[count].secAnS,randomData[count].secS,randomData[count].secT,randomData[count].secF]));
            setDisplayText(
                <div>
                    <h1 className={styles.title}>{randomData[count].title}</h1>
                    <h2 className={styles.questions}>問{count}:{randomData[count].question}</h2>
                    <div className={styles.buttons}>
                        <div>
                            <button className={styles.button}>{choice[0]}</button>
                            <button className={styles.button}>{choice[1]}</button>

                        </div>
                        <div>
                            <button className={styles.button}>{choice[2]}</button>
                            <button className={styles.button}>{choice[3]}</button>
                        </div>
                    </div>
                </div>
            )

        }
    }

    return (
        <div>
            <h1>Questions</h1>
            <button onClick={Questions}>
                A
            </button>
            <div>{displayText}</div>
        </div>
    )
}

export default QuestionsPage;