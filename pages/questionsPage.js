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
    const [displayText, setDisplayText] = useState('');
    const [count, setCount] = useState(0)


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

    const routersCreatePage = () => {
        console.log(randomData[count])
        setCount(count + 1)
        if(count === 10){
            console.log("not data")
            router.push("/startPage").then(r => true)
        }else {
            setDisplayText(
                <ul>
                    <li>{randomData[count].title}</li>
                    <li>{randomData[count].question}</li>
                    <li>{randomData[count].secAnS}</li>
                    <li>{randomData[count].secS}</li>
                    <li>{randomData[count].secT}</li>
                    <li>{randomData[count].explanation}</li>
                </ul>
            )


            console.log(randomData[count].title)

        }
    }

    return (
        <div>
            <h1>Questions</h1>
            {/*<button onClick={QuestPage()}>*/}
                {/*{randomData.map((item, index) => (*/}
                {/*))}*/}
            {/*</button>*/}

            <button onClick={routersCreatePage}>
                A
            </button>
            <div>{displayText}</div>
        </div>
    )
}

export default HomePage;