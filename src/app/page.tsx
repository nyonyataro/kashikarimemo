import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            かしカリメモ
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            お金・モノの貸し借りを記録する<br />
            軽量Webサービス
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                新しい貸し借り記録を作成
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                貸した人が記録を作成し、借りた人と共有できます
              </p>
            </div>
            
            <Link
              href="/create"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              記録を作成する
            </Link>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          <p>アカウント登録不要・無料でご利用いただけます</p>
        </div>
      </div>
    </div>
  )
}