'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Memo } from '@/types/memo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MemoPage() {
  const [memo, setMemo] = useState<Memo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [editorName, setEditorName] = useState('')
  const [showActions, setShowActions] = useState(false)
  const params = useParams()
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
      const data = await response.json()
      setMemo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleReturnUpdate = async () => {
    if (!editorName.trim()) {
      alert('名前を入力してください')
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/memo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          editorName: editorName.trim()
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'エラーが発生しました')
      }

      // Update status to returned
      await fetch(`/api/memo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'returned',
          editorName: editorName.trim()
        }),
      })

      alert('返却済みに更新しました')
      await fetchMemo()
      setEditorName('')
      setShowActions(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '貸し出し中'
      case 'returned': return '返却済み'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'returned': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
<div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !memo) {
    return (
<div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
<Card>
            <CardContent className="pt-8">
              <h1 className="text-xl font-bold text-destructive mb-4">エラー</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild>
                <Link href="/">
                  トップページに戻る
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Link href="/" className="text-primary hover:text-primary/80 text-sm">
            ← トップページに戻る
          </Link>
        </div>

        <Card>
          {/* ヘッダー */}
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>貸し借り記録</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(memo.status)}`}>
                {getStatusText(memo.status)}
              </span>
            </div>
          </CardHeader>

          {/* メイン情報 */}
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
<Label className="text-muted-foreground">貸した人</Label>
                <p className="mt-1 text-lg text-foreground">{memo.lentByName}</p>
              </div>
              <div>
<Label className="text-muted-foreground">借りた人</Label>
                <p className="mt-1 text-lg text-foreground">{memo.borrowedByName}</p>
              </div>
              <div className="sm:col-span-2">
<Label className="text-muted-foreground">貸したもの</Label>
                <p className="mt-1 text-lg text-foreground">{memo.amountOrItem}</p>
              </div>
              <div>
<Label className="text-muted-foreground">貸した日</Label>
                <p className="mt-1 text-foreground">{new Date(memo.loanDate).toLocaleDateString('ja-JP')}</p>
              </div>
              {memo.dueDate && (
                <div>
<Label className="text-muted-foreground">返却予定日</Label>
                  <p className="mt-1 text-foreground">{new Date(memo.dueDate).toLocaleDateString('ja-JP')}</p>
                </div>
              )}
              {memo.memo && (
                <div className="sm:col-span-2">
<Label className="text-muted-foreground">メモ</Label>
                  <p className="mt-1 text-foreground whitespace-pre-wrap">{memo.memo}</p>
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="mt-8 space-y-4">
              {memo.status !== 'returned' && (
                <div className="space-y-3">
                  {!showActions ? (
<Button
                      onClick={() => setShowActions(true)}
                      className="w-full" variant="default"
                    >
                      返却済みにする
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
<Label>あなたの名前</Label>
                        <Input
                          type="text"
                          value={editorName}
                          onChange={(e) => setEditorName(e.target.value)}
                          placeholder="名前を入力してください"
                        />
                      </div>
                      
                      <div className="flex gap-2">
<Button
                          onClick={handleReturnUpdate}
                          disabled={isUpdating || !editorName.trim()}
                          className="flex-1"
                        >
                          {isUpdating ? '処理中...' : '返却済みにする'}
                        </Button>
                        
<Button
                          onClick={() => {
                            setShowActions(false)
                            setEditorName('')
                          }}
                          variant="outline"
                        >
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
<Button variant="outline" asChild className="flex-1">
                  <Link href={`/memo/${id}/edit`}>
                    編集する
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = window.location.href
                    navigator.clipboard.writeText(url)
                    alert('リンクをコピーしました')
                  }}
                  className="flex-1"
                >
                  リンクをコピー
                </Button>
              </div>
            </div>
          </CardContent>

          {/* 履歴 */}
          {memo.histories && memo.histories.length > 0 && (
            <div className="border-t bg-muted/50">
              <div className="px-6 py-4">
                <h2 className="text-lg font-medium text-foreground mb-4">変更履歴</h2>
                <div className="space-y-3">
                  {memo.histories.map((history) => (
                    <div key={history.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
<p className="font-medium text-foreground">{history.editorName}</p>
<p className="text-sm text-muted-foreground">
                            {history.action === 'created' && '記録を作成しました'}
                            {history.action === 'edited' && '記録を編集しました'}
                            {history.action === 'returned' && '返却済みにしました'}
                          </p>
                          {history.changes && Object.keys(history.changes).length > 0 && (
<div className="mt-2 text-xs text-muted-foreground">
                              {Object.entries(history.changes).map(([key, change]: [string, { from: unknown; to: unknown }]) => (
                                <div key={key}>
                                  {key}: {String(change.from)} → {String(change.to)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
<span className="text-xs text-muted-foreground">
                          {new Date(history.createdAt).toLocaleString('ja-JP')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
)}
        </Card>
      </div>
    </div>
  )
}