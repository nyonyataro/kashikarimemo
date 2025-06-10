'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'

export default function CreatePage() {
  const [formData, setFormData] = useState({
    lentByName: '',
    borrowedByName: '',
    amountOrItem: '',
    memo: ''
  })
  const [loanDate, setLoanDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const requestData = {
        ...formData,
        loanDate: loanDate.toISOString().split('T')[0],
        dueDate: dueDate?.toISOString().split('T')[0] || '',
      }
      console.log('Sending data:', requestData)
      
      const response = await fetch('/api/memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'エラーが発生しました')
      }

      // 作成成功時は記録確認画面にリダイレクト
      router.push(`/memo/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-primary hover:text-primary/80 text-sm">
            ← トップページに戻る
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            貸し借り記録を作成
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>記録の詳細</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/15 border border-destructive/20 text-destructive rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lentByName">
                貸した人 <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                id="lentByName"
                name="lentByName"
                required
                value={formData.lentByName}
                onChange={handleInputChange}
                placeholder="あなたの名前"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="borrowedByName">
                借りた人 <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                id="borrowedByName"
                name="borrowedByName"
                required
                value={formData.borrowedByName}
                onChange={handleInputChange}
                placeholder="借りる人の名前"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountOrItem">
                貸したもの <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                id="amountOrItem"
                name="amountOrItem"
                required
                value={formData.amountOrItem}
                onChange={handleInputChange}
                placeholder="例：5000円、本、ゲーム機など"
              />
            </div>

            <div className="space-y-2">
              <Label>
                貸した日 <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                date={loanDate}
                onDateChange={(date) => setLoanDate(date || new Date())}
                placeholder="貸した日を選択"
              />
            </div>

            <div className="space-y-2">
              <Label>
                返却予定日
              </Label>
              <DatePicker
                date={dueDate}
                onDateChange={setDueDate}
                placeholder="返却予定日を選択（任意）"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">
                メモ
              </Label>
              <Textarea
                id="memo"
                name="memo"
                rows={3}
                value={formData.memo}
                onChange={handleInputChange}
                placeholder="補足情報があれば記入してください"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '作成中...' : '記録を作成'}
            </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}