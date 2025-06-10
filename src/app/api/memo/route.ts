import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { CreateMemoRequest } from '@/types/memo'

export async function POST(request: NextRequest) {
  try {
    const body: CreateMemoRequest = await request.json()
    console.log('Received data:', body)
    
    // バリデーション
    if (!body.lentByName || !body.borrowedByName || !body.amountOrItem || !body.loanDate) {
      console.log('Validation failed:', {
        lentByName: body.lentByName,
        borrowedByName: body.borrowedByName,
        amountOrItem: body.amountOrItem,
        loanDate: body.loanDate
      })
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // メモを作成
    const memoData = {
      lentByName: body.lentByName,
      borrowedByName: body.borrowedByName,
      amountOrItem: body.amountOrItem,
      loanDate: body.loanDate,
      dueDate: body.dueDate || null,
      memo: body.memo || null,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const memoRef = await addDoc(collection(db, 'memos'), memoData)

    // 作成履歴を追加
    try {
      await addDoc(collection(db, 'memo_histories'), {
        memoId: memoRef.id,
        editorName: body.lentByName,
        action: 'created',
        changes: null,
        createdAt: serverTimestamp()
      })
    } catch (historyError) {
      console.error('History creation error:', historyError)
      // 履歴の作成に失敗してもメモは返す
    }

    return NextResponse.json({ 
      id: memoRef.id,
      message: 'メモが作成されました'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}