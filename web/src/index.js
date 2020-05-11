import ReactDOM from 'react-dom'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import netlifyIdentity from 'netlify-identity-widget'
import { AuthProvider } from '@redwoodjs/auth'


netlifyIdentity.init()

import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'
import { useAuth } from '@redwoodjs/auth'
import App from './app'

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
     <AuthProvider client={netlifyIdentity} type="netlify">
       <App>
         <Routes/>
         </App>
       {/* <RedwoodProvider useAuth={useAuth}>
         <Routes/>
       </RedwoodProvider> */}
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
