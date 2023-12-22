import Image from "next/image";
import question from "/images/question.png"
import styles from "/styles/header.module.css";
import {useRouter} from "next/router";


const Header = ({title}) => {
    const router = useRouter();
    const routers = () => {
        router.push("/startPage").then(r => true)
    }
    return (
        <div className={styles.container}>
            <Image
                src={question}
                alt=""
                width={200}
                height={200}
                onClick={routers}
            />
            <div className={styles.items}>
                <h1 className={styles.title}>{title}</h1>
            </div>
        </div>
    )
}

export default Header