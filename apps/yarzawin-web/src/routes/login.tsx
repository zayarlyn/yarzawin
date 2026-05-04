import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '@yarzawin-web/components/ui/input'
import { Button } from '@yarzawin-web/components/ui/button'
import api from '@yarzawin-web/lib/api'

function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (props: { username: string; password: string }) => {
      const { username, password } = props
      return api.post('/auth/login', { username, password })
    },
    onSuccess: () => {
      router.navigate({ to: '/' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ username, password })
  }

  return (
    <div
      className="diary-root min-h-screen flex items-center justify-center p-6"
      style={{
        background: '#f5efe1',
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #d9cfb6 27px, #d9cfb6 28px)',
      }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1
            style={{
              fontFamily: 'var(--d-serif)',
              fontSize: '28px',
              color: '#3d2e1a',
              letterSpacing: '1px',
            }}
          >
            ✦ yarzawin
          </h1>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--d-ink-faint)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            your personal diary
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 rounded-sm p-7"
          style={{
            background: '#ede4d0',
            border: '1px solid #d9cfb6',
            boxShadow: 'var(--d-shadow-md)',
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              style={{
                fontSize: '10px',
                color: 'var(--d-ink-soft)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              style={{ background: '#f5efe1', borderColor: '#d9cfb6' }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              style={{
                fontSize: '10px',
                color: 'var(--d-ink-soft)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{ background: '#f5efe1', borderColor: '#d9cfb6' }}
            />
          </div>

          {isError && <p style={{ fontSize: '11px', color: 'var(--d-accent)', fontStyle: 'italic' }}>Invalid username or password.</p>}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 w-full"
            style={{ background: '#b8651e', color: '#f5efe1', borderRadius: '3px' }}
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
