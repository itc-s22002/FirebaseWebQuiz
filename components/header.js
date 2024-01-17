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

    const logout = async () => {
        try {
            await auth.signOut();
            console.log('User logged out');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    if (user) {
        return (
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

        );
    } else {
        return (

            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    ログインしろし
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={routersLogin}>ログイン</Dropdown.Item>
                    <Dropdown.Item onClick={routersSinUp}>新規登録</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        );
    }
};

const Header = ({title}) => {
    const router = useRouter();

    const routers = () => {
        router.push("/startPage").then(r => true)
    }

    return (
        <div className="container">
            <header
                className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                    <Image src={question}
                           alt=""
                           width={100}
                           height={100}
                           className="d-inline-block align-text-top"
                           onClick={routers}
                    />
                    <span className="col-12 col-md-auto mb-2 align-items-center mb-md-0 text-white">
                        <p className="fs-4">Q&select4</p>
                    </span>
                </a>
                <div className="text-end">
                    <DropDownList/>
                </div>
            </header>
        </div>

    )
}

export default Header