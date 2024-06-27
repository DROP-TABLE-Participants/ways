import '../styles/page-styles/login.scss';

function Login() {
    return (
        <div className="login-container">
            <h1>Вход</h1>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Име</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Парола</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit" className="login-button">Влез</button>
            </form>
        </div>
    );
}

export default Login;
