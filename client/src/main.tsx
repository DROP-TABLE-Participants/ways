import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const getSession = async () => {
    let response = await fetch('https://ways-api.azurewebsites.net/api/session', {
        credentials: 'include',
         method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
     })
    
    response = await response.json()
    console.log(response)
}

await getSession()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
