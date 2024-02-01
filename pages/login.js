import React, {useState} from 'react';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import app from '../FirebaseConfig';
import {useRouter} from 'next/router';
import styles from "../styles/login.module.css";
import Header from "@/components/header";

const auth = getAuth(app)

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // FirebaseのsignInWithEmailShowcaseAndPasswordメソッドを使用してログイン
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/startPage').then(r => true); // ログイン成功後、ダッシュボードページに移動
            console.log("Ok")
        } catch (error) {
            console.error('Login error:', error);
        }
        setEmail("")
        setPassword("")
    };

    return (
        <div>
            <Header/>
            <div className={styles.content}>
                <form onSubmit={handleLogin}>
                    <div>
                        <p>Email:</p>
                        <input className={styles.input1} type="email" value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <p>Password:</p>
                        <input className={styles.input2} type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" className={styles.blueButton}>ログイン</button>
                </form>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_API_KEY}</div>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</div>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</div>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}</div>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}</div>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_APP_ID}</div>
                <div>{process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}</div>
            </div>
        </div>
    );
};
export default LoginPage;