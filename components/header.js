import Image from "next/image";
import question from "/images/question.png"
import styles from "/styles/header.module.css";
import {useRouter} from "next/router";
import {Dropdown} from "react-bootstrap";
import app from "../FirebaseConfig"
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";

const auth = getAuth(app)


const DropDownList = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {

        // ログイン状態が変更されたときに呼ばれるコールバック
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        // コンポーネントがアンマウントされるときにunsubscribe
        return () => unsubscribe();
    }, []);

    const router = useRouter();

    const routersLogin = () => {
        router.push("/login").then(r => true)
    }

    const routersSinUp = () => {
        router.push("/signUp").then(r => true)
    }

    const logout = async  () =>{
        try {
            await auth.signOut();
            console.log('User logged out');
        }catch (error){
            console.error('Error logging out:', error);
        }
    }

    if (user) {
        return (
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {user.email}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={routersLogin}>ログイン</Dropdown.Item>
                        <Dropdown.Item onClick={routersSinUp}>新規登録</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>ログアウト</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }else {
        return (
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        ログインしろし
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={routersLogin}>ログイン</Dropdown.Item>
                        <Dropdown.Item onClick={routersSinUp}>新規登録</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
};

const Header = ({title}) => {
    const router = useRouter();

    const routers = () => {
        router.push("/startPage").then(r => true)
    }

    return (
        <div className={styles.spaceBetWeen}>
            <Image
                src={question}
                alt=""
                width={200}
                height={200}
                onClick={routers}
            />
            <div>
                <h1 className={styles.title}>{title}</h1>
            </div>
            <div className={styles.item2}>
                <DropDownList/>
            </div>

        </div>
    )
}

export default Header