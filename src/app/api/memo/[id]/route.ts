import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, addDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore'
import { UpdateMemoRequest, Memo } from '@/types/memo'

// 記録取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // メモを取得
    const memoDoc = await getDoc(doc(db, 'memos', id))
    
    if (!memoDoc.exists()) {
      return NextResponse.json(
        { error: 'メモが見つかりません' },
        { status: 404 }
      )
    }

    const memoData = memoDoc.data()

    // 履歴を取得
    const historiesQuery = query(
      collection(db, 'memo_histories'),
      where('memoId', '==', id),
      orderBy('createdAt', 'asc')
    )
    const historiesSnapshot = await getDocs(historiesQuery)
    const histories = historiesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        editorName: data.editorName,
        action: data.action,
        changes: data.changes,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
      }
    })

    // レスポンス形式に変換
    const response: Memo = {
      id: memoDoc.id,
      lentByName: memoData.lentByName,
      borrowedByName: memoData.borrowedByName,
      amountOrItem: memoData.amountOrItem,
      loanDate: memoData.loanDate,
      dueDate: memoData.dueDate,
      memo: memoData.memo,
      status: memoData.status,
      createdAt: memoData.createdAt?.toDate?.()?.toISOString() || memoData.createdAt,
      updatedAt: memoData.updatedAt?.toDate?.()?.toISOString() || memoData.updatedAt,
      histories
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 記録更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateMemoRequest = await request.json()

    if (!body.editorName) {
      return NextResponse.json(
        { error: '編集者名が必要です' },
        { status: 400 }
      )
    }

    // 現在のメモを取得（変更履歴用）
    const memoDoc = await getDoc(doc(db, 'memos', id))
    
    if (!memoDoc.exists()) {
      return NextResponse.json(
        { error: 'メモが見つかりません' },
        { status: 404 }
      )
    }

    const currentMemo = memoDoc.data()

    // 変更点を記録
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.lentByName && body.lentByName !== currentMemo.lentByName) {
      changes.lentByName = { from: currentMemo.lentByName, to: body.lentByName }
    }
    if (body.borrowedByName && body.borrowedByName !== currentMemo.borrowedByName) {
      changes.borrowedByName = { from: currentMemo.borrowedByName, to: body.borrowedByName }
    }
    if (body.amountOrItem && body.amountOrItem !== currentMemo.amountOrItem) {
      changes.amountOrItem = { from: currentMemo.amountOrItem, to: body.amountOrItem }
    }
    if (body.loanDate && body.loanDate !== currentMemo.loanDate) {
      changes.loanDate = { from: currentMemo.loanDate, to: body.loanDate }
    }
    if (body.dueDate !== undefined && body.dueDate !== currentMemo.dueDate) {
      changes.dueDate = { from: currentMemo.dueDate, to: body.dueDate }
    }
    if (body.memo !== undefined && body.memo !== currentMemo.memo) {
      changes.memo = { from: currentMemo.memo, to: body.memo }
    }

    // 変更がない場合
    if (Object.keys(changes).length === 0) {
      return NextResponse.json({ message: '変更がありません' })
    }

    // メモを更新
    const updateData: Partial<{ lentByName: string; borrowedByName: string; amountOrItem: string; loanDate: string; dueDate: string | null; memo: string | null; status: string; updatedAt: unknown }> = {}
    if (body.lentByName) updateData.lentByName = body.lentByName
    if (body.borrowedByName) updateData.borrowedByName = body.borrowedByName
    if (body.amountOrItem) updateData.amountOrItem = body.amountOrItem
    if (body.loanDate) updateData.loanDate = body.loanDate
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate
    if (body.memo !== undefined) updateData.memo = body.memo
    if ('status' in body && typeof (body as { status?: string }).status === 'string') updateData.status = (body as { status: string }).status
    updateData.updatedAt = serverTimestamp()

    await updateDoc(doc(db, 'memos', id), updateData)

    // 編集履歴を追加
    try {
      const action = ('status' in body && (body as { status?: string }).status === 'returned') ? 'returned' : 'edited'
      await addDoc(collection(db, 'memo_histories'), {
        memoId: id,
        editorName: body.editorName,
        action: action,
        changes: changes,
        createdAt: serverTimestamp()
      })
    } catch (historyError) {
      console.error('History creation error:', historyError)
    }

    return NextResponse.json({ message: 'メモが更新されました' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}