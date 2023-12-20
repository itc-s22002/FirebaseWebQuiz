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
    const [count, setCount] = useState(0)
    const [score, setScore] = useState(0)
    const [displayText, setDisplayText] = useState("");
    let choice = []
    const [buttonName, setButtonName] = useState("Start")
    const [checkStart, setCheckStart] = useState(true);


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

    const checkAnswer = (select) => {
        let ans = ""
        setCheckStart(true)
        if (randomData[count].secAnS === select) {
            setScore(score + 10)
            ans = "正解"
        } else {
            ans = "不正解"
        }
        setDisplayText(
            <div>
                <h1 className={styles.title}>{ans}</h1>
                <h2 className={styles.questions}>問{count + 1}解説:{randomData[count].explanation}</h2>
                <h2 className={styles.score}>score:{score}点</h2>
            </div>
        )
    }

    const Questions = () => {
        // console.log(randomData[count])

        setCount(count + 1)
        setCheckStart(false)
        setButtonName("next")

        if (count === 10) {
            console.log("not data")
            //router.push("/startPage").then(r => true)
            setDisplayText(
                <div className={styles.buttons}>
                    <h1 className={styles.title}>{score}点</h1>
                    <button className={styles.button} onClick={() => router.push("/startPage").then(r => true)}>
                        完了
                    </button>
                </div>
            )
        } else {
            choice = (shuffleArray([randomData[count].secAnS, randomData[count].secS, randomData[count].secT, randomData[count].secF]));
            setDisplayText(
                <div>
                    <h1 className={styles.title}>{randomData[count].title}</h1>
                    <h2 className={styles.questions}>問{count + 1}:{randomData[count].question}</h2>
                    <h2 className={styles.score}>score:{score}点</h2>
                    <div className={styles.buttons}>
                        <div>
                            <button onClick={() => checkAnswer(choice[0])}
                                    className={styles.button}>{choice[0]}</button>
                            <button onClick={() => checkAnswer(choice[1])}
                                    className={styles.button}>{choice[1]}</button>

                        </div>
                        <div>
                            <button onClick={() => checkAnswer(choice[2])}
                                    className={styles.button}>{choice[2]}</button>
                            <button onClick={() => checkAnswer(choice[3])}
                                    className={styles.button}>{choice[3]}</button>
                        </div>
                        <button onClick={() => checkAnswer(false)} className={styles.button}>
                            スキップ
                        </button>
                    </div>
                </div>
            )

        }
    }


    return (
        <div>
            <div>{displayText}</div>
            {checkStart ? (
                <div className={styles.buttons}>
                    <button onClick={Questions} className={styles.button}>
                        {buttonName}
                    </button>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default QuestionsPage;