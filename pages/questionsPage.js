import app from '../FirebaseConfig'
import {getFirestore, collection, getDocs} from "firebase/firestore";
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';
import styles from "@/styles/question.module.css";
import Header from "@/components/header";


const firestore = getFirestore(app)

//firebaseのデータを十個ランダムに持ってくるのに使う
const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

//配列を渡してシャッフルする関数
const shuffleArray = (array) => {
    // 配列をシャッフルする関数
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

//メイン
const QuestionsPage = () => {
    const [quizList, setQuizList] = useState([]);
    const router = useRouter();
    const [count, setCount] = useState(0)
    const [score, setScore] = useState(0)
    const [displayText, setDisplayText] = useState("");
    let choice = []
    const [buttonName, setButtonName] = useState("Start")
    const [checkStart, setCheckStart] = useState(true);
    const [checkStart2, setCheckStart2] = useState(true);
    const [inputGenre, setInputGenre] = useState('art');

    const genres = [
        "art",
        "foodAndCooking",
        "generalKnowledge",
        "it",
        "literature",
        "quiz",
        "sports"
    ]

    //firestoreからデータを取得する
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (inputGenre) {
                    const collectionRef = collection(firestore, inputGenre);
                    const snapshot = await getDocs(collectionRef);
                    const data = snapshot.docs.map((doc) => doc.data());
                    const randomItems = getRandomItems(data, 10);
                    setQuizList(randomItems);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [inputGenre]);

    //正解かどうかチェックし解説画面を表示する
    const checkAnswer = (select) => {
        let ans = ""
        setCheckStart(true)
        if (quizList[count].secAnS === select) {
            setScore(score + 10)
            ans = "正解"
        } else {
            ans = "不正解"
        }
        setDisplayText(
            <div>
                <h1 className={styles.title}>{ans}</h1>
                <h2 className={styles.questions}>問{count + 1}解説:{quizList[count].explanation}</h2>
                <h2 className={styles.score}>score:{score}点</h2>

            </div>
        )
    }

    //リロードするやつ、使うかどうかわからん
    const reload = () =>{
        window.location.reload();
    }
    //問題を表示するする
    const Questions = () => {
        setCheckStart2(false)
        setCount(count + 1)
        setCheckStart(false)
        setButtonName("next")

        //述懐回したらリザルト画面を表示する
        if (count === 10) {
            console.log("not data")
            setDisplayText(
                <div className={styles.buttons}>
                    <h1 className={styles.title}>{score}点</h1>
                    <button className={styles.button} onClick={() => router.push("/startPage").then(r => true)}>
                        完了
                    </button>
                </div>
            )
        } else {
            //シャッフル関数に選択肢をぶち込んで配列に突っ込む
            choice = (shuffleArray([quizList[count].secAnS, quizList[count].secS, quizList[count].secT, quizList[count].secF]));
            setDisplayText(
                <div>
                    <h1 className={styles.title}>{quizList[count].title}</h1>
                    <h2 className={styles.questions}>問{count + 1}:{quizList[count].question}</h2>
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

    //スタートに戻るやつ
    const routers = () => {
        router.push("/startPage").then(r => true)
    }

    //ジャンルをえらんでぶち込む
    const handleSelectGenre = (e) => {
        setInputGenre(e.target.value);
    }
    //ジャンルを選ぶメニュー
    const checkGenreMenu = () => {
        return (
            <div className="container mt-5">
                <label htmlFor="exampleSelect" className="form-label">Select Genre</label>
                <select className="form-select" id="exampleSelect" value={inputGenre}
                        onChange={handleSelectGenre}>
                    {genres.map((gen, index) =>
                        <option key={index} value={gen}>{gen}</option>
                    )}
                </select>
            </div>
        )
    }

    return (
        <div>
            <Header title="一問一答"/>
            <div>{displayText}</div>
            {/*スタートページか判定し違っていたら何も表示しない*/}
            {checkStart ? (
                <div className={styles.buttons}>
                    {checkStart2 && (
                        <div>{checkGenreMenu()}</div>
                    )}
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