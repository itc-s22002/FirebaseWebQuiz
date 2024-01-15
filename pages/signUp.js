import React, { useState } from 'react';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import app from '../FirebaseConfig';
import { useRouter } from 'next/router';
import styles from "../styles/login.module.css";
import Header from "@/components/header";

const auth = getAuth(app)

const AddUserPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // FirebaseのcreateUserWithEmailAndPasswordメソッドを使用してユーザーを登録
            await createUserWithEmailAndPassword(auth, email, password);
            await router.push('/login'); // 登録成功後、ログインページにリダイレクト
            console.log("comp")
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div>
            <Header title={"新規登録"}/>
            <div className={styles.content}>
                <form onSubmit={handleRegister}>
                    <div>
                        <p>Email:</p>
                        <input className={styles.input1} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <p>Password:</p>
                        <input className={styles.input2} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className={styles.blueButton}>登録</button>
                </form>
            </div>
        </div>
    );
};

export default AddUserPage;