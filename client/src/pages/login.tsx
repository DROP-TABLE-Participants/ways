import { useNavigate } from 'react-router-dom';
import '../styles/page-styles/login.scss';

function Login() {
    const navigation = useNavigate();
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        fetch('https://ways-api.azurewebsites.net/api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    navigation('/admin');
                    localStorage.setItem('isLoggedIn', JSON.stringify(true));
                } else {
                    alert('Грешно потребителско име или парола');
                }
            });
    }


    return (
        <div className='login-container'>
            <div className="login-content">
                <h1>Вход</h1>
                <form className="login-form" onSubmit={handleSubmit}>
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
        </div>
    );
}

export default Login;
