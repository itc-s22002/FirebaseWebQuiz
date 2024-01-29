import app from '../FirebaseConfig'
import {getFirestore, collection, getDocs} from "firebase/firestore";
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';
import Image from "next/image";
import batu from "./../images/mark_batsu.png"
import maru from "./../images/mark_maru.png"
import grade1 from "./../images/grade1_taihenyoku.png"
import grade2 from "./../images/grade2_yokudekimashita.png"
import grade3 from "./../images/grade3_ganbarimashita.png"
import grade4 from "./../images/grade4_mousukoshi.png"
import grade5 from "./../images/grade5_ganbarimasyou.png"
import Header from "@/components/header";


const firestore = getFirestore(app)

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

const QuestionsPage = () => {
    const [quizList, setQuizList] = useState([]);
    const router = useRouter();
    const [count, setCount] = useState(0)
    const [score, setScore] = useState(0)
    const [displayText, setDisplayText] = useState("");
    let choice = []
    const [questionButton, setQuestionButton] = useState("クイズスタート")
    const [checkStart, setCheckStart] = useState(true);
    const [checkGenreVar, setCheckGenreVar] = useState(true);
    const [inputGenre, setInputGenre] = useState('quiz');

    const genres = [
        "test",
        "quiz",
        "foodAndCooking",
        "generalKnowledge",
        "it",
        "literature",
        "art",
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
            ans =
                <>
                    <h1 className="mb-3 text-center" style={{margin: 5, fontSize: 30}}>
                        <Image src={maru} alt="Image" className="m1-2" width={150} height={150}/>
                        <br/>
                        正解
                    </h1>
                </>
        } else {
            ans =
                <>
                    <h1 className="mb-3 text-center" style={{margin: 5, fontSize: 30}}>
                        <Image src={batu} alt="Image" className="m1-2" width={150} height={150}/>
                        <br/>
                        不正解
                    </h1>
                </>
        }
        setDisplayText(
            <div>
                {ans}
                {quizList[count].secAnS === select ? (
                    <h2 className="text-end">score:{score + 10}点</h2>
                ) : (<h2 className="text-end">score:{score}点</h2>)}
                <label htmlFor="example" className="label" style={{fontSize: 30}}>答え</label>
                <h2 className="mb-3"
                    style={{margin: 10, fontSize: 40}}>{quizList[count].secAnS}</h2>
                <hr className="col-12"/>
                <div className="overflow-auto" style={{height: 200}}>
                    <label htmlFor="example" className="label" style={{fontSize: 30}}>解説</label>
                    <p className="mb-3"
                       style={{margin: 10, fontSize: 20}}>{quizList[count].explanation}
                    </p>
                </div>
            </div>
        )
    }

    //要素数チェックし十個ランダムにするやつ
    const getRandomItems = (array, count) => {
        if (array.length < 10) {
            console.log("十個ない")
        } else {
            console.log(array)
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }
    };

    //リロードするやつ、使うかどうかわからん
    const reload = () => {
        window.location.reload();
    }
    //問題を表示するする
    const Questions = () => {
        setCheckGenreVar(false)
        setCount(count + 1)
        setCheckStart(false)
        setQuestionButton("次へ >>")

        //述懐回したらリザルト画面を表示する
        if (count === 10) {
            setDisplayText(
                <div>
                    <p className="mb-3 text-center" style={{margin: 10, fontSize: 40}}>あなたの点数
                    </p>
                    <p className="mb-3 text-center" style={{fontSize: 60}}>{score}点<span
                        style={{fontSize: 30}}>/100点</span><br/>
                        {/*点数ごとに大変良くできましたスタンプのグレードを変える*/}
                        {score === 100 ? (
                            <Image src={grade1} alt="Image" className="mb-3 text-center" width={250} height={250}/>
                        ) : score === 0 ? (
                            <Image src={grade5} alt="Image" className="mb-3 text-center" width={250} height={250}/>
                        ) : score >= 70 ? (
                            <Image src={grade2} alt="Image" className="mb-3 text-center" width={250} height={250}/>
                        ) : score >= 30 ? (
                            <Image src={grade3} alt="Image" className="mb-3 text-center" width={250} height={250}/>
                        ) : (
                            <Image src={grade4} alt="Image" className="mb-3 text-center" width={250} height={250}/>
                        )
                        }</p>
                    <div className="d-grid gap-2 col-10 mx-auto">

                        <button className="btn btn-light"
                                type="button"
                                style={{margin: 10, height: 75, fontSize: 20}}
                                onClick={() => router.push("/startPage").then(r => true)}>
                            スタートページへ
                        </button>
                    </div>
                </div>
            )
        } else {
            //シャッフル関数に選択肢をぶち込んで配列に突っ込む
            choice = (shuffleArray([quizList[count].secAnS, quizList[count].secS, quizList[count].secT, quizList[count].secF]));
            setDisplayText(
                <>
                    {/*<h1 className={styles.title}>{quizList[count].title}</h1>*/}
                    <p className="mb-3 text-center"
                       style={{margin: 10, fontSize: 30}}>問{count + 1}:{quizList[count].question}</p>
                    {/*<h2 className={styles.questions}>問{count + 1}:{quizList[count].question}</h2>*/}
                    <h2 className="text-end">score:{score}点</h2>
                    <div className="w-100 btn-group" role="group" aria-label="Basic outlined example">
                        <button onClick={() => checkAnswer(choice[0])}
                                className="w-50 btn btn-light"
                                type="button"
                                style={{margin: 10, height: 100, fontSize: 23}}>{choice[0]}</button>

                        <button onClick={() => checkAnswer(choice[1])}
                                className="w-50 btn btn-light "
                                type="button"
                                style={{margin: 10, height: 100, fontSize: 23}}>{choice[1]}</button>
                    </div>
                    <div className="w-100 btn-group" role="group" aria-label="Basic outlined example">
                        <button onClick={() => checkAnswer(choice[2])}
                                className="w-50 btn btn-light "
                                type="button"
                                style={{margin: 10, height: 100, fontSize: 23}}>{choice[2]}</button>

                        <button onClick={() => checkAnswer(choice[3])}
                                className="w-50 btn btn-light "
                                type="button"
                                style={{margin: 10, height: 100, fontSize: 23}}>{choice[3]}</button>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto" style={{margin: 10}}>
                        <button onClick={() => checkAnswer(false)} className="btn btn-light"
                                type="button">
                            スキップ
                        </button>
                    </div>
                </>
            )

        }
    }
    //ジャンルをえらんでぶち込む
    const handleSelectGenre = (e) => {
        setInputGenre(e.target.value);
    }
    //ジャンルを選ぶメニュー
    const checkGenreMenu = () => {
        return (
            <div className="mb-3">
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
        <>
            <Header/>
            <div className="container">
                <div className="d-grid gap-2 col-10 mx-auto">
                    <h4 className="mb-3">四択クイズ</h4>
                    <div>{displayText}</div>
                    {/*スタートページか判定し違っていたら何も表示しない*/}
                    {checkStart ? (
                        <div className="mb-3">
                            {checkGenreVar && (
                                <div>{checkGenreMenu()}</div>
                            )}

                            <div className="d-grid gap-2 mx-auto">
                                {quizList ? (
                                    <button
                                        onClick={Questions}
                                        className="btn btn-light"
                                        type="button"
                                        style={{margin: 10, height: 75, fontSize: 20}}
                                    >
                                        {questionButton}
                                    </button>
                                ) : (
                                    <p className="text-center text-danger bg-light">クイズデータがありません</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </>
    )
}

export default QuestionsPage;