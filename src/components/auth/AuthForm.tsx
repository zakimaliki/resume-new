'use client'

import React, { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, register } from '@/services/api'

interface AuthFormProps {
  type: 'login' | 'register'
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (type === 'login') {
        const data = await login(formData);

        if (data && data.token) {
          // Store token in localStorage
          try {
            localStorage.setItem('token', data.token);
            // Redirect to dashboard after successful login
            router.push('/dashboard');
          } catch (e) {
            console.error('Failed to store token in localStorage:', e);
            setError('Failed to store authentication token');
          }
        } else if (data && data.error) {
          // API returned an explicit error message
          throw new Error(data.error);
        } else {
          // Handle cases where data or data.token/data.error are unexpected
          console.error('Unexpected login API response:', data);
          throw new Error('Login failed: Invalid response from server');
        }
      } else if (type === 'register') {
        const data = await register(formData);

        if (data && data.error) {
          // API returned an explicit error message
          throw new Error(data.error);
        } else if (data) {
           // Assuming success if no error is returned on register
           setError(''); // Clear any previous error
           // Redirect to login page after successful registration
           router.push('/auth/login');
        } else {
           // Handle unexpected response for register
           console.error('Unexpected register API response:', data);
           throw new Error('Registration failed: Invalid response from server');
        }
      }
    } catch (err) {
      console.error('Auth form submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong during authentication');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    setFormData(prev => ({
      ...prev,
      [input.name]: input.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {type === 'login' ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : null}
              {type === 'login' ? 'Sign in' : 'Register'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {type === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Register here
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in here
                  </Link>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 