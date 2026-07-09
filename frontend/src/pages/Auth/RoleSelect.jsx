import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../Auth/AuthLayout'
import { IconUser, IconTruck } from '../../components/common/Icons'
import './RoleSelect.css'

export default function RoleSelect() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const intent = params.get('intent') === 'login' ? 'login' : 'signup'

  return (
    <AuthLayout
      eyebrow="Step 1 of 2"
      title="How will you use Verifyd?"
      subtitle="Choose the account type that matches you. Admins do not sign up here."
    >
      <div className="role-options">
        <button className="role-option" onClick={() => navigate(`/user/${intent}`)}>
          <span className="role-icon"><IconUser /></span>
          <span>
            <p className="role-option-title">I'm a User</p>
            <p className="role-option-text">Browse and use the platform's services</p>
          </span>
        </button>
        <button className="role-option" onClick={() => navigate(`/driver/${intent}`)}>
          <span className="role-icon"><IconTruck /></span>
          <span>
            <p className="role-option-title">I'm a Driver</p>
            <p className="role-option-text">Onboard your vehicle and documents</p>
          </span>
        </button>
      </div>
    </AuthLayout>
  )
}
