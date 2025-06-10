'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Memo } from '@/types/memo'

export default function EditMemoPage() {
  const [memo, setMemo] = useState<Memo | null>(null)
  const [formData, setFormData] = useState({
    lentByName: '',
    borrowedByName: '',
    amountOrItem: '',
    loanDate: '',
    dueDate: '',
    memo: '',
    editorName: ''
  })
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    fetchMemo()
  }, [])

  const fetchMemo = async () => {
    try {
      const response = await fetch(`/api/memo/${id}`)
      if (!response.ok) {
        throw new Error('メモが見つかりません')
      }
      const data: Memo = await response.json()
      setMemo(data)
      setFormData({
        lentByName: data.lentByName,
        borrowedByName: data.borrowedByName,
        amountOrItem: data.amountOrItem,
        loanDate: data.loanDate,
        dueDate: data.dueDate || '',
        memo: data.memo || '',
        editorName: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.editorName.trim()) {
      alert('編集者名を入力してください')
      return
    }

    setIsUpdating(true)
    setError('')

    try {
      const response = await fetch(`/api/memo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lentByName: formData.lentByName,
          borrowedByName: formData.borrowedByName,
          amountOrItem: formData.amountOrItem,
          loanDate: formData.loanDate,
          dueDate: formData.dueDate || undefined,
          memo: formData.memo || undefined,
          editorName: formData.editorName.trim()
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'エラーが発生しました')
      }

      alert(result.message)
      router.push(`/memo/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !memo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <h1 className="text-xl font-bold text-red-600 mb-4">エラー</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href={`/memo/${id}`} className="text-blue-600 hover:text-blue-800 text-sm">
            ← 記録に戻る
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            記録を編集
          </h1>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="lentByName" className="block text-sm font-medium text-gray-700">
                貸した人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lentByName"
                name="lentByName"
                required
                value={formData.lentByName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="borrowedByName" className="block text-sm font-medium text-gray-700">
                借りた人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="borrowedByName"
                name="borrowedByName"
                required
                value={formData.borrowedByName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="amountOrItem" className="block text-sm font-medium text-gray-700">
                貸したもの <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="amountOrItem"
                name="amountOrItem"
                required
                value={formData.amountOrItem}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="loanDate" className="block text-sm font-medium text-gray-700">
                貸した日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="loanDate"
                name="loanDate"
                required
                value={formData.loanDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                返却予定日
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                メモ
              </label>
              <textarea
                id="memo"
                name="memo"
                rows={3}
                value={formData.memo}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="editorName" className="block text-sm font-medium text-gray-700">
                編集者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="editorName"
                name="editorName"
                required
                value={formData.editorName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="あなたの名前"
              />
              <p className="mt-1 text-sm text-gray-500">
                変更履歴に記録されます
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? '更新中...' : '更新する'}
              </button>
              
              <Link
                href={`/memo/${id}`}
                className="flex-1 text-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}